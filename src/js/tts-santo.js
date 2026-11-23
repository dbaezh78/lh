/**
 * TTS (Text-to-Speech) para Lectura de Santos — Liturgia de las Horas
 * Lee la información del santo abierta en el modal usando SpeechSynthesis.
 * Soporta barra interactiva de progreso (adelantar/retroceder arrastrando o haciendo clic),
 * pausar/continuar, word boundary tracking y configuración de voz/velocidad.
 */

import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';

// Estado global de reproducción y seguimiento de lectura
export const currentSpeechState = {
    santoId: null,
    fullText: '',
    chunks: [],
    currentChunkIndex: 0,
    currentCharIndex: 0,
    isSpeaking: false,
    timerId: null,
    heartbeatId: null,
    utterance: null
};

// Precalentar voces en navegadores basados en Chromium
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}

let isDraggingTrack = false;
let listenersAttached = false;

/**
 * Obtiene la voz configurada por el usuario en Ajustes o una alternativa adecuada en español
 */
export function obtenerVozConfigurada() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    if (typeof window !== 'undefined' && window.dbAudioDescarga && typeof window.dbAudioDescarga.resolverVozNativa === 'function') {
        const v = window.dbAudioDescarga.resolverVozNativa();
        if (v) return v;
    }

    let vozGuardada = localStorage.getItem('pref-tts-voice') || '';
    if (vozGuardada && (vozGuardada.toLowerCase().includes('raul') || vozGuardada.toLowerCase().includes('sabina') || vozGuardada.toLowerCase().includes('jorge') || vozGuardada.toLowerCase().includes('dalia'))) {
        try { localStorage.removeItem('pref-tts-voice'); } catch (_) {}
        vozGuardada = '';
    }

    const voices = window.speechSynthesis.getVoices() || [];
    let vozElegida = null;

    if (vozGuardada) {
        const vg = vozGuardada.toLowerCase();
        const esEEUU = vg.includes('estados unidos') || vg.includes('es-us') || vg.includes('mujer');
        vozElegida = voices.find(v => v.name === vozGuardada || v.name.toLowerCase() === vg);

        if (!vozElegida) {
            if (esEEUU) {
                vozElegida = voices.find(v => {
                    const vn = v.name.toLowerCase();
                    return vn.includes('google') && (vn.includes('estados unidos') || (v.lang || '').toLowerCase().startsWith('es-us'));
                });
            } else {
                vozElegida = voices.find(v => {
                    const vn = v.name.toLowerCase();
                    return vn.includes('google') && vn.includes('español') && !vn.includes('estados unidos');
                });
            }
        }
    }

    if (!vozElegida) {
        vozElegida = voices.find(v => {
            const vn = v.name.toLowerCase();
            return vn.includes('google') && vn.includes('español') && !vn.includes('estados unidos');
        })
        || voices.find(v => v.name.toLowerCase().includes('google') && (v.name.toLowerCase().includes('estados unidos') || (v.lang || '').toLowerCase().startsWith('es-us')))
        || voices.find(v => (v.lang || '').toLowerCase().startsWith('es'));
    }
    return vozElegida;
}

/**
 * Obtiene la velocidad configurada por el usuario en Ajustes (entre 0.5 y 2.0)
 */
export function obtenerRateConfigurado() {
    if (typeof window === 'undefined') return 1.0;
    const rateGuardado = localStorage.getItem('pref-tts-rate');
    if (rateGuardado === null || rateGuardado === '1.3') {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pref-tts-rate', '1');
        }
        return 1.0;
    }
    const r = parseFloat(rateGuardado);
    return (!isNaN(r) && r >= 0.5 && r <= 2.0) ? r : 1.0;
}

/**
 * Limpia los temporizadores activos (interpolación y heartbeat de Chrome)
 */
function limpiarTemporizadores() {
    if (currentSpeechState.timerId) {
        clearInterval(currentSpeechState.timerId);
        currentSpeechState.timerId = null;
    }
    if (currentSpeechState.heartbeatId) {
        clearInterval(currentSpeechState.heartbeatId);
        currentSpeechState.heartbeatId = null;
    }
}

/**
 * Heartbeat para evitar que Chrome corte automáticamente el audio tras ~15 segundos
 */
function iniciarHeartbeat() {
    if (currentSpeechState.heartbeatId) clearInterval(currentSpeechState.heartbeatId);
    currentSpeechState.heartbeatId = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking && currentSpeechState.isSpeaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        } else {
            if (currentSpeechState.heartbeatId) {
                clearInterval(currentSpeechState.heartbeatId);
                currentSpeechState.heartbeatId = null;
            }
        }
    }, 10000);
}

// ==========================================
// CONTROL DE PROGRESO CIRCULAR DE LA BOCINA (TTS)
// ==========================================
const CIRCUNFERENCIA_CIRCULO = 109.96; // 2 * Math.PI * 17.5 (r=17.5 en viewBox="0 0 42 42")
const CIRCUNFERENCIA_PORTADA = 84.82;  // 2 * Math.PI * 13.5 (r=13.5 en viewBox="0 0 32 32")
let ttsCargaTimer = null;
let ttsCargaActiva = false;
let ttsAudioIniciado = false;

export function asegurarAnilloCircularTTS() {
    const btn = document.getElementById('btn-leer-voz-santo');
    if (!btn) return null;
    let bar = document.getElementById('tts-circular-bar');
    if (!bar) {
        let svg = btn.querySelector('.tts-circular-ring');
        if (!svg) {
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'tts-circular-ring');
            svg.setAttribute('viewBox', '0 0 42 42');
            svg.innerHTML = `
                <circle class="tts-circular-bg" cx="21" cy="21" r="17.5"></circle>
                <circle class="tts-circular-bar" id="tts-circular-bar" cx="21" cy="21" r="17.5"></circle>
            `;
            btn.insertBefore(svg, btn.firstChild);
        }
        bar = document.getElementById('tts-circular-bar');
    }
    return bar;
}

export function fijarProgresoCircular(porcentaje) {
    const clamped = Math.min(100, Math.max(0, porcentaje));
    const bar = asegurarAnilloCircularTTS();
    if (bar) {
        const offset = CIRCUNFERENCIA_CIRCULO - (CIRCUNFERENCIA_CIRCULO * (clamped / 100));
        bar.style.strokeDashoffset = offset.toFixed(2);
    }
    const barPortada = document.getElementById('tts-portada-circular-bar');
    if (barPortada) {
        const offsetP = CIRCUNFERENCIA_PORTADA - (CIRCUNFERENCIA_PORTADA * (clamped / 100));
        barPortada.style.strokeDashoffset = offsetP.toFixed(2);
    }
}

export function resetearAnimacionCargaCircular() {
    ttsCargaActiva = false;
    ttsAudioIniciado = false;
    if (ttsCargaTimer) {
        clearInterval(ttsCargaTimer);
        ttsCargaTimer = null;
    }
    const btn = document.getElementById('btn-leer-voz-santo');
    if (btn) {
        btn.classList.remove('cargando-tts');
        btn.classList.remove('speaking');
    }
    const btnPortada = document.getElementById('btn-tts-portada-santo');
    if (btnPortada) {
        btnPortada.classList.remove('cargando-tts');
        btnPortada.classList.remove('speaking');
    }
    fijarProgresoCircular(0);
}

export function completarAnimacionCargaCircular() {
    ttsCargaActiva = false;
    if (ttsCargaTimer) {
        clearInterval(ttsCargaTimer);
        ttsCargaTimer = null;
    }
    const btn = document.getElementById('btn-leer-voz-santo');
    if (btn) {
        btn.classList.remove('cargando-tts');
        if (currentSpeechState.isSpeaking) {
            btn.classList.add('speaking');
        }
    }
    const btnPortada = document.getElementById('btn-tts-portada-santo');
    if (btnPortada) {
        btnPortada.classList.remove('cargando-tts');
        if (currentSpeechState.isSpeaking) {
            btnPortada.classList.add('speaking');
        }
    }
    fijarProgresoCircular(100);
}

export function iniciarAnimacionCargaCircular(onTreintaPorCiento, onCompletado) {
    resetearAnimacionCargaCircular();
    const btn = document.getElementById('btn-leer-voz-santo');
    if (btn) {
        btn.classList.add('cargando-tts');
        btn.classList.remove('speaking');
    }
    const btnPortada = document.getElementById('btn-tts-portada-santo');
    if (btnPortada) {
        btnPortada.classList.add('cargando-tts');
        btnPortada.classList.remove('speaking');
    }
    fijarProgresoCircular(0);
    ttsCargaActiva = true;
    ttsAudioIniciado = false;

    const duracionTotalMs = 600; // duración total de llenado del círculo
    const tiempoInicio = performance.now();

    ttsCargaTimer = setInterval(() => {
        if (!ttsCargaActiva) {
            clearInterval(ttsCargaTimer);
            return;
        }
        const transcurrido = performance.now() - tiempoInicio;
        const progresoTotal = Math.min(100, (transcurrido / duracionTotalMs) * 100);

        fijarProgresoCircular(progresoTotal);

        // Cuando se ha cargado el 30%, ejecutar acción de inicio de audio
        if (progresoTotal >= 30 && !ttsAudioIniciado) {
            ttsAudioIniciado = true;
            if (typeof onTreintaPorCiento === 'function') {
                onTreintaPorCiento();
            }
        }

        // Al completarse el 100%, pasar a estado speaking completado
        if (progresoTotal >= 100) {
            completarAnimacionCargaCircular();
            if (typeof onCompletado === 'function') {
                onCompletado();
            }
        }
    }, 20);
}

/**
 * Pausa la locución conservando la posición actual de la barra de progreso
 */
export function pausarLecturaSantoVoz() {
    currentSpeechState.isSpeaking = false;
    limpiarTemporizadores();
    resetearAnimacionCargaCircular();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    currentSpeechState.utterance = null;
    if (typeof window !== 'undefined') window.currentTTSUtterance = null;
    actualizarEstadoIconoVoz(false);
}

