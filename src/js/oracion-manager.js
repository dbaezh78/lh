/**
 * oracion-manager.js
 * Controlador del Gestor de Oraciones Litúrgicas (oracion.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Oraciones canónicas.
 * Precarga el catálogo canónico desde src/data/db-oracion.js
 * Sincroniza con localStorage ('lh_oracion_cache') y Firebase Firestore ('oraciones_liturgia').
 */

import { CATALOGO_ORACION_SEED, OracionDB } from '../data/db-oracion.js';

let listaOraciones = [];
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

// Cargar datos: primero desde Firestore/localStorage, con respaldo de db-oracion.js
async function cargarDatos() {
    mostrarBannerEstado('Cargando oraciones canónicas...', 'info');

    // 1. Probar desde Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "oraciones_liturgia"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 5) {
                    listaOraciones = desdeFb;
                    localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));
                    mostrarBannerEstado(`✅ Se cargaron ${listaOraciones.length} oraciones desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para oraciones:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_oracion_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 5) {
                listaOraciones = parsed;
                mostrarBannerEstado(`📂 Cargadas ${listaOraciones.length} oraciones desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback al catálogo semilla canónico
    if (Array.isArray(CATALOGO_ORACION_SEED) && CATALOGO_ORACION_SEED.length > 0) {
        listaOraciones = [...CATALOGO_ORACION_SEED];
        localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));
        mostrarBannerEstado(`✨ Cargadas las ${listaOraciones.length} oraciones canónicas desde el catálogo base.`, 'exito');
        return;
    }

    listaOraciones = [];
    mostrarBannerEstado('No hay oraciones registradas. Agrega una nueva con el formulario.', 'alerta');
}

