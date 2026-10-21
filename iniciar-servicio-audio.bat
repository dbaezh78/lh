@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title Servicio de Audio Litúrgico Google TTS - Liturgia de las Horas

echo ==================================================================
echo  SERVICIO LOCAL DE AUDIO LITÚRGICO (GOOGLE TTS -> MP3)
echo ==================================================================
echo.
echo Puerto: http://127.0.0.1:4000
echo.
echo Mantén esta ventana abierta mientras utilices la app web para que
echo la descarga de archivos MP3 funcione al instante al hacer doble clic
echo sobre el reloj en la cinta reproductora.
echo.
echo Presiona Ctrl+C para detener el servicio.
echo ==================================================================
echo.
node "%~dp0scripts\servicio_audio.js"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] No se pudo iniciar el servicio de audio. Verifique que Node.js esté instalado.
    pause
)
