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
 * Determina si un año es Par o Impar
 */
export function obtenerParidadAño(year) {
    return (year % 2 === 0) ? 'Par' : 'Impar';
}

/**
 * Determina el ciclo dominical (A, B, C)
 * 2026: Ciclo A, 2027: Ciclo B, 2028: Ciclo C
 */
export function obtenerCicloDominical(year) {
    const ciclos = ['A', 'B', 'C'];
    const indice = (((year - 2026) % 3) + 3) % 3;
    return ciclos[indice];
}

/**
 * Obtiene o calcula los hitos litúrgicos principales para un año
 */
export function generarHitosLiturgicos(year) {
    const y = parseInt(year, 10);
    const claveStorage = `lh-hitos-liturgicos-${y}`;
    const guardado = localStorage.getItem(claveStorage);
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
        // Fallback aproximado
        ceniza = `${y}-02-25`;
        pascua = `${y}-04-12`;
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

    // 8. Cristo Rey (Domingo antes de Adviento de este año)
    const advientoDate = parsearFechaISO(advientoEsteAño);
    const cristoReyDate = new Date(advientoDate);
    cristoReyDate.setDate(cristoReyDate.getDate() - 7);
    const cristoRey = formatearFechaISO(cristoReyDate);

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
            nombre: "Reanudación del Tiempo Ordinario (II)",
            fecha: ordinarioII,
            fijo: false,
            descripcion: "Lunes posterior a Pentecostés"
        },
        {
            id: "cristo-rey",
            tiempo: "Ordinario",
            nombre: "Jesucristo, Rey del Universo",
            fecha: cristoRey,
            fijo: false,
            descripcion: "Último domingo del Tiempo Ordinario (Semana 34)"
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

// Inicialización de la interfaz en form_etiempo.html
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

    let añoActual = parseInt(selectAño.value, 10) || new Date().getFullYear();
    let hitosActuales = [];

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

        hitosActuales.forEach((hito, index) => {
            const tr = document.createElement('tr');
            const fechaObj = parsearFechaISO(hito.fecha);
            const diaSemanaNombre = DIAS_SEMANA[fechaObj.getDay()] || '';
            const tagClass = `tag-${hito.tiempo.toLowerCase()}`;

            tr.innerHTML = `
                <td><span class="tag-tiempo ${tagClass}">${hito.tiempo}</span></td>
                <td><strong>${hito.nombre}</strong></td>
                <td>
                    <input type="date" class="input-fecha-tabla" value="${hito.fecha}" data-index="${index}">
                </td>
                <td><span class="badge-fecha">${diaSemanaNombre}</span></td>
                <td><small style="color: #666;">${hito.descripcion || '-'}</small></td>
                <td>
                    <button type="button" class="btn-mini-accion btn-danger" data-borrar="${index}" title="Eliminar este cambio">
                        <span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">delete</span>
                    </button>
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
            guardarHitosLiturgicos(añoActual, hitosActuales);
            mostrarMensaje(`Los cambios litúrgicos para el año ${añoActual} se han guardado con éxito.`, 'exito');
        });
    }

    if (btnRestablecer) {
        btnRestablecer.addEventListener('click', () => {
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
            const nuevoTiempo = document.getElementById('nuevo-tiempo').value;
            const nuevoNombre = document.getElementById('nuevo-nombre').value.trim();
            const nuevaFecha = document.getElementById('nueva-fecha').value;
            const nuevaDesc = document.getElementById('nueva-desc').value.trim();

            if (!nuevoNombre || !nuevaFecha) {
                alert('Por favor introduce el nombre y la fecha del cambio litúrgico.');
                return;
            }

            hitosActuales.push({
                id: `custom-${Date.now()}`,
                tiempo: nuevoTiempo,
                nombre: nuevoNombre,
                fecha: nuevaFecha,
                fijo: false,
                descripcion: nuevaDesc || 'Cambio manual'
            });

            // Ordenar por fecha cronológica
            hitosActuales.sort((a, b) => a.fecha.localeCompare(b.fecha));

            renderTabla();
            formAgregar.reset();
            mostrarMensaje(`Se agregó "${nuevoNombre}" correctamente.`);
        });
    }

    // Carga inicial
    cargarAño(añoActual);
});
