@echo off
cd /d "%~dp0"

git remote set-url origin https://github.com/lovesewater/linfairwool.git
git add .
git commit -m "V30 update"

echo.
echo ========================================
echo  Trying to push to GitHub...
echo  If this fails, your VPN needs to be
echo  set to GLOBAL mode (not bypass China)
echo ========================================
echo.

git -c http.proxy=http://127.0.0.1:10809 push -u origin main
if %errorlevel%==0 goto success
git -c http.proxy=http://127.0.0.1:1080 push -u origin main
if %errorlevel%==0 goto success
git -c http.proxy=http://127.0.0.1:7890 push -u origin main
if %errorlevel%==0 goto success
git push -u origin main
if %errorlevel%==0 goto success

echo.
echo FAILED.
echo.
echo Solution: Set your VPN to GLOBAL mode, then try again.
echo Or manually type: git push -u origin main
goto end

:success
echo.
echo ========================================
echo  SUCCESS! Cloudflare will auto-deploy.
echo  Wait 1-2 minutes, then refresh your site.
echo ========================================

:end
pause
