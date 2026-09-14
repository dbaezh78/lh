/**
 * TTS (Text-to-Speech) para Lectura de Santos — Liturgia de las Horas
 * Lee la información del santo abierta en el modal usando SpeechSynthesis.
 * Soporta barra interactiva de progreso (adelantar/retroceder arrastrando o haciendo clic),
 * pausar/continuar, word boundary tracking y configuración de voz/velocidad.
 */

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

    const vozGuardada = localStorage.getItem('pref-tts-voice') || '';
    const voices = window.speechSynthesis.getVoices() || [];
    let vozElegida = null;

    if (vozGuardada) {
        vozElegida = voices.find(v => 
            v.name === vozGuardada || 
            v.name.toLowerCase() === vozGuardada.toLowerCase() ||
            (vozGuardada.includes('Raul') && v.name.includes('Raul')) ||
            (vozGuardada.includes('Sabina') && v.name.includes('Sabina')) ||
            (vozGuardada.includes('Estados Unidos') && v.name.includes('Estados Unidos') && v.name.includes('Google')) ||
            (vozGuardada.startsWith('Google español') && !vozGuardada.includes('Estados Unidos') && v.name.startsWith('Google español') && !v.name.includes('Estados Unidos'))
        );
    }
    if (!vozElegida) {
        // Fallback: top 4 de preferencia o primera disponible en español
        vozElegida = voices.find(v => v.name.includes('Raul'))
                  || voices.find(v => v.name.includes('Sabina'))
                  || voices.find(v => v.name.startsWith('Google español'))
                  || voices.find(v => (v.lang || '').toLowerCase().startsWith('es'));
    }
    return vozElegida;
}

/**
 * Obtiene la velocidad configurada por el usuario en Ajustes (entre 0.5 y 2.0)
 */
export function obtenerRateConfigurado() {
    if (typeof window === 'undefined') return 1.0;
    const rateGuardado = parseFloat(localStorage.getItem('pref-tts-rate') || '1.0');
    return (!isNaN(rateGuardado) && rateGuardado >= 0.5 && rateGuardado <= 2.0) ? rateGuardado : 1.0;
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
    const bar = asegurarAnilloCircularTTS();
    if (!bar) return;
    const clamped = Math.min(100, Math.max(0, porcentaje));
    const offset = CIRCUNFERENCIA_CIRCULO - (CIRCUNFERENCIA_CIRCULO * (clamped / 100));
    bar.style.strokeDashoffset = offset.toFixed(2);
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
    fijarProgresoCircular(100);
}

