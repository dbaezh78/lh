@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title Generador de Audio Litúrgico (Voz de Google) - Liturgia de las Horas

:: Si se le pasan archivos o argumentos, procesa los archivos con Google TTS directamente a MP3
if not "%~1"=="" (
    node "%~dp0scripts\servicio_audio.js" %*
    goto fin
)

:: Si no se le pasan argumentos, inicia el servicio local de audio para descargas directas desde la web
echo ==================================================================
echo  INICIANDO SERVICIO LOCAL DE SÍNTESIS LITÚRGICA CON VOZ DE GOOGLE
echo ==================================================================
echo.
echo Este servicio permite generar y descargar archivos MP3 con la voz de
echo Google directamente al hacer doble clic en el reloj de salterios.html.
echo.
echo Presione Ctrl+C en cualquier momento para detenerlo.
echo ==================================================================
echo.
node "%~dp0scripts\servicio_audio.js"

:fin
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Ocurrió un problema durante la ejecución. Asegúrese de tener Node.js instalado.
    pause
)
