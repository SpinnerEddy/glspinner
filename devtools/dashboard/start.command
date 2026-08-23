#!/bin/bash
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
    echo "[setup] running npm install..."
    npm install || { echo "npm install failed."; read -p "Press Enter to close..."; exit 1; }
fi

if [ ! -f .env ]; then
    echo ".env not found. Copy .env.example to .env and fill in NOTION_TOKEN etc."
    read -p "Press Enter to close..."
    exit 1
fi

echo "Starting glspinner (port 2222) and dashboard (port 5173)..."
echo "In VSCode: Simple Browser: Show -> http://127.0.0.1:5173"
echo "Press Ctrl+C to stop."
echo ""

npm run dev:all

read -p "Press Enter to close..."