/**
 * Detiene completamente la locución y reinicia la barra de progreso a cero
 */
export function detenerLecturaSantoVoz() {
    pausarLecturaSantoVoz();
    resetearAnimacionCargaCircular();
    currentSpeechState.currentCharIndex = 0;
    currentSpeechState.currentChunkIndex = 0;
    if (typeof window !== 'undefined' && window._santoAudioPlayer) {
        try {
            window._santoAudioPlayer.pause();
            window._santoAudioPlayer.currentTime = 0;
        } catch (_) {}
        window._santoAudioPlayer = null;
    }
    const bar = document.getElementById('santo-speech-progress-bar');
    if (bar) bar.style.width = '0%';
    if (typeof window !== 'undefined') {
        window.santoFilaHablandoIdx = null;
        window.reproduciendoSantoPortada = false;
    }
    actualizarEstadoIconoVoz(false);
}

/**
 * Divide el texto completo en fragmentos oracionales naturales de tamaño óptimo (<= 170 caracteres).
 * Esto evita el límite de búfer y cuelgues de audio en Chromium para textos extensos.
 */
export function dividirEnFrasesLectura(texto, maxLen = 130) {
    if (!texto || !texto.trim()) return [];

    const limpio = texto
        .replace(/[“”«»]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/—/g, ', ')
        .replace(/\u00A0/g, ' ')
        .trim();

    const chunks = [];
    const oraciones = limpio.match(/[^.!?;\n]+[.!?;\n]*|\s+/g) || [limpio];

    let curChunk = '';
    let curStart = 0;
    let runningIdx = 0;

    const agregarTrozo = (trozo, start, end) => {
        trozo = (trozo || '').trim();
        if (!trozo) return;
        if (trozo.length <= maxLen) {
            chunks.push({ text: trozo, start: start, end: end });
            return;
        }
        // Subdividir por comas, dos puntos o punto y coma
        const subPartes = trozo.match(/[^,;:]+[,;:]*|\s+/g) || [trozo];
        let subCur = '';
        let subStart = start;
        let subRunning = start;
        for (const sp of subPartes) {
            const spLen = sp.length;
            if ((subCur.length + spLen) > maxLen && subCur.trim().length > 0) {
                agregarTrozo(subCur, subStart, subStart + subCur.length);
                subStart = subRunning;
                subCur = sp;
            } else {
                if (!subCur) subStart = subRunning;
                subCur += sp;
            }
            subRunning += spLen;
        }
        if (subCur.trim().length > 0) {
            if (subCur.trim().length > maxLen) {
                // Si aún supera maxLen, dividir por palabras
                const palabras = subCur.trim().split(/\s+/);
                let pCur = '';
                let pStart = subStart;
                for (const p of palabras) {
                    if ((pCur.length + p.length + 1) > maxLen && pCur.length > 0) {
                        chunks.push({ text: pCur.trim(), start: pStart, end: pStart + pCur.length });
                        pStart += pCur.length + 1;
                        pCur = p;
                    } else {
                        pCur += (pCur ? ' ' : '') + p;
                    }
                }
                if (pCur.trim()) {
                    chunks.push({ text: pCur.trim(), start: pStart, end: end });
                }
            } else {
                chunks.push({ text: subCur.trim(), start: subStart, end: end });
            }
        }
    };

    for (const seg of oraciones) {
        const segLen = seg.length;
        if (curChunk.length + segLen > maxLen && curChunk.trim().length > 0) {
            agregarTrozo(curChunk, curStart, curStart + curChunk.length);
            curStart = runningIdx;
            curChunk = seg;
        } else {
            if (!curChunk) curStart = runningIdx;
            curChunk += seg;
        }
        runningIdx += segLen;
    }

    if (curChunk.trim().length > 0) {
        agregarTrozo(curChunk, curStart, limpio.length);
    }

    return chunks;
}

/**
 * Reproduce un archivo de audio MP3 para el santo (santo.mp3) sincronizado con barra y anillo
 */
export function reproducirAudioMP3Santo(url) {
    if (typeof window === 'undefined') return;
    if (window._santoAudioPlayer) {
        try { window._santoAudioPlayer.pause(); } catch (_) {}
        window._santoAudioPlayer = null;
    }
    // Detener cualquier síntesis de voz Web Speech activa
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    currentSpeechState.isSpeaking = false;

    const audio = new Audio(url);
    window._santoAudioPlayer = audio;
    window._santoAudioUrlActual = url;

    const bar = document.getElementById('santo-speech-progress-bar');
    const track = document.getElementById('santo-speech-progress-track');

    audio.addEventListener('timeupdate', () => {
        if (audio.duration && !isNaN(audio.duration)) {
            const pct = Math.min(100, Math.max(0, (audio.currentTime / audio.duration) * 100));
            if (bar) bar.style.width = `${pct}%`;
            fijarProgresoCircular(pct);
        }
    });

    audio.addEventListener('play', () => {
        actualizarEstadoIconoVoz(true);
    });

    audio.addEventListener('pause', () => {
        actualizarEstadoIconoVoz(false);
    });

    audio.addEventListener('ended', () => {
        actualizarEstadoIconoVoz(false);
        if (bar) bar.style.width = '0%';
        resetearAnimacionCargaCircular();
        window._santoAudioPlayer = null;
    });

    if (track && !track._clickMp3Bound) {
        track._clickMp3Bound = true;
        track.addEventListener('click', (e) => {
            if (!window._santoAudioPlayer || !window._santoAudioPlayer.duration) return;
            const rect = track.getBoundingClientRect();
            const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const frac = clickX / rect.width;
            window._santoAudioPlayer.currentTime = frac * window._santoAudioPlayer.duration;
        });
    }

    iniciarAnimacionCargaCircular(
        () => {
            audio.play().catch(err => {
                console.warn('Auto-play santo.mp3 error:', err);
                actualizarEstadoIconoVoz(false);
            });
        },
        () => {
            actualizarEstadoIconoVoz(true);
        }
    );
}

/**
 * Inicia o pausa la lectura en voz alta del santo actual en el modal
 */
export async function toggleLeerSantoVoz() {
    // Si hay un reproductor de audio MP3 físico activo
    if (typeof window !== 'undefined' && window._santoAudioPlayer) {
        if (!window._santoAudioPlayer.paused) {
            window._santoAudioPlayer.pause();
            actualizarEstadoIconoVoz(false);
            return;
        } else {
            window._santoAudioPlayer.play();
            actualizarEstadoIconoVoz(true);
            return;
        }
    }

    // Si ya está hablando o en proceso de carga circular, pausar
    if (currentSpeechState.isSpeaking || ttsCargaActiva) {
        pausarLecturaSantoVoz();
        return;
    }

    // Comprobar si existe el audio MP3 físico del santo antes de recurrir a la voz sintética
    if (typeof window !== 'undefined') {
        const s = window.santoActualDetalle;
        if (s) {
            const urlsAProbar = [];
            if (window._santoAudioUrlActual) urlsAProbar.push(window._santoAudioUrlActual);
            
            if (typeof window.autodetectarCarpetaSanto === 'function') {
                const auto = window.autodetectarCarpetaSanto(s.nombre, s.celebracion || s.fechaFestividad);
                if (auto && auto.basePath) {
                    urlsAProbar.push(`${auto.basePath}santo.mp3`);
                }
                if (auto && auto.subRuta) {
                    urlsAProbar.push(`http://127.0.0.1:4000/${encodeURI(auto.subRuta)}/santo.mp3`);
                    urlsAProbar.push(`http://127.0.0.1:4000/santos/${encodeURI(auto.subRuta)}/santo.mp3`);
                }
            }

            for (const cand of urlsAProbar) {
                try {
                    const ctrl = new AbortController();
                    const tm = setTimeout(() => ctrl.abort(), 800);
                    const resp = await fetch(cand, { method: 'HEAD', signal: ctrl.signal });
                    clearTimeout(tm);
                    if (resp.ok) {
                        reproducirAudioMP3Santo(cand);
                        return;
                    }
                } catch (_) {}
            }
        }
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        alert('Tu navegador no soporta la función de lectura por voz (SpeechSynthesis).');
        return;
    }

    // Si no está hablando ni hay MP3, reproducir con SpeechSynthesis desde la posición actual
    reproducirVoz();
}

/**
 * Inicia, pausa o reanuda la lectura en voz alta directamente desde el botón de la fila de la tabla
 */
export function toggleLeerSantoVozFila(idx, santo) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        alert('Tu navegador no soporta la función de lectura por voz (SpeechSynthesis).');
        return;
    }

    if (!santo) return;

    // Si ya se está reproduciendo este mismo santo
    if (window.santoFilaHablandoIdx === idx) {
        if (currentSpeechState.isSpeaking || ttsCargaActiva) {
            pausarLecturaSantoVoz();
            return;
        } else if (currentSpeechState.currentCharIndex > 0) {
            reproducirVoz();
            return;
        }
    }

    // Santo diferente o no había ninguno activo
    detenerLecturaSantoVoz();
    window.santoFilaHablandoIdx = idx;
    prepararBarraProgresoSanto(santo);
    reproducirVoz();
}

/**
 * Inicia, pausa o reanuda la lectura en voz alta del santo del día directamente desde el botón de la portada
 */
