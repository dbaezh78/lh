/**
 * src/js/ver.js - Controlador para el Historial de Actualizaciones (ver.html)
 * Sincronización en tiempo real con Firebase Firestore y control de acceso.
 */

import { ADMIN_EMAIL } from "./accesscontrol.js";

document.addEventListener("DOMContentLoaded", () => {
    const formActualizacion = document.getElementById("form-actualizacion");
    const inputId = document.getElementById("input-actualizacion-id");
    const inputVersion = document.getElementById("input-version");
    const inputFecha = document.getElementById("input-fecha");
    const textareaDetalles = document.getElementById("textarea-detalles");
    const btnSubmit = document.getElementById("btn-submit-actualizacion");
    const textoBtnSubmit = document.getElementById("texto-btn-submit");
    const iconoBtnSubmit = document.getElementById("icono-btn-submit");
    const btnCancelarEdicion = document.getElementById("btn-cancelar-edicion");
    const tituloForm = document.getElementById("texto-form-actualizacion");
    const iconoForm = document.getElementById("icono-form-actualizacion");
    const contenedorLista = document.getElementById("contenedor-actualizaciones-lista");
    const countBadge = document.getElementById("count-actualizaciones");
    const seccionForm = document.getElementById("seccion-form-actualizacion");

    // Fecha de hoy por defecto
    const hoy = new Date().toISOString().split("T")[0];
    if (inputFecha) inputFecha.value = hoy;

    // Cache local de actualizaciones
    let actualizacionesMemoria = [];
    let enModoEdicion = false;

    // Verificar permisos de edición (Admin o permiso 'ver_editar')
    function puedeEditar() {
        const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
        const email = (currentUser?.email || "").toLowerCase().trim();
        const isAdmin = (email === ADMIN_EMAIL.toLowerCase());
        const tienePermiso = (typeof window.hasPermission === 'function' && window.hasPermission("ver_editar"));
        return isAdmin || tienePermiso;
    }

    function aplicarPermisosVisuales() {
        const canEdit = puedeEditar();
        if (seccionForm) {
            seccionForm.style.display = canEdit ? "block" : "none";
        }
    }

    // Renderizar la lista de actualizaciones
    function renderListaActualizaciones(lista) {
        if (!contenedorLista) return;

        if (!lista || lista.length === 0) {
            contenedorLista.innerHTML = `
                <div class="estado-vacio">
                    <span class="material-symbols-outlined" style="font-size: 40px; color: var(--text-muted); opacity: 0.5;">history_edu</span>
                    <h3 style="margin: 8px 0 4px 0;">No hay actualizaciones registradas</h3>
                    <p style="margin: 0; font-size: 0.85rem;">Las actualizaciones registradas aparecerán aquí organizadas cronológicamente.</p>
                </div>
            `;
            if (countBadge) countBadge.textContent = "0 versiones";
            return;
        }

        if (countBadge) countBadge.textContent = `${lista.length} versión${lista.length > 1 ? 'es' : ''}`;

        const canEdit = puedeEditar();

        contenedorLista.innerHTML = lista.map(item => {
            const fechaFormateada = item.fecha ? formatearFecha(item.fecha) : "Sin fecha";
            const autorInfo = item.autor ? `<span>Registrado por: ${item.autor}</span>` : `<span>Sistema Liturgia</span>`;
            
            const botonesAccion = canEdit ? `
                <div class="acciones-version-item">
                    <button class="btn-item-accion btn-editar-item" data-id="${item.id}" title="Editar esta versión">
                        <span class="material-symbols-outlined" style="font-size: 16px;">edit</span>
                        Editar
                    </button>
                    <button class="btn-item-accion peligro btn-eliminar-item" data-id="${item.id}" data-version="${item.version}" title="Eliminar esta versión">
                        <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
                    </button>
                </div>
            ` : '';

            return `
                <article class="card-version-item" id="item-version-${item.id}">
                    <div class="card-version-header">
                        <div class="version-pill-box">
                            <span class="badge-version">
                                <span class="material-symbols-outlined" style="font-size: 16px;">sell</span>
                                v${escapeHtml(item.version)}
                            </span>
                            <span class="badge-fecha">
                                <span class="material-symbols-outlined" style="font-size: 15px;">calendar_month</span>
                                ${fechaFormateada}
                            </span>
                        </div>
                        ${botonesAccion}
                    </div>

                    <div class="card-version-detalles">${escapeHtml(item.detalles || "Sin detalles.")}</div>

                    <div class="card-version-footer">
                        ${autorInfo}
                        ${item.ultimaModificacion ? `<span>Últ. cambio: ${new Date(item.ultimaModificacion).toLocaleDateString()}</span>` : ''}
                    </div>
                </article>
            `;
        }).join("");

        // Eventos a botones de edición y eliminación
        contenedorLista.querySelectorAll(".btn-editar-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                cargarParaEditar(id);
            });
        });

        contenedorLista.querySelectorAll(".btn-eliminar-item").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                const ver = btn.dataset.version;
                if (confirm(`🗑️ ¿Estás seguro de eliminar el registro de la versión v${ver}?`)) {
                    await eliminarActualizacion(id);
                }
            });
        });
    }

    // Cargar registro en el formulario para editar
    function cargarParaEditar(id) {
        const item = actualizacionesMemoria.find(x => x.id === id);
        if (!item) return;

        enModoEdicion = true;
        inputId.value = item.id;
        inputVersion.value = item.version || "";
        inputFecha.value = item.fecha || hoy;
        textareaDetalles.value = item.detalles || "";

        if (tituloForm) tituloForm.textContent = `Editar Actualización (v${item.version})`;
        if (iconoForm) iconoForm.textContent = "edit";
        if (textoBtnSubmit) textoBtnSubmit.textContent = "Guardar Cambios";
        if (iconoBtnSubmit) iconoBtnSubmit.textContent = "save";
        if (btnSubmit) btnSubmit.classList.add("edicion");
        if (btnCancelarEdicion) btnCancelarEdicion.style.display = "inline-flex";
        if (seccionForm) seccionForm.classList.add("modo-edicion");

        seccionForm.scrollIntoView({ behavior: "smooth", block: "start" });
        inputVersion.focus();
    }

    // Cancelar modo edición
    function resetearFormulario() {
        enModoEdicion = false;
        formActualizacion.reset();
        inputId.value = "";
        inputFecha.value = hoy;

        if (tituloForm) tituloForm.textContent = "Registrar Nueva Actualización";
        if (iconoForm) iconoForm.textContent = "add_circle";
        if (textoBtnSubmit) textoBtnSubmit.textContent = "Guardar en Firebase";
        if (iconoBtnSubmit) iconoBtnSubmit.textContent = "cloud_upload";
        if (btnSubmit) btnSubmit.classList.remove("edicion");
        if (btnCancelarEdicion) btnCancelarEdicion.style.display = "none";
        if (seccionForm) seccionForm.classList.remove("modo-edicion");
    }

    if (btnCancelarEdicion) {
        btnCancelarEdicion.addEventListener("click", resetearFormulario);
    }

    // Guardar / Actualizar en Firebase Firestore
    if (formActualizacion) {
        formActualizacion.addEventListener("submit", async (e) => {
            e.preventDefault();

            const versionVal = inputVersion.value.trim();
            const fechaVal = inputFecha.value;
            const detallesVal = textareaDetalles.value.trim();
            const idVal = inputId.value;

            if (!versionVal || !detallesVal) {
                alert("Por favor completa la versión y los detalles de la actualización.");
                return;
            }

            if (!window.firebaseAPI?.guardarActualizacionFirestore) {
                alert("Firebase no está disponible en este momento.");
                return;
            }

            btnSubmit.disabled = true;
            if (textoBtnSubmit) textoBtnSubmit.textContent = "Guardando...";

            try {
                const registro = {
                    id: idVal || undefined,
                    version: versionVal,
                    fecha: fechaVal,
                    detalles: detallesVal
                };

                await window.firebaseAPI.guardarActualizacionFirestore(registro);
                alert(`✅ Actualización v${versionVal} guardada correctamente en Firebase.`);
                resetearFormulario();
                await cargarActualizacionesDesdeFirebase();
            } catch (err) {
                console.error("Error guardando actualización:", err);
                alert(`❌ Error al guardar en Firebase: ${err.message}`);
            } finally {
                btnSubmit.disabled = false;
                if (textoBtnSubmit) {
                    textoBtnSubmit.textContent = enModoEdicion ? "Guardar Cambios" : "Guardar en Firebase";
                }
            }
        });
    }

    // Eliminar de Firebase
    async function eliminarActualizacion(id) {
        try {
            if (window.firebaseAPI?.eliminarActualizacionFirestore) {
                await window.firebaseAPI.eliminarActualizacionFirestore(id);
                alert("Registro eliminado correctamente.");
                await cargarActualizacionesDesdeFirebase();
            }
        } catch (err) {
            console.error("Error al eliminar actualización:", err);
            alert(`Error al eliminar: ${err.message}`);
        }
    }

    // Cargar datos desde Firebase
    async function cargarActualizacionesDesdeFirebase() {
        if (!window.firebaseAPI?.cargarActualizacionesFirestore) {
            // Reintentar en 500ms si el módulo aún no cargó
            setTimeout(cargarActualizacionesDesdeFirebase, 500);
            return;
        }

        try {
            const datos = await window.firebaseAPI.cargarActualizacionesFirestore();
            
            // Si la colección está vacía por ser la primera vez, sembrar versión inicial
            if (!datos || datos.length === 0) {
                const semillav1 = {
                    id: "v_1_0_01",
                    version: "1.0.01",
                    fecha: "2026-09-17",
                    detalles: "• Actualización a versión 1.0.01.\n• Soporte de edición directa de hitos en el formulario de Cambio Litúrgico.\n• Nueva pestaña 'Actualización' en Control de Acceso (aCtrl).\n• Visualización de archivos actualizándose en ventana modal con progreso animado.\n• Página ver.html sincronizada con Firebase para historial de cambios.",
                    autor: "dbaezh78@gmail.com",
                    ultimaModificacion: new Date().toISOString()
                };
                const semillav2 = {
                    id: "v_1_0_02",
                    version: "1.0.02",
                    fecha: new Date().toISOString().split("T")[0],
                    detalles: "• Actualización a versión 1.0.02.\n• Nuevo sistema de Chat de Asistencia y Fraterno estilo WhatsApp Web.\n• Soporte para pegar capturas de pantalla (PrintScreen / Ctrl+V).\n• Selector oficial de Emojis con categorías, búsqueda y emojis recientes.\n• Sustitución automática de atajos de texto a emojis ((Y) -> 👍, <3 -> ❤️, etc.).\n• Integración completa del Navegador del sistema dentro del Chat.",
                    autor: "dbaezh78@gmail.com",
                    ultimaModificacion: new Date().toISOString()
                };
                try {
                    await window.firebaseAPI.guardarActualizacionFirestore(semillav1);
                    await window.firebaseAPI.guardarActualizacionFirestore(semillav2);
                    actualizacionesMemoria = [semillav2, semillav1];
                    renderListaActualizaciones(actualizacionesMemoria);
                    return;
                } catch (e) {
                    console.warn("Aviso sembrando versión inicial:", e);
                }
            }

            // Registrar automáticamente v1.0.02 si no existe
            const listaActualizada = datos ? [...datos] : [];
            const tieneV2 = listaActualizada.some(d => d.version === "1.0.02" || d.id === "v_1_0_02");
            if (!tieneV2 && window.firebaseAPI?.guardarActualizacionFirestore) {
                const v2 = {
                    id: "v_1_0_02",
                    version: "1.0.02",
                    fecha: new Date().toISOString().split("T")[0],
                    detalles: "• Actualización a versión 1.0.02.\n• Nuevo sistema de Chat de Asistencia y Fraterno estilo WhatsApp Web.\n• Soporte para pegar capturas de pantalla (PrintScreen / Ctrl+V).\n• Selector oficial de Emojis con categorías, búsqueda y emojis recientes.\n• Sustitución automática de atajos de texto a emojis ((Y) -> 👍, <3 -> ❤️, etc.).\n• Integración completa del Navegador del sistema dentro del Chat.",
                    autor: "dbaezh78@gmail.com",
                    ultimaModificacion: new Date().toISOString()
                };
                try {
                    await window.firebaseAPI.guardarActualizacionFirestore(v2);
                    listaActualizada.unshift(v2);
                } catch (e) {}
            }

            actualizacionesMemoria = listaActualizada;
            renderListaActualizaciones(actualizacionesMemoria);
        } catch (err) {
            console.error("Error cargando actualizaciones:", err);
            if (contenedorLista) {
                contenedorLista.innerHTML = `
                    <div class="estado-vacio">
                        <span class="material-symbols-outlined" style="color: #e53935; font-size: 36px;">error</span>
                        <p style="color: #e53935;">Error al cargar las actualizaciones desde la nube.</p>
                    </div>
                `;
            }
        }
    }

    // Formatear fecha legible
    function formatearFecha(isoDate) {
        try {
            const [y, m, d] = isoDate.split("-");
            const fecha = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            return fecha.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        } catch (e) {
            return isoDate;
        }
    }

    function escapeHtml(str) {
        return (str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Inicializar listeners de autenticación y permisos
    aplicarPermisosVisuales();
    cargarActualizacionesDesdeFirebase();

    if (window.firebaseAPI?.onAuthReady) {
        window.firebaseAPI.onAuthReady(() => {
            aplicarPermisosVisuales();
            renderListaActualizaciones(actualizacionesMemoria);
        });
    }

    window.addEventListener("lh-access-control-updated", () => {
        aplicarPermisosVisuales();
        renderListaActualizaciones(actualizacionesMemoria);
    });
});
