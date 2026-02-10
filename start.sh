#!/bin/bash
# Launch 3D Library
#
# Usage:
#   ./start.sh           # Just launch the library
#   ./start.sh --refresh # Sync from Hardcover first, then launch

cd "$(dirname "$0")"

DATA_DIR="$HOME/Documents/threedeehome"
SCRIPTS_DIR="$DATA_DIR/scripts"

# Handle --refresh flag
if [[ "$1" == "--refresh" ]]; then
    echo "Syncing from Hardcover..."
    python3 "$SCRIPTS_DIR/hardcover_export.py"
    echo ""
fi

# Kill any existing processes on our port
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Open browser after short delay
(sleep 1 && open "http://localhost:8080") &

# Start server (blocks until Ctrl+C)
python3 server.py
