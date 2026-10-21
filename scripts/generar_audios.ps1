# ==============================================================================
# GENERADOR OFFLINE DE AUDIO LITÚRGICO (MP3) PARA LITURGIA DE LAS HORAS
# 100% Gratuito - Voz Latina / Mexicana (es-MX) - Sin dependencias externas ni pagos
# ==============================================================================

[CmdletBinding()]
param (
    [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$ArchivosEntrada
)

# Configurar salida UTF-8 en consola
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Cargar tipos WinRT necesarios
try {
    [Windows.Media.SpeechSynthesis.SpeechSynthesizer,Windows.Media.SpeechSynthesis,ContentType=WindowsRuntime] | Out-Null
    [Windows.Media.MediaProperties.MediaEncodingProfile,Windows.Media.MediaProperties,ContentType=WindowsRuntime] | Out-Null
    [Windows.Media.Transcoding.MediaTranscoder,Windows.Media.Transcoding,ContentType=WindowsRuntime] | Out-Null
    [Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime] | Out-Null
    [Windows.Storage.StorageFolder,Windows.Storage,ContentType=WindowsRuntime] | Out-Null
    [Windows.Storage.Streams.DataReader,Windows.Storage.Streams,ContentType=WindowsRuntime] | Out-Null
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
} catch {
    Write-Warning "No se pudieron cargar los componentes WinRT de Windows: $_"
}

# Helper genérico para await de operaciones asíncronas WinRT
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { 
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' 
})[0]

Function Await-WinRT($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    return $netTask.Result
}

# Obtener la voz mexicana nativa (es-MX) recomendada
Function Obtener-VozMexicana {
    $allVoices = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices
    # 1. Preferir Raul (es-MX)
    $v = $allVoices | Where-Object { $_.Language -eq 'es-MX' -and $_.DisplayName -match 'Raul' } | Select-Object -First 1
    # 2. Preferir Sabina (es-MX)
    if (-not $v) {
        $v = $allVoices | Where-Object { $_.Language -eq 'es-MX' -and $_.DisplayName -match 'Sabina' } | Select-Object -First 1
    }
    # 3. Cualquier voz en es-MX
    if (-not $v) {
        $v = $allVoices | Where-Object { $_.Language -eq 'es-MX' } | Select-Object -First 1
    }
    # 4. Fallback a cualquier voz en español
    if (-not $v) {
        $v = $allVoices | Where-Object { $_.Language -like 'es*' } | Select-Object -First 1
    }
    return $v
}

# Función principal para sintetizar texto y codificar en MP3
Function Convertir-TextoAMp3 {
    param (
        [string]$Texto,
        [string]$RutaMp3Destino,
        [string]$NombreVozOpcional = ""
    )

    if ([string]::IsNullOrWhiteSpace($Texto)) {
        Write-Warning "El texto a sintetizar está vacío."
        return $false
    }

    $destDir = [System.IO.Path]::GetDirectoryName($RutaMp3Destino)
    if ($destDir -and -not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    $synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
    $voz = Obtener-VozMexicana
    if ($voz) {
        $synth.Voice = $voz
        Write-Host " [Voz activa] $($voz.DisplayName) ($($voz.Language))" -ForegroundColor Cyan
    }

    $tempWav = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "lh_synth_$([Guid]::NewGuid().ToString('N')).wav")
    $mp3FileName = [System.IO.Path]::GetFileName($RutaMp3Destino)
    $destFolderAbs = [System.IO.Path]::GetFullPath($destDir)

    try {
        Write-Host " Sintentizando audio con voz natural..." -ForegroundColor Yellow
        $streamOp = $synth.SynthesizeTextToStreamAsync($Texto)
        $stream = Await-WinRT $streamOp ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])

        $reader = New-Object Windows.Storage.Streams.DataReader($stream)
        $loadOp = $reader.LoadAsync($stream.Size)
        $bytesLoaded = Await-WinRT $loadOp ([uint32])
        $bytes = New-Object byte[] $bytesLoaded
        $reader.ReadBytes($bytes)
        [System.IO.File]::WriteAllBytes($tempWav, $bytes)

        Write-Host " Transcodificando a MP3 de alta fidelidad..." -ForegroundColor Yellow
        $srcFileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($tempWav)
        $srcFile = Await-WinRT $srcFileOp ([Windows.Storage.StorageFile])

        $destFolderOp = [Windows.Storage.StorageFolder]::GetFolderFromPathAsync($destFolderAbs)
        $destFolder = Await-WinRT $destFolderOp ([Windows.Storage.StorageFolder])

        $destFileOp = $destFolder.CreateFileAsync($mp3FileName, [Windows.Storage.CreationCollisionOption]::ReplaceExisting)
        $destFile = Await-WinRT $destFileOp ([Windows.Storage.StorageFile])

        $profile = [Windows.Media.MediaProperties.MediaEncodingProfile]::CreateMp3([Windows.Media.MediaProperties.AudioEncodingQuality]::High)
        $transcoder = New-Object Windows.Media.Transcoding.MediaTranscoder
        $prepareOp = $transcoder.PrepareFileTranscodeAsync($srcFile, $destFile, $profile)
        $prepareResult = Await-WinRT $prepareOp ([Windows.Media.Transcoding.PrepareTranscodeResult])

        if ($prepareResult.CanTranscode) {
            $action = $prepareResult.TranscodeAsync()
            while ($action.Status -eq [Windows.Foundation.AsyncStatus]::Started) {
                Start-Sleep -Milliseconds 80
            }
            if ($action.Status -eq [Windows.Foundation.AsyncStatus]::Completed -or (Test-Path $RutaMp3Destino)) {
                $tamanoKB = [math]::Round(((Get-Item $RutaMp3Destino).Length / 1KB), 1)
                Write-Host " [OK] MP3 generado exitosamente: $RutaMp3Destino ($tamanoKB KB)" -ForegroundColor Green
                return $true
            } else {
                Write-Error "Fallo en la transcodificación. Estado: $($action.Status)"
                return $false
            }
        } else {
            Write-Error "No se puede transcodificar el audio: $($prepareResult.FailureReason)"
            return $false
        }
    } catch {
        Write-Error "Error durante la síntesis: $_"
        return $false
    } finally {
        if (Test-Path $tempWav) {
            Remove-Item $tempWav -Force -ErrorAction SilentlyContinue
        }
    }
}

