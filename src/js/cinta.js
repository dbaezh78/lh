// =========================================================================
// CONTROLADOR DE LA CINTA SUPERIOR CON REPRODUCTOR CUÁDRUPLE Y HORAS (cinta.js)
// =========================================================================

export const MODOS_AUDIO = {
    evangelio: {
        id: 'evangelio',
        icono: '✞',
        nombre: 'Evangelio del Día',
        subtituloDefault: 'Evangelio de hoy',
        claseBtn: 'modo-evangelio',
        claseBadge: 'badge-evangelio'
    },
    hora: {
        id: 'hora',
        icono: '🙏',
        nombre: 'Liturgia de las Horas',
        subtituloDefault: 'Lector de voz de la hora actual',
        claseBtn: 'modo-hora',
        claseBadge: 'badge-hora'
    },
    lectura1: {
        id: 'lectura1',
        icono: '1️⃣',
        nombre: '1ª Lectura del Oficio',
        subtituloDefault: 'Año Par / Impar',
        claseBtn: 'modo-lectura1',
        claseBadge: 'badge-lectura1'
    },
    lectura2: {
        id: 'lectura2',
        icono: '2️⃣',
        nombre: '2ª Lectura del Oficio',
        subtituloDefault: 'Lectura patrística',
        claseBtn: 'modo-lectura2',
        claseBadge: 'badge-lectura2'
    }
};

// =========================================================================
// CONFIGURACIÓN Y HELPER DE VOCES TTS (COMPATIBLE CON AJUSTES Y SANTOS)
// =========================================================================

// Precalentar voces en navegadores basados en Chromium
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}

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
        vozElegida = voices.find(v => v.name.includes('Raul'))
                  || voices.find(v => v.name.includes('Sabina'))
                  || voices.find(v => v.name.startsWith('Google español'))
                  || voices.find(v => (v.lang || '').toLowerCase().startsWith('es'));
    }
    return vozElegida;
}

export function obtenerRateConfigurado(esLiturgia = true) {
    if (typeof window === 'undefined') return 1.3;
    const rateGuardado = localStorage.getItem('pref-tts-rate');
    if (rateGuardado !== null) {
        const r = parseFloat(rateGuardado);
        if (!isNaN(r) && r >= 0.5 && r <= 2.0 && r !== 1.2 && r !== 1.0) return r;
    }
    // Si era 1.0 o 1.2 de versiones anteriores o no está configurado, actualizar a 1.3 por defecto
    if (typeof window !== 'undefined') {
        localStorage.setItem('pref-tts-rate', '1.3');
    }
    return 1.3;
}

export function resolverNombreLibroBiblico(cita = '') {
    if (!cita) return 'de la Sagrada Escritura';
    const clean = cita.trim();
    const siglaMatch = clean.match(/^([0-9]?\s*[A-Za-zÁ-ú]+)/);
    const sigla = siglaMatch ? siglaMatch[1].replace(/\s+/g, '').toLowerCase() : '';

    const MAPA_LIBROS = {
        'is': 'del profeta Isaías',
        'isa': 'del profeta Isaías',
        'isaias': 'del profeta Isaías',
        'jer': 'del profeta Jeremías',
        'lam': 'del libro de las Lamentaciones',
        'bar': 'del profeta Baruc',
        'ez': 'del profeta Ezequiel',
        'dan': 'del profeta Daniel',
        'os': 'del profeta Oseas',
        'jl': 'del profeta Joel',
        'am': 'del profeta Amós',
        'abd': 'del profeta Abdías',
        'jon': 'del profeta Jonás',
        'miq': 'del profeta Miqueas',
        'nah': 'del profeta Nahúm',
        'hab': 'del profeta Habacuc',
        'sof': 'del profeta Sofonías',
        'hag': 'del profeta Ageo',
        'zac': 'del profeta Zacarías',
        'mal': 'del profeta Malaquías',
        'rm': 'de la carta del apóstol san Pablo a los Romanos',
        'rom': 'de la carta del apóstol san Pablo a los Romanos',
        '1co': 'de la primera carta del apóstol san Pablo a los Corintios',
        '1cor': 'de la primera carta del apóstol san Pablo a los Corintios',
        '2co': 'de la segunda carta del apóstol san Pablo a los Corintios',
        '2cor': 'de la segunda carta del apóstol san Pablo a los Corintios',
        'ga': 'de la carta del apóstol san Pablo a los Gálatas',
        'gal': 'de la carta del apóstol san Pablo a los Gálatas',
        'ef': 'de la carta del apóstol san Pablo a los Efesios',
        'flp': 'de la carta del apóstol san Pablo a los Filipenses',
        'fil': 'de la carta del apóstol san Pablo a los Filipenses',
        'col': 'de la carta del apóstol san Pablo a los Colosenses',
        '1ts': 'de la primera carta del apóstol san Pablo a los Tesalonicenses',
        '1tes': 'de la primera carta del apóstol san Pablo a los Tesalonicenses',
        '2ts': 'de la segunda carta del apóstol san Pablo a los Tesalonicenses',
        '2tes': 'de la segunda carta del apóstol san Pablo a los Tesalonicenses',
        '1tm': 'de la primera carta del apóstol san Pablo a Timoteo',
        '1tim': 'de la primera carta del apóstol san Pablo a Timoteo',
        '2tm': 'de la segunda carta del apóstol san Pablo a Timoteo',
        '2tim': 'de la segunda carta del apóstol san Pablo a Timoteo',
        'tt': 'de la carta del apóstol san Pablo a Tito',
        'tit': 'de la carta del apóstol san Pablo a Tito',
        'flm': 'de la carta del apóstol san Pablo a Filemón',
        'hb': 'de la carta a los Hebreos',
        'heb': 'de la carta a los Hebreos',
        'sant': 'de la carta del apóstol Santiago',
        'stgo': 'de la carta del apóstol Santiago',
        '1p': 'de la primera carta del apóstol san Pedro',
        '1pe': 'de la primera carta del apóstol san Pedro',
        '2p': 'de la segunda carta del apóstol san Pedro',
        '2pe': 'de la segunda carta del apóstol san Pedro',
        '1jn': 'de la primera carta del apóstol san Juan',
        '2jn': 'de la segunda carta del apóstol san Juan',
        '3jn': 'de la tercera carta del apóstol san Juan',
        'jud': 'de la carta del apóstol san Judas',
        'ap': 'del libro del Apocalipsis',
        'gn': 'del libro del Génesis',
        'ex': 'del libro del Éxodo',
        'dt': 'del libro del Deuteronomio',
        'sab': 'del libro de la Sabiduría',
        'eclo': 'del libro del Eclesiástico'
    };

    return MAPA_LIBROS[sigla] || `del libro de ${clean.replace(/[\d,.\s-]+$/, '')}`;
}

