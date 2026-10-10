/**
 * himnos-manager.js
 * Controlador del Gestor de Himnos Litúrgicos (himno.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Himnos
 * Precarga automáticamente el catálogo completo desde src/data/himnos.js / src/data/db-himnos.js
 * Sincroniza con localStorage ('lh_himnos_cache') y Firebase Firestore.
 */

import { CATALOGO_HIMNOS_SEED, normalizarClaveHimno, generarAliasesClaveHimno } from '../data/db-himnos.js';

let listaHimnos = [];
let editandoId = null;

function deduplicarHimnos(arr) {
    if (!Array.isArray(arr)) return [];
    const mapa = new Map();
    arr.forEach(h => {
        if (!h || (!h.id && !h.varName)) return;
        const k = normalizarClaveHimno(h);
        if (!mapa.has(k)) {
            mapa.set(k, h);
        } else {
            const ex = mapa.get(k);
            const exAct = ex.actualizadoEn ? new Date(ex.actualizadoEn).getTime() : 0;
            const caAct = h.actualizadoEn ? new Date(h.actualizadoEn).getTime() : 0;
            const exEsSeed = String(ex.id || '').includes('_himno_');
            const caEsSeed = String(h.id || '').includes('_himno_');
            if (caAct > exAct || (caAct === exAct && exEsSeed && !caEsSeed)) {
                mapa.set(k, h);
            }
        }
    });
    return Array.from(mapa.values());
}

const MAPA_SEMANAS_POR_TIEMPO = {
    ordinario: Array.from({ length: 34 }, (_, i) => ({ valor: `${i + 1}`, texto: `Semana ${i + 1}` })),
    adviento:  Array.from({ length: 4 }, (_, i) => ({ valor: `${i + 1}`, texto: `Semana ${i + 1}` })),
    navidad:   [
        { valor: '1', texto: 'Semana 1 (Octava de Navidad)' },
        { valor: '2', texto: 'Semana 2 (Epifanía)' }
    ],
    cuaresma:  [
        { valor: '1', texto: 'Semana 1' },
        { valor: '2', texto: 'Semana 2' },
        { valor: '3', texto: 'Semana 3' },
        { valor: '4', texto: 'Semana 4' },
        { valor: '5', texto: 'Semana 5' },
        { valor: '6', texto: 'Semana 6 (Semana Santa)' }
    ],
    pascua:    [
        { valor: '1', texto: 'Semana 1 (Octava de Pascua)' },
        { valor: '2', texto: 'Semana 2' },
        { valor: '3', texto: 'Semana 3' },
        { valor: '4', texto: 'Semana 4' },
        { valor: '5', texto: 'Semana 5' },
        { valor: '6', texto: 'Semana 6' },
        { valor: '7', texto: 'Semana 7 (Pentecostés)' }
    ],
    santos:    [
        { valor: '1', texto: 'Común de Santos' },
        { valor: '2', texto: 'Propio de los Santos' },
        { valor: '3', texto: 'Solemnidades' },
        { valor: '4', texto: 'Fiestas y Memorias' }
    ]
};

document.addEventListener('DOMContentLoaded', async () => {
    actualizarOpcionesSemanas();
    configurarEventos();
    autocompletarId();
    await cargarDatos();
    renderizarLista();
});

// Actualiza las opciones del selector de semanas según el tiempo litúrgico
function actualizarOpcionesSemanas(semanaPrevia = null) {
    const selTiempo = document.getElementById('form-tiempo');
    const selSemana = document.getElementById('form-semana');
    if (!selSemana) return;

    const tiempoVal = selTiempo ? selTiempo.value : 'ordinario';
    const semanas = MAPA_SEMANAS_POR_TIEMPO[tiempoVal] || MAPA_SEMANAS_POR_TIEMPO.ordinario;

    selSemana.innerHTML = '';
    semanas.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.valor;
        opt.textContent = s.texto;
        selSemana.appendChild(opt);
    });

    if (semanaPrevia && Array.from(selSemana.options).some(o => o.value === String(semanaPrevia))) {
        selSemana.value = String(semanaPrevia);
    } else {
        selSemana.selectedIndex = 0;
    }
}

