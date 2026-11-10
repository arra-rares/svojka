@echo off
setlocal

cd /d "%~dp0website"

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo Node.js is not installed.
  echo Install it from https://nodejs.org/ and run this file again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

if not exist ".env.local" (
  echo.
  echo Missing website\.env.local
  echo Copy .env.example to .env.local and fill in your passwords.
  echo.
  pause
  exit /b 1
)

echo.
echo Starting local server... Keep this window open.
echo.

node scripts\launch.mjs
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo.
  echo start-arra failed with code %EXIT_CODE%.
  echo Read the messages above, then press any key to close.
  echo.
  pause
  exit /b %EXIT_CODE%
)
