@echo off
set "ROOT=%~dp0.."
set "NODEDIR=%ROOT%\.tools\node-v24.18.0-win-x64"
set "PATH=%NODEDIR%;%PATH%"
cd /d "%ROOT%"
"%NODEDIR%\npm.cmd" %*
