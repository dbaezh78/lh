/**
 * lecturabreve-manager.js
 * Controlador del Gestor de Lectura Breve y Responsorio Breve (lecturabreve.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Lecturas y Responsorios
 * Precarga el catálogo canónico desde src/data/db-lecturabreve.js
 * Sincroniza con localStorage ('lh_lecturabreve_cache') y Firebase Firestore.
 */

import { CATALOGO_LECTURAS_SEED } from '../data/db-lecturabreve.js';

let listaLecturas = [];
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

// Cargar datos: primero desde Firestore/localStorage, con respaldo de db-lecturabreve.js
async function cargarDatos() {
    mostrarBannerEstado('Cargando lecturas breves y responsorios...', 'info');

    // 1. Probar desde Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "lecturas_breves"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 5) {
                    listaLecturas = desdeFb;
                    localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));
                    mostrarBannerEstado(`✅ Se cargaron ${listaLecturas.length} lecturas breves desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para lecturas breves:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_lecturabreve_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 5) {
                listaLecturas = parsed;
                mostrarBannerEstado(`📂 Cargadas ${listaLecturas.length} lecturas breves desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback al catálogo semilla canónico
    if (Array.isArray(CATALOGO_LECTURAS_SEED) && CATALOGO_LECTURAS_SEED.length > 0) {
        listaLecturas = [...CATALOGO_LECTURAS_SEED];
        localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));
        mostrarBannerEstado(`✨ Cargadas las ${listaLecturas.length} lecturas canónicas desde el catálogo base.`, 'exito');
        return;
    }

    listaLecturas = [];
    mostrarBannerEstado('No hay lecturas registradas. Agrega una nueva con el formulario.', 'alerta');
}

// Configurar listeners de la interfaz
function configurarEventos() {
    // Botón Restaurar Catálogo Base
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_LECTURAS_SEED) || CATALOGO_LECTURAS_SEED.length === 0) {
            alert('El catálogo de lecturas no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer las ${CATALOGO_LECTURAS_SEED.length} lecturas breves originales?`)) return;
        listaLecturas = [...CATALOGO_LECTURAS_SEED];
        localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));
        renderizarLista();
        mostrarBannerEstado(`🔄 Se restauraron las ${listaLecturas.length} lecturas del catálogo base.`, 'exito');
    });

    const form = document.getElementById('form-lectura');
    if (form) {
        form.addEventListener('submit', guardarLectura);

        // Actualizar Live Preview en tiempo real al escribir
        ['form-cita', 'form-texto', 'form-rb1', 'form-rb2', 'form-rb3'].forEach(id => {
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
    document.getElementById('filtro-buscar')?.addEventListener('input', renderizarLista);
    document.getElementById('filtro-tiempo')?.addEventListener('change', renderizarLista);
    document.getElementById('filtro-dia')?.addEventListener('change', renderizarLista);
}

// Actualizar la vista previa fiel en tiempo real
function actualizarLivePreview() {
    const cita = document.getElementById('form-cita')?.value.trim() || 'Is 61, 1-2a';
    const texto = document.getElementById('form-texto')?.value.trim() || 
        'El Espíritu del Señor está sobre mí, porque el Señor me ha ungido. Me ha enviado para dar la buena noticia a los pobres, para vendar los corazones desgarrados, para proclamar la amnistía a los cautivos, la libertad a los prisioneros, para proclamar el año de gracia del Señor.';
    const rb1 = document.getElementById('form-rb1')?.value.trim() || 'Cristo, Hijo de Dios vivo, ten piedad de nosotros.';
    const rb2 = document.getElementById('form-rb2')?.value.trim() || 'Tú que hoy te has manifestado.';
    const rb3 = document.getElementById('form-rb3')?.value.trim() || 'Ten piedad de nosotros.';

    const elCita = document.getElementById('preview-cita');
    const elTexto = document.getElementById('preview-texto');
    const elV1 = document.getElementById('preview-v1');
    const elR1 = document.getElementById('preview-r1');
    const elV2 = document.getElementById('preview-v2');
    const elR2 = document.getElementById('preview-r2');
    const elR3 = document.getElementById('preview-r3');

    if (elCita) elCita.textContent = cita;
    if (elTexto) elTexto.textContent = texto;
    if (elV1) elV1.textContent = rb1;
    if (elR1) elR1.textContent = rb1;
    if (elV2) elV2.textContent = rb2;
    if (elR2) elR2.textContent = rb3;
    if (elR3) elR3.textContent = rb1; // Se repite la respuesta principal
}

// Guardar lectura breve y responsorio
async function guardarLectura(e) {
    e.preventDefault();

    const id = document.getElementById('form-id').value.trim();
    const tiempo = document.getElementById('form-tiempo').value;
    const semana = document.getElementById('form-semana').value;
    const dia = document.getElementById('form-dia').value;
    const libro = document.getElementById('form-libro').value;
    const cita = document.getElementById('form-cita').value.trim();
    const texto = document.getElementById('form-texto').value.trim();
    const rb1 = document.getElementById('form-rb1').value.trim();
    const rb2 = document.getElementById('form-rb2').value.trim();
    const rb3 = document.getElementById('form-rb3').value.trim();

    if (!id || !cita || !texto || !rb1) {
        alert('Por favor complete los campos requeridos (ID, Cita, Texto y Responsorio Principal).');
        return;
    }

    const nuevoItem = {
        id,
        varName: id,
        tiempo,
        semana,
        dia,
        libro,
        cita,
        texto,
        rb1,
        rb2,
        rb3,
        actualizadoEn: new Date().toISOString()
    };

    // Actualizar o añadir a lista local
    const idx = listaLecturas.findIndex(l => l.id === id);
    if (idx >= 0) {
        listaLecturas[idx] = nuevoItem;
        mostrarBannerEstado(`💾 Lectura '${cita}' (${id}) actualizada localmente.`, 'exito');
    } else {
        listaLecturas.unshift(nuevoItem);
        mostrarBannerEstado(`✨ Lectura '${cita}' (${id}) registrada exitosamente.`, 'exito');
    }

    localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));

    // Guardar en Firestore si está conectado
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "lecturas_breves", id), nuevoItem, { merge: true });
        }
    } catch (fbErr) {
        console.warn('No se pudo sincronizar inmediatamente con Firestore:', fbErr);
    }

    limpiarFormulario();
    renderizarLista();
}

