// =========================================================================
// GESTOR DE COMPLETAS: EXAMEN DE CONCIENCIA Y BENDICIÓN (ecompletas-manager.js)
// =========================================================================

import { CompletasDB, CATALOGO_ECOMPLETAS_SEED, CLAVE_LOCAL_ECOMPLETAS } from '../data/db-ecompletas.js';

// Elementos del DOM
const selectTipoSeccion = document.getElementById('selectTipoSeccion');
const lblTipoAccion = document.getElementById('lblTipoAccion');
const txtTotalRegistros = document.getElementById('txtTotalRegistros');
const bannerEstado = document.getElementById('banner-estado');

const form = document.getElementById('form-ecompletas');
const formId = document.getElementById('form-id');
const formNombre = document.getElementById('form-nombre');

// Campos Examen
const bloqueExamen = document.getElementById('bloque-campos-examen');
const formTituloExamen = document.getElementById('form-titulo-examen');
const formMonicion = document.getElementById('form-monicion');
const formConfesion = document.getElementById('form-confesion');
const formVExamen = document.getElementById('form-v-examen');
const formRExamen = document.getElementById('form-r-examen');

// Campos Bendición
const bloqueBendicion = document.getElementById('bloque-campos-bendicion');
const formTituloBendicion = document.getElementById('form-titulo-bendicion');
const formVBendicion = document.getElementById('form-v-bendicion');
const formRBendicion = document.getElementById('form-r-bendicion');
const formTituloMariana = document.getElementById('form-titulo-mariana');
const formTextoMariana = document.getElementById('form-texto-mariana');

// Botones de acción
const btnGuardar = document.getElementById('btn-guardar');
const btnNuevo = document.getElementById('btn-nuevo');
const btnEliminar = document.getElementById('btn-eliminar');
const btnRestaurarSemilla = document.getElementById('btn-restaurar-semilla');
const btnSubirSemilla = document.getElementById('btn-subir-semilla');
const btnExportarJson = document.getElementById('btn-exportar-json');

// Vista Previa y Catálogo
const badgeTipoPreview = document.getElementById('badge-tipo-preview');
const previewContenido = document.getElementById('preview-contenido-dinamico');
const inputBuscar = document.getElementById('inputBuscar');
const tablaCuerpo = document.getElementById('tabla-registros-cuerpo');

let elementoActualId = null;

// Mensajes de estado
function mostrarBanner(mensaje, tipo = 'info', duracion = 4000) {
    if (!bannerEstado) return;
    bannerEstado.className = `estado-banner ${tipo}`;
    const icono = tipo === 'exito' ? 'check_circle' : (tipo === 'error' ? 'error' : 'info');
    bannerEstado.innerHTML = `<span class="material-symbols-outlined">${icono}</span> <span>${mensaje}</span>`;
    bannerEstado.style.display = 'flex';
    if (duracion > 0) {
        setTimeout(() => {
            bannerEstado.style.display = 'none';
        }, duracion);
    }
}

// Alternar entre Examen de Conciencia y Bendición
function cambiarTipoSeccion(tipo, limpiarFormulario = true) {
    const esExamen = (tipo === 'examen');
    if (bloqueExamen) bloqueExamen.style.display = esExamen ? 'block' : 'none';
    if (bloqueBendicion) bloqueBendicion.style.display = esExamen ? 'none' : 'block';

    if (badgeTipoPreview) {
        badgeTipoPreview.textContent = esExamen ? 'Examen de conciencia' : 'Bendición';
        badgeTipoPreview.className = `preview-badge-header ${esExamen ? 'examen' : 'bendicion'}`;
    }

    if (lblTipoAccion) {
        lblTipoAccion.textContent = esExamen ? 'Registrar Examen de Conciencia' : 'Registrar Bendición y Antífona Mariana';
    }

    if (limpiarFormulario) {
        resetearFormulario(tipo);
    } else {
        actualizarVistaPrevia();
    }
}

