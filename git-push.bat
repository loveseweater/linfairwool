@echo off
cd /d "%~dp0"

echo Setting remote...
git remote set-url origin https://github.com/lovesewater/linfairwool.git

echo Adding files...
git add .

echo Committing...
git commit -m "V30 update"

echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo SUCCESS! Cloudflare will auto-deploy.
) else (
    echo FAILED. Check your network.
)
pause
