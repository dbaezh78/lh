/**
 * frm_audio.js
 * Controlador del Gestor Central de Audios Litúrgicos (frm_audio.html)
 * 
 * Agrupa todos los salmos, antífonas, lecturas (largas y breves), himnos, responsorios,
 * preces y oraciones de la Liturgia de las Horas.
 * Permite asignarles la URL del audio grabado con voz propia (ej. subido a GitHub / hosting),
 * probar el audio en vivo y sincronizarlo con Firebase Firestore y LocalStorage.
 */

import { db } from './firebase-config.js';
import { 
    collection, 
    doc, 
    setDoc, 
    getDocs,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// Importación de Catálogos Semilla
import { CATALOGO_ANTIFONAS_SEED } from '../data/db-antifonas.js';
import { CATALOGO_LECTURAS_SEED as CATALOGO_LECTURAS_OFICIO_SEED } from '../data/db-lecturas.js';
import { CATALOGO_LECTURAS_SEED as CATALOGO_LECTURAS_BREVES_SEED, LecturaBreveDB } from '../data/db-lecturabreve.js';
import { CATALOGO_HIMNOS_SEED } from '../data/db-himnos.js';
import { CATALOGO_RESPONSORIOS_SEED } from '../data/db-responsorios.js';
import { CATALOGO_PRECES_SEED } from '../data/db-preces.js';
import { CATALOGO_ORACION_SEED } from '../data/db-oracion.js';
import { CATALOGO_ECOMPLETAS_SEED } from '../data/db-ecompletas.js';

// Estado global de la vista
let todosLosItems = [];
let itemsFiltrados = [];
let categoriaActiva = 'todos';
let paginaActual = 1;
const ITEMS_POR_PAGINA = 25;
let mapaAudiosPersonalizados = {}; // { [id]: audioUrl }
let audioPreviewActual = null;

// Clave en LocalStorage
const STORAGE_AUDIOS_KEY = 'lh_catalogo_audios_propios';

document.addEventListener('DOMContentLoaded', async () => {
    configurarEventosUI();
    cargarAudiosDesdeStorage();
    await cargarTodosLosComponentes();
    await sincronizarAudiosDesdeFirestore();
    aplicarFiltros();
});

// =========================================================================
// 1. CARGA DE CATÁLOGOS LITÚRGICOS
// =========================================================================

function cargarAudiosDesdeStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_AUDIOS_KEY);
        if (raw) {
            mapaAudiosPersonalizados = JSON.parse(raw) || {};
        }
    } catch (e) {
        console.warn('[frm_audio] Error al leer LocalStorage:', e);
    }
}

function guardarAudiosEnStorage() {
    try {
        localStorage.setItem(STORAGE_AUDIOS_KEY, JSON.stringify(mapaAudiosPersonalizados));
    } catch (e) {
        console.warn('[frm_audio] Error al guardar en LocalStorage:', e);
    }
}

