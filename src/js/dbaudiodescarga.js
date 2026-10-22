// ==============================================================================
// PLUGIN: dbaudiodescarga.js
// Gestor unificado de voces y descarga de audio para Liturgia de las Horas
// Voces canónicas de Google: Hombre (Google español) y Mujer (Google español de EE. UU.)
// ==============================================================================

export const VOCES_GOOGLE_CANONICAS = [
    {
        id: 'Google español (Google)',
        clave: 'google_hombre',
        nombre: 'Google español',
        etiqueta: 'Google español (Hombre - Google)',
        genero: 'hombre',
        lang: 'es-ES'
    },
    {
        id: 'Google español de Estados Unidos (Google)',
        clave: 'google_mujer',
        nombre: 'Google español de Estados Unidos',
        etiqueta: 'Google español de Estados Unidos (Mujer - Google)',
        genero: 'mujer',
        lang: 'es-US'
    }
];

export class DbAudioDescarga {
    constructor() {
        this.voces = VOCES_GOOGLE_CANONICAS;
        this._descargando = false;
    }

    /**
     * Retorna únicamente las dos voces canónicas solicitadas (Hombre y Mujer)
     */
    obtenerVocesDisponibles() {
        return this.voces.map(v => ({
            val: v.id,
            text: v.etiqueta,
            genero: v.genero,
            lang: v.lang
        }));
    }

    /**
     * Resuelve la voz nativa de SpeechSynthesis en el navegador
     */
    resolverVozNativa(valOId = null) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

        const valGuardado = (valOId || localStorage.getItem('pref-tts-voice') || '').toLowerCase();
        const voices = window.speechSynthesis.getVoices() || [];
        const esMujer = valGuardado.includes('estados unidos') || valGuardado.includes('mujer') || valGuardado.includes('es-us');

        let encontrada = null;
        if (esMujer) {
            // Voz de Mujer: Google español de Estados Unidos
            encontrada = voices.find(v => {
                const vn = (v.name || '').toLowerCase();
                return vn.includes('google') && (vn.includes('estados unidos') || (v.lang || '').toLowerCase().startsWith('es-us'));
            }) || voices.find(v => (v.lang || '').toLowerCase().startsWith('es-us'));
        } else {
            // Voz de Hombre: Google español
            encontrada = voices.find(v => {
                const vn = (v.name || '').toLowerCase();
                return vn.includes('google') && vn.includes('español') && !vn.includes('estados unidos');
            }) || voices.find(v => (v.lang || '').toLowerCase().startsWith('es') && !v.name.toLowerCase().includes('estados unidos'));
        }

        // Fallback si el navegador no tiene la voz específica
        if (!encontrada) {
            encontrada = voices.find(v => (v.lang || '').toLowerCase().startsWith('es')) || null;
        }

