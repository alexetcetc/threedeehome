#!/usr/bin/env python3
"""
Fetch Kindle library from read.amazon.com using Playwright.

First run: Opens browser for you to log in, saves session via persistent profile.
Future runs: Uses saved profile, can run headless.

Usage:
    python fetch_kindle_library.py          # Interactive first time, then headless
    python fetch_kindle_library.py --head   # Force headed mode (for debugging)
    python fetch_kindle_library.py --clean  # Clear saved session and re-login
"""

import argparse
import json
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# Paths
SCRIPT_DIR = Path(__file__).parent
ASSETS_DIR = Path.home() / "Documents" / "threedeehome"
BROWSER_PROFILE = ASSETS_DIR / ".browser_profile"
OUTPUT_FILE = SCRIPT_DIR / "kindle_library.json"

KINDLE_URL = "https://read.amazon.com/kindle-library"


def has_session() -> bool:
    """Check if we have a saved browser profile."""
    return BROWSER_PROFILE.exists() and any(BROWSER_PROFILE.iterdir())


def clear_session() -> None:
    """Clear the saved browser profile."""
    if BROWSER_PROFILE.exists():
        shutil.rmtree(BROWSER_PROFILE)
        print("Cleared saved browser profile.")


def wait_for_login(page) -> bool:
    """Wait for user to complete login. Returns True if successful."""
    print("\n" + "=" * 50)
    print("Please log in to Amazon in the browser window.")
    print("Waiting for library to load...")
    print("=" * 50 + "\n")

    try:
        # Wait for library to appear (indicates successful login)
        page.wait_for_selector("#library", timeout=120000)  # 2 min timeout
        return True
    except PlaywrightTimeout:
        print("Timeout waiting for login. Please try again.")
        return False


def scroll_to_load_all_books(page) -> None:
    """Scroll the library container to load all books."""
    print("Scrolling to load all books...")

    page.evaluate("""
        async () => {
            const container = document.querySelector('#library');
            if (!container) return;

            let lastHeight = 0;
            let attempts = 0;
            const maxAttempts = 50;  // Safety limit

            while (attempts < maxAttempts) {
                const currentHeight = container.scrollHeight;
                if (currentHeight === lastHeight) break;

                lastHeight = currentHeight;
                container.scrollTo(0, lastHeight);
                await new Promise(r => setTimeout(r, 500));
                attempts++;
            }
        }
    """)

    # Extra wait for any final lazy-loaded content
    page.wait_for_timeout(1000)


def extract_books(page) -> list[dict]:
    """Extract book data from the loaded library."""
    books = page.evaluate("""
        () => {
            const items = document.querySelectorAll('li[id^="library-item-option-"]');
            const books = [];

            for (const item of items) {
                // Extract ASIN from id (handle both regular and sample items)
                const id = item.id;
                let asin = '';

                if (id.includes('sample-main-')) {
                    asin = id.replace('library-item-option-sample-main-', '');
                } else {
                    asin = id.replace('library-item-option-', '');
                }

                if (!asin) continue;

                // Get title
                const titleEl = item.querySelector('[id^="title-"] p');
                const title = titleEl ? titleEl.textContent.trim() : '';

                // Get author
                const authorEl = item.querySelector('[id^="author-"] p');
                const author = authorEl ? authorEl.textContent.trim() : '';

                // Check if it's a sample
                const isSample = id.includes('sample');

                if (title) {
                    books.push({ asin, title, author, isSample });
                }
            }

            return books;
        }
    """)
    return books


def fetch_library(headless: bool = True) -> list[dict]:
    """Main function to fetch the Kindle library."""
    have_session = has_session()

    # Only run headless if we have a saved session
    run_headless = headless and have_session

    with sync_playwright() as p:
        # Use persistent context to maintain login across runs
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(BROWSER_PROFILE),
            headless=run_headless,
        )

        page = context.pages[0] if context.pages else context.new_page()
        page.goto(KINDLE_URL)

        # Check if we need to log in
        try:
            page.wait_for_selector("#library", timeout=10000)
            print("Library loaded!")
        except PlaywrightTimeout:
            # Need to log in
            if run_headless:
                # Session expired, need interactive login
                print("Session expired. Restarting in headed mode...")
                context.close()
                return fetch_library(headless=False)

            if not wait_for_login(page):
                context.close()
                return []

        # Load all books
        scroll_to_load_all_books(page)

        # Extract book data
        books = extract_books(page)
        print(f"Found {len(books)} books")

        context.close()
        return books


def main():
    parser = argparse.ArgumentParser(description="Fetch Kindle library")
    parser.add_argument("--head", action="store_true", help="Run in headed mode")
    parser.add_argument("--clean", action="store_true", help="Clear session and re-login")
    args = parser.parse_args()

    if args.clean:
        clear_session()

    books = fetch_library(headless=not args.head)

    if books:
        OUTPUT_FILE.write_text(json.dumps(books, indent=2))
        print(f"\nSaved {len(books)} books to {OUTPUT_FILE}")

        # Preview
        print("\nFirst 5 books:")
        for book in books[:5]:
            print(f"  - {book['title']} by {book['author']}")
    else:
        print("No books found.")


if __name__ == "__main__":
    main()