async function cargarTodosLosComponentes() {
    mostrarBanner('Cargando salmos, antífonas, lecturas, himnos y oraciones...', 'info');
    todosLosItems = [];

    // 1.1 Salmos & Cánticos (desde SalmosDB / salmos.js / caché)
    let salmosList = [];
    if (window.SalmosDB && typeof window.SalmosDB.listar === 'function') {
        salmosList = window.SalmosDB.listar();
    } else {
        const cacheSalmos = localStorage.getItem('lh_salmos_cache');
        if (cacheSalmos) {
            try { salmosList = JSON.parse(cacheSalmos); } catch (_) {}
        }
    }

    if (Array.isArray(salmosList)) {
        salmosList.forEach(s => {
            if (!s || !s.id) return;
            todosLosItems.push({
                id: s.id,
                categoria: 'salmos',
                etiquetaCategoria: 'Salmo / Cántico',
                badgeClass: 'badge-salmo',
                titulo: s.titulo || s.id,
                subtitulo: s.categoria || 'Salmodia',
                texto: s.texto || '',
                tiempo: s.tiempo || 'ordinario',
                audioUrl: mapaAudiosPersonalizados[s.id] || s.audioUrl || ''
            });
        });
    }

    // 1.2 Antífonas
    const antifonasList = CATALOGO_ANTIFONAS_SEED || [];
    antifonasList.forEach(a => {
        if (!a || !a.id) return;
        const clave = a.id || a.varName;
        todosLosItems.push({
            id: clave,
            categoria: 'antifonas',
            etiquetaCategoria: 'Antífona',
            badgeClass: 'badge-antifona',
            titulo: `${a.tiempo ? a.tiempo.toUpperCase() : ''} ${a.libro ? a.libro.toUpperCase() : ''} - ${a.tipo || ''}`,
            subtitulo: a.varName || a.id,
            texto: a.texto || '',
            tiempo: a.tiempo || 'ordinario',
            audioUrl: mapaAudiosPersonalizados[clave] || a.audioUrl || ''
        });
    });

    // 1.3 Lecturas de Oficio (1ª y 2ª Lectura)
    const lecturasOficioList = CATALOGO_LECTURAS_OFICIO_SEED || [];
    lecturasOficioList.forEach(l => {
        if (!l || !l.id) return;
        todosLosItems.push({
            id: l.id,
            categoria: 'lecturas_oficio',
            etiquetaCategoria: 'Lectura Oficio',
            badgeClass: 'badge-lectura',
            titulo: `${l.epigrafeTipo || l.tipo || 'Lectura'} — ${l.cita || ''}`,
            subtitulo: l.descripcion || l.subtitulo || '',
            texto: l.texto || '',
            tiempo: l.tiempo || 'ordinario',
            audioUrl: mapaAudiosPersonalizados[l.id] || l.audioUrl || ''
        });
    });

    // 1.4 Lecturas Breves
    let lecturasBrevesList = [];

    // Prioridad 1: Caché local exacta que usa lecturabreve-manager ('lh_lecturabreve_cache')
    const cacheLB1 = localStorage.getItem('lh_lecturabreve_cache') || localStorage.getItem('lh_lecturas_breves_cache');
    if (cacheLB1) {
        try {
            const parsed = JSON.parse(cacheLB1);
            if (Array.isArray(parsed) && parsed.length > 0) {
                lecturasBrevesList = parsed;
            }
        } catch (_) {}
    }

    // Prioridad 2: Consulta directa a Firestore ('lecturas_breves')
    if (lecturasBrevesList.length === 0 && (window.firebaseAPI?.db || db)) {
        try {
            const firestoreDb = (window.firebaseAPI && window.firebaseAPI.db) ? window.firebaseAPI.db : db;
            const snapLB = await getDocs(collection(firestoreDb, "lecturas_breves"));
            if (!snapLB.empty) {
                const desdeFb = [];
                snapLB.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length > 0) {
                    lecturasBrevesList = desdeFb;
                    localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(lecturasBrevesList));
                }
            }
        } catch (eLB) {
            console.warn('Aviso al consultar lecturas_breves en Firestore:', eLB);
        }
    }

    // Prioridad 3: Catálogo semilla canónico (db-lecturabreve.js)
    if (lecturasBrevesList.length === 0) {
        if (typeof LecturaBreveDB !== 'undefined' && typeof LecturaBreveDB.listar === 'function') {
            lecturasBrevesList = LecturaBreveDB.listar();
        } else if (Array.isArray(CATALOGO_LECTURAS_BREVES_SEED)) {
            lecturasBrevesList = CATALOGO_LECTURAS_BREVES_SEED;
        }
    }

    if (Array.isArray(lecturasBrevesList)) {
        lecturasBrevesList.forEach(lb => {
            if (!lb || !lb.id) return;
            todosLosItems.push({
                id: lb.id,
                categoria: 'lecturas_breves',
                etiquetaCategoria: 'Lectura Breve',
                badgeClass: 'badge-lectura',
                titulo: `${lb.libro ? lb.libro.toUpperCase() : 'HORA'} — ${lb.cita || lb.id}`,
                subtitulo: `Semana ${lb.semana || ''} • ${lb.dia || ''}`,
                texto: lb.texto || '',
                tiempo: lb.tiempo || 'ordinario',
                audioUrl: mapaAudiosPersonalizados[lb.id] || lb.audioUrl || ''
            });
        });
    }

    // 1.5 Himnos
    const himnosList = CATALOGO_HIMNOS_SEED || [];
    himnosList.forEach(h => {
        if (!h || !h.id) return;
        const clave = h.id || h.varName;
        todosLosItems.push({
            id: clave,
            categoria: 'himnos',
            etiquetaCategoria: 'Himno',
            badgeClass: 'badge-himno',
            titulo: h.titulo || h.varName || h.id,
            subtitulo: `${h.tiempo || ''} ${h.libro || ''}`,
            texto: h.texto || '',
            tiempo: h.tiempo || 'ordinario',
            audioUrl: mapaAudiosPersonalizados[clave] || h.audioUrl || ''
        });
    });

    // 1.6 Responsorios
    const responsoriosList = CATALOGO_RESPONSORIOS_SEED || [];
    responsoriosList.forEach(r => {
        if (!r || !r.id) return;
        todosLosItems.push({
            id: r.id,
            categoria: 'responsorios',
            etiquetaCategoria: 'Responsorio',
            badgeClass: 'badge-salmo',
            titulo: `${r.tiempo ? r.tiempo.toUpperCase() : ''} ${r.libro ? r.libro.toUpperCase() : ''}`,
            subtitulo: r.id,
            texto: `V. ${r.v || ''}\nR. ${r.r || ''}`,
            tiempo: r.tiempo || 'ordinario',
            audioUrl: mapaAudiosPersonalizados[r.id] || r.audioUrl || ''
        });
    });

    // 1.7 Preces
    const precesList = CATALOGO_PRECES_SEED || [];
    precesList.forEach(p => {
        if (!p || !p.id) return;
        const txtCompleto = Array.isArray(p.intenciones) ? p.intenciones.join('\n') : (p.intro || '');
        todosLosItems.push({
            id: p.id,
            categoria: 'preces',
            etiquetaCategoria: 'Preces',
            badgeClass: 'badge-preces',
            titulo: p.titulo || `Preces ${p.tiempo || ''} ${p.libro || ''}`,
            subtitulo: p.id,
            texto: `${p.intro ? p.intro + '\n' : ''}${p.respuesta ? 'R. ' + p.respuesta + '\n' : ''}${txtCompleto}`,
            tiempo: p.tiempo || 'ordinario',
            audioUrl: mapaAudiosPersonalizados[p.id] || p.audioUrl || ''
        });
    });

    // 1.8 Oraciones
    const oracionesList = CATALOGO_ORACION_SEED || [];
    oracionesList.forEach(o => {
        if (!o || !o.id) return;
        todosLosItems.push({
            id: o.id,
            categoria: 'oraciones',
            etiquetaCategoria: 'Oración',
            badgeClass: 'badge-oracion',
            titulo: o.titulo || `Oración ${o.tiempo || ''}`,
            subtitulo: o.id,
            texto: o.texto || '',
            tiempo: o.tiempo || 'ordinario',
            audioUrl: mapaAudiosPersonalizados[o.id] || o.audioUrl || ''
        });
    });

    // 1.9 Completas / Examen de Conciencia
    const completasList = CATALOGO_ECOMPLETAS_SEED || [];
    completasList.forEach(c => {
        if (!c || !c.id) return;
        todosLosItems.push({
            id: c.id,
            categoria: 'completas',
            etiquetaCategoria: 'Completas',
            badgeClass: 'badge-completas',
            titulo: `Examen de Conciencia & Bendición (${c.dia || c.id})`,
            subtitulo: c.id,
            texto: `${c.monicion || ''}\n${c.confesion || ''}\n${c.textoMariana || ''}`,
            tiempo: 'ordinario',
            audioUrl: mapaAudiosPersonalizados[c.id] || c.audioUrl || ''
        });
    });

    mostrarBanner(`Catálogo cargado: ${todosLosItems.length} componentes litúrgicos listos.`, 'exito');
    actualizarBadgesContadores();
}

