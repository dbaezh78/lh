/**
 * oficiodelectura.js
 * Generador, Gestor y Reproductor de Lecturas del Oficio de Lectura
 * Liturgia de las Horas - Versión 1.0.03
 * 
 * Gestiona las 3 lecturas oficiales del Oficio:
 * 1. 1ª Lectura Año Impar: lectura1.mp3
 * 2. 1ª Lectura Año Par:   lectura2.mp3
 * 3. 2ª Lectura (Patrística): lecturas.mp3
 * 
 * Conmutador inteligente de servidores:
 * - Dominio Canónico: ta|tn|to|tc|tp.resucito.do
 * - Espejo GitHub:   dbaezh78.github.io/tadviento|tnavidad|tordinario|tcuaresma|tpascual
 */

export const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
export const DIAS_LABELS = {
    domingo: 'Domingo',
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado'
};

export const TIEMPOS_CONFIG = {
    adviento: {
        id: 'adviento',
        nombre: 'Adviento',
        slug: 'adviento',
        subdominio: 'ta',
        githubPath: 'tadviento',
        semanas: 4,
        color: '#6b21a8'
    },
    navidad: {
        id: 'navidad',
        nombre: 'Navidad',
        slug: 'navidad',
        subdominio: 'tn',
        githubPath: 'tnavidad',
        semanas: 2,
        color: '#b91c1c',
        diasEspeciales: [
            { id: 'sagradaFamilia', nombre: 'Sagrada Familia (Último domingo de diciembre)', carpeta: 'dias/sagradaFamilia' },
            { id: 'sd26', nombre: 'San Esteban, protomártir (26 de diciembre)', carpeta: 'dias/sd26' },
            { id: 'sd27', nombre: 'San Juan, apóstol y evangelista (27 de diciembre)', carpeta: 'dias/sd27' },
            { id: 'sd28', nombre: 'Los Santos Inocentes, mártires (28 de diciembre)', carpeta: 'dias/sd28' },
            { id: 'sd6reyes', nombre: 'Día de Reyes / La Epifanía (6 de enero)', carpeta: 'dias/sd6reyes' }
        ]
    },
    cuaresma: {
        id: 'cuaresma',
        nombre: 'Cuaresma',
        slug: 'cuaresma',
        subdominio: 'tc',
        githubPath: 'tcuaresma',
        semanas: 7,
        color: '#3b0764'
    },
    pascua: {
        id: 'pascua',
        nombre: 'Pascua',
        slug: 'pascua',
        subdominio: 'tp',
        githubPath: 'tpascual',
        semanas: 7,
        incluyePentecostesSem8: true,
        color: '#d97706'
    },
    ordinario: {
        id: 'ordinario',
        nombre: 'Tiempo Ordinario',
        slug: 'ordinario',
        subdominio: 'to',
        githubPath: 'tordinario',
        semanas: 34,
        color: '#008f39'
    }
};

/**
 * Construye las 3 rutas del Oficio de Lectura para un día específico
 */
