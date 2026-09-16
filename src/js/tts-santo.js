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
    if (typeof window !== 'undefined') {
        window.currentTTSUtterance = null;
        window.reproduciendoSantoPortada = false;
    }
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
export function construirFrasesLecturaSanto() {
    const s = window.santoActualDetalle;
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
    window.toggleLeerSantoVoz = toggleLeerSantoVoz;
    window.toggleLeerSantoVozFila = toggleLeerSantoVozFila;
    window.toggleLeerSantoPortada = toggleLeerSantoPortada;
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
    window.formatearFechaParaLocucion = formatearFechaParaLocucion;
}
