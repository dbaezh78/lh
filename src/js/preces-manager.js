/**
 * preces-manager.js
 * Controlador del Gestor de Preces e Intercesiones (preces.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Preces canónicas.
 * Precarga el catálogo canónico desde src/data/db-preces.js
 * Sincroniza con localStorage ('lh_preces_cache') y Firebase Firestore ('preces_liturgia').
 */

import { CATALOGO_PRECES_SEED, PrecesDB } from '../data/db-preces.js';

let listaPreces = [];
let editandoId = null;

document.addEventListener('DOMContentLoaded', async () => {
    configurarEventos();
    await cargarDatos();
    renderizarLista();
    actualizarLivePreview();
});

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

// Cargar datos: primero desde Firestore/localStorage, con respaldo de db-preces.js
async function cargarDatos() {
    mostrarBannerEstado('Cargando preces canónicas...', 'info');

    // 1. Probar desde Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "preces_liturgia"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 5) {
                    listaPreces = desdeFb;
                    localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));
                    mostrarBannerEstado(`✅ Se cargaron ${listaPreces.length} preces desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para preces:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_preces_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 5) {
                listaPreces = parsed;
                mostrarBannerEstado(`📂 Cargadas ${listaPreces.length} preces desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback al catálogo semilla canónico
    if (Array.isArray(CATALOGO_PRECES_SEED) && CATALOGO_PRECES_SEED.length > 0) {
        listaPreces = [...CATALOGO_PRECES_SEED];
        localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));
        mostrarBannerEstado(`✨ Cargadas las ${listaPreces.length} preces canónicas desde el catálogo base.`, 'exito');
        return;
    }

    listaPreces = [];
    mostrarBannerEstado('No hay preces registradas. Agrega una nueva con el formulario.', 'alerta');
}

// Configurar listeners de la interfaz
function configurarEventos() {
    // Botón Restaurar Catálogo Base
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_PRECES_SEED) || CATALOGO_PRECES_SEED.length === 0) {
            alert('El catálogo de preces no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer las ${CATALOGO_PRECES_SEED.length} preces originales?`)) return;
        listaPreces = [...CATALOGO_PRECES_SEED];
        localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));
        renderizarLista();
        limpiarFormulario();
        mostrarBannerEstado(`🔄 Se restauraron las ${listaPreces.length} preces del catálogo base.`, 'exito');
    });

    const form = document.getElementById('form-preces');
    if (form) {
        form.addEventListener('submit', guardarPreces);

        // Actualizar Live Preview en tiempo real al escribir
        ['form-titulo', 'form-intro', 'form-respuesta', 'form-intenciones', 'form-libre', 'form-concl'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', actualizarLivePreview);
            }
        });
    }

    // Botón Limpiar Formulario
    document.getElementById('btn-limpiar-form')?.addEventListener('click', limpiarFormulario);

    // Botón Subir a Firebase
    document.getElementById('btn-subir-semilla')?.addEventListener('click', subirAFirebase);

    // Botón Exportar JSON
    document.getElementById('btn-exportar-json')?.addEventListener('click', exportarJSON);

    // Filtros de búsqueda
    ['filtro-busqueda', 'filtro-tiempo', 'filtro-dia', 'filtro-libro'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', renderizarLista);
    });
}

// Actualizar la vista previa en el pergamino litúrgico
function actualizarLivePreview() {
    const idVal = document.getElementById('form-id')?.value.trim() || 'Preces';
    const tituloVal = document.getElementById('form-titulo')?.value.trim() || 'PRECES';
    const introVal = document.getElementById('form-intro')?.value.trim() || 'Invoquemos a Cristo nuestro Salvador, diciendo:';
    const respVal = document.getElementById('form-respuesta')?.value.trim() || 'Escúchanos, Señor.';
    const intencionesVal = document.getElementById('form-intenciones')?.value.trim() || 'Te bendecimos, Señor, por este nuevo día.\nGuía nuestros pasos en tu paz.';
    const libreVal = document.getElementById('form-libre')?.value.trim() || 'Se pueden añadir algunas intenciones libres';
    const conclVal = document.getElementById('form-concl')?.value.trim() || 'Terminemos nuestra oración con la plegaria que Cristo nos enseñó:';

    const pBadge = document.getElementById('preview-id-badge');
    if (pBadge) pBadge.textContent = idVal;

    const pTitulo = document.getElementById('preview-titulo');
    if (pTitulo) pTitulo.textContent = 'PRECES';

    const pIntro = document.getElementById('preview-intro');
    if (pIntro) pIntro.textContent = introVal;

    const pResp = document.getElementById('preview-respuesta');
    if (pResp) pResp.textContent = respVal;

    const pIntenciones = document.getElementById('preview-intenciones');
    if (pIntenciones) {
        const estrofas = intencionesVal.split(/\n\s*\n/).filter(Boolean);
        pIntenciones.innerHTML = estrofas.map(est => `
            <div class="preview-intencion-item">${est.replace(/\n/g, '<br>')}</div>
        `).join('');
    }

    const pLibre = document.getElementById('preview-libre');
    if (pLibre) pLibre.textContent = libreVal;

    const pConcl = document.getElementById('preview-concl');
    if (pConcl) pConcl.textContent = conclVal;
}