export function limpiarTextoParaVoz(texto = '') {
    if (!texto) return '';
    return texto
        .replace(/\[?\s*\(?\s*no\s+se\s+dice\s+(?:el\s+)?(?:«|"|'|“)?gloria\s+al\s+padre(?:»|"|'|”)?(?:\s|[^a-záéíóúüñ\n])*/gi, '') // Omitir "No se dice Gloria al Padre"
        .replace(/\([^\)]*\)/g, '') // Eliminar notas parentéticas
        .replace(/[*✦]/g, '')       // Eliminar asteriscos y cruces de pausa métrica
        .replace(/\bV\.\s*/g, '')   // Omitir V.
        .replace(/\bR\.\s*/g, '')   // Omitir R.
        .replace(/\bAnt\.\s*/gi, '') // Omitir Ant.
        .replace(/\s+/g, ' ')
        .trim();
}

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

// =========================================================================
// CLASE PRINCIPAL CINTA LITÚRGICA
// =========================================================================

export class CintaLiturgica {
    constructor(contenedorId = 'cinta-container', opciones = {}) {
        this.contenedor = typeof contenedorId === 'string' ? document.getElementById(contenedorId) : contenedorId;
        this.opciones = {
            tiempo: 'Tiempo Ordinario',
            semana: 25,
            dia: 'Lunes',
            libro: 'laudes',
            tiempoSlug: 'ordinario',
            diaSlug: 'lunes',
            textoMetadatos: null,
            baseCelebracionId: '',
            ...opciones
        };

        // Estado del Reproductor y Modo Activo (Por defecto: Evangelio)
        this.modoActivo = 'evangelio';
        this.audios = {
            evangelio: '',
            hora: '',
            lectura1: '',
            lectura2: ''
        };
        this.subtitulos = {
            evangelio: '',
            hora: '',
            lectura1: '',
            lectura2: ''
        };

        // Reproductor de Audio HTML5 (para Evangelio, Lectura 1 y Lectura 2)
        this.audio = new Audio();

        // Motor de Texto a Voz (TTS) para el Rezo de las Horas (segundo icono)
        this.ttsState = {
            fullText: '',
            chunks: [],
            currentChunkIndex: 0,
            currentCharIndex: 0,
            isSpeaking: false,
            heartbeatId: null,
            timerId: null,
            totalDurationSecs: 0
        };

        // Control de Zoom con fórmula: font-size: calc(var(--size) * var(--font-zoom));
        // Base: --size: 16px, --font-zoom: 1 (rango de 10px a 50px => fontZoom entre 0.625 y 3.125)
        const guardadoZoom = parseFloat(localStorage.getItem('lh_font_zoom'));
        if (!isNaN(guardadoZoom) && guardadoZoom >= 0.625 && guardadoZoom <= 3.125) {
            this.fontZoom = guardadoZoom;
        } else {
            const guardadoSize = parseInt(localStorage.getItem('lh_font_size'), 10);
            this.fontZoom = (!isNaN(guardadoSize) && guardadoSize >= 10 && guardadoSize <= 50) ? (guardadoSize / 16) : 1.0;
        }
        this.aplicarTamanoTexto(this.fontZoom);

        // Sincronizar tamaño desde Firebase al inicializar o autenticar
        const sincronizarZoomDesdeFirebase = async () => {
            if (window.firebaseAPI && window.firebaseAPI.cargarAjustesFirestore) {
                try {
                    const datos = await window.firebaseAPI.cargarAjustesFirestore('cinta_zoom');
                    if (datos && (datos.fontZoom !== undefined || datos.fontSize !== undefined)) {
                        let zoomRemoto = datos.fontZoom !== undefined ? parseFloat(datos.fontZoom) : (parseFloat(datos.fontSize) / 16);
                        if (!isNaN(zoomRemoto) && zoomRemoto >= 0.625 && zoomRemoto <= 3.125) {
                            this.fontZoom = zoomRemoto;
                            localStorage.setItem('lh_font_zoom', this.fontZoom.toFixed(4));
                            localStorage.setItem('lh_font_size', String(Math.round(this.fontZoom * 16)));
                            this.aplicarTamanoTexto(this.fontZoom);
                            console.log(`☁️ [Cinta] Tamaño de texto sincronizado desde Firebase: ${Math.round(this.fontZoom * 16)}px`);
                        }
                    }
                } catch (err) {
                    console.warn("⚠️ Aviso al sincronizar tamaño de texto desde Firebase:", err);
                }
            }
        };

        if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
            window.firebaseAPI.onAuthReady(sincronizarZoomDesdeFirebase);
        } else {
            const checkAuth = setInterval(() => {
                if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
                    window.firebaseAPI.onAuthReady(sincronizarZoomDesdeFirebase);
                    clearInterval(checkAuth);
                }
            }, 500);
            setTimeout(() => clearInterval(checkAuth), 8000);
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'lh_font_zoom' || e.key === 'lh_font_size') {
                const z = parseFloat(localStorage.getItem('lh_font_zoom'));
                if (!isNaN(z) && z >= 0.625 && z <= 3.125 && z !== this.fontZoom) {
                    this.fontZoom = z;
                    this.aplicarTamanoTexto(this.fontZoom);
                }
            }
        });

        this.render();
        this.vincularEventos();
    }

    formatearTextoMetadatos(semana, dia) {
        if (this.opciones.textoMetadatos) {
            return this.opciones.textoMetadatos;
        }
        const slugT = (this.opciones.tiempoSlug || '').toLowerCase();
        const tiempoStr = (this.opciones.tiempo || '').toLowerCase();
        const celebracionesSlugs = ['santos', 'solemnidades', 'fiestas'];
        if (celebracionesSlugs.includes(slugT) || celebracionesSlugs.includes(tiempoStr)) {
            if (dia) return dia;
            if (slugT === 'solemnidades' || tiempoStr === 'solemnidades') return 'Solemnidades';
            if (slugT === 'fiestas' || tiempoStr === 'fiestas') return 'Fiestas';
            return 'Santos';
        }
        if (!semana) return dia || '';
        const numSemana = String(semana).replace(/^semana\s*/i, '').replace(/^sem\s*/i, '').trim();
        return `<span class="lbl-semana-larga">Semana</span><span class="lbl-semana-corta">SEM</span> ${numSemana} • ${dia}`;
    }

    render() {
        if (!this.contenedor) return;

        const {
            tiempo = 'Tiempo Ordinario',
            semana = 25,
            dia = 'Lunes',
            libro = 'laudes',
            tiempoSlug = 'ordinario',
            diaSlug = 'lunes'
        } = this.opciones;

        const horas = [
            { id: 'oficio', label: 'Oficio' },
            { id: 'laudes', label: 'Laudes' },
            { id: 'tercia', label: 'Tercia' },
            { id: 'sexta', label: 'Sexta' },
            { id: 'nona', label: 'Nona' },
            { id: 'visperas', label: 'Vísperas' },
            { id: 'completas', label: 'Completas' }
        ];

        const slugTiempo = (tiempoSlug || 'ordinario').toLowerCase();
        const mapT = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp', santos: 'san', solemnidades: 'sol', fiestas: 'fie' };
        const mapD = { domingo: 'do', lunes: 'lu', martes: 'ma', miercoles: 'mi', jueves: 'ju', viernes: 'vi', sabado: 'sa' };
        const mapH = { oficio: 'of', laudes: 'la', tercia: 'te', sexta: 'se', nona: 'no', visperas: 'vi', completas: 'co' };
        const tCode = mapT[slugTiempo] || 'to';
        const dCode = mapD[diaSlug] || 'do';
        const semPad = String(semana).padStart(2, '0');

        const horaBtnsHtml = horas.map(h => {
            const activo = (libro.toLowerCase() === h.id.toLowerCase()) ? 'activo' : '';
            const hCode = mapH[h.id] || 'la';
            let href = '';
            if (slugTiempo === 'santos' || slugTiempo === 'solemnidades' || slugTiempo === 'fiestas') {
                const baseId = this.opciones.baseCelebracionId || (diaSlug || '').replace(/(of|la|te|se|no|vi|co)$/i, '') || 'sa0101santamaria';
                const sParam = this.opciones.santo ? `&santo=${encodeURIComponent(this.opciones.santo)}` : '';
                const fParam = this.opciones.fecha ? `&fecha=${encodeURIComponent(this.opciones.fecha)}` : '';
                const tParam = (slugTiempo === 'solemnidades' || slugTiempo === 'fiestas') ? `&tiempo=${slugTiempo}` : '';
                href = `salterios.html?libro=${h.id}&id=${baseId}${hCode}${tParam}${sParam}${fParam}`;
            } else {
                const docId = `${tCode}s${semPad}${dCode}${hCode}`;
                href = `?tiempo=${slugTiempo}&semana=${semana}&dia=${diaSlug}&libro=${h.id}&hora=${h.id}&id=${docId}`;
            }
            return `<a href="${href}" class="cinta-btn-hora ${activo}" data-libro="${h.id}">${h.label}</a>`;
        }).join('');

        this.contenedor.innerHTML = `
            <div class="cinta-top-bar" id="cinta-top-bar">
                <!-- Fila 1: Metadatos, Zoom y Selector de Iglesia -->
                <div class="cinta-fila-sup">
                    <div class="cinta-sup-izq">
                        <button type="button" class="cinta-badge-tiempo tiempo-${slugTiempo}" id="btn-toggle-tiempo" title="Toca para ocultar o mostrar el reproductor y las horas">
                            ${tiempo.toUpperCase()}
                        </button>
                        <span class="cinta-texto-metadatos" id="cinta-texto-metadatos">${this.formatearTextoMetadatos(semana, dia)}</span>
                        <div class="cinta-zoom-controles">
                            <button type="button" class="cinta-btn-zoom" id="btn-zoom-menos" title="Disminuir tamaño de letra">−</button>
                            <button type="button" class="cinta-btn-zoom" id="btn-zoom-mas" title="Aumentar tamaño de letra">+</button>
                            <span class="cinta-zoom-valor" id="cinta-zoom-valor" title="Doble clic para restablecer tamaño (16px)">${Math.round(this.fontZoom * 16)}px</span>
                        </div>
                    </div>

                    <div class="cinta-sup-der">
                        <button type="button" class="cinta-btn-iglesia" id="btn-iglesia-selector" title="Seleccionar fuente de audio">
                            <span class="material-symbols-outlined">church</span>
                        </button>

                        <!-- Menú Desplegable con Efecto Slide-Down -->
                        <div class="cinta-menu-audios" id="cinta-menu-audios">
                            <button type="button" class="cinta-menu-item ${this.modoActivo === 'evangelio' ? 'activo' : ''}" data-modo="evangelio">
                                <span class="cinta-item-badge badge-evangelio">✞</span>
                                <div class="cinta-item-info">
                                    <div class="cinta-item-titulo">Evangelio del Día</div>
                                    <div class="cinta-item-sub" id="menu-sub-evangelio">Blanco con flecha negra</div>
                                </div>
                            </button>
                            <button type="button" class="cinta-menu-item ${this.modoActivo === 'hora' ? 'activo' : ''}" data-modo="hora">
                                <span class="cinta-item-badge badge-hora">🙏</span>
                                <div class="cinta-item-info">
                                    <div class="cinta-item-titulo">Liturgia de la Hora (${libro.toUpperCase()})</div>
                                    <div class="cinta-item-sub" id="menu-sub-hora">Lector de voz (Azul con flecha blanca)</div>
                                </div>
                            </button>
                            <button type="button" class="cinta-menu-item ${this.modoActivo === 'lectura1' ? 'activo' : ''}" data-modo="lectura1">
                                <span class="cinta-item-badge badge-lectura1">1️⃣</span>
                                <div class="cinta-item-info">
                                    <div class="cinta-item-titulo">1ª Lectura del Oficio</div>
                                    <div class="cinta-item-sub" id="menu-sub-lectura1">Verde con flecha blanca</div>
                                </div>
                            </button>
                            <button type="button" class="cinta-menu-item ${this.modoActivo === 'lectura2' ? 'activo' : ''}" data-modo="lectura2">
                                <span class="cinta-item-badge badge-lectura2">2️⃣</span>
                                <div class="cinta-item-info">
                                    <div class="cinta-item-titulo">2ª Lectura del Oficio</div>
                                    <div class="cinta-item-sub" id="menu-sub-lectura2">Rojo con flecha blanca</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Fila 2: Reproductor y Navegación de Horas (Colapsable al pulsar en el Tiempo Litúrgico) -->
                <div class="cinta-fila-inf" id="cinta-fila-inf">
                    <div class="cinta-reproductor-horas">
                        <button type="button" class="cinta-btn-play modo-evangelio" id="btn-cinta-play" title="Reproducir Evangelio">
                            <span class="material-symbols-outlined" id="cinta-icon-play">play_arrow</span>
                        </button>
                        <nav class="cinta-horas-nav" id="cinta-horas-nav">
                            ${horaBtnsHtml}
                        </nav>
                    </div>

                    <!-- Barra de Progreso y Tiempos con Scrubber Amarillo -->
                    <div class="cinta-barra-progreso-box">
                        <span class="cinta-tiempo-num" id="cinta-tiempo-actual">0:00</span>
                        <input type="range" class="cinta-slider-progreso" id="cinta-slider-progreso" min="0" max="100" value="0">
                        <span class="cinta-tiempo-num" id="cinta-tiempo-total">0:00</span>
                    </div>
                </div>
            </div>
        `;
    }

    vincularEventos() {
        // 1. Botón Colapsar / Desplegar Fila Inferior
        const btnToggleTiempo = document.getElementById('btn-toggle-tiempo');
        const filaInf = document.getElementById('cinta-fila-inf');
        if (btnToggleTiempo && filaInf) {
            btnToggleTiempo.addEventListener('click', () => {
                filaInf.classList.toggle('colapsado');
            });
        }

        // 2. Controles de Zoom de Tipografía (Usa --font-zoom)
        document.getElementById('btn-zoom-mas')?.addEventListener('click', () => {
            this.cambiarTamanoTexto(1);
        });

        document.getElementById('btn-zoom-menos')?.addEventListener('click', () => {
            this.cambiarTamanoTexto(-1);
        });

        // Doble clic o doble toque para restablecer a 16px (1.0)
        const spanZoom = document.getElementById('cinta-zoom-valor');
        if (spanZoom) {
            let ultimoClic = 0;
            const manejarDobleAccion = (e) => {
                const ahora = Date.now();
                const diferencia = ahora - ultimoClic;
                if (diferencia < 350 && diferencia > 0) {
                    if (e && e.preventDefault) e.preventDefault();
                    this.resetearTamanoTexto();
                    ultimoClic = 0;
                } else {
                    ultimoClic = ahora;
                }
            };

            spanZoom.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.resetearTamanoTexto();
            });

            spanZoom.addEventListener('click', (e) => {
                manejarDobleAccion(e);
            });

            spanZoom.addEventListener('touchend', (e) => {
                manejarDobleAccion(e);
            });
        }

        // 3. Menú Desplegable de la Iglesia
        const btnIglesia = document.getElementById('btn-iglesia-selector');
        const menuAudios = document.getElementById('cinta-menu-audios');

        if (btnIglesia && menuAudios) {
            btnIglesia.addEventListener('click', (e) => {
                e.stopPropagation();
                menuAudios.classList.toggle('abierto');
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!menuAudios.contains(e.target) && !btnIglesia.contains(e.target)) {
                    menuAudios.classList.remove('abierto');
                }
            });

            // Selección de modo en el menú
            menuAudios.querySelectorAll('.cinta-menu-item').forEach(item => {
                item.addEventListener('click', () => {
                    const modo = item.getAttribute('data-modo');
                    if (modo) {
                        this.cambiarModoAudio(modo, true);
                        menuAudios.classList.remove('abierto');
                    }
                });
            });
        }

        // 4. Controles del Reproductor Unificado
        const btnPlay = document.getElementById('btn-cinta-play');
        const slider = document.getElementById('cinta-slider-progreso');
        const tActual = document.getElementById('cinta-tiempo-actual');
        const tTotal = document.getElementById('cinta-tiempo-total');
        const iconPlay = document.getElementById('cinta-icon-play');

        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                this.togglePlay();
            });
        }

        // Eventos del Audio HTML5 (Evangelio, Lectura 1, Lectura 2)
        this.audio.addEventListener('play', () => {
            if (this.modoActivo !== 'hora' && iconPlay) iconPlay.textContent = 'pause';
        });

        this.audio.addEventListener('pause', () => {
            if (this.modoActivo !== 'hora' && iconPlay) iconPlay.textContent = 'play_arrow';
        });

        this.audio.addEventListener('ended', () => {
            if (this.modoActivo !== 'hora') {
                if (iconPlay) iconPlay.textContent = 'play_arrow';
                if (slider) slider.value = 0;
                if (tActual) tActual.textContent = '0:00';
            }
        });

        this.audio.addEventListener('timeupdate', () => {
            if (this.modoActivo !== 'hora') {
                if (!isNaN(this.audio.duration) && this.audio.duration > 0) {
                    const porcentaje = (this.audio.currentTime / this.audio.duration) * 100;
                    if (slider) slider.value = porcentaje;
                    if (tActual) tActual.textContent = this.formatearTiempo(this.audio.currentTime);
                    if (tTotal) tTotal.textContent = this.formatearTiempo(this.audio.duration);
                }
            }
        });

        this.audio.addEventListener('loadedmetadata', () => {
            if (this.modoActivo !== 'hora') {
                if (tTotal && !isNaN(this.audio.duration)) {
                    tTotal.textContent = this.formatearTiempo(this.audio.duration);
                }
            }
        });

        if (slider) {
            slider.addEventListener('input', () => {
                if (this.modoActivo === 'hora') {
                    // Seek en lectura de voz TTS
                    this.seekTTS((slider.value / 100));
                } else {
                    if (!isNaN(this.audio.duration) && this.audio.duration > 0) {
                        this.audio.currentTime = (slider.value / 100) * this.audio.duration;
                    }
                }
            });
        }
    }

    // Alternar Reproducción / Pausa
    togglePlay() {
        if (this.modoActivo === 'hora') {
            this.togglePlayTTS();
            return;
        }

        // Modos con audio HTML5
        const urlAudio = this.audios[this.modoActivo];
        if (!urlAudio) {
            alert(`No hay archivo de audio asignado para ${MODOS_AUDIO[this.modoActivo]?.nombre || 'este modo'}.`);
            return;
        }

        if (this.audio.src !== urlAudio) {
            this.audio.src = urlAudio;
            this.audio.load();
        }

        if (this.audio.paused) {
            this.detenerTTS();
            this.audio.play().catch(err => {
                console.warn('Error al reproducir audio:', err);
            });
        } else {
            this.audio.pause();
        }
    }

    // =========================================================================
    // MOTOR DE TEXTO A VOZ (TTS) PARA EL REZO DE LAS HORAS
    // =========================================================================

    construirGuionLiturgico() {
        const d = (typeof window !== 'undefined' && window.__salterioDataActual) ? window.__salterioDataActual : (this && this.datosLiturgia ? this.datosLiturgia : null);
        const segmentos = [];

        if (d) {
            // Manejo específico para Oficio de Lectura
            if (d.libro === 'oficio') {
                // 1. INVITATORIO E INVOCACIÓN INICIAL OFICIO
                segmentos.push({ texto: "Señor, abre mis labios. Y mi boca proclamará tu alabanza." });
                segmentos.push({ texto: "Dios mío, ven en mi auxilio. Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén. Aleluya." });

                // 2. HIMNO
                if (d.himno && d.himno.texto) {
                    segmentos.push({ texto: "Himno." });
                    segmentos.push({ texto: limpiarTextoParaVoz(d.himno.texto) });
                }

                // 3. SALMODIA
                if (d.salmodia) {
                    segmentos.push({ texto: "Salmodia." });
                    if (d.salmodia.salmo1Texto) {
                        segmentos.push({ texto: `Antífona 1. ${limpiarTextoParaVoz(d.salmodia.ant1 || '')}` });
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo1Texto) });
                        if (d.salmodia.ant1) segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant1) });
                    }
                    if (d.salmodia.salmo2Texto) {
                        segmentos.push({ texto: `Antífona 2. ${limpiarTextoParaVoz(d.salmodia.ant2 || '')}` });
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo2Texto) });
                        if (d.salmodia.ant2) segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant2) });
                    }
                    if (d.salmodia.salmo3Texto) {
                        segmentos.push({ texto: `Antífona 3. ${limpiarTextoParaVoz(d.salmodia.ant3 || '')}` });
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo3Texto) });
                        if (d.salmodia.ant3) segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant3) });
                    }
                }

                // 4. RESPONSORIO POST-SALMODIA (IMAGEN 3)
                if (d.versiculo) {
                    if (d.versiculo.v) segmentos.push({ texto: limpiarTextoParaVoz(d.versiculo.v) });
                    if (d.versiculo.r) segmentos.push({ texto: limpiarTextoParaVoz(d.versiculo.r) });
                }

                // 5. PRIMERA LECTURA (IMAGEN 4)
                if (d.lecturasOficio && d.lecturasOficio.primera) {
                    const l1 = d.lecturasOficio.primera;
                    const tit1 = l1.epigrafeTipo || 'Primera lectura';
                    const cita1 = l1.cita ? resolverNombreLibroBiblico(l1.cita) : '';
                    segmentos.push({ texto: `${tit1} ${cita1}. ${limpiarTextoParaVoz(l1.descripcion || l1.subtitulo || '')}` });
                    if (l1.texto) {
                        segmentos.push({ texto: limpiarTextoParaVoz(l1.texto) });
                    }
                    const r1 = l1.respR1 || l1.responsorio?.r1 || '';
                    const v1 = l1.respV || l1.responsorio?.v || '';
                    const r2 = l1.respR2 || l1.responsorio?.r2 || '';
                    if (r1) {
                        segmentos.push({ texto: "Responsorio." });
                        if (r1.includes('*')) {
                            const partes = r1.split('*');
                            segmentos.push({ texto: limpiarTextoParaVoz(partes[0].trim()) });
                            segmentos.push({ texto: limpiarTextoParaVoz(partes[1].trim()) });
                        } else {
                            segmentos.push({ texto: limpiarTextoParaVoz(r1) });
                            if (r2) segmentos.push({ texto: limpiarTextoParaVoz(r2) });
                        }
                        if (v1) segmentos.push({ texto: limpiarTextoParaVoz(v1) });
                        if (r2) segmentos.push({ texto: limpiarTextoParaVoz(r2) });
                    }
                }

                // 6. SEGUNDA LECTURA PATRÍSTICA
                if (d.lecturasOficio && d.lecturasOficio.segunda) {
                    const l2 = d.lecturasOficio.segunda;
                    const tit2 = l2.epigrafeTipo || 'Segunda lectura';
                    segmentos.push({ texto: `${tit2}. ${limpiarTextoParaVoz(l2.cita || '')}. ${limpiarTextoParaVoz(l2.descripcion || l2.subtitulo || '')}` });
                    if (l2.texto) {
                        segmentos.push({ texto: limpiarTextoParaVoz(l2.texto) });
                    }
                    const r1_2 = l2.respR1 || l2.responsorio?.r1 || '';
                    const v_2 = l2.respV || l2.responsorio?.v || '';
                    const r2_2 = l2.respR2 || l2.responsorio?.r2 || '';
                    if (r1_2) {
                        segmentos.push({ texto: "Responsorio." });
                        if (r1_2.includes('*')) {
                            const partes = r1_2.split('*');
                            segmentos.push({ texto: limpiarTextoParaVoz(partes[0].trim()) });
                            segmentos.push({ texto: limpiarTextoParaVoz(partes[1].trim()) });
                        } else {
                            segmentos.push({ texto: limpiarTextoParaVoz(r1_2) });
                            if (r2_2) segmentos.push({ texto: limpiarTextoParaVoz(r2_2) });
                        }
                        if (v_2) segmentos.push({ texto: limpiarTextoParaVoz(v_2) });
                        if (r2_2) segmentos.push({ texto: limpiarTextoParaVoz(r2_2) });
                    }
                }

                // 7. HIMNO TE DEUM
                if (d.dia === 'domingo' || d.tiempo === 'pascua' || d.tiempo === 'navidad' || d.himnoTeDeum) {
                    segmentos.push({ texto: "Himno. A ti, oh Dios." });
                    const teDeumTexto = d.himnoTeDeum?.texto || `A ti, oh Dios, te alabamos, a ti, Señor, te reconocemos. A ti, eterno Padre, te venera toda la creación.`;
                    segmentos.push({ texto: limpiarTextoParaVoz(teDeumTexto) });
                }

                // 8. SECCIÓN OPCIONAL
                if (d.seccionOpcional?.texto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.seccionOpcional.texto) });
                }

                // 9. ORACIÓN
                if (d.oracion) {
                    segmentos.push({ texto: "Oración." });
                    const textoOr = typeof d.oracion === 'string' ? d.oracion : (d.oracion.texto || '');
                    segmentos.push({ texto: limpiarTextoParaVoz(textoOr) });
                }

                // 10. CONCLUSIÓN
                segmentos.push({ texto: "Bendigamos al Señor. Demos gracias a Dios." });
                return segmentos;
            }

            // 1. INVITATORIO / INVOCACION INICIAL (Laudes y otras horas)
            if (d.invitatorio && d.invitatorio.activo) {
                segmentos.push({ texto: "Señor, ábreme los labios. Y mi boca proclamará tu alabanza." });
                if (d.invitatorio.antifona) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.invitatorio.antifona) });
                }
                if (d.invitatorio.salmoTexto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.invitatorio.salmoTexto) });
                }
                if (d.invitatorio.antifona) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.invitatorio.antifona) });
                }
            } else if (d.invocacionInicial) {
                segmentos.push({ texto: "Dios mío, ven en mi auxilio. Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén. Aleluya." });
            }

            // 2. HIMNO
            if (d.himno && d.himno.texto) {
                segmentos.push({ texto: "Himno." });
                segmentos.push({ texto: limpiarTextoParaVoz(d.himno.texto) });
            }

            // 3. SALMODIA
            if (d.salmodia) {
                segmentos.push({ texto: "Salmodia." });

                if (d.salmodia.salmo1Texto) {
                    segmentos.push({ texto: `Antífona 1. ${limpiarTextoParaVoz(d.salmodia.ant1 || '')}` });
                    segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo1Texto) });
                    if (d.salmodia.ant1) {
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant1) });
                    }
                }

                if (d.salmodia.salmo2Texto) {
                    segmentos.push({ texto: `Antífona 2. ${limpiarTextoParaVoz(d.salmodia.ant2 || '')}` });
                    segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo2Texto) });
                    if (d.salmodia.ant2) {
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant2) });
                    }
                }

                if (d.salmodia.salmo3Texto) {
                    segmentos.push({ texto: `Antífona 3. ${limpiarTextoParaVoz(d.salmodia.ant3 || '')}` });
                    segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo3Texto) });
                    if (d.salmodia.ant3) {
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant3) });
                    }
                }
            }

            // 4. LECTURA BREVE
            if (d.lecturaBreve) {
                const nombreLibro = resolverNombreLibroBiblico(d.lecturaBreve.cita);
                segmentos.push({ texto: `Lectura breve ${nombreLibro}.` });
                if (d.lecturaBreve.texto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.lecturaBreve.texto) });
                }
                segmentos.push({ texto: "Palabra de Dios. Te alabamos, Señor." });
            }

            // 5. RESPONSORIO BREVE
            if (d.lecturaBreve && d.lecturaBreve.responsorioBreve) {
                const rb = d.lecturaBreve.responsorioBreve;
                segmentos.push({ texto: "Responderemos:" });
                if (rb.v1) segmentos.push({ texto: limpiarTextoParaVoz(rb.v1) });
                if (rb.r1) segmentos.push({ texto: limpiarTextoParaVoz(rb.r1) });
                if (rb.v2) segmentos.push({ texto: limpiarTextoParaVoz(rb.v2) });
                if (rb.r2) segmentos.push({ texto: limpiarTextoParaVoz(rb.r2) });
                if (rb.v3) segmentos.push({ texto: limpiarTextoParaVoz(rb.v3) });
                if (rb.r3) {
                    segmentos.push({ 
                        texto: limpiarTextoParaVoz(rb.r3),
                        esPausaPedagogica: true,
                        mensajePausa: "Puedes seleccionar para reproducir las lecturas y el evangelio."
                    });
                }
            }

            // 6. CÁNTICO EVANGÉLICO
            if (d.canticoEvangelico) {
                segmentos.push({ texto: "Cántico evangélico.", esInicioSegundaParte: true });
                if (d.canticoEvangelico.antifona) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.canticoEvangelico.antifona) });
                }
                if (d.canticoEvangelico.texto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.canticoEvangelico.texto) });
                }
                if (d.canticoEvangelico.antifona) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.canticoEvangelico.antifona) });
                }
            }

            // 7. PRECES
            if (d.preces) {
                segmentos.push({ texto: "Preces." });
                if (d.preces.intro) segmentos.push({ texto: limpiarTextoParaVoz(d.preces.intro) });
                if (d.preces.respuesta) segmentos.push({ texto: limpiarTextoParaVoz(d.preces.respuesta) });
                if (Array.isArray(d.preces.intenciones)) {
                    d.preces.intenciones.forEach(it => {
                        segmentos.push({ texto: limpiarTextoParaVoz(it) });
                    });
                } else if (d.preces.intenciones) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.preces.intenciones) });
                }
                segmentos.push({ texto: "Se pueden añadir algunas intenciones libres." });
                if (d.preces.concl) segmentos.push({ texto: limpiarTextoParaVoz(d.preces.concl) });
            }

            // 8. PADRE NUESTRO
            segmentos.push({ 
                texto: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén." 
            });

            // 9. ORACIÓN
            if (d.oracion) {
                segmentos.push({ texto: "Oración." });
                const textoOr = typeof d.oracion === 'string' ? d.oracion : (d.oracion.texto || '');
                segmentos.push({ texto: limpiarTextoParaVoz(textoOr) });
            }

            // 10. CONCLUSIÓN
            segmentos.push({ texto: "El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna. Amén." });
        } else {
            const fallbackTexto = this.extraerTextoLiturgicoDOM();
            segmentos.push({ texto: fallbackTexto });
        }

        return segmentos;
    }

    extraerTextoLiturgicoDOM() {
        const contenedor = document.getElementById('salterio-contenido');
        if (!contenedor) return '';

        const clone = contenedor.cloneNode(true);
        clone.querySelectorAll('button, .material-symbols-outlined, style, script, input, .admin-toolbar-salterios, .rubrica-nota, .salterio-libro-subtitulo').forEach(n => n.remove());

        let texto = clone.innerText || clone.textContent || '';
        return limpiarTextoParaVoz(texto);
    }

    prepararTTS() {
        const segmentos = this.construirGuionLiturgico();
        const allChunks = [];
        let runningStart = 0;
        let resumeIdx = null;

        segmentos.forEach(seg => {
            if (!seg || !seg.texto || !seg.texto.trim()) return;
            const subchunks = dividirEnFrasesLectura(seg.texto, 170);
            subchunks.forEach((sc, idx) => {
                const chunkStart = runningStart;
                const chunkEnd = runningStart + sc.text.length;
                runningStart = chunkEnd + 1;

                const chunkObj = {
                    text: sc.text,
                    start: chunkStart,
                    end: chunkEnd,
                    esPausaPedagogica: (idx === subchunks.length - 1) && !!seg.esPausaPedagogica,
                    mensajePausa: seg.mensajePausa || ''
                };

                if (seg.esInicioSegundaParte && resumeIdx === null) {
                    resumeIdx = allChunks.length;
                }

                allChunks.push(chunkObj);
            });
        });

        this.ttsState.chunks = allChunks;
        this.ttsState.fullText = allChunks.map(c => c.text).join(' ');
        this.ttsState.checkpointResumeIndex = resumeIdx;
        this.ttsState.currentChunkIndex = 0;
        this.ttsState.currentCharIndex = 0;
        this.ttsState.bufferListo = false;

        const rate = obtenerRateConfigurado(true);
        const words = this.ttsState.fullText.split(/\s+/).filter(Boolean).length;
        this.ttsState.totalDurationSecs = Math.max(10, Math.round((words / (135 * rate)) * 60));

        const tTotal = document.getElementById('cinta-tiempo-total');
        if (tTotal) tTotal.textContent = this.formatearTiempo(this.ttsState.totalDurationSecs);
    }

    togglePlayTTS() {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert('Tu navegador no soporta la función de lectura por voz (SpeechSynthesis).');
            return;
        }

        // Detener audio HTML5 si estaba sonando
        if (!this.audio.paused) this.audio.pause();

        if (this.ttsState.isSpeaking) {
            this.pausarTTS();
        } else {
            this.reproducirTTS();
        }
    }

    reproducirTTS() {
        if (!this.ttsState.fullText || this.ttsState.chunks.length === 0) {
            this.prepararTTS();
        }

        if (!this.ttsState.fullText) {
            alert('No hay contenido litúrgico disponible para leer por voz en esta hora.');
            return;
        }

        // Si el buffer no ha cargado, simular carga en barra de progreso hasta el 3% para arrancar
        if (!this.ttsState.bufferListo) {
            let bufferPct = 0;
            const stepBuffer = () => {
                bufferPct += 1;
                document.documentElement.style.setProperty('--progreso-buffer', `${bufferPct}%`);
                if (bufferPct === 3) {
                    this.ttsState.bufferListo = true;
                    this.iniciarLocucionActivaTTS();
                }
                if (bufferPct < 100) {
                    setTimeout(stepBuffer, bufferPct < 6 ? 90 : 30);
                }
            };
            stepBuffer();
        } else {
            this.iniciarLocucionActivaTTS();
        }
    }

    iniciarLocucionActivaTTS() {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            this.ttsState.isSpeaking = true;
            this.actualizarIconoPlay(true);
            this.iniciarHeartbeatTTS();
            this.iniciarTrackingProgresoTTS();
            return;
        }

        window.speechSynthesis.cancel();

        if (this.ttsState.currentCharIndex >= this.ttsState.fullText.length) {
            this.ttsState.currentCharIndex = 0;
            this.ttsState.currentChunkIndex = 0;
        }

        let targetIndex = this.ttsState.chunks.findIndex(c => this.ttsState.currentCharIndex < c.end);
        if (targetIndex === -1) targetIndex = 0;
        this.ttsState.currentChunkIndex = targetIndex;

        this.ttsState.isSpeaking = true;
        this.actualizarIconoPlay(true);
        this.iniciarHeartbeatTTS();
        this.iniciarTrackingProgresoTTS();
        this.reproducirChunkActualTTS();
    }

    reproducirChunkActualTTS() {
        if (!this.ttsState.isSpeaking) return;
        if (this.ttsState.currentChunkIndex >= this.ttsState.chunks.length) {
            this.finalizarTTS();
            return;
        }

        const chunk = this.ttsState.chunks[this.ttsState.currentChunkIndex];
        if (!chunk || !chunk.text) {
            this.finalizarTTS();
            return;
        }

        let offsetInChunk = 0;
        let textoChunk = chunk.text;
        if (this.ttsState.currentCharIndex > chunk.start && this.ttsState.currentCharIndex < chunk.end) {
            offsetInChunk = this.ttsState.currentCharIndex - chunk.start;
            textoChunk = chunk.text.slice(offsetInChunk).trim();
            if (!textoChunk) {
                this.ttsState.currentChunkIndex++;
                this.ttsState.currentCharIndex = chunk.end;
                this.reproducirChunkActualTTS();
                return;
            }
        }

        const vozElegida = obtenerVozConfigurada();
        const rateFinal = obtenerRateConfigurado(true);

        const utterance = new SpeechSynthesisUtterance(textoChunk);
        utterance.lang = (vozElegida && vozElegida.lang) ? vozElegida.lang : 'es-ES';
        utterance.rate = rateFinal;
        if (vozElegida) utterance.voice = vozElegida;

        utterance.onboundary = (e) => {
            if (e.charIndex !== undefined && this.ttsState.fullText) {
                const absChar = Math.min(chunk.end, chunk.start + offsetInChunk + e.charIndex);
                this.ttsState.currentCharIndex = absChar;
            }
        };

        utterance.onend = () => {
            if (this.ttsState.isSpeaking) {
                this.ttsState.currentCharIndex = chunk.end;

                // Pausa pedagógica al terminar el responsorio breve
                if (chunk.esPausaPedagogica) {
                    this.pausarTTS();
                    this.mostrarToastPausa(chunk.mensajePausa || "Puedes seleccionar para reproducir las lecturas y el evangelio.");
                    if (this.ttsState.checkpointResumeIndex !== null) {
                        this.ttsState.currentChunkIndex = this.ttsState.checkpointResumeIndex;
                        const nextChunk = this.ttsState.chunks[this.ttsState.currentChunkIndex];
                        if (nextChunk) this.ttsState.currentCharIndex = nextChunk.start;
                    } else {
                        this.ttsState.currentChunkIndex++;
                    }
                    return;
                }

                this.ttsState.currentChunkIndex++;
                if (this.ttsState.currentChunkIndex < this.ttsState.chunks.length) {
                    this.reproducirChunkActualTTS();
                } else {
                    this.finalizarTTS();
                }
            }
        };

        utterance.onerror = (err) => {
            if (err && (err.error === 'canceled' || err.error === 'interrupted')) return;
            console.warn('Error en TTS litúrgico:', err);
            this.ttsState.currentChunkIndex++;
            if (this.ttsState.currentChunkIndex < this.ttsState.chunks.length) {
                this.reproducirChunkActualTTS();
            } else {
                this.finalizarTTS();
            }
        };

        window.speechSynthesis.speak(utterance);
    }

    iniciarTrackingProgresoTTS() {
        if (this.ttsState.trackerId) clearInterval(this.ttsState.trackerId);
        this.ttsState.trackerId = setInterval(() => {
            if (!this.ttsState.isSpeaking) {
                if (this.ttsState.trackerId) clearInterval(this.ttsState.trackerId);
                this.ttsState.trackerId = null;
                return;
            }

            const totalChars = this.ttsState.fullText ? this.ttsState.fullText.length : 1;
            const currentChars = this.ttsState.currentCharIndex || 0;
            const ratio = Math.max(0, Math.min(1, currentChars / totalChars));

            const slider = document.getElementById('cinta-slider-progreso');
            const tActual = document.getElementById('cinta-tiempo-actual');

            if (slider) slider.value = ratio * 100;
            document.documentElement.style.setProperty('--progreso-reproduccion', `${(ratio * 100).toFixed(1)}%`);
            if (tActual) tActual.textContent = this.formatearTiempo(Math.round(ratio * (this.ttsState.totalDurationSecs || 60)));
        }, 200);
    }

    mostrarToastPausa(mensaje) {
        const prevToast = document.getElementById('cinta-toast-pausa');
        if (prevToast) prevToast.remove();
        const prevSvg = document.getElementById('cinta-overlay-flecha');
        if (prevSvg) prevSvg.remove();

        const btnIglesia = document.getElementById('btn-iglesia-selector');
        const menuAudios = document.getElementById('cinta-menu-audios');

        // 1. Abrir menú de audios de la iglesia y resaltar botón
        if (btnIglesia) btnIglesia.classList.add('resaltado-atencion');
        if (menuAudios) menuAudios.classList.add('abierto');

        // 2. Crear y desplegar toast de aviso
        const toast = document.createElement('div');
        toast.id = 'cinta-toast-pausa';
        toast.className = 'cinta-toast-pausa';
        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icono">info</span>
            <span class="toast-texto">${mensaje}</span>
            <button type="button" class="btn-cerrar-toast" title="Cerrar aviso">
                <span class="material-symbols-outlined">close</span>
            </button>
        `;
        document.body.appendChild(toast);

        // 3. Crear overlay SVG con flecha curva amarilla apuntando del toast al icono de la iglesia
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'cinta-overlay-flecha';
        svg.setAttribute('class', 'cinta-overlay-flecha');
        svg.innerHTML = `
            <defs>
                <marker id="flecha-punta-amarilla" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#eab308" />
                </marker>
                <filter id="flecha-sombra" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.8"/>
                </filter>
            </defs>
            <path d="" fill="none" stroke="#eab308" stroke-width="4.5" stroke-linecap="round" marker-end="url(#flecha-punta-amarilla)" filter="url(#flecha-sombra)" stroke-dasharray="10 5" class="cinta-path-flecha"/>
        `;
        document.body.appendChild(svg);

        const actualizarFlecha = () => {
            if (!document.body.contains(toast) || !btnIglesia) return;
            const rT = toast.getBoundingClientRect();
            const rB = btnIglesia.getBoundingClientRect();

            // Origen: borde superior derecho del toast
            const startX = rT.right - 14;
            const startY = rT.top + 8;

            // Destino: centro inferior del botón de la iglesia
            const endX = rB.left + (rB.width / 2);
            const endY = rB.bottom + 6;

            // Punto de control de curvatura hacia la derecha y arriba
            const cpX = Math.max(startX, endX) + 24;
            const cpY = Math.min(startY, endY) + 8;

            const path = svg.querySelector('path');
            if (path) {
                path.setAttribute('d', `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`);
            }
        };

        requestAnimationFrame(actualizarFlecha);
        window.addEventListener('resize', actualizarFlecha);
        window.addEventListener('scroll', actualizarFlecha);

        const limpiarAvisoYFlecha = () => {
            window.removeEventListener('resize', actualizarFlecha);
            window.removeEventListener('scroll', actualizarFlecha);
            if (btnIglesia) btnIglesia.classList.remove('resaltado-atencion');
            if (document.body.contains(svg)) svg.remove();
            if (document.body.contains(toast)) {
                toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(-10px)';
                setTimeout(() => toast.remove(), 300);
            }
        };

        toast.querySelector('.btn-cerrar-toast').addEventListener('click', limpiarAvisoYFlecha);

        if (menuAudios) {
            menuAudios.querySelectorAll('.cinta-menu-item').forEach(item => {
                item.addEventListener('click', limpiarAvisoYFlecha, { once: true });
            });
        }

        setTimeout(() => {
            limpiarAvisoYFlecha();
        }, 12000);
    }

    pausarTTS() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.pause();
        }
        this.ttsState.isSpeaking = false;
        this.limpiarTemporizadoresTTS();
        this.actualizarIconoPlay(false);
    }

    detenerTTS() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        this.ttsState.isSpeaking = false;
        this.limpiarTemporizadoresTTS();
        this.actualizarIconoPlay(false);
    }

    finalizarTTS() {
        this.detenerTTS();
        this.ttsState.currentCharIndex = 0;
        this.ttsState.currentChunkIndex = 0;
        const slider = document.getElementById('cinta-slider-progreso');
        const tActual = document.getElementById('cinta-tiempo-actual');
        if (slider) slider.value = 0;
        if (tActual) tActual.textContent = '0:00';
        document.documentElement.style.setProperty('--progreso-reproduccion', '0%');
    }

    seekTTS(fraction) {
        if (!this.ttsState.fullText) this.prepararTTS();
        if (!this.ttsState.fullText) return;

        const targetChar = Math.round(fraction * this.ttsState.fullText.length);
        this.ttsState.currentCharIndex = targetChar;

        const tActual = document.getElementById('cinta-tiempo-actual');
        if (tActual) tActual.textContent = this.formatearTiempo(Math.round(fraction * this.ttsState.totalDurationSecs));

        if (this.ttsState.isSpeaking) {
            window.speechSynthesis.cancel();
            let targetIndex = this.ttsState.chunks.findIndex(c => targetChar < c.end);
            if (targetIndex === -1) targetIndex = 0;
            this.ttsState.currentChunkIndex = targetIndex;
            this.reproducirChunkActualTTS();
        }
    }

    iniciarHeartbeatTTS() {
        if (this.ttsState.heartbeatId) clearInterval(this.ttsState.heartbeatId);
        this.ttsState.heartbeatId = setInterval(() => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking && this.ttsState.isSpeaking) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
            } else if (!this.ttsState.isSpeaking) {
                if (this.ttsState.heartbeatId) {
                    clearInterval(this.ttsState.heartbeatId);
                    this.ttsState.heartbeatId = null;
                }
            }
        }, 12000);
    }

    limpiarTemporizadoresTTS() {
        if (this.ttsState.heartbeatId) {
            clearInterval(this.ttsState.heartbeatId);
            this.ttsState.heartbeatId = null;
        }
        if (this.ttsState.trackerId) {
            clearInterval(this.ttsState.trackerId);
            this.ttsState.trackerId = null;
        }
    }

    actualizarIconoPlay(sonando) {
        const iconPlay = document.getElementById('cinta-icon-play');
        if (iconPlay) {
            iconPlay.textContent = sonando ? 'pause' : 'play_arrow';
        }
    }

    // =========================================================================
    // CONMUTACIÓN DE MODOS DE AUDIO
    // =========================================================================

    cambiarModoAudio(nuevoModo, autoPlay = false) {
        if (!MODOS_AUDIO[nuevoModo]) return;
        this.modoActivo = nuevoModo;

        const infoModo = MODOS_AUDIO[nuevoModo];
        const btnPlay = document.getElementById('btn-cinta-play');
        const iconPlay = document.getElementById('cinta-icon-play');
        const slider = document.getElementById('cinta-slider-progreso');
        const tActual = document.getElementById('cinta-tiempo-actual');
        const tTotal = document.getElementById('cinta-tiempo-total');

        // Actualizar botón Play y menú
        if (btnPlay) {
            btnPlay.className = `cinta-btn-play ${infoModo.claseBtn}`;
            btnPlay.title = `Reproducir ${infoModo.nombre}`;
        }

        document.querySelectorAll('.cinta-menu-item').forEach(it => {
            if (it.getAttribute('data-modo') === nuevoModo) {
                it.classList.add('activo');
            } else {
                it.classList.remove('activo');
            }
        });

        // Detener reproducciones anteriores
        this.audio.pause();
        this.detenerTTS();

        if (slider) slider.value = 0;
        if (tActual) tActual.textContent = '0:00';
        if (tTotal) tTotal.textContent = '0:00';
        if (iconPlay) iconPlay.textContent = 'play_arrow';
        document.documentElement.style.setProperty('--progreso-buffer', '0%');
        document.documentElement.style.setProperty('--progreso-reproduccion', '0%');

        if (nuevoModo === 'hora') {
            // Preparar lector de voz TTS
            this.prepararTTS();
            if (autoPlay) {
                this.reproducirTTS();
            }
        } else {
            // Modos con archivo MP3
            const urlNueva = this.audios[nuevoModo];
            if (urlNueva) {
                this.audio.src = urlNueva;
                this.audio.load();
                if (autoPlay) {
                    this.audio.play().catch(e => console.warn('Error autoplay:', e));
                }
            }
        }
    }

    // Carga de URLs individuales y múltiples
    cargarEvangelio(url, subtitulo = '') {
        if (url) {
            this.audios.evangelio = url;
            this.subtitulos.evangelio = subtitulo;
            const sub = document.getElementById('menu-sub-evangelio');
            if (sub && subtitulo) sub.textContent = subtitulo;
            if (this.modoActivo === 'evangelio' && (!this.audio.src || this.audio.paused)) {
                this.audio.src = url;
            }
        }
    }

    cargarAudioLibro(url, nombreLibro = '') {
        if (url) {
            this.audios.hora = url;
            this.subtitulos.hora = nombreLibro;
            const sub = document.getElementById('menu-sub-hora');
            if (sub && nombreLibro) sub.textContent = `Lector de voz (${nombreLibro.toUpperCase()})`;
        }
    }

    cargarLectura1(url, subtitulo = '') {
        if (url) {
            this.audios.lectura1 = url;
            this.subtitulos.lectura1 = subtitulo;
            const sub = document.getElementById('menu-sub-lectura1');
            if (sub && subtitulo) sub.textContent = subtitulo;
            if (this.modoActivo === 'lectura1' && (!this.audio.src || this.audio.paused)) {
                this.audio.src = url;
            }
        }
    }

    cargarLectura2(url, subtitulo = '') {
        if (url) {
            this.audios.lectura2 = url;
            this.subtitulos.lectura2 = subtitulo;
            const sub = document.getElementById('menu-sub-lectura2');
            if (sub && subtitulo) sub.textContent = subtitulo;
            if (this.modoActivo === 'lectura2' && (!this.audio.src || this.audio.paused)) {
                this.audio.src = url;
            }
        }
    }

    cargarAudios(mapAudios = {}) {
        if (mapAudios.evangelio) this.cargarEvangelio(mapAudios.evangelio, mapAudios.subEvangelio);
        if (mapAudios.hora) this.cargarAudioLibro(mapAudios.hora, mapAudios.subHora);
        if (mapAudios.lectura1) this.cargarLectura1(mapAudios.lectura1, mapAudios.subLectura1);
        if (mapAudios.lectura2) this.cargarLectura2(mapAudios.lectura2, mapAudios.subLectura2);
    }

    // =========================================================================
    // CONTROL DE ZOOM CON FÓRMULA CALC(VAR(--SIZE) * VAR(--FONT-ZOOM))
    // =========================================================================

    cambiarTamanoTexto(delta) {
        // delta: +1 para aumentar, -1 para disminuir (equivalente a 1px sobre base de 16px)
        const paso = 1 / 16; // 0.0625
        let nuevoZoom = this.fontZoom + (delta * paso);
        const minZoom = 10 / 16; // 0.625 (10px)
        const maxZoom = 50 / 16; // 3.125 (50px)

        if (nuevoZoom < minZoom) nuevoZoom = minZoom;
        if (nuevoZoom > maxZoom) nuevoZoom = maxZoom;

        this.fontZoom = nuevoZoom;
        localStorage.setItem('lh_font_zoom', this.fontZoom.toFixed(4));
        localStorage.setItem('lh_font_size', String(Math.round(this.fontZoom * 16)));
        this.aplicarTamanoTexto(this.fontZoom);
        this.guardarTamanoEnFirebase(this.fontZoom);
    }

    resetearTamanoTexto() {
        this.fontZoom = 1.0;
        localStorage.setItem('lh_font_zoom', '1.0000');
        localStorage.setItem('lh_font_size', '16');
        this.aplicarTamanoTexto(1.0);
        this.guardarTamanoEnFirebase(1.0);
        console.log("🔄 [Cinta] Tamaño de texto restablecido a 16px (1.0)");
    }

    guardarTamanoEnFirebase(zoom) {
        if (this._debounceFirebaseZoom) {
            clearTimeout(this._debounceFirebaseZoom);
        }
        this._debounceFirebaseZoom = setTimeout(async () => {
            if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
                try {
                    await window.firebaseAPI.guardarAjustesFirestore('cinta_zoom', {
                        fontZoom: parseFloat(zoom.toFixed(4)),
                        fontSize: Math.round(zoom * 16),
                        actualizado: new Date().toISOString()
                    });
                    console.log(`☁️ [Cinta] Tamaño de texto guardado en Firebase: ${Math.round(zoom * 16)}px (${zoom.toFixed(4)})`);
                } catch (err) {
                    console.warn("⚠️ Error guardando tamaño en Firebase:", err);
                }
            }
        }, 400);
    }

    aplicarTamanoTexto(zoom) {
        const valZoom = (typeof zoom === 'number' && !isNaN(zoom)) ? zoom : 1.0;
        document.documentElement.style.setProperty('--size', '16px');
        document.documentElement.style.setProperty('--font-zoom', valZoom.toFixed(4));
        document.documentElement.style.setProperty('--salterio-font-size', 'calc(var(--size) * var(--font-zoom))');
        const spanZoom = document.getElementById('cinta-zoom-valor');
        if (spanZoom) {
            spanZoom.textContent = `${Math.round(valZoom * 16)}px`;
        }
    }

    // Actualización de Información Litúrgica y Botones Activos
    actualizarLiturgiaInfo(tiempo, semana, dia, libro, tiempoSlug = '', diaSlug = '', extras = {}) {
        this.opciones = {
            ...this.opciones,
            tiempo: tiempo || this.opciones.tiempo,
            semana: semana !== undefined ? semana : this.opciones.semana,
            dia: dia || this.opciones.dia,
            libro: libro || this.opciones.libro,
            tiempoSlug: tiempoSlug || this.opciones.tiempoSlug,
            diaSlug: diaSlug || this.opciones.diaSlug,
            ...extras
        };

        const btnTiempo = document.getElementById('btn-toggle-tiempo');
        const txtMetadatos = document.getElementById('cinta-texto-metadatos');

        if (btnTiempo) {
            btnTiempo.textContent = (tiempo || 'Tiempo Ordinario').toUpperCase();
            const slug = (tiempoSlug || this.opciones.tiempoSlug || 'ordinario').toLowerCase();
            btnTiempo.className = `cinta-badge-tiempo tiempo-${slug}`;
        }
        if (txtMetadatos) {
            txtMetadatos.innerHTML = this.formatearTextoMetadatos(this.opciones.semana, this.opciones.dia);
        }

        // Actualizar hora activa y enlaces si aplica
        const libroNorm = (libro || this.opciones.libro || 'laudes').toLowerCase();
        const mapH = { oficio: 'of', laudes: 'la', tercia: 'te', sexta: 'se', nona: 'no', visperas: 'vi', completas: 'co' };
        const esCelebracion = ['santos', 'solemnidades', 'fiestas'].includes((tiempoSlug || this.opciones.tiempoSlug || '').toLowerCase());

        document.querySelectorAll('.cinta-btn-hora').forEach(btn => {
            const hId = btn.getAttribute('data-libro');
            if (hId === libroNorm) {
                btn.classList.add('activo');
            } else {
                btn.classList.remove('activo');
            }
            if (esCelebracion) {
                const baseId = this.opciones.baseCelebracionId || (diaSlug || this.opciones.diaSlug || '').replace(/(of|la|te|se|no|vi|co)$/i, '');
                if (baseId) {
                    const hCode = mapH[hId] || 'la';
                    const sParam = this.opciones.santo ? `&santo=${encodeURIComponent(this.opciones.santo)}` : '';
                    const fParam = this.opciones.fecha ? `&fecha=${encodeURIComponent(this.opciones.fecha)}` : '';
                    const slugActual = (tiempoSlug || this.opciones.tiempoSlug || '').toLowerCase();
                    const tParam = (slugActual === 'solemnidades' || slugActual === 'fiestas') ? `&tiempo=${slugActual}` : '';
                    btn.setAttribute('href', `salterios.html?libro=${hId}&id=${baseId}${hCode}${tParam}${sParam}${fParam}`);
                }
            }
        });

        // Si el modo activo es hora, refrescar texto para TTS
        if (this.modoActivo === 'hora' && !this.ttsState.isSpeaking) {
            this.prepararTTS();
        }
    }

    formatearTiempo(segundos) {
        if (isNaN(segundos) || segundos < 0) return '0:00';
        const mins = Math.floor(segundos / 60);
        const segs = Math.floor(segundos % 60);
        return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
    }
}

if (typeof window !== 'undefined') {
    window.CintaLiturgica = CintaLiturgica;
    window.MODOS_AUDIO = MODOS_AUDIO;
}
