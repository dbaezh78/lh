/**
 * Formulario del Cambio Litúrgico (form_etiempo.js)
 * Manejo algorítmico y editable de los hitos litúrgicos de la Iglesia Católica por año.
 * Liturgia de las Horas
 */

// Tabla predeterminada de Miércoles de Ceniza y Pascua (2024 - 2040)
export const TABLA_CENIZA_BASE = {
    2024: { ceniza: "2024-02-14", pascua: "2024-03-31" },
    2025: { ceniza: "2025-03-05", pascua: "2025-04-20" },
    2026: { ceniza: "2026-02-18", pascua: "2026-04-05" },
    2027: { ceniza: "2027-02-10", pascua: "2027-03-28" },
    2028: { ceniza: "2028-03-01", pascua: "2028-04-16" },
    2029: { ceniza: "2029-02-14", pascua: "2029-04-01" },
    2030: { ceniza: "2030-03-06", pascua: "2030-04-21" },
    2031: { ceniza: "2031-02-26", pascua: "2031-04-13" },
    2032: { ceniza: "2032-02-11", pascua: "2032-03-28" },
    2033: { ceniza: "2033-03-02", pascua: "2033-04-17" },
    2034: { ceniza: "2034-02-22", pascua: "2034-04-09" },
    2035: { ceniza: "2035-02-07", pascua: "2035-03-25" },
    2036: { ceniza: "2036-02-27", pascua: "2036-04-13" },
    2037: { ceniza: "2037-02-18", pascua: "2037-04-05" },
    2038: { ceniza: "2038-03-10", pascua: "2038-04-25" },
    2039: { ceniza: "2039-02-23", pascua: "2039-04-10" },
    2040: { ceniza: "2040-02-15", pascua: "2040-04-01" }
};

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/**
 * Calcula el Domingo más cercano al 30 de noviembre para un año dado.
 * Siempre cae entre el 27 de noviembre y el 3 de diciembre.
 */
export function calcularInicioAdviento(year) {
    const nov30 = new Date(year, 10, 30); // Mes 10 es Noviembre (0-indexed)
    const day = nov30.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    const delta = day === 0 ? 0 : (day <= 3 ? -day : 7 - day);
    const domingoAdviento = new Date(year, 10, 30 + delta);
    return formatearFechaISO(domingoAdviento);
}

/**
 * Formatea un objeto Date a formato YYYY-MM-DD
 */
export function formatearFechaISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/**
 * Parsea fecha YYYY-MM-DD asegurando no desfase de huso horario
 */
export function parsearFechaISO(str) {
    if (!str) return new Date();
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
}

/**
 * Verifica si el switch de Adviento(Par/Impar) está activo en configuraciones
 */
export function esAdvientoParImparActivo() {
    if (typeof localStorage === 'undefined') return true;
    const val = localStorage.getItem('pref-adviento-par-impar');
    return val === null ? true : (val === 'true' || val === true);
}

/**
 * Determina si un año o fecha es Par o Impar tomando en cuenta la regla de Adviento
 */
export function obtenerParidadAño(yearOrDate) {
    if (yearOrDate instanceof Date || (typeof yearOrDate === 'string' && yearOrDate.includes('-'))) {
        const d = (yearOrDate instanceof Date) ? yearOrDate : parsearFechaISO(yearOrDate);
        const y = d.getFullYear();
        if (!esAdvientoParImparActivo()) {
            return (y % 2 === 0) ? 'Par' : 'Impar';
        }
        const advientoDate = parsearFechaISO(calcularInicioAdviento(y));
        if (d >= advientoDate) {
            const añoLiturgico = y + 1;
            return (añoLiturgico % 2 === 0) ? 'Par' : 'Impar';
        }
        return (y % 2 === 0) ? 'Par' : 'Impar';
    }
    const y = parseInt(yearOrDate, 10);
    return (y % 2 === 0) ? 'Par' : 'Impar';
}

/**
 * Determina el ciclo dominical (A, B, C) tomando en cuenta la regla de Adviento
 * 2026: Ciclo A, 2027: Ciclo B, 2028: Ciclo C
 */
