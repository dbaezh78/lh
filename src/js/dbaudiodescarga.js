// ==============================================================================
// PLUGIN: dbaudiodescarga.js
// Gestor unificado de voces y descarga de audio para Liturgia de las Horas
// Voces canónicas de Google: Hombre (Google español) y Mujer (Google español de EE. UU.)
// ==============================================================================

export const VOCES_GOOGLE_CANONICAS = [
    {
        id: 'Google español (Google)',
        clave: 'google_es_hombre',
        nombre: 'Google español',
        etiqueta: 'Google español (España - Hombre)',
        genero: 'hombre',
        lang: 'es-ES'
    },
    {
        id: 'Google español - España (Mujer)',
        clave: 'google_es_mujer',
        nombre: 'Google español de España (Mujer)',
        etiqueta: 'Google español (España - Mujer)',
        genero: 'mujer',
        lang: 'es-ES'
    },
    {
        id: 'Google español de Estados Unidos (Google)',
        clave: 'google_us_mujer',
        nombre: 'Google español de Estados Unidos',
        etiqueta: 'Google español (EE. UU. - Mujer)',
        genero: 'mujer',
        lang: 'es-US'
    },
    {
        id: 'Google español de Estados Unidos (Hombre)',
        clave: 'google_us_hombre',
        nombre: 'Google español de Estados Unidos (Hombre)',
        etiqueta: 'Google español (EE. UU. - Hombre)',
        genero: 'hombre',
        lang: 'es-US'
    },
    {
        id: 'Google español de México (Google)',
        clave: 'google_mx_mujer',
        nombre: 'Google español de México',
        etiqueta: 'Google español (México - Mujer)',
        genero: 'mujer',
        lang: 'es-MX'
    },
    {
        id: 'Google español de México (Hombre)',
        clave: 'google_mx_hombre',
        nombre: 'Google español de México (Hombre)',
        etiqueta: 'Google español (México - Hombre)',
        genero: 'hombre',
        lang: 'es-MX'
    }
];

export async function calcularHashTexto(texto) {
    if (!texto) return '';
    const norm = String(texto).trim().replace(/\s+/g, ' ');
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(norm);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
        } catch (_) {}
    }
    let h = 0;
    for (let i = 0; i < norm.length; i++) {
        h = ((h << 5) - h) + norm.charCodeAt(i);
        h |= 0;
    }
    return String(Math.abs(h));
}

export class DbAudioDescarga {
    constructor() {
        this.voces = VOCES_GOOGLE_CANONICAS;
        this._descargando = false;
    }

