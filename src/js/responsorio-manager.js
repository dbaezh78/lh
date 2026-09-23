/**
 * responsorio-manager.js
 * Controlador del Gestor de Responsorios Litúrgicos (responsorio.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Versículos/Responsorios de la Salmodia (Oficio).
 * Precarga el catálogo canónico desde src/data/db-responsorios.js
 * Sincroniza con localStorage ('lh_responsorios_cache') y Firebase Firestore ('responsorios').
 */

import { CATALOGO_RESPONSORIOS_SEED } from '../data/db-responsorios.js';

let listaResponsorios = [];
let editandoId = null;

document.addEventListener('DOMContentLoaded', async () => {
    configurarEventos();
    await cargarDatos();
    renderizarLista();
    actualizarLivePreview();
});

// Mostrar notificaciones en la interfaz
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

// Cargar datos: primero Firestore/localStorage, con respaldo en db-responsorios.js
async function cargarDatos() {
    mostrarBannerEstado('Cargando catálogo de responsorios...', 'info');

    // 1. Probar desde Firestore
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "responsorios"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 3) {
                    listaResponsorios = desdeFb;
                    localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));
                    mostrarBannerEstado(`✅ Se cargaron ${listaResponsorios.length} responsorios desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para responsorios:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_responsorios_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 3) {
                listaResponsorios = parsed;
                mostrarBannerEstado(`📂 Cargados ${listaResponsorios.length} responsorios desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback a semilla canónica
    if (Array.isArray(CATALOGO_RESPONSORIOS_SEED) && CATALOGO_RESPONSORIOS_SEED.length > 0) {
        listaResponsorios = [...CATALOGO_RESPONSORIOS_SEED];
        localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));
        mostrarBannerEstado(`✨ Cargados los ${listaResponsorios.length} responsorios canónicos desde el catálogo base.`, 'exito');
        return;
    }

    listaResponsorios = [];
    mostrarBannerEstado('No hay responsorios registrados. Agrega uno nuevo con el formulario.', 'alerta');
}

// Configuración de eventos
function configurarEventos() {
    // Restaurar semilla
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_RESPONSORIOS_SEED) || CATALOGO_RESPONSORIOS_SEED.length === 0) {
            alert('El catálogo base de responsorios no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer los ${CATALOGO_RESPONSORIOS_SEED.length} responsorios originales del catálogo base?`)) return;
        listaResponsorios = [...CATALOGO_RESPONSORIOS_SEED];
        localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));
        renderizarLista();
        limpiarFormulario();
        mostrarBannerEstado(`🔄 Se restauraron los ${listaResponsorios.length} responsorios del catálogo base.`, 'exito');
    });

    // Subir a Firebase
    document.getElementById('btn-subir-semilla')?.addEventListener('click', subirAFirebase);

    // Exportar JSON
    document.getElementById('btn-exportar-json')?.addEventListener('click', () => {
        if (listaResponsorios.length === 0) {
            alert('No hay responsorios para exportar.');
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaResponsorios, null, 2));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", `responsorios_lh_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
        mostrarBannerEstado('💾 Respaldo JSON descargado correctamente.', 'exito');
    });

    // Formulario guardar
    document.getElementById('form-responsorio')?.addEventListener('submit', guardarResponsorio);
    document.getElementById('btn-limpiar-form')?.addEventListener('click', limpiarFormulario);

    // Live preview en inputs
    const inputsLive = ['form-id', 'form-v', 'form-r', 'form-tiempo', 'form-semana', 'form-dia', 'form-libro'];
    inputsLive.forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => {
            if (id === 'form-tiempo' || id === 'form-semana' || id === 'form-dia') {
                if (!editandoId) autogenerarIdYTitulo();
            }
            actualizarLivePreview();
        });
        document.getElementById(id)?.addEventListener('change', () => {
            if (id === 'form-tiempo' || id === 'form-semana' || id === 'form-dia') {
                if (!editandoId) autogenerarIdYTitulo();
            }
            actualizarLivePreview();
        });
    });

    // Filtros de tabla
    document.getElementById('filtro-busqueda')?.addEventListener('input', renderizarLista);
    document.getElementById('filtro-tiempo')?.addEventListener('change', renderizarLista);
    document.getElementById('filtro-dia')?.addEventListener('change', renderizarLista);
}

