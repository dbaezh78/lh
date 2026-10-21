/**
 * horas_configuradas.js
 * Módulo para auditar, visualizar y gestionar las horas litúrgicas configuradas y faltantes.
 * Conecta con Firebase Firestore (colección "salterios") y LocalStorage.
 */

import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { obtenerIdsEquivalentes, decodificarCodigoLiturgico } from '../firebase/descarga_liturgia_de_las_horas.js';

// =========================================================================
// CONSTANTES Y CONFIGURACIÓN LITÚRGICA CANÓNICA
// =========================================================================

export const CODIGOS_TIEMPO = {
    ordinario: { codigo: 'to', nombre: 'Tiempo Ordinario', icono: 'spa', color: '#10b981' },
    adviento:  { codigo: 'ta', nombre: 'Adviento',         icono: 'wb_twilight', color: '#8b5cf6' },
    navidad:   { codigo: 'tn', nombre: 'Navidad',          icono: 'star', color: '#ef4444' },
    cuaresma:  { codigo: 'tc', nombre: 'Cuaresma',         icono: 'cruelty_free', color: '#a855f7' },
    pascua:    { codigo: 'tp', nombre: 'Pascua',           icono: 'sunny', color: '#0284c7' },
    santos:    { codigo: 'san', nombre: 'Santos y Fiestas', icono: 'person', color: '#f59e0b' }
};

export const CODIGOS_DIA = [
    { id: 'domingo',   codigo: 'do', nombre: 'Domingo',   icono: 'wb_sunny' },
    { id: 'lunes',     codigo: 'lu', nombre: 'Lunes',     icono: 'calendar_today' },
    { id: 'martes',    codigo: 'ma', nombre: 'Martes',    icono: 'calendar_today' },
    { id: 'miercoles', codigo: 'mi', nombre: 'Miércoles', icono: 'calendar_today' },
    { id: 'jueves',    codigo: 'ju', nombre: 'Jueves',    icono: 'calendar_today' },
    { id: 'viernes',   codigo: 'vi', nombre: 'Viernes',   icono: 'calendar_today' },
    { id: 'sabado',    codigo: 'sa', nombre: 'Sábado',    icono: 'calendar_today' }
];

export const CODIGOS_LIBRO = [
    { id: 'oficio',    codigo: 'of', nombre: 'Oficio de Lectura', orden: 1, icono: 'auto_stories' },
    { id: 'laudes',    codigo: 'la', nombre: 'Laudes',            orden: 2, icono: 'wb_twilight' },
    { id: 'tercia',    codigo: 'te', nombre: 'Hora Tercia',       orden: 3, icono: 'schedule' },
    { id: 'sexta',     codigo: 'se', nombre: 'Hora Sexta',        orden: 4, icono: 'wb_sunny' },
    { id: 'nona',      codigo: 'no', nombre: 'Hora Nona',         orden: 5, icono: 'schedule' },
    { id: 'vispera',   codigo: 'vi', nombre: 'Vísperas',          orden: 6, icono: 'bedtime' },
    { id: 'completas', codigo: 'co', nombre: 'Completas',         orden: 7, icono: 'nightlight' }
];

export const SEMANAS_CONFIG = {
    salterio4: Array.from({ length: 4 }, (_, i) => ({
        num: i + 1,
        cod: `s${String(i + 1).padStart(2, '0')}`,
        nombre: `Semana ${i + 1} (Salterio ${i + 1})`
    })),
    ordinario: Array.from({ length: 34 }, (_, i) => ({
        num: i + 1,
        cod: `s${String(i + 1).padStart(2, '0')}`,
        nombre: `Semana ${i + 1} Ordinario`
    })),
    adviento: Array.from({ length: 4 }, (_, i) => ({
        num: i + 1,
        cod: `s${String(i + 1).padStart(2, '0')}`,
        nombre: `Semana ${i + 1} de Adviento`
    })),
    navidad: [
        { num: 1, cod: 's01', nombre: 'Semana 1 (Octava de Navidad)' },
        { num: 2, cod: 's02', nombre: 'Semana 2 (Epifanía)' }
    ],
    cuaresma: [
        { num: 1, cod: 's01', nombre: 'Semana 1 de Cuaresma' },
        { num: 2, cod: 's02', nombre: 'Semana 2 de Cuaresma' },
        { num: 3, cod: 's03', nombre: 'Semana 3 de Cuaresma' },
        { num: 4, cod: 's04', nombre: 'Semana 4 de Cuaresma' },
        { num: 5, cod: 's05', nombre: 'Semana 5 de Cuaresma' },
        { num: 6, cod: 's06', nombre: 'Semana Santa' },
        { num: 7, cod: 's07', nombre: 'Triduo Pascual' }
    ],
    pascua: [
        { num: 1, cod: 's01', nombre: 'Semana 1 (Octava de Pascua)' },
        { num: 2, cod: 's02', nombre: 'Semana 2 de Pascua' },
        { num: 3, cod: 's03', nombre: 'Semana 3 de Pascua' },
        { num: 4, cod: 's04', nombre: 'Semana 4 de Pascua' },
        { num: 5, cod: 's05', nombre: 'Semana 5 de Pascua' },
        { num: 6, cod: 's06', nombre: 'Semana 6 de Pascua' },
        { num: 7, cod: 's07', nombre: 'Semana 7 (Ascensión/Pentecostés)' }
    ],
    santos: [
        { num: 1, cod: 's01', nombre: 'Común de Santos' },
        { num: 2, cod: 's02', nombre: 'Propio de los Santos' },
        { num: 3, cod: 's03', nombre: 'Solemnidades' },
        { num: 4, cod: 's04', nombre: 'Fiestas y Memorias' }
    ]
};

