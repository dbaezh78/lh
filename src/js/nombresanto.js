/**
 * src/js/nombresanto.js - Controlador y Utilidades para el Registro de Santos
 * Manejo de almacenamiento IndexedDB, LocalStorage, procesamiento CSV y utilidades litúrgicas.
 */

export const STORAGE_KEY = 'lh_catalogo_nombres_santos';
export const ELIMINADOS_KEY = 'lh_santos_eliminados';
export const IDB_NAME = 'LH_Santos_DB';
export const IDB_STORE = 'catalogo';
export const IDB_VERSION = 2;

/**
 * Abre o inicializa la base de datos IndexedDB para almacenamiento de santos.
 */
export function abrirIndexedDB() {
    return new Promise((resolve) => {
        if (!window.indexedDB) return resolve(null);
        const req = indexedDB.open(IDB_NAME, IDB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(IDB_STORE)) {
                db.createObjectStore(IDB_STORE);
            }
        };
        req.onsuccess = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(IDB_STORE)) {
                try {
                    db.close();
                    const nextV = (db.version || IDB_VERSION) + 1;
                    const reqUp = indexedDB.open(IDB_NAME, nextV);
                    reqUp.onupgradeneeded = (ev) => {
                        const dbUp = ev.target.result;
                        if (!dbUp.objectStoreNames.contains(IDB_STORE)) {
                            dbUp.createObjectStore(IDB_STORE);
                        }
                    };
                    reqUp.onsuccess = (ev) => resolve(ev.target.result);
                    reqUp.onerror = () => resolve(null);
                    return;
                } catch (_) {
                    return resolve(null);
                }
            }
            resolve(db);
        };
        req.onerror = () => resolve(null);
    });
}

/**
 * Guarda la lista de santos en IndexedDB.
 */
export async function guardarEnIndexedDB(lista) {
    try {
        const db = await abrirIndexedDB();
        if (!db || !db.objectStoreNames.contains(IDB_STORE)) return false;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction(IDB_STORE, 'readwrite');
                const store = tx.objectStore(IDB_STORE);
                store.put(lista, 'santos');
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            } catch (_) {
                resolve(false);
            }
        });
    } catch (err) {
        console.warn('⚠️ Error guardando en IndexedDB:', err);
        return false;
    }
}

/**
 * Recupera la lista de santos desde IndexedDB.
 */
export async function cargarDeIndexedDB() {
    try {
        const db = await abrirIndexedDB();
        if (!db || !db.objectStoreNames.contains(IDB_STORE)) return null;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction(IDB_STORE, 'readonly');
                const store = tx.objectStore(IDB_STORE);
                const req = store.get('santos');
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => resolve(null);
            } catch (_) {
                resolve(null);
            }
        });
    } catch (err) {
        console.warn('⚠️ Error leyendo de IndexedDB:', err);
        return null;
    }
}

/**
 * Normaliza una cadena de texto eliminando acentos y espacios extra.
 */
export function normalizarTexto(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/s+/g, ' ')
        .trim();
}

/**
 * Parsea un archivo CSV completo respetando comillas y saltos de línea.
 */
export function parsearCSV(texto) {
    const filas = [];
    let filaActual = [];
    let valorActual = '';
    let dentroComillas = false;

    for (let i = 0; i < texto.length; i++) {
        const char = texto[i];
        const siguienteChar = texto[i + 1];

        if (char === '"') {
            if (dentroComillas && siguienteChar === '"') {
                valorActual += '"';
                i++;
            } else {
                dentroComillas = !dentroComillas;
            }
        } else if (char === ',' && !dentroComillas) {
            filaActual.push(valorActual.trim());
            valorActual = '';
        } else if ((char === '' || char === '
') && !dentroComillas) {
            if (char === '' && siguienteChar === '
') i++;
            filaActual.push(valorActual.trim());
            if (filaActual.some(c => c !== '')) filas.push(filaActual);
            filaActual = [];
            valorActual = '';
        } else {
            valorActual += char;
        }
    }
    if (valorActual !== '' || filaActual.length > 0) {
        filaActual.push(valorActual.trim());
        if (filaActual.some(c => c !== '')) filas.push(filaActual);
    }
    return filas;
}

/**
 * Escapa un campo para exportación CSV.
 */
export function escaparCampoCSV(campo) {
    if (campo === null || campo === undefined) return '""';
    const str = String(campo).replace(/"/g, '""');
    return '"' + str + '"';
}

/**
 * Exporta un array de santos a formato CSV estándar.
 */
export function exportarSantosACSV(santos) {
    const headers = ['Nombre', 'Categoría', 'Día', 'Mes', 'Biografía', 'Tipo'];
    const lineas = [headers.map(escaparCampoCSV).join(',')];
    santos.forEach(s => {
        lineas.push([
            escaparCampoCSV(s.nombre || ''),
            escaparCampoCSV(s.categoria || ''),
            escaparCampoCSV(s.dia || ''),
            escaparCampoCSV(s.mes || ''),
            escaparCampoCSV(s.bio || s.biografia || ''),
            escaparCampoCSV(s.tipo || 'Memoria')
        ].join(','));
    });
    return lineas.join('
');
}

/**
 * Valida la consistencia básica de un objeto santo.
 */
export function validarSanto(santo) {
    if (!santo || typeof santo !== 'object') return { valido: false, error: 'Datos no válidos' };
    if (!santo.nombre || !santo.nombre.trim()) return { valido: false, error: 'El nombre es obligatorio' };
    const dia = parseInt(santo.dia, 10);
    const mes = parseInt(santo.mes, 10);
    if (isNaN(dia) || dia < 1 || dia > 31) return { valido: false, error: 'Día inválido (1-31)' };
    if (isNaN(mes) || mes < 1 || mes > 12) return { valido: false, error: 'Mes inválido (1-12)' };
    return { valido: true };
}

/**
 * Filtra santos por término de búsqueda y mes opcional.
 */
export function filtrarSantos(lista, termino = '', mes = null) {
    if (!Array.isArray(lista)) return [];
    const termNorm = normalizarTexto(termino);
    return lista.filter(s => {
        if (!s) return false;
        if (mes !== null && mes !== 'todos' && parseInt(s.mes, 10) !== parseInt(mes, 10)) {
            return false;
        }
        if (!termNorm) return true;
        const nombreNorm = normalizarTexto(s.nombre);
        const bioNorm = normalizarTexto(s.bio || s.biografia || '');
        const catNorm = normalizarTexto(s.categoria || '');
        return nombreNorm.includes(termNorm) || bioNorm.includes(termNorm) || catNorm.includes(termNorm);
    });
}

// Exponer en window para compatibilidad global
if (typeof window !== 'undefined') {
    window.NombreSantoAPI = {
        abrirIndexedDB,
        guardarEnIndexedDB,
        cargarDeIndexedDB,
        normalizarTexto,
        parsearCSV,
        escaparCampoCSV,
        exportarSantosACSV,
        validarSanto,
        filtrarSantos
    };
}