// Autocompletar ID del himno siguiendo la nomenclatura litúrgica uniforme
function autocompletarId() {
    if (editandoId) return; // Si estamos editando un himno existente, no sobrescribir su ID

    const selTiempo = document.getElementById('form-tiempo');
    const selSemana = document.getElementById('form-semana');
    const selDia = document.getElementById('form-dia');
    const selLibro = document.getElementById('form-libro');
    const inputId = document.getElementById('form-id');

    if (!inputId) return;

    const tiempo = selTiempo ? selTiempo.value : 'ordinario';
    const semana = selSemana ? selSemana.value : '1';
    const dia = selDia ? selDia.value : 'domingo';
    const libro = selLibro ? selLibro.value : 'laudes';

    const tMap = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp', santos: 'sa' };
    const dMap = { domingo: 'do', lunes: 'lu', martes: 'ma', miercoles: 'mi', miércoles: 'mi', jueves: 'ju', viernes: 'vi', sabado: 'sa', sábado: 'sa' };
    const lMap = { oficio: 'of', laudes: 'la', tercia: 'te', sexta: 'se', nona: 'no', visperas: 'vi', vispera: 'vi', completas: 'co' };

    const prefix = tMap[tiempo] || 'to';
    const semNum = String(semana).replace(/\D/g, '') || '1';
    const codSemana = `s${semNum.padStart(2, '0')}`;
    const diaAbrev = dMap[dia] || 'do';
    const horaAbrev = lMap[libro] || 'la';

    inputId.value = `h${prefix}${codSemana}${diaAbrev}${horaAbrev}`;
}

// Mostrar notificaciones dinámicas
function mostrarBannerEstado(mensaje, tipo = 'info') {
    const banner = document.getElementById('banner-estado');
    if (!banner) return;
    banner.className = `estado-banner ${tipo}`;
    banner.innerHTML = `<span class="material-symbols-outlined">${tipo === 'exito' ? 'check_circle' : tipo === 'alerta' ? 'warning' : 'info'}</span> ${mensaje}`;
    banner.style.display = 'flex';

    if (tipo === 'exito') {
        setTimeout(() => {
            banner.style.display = 'none';
        }, 3500);
    }
}