// =========================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// =========================================================================

const state = {
    alcance: 'salterio4',       // 'salterio4', 'ordinario', 'adviento', 'navidad', 'cuaresma', 'pascua', 'santos', 'todos'
    estadoFiltro: 'todos',      // 'todos', 'configuradas', 'faltantes'
    vista: 'matriz',            // 'matriz', 'tarjetas', 'lista'
    busqueda: '',
    filtroSemana: 'todas',
    filtroDia: 'todos',
    filtroHora: 'todas',
    cargando: true,
    mapaConfiguradas: new Map(), // key lowercase -> { id, codigo, titulo, origen, datos }
    universoHoras: []           // Array de todas las horas generadas en el alcance actual
};

// =========================================================================
// INICIALIZACIÓN AL CARGAR EL DOM
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    configurarEventosUI();
    await cargarDatosDeHoras();
});

// =========================================================================
// CARGA Y DETECCIÓN EN FIRESTORE Y LOCALSTORAGE
// =========================================================================

async function cargarDatosDeHoras() {
    state.cargando = true;
    renderizarEstadoCarga();

    state.mapaConfiguradas.clear();

    // 1. Escanear LocalStorage
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('lh_salterio_')) {
                const idLimpio = key.replace('lh_salterio_', '').trim().toLowerCase();
                try {
                    const raw = JSON.parse(localStorage.getItem(key));
                    if (raw && typeof raw === 'object') {
                        state.mapaConfiguradas.set(idLimpio, {
                            id: idLimpio,
                            codigo: raw.codigo || raw.id || idLimpio,
                            titulo: raw.titulo || raw.tt || '',
                            origen: 'local',
                            datos: raw
                        });
                    }
                } catch (_) {}
            }
        }
    } catch (eLocal) {
        console.warn("Aviso al leer LocalStorage:", eLocal);
    }

    // 2. Consultar Firestore colección "salterios"
    try {
        if (db) {
            const snap = await getDocs(collection(db, "salterios"));
            snap.forEach(docSnap => {
                const idDoc = docSnap.id.trim().toLowerCase();
                const data = docSnap.data();
                state.mapaConfiguradas.set(idDoc, {
                    id: idDoc,
                    codigo: data.codigo || data.id || idDoc,
                    titulo: data.titulo || data.tt || '',
                    origen: 'firebase',
                    datos: data
                });

                // Si contiene horas anidadas (típico en santos: horas.laudes, horas.oficio, etc.)
                if (data.horas && typeof data.horas === 'object') {
                    for (const [kHora, vHora] of Object.entries(data.horas)) {
                        const idHora = `${idDoc}_${kHora.toLowerCase()}`;
                        if (!state.mapaConfiguradas.has(idHora)) {
                            state.mapaConfiguradas.set(idHora, {
                                id: idHora,
                                codigo: idHora,
                                titulo: (vHora && vHora.titulo) || data.titulo || '',
                                origen: 'firebase',
                                datos: vHora
                            });
                        }
                    }
                }
            });
            console.log(`☁️ [Horas] Sincronizadas ${snap.size} horas litúrgicas desde Firestore.`);
        }
    } catch (errFb) {
        console.warn("Aviso al consultar Firestore (usando respaldo LocalStorage):", errFb);
        mostrarToast("Usando datos locales (offline)", "info");
    }

    state.cargando = false;
    generarUniversoHoras();
    actualizarSelectorSemanasUI();
    actualizarEstadisticasYProgreso();
    renderizarResultados();
}

// =========================================================================
// GENERADOR DEL UNIVERSO DE HORAS LITÚRGICAS SEGÚN EL ALCANCE
// =========================================================================

