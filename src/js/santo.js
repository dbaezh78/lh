/**
 * src/js/santo.js - Controlador y Utilidades para la Vista de Santos del Calendario
 * Gestión de asignaciones de santos al santoral litúrgico, cálculos de fechas y sincronización.
 */

export const STORAGE_SANTOS_CATALOGO = 'lh_catalogo_nombres_santos';
export const STORAGE_ASIGNACIONES = 'lh_santos_calendario_anual';

export const MESES_NOMBRES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DIAS_SEMANA_NOMBRES = [
    'DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'
];

/**
 * Normaliza una clave de fecha a formato dia/mes (ej: "15/9").
 */
export function normalizarClaveFecha(str) {
    if (!str || typeof str !== 'string') return null;
    const m = str.trim().match(/^(\d{1,2})[\/\-](\d{1,2})/);
    if (m) {
        const dia = parseInt(m[1], 10);
        const mes = parseInt(m[2], 10);
        if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12) {
            return dia + '/' + mes;
        }
    }
    return null;
}

/**
 * Recupera el mapa de asignaciones del santoral guardado localmente.
 */
export function obtenerAsignacionesLocales() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_ASIGNACIONES)) || {};
    } catch (e) {
        console.warn('Error leyendo STORAGE_ASIGNACIONES:', e);
        return {};
    }
}

/**
 * Guarda las asignaciones en LocalStorage y Firestore si está disponible.
 */
export function guardarAsignacionesLocales(mapa, sincronizarFirebase = false) {
    try {
        localStorage.setItem(STORAGE_ASIGNACIONES, JSON.stringify(mapa));
    } catch (e) {
        console.warn('Error guardando en LocalStorage:', e);
    }

    if (sincronizarFirebase && window.firebaseAPI && window.firebaseAPI.guardarAsignacionesFirestore) {
        return window.firebaseAPI.guardarAsignacionesFirestore(mapa);
    }
    return Promise.resolve(true);
}

/**
 * Genera el array completo de los 365/366 días de un año determinado con metadatos de calendario.
 */
export function generarDiasDelAnio(anio = 2026) {
    const dias = [];
    const inicio = new Date(anio, 0, 1);
    const fin = new Date(anio, 11, 31);

    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
        const diaNum = d.getDate();
        const mesNum = d.getMonth() + 1;
        const diaSemanaIndex = d.getDay();
        dias.push({
            fechaObj: new Date(d),
            dia: diaNum,
            mes: mesNum,
            mesNombre: MESES_NOMBRES[mesNum - 1],
            diaSemana: DIAS_SEMANA_NOMBRES[diaSemanaIndex],
            diaSemanaIndex: diaSemanaIndex,
            claveFecha: diaNum + '/' + mesNum
        });
    }
    return dias;
}

/**
 * Busca o empareja un santo del catálogo para una fecha dada.
 */
export function obtenerSantoParaFecha(claveFecha, asignaciones, catalogo) {
    if (!claveFecha) return null;
    if (asignaciones && asignaciones[claveFecha]) {
        const nombreAsignado = asignaciones[claveFecha];
        if (Array.isArray(catalogo)) {
            const encontrado = catalogo.find(s => s && s.nombre && s.nombre.toLowerCase().trim() === nombreAsignado.toLowerCase().trim());
            if (encontrado) return encontrado;
        }
        return { nombre: nombreAsignado };
    }
    return null;
}

// Exponer en window para integración global
if (typeof window !== 'undefined') {
    window.SantoAPI = {
        MESES_NOMBRES,
        DIAS_SEMANA_NOMBRES,
        normalizarClaveFecha,
        obtenerAsignacionesLocales,
        guardarAsignacionesLocales,
        generarDiasDelAnio,
        obtenerSantoParaFecha
    };
}