# Limpiar guión descargado (quitar encabezado metadata si existe)
Function Extraer-TextoLimpio($contenido) {
    if ($contenido -match '={20,}\r?\n\r?\n([\s\S]+)$') {
        $contenido = $matches[1]
    }
    # Pausas naturales para asteriscos litúrgicos
    $contenido = $contenido -replace '\s*\*\s*', ', '
    # Limpieza de rúbricas visuales
    $contenido = $contenido -replace '(?i)\bN:\.?\s*', 'por nuestro hermano '
    return $contenido.Trim()
}

# Detectar nombre de archivo desde el guión
Function Detectar-NombreArchivo($contenido, $archivoOriginal) {
    if ($contenido -match '(?i)Archivo\s*(?:de\s*audio\s*)?previsto:\s*([a-zA-Z0-9_\-\.]+)') {
        $nombre = $matches[1].Trim()
        if (-not $nombre.EndsWith('.mp3', [System.StringComparison]::OrdinalIgnoreCase)) {
            $nombre += '.mp3'
        }
        return $nombre
    }
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($archivoOriginal)
    return "$baseName.mp3"
}

# Procesar un archivo .txt
Function Procesar-ArchivoTxt($rutaTxt, $carpetaSalida = "") {
    if (-not (Test-Path $rutaTxt)) {
        Write-Warning "No se encontró el archivo: $rutaTxt"
        return
    }

    Write-Host "`n========================================================" -ForegroundColor DarkCyan
    Write-Host " Procesando: $rutaTxt" -ForegroundColor White
    $rawContent = [System.IO.File]::ReadAllText($rutaTxt, [System.Text.Encoding]::UTF8)
    $nombreMp3 = Detectar-NombreArchivo $rawContent $rutaTxt
    $textoLimpio = Extraer-TextoLimpio $rawContent

    if (-not $carpetaSalida) {
        # Si no se especificó carpeta, guardar en audios_generados/
        $rootRepo = (Get-Item $PSScriptRoot).Parent.FullName
        $carpetaSalida = Join-Path $rootRepo "audios_generados"
    }

    $rutaMp3Destino = Join-Path $carpetaSalida $nombreMp3
    $exito = Convertir-TextoAMp3 -Texto $textoLimpio -RutaMp3Destino $rutaMp3Destino

    if ($exito) {
        Write-Host " Archivo listo para subir al servidor:" -ForegroundColor Green
        Write-Host " Destino local: $rutaMp3Destino" -ForegroundColor Gray
    }
}

