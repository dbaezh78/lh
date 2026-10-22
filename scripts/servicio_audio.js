// ==============================================================================
// SERVICIO LOCAL DE SÍNTESIS LITÚRGICA (GOOGLE TTS -> MP3)
// 100% Gratuito - Voz de Google (es-US / es-MX) - Sin límites ni dependencias
// ==============================================================================

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let ffmpegPath = null;
try {
    ffmpegPath = require('ffmpeg-static');
} catch (_) {}

const PORT_HTTP = 4000;
const PORT_HTTPS = 4001;
const DEFAULT_BITRATE = '40k';

function transcodificarA40k(mp3Buffer, bitrate = DEFAULT_BITRATE, genero = 'hombre') {
    if (!mp3Buffer || mp3Buffer.length === 0 || !ffmpegPath || !fs.existsSync(ffmpegPath)) {
        return Promise.resolve(mp3Buffer);
    }
    return new Promise((resolve) => {
        try {
            const esHombre = String(genero || '').toLowerCase().includes('hombre');
            const audioFilters = esHombre 
                ? ['-af', 'asetrate=24000*0.87,atempo=1.149,aresample=24000'] 
                : [];

            const proc = spawn(ffmpegPath, [
                '-y',
                '-i', 'pipe:0',
                ...audioFilters,
                '-codec:a', 'libmp3lame',
                '-b:a', bitrate,
                '-ac', '1',
                '-f', 'mp3',
                'pipe:1'
            ], { stdio: ['pipe', 'pipe', 'pipe'] });

            const outChunks = [];
            let errBuf = '';

            proc.stdout.on('data', d => outChunks.push(d));
            proc.stderr.on('data', d => { errBuf += d.toString(); });

            proc.on('close', code => {
                if (code === 0 && outChunks.length > 0) {
                    const transcoded = Buffer.concat(outChunks);
                    resolve(transcoded);
                } else {
                    console.warn('[FFmpeg] Transcodificación fallback al original. Código:', code);
                    resolve(mp3Buffer);
                }
            });

            proc.on('error', err => {
                console.warn('[FFmpeg] Error ejecutando ffmpeg:', err.message);
                resolve(mp3Buffer);
            });

            proc.stdin.write(mp3Buffer);
            proc.stdin.end();
        } catch (e) {
            console.warn('[FFmpeg] Excepción en transcodificarA40k:', e.message);
            resolve(mp3Buffer);
        }
    });
}

function limpiarTextoParaGoogle(texto) {
    if (!texto) return '';
    return texto
        .replace(/={20,}[\s\S]*?={20,}/g, '') // Quitar encabezados o metadatos
        .replace(/LITURGIA DE LAS HORAS[\s\S]*?={10,}/gi, '')
        .replace(/^(?:Archivo(?:\s+de\s+audio)?\s+previsto|Tiempo|Semana|Día|Hora|Modo|Fecha|ID\s+Canónico)\s*:.*$/gim, '')
        .replace(/\s*\*\s*/g, ', ') // Pausa para asterisco litúrgico
        .replace(/\bN:\.?\s*/gi, 'por nuestro hermano ')
        .replace(/\(?[Aa]ño\s+(?:par|impar|[I|V|X]+)\)?/gi, '')
        .replace(/\b(?:par|impar)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function dividirEnFrases(texto, maxLen = 140) {
    const limpio = limpiarTextoParaGoogle(texto);
    if (!limpio) return [];
    const oraciones = limpio.match(/[^.!?;\n]+[.!?;\n]*|\s+/g) || [limpio];
    const chunks = [];
    let cur = '';

    const agregarSeguro = (trozo) => {
        trozo = (trozo || '').trim();
        if (!trozo) return;
        if (trozo.length <= maxLen) {
            chunks.push(trozo);
            return;
        }
        // Si excede maxLen, subdividir por comas, dos puntos o punto y coma
        const subPartes = trozo.match(/[^,;:]+[,;:]*|\s+/g) || [trozo];
        let subCur = '';
        for (const sp of subPartes) {
            if ((subCur.length + sp.length) > maxLen && subCur.trim().length > 0) {
                agregarSeguro(subCur);
                subCur = sp;
            } else {
                subCur += sp;
            }
        }
        if (subCur.trim().length > 0) {
            if (subCur.trim().length > maxLen) {
                // Subdividir por palabras si aún supera maxLen
                const palabras = subCur.trim().split(/\s+/);
                let pCur = '';
                for (const p of palabras) {
                    if ((pCur.length + p.length + 1) > maxLen && pCur.length > 0) {
                        chunks.push(pCur.trim());
                        pCur = p;
                    } else {
                        pCur += (pCur ? ' ' : '') + p;
                    }
                }
                if (pCur.trim()) chunks.push(pCur.trim());
            } else {
                chunks.push(subCur.trim());
            }
        }
    };

    for (const seg of oraciones) {
        if ((cur.length + seg.length) > maxLen && cur.trim().length > 0) {
            agregarSeguro(cur);
            cur = seg;
        } else {
            cur += seg;
        }
    }
    if (cur.trim().length > 0) {
        agregarSeguro(cur);
    }
    return chunks;
}

function descargarChunkGoogle(textoChunk, lang = 'es-US') {
    return new Promise((resolve, reject) => {
        const queryUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=' + encodeURIComponent(lang) + '&client=tw-ob&q=' + encodeURIComponent(textoChunk);
        https.get(queryUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error('Google TTS HTTP error: ' + res.statusCode));
            }
            const data = [];
            res.on('data', d => data.push(d));
            res.on('end', () => resolve(Buffer.concat(data)));
        }).on('error', reject);
    });
}

