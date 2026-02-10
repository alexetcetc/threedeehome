#!/usr/bin/env python3
"""
Local server for 3D Home library.

Serves HTML from current directory and data from ~/Documents/threedeehome.

Usage:
    python server.py
    # Then open http://localhost:8000
"""

import json
import subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

PORT = 8080
ASSETS_DIR = Path.home() / "Documents" / "threedeehome"
SCRIPTS_DIR = ASSETS_DIR / "scripts"
ARRANGEMENT_FILE = ASSETS_DIR / "arrangement.json"


class LibraryHandler(SimpleHTTPRequestHandler):
    """Handle static files and arrangement API."""

    def do_GET(self):
        """Serve data files from Documents folder."""
        # Serve data files from Documents/threedeehome
        if self.path.startswith("/library.json"):
            self._serve_file(ASSETS_DIR / "hardcover_library.json", "application/json")
        elif self.path.startswith("/arrangement.json"):
            self._serve_file(ARRANGEMENT_FILE, "application/json")
        elif self.path.startswith("/models/"):
            model_path = ASSETS_DIR / self.path.lstrip("/")
            self._serve_file(model_path)
        elif self.path.startswith("/audio/"):
            audio_path = ASSETS_DIR / self.path.lstrip("/")
            self._serve_file(audio_path, "audio/mpeg")
        else:
            # Serve HTML and other files from current directory
            super().do_GET()

    def _serve_file(self, path: Path, content_type: str = None):
        """Serve a file from the given path."""
        if path.exists():
            self.send_response(200)
            if content_type:
                self.send_header("Content-Type", content_type)
            self.end_headers()
            self.wfile.write(path.read_bytes())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(f"File not found: {path}".encode())

    def do_POST(self):
        """Handle POST requests."""
        if self.path == "/api/save":
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)

            try:
                data = json.loads(body)
                ARRANGEMENT_FILE.write_text(json.dumps(data, indent=2))

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status": "saved"}')
                print(f"Saved arrangement ({len(data.get('assignments', {}))} books assigned)")

            except json.JSONDecodeError as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(f'{{"error": "{str(e)}"}}'.encode())

        elif self.path == "/api/refresh":
            # Run Hardcover export script
            print("Refreshing from Hardcover...")
            try:
                result = subprocess.run(
                    ["python3", str(SCRIPTS_DIR / "hardcover_export.py")],
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                if result.returncode == 0:
                    # Extract book count from output
                    lines = result.stdout.strip().split("\n")
                    count_line = [l for l in lines if "Found" in l]
                    count = count_line[0] if count_line else "Refreshed"
                    print(f"Refresh complete: {count}")

                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(f'{{"status": "ok", "message": "{count}"}}'.encode())
                else:
                    print(f"Refresh failed: {result.stderr}")
                    self.send_response(500)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(b'{"status": "error", "message": "Export failed"}')
            except subprocess.TimeoutExpired:
                self.send_response(504)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status": "error", "message": "Timeout"}')

        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        """Quieter logging - only show important stuff."""
        # Show POST requests, errors, and library requests
        msg = str(args[0]) if args else ""
        if "POST" in msg or "404" in msg or "library" in msg or "Error" in format:
            super().log_message(format, *args)


def main():
    print(f"Assets directory: {ASSETS_DIR}")
    library_file = ASSETS_DIR / "hardcover_library.json"
    if library_file.exists():
        import json
        books = json.loads(library_file.read_text())
        print(f"Library: {len(books)} books loaded")
    else:
        print(f"WARNING: No library file at {library_file}")
        print("Run: ./start.sh --refresh")

    server = HTTPServer(("localhost", PORT), LibraryHandler)
    print(f"Server running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop")
    print()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")


if __name__ == "__main__":
    main()