Function Pausar-SiInteractivo {
    try {
        if ([Environment]::UserInteractive -and -not [Console]::IsInputRedirected) {
            Write-Host "`nPresione cualquier tecla para continuar..." -ForegroundColor DarkGray
            [void][System.Console]::ReadKey($true)
        }
    } catch {}
}

# ==============================================================================
# MODO INTERACTIVO (MENÚ CONSOLA)
# ==============================================================================
Function Mostrar-Menu {
    $rootRepo = (Get-Item $PSScriptRoot).Parent.FullName
    $dirGenerados = Join-Path $rootRepo "audios_generados"
    $dirGuiones = Join-Path $rootRepo "audios_guiones"

    if (-not (Test-Path $dirGenerados)) { New-Item -ItemType Directory -Path $dirGenerados -Force | Out-Null }
    if (-not (Test-Path $dirGuiones)) { New-Item -ItemType Directory -Path $dirGuiones -Force | Out-Null }

    Clear-Host
    Write-Host "==================================================================" -ForegroundColor Green
    Write-Host "  GENERADOR OFFLINE DE AUDIO LITÚRGICO (MP3) - 100% GRATUITO" -ForegroundColor White
    Write-Host "  Liturgia de las Horas | Voz Mexicana Nativa (es-MX)" -ForegroundColor Yellow
    Write-Host "==================================================================" -ForegroundColor Green
    Write-Host "  Carpeta de guiones (.txt):  $dirGuiones" -ForegroundColor Gray
    Write-Host "  Carpeta de salida (.mp3):   $dirGenerados" -ForegroundColor Gray
    Write-Host "------------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host " [1] Convertir un archivo de guión (.txt) a MP3" -ForegroundColor Cyan
    Write-Host " [2] Convertir todos los guiones de 'audios_guiones/' a MP3 (Lote)" -ForegroundColor Cyan
    Write-Host " [3] Generar audio litúrgico canónico organizado (Semana/Día/Hora)" -ForegroundColor Cyan
    Write-Host " [4] Probar voz mexicana nativa (Microsoft Raul / Sabina)" -ForegroundColor Cyan
    Write-Host " [0] Salir" -ForegroundColor Red
    Write-Host "------------------------------------------------------------------" -ForegroundColor DarkGray

    $opcion = Read-Host " Seleccione una opción [0-4]"
    switch ($opcion) {
        "1" {
            Write-Host "`nArrastre el archivo .txt aquí o pegue la ruta completa:" -ForegroundColor Yellow
            $rutaIn = Read-Host "Ruta del archivo"
            $rutaIn = $rutaIn.Trim("`"' ")
            if ($rutaIn) {
                Procesar-ArchivoTxt $rutaIn $dirGenerados
            }
            Pausar-SiInteractivo
            Mostrar-Menu
        }
        "2" {
            $archivos = Get-ChildItem -Path $dirGuiones -Filter "*.txt"
            if ($archivos.Count -eq 0) {
                Write-Warning "No hay archivos .txt en $dirGuiones"
                Write-Host "Descargue el guión (.txt) desde la app o colóquelo en esa carpeta." -ForegroundColor Gray
            } else {
                Write-Host "`nSe encontraron $($archivos.Count) archivo(s) para procesar:`n" -ForegroundColor Yellow
                foreach ($f in $archivos) {
                    Procesar-ArchivoTxt $f.FullName $dirGenerados
                }
            }
            Pausar-SiInteractivo
            Mostrar-Menu
        }
        "3" {
            Write-Host "`n--- CONFIGURACIÓN DE AUDIO LITÚRGICO CANÓNICO ---" -ForegroundColor Yellow
            Write-Host "Tiempo: 1=Ordinario (to), 2=Adviento (ta), 3=Navidad (tn), 4=Cuaresma (tc), 5=Pascua (tp)" -ForegroundColor Gray
            $tOpt = Read-Host "Tiempo [1-5, defecto 1]"
            $tMap = @{ '1'='to'; '2'='ta'; '3'='tn'; '4'='tc'; '5'='tp' }
            $subdom = if ($tMap.ContainsKey($tOpt)) { $tMap[$tOpt] } else { 'to' }

            $semNum = Read-Host "Semana [1 a 34, ej: 3]"
            $semNum = $semNum.Trim()
            if (-not $semNum) { $semNum = "3" }
            $semFolder = "s$($semNum.PadLeft(2, '0'))"

            Write-Host "Día: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 7=Domingo" -ForegroundColor Gray
            $dOpt = Read-Host "Día [1-7, defecto 1]"
            $dMap = @{ '1'='lunes'; '2'='martes'; '3'='miercoles'; '4'='jueves'; '5'='viernes'; '6'='sabado'; '7'='domingo' }
            $diaFolder = if ($dMap.ContainsKey($dOpt)) { $dMap[$dOpt] } else { 'lunes' }

            Write-Host "Hora:" -ForegroundColor Gray
            Write-Host " 1=Oficio Año 1 (oficio1.mp3)  2=Oficio Año 2 (oficio2.mp3)"
            Write-Host " 3=Laudes (laudes.mp3)        4=Tercia (tercia.mp3)"
            Write-Host " 5=Sexta (sexta.mp3)          6=Nona (nona.mp3)"
            Write-Host " 7=Vísperas (visperas.mp3)    8=Completas (completas.mp3)"
            Write-Host " 9=Lectura 1 (lectura1.mp3)   10=Lectura 2 (lectura2.mp3)"
            $hOpt = Read-Host "Hora [1-10, defecto 3 (Laudes)]"
            $hMap = @{
                '1'='oficio1.mp3'; '2'='oficio2.mp3'; '3'='laudes.mp3';
                '4'='tercia.mp3'; '5'='sexta.mp3'; '6'='nona.mp3';
                '7'='visperas.mp3'; '8'='completas.mp3';
                '9'='lectura1.mp3'; '10'='lectura2.mp3'
            }
            $archivoMp3 = if ($hMap.ContainsKey($hOpt)) { $hMap[$hOpt] } else { 'laudes.mp3' }

            $carpetaDestinoFinal = Join-Path $dirGenerados "$semFolder\$diaFolder"
            $rutaFinal = Join-Path $carpetaDestinoFinal $archivoMp3

            Write-Host "`nPuede pegar el texto litúrgico, o indicar la ruta de un guión .txt." -ForegroundColor Yellow
            $textoOArchivo = Read-Host "Texto o ruta del archivo .txt (dejar vacío para texto canónico de inicio)"

            $textoDefinitivo = ""
            if ($textoOArchivo -and (Test-Path $textoOArchivo.Trim("`"' "))) {
                $raw = [System.IO.File]::ReadAllText($textoOArchivo.Trim("`"' "), [System.Text.Encoding]::UTF8)
                $textoDefinitivo = Extraer-TextoLimpio $raw
            } elseif ($textoOArchivo) {
                $textoDefinitivo = Extraer-TextoLimpio $textoOArchivo
            } else {
                $textoDefinitivo = "Señor, abre mis labios. Y mi boca proclamará tu alabanza. Dios mío, ven en mi auxilio. Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén. Aleluya."
            }

            Write-Host "`nGenerando estructura canónica..." -ForegroundColor Cyan
            Convertir-TextoAMp3 -Texto $textoDefinitivo -RutaMp3Destino $rutaFinal

            Write-Host "`n--------------------------------------------------------------" -ForegroundColor DarkCyan
            Write-Host " Para publicar en su servidor web, suba este archivo a:" -ForegroundColor Green
            Write-Host " https://$subdom.resucito.do/$semFolder/$diaFolder/$archivoMp3" -ForegroundColor Yellow
            Write-Host "--------------------------------------------------------------`n" -ForegroundColor DarkCyan

            Pausar-SiInteractivo
            Mostrar-Menu
        }
        "4" {
            $testTxt = "Señor, abre mis labios. Y mi boca proclamará tu alabanza. Dios mío, ven en mi auxilio. Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo."
            $testMp3 = Join-Path $dirGenerados "prueba_voz_es_mx.mp3"
            Convertir-TextoAMp3 -Texto $testTxt -RutaMp3Destino $testMp3
            Pausar-SiInteractivo
            Mostrar-Menu
        }
        "0" {
            Write-Host "¡Que tenga un bendecido día!" -ForegroundColor Green
            exit 0
        }
        Default {
            Mostrar-Menu
        }
    }
}

# Si se llamaron archivos por argumento (ej. Arrastrar y soltar .txt en el .bat)
if ($ArchivosEntrada -and $ArchivosEntrada.Count -gt 0) {
    $rootRepo = (Get-Item $PSScriptRoot).Parent.FullName
    $dirGenerados = Join-Path $rootRepo "audios_generados"
    foreach ($arg in $ArchivosEntrada) {
        $cleanPath = $arg.Trim("`"' ")
        if (Test-Path $cleanPath) {
            Procesar-ArchivoTxt $cleanPath $dirGenerados
        }
    }
    Write-Host "`nTodos los archivos han sido procesados." -ForegroundColor Green
    Pausar-SiInteractivo
} else {
    Mostrar-Menu
}