async function sintetizarTextoCompleto(texto, lang = 'es-US', onProgreso = null) {
    const frases = dividirEnFrases(texto);
    if (frases.length === 0) return Buffer.alloc(0);

    const buffers = [];
    for (let i = 0; i < frases.length; i++) {
        const f = frases[i];
        if (!f) continue;
        try {
            const buf = await descargarChunkGoogle(f, lang);
            buffers.push(buf);
            if (typeof onProgreso === 'function') {
                onProgreso(Math.round(((i + 1) / frases.length) * 100));
            }
            if (i < frases.length - 1) {
                await new Promise(r => setTimeout(r, 35));
            }
        } catch (err) {
            console.warn('[Google TTS] Error en frase', i, err.message);
        }
    }
    const rawConcat = Buffer.concat(buffers);
    // Transcodificar a 40 kbps para compresión y fluidez óptima de voz litúrgica
    return await transcodificarA40k(rawConcat, '40k');
}

function guardarEnReposLocales(filename, semana, dia, mp3Buffer, textHash = '', voice = 'hombre') {
    if (!semana || !dia || !mp3Buffer || mp3Buffer.length === 0) return;
    const semPadded = semana.startsWith('s') ? semana.toLowerCase() : ('s' + semana.padStart(2, '0'));
    const diaNorm = dia.toLowerCase().trim();

    const repos = ['c:/db/Github/tordinario', 'c:/db/Github/to'];
    for (const r of repos) {
        try {
            const repoPath = path.resolve(r);
            if (fs.existsSync(repoPath)) {
                const destFolder = path.join(repoPath, semPadded, diaNorm);
                if (!fs.existsSync(destFolder)) {
                    fs.mkdirSync(destFolder, { recursive: true });
                }
                const destFilePath = path.join(destFolder, filename);
                fs.writeFileSync(destFilePath, mp3Buffer);
                if (textHash) {
                    const metaPath = `${destFilePath}.meta.json`;
                    fs.writeFileSync(metaPath, JSON.stringify({
                        hash: textHash,
                        bitrate: '40k',
                        voice: voice,
                        engine: 'Google Español',
                        updatedAt: new Date().toISOString()
                    }, null, 2), 'utf8');
                }
                console.log(`[TTS Auto-Save] Guardado en: ${destFilePath} (${Math.round(mp3Buffer.length / 1024)} KB) @ 40kbps [${voice}]`);
            }
        } catch (err) {
            console.warn(`[TTS Auto-Save] No se pudo guardar en ${r}:`, err.message);
        }
    }
}