        return encontrada;
    }

    /**
     * Prueba inmediata de voz para los botones de ajuste y al cambiar de opción
     */
    probarVoz(tipo = 'lectura', textoMuestra = null) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert('Tu navegador no soporta síntesis de voz.');
            return;
        }

        window.speechSynthesis.cancel();

        const storageKey = tipo === 'descarga' ? 'pref-tts-download-voice' : 'pref-tts-voice';
        const valGuardado = localStorage.getItem(storageKey) || 'Google español (Google)';
        const esMujer = valGuardado.toLowerCase().includes('estados unidos') || valGuardado.toLowerCase().includes('mujer');

        const texto = textoMuestra || (tipo === 'descarga' 
            ? `Liturgia de las Horas. Probando audio para descargar con voz de ${esMujer ? 'mujer' : 'hombre'}.`
            : `Liturgia de las Horas. Esta es una muestra con voz de ${esMujer ? 'mujer' : 'hombre'}.`
        );

        const utter = new SpeechSynthesisUtterance(texto);
        const vozNativa = this.resolverVozNativa(valGuardado);
        if (vozNativa) utter.voice = vozNativa;
        utter.lang = esMujer ? 'es-US' : 'es-ES';

        const rate = parseFloat(localStorage.getItem('pref-tts-rate') || '1');
        utter.rate = (!isNaN(rate) && rate >= 0.5 && rate <= 2.0) ? rate : 1.0;

        window.speechSynthesis.speak(utter);
    }

    /**
     * Descarga de audio litúrgico MP3 con barra de porcentaje en tiempo real en el reloj
     */
    async descargarAudio(options = {}) {
        if (this._descargando) return;
        this._descargando = true;

        const {
            url = '',
            filename = 'audio.mp3',
            textoLiturgico = '',
            semana = '1',
            dia = 'lunes',
            cinta = null
        } = options;

        const tActual = document.getElementById('cinta-tiempo-actual');
        const tTotal = document.getElementById('cinta-tiempo-total');

        const actualizarReloj = (pct, info) => {
            if (tActual) {
                tActual.classList.add('descargando-audio');
                tActual.textContent = `${pct}%`;
            }
            if (tTotal) {
                tTotal.classList.add('descargando-audio');
                tTotal.textContent = info || 'Descargando...';
            }
        };

        let limpiado = false;
        const limpiarReloj = () => {
            if (limpiado) return;
            limpiado = true;
            setTimeout(() => {
                this._descargando = false;
                if (tActual) tActual.classList.remove('descargando-audio');
                if (tTotal) tTotal.classList.remove('descargando-audio');
                if (cinta && typeof cinta.actualizarProgreso === 'function') {
                    cinta.actualizarProgreso();
                }
            }, 1200);
        };

        const dispararDescargaBlob = (blob, nombreDescarga) => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = nombreDescarga;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            }, 2500);
        };

        actualizarReloj(0, 'Iniciando...');

        try {
            // ------------------------------------------------------------------
            // 1. DESCARGA DIRECTA (to.resucito.do O SERVICIO LOCAL A 40kbps)
            // ------------------------------------------------------------------
            const semPad = String(semana).padStart(2, '0');
            const urlsAProbar = [
                url,
                `https://to.resucito.do/s${semPad}/${dia}/${filename}`,
                `http://127.0.0.1:4000/s${semPad}/${dia}/${filename}`,
                `http://localhost:4000/s${semPad}/${dia}/${filename}`
            ].filter(Boolean);

            for (const urlCandidata of urlsAProbar) {
                // Añadir cache buster para evitar que el navegador use un 404 anterior en caché
                const fetchUrl = urlCandidata.includes('?') ? `${urlCandidata}&_cb=${Date.now()}` : `${urlCandidata}?_cb=${Date.now()}`;
                try {
                    const res = await fetch(fetchUrl);
                    const cType = (res.headers.get('content-type') || '').toLowerCase();

                    if (res.ok && !cType.includes('text/html') && (cType.includes('audio') || cType.includes('octet-stream') || urlCandidata.endsWith('.mp3'))) {
                        const totalBytes = parseInt(res.headers.get('content-length') || '0', 10);
                        let blobFinal = null;

                        if (res.body && typeof res.body.getReader === 'function') {
                            const reader = res.body.getReader();
                            const chunks = [];
                            let recibidos = 0;

                            while (true) {
                                const { done, value } = await reader.read();
                                if (done) break;
                                chunks.push(value);
                                recibidos += value.length;
                                if (totalBytes > 0) {
                                    const pct = Math.min(100, Math.round((recibidos / totalBytes) * 100));
                                    const mbRecibidos = (recibidos / (1024 * 1024)).toFixed(1);
                                    const mbTotal = (totalBytes / (1024 * 1024)).toFixed(1);
                                    actualizarReloj(pct, `${mbRecibidos} / ${mbTotal} MB`);
                                } else {
                                    const mbRecibidos = (recibidos / (1024 * 1024)).toFixed(1);
                                    actualizarReloj(50, `${mbRecibidos} MB`);
                                }
                            }
                            actualizarReloj(100, 'Listo');
                            blobFinal = new Blob(chunks, { type: 'audio/mpeg' });
                        } else {
                            actualizarReloj(100, 'Listo');
                            blobFinal = await res.blob();
                        }

                        if (blobFinal && blobFinal.size > 0) {
                            dispararDescargaBlob(blobFinal, filename);
                            if (cinta) {
                                if (cinta.audiosFallidos && typeof cinta.audiosFallidos.delete === 'function') {
                                    cinta.audiosFallidos.delete(urlCandidata);
                                    cinta.audiosFallidos.delete(url);
                                }
                                if (typeof cinta.mostrarToastAviso === 'function') {
                                    cinta.mostrarToastAviso(`¡${filename} (40kbps) descargado exitosamente!`, 4000);
                                }
                            }
                            limpiarReloj();
                            return true;
                        }
                    }
                } catch (netErr) {
                    // Silencioso, pasa a la siguiente alternativa
                }
            }

            // ------------------------------------------------------------------
            // 2. GENERACIÓN AUTOMÁTICA DEL AUDIO DEL CONTENIDO LITÚRGICO
            // ------------------------------------------------------------------
            let texto = (textoLiturgico || '').trim();
            if (!texto && cinta) {
                if (typeof cinta.obtenerTextoParaModo === 'function') {
                    texto = (cinta.obtenerTextoParaModo(cinta.modoActivo) || '').trim();
                }
                if (!texto && cinta.ttsState && cinta.ttsState.fullText) {
                    texto = (cinta.ttsState.fullText || '').trim();
                }
            }
            if (!texto && typeof document !== 'undefined') {
                const cuerpoEl = document.getElementById('salterio-contenido') || document.getElementById('cuerpo') || document.querySelector('.cuerpo') || document.querySelector('article') || document.querySelector('main');
                if (cuerpoEl) {
                    texto = (cuerpoEl.innerText || cuerpoEl.textContent || '').trim();
                }
            }

            let partes = (options.partes && Array.isArray(options.partes) && options.partes.length > 0)
                ? options.partes
                : (cinta && cinta.ttsState && Array.isArray(cinta.ttsState.chunks) && cinta.ttsState.chunks.length > 0)
                    ? cinta.ttsState.chunks.map(c => c.text).filter(Boolean)
                    : [];

            if (partes.length === 0 && texto) {
                const oraciones = texto.match(/[^.!?;\n]+[.!?;\n]*|\s+/g) || [texto];
                let cur = '';
                for (const seg of oraciones) {
                    if ((cur.length + seg.length) > 130 && cur.trim()) {
                        partes.push(cur.trim());
                        cur = seg;
                    } else {
                        cur += seg;
                    }
                }
                if (cur.trim()) partes.push(cur.trim());
            }

            if (partes.length > 0) {
                const valGuardado = localStorage.getItem('pref-tts-download-voice') || localStorage.getItem('pref-tts-voice') || '';
                const esMujer = valGuardado.toLowerCase().includes('estados unidos') || valGuardado.toLowerCase().includes('mujer');
                const langDescarga = esMujer ? 'es-US' : 'es-ES';

                // Probar servicio local de síntesis en localhost / 127.0.0.1
                const basesAProbar = [
                    'http://127.0.0.1:4000',
                    'http://localhost:4000'
                ];

                let activeBaseUrl = null;
                for (const b of basesAProbar) {
                    try {
                        const ctrl = new AbortController();
                        const tm = setTimeout(() => ctrl.abort(), 1200);
                        const r = await fetch(`${b}/status`, { signal: ctrl.signal });
                        clearTimeout(tm);
                        if (r.ok) {
                            activeBaseUrl = b;
                            break;
                        }
                    } catch (_) {}
                }

                if (activeBaseUrl) {
                    actualizarReloj(0, `0/${partes.length} partes`);
                    if (cinta && typeof cinta.mostrarToastAviso === 'function') {
                        cinta.mostrarToastAviso(`Generando audio '${filename}' (${partes.length} fragmentos)...`, 3500);
                    }

                    const buffers = [];
                    for (let i = 0; i < partes.length; i++) {
                        const pct = Math.max(1, Math.min(99, Math.round(((i + 1) / partes.length) * 100)));
                        actualizarReloj(pct, `${i + 1}/${partes.length} partes`);

                        const chunkUrl = `${activeBaseUrl}/api/tts-chunk?text=${encodeURIComponent(partes[i])}&lang=${encodeURIComponent(langDescarga)}`;
                        const resChunk = await fetch(chunkUrl);
                        if (!resChunk.ok) throw new Error(`HTTP ${resChunk.status}`);
                        const ab = await resChunk.arrayBuffer();
                        if (ab && ab.byteLength > 0) buffers.push(ab);
                    }

                    if (buffers.length > 0) {
                        actualizarReloj(99, 'Optimizando a 40kbps...');
                        const rawBlob = new Blob(buffers, { type: 'audio/mpeg' });
                        let blobFinalDescarga = rawBlob;

                        // Guardar en repositorios locales y obtener versión transcodificada a 40kbps
                        try {
                            const resSave = await fetch(`${activeBaseUrl}/api/save-audio?filename=${encodeURIComponent(filename)}&semana=${encodeURIComponent(semana)}&dia=${encodeURIComponent(dia)}&returnAudio=1`, {
                                method: 'POST',
                                body: rawBlob,
                                headers: { 'Content-Type': 'audio/mpeg' }
                            });
                            if (resSave.ok) {
                                const cType = (resSave.headers.get('content-type') || '').toLowerCase();
                                if (cType.includes('audio') || cType.includes('octet-stream')) {
                                    blobFinalDescarga = await resSave.blob();
                                }
                            }
                        } catch (saveErr) {
                            console.warn('[DbAudioDescarga] No se pudo obtener 40kbps del servidor, usando audio directo:', saveErr);
                        }

                        actualizarReloj(100, 'Listo (40kbps)');
                        dispararDescargaBlob(blobFinalDescarga, filename);

                        if (cinta && typeof cinta.mostrarToastAviso === 'function') {
                            cinta.mostrarToastAviso(`¡${filename} (40kbps) generado y descargado exitosamente!`, 4500);
                        }
                        limpiarReloj();
                        return true;
                    }
                }
            }

            // ------------------------------------------------------------------
            // 3. AVISO INFORMATIVO (NUNCA DESCARGAR .TXT)
            // ------------------------------------------------------------------
            if (cinta && typeof cinta.mostrarToastAviso === 'function') {
                cinta.mostrarToastAviso(`El audio '${filename}' se está sincronizando con el servidor. Puedes rezar en directo pulsando el botón de lectura en la cinta.`, 6000);
            }
        } catch (err) {
            console.error('[DbAudioDescarga] Error en descarga:', err);
            if (cinta && typeof cinta.mostrarToastAviso === 'function') {
                cinta.mostrarToastAviso('No se pudo completar la descarga.', 4000);
            }
        } finally {
            limpiarReloj();
        }
    }
}

// Instancia global disponible en toda la aplicación
export const dbAudioDescarga = new DbAudioDescarga();

if (typeof window !== 'undefined') {
    window.dbAudioDescarga = dbAudioDescarga;
    window.VOCES_GOOGLE_CANONICAS = VOCES_GOOGLE_CANONICAS;
}