// Limpiar formulario y reiniciar campos a valores por defecto
function limpiarFormulario() {
    editandoId = null;
    const form = document.getElementById('form-lectura');
    if (form) form.reset();

    const inputId = document.getElementById('form-id');
    if (inputId) {
        inputId.disabled = false;
        inputId.value = '';
    }

    const btnSubmit = form?.querySelector('button[type="submit"]');
    if (btnSubmit) {
        btnSubmit.innerHTML = `<span class="material-symbols-outlined">save</span> Guardar Lectura y Responsorio`;
    }

    actualizarLivePreview();
}

// Cargar item en formulario para edición
function editarLectura(id) {
    const item = listaLecturas.find(l => l.id === id);
    if (!item) return;

    editandoId = id;

    const inputId = document.getElementById('form-id');
    if (inputId) {
        inputId.value = item.id;
        inputId.disabled = true;
    }

    if (document.getElementById('form-tiempo')) document.getElementById('form-tiempo').value = item.tiempo || 'ordinario';
    if (document.getElementById('form-semana')) document.getElementById('form-semana').value = item.semana || '1';
    if (document.getElementById('form-dia')) document.getElementById('form-dia').value = item.dia || 'domingo';
    if (document.getElementById('form-libro')) document.getElementById('form-libro').value = item.libro || 'laudes';
    if (document.getElementById('form-cita')) document.getElementById('form-cita').value = item.cita || '';
    if (document.getElementById('form-texto')) document.getElementById('form-texto').value = item.texto || '';
    if (document.getElementById('form-rb1')) document.getElementById('form-rb1').value = item.rb1 || '';
    if (document.getElementById('form-rb2')) document.getElementById('form-rb2').value = item.rb2 || '';
    if (document.getElementById('form-rb3')) document.getElementById('form-rb3').value = item.rb3 || '';

    const btnSubmit = document.querySelector('#form-lectura button[type="submit"]');
    if (btnSubmit) {
        btnSubmit.innerHTML = `<span class="material-symbols-outlined">edit</span> Actualizar Lectura`;
    }

    actualizarLivePreview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Eliminar lectura
async function eliminarLectura(id) {
    if (!confirm(`¿Eliminar la lectura con ID '${id}'?`)) return;

    listaLecturas = listaLecturas.filter(l => l.id !== id);
    localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "lecturas_breves", id));
        }
    } catch (fbErr) {
        console.warn('Error al eliminar de Firestore:', fbErr);
    }

    mostrarBannerEstado(`🗑️ Lectura '${id}' eliminada.`, 'alerta');
    if (editandoId === id) limpiarFormulario();
    renderizarLista();
}