// Resetear formulario con plantilla por defecto según el tipo
function resetearFormulario(tipo = null) {
    const modo = tipo || (selectTipoSeccion ? selectTipoSeccion.value : 'examen');
    elementoActualId = null;

    if (btnEliminar) btnEliminar.style.display = 'none';
    if (lblTipoAccion) {
        lblTipoAccion.textContent = modo === 'examen' ? 'Registrar Examen de Conciencia' : 'Registrar Bendición y Antífona Mariana';
    }

    // Deseleccionar filas en la tabla
    document.querySelectorAll('.tabla-ecompletas tr').forEach(tr => tr.classList.remove('activo'));

    if (modo === 'examen') {
        const semilla = CATALOGO_ECOMPLETAS_SEED.find(s => s.tipo === 'examen') || {};
        formId.value = `examen_conciencia_${Date.now().toString().slice(-4)}`;
        formNombre.value = 'Nuevo Examen de Conciencia';
        formTituloExamen.value = semilla.titulo || 'EXAMEN DE CONCIENCIA';
        formMonicion.value = semilla.monicion || 'Hermanos, habiendo llegado al final de esta jornada que Dios nos ha concedido, reconozcamos sinceramente nuestros pecados.';
        formConfesion.value = semilla.confesion || `Yo confieso ante Dios todopoderoso\ny ante vosotros, hermanos,\nque he pecado mucho\nde pensamiento, palabra, obra y omisión:\npor mi culpa, por mi culpa, por mi gran culpa.\n\nPor eso ruego a santa María, siempre Virgen,\na los ángeles, a los santos y a vosotros, hermanos,\nque intercedáis por mí ante Dios, nuestro Señor.`;
        formVExamen.value = semilla.v || 'El Señor todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.';
        formRExamen.value = semilla.r || 'Amén.';
    } else {
        const semilla = CATALOGO_ECOMPLETAS_SEED.find(s => s.tipo === 'bendicion') || {};
        formId.value = `bendicion_completas_${Date.now().toString().slice(-4)}`;
        formNombre.value = 'Nueva Bendición y Antífona Mariana';
        formTituloBendicion.value = semilla.titulo || 'BENDICIÓN';
        formVBendicion.value = semilla.v || 'El Señor todopoderoso nos conceda una noche tranquila y una santa muerte.';
        formRBendicion.value = semilla.r || 'Amén.';
        formTituloMariana.value = semilla.tituloMariana || 'ANTIFONA FINAL DE LA SANTISIMA VIRGEN';
        formTextoMariana.value = semilla.textoMariana || `Madre del Redentor, Virgen fecunda,\npuerta del cielo siempre abierta,\nestrella del mar,\n\nven a librar al pueblo que tropieza\ny se quiere levantar.\n\nAnte la admiración de cielo y tierra,\nengendraste a tu santo Creador,\ny permaneces siempre virgen.\n\nRecibe el saludo del ángel Gabriel,\ny ten piedad de nosotros, pecadores.`;
    }

    actualizarVistaPrevia();
}

// Cargar un registro existente en el formulario
function cargarRegistroEnFormulario(item) {
    if (!item) return;
    elementoActualId = item.id;

    const tipo = item.tipo || 'examen';
    if (selectTipoSeccion) selectTipoSeccion.value = tipo;
    cambiarTipoSeccion(tipo, false);

    formId.value = item.id || '';
    formNombre.value = item.nombre || '';

    if (tipo === 'examen') {
        formTituloExamen.value = item.titulo || 'EXAMEN DE CONCIENCIA';
        formMonicion.value = item.monicion || '';
        formConfesion.value = item.confesion || '';
        formVExamen.value = item.v || '';
        formRExamen.value = item.r || '';
    } else {
        formTituloBendicion.value = item.titulo || 'BENDICIÓN';
        formVBendicion.value = item.v || '';
        formRBendicion.value = item.r || '';
        formTituloMariana.value = item.tituloMariana || 'ANTIFONA FINAL DE LA SANTISIMA VIRGEN';
        formTextoMariana.value = item.textoMariana || '';
    }

    if (lblTipoAccion) {
        lblTipoAccion.textContent = `Editar: ${item.nombre || item.id}`;
    }
    if (btnEliminar) {
        btnEliminar.style.display = 'inline-flex';
    }

    actualizarVistaPrevia();
}