export function obtenerCicloDominical(yearOrDate) {
    let y = 2026;
    if (yearOrDate instanceof Date || (typeof yearOrDate === 'string' && yearOrDate.includes('-'))) {
        const d = (yearOrDate instanceof Date) ? yearOrDate : parsearFechaISO(yearOrDate);
        y = d.getFullYear();
        if (esAdvientoParImparActivo()) {
            const advientoDate = parsearFechaISO(calcularInicioAdviento(y));
            if (d >= advientoDate) {
                y = y + 1;
            }
        }
    } else {
        y = parseInt(yearOrDate, 10);
    }
    const ciclos = ['A', 'B', 'C'];
    const indice = (((y - 2026) % 3) + 3) % 3;
    return ciclos[indice];
}

/**
 * Obtiene o calcula los hitos litúrgicos principales para un año
 */
export function generarHitosLiturgicos(year) {
    const y = parseInt(year, 10);
    const claveStorage = `lh-hitos-liturgicos-${y}`;
    const guardado = (typeof localStorage !== 'undefined') ? localStorage.getItem(claveStorage) : null;
    if (guardado) {
        try {
            return JSON.parse(guardado);
        } catch (e) {
            console.warn("Error leyendo hitos guardados:", e);
        }
    }

    // Calcular hitos estándar del año litúrgico
    // 1. Adviento del año previo (que rige la mayor parte de las semanas litúrgicas hasta el siguiente Adviento)
    const advientoPrevio = calcularInicioAdviento(y - 1);
    const advientoEsteAño = calcularInicioAdviento(y);

    // 2. Epifanía (6 de enero) y Bautismo del Señor (domingo siguiente)
    const epifania = new Date(y, 0, 6);
    const diaEpif = epifania.getDay();
    const deltaBautismo = diaEpif === 0 ? 7 : (7 - diaEpif);
    const bautismoDate = new Date(y, 0, 6 + deltaBautismo);
    const bautismo = formatearFechaISO(bautismoDate);

    // 3. Inicio Tiempo Ordinario I: Lunes después del Bautismo
    const ordinarioInicioDate = new Date(bautismoDate);
    ordinarioInicioDate.setDate(ordinarioInicioDate.getDate() + 1);
    const ordinarioInicio = formatearFechaISO(ordinarioInicioDate);

    // 4. Miércoles de Ceniza y Pascua
    let ceniza = `${y}-02-18`;
    let pascua = `${y}-04-05`;
    if (TABLA_CENIZA_BASE[y]) {
        ceniza = TABLA_CENIZA_BASE[y].ceniza;
        pascua = TABLA_CENIZA_BASE[y].pascua;
    } else {
        // Cálculo eclesiástico exacto (Computus Meeus/Jones) para cualquier año
        const calc = (typeof window !== 'undefined' && typeof window.calcularPascuaGregoriana === 'function')
            ? window.calcularPascuaGregoriana(y)
            : calcularPascuaGregorianaAlgoritmo(y);
        ceniza = calc.ceniza;
        pascua = calc.pascua;
    }

    // 5. Cuaresma: Semana Santa y Triduo
    const pascuaDate = parsearFechaISO(pascua);
    const ramosDate = new Date(pascuaDate);
    ramosDate.setDate(ramosDate.getDate() - 7);
    const ramos = formatearFechaISO(ramosDate);

    const juevesSantoDate = new Date(pascuaDate);
    juevesSantoDate.setDate(juevesSantoDate.getDate() - 3);
    const juevesSanto = formatearFechaISO(juevesSantoDate);

    const viernesSantoDate = new Date(pascuaDate);
    viernesSantoDate.setDate(viernesSantoDate.getDate() - 2);
    const viernesSanto = formatearFechaISO(viernesSantoDate);

    const sabadoSantoDate = new Date(pascuaDate);
    sabadoSantoDate.setDate(sabadoSantoDate.getDate() - 1);
    const sabadoSanto = formatearFechaISO(sabadoSantoDate);

    // 6. Pascua: Octava y Pentecostés (49 días después de Pascua)
    const pentecostesDate = new Date(pascuaDate);
    pentecostesDate.setDate(pentecostesDate.getDate() + 49);
    const pentecostes = formatearFechaISO(pentecostesDate);

    // 7. Reanudación Tiempo Ordinario II: Lunes después de Pentecostés
    const ordinarioIIDate = new Date(pentecostesDate);
    ordinarioIIDate.setDate(ordinarioIIDate.getDate() + 1);
    const ordinarioII = formatearFechaISO(ordinarioIIDate);

    // 8. Cristo Rey (Domingo antes de Adviento de este año) - Semana 34 obligatoria
    const advientoDate = parsearFechaISO(advientoEsteAño);
    const cristoReyDate = new Date(advientoDate);
    cristoReyDate.setDate(cristoReyDate.getDate() - 7);
    const cristoRey = formatearFechaISO(cristoReyDate);

    // Cálculo exacto de la semana en que reanuda el Tiempo Ordinario para culminar en la Semana 34
    const diffSemanas = Math.round((cristoReyDate - pentecostesDate) / (7 * 86400000));
    const semReanudacion = 34 - diffSemanas;

    // 9. La Santísima Trinidad (Domingo siguiente a Pentecostés)
    const trinidadDate = new Date(pentecostesDate);
    trinidadDate.setDate(trinidadDate.getDate() + 7);
    const trinidad = formatearFechaISO(trinidadDate);

    return [
        {
            id: "epifania",
            tiempo: "Navidad",
            nombre: "La Epifanía del Señor",
            fecha: `${y}-01-06`,
            fijo: true,
            descripcion: "Siempre el 6 de enero"
        },
        {
            id: "bautismo",
            tiempo: "Navidad",
            nombre: "El Bautismo del Señor",
            fecha: bautismo,
            fijo: false,
            descripcion: "Domingo siguiente a la Epifanía"
        },
        {
            id: "ordinario-1",
            tiempo: "Ordinario",
            nombre: "Inicio del Tiempo Ordinario (I)",
            fecha: ordinarioInicio,
            fijo: false,
            descripcion: "Lunes después del Bautismo del Señor (Semana 1)"
        },
        {
            id: "ceniza",
            tiempo: "Cuaresma",
            nombre: "Miércoles de Ceniza (Inicio de Cuaresma)",
            fecha: ceniza,
            fijo: false,
            descripcion: "Fecha móvil definida por la Pascua"
        },
        {
            id: "ramos",
            tiempo: "Cuaresma",
            nombre: "Domingo de Ramos (Semana Santa)",
            fecha: ramos,
            fijo: false,
            descripcion: "Domingo previo a la Resurrección"
        },
        {
            id: "jueves-santo",
            tiempo: "Cuaresma",
            nombre: "Jueves Santo",
            fecha: juevesSanto,
            fijo: false,
            descripcion: "Triduo Pascual"
        },
        {
            id: "viernes-santo",
            tiempo: "Cuaresma",
            nombre: "Viernes Santo",
            fecha: viernesSanto,
            fijo: false,
            descripcion: "Pasión del Señor"
        },
        {
            id: "sabado-santo",
            tiempo: "Cuaresma",
            nombre: "Sábado Santo",
            fecha: sabadoSanto,
            fijo: false,
            descripcion: "Sepultura del Señor y Vigilia Pascual"
        },
        {
            id: "pascua",
            tiempo: "Pascua",
            nombre: "Domingo de Resurrección (Pascua)",
            fecha: pascua,
            fijo: false,
            descripcion: "Inicio del Tiempo Pascual (8va de Pascua)"
        },
        {
            id: "pentecostes",
            tiempo: "Pascua",
            nombre: "Domingo de Pentecostés",
            fecha: pentecostes,
            fijo: false,
            descripcion: "Cierre del Tiempo Pascual (50 días tras Pascua)"
        },
        {
            id: "ordinario-2",
            tiempo: "Ordinario",
            nombre: `Reanudación del Tiempo Ordinario (Semana ${semReanudacion})`,
            fecha: ordinarioII,
            fijo: false,
            descripcion: `Lunes posterior a Pentecostés (Continúa en Semana ${semReanudacion} para culminar en Semana 34)`
        },
        {
            id: "trinidad",
            tiempo: "Ordinario",
            nombre: "La Santísima Trinidad",
            fecha: trinidad,
            fijo: false,
            descripcion: `Domingo siguiente a Pentecostés (${semReanudacion + 1}º Domingo del Tiempo Ordinario)`
        },
        {
            id: "cristo-rey",
            tiempo: "Ordinario",
            nombre: "Jesucristo, Rey del Universo (Semana 34)",
            fecha: cristoRey,
            fijo: false,
            descripcion: "Último domingo del Tiempo Ordinario antes de Adviento (Semana 34 obligatoria)"
        },
        {
            id: "adviento",
            tiempo: "Adviento",
            nombre: "Inicio de Adviento (I Domingo de Adviento)",
            fecha: advientoEsteAño,
            fijo: false,
            descripcion: "Domingo más cercano al 30 de noviembre (27 Nov - 3 Dic)"
        },
        {
            id: "feria-adviento",
            tiempo: "Adviento",
            nombre: "Ferias de Adviento",
            fecha: `${y}-12-17`,
            fijo: true,
            descripcion: "17 al 24 de diciembre"
        },
        {
            id: "navidad",
            tiempo: "Navidad",
            nombre: "La Natividad del Señor (Navidad)",
            fecha: `${y}-12-25`,
            fijo: true,
            descripcion: "1er día de la Octava de Navidad"
        }
    ];
}