// Generar ID sugerido según tiempo, semana y día
function autogenerarIdYTitulo() {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const semana = document.getElementById('form-semana')?.value || '1';
    const dia = document.getElementById('form-dia')?.value || 'domingo';
    const libro = document.getElementById('form-libro')?.value || 'oficio';

    const tMap = { ordinario: 'tos', adviento: 'tav', navidad: 'tna', cuaresma: 'tcu', pascua: 'tps', santos: 'san' };
    const dMap = { domingo: 'do', lunes: 'lu', martes: 'ma', miercoles: 'mi', jueves: 'ju', viernes: 'vi', sabado: 'sa' };
    const lMap = { oficio: 'OF', laudes: 'LA', visperas: 'VI' };

    const prefijo = tMap[tiempo] || 'tos';
    const diaCod = dMap[dia] || 'do';
    const horaCod = lMap[libro] || 'OF';

    const idSugerido = `${prefijo}${semana}${horaCod}${diaCod}_resp`;
    const inputId = document.getElementById('form-id');
    if (inputId && !editandoId) {
        inputId.value = idSugerido;
    }

    const inputTitulo = document.getElementById('form-titulo');
    if (inputTitulo && !editandoId) {
        const diaNombre = dia.charAt(0).toUpperCase() + dia.slice(1);
        const tiempoNombre = tiempo.charAt(0).toUpperCase() + tiempo.slice(1);
        inputTitulo.value = `Responsorio de la Salmodia - ${diaNombre} Semana ${semana} (${tiempoNombre})`;
    }
}

// Actualizar vista previa en tiempo real
function actualizarLivePreview() {
    const id = document.getElementById('form-id')?.value || 'resp_demo';
    const v = document.getElementById('form-v')?.value.trim() || 'Éste es mi Hijo amado.';
    const r = document.getElementById('form-r')?.value.trim() || 'Escuchadlo.';

    const badge = document.getElementById('preview-id-badge');
    if (badge) badge.textContent = id;

    const elV = document.getElementById('preview-v');
    if (elV) elV.textContent = v;

    const elR = document.getElementById('preview-r');
    if (elR) elR.textContent = r;
}