export function toggleLeerSantoPortada(santoParam) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        alert('Tu navegador no soporta la función de lectura por voz (SpeechSynthesis).');
        return;
    }

    const s = santoParam || window.santoDelDiaObjeto || window.santoActualDetalle;
    if (!s) {
        alert('No hay información disponible para leer.');
        return;
    }

    // Si ya se está reproduciendo el santo de portada
    if (window.reproduciendoSantoPortada) {
        if (currentSpeechState.isSpeaking || ttsCargaActiva) {
            pausarLecturaSantoVoz();
            return;
        } else if (currentSpeechState.currentCharIndex > 0) {
            if (typeof window.mostrarBarraProgresoPortada === 'function') {
                window.mostrarBarraProgresoPortada('santo');
            }
            reproducirVoz();
            return;
        }
    }

    // Detener cualquier otra lectura e iniciar la del santo de portada
    if (typeof window !== 'undefined' && typeof window.pausarEvangelioPortada === 'function') {
        window.pausarEvangelioPortada();
    }
    detenerLecturaSantoVoz();
    window.reproduciendoSantoPortada = true;
    prepararBarraProgresoSanto(s);
    if (typeof window !== 'undefined') {
        if (typeof window.mostrarBarraProgresoPortada === 'function') {
            window.mostrarBarraProgresoPortada('santo');
        }
        if (typeof window.actualizarBarraProgresoPortada === 'function') {
            window.actualizarBarraProgresoPortada(0, currentSpeechState.totalDurationSecs || 30, 0);
        }
    }
    reproducirVoz();
}

/**
 * Reproduce el texto a partir de currentSpeechState.currentCharIndex mediante fragmentos oracionales
 */
export function reproducirVoz() {
    prepararTextoCompleto();
    if (!currentSpeechState.fullText) {
        alert('No hay información disponible para leer.');
        return;
    }

    // Cancelar cualquier locución previa de forma síncrona
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    }

    // Si la posición guardada es el final o excede, reiniciar al principio
    if (currentSpeechState.currentCharIndex >= currentSpeechState.fullText.length) {
        currentSpeechState.currentCharIndex = 0;
        currentSpeechState.currentChunkIndex = 0;
    }

    if (!currentSpeechState.chunks || currentSpeechState.chunks.length === 0) {
        currentSpeechState.chunks = dividirEnFrasesLectura(currentSpeechState.fullText, 170);
    }

    // Localizar el chunk correspondiente a currentCharIndex
    let targetIndex = currentSpeechState.chunks.findIndex(c => currentSpeechState.currentCharIndex < c.end);
    if (targetIndex === -1) targetIndex = 0;
    currentSpeechState.currentChunkIndex = targetIndex;

    // Iniciar animación circular: se llena hasta el 30%, allí arranca el audio, y continúa llenándose hasta el 100%
    iniciarAnimacionCargaCircular(
        () => {
            // Callback al alcanzar el 30%: arrancar la locución del chunk actual
            reproducirChunkActual();
        },
        () => {
            // Callback al completarse el 100% del círculo
            if (currentSpeechState.isSpeaking) {
                actualizarEstadoIconoVoz(true);
            }
        }
    );
}

/**
 * Reproduce el fragmento (chunk) actual de la secuencia de lectura
 */
function reproducirChunkActual() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!currentSpeechState.chunks || currentSpeechState.currentChunkIndex >= currentSpeechState.chunks.length) {
        finalizarLecturaCompleta();
        return;
    }

    const chunk = currentSpeechState.chunks[currentSpeechState.currentChunkIndex];
    if (!chunk || !chunk.text) {
        finalizarLecturaCompleta();
        return;
    }

    let offsetInChunk = 0;
    let textoChunk = chunk.text;
    if (currentSpeechState.currentCharIndex > chunk.start && currentSpeechState.currentCharIndex < chunk.end) {
        offsetInChunk = currentSpeechState.currentCharIndex - chunk.start;
        // Evitar cortar palabras al buscar por seek
        if (offsetInChunk > 0 && offsetInChunk < chunk.text.length) {
            const prevSpace = chunk.text.lastIndexOf(' ', offsetInChunk);
            if (prevSpace !== -1 && (offsetInChunk - prevSpace < 15)) {
                offsetInChunk = prevSpace + 1;
            }
        }
        textoChunk = chunk.text.slice(offsetInChunk).trim();
        if (!textoChunk) {
            currentSpeechState.currentChunkIndex++;
            currentSpeechState.currentCharIndex = chunk.end;
            reproducirChunkActual();
            return;
        }
    }

    const vozElegida = obtenerVozConfigurada();
    const rateFinal = obtenerRateConfigurado();

    const utterance = new SpeechSynthesisUtterance(textoChunk);
    utterance.lang = (vozElegida && vozElegida.lang) ? vozElegida.lang : 'es-MX';
    utterance.rate = rateFinal;
    if (vozElegida) utterance.voice = vozElegida;

    currentSpeechState.utterance = utterance;
    if (typeof window !== 'undefined') window.currentTTSUtterance = utterance;

    const bar = document.getElementById('santo-speech-progress-bar');

    utterance.onboundary = (e) => {
        if (e.charIndex !== undefined && currentSpeechState.fullText) {
            const absChar = Math.min(chunk.end, chunk.start + offsetInChunk + e.charIndex);
            currentSpeechState.currentCharIndex = absChar;
            const percent = Math.min(100, Math.max(0, (absChar / currentSpeechState.fullText.length) * 100));
            if (bar) bar.style.width = percent + '%';
            if (window.reproduciendoSantoPortada && typeof window.actualizarBarraProgresoPortada === 'function') {
                const totalS = currentSpeechState.totalDurationSecs || 30;
                window.actualizarBarraProgresoPortada((percent / 100) * totalS, totalS, percent);
            }
        }
    };

    utterance.onstart = () => {
        currentSpeechState.isSpeaking = true;
        actualizarEstadoIconoVoz(true);
        iniciarHeartbeat();

        const words = textoChunk.split(/\s+/).filter(Boolean).length;
        const chunkDurationMs = Math.max(800, (words / (135 * rateFinal)) * 60 * 1000);
        const startTime = Date.now();
        const startPercent = ((chunk.start + offsetInChunk) / currentSpeechState.fullText.length) * 100;
        const chunkTotalPercent = ((chunk.end - (chunk.start + offsetInChunk)) / currentSpeechState.fullText.length) * 100;

        if (currentSpeechState.timerId) clearInterval(currentSpeechState.timerId);
        currentSpeechState.timerId = setInterval(() => {
            if (!currentSpeechState.isSpeaking) {
                if (currentSpeechState.timerId) {
                    clearInterval(currentSpeechState.timerId);
                    currentSpeechState.timerId = null;
                }
                return;
            }
            const elapsed = Date.now() - startTime;
            const fraction = Math.min(1, elapsed / chunkDurationMs);
            const currentTotalPercent = Math.min(99.5, startPercent + (fraction * chunkTotalPercent));
            if (bar) bar.style.width = currentTotalPercent + '%';
            if (window.reproduciendoSantoPortada && typeof window.actualizarBarraProgresoPortada === 'function') {
                const totalS = currentSpeechState.totalDurationSecs || 30;
                window.actualizarBarraProgresoPortada((currentTotalPercent / 100) * totalS, totalS, currentTotalPercent);
            }
        }, 100);
    };

    utterance.onend = () => {
        limpiarTemporizadores();
        if (currentSpeechState.isSpeaking) {
            currentSpeechState.currentCharIndex = chunk.end;
            if (currentSpeechState.fullText) {
                const percent = Math.min(100, (chunk.end / currentSpeechState.fullText.length) * 100);
                if (bar) bar.style.width = percent + '%';
                if (window.reproduciendoSantoPortada && typeof window.actualizarBarraProgresoPortada === 'function') {
                    const totalS = currentSpeechState.totalDurationSecs || 30;
                    window.actualizarBarraProgresoPortada((percent / 100) * totalS, totalS, percent);
                }
            }
            currentSpeechState.currentChunkIndex++;
            if (currentSpeechState.currentChunkIndex < currentSpeechState.chunks.length) {
                reproducirChunkActual();
            } else {
                finalizarLecturaCompleta();
            }
        }
    };

    utterance.onerror = (err) => {
        if (err && (err.error === 'canceled' || err.error === 'interrupted')) {
            return;
        }
        console.warn("TTS Error en chunk:", err);
        limpiarTemporizadores();
        currentSpeechState.currentChunkIndex++;
        if (currentSpeechState.chunks && currentSpeechState.currentChunkIndex < currentSpeechState.chunks.length) {
            reproducirChunkActual();
        } else {
            finalizarLecturaCompleta();
        }
    };

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
}

/**
 * Concluye la lectura cuando se han reproducido todos los fragmentos
 */
function finalizarLecturaCompleta() {
    limpiarTemporizadores();
    const estabaEnPortada = typeof window !== 'undefined' && window.reproduciendoSantoPortada;
    currentSpeechState.isSpeaking = false;
    currentSpeechState.currentCharIndex = 0;
    currentSpeechState.currentChunkIndex = 0;
    currentSpeechState.utterance = null;
    if (typeof window !== 'undefined') {
        window.currentTTSUtterance = null;
        window.reproduciendoSantoPortada = false;
    }
    resetearAnimacionCargaCircular();
    const bar = document.getElementById('santo-speech-progress-bar');
    if (bar) bar.style.width = '100%';
    if (estabaEnPortada && typeof window.actualizarBarraProgresoPortada === 'function') {
        const totalS = currentSpeechState.totalDurationSecs || 30;
        window.actualizarBarraProgresoPortada(totalS, totalS, 100);
    }
    setTimeout(() => {
        if (!currentSpeechState.isSpeaking && currentSpeechState.currentCharIndex === 0) {
            if (bar) bar.style.width = '0%';
            if (estabaEnPortada && typeof window.actualizarBarraProgresoPortada === 'function') {
                const totalS = currentSpeechState.totalDurationSecs || 30;
                window.actualizarBarraProgresoPortada(0, totalS, 0);
            }
        }
    }, 700);
    actualizarEstadoIconoVoz(false);
}

/**
 * Adelanta o retrocede la lectura del santo desde la barra superior de portada según una fracción (0 a 1)
 */