// =========================================================================
// 2. SINCRONIZACIÓN CON FIRESTORE
// =========================================================================

async function sincronizarAudiosDesdeFirestore() {
    if (!window.firebaseAPI && !db) return;
    try {
        mostrarBanner('Sincronizando audios con Firebase Firestore...', 'info');
        const firestoreDb = (window.firebaseAPI && window.firebaseAPI.db) ? window.firebaseAPI.db : db;
        const snap = await getDocs(collection(firestoreDb, "catalogo_audios"));
        
        let countNube = 0;
        if (!snap.empty) {
            snap.forEach(docSnap => {
                const data = docSnap.data();
                if (data && data.audioUrl) {
                    mapaAudiosPersonalizados[docSnap.id] = data.audioUrl;
                    countNube++;
                }
            });
            guardarAudiosEnStorage();

            // Refrescar los items en memoria con los audios de la nube
            todosLosItems.forEach(it => {
                if (mapaAudiosPersonalizados[it.id]) {
                    it.audioUrl = mapaAudiosPersonalizados[it.id];
                }
            });

            mostrarBanner(`Sincronización exitosa: ${countNube} audios propios cargados desde Firebase.`, 'exito');
        } else {
            mostrarBanner('Listo: Aún no hay audios guardados en la nube. Puedes empezar a asignar URLs.', 'info');
        }
    } catch (e) {
        console.warn('[frm_audio] Error al consultar Firestore:', e);
        mostrarBanner('Aviso: Operando con la caché local de audios.', 'alerta');
    }
}

