@echo off
cd /d "%~dp0"

echo Step 1: Setting remote...
git remote set-url origin https://github.com/lovesewater/linfairwool.git

echo Step 2: Adding files...
git add .

echo Step 3: Committing...
git commit -m "V30 update"

echo Step 4: Setting Git proxy globally...
git config --global http.proxy http://127.0.0.1:10809
git config --global https.proxy http://127.0.0.1:10809

echo Step 5: Pushing...
git push -u origin main

if %errorlevel%==0 (
    echo.
    echo ====== SUCCESS! ======
    echo.
) else (
    echo.
    echo Trying port 1080...
    git config --global http.proxy http://127.0.0.1:1080
    git config --global https.proxy http://127.0.0.1:1080
    git push -u origin main
    if %errorlevel%==0 goto success
    echo.
    echo Trying port 7890...
    git config --global http.proxy http://127.0.0.1:7890
    git config --global https.proxy http://127.0.0.1:7890
    git push -u origin main
    if %errorlevel%==0 goto success
    echo.
    echo ====== FAILED ======
    echo.
    echo Your v2rayN proxy port is not 10809, 1080, or 7890.
    echo.
    echo Please check your v2rayN port:
    echo 1. Open v2rayN
    echo 2. Go to Settings - Parameter Settings
    echo 3. Look for "Local Port" number
    echo 4. Tell me the number, I will update the script
    goto end
)

:success
echo.
echo ====== SUCCESS! ======
echo.
echo Now go to Cloudflare and connect the repo.

:end
git config --global --unset http.proxy
git config --global --unset https.proxy
pause
