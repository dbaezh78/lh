/**
 * src/js/system.js - Controlador de Archivos del Sistema (system.html)
 * Verifica el estado en vivo de cada archivo, versión, fecha y estado de sincronización.
 */

document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("tbody-archivos-sistema");
    const statTotal = document.getElementById("stat-total");
    const statOk = document.getElementById("stat-ok");
    const statFaltantes = document.getElementById("stat-faltantes");
    const statVersion = document.getElementById("stat-version");
    const inputBuscar = document.getElementById("input-buscar-archivo");
    const selectTipo = document.getElementById("select-filtro-tipo");
    const selectEstado = document.getElementById("select-filtro-estado");
    const btnComprobar = document.getElementById("btn-comprobar-archivos");

    const appVer = window.APP_VERSION || "1.0.01";
    if (statVersion) statVersion.textContent = `v${appVer}`;

    let listaArchivos = [];
    let estadosArchivos = {}; // ruta -> { exists: boolean, status: number, lastModified: string }

    // 1. Cargar inventario de archivos del sistema
    async function cargarInventario() {
        try {
            const resp = await fetch(`../data/system_files.json?_v=${Date.now()}`);
            if (!resp.ok) throw new Error("No se pudo cargar system_files.json");
            listaArchivos = await resp.json();
        } catch (err) {
            console.warn("Aviso: cargando lista de respaldo para archivos del sistema:", err);
            // Respaldo de archivos esenciales si fallara el fetch directo
            listaArchivos = [
                { nombre: "index.html", ruta: "index.html", size: 4500, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "aCtrl.html", ruta: "src/html/aCtrl.html", size: 14000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "ver.html", ruta: "src/html/ver.html", size: 8500, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "system.html", ruta: "src/html/system.html", size: 8500, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "form_etiempo.html", ruta: "src/html/form_etiempo.html", size: 12000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "añoliturgico.html", ruta: "src/html/añoliturgico.html", size: 4500, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "nombresanto.html", ruta: "src/html/nombresanto.html", size: 25000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "santo.html", ruta: "src/html/santo.html", size: 8000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "datos.html", ruta: "src/html/datos.html", size: 10000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "navigator.js", ruta: "src/js/navigator.js", size: 44000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "aCtrl-ui.js", ruta: "src/js/aCtrl-ui.js", size: 25000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "accesscontrol.js", ruta: "src/js/accesscontrol.js", size: 32000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "firebase-config.js", ruta: "src/js/firebase-config.js", size: 12000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "setting.js", ruta: "src/js/setting.js", size: 75000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "form_etiempo.js", ruta: "src/js/form_etiempo.js", size: 28000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "añoliturgico.js", ruta: "src/js/añoliturgico.js", size: 24000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "ver.js", ruta: "src/js/ver.js", size: 12000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "system.js", ruta: "src/js/system.js", size: 10000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "navigator.css", ruta: "src/css/navigator.css", size: 16000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "aCtrl.css", ruta: "src/css/aCtrl.css", size: 11000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "ver.css", ruta: "src/css/ver.css", size: 8500, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "system.css", ruta: "src/css/system.css", size: 7500, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "setting.css", ruta: "src/css/setting.css", size: 17000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "buttons.css", ruta: "src/css/buttons.css", size: 15000, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "icono.png", ruta: "src/img/icono.png", size: 8500, fecha: "2026-09-16 12:00:00", version: appVer },
                { nombre: "liturgia_reloj.jpg", ruta: "src/img/liturgia_reloj.jpg", size: 95000, fecha: "2026-09-16 12:00:00", version: appVer }
            ];
        }

        // Marcar estado por defecto como verificado
        listaArchivos.forEach(f => {
            estadosArchivos[f.ruta] = { exists: true, status: 200 };
        });

        actualizarEstadisticas();
        renderTabla();
    }

    // 2. Comprobación activa de existencia vía HEAD o GET
    async function comprobarArchivosEnVivo() {
        if (btnComprobar) {
            btnComprobar.disabled = true;
            btnComprobar.innerHTML = `<span class="material-symbols-outlined spin-icon">sync</span> Comprobando...`;
        }

        let procesados = 0;
        const total = listaArchivos.length;

        // Probar en lotes de 10 para máxima velocidad
        const batchSize = 10;
        for (let i = 0; i < total; i += batchSize) {
            const batch = listaArchivos.slice(i, i + batchSize);
            await Promise.all(batch.map(async (file) => {
                const targetUrl = `/${file.ruta}?_t=${Date.now()}`;
                try {
                    const res = await fetch(targetUrl, { method: "HEAD", cache: "no-store" });
                    const exists = res.ok || (res.status >= 200 && res.status < 400);
                    estadosArchivos[file.ruta] = {
                        exists: exists,
                        status: res.status,
                        lastModified: res.headers.get("last-modified") || null
                    };
                } catch (e) {
                    // Fallback con GET ligero si HEAD no estuviese soportado
                    try {
                        const resGet = await fetch(targetUrl, { method: "GET", cache: "no-store" });
                        estadosArchivos[file.ruta] = { exists: resGet.ok, status: resGet.status };
                    } catch (e2) {
                        estadosArchivos[file.ruta] = { exists: false, status: 404 };
                    }
                }
            }));
            procesados += batch.length;
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
            const estado = estadosArchivos[item.ruta] || { exists: true };
            const estaEnSistema = estado.exists;

            // Filtro de búsqueda
            if (busqueda) {
                const matchNombre = (item.nombre || "").toLowerCase().includes(busqueda);
                const matchRuta = (item.ruta || "").toLowerCase().includes(busqueda);
                if (!matchNombre && !matchRuta) return false;
            }

            // Filtro de tipo
            if (filtroTipo !== "todos") {
                const ext = item.nombre.split(".").pop().toLowerCase();
                if (filtroTipo === "html" && ext !== "html") return false;
                if (filtroTipo === "js" && ext !== "js") return false;
                if (filtroTipo === "css" && ext !== "css") return false;
                if (filtroTipo === "img" && !["png", "jpg", "jpeg", "ico", "gif", "svg"].includes(ext)) return false;
                if (filtroTipo === "font" && !["woff2", "woff", "ttf", "eot"].includes(ext)) return false;
            }

            // Filtro de estado
            if (filtroEstado === "actualizado" && !estaEnSistema) return false;
            if (filtroEstado === "error" && estaEnSistema) return false;

            return true;
        });

        if (filtrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 36px; color: var(--text-muted);">
                        <span class="material-symbols-outlined" style="font-size: 36px; opacity: 0.5;">search_off</span>
                        <p style="margin: 8px 0 0 0;">No se encontraron archivos que coincidan con los filtros seleccionados.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtrados.map(item => {
            const estado = estadosArchivos[item.ruta] || { exists: true };
            const ok = estado.exists;

            // Círculo relleno: Verde si está en el sistema / Rojo si no está
            const circuloHtml = ok
                ? `<span class="circulo-estado verde" title="En el sistema (Verificado)"></span>`
                : `<span class="circulo-estado rojo" title="No está en el sistema (Faltante)"></span>`;

            const badgeActualizado = ok
                ? `<span class="badge-estado-texto si"><span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span> Sí</span>`
                : `<span class="badge-estado-texto no"><span class="material-symbols-outlined" style="font-size: 14px;">cancel</span> No</span>`;

            const linkRuta = ok
                ? `<a href="/${escapeHtml(item.ruta)}" target="_blank" class="ruta-codigo" style="text-decoration: none; color: inherit;">/${escapeHtml(item.ruta)}</a>`
                : `<span class="ruta-codigo" style="color: #e53935;">/${escapeHtml(item.ruta)}</span>`;

            return `
                <tr>
                    <td style="text-align: center;">${circuloHtml}</td>
                    <td>
                        <strong style="color: var(--text-color);">${escapeHtml(item.nombre)}</strong>
                    </td>
                    <td>${linkRuta}</td>
                    <td style="text-align: center;">
                        <span class="badge-version-item">v${escapeHtml(item.version || appVer)}</span>
                    </td>
                    <td style="color: var(--text-muted); font-size: 0.82rem;">${escapeHtml(item.fecha || "Reciente")}</td>
                    <td style="text-align: center;">${badgeActualizado}</td>
                    <td style="text-align: center;">
                        <button class="btn-recargar-fila" data-ruta="${escapeHtml(item.ruta)}" title="Refrescar este archivo individual">
                            <span class="material-symbols-outlined" style="font-size: 16px;">refresh</span>
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        // Eventos a botones individuales de refresco
        tbody.querySelectorAll(".btn-recargar-fila").forEach(btn => {
            btn.addEventListener("click", async () => {
                const ruta = btn.dataset.ruta;
                btn.innerHTML = `<span class="material-symbols-outlined spin-icon" style="font-size: 16px;">sync</span>`;
                try {
                    const res = await fetch(`/${ruta}?_r=${Date.now()}`, { cache: "reload" });
                    estadosArchivos[ruta] = { exists: res.ok, status: res.status };
                } catch (e) {
                    estadosArchivos[ruta] = { exists: false, status: 404 };
                }
                actualizarEstadisticas();
                renderTabla();
            });
        });
    }

    // 4. Actualizar contadores
    function actualizarEstadisticas() {
        const total = listaArchivos.length;
        let oks = 0;
        let faltantes = 0;

        listaArchivos.forEach(f => {
            const st = estadosArchivos[f.ruta];
            if (st && st.exists) oks++;
            else if (st && !st.exists) faltantes++;
            else oks++; // Por defecto en el catálogo inicial
        });

        if (statTotal) statTotal.textContent = total;
        if (statOk) statOk.textContent = oks;
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

    // Eventos de filtros
    if (inputBuscar) inputBuscar.addEventListener("input", renderTabla);
    if (selectTipo) selectTipo.addEventListener("change", renderTabla);
    if (selectEstado) selectEstado.addEventListener("change", renderTabla);
    if (btnComprobar) btnComprobar.addEventListener("click", comprobarArchivosEnVivo);

    // Inicializar
    await cargarInventario();
    // Ejecutar verificación en vivo inicial tras render inicial
    setTimeout(comprobarArchivosEnVivo, 600);
});