    /**
     * Retorna todas las opciones de voz para el selector.
     * Incluye las opciones canónicas de Google (España, EE.UU., México con Hombre/Mujer)
     * y cualquier voz en español adicional disponible en el sistema/navegador.
     */
    obtenerVocesDisponibles() {
        const resultado = this.voces.map(v => ({
            val: v.id,
            text: v.etiqueta,
            genero: v.genero,
            lang: v.lang
        }));

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
                const browserVoices = window.speechSynthesis.getVoices() || [];
                const spanishVoices = browserVoices.filter(v => (v.lang || '').toLowerCase().startsWith('es'));
                
                spanishVoices.forEach(bv => {
                    const yaExiste = resultado.some(r => r.val.toLowerCase() === bv.name.toLowerCase());
                    if (!yaExiste) {
                        const esMujer = /sabina|helena|paulina|monica|elena|dalia|mujer|female/i.test(bv.name);
                        resultado.push({
                            val: bv.name,
                            text: `${bv.name} (${bv.lang})`,
                            genero: esMujer ? 'mujer' : 'hombre',
                            lang: bv.lang || 'es-ES'
                        });
                    }
                });
            } catch (_) {}
        }

        return resultado;
    }

    /**
     * Mapea un identificador de voz seleccionado a su configuración canónica (lang, genero, clave)
     */
    determinarConfigVoz(nombreOId = '') {
        const norm = (nombreOId || '').toLowerCase().trim();
        const encontrada = this.voces.find(v => 
            v.id.toLowerCase() === norm || 
            v.etiqueta.toLowerCase() === norm ||
            v.clave.toLowerCase() === norm
        );

        if (encontrada) {
            return {
                lang: encontrada.lang,
                genero: encontrada.genero,
                nombre: encontrada.nombre,
                etiqueta: encontrada.etiqueta,
                id: encontrada.id
            };
        }

        // Detección heurística para voces del navegador o formatos libres
        let lang = 'es-ES';
        if (norm.includes('estados unidos') || norm.includes('ee. uu.') || norm.includes('es-us')) {
            lang = 'es-US';
        } else if (norm.includes('méxico') || norm.includes('mexico') || norm.includes('es-mx')) {
            lang = 'es-MX';
        } else if (norm.includes('argentina') || norm.includes('es-ar')) {
            lang = 'es-AR';
        } else if (norm.includes('colombia') || norm.includes('es-co')) {
            lang = 'es-CO';
        }

        const esMujer = norm.includes('mujer') || /sabina|helena|paulina|monica|elena|dalia|female/i.test(norm);
        return {
            lang,
            genero: esMujer ? 'mujer' : 'hombre',
            nombre: nombreOId || 'Google español',
            etiqueta: nombreOId || 'Google español (España - Hombre)',
            id: nombreOId || 'Google español (Google)'
        };
    }

    /**
     * Resuelve la voz nativa de SpeechSynthesis en el navegador
     */
    resolverVozNativa(valOId = null) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

        const valGuardado = (valOId || localStorage.getItem('pref-tts-voice') || '').toLowerCase();
        const voices = window.speechSynthesis.getVoices() || [];
        if (voices.length === 0) return null;

        // 1. Coincidencia exacta por nombre
        const exacta = voices.find(v => (v.name || '').toLowerCase() === valGuardado);
        if (exacta) return exacta;

        const cfg = this.determinarConfigVoz(valGuardado);
        const esMujer = cfg.genero === 'mujer';

        // 2. Coincidencia por proveedor Google + idioma
        let encontrada = voices.find(v => {
            const vn = (v.name || '').toLowerCase();
            const vl = (v.lang || '').toLowerCase();
            const esGoogle = vn.includes('google');
            if (!esGoogle) return false;
            if (cfg.lang === 'es-US') return vn.includes('estados unidos') || vl.startsWith('es-us');
            if (cfg.lang === 'es-MX') return vn.includes('méxico') || vn.includes('mexico') || vl.startsWith('es-mx');
            return !vn.includes('estados unidos') && !vn.includes('mexico') && (vl.startsWith('es-es') || vl.startsWith('es'));
        });

        // 3. Coincidencia por género y dialecto
        if (!encontrada) {
            encontrada = voices.find(v => {
                const vl = (v.lang || '').toLowerCase();
                const esMatchLang = vl.startsWith(cfg.lang.toLowerCase().split('-')[0]);
                return esMatchLang;
            });
        }

        // Fallback genérico a cualquier voz en español
        if (!encontrada) {
            encontrada = voices.find(v => (v.lang || '').toLowerCase().startsWith('es')) || voices[0] || null;
        }

        return encontrada;
    }

    /**
     * Prueba inmediata de voz para los botones de ajuste y al cambiar de opción
     */
    async probarVoz(tipo = 'lectura', textoMuestra = null) {
        const storageKey = tipo === 'descarga' ? 'pref-tts-download-voice' : 'pref-tts-voice';
        const valGuardado = localStorage.getItem(storageKey) || 'Google español (Google)';
        const cfg = this.determinarConfigVoz(valGuardado);
        const esMujer = cfg.genero === 'mujer';
        const langCode = cfg.lang;

        // Si es prueba de "descarga", reproducir directamente el MP3 de Google TTS a 40kbps del servicio local si está activo
        if (tipo === 'descarga') {
            const txtPrueba = textoMuestra || `Liturgia de las Horas. Probando audio para descargar con ${cfg.etiqueta}.`;
            const basesAProbar = [
                'http://127.0.0.1:4000',
                'https://lh.laantillana.com:4001',
                'http://localhost:4000'
            ];
            for (const b of basesAProbar) {
                try {
                    const audioUrl = `${b}/api/tts-chunk?text=${encodeURIComponent(txtPrueba)}&lang=${encodeURIComponent(langCode)}&voice=${encodeURIComponent(cfg.genero)}`;
                    const aud = new Audio(audioUrl);
                    await aud.play();
                    return;
                } catch (_) {}
            }
        }

        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert('Tu navegador no soporta síntesis de voz.');
            return;
        }

        window.speechSynthesis.cancel();

        const texto = textoMuestra || (tipo === 'descarga' 
            ? `Liturgia de las Horas. Probando audio para descargar con ${cfg.etiqueta}.`
            : `Liturgia de las Horas. Esta es una muestra con voz de ${esMujer ? 'mujer' : 'hombre'}.`
        );

        const utter = new SpeechSynthesisUtterance(texto);
        const vozNativa = this.resolverVozNativa(valGuardado);
        if (vozNativa) utter.voice = vozNativa;
        utter.lang = langCode;

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
            // 1. EXTRAER EL CONTENIDO LITÚRGICO EXACTO ACTIVO EN PANTALLA
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

            const hashTexto = await calcularHashTexto(texto || partes.join(' '));

            // ------------------------------------------------------------------
            // 2. DETECTAR SI EL SERVICIO LOCAL ESTÁ ACTIVO (HTTP / HTTPS)
            // ------------------------------------------------------------------
            const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
            const basesAProbar = isHttps ? [
                'https://lh.laantillana.com:4001',
                'https://127.0.0.1:4001',
                'https://localhost:4001',
                'http://127.0.0.1:4000',
                'http://localhost:4000'
            ] : [
                'http://127.0.0.1:4000',
                'http://localhost:4000',
                'https://lh.laantillana.com:4001',
                'https://127.0.0.1:4001'
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

            // ------------------------------------------------------------------
            // 3. PRIORIDAD ABSOLUTA: GENERACIÓN CON VOZ DE GOOGLE A 40kbps
            // Garantiza que lo que se descarga es EXACTAMENTE lo que está en pantalla
            // ------------------------------------------------------------------
            if (activeBaseUrl) {
                const valGuardado = localStorage.getItem('pref-tts-download-voice') || localStorage.getItem('pref-tts-voice') || '';
                const cfgVoz = this.determinarConfigVoz(valGuardado);
                const voiceKey = `${cfgVoz.lang}-${cfgVoz.genero}`;
                const langDescarga = cfgVoz.lang || 'es-ES';

                // Paso 3a: Comprobar si ya existe un audio generado a 40kbps para este EXACTO texto y voz
                if (hashTexto) {
                    try {
                        const rCheck = await fetch(`${activeBaseUrl}/api/check-audio?filename=${encodeURIComponent(filename)}&semana=${encodeURIComponent(semana)}&dia=${encodeURIComponent(dia)}&textHash=${encodeURIComponent(hashTexto)}&voice=${encodeURIComponent(voiceKey)}&_cb=${Date.now()}`);
                        if (rCheck.ok) {
                            const checkJson = await rCheck.json();
                            if (checkJson.cached && checkJson.url) {
                                actualizarReloj(50, 'Descargando audio (40kbps)...');
                                const resAudio = await fetch(`${activeBaseUrl}${checkJson.url}?_cb=${Date.now()}`);
                                if (resAudio.ok) {
                                    const blob = await resAudio.blob();
                                    if (blob && blob.size > 0) {
                                        actualizarReloj(100, 'Listo (40kbps)');
                                        dispararDescargaBlob(blob, filename);
                                        if (cinta && typeof cinta.mostrarToastAviso === 'function') {
                                            cinta.mostrarToastAviso(`¡${filename} (40kbps) descargado exitosamente!`, 4000);
                                        }
                                        limpiarReloj();
                                        return true;
                                    }
                                }
                            }
                        }
                    } catch (_) {}
                }

                // Paso 3b: Si no está en caché o el texto/voz cambió, sintetizar en vivo los fragmentos
                if (partes.length > 0) {
                    actualizarReloj(0, `0/${partes.length} partes`);
                    if (cinta && typeof cinta.mostrarToastAviso === 'function') {
                        cinta.mostrarToastAviso(`Generando audio '${filename}' (${partes.length} fragmentos a 40kbps)...`, 3500);
                    }

                    const buffers = [];
                    for (let i = 0; i < partes.length; i++) {
                        const pct = Math.max(1, Math.min(99, Math.round(((i + 1) / partes.length) * 100)));
                        actualizarReloj(pct, `${i + 1}/${partes.length} partes`);

                        const chunkUrl = `${activeBaseUrl}/api/tts-chunk?text=${encodeURIComponent(partes[i])}&lang=${encodeURIComponent(langDescarga)}&voice=${encodeURIComponent(cfgVoz.genero)}`;
                        const resChunk = await fetch(chunkUrl);
                        if (!resChunk.ok) throw new Error(`HTTP ${resChunk.status}`);
                        const ab = await resChunk.arrayBuffer();
                        if (ab && ab.byteLength > 0) buffers.push(ab);
                    }

                    if (buffers.length > 0) {
                        actualizarReloj(99, 'Optimizando a 40kbps...');
                        const rawBlob = new Blob(buffers, { type: 'audio/mpeg' });
                        let blobFinalDescarga = rawBlob;

                        try {
                            const resSave = await fetch(`${activeBaseUrl}/api/save-audio?filename=${encodeURIComponent(filename)}&semana=${encodeURIComponent(semana)}&dia=${encodeURIComponent(dia)}&textHash=${encodeURIComponent(hashTexto)}&voice=${encodeURIComponent(voiceKey)}&returnAudio=1`, {
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
                            console.warn('[DbAudioDescarga] Error en save-audio:', saveErr);
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
            // 4. FALLBACK CUANDO EL SERVICIO LOCAL NO ESTÁ DISPONIBLE (MODO REMOTO)
            // ------------------------------------------------------------------
            if (!activeBaseUrl) {
                const semPad = String(semana).padStart(2, '0');
                const urlsAProbar = [
                    url,
                    `https://to.resucito.do/s${semPad}/${dia}/${filename}`
                ].filter(Boolean);

                for (const urlCandidata of urlsAProbar) {
                    const fetchUrl = urlCandidata.includes('?') ? `${urlCandidata}&_cb=${Date.now()}` : `${urlCandidata}?_cb=${Date.now()}`;
                    try {
                        const res = await fetch(fetchUrl);
                        const cType = (res.headers.get('content-type') || '').toLowerCase();

                        if (res.ok && !cType.includes('text/html') && (cType.includes('audio') || cType.includes('octet-stream') || urlCandidata.endsWith('.mp3'))) {
                            const blobFinal = await res.blob();
                            // Seguridad: Rechazar archivos mayores a 7.5MB (192kbps antiguos u otras voces no deseadas)
                            // A 40kbps un audio de Oficio completo de 18 min no supera 6.5 MB.
                            if (blobFinal && blobFinal.size > 0 && blobFinal.size < 7800000) {
                                actualizarReloj(100, 'Listo');
                                dispararDescargaBlob(blobFinal, filename);
                                limpiarReloj();
                                return true;
                            } else if (blobFinal && blobFinal.size >= 7800000) {
                                console.warn('[DbAudioDescarga] Archivo remoto descartado por sobrepasar tamaño de 40kbps:', blobFinal.size);
                            }
                        }
                    } catch (_) {}
                }
            }

            // ------------------------------------------------------------------
            // 5. AVISO INFORMATIVO (NUNCA DESCARGAR .TXT)
            // ------------------------------------------------------------------
            if (cinta && typeof cinta.mostrarToastAviso === 'function') {
                cinta.mostrarToastAviso(`Iniciando descarga de '${filename}'. Si no arranca, activa el servicio local en el puerto 4000.`, 6000);
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
