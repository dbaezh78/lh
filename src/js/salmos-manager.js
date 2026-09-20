/**
 * salmos-manager.js
 * Controlador del Gestor de Salmos Litúrgicos (salmos.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Salmos y Cánticos
 * Precarga automáticamente el catálogo completo desde src/data/salmos.js
 * Sincroniza con localStorage ('lh_salmos_cache') y Firebase Firestore.
 */

let listaSalmos = [];
let editandoId = null;

const GLORIA_PATRI = "Gloria al Padre, y al Hijo, y al Espíritu Santo.\nComo era en el principio, ahora y siempre, por los siglos de los siglos. Amén.";

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

// Cargar datos: primero desde Firestore/localStorage, con respaldo inicial de SalmosDB (salmos.js)
async function cargarDatos() {
    mostrarBannerEstado('Cargando salmos...', 'info');

    // 1. Probar desde Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "salmos"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length > 0) {
                    listaSalmos = desdeFb;
                    localStorage.setItem('lh_salmos_cache', JSON.stringify(listaSalmos));
                    mostrarBannerEstado(`✅ Se cargaron ${listaSalmos.length} salmos desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para salmos:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_salmos_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            // Si la caché tiene más de 5 salmos, considerarla poblada
            if (Array.isArray(parsed) && parsed.length > 5) {
                listaSalmos = parsed;
                mostrarBannerEstado(`📂 Cargados ${listaSalmos.length} salmos desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Cargar catálogo completo desde SalmosDB (src/data/salmos.js)
    if (window.SalmosDB && typeof window.SalmosDB.listar === 'function') {
        const semilla = window.SalmosDB.listar();
        if (Array.isArray(semilla) && semilla.length > 0) {
            listaSalmos = semilla.map(s => ({
                id: s.id,
                titulo: s.titulo || s.id,
                tipo: s.tipo || (s.id.startsWith('salmo') ? 'salmo' : 'cantico'),
                texto: s.texto || ''
            }));
            localStorage.setItem('lh_salmos_cache', JSON.stringify(listaSalmos));
            mostrarBannerEstado(`✨ Cargado catálogo base completo (${listaSalmos.length} salmos y cánticos).`, 'exito');
            return;
        }
    }

    listaSalmos = [];
    mostrarBannerEstado('No hay salmos cargados. Agrega uno nuevo con el formulario.', 'alerta');
}

// Configurar listeners de la interfaz
function configurarEventos() {
    // Botón Restaurar Catálogo Base desde salmos.js
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!window.SalmosDB || typeof window.SalmosDB.listar !== 'function') {
            alert('El archivo salmos.js no está disponible en este momento.');
            return;
        }
        const semilla = window.SalmosDB.listar();
        if (Array.isArray(semilla) && semilla.length > 0) {
            listaSalmos = semilla.map(s => ({
                id: s.id,
                titulo: s.titulo || s.id,
                tipo: s.tipo || (s.id.startsWith('salmo') ? 'salmo' : 'cantico'),
                texto: s.texto || ''
            }));
            localStorage.setItem('lh_salmos_cache', JSON.stringify(listaSalmos));
            renderizarLista();
            mostrarBannerEstado(`🔄 Se restauraron los ${listaSalmos.length} salmos del catálogo base.`, 'exito');
        }
    });
    const form = document.getElementById('form-salmo');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarSalmo();
        });
    }

    // Botón Limpiar
    document.getElementById('btn-limpiar-form')?.addEventListener('click', limpiarFormulario);

    // Botón "+ Gloria al Padre"
    document.getElementById('btn-add-gloria')?.addEventListener('click', () => {
        const txt = document.getElementById('form-texto');
        if (txt) {
            const contenido = txt.value.trim();
            if (!contenido.includes("Gloria al Padre")) {
                txt.value = contenido ? `${contenido}\n\n${GLORIA_PATRI}` : GLORIA_PATRI;
            }
        }
    });

    // Botón "+ Aleluya."
    document.getElementById('btn-add-aleluya')?.addEventListener('click', () => {
        const txt = document.getElementById('form-texto');
        if (txt) {
            txt.value = txt.value.trim().replace(/\.*$/, '') + '. Aleluya.';
        }
    });

    // Filtros de búsqueda
    document.getElementById('filtro-buscar')?.addEventListener('input', renderizarLista);
    document.getElementById('filtro-tipo')?.addEventListener('change', renderizarLista);

    // Subir a Firebase en lote
    document.getElementById('btn-subir-semilla')?.addEventListener('click', async () => {
        if (!confirm(`¿Deseas subir todos los ${listaSalmos.length} salmos a Firebase Firestore (colección 'salmos')?`)) return;
        mostrarBannerEstado('Subiendo salmos a Firestore...', 'info');

        try {
            if (window.firebaseAPI && window.firebaseAPI.db) {
                const { doc, writeBatch } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
                const batch = writeBatch(window.firebaseAPI.db);
                listaSalmos.forEach(item => {
                    const docRef = doc(window.firebaseAPI.db, "salmos", item.id);
                    batch.set(docRef, item, { merge: true });
                });
                await batch.commit();
                mostrarBannerEstado(`🎉 ¡Éxito! Se sincronizaron ${listaSalmos.length} salmos en Firestore.`, 'exito');
            } else {
                alert('Firebase API no está configurada.');
            }
        } catch (e) {
            mostrarBannerEstado(`❌ Error al subir: ${e.message}`, 'alerta');
        }
    });

    // Exportar JSON
    document.getElementById('btn-exportar-json')?.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaSalmos, null, 2));
        const dl = document.createElement('a');
        dl.setAttribute("href", dataStr);
        dl.setAttribute("download", `salmos_backup_${new Date().toISOString().split('T')[0]}.json`);
        dl.click();
    });

    // Exportar respaldo en JS
    document.getElementById('btn-exportar-js')?.addEventListener('click', () => {
        const jsCode = `// Respaldo de Salmos Litúrgicos generado el ${new Date().toLocaleString()}\nexport const CATALOGO_SALMOS_SEED = ${JSON.stringify(listaSalmos, null, 2)};\n`;
        const blob = new Blob([jsCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const dl = document.createElement('a');
        dl.setAttribute("href", url);
        dl.setAttribute("download", `salmos-seed-${new Date().toISOString().split('T')[0]}.js`);
        dl.click();
    });
}

// Guardar o Actualizar un Salmo
async function guardarSalmo() {
    const inputId = document.getElementById('form-id');
    const inputTitulo = document.getElementById('form-titulo');
    const inputTipo = document.getElementById('form-tipo');
    const inputTexto = document.getElementById('form-texto');

    const id = inputId.value.trim().replace(/\s+/g, '_');
    const titulo = inputTitulo.value.trim();
    const tipo = inputTipo.value;
    const texto = inputTexto.value.trim();

    if (!id || !titulo || !texto) {
        alert('Por favor completa todos los campos (ID, Título y Texto).');
        return;
    }

    const salmoObjeto = {
        id,
        titulo,
        tipo,
        texto,
        actualizadoEn: new Date().toISOString()
    };

    const indice = listaSalmos.findIndex(s => s.id === id);
    if (indice >= 0) {
        listaSalmos[indice] = salmoObjeto;
    } else {
        listaSalmos.unshift(salmoObjeto);
    }

    // Persistir localmente
    localStorage.setItem('lh_salmos_cache', JSON.stringify(listaSalmos));

    // Persistir en Firestore si hay conexión
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "salmos", id), salmoObjeto, { merge: true });
        }
    } catch (e) {
        console.warn('Aviso: guardado localmente, error en Firebase:', e);
    }

    mostrarBannerEstado(`✅ Salmo «${titulo}» guardado con éxito.`, 'exito');
    limpiarFormulario();
    renderizarLista();
}