// Actualizar en tiempo real la Vista Previa (Idéntica a Imágenes 1 y 2)
function actualizarVistaPrevia() {
    if (!previewContenido) return;
    const tipo = selectTipoSeccion ? selectTipoSeccion.value : 'examen';

    if (tipo === 'examen') {
        const tit = (formTituloExamen.value || 'EXAMEN DE CONCIENCIA').trim();
        const mon = (formMonicion.value || '').trim();
        const conf = (formConfesion.value || '').trim();
        const v = (formVExamen.value || '').trim();
        const r = (formRExamen.value || '').trim();

        previewContenido.innerHTML = `
            <div class="preview-titulo-rojo">${tit}</div>
            ${mon ? `<p class="preview-texto-cuerpo">${mon}</p>` : ''}
            ${conf ? `<div class="preview-estrofas-cuerpo">${conf}</div>` : ''}
            ${v ? `
                <div class="preview-linea-vr">
                    <span class="letra-roja">V.</span>
                    <span class="texto-vr">${v}</span>
                </div>
            ` : ''}
            ${r ? `
                <div class="preview-linea-vr">
                    <span class="letra-roja">R.</span>
                    <span class="texto-vr">${r}</span>
                </div>
            ` : ''}
        `;
    } else {
        const titB = (formTituloBendicion.value || 'BENDICIÓN').trim();
        const v = (formVBendicion.value || '').trim();
        const r = (formRBendicion.value || '').trim();
        const titM = (formTituloMariana.value || 'ANTIFONA FINAL DE LA SANTISIMA VIRGEN').trim();
        const txtM = (formTextoMariana.value || '').trim();

        previewContenido.innerHTML = `
            <div class="preview-titulo-rojo">${titB}</div>
            ${v ? `
                <div class="preview-linea-vr">
                    <span class="letra-roja">V.</span>
                    <span class="texto-vr">${v}</span>
                </div>
            ` : ''}
            ${r ? `
                <div class="preview-linea-vr">
                    <span class="letra-roja">R.</span>
                    <span class="texto-vr">${r}</span>
                </div>
            ` : ''}
            <div class="preview-subtitulo-rojo" style="margin-top: 24px;">${titM}</div>
            ${txtM ? `<div class="preview-estrofas-cuerpo">${txtM}</div>` : ''}
        `;
    }
}

// Renderizar tabla de registros
function renderizarTabla() {
    if (!tablaCuerpo) return;
    const todos = CompletasDB.obtenerTodos();
    const filtroTexto = (inputBuscar ? inputBuscar.value : '').toLowerCase().trim();

    const filtrados = todos.filter(item => {
        if (!filtroTexto) return true;
        const nombre = (item.nombre || '').toLowerCase();
        const id = (item.id || '').toLowerCase();
        const tipo = (item.tipo || '').toLowerCase();
        return nombre.includes(filtroTexto) || id.includes(filtroTexto) || tipo.includes(filtroTexto);
    });

    if (txtTotalRegistros) {
        txtTotalRegistros.textContent = `${todos.length} registro(s) disponible(s)`;
    }

    if (filtrados.length === 0) {
        tablaCuerpo.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 20px; color: var(--text-secondary);">No se encontraron registros.</td></tr>`;
        return;
    }

    tablaCuerpo.innerHTML = filtrados.map(item => {
        const activo = (item.id === elementoActualId) ? 'activo' : '';
        const tipoClase = (item.tipo === 'bendicion') ? 'bendicion' : 'examen';
        const tipoEtiqueta = (item.tipo === 'bendicion') ? 'Bendición' : 'Examen';
        return `
            <tr class="${activo}" data-id="${item.id}">
                <td><span class="badge-tipo ${tipoClase}">${tipoEtiqueta}</span></td>
                <td><strong>${item.nombre || item.id}</strong></td>
                <td><code style="color: var(--text-secondary); font-size: 0.82rem;">${item.id}</code></td>
            </tr>
        `;
    }).join('');

    // Eventos de selección de fila
    tablaCuerpo.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', () => {
            const id = tr.getAttribute('data-id');
            const item = CompletasDB.obtener(id);
            if (item) {
                cargarRegistroEnFormulario(item);
                document.querySelectorAll('.tabla-ecompletas tr').forEach(r => r.classList.remove('activo'));
                tr.classList.add('activo');
            }
        });
    });
}

// Guardar registro (Local + Firebase)
async function guardarRegistro(e) {
    if (e) e.preventDefault();

    const id = formId.value.trim();
    const nombre = formNombre.value.trim();
    const tipo = selectTipoSeccion.value;

    if (!id || !nombre) {
        mostrarBanner('El ID y el Nombre son obligatorios.', 'error');
        return;
    }

    let objeto = {
        id,
        nombre,
        tipo,
        fechaActualizacion: new Date().toISOString()
    };

    if (tipo === 'examen') {
        objeto.titulo = formTituloExamen.value.trim() || 'EXAMEN DE CONCIENCIA';
        objeto.monicion = formMonicion.value.trim();
        objeto.confesion = formConfesion.value.trim();
        objeto.v = formVExamen.value.trim();
        objeto.r = formRExamen.value.trim();
    } else {
        objeto.titulo = formTituloBendicion.value.trim() || 'BENDICIÓN';
        objeto.v = formVBendicion.value.trim();
        objeto.r = formRBendicion.value.trim();
        objeto.tituloMariana = formTituloMariana.value.trim() || 'ANTIFONA FINAL DE LA SANTISIMA VIRGEN';
        objeto.textoMariana = formTextoMariana.value.trim();
    }

    const guardado = CompletasDB.guardar(objeto);
    if (!guardado) {
        mostrarBanner('Error al guardar en memoria local.', 'error');
        return;
    }

    elementoActualId = id;
    renderizarTabla();
    mostrarBanner(`Registro "${nombre}" guardado con éxito.`, 'exito');

    // Sincronizar en Firebase Firestore si está disponible
    if (window.firebaseAPI && window.firebaseAPI.db) {
        try {
            await window.firebaseAPI.guardarDocumento('ecompletas', id, objeto);
            console.log(`☁️ [Firebase] Registro '${id}' guardado en colección 'ecompletas'.`);
        } catch (errFb) {
            console.warn("Aviso al guardar en Firebase:", errFb);
        }
    }
}

