/**
 * src/js/system.js - Controlador de Archivos del Sistema (system.html)
 * Verifica el estado en vivo de cada archivo, versión, fecha y estado de integridad.
 * Incluye reordenamiento interactivo (Drag & Drop + Botones Subir/Bajar), persistencia
 * en Firebase Firestore y exportación para el administrador (dbaezh78@gmail.com).
 */

document.addEventListener("DOMContentLoaded", async () => {
    const ADMIN_EMAIL = "dbaezh78@gmail.com";
    const STORAGE_ORDEN_KEY = "lh_orden_archivos_sistema";

    // Elementos del DOM
    const tbody = document.getElementById("tbody-archivos-sistema");
    const statTotal = document.getElementById("stat-total");
    const statOk = document.getElementById("stat-ok");
    const statParcial = document.getElementById("stat-parcial");
    const statFaltantes = document.getElementById("stat-faltantes");
    const statVersion = document.getElementById("stat-version");
    const inputBuscar = document.getElementById("input-buscar-archivo");
    const selectTipo = document.getElementById("select-filtro-tipo");
    const selectEstado = document.getElementById("select-filtro-estado");
    const btnComprobar = document.getElementById("btn-comprobar-archivos");

    // Controles de Administrador
    const btnGuardarOrden = document.getElementById("btn-guardar-orden");
    const btnCopiarOrden = document.getElementById("btn-copiar-orden");
    const btnRestablecerOrden = document.getElementById("btn-restablecer-orden");
    const bannerAdmin = document.getElementById("admin-banner-orden");
    const statusCambios = document.getElementById("status-orden-cambios");
    const thOrden = document.getElementById("th-orden");

    // Modal y Toast
    const modalCompartir = document.getElementById("modal-compartir-orden");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal-orden");
    const btnCancelarModal = document.getElementById("btn-cancelar-modal-orden");
    const btnCopiarPortapapeles = document.getElementById("btn-copiar-portapapeles");
    const textareaCodigo = document.getElementById("textarea-codigo-orden");
    const toastEl = document.getElementById("toast-notificacion");

    const appVer = window.APP_VERSION || "1.0.01";
    if (statVersion) statVersion.textContent = `v${appVer}`;

    let listaArchivos = [];
    let estadosArchivos = {}; // id -> { exists, status, lastModified, cssOk, jsOk }
    let modoAdmin = false;
    let hayCambiosSinGuardar = false;
    let draggedId = null;

    // Catálogo base de los 15 archivos / módulos esenciales
    const CATALOGO_DEFAULT = [
        { id: "inicio", nombre: "Inicio", icono: "home", ruta: "index.html", css: "src/css/main.css", js: "src/js/main.js", fecha: "2026-09-15 10:38:27", version: appVer, categoria: "gestion" },
        { id: "actrl", nombre: "Control de Acceso", icono: "admin_panel_settings", ruta: "src/html/aCtrl.html", css: "src/css/aCtrl.css", js: "src/js/aCtrl-ui.js", fecha: "2026-09-16 17:43:03", version: appVer, categoria: "gestion" },
        { id: "añoliturgico", nombre: "Año Liturgico", icono: "calendar_month", ruta: "src/html/añoliturgico.html", css: "src/css/añoliturgico.css", js: "src/js/añoliturgico.js", fecha: "2026-09-16 16:21:38", version: appVer, categoria: "gestion" },
        { id: "system", nombre: "Archivos de Sistema", icono: "folder_special", ruta: "src/html/system.html", css: "src/css/system.css", js: "src/js/system.js", fecha: "2026-09-17 11:26:00", version: appVer, categoria: "gestion" },
        { id: "completas", nombre: "Completas", icono: "bedtime", ruta: "src/html/completas.html", css: "src/css/completas.css", js: "src/js/completas.js", fecha: "2026-09-11 14:22:57", version: appVer, categoria: "oracion" },
        { id: "datos", nombre: "Base de datos", icono: "dataset", ruta: "src/html/datos.html", css: "src/css/datos.css", js: "src/js/datos.js", fecha: "2026-09-16 14:29:59", version: appVer, categoria: "gestion" },
        { id: "form_etiempo", nombre: "Cambios Litúrgicos", icono: "edit_calendar", ruta: "src/html/form_etiempo.html", css: "src/css/form_etiempo.css", js: "src/js/form_etiempo.js", fecha: "2026-09-16 17:11:56", version: appVer, categoria: "gestion" },
        { id: "laudes", nombre: "Laudes", icono: "wb_twilight", ruta: "src/html/laudes.html", css: "src/css/laudes.css", js: "src/js/laudes.js", fecha: "2026-09-11 13:28:20", version: appVer, categoria: "oracion" },
        { id: "nombresanto", nombre: "Nombre de los Santos", icono: "person_add", ruta: "src/html/nombresanto.html", css: "src/css/nombresanto.css", js: "src/js/nombresanto.js", fecha: "2026-09-16 17:02:58", version: appVer, categoria: "gestion" },
        { id: "nona", nombre: "Nona", icono: "schedule", ruta: "src/html/nona.html", css: "src/css/nona.css", js: "src/js/nona.js", fecha: "2026-09-11 14:22:47", version: appVer, categoria: "oracion" },
        { id: "oficio", nombre: "Oficio de Lectura", icono: "menu_book", ruta: "src/html/oficio.html", css: "src/css/oficio.css", js: "src/js/oficio.js", fecha: "2026-04-13 06:58:41", version: appVer, categoria: "oracion" },
        { id: "santo", nombre: "Santos de la Iglesia", icono: "groups", ruta: "src/html/santo.html", css: "src/css/santo.css", js: "src/js/santo.js", fecha: "2026-09-16 16:36:29", version: appVer, categoria: "gestion" },
        { id: "sexta", nombre: "Sexta", icono: "wb_sunny", ruta: "src/html/sexta.html", css: "src/css/sexta.css", js: "src/js/sexta.js", fecha: "2026-09-11 14:22:42", version: appVer, categoria: "oracion" },
        { id: "tercia", nombre: "Tercia", icono: "alarm", ruta: "src/html/tercia.html", css: "src/css/tercia.css", js: "src/js/tercia.js", fecha: "2026-09-11 14:22:37", version: appVer, categoria: "oracion" },
        { id: "ver", nombre: "Versión de la aplicación", icono: "history_edu", ruta: "src/html/ver.html", css: "src/css/ver.css", js: "src/js/ver.js", fecha: "2026-09-16 17:16:09", version: appVer, categoria: "gestion" },
        { id: "visperas", nombre: "Visperas", icono: "nights_stay", ruta: "src/html/visperas.html", css: "src/css/visperas.css", js: "src/js/visperas.js", fecha: "2026-09-11 14:22:51", version: appVer, categoria: "oracion" }
    ];

    // Resuelve la URL de un recurso con respecto a la raíz del repositorio
    function resolveRepoUrl(relPath) {
        if (!relPath) return "";
        try {
            return new URL('../../' + relPath.replace(/^\/+/, ''), window.location.href).href;
        } catch (e) {
            return '../../' + relPath.replace(/^\/+/, '');
        }
    }

    // Comprueba si el usuario tiene privilegios de administrador
    function verificarAdmin() {
        const user = window.firebaseAPI?.getCurrentUser?.();
        const adminEmail = window.firebaseAPI?.adminEmail || ADMIN_EMAIL;
        const isUserAdmin = !!(user && user.email && user.email.toLowerCase() === adminEmail.toLowerCase());
        const isLocalAdmin = localStorage.getItem('lh_auth_is_admin') === 'true';

        modoAdmin = isUserAdmin || isLocalAdmin;
        actualizarUIAdmin();
    }

    // Actualiza la visibilidad de controles exclusivos para administrador
    function actualizarUIAdmin() {
        if (btnGuardarOrden) btnGuardarOrden.style.display = modoAdmin ? "inline-flex" : "none";
        if (btnCopiarOrden) btnCopiarOrden.style.display = modoAdmin ? "inline-flex" : "none";
        if (btnRestablecerOrden) btnRestablecerOrden.style.display = modoAdmin ? "inline-flex" : "none";
        if (bannerAdmin) bannerAdmin.style.display = modoAdmin ? "flex" : "none";
        if (thOrden) thOrden.style.display = modoAdmin ? "table-cell" : "none";

        if (statusCambios) {
            statusCambios.style.display = (modoAdmin && hayCambiosSinGuardar) ? "inline-flex" : "none";
        }
        if (btnGuardarOrden) {
            if (hayCambiosSinGuardar) btnGuardarOrden.classList.add("pendiente-cambios");
            else btnGuardarOrden.classList.remove("pendiente-cambios");
        }
    }

    // Aplica un orden personalizado a la lista de archivos por ID o ruta
    function aplicarOrden(lista, ordenIds) {
        if (!Array.isArray(ordenIds) || ordenIds.length === 0) return lista;
        const mapa = new Map();
        lista.forEach(it => mapa.set(it.id || it.ruta, it));

        const res = [];
        ordenIds.forEach(id => {
            if (mapa.has(id)) {
                res.push(mapa.get(id));
                mapa.delete(id);
            }
        });
        // Si hay módulos no presentes en ordenIds, agregarlos al final
        mapa.forEach(it => res.push(it));
        return res;
    }

    // Calcula el estado de un módulo según las reglas:
    // Si están todos (3/3): Verde
    // Si falta uno (2/3): Amarillo
    // Si faltan 2 o todos (<= 1/3): Rojo
    function evaluarEstadoModulo(item) {
        const id = item.id || item.ruta;
        const st = estadosArchivos[id] || { exists: true, cssOk: true, jsOk: true };
        const htmlOk = !!st.exists;
        const cssOk = !!st.cssOk;
        const jsOk = !!st.jsOk;

        const oks = (htmlOk ? 1 : 0) + (cssOk ? 1 : 0) + (jsOk ? 1 : 0);
        const faltantes = 3 - oks;

        if (oks === 3) {
            return {
                color: "verde",
                oks,
                faltantes,
                tituloCirculo: "Completo (HTML, CSS y JS presentes en el sistema)",
                badgeClase: "si",
                badgeTexto: "Sí",
                badgeIcono: "check_circle"
            };
        } else if (faltantes === 1) {
            const faltanteNombre = !htmlOk ? "HTML principal" : (!cssOk ? "CSS" : "JS");
            return {
                color: "amarillo",
                oks,
                faltantes,
                tituloCirculo: `Incompleto (Falta 1 archivo: ${faltanteNombre})`,
                badgeClase: "parcial",
                badgeTexto: "Parcial",
                badgeIcono: "warning"
            };
        } else {
            return {
                color: "rojo",
                oks,
                faltantes,
                tituloCirculo: oks === 0 ? "Faltan todos los archivos (HTML, CSS, JS)" : `Incompleto crítico (Faltan ${faltantes} de 3 archivos)`,
                badgeClase: "no",
                badgeTexto: "No",
                badgeIcono: "cancel"
            };
        }
    }

    // Mostrar notificación Toast
    function mostrarToast(mensaje, icono = "check_circle", duracion = 3500) {
        if (!toastEl) return;
        toastEl.innerHTML = `
            <span class="material-symbols-outlined" style="color: #00c853; font-size: 20px;">${icono}</span>
            <span>${mensaje}</span>
        `;
        toastEl.style.display = "flex";
        clearTimeout(window._toastTimeout);
        window._toastTimeout = setTimeout(() => {
            toastEl.style.display = "none";
        }, duracion);
    }

    // 1. Cargar inventario de archivos del sistema
    async function cargarInventario() {
        try {
            const resp = await fetch(`../data/system_files.json?_v=${Date.now()}`);
            if (!resp.ok) throw new Error("No se pudo cargar system_files.json");
            listaArchivos = await resp.json();
            if (!Array.isArray(listaArchivos) || listaArchivos.length === 0) {
                listaArchivos = CATALOGO_DEFAULT;
            }
        } catch (err) {
            console.warn("Aviso: usando catálogo por defecto para archivos del sistema:", err);
            listaArchivos = CATALOGO_DEFAULT;
        }

        // Aplicar orden guardado en localStorage primero (inmediato)
        try {
            const localOrden = localStorage.getItem(STORAGE_ORDEN_KEY);
            if (localOrden) {
                const parsed = JSON.parse(localOrden);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    listaArchivos = aplicarOrden(listaArchivos, parsed);
                }
            }
        } catch (e) {
            console.warn("Aviso al leer orden local:", e);
        }

        // Marcar estado inicial de comprobación
        listaArchivos.forEach(f => {
            const id = f.id || f.ruta;
            estadosArchivos[id] = { exists: true, status: 200, lastModified: f.fecha || null, cssOk: true, jsOk: true };
        });

        actualizarEstadisticas();
        renderTabla();

        // En segundo plano, sincronizar con el orden guardado en Firebase Firestore
        cargarOrdenDesdeFirebase();
    }

    // Sincronizar orden desde Firebase Firestore
    async function cargarOrdenDesdeFirebase() {
        try {
            if (window.firebaseAPI?.cargarOrdenArchivosSistema) {
                const ordenFb = await window.firebaseAPI.cargarOrdenArchivosSistema();
                if (Array.isArray(ordenFb) && ordenFb.length > 0) {
                    listaArchivos = aplicarOrden(listaArchivos, ordenFb);
                    localStorage.setItem(STORAGE_ORDEN_KEY, JSON.stringify(ordenFb));
                    renderTabla();
                    console.log("☁️ [Firebase] Orden de archivos del sistema aplicado desde la nube.");
                }
            }
        } catch (e) {
            console.warn("Aviso al consultar orden en Firebase:", e);
        }
    }

    // Comprobar un módulo individual y sus complementos en vivo
    async function comprobarItem(item) {
        const id = item.id || item.ruta;
        const htmlUrl = `${resolveRepoUrl(item.ruta)}?_t=${Date.now()}`;
        let exists = false;
        let status = 200;
        let lastModified = item.fecha || null;

        // 1. Probar archivo HTML principal
        try {
            const res = await fetch(htmlUrl, { method: "HEAD", cache: "no-store" });
            exists = res.ok || (res.status >= 200 && res.status < 400);
            status = res.status;
            const lm = res.headers.get("last-modified");
            if (lm) lastModified = new Date(lm).toLocaleString("es-ES");
        } catch (e) {
            try {
                const resGet = await fetch(htmlUrl, { method: "GET", cache: "no-store" });
                exists = resGet.ok;
                status = resGet.status;
            } catch (e2) {
                exists = false;
                status = 404;
            }
        }

        // 2. Probar complemento CSS
        let cssOk = false;
        if (item.css) {
            const cssUrl = `${resolveRepoUrl(item.css)}?_t=${Date.now()}`;
            try {
                const resCss = await fetch(cssUrl, { method: "HEAD", cache: "no-store" });
                cssOk = resCss.ok || (resCss.status >= 200 && resCss.status < 400);
            } catch (e) {
                try {
                    const resCssGet = await fetch(cssUrl, { method: "GET", cache: "no-store" });
                    cssOk = resCssGet.ok;
                } catch (e2) {
                    cssOk = false;
                }
            }
        }

        // 3. Probar complemento JS
        let jsOk = false;
        if (item.js) {
            const jsUrl = `${resolveRepoUrl(item.js)}?_t=${Date.now()}`;
            try {
                const resJs = await fetch(jsUrl, { method: "HEAD", cache: "no-store" });
                jsOk = resJs.ok || (resJs.status >= 200 && resJs.status < 400);
            } catch (e) {
                try {
                    const resJsGet = await fetch(jsUrl, { method: "GET", cache: "no-store" });
                    jsOk = resJsGet.ok;
                } catch (e2) {
                    jsOk = false;
                }
            }
        }

        estadosArchivos[id] = {
            exists,
            status,
            cssOk,
            jsOk,
            lastModified: lastModified || item.fecha
        };
    }

    // 2. Comprobación activa de todos los módulos en vivo
    async function comprobarArchivosEnVivo() {
        if (btnComprobar) {
            btnComprobar.disabled = true;
            btnComprobar.innerHTML = `<span class="material-symbols-outlined spin-icon">sync</span> Comprobando...`;
        }

        const batchSize = 5;
        for (let i = 0; i < listaArchivos.length; i += batchSize) {
            const batch = listaArchivos.slice(i, i + batchSize);
            await Promise.all(batch.map(item => comprobarItem(item)));
            actualizarEstadisticas();
            renderTabla();
        }

        if (btnComprobar) {
            btnComprobar.disabled = false;
            btnComprobar.innerHTML = `<span class="material-symbols-outlined">sync</span> Comprobar Archivos`;
        }
    }

    // 3. Renderizar la tabla de archivos
    function renderTabla() {
        if (!tbody) return;

        const busqueda = (inputBuscar?.value || "").toLowerCase().trim();
        const filtroTipo = selectTipo?.value || "todos";
        const filtroEstado = selectEstado?.value || "todos";

        const filtrados = listaArchivos.filter(item => {
            const evalEstado = evaluarEstadoModulo(item);

            // Filtro de búsqueda
            if (busqueda) {
                const matchNombre = (item.nombre || "").toLowerCase().includes(busqueda);
                const matchRuta = (item.ruta || "").toLowerCase().includes(busqueda);
                const matchCss = (item.css || "").toLowerCase().includes(busqueda);
                const matchJs = (item.js || "").toLowerCase().includes(busqueda);
                if (!matchNombre && !matchRuta && !matchCss && !matchJs) return false;
            }

            // Filtro por categoría
            if (filtroTipo !== "todos") {
                if (filtroTipo === "oracion" && item.categoria !== "oracion") return false;
                if (filtroTipo === "gestion" && item.categoria !== "gestion") return false;
            }

            // Filtro por estado
            if (filtroEstado === "verde" || filtroEstado === "actualizado") {
                if (evalEstado.color !== "verde") return false;
            } else if (filtroEstado === "amarillo") {
                if (evalEstado.color !== "amarillo") return false;
            } else if (filtroEstado === "rojo" || filtroEstado === "error") {
                if (evalEstado.color !== "rojo") return false;
            }

            return true;
        });

        if (filtrados.length === 0) {
            const colspan = modoAdmin ? 8 : 7;
            tbody.innerHTML = `
                <tr>
                    <td colspan="${colspan}" style="text-align: center; padding: 36px; color: var(--text-muted);">
                        <span class="material-symbols-outlined" style="font-size: 36px; opacity: 0.5;">search_off</span>
                        <p style="margin: 8px 0 0 0;">No se encontraron archivos que coincidan con los filtros seleccionados.</p>
                    </td>
                </tr>
            `;
            return;
        }

        const totalFiltrados = filtrados.length;

        tbody.innerHTML = filtrados.map((item, index) => {
            const id = item.id || item.ruta;
            const estado = estadosArchivos[id] || { exists: true, cssOk: true, jsOk: true };
            const evalEstado = evaluarEstadoModulo(item);

            // Círculo relleno de Estado (Verde 3/3, Amarillo 2/3, Rojo <=1/3)
            const circuloHtml = `<span class="circulo-estado ${evalEstado.color}" title="${escapeHtml(evalEstado.tituloCirculo)}"></span>`;

            // Badge Actualizado: Sí / Parcial / No
            const badgeActualizado = `<span class="badge-estado-texto ${evalEstado.badgeClase}"><span class="material-symbols-outlined" style="font-size: 14px;">${evalEstado.badgeIcono}</span> ${evalEstado.badgeTexto}</span>`;

            // Complemento CSS
            const chipCss = `
                <span class="chip-complemento ${estado.cssOk ? 'borde-verde' : 'borde-rojo'}" 
                      title="CSS: ${escapeHtml(item.css)} (${estado.cssOk ? 'En el sistema' : 'No encontrado (404)'})">
                    <span class="material-symbols-outlined">palette</span>
                    <span>CSS</span>
                </span>
            `;

            // Complemento JS
            const chipJs = `
                <span class="chip-complemento ${estado.jsOk ? 'borde-verde' : 'borde-rojo'}" 
                      title="JS: ${escapeHtml(item.js)} (${estado.jsOk ? 'En el sistema' : 'No encontrado (404)'})">
                    <span class="material-symbols-outlined">code</span>
                    <span>JS</span>
                </span>
            `;

            // Celda de Reordenamiento (Solo visible para Admin)
            const celdaOrden = modoAdmin ? `
                <td class="td-orden" style="text-align: center;">
                    <div class="drag-handle-box" title="Arrastra para cambiar el orden de '${escapeHtml(item.nombre)}'">
                        <span class="material-symbols-outlined drag-icon">drag_indicator</span>
                        <span class="orden-numero">${index + 1}</span>
                    </div>
                </td>
            ` : "";

            // Botones de acción (Con flechas de subir/bajar si es Admin)
            const botonesAccion = modoAdmin ? `
                <div class="acciones-fila-wrapper">
                    <button class="btn-mover-fila btn-mover-arriba" data-id="${escapeHtml(id)}" title="Subir una posición" ${index === 0 ? 'disabled' : ''}>
                        <span class="material-symbols-outlined" style="font-size: 16px;">keyboard_arrow_up</span>
                    </button>
                    <button class="btn-mover-fila btn-mover-abajo" data-id="${escapeHtml(id)}" title="Bajar una posición" ${index === totalFiltrados - 1 ? 'disabled' : ''}>
                        <span class="material-symbols-outlined" style="font-size: 16px;">keyboard_arrow_down</span>
                    </button>
                    <button class="btn-recargar-fila" data-id="${escapeHtml(id)}" title="Refrescar este módulo individual">
                        <span class="material-symbols-outlined" style="font-size: 16px;">refresh</span>
                    </button>
                </div>
            ` : `
                <button class="btn-recargar-fila" data-id="${escapeHtml(id)}" title="Refrescar este módulo individual">
                    <span class="material-symbols-outlined" style="font-size: 16px;">refresh</span>
                </button>
            `;

            const draggableAttr = modoAdmin ? `draggable="true" class="fila-draggable"` : "";

            return `
                <tr data-id="${escapeHtml(id)}" data-index="${index}" ${draggableAttr}>
                    ${celdaOrden}
                    <td style="text-align: center;">${circuloHtml}</td>
                    <td>
                        <a href="${resolveRepoUrl(item.ruta)}" target="_blank" class="modulo-link" title="Abrir ${escapeHtml(item.nombre)} en nueva pestaña">
                            <span class="material-symbols-outlined modulo-icono">${escapeHtml(item.icono)}</span>
                            <span class="modulo-titulo">${escapeHtml(item.nombre)}</span>
                        </a>
                    </td>
                    <td style="text-align: center;">
                        <div class="complementos-wrapper">
                            ${chipCss}
                            ${chipJs}
                        </div>
                    </td>
                    <td style="text-align: center;">
                        <span class="badge-version-item">v${escapeHtml(item.version || appVer)}</span>
                    </td>
                    <td style="text-align: center; color: var(--text-muted); font-size: 0.82rem;">${escapeHtml(estado.lastModified || item.fecha || "Reciente")}</td>
                    <td style="text-align: center;">${badgeActualizado}</td>
                    <td style="text-align: center;">${botonesAccion}</td>
                </tr>
            `;
        }).join("");

        // Activar eventos de reordenamiento e interacción
        activarEventosFilas();
    }

    // 4. Activar eventos de interacción y arrastre en las filas
    function activarEventosFilas() {
        if (!tbody) return;

        // Botones individuales de refresco
        tbody.querySelectorAll(".btn-recargar-fila").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const item = listaArchivos.find(f => (f.id || f.ruta) === id);
                if (!item) return;

                btn.innerHTML = `<span class="material-symbols-outlined spin-icon" style="font-size: 16px;">sync</span>`;
                await comprobarItem(item);
                actualizarEstadisticas();
                renderTabla();
            });
        });

        if (!modoAdmin) return;

        // Botones de Mover Arriba / Abajo
        tbody.querySelectorAll(".btn-mover-arriba").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                moverPosicionItem(id, -1);
            });
        });

        tbody.querySelectorAll(".btn-mover-abajo").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                moverPosicionItem(id, 1);
            });
        });

        // Eventos Drag & Drop en filas
        tbody.querySelectorAll("tr.fila-draggable").forEach(tr => {
            tr.addEventListener("dragstart", (e) => {
                draggedId = tr.dataset.id;
                tr.classList.add("fila-dragging");
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", draggedId);
            });

            tr.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";

                const rect = tr.getBoundingClientRect();
                const offset = e.clientY - rect.top;
                if (offset < rect.height / 2) {
                    tr.classList.add("fila-drag-over-top");
                    tr.classList.remove("fila-drag-over-bottom");
                } else {
                    tr.classList.add("fila-drag-over-bottom");
                    tr.classList.remove("fila-drag-over-top");
                }
            });

            tr.addEventListener("dragleave", () => {
                tr.classList.remove("fila-drag-over-top", "fila-drag-over-bottom");
            });

            tr.addEventListener("drop", (e) => {
                e.preventDefault();
                tr.classList.remove("fila-drag-over-top", "fila-drag-over-bottom");
                const targetId = tr.dataset.id;
                if (!draggedId || draggedId === targetId) return;

                const rect = tr.getBoundingClientRect();
                const insertBefore = (e.clientY - rect.top) < (rect.height / 2);
                reordenarPorArrastre(draggedId, targetId, insertBefore);
            });

            tr.addEventListener("dragend", () => {
                tr.classList.remove("fila-dragging");
                tbody.querySelectorAll("tr").forEach(r => r.classList.remove("fila-drag-over-top", "fila-drag-over-bottom"));
                draggedId = null;
            });
        });
    }

    // Mueve un elemento en la lista una posición arriba (-1) o abajo (+1)
    function moverPosicionItem(id, delta) {
        const index = listaArchivos.findIndex(f => (f.id || f.ruta) === id);
        if (index < 0) return;
        const newIndex = index + delta;
        if (newIndex < 0 || newIndex >= listaArchivos.length) return;

        const [item] = listaArchivos.splice(index, 1);
        listaArchivos.splice(newIndex, 0, item);

        registrarCambioDeOrden();
        renderTabla();
    }

    // Reordena un elemento tras un drag & drop
    function reordenarPorArrastre(origenId, destinoId, insertBefore) {
        const indexOrigen = listaArchivos.findIndex(f => (f.id || f.ruta) === origenId);
        const indexDestino = listaArchivos.findIndex(f => (f.id || f.ruta) === destinoId);
        if (indexOrigen < 0 || indexDestino < 0) return;

        const [item] = listaArchivos.splice(indexOrigen, 1);
        let finalIndex = listaArchivos.findIndex(f => (f.id || f.ruta) === destinoId);
        if (!insertBefore) finalIndex += 1;

        listaArchivos.splice(finalIndex, 0, item);

        registrarCambioDeOrden();
        renderTabla();
    }

    // Registra que hubo un cambio de orden y actualiza estado local
    function registrarCambioDeOrden() {
        hayCambiosSinGuardar = true;
        const ordenIds = listaArchivos.map(f => f.id || f.ruta);
        try {
            localStorage.setItem(STORAGE_ORDEN_KEY, JSON.stringify(ordenIds));
        } catch (e) {}

        actualizarUIAdmin();
    }

    // Guardar el orden en Firebase Firestore
    async function guardarOrdenEnFirebase() {
        if (!modoAdmin) {
            mostrarToast("Acceso denegado: Solo el administrador puede guardar.", "lock");
            return;
        }

        const ordenIds = listaArchivos.map(f => f.id || f.ruta);
        try {
            btnGuardarOrden.disabled = true;
            btnGuardarOrden.innerHTML = `<span class="material-symbols-outlined spin-icon">sync</span> Guardando...`;

            if (window.firebaseAPI?.guardarOrdenArchivosSistema) {
                await window.firebaseAPI.guardarOrdenArchivosSistema(ordenIds);
            } else {
                localStorage.setItem(STORAGE_ORDEN_KEY, JSON.stringify(ordenIds));
            }

            hayCambiosSinGuardar = false;
            actualizarUIAdmin();
            mostrarToast("¡Orden guardado exitosamente en Firebase!", "cloud_done");
        } catch (err) {
            console.error("Error guardando orden en Firebase:", err);
            mostrarToast("Error al guardar en Firebase: " + (err.message || err), "error");
        } finally {
            btnGuardarOrden.disabled = false;
            btnGuardarOrden.innerHTML = `<span class="material-symbols-outlined">cloud_upload</span> Guardar Orden`;
        }
    }

    // Restablecer al orden por defecto
    function restablecerOrdenPorDefecto() {
        if (!confirm("¿Deseas restablecer el orden al predeterminado de fábrica?")) return;

        localStorage.removeItem(STORAGE_ORDEN_KEY);
        listaArchivos = [...CATALOGO_DEFAULT];
        hayCambiosSinGuardar = true;
        actualizarUIAdmin();
        renderTabla();
        mostrarToast("Orden restablecido. Presiona 'Guardar Orden' para confirmar en la nube.", "restart_alt");
    }

    // Abrir modal con el código JSON ordenado para compartir
    function abrirModalCompartir() {
        const ordenJson = JSON.stringify(listaArchivos, null, 2);
        if (textareaCodigo) textareaCodigo.value = ordenJson;
        if (modalCompartir) modalCompartir.style.display = "flex";

        // Copiar automáticamente al portapapeles
        try {
            navigator.clipboard.writeText(ordenJson).then(() => {
                mostrarToast("¡Código copiado al portapapeles! Compártemelo en el chat.", "content_copy");
            });
        } catch (e) {
            console.warn("No se pudo copiar automáticamente:", e);
        }
    }

    function cerrarModalCompartir() {
        if (modalCompartir) modalCompartir.style.display = "none";
    }

    // 5. Actualizar contadores de estadísticas
    function actualizarEstadisticas() {
        const total = listaArchivos.length;
        let completos = 0;
        let incompletos = 0;
        let faltantes = 0;

        listaArchivos.forEach(item => {
            const ev = evaluarEstadoModulo(item);
            if (ev.color === "verde") completos++;
            else if (ev.color === "amarillo") incompletos++;
            else faltantes++;
        });

        if (statTotal) statTotal.textContent = total;
        if (statOk) statOk.textContent = completos;
        if (statParcial) statParcial.textContent = incompletos;
        if (statFaltantes) statFaltantes.textContent = faltantes;
    }

    function escapeHtml(str) {
        return (str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Eventos de filtros y búsqueda
    if (inputBuscar) inputBuscar.addEventListener("input", renderTabla);
    if (selectTipo) selectTipo.addEventListener("change", renderTabla);
    if (selectEstado) selectEstado.addEventListener("change", renderTabla);
    if (btnComprobar) btnComprobar.addEventListener("click", comprobarArchivosEnVivo);

    // Eventos de botones de Administrador
    if (btnGuardarOrden) btnGuardarOrden.addEventListener("click", guardarOrdenEnFirebase);
    if (btnCopiarOrden) btnCopiarOrden.addEventListener("click", abrirModalCompartir);
    if (btnRestablecerOrden) btnRestablecerOrden.addEventListener("click", restablecerOrdenPorDefecto);

    // Eventos de Modal
    if (btnCerrarModal) btnCerrarModal.addEventListener("click", cerrarModalCompartir);
    if (btnCancelarModal) btnCancelarModal.addEventListener("click", cerrarModalCompartir);
    if (modalCompartir) {
        modalCompartir.addEventListener("click", (e) => {
            if (e.target === modalCompartir) cerrarModalCompartir();
        });
    }
    if (btnCopiarPortapapeles) {
        btnCopiarPortapapeles.addEventListener("click", () => {
            if (textareaCodigo) {
                textareaCodigo.select();
                navigator.clipboard.writeText(textareaCodigo.value).then(() => {
                    mostrarToast("¡Código copiado al portapapeles!", "content_copy");
                    cerrarModalCompartir();
                });
            }
        });
    }

    // Escuchar eventos de autenticación
    if (window.firebaseAPI?.onAuthReady) {
        window.firebaseAPI.onAuthReady((user, isAdmin) => {
            modoAdmin = !!isAdmin;
            actualizarUIAdmin();
            renderTabla();
        });
    } else {
        verificarAdmin();
    }

    window.addEventListener("lh-user-changed", () => {
        verificarAdmin();
        renderTabla();
    });

    window.addEventListener("lh-access-control-updated", () => {
        verificarAdmin();
        renderTabla();
    });

    // Inicializar
    verificarAdmin();
    await cargarInventario();
    setTimeout(comprobarArchivosEnVivo, 400);
});
