@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
title Control de Servicio de Audio Liturgico (Google TTS)

:menu
cls
echo ==================================================================
echo   CONTROL DEL SERVICIO DE AUDIO LITURGICO (GOOGLE TTS - 40kbps)
echo ==================================================================
echo.

:: Comprobar estado actual en el puerto 4000
netstat -ano | findstr ":4000" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [ESTADO]: ENCENDIDO / ACTIVO (Puerto 4000 HTTP y 4001 HTTPS)
) else (
    echo   [ESTADO]: APAGADO / DETENIDO
)
echo.
echo ==================================================================
echo   [1] Iniciar servicio (dejar corriendo en ventana visible)
echo   [2] Reiniciar servicio (apagar actual y volver a encender)
echo   [3] Parar servicio (detener y liberar puertos 4000 y 4001)
echo   [4] Status (verificar conexion en tiempo real)
echo   [5] Salir
echo ==================================================================
echo.
set /p opcion="Seleccione una opcion (1-5): "

if "%opcion%"=="1" goto iniciar
if "%opcion%"=="2" goto reiniciar
if "%opcion%"=="3" goto parar
if "%opcion%"=="4" goto status
if "%opcion%"=="5" goto fin

echo.
echo Opcion no valida.
timeout /t 2 >nul
goto menu

:parar
echo.
echo Deteniendo procesos del servicio en puerto 4000 / 4001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4001" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
wmic process where "CommandLine like '%%servicio_audio.js%%' and not CommandLine like '%%wmic%%'" call terminate >nul 2>&1
timeout /t 1 >nul
echo [OK] Servicio detenido correctamente.
timeout /t 2 >nul
goto menu

:iniciar
echo.
netstat -ano | findstr ":4000" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [AVISO] El servicio ya esta encendido en el puerto 4000.
    timeout /t 2 >nul
    goto menu
)
echo Iniciando servicio_audio.js en una ventana visible dedicada...
start "Servicio Audio Liturgico (Google TTS 40k)" cmd /k "title Servicio Audio Liturgico (Google TTS 40k) && cd /d "%~dp0" && node "%~dp0servicio_audio.js""
timeout /t 2 >nul
goto menu

:reiniciar
echo.
echo Reiniciando servicio de audio...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4001" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
wmic process where "CommandLine like '%%servicio_audio.js%%' and not CommandLine like '%%wmic%%'" call terminate >nul 2>&1
timeout /t 1 >nul
echo Iniciando nuevamente el servicio...
start "Servicio Audio Liturgico (Google TTS 40k)" cmd /k "title Servicio Audio Liturgico (Google TTS 40k) && cd /d "%~dp0" && node "%~dp0servicio_audio.js""
timeout /t 2 >nul
goto menu

:status
echo.
echo Consultando http://127.0.0.1:4000/status ...
powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://127.0.0.1:4000/status' -TimeoutSec 3; Write-Host '[OK] SERVICIO ACTIVO Y EN LINEA:' -ForegroundColor Green; Write-Host ($r | ConvertTo-Json) -ForegroundColor Cyan } catch { Write-Host '[OFFLINE] El servicio no responde o esta apagado.' -ForegroundColor Red }"
echo.
pause
goto menu

:fin
exit /b 0