function generarUniversoHoras() {
    const list = [];
    const alcance = state.alcance;

    let tiemposAProcesar = [];
    if (alcance === 'salterio4') {
        tiemposAProcesar = [{ key: 'ordinario', semanas: SEMANAS_CONFIG.salterio4 }];
    } else if (alcance === 'ordinario') {
        tiemposAProcesar = [{ key: 'ordinario', semanas: SEMANAS_CONFIG.ordinario }];
    } else if (alcance === 'adviento') {
        tiemposAProcesar = [{ key: 'adviento', semanas: SEMANAS_CONFIG.adviento }];
    } else if (alcance === 'navidad') {
        tiemposAProcesar = [{ key: 'navidad', semanas: SEMANAS_CONFIG.navidad }];
    } else if (alcance === 'cuaresma') {
        tiemposAProcesar = [{ key: 'cuaresma', semanas: SEMANAS_CONFIG.cuaresma }];
    } else if (alcance === 'pascua') {
        tiemposAProcesar = [{ key: 'pascua', semanas: SEMANAS_CONFIG.pascua }];
    } else if (alcance === 'santos') {
        tiemposAProcesar = [{ key: 'santos', semanas: SEMANAS_CONFIG.santos }];
    } else if (alcance === 'todos') {
        tiemposAProcesar = [
            { key: 'ordinario', semanas: SEMANAS_CONFIG.ordinario },
            { key: 'adviento',  semanas: SEMANAS_CONFIG.adviento },
            { key: 'navidad',   semanas: SEMANAS_CONFIG.navidad },
            { key: 'cuaresma',  semanas: SEMANAS_CONFIG.cuaresma },
            { key: 'pascua',    semanas: SEMANAS_CONFIG.pascua },
            { key: 'santos',    semanas: SEMANAS_CONFIG.santos }
        ];
    }

    tiemposAProcesar.forEach(({ key, semanas }) => {
        const infoTiempo = CODIGOS_TIEMPO[key] || { codigo: 'to', nombre: key, icono: 'calendar_month' };
        semanas.forEach(sem => {
            CODIGOS_DIA.forEach(dia => {
                CODIGOS_LIBRO.forEach(libro => {
                    // Código canónico: [tiempo][semana 2 dígitos][día][hora al final] (ej: tos01dola)
                    const codigoCanonico = `${infoTiempo.codigo}${sem.cod}${dia.codigo}${libro.codigo}`.toLowerCase();
                    
                    // Verificar si está configurada directamente o bajo sus IDs equivalentes
                    const itemConfigurado = buscarConfigurada(codigoCanonico, key, sem.num, dia.id, libro.id);

                    list.push({
                        codigo: codigoCanonico,
                        tiempo: key,
                        tiempoNombre: infoTiempo.nombre,
                        tiempoCodigo: infoTiempo.codigo,
                        tiempoIcono: infoTiempo.icono,
                        tiempoColor: infoTiempo.color,
                        semana: sem.num,
                        semanaCod: sem.cod,
                        semanaNombre: sem.nombre,
                        dia: dia.id,
                        diaNombre: dia.nombre,
                        diaCodigo: dia.codigo,
                        hora: libro.id,
                        horaNombre: libro.nombre,
                        horaCodigo: libro.codigo,
                        horaIcono: libro.icono,
                        estaConfigurada: Boolean(itemConfigurado),
                        itemConfigurado: itemConfigurado
                    });
                });
            });
        });
    });

    state.universoHoras = list;
}

/**
 * Busca si un código o sus variantes equivalentes existen en el mapa de horas configuradas
 */
function buscarConfigurada(codigo, tiempo, semana, dia, libro) {
    const clean = codigo.trim().toLowerCase();
    
    // 1. Coincidencia exacta directa
    if (state.mapaConfiguradas.has(clean)) {
        return state.mapaConfiguradas.get(clean);
    }

    // 2. Coincidencia bajo formatos equivalentes canónicos (ej. tos1dola, tos01lado, tos1lado)
    const equivs = (typeof obtenerIdsEquivalentes === 'function') 
        ? obtenerIdsEquivalentes(clean) 
        : [clean];

    for (const eq of equivs) {
        const eqClean = eq.toLowerCase();
        // Solo considerar equivalencias de la MISMA semana para no contar módulo de salterio 4 como configurada directa
        if (state.mapaConfiguradas.has(eqClean)) {
            const dec = (typeof decodificarCodigoLiturgico === 'function') ? decodificarCodigoLiturgico(eqClean) : null;
            if (!dec || Number(dec.semana) === Number(semana)) {
                return state.mapaConfiguradas.get(eqClean);
            }
        }
    }

    return null;
}

// =========================================================================
// FILTRADO DE HORAS
// =========================================================================