export function seekSantoPortadaPorFraccion(ratioInput) {
    prepararTextoCompleto();
    if (!currentSpeechState.fullText) return;

    const ratio = Math.min(1, Math.max(0, ratioInput));
    let targetChar = Math.floor(ratio * currentSpeechState.fullText.length);

    if (targetChar > 0 && targetChar < currentSpeechState.fullText.length) {
        const prevSpace = currentSpeechState.fullText.lastIndexOf(' ', targetChar);
        if (prevSpace !== -1 && targetChar - prevSpace < 25) {
            targetChar = prevSpace + 1;
        }
    }

    currentSpeechState.currentCharIndex = targetChar;
    const newPercent = (targetChar / currentSpeechState.fullText.length) * 100;
    const bar = document.getElementById('santo-speech-progress-bar');
    if (bar) bar.style.width = newPercent + '%';

    if (typeof window !== 'undefined' && typeof window.actualizarBarraProgresoPortada === 'function') {
        const totalS = currentSpeechState.totalDurationSecs || 30;
        window.actualizarBarraProgresoPortada((newPercent / 100) * totalS, totalS, newPercent);
    }

    if (currentSpeechState.chunks && currentSpeechState.chunks.length > 0) {
        let chunkIndex = currentSpeechState.chunks.findIndex(c => targetChar < c.end);
        if (chunkIndex === -1) chunkIndex = currentSpeechState.chunks.length - 1;
        currentSpeechState.currentChunkIndex = Math.max(0, chunkIndex);
    }

    const wasSpeaking = currentSpeechState.isSpeaking;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    limpiarTemporizadores();
    resetearAnimacionCargaCircular();

    if (wasSpeaking) {
        reproducirVoz();
    } else {
        currentSpeechState.isSpeaking = false;
        actualizarEstadoIconoVoz(false);
    }
}

/**
 * Adelanta o retrocede la lectura al hacer clic o arrastrar en la barra de progreso
 */
export function seekToClientX(clientX) {
    prepararTextoCompleto();
    const track = document.getElementById('santo-speech-progress-track');
    const bar = document.getElementById('santo-speech-progress-bar');
    if (!track || !currentSpeechState.fullText) return;

    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return;

    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    let targetChar = Math.floor(ratio * currentSpeechState.fullText.length);

    // Ajustar al inicio de la palabra más próxima para no cortar palabras
    if (targetChar > 0 && targetChar < currentSpeechState.fullText.length) {
        const prevSpace = currentSpeechState.fullText.lastIndexOf(' ', targetChar);
        if (prevSpace !== -1 && targetChar - prevSpace < 25) {
            targetChar = prevSpace + 1;
        }
    }

    currentSpeechState.currentCharIndex = targetChar;
    const newPercent = (targetChar / currentSpeechState.fullText.length) * 100;
    if (bar) bar.style.width = newPercent + '%';

    // Determinar chunk correspondiente
    if (currentSpeechState.chunks && currentSpeechState.chunks.length > 0) {
        let chunkIndex = currentSpeechState.chunks.findIndex(c => targetChar < c.end);
        if (chunkIndex === -1) chunkIndex = currentSpeechState.chunks.length - 1;
        currentSpeechState.currentChunkIndex = Math.max(0, chunkIndex);
    }

    const wasSpeaking = currentSpeechState.isSpeaking;

    // Detener la locución anterior
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    limpiarTemporizadores();
    resetearAnimacionCargaCircular();

    if (wasSpeaking) {
        reproducirVoz();
    } else {
        currentSpeechState.isSpeaking = false;
        actualizarEstadoIconoVoz(false);
    }
}

/**
 * Inicializa los eventos de arrastre y clic en la barra de progreso una sola vez
 */
export function inicializarBarraProgresoSanto() {
    const track = document.getElementById('santo-speech-progress-track');
    if (!track || listenersAttached) return;

    track.addEventListener('mousedown', (e) => {
        isDraggingTrack = true;
        seekToClientX(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (isDraggingTrack) {
            seekToClientX(e.clientX);
        }
    });

    window.addEventListener('mouseup', () => {
        isDraggingTrack = false;
    });

    track.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
            isDraggingTrack = true;
            seekToClientX(e.touches[0].clientX);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isDraggingTrack && e.touches && e.touches[0]) {
            seekToClientX(e.touches[0].clientX);
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDraggingTrack = false;
    });

    listenersAttached = true;
}

/**
 * Prepara el texto completo y reinicia la barra si cambia el santo mostrado en el modal
 */
export function prepararBarraProgresoSanto(santo) {
    if (santo) {
        window.santoActualDetalle = santo;
    }
    const currentId = (window.santoActualDetalle && window.santoActualDetalle.nombre) 
        ? window.santoActualDetalle.nombre.trim() 
        : (document.getElementById('modal-santo-nombre')?.textContent?.trim() || '');

    // Si cambió de santo, reiniciar estado y posición
    if (currentSpeechState.santoId !== currentId) {
        detenerLecturaSantoVoz();
        currentSpeechState.santoId = currentId;
        currentSpeechState.fullText = '';
        currentSpeechState.chunks = [];
        currentSpeechState.currentChunkIndex = 0;
        currentSpeechState.currentCharIndex = 0;
        currentSpeechState.isSpeaking = false;
        const bar = document.getElementById('santo-speech-progress-bar');
        if (bar) bar.style.width = '0%';
    }

    prepararTextoCompleto();
    inicializarBarraProgresoSanto();
    actualizarEstadoIconoVoz(currentSpeechState.isSpeaking);
}

/**
 * Asegura que el texto completo a leer esté listo y almacenado en currentSpeechState
 */
export function prepararTextoCompleto() {
    const currentId = (window.santoActualDetalle && window.santoActualDetalle.nombre) 
        ? window.santoActualDetalle.nombre.trim() 
        : (document.getElementById('modal-santo-nombre')?.textContent?.trim() || '');

    if (!currentSpeechState.fullText || currentSpeechState.santoId !== currentId) {
        currentSpeechState.santoId = currentId;
        currentSpeechState.fullText = construirTextoCompletoSanto();
        currentSpeechState.chunks = dividirEnFrasesLectura(currentSpeechState.fullText, 170);
        currentSpeechState.currentChunkIndex = 0;
        currentSpeechState.currentCharIndex = 0;
    }
    const words = (currentSpeechState.fullText || '').split(/\s+/).filter(Boolean).length;
    const rate = obtenerRateConfigurado();
    currentSpeechState.totalDurationSecs = Math.max(5, Math.round((words / (135 * rate)) * 60));
}

/**
 * Construye una única cadena continua de texto limpio para la locución
 */
export function construirTextoCompletoSanto(santoParam = null) {
    const frases = construirFrasesLecturaSanto(santoParam);
    return frases.join(' ').replace(/\s+/g, ' ').trim();
}

// ==========================================
// CONVERSIÓN DE NÚMEROS Y FECHAS A ESPAÑOL HABLADO
// ==========================================
const UNIDADES_ESP = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const DECENAS_10_ESP = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
const DECENAS_ESP = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const CENTENAS_ESP = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

