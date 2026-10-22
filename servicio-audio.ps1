<#
.SYNOPSIS
    Script de PowerShell para Iniciar, Reiniciar, Parar y Consultar el Servicio de Audio Litúrgico.
.EXAMPLE
    .\servicio-audio.ps1 -Accion start
    .\servicio-audio.ps1 -Accion stop
    .\servicio-audio.ps1 -Accion restart
    .\servicio-audio.ps1 -Accion status
#>
[CmdletBinding()]
param(
    [Parameter(Position=0)]
    [ValidateSet('start', 'iniciar', 'stop', 'parar', 'restart', 'reiniciar', 'status', 'estado')]
    [string]$Accion = 'menu'
)

$ErrorActionPreference = 'SilentlyContinue'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-ServicioStatus {
    try {
        $res = Invoke-RestMethod -Uri 'http://127.0.0.1:4000/status' -TimeoutSec 2
        return @{ Online = $true; Info = $res }
    } catch {
        return @{ Online = $false }
    }
}

function Stop-ServicioAudio {
    Write-Host "Deteniendo procesos del servicio de audio (puertos 4000/4001 y node servicio_audio.js)..." -ForegroundColor Yellow
    
    # Matar por proceso Node con servicio_audio.js
    Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*servicio_audio.js*' } | ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force
    }
    
    # Matar por puerto si quedara colgado
    Get-NetTCPConnection -LocalPort 4000, 4001 -State Listen | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force
    }
    Start-Sleep -Seconds 1
    Write-Host "[OK] Servicio detenido." -ForegroundColor Green
}

function Start-ServicioAudio {
    $st = Get-ServicioStatus
    if ($st.Online) {
        Write-Host "[AVISO] El servicio ya se encuentra en ejecución en http://127.0.0.1:4000" -ForegroundColor Cyan
        return
    }

    Write-Host "Iniciando servicio_audio.js en una ventana dedicada..." -ForegroundColor Green
    $nodeScript = Join-Path $scriptDir "scripts\servicio_audio.js"
    Start-Process cmd.exe -ArgumentList "/k", "title Servicio Audio Liturgico (Google TTS 40k) && cd /d `"$scriptDir`" && node `"$nodeScript`""
    
    # Esperar confirmación
    for ($i = 0; $i -lt 5; $i++) {
        Start-Sleep -Milliseconds 600
        $check = Get-ServicioStatus
        if ($check.Online) {
            Write-Host "[OK] Servicio iniciado y respondiendo en http://127.0.0.1:4000/status" -ForegroundColor Green
            return
        }
    }
}

function Restart-ServicioAudio {
    Write-Host "Reiniciando servicio..." -ForegroundColor Yellow
    Stop-ServicioAudio
    Start-ServicioAudio
}

switch ($Accion.ToLower()) {
    { $_ -in 'start', 'iniciar' } { Start-ServicioAudio }
    { $_ -in 'stop', 'parar' } { Stop-ServicioAudio }
    { $_ -in 'restart', 'reiniciar' } { Restart-ServicioAudio }
    { $_ -in 'status', 'estado' } {
        $st = Get-ServicioStatus
        if ($st.Online) {
            Write-Host "[ONLINE] Servicio activo y respondiendo:" -ForegroundColor Green
            $st.Info | Format-List
        } else {
            Write-Host "[OFFLINE] El servicio está detenido." -ForegroundColor Red
        }
    }
    default {
        # Mostrar menú interactivo
        Clear-Host
        Write-Host "==================================================================" -ForegroundColor Cyan
        Write-Host "   GESTOR DEL SERVICIO DE AUDIO LITÚRGICO (GOOGLE TTS - 40kbps)" -ForegroundColor Cyan
        Write-Host "==================================================================" -ForegroundColor Cyan
        $st = Get-ServicioStatus
        if ($st.Online) {
            Write-Host " [ESTADO ACTUAL]: ENCENDIDO / ONLINE (Puertos 4000 y 4001)" -ForegroundColor Green
        } else {
            Write-Host " [ESTADO ACTUAL]: APAGADO / OFFLINE" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host " [1] Iniciar servicio (abrir ventana activa)"
        Write-Host " [2] Reiniciar servicio"
        Write-Host " [3] Parar servicio"
        Write-Host " [4] Consultar estado"
        Write-Host " [5] Salir"
        Write-Host "------------------------------------------------------------------"
        $op = Read-Host "Seleccione una opción (1-5)"
        switch ($op) {
            '1' { Start-ServicioAudio }
            '2' { Restart-ServicioAudio }
            '3' { Stop-ServicioAudio }
            '4' { 
                $check = Get-ServicioStatus
                if ($check.Online) { Write-Host "[ONLINE] Activo" -ForegroundColor Green } else { Write-Host "[OFFLINE]" -ForegroundColor Red }
            }
            default { Write-Host "Saliendo..." }
        }
    }
}