// Renderizar la lista del catálogo
function renderizarLista() {
    const contenedor = document.getElementById('lista-lecturas-items');
    const contador = document.getElementById('contador-lecturas');
    if (!contenedor) return;

    const textoBuscar = (document.getElementById('filtro-buscar')?.value || '').toLowerCase().trim();
    const filtroTiempo = document.getElementById('filtro-tiempo')?.value || '';
    const filtroDia = document.getElementById('filtro-dia')?.value || '';

    const filtrados = listaLecturas.filter(l => {
        const cita = (l.cita || '').toLowerCase();
        const texto = (l.texto || '').toLowerCase();
        const rb1 = (l.rb1 || '').toLowerCase();
        const id = (l.id || '').toLowerCase();

        const coincideBusqueda = !textoBuscar || cita.includes(textoBuscar) || texto.includes(textoBuscar) || rb1.includes(textoBuscar) || id.includes(textoBuscar);
        const coincideTiempo = !filtroTiempo || l.tiempo === filtroTiempo;
        const coincideDia = !filtroDia || l.dia === filtroDia;

        return coincideBusqueda && coincideTiempo && coincideDia;
    });

    if (contador) contador.textContent = filtrados.length;

    contenedor.innerHTML = '';
    if (filtrados.length === 0) {
        contenedor.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); padding: 40px 10px;">
                <span class="material-symbols-outlined" style="font-size: 3rem; opacity: 0.4;">auto_stories</span>
                <p style="margin-top: 8px;">No se encontraron lecturas breves con los filtros seleccionados.</p>
            </div>
        `;
        return;
    }

    filtrados.forEach(item => {
        const card = document.createElement('div');
        card.className = `item-lectura-card ${editandoId === item.id ? 'activo' : ''}`;
        card.innerHTML = `
            <div class="item-header">
                <span class="item-cita">${item.cita || item.id}</span>
                <span class="item-badge-tiempo">${(item.tiempo || 'ordinario').toUpperCase()} • S${item.semana || '1'} • ${item.dia || ''}</span>
            </div>
            <div class="item-snippet">${item.texto || ''}</div>
            <div class="item-rb-refrain">V/R: ${item.rb1 || 'Sin responsorio'}</div>
            <div class="item-acciones">
                <button class="btn-mini-accion btn-editar" data-id="${item.id}">
                    <span class="material-symbols-outlined" style="font-size: 16px;">edit</span> Cargar
                </button>
                <button class="btn-mini-accion eliminar btn-eliminar" data-id="${item.id}">
                    <span class="material-symbols-outlined" style="font-size: 16px;">delete</span> Eliminar
                </button>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-eliminar')) {
                eliminarLectura(item.id);
            } else {
                editarLectura(item.id);
            }
        });

        contenedor.appendChild(card);
    });
}

// Subir todo el catálogo actual a Firebase Firestore
async function subirAFirebase() {
    if (listaLecturas.length === 0) {
        alert('No hay lecturas cargadas para subir.');
        return;
    }

    if (!confirm(`¿Subir los ${listaLecturas.length} registros a la colección 'lecturas_breves' de Firebase Firestore?`)) return;

    const btn = document.getElementById('btn-subir-semilla');
    const txtOriginal = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined" style="animation: spinUpdateIcon 1s linear infinite;">sync</span> Subiendo...`;
    }

    try {
        if (!window.firebaseAPI || !window.firebaseAPI.db) {
            throw new Error('Firebase no está inicializado.');
        }

        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        let subidos = 0;
        for (const lectura of listaLecturas) {
            if (lectura.id) {
                await setDoc(doc(window.firebaseAPI.db, "lecturas_breves", lectura.id), lectura, { merge: true });
                subidos++;
            }
        }
        mostrarBannerEstado(`🚀 ¡Éxito! Se subieron ${subidos} lecturas y responsorios a Firebase Firestore.`, 'exito');
    } catch (err) {
        console.error('Error al subir a Firebase:', err);
        mostrarBannerEstado(`❌ Error al subir a Firebase: ${err.message}`, 'alerta');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = txtOriginal;
        }
    }
}

// Exportar catálogo como JSON
function exportarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaLecturas, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `lecturas_breves_backup_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
}