// Cargar un salmo en el formulario para editar
window.editarSalmo = function(id) {
    const s = listaSalmos.find(item => item.id === id);
    if (!s) return;

    document.getElementById('form-id').value = s.id || '';
    document.getElementById('form-titulo').value = s.titulo || '';
    document.getElementById('form-tipo').value = s.tipo || 'salmo';
    document.getElementById('form-texto').value = s.texto || '';

    editandoId = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('form-titulo').focus();
};

// Eliminar un salmo
window.eliminarSalmo = async function(id) {
    const s = listaSalmos.find(item => item.id === id);
    if (!s) return;
    if (!confirm(`¿Estás seguro de eliminar el salmo «${s.titulo}»?`)) return;

    listaSalmos = listaSalmos.filter(item => item.id !== id);
    localStorage.setItem('lh_salmos_cache', JSON.stringify(listaSalmos));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "salmos", id));
        }
    } catch (e) {
        console.warn('Error eliminando en Firebase:', e);
    }

    mostrarBannerEstado(`Salmo «${s.titulo}» eliminado.`, 'alerta');
    renderizarLista();
};

// Copiar texto del salmo al portapapeles
window.copiarTextoSalmo = async function(id) {
    const s = listaSalmos.find(item => item.id === id);
    if (!s) return;

    try {
        const textoCompleto = `${s.titulo}\n\n${s.texto}`;
        await navigator.clipboard.writeText(textoCompleto);
        mostrarBannerEstado(`📋 Salmo «${s.titulo}» copiado al portapapeles.`, 'exito');
    } catch (e) {
        alert('Copiado: ' + s.titulo);
    }
};

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('form-salmo')?.reset();
    editandoId = null;
}