// ==============================================================================
// PROCESAMIENTO POR LÍNEA DE COMANDOS (CLI / DRAG-AND-DROP)
// ==============================================================================
async function procesarArchivosCLI(rutas) {
    console.log(`\n==================================================================`);
    console.log(` GENERADOR OFFLINE DE AUDIO LITÚRGICO CON VOZ DE GOOGLE`);
    console.log(`==================================================================`);

    for (const ruta of rutas) {
        const rutaAbs = path.resolve(ruta);
        if (!fs.existsSync(rutaAbs)) {
            console.warn(`[Aviso] No se encontró el archivo: ${rutaAbs}`);
            continue;
        }

        console.log(`\nProcesando: ${path.basename(rutaAbs)}...`);
        const rawContent = fs.readFileSync(rutaAbs, 'utf8');

        let filename = path.basename(rutaAbs).replace(/\.txt$/i, '.mp3');
        const matchArchivo = rawContent.match(/Archivo(?:\s+de\s+audio)?\s+previsto:\s*([a-zA-Z0-9_\-\.]+)/i);
        if (matchArchivo && matchArchivo[1]) {
            filename = matchArchivo[1].trim();
            if (!filename.endsWith('.mp3')) filename += '.mp3';
        }

        let semana = '';
        let dia = '';
        const matchSem = rawContent.match(/Semana:\s*([^\r\n]+)/i) || rutaAbs.match(/[\\/](s\d{1,2})[\\/]/i);
        if (matchSem) semana = matchSem[1].trim();
        const matchDia = rawContent.match(/D[íi]a:\s*([^\r\n]+)/i) || rutaAbs.match(/[\\/](lunes|martes|miercoles|miércoles|jueves|viernes|sabado|sábado|domingo)[\\/]/i);
        if (matchDia) dia = matchDia[1].trim();

        process.stdout.write(`Sintetizando ${filename} con Voz de Google (es-US)... `);
        const mp3Buffer = await sintetizarTextoCompleto(rawContent, 'es-US', (pct) => {
            process.stdout.write(`\rSintetizando ${filename} con Voz de Google (es-US)... ${pct}%`);
        });

        if (mp3Buffer.length > 0) {
            const destDirecto = path.join(path.dirname(rutaAbs), filename);
            fs.writeFileSync(destDirecto, mp3Buffer);
            console.log(`\n [OK] MP3 generado: ${destDirecto} (${Math.round(mp3Buffer.length / 1024)} KB)`);

            if (semana && dia) {
                guardarEnReposLocales(filename, semana, dia, mp3Buffer);
            }
        } else {
            console.error(`\n [ERROR] Falló la generación de audio para: ${rutaAbs}`);
        }
    }

    console.log(`\n==================================================================`);
    console.log(` Finalizado con éxito.`);
    console.log(`==================================================================\n`);
}

