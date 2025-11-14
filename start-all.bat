@echo off
REM Windows start-all.bat - iterates ports and starts services
set ROOT=%~dp0
cd /d %ROOT%
if not exist logs mkdir logs

:try_snapshot
for /L %%p in (4000,1,4020) do (
  netstat -ano ^| findstr /R ":%%p" >nul 2>&1 || (
    echo Starting puppeteer-proxy on %%p
    start "puppet" cmd /c "set PORT=%%p&& node puppeteer-proxy.js > logs\puppeteer-%%p.log 2>&1"
    goto started_snapshot
  )
)
echo No port available for snapshot
goto end
:started_snapshot

:try_api
for /L %%p in (4100,1,4120) do (
  netstat -ano ^| findstr /R ":%%p" >nul 2>&1 || (
    echo Starting api-proxy on %%p
    start "api" cmd /c "set PORT=%%p&& node api-proxy.js > logs\api-%%p.log 2>&1"
    goto started_api
  )
)
echo No port available for api
goto end
:started_api
start python -m http.server 5500

echo Services started. Open http://localhost:5500/index.html
:end
