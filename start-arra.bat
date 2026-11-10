@echo off
setlocal

cd /d "%~dp0website"
if errorlevel 1 (
  echo Could not open the website folder next to this .bat file.
  goto :fail
)

echo.
echo === ARRA site manager ===
echo Folder: %CD%
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed or not in PATH.
  echo Install LTS from https://nodejs.org/ then reboot and try again.
  goto :fail
)

echo Node version:
node -v
echo npm version:
call npm -v
echo.

if not exist "node_modules\" (
  echo Installing dependencies... this can take several minutes.
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    goto :fail
  )
)

if not exist ".env.local" (
  echo Missing website\.env.local
  echo Copy .env.example to .env.local and fill in ADMIN_PASSWORD / FTP settings.
  goto :fail
)

echo Starting local server... Keep this window open.
echo Browser should open the admin page when ready.
echo.

node scripts\launch.mjs
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%EXIT_CODE%"=="0" (
  echo start-arra stopped with error code %EXIT_CODE%.
) else (
  echo Server stopped.
)
goto :end

:fail
set "EXIT_CODE=1"

:end
echo.
echo Press any key to close this window.
pause >nul
exit /b %EXIT_CODE%