// Cargar datos: primero desde Firestore/localStorage, con respaldo de db-himnos.js
async function cargarDatos() {
    mostrarBannerEstado('Cargando himnos...', 'info');

    // 1. Probar desde Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "himnos"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 10) {
                    listaHimnos = deduplicarHimnos(desdeFb);
                    localStorage.setItem('lh_himnos_cache', JSON.stringify(listaHimnos));
                    mostrarBannerEstado(`✅ Se cargaron ${listaHimnos.length} himnos desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para himnos:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_himnos_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 10) {
                listaHimnos = deduplicarHimnos(parsed);
                localStorage.setItem('lh_himnos_cache', JSON.stringify(listaHimnos));
                mostrarBannerEstado(`📂 Cargados ${listaHimnos.length} himnos desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback al catálogo semilla completo (69 himnos de himnos.js)
    if (Array.isArray(CATALOGO_HIMNOS_SEED) && CATALOGO_HIMNOS_SEED.length > 0) {
        listaHimnos = deduplicarHimnos([...CATALOGO_HIMNOS_SEED]);
        localStorage.setItem('lh_himnos_cache', JSON.stringify(listaHimnos));
        mostrarBannerEstado(`✨ Cargados los ${listaHimnos.length} himnos canónicos desde himnos.js.`, 'exito');
        return;
    }

    listaHimnos = [];
    mostrarBannerEstado('No hay himnos cargados. Agrega uno nuevo con el formulario.', 'alerta');
}

// Configurar listeners de la interfaz
function configurarEventos() {
    // Botón Restaurar Catálogo Base
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_HIMNOS_SEED) || CATALOGO_HIMNOS_SEED.length === 0) {
            alert('El catálogo de himnos no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer los ${CATALOGO_HIMNOS_SEED.length} himnos originales desde src/data/himnos.js?`)) return;
        listaHimnos = [...CATALOGO_HIMNOS_SEED];
        localStorage.setItem('lh_himnos_cache', JSON.stringify(listaHimnos));
        renderizarLista();
        mostrarBannerEstado(`🔄 Se restauraron los ${listaHimnos.length} himnos del catálogo base.`, 'exito');
    });

    const form = document.getElementById('form-himno');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarHimno();
        });
    }

    // Botón Limpiar
    document.getElementById('btn-limpiar-form')?.addEventListener('click', limpiarFormulario);

    // Botón "+ Amén."
    document.getElementById('btn-add-amen')?.addEventListener('click', () => {
        const txt = document.getElementById('form-texto');
        if (txt) {
            txt.value = txt.value.trim().replace(/\.*$/, '') + '. Amén.';
        }
    });

    // Eventos de cambios en parámetros litúrgicos para autocompletar ID
    document.getElementById('form-tiempo')?.addEventListener('change', () => {
        actualizarOpcionesSemanas();
        autocompletarId();
    });
    document.getElementById('form-semana')?.addEventListener('change', autocompletarId);
    document.getElementById('form-dia')?.addEventListener('change', autocompletarId);
    document.getElementById('form-libro')?.addEventListener('change', autocompletarId);

    // Filtros de búsqueda
    document.getElementById('filtro-buscar')?.addEventListener('input', renderizarLista);
    document.getElementById('filtro-tiempo')?.addEventListener('change', renderizarLista);
    document.getElementById('filtro-libro')?.addEventListener('change', renderizarLista);

    // Subir a Firebase en lote
    document.getElementById('btn-subir-semilla')?.addEventListener('click', async () => {
        if (!confirm(`¿Deseas subir todos los ${listaHimnos.length} himnos a Firebase Firestore (colección 'himnos')?`)) return;
        mostrarBannerEstado('Subiendo himnos a Firestore...', 'info');

        try {
            if (window.firebaseAPI && window.firebaseAPI.db) {
                const { doc, writeBatch } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
                const batch = writeBatch(window.firebaseAPI.db);
                listaHimnos.forEach(item => {
                    const docRef = doc(window.firebaseAPI.db, "himnos", item.id);
                    batch.set(docRef, item, { merge: true });
                });
                await batch.commit();
                mostrarBannerEstado(`🎉 ¡Éxito! Se sincronizaron ${listaHimnos.length} himnos en Firestore.`, 'exito');
            } else {
                alert('Firebase API no está configurada.');
            }
        } catch (e) {
            mostrarBannerEstado(`❌ Error al subir: ${e.message}`, 'alerta');
        }
    });

    // Exportar JSON
    document.getElementById('btn-exportar-json')?.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaHimnos, null, 2));
        const dl = document.createElement('a');
        dl.setAttribute("href", dataStr);
        dl.setAttribute("download", `himnos_backup_${new Date().toISOString().split('T')[0]}.json`);
        dl.click();
    });

    // Exportar respaldo en JS
    document.getElementById('btn-exportar-js')?.addEventListener('click', () => {
        const jsCode = `// Respaldo de Himnos Litúrgicos generado el ${new Date().toLocaleString()}\nexport const CATALOGO_HIMNOS_SEED = ${JSON.stringify(listaHimnos, null, 2)};\n`;
        const blob = new Blob([jsCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const dl = document.createElement('a');
        dl.setAttribute("href", url);
        dl.setAttribute("download", `himnos-seed-${new Date().toISOString().split('T')[0]}.js`);
        dl.click();
    });
}

// Guardar o Actualizar un Himno
async function guardarHimno() {
    const inputId = document.getElementById('form-id');
    const inputTitulo = document.getElementById('form-titulo');
    const selectTiempo = document.getElementById('form-tiempo');
    const selectSemana = document.getElementById('form-semana');
    const selectDia = document.getElementById('form-dia');
    const selectLibro = document.getElementById('form-libro');
    const textareaTexto = document.getElementById('form-texto');

    const id = inputId.value.trim();
    const titulo = inputTitulo.value.trim();
    const tiempo = selectTiempo ? selectTiempo.value : 'ordinario';
    const semana = selectSemana ? parseInt(selectSemana.value, 10) || 1 : 1;
    const dia = selectDia ? selectDia.value : 'domingo';
    const libro = selectLibro ? selectLibro.value : 'laudes';
    const texto = textareaTexto.value.trim();

    if (!id || !titulo || !texto) {
        alert('Por favor completa todos los campos requeridos.');
        return;
    }

    const himnoObjeto = {
        id,
        varName: id,
        titulo,
        tiempo,
        semana,
        dia,
        libro,
        texto,
        tipo: 'himno',
        actualizadoEn: new Date().toISOString()
    };

    const claveNueva = normalizarClaveHimno(id);
    const idAnterior = editandoId;
    const indice = listaHimnos.findIndex(h =>
        h.id === id ||
        (idAnterior && h.id === idAnterior) ||
        normalizarClaveHimno(h) === claveNueva
    );
    if (indice >= 0) {
        listaHimnos[indice] = himnoObjeto;
        // Eliminar posibles duplicados heredados con la misma clave canónica
        listaHimnos = listaHimnos.filter((h, idx) => idx === indice || normalizarClaveHimno(h) !== claveNueva);
    } else {
        listaHimnos.unshift(himnoObjeto);
    }

    // Persistir localmente
    localStorage.setItem('lh_himnos_cache', JSON.stringify(listaHimnos));

    // Actualizar automáticamente cualquier salterio en caché local que utilice este himno
    try {
        const aliasesSet = new Set(generarAliasesClaveHimno(id));
        if (idAnterior) {
            generarAliasesClaveHimno(idAnterior).forEach(a => aliasesSet.add(a));
        }
        const normTit = (s) => String(s || '').replace(/^himno\s*:\s*/i, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
        const titNuevoNorm = normTit(titulo);

        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('lh_salterio_')) {
                try {
                    const docSal = JSON.parse(localStorage.getItem(k));
                    if (!docSal || typeof docSal !== 'object') continue;
                    let modificado = false;

                    if (docSal.himno) {
                        const hIdSal = normalizarClaveHimno(docSal.himno.id || '');
                        const hTitSal = normTit(docSal.himno.titulo || '');
                        if ((hIdSal && aliasesSet.has(hIdSal)) || (titNuevoNorm && hTitSal === titNuevoNorm)) {
                            docSal.himno.id = id;
                            docSal.himno.titulo = titulo;
                            docSal.himno.texto = texto;
                            modificado = true;
                        }
                    }
                    if (docSal.salmoInvitatorio && (docSal.salmoInvitatorio.himnoId || docSal.salmoInvitatorio.himnot)) {
                        const hIdInv = normalizarClaveHimno(docSal.salmoInvitatorio.himnoId || '');
                        const hTitInv = normTit(docSal.salmoInvitatorio.himnot || '');
                        if ((hIdInv && aliasesSet.has(hIdInv)) || (titNuevoNorm && hTitInv === titNuevoNorm)) {
                            docSal.salmoInvitatorio.himnoId = id;
                            docSal.salmoInvitatorio.himnot = titulo;
                            docSal.salmoInvitatorio.himno = texto;
                            modificado = true;
                        }
                    }
                    if (docSal.himnoTeDeum) {
                        const tdId = normalizarClaveHimno(docSal.himnoTeDeum.id || '');
                        const tdTit = normTit(docSal.himnoTeDeum.titulo || '');
                        if ((tdId && aliasesSet.has(tdId)) || (titNuevoNorm && tdTit === titNuevoNorm)) {
                            docSal.himnoTeDeum.id = id;
                            docSal.himnoTeDeum.titulo = titulo;
                            docSal.himnoTeDeum.texto = texto;
                            modificado = true;
                        }
                    }

                    if (modificado) {
                        localStorage.setItem(k, JSON.stringify(docSal));
                    }
                } catch (_) {}
            }
        }
    } catch (_) {}

    // Persistir en Firestore si hay conexión
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "himnos", id), himnoObjeto, { merge: true });
        }
    } catch (e) {
        console.warn('Aviso: guardado localmente, error en Firebase:', e);
    }

    mostrarBannerEstado(`✅ Himno «${titulo}» guardado con éxito.`, 'exito');
    limpiarFormulario();
    renderizarLista();
}