// Eliminar registro
async function eliminarRegistro() {
    if (!elementoActualId) return;
    if (!confirm(`¿Estás seguro de eliminar el registro "${elementoActualId}"?`)) return;

    const idEliminado = elementoActualId;
    CompletasDB.eliminar(idEliminado);
    mostrarBanner(`Registro "${idEliminado}" eliminado.`, 'info');
    resetearFormulario();
    renderizarTabla();

    if (window.firebaseAPI && window.firebaseAPI.db) {
        try {
            await window.firebaseAPI.eliminarDocumento('ecompletas', idEliminado);
            console.log(`☁️ [Firebase] Registro '${idEliminado}' eliminado de colección 'ecompletas'.`);
        } catch (errFb) {
            console.warn("Aviso al eliminar en Firebase:", errFb);
        }
    }
}

// Restaurar catálogo semilla
function restaurarSemilla() {
    if (!confirm('¿Deseas restaurar los textos canónicos predeterminados del Examen de Conciencia y Bendición?')) return;
    CompletasDB.restaurar();
    resetearFormulario();
    renderizarTabla();
    mostrarBanner('Base canónica de Completas restaurada con éxito.', 'exito');
}

// Subir catálogo completo a Firebase
async function subirSemillaAFirebase() {
    if (!window.firebaseAPI || !window.firebaseAPI.db) {
        mostrarBanner('Firebase no está inicializado o no hay conexión.', 'error');
        return;
    }
    const todos = CompletasDB.obtenerTodos();
    mostrarBanner(`Subiendo ${todos.length} registros a Firebase...`, 'info', 0);
    try {
        for (const item of todos) {
            await window.firebaseAPI.guardarDocumento('ecompletas', item.id, item);
        }
        mostrarBanner(`¡${todos.length} registros subidos con éxito a Firebase!`, 'exito');
    } catch (err) {
        console.error("Error al subir a Firebase:", err);
        mostrarBanner(`Error al subir a Firebase: ${err.message}`, 'error');
    }
}

// Exportar respaldo en formato JSON
function exportarJSON() {
    const todos = CompletasDB.obtenerTodos();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(todos, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `completas_examen_bendicion_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    dlAnchor.remove();
}

// Inicialización de Eventos
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar cambio de tipo de sección en el select maestro
    if (selectTipoSeccion) {
        selectTipoSeccion.addEventListener('change', (e) => {
            cambiarTipoSeccion(e.target.value, true);
        });
    }

    // Actualización de vista previa reactiva mientras el usuario escribe
    const inputsReactivos = [
        formTituloExamen, formMonicion, formConfesion, formVExamen, formRExamen,
        formTituloBendicion, formVBendicion, formRBendicion, formTituloMariana, formTextoMariana
    ];
    inputsReactivos.forEach(input => {
        if (input) {
            input.addEventListener('input', actualizarVistaPrevia);
        }
    });

    // Formulario submit
    if (form) form.addEventListener('submit', guardarRegistro);
    if (btnNuevo) btnNuevo.addEventListener('click', () => resetearFormulario());
    if (btnEliminar) btnEliminar.addEventListener('click', eliminarRegistro);
    if (btnRestaurarSemilla) btnRestaurarSemilla.addEventListener('click', restaurarSemilla);
    if (btnSubirSemilla) btnSubirSemilla.addEventListener('click', subirSemillaAFirebase);
    if (btnExportarJson) btnExportarJson.addEventListener('click', exportarJSON);
    if (inputBuscar) inputBuscar.addEventListener('input', renderizarTabla);

    // Inicializar
    resetearFormulario('examen');
    renderizarTabla();
});