export function construirRutaOficioLectura(opciones = {}) {
    const {
        tiempo = 'ordinario',
        semana = 1,
        dia = null,
        diaSemana = null,
        diaEspecial = null,
        usarMirror = false,
        servidor = null
    } = opciones;

    const tSlug = (tiempo || 'ordinario').toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let cfg = TIEMPOS_CONFIG.ordinario;
    if (tSlug === 'ta' || tSlug.includes('adviento')) {
        cfg = TIEMPOS_CONFIG.adviento;
    } else if (tSlug === 'tn' || tSlug.includes('navidad')) {
        cfg = TIEMPOS_CONFIG.navidad;
    } else if (tSlug === 'tc' || tSlug.includes('cuaresma')) {
        cfg = TIEMPOS_CONFIG.cuaresma;
    } else if (tSlug === 'tp' || tSlug.includes('pascua')) {
        cfg = TIEMPOS_CONFIG.pascua;
    } else if (tSlug === 'to' || tSlug.includes('ordinario')) {
        cfg = TIEMPOS_CONFIG.ordinario;
    }

    const esMirror = Boolean(usarMirror || servidor === 'github' || (typeof window !== 'undefined' && window.OFICIO_SERVER === 'github'));
    const host = esMirror 
        ? `http://dbaezh78.github.io/${cfg.githubPath}`
        : `https://${cfg.subdominio}.resucito.do`;

    let subRuta = '';
    if (diaEspecial) {
        subRuta = diaEspecial.startsWith('dias/') ? diaEspecial : `dias/${diaEspecial}`;
    } else {
        const numSem = String(semana).replace(/\D/g, '') || '1';
        const semCod = `s${numSem.padStart(2, '0')}`;
        
        let diaVal = dia !== null ? dia : (diaSemana !== null ? diaSemana : 'domingo');
        if (typeof diaVal === 'number') {
            const diasArr = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            diaVal = diasArr[diaVal] || 'domingo';
        }
        const diaNorm = String(diaVal).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        subRuta = `${semCod}/${diaNorm}`;
    }

    const basePath = `${host}/${subRuta}/`.replace(/([^:]\/)\/+/g, "$1");

    return {
        host,
        subRuta,
        basePath,
        lecturaImpar: `${basePath}lectura1.mp3`,
        lecturaPar: `${basePath}lectura2.mp3`,
        segundaLectura: `${basePath}lecturas.mp3`
    };
}

if (typeof window !== 'undefined') {
    window.construirRutaOficioLectura = construirRutaOficioLectura;
}

/**
 * Genera el catálogo completo de todos los días y semanas del Oficio de Lectura
 */