// Cargar un himno en el formulario para editar
window.editarHimno = function(id) {
    const h = listaHimnos.find(item => item.id === id);
    if (!h) return;

    editandoId = id;

    if (document.getElementById('form-tiempo')) document.getElementById('form-tiempo').value = h.tiempo || 'ordinario';
    actualizarOpcionesSemanas(h.semana || 1);
    if (document.getElementById('form-dia')) document.getElementById('form-dia').value = h.dia || 'domingo';
    if (document.getElementById('form-libro')) document.getElementById('form-libro').value = h.libro || 'laudes';
    if (document.getElementById('form-id')) document.getElementById('form-id').value = h.id || '';
    if (document.getElementById('form-titulo')) document.getElementById('form-titulo').value = h.titulo || '';
    if (document.getElementById('form-texto')) document.getElementById('form-texto').value = h.texto || '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('form-titulo').focus();
};

// Eliminar un himno
window.eliminarHimno = async function(id) {
    const h = listaHimnos.find(item => item.id === id);
    if (!h) return;
    if (!confirm(`¿Estás seguro de eliminar el himno «${h.titulo}»?`)) return;

    listaHimnos = listaHimnos.filter(item => item.id !== id);
    localStorage.setItem('lh_himnos_cache', JSON.stringify(listaHimnos));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "himnos", id));
        }
    } catch (e) {
        console.warn('Error eliminando en Firebase:', e);
    }

    mostrarBannerEstado(`Himno «${h.titulo}» eliminado.`, 'alerta');
    renderizarLista();
};