// Renderizar lista filtrada
function renderizarLista() {
    const contenedor = document.getElementById('lista-salmos-items');
    const contador = document.getElementById('contador-salmos');
    const query = document.getElementById('filtro-buscar')?.value.toLowerCase().trim() || '';
    const filtroTipo = document.getElementById('filtro-tipo')?.value || '';

    if (!contenedor) return;

    let filtrados = listaSalmos.filter(item => {
        if (filtroTipo && item.tipo !== filtroTipo) return false;
        if (query) {
            const matchId = (item.id || '').toLowerCase().includes(query);
            const matchTitulo = (item.titulo || '').toLowerCase().includes(query);
            const matchTexto = (item.texto || '').toLowerCase().includes(query);
            return matchId || matchTitulo || matchTexto;
        }
        return true;
    });

    if (contador) contador.textContent = `${filtrados.length} de ${listaSalmos.length}`;

    if (filtrados.length === 0) {
        contenedor.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 40px;">No se encontraron salmos con los filtros aplicados.</div>`;
        return;
    }

    const mapaClasesTipo = {
        invitatorio: 'tipo-invitatorio',
        salmo: 'tipo-salmo',
        cantico: 'tipo-cantico',
        cantico_at: 'tipo-cantico',
        cantico_nt: 'tipo-cantico',
        cantico_evangelico: 'tipo-cantico'
    };

    contenedor.innerHTML = filtrados.map(s => {
        const claseTipo = mapaClasesTipo[s.tipo] || 'tipo-salmo';
        return `
            <div class="item-salmo-card" id="salmo-card-${s.id}">
                <div class="salmo-card-header">
                    <div>
                        <!-- TÍTULO EN ROJO -->
                        <h3 class="salmo-card-titulo">${escapeHTML(s.titulo)}</h3>
                        <div class="salmo-badges-row">
                            <span class="badge-salmo ${claseTipo}">${escapeHTML(s.tipo || 'salmo')}</span>
                            <span class="badge-salmo id-badge">ID: ${escapeHTML(s.id)}</span>
                        </div>
                    </div>
                    <div class="salmo-card-acciones">
                        <button type="button" class="btn-icono-card" title="Copiar texto del salmo" onclick="window.copiarTextoSalmo('${s.id}')">
                            <span class="material-symbols-outlined" style="font-size: 16px;">content_copy</span>
                        </button>
                        <button type="button" class="btn-icono-card" title="Editar en el formulario" onclick="window.editarSalmo('${s.id}')">
                            <span class="material-symbols-outlined" style="font-size: 16px;">edit</span>
                        </button>
                        <button type="button" class="btn-icono-card btn-delete" title="Eliminar salmo" onclick="window.eliminarSalmo('${s.id}')">
                            <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
                        </button>
                    </div>
                </div>
                <!-- TEXTO DEL SALMO EN TEXTO PLANO Y EN NEGRO -->
                <div class="salmo-card-cuerpo">${escapeHTML(s.texto || '')}</div>
            </div>
        `;
    }).join('');
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}