// Renderizar la tabla de responsorios
function renderizarLista() {
    const cuerpo = document.getElementById('cuerpo-tabla-responsorios');
    const contador = document.getElementById('contador-responsorios');
    if (!cuerpo) return;

    const query = (document.getElementById('filtro-busqueda')?.value || '').toLowerCase().trim();
    const fTiempo = document.getElementById('filtro-tiempo')?.value || 'todos';
    const fDia = document.getElementById('filtro-dia')?.value || 'todos';

    const filtrados = listaResponsorios.filter(item => {
        if (fTiempo !== 'todos' && item.tiempo !== fTiempo) return false;
        if (fDia !== 'todos' && item.dia !== fDia) return false;
        if (!query) return true;

        const idMatch = (item.id || '').toLowerCase().includes(query);
        const titMatch = (item.titulo || '').toLowerCase().includes(query);
        const vMatch = (item.v || '').toLowerCase().includes(query);
        const rMatch = (item.r || '').toLowerCase().includes(query);
        return idMatch || titMatch || vMatch || rMatch;
    });

    if (contador) {
        contador.textContent = `(${filtrados.length} de ${listaResponsorios.length})`;
    }

    if (filtrados.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 24px;">No se encontraron responsorios con los filtros seleccionados.</td></tr>`;
        return;
    }

    cuerpo.innerHTML = filtrados.map(item => {
        const esActivo = editandoId === item.id ? 'class="fila-activa"' : '';
        const diaNombre = (item.dia || '').charAt(0).toUpperCase() + (item.dia || '').slice(1);
        const resumenVR = `<strong>V.</strong> ${item.v || ''}<br><strong>R.</strong> ${item.r || ''}`;
        return `
            <tr ${esActivo}>
                <td><code class="badge-id">${item.id}</code></td>
                <td><strong>${item.titulo || item.id}</strong></td>
                <td>${diaNombre} (Sem. ${item.semana || '1'})</td>
                <td><div style="max-height: 48px; overflow: hidden; font-size: 0.82rem; line-height: 1.3;">${resumenVR}</div></td>
                <td>
                    <div class="celda-acciones">
                        <button class="btn-accion-icono btn-editar" data-id="${item.id}" title="Editar">
                            <span class="material-symbols-outlined" style="font-size: 1.15rem;">edit</span>
                        </button>
                        <button class="btn-accion-icono btn-borrar" data-id="${item.id}" title="Eliminar">
                            <span class="material-symbols-outlined" style="font-size: 1.15rem;">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Listeners de botones de fila
    cuerpo.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => editarResponsorio(btn.dataset.id));
    });

    cuerpo.querySelectorAll('.btn-borrar').forEach(btn => {
        btn.addEventListener('click', () => eliminarResponsorio(btn.dataset.id));
    });
}

// Guardar o actualizar responsorio
async function guardarResponsorio(e) {
    e.preventDefault();

    const id = document.getElementById('form-id')?.value.trim();
    const titulo = document.getElementById('form-titulo')?.value.trim();
    const tiempo = document.getElementById('form-tiempo')?.value;
    const semana = document.getElementById('form-semana')?.value;
    const dia = document.getElementById('form-dia')?.value;
    const libro = document.getElementById('form-libro')?.value || 'oficio';
    const v = document.getElementById('form-v')?.value.trim();
    const r = document.getElementById('form-r')?.value.trim();

    if (!id || !v || !r) {
        alert('Por favor completa el ID, el Versículo (V) y la Respuesta (R).');
        return;
    }

    const nuevoObj = {
        id,
        varName: id,
        titulo: titulo || id,
        tiempo,
        semana,
        dia,
        libro,
        v,
        r,
        actualizadoEn: new Date().toISOString()
    };

    const idx = listaResponsorios.findIndex(x => x.id === id);
    if (idx >= 0) {
        listaResponsorios[idx] = nuevoObj;
    } else {
        listaResponsorios.push(nuevoObj);
    }

    // Persistir localmente
    localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));

    // Guardar en Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "responsorios", id), nuevoObj);
        }
    } catch (err) {
        console.warn('Error al guardar en Firestore:', err);
    }

    mostrarBannerEstado(`✅ Responsorio "${id}" guardado exitosamente.`, 'exito');
    limpiarFormulario();
    renderizarLista();
}

// Editar responsorio existente
function editarResponsorio(id) {
    const item = listaResponsorios.find(x => x.id === id);
    if (!item) return;

    editandoId = id;

    const setVal = (elId, val) => {
        const el = document.getElementById(elId);
        if (el && val !== undefined) el.value = val;
    };

    setVal('form-id', item.id);
    setVal('form-titulo', item.titulo || '');
    setVal('form-tiempo', item.tiempo || 'ordinario');
    setVal('form-semana', item.semana || '1');
    setVal('form-dia', item.dia || 'domingo');
    setVal('form-libro', item.libro || 'oficio');
    setVal('form-v', item.v || '');
    setVal('form-r', item.r || '');

    const tituloForm = document.getElementById('titulo-formulario');
    if (tituloForm) {
        tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-gold);">edit</span> Editando: ${item.id}`;
    }

    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) {
        btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Actualizar Responsorio`;
    }

    document.getElementById('form-id')?.setAttribute('readonly', 'true');
    actualizarLivePreview();
    renderizarLista();
}

// Eliminar responsorio
async function eliminarResponsorio(id) {
    if (!confirm(`¿Estás seguro de eliminar el responsorio "${id}"?`)) return;

    listaResponsorios = listaResponsorios.filter(x => x.id !== id);
    localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "responsorios", id));
        }
    } catch (err) {
        console.warn('Error al borrar de Firestore:', err);
    }

    if (editandoId === id) limpiarFormulario();
    renderizarLista();
    mostrarBannerEstado(`🗑️ Responsorio "${id}" eliminado.`, 'info');
}

// Limpiar formulario y reiniciar estado
function limpiarFormulario() {
    editandoId = null;
    const form = document.getElementById('form-responsorio');
    if (form) form.reset();

    document.getElementById('form-id')?.removeAttribute('readonly');

    const tituloForm = document.getElementById('titulo-formulario');
    if (tituloForm) {
        tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-red);">edit_note</span> Nuevo Responsorio`;
    }

    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) {
        btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Guardar Responsorio`;
    }

    autogenerarIdYTitulo();
    actualizarLivePreview();
}

// Subir todo el catálogo a Firebase
async function subirAFirebase() {
    if (listaResponsorios.length === 0) {
        alert('No hay responsorios para subir.');
        return;
    }
    if (!window.firebaseAPI || !window.firebaseAPI.db) {
        alert('Firebase no está disponible en este momento.');
        return;
    }
    if (!confirm(`¿Deseas sincronizar todos los ${listaResponsorios.length} responsorios en Firestore ("responsorios")?`)) return;

    mostrarBannerEstado(`Subiendo ${listaResponsorios.length} responsorios a Firebase...`, 'info');

    try {
        const { doc, writeBatch } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        const batch = writeBatch(window.firebaseAPI.db);

        listaResponsorios.forEach(item => {
            const docRef = doc(window.firebaseAPI.db, "responsorios", item.id);
            batch.set(docRef, item, { merge: true });
        });

        await batch.commit();
        mostrarBannerEstado(`✨ ¡Éxito! ${listaResponsorios.length} responsorios sincronizados en Firestore.`, 'exito');
    } catch (e) {
        console.error('Error al subir catálogo de responsorios a Firebase:', e);
        mostrarBannerEstado('❌ Error al subir a Firebase. Consulta la consola.', 'alerta');
    }
}