// Copiar texto del himno al portapapeles
window.copiarTextoHimno = async function(id) {
    const h = listaHimnos.find(item => item.id === id);
    if (!h) return;

    try {
        const textoCompleto = `${h.titulo}\n\n${h.texto}`;
        await navigator.clipboard.writeText(textoCompleto);
        mostrarBannerEstado(`📋 Himno «${h.titulo}» copiado al portapapeles.`, 'exito');
    } catch (e) {
        alert('Copiado: ' + h.titulo);
    }
};

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('form-himno')?.reset();
    editandoId = null;
    actualizarOpcionesSemanas();
    autocompletarId();
}

// Renderizar lista filtrada
function renderizarLista() {
    const contenedor = document.getElementById('lista-himnos-items');
    const contador = document.getElementById('contador-himnos');
    const query = document.getElementById('filtro-buscar')?.value.toLowerCase().trim() || '';
    const filtroTiempo = document.getElementById('filtro-tiempo')?.value || '';
    const filtroLibro = document.getElementById('filtro-libro')?.value || '';

    if (!contenedor) return;

    let filtrados = listaHimnos.filter(item => {
        if (filtroTiempo && item.tiempo !== filtroTiempo) return false;
        if (filtroLibro && item.libro !== filtroLibro) return false;
        if (query) {
            const matchId = (item.id || '').toLowerCase().includes(query);
            const matchTitulo = (item.titulo || '').toLowerCase().includes(query);
            const matchTexto = (item.texto || '').toLowerCase().includes(query);
            return matchId || matchTitulo || matchTexto;
        }
        return true;
    });

    if (contador) contador.textContent = `${filtrados.length} de ${listaHimnos.length}`;

    if (filtrados.length === 0) {
        contenedor.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 40px;">No se encontraron himnos con los filtros aplicados.</div>`;
        return;
    }

    contenedor.innerHTML = filtrados.map(h => {
        return `
            <div class="item-himno-card" id="himno-card-${h.id}">
                <div class="himno-card-header">
                    <div>
                        <h3 class="himno-card-titulo">${escapeHtml(h.titulo || h.id)}</h3>
                        <div class="himno-badges-row">
                            <span class="badge-himno tipo-himno">HIMNO</span>
                            <span class="badge-himno tiempo-badge">${(h.tiempo || 'ordinario').toUpperCase()}</span>
                            <span class="badge-himno libro-badge">${(h.libro || 'laudes').toUpperCase()}</span>
                            <span class="badge-himno id-badge">${h.id}</span>
                        </div>
                    </div>
                    <div class="himno-card-acciones">
                        <button class="btn-icono-card" onclick="copiarTextoHimno('${h.id}')" title="Copiar texto completo">
                            <span class="material-symbols-outlined" style="font-size: 18px;">content_copy</span>
                        </button>
                        <button class="btn-icono-card" onclick="editarHimno('${h.id}')" title="Editar este himno">
                            <span class="material-symbols-outlined" style="font-size: 18px;">edit</span>
                        </button>
                        <button class="btn-icono-card btn-delete" onclick="eliminarHimno('${h.id}')" title="Eliminar este himno">
                            <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                        </button>
                    </div>
                </div>
                <div class="himno-card-cuerpo">${escapeHtml(h.texto || '')}</div>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