function obtenerHorasFiltradas() {
    let filtradas = state.universoHoras;

    // 1. Filtro por Estado (Todas / Solo Configuradas / Solo Faltantes)
    if (state.estadoFiltro === 'configuradas') {
        filtradas = filtradas.filter(h => h.estaConfigurada);
    } else if (state.estadoFiltro === 'faltantes') {
        filtradas = filtradas.filter(h => !h.estaConfigurada);
    }

    // 2. Filtro por Semana
    if (state.filtroSemana !== 'todas') {
        filtradas = filtradas.filter(h => h.semanaCod === state.filtroSemana || String(h.semana) === state.filtroSemana);
    }

    // 3. Filtro por Día
    if (state.filtroDia !== 'todos') {
        filtradas = filtradas.filter(h => h.dia === state.filtroDia);
    }

    // 4. Filtro por Hora
    if (state.filtroHora !== 'todas') {
        filtradas = filtradas.filter(h => h.hora === state.filtroHora);
    }

    // 5. Filtro por Buscador de Texto (en tiempo real)
    const q = (state.busqueda || '').trim().toLowerCase();
    if (q) {
        filtradas = filtradas.filter(h => {
            const matchCod = h.codigo.includes(q);
            const matchDia = h.diaNombre.toLowerCase().includes(q) || h.diaCodigo.includes(q);
            const matchHora = h.horaNombre.toLowerCase().includes(q) || h.horaCodigo.includes(q);
            const matchSem = h.semanaNombre.toLowerCase().includes(q) || h.semanaCod.includes(q);
            const matchTiempo = h.tiempoNombre.toLowerCase().includes(q);
            const matchTitulo = h.itemConfigurado?.titulo ? h.itemConfigurado.titulo.toLowerCase().includes(q) : false;
            return matchCod || matchDia || matchHora || matchSem || matchTiempo || matchTitulo;
        });
    }

    return filtradas;
}

// =========================================================================
// ACTUALIZACIÓN DE ESTADÍSTICAS Y PROGRESO
// =========================================================================

function actualizarEstadisticasYProgreso() {
    const total = state.universoHoras.length;
    const configuradas = state.universoHoras.filter(h => h.estaConfigurada).length;
    const faltantes = total - configuradas;
    const porcentaje = total > 0 ? ((configuradas / total) * 100).toFixed(1) : 0;

    const elTotal = document.getElementById('stat-total');
    const elConf = document.getElementById('stat-configuradas');
    const elFalt = document.getElementById('stat-faltantes');
    const elPorc = document.getElementById('stat-porcentaje');
    const elSubAlcance = document.getElementById('stat-sub-alcance');
    const elSubConf = document.getElementById('stat-sub-configuradas');
    const elSubFalt = document.getElementById('stat-sub-faltantes');
    const elTxtProgreso = document.getElementById('texto-progreso');
    const elBarraFill = document.getElementById('barra-progreso-fill');

    if (elTotal) elTotal.textContent = total;
    if (elConf) elConf.textContent = configuradas;
    if (elFalt) elFalt.textContent = faltantes;
    if (elPorc) elPorc.textContent = `${porcentaje}%`;

    const nombresAlcances = {
        salterio4: 'Salterio 4 semanas',
        ordinario: 'Tiempo Ordinario (34 sem)',
        adviento: 'Adviento (4 sem)',
        navidad: 'Navidad (2 sem)',
        cuaresma: 'Cuaresma (7 sem)',
        pascua: 'Pascua (7 sem)',
        santos: 'Santos y Fiestas',
        todos: 'Todo el año litúrgico'
    };
    if (elSubAlcance) elSubAlcance.textContent = nombresAlcances[state.alcance] || state.alcance;
    if (elSubConf) elSubConf.textContent = `${porcentaje}% del total`;
    if (elSubFalt) elSubFalt.textContent = `${(100 - porcentaje).toFixed(1)}% por configurar`;

    if (elTxtProgreso) elTxtProgreso.textContent = `${configuradas} / ${total} (${porcentaje}%)`;
    if (elBarraFill) elBarraFill.style.width = `${porcentaje}%`;

    // Actualizar badges en botones de estado
    const countTodos = document.getElementById('count-todos');
    const countConf = document.getElementById('count-configuradas');
    const countFalt = document.getElementById('count-faltantes');
    if (countTodos) countTodos.textContent = total;
    if (countConf) countConf.textContent = configuradas;
    if (countFalt) countFalt.textContent = faltantes;
}

// =========================================================================
// RENDERIZADO DE RESULTADOS
// =========================================================================

function renderizarResultados() {
    const contenedor = document.getElementById('contenedor-resultados');
    if (!contenedor) return;

    if (state.cargando) {
        renderizarEstadoCarga();
        return;
    }

    const filtradas = obtenerHorasFiltradas();

    if (filtradas.length === 0) {
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <span class="material-symbols-outlined" style="font-size: 42px; color: var(--color-texto-muted); margin-bottom: 8px;">search_off</span>
                <h3>No se encontraron horas</h3>
                <p>No hay horas litúrgicas que coincidan con los filtros seleccionados o el término de búsqueda.</p>
                <button class="btn-header" onclick="window._resetearFiltros()" style="margin-top: 12px;">
                    <span class="material-symbols-outlined">restart_alt</span> Restablecer Filtros
                </button>
            </div>
        `;
        return;
    }

    if (state.vista === 'matriz') {
        renderizarVistaMatriz(filtradas, contenedor);
    } else if (state.vista === 'tarjetas') {
        renderizarVistaTarjetas(filtradas, contenedor);
    } else if (state.vista === 'lista') {
        renderizarVistaLista(filtradas, contenedor);
    }
}

function renderizarEstadoCarga() {
    const contenedor = document.getElementById('contenedor-resultados');
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="estado-cargando">
                <span class="material-symbols-outlined spin-loader">sync</span>
                <p>Sincronizando horas litúrgicas con Firestore y memoria local...</p>
            </div>
        `;
    }
}