const MESES_ESP = [
    '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

export function numeroMenor100ATexto(n) {
    if (n <= 0) return '';
    if (n < 10) return ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'][n];
    if (n >= 10 && n < 20) return DECENAS_10_ESP[n - 10];
    if (n === 20) return 'veinte';
    if (n > 20 && n < 30) {
        const veinti = ['', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
        return veinti[n - 20];
    }
    const d = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return DECENAS_ESP[d];
    return `${DECENAS_ESP[d]} y ${['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'][u]}`;
}

export function numeroATextoEspanol(num) {
    const n = parseInt(num, 10);
    if (isNaN(n)) return String(num);
    if (n === 0) return 'cero';
    if (n === 100) return 'cien';
    if (n < 100) return numeroMenor100ATexto(n);

    if (n < 1000) {
        const c = Math.floor(n / 100);
        const resto = n % 100;
        if (resto === 0) {
            return c === 1 ? 'cien' : CENTENAS_ESP[c];
        }
        return `${CENTENAS_ESP[c]} ${numeroMenor100ATexto(resto)}`.trim();
    }

    if (n < 1000000) {
        const miles = Math.floor(n / 1000);
        const resto = n % 1000;
        let parteMiles = '';
        if (miles === 1) {
            parteMiles = 'mil';
        } else {
            parteMiles = `${numeroATextoEspanol(miles)} mil`;
        }
        if (resto === 0) return parteMiles;
        if (resto === 100) return `${parteMiles} cien`;
        if (resto < 100) return `${parteMiles} ${numeroMenor100ATexto(resto)}`;
        const c = Math.floor(resto / 100);
        const restoC = resto % 100;
        if (restoC === 0) return `${parteMiles} ${CENTENAS_ESP[c]}`;
        return `${parteMiles} ${CENTENAS_ESP[c]} ${numeroMenor100ATexto(restoC)}`;
    }

    return String(n);
}

export function formatearFechaParaLocucion(fechaStr, esCelebracion = false) {
    if (!fechaStr) return '';
    const str = fechaStr.trim();
    if (str === '—' || str === '-' || str === '') return '';

    // Caso siglo romano: ej "Siglo III", "Siglo IV", "Siglo XIII"
    const mSiglo = str.match(/siglo\s+([ivxlcdm]+)/i);
    if (mSiglo) {
        const romanos = {
            'i': 'primero', 'ii': 'segundo', 'iii': 'tercero', 'iv': 'cuarto',
            'v': 'quinto', 'vi': 'sexto', 'vii': 'séptimo', 'viii': 'octavo',
            'ix': 'noveno', 'x': 'décimo', 'xi': 'once', 'xii': 'doce',
            'xiii': 'trece', 'xiv': 'catorce', 'xv': 'quince', 'xvi': 'dieciséis',
            'xvii': 'diecisiete', 'xviii': 'dieciocho', 'xix': 'diecinueve', 'xx': 'veinte'
        };
        const rom = mSiglo[1].toLowerCase();
        const textoRom = romanos[rom] || mSiglo[1];
        return `siglo ${textoRom}`;
    }

    // Caso fecha completa ISO: YYYY-MM-DD
    const mIso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (mIso) {
        const dia = parseInt(mIso[3], 10);
        const mes = parseInt(mIso[2], 10);
        const anio = parseInt(mIso[1], 10);
        const mesTexto = MESES_ESP[mes] || '';
        const anioTexto = numeroATextoEspanol(anio);
        if (esCelebracion) {
            return `${dia} de ${mesTexto}`;
        }
        return `${dia} de ${mesTexto} de ${anioTexto}`;
    }

    // Caso fecha completa DD/MM/YYYY o D/M/YYYY
    const mFull = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/);
    if (mFull) {
        const dia = parseInt(mFull[1], 10);
        const mes = parseInt(mFull[2], 10);
        const anio = parseInt(mFull[3], 10);
        const mesTexto = MESES_ESP[mes] || '';
        const anioTexto = numeroATextoEspanol(anio);
        if (esCelebracion) {
            return `${dia} de ${mesTexto}`;
        }
        return `${dia} de ${mesTexto} de ${anioTexto}`;
    }

    // Caso día y mes: DD/MM o D/M
    const mDiaMes = str.match(/^(\d{1,2})\/(\d{1,2})$/);
    if (mDiaMes) {
        const dia = parseInt(mDiaMes[1], 10);
        const mes = parseInt(mDiaMes[2], 10);
        const mesTexto = MESES_ESP[mes] || '';
        return `${dia} de ${mesTexto}`;
    }

    // Caso solo año de 3 o 4 dígitos (ej: "1500", "1474", "1225", "316")
    const mSoloAnio = str.match(/^(\d{3,4})$/);
    if (mSoloAnio) {
        const anio = parseInt(mSoloAnio[1], 10);
        return `año ${numeroATextoEspanol(anio)}`;
    }

    // Caso con prefijo ej: "hacia 1225", "c. 1500"
    const mConAnio = str.match(/(hacia|c\.|alrededor\s+de)?\s*(\d{3,4})/i);
    if (mConAnio) {
        const pref = mConAnio[1] ? mConAnio[1] + ' ' : '';
        const anio = parseInt(mConAnio[2], 10);
        return `${pref}año ${numeroATextoEspanol(anio)}`.trim();
    }

    return str;
}

export function expandirAniosEnTexto(texto) {
    if (!texto) return '';
    return texto.replace(/\b(1[0-9]{3}|20[0-9]{2})\b/g, (match) => {
        return numeroATextoEspanol(parseInt(match, 10));
    });
}

export function normalizarDiaMes(str) {
    if (!str) return '';
    const s = str.trim();
    const mFull = s.match(/^(\d{1,2})\/(\d{1,2})/);
    if (mFull) {
        return `${parseInt(mFull[1], 10)}/${parseInt(mFull[2], 10)}`;
    }
    const mIso = s.match(/^\d{4}-(\d{1,2})-(\d{1,2})/);
    if (mIso) {
        return `${parseInt(mIso[3], 10)}/${parseInt(mIso[2], 10)}`;
    }
    return '';
}

export function obtenerColumnasOcultasActuales() {
    if (typeof window !== 'undefined') {
        if (window.columnasOcultas && window.columnasOcultas instanceof Set) {
            return window.columnasOcultas;
        }
        if (typeof window.obtenerColumnasOcultasSantos === 'function') {
            try {
                return new Set(window.obtenerColumnasOcultasSantos());
            } catch (_) {}
        }
        try {
            const raw = localStorage.getItem('lh_santos_columnas_ocultas');
            if (raw) return new Set(JSON.parse(raw));
        } catch (_) {}
    }
    return new Set();
}

/**
 * Extrae y formatea de manera limpia las frases a leer desde el contenido del modal.
 * No incluye campos sin información, '—', campos suprimidos/ocultos ni fechas duplicadas.
 */
export function construirFrasesLecturaSanto(santoParam = null) {
    const s = santoParam || (typeof window !== 'undefined' ? (window.santoActualDetalle || window.santoActualSeleccionado || window._santoActualSalterio) : null);
    const frases = [];

    if (s && s.nombre) {
        let nombre = s.nombre.trim();
        frases.push(nombre.endsWith('.') ? nombre : nombre + '.');

        // Celebración (Primero tras el nombre)
        const celebRaw = (s.celebracion !== undefined && s.celebracion !== null && s.celebracion.trim() !== '')
            ? s.celebracion.trim()
            : (s.celebracion === undefined ? (s.fechaFestividad || '').trim() : '');

        if (celebRaw && celebRaw !== '—') {
            const celebHabla = formatearFechaParaLocucion(celebRaw, true);
            if (celebHabla) {
                frases.push(`Fecha de celebración: ${celebHabla}.`);
            }
        }

        // Nacimiento: lee como año en palabras (ej. "año mil quinientos") o fecha completa sin barras
        if (s.nacimiento && s.nacimiento.trim() && s.nacimiento.trim() !== '—') {
            const nacHabla = formatearFechaParaLocucion(s.nacimiento);
            if (nacHabla) {
                frases.push(`Nacimiento: ${nacHabla}.`);
            }
        }

        // Mortalidad: lee como año en palabras (ej. "30 de mayo de mil quinientos cuarenta y ocho")
        if (s.muerte && s.muerte.trim() && s.muerte.trim() !== '—') {
            const mueHabla = formatearFechaParaLocucion(s.muerte);
            if (mueHabla) {
                frases.push(`Mortalidad: ${mueHabla}.`);
            }
        }

        if (s.pais && s.pais.trim() && s.pais.trim() !== '—') {
            frases.push(`País: ${s.pais.trim()}.`);
        }
        if (s.ciudad && s.ciudad.trim() && s.ciudad.trim() !== '—') {
            frases.push(`Ciudad: ${s.ciudad.trim()}.`);
        }
        if (s.realidad && s.realidad.trim() && s.realidad.trim() !== '—') {
            frases.push(`Realidad: ${s.realidad.trim()}.`);
        }
        if (s.hijos && Array.isArray(s.hijos)) {
            const validos = s.hijos.filter(h => h && typeof h === 'string' && h.trim().length > 0 && h.trim() !== '—');
            if (validos.length > 0) {
                frases.push(`Hijos en la fe: ${validos.join(', ')}.`);
            }
        }
        if (s.historia && s.historia.trim() && s.historia.trim() !== '—') {
            const histExpandida = expandirAniosEnTexto(s.historia.trim());
            frases.push(`Historia: ${histExpandida}`);
        }
        if (s.detalle && s.detalle.trim() && s.detalle.trim() !== '—') {
            const detExpandido = expandirAniosEnTexto(s.detalle.trim());
            frases.push(`Detalle: ${detExpandido}`);
        }

        return frases;
    }

    // Fallback directo desde el DOM del modal
    const nombreElem = document.getElementById('modal-santo-nombre');
    const cuerpoElem = document.getElementById('modal-santo-cuerpo');

    const nombre = nombreElem?.textContent?.trim() || '';
    if (nombre) {
        frases.push(nombre.endsWith('.') ? nombre : nombre + '.');
    }

    if (cuerpoElem) {
        Array.from(cuerpoElem.children).forEach(child => {
            if (child.querySelector('img')) return;

            const rawText = child.innerText?.trim();
            if (!rawText || rawText === '—' || /^[—\-\s]+$/.test(rawText)) return;

            const matchEtiqueta = rawText.match(/^([^:]+):\s*(.*)$/s);
            if (matchEtiqueta) {
                const label = matchEtiqueta[1].trim();
                const valor = matchEtiqueta[2].trim();
                if (!valor || valor === '—' || valor === '-' || /^[—\-\s]+$/.test(valor)) return;

                let valorFormateado = valor;
                if (/nacimiento|mortalidad|fecha/i.test(label)) {
                    const esCeleb = /celebraci/i.test(label);
                    valorFormateado = formatearFechaParaLocucion(valor, esCeleb) || valor;
                } else {
                    valorFormateado = expandirAniosEnTexto(valor);
                }

                const limpia = `${label}: ${valorFormateado}`.replace(/\s+/g, ' ');
                frases.push(limpia.endsWith('.') ? limpia : limpia + '.');
            } else {
                const limpia = expandirAniosEnTexto(rawText).replace(/\s+/g, ' ');
                if (limpia && !limpia.includes('—')) {
                    frases.push(limpia.endsWith('.') ? limpia : limpia + '.');
                }
            }
        });
    }

    return frases;
}

/**
 * Actualiza el icono y apariencia del botón de bocina según el estado de lectura
 */
export function actualizarEstadoIconoVoz(hablando) {
    const btn = document.getElementById('btn-leer-voz-santo');
    const icono = document.getElementById('icono-leer-voz');
    if (btn && icono) {
        if (hablando) {
            btn.classList.add('speaking');
            btn.title = 'Pausar lectura';
            icono.textContent = 'pause';
        } else {
            btn.classList.remove('speaking');
            if (currentSpeechState.currentCharIndex > 0 && currentSpeechState.fullText && currentSpeechState.currentCharIndex < currentSpeechState.fullText.length) {
                btn.title = 'Continuar lectura';
                icono.textContent = 'play_arrow';
            } else {
                btn.title = 'Reproducir lectura';
                icono.textContent = 'play_arrow';
            }
        }
    }

    // Actualizar botón de la portada del index si existe
    const btnPortada = document.getElementById('btn-tts-portada-santo');
    const iconoPortada = document.getElementById('icono-tts-portada');
    if (btnPortada && iconoPortada) {
        if (hablando && window.reproduciendoSantoPortada) {
            btnPortada.classList.add('speaking');
            btnPortada.classList.remove('cargando-tts');
            btnPortada.title = 'Pausar lectura';
            iconoPortada.textContent = 'pause';
        } else {
            btnPortada.classList.remove('speaking');
            btnPortada.classList.remove('cargando-tts');
            if (window.reproduciendoSantoPortada && currentSpeechState.currentCharIndex > 0) {
                btnPortada.title = 'Continuar lectura';
            } else {
                btnPortada.title = 'Escuchar lectura del santo';
            }
            iconoPortada.textContent = 'play_arrow';
        }
    }

    // Actualizar botones de las filas de la tabla (si existieran)
    if (typeof document !== 'undefined') {
        const filaBtns = document.querySelectorAll('.btn-tts-tabla');
        filaBtns.forEach(b => {
            const bIdx = parseInt(b.dataset.santoIdx, 10);
            const iconoFila = b.querySelector('.material-symbols-outlined');
            if (hablando && window.santoFilaHablandoIdx === bIdx) {
                b.classList.add('speaking');
                b.classList.remove('cargando-tts');
                b.title = 'Pausar lectura';
                if (iconoFila) iconoFila.textContent = 'pause';
            } else {
                b.classList.remove('speaking');
                b.classList.remove('cargando-tts');
                if (window.santoFilaHablandoIdx === bIdx && currentSpeechState.currentCharIndex > 0) {
                    b.title = 'Continuar lectura';
                } else {
                    b.title = 'Reproducir lectura del santo';
                }
                if (iconoFila) iconoFila.textContent = 'play_arrow';
            }
        });
    }
}

// Asignación en el objeto window para compatibilidad directa con onclick en HTML
if (typeof window !== 'undefined') {
    window.currentSpeechState = currentSpeechState;
    window.toggleLeerSantoVoz = toggleLeerSantoVoz;
    window.toggleLeerSantoVozFila = toggleLeerSantoVozFila;
    window.toggleLeerSantoPortada = toggleLeerSantoPortada;
    window.pausarLecturaSantoVoz = pausarLecturaSantoVoz;
    window.detenerLecturaSantoVoz = detenerLecturaSantoVoz;
    window.prepararBarraProgresoSanto = prepararBarraProgresoSanto;
    window.seekToClientX = seekToClientX;
    window.seekSantoPortadaPorFraccion = seekSantoPortadaPorFraccion;
    window.actualizarEstadoIconoVoz = actualizarEstadoIconoVoz;
    window.asegurarAnilloCircularTTS = asegurarAnilloCircularTTS;
    window.fijarProgresoCircular = fijarProgresoCircular;
    window.iniciarAnimacionCargaCircular = iniciarAnimacionCargaCircular;
    window.completarAnimacionCargaCircular = completarAnimacionCargaCircular;
    window.resetearAnimacionCargaCircular = resetearAnimacionCargaCircular;
    window.formatearFechaParaLocucion = formatearFechaParaLocucion;
    window.construirTextoCompletoSanto = construirTextoCompletoSanto;
    window.dividirEnFrasesLectura = dividirEnFrasesLectura;
    window.construirFrasesLecturaSanto = construirFrasesLecturaSanto;
    window.reproducirAudioMP3Santo = reproducirAudioMP3Santo;
    window.descargarAudioSantoActual = descargarAudioSantoActual;
}

/**
 * Sintetiza y descarga el audio completo de la vida/historia del santo actual (santo.mp3)
 * usando el servicio de audio litúrgico local (o dbAudioDescarga) a 40 kbps.
 * Guarda en C:\db\Github\santos\<mes>\<carpeta>\santo.mp3 con copia automática si ya existe.
 */
export async function descargarAudioSantoActual() {
    const s = (typeof window !== 'undefined') ? (window.santoActualDetalle || window.santoActualSeleccionado || window._santoActualSalterio) : null;
    if (!s) {
        alert('No hay información disponible del santo para descargar su audio.');
        return;
    }

    const btnDescarga = document.getElementById('btn-descargar-audio-santo');
    if (btnDescarga) {
        btnDescarga.disabled = true;
        btnDescarga.classList.add('cargando-tts');
        btnDescarga.innerHTML = '<span class="material-symbols-outlined" style="animation: pulso-carga-santo 0.8s infinite;">sync</span>';
    }

    try {
        // 1. Construir texto oracional completo del santo
        let texto = '';
        if (typeof construirTextoCompletoSanto === 'function') {
            texto = construirTextoCompletoSanto(s);
        } else if (typeof window !== 'undefined' && typeof window.construirTextoCompletoSanto === 'function') {
            texto = window.construirTextoCompletoSanto(s);
        }
        if (!texto) {
            const partes = [
                s.nombre,
                s.celebracion ? `Fecha de celebración: ${s.celebracion}` : '',
                s.nacimiento ? `Nacimiento: ${s.nacimiento}` : '',
                s.muerte ? `Mortalidad: ${s.muerte}` : '',
                s.pais ? `País: ${s.pais}` : '',
                s.ciudad ? `Ciudad: ${s.ciudad}` : '',
                s.realidad ? `Realidad: ${s.realidad}` : '',
                s.historia ? `Historia: ${s.historia}` : '',
                s.detalle ? `Detalle: ${s.detalle}` : ''
            ].filter(Boolean);
            texto = partes.join('. ');
        }

        // 2. Resolver la carpeta del mes y del santo
        let subRuta = '';
        let mes = '';
        let carpeta = '';
        let urlWeb = '';

        if (typeof window !== 'undefined' && typeof window.autodetectarCarpetaSanto === 'function') {
            const auto = window.autodetectarCarpetaSanto(s.nombre, s.celebracion || s.fechaFestividad);
            if (auto && auto.subRuta) {
                subRuta = auto.subRuta;
                const p = subRuta.split('/');
                mes = p[0];
                carpeta = p[1] || '';
                urlWeb = auto.basePath ? `${auto.basePath}santo.mp3` : `https://santos.resucito.do/${encodeURI(subRuta)}/santo.mp3`;
            }
        }

        if (!subRuta) {
            let diaNum = 1;
            let mesNum = 1;
            const fechaRaw = (s.celebracion || s.fechaFestividad || '').trim();
            const matchFecha = fechaRaw.match(/^(\d{1,2})\/(\d{1,2})/);
            if (matchFecha) {
                diaNum = parseInt(matchFecha[1], 10);
                mesNum = parseInt(matchFecha[2], 10);
            } else {
                const matchTexto = fechaRaw.match(/^(\d{1,2})(?:\/|\s+de\s+|\s+)([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i);
                if (matchTexto) {
                    diaNum = parseInt(matchTexto[1], 10);
                    const mTxt = matchTexto[2].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const MESES_AUDIO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                    const idx = MESES_AUDIO.findIndex(m => m.startsWith(mTxt) || mTxt.startsWith(m));
                    if (idx >= 0) mesNum = idx + 1;
                }
            }
            const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            mes = MESES[mesNum - 1] || 'noviembre';
            const slugMayus = (s.nombre || 'SANTO').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            carpeta = `${String(diaNum).padStart(2, '0')}-${slugMayus}`;
            subRuta = `${mes}/${carpeta}`;
            urlWeb = `https://santos.resucito.do/${encodeURI(subRuta)}/santo.mp3`;
        }

        // 3. Dividir texto en frases para sintetizador TTS (máximo 130 caracteres)
        let chunks = [];
        if (typeof dividirEnFrasesLectura === 'function') {
            chunks = dividirEnFrasesLectura(texto, 130).map(c => c.text).filter(Boolean);
        } else if (typeof window !== 'undefined' && typeof window.dividirEnFrasesLectura === 'function') {
            chunks = window.dividirEnFrasesLectura(texto, 130).map(c => c.text).filter(Boolean);
        }
        if (chunks.length === 0) {
            chunks = [texto];
        }

        // 4. Invocar el motor dbAudioDescarga o fallback directo a servicio_audio
        const pluginDescarga = (typeof window !== 'undefined') ? window.dbAudioDescarga : null;
        if (pluginDescarga && typeof pluginDescarga.descargarAudio === 'function') {
            await pluginDescarga.descargarAudio({
                url: urlWeb,
                filename: 'santo.mp3',
                textoLiturgico: texto,
                partes: chunks,
                tiempo: 'santos',
                folder: subRuta,
                semana: mes,
                dia: carpeta
            });
            window._santoAudioUrlActual = urlWeb;
            window._santoAudioExiste = true;
        } else {
            // Descarga/síntesis por llamada directa al servicio local en puerto 4000
            const activeBaseUrl = 'http://127.0.0.1:4000';
            const res = await fetch(`${activeBaseUrl}/api/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: texto,
                    textoLiturgico: texto,
                    filename: 'santo.mp3',
                    semana: mes,
                    dia: carpeta,
                    tiempo: 'santos',
                    folder: subRuta
                })
            });
            if (res.ok) {
                const blob = await res.blob();
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'santo.mp3';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                }, 2000);
                window._santoAudioUrlActual = urlWeb;
                window._santoAudioExiste = true;
                alert('¡Audio de la vida del santo generado y guardado exitosamente en ' + subRuta + '/santo.mp3!');
            } else {
                throw new Error('El servicio de audio respondió con código ' + res.status);
            }
        }
    } catch (err) {
        console.error('Error al descargar audio del santo:', err);
        alert('Ocurrió un error al generar/descargar el audio: ' + err.message);
    } finally {
        if (btnDescarga) {
            btnDescarga.disabled = false;
            btnDescarga.classList.remove('cargando-tts');
            btnDescarga.innerHTML = '<span class="material-symbols-outlined">download</span>';
        }
    }
}

/**
 * Asegura que el contenedor del modal del detalle del santo exista en el DOM
 */
export function asegurarModalSantoEnDOM() {
    if (typeof document === 'undefined') return null;
    let modal = document.getElementById('modal-detalle-santo');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay-santo';
        modal.id = 'modal-detalle-santo';
        modal.onclick = function(e) {
            if (e.target === this) cerrarModalDetalleSanto();
        };
        modal.innerHTML = `
            <div class="modal-content-santo">
                <div class="modal-santo-header">
                    <div class="modal-santo-header-top">
                        <h2 id="modal-santo-nombre"></h2>
                        <div class="modal-santo-header-actions">
                            <div class="modal-santo-nav" style="display: inline-flex; align-items: center; gap: 4px; margin-right: 4px;">
                                <button type="button" id="btn-modal-prev" class="btn-nav-arrow" onclick="window.navegarSantoAnterior()" title="Santo anterior">
                                    <span class="material-symbols-outlined" style="font-size: 18px;">chevron_left</span>
                                </button>
                                <span id="modal-santo-contador" style="font-size: 0.82rem; font-weight: 700; color: #546e7a; min-width: 65px; text-align: center; user-select: none;">1 de 1</span>
                                <button type="button" id="btn-modal-next" class="btn-nav-arrow" onclick="window.navegarSantoSiguiente()" title="Santo siguiente">
                                    <span class="material-symbols-outlined" style="font-size: 18px;">chevron_right</span>
                                </button>
                            </div>
                            <button type="button" id="btn-leer-voz-santo" class="btn-tts-santo" onclick="window.toggleLeerSantoVoz()" title="Reproducir lectura / audio">
                                <svg class="tts-circular-ring" viewBox="0 0 42 42">
                                    <circle class="tts-circular-bg" cx="21" cy="21" r="17.5"></circle>
                                    <circle class="tts-circular-bar" id="tts-circular-bar" cx="21" cy="21" r="17.5"></circle>
                                </svg>
                                <span class="material-symbols-outlined" id="icono-leer-voz">play_arrow</span>
                            </button>
                            <button type="button" id="btn-descargar-audio-santo" class="btn-tts-santo btn-modal-download" onclick="window.descargarAudioSantoActual()" title="Descargar audio de la vida/historia del santo (santo.mp3)">
                                <span class="material-symbols-outlined">download</span>
                            </button>
                            <button type="button" id="btn-modal-editar-santo" class="btn-tts-santo btn-modal-pencil" onclick="window.editarSantoDesdeModal()" title="Editar este santo" aria-label="Editar">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <span class="modal-close-santo" onclick="window.cerrarModalDetalleSanto()" title="Cerrar">&times;</span>
                        </div>
                    </div>
                    <!-- Barra Interactiva de Progreso de Lectura -->
                    <div id="santo-speech-progress-track" class="speech-progress-track" title="Haz clic o arrastra para adelantar o retroceder la lectura">
                        <div id="santo-speech-progress-bar" class="speech-progress-bar">
                            <div id="santo-speech-progress-thumb" class="speech-progress-thumb"></div>
                        </div>
                    </div>
                </div>
                <div id="modal-santo-cuerpo" style="display: flex; flex-direction: column; gap: 12px; font-size: 0.93rem; color: #37474f;"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    return modal;
}

/**
 * Retorna la lista activa de santos para navegar en el modal
 */
export function obtenerListaSantosModal() {
    let lista = [];
    try {
        const raw = localStorage.getItem('lh_catalogo_nombres_santos');
        if (raw) lista = JSON.parse(raw);
    } catch (_) {}
    if (!Array.isArray(lista) || lista.length === 0) {
        if (typeof catalogoSantosAnual !== 'undefined' && Array.isArray(catalogoSantosAnual)) {
            lista = catalogoSantosAnual;
        } else if (typeof window !== 'undefined' && window.catalogoSantosAnual && Array.isArray(window.catalogoSantosAnual)) {
            lista = window.catalogoSantosAnual;
        }
    }
    return lista || [];
}

/**
 * Abre el modal de vida/historia para el santo indicado o el santo actual
 */
export function abrirModalVidaHistoriaSanto(santoParam = null) {
    let s = santoParam;
    if (!s && typeof window !== 'undefined') {
        s = window.santoDelDiaObjeto || window.santoActualDetalle || (typeof window.obtenerSantoParaVistaActual === 'function' ? window.obtenerSantoParaVistaActual() : null);
    }
    if (!s) {
        const lista = obtenerListaSantosModal();
        s = lista[0] || null;
    }
    if (!s) return;
    verDetalleSanto(s);
}

/**
 * Muestra el detalle completo del santo en el modal
 */
export function verDetalleSanto(itemOrIndex) {
    asegurarModalSantoEnDOM();
    const lista = obtenerListaSantosModal();
    let s = null;
    let index = 0;

    if (typeof itemOrIndex === 'number') {
        s = lista[itemOrIndex];
        index = itemOrIndex;
    } else if (itemOrIndex && typeof itemOrIndex === 'object') {
        s = itemOrIndex;
        const foundIdx = lista.findIndex(x => (x.nombre || '').trim() === (s.nombre || '').trim());
        index = foundIdx >= 0 ? foundIdx : 0;
    }

    if (!s) return;

    if (typeof window !== 'undefined') {
        window.santoActualDetalle = s;
        window.indiceSantoActualDetalle = index;
        if (window.detenerLecturaSantoVoz) {
            window.detenerLecturaSantoVoz();
        }
    }

    const modal = document.getElementById('modal-detalle-santo');
    if (!modal) return;

    const nomEl = document.getElementById('modal-santo-nombre');
    if (nomEl) nomEl.textContent = s.nombre || 'Detalle del Santo';

    const contEl = document.getElementById('modal-santo-contador');
    if (contEl) {
        contEl.textContent = lista.length > 0 ? `${index + 1} de ${lista.length}` : '1 de 1';
    }

    const hijosValidos = (s.hijos && Array.isArray(s.hijos))
        ? s.hijos.filter(h => h && typeof h === 'string' && h.trim().length > 0 && h.trim() !== '—')
        : [];

    let imgModal = '';
    if (s.imagen) {
        let srcImg = s.imagen.trim();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/src/html/') && srcImg.startsWith('../img/')) {
            srcImg = 'src/' + srcImg.substring(3);
        }
        imgModal = `<div style="text-align:center; margin-bottom:12px;"><img src="${srcImg}" style="max-height:160px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.15);" alt="${s.nombre}"></div>`;
    }

    const fechaCeleb = (s.celebracion !== undefined && s.celebracion !== null && s.celebracion.trim() !== '')
        ? s.celebracion.trim()
        : (s.fechaFestividad || '').trim();

    let cuerpoHtml = imgModal;

    if (fechaCeleb && fechaCeleb !== '—') {
        cuerpoHtml += `<div><strong>Fecha Celebración:</strong> ${fechaCeleb}</div>`;
    }
    if (s.nacimiento && s.nacimiento.trim() && s.nacimiento.trim() !== '—') {
        cuerpoHtml += `<div><strong>Nacimiento:</strong> ${s.nacimiento.trim()}</div>`;
    }
    if (s.muerte && s.muerte.trim() && s.muerte.trim() !== '—') {
        cuerpoHtml += `<div><strong>Mortalidad:</strong> ${s.muerte.trim()}</div>`;
    }
    if (s.pais && s.pais.trim() && s.pais.trim() !== '—') {
        cuerpoHtml += `<div><strong>País:</strong> ${s.pais.trim()}</div>`;
    }
    if (s.ciudad && s.ciudad.trim() && s.ciudad.trim() !== '—') {
        cuerpoHtml += `<div><strong>Ciudad:</strong> ${s.ciudad.trim()}</div>`;
    }
    if (s.realidad && s.realidad.trim() && s.realidad.trim() !== '—') {
        cuerpoHtml += `<div><strong>Realidad:</strong> ${s.realidad.trim()}</div>`;
    }
    if (hijosValidos.length > 0) {
        const hijosTags = hijosValidos.map(h => `<span class="tag-hijo" style="display:inline-block; background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin:2px 3px 2px 0;">${h.trim()}</span>`).join(' ');
        cuerpoHtml += `<div><strong>Hijos en la fe:</strong> <div style="margin-top:4px;">${hijosTags}</div></div>`;
    }
    if (s.historia && s.historia.trim() && s.historia.trim() !== '—') {
        cuerpoHtml += `<div style="border-top: 1px solid #eceff1; padding-top: 10px;"><strong>Historia:</strong><p style="margin: 4px 0 0; line-height: 1.5; text-align: justify;">${s.historia.trim()}</p></div>`;
    }
    if (s.detalle && s.detalle.trim() && s.detalle.trim() !== '—') {
        cuerpoHtml += `<div style="border-top: 1px solid #eceff1; padding-top: 10px;"><strong>Detalle:</strong><p style="margin: 4px 0 0; line-height: 1.5; text-align: justify;">${s.detalle.trim()}</p></div>`;
    }

    // Liturgias de las Horas Trabajadas
    const horasConfig = [
        { key: 'oficio', nombre: 'Oficio de Lectura', icono: 'menu_book' },
        { key: 'laudes', nombre: 'Laudes', icono: 'wb_sunny' },
        { key: 'tercia', nombre: 'Tercia', icono: 'schedule' },
        { key: 'sexta', nombre: 'Sexta', icono: 'wb_sunny' },
        { key: 'nona', nombre: 'Nona', icono: 'schedule' },
        { key: 'visperas', nombre: 'Vísperas', icono: 'nights_stay' },
        { key: 'completas', nombre: 'Completas', icono: 'bedtime' }
    ];

    let liturgiasModalHtml = '';
    const codsAsig = s.horasAsignadas || s.codigos || {};
    horasConfig.forEach(h => {
        const cod = codsAsig[h.key] || codsAsig[h.key.slice(0, 2)];
        if (cod) {
            const codVal = (typeof cod === 'string') ? cod : (cod.codigo || '');
            if (codVal) {
                const prefixSalterios = (typeof window !== 'undefined' && window.location.pathname.includes('/src/html/')) ? '../../salterios.html' : 'salterios.html';
                liturgiasModalHtml += `
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 8px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; font-size: 0.84rem;">
                        <span style="font-weight: 600; color: #166534; display: flex; align-items: center; gap: 4px;">
                            <span class="material-symbols-outlined" style="font-size: 16px; color: #16a34a;">${h.icono}</span>
                            ${h.nombre}
                        </span>
                        <span style="font-family: monospace; color: #0f766e; font-weight: 600;">${codVal}</span>
                        <a href="${prefixSalterios}?libro=${h.key}&id=${encodeURIComponent(codVal)}" target="_blank" style="background: #0288d1; color: white; text-decoration: none; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Abrir</a>
                    </div>
                `;
            }
        }
    });

    if (liturgiasModalHtml) {
        cuerpoHtml += `
            <div style="border-top: 1.5px solid #bbf7d0; padding-top: 10px; margin-top: 6px;">
                <strong style="color: #166534; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                    <span class="material-symbols-outlined" style="font-size: 18px; color: #16a34a;">auto_stories</span>
                    Liturgia de las Horas Asignada:
                </strong>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${liturgiasModalHtml}
                </div>
            </div>
        `;
    }

    // Archivos de Audio Litúrgico / Grabaciones del Santo
    let basePathModal = (s.audios && s.audios.basePath) ? s.audios.basePath : (s.audioBasePath || '');
    if (!basePathModal && typeof window !== 'undefined' && typeof window.autodetectarCarpetaSanto === 'function') {
        const autoModal = window.autodetectarCarpetaSanto(s.nombre, s.celebracion || s.fechaFestividad);
        if (autoModal) basePathModal = autoModal.basePath;
    }

    if (basePathModal) {
        if (!basePathModal.endsWith('/')) basePathModal += '/';
        const archsModal = (s.audios && s.audios.archivos) ? s.audios.archivos : {
            lectura1: 'lectura1.mp3',
            lectura2: 'lectura1.mp3',
            lecturas: 'lecturas.mp3',
            santo: 'santo.mp3'
        };

        const labelsModal = {
            'lectura1': { label: '1ª Lectura (Impar)', file: archsModal['lectura1'] || 'lectura1.mp3', icon: 'menu_book' },
            'lecturas': { label: '2ª Lectura Patrística', file: archsModal['lecturas'] || 'lecturas.mp3', icon: 'auto_stories' },
            'santo': { label: 'Vida / Historia del Santo', file: archsModal['santo'] || 'santo.mp3', icon: 'account_circle' },
            'oficio': { label: 'Oficio Completo', file: archsModal['oficio'] || 'oficio.mp3', icon: 'hearing' },
            'laudes': { label: 'Laudes', file: archsModal['laudes'] || 'laudes.mp3', icon: 'wb_sunny' },
            'visperas': { label: 'Vísperas', file: archsModal['visperas'] || 'visperas.mp3', icon: 'nights_stay' }
        };

        let audiosItemsHtml = '';
        ['lectura1', 'lecturas', 'santo', 'oficio', 'laudes', 'visperas'].forEach(k => {
            const cfg = labelsModal[k];
            if (cfg && cfg.file) {
                const urlFile = cfg.file.startsWith('http') ? cfg.file : (basePathModal + encodeURI(cfg.file));
                const esVidaSanto = (k === 'santo');
                audiosItemsHtml += `
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 8px; background: ${esVidaSanto ? '#f0fdf4' : '#f0f9ff'}; border: 1px solid ${esVidaSanto ? '#bbf7d0' : '#bae6fd'}; border-radius: 6px; font-size: 0.82rem;">
                        <span style="font-weight: 600; color: ${esVidaSanto ? '#166534' : '#0369a1'}; display: flex; align-items: center; gap: 4px;">
                            <span class="material-symbols-outlined" style="font-size: 16px; color: ${esVidaSanto ? '#16a34a' : '#0284c7'};">${cfg.icon}</span>
                            ${cfg.label}
                        </span>
                        <div style="display: flex; gap: 4px;">
                            <button type="button" onclick="window.reproducirAudioSantoModal('${urlFile.replace(/'/g, "\\'")}', '${cfg.label.replace(/'/g, "\\'")}', this)" style="background: ${esVidaSanto ? '#16a34a' : '#0284c7'}; color: white; border: none; padding: 2px 8px; border-radius: 4px; font-size: 0.74rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 2px;">
                                <span class="material-symbols-outlined" style="font-size: 14px;">play_arrow</span> Escuchar
                            </button>
                            ${esVidaSanto ? `
                                <button type="button" onclick="window.descargarAudioSantoActual()" style="background: #0284c7; color: white; border: none; padding: 2px 6px; border-radius: 4px; font-size: 0.74rem; cursor: pointer; display: inline-flex; align-items: center;" title="Descargar / Generar audio (santo.mp3)">
                                    <span class="material-symbols-outlined" style="font-size: 14px;">download</span>
                                </button>
                            ` : `
                                <a href="${urlFile}" target="_blank" download style="background: #e2e8f0; color: #334155; text-decoration: none; padding: 2px 6px; border-radius: 4px; font-size: 0.74rem; display: inline-flex; align-items: center;" title="Descargar / Abrir MP3">
                                    <span class="material-symbols-outlined" style="font-size: 14px;">open_in_new</span>
                                </a>
                            `}
                        </div>
                    </div>
                `;
            }
        });

        if (audiosItemsHtml) {
            const prefixOficio = (typeof window !== 'undefined' && window.location.pathname.includes('/src/html/')) ? 'oficiodelectura.html' : 'src/html/oficiodelectura.html';
            cuerpoHtml += `
                <div style="border-top: 1.5px solid #bae6fd; padding-top: 10px; margin-top: 8px;">
                    <strong style="color: #0369a1; display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px;">
                        <span style="display: flex; align-items: center; gap: 6px;">
                            <span class="material-symbols-outlined" style="font-size: 18px; color: #0284c7;">headphones</span>
                            Archivos de Audio Litúrgico:
                        </span>
                        <a href="${prefixOficio}" target="_blank" style="font-size: 0.72rem; color: #8B0000; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 2px;">
                            Catálogo Oficio
                        </a>
                    </strong>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        ${audiosItemsHtml}
                    </div>
                </div>
            `;
        }
    }

    const cuerpoEl = document.getElementById('modal-santo-cuerpo');
    if (cuerpoEl) cuerpoEl.innerHTML = cuerpoHtml;

    modal.style.display = 'flex';

    if (window.prepararBarraProgresoSanto) {
        window.prepararBarraProgresoSanto(s);
    }
}

export function cerrarModalDetalleSanto() {
    const modal = document.getElementById('modal-detalle-santo');
    if (modal) modal.style.display = 'none';
    if (typeof window !== 'undefined' && window.detenerLecturaSantoVoz) {
        window.detenerLecturaSantoVoz();
    }
}

export function navegarSantoAnterior() {
    const lista = obtenerListaSantosModal();
    if (!lista || lista.length === 0) return;
    let idx = (typeof window !== 'undefined' ? window.indiceSantoActualDetalle : 0) || 0;
    idx = (idx - 1 + lista.length) % lista.length;
    verDetalleSanto(idx);
}

export function navegarSantoSiguiente() {
    const lista = obtenerListaSantosModal();
    if (!lista || lista.length === 0) return;
    let idx = (typeof window !== 'undefined' ? window.indiceSantoActualDetalle : 0) || 0;
    idx = (idx + 1) % lista.length;
    verDetalleSanto(idx);
}

export function editarSantoDesdeModal() {
    const s = typeof window !== 'undefined' ? window.santoActualDetalle : null;
    const nom = s ? (s.nombre || '') : '';
    const prefixEdicion = (typeof window !== 'undefined' && window.location.pathname.includes('/src/html/')) ? 'nombresanto.html' : 'src/html/nombresanto.html';
    window.open(`${prefixEdicion}?nombre=${encodeURIComponent(nom)}`, '_blank');
}

export function reproducirAudioSantoModal(url, titulo, btn) {
    if (!url) return;
    if (typeof window === 'undefined') return;
    if (window._audioModalPlayer && window._audioModalPlayer.src === url && !window._audioModalPlayer.paused) {
        window._audioModalPlayer.pause();
        if (btn) btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">play_arrow</span> Escuchar';
        return;
    }
    if (window._audioModalPlayer) {
        try { window._audioModalPlayer.pause(); } catch (_) {}
    }
    const a = new Audio(url);
    window._audioModalPlayer = a;
    if (btn) btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">pause</span> Pausa';
    a.addEventListener('ended', () => {
        if (btn) btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">play_arrow</span> Escuchar';
        window._audioModalPlayer = null;
    });
    a.addEventListener('pause', () => {
        if (btn) btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">play_arrow</span> Escuchar';
    });
    a.play().catch(err => {
        console.warn('Error al reproducir audio modal:', err);
        if (btn) btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">play_arrow</span> Escuchar';
    });
}

// Asignaciones en window para disponibilidad global en cualquier página
if (typeof window !== 'undefined') {
    window.asegurarModalSantoEnDOM = asegurarModalSantoEnDOM;
    window.obtenerListaSantosModal = obtenerListaSantosModal;
    window.abrirModalVidaHistoriaSanto = abrirModalVidaHistoriaSanto;
    window.verDetalleSanto = verDetalleSanto;
    window.cerrarModalDetalleSanto = cerrarModalDetalleSanto;
    window.navegarSantoAnterior = navegarSantoAnterior;
    window.navegarSantoSiguiente = navegarSantoSiguiente;
    window.editarSantoDesdeModal = editarSantoDesdeModal;
    window.reproducirAudioSantoModal = reproducirAudioSantoModal;
}
