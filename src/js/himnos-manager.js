/**
 * himnos-manager.js
 * Controlador del Gestor de Himnos Litúrgicos (himno.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Himnos
 * Precarga automáticamente el catálogo completo desde src/data/himnos.js / src/data/db-himnos.js
 * Sincroniza con localStorage ('lh_himnos_cache') y Firebase Firestore.
 */

import { CATALOGO_HIMNOS_SEED } from '../data/db-himnos.js';

let listaHimnos = [];
let editandoId = null;

document.addEventListener('DOMContentLoaded', async () => {
    configurarEventos();
    await cargarDatos();
    renderizarLista();
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
                    listaHimnos = desdeFb;
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
                listaHimnos = parsed;
                mostrarBannerEstado(`📂 Cargados ${listaHimnos.length} himnos desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback al catálogo semilla completo (69 himnos de himnos.js)
    if (Array.isArray(CATALOGO_HIMNOS_SEED) && CATALOGO_HIMNOS_SEED.length > 0) {
        listaHimnos = [...CATALOGO_HIMNOS_SEED];
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
    const selectLibro = document.getElementById('form-libro');
    const textareaTexto = document.getElementById('form-texto');

    const id = inputId.value.trim();
    const titulo = inputTitulo.value.trim();
    const tiempo = selectTiempo.value || 'ordinario';
    const libro = selectLibro.value || 'laudes';
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
        libro,
        texto,
        tipo: 'himno',
        actualizadoEn: new Date().toISOString()
    };

    const indice = listaHimnos.findIndex(h => h.id === id);
    if (indice >= 0) {
        listaHimnos[indice] = himnoObjeto;
    } else {
        listaHimnos.unshift(himnoObjeto);
    }

    // Persistir localmente
    localStorage.setItem('lh_himnos_cache', JSON.stringify(listaHimnos));

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

    document.getElementById('form-id').value = h.id || '';
    document.getElementById('form-titulo').value = h.titulo || '';
    document.getElementById('form-tiempo').value = h.tiempo || 'ordinario';
    document.getElementById('form-libro').value = h.libro || 'laudes';
    document.getElementById('form-texto').value = h.texto || '';

    editandoId = id;
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