// =========================================================================
// VISTA 1: MATRIZ SEMANAL (DÍA x HORA)
// =========================================================================

function renderizarVistaMatriz(horas, contenedor) {
    // Agrupar por Semana
    const semanasMap = new Map();
    horas.forEach(h => {
        const keySem = `${h.tiempo}_${h.semanaCod}`;
        if (!semanasMap.has(keySem)) {
            semanasMap.set(keySem, {
                tiempo: h.tiempo,
                tiempoNombre: h.tiempoNombre,
                tiempoColor: h.tiempoColor,
                semana: h.semana,
                semanaCod: h.semanaCod,
                semanaNombre: h.semanaNombre,
                horas: []
            });
        }
        semanasMap.get(keySem).horas.push(h);
    });

    let html = '';

    semanasMap.forEach(grupo => {
        const totalSem = grupo.horas.length;
        const confSem = grupo.horas.filter(h => h.estaConfigurada).length;
        const porcSem = totalSem > 0 ? ((confSem / totalSem) * 100).toFixed(0) : 0;

        html += `
            <div class="matriz-semana-wrapper">
                <div class="matriz-semana-header">
                    <h3>
                        <span class="material-symbols-outlined" style="color: ${grupo.tiempoColor};">calendar_month</span>
                        ${grupo.tiempoNombre} — ${grupo.semanaNombre}
                    </h3>
                    <div class="matriz-semana-progreso">
                        Configuradas: <strong style="color: var(--color-verde);">${confSem}</strong> / ${totalSem} (${porcSem}%)
                    </div>
                </div>

                <div class="matriz-tabla-scroll">
                    <table class="matriz-tabla">
                        <thead>
                            <tr>
                                <th class="col-dia">Día / Hora</th>
                                ${CODIGOS_LIBRO.map(l => `
                                    <th title="${l.nombre}">
                                        <div style="display:flex; align-items:center; justify-content:center; gap:4px;">
                                            <span class="material-symbols-outlined" style="font-size:16px;">${l.icono}</span>
                                            <span>${l.nombre.split(' ')[0]}</span>
                                            <span style="font-family:var(--fuente-mono); font-size:0.7rem; color:var(--color-texto-muted);">(${l.codigo})</span>
                                        </div>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${CODIGOS_DIA.map(dia => {
                                const horasDelDia = grupo.horas.filter(h => h.dia === dia.id);
                                if (horasDelDia.length === 0) return '';
                                return `
                                    <tr>
                                        <td class="celda-dia">
                                            <div style="display:flex; align-items:center; gap:6px;">
                                                <span class="material-symbols-outlined" style="font-size:16px; color:var(--color-texto-muted);">${dia.icono}</span>
                                                <span>${dia.nombre}</span>
                                                <span style="font-family:var(--fuente-mono); font-size:0.72rem; color:var(--color-texto-muted);">(${dia.codigo})</span>
                                            </div>
                                        </td>
                                        ${CODIGOS_LIBRO.map(libro => {
                                            const h = horasDelDia.find(x => x.hora === libro.id);
                                            if (!h) {
                                                return `<td class="celda-hora"><span style="color:var(--color-texto-muted); font-size:0.75rem;">—</span></td>`;
                                            }
                                            return `
                                                <td class="celda-hora">
                                                    <div class="chip-hora ${h.estaConfigurada ? 'configurada' : 'faltante'}" onclick="window._abrirDetalleHora('${h.codigo}')">
                                                        <div class="chip-hora-codigo">
                                                            <span>${h.codigo}</span>
                                                            ${h.estaConfigurada 
                                                                ? `<span class="material-symbols-outlined" style="font-size:14px; color:var(--color-verde);">check_circle</span>` 
                                                                : `<span class="material-symbols-outlined" style="font-size:14px; color:var(--color-naranja);">pending</span>`}
                                                        </div>
                                                        <div class="chip-hora-estado">
                                                            ${h.estaConfigurada ? 'Configurada' : 'Faltante'}
                                                        </div>
                                                        <div class="chip-hora-acciones" onclick="event.stopPropagation()">
                                                            ${h.estaConfigurada ? `
                                                                <a href="/salterios.html?codigo=${h.codigo}" target="_blank" class="btn-mini-accion ver" title="Ver en Salterio">
                                                                    <span class="material-symbols-outlined" style="font-size:11px;">visibility</span> Ver
                                                                </a>
                                                                <a href="frm_salterios.html?codigo=${h.codigo}" class="btn-mini-accion editar" title="Editar en Formulario">
                                                                    <span class="material-symbols-outlined" style="font-size:11px;">edit</span>
                                                                </a>
                                                            ` : `
                                                                <a href="frm_salterios.html?codigo=${h.codigo}" class="btn-mini-accion crear" title="Configurar esta hora ahora">
                                                                    <span class="material-symbols-outlined" style="font-size:11px;">add</span> Crear
                                                                </a>
                                                            `}
                                                        </div>
                                                    </div>
                                                </td>
                                            `;
                                        }).join('')}
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

// =========================================================================
// VISTA 2: TARJETAS (GRID)
// =========================================================================

function renderizarVistaTarjetas(horas, contenedor) {
    let html = `<div class="grid-tarjetas">`;

    horas.forEach(h => {
        const tituloGuardado = h.itemConfigurado?.titulo || '';
        const origen = h.itemConfigurado?.origen === 'firebase' ? '☁️ Firebase' : (h.itemConfigurado?.origen === 'local' ? '💾 Local' : '');

        html += `
            <div class="card-hora ${h.estaConfigurada ? 'configurada' : 'faltante'}">
                <div class="card-header-fila">
                    <span class="codigo-badge">
                        <span>${h.codigo}</span>
                        <button class="btn-copiar-mini" onclick="window._copiarTexto('${h.codigo}', event)" title="Copiar código al portapapeles">
                            <span class="material-symbols-outlined">content_copy</span>
                        </button>
                    </span>
                    <span class="estado-pill ${h.estaConfigurada ? 'configurada' : 'faltante'}">
                        <span class="material-symbols-outlined" style="font-size:13px;">
                            ${h.estaConfigurada ? 'check_circle' : 'pending'}
                        </span>
                        <span>${h.estaConfigurada ? 'Configurada' : 'Faltante'}</span>
                    </span>
                </div>

                <div class="card-cuerpo">
                    <div class="hora-nombre">
                        <span class="material-symbols-outlined" style="font-size:20px; color:var(--color-verde);">${h.horaIcono}</span>
                        <span>${h.horaNombre}</span>
                    </div>
                    <div class="hora-detalles">
                        <span>${h.tiempoNombre}</span> • <span>${h.semanaNombre}</span> • <strong>${h.diaNombre}</strong>
                    </div>
                    ${tituloGuardado ? `
                        <div class="hora-titulo-guardado" title="${tituloGuardado}">
                            ${tituloGuardado.length > 55 ? tituloGuardado.slice(0, 55) + '…' : tituloGuardado}
                        </div>
                    ` : ''}
                    ${origen ? `
                        <div style="font-size:0.72rem; color:var(--color-texto-muted); margin-top:2px;">
                            Origen: <strong>${origen}</strong>
                        </div>
                    ` : ''}
                </div>

                <div class="card-acciones">
                    ${h.estaConfigurada ? `
                        <a href="/salterios.html?codigo=${h.codigo}" target="_blank" class="btn-card ver" title="Ver en Salterio">
                            <span class="material-symbols-outlined" style="font-size:16px;">visibility</span> Ver Salterio
                        </a>
                        <a href="frm_salterios.html?codigo=${h.codigo}" class="btn-card editar" title="Editar en Formulario de Salterios">
                            <span class="material-symbols-outlined" style="font-size:16px;">edit</span> Editar
                        </a>
                    ` : `
                        <a href="frm_salterios.html?codigo=${h.codigo}" class="btn-card configurar" title="Abrir y configurar en el formulario">
                            <span class="material-symbols-outlined" style="font-size:16px;">add_circle</span> Configurar Ahora
                        </a>
                    `}
                </div>
            </div>
        `;
    });

    html += `</div>`;
    contenedor.innerHTML = html;
}

// =========================================================================
// VISTA 3: LISTA COMPACTA
// =========================================================================

function renderizarVistaLista(horas, contenedor) {
    let html = `
        <div class="tabla-lista-wrapper">
            <table class="tabla-lista">
                <thead>
                    <tr>
                        <th style="width: 140px;">Código</th>
                        <th style="width: 130px;">Estado</th>
                        <th>Tiempo</th>
                        <th>Semana</th>
                        <th>Día</th>
                        <th>Hora</th>
                        <th>Título Guardado</th>
                        <th style="text-align: right; width: 180px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;

    horas.forEach(h => {
        const tituloGuardado = h.itemConfigurado?.titulo || '—';
        html += `
            <tr>
                <td>
                    <span class="codigo-badge" style="font-size:0.82rem;">
                        ${h.codigo}
                        <button class="btn-copiar-mini" onclick="window._copiarTexto('${h.codigo}', event)" title="Copiar código">
                            <span class="material-symbols-outlined">content_copy</span>
                        </button>
                    </span>
                </td>
                <td>
                    <span class="estado-pill ${h.estaConfigurada ? 'configurada' : 'faltante'}">
                        ${h.estaConfigurada ? '✓ Configurada' : '⏳ Faltante'}
                    </span>
                </td>
                <td style="color: ${h.tiempoColor}; font-weight: 600;">${h.tiempoNombre}</td>
                <td>${h.semanaCod.toUpperCase()}</td>
                <td><strong>${h.diaNombre}</strong></td>
                <td>
                    <div style="display:flex; align-items:center; gap:4px;">
                        <span class="material-symbols-outlined" style="font-size:15px; color:var(--color-texto-muted);">${h.horaIcono}</span>
                        <span>${h.horaNombre}</span>
                    </div>
                </td>
                <td style="font-size: 0.8rem; color: #cbd5e1; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${tituloGuardado}">
                    ${tituloGuardado}
                </td>
                <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 6px; justify-content: flex-end;">
                        ${h.estaConfigurada ? `
                            <a href="/salterios.html?codigo=${h.codigo}" target="_blank" class="btn-mini-accion ver" title="Ver Salterio">
                                <span class="material-symbols-outlined" style="font-size:12px;">visibility</span> Ver
                            </a>
                            <a href="frm_salterios.html?codigo=${h.codigo}" class="btn-mini-accion editar" title="Editar en Formulario">
                                <span class="material-symbols-outlined" style="font-size:12px;">edit</span>
                            </a>
                        ` : `
                            <a href="frm_salterios.html?codigo=${h.codigo}" class="btn-mini-accion crear" title="Configurar en Formulario">
                                <span class="material-symbols-outlined" style="font-size:12px;">add</span> Configurar
                            </a>
                        `}
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    contenedor.innerHTML = html;
}

// =========================================================================
// EVENTOS Y CONTROLES DE LA INTERFAZ DE USUARIO
// =========================================================================

function configurarEventosUI() {
    // 1. Selector de Pestañas de Alcance
    const tabs = document.querySelectorAll('.alcance-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('activo'));
            tab.classList.add('activo');
            state.alcance = tab.getAttribute('data-alcance') || 'salterio4';
            state.filtroSemana = 'todas';
            generarUniversoHoras();
            actualizarSelectorSemanasUI();
            actualizarEstadisticasYProgreso();
            renderizarResultados();
        });
    });

    // 2. Buscador en tiempo real
    const inputBuscador = document.getElementById('input-buscador');
    const btnLimpiar = document.getElementById('btn-limpiar-busqueda');
    if (inputBuscador) {
        inputBuscador.addEventListener('input', () => {
            state.busqueda = inputBuscador.value;
            if (btnLimpiar) {
                btnLimpiar.style.display = state.busqueda ? 'block' : 'none';
            }
            renderizarResultados();
        });
    }
    if (btnLimpiar && inputBuscador) {
        btnLimpiar.addEventListener('click', () => {
            inputBuscador.value = '';
            state.busqueda = '';
            btnLimpiar.style.display = 'none';
            renderizarResultados();
            inputBuscador.focus();
        });
    }

    // 3. Pills de Estado (Todas / Configuradas / Faltantes)
    const pillsEstado = document.querySelectorAll('.pill-estado-btn');
    pillsEstado.forEach(pill => {
        pill.addEventListener('click', () => {
            pillsEstado.forEach(p => p.classList.remove('activo'));
            pill.classList.add('activo');
            state.estadoFiltro = pill.getAttribute('data-estado') || 'todos';
            renderizarResultados();
        });
    });

    // 4. Selector de Vista (Matriz / Tarjetas / Lista)
    const btnsVista = document.querySelectorAll('.btn-vista');
    btnsVista.forEach(btn => {
        btn.addEventListener('click', () => {
            btnsVista.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            state.vista = btn.getAttribute('data-vista') || 'matriz';
            renderizarResultados();
        });
    });

    // 5. Selectores de filtro secundario (Semana, Día, Hora)
    const selSemana = document.getElementById('filtro-semana');
    const selDia = document.getElementById('filtro-dia');
    const selHora = document.getElementById('filtro-hora');

    if (selSemana) {
        selSemana.addEventListener('change', () => {
            state.filtroSemana = selSemana.value;
            renderizarResultados();
        });
    }
    if (selDia) {
        selDia.addEventListener('change', () => {
            state.filtroDia = selDia.value;
            renderizarResultados();
        });
    }
    if (selHora) {
        selHora.addEventListener('change', () => {
            state.filtroHora = selHora.value;
            renderizarResultados();
        });
    }

    // 6. Botón Sincronizar
    const btnSync = document.getElementById('btn-sincronizar');
    if (btnSync) {
        btnSync.addEventListener('click', async () => {
            mostrarToast("Sincronizando con Firebase Firestore...", "info");
            await cargarDatosDeHoras();
            mostrarToast("¡Sincronización completada con éxito!", "exito");
        });
    }

    // 7. Botón Copiar Faltantes
    const btnCopiarFaltantes = document.getElementById('btn-copiar-faltantes');
    if (btnCopiarFaltantes) {
        btnCopiarFaltantes.addEventListener('click', () => {
            const faltantes = obtenerHorasFiltradas().filter(h => !h.estaConfigurada);
            if (faltantes.length === 0) {
                mostrarToast("No hay horas faltantes con los filtros actuales.", "info");
                return;
            }
            const codigos = faltantes.map(h => h.codigo).join('\n');
            navigator.clipboard.writeText(codigos).then(() => {
                mostrarToast(`¡${faltantes.length} códigos faltantes copiados al portapapeles!`, "exito");
            }).catch(() => {
                alert(`Códigos faltantes (${faltantes.length}):\n\n` + codigos);
            });
        });
    }

    // 8. Botón Descargar Informe JSON
    const btnDescargarInforme = document.getElementById('btn-descargar-informe');
    if (btnDescargarInforme) {
        btnDescargarInforme.addEventListener('click', descargarInformeJSON);
    }
}

function actualizarSelectorSemanasUI() {
    const sel = document.getElementById('filtro-semana');
    if (!sel) return;

    let semanasOpciones = [];
    if (state.alcance === 'salterio4') {
        semanasOpciones = SEMANAS_CONFIG.salterio4;
    } else if (state.alcance === 'ordinario') {
        semanasOpciones = SEMANAS_CONFIG.ordinario;
    } else if (state.alcance === 'adviento') {
        semanasOpciones = SEMANAS_CONFIG.adviento;
    } else if (state.alcance === 'navidad') {
        semanasOpciones = SEMANAS_CONFIG.navidad;
    } else if (state.alcance === 'cuaresma') {
        semanasOpciones = SEMANAS_CONFIG.cuaresma;
    } else if (state.alcance === 'pascua') {
        semanasOpciones = SEMANAS_CONFIG.pascua;
    } else if (state.alcance === 'santos') {
        semanasOpciones = SEMANAS_CONFIG.santos;
    }

    sel.innerHTML = '<option value="todas">Todas las semanas</option>';
    semanasOpciones.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.cod;
        opt.textContent = `${s.cod.toUpperCase()} - ${s.nombre}`;
        sel.appendChild(opt);
    });
    sel.value = state.filtroSemana;
}

// =========================================================================
// ACCIONES GLOBALES Y UTILIDADES
// =========================================================================

window._copiarTexto = function(texto, event) {
    if (event) event.stopPropagation();
    navigator.clipboard.writeText(texto).then(() => {
        mostrarToast(`Código "${texto}" copiado`, "exito");
    });
};

window._abrirDetalleHora = function(codigo) {
    const item = state.universoHoras.find(h => h.codigo === codigo);
    if (!item) return;

    if (item.estaConfigurada) {
        window.location.href = `frm_salterios.html?codigo=${codigo}`;
    } else {
        window.location.href = `frm_salterios.html?codigo=${codigo}`;
    }
};

window._resetearFiltros = function() {
    state.estadoFiltro = 'todos';
    state.busqueda = '';
    state.filtroSemana = 'todas';
    state.filtroDia = 'todos';
    state.filtroHora = 'todas';

    const inputB = document.getElementById('input-buscador');
    if (inputB) inputB.value = '';
    const selS = document.getElementById('filtro-semana');
    if (selS) selS.value = 'todas';
    const selD = document.getElementById('filtro-dia');
    if (selD) selD.value = 'todos';
    const selH = document.getElementById('filtro-hora');
    if (selH) selH.value = 'todas';

    document.querySelectorAll('.pill-estado-btn').forEach(p => {
        p.classList.toggle('activo', p.getAttribute('data-estado') === 'todos');
    });

    renderizarResultados();
};

function descargarInformeJSON() {
    const total = state.universoHoras.length;
    const configuradas = state.universoHoras.filter(h => h.estaConfigurada);
    const faltantes = state.universoHoras.filter(h => !h.estaConfigurada);

    const informe = {
        titulo: "Informe de Cobertura de Horas Litúrgicas",
        fechaGeneracion: new Date().toISOString(),
        alcance: state.alcance,
        estadisticas: {
            totalHoras: total,
            configuradas: configuradas.length,
            faltantes: faltantes.length,
            porcentajeCobertura: total > 0 ? ((configuradas.length / total) * 100).toFixed(2) + '%' : '0%'
        },
        horasConfiguradas: configuradas.map(h => ({
            codigo: h.codigo,
            tiempo: h.tiempo,
            semana: h.semanaCod,
            dia: h.dia,
            hora: h.hora,
            titulo: h.itemConfigurado?.titulo || ''
        })),
        horasFaltantes: faltantes.map(h => ({
            codigo: h.codigo,
            tiempo: h.tiempo,
            semana: h.semanaCod,
            dia: h.dia,
            hora: h.hora
        }))
    };

    const blob = new Blob([JSON.stringify(informe, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe_horas_liturgicas_${state.alcance}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mostrarToast("Informe JSON descargado con éxito", "exito");
}

function mostrarToast(mensaje, tipo = "exito") {
    const toast = document.getElementById('toast-notif');
    const txt = document.getElementById('toast-mensaje');
    if (!toast || !txt) return;

    txt.textContent = mensaje;
    toast.classList.add('visible');

    if (tipo === "exito") {
        toast.style.borderColor = "var(--color-verde)";
    } else {
        toast.style.borderColor = "var(--color-azul)";
    }

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}