// ==============================================================================
// MANEJADOR HTTP/HTTPS UNIVERSAL
// ==============================================================================
async function requestHandler(req, res) {
    // Headers universales CORS + Private Network Access (PNA de Google Chrome)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const host = req.headers.host || `127.0.0.1:${PORT_HTTP}`;
    const protocol = req.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(req.url, `${protocol}://${host}`);

    // 1. Estado
    if (parsedUrl.pathname === '/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', engine: 'Google TTS', httpPort: PORT_HTTP, httpsPort: PORT_HTTPS }));
        return;
    }

    // 1b. Verificación de audio canónico a 40 kbps por hash de texto en pantalla
    if (parsedUrl.pathname === '/api/check-audio') {
        const filename = parsedUrl.searchParams.get('filename') || '';
        const semana = parsedUrl.searchParams.get('semana') || '';
        const dia = parsedUrl.searchParams.get('dia') || '';
        const clientHash = parsedUrl.searchParams.get('textHash') || '';

        if (!filename || !semana || !dia || !clientHash) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ cached: false }));
            return;
        }

        const semPadded = semana.startsWith('s') ? semana.toLowerCase() : ('s' + semana.padStart(2, '0'));
        const diaNorm = dia.toLowerCase().trim();
        const repos = ['c:/db/Github/to', 'c:/db/Github/tordinario'];
        const clientVoice = parsedUrl.searchParams.get('voice') || 'hombre';

        let matchPath = null;
        for (const r of repos) {
            const destFolder = path.join(path.resolve(r), semPadded, diaNorm);
            const destFilePath = path.join(destFolder, filename);
            const metaPath = `${destFilePath}.meta.json`;

            if (fs.existsSync(destFilePath) && fs.existsSync(metaPath)) {
                try {
                    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                    const vozCoincide = !meta.voice || meta.voice === clientVoice;
                    if (meta.hash && meta.hash === clientHash && vozCoincide && (meta.bitrate === '40k' || meta.bitrate === '40kbps')) {
                        matchPath = destFilePath;
                        break;
                    }
                } catch (_) {}
            }
        }

        if (matchPath) {
            const stat = fs.statSync(matchPath);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                cached: true,
                url: `/${semPadded}/${diaNorm}/${filename}`,
                size: stat.size,
                bitrate: '40kbps'
            }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ cached: false }));
        }
        return;
    }

    // 2. Fragmento individual para actualización en tiempo real del porcentaje en el reloj
    if (parsedUrl.pathname === '/api/tts-chunk') {
        const text = parsedUrl.searchParams.get('text') || '';
        const lang = parsedUrl.searchParams.get('lang') || 'es-ES';
        const voice = parsedUrl.searchParams.get('voice') || '';

        if (!text.trim()) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Texto vacío' }));
            return;
        }

        try {
            let buf = await descargarChunkGoogle(text, lang);
            if (voice) {
                buf = await transcodificarA40k(buf, '40k', voice);
            }
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buf.length,
                'Cache-Control': 'public, max-age=3600'
            });
            res.end(buf);
        } catch (err) {
            console.warn('[Chunk] Error sintetizando fragmento:', err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // 3. Guardar audio ensamblado y transcodificar a 40 kbps
    if (parsedUrl.pathname === '/api/save-audio' && req.method === 'POST') {
        const filename = parsedUrl.searchParams.get('filename') || req.headers['x-filename'] || 'audio.mp3';
        const semana = parsedUrl.searchParams.get('semana') || req.headers['x-semana'] || '';
        const dia = parsedUrl.searchParams.get('dia') || req.headers['x-dia'] || '';
        const returnAudio = parsedUrl.searchParams.get('returnAudio') === '1' || parsedUrl.searchParams.get('download') === '1';
        const textHash = parsedUrl.searchParams.get('textHash') || req.headers['x-text-hash'] || '';
        const voice = parsedUrl.searchParams.get('voice') || req.headers['x-voice'] || 'hombre';

        const chunks = [];
        req.on('data', c => chunks.push(c));
        req.on('end', async () => {
            const fullBuf = Buffer.concat(chunks);
            let bufFinal = fullBuf;
            if (fullBuf.length > 0) {
                // Transcodificar a 40 kbps garantizado con ffmpeg modulando voz masculina si aplica
                bufFinal = await transcodificarA40k(fullBuf, '40k', voice);
                if (semana && dia) {
                    guardarEnReposLocales(filename, semana, dia, bufFinal, textHash, voice);
                }
            }

            if (returnAudio && bufFinal.length > 0) {
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': bufFinal.length,
                    'Content-Disposition': `attachment; filename="${filename}"`
                });
                res.end(bufFinal);
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok', saved: true, bytes: bufFinal.length, bitrate: '40kbps' }));
            }
        });
        return;
    }

    // 3b. Endpoint directo de transcodificación a 40 kbps
    if (parsedUrl.pathname === '/api/transcode-40k' && req.method === 'POST') {
        const chunks = [];
        req.on('data', c => chunks.push(c));
        req.on('end', async () => {
            const raw = Buffer.concat(chunks);
            const out = await transcodificarA40k(raw, '40k');
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': out.length
            });
            res.end(out);
        });
        return;
    }

    // 4. Síntesis completa por lote (POST o GET)
    if (parsedUrl.pathname === '/api/tts') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                let payload = {};
                if (req.method === 'POST' && body) {
                    try {
                        payload = JSON.parse(body);
                    } catch (_) {
                        try {
                            const params = new URLSearchParams(body);
                            payload = Object.fromEntries(params.entries());
                        } catch (__) {
                            payload = { text: body };
                        }
                    }
                } else {
                    payload = Object.fromEntries(parsedUrl.searchParams.entries());
                }

                const texto = payload.text || '';
                const filename = payload.filename || 'audio.mp3';
                const semana = payload.semana || '';
                const dia = payload.dia || '';
                const lang = payload.lang || 'es-US';

                if (!texto.trim()) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Texto vacío' }));
                    return;
                }

                console.log(`[TTS] Generando con Voz de Google (${lang}): ${filename} (${texto.length} caracteres)...`);
                const mp3Buffer = await sintetizarTextoCompleto(texto, lang);

                if (mp3Buffer.length === 0) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Fallo al sintetizar audio' }));
                    return;
                }

                if (semana && dia) {
                    guardarEnReposLocales(filename, semana, dia, mp3Buffer);
                }

                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': mp3Buffer.length,
                    'Content-Disposition': `attachment; filename="${filename}"`
                });
                res.end(mp3Buffer);
                console.log(`[TTS] ${filename} enviado exitosamente (${mp3Buffer.length} bytes).`);
            } catch (err) {
                console.error('[TTS] Error interno:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // 5. Servir archivos estáticos del repositorio si aplica (incluye repositorios de audio to y tordinario)
    const searchDirs = [
        path.resolve(__dirname, '..'),
        path.resolve('C:/db/Github/to'),
        path.resolve('C:/db/Github/tordinario')
    ];
    let reqPath = parsedUrl.pathname === '/' ? '/salterios.html' : parsedUrl.pathname;
    try {
        for (const baseDir of searchDirs) {
            if (!fs.existsSync(baseDir)) continue;
            const safePath = path.normalize(path.join(baseDir, decodeURIComponent(reqPath)));
            if (safePath.startsWith(path.normalize(baseDir)) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
                const ext = path.extname(safePath).toLowerCase();
                const mimeTypes = {
                    '.html': 'text/html; charset=utf-8',
                    '.htm': 'text/html; charset=utf-8',
                    '.js': 'application/javascript; charset=utf-8',
                    '.mjs': 'application/javascript; charset=utf-8',
                    '.json': 'application/json; charset=utf-8',
                    '.css': 'text/css; charset=utf-8',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.svg': 'image/svg+xml',
                    '.mp3': 'audio/mpeg'
                };
                const cType = mimeTypes[ext] || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': cType });
                fs.createReadStream(safePath).pipe(res);
                return;
            }
        }
    } catch (_) {}

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}

function iniciarServidores() {
    // 1. Iniciar Servidor HTTP en puerto 4000
    const serverHttp = http.createServer(requestHandler);
    serverHttp.listen(PORT_HTTP, '0.0.0.0', () => {
        console.log(`==================================================================`);
        console.log(` SERVICIO LOCAL DE AUDIO LITÚRGICO (GOOGLE TTS -> MP3)`);
        console.log(` HTTP:   http://127.0.0.1:${PORT_HTTP}`);
        console.log(` Estado: http://127.0.0.1:${PORT_HTTP}/status`);
    });

    // 2. Iniciar Servidor HTTPS en puerto 4001 si existe certificado para *.laantillana.com
    try {
        const certPath = 'C:/db/ca-old/certificate.crt';
        const keyPath = 'C:/db/ca-old/private.key';
        const caPath = 'C:/db/ca-old/ca_bundle.crt';

        if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
            const cert = fs.readFileSync(certPath);
            const key = fs.readFileSync(keyPath);
            const ca = fs.existsSync(caPath) ? fs.readFileSync(caPath) : undefined;

            const serverHttps = https.createServer({ cert, key, ca }, requestHandler);
            serverHttps.listen(PORT_HTTPS, '0.0.0.0', () => {
                console.log(` HTTPS:  https://lh.laantillana.com:${PORT_HTTPS}`);
                console.log(` Estado: https://lh.laantillana.com:${PORT_HTTPS}/status`);
                console.log(` Voz: Google Español Natural (es-US / es-MX)`);
                console.log(`==================================================================`);
            });
        } else {
            console.log(` Voz: Google Español Natural (es-US / es-MX)`);
            console.log(`==================================================================`);
        }
    } catch (errHttps) {
        console.warn(`[HTTPS] No se pudo iniciar puerto HTTPS 4001:`, errHttps.message);
        console.log(`==================================================================`);
    }
}

// Punto de entrada: CLI o Servidores
const args = process.argv.slice(2);
if (args.length > 0 && !args.includes('--server')) {
    procesarArchivosCLI(args);
} else {
    iniciarServidores();
}