async function guardarAudioIndividual(itemId, nuevaUrl) {
    const it = todosLosItems.find(x => x.id === itemId);
    const urlLimpia = (nuevaUrl || '').trim();

    if (urlLimpia) {
        mapaAudiosPersonalizados[itemId] = urlLimpia;
        if (it) it.audioUrl = urlLimpia;
    } else {
        delete mapaAudiosPersonalizados[itemId];
        if (it) it.audioUrl = '';
    }

    guardarAudiosEnStorage();

    // Guardar en Firestore
    try {
        const firestoreDb = (window.firebaseAPI && window.firebaseAPI.db) ? window.firebaseAPI.db : db;
        if (firestoreDb) {
            const docRef = doc(firestoreDb, "catalogo_audios", itemId);
            if (urlLimpia) {
                await setDoc(docRef, {
                    itemId,
                    categoria: it ? it.categoria : 'general',
                    titulo: it ? it.titulo : '',
                    audioUrl: urlLimpia,
                    fechaActualizacion: new Date().toISOString()
                }, { merge: true });
            }
        }
        mostrarBanner(`Audio para «${itemId}» guardado exitosamente.`, 'exito');
    } catch (e) {
        console.warn('Error al guardar en Firestore:', e);
        mostrarBanner(`Guardado localmente en caché. Pendiente sincronizar con la nube.`, 'alerta');
    }

    actualizarKPIs();
    actualizarBadgesContadores();
}

async function guardarTodoEnFirestore() {
    const keys = Object.keys(mapaAudiosPersonalizados);
    if (keys.length === 0) {
        alert('No hay audios registrados para guardar.');
        return;
    }

    try {
        mostrarBanner(`Subiendo ${keys.length} audios a Firebase Firestore...`, 'info');
        const firestoreDb = (window.firebaseAPI && window.firebaseAPI.db) ? window.firebaseAPI.db : db;
        if (!firestoreDb) throw new Error('Firestore no disponible');

        const batch = writeBatch(firestoreDb);
        keys.forEach(k => {
            const it = todosLosItems.find(x => x.id === k);
            const ref = doc(firestoreDb, "catalogo_audios", k);
            batch.set(ref, {
                itemId: k,
                categoria: it ? it.categoria : 'general',
                titulo: it ? it.titulo : '',
                audioUrl: mapaAudiosPersonalizados[k],
                fechaActualizacion: new Date().toISOString()
            }, { merge: true });
        });

        await batch.commit();
        mostrarBanner(`¡Todos los ${keys.length} audios fueron sincronizados en la nube exitosamente!`, 'exito');
        actualizarKPIs();
    } catch (e) {
        console.error('Error al subir catálogo de audios:', e);
        alert('Hubo un error al guardar en la nube: ' + e.message);
    }
}

function exportarAudiosJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapaAudiosPersonalizados, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `catalogo_audios_liturgia_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
}

// =========================================================================
// 3. FILTROS, BÚSQUEDA Y PAGINACIÓN
// =========================================================================

function configurarEventosUI() {
    // Tabs de categoría
    const tabsCont = document.getElementById('tabs-categorias');
    if (tabsCont) {
        tabsCont.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                tabsCont.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
                btn.classList.add('activo');
                categoriaActiva = btn.getAttribute('data-cat') || 'todos';
                paginaActual = 1;
                aplicarFiltros();
            });
        });
    }

    // Buscador
    const inputBusqueda = document.getElementById('input-busqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', () => {
            paginaActual = 1;
            aplicarFiltros();
        });
    }

    // Filtros de estado, tiempo y orden
    document.getElementById('filtro-estado')?.addEventListener('change', () => { paginaActual = 1; aplicarFiltros(); });
    document.getElementById('filtro-tiempo')?.addEventListener('change', () => { paginaActual = 1; aplicarFiltros(); });
    document.getElementById('filtro-orden')?.addEventListener('change', () => { aplicarFiltros(); });

    // Botones de cabecera
    document.getElementById('btn-sincronizar')?.addEventListener('click', async () => {
        await sincronizarAudiosDesdeFirestore();
        aplicarFiltros();
    });

    document.getElementById('btn-guardar-todo')?.addEventListener('click', guardarTodoEnFirestore);
    document.getElementById('btn-exportar-json')?.addEventListener('click', exportarAudiosJSON);

    // Paginación
    document.getElementById('btn-pag-anterior')?.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarPagina();
        }
    });

    document.getElementById('btn-pag-siguiente')?.addEventListener('click', () => {
        const totalPags = Math.ceil(itemsFiltrados.length / ITEMS_POR_PAGINA) || 1;
        if (paginaActual < totalPags) {
            paginaActual++;
            renderizarPagina();
        }
    });
}

function aplicarFiltros() {
    const query = (document.getElementById('input-busqueda')?.value || '').toLowerCase().trim();
    const filtroEstado = document.getElementById('filtro-estado')?.value || 'todos';
    const filtroTiempo = document.getElementById('filtro-tiempo')?.value || 'todos';
    const filtroOrden = document.getElementById('filtro-orden')?.value || 'id_asc';

    itemsFiltrados = todosLosItems.filter(item => {
        // Filtro por categoría
        if (categoriaActiva !== 'todos' && item.categoria !== categoriaActiva) {
            return false;
        }

        // Filtro por estado
        const tieneAudio = Boolean(item.audioUrl && item.audioUrl.trim());
        if (filtroEstado === 'grabado' && !tieneAudio) return false;
        if (filtroEstado === 'pendiente' && tieneAudio) return false;

        // Filtro por tiempo litúrgico
        if (filtroTiempo !== 'todos') {
            const itemTiempo = (item.tiempo || '').toLowerCase();
            if (filtroTiempo === 'santos') {
                if (!['santos', 'fiestas', 'solemnidades'].includes(itemTiempo)) return false;
            } else if (itemTiempo !== filtroTiempo) {
                return false;
            }
        }

        // Filtro por texto de búsqueda
        if (query) {
            const coincId = (item.id || '').toLowerCase().includes(query);
            const coincTit = (item.titulo || '').toLowerCase().includes(query);
            const coincSub = (item.subtitulo || '').toLowerCase().includes(query);
            const coincTxt = (item.texto || '').toLowerCase().includes(query);
            if (!coincId && !coincTit && !coincSub && !coincTxt) return false;
        }

        return true;
    });

    // Ordenamiento
    if (filtroOrden === 'id_asc') {
        itemsFiltrados.sort((a, b) => a.id.localeCompare(b.id));
    } else if (filtroOrden === 'id_desc') {
        itemsFiltrados.sort((a, b) => b.id.localeCompare(a.id));
    } else if (filtroOrden === 'titulo') {
        itemsFiltrados.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
    }

    actualizarKPIs();
    renderizarPagina();
}

function renderizarPagina() {
    const contenedor = document.getElementById('contenedor-items');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    const total = itemsFiltrados.length;
    const totalPags = Math.ceil(total / ITEMS_POR_PAGINA) || 1;
    if (paginaActual > totalPags) paginaActual = totalPags;

    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const fin = Math.min(inicio + ITEMS_POR_PAGINA, total);
    const itemsDePagina = itemsFiltrados.slice(inicio, fin);

    // Actualizar controles de paginación
    const infoPag = document.getElementById('info-paginacion');
    if (infoPag) infoPag.textContent = `Mostrando ${total === 0 ? 0 : inicio + 1} - ${fin} de ${total} componentes litúrgicos`;
    
    const numPag = document.getElementById('numero-pagina');
    if (numPag) numPag.textContent = `${paginaActual} / ${totalPags}`;

    const btnAnt = document.getElementById('btn-pag-anterior');
    if (btnAnt) btnAnt.disabled = (paginaActual <= 1);

    const btnSig = document.getElementById('btn-pag-siguiente');
    if (btnSig) btnSig.disabled = (paginaActual >= totalPags);

    if (itemsDePagina.length === 0) {
        contenedor.innerHTML = `
            <div style="text-align: center; padding: 48px; background: var(--color-superficie); border-radius: 12px; border: 1px dashed var(--color-borde);">
                <span class="material-symbols-outlined" style="font-size: 48px; color: var(--color-texto-muted); margin-bottom: 8px;">search_off</span>
                <h3 style="margin: 0 0 6px 0; color: #ffffff;">No se encontraron componentes</h3>
                <p style="margin: 0; color: var(--color-texto-muted);">Prueba a cambiar el filtro de búsqueda o categoría.</p>
            </div>
        `;
        return;
    }

    itemsDePagina.forEach(it => {
        const tieneAudio = Boolean(it.audioUrl && it.audioUrl.trim());
        const card = document.createElement('div');
        card.className = `audio-item-card ${tieneAudio ? 'tiene-audio' : 'sin-audio'}`;
        card.id = `card-${it.id}`;

        card.innerHTML = `
            <div class="card-header-line">
                <div class="card-titulos">
                    <div>
                        <span class="item-badge-categoria ${it.badgeClass}">${it.etiquetaCategoria}</span>
                        <span class="item-id-ref">${it.id}</span>
                    </div>
                    <h3 class="item-titulo">${it.titulo || it.id}</h3>
                    ${it.subtitulo ? `<div style="font-size: 0.85rem; color: #94a3b8;">${it.subtitulo}</div>` : ''}
                </div>
                <div>
                    <span class="badge-estado-audio ${tieneAudio ? 'ok' : 'pendiente'}" id="estado-badge-${it.id}">
                        <span class="material-symbols-outlined" style="font-size: 14px;">${tieneAudio ? 'check_circle' : 'mic_none'}</span>
                        ${tieneAudio ? 'Con Voz Propia' : 'TTS / Pendiente'}
                    </span>
                </div>
            </div>

            ${it.texto ? `<div class="item-texto-preview">${escaparHTML(it.texto)}</div>` : ''}

            <div class="card-audio-controls">
                <input type="text" class="input-audio-url" id="input-url-${it.id}" 
                    placeholder="Pega aquí la URL de tu audio (ej. https://raw.githubusercontent.com/.../audio.mp3)" 
                    value="${it.audioUrl || ''}">
                <button type="button" class="btn-probar-audio" data-id="${it.id}" title="Probar reproducción">
                    <span class="material-symbols-outlined" style="font-size: 16px;">play_arrow</span> Probar
                </button>
                <button type="button" class="btn-guardar-item" data-id="${it.id}" title="Guardar URL">
                    <span class="material-symbols-outlined" style="font-size: 16px;">save</span> Guardar
                </button>
                <audio class="player-inline" id="player-${it.id}" controls></audio>
            </div>
        `;

        // Eventos de la tarjeta
        const btnGuardar = card.querySelector('.btn-guardar-item');
        btnGuardar.addEventListener('click', () => {
            const input = card.querySelector('.input-audio-url');
            guardarAudioIndividual(it.id, input.value);
            
            // Actualizar apariencia inmediata de la tarjeta
            const urlVal = input.value.trim();
            const badge = card.querySelector(`#estado-badge-${it.id}`);
            if (urlVal) {
                card.classList.remove('sin-audio');
                card.classList.add('tiene-audio');
                badge.className = 'badge-estado-audio ok';
                badge.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span> Con Voz Propia';
            } else {
                card.classList.remove('tiene-audio');
                card.classList.add('sin-audio');
                badge.className = 'badge-estado-audio pendiente';
                badge.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">mic_none</span> TTS / Pendiente';
            }
        });

        const btnProbar = card.querySelector('.btn-probar-audio');
        const player = card.querySelector('.player-inline');
        btnProbar.addEventListener('click', () => {
            const input = card.querySelector('.input-audio-url');
            const url = input.value.trim();
            if (!url) {
                alert('Ingresa primero la URL del audio para probarla.');
                input.focus();
                return;
            }

            if (audioPreviewActual && audioPreviewActual !== player) {
                audioPreviewActual.pause();
                audioPreviewActual.style.display = 'none';
            }

            player.src = url;
            player.style.display = 'block';
            player.play().catch(err => {
                alert('No se pudo reproducir el audio. Verifica que la URL sea pública y directa al archivo MP3/WAV.\n\nError: ' + err.message);
            });
            audioPreviewActual = player;
        });

        contenedor.appendChild(card);
    });
}

