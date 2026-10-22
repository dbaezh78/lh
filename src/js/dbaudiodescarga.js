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
            // 1. DESCARGA DIRECTA DE LA NUBE (to.resucito.do) CON PROGRESO STREAM
            // ------------------------------------------------------------------
            const semPad = String(semana).padStart(2, '0');
            const urlRemota = url || `https://to.resucito.do/s${semPad}/${dia}/${filename}`;

            if (urlRemota) {
                // Añadir cache buster para evitar que el navegador use un 404 anterior en caché
                const fetchUrl = urlRemota.includes('?') ? `${urlRemota}&_cb=${Date.now()}` : `${urlRemota}?_cb=${Date.now()}`;
                try {
                    const res = await fetch(fetchUrl);
                    const cType = (res.headers.get('content-type') || '').toLowerCase();

                    if (res.ok && !cType.includes('text/html')) {
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
                                    cinta.audiosFallidos.delete(urlRemota);
                                    cinta.audiosFallidos.delete(url);
                                }
                                if (typeof cinta.mostrarToastAviso === 'function') {
                                    cinta.mostrarToastAviso(`¡${filename} descargado exitosamente desde el servidor!`, 4000);
                                }
                            }
                            limpiarReloj();
                            return true;
                        }
                    }
                } catch (netErr) {
                    console.warn('[DbAudioDescarga] Petición remota falló, intentando alternativas:', netErr);
                }
            }

            // ------------------------------------------------------------------
            // 2. ENTORNO LOCAL CON SERVICIO DE AUDIO (PUERTO 4000)
            // ------------------------------------------------------------------
            const esLocal = (typeof window !== 'undefined') && (
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                window.location.protocol === 'file:'
            );

            if (esLocal && textoLiturgico && textoLiturgico.trim()) {
                const valGuardado = localStorage.getItem('pref-tts-download-voice') || localStorage.getItem('pref-tts-voice') || '';
                const esMujer = valGuardado.toLowerCase().includes('estados unidos') || valGuardado.toLowerCase().includes('mujer');
                const langDescarga = esMujer ? 'es-US' : 'es-ES';

                // Subdividir texto para sintetizar
                const oraciones = textoLiturgico.match(/[^.!?;\n]+[.!?;\n]*|\s+/g) || [textoLiturgico];
                const partes = [];
                let cur = '';
                for (const seg of oraciones) {
                    if ((cur.length + seg.length) > 140 && cur.trim()) {
                        partes.push(cur.trim());
                        cur = seg;
                    } else {
                        cur += seg;
                    }
                }
                if (cur.trim()) partes.push(cur.trim());

                actualizarReloj(0, `0/${partes.length} partes`);
                const activeBaseUrl = 'http://127.0.0.1:4000';

                try {
                    const ctrl = new AbortController();
                    const tm = setTimeout(() => ctrl.abort(), 800);
                    const r = await fetch(`${activeBaseUrl}/status`, { signal: ctrl.signal });
                    clearTimeout(tm);

                    if (r.ok) {
                        const buffers = [];
                        for (let i = 0; i < partes.length; i++) {
                            const pct = Math.round(((i + 1) / partes.length) * 100);
                            actualizarReloj(pct, `${i + 1}/${partes.length} partes`);

                            const chunkUrl = `${activeBaseUrl}/api/tts-chunk?text=${encodeURIComponent(partes[i])}&lang=${encodeURIComponent(langDescarga)}`;
                            const resChunk = await fetch(chunkUrl);
                            if (!resChunk.ok) throw new Error(`HTTP ${resChunk.status}`);
                            const ab = await resChunk.arrayBuffer();
                            if (ab && ab.byteLength > 0) buffers.push(ab);
                        }

                        if (buffers.length > 0) {
                            const mp3Blob = new Blob(buffers, { type: 'audio/mpeg' });
                            dispararDescargaBlob(mp3Blob, filename);

                            // Guardar en repositorio local
                            try {
                                fetch(`${activeBaseUrl}/api/save-audio?filename=${encodeURIComponent(filename)}&semana=${encodeURIComponent(semana)}&dia=${encodeURIComponent(dia)}`, {
                                    method: 'POST',
                                    body: mp3Blob,
                                    headers: { 'Content-Type': 'audio/mpeg' }
                                }).catch(() => {});
                            } catch (_) {}

                            if (cinta && typeof cinta.mostrarToastAviso === 'function') {
                                cinta.mostrarToastAviso(`¡${filename} generado y descargado exitosamente!`, 4000);
                            }
                            limpiarReloj();
                            return true;
                        }
                    }
                } catch (localErr) {
                    console.warn('[DbAudioDescarga] Servicio local no disponible:', localErr);
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