// Configurar listeners de la interfaz
function configurarEventos() {
    // Botón Restaurar Catálogo Base
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_ORACION_SEED) || CATALOGO_ORACION_SEED.length === 0) {
            alert('El catálogo de oraciones no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer las ${CATALOGO_ORACION_SEED.length} oraciones originales?`)) return;
        listaOraciones = [...CATALOGO_ORACION_SEED];
        localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));
        renderizarLista();
        limpiarFormulario();
        mostrarBannerEstado(`🔄 Se restauraron las ${listaOraciones.length} oraciones del catálogo base.`, 'exito');
    });

    const form = document.getElementById('form-oracion');
    if (form) {
        form.addEventListener('submit', guardarOracion);

        // Actualizar Live Preview en tiempo real al escribir
        ['form-id', 'form-titulo', 'form-texto', 'form-conclusion'].forEach(id => {
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
    const idVal = document.getElementById('form-id')?.value.trim() || 'Oración';
    const textoVal = document.getElementById('form-texto')?.value.trim() || 'Tu gracia, Señor, inspire nuestras obras, las sostenga y acompañe; para que todo nuestro trabajo brote de ti, como de su fuente, y tienda a ti, como a su fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.';
    const conclusionVal = document.getElementById('form-conclusion')?.value.trim() || '';

    const pBadge = document.getElementById('preview-id-badge');
    if (pBadge) pBadge.textContent = idVal;

    const pTitulo = document.getElementById('preview-titulo');
    if (pTitulo) pTitulo.textContent = 'ORACIÓN';

    const pTexto = document.getElementById('preview-texto');
    if (pTexto) pTexto.textContent = textoVal;

    const pConcl = document.getElementById('preview-conclusion');
    if (pConcl) {
        if (conclusionVal) {
            pConcl.textContent = conclusionVal;
            pConcl.style.display = 'block';
        } else {
            pConcl.style.display = 'none';
        }
    }
}

// Renderizar la tabla del catálogo
function renderizarLista() {
    const contenedor = document.getElementById('cuerpo-tabla-oraciones');
    if (!contenedor) return;

    const fTexto = (document.getElementById('filtro-busqueda')?.value || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const fTiempo = document.getElementById('filtro-tiempo')?.value || 'todos';
    const fDia = document.getElementById('filtro-dia')?.value || 'todos';
    const fLibro = document.getElementById('filtro-libro')?.value || 'todos';

    const filtradas = listaOraciones.filter(o => {
        if (fTiempo !== 'todos' && o.tiempo !== fTiempo) return false;
        if (fDia !== 'todos' && o.dia !== fDia) return false;
        if (fLibro !== 'todos' && o.libro !== fLibro) return false;
        if (fTexto) {
            const tit = (o.titulo || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const txt = (o.texto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const oId = (o.id || '').toLowerCase();
            return tit.includes(fTexto) || txt.includes(fTexto) || oId.includes(fTexto);
        }
        return true;
    });

    const contador = document.getElementById('contador-oraciones');
    if (contador) contador.textContent = `(${filtradas.length} de ${listaOraciones.length})`;

    if (filtradas.length === 0) {
        contenedor.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 30px;">No se encontraron oraciones con los filtros seleccionados.</td></tr>`;
        return;
    }

    contenedor.innerHTML = filtradas.map(o => {
        const diaCap = (o.dia || '').charAt(0).toUpperCase() + (o.dia || '').slice(1);
        const snippet = (o.texto || '').replace(/\n/g, ' ').slice(0, 100) + '...';
        return `
            <tr>
                <td class="td-id">${o.id}</td>
                <td class="td-titulo">${o.titulo || o.id}</td>
                <td><span class="badge-tag ${o.libro}">${o.libro || 'laudes'}</span></td>
                <td>${diaCap} (Sem. ${o.semana || '1'})</td>
                <td class="td-texto-snippet" title="${(o.texto || '').replace(/"/g, '&quot;')}">${snippet}</td>
                <td>
                    <div class="acciones-celda">
                        <button class="btn-accion-icono btn-editar-oracion" data-id="${o.id}" title="Editar esta oración">
                            <span class="material-symbols-outlined" style="font-size: 18px;">edit</span>
                        </button>
                        <button class="btn-accion-icono borrar btn-borrar-oracion" data-id="${o.id}" title="Eliminar oración">
                            <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Eventos de botones Editar y Eliminar
    contenedor.querySelectorAll('.btn-editar-oracion').forEach(btn => {
        btn.addEventListener('click', () => editarOracion(btn.getAttribute('data-id')));
    });

    contenedor.querySelectorAll('.btn-borrar-oracion').forEach(btn => {
        btn.addEventListener('click', () => eliminarOracion(btn.getAttribute('data-id')));
    });
}

// Cargar una oración en el formulario para editar
function editarOracion(id) {
    const o = listaOraciones.find(item => item.id === id);
    if (!o) return;

    editandoId = id;

    document.getElementById('form-id').value = o.id || '';
    document.getElementById('form-titulo').value = o.titulo || '';
    document.getElementById('form-tiempo').value = o.tiempo || 'ordinario';
    document.getElementById('form-semana').value = o.semana || '1';
    document.getElementById('form-dia').value = o.dia || 'lunes';
    document.getElementById('form-libro').value = o.libro || 'laudes';
    if (document.getElementById('form-oremos')) document.getElementById('form-oremos').value = o.oremos || '';
    document.getElementById('form-texto').value = o.texto || '';
    document.getElementById('form-conclusion').value = o.conclusion || '';

    // Cambiar estado visual del formulario
    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) btnGuardar.textContent = 'Actualizar Oración';
    document.getElementById('titulo-formulario').innerHTML = `<span class="material-symbols-outlined">edit_note</span> Editando: ${o.id}`;

    actualizarLivePreview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Guardar (crear o actualizar) oración
async function guardarOracion(e) {
    e.preventDefault();

    const id = document.getElementById('form-id').value.trim();
    const titulo = document.getElementById('form-titulo').value.trim();
    const tiempo = document.getElementById('form-tiempo').value;
    const semana = document.getElementById('form-semana').value;
    const dia = document.getElementById('form-dia').value;
    const libro = document.getElementById('form-libro').value;
    const oremos = document.getElementById('form-oremos')?.value?.trim() || '';
    const texto = document.getElementById('form-texto').value.trim();
    const conclusion = document.getElementById('form-conclusion').value.trim();

    if (!id || !texto) {
        alert('Por favor complete al menos el ID y el texto de la oración.');
        return;
    }

    const oracionObj = {
        id,
        varName: `${id}_oracion`,
        titulo: titulo || `Oración - ${tiempo} - Semana ${semana} - ${dia} (${libro})`,
        tiempo,
        semana,
        dia,
        libro,
        oremos,
        texto,
        conclusion,
        textoCompleto: texto
    };

    const idx = listaOraciones.findIndex(item => item.id === id);
    if (idx >= 0) {
        listaOraciones[idx] = oracionObj;
        mostrarBannerEstado(`✅ Oración "${id}" actualizada correctamente.`, 'exito');
    } else {
        listaOraciones.push(oracionObj);
        mostrarBannerEstado(`✨ Nueva oración "${id}" registrada con éxito.`, 'exito');
    }

    // Persistir localmente
    localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));

    // Si Firebase está disponible, guardar directamente
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "oraciones_liturgia", id), oracionObj);
        }
    } catch (err) {
        console.warn('No se pudo sincronizar individualmente con Firebase:', err);
    }

    limpiarFormulario();
    renderizarLista();
    actualizarLivePreview();
}

// Eliminar oración
async function eliminarOracion(id) {
    if (!confirm(`¿Eliminar definitivamente la oración "${id}"?`)) return;

    listaOraciones = listaOraciones.filter(item => item.id !== id);
    localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "oraciones_liturgia", id));
        }
    } catch (e) {
        console.warn('Error al borrar de Firestore:', e);
    }

    if (editandoId === id) limpiarFormulario();
    renderizarLista();
    mostrarBannerEstado(`🗑️ Se eliminó la oración "${id}".`, 'alerta');
}

// Limpiar formulario y reiniciar estado
function limpiarFormulario() {
    editandoId = null;
    document.getElementById('form-oracion')?.reset();
    document.getElementById('form-id').value = '';
    document.getElementById('form-titulo').value = '';
    if (document.getElementById('form-oremos')) document.getElementById('form-oremos').value = '';
    document.getElementById('form-texto').value = '';
    document.getElementById('form-conclusion').value = '';

    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) btnGuardar.textContent = 'Guardar Oración';
    document.getElementById('titulo-formulario').innerHTML = `<span class="material-symbols-outlined">add_circle</span> Nueva Oración`;

    actualizarLivePreview();
}

// Subir todo el catálogo a Firebase Firestore
async function subirAFirebase() {
    if (!window.firebaseAPI || !window.firebaseAPI.db) {
        alert('Firebase no está disponible en este momento. Verifique la conexión.');
        return;
    }

    if (!confirm(`¿Desea subir ${listaOraciones.length} oraciones a la colección "oraciones_liturgia" de Firebase?`)) {
        return;
    }

    mostrarBannerEstado('Subiendo catálogo de oraciones a Firebase...', 'info');

    try {
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        let subidas = 0;

        for (const o of listaOraciones) {
            await setDoc(doc(window.firebaseAPI.db, "oraciones_liturgia", o.id), o);
            subidas++;
        }

        mostrarBannerEstado(`🚀 Éxito: Se subieron ${subidas} oraciones a Firebase Firestore.`, 'exito');
    } catch (error) {
        console.error('Error al subir a Firebase:', error);
        mostrarBannerEstado(`❌ Error al subir: ${error.message}`, 'alerta');
    }
}

// Exportar catálogo como archivo JSON
function exportarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaOraciones, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `oraciones_liturgia_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}