export function iniciarAnimacionCargaCircular(onTreintaPorCiento, onCompletado) {
    resetearAnimacionCargaCircular();
    const btn = document.getElementById('btn-leer-voz-santo');
    if (btn) {
        btn.classList.add('cargando-tts');
        btn.classList.remove('speaking');
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
    const bar = document.getElementById('santo-speech-progress-bar');
    if (bar) bar.style.width = '0%';
    actualizarEstadoIconoVoz(false);
}

/**
 * Divide el texto completo en fragmentos oracionales naturales de tamaño óptimo (<= 170 caracteres).
 * Esto evita el límite de búfer y cuelgues de audio en Chromium para textos extensos.
 */
export function dividirEnFrasesLectura(texto, maxLen = 170) {
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

    for (const seg of oraciones) {
        const segLen = seg.length;
        if (curChunk.length + segLen > maxLen && curChunk.trim().length > 0) {
            const trimmed = curChunk.trim();
            chunks.push({ text: trimmed, start: curStart, end: curStart + curChunk.length });
            curStart = runningIdx;
            curChunk = seg;
        } else {
            if (!curChunk) curStart = runningIdx;
            curChunk += seg;
        }
        runningIdx += segLen;
    }

    if (curChunk.trim().length > 0) {
        chunks.push({ text: curChunk.trim(), start: curStart, end: limpio.length });
    }

    return chunks;
}

/**
 * Inicia o pausa la lectura en voz alta del santo actual en el modal
 */
export function toggleLeerSantoVoz() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        alert('Tu navegador no soporta la función de lectura por voz (SpeechSynthesis).');
        return;
    }

    // Si ya está hablando o en proceso de carga circular, pausar
    if (currentSpeechState.isSpeaking || ttsCargaActiva) {
        pausarLecturaSantoVoz();
        return;
    }

    // Si no está hablando, reproducir desde la posición actual
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
    utterance.lang = (vozElegida && vozElegida.lang) ? vozElegida.lang : 'es-ES';
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
        }, 100);
    };

    utterance.onend = () => {
        limpiarTemporizadores();
        if (currentSpeechState.isSpeaking) {
            currentSpeechState.currentCharIndex = chunk.end;
            if (bar && currentSpeechState.fullText) {
                const percent = Math.min(100, (chunk.end / currentSpeechState.fullText.length) * 100);
                bar.style.width = percent + '%';
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
    currentSpeechState.isSpeaking = false;
    currentSpeechState.currentCharIndex = 0;
    currentSpeechState.currentChunkIndex = 0;
    currentSpeechState.utterance = null;
    if (typeof window !== 'undefined') window.currentTTSUtterance = null;
    resetearAnimacionCargaCircular();
    const bar = document.getElementById('santo-speech-progress-bar');
    if (bar) bar.style.width = '100%';
    setTimeout(() => {
        if (!currentSpeechState.isSpeaking && currentSpeechState.currentCharIndex === 0) {
            if (bar) bar.style.width = '0%';
        }
    }, 700);
    actualizarEstadoIconoVoz(false);
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
}

/**
 * Construye una única cadena continua de texto limpio para la locución
 */
export function construirTextoCompletoSanto() {
    const frases = construirFrasesLecturaSanto();
    return frases.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Extrae y formatea de manera limpia las frases a leer desde el contenido del modal.
 * No incluye campos sin información, '—' ni campos opcionales vacíos.
 */
export function construirFrasesLecturaSanto() {
    const s = window.santoActualDetalle;
    const frases = [];

    if (s && s.nombre) {
        let nombreTexto = s.nombre.trim();
        if (typeof window.calcularEdadSanto === 'function' && s.nacimiento && s.muerte) {
            const edad = window.calcularEdadSanto(s.nacimiento, s.muerte);
            if (edad !== null) nombreTexto += `, ${edad} años`;
        }
        frases.push(nombreTexto.endsWith('.') ? nombreTexto : nombreTexto + '.');

        const nacTexto = (typeof window.formatearFechaMostrar === 'function' && s.nacimiento) ? window.formatearFechaMostrar(s.nacimiento) : (s.nacimiento || '').trim();
        if (nacTexto && nacTexto !== '—') {
            frases.push(`Nacimiento: ${nacTexto}.`);
        }

        const mueTexto = (typeof window.formatearFechaMostrar === 'function' && s.muerte) ? window.formatearFechaMostrar(s.muerte) : (s.muerte || '').trim();
        if (mueTexto && mueTexto !== '—') {
            frases.push(`Mortalidad: ${mueTexto}.`);
        }

        const celeb = (s.celebracion || s.fechaFestividad || '').trim();
        const celebTexto = (typeof window.formatearCelebracionMostrar === 'function' && celeb) ? window.formatearCelebracionMostrar(celeb) : celeb;
        if (celebTexto && celebTexto !== '—') {
            frases.push(`Fecha de celebración: ${celebTexto}.`);
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
            frases.push(`Historia: ${s.historia.trim()}`);
        }
        if (s.detalle && s.detalle.trim() && s.detalle.trim() !== '—') {
            frases.push(`Detalle: ${s.detalle.trim()}`);
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

                const limpia = `${label}: ${valor}`.replace(/\s+/g, ' ');
                frases.push(limpia.endsWith('.') ? limpia : limpia + '.');
            } else {
                const limpia = rawText.replace(/\s+/g, ' ');
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
    if (!btn || !icono) return;

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

// Asignación en el objeto window para compatibilidad directa con onclick en HTML
if (typeof window !== 'undefined') {
    window.toggleLeerSantoVoz = toggleLeerSantoVoz;
    window.pausarLecturaSantoVoz = pausarLecturaSantoVoz;
    window.detenerLecturaSantoVoz = detenerLecturaSantoVoz;
    window.prepararBarraProgresoSanto = prepararBarraProgresoSanto;
    window.seekToClientX = seekToClientX;
    window.actualizarEstadoIconoVoz = actualizarEstadoIconoVoz;
    window.asegurarAnilloCircularTTS = asegurarAnilloCircularTTS;
    window.fijarProgresoCircular = fijarProgresoCircular;
    window.iniciarAnimacionCargaCircular = iniciarAnimacionCargaCircular;
    window.completarAnimacionCargaCircular = completarAnimacionCargaCircular;
    window.resetearAnimacionCargaCircular = resetearAnimacionCargaCircular;
}