/**
 * Guarda los hitos litúrgicos en localStorage
 */
export function guardarHitosLiturgicos(year, hitos) {
    const y = parseInt(year, 10);
    localStorage.setItem(`lh-hitos-liturgicos-${y}`, JSON.stringify(hitos));
}

export function calcularPascuaGregorianaAlgoritmo(year) {
    const y = parseInt(year, 10);
    const a = y % 19;
    const b = Math.floor(y / 100);
    const c = y % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    const pDate = new Date(y, mes - 1, dia);
    const cDate = new Date(pDate);
    cDate.setDate(cDate.getDate() - 46);
    const mStr = String(pDate.getMonth() + 1).padStart(2, '0');
    const dStr = String(pDate.getDate()).padStart(2, '0');
    const cmStr = String(cDate.getMonth() + 1).padStart(2, '0');
    const cdStr = String(cDate.getDate()).padStart(2, '0');
    return { ceniza: `${y}-${cmStr}-${cdStr}`, pascua: `${y}-${mStr}-${dStr}` };
}

// Inicialización de la interfaz en form_etiempo.html
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
    const selectAño = document.getElementById('select-año');
    const badgeParidad = document.getElementById('badge-paridad');
    const badgeCiclo = document.getElementById('badge-ciclo');
    const cuerpoTabla = document.getElementById('cuerpo-tabla-hitos');
    const btnGuardar = document.getElementById('btn-guardar-hitos');
    const btnRestablecer = document.getElementById('btn-restablecer-hitos');
    const bannerNotificacion = document.getElementById('banner-notificacion');
    const formAgregar = document.getElementById('form-agregar-cambio');

    if (!selectAño || !cuerpoTabla) return;

    // Poblar select-año dinámicamente según catálogo de datos.html
    const aniosDisponibles = (typeof window !== 'undefined' && typeof window.obtenerCatalogoAños === 'function')
        ? window.obtenerCatalogoAños()
        : [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];

    const añoGuardado = localStorage.getItem('pref-año-etiempo');
    const valorInicial = añoGuardado && aniosDisponibles.includes(parseInt(añoGuardado, 10))
        ? parseInt(añoGuardado, 10)
        : (aniosDisponibles.includes(2026) ? 2026 : aniosDisponibles[0]);

    selectAño.innerHTML = aniosDisponibles.map(y => `
        <option value="${y}" ${y === valorInicial ? 'selected' : ''}>${y}${y === 2026 ? ' (Actual)' : ''}</option>
    `).join('');

    let añoActual = parseInt(selectAño.value, 10) || new Date().getFullYear();
    let hitosActuales = [];
    let indiceHitoEnEdicion = -1;

    function resetearFormularioEdicion() {
        indiceHitoEnEdicion = -1;
        if (formAgregar) formAgregar.reset();
        const btnSubmit = document.getElementById('btn-submit-cambio');
        const btnCancelar = document.getElementById('btn-cancelar-edicion-cambio');
        const iconoSubmit = document.getElementById('icono-submit-cambio');
        const textoSubmit = document.getElementById('texto-submit-cambio');

        if (btnCancelar) btnCancelar.style.display = 'none';
        if (btnSubmit) {
            btnSubmit.style.background = '';
            if (iconoSubmit) iconoSubmit.textContent = 'add';
            if (textoSubmit) textoSubmit.textContent = 'Agregar a la Tabla';
        }
    }

    const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion-cambio');
    if (btnCancelarEdicion) {
        btnCancelarEdicion.addEventListener('click', resetearFormularioEdicion);
    }

    function mostrarMensaje(texto, tipo = 'exito') {
        if (!bannerNotificacion) return;
        bannerNotificacion.textContent = texto;
        bannerNotificacion.className = `banner-notificacion ${tipo === 'exito' ? 'banner-exito' : 'banner-info'}`;
        bannerNotificacion.style.display = 'block';
        setTimeout(() => {
            bannerNotificacion.style.display = 'none';
        }, 4000);
    }

    function actualizarBadges() {
        const paridad = obtenerParidadAño(añoActual);
        const ciclo = obtenerCicloDominical(añoActual);

        if (badgeParidad) {
            badgeParidad.textContent = `Año ${paridad}`;
            badgeParidad.className = `badge-info ${paridad === 'Par' ? 'badge-par' : 'badge-impar'}`;
        }
        if (badgeCiclo) {
            badgeCiclo.textContent = `Ciclo Dominical ${ciclo}`;
        }
    }

    function renderTabla() {
        cuerpoTabla.innerHTML = '';
        actualizarBadges();

        const puedeCambiarFecha = (typeof window.hasPermission !== 'function') || window.hasPermission('cambio_liturgico_cambiar_fecha');
        const puedeBorrar = (typeof window.hasPermission !== 'function') || window.hasPermission('cambio_liturgico_borrar');
        const puedeEditar = (typeof window.hasPermission !== 'function') || window.hasPermission('cambio_liturgico_editar');

        actualizarEstadoPermisosGlobales();

        hitosActuales.forEach((hito, index) => {
            const tr = document.createElement('tr');
            const fechaObj = parsearFechaISO(hito.fecha);
            const diaSemanaNombre = DIAS_SEMANA[fechaObj.getDay()] || '';
            const tagClass = `tag-${hito.tiempo.toLowerCase()}`;

            const inputFechaHtml = puedeCambiarFecha 
                ? `<input type="date" class="input-fecha-tabla" value="${hito.fecha}" data-index="${index}">`
                : `<input type="date" class="input-fecha-tabla" value="${hito.fecha}" disabled style="opacity: 0.5; cursor: not-allowed;" title="Sin permiso para cambiar fecha">`;

            const btnEditarHtml = `
                <button type="button" class="btn-mini-accion" data-editar="${index}" 
                        ${puedeEditar ? '' : 'disabled'} 
                        style="background:${puedeEditar ? '#e0f2fe' : '#f1f5f9'}; color:${puedeEditar ? '#0288d1' : '#94a3b8'}; border:1px solid ${puedeEditar ? '#b3e5fc' : '#cbd5e1'}; margin-right:4px; opacity:${puedeEditar ? '1' : '0.45'}; cursor:${puedeEditar ? 'pointer' : 'not-allowed'};" 
                        title="${puedeEditar ? 'Editar este cambio' : 'Sin permiso para editar'}">
                    <span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">edit</span>
                </button>`;

            const btnBorrarHtml = `
                <button type="button" class="btn-mini-accion btn-danger" data-borrar="${index}" 
                        ${puedeBorrar ? '' : 'disabled'} 
                        style="opacity:${puedeBorrar ? '1' : '0.45'}; cursor:${puedeBorrar ? 'pointer' : 'not-allowed'}; background:${puedeBorrar ? '' : '#e2e8f0'}; color:${puedeBorrar ? '' : '#94a3b8'}; border:${puedeBorrar ? '' : '1px solid #cbd5e1'};" 
                        title="${puedeBorrar ? 'Eliminar este cambio' : 'Sin permiso para eliminar'}">
                    <span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">delete</span>
                </button>`;

            tr.innerHTML = `
                <td><span class="tag-tiempo ${tagClass}">${hito.tiempo}</span></td>
                <td><strong class="col-nombre-hito">${hito.nombre}</strong></td>
                <td>${inputFechaHtml}</td>
                <td><span class="badge-fecha">${diaSemanaNombre}</span></td>
                <td><small style="color: #666;">${hito.descripcion || '-'}</small></td>
                <td>
                    ${btnEditarHtml}
                    ${btnBorrarHtml}
                </td>
            `;
            cuerpoTabla.appendChild(tr);
        });

        // Eventos en inputs de fecha dentro de la tabla
        cuerpoTabla.querySelectorAll('.input-fecha-tabla').forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                if (hitosActuales[idx]) {
                    hitosActuales[idx].fecha = e.target.value;
                    renderTabla();
                }
            });
        });

        // Eventos para editar hito
        cuerpoTabla.querySelectorAll('button[data-editar]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.dataset.editar, 10);
                const item = hitosActuales[idx];
                if (!item) return;

                indiceHitoEnEdicion = idx;
                
                const selectTiempo = document.getElementById('nuevo-tiempo');
                const inputNombre = document.getElementById('nuevo-nombre');
                const inputFecha = document.getElementById('nueva-fecha');
                const inputDesc = document.getElementById('nueva-desc');
                const btnSubmit = document.getElementById('btn-submit-cambio');
                const btnCancelar = document.getElementById('btn-cancelar-edicion-cambio');
                const iconoSubmit = document.getElementById('icono-submit-cambio');
                const textoSubmit = document.getElementById('texto-submit-cambio');

                if (selectTiempo) selectTiempo.value = item.tiempo;
                if (inputNombre) inputNombre.value = item.nombre || '';
                if (inputFecha) inputFecha.value = item.fecha || '';
                if (inputDesc) inputDesc.value = item.descripcion || '';

                if (btnCancelar) btnCancelar.style.display = 'inline-flex';
                if (btnSubmit) {
                    btnSubmit.style.background = '#0288d1';
                    if (iconoSubmit) iconoSubmit.textContent = 'check';
                    if (textoSubmit) textoSubmit.textContent = 'Guardar Edición';
                }

                // Desplazar la vista suavemente al formulario
                const seccionForm = document.querySelector('.seccion-form');
                if (seccionForm) {
                    seccionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                if (inputNombre) inputNombre.focus();
            });
        });

        // Eventos para eliminar hito
        cuerpoTabla.querySelectorAll('button[data-borrar]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.dataset.borrar, 10);
                if (confirm(`¿Eliminar "${hitosActuales[idx].nombre}"?`)) {
                    hitosActuales.splice(idx, 1);
                    renderTabla();
                }
            });
        });
    }

    function cargarAño(y) {
        añoActual = y;
        selectAño.value = y;
        hitosActuales = generarHitosLiturgicos(y);
        renderTabla();
    }

    selectAño.addEventListener('change', (e) => {
        cargarAño(parseInt(e.target.value, 10));
    });

    if (btnGuardar) {
        btnGuardar.addEventListener('click', () => {
            if (typeof window.hasPermission === 'function' && !window.hasPermission('cambio_liturgico_guardar')) {
                alert("No tienes permiso para guardar cambios litúrgicos.");
                return;
            }
            guardarHitosLiturgicos(añoActual, hitosActuales);
            mostrarMensaje(`Los cambios litúrgicos para el año ${añoActual} se han guardado con éxito.`, 'exito');
        });
    }

    if (btnRestablecer) {
        btnRestablecer.addEventListener('click', () => {
            if (typeof window.hasPermission === 'function' && !window.hasPermission('cambio_liturgico_restablecer')) {
                alert("No tienes permiso para restablecer valores originales.");
                return;
            }
            if (confirm(`¿Restablecer los cambios litúrgicos del año ${añoActual} a los valores predeterminados?`)) {
                localStorage.removeItem(`lh-hitos-liturgicos-${añoActual}`);
                hitosActuales = generarHitosLiturgicos(añoActual);
                renderTabla();
                mostrarMensaje(`Se restablecieron los hitos litúrgicos del año ${añoActual}.`, 'info');
            }
        });
    }

    if (formAgregar) {
        formAgregar.addEventListener('submit', (e) => {
            e.preventDefault();
            const esEdicion = (indiceHitoEnEdicion >= 0 && hitosActuales[indiceHitoEnEdicion]);
            const permisoRequerido = esEdicion ? 'cambio_liturgico_editar' : 'cambio_liturgico_agregar_tabla';

            if (typeof window.hasPermission === 'function' && !window.hasPermission(permisoRequerido)) {
                alert(`No tienes permiso para ${esEdicion ? 'editar este cambio' : 'agregar cambios a la tabla'}.`);
                return;
            }

            const nuevoTiempo = document.getElementById('nuevo-tiempo').value;
            const nuevoNombre = document.getElementById('nuevo-nombre').value.trim();
            const nuevaFecha = document.getElementById('nueva-fecha').value;
            const nuevaDesc = document.getElementById('nueva-desc').value.trim();

            if (!nuevoNombre || !nuevaFecha) {
                alert('Por favor introduce el nombre y la fecha del cambio litúrgico.');
                return;
            }

            if (esEdicion) {
                hitosActuales[indiceHitoEnEdicion].tiempo = nuevoTiempo;
                hitosActuales[indiceHitoEnEdicion].nombre = nuevoNombre;
                hitosActuales[indiceHitoEnEdicion].fecha = nuevaFecha;
                hitosActuales[indiceHitoEnEdicion].descripcion = nuevaDesc || '';
                mostrarMensaje(`Se actualizó "${nuevoNombre}" correctamente.`, 'exito');
            } else {
                hitosActuales.push({
                    id: `custom-${Date.now()}`,
                    tiempo: nuevoTiempo,
                    nombre: nuevoNombre,
                    fecha: nuevaFecha,
                    fijo: false,
                    descripcion: nuevaDesc || 'Cambio manual'
                });
                mostrarMensaje(`Se agregó "${nuevoNombre}" correctamente.`);
            }

            // Ordenar por fecha cronológica
            hitosActuales.sort((a, b) => a.fecha.localeCompare(b.fecha));

            resetearFormularioEdicion();
            renderTabla();
        });
    }

    function actualizarEstadoPermisosGlobales() {
        const puedeGuardar = (typeof window.hasPermission !== 'function') || window.hasPermission('cambio_liturgico_guardar');
        const puedeRestablecer = (typeof window.hasPermission !== 'function') || window.hasPermission('cambio_liturgico_restablecer');
        const puedeAgregar = (typeof window.hasPermission !== 'function') || window.hasPermission('cambio_liturgico_agregar_tabla');

        if (btnGuardar) {
            btnGuardar.disabled = !puedeGuardar;
            btnGuardar.style.opacity = puedeGuardar ? '1' : '0.45';
            btnGuardar.style.cursor = puedeGuardar ? 'pointer' : 'not-allowed';
            btnGuardar.title = puedeGuardar ? 'Guardar cambios' : 'Sin permiso para guardar cambios litúrgicos';
        }

        if (btnRestablecer) {
            btnRestablecer.disabled = !puedeRestablecer;
            btnRestablecer.style.opacity = puedeRestablecer ? '1' : '0.45';
            btnRestablecer.style.cursor = puedeRestablecer ? 'pointer' : 'not-allowed';
            btnRestablecer.title = puedeRestablecer ? 'Restablecer valores' : 'Sin permiso para restablecer valores originales';
        }

        if (formAgregar) {
            const btnSubmit = formAgregar.querySelector('button[type="submit"]');
            const inputs = formAgregar.querySelectorAll('input, select');
            if (btnSubmit) {
                btnSubmit.disabled = !puedeAgregar;
                btnSubmit.style.opacity = puedeAgregar ? '1' : '0.45';
                btnSubmit.style.cursor = puedeAgregar ? 'pointer' : 'not-allowed';
                btnSubmit.title = puedeAgregar ? 'Agregar cambio' : 'Sin permiso para agregar a la tabla';
            }
            inputs.forEach(inp => {
                inp.disabled = !puedeAgregar;
                inp.style.opacity = puedeAgregar ? '1' : '0.55';
                inp.style.cursor = puedeAgregar ? '' : 'not-allowed';
            });
        }
    }

    // Carga inicial
    cargarAño(añoActual);

    // Actualización reactiva ante cambios de permisos de AccessControl o Firebase Auth
    window.addEventListener('lh-access-control-updated', () => {
        renderTabla();
    });
    if (window.onAuthReady) {
        window.onAuthReady(() => {
            renderTabla();
        });
    }
});
}

