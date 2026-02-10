# 3D Library Project

## Piranesi Hall - Statue Preferences

**Interaction pattern:**
- Statues have invisible trigger spheres (`<a-sphere class="trigger" visible="false">`) for raycasting
- When looking at a statue, only show the **journal popup at the bottom** of the screen
- **No floating labels** above statues - Alex doesn't want text hovering over the models
- Journal popup displays: statue name (bold) + description from `data-name` and `data-description` attributes

**Statue structure:**
```html
<a-entity class="statue" id="statue-id" position="x y z"
          data-name="Statue Name"
          data-description="Evocative description in Piranesi style.">
  <a-sphere class="trigger" position="0 1.5 0" radius="1.5" visible="false"></a-sphere>
  <a-entity gltf-model="#model-id" position="0 0 0"></a-entity>
</a-entity>
```

**Model storage:** GLTF files go in `/Users/alex/Documents/threedeehome/models/` (symlinked to repo)

**Statue generation:** See `/Users/alex/Documents/threedeehome/statues.md` for prompts, progress tracking, and generation settings (MEDIUM detail preferred)

---

## Asset Storage

**Store all assets (3D models, textures, audio) in:**
```
/Users/alex/Documents/threedeehome/
```

**NOT in the github repo.** The `models/` folder in this repo is a symlink to Documents.

This keeps the git repo small and avoids committing large binary files.

## Structure

**GitHub repo** (`~/github/threedeehome/`):
- `index.html` - Main library room with bookshelves
- `piranesi.html` - "The House" room inspired by Piranesi novel
- `statue_review.html` - Comparison room for statue detail levels
- `server.py` - Local HTTP server
- `start.sh` - Launch script

**Data folder** (`~/Documents/threedeehome/`):
- `kindle_library.json` - Book data (main source)
- `hardcover_library.json` - Exported Hardcover data
- `arrangement.json` - Book arrangement state
- `models/` - 3D model files (GLTF)
- `scripts/` - Python scripts:
  - `fetch_kindle_library.py` - Scrape Kindle library via Playwright
  - `hardcover_import.py` - Import books to Hardcover
  - `hardcover_export.py` - Export books from Hardcover
- `docs/` - Documentation:
  - `hardcover_api.md` - Hardcover API reference
  - `statues.md` - Statue generation prompts/progress

## Running

```bash
./start.sh              # Launch library
./start.sh --refresh    # Sync from Hardcover first, then launch
```

## Book Data Flow

**Hardcover is the authoritative source.**

1. Manage books on hardcover.app (add, rate, update status)
2. `./start.sh --refresh` exports from Hardcover → `hardcover_library.json`
3. 3D library displays books from `hardcover_library.json`

**Optional:** Use `fetch_kindle_library.py` to discover new Kindle books, then manually add them to Hardcover.