export function generarCatalogoCompletoOficio(usarMirror = false) {
    const registros = [];

    // 1. ADVIENTO
    for (let s = 1; s <= TIEMPOS_CONFIG.adviento.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const rutas = construirRutaOficioLectura({ tiempo: 'adviento', semana: s, dia: d, usarMirror });
            registros.push({
                tiempo: 'Adviento',
                tiempoSlug: 'adviento',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                celebracion: `Semana ${s} de Adviento - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                ...rutas
            });
        });
    }

    // 2. NAVIDAD (Semanas 1 y 2 + Días especiales)
    for (let s = 1; s <= TIEMPOS_CONFIG.navidad.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const rutas = construirRutaOficioLectura({ tiempo: 'navidad', semana: s, dia: d, usarMirror });
            registros.push({
                tiempo: 'Navidad',
                tiempoSlug: 'navidad',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                celebracion: `Semana ${s} de Navidad - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                ...rutas
            });
        });
    }

    TIEMPOS_CONFIG.navidad.diasEspeciales.forEach(esp => {
        const rutas = construirRutaOficioLectura({ tiempo: 'navidad', diaEspecial: esp.carpeta, usarMirror });
        registros.push({
            tiempo: 'Navidad',
            tiempoSlug: 'navidad',
            semana: 'Especial',
            semanaNum: 0,
            dia: esp.id,
            diaNombre: esp.nombre,
            celebracion: esp.nombre,
            esEspecial: true,
            diaEspecialCod: esp.id,
            ...rutas
        });
    });

    // 3. CUARESMA
    for (let s = 1; s <= TIEMPOS_CONFIG.cuaresma.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const rutas = construirRutaOficioLectura({ tiempo: 'cuaresma', semana: s, dia: d, usarMirror });
            registros.push({
                tiempo: 'Cuaresma',
                tiempoSlug: 'cuaresma',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                celebracion: s === 7 ? `Semana Santa / Triduo Pascual - ${DIAS_LABELS[d]}` : `Semana ${s} de Cuaresma - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                ...rutas
            });
        });
    }

    // 4. PASCUA (Semanas 1 a 7 + Pentecostés)
    for (let s = 1; s <= TIEMPOS_CONFIG.pascua.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const rutas = construirRutaOficioLectura({ tiempo: 'pascua', semana: s, dia: d, usarMirror });
            registros.push({
                tiempo: 'Pascua',
                tiempoSlug: 'pascua',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                celebracion: `Semana ${s} de Pascua - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                ...rutas
            });
        });
    }

    // Pentecostés (Domingo Semana 8)
    const rutasPent = construirRutaOficioLectura({ tiempo: 'pascua', semana: 8, dia: 'domingo', usarMirror });
    registros.push({
        tiempo: 'Pascua',
        tiempoSlug: 'pascua',
        semana: 's08',
        semanaNum: 8,
        dia: 'domingo',
        diaNombre: 'Domingo',
        celebracion: 'Solemnidad de Pentecostés (Semana 8)',
        esEspecial: true,
        ...rutasPent
    });

    // 5. TIEMPO ORDINARIO (34 Semanas)
    for (let s = 1; s <= TIEMPOS_CONFIG.ordinario.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const rutas = construirRutaOficioLectura({ tiempo: 'Tiempo Ordinario', semana: s, dia: d, usarMirror });
            registros.push({
                tiempo: 'Tiempo Ordinario',
                tiempoSlug: 'ordinario',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                celebracion: `Semana ${s} del Tiempo Ordinario - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                ...rutas
            });
        });
    }

    return registros;
}

// =========================================================================
// CONTROLADOR DE LA INTERFAZ DE USUARIO (oficiodelectura.html)
// =========================================================================

class OficioLecturaUI {
    constructor() {
        this.usarMirror = localStorage.getItem('lh_oficio_servidor') === 'mirror';
        this.audioElement = new Audio();
        this.currentAudioUrl = null;
        this.currentYear = new Date().getFullYear();
        this.esPar = (this.currentYear % 2 === 0);

        this.catalogo = [];
        this.registrosFiltrados = [];

        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.cargarDatos();
        this.bindEvents();
        this.renderizarTabla();
    }

    cacheDOMElements() {
        this.selectTiempo = document.getElementById('filtro-tiempo');
        this.selectSemana = document.getElementById('filtro-semana');
        this.inputBuscador = document.getElementById('buscador');
        this.tbody = document.getElementById('cuerpo-tabla');
        this.switchServidor = document.getElementById('switch-servidor');
        this.lblServidor = document.getElementById('label-servidor-activo');
        this.badgeAñoParidad = document.getElementById('badge-año-paridad');
        this.reproductorBarra = document.getElementById('reproductor-barra-oficio');
        this.audioTitulo = document.getElementById('reproductor-audio-titulo');
        this.audioPlayBtn = document.getElementById('btn-reproductor-play');
        this.audioProgress = document.getElementById('reproductor-slider');
        this.audioTime = document.getElementById('reproductor-tiempo');
    }

    cargarDatos() {
        this.catalogo = generarCatalogoCompletoOficio(this.usarMirror);
        this.filtrarRegistros();
        if (this.badgeAñoParidad) {
            this.badgeAñoParidad.textContent = `Año ${this.currentYear} (${this.esPar ? 'PAR' : 'IMPAR'})`;
        }
        if (this.switchServidor) {
            this.switchServidor.checked = this.usarMirror;
            this.actualizarLabelServidor();
        }
    }

    actualizarLabelServidor() {
        if (!this.lblServidor) return;
        if (this.usarMirror) {
            this.lblServidor.textContent = 'Servidor: GitHub Mirror (github.io)';
            this.lblServidor.style.color = '#0284c7';
        } else {
            this.lblServidor.textContent = 'Servidor: Principal (resucito.do)';
            this.lblServidor.style.color = '#16a34a';
        }
    }

    bindEvents() {
        if (this.selectTiempo) {
            this.selectTiempo.addEventListener('change', () => {
                this.poblarSemanasPorTiempo();
                this.filtrarRegistros();
                this.renderizarTabla();
            });
        }

        if (this.selectSemana) {
            this.selectSemana.addEventListener('change', () => {
                this.filtrarRegistros();
                this.renderizarTabla();
            });
        }

        if (this.inputBuscador) {
            this.inputBuscador.addEventListener('input', () => {
                this.filtrarRegistros();
                this.renderizarTabla();
            });
        }

        if (this.switchServidor) {
            this.switchServidor.addEventListener('change', (e) => {
                this.usarMirror = e.target.checked;
                localStorage.setItem('lh_oficio_servidor', this.usarMirror ? 'mirror' : 'resucito');
                this.actualizarLabelServidor();
                this.catalogo = generarCatalogoCompletoOficio(this.usarMirror);
                this.filtrarRegistros();
                this.renderizarTabla();
            });
        }

        // Eventos del reproductor
        if (this.audioElement) {
            this.audioElement.addEventListener('timeupdate', () => {
                if (this.audioProgress && this.audioElement.duration) {
                    const pct = (this.audioElement.currentTime / this.audioElement.duration) * 100;
                    this.audioProgress.value = pct;
                }
                if (this.audioTime) {
                    this.audioTime.textContent = `${this.formatearSegundos(this.audioElement.currentTime)} / ${this.formatearSegundos(this.audioElement.duration || 0)}`;
                }
            });

            this.audioElement.addEventListener('ended', () => {
                if (this.audioPlayBtn) {
                    this.audioPlayBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
                }
            });

            this.audioElement.addEventListener('play', () => {
                if (this.audioPlayBtn) {
                    this.audioPlayBtn.innerHTML = '<span class="material-symbols-outlined">pause</span>';
                }
            });

            this.audioElement.addEventListener('pause', () => {
                if (this.audioPlayBtn) {
                    this.audioPlayBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
                }
            });
        }

        if (this.audioPlayBtn) {
            this.audioPlayBtn.addEventListener('click', () => {
                if (!this.currentAudioUrl) return;
                if (this.audioElement.paused) {
                    this.audioElement.play();
                } else {
                    this.audioElement.pause();
                }
            });
        }

        if (this.audioProgress) {
            this.audioProgress.addEventListener('input', (e) => {
                if (this.audioElement.duration) {
                    this.audioElement.currentTime = (e.target.value / 100) * this.audioElement.duration;
                }
            });
        }
    }

    poblarSemanasPorTiempo() {
        if (!this.selectSemana) return;
        const tiempoVal = this.selectTiempo ? this.selectTiempo.value : '';
        this.selectSemana.innerHTML = '<option value="">Todas las Semanas</option>';

        let maxSemanas = 34;
        if (tiempoVal === 'Adviento') maxSemanas = 4;
        else if (tiempoVal === 'Navidad') maxSemanas = 2;
        else if (tiempoVal === 'Cuaresma') maxSemanas = 7;
        else if (tiempoVal === 'Pascua') maxSemanas = 8;
        else if (tiempoVal === 'Tiempo Ordinario') maxSemanas = 34;

        for (let i = 1; i <= maxSemanas; i++) {
            const cod = `s${String(i).padStart(2, '0')}`;
            const opt = document.createElement('option');
            opt.value = cod;
            opt.textContent = `Semana ${i} (${cod})`;
            this.selectSemana.appendChild(opt);
        }
    }

    filtrarRegistros() {
        const tiempoFiltro = (this.selectTiempo?.value || '').toLowerCase();
        const semanaFiltro = (this.selectSemana?.value || '').toLowerCase();
        const query = (this.inputBuscador?.value || '').toLowerCase().trim();

        this.registrosFiltrados = this.catalogo.filter(reg => {
            if (tiempoFiltro && !reg.tiempo.toLowerCase().includes(tiempoFiltro)) return false;
            if (semanaFiltro && reg.semana.toLowerCase() !== semanaFiltro) return false;
            if (query) {
                const matchTexto = reg.celebracion.toLowerCase().includes(query) ||
                                   reg.diaNombre.toLowerCase().includes(query) ||
                                   reg.semana.toLowerCase().includes(query) ||
                                   reg.tiempo.toLowerCase().includes(query);
                if (!matchTexto) return false;
            }
            return true;
        });
    }

    reproducirAudio(url, titulo) {
        if (!url) return;
        this.currentAudioUrl = url;
        this.audioElement.src = url;
        this.audioElement.play().catch(e => {
            console.warn("Error reproduciendo audio:", e);
        });

        if (this.reproductorBarra) {
            this.reproductorBarra.style.display = 'flex';
        }
        if (this.audioTitulo) {
            this.audioTitulo.textContent = titulo;
            this.audioTitulo.title = url;
        }
    }

    renderizarTabla() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        if (this.registrosFiltrados.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 32px; color: #64748b;">
                        No se encontraron registros que coincidan con los filtros aplicados.
                    </td>
                </tr>
            `;
            return;
        }

        const frag = document.createDocumentFragment();

        this.registrosFiltrados.forEach(reg => {
            const tr = document.createElement('tr');

            // Determinar color de badge por tiempo
            let badgeClass = 'badge-ordinario';
            if (reg.tiempoSlug === 'adviento') badgeClass = 'badge-adviento';
            else if (reg.tiempoSlug === 'navidad') badgeClass = 'badge-navidad';
            else if (reg.tiempoSlug === 'cuaresma') badgeClass = 'badge-cuaresma';
            else if (reg.tiempoSlug === 'pascua') badgeClass = 'badge-pascua';

            const urlSalterio = `salterios.html?tiempo=${reg.tiempoSlug}&semana=${reg.semanaNum || 1}&dia=${reg.dia}&libro=oficio`;

            tr.innerHTML = `
                <td>
                    <span class="badge-tiempo-oficio ${badgeClass}">${reg.tiempo}</span>
                </td>
                <td><strong>${reg.semana.toUpperCase()}</strong></td>
                <td>${reg.diaNombre}</td>
                <td>
                    <div style="font-weight: 600; color: #1e293b;">${reg.celebracion}</div>
                    <div class="ruta-base-sub">${reg.basePath}</div>
                </td>
                <td>
                    <div class="audio-celda-box">
                        <button type="button" class="btn-play-celda btn-impar" title="Oír 1ª Lectura (Año Impar)" data-url="${reg.lecturaImpar}" data-titulo="${reg.celebracion} • 1ª Lectura (Año Impar)">
                            <span class="material-symbols-outlined">play_arrow</span>
                            Año Impar
                        </button>
                        <a href="${reg.lecturaImpar}" target="_blank" class="enlace-descarga" title="Abrir MP3">
                            <span class="material-symbols-outlined">open_in_new</span>
                        </a>
                    </div>
                </td>
                <td>
                    <div class="audio-celda-box">
                        <button type="button" class="btn-play-celda btn-par" title="Oír 1ª Lectura (Año Par)" data-url="${reg.lecturaPar}" data-titulo="${reg.celebracion} • 1ª Lectura (Año Par)">
                            <span class="material-symbols-outlined">play_arrow</span>
                            Año Par
                        </button>
                        <a href="${reg.lecturaPar}" target="_blank" class="enlace-descarga" title="Abrir MP3">
                            <span class="material-symbols-outlined">open_in_new</span>
                        </a>
                    </div>
                </td>
                <td>
                    <div class="audio-celda-box">
                        <button type="button" class="btn-play-celda btn-segunda" title="Oír 2ª Lectura (Patrística)" data-url="${reg.segundaLectura}" data-titulo="${reg.celebracion} • 2ª Lectura Patrística">
                            <span class="material-symbols-outlined">play_arrow</span>
                            2ª Lectura
                        </button>
                        <a href="${reg.segundaLectura}" target="_blank" class="enlace-descarga" title="Abrir MP3">
                            <span class="material-symbols-outlined">open_in_new</span>
                        </a>
                    </div>
                </td>
                <td style="text-align: center;">
                    <a href="${urlSalterio}" class="btn-abrir-oficio" title="Abrir Oficio de Lectura completo">
                        <span class="material-symbols-outlined">menu_book</span>
                    </a>
                </td>
            `;

            // Bind click events on play buttons
            tr.querySelectorAll('.btn-play-celda').forEach(btn => {
                btn.addEventListener('click', () => {
                    const u = btn.getAttribute('data-url');
                    const t = btn.getAttribute('data-titulo');
                    this.reproducirAudio(u, t);
                });
            });

            frag.appendChild(tr);
        });

        this.tbody.appendChild(frag);
    }

    formatearSegundos(s) {
        if (isNaN(s) || s < 0) return '0:00';
        const mins = Math.floor(s / 60);
        const segs = Math.floor(s % 60);
        return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
    }
}

// Inicialización automática en navegador
if (typeof window !== 'undefined') {
    window.construirRutaOficioLectura = construirRutaOficioLectura;
    window.generarCatalogoCompletoOficio = generarCatalogoCompletoOficio;

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('tabla-oficio-lectura')) {
            window.oficioLecturaUI = new OficioLecturaUI();
        }
    });
}
