@echo off
cd /d "%~dp0"

if not exist node_modules (
    echo [setup] running npm install...
    call npm install
    if errorlevel 1 (
        echo npm install failed.
        pause
        exit /b 1
    )
)

if not exist .env (
    echo .env not found. Copy .env.example to .env and fill in NOTION_TOKEN etc.
    pause
    exit /b 1
)

echo Starting glspinner (port 2222) and dashboard (port 5173)...
echo In VSCode: Simple Browser: Show -^> http://127.0.0.1:5173
echo Press Ctrl+C to stop.
echo.

call npm run dev:all

pause