// Renderizar la tabla del catálogo
function renderizarLista() {
    const contenedor = document.getElementById('cuerpo-tabla-preces');
    if (!contenedor) return;

    const fTexto = (document.getElementById('filtro-busqueda')?.value || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const fTiempo = document.getElementById('filtro-tiempo')?.value || 'todos';
    const fDia = document.getElementById('filtro-dia')?.value || 'todos';
    const fLibro = document.getElementById('filtro-libro')?.value || 'todos';

    const filtradas = listaPreces.filter(p => {
        if (fTiempo !== 'todos' && p.tiempo !== fTiempo) return false;
        if (fDia !== 'todos' && p.dia !== fDia) return false;
        if (fLibro !== 'todos' && p.libro !== fLibro) return false;
        if (fTexto) {
            const tit = (p.titulo || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const intro = (p.intro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const resp = (p.respuesta || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const ints = (Array.isArray(p.intenciones) ? p.intenciones.join(' ') : (p.intenciones || '')).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const pId = (p.id || '').toLowerCase();
            return tit.includes(fTexto) || intro.includes(fTexto) || resp.includes(fTexto) || ints.includes(fTexto) || pId.includes(fTexto);
        }
        return true;
    });

    const contador = document.getElementById('contador-preces');
    if (contador) contador.textContent = `(${filtradas.length} de ${listaPreces.length})`;

    if (filtradas.length === 0) {
        contenedor.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 30px;">No se encontraron preces con los filtros seleccionados.</td></tr>`;
        return;
    }

    contenedor.innerHTML = filtradas.map(p => {
        const esActivo = p.id === editandoId ? 'class="activo"' : '';
        const diaNombre = p.dia ? p.dia.charAt(0).toUpperCase() + p.dia.slice(1) : '';
        const semTxt = p.semana ? `S${p.semana}` : '';
        const numInts = Array.isArray(p.intenciones) ? p.intenciones.length : (p.intenciones ? p.intenciones.split(/\n\s*\n/).length : 0);
        return `
            <tr ${esActivo} data-id="${p.id}">
                <td><strong style="color: var(--accent-red); font-family: monospace;">${p.id}</strong></td>
                <td><span style="font-weight: 600;">${p.titulo || p.id}</span></td>
                <td><span style="text-transform: capitalize; color: #93c5fd;">${p.tiempo}</span> ${semTxt}</td>
                <td>${diaNombre}</td>
                <td><span style="background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${numInts} peticiones</span></td>
                <td class="col-acciones">
                    <button class="btn-accion-mini btn-editar" title="Editar Preces" data-id="${p.id}">
                        <span class="material-symbols-outlined" style="font-size: 15px;">edit</span>
                    </button>
                    <button class="btn-accion-mini eliminar btn-eliminar" title="Eliminar" data-id="${p.id}">
                        <span class="material-symbols-outlined" style="font-size: 15px;">delete</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Eventos de edición y eliminación
    contenedor.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            cargarEnFormulario(btn.dataset.id);
        });
    });

    contenedor.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarPreces(btn.dataset.id);
        });
    });

    contenedor.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', () => {
            if (tr.dataset.id) cargarEnFormulario(tr.dataset.id);
        });
    });
}

// Cargar item en el formulario para editar
function cargarEnFormulario(id) {
    const item = listaPreces.find(p => p.id === id);
    if (!item) return;

    editandoId = item.id;

    document.getElementById('form-id').value = item.id;
    document.getElementById('form-id').disabled = true;
    document.getElementById('form-titulo').value = item.titulo || '';
    document.getElementById('form-tiempo').value = item.tiempo || 'ordinario';
    document.getElementById('form-semana').value = item.semana || '1';
    document.getElementById('form-dia').value = item.dia || 'lunes';
    document.getElementById('form-libro').value = item.libro || 'laudes';
    document.getElementById('form-intro').value = item.intro || '';
    document.getElementById('form-respuesta').value = item.respuesta || '';

    const intencionesTxt = Array.isArray(item.intenciones) 
        ? item.intenciones.join('\n\n') 
        : (item.intenciones || '');
    document.getElementById('form-intenciones').value = intencionesTxt;

    document.getElementById('form-libre').value = item.libre || 'Se pueden añadir algunas intenciones libres';
    document.getElementById('form-concl').value = item.concl || '';

    const btnSubmit = document.getElementById('btn-guardar-form');
    if (btnSubmit) {
        btnSubmit.innerHTML = `<span class="material-symbols-outlined">save</span> Actualizar Preces`;
    }

    renderizarLista();
    actualizarLivePreview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Limpiar formulario para nuevo registro
function limpiarFormulario() {
    editandoId = null;
    const form = document.getElementById('form-preces');
    if (form) form.reset();

    const inputId = document.getElementById('form-id');
    if (inputId) {
        inputId.disabled = false;
        inputId.value = '';
    }

    const btnSubmit = document.getElementById('btn-guardar-form');
    if (btnSubmit) {
        btnSubmit.innerHTML = `<span class="material-symbols-outlined">add_task</span> Guardar Preces`;
    }

    renderizarLista();
    actualizarLivePreview();
}

// Guardar o Actualizar Preces
async function guardarPreces(e) {
    e.preventDefault();

    const id = document.getElementById('form-id').value.trim();
    if (!id) {
        alert('Por favor especifica un ID primario único.');
        return;
    }

    const titulo = document.getElementById('form-titulo').value.trim();
    const tiempo = document.getElementById('form-tiempo').value;
    const semana = document.getElementById('form-semana').value;
    const dia = document.getElementById('form-dia').value;
    const libro = document.getElementById('form-libro').value;
    const intro = document.getElementById('form-intro').value.trim();
    const respuesta = document.getElementById('form-respuesta').value.trim();
    const intencionesRaw = document.getElementById('form-intenciones').value.trim();
    const intenciones = intencionesRaw.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    const libre = document.getElementById('form-libre').value.trim();
    const concl = document.getElementById('form-concl').value.trim();

    const nuevoObjeto = {
        id,
        varName: id,
        titulo: titulo || `Preces ${id}`,
        tiempo,
        semana,
        dia,
        libro,
        intro,
        respuesta,
        intenciones,
        libre,
        concl,
        textoCompleto: `${intro}\n\n${respuesta}\n\n${intenciones.join('\n\n')}`
    };

    const idx = listaPreces.findIndex(p => p.id === id);
    if (idx >= 0) {
        listaPreces[idx] = nuevoObjeto;
        mostrarBannerEstado(`✅ Preces "${id}" actualizadas exitosamente.`, 'exito');
    } else {
        listaPreces.unshift(nuevoObjeto);
        mostrarBannerEstado(`✨ Preces "${id}" registradas exitosamente.`, 'exito');
    }

    localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));

    // Si Firebase está activo, guardar también en Firestore
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "preces_liturgia", id), nuevoObjeto);
        }
    } catch (err) {
        console.warn('No se pudo guardar en Firestore inmediatamente:', err);
    }

    limpiarFormulario();
}

// Eliminar Preces
async function eliminarPreces(id) {
    if (!confirm(`¿Estás seguro de eliminar las preces "${id}"?`)) return;

    listaPreces = listaPreces.filter(p => p.id !== id);
    localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "preces_liturgia", id));
        }
    } catch (err) {
        console.warn('Error al eliminar en Firestore:', err);
    }

    if (editandoId === id) limpiarFormulario();
    renderizarLista();
    mostrarBannerEstado(`🗑️ Preces "${id}" eliminadas.`, 'alerta');
}

// Subir todo el catálogo a Firebase Firestore
async function subirAFirebase() {
    if (!listaPreces || listaPreces.length === 0) {
        alert('No hay preces para sincronizar.');
        return;
    }

    if (!confirm(`¿Subir ${listaPreces.length} preces a la colección 'preces_liturgia' en Firebase Firestore?`)) return;

    mostrarBannerEstado('Subiendo catálogo a Firebase Firestore...', 'info');

    try {
        if (!window.firebaseAPI || !window.firebaseAPI.db) {
            throw new Error('Firebase no está inicializado o no hay conexión.');
        }

        const { doc, writeBatch } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        const batch = writeBatch(window.firebaseAPI.db);

        // Firestore admite hasta 500 escrituras por batch
        let subidas = 0;
        for (const item of listaPreces) {
            const ref = doc(window.firebaseAPI.db, "preces_liturgia", item.id);
            batch.set(ref, item);
            subidas++;
            if (subidas >= 450) break;
        }

        await batch.commit();
        mostrarBannerEstado(`🎉 ¡Éxito! Se subieron ${subidas} preces a Firestore en tiempo real.`, 'exito');
    } catch (e) {
        console.error('Error al subir a Firebase:', e);
        alert('Fallo al subir a Firebase: ' + (e.message || e));
        mostrarBannerEstado('Error en la sincronización con Firebase.', 'alerta');
    }
}

// Exportar como archivo JSON descargable
function exportarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaPreces, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `catalogo_preces_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    mostrarBannerEstado('📥 Archivo JSON descargado exitosamente.', 'exito');
}