function actualizarKPIs() {
    const total = todosLosItems.length;
    const conAudio = todosLosItems.filter(x => Boolean(x.audioUrl && x.audioUrl.trim())).length;
    const pendientes = total - conAudio;
    const enFirestore = Object.keys(mapaAudiosPersonalizados).length;
    const pct = total > 0 ? Math.round((conAudio / total) * 100) : 0;

    const elTotal = document.getElementById('stat-total');
    if (elTotal) elTotal.textContent = total;

    const elGrab = document.getElementById('stat-grabados');
    if (elGrab) elGrab.textContent = conAudio;

    const elPct = document.getElementById('stat-pct-grabados');
    if (elPct) elPct.textContent = `${pct}% con audio propio`;

    const elPend = document.getElementById('stat-pendientes');
    if (elPend) elPend.textContent = pendientes;

    const elSinc = document.getElementById('stat-sincronizados');
    if (elSinc) elSinc.textContent = enFirestore;
}

function actualizarBadgesContadores() {
    const counts = {
        todos: todosLosItems.length,
        salmos: todosLosItems.filter(x => x.categoria === 'salmos').length,
        antifonas: todosLosItems.filter(x => x.categoria === 'antifonas').length,
        lecturas_oficio: todosLosItems.filter(x => x.categoria === 'lecturas_oficio').length,
        lecturas_breves: todosLosItems.filter(x => x.categoria === 'lecturas_breves').length,
        himnos: todosLosItems.filter(x => x.categoria === 'himnos').length,
        responsorios: todosLosItems.filter(x => x.categoria === 'responsorios').length,
        preces: todosLosItems.filter(x => x.categoria === 'preces').length,
        oraciones: todosLosItems.filter(x => x.categoria === 'oraciones').length,
        completas: todosLosItems.filter(x => x.categoria === 'completas').length
    };

    Object.keys(counts).forEach(cat => {
        const idElem = `count-${cat.replace('_', '-')}`;
        const el = document.getElementById(idElem);
        if (el) el.textContent = counts[cat];
    });
}

function mostrarBanner(mensaje, tipo = 'info') {
    const banner = document.getElementById('banner-estado');
    const txt = document.getElementById('banner-texto');
    if (!banner || !txt) return;

    banner.className = `estado-banner ${tipo}`;
    txt.textContent = mensaje;
    banner.style.display = 'flex';

    if (tipo === 'exito') {
        setTimeout(() => {
            banner.style.display = 'none';
        }, 4000);
    }
}

function escaparHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Exponer helper para consultar audios propios desde otros módulos (salterios.js / cinta.js)
export function obtenerAudioPropio(itemId) {
    if (!itemId) return null;
    if (mapaAudiosPersonalizados[itemId]) return mapaAudiosPersonalizados[itemId];
    try {
        const raw = localStorage.getItem(STORAGE_AUDIOS_KEY);
        if (raw) {
            const map = JSON.parse(raw);
            return map[itemId] || null;
        }
    } catch (_) {}
    return null;
}

if (typeof window !== 'undefined') {
    window.obtenerAudioPropio = obtenerAudioPropio;
}
