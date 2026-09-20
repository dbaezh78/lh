/**
 * frm_salterios.js
 * Generador de Índices y Estructurador de Liturgia de las Horas
 * 
 * Genera el código índice único (ej. tos1dola, tos24sala, tos25dola) a partir de las selecciones:
 * Tiempo Litúrgico + Semana + Día + Libro de las Horas
 * y gestiona el guardado en Firebase Firestore con dicho ID primario.
 * 
 * Integra la vista litúrgica fiel (Imagen 2) para el Invitatorio:
 * - Carga las antífonas directamente del catálogo de antifonas.html (localStorage 'lh_antifonas_cache' / db-antifonas.js)
 * - Filtra estrictamente las de tipo 'invitatoria' para este campo.
 * - Carga TODOS los salmos litúrgicos disponibles (desde salmos.html / salmos.js / 'lh_salmos_cache')
 * - Renderiza la antífona en línea natural (sin recuadro)
 * - Renderiza el título del Salmo Invitatorio siempre en ROJO, MAYÚSCULAS, SIN NEGRITA.
 * - Delimita la visualización estrictamente hasta el Salmo Invitatorio.
 */

import { 
    normalizarObjetoLiturgico,
    TEXTO_SALMO_62_CANONICO,
    TEXTO_CANTICO_DANIEL_CANONICO,
    TEXTO_SALMO_149_CANONICO 
} from '../firebase/descarga_liturgia_de_las_horas.js';
import { CATALOGO_ANTIFONAS_SEED } from '../data/db-antifonas.js';
import { CATALOGO_HIMNOS_SEED, HimnosDB } from '../data/db-himnos.js';
import { CATALOGO_LECTURAS_SEED, LecturaBreveDB } from '../data/db-lecturabreve.js';
import { 
    CATALOGO_CANTICOS,
    CATALOGO_ANTIFONAS_CANTICO_SEED,
    obtenerTodasLasAntifonasCantico,
    obtenerAntifonaCanticoRecomendada,
    obtenerPrecesRecomendadas,
    obtenerOracionRecomendada,
    TEXTO_CANTICO_ZACARIAS_CANONICO,
    TEXTO_MAGNIFICAT_CANONICO,
    TEXTO_NUNC_DIMITTIS_CANONICO
} from '../data/db-cantico-evangelico.js';

// Mapeo de códigos según especificación
export const CODIGOS_TIEMPO = {
    ordinario: { codigo: 'to', nombre: 'Tiempo Ordinario' },
    adviento:  { codigo: 'ta', nombre: 'Adviento' },
    navidad:   { codigo: 'tn', nombre: 'Navidad' },
    cuaresma:  { codigo: 'tc', nombre: 'Cuaresma' },
    pascua:    { codigo: 'tp', nombre: 'Pascua' },
    santos:    { codigo: 'san', nombre: 'Santos / Solemnidades' }
};

export const SEMANAS_POR_TIEMPO = {
    ordinario: Array.from({ length: 34 }, (_, i) => ({ valor: `s${i + 1}`, texto: `Semana ${i + 1}` })),
    adviento:  Array.from({ length: 4 }, (_, i) => ({ valor: `s${i + 1}`, texto: `Semana ${i + 1}` })),
    navidad:   [
        { valor: 's1', texto: 'Semana 1 (Octava de Navidad)' },
        { valor: 's2', texto: 'Semana 2 (Tiempo de Epifanía)' }
    ],
    cuaresma:  [
        { valor: 's1', texto: 'Semana 1' },
        { valor: 's2', texto: 'Semana 2' },
        { valor: 's3', texto: 'Semana 3' },
        { valor: 's4', texto: 'Semana 4' },
        { valor: 's5', texto: 'Semana 5' },
        { valor: 's6', texto: 'Semana 6 (Semana Santa)' },
        { valor: 's7', texto: 'Triduo Pascual' }
    ],
    pascua:    [
        { valor: 's1', texto: 'Semana 1 (Octava de Pascua)' },
        { valor: 's2', texto: 'Semana 2' },
        { valor: 's3', texto: 'Semana 3' },
        { valor: 's4', texto: 'Semana 4' },
        { valor: 's5', texto: 'Semana 5' },
        { valor: 's6', texto: 'Semana 6' },
        { valor: 's7', texto: 'Semana 7 (Ascensión / Pentecostés)' }
    ],
    santos:    [
        { valor: 's1', texto: 'Común de Santos' },
        { valor: 's2', texto: 'Propio de los Santos' },
        { valor: 's3', texto: 'Solemnidades' },
        { valor: 's4', texto: 'Fiestas y Memorias' }
    ]
};

export const CODIGOS_DIA = {
    domingo:   { codigo: 'do', nombre: 'Domingo' },
    lunes:     { codigo: 'lu', nombre: 'Lunes' },
    martes:    { codigo: 'ma', nombre: 'Martes' },
    miercoles: { codigo: 'mi', nombre: 'Miércoles' },
    jueves:    { codigo: 'ju', nombre: 'Jueves' },
    viernes:   { codigo: 'vi', nombre: 'Viernes' },
    sabado:    { codigo: 'sa', nombre: 'Sábado' }
};

export const CODIGOS_LIBRO = {
    oficio:    { codigo: 'of', nombre: 'Oficio de Lectura' },
    laudes:    { codigo: 'la', nombre: 'Laudes' },
    tercia:    { codigo: 'te', nombre: 'Tercia' },
    sexta:     { codigo: 'se', nombre: 'Sexta' },
    nona:      { codigo: 'no', nombre: 'Nona' },
    vispera:   { codigo: 'vi', nombre: 'Víspera' },
    completas: { codigo: 'co', nombre: 'Completas' }
};

// Variables globales en memoria para las fuentes compartidas con antifonas.html, salmos.html e himno.html
let cacheAntifonasInvitatorias = [];
let cacheAntifonasSalmodia1 = [];
let cacheAntifonasSalmodia2 = [];
let cacheAntifonasSalmodia3 = [];
let cacheTodosLosSalmos = [];
let cacheTodosLosHimnos = [];
let cacheTodasLasLecturas = [];
let cacheAntifonasCantico = [];

export const TEXTO_SALMO_94_CANONICO = `Venid, aclamemos al Señor,
demos vítores a la Roca que nos salva;
entremos a su presencia dándole gracias,
aclamándolo con cantos.

Porque el Señor es un Dios grande,
soberano de todos los dioses:
tiene en su mano las simas de la tierra,
son suyas las cumbres de los montes;
suyo es el mar, porque él lo hizo,
la tierra firme que modelaron sus manos.

Venid, postrémonos por tierra,
bendiciendo al Señor, creador nuestro.
Porque él es nuestro Dios,
y nosotros su pueblo,
el rebaño que él guía.

Ojalá escuchéis hoy su voz:
«No endurezcáis el corazón como en Meribá,
como el día de Masá en el desierto;
cuando vuestros padres me pusieron a prueba
y dudaron de mí, aunque habían visto mis obras.

Durante cuarenta años
aquella generación me repugnó, y dije:
Es un pueblo de corazón extraviado,
que no reconoce mi camino;
por eso he jurado en mi cólera
que no entrarán en mi descanso»

Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`;

/**
 * Obtener todos los himnos desde himno.html / db-himnos.js / 'lh_himnos_cache'
 */
export function obtenerTodosLosHimnosDesdeCatalogo() {
    let himnos = [];
    const cacheLocal = localStorage.getItem('lh_himnos_cache');
    if (cacheLocal) {
        try {
            himnos = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_himnos_cache:", e);
        }
    }

    if (!Array.isArray(himnos) || himnos.length === 0) {
        if (Array.isArray(CATALOGO_HIMNOS_SEED) && CATALOGO_HIMNOS_SEED.length > 0) {
            himnos = [...CATALOGO_HIMNOS_SEED];
        }
    }

    return himnos;
}

/**
 * Obtener todas las lecturas breves desde lecturabreve.html / db-lecturabreve.js / 'lh_lecturabreve_cache'
 */
export function obtenerTodasLasLecturasDesdeCatalogo() {
    let lecturas = [];
    const cacheLocal = localStorage.getItem('lh_lecturabreve_cache');
    if (cacheLocal) {
        try {
            lecturas = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_lecturabreve_cache:", e);
        }
    }

    if (!Array.isArray(lecturas) || lecturas.length === 0) {
        if (Array.isArray(CATALOGO_LECTURAS_SEED) && CATALOGO_LECTURAS_SEED.length > 0) {
            lecturas = [...CATALOGO_LECTURAS_SEED];
        }
    }

    return lecturas;
}

/**
 * Obtener las antífonas directamente de la fuente de antifonas.html:
 * 1. localStorage 'lh_antifonas_cache'
 * 2. Fallback a CATALOGO_ANTIFONAS_SEED
 * 3. Filtrar estrictamente las de carácter invitatorio
 */
export function obtenerAntifonasInvitatoriasDesdeCatalogo() {
    let todas = [];
    const cacheLocal = localStorage.getItem('lh_antifonas_cache');
    if (cacheLocal) {
        try {
            todas = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_antifonas_cache:", e);
        }
    }

    if (!Array.isArray(todas) || todas.length === 0) {
        todas = Array.isArray(CATALOGO_ANTIFONAS_SEED) ? [...CATALOGO_ANTIFONAS_SEED] : [];
    }

    // Filtrar estrictamente SOLO las de tipo invitatoria o con prefijo inv
    const invitatorias = todas.filter(a => a && (
        a.tipo === 'invitatoria' || 
        (a.varName && (a.varName.startsWith('inv_') || a.varName.toLowerCase().includes('inv'))) ||
        (a.id && a.id.toLowerCase().includes('invitatoria'))
    ));

    invitatorias.sort((a, b) => {
        const tiempoA = a.tiempo || '';
        const tiempoB = b.tiempo || '';
        if (tiempoA !== tiempoB) return tiempoA.localeCompare(tiempoB);

        const semA = Number(a.semana) || 0;
        const semB = Number(b.semana) || 0;
        if (semA !== semB) return semA - semB;

        const ordenDias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const diaA = ordenDias.indexOf(a.dia);
        const diaB = ordenDias.indexOf(b.dia);
        if (diaA !== diaB) return diaA - diaB;

        return (a.texto || '').localeCompare(b.texto || '');
    });

    return invitatorias;
}

/**
 * Obtener las antífonas de la Salmodia 1 desde:
 * 1. localStorage 'lh_antifonas_cache'
 * 2. Fallback a CATALOGO_ANTIFONAS_SEED
 * 3. Filtrar estrictamente las de tipo 'salmodia_1'
 */
export function obtenerAntifonasSalmodia1DesdeCatalogo() {
    let todas = [];
    const cacheLocal = localStorage.getItem('lh_antifonas_cache');
    if (cacheLocal) {
        try {
            todas = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_antifonas_cache:", e);
        }
    }

    if (!Array.isArray(todas) || todas.length === 0) {
        todas = Array.isArray(CATALOGO_ANTIFONAS_SEED) ? [...CATALOGO_ANTIFONAS_SEED] : [];
    }

    // Filtrar estrictamente las de tipo salmodia_1
    const salmodia1 = todas.filter(a => a && (
        a.tipo === 'salmodia_1' || 
        (a.id && a.id.includes('salmodia_1'))
    ));

    salmodia1.sort((a, b) => {
        const tiempoA = a.tiempo || '';
        const tiempoB = b.tiempo || '';
        if (tiempoA !== tiempoB) return tiempoA.localeCompare(tiempoB);

        const semA = Number(a.semana) || 0;
        const semB = Number(b.semana) || 0;
        if (semA !== semB) return semA - semB;

        const ordenDias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const diaA = ordenDias.indexOf(a.dia);
        const diaB = ordenDias.indexOf(b.dia);
        if (diaA !== diaB) return diaA - diaB;

        return (a.texto || '').localeCompare(b.texto || '');
    });

    return salmodia1;
}

/**
 * Obtener las antífonas de la Salmodia 2 desde catálogo
 */
export function obtenerAntifonasSalmodia2DesdeCatalogo() {
    let todas = [];
    const cacheLocal = localStorage.getItem('lh_antifonas_cache');
    if (cacheLocal) {
        try {
            todas = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_antifonas_cache:", e);
        }
    }

    if (!Array.isArray(todas) || todas.length === 0) {
        todas = Array.isArray(CATALOGO_ANTIFONAS_SEED) ? [...CATALOGO_ANTIFONAS_SEED] : [];
    }

    const salmodia2 = todas.filter(a => a && (
        a.tipo === 'salmodia_2' || 
        (a.id && a.id.includes('salmodia_2'))
    ));

    salmodia2.sort((a, b) => {
        const tiempoA = a.tiempo || '';
        const tiempoB = b.tiempo || '';
        if (tiempoA !== tiempoB) return tiempoA.localeCompare(tiempoB);

        const semA = Number(a.semana) || 0;
        const semB = Number(b.semana) || 0;
        if (semA !== semB) return semA - semB;

        const ordenDias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const diaA = ordenDias.indexOf(a.dia);
        const diaB = ordenDias.indexOf(b.dia);
        if (diaA !== diaB) return diaA - diaB;

        return (a.texto || '').localeCompare(b.texto || '');
    });

    return salmodia2;
}

/**
 * Obtener las antífonas de la Salmodia 3 desde catálogo
 */
export function obtenerAntifonasSalmodia3DesdeCatalogo() {
    let todas = [];
    const cacheLocal = localStorage.getItem('lh_antifonas_cache');
    if (cacheLocal) {
        try {
            todas = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_antifonas_cache:", e);
        }
    }

    if (!Array.isArray(todas) || todas.length === 0) {
        todas = Array.isArray(CATALOGO_ANTIFONAS_SEED) ? [...CATALOGO_ANTIFONAS_SEED] : [];
    }

    const salmodia3 = todas.filter(a => a && (
        a.tipo === 'salmodia_3' || 
        (a.id && a.id.includes('salmodia_3'))
    ));

    salmodia3.sort((a, b) => {
        const tiempoA = a.tiempo || '';
        const tiempoB = b.tiempo || '';
        if (tiempoA !== tiempoB) return tiempoA.localeCompare(tiempoB);

        const semA = Number(a.semana) || 0;
        const semB = Number(b.semana) || 0;
        if (semA !== semB) return semA - semB;

        const ordenDias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const diaA = ordenDias.indexOf(a.dia);
        const diaB = ordenDias.indexOf(b.dia);
        if (diaA !== diaB) return diaA - diaB;

        return (a.texto || '').localeCompare(b.texto || '');
    });

    return salmodia3;
}

/**
 * Garantiza que el texto del salmo se entregue íntegro y completo sin truncamiento (...).
 */
export function asegurarTextoCompletoSalmo(salmoId, textoExistente, fallbackCanonico = '') {
    if (textoExistente && textoExistente.length >= 150 && !textoExistente.trim().endsWith('...')) {
        return textoExistente;
    }

    if (salmoId) {
        const obj = cacheTodosLosSalmos.find(s => s.id === salmoId) ||
                    (window.SalmosDB && typeof window.SalmosDB.obtener === 'function' ? window.SalmosDB.obtener(salmoId) : null);
        if (obj && obj.texto && obj.texto.length >= 150 && !obj.texto.trim().endsWith('...')) {
            return obj.texto;
        }
    }

    if (salmoId === 'salmo94' || salmoId === 'invitatorio1') return TEXTO_SALMO_94_CANONICO;
    if (salmoId === 'salmo62_2_9') return TEXTO_SALMO_62_CANONICO;
    if (salmoId === 'dn_3_57_88_56') return TEXTO_CANTICO_DANIEL_CANONICO;
    if (salmoId === 'salmo149') return TEXTO_SALMO_149_CANONICO;

    return fallbackCanonico || textoExistente || '';
}

/**
 * Obtener todos los salmos desde salmos.html / salmos.js / 'lh_salmos_cache'
 * Garantizando los 4 salmos invitatorios canónicos completos como cabecera.
 */
export function obtenerTodosLosSalmosDesdeCatalogo() {
    let salmos = [];
    const cacheLocal = localStorage.getItem('lh_salmos_cache');
    if (cacheLocal) {
        try {
            salmos = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_salmos_cache:", e);
        }
    }

    if (!Array.isArray(salmos) || salmos.length === 0) {
        if (window.SalmosDB && typeof window.SalmosDB.listar === 'function') {
            salmos = window.SalmosDB.listar().map(s => ({
                id: s.id,
                titulo: s.titulo || s.id,
                tipo: s.tipo || 'salmo',
                texto: s.texto || ''
            }));
        }
    }

    // Salmos invitatorios canónicos principales
    const invitatoriosEstandar = [
        { id: 'salmo94', titulo: 'Salmo 94 - INVITACIÓN A LA ALABANZA DIVINA', tipo: 'invitatorio', texto: TEXTO_SALMO_94_CANONICO },
        { id: 'salmo99', titulo: 'Salmo 99 - ALEGRÍA DE LOS QUE ENTRAN EN EL TEMPLO', tipo: 'invitatorio', texto: '' },
        { id: 'salmo66', titulo: 'Salmo 66 - QUE TODOS LOS PUEBLOS ALABEN AL SEÑOR', tipo: 'invitatorio', texto: '' },
        { id: 'salmo23', titulo: 'Salmo 23 - ENTRADA SOLEMNE DE DIOS EN SU TEMPLO', tipo: 'invitatorio', texto: '' }
    ];

    const mapaSalmos = new Map();
    salmos.forEach(s => {
        if (s && s.id) mapaSalmos.set(s.id, s);
    });

    // Inyectar o enriquecer los 4 principales
    const resultado = invitatoriosEstandar.map(inv => {
        const existente = mapaSalmos.get(inv.id);
        mapaSalmos.delete(inv.id);
        return {
            id: inv.id,
            titulo: inv.titulo,
            tipo: 'invitatorio',
            texto: (existente && existente.texto) ? existente.texto : inv.texto
        };
    });

    // Añadir todos los demás salmos
    for (const [_, s] of mapaSalmos) {
        resultado.push(s);
    }

    return resultado;
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    const selTiempo = document.getElementById('selectTiempo');
    const selSemana = document.getElementById('selectSemana');
    const selDia    = document.getElementById('selectDia');
    const selLibro  = document.getElementById('selectLibro');
    const inputCodigo = document.getElementById('inputCodigoIndice');
    const btnCopiar = document.getElementById('btnCopiarCodigo');
    const btnGuardar = document.getElementById('btnGuardarFirebase');
    const badgeEstado = document.getElementById('badgeEstadoGuardado');
    const txtEstado = document.getElementById('txtEstadoGuardado');

    // Elementos del Constructor Litúrgico (Invitatorio e Himno)
    const selAntifona = document.getElementById('selectAntifonaInvitatorio');
    const selSalmo = document.getElementById('selectSalmoInvitatorio');
    const selHimno = document.getElementById('selectHimno');
    const txtAntifona = document.getElementById('txtAntifonaInvitatorio');
    const txtAntifonaFin = document.getElementById('txtAntifonaInvitatorioFin');
    const previewTituloHora = document.getElementById('previewTituloHora');
    const previewSubtituloHora = document.getElementById('previewSubtituloHora');
    const previewTituloSalmo = document.getElementById('previewTituloSalmo');
    const previewTextoSalmo = document.getElementById('previewTextoSalmo');
    const previewTituloHimno = document.getElementById('previewTituloHimno');
    const previewTextoHimno = document.getElementById('previewTextoHimno');

    // Elementos de la Salmodia 1
    const selAntifona1 = document.getElementById('selectAntifona1');
    const selSalmo1 = document.getElementById('selectSalmo1');
    const txtAntifona1 = document.getElementById('txtAntifona1');
    const txtAntifona1Fin = document.getElementById('txtAntifona1Fin');
    const previewTituloSalmodia = document.getElementById('previewTituloSalmodia');
    const previewTituloSalmo1 = document.getElementById('previewTituloSalmo1');
    const previewTextoSalmo1 = document.getElementById('previewTextoSalmo1');

    // Elementos de la Salmodia 2
    const selAntifona2 = document.getElementById('selectAntifona2');
    const selSalmo2 = document.getElementById('selectSalmo2');
    const txtAntifona2 = document.getElementById('txtAntifona2');
    const txtAntifona2Fin = document.getElementById('txtAntifona2Fin');
    const previewTituloSalmo2 = document.getElementById('previewTituloSalmo2');
    const previewTextoSalmo2 = document.getElementById('previewTextoSalmo2');

    // Elementos de la Salmodia 3
    const selAntifona3 = document.getElementById('selectAntifona3');
    const selSalmo3 = document.getElementById('selectSalmo3');
    const txtAntifona3 = document.getElementById('txtAntifona3');
    const txtAntifona3Fin = document.getElementById('txtAntifona3Fin');
    const previewTituloSalmo3 = document.getElementById('previewTituloSalmo3');
    const previewTextoSalmo3 = document.getElementById('previewTextoSalmo3');

    // Elementos de Lectura Breve y Responsorio Breve
    const selLectura = document.getElementById('selectLecturaBreve');
    const previewCitaLectura = document.getElementById('previewCitaLectura');
    const previewTextoLectura = document.getElementById('previewTextoLectura');
    const previewRespV1 = document.getElementById('previewRespV1');
    const previewRespR1 = document.getElementById('previewRespR1');
    const previewRespV2 = document.getElementById('previewRespV2');
    const previewRespR2 = document.getElementById('previewRespR2');
    const previewRespR3 = document.getElementById('previewRespR3');

    // Elementos del Cántico Evangélico, Preces, Oración y Conclusión
    const selAntifonaCantico = document.getElementById('selectAntifonaCantico');
    const selCantico = document.getElementById('selectCantico');
    const txtAntifonaCantico = document.getElementById('txtAntifonaCantico');
    const txtAntifonaCanticoFin = document.getElementById('txtAntifonaCanticoFin');
    const previewNombreCantico = document.getElementById('previewNombreCantico');
    const previewCitaCantico = document.getElementById('previewCitaCantico');
    const previewTextoCantico = document.getElementById('previewTextoCantico');
    const previewTituloPreces = document.getElementById('previewTituloPreces');
    const previewTextoPreces = document.getElementById('previewTextoPreces');
    const previewIntroPadreNuestro = document.getElementById('previewIntroPadreNuestro');
    const previewTituloOracion = document.getElementById('previewTituloOracion');
    const previewTextoOracion = document.getElementById('previewTextoOracion');
    const previewTituloConclusion = document.getElementById('previewTituloConclusion');
    const previewConclusionV = document.getElementById('previewConclusionV');
    const previewConclusionR = document.getElementById('previewConclusionR');

    // Cargar y poblar el selector de Antífonas Invitatorias exclusivamente desde antifonas.html
    function cargarYPoblarSelectAntifonas(valorSeleccionadoPrevio = null) {
        if (!selAntifona) return;
        cacheAntifonasInvitatorias = obtenerAntifonasInvitatoriasDesdeCatalogo();

        selAntifona.innerHTML = '';
        if (cacheAntifonasInvitatorias.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay antífonas invitatorias registradas';
            selAntifona.appendChild(opt);
            return;
        }

        const vistos = new Set();
        cacheAntifonasInvitatorias.forEach(item => {
            const textoLimpio = (item.texto || '').trim();
            if (!textoLimpio) return;

            // Evitar opciones duplicadas con el mismo texto
            if (vistos.has(textoLimpio)) return;
            vistos.add(textoLimpio);

            const opt = document.createElement('option');
            opt.value = item.id || item.varName || textoLimpio;
            opt.setAttribute('data-texto', textoLimpio);
            // Mostrar ÚNICAMENTE el texto de la antífona tal como solicitó el usuario
            opt.textContent = textoLimpio;
            selAntifona.appendChild(opt);
        });

        if (valorSeleccionadoPrevio && Array.from(selAntifona.options).some(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio)) {
            const match = Array.from(selAntifona.options).find(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio);
            if (match) selAntifona.value = match.value;
        }
    }

    // Cargar y poblar el selector de Antífonas de Salmodia 1 exclusivamente desde catálogo
    function cargarYPoblarSelectAntifonas1(valorSeleccionadoPrevio = null) {
        if (!selAntifona1) return;
        cacheAntifonasSalmodia1 = obtenerAntifonasSalmodia1DesdeCatalogo();

        selAntifona1.innerHTML = '';
        if (cacheAntifonasSalmodia1.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay antífonas de salmodia 1 registradas';
            selAntifona1.appendChild(opt);
            return;
        }

        const vistos = new Set();
        cacheAntifonasSalmodia1.forEach(item => {
            const textoLimpio = (item.texto || '').trim();
            if (!textoLimpio) return;

            if (vistos.has(textoLimpio)) return;
            vistos.add(textoLimpio);

            const opt = document.createElement('option');
            opt.value = item.id || item.varName || textoLimpio;
            opt.setAttribute('data-texto', textoLimpio);
            opt.textContent = textoLimpio;
            selAntifona1.appendChild(opt);
        });

        if (valorSeleccionadoPrevio && Array.from(selAntifona1.options).some(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio)) {
            const match = Array.from(selAntifona1.options).find(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio);
            if (match) selAntifona1.value = match.value;
        }
    }

    // Cargar y poblar el selector de Salmos con TODOS los salmos disponibles
    function cargarYPoblarSelectSalmos(valorSeleccionadoPrevio = 'salmo94') {
        if (!selSalmo) return;
        cacheTodosLosSalmos = obtenerTodosLosSalmosDesdeCatalogo();

        selSalmo.innerHTML = '';
        cacheTodosLosSalmos.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.setAttribute('data-titulo', s.titulo || s.id);
            opt.textContent = s.titulo || s.id;
            selSalmo.appendChild(opt);
        });

        // Seleccionar Salmo 94 por defecto o el valor previo guardado
        const objetivo = valorSeleccionadoPrevio || 'salmo94';
        if (Array.from(selSalmo.options).some(o => o.value === objetivo)) {
            selSalmo.value = objetivo;
        } else if (selSalmo.options.length > 0) {
            selSalmo.selectedIndex = 0;
        }
    }

    // Cargar y poblar el selector de Salmo 1
    function cargarYPoblarSelectSalmos1(valorSeleccionadoPrevio = 'salmo62_2_9') {
        if (!selSalmo1) return;
        if (cacheTodosLosSalmos.length === 0) {
            cacheTodosLosSalmos = obtenerTodosLosSalmosDesdeCatalogo();
        }

        selSalmo1.innerHTML = '';
        cacheTodosLosSalmos.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.setAttribute('data-titulo', s.titulo || s.id);
            opt.textContent = s.titulo || s.id;
            selSalmo1.appendChild(opt);
        });

        const objetivo = valorSeleccionadoPrevio || 'salmo62_2_9';
        if (Array.from(selSalmo1.options).some(o => o.value === objetivo)) {
            selSalmo1.value = objetivo;
        } else if (selSalmo1.options.length > 0) {
            selSalmo1.selectedIndex = 0;
        }
    }

    // Cargar y poblar el selector de Antífonas de Salmodia 2
    function cargarYPoblarSelectAntifonas2(valorSeleccionadoPrevio = null) {
        if (!selAntifona2) return;
        cacheAntifonasSalmodia2 = obtenerAntifonasSalmodia2DesdeCatalogo();

        selAntifona2.innerHTML = '';
        if (cacheAntifonasSalmodia2.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay antífonas de salmodia 2 registradas';
            selAntifona2.appendChild(opt);
            return;
        }

        const vistos = new Set();
        cacheAntifonasSalmodia2.forEach(item => {
            const textoLimpio = (item.texto || '').trim();
            if (!textoLimpio) return;

            if (vistos.has(textoLimpio)) return;
            vistos.add(textoLimpio);

            const opt = document.createElement('option');
            opt.value = item.id || item.varName || textoLimpio;
            opt.setAttribute('data-texto', textoLimpio);
            opt.textContent = textoLimpio;
            selAntifona2.appendChild(opt);
        });

        if (valorSeleccionadoPrevio && Array.from(selAntifona2.options).some(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio)) {
            const match = Array.from(selAntifona2.options).find(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio);
            if (match) selAntifona2.value = match.value;
        }
    }

    // Cargar y poblar el selector de Salmo 2 (Cántico)
    function cargarYPoblarSelectSalmos2(valorSeleccionadoPrevio = 'dn_3_57_88_56') {
        if (!selSalmo2) return;
        if (cacheTodosLosSalmos.length === 0) {
            cacheTodosLosSalmos = obtenerTodosLosSalmosDesdeCatalogo();
        }

        selSalmo2.innerHTML = '';
        cacheTodosLosSalmos.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.setAttribute('data-titulo', s.titulo || s.id);
            opt.textContent = s.titulo || s.id;
            selSalmo2.appendChild(opt);
        });

        const objetivo = valorSeleccionadoPrevio || 'dn_3_57_88_56';
        if (Array.from(selSalmo2.options).some(o => o.value === objetivo)) {
            selSalmo2.value = objetivo;
        } else if (selSalmo2.options.length > 0) {
            selSalmo2.selectedIndex = 0;
        }
    }

    // Cargar y poblar el selector de Antífonas de Salmodia 3
    function cargarYPoblarSelectAntifonas3(valorSeleccionadoPrevio = null) {
        if (!selAntifona3) return;
        cacheAntifonasSalmodia3 = obtenerAntifonasSalmodia3DesdeCatalogo();

        selAntifona3.innerHTML = '';
        if (cacheAntifonasSalmodia3.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay antífonas de salmodia 3 registradas';
            selAntifona3.appendChild(opt);
            return;
        }

        const vistos = new Set();
        cacheAntifonasSalmodia3.forEach(item => {
            const textoLimpio = (item.texto || '').trim();
            if (!textoLimpio) return;

            if (vistos.has(textoLimpio)) return;
            vistos.add(textoLimpio);

            const opt = document.createElement('option');
            opt.value = item.id || item.varName || textoLimpio;
            opt.setAttribute('data-texto', textoLimpio);
            opt.textContent = textoLimpio;
            selAntifona3.appendChild(opt);
        });

        if (valorSeleccionadoPrevio && Array.from(selAntifona3.options).some(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio)) {
            const match = Array.from(selAntifona3.options).find(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio);
            if (match) selAntifona3.value = match.value;
        }
    }

    // Cargar y poblar el selector de Salmo 3
    function cargarYPoblarSelectSalmos3(valorSeleccionadoPrevio = 'salmo149') {
        if (!selSalmo3) return;
        if (cacheTodosLosSalmos.length === 0) {
            cacheTodosLosSalmos = obtenerTodosLosSalmosDesdeCatalogo();
        }

        selSalmo3.innerHTML = '';
        cacheTodosLosSalmos.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.setAttribute('data-titulo', s.titulo || s.id);
            opt.textContent = s.titulo || s.id;
            selSalmo3.appendChild(opt);
        });

        const objetivo = valorSeleccionadoPrevio || 'salmo149';
        if (Array.from(selSalmo3.options).some(o => o.value === objetivo)) {
            selSalmo3.value = objetivo;
        } else if (selSalmo3.options.length > 0) {
            selSalmo3.selectedIndex = 0;
        }
    }

    // Cargar y poblar el selector de Himnos desde himno.html / db-himnos.js
    function cargarYPoblarSelectHimnos(valorSeleccionadoPrevio = null) {
        if (!selHimno) return;
        cacheTodosLosHimnos = obtenerTodosLosHimnosDesdeCatalogo();

        selHimno.innerHTML = '';
        if (cacheTodosLosHimnos.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay himnos registrados';
            selHimno.appendChild(opt);
            return;
        }

        cacheTodosLosHimnos.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.id || h.varName;
            opt.setAttribute('data-titulo', h.titulo || h.varName || h.id);
            opt.textContent = h.titulo || h.varName || h.id;
            selHimno.appendChild(opt);
        });

        if (valorSeleccionadoPrevio && Array.from(selHimno.options).some(o => o.value === valorSeleccionadoPrevio)) {
            selHimno.value = valorSeleccionadoPrevio;
        } else if (selHimno.options.length > 0) {
            selHimno.selectedIndex = 0;
        }
    }

    // Cargar y poblar el selector de Lecturas Breves desde lecturabreve.html / db-lecturabreve.js / 'lh_lecturabreve_cache'
    function cargarYPoblarSelectLecturas(valorSeleccionadoPrevio = null) {
        if (!selLectura) return;
        cacheTodasLasLecturas = obtenerTodasLasLecturasDesdeCatalogo();

        selLectura.innerHTML = '';
        if (cacheTodasLasLecturas.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay lecturas breves registradas';
            selLectura.appendChild(opt);
            return;
        }

        cacheTodasLasLecturas.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.id || l.varName;
            opt.setAttribute('data-cita', l.cita || l.id);
            const cita = l.cita || l.id;
            const textoPlano = (l.texto || '').replace(/\s+/g, ' ').trim();
            const frag = textoPlano.length > 40 ? `${textoPlano.slice(0, 40)}...` : textoPlano;
            opt.textContent = `${cita} — ${frag}`;
            selLectura.appendChild(opt);
        });

        if (valorSeleccionadoPrevio && Array.from(selLectura.options).some(o => o.value === valorSeleccionadoPrevio)) {
            selLectura.value = valorSeleccionadoPrevio;
        }
    }

    // Cargar y poblar el selector de Antífonas de Cántico Evangélico desde db-cantico-evangelico.js
    function cargarYPoblarSelectAntifonasCantico(valorSeleccionadoPrevio = null) {
        if (!selAntifonaCantico) return;
        cacheAntifonasCantico = obtenerTodasLasAntifonasCantico();

        selAntifonaCantico.innerHTML = '';
        if (cacheAntifonasCantico.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay antífonas de cántico evangélico registradas';
            selAntifonaCantico.appendChild(opt);
            return;
        }

        const vistos = new Set();
        cacheAntifonasCantico.forEach(item => {
            const textoLimpio = (item.texto || '').trim();
            if (!textoLimpio) return;

            if (vistos.has(textoLimpio)) return;
            vistos.add(textoLimpio);

            const opt = document.createElement('option');
            opt.value = item.id || item.varName || textoLimpio;
            opt.setAttribute('data-texto', textoLimpio);
            opt.textContent = textoLimpio;
            selAntifonaCantico.appendChild(opt);
        });

        if (valorSeleccionadoPrevio && Array.from(selAntifonaCantico.options).some(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio)) {
            const match = Array.from(selAntifonaCantico.options).find(o => o.value === valorSeleccionadoPrevio || o.getAttribute('data-texto') === valorSeleccionadoPrevio);
            if (match) selAntifonaCantico.value = match.value;
        }
    }

    // Cargar y poblar el selector de Cánticos Evangélicos
    function cargarYPoblarSelectCanticos(valorSeleccionadoPrevio = 'cantico_zacarias') {
        if (!selCantico) return;
        selCantico.innerHTML = '';
        CATALOGO_CANTICOS.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.setAttribute('data-nombre', c.nombre);
            opt.setAttribute('data-cita', c.cita);
            opt.textContent = `${c.nombre} - ${c.cita}`;
            selCantico.appendChild(opt);
        });

        const objetivo = valorSeleccionadoPrevio || 'cantico_zacarias';
        if (Array.from(selCantico.options).some(o => o.value === objetivo)) {
            selCantico.value = objetivo;
        } else if (selCantico.options.length > 0) {
            selCantico.selectedIndex = 0;
        }
    }

    // Escuchar si se registran nuevas antífonas, salmos, himnos o lecturas breves desde otra pestaña
    window.addEventListener('storage', (e) => {
        if (e.key === 'lh_antifonas_cache') {
            const valorAntActual = selAntifona ? selAntifona.value : null;
            cargarYPoblarSelectAntifonas(valorAntActual);
            const valorAnt1Actual = selAntifona1 ? selAntifona1.value : null;
            cargarYPoblarSelectAntifonas1(valorAnt1Actual);
            const valorAnt2Actual = selAntifona2 ? selAntifona2.value : null;
            cargarYPoblarSelectAntifonas2(valorAnt2Actual);
            const valorAnt3Actual = selAntifona3 ? selAntifona3.value : null;
            cargarYPoblarSelectAntifonas3(valorAnt3Actual);
            actualizarInvitatorioPreview(false);
        }
        if (e.key === 'lh_antifonas_cantico_cache') {
            const valorAntCEActual = selAntifonaCantico ? selAntifonaCantico.value : null;
            cargarYPoblarSelectAntifonasCantico(valorAntCEActual);
            actualizarInvitatorioPreview(false);
        }
        if (e.key === 'lh_salmos_cache') {
            const valorSalmoActual = selSalmo ? selSalmo.value : 'salmo94';
            cargarYPoblarSelectSalmos(valorSalmoActual);
            const valorSalmo1Actual = selSalmo1 ? selSalmo1.value : 'salmo62_2_9';
            cargarYPoblarSelectSalmos1(valorSalmo1Actual);
            const valorSalmo2Actual = selSalmo2 ? selSalmo2.value : 'dn_3_57_88_56';
            cargarYPoblarSelectSalmos2(valorSalmo2Actual);
            const valorSalmo3Actual = selSalmo3 ? selSalmo3.value : 'salmo149';
            cargarYPoblarSelectSalmos3(valorSalmo3Actual);
            actualizarInvitatorioPreview(false);
        }
        if (e.key === 'lh_himnos_cache') {
            const valorHimnoActual = selHimno ? selHimno.value : null;
            cargarYPoblarSelectHimnos(valorHimnoActual);
            actualizarInvitatorioPreview(false);
        }
        if (e.key === 'lh_lecturabreve_cache') {
            const valorLecturaActual = selLectura ? selLectura.value : null;
            cargarYPoblarSelectLecturas(valorLecturaActual);
            actualizarInvitatorioPreview(false);
        }
    });

    // Cargar semanas según el tiempo litúrgico seleccionado
    function actualizarOpcionesSemanas(mantenerSeleccion = false) {
        const tiempoSeleccionado = selTiempo.value;
        const semanasDisponibles = SEMANAS_POR_TIEMPO[tiempoSeleccionado] || SEMANAS_POR_TIEMPO.ordinario;
        const valorAnterior = selSemana.value;

        selSemana.innerHTML = '';
        semanasDisponibles.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.valor;
            opt.textContent = item.texto;
            selSemana.appendChild(opt);
        });

        if (mantenerSeleccion && Array.from(selSemana.options).some(o => o.value === valorAnterior)) {
            selSemana.value = valorAnterior;
        } else {
            selSemana.selectedIndex = 0;
        }
    }

    // Actualizar indicador de estado de guardado
    function actualizarBadgeEstado(guardado = false) {
        if (!badgeEstado || !txtEstado) return;
        if (guardado) {
            badgeEstado.classList.add('guardado');
            txtEstado.textContent = 'Guardado';
            badgeEstado.querySelector('.material-symbols-outlined').textContent = 'cloud_done';
        } else {
            badgeEstado.classList.remove('guardado');
            txtEstado.textContent = 'Sin guardar';
            badgeEstado.querySelector('.material-symbols-outlined').textContent = 'cloud_queue';
        }
    }

    // Renderizar y sincronizar la vista previa del Invitatorio según la Imagen 2 (SIN RECUADRO)
    function actualizarInvitatorioPreview(forzarRecomendado = false) {
        const tiempoVal = selTiempo.value;
        const semanaVal = selSemana.value || 's1';
        const diaVal    = selDia.value;
        const libroVal  = selLibro.value;

        // 1. TÍTULO DE LA HORA (EN NEGRITA Y ROJO)
        const mapaTitulos = {
            laudes:    'LAUDES',
            oficio:    'OFICIO DE LECTURA',
            vispera:   'VÍSPERAS',
            tercia:    'TERCIA',
            sexta:     'SEXTA',
            nona:      'NONA',
            completas: 'COMPLETAS'
        };
        if (previewTituloHora) {
            previewTituloHora.textContent = mapaTitulos[libroVal] || (CODIGOS_LIBRO[libroVal] ? CODIGOS_LIBRO[libroVal].nombre.toUpperCase() : 'LAUDES');
        }

        // 2. SUBTÍTULO (ROJO, CURSIVA, SIN NEGRITA)
        const mapaSubtitulos = {
            laudes:    '(Oración de la mañana)',
            oficio:    '(Oficio de lectura y contemplación)',
            vispera:   '(Oración de la tarde)',
            tercia:    '(Antes del mediodía)',
            sexta:     '(Al mediodía)',
            nona:      '(De la tarde)',
            completas: '(Oración antes del descanso nocturno)'
        };
        if (previewSubtituloHora) {
            previewSubtituloHora.textContent = mapaSubtitulos[libroVal] || '(Oración de la mañana)';
        }

        // 3. ANTÍFONA DEL INVITATORIO (EN LÍNEA NATURAL, SIN RECUADRO)
        if (selAntifona && txtAntifona) {
            if (forzarRecomendado || !selAntifona.value) {
                let encontrada = null;
                if (tiempoVal === 'ordinario') {
                    const numSemana = parseInt(semanaVal.replace('s', '')) || 1;
                    const semCiclo = ((numSemana - 1) % 4) + 1; // Ciclo de 4 semanas

                    encontrada = cacheAntifonasInvitatorias.find(a => 
                        a.tiempo === 'ordinario' && 
                        a.dia === diaVal && 
                        (Number(a.semana) === numSemana || Number(a.semana) === semCiclo)
                    );

                    if (!encontrada) {
                        encontrada = cacheAntifonasInvitatorias.find(a => a.tiempo === 'ordinario' && a.dia === diaVal);
                    }
                } else {
                    encontrada = cacheAntifonasInvitatorias.find(a => 
                        a.tiempo === tiempoVal && 
                        (a.dia === diaVal || !a.dia)
                    );
                }

                if (!encontrada && cacheAntifonasInvitatorias.length > 0) {
                    encontrada = cacheAntifonasInvitatorias[0];
                }

                if (encontrada) {
                    selAntifona.value = encontrada.id || encontrada.varName || encontrada.texto;
                    txtAntifona.textContent = encontrada.texto || '';
                    if (txtAntifonaFin) txtAntifonaFin.textContent = encontrada.texto || '';
                }
            } else {
                const opt = selAntifona.selectedOptions[0];
                if (opt) {
                    const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                    txtAntifona.textContent = textoOpt;
                    if (txtAntifonaFin) txtAntifonaFin.textContent = textoOpt;
                }
            }
        }

        // 4. SALMO INVITATORIO: TÍTULO EN ROJO Y TEXTO COMPLETO EN TEXTO PLANO NEGRO
        if (selSalmo) {
            const opt = selSalmo.selectedOptions[0];
            const salmoId = opt ? opt.value : 'salmo94';
            const salmoObj = cacheTodosLosSalmos.find(s => s.id === salmoId) || 
                             (window.SalmosDB && typeof window.SalmosDB.obtener === 'function' ? window.SalmosDB.obtener(salmoId) : null);

            let tituloSalmo = opt ? (opt.getAttribute('data-titulo') || opt.textContent) : 'SALMO 94 - INVITACIÓN A LA ALABANZA DIVINA';
            let textoSalmo = salmoObj ? salmoObj.texto : '';

            // Fallback si es salmo94
            if (!textoSalmo && salmoId === 'salmo94') {
                textoSalmo = TEXTO_SALMO_94_CANONICO;
            }

            if (previewTituloSalmo) {
                previewTituloSalmo.textContent = tituloSalmo.toUpperCase();
            }
            if (previewTextoSalmo) {
                previewTextoSalmo.textContent = textoSalmo || '';
            }
        }

        // 5. HIMNO: AUTO-RECOMENDACIÓN Y RENDERIZACIÓN DEBAJO DEL INVITATORIO
        if (selHimno) {
            if (forzarRecomendado || !selHimno.value) {
                const numSemana = parseInt(semanaVal.replace('s', '')) || 1;
                const semCiclo = ((numSemana - 1) % 4) + 1;

                // Buscar por tiempo + semana/ciclo + dia + libro
                let matchHimno = cacheTodosLosHimnos.find(h => 
                    h.tiempo === tiempoVal &&
                    h.dia === diaVal &&
                    (Number(h.semana) === numSemana || Number(h.semana) === semCiclo) &&
                    (!h.libro || h.libro === libroVal)
                );

                if (!matchHimno) {
                    matchHimno = cacheTodosLosHimnos.find(h => 
                        h.tiempo === tiempoVal &&
                        h.dia === diaVal &&
                        (!h.libro || h.libro === libroVal)
                    );
                }

                if (!matchHimno) {
                    matchHimno = cacheTodosLosHimnos.find(h => 
                        h.tiempo === tiempoVal &&
                        (!h.libro || h.libro === libroVal)
                    );
                }

                if (matchHimno) {
                    selHimno.value = matchHimno.id || matchHimno.varName;
                }
            }

            const optHimno = selHimno.selectedOptions[0];
            const himnoId = optHimno ? optHimno.value : (selHimno.value || '');
            const himnoObj = cacheTodosLosHimnos.find(h => h.id === himnoId || h.varName === himnoId);

            let tituloHimno = optHimno ? (optHimno.getAttribute('data-titulo') || optHimno.textContent) : (himnoObj ? (himnoObj.titulo || himnoObj.varName) : 'HIMNO');
            let textoHimno = himnoObj ? (himnoObj.texto || '') : '';

            // Asegurar que el título comience con "HIMNO:" si no lo tiene
            if (tituloHimno && !tituloHimno.toUpperCase().startsWith('HIMNO:')) {
                tituloHimno = `HIMNO: ${tituloHimno}`;
            }

            if (previewTituloHimno) {
                previewTituloHimno.textContent = (tituloHimno || 'HIMNO').toUpperCase();
            }
            if (previewTextoHimno) {
                previewTextoHimno.textContent = textoHimno;
            }
        }

        // 6. SALMODIA: ANTÍFONA 1 Y SALMO 1 (SEGÚN IMAGEN media_1789933294563.png)
        if (previewTituloSalmodia) {
            previewTituloSalmodia.textContent = 'SALMODIA';
        }

        // Antífona 1
        if (selAntifona1 && txtAntifona1) {
            if (forzarRecomendado || !selAntifona1.value) {
                const numSemana = parseInt(semanaVal.replace('s', '')) || 1;
                const semCiclo = ((numSemana - 1) % 4) + 1;

                let matchAnt1 = null;
                if (tiempoVal === 'ordinario') {
                    matchAnt1 = cacheAntifonasSalmodia1.find(a =>
                        a.tiempo === 'ordinario' &&
                        a.dia === diaVal &&
                        (Number(a.semana) === numSemana || Number(a.semana) === semCiclo) &&
                        (!a.libro || a.libro === libroVal)
                    );

                    if (!matchAnt1) {
                        matchAnt1 = cacheAntifonasSalmodia1.find(a =>
                            a.tiempo === 'ordinario' &&
                            a.dia === diaVal &&
                            (!a.libro || a.libro === libroVal)
                        );
                    }
                } else {
                    matchAnt1 = cacheAntifonasSalmodia1.find(a =>
                        a.tiempo === tiempoVal &&
                        a.dia === diaVal &&
                        (!a.libro || a.libro === libroVal)
                    );
                    if (!matchAnt1) {
                        matchAnt1 = cacheAntifonasSalmodia1.find(a =>
                            a.tiempo === tiempoVal &&
                            (!a.libro || a.libro === libroVal)
                        );
                    }
                }

                if (!matchAnt1 && cacheAntifonasSalmodia1.length > 0) {
                    matchAnt1 = cacheAntifonasSalmodia1[0];
                }

                if (matchAnt1) {
                    selAntifona1.value = matchAnt1.id || matchAnt1.varName || matchAnt1.texto;
                    const textoAnt1 = matchAnt1.texto || '';
                    txtAntifona1.textContent = textoAnt1;
                    if (txtAntifona1Fin) txtAntifona1Fin.textContent = textoAnt1;
                }
            } else {
                const opt = selAntifona1.selectedOptions[0];
                if (opt) {
                    const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                    txtAntifona1.textContent = textoOpt;
                    if (txtAntifona1Fin) txtAntifona1Fin.textContent = textoOpt;
                }
            }
        }

        // Salmo 1
        if (selSalmo1) {
            if (forzarRecomendado || !selSalmo1.value) {
                if (Array.from(selSalmo1.options).some(o => o.value === 'salmo62_2_9')) {
                    selSalmo1.value = 'salmo62_2_9';
                }
            }

            const optSalmo1 = selSalmo1.selectedOptions[0];
            const salmo1Id = optSalmo1 ? optSalmo1.value : (selSalmo1.value || 'salmo62_2_9');
            const salmo1Obj = cacheTodosLosSalmos.find(s => s.id === salmo1Id) ||
                              (window.SalmosDB && typeof window.SalmosDB.obtener === 'function' ? window.SalmosDB.obtener(salmo1Id) : null);

            let tituloSalmo1 = optSalmo1 ? (optSalmo1.getAttribute('data-titulo') || optSalmo1.textContent) : (salmo1Obj ? salmo1Obj.titulo : 'SALMO 62, 2-9 - EL ALMA SEDIENTA DE DIOS');
            let textoSalmo1 = salmo1Obj ? salmo1Obj.texto : '';
            textoSalmo1 = asegurarTextoCompletoSalmo(salmo1Id, textoSalmo1, TEXTO_SALMO_62_CANONICO);

            if (previewTituloSalmo1) {
                previewTituloSalmo1.textContent = (tituloSalmo1 || 'SALMO 62, 2-9 - EL ALMA SEDIENTA DE DIOS').toUpperCase();
            }
            if (previewTextoSalmo1) {
                previewTextoSalmo1.textContent = textoSalmo1 || '';
            }
        }

        // 7. SALMODIA 2 (ANTÍFONA 2 Y SALMO 2 / CÁNTICO)
        // Antífona 2
        if (selAntifona2 && txtAntifona2) {
            if (forzarRecomendado || !selAntifona2.value) {
                const numSemana = parseInt(semanaVal.replace('s', '')) || 1;
                const semCiclo = ((numSemana - 1) % 4) + 1;

                let matchAnt2 = null;
                if (tiempoVal === 'ordinario') {
                    matchAnt2 = cacheAntifonasSalmodia2.find(a =>
                        a.tiempo === 'ordinario' &&
                        a.dia === diaVal &&
                        (Number(a.semana) === numSemana || Number(a.semana) === semCiclo) &&
                        (!a.libro || a.libro === libroVal)
                    );

                    if (!matchAnt2) {
                        matchAnt2 = cacheAntifonasSalmodia2.find(a =>
                            a.tiempo === 'ordinario' &&
                            a.dia === diaVal &&
                            (!a.libro || a.libro === libroVal)
                        );
                    }
                } else {
                    matchAnt2 = cacheAntifonasSalmodia2.find(a =>
                        a.tiempo === tiempoVal &&
                        a.dia === diaVal &&
                        (!a.libro || a.libro === libroVal)
                    );
                    if (!matchAnt2) {
                        matchAnt2 = cacheAntifonasSalmodia2.find(a =>
                            a.tiempo === tiempoVal &&
                            (!a.libro || a.libro === libroVal)
                        );
                    }
                }

                if (!matchAnt2 && cacheAntifonasSalmodia2.length > 0) {
                    matchAnt2 = cacheAntifonasSalmodia2[0];
                }

                if (matchAnt2) {
                    selAntifona2.value = matchAnt2.id || matchAnt2.varName || matchAnt2.texto;
                    const textoAnt2 = matchAnt2.texto || '';
                    txtAntifona2.textContent = textoAnt2;
                    if (txtAntifona2Fin) txtAntifona2Fin.textContent = textoAnt2;
                }
            } else {
                const opt = selAntifona2.selectedOptions[0];
                if (opt) {
                    const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                    txtAntifona2.textContent = textoOpt;
                    if (txtAntifona2Fin) txtAntifona2Fin.textContent = textoOpt;
                }
            }
        }

        // Salmo 2 (Cántico)
        if (selSalmo2) {
            if (forzarRecomendado || !selSalmo2.value) {
                if (Array.from(selSalmo2.options).some(o => o.value === 'dn_3_57_88_56')) {
                    selSalmo2.value = 'dn_3_57_88_56';
                }
            }

            const optSalmo2 = selSalmo2.selectedOptions[0];
            const salmo2Id = optSalmo2 ? optSalmo2.value : (selSalmo2.value || 'dn_3_57_88_56');
            const salmo2Obj = cacheTodosLosSalmos.find(s => s.id === salmo2Id) ||
                              (window.SalmosDB && typeof window.SalmosDB.obtener === 'function' ? window.SalmosDB.obtener(salmo2Id) : null);

            let tituloSalmo2 = optSalmo2 ? (optSalmo2.getAttribute('data-titulo') || optSalmo2.textContent) : (salmo2Obj ? salmo2Obj.titulo : 'CÁNTICO: TODA LA CREACIÓN ALABE AL SEÑOR - DN 3, 57-88. 56');
            let textoSalmo2 = salmo2Obj ? salmo2Obj.texto : '';
            textoSalmo2 = asegurarTextoCompletoSalmo(salmo2Id, textoSalmo2, TEXTO_CANTICO_DANIEL_CANONICO);

            if (previewTituloSalmo2) {
                previewTituloSalmo2.textContent = (tituloSalmo2 || 'CÁNTICO: TODA LA CREACIÓN ALABE AL SEÑOR - DN 3, 57-88. 56').toUpperCase();
            }
            if (previewTextoSalmo2) {
                previewTextoSalmo2.textContent = textoSalmo2 || '';
            }
        }

        // 8. SALMODIA 3 (ANTÍFONA 3 Y SALMO 3)
        // Antífona 3
        if (selAntifona3 && txtAntifona3) {
            if (forzarRecomendado || !selAntifona3.value) {
                const numSemana = parseInt(semanaVal.replace('s', '')) || 1;
                const semCiclo = ((numSemana - 1) % 4) + 1;

                let matchAnt3 = null;
                if (tiempoVal === 'ordinario') {
                    matchAnt3 = cacheAntifonasSalmodia3.find(a =>
                        a.tiempo === 'ordinario' &&
                        a.dia === diaVal &&
                        (Number(a.semana) === numSemana || Number(a.semana) === semCiclo) &&
                        (!a.libro || a.libro === libroVal)
                    );

                    if (!matchAnt3) {
                        matchAnt3 = cacheAntifonasSalmodia3.find(a =>
                            a.tiempo === 'ordinario' &&
                            a.dia === diaVal &&
                            (!a.libro || a.libro === libroVal)
                        );
                    }
                } else {
                    matchAnt3 = cacheAntifonasSalmodia3.find(a =>
                        a.tiempo === tiempoVal &&
                        a.dia === diaVal &&
                        (!a.libro || a.libro === libroVal)
                    );
                    if (!matchAnt3) {
                        matchAnt3 = cacheAntifonasSalmodia3.find(a =>
                            a.tiempo === tiempoVal &&
                            (!a.libro || a.libro === libroVal)
                        );
                    }
                }

                if (!matchAnt3 && cacheAntifonasSalmodia3.length > 0) {
                    matchAnt3 = cacheAntifonasSalmodia3[0];
                }

                if (matchAnt3) {
                    selAntifona3.value = matchAnt3.id || matchAnt3.varName || matchAnt3.texto;
                    const textoAnt3 = matchAnt3.texto || '';
                    txtAntifona3.textContent = textoAnt3;
                    if (txtAntifona3Fin) txtAntifona3Fin.textContent = textoAnt3;
                }
            } else {
                const opt = selAntifona3.selectedOptions[0];
                if (opt) {
                    const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                    txtAntifona3.textContent = textoOpt;
                    if (txtAntifona3Fin) txtAntifona3Fin.textContent = textoOpt;
                }
            }
        }

        // Salmo 3
        if (selSalmo3) {
            if (forzarRecomendado || !selSalmo3.value) {
                if (Array.from(selSalmo3.options).some(o => o.value === 'salmo149')) {
                    selSalmo3.value = 'salmo149';
                }
            }

            const optSalmo3 = selSalmo3.selectedOptions[0];
            const salmo3Id = optSalmo3 ? optSalmo3.value : (selSalmo3.value || 'salmo149');
            const salmo3Obj = cacheTodosLosSalmos.find(s => s.id === salmo3Id) ||
                              (window.SalmosDB && typeof window.SalmosDB.obtener === 'function' ? window.SalmosDB.obtener(salmo3Id) : null);

            let tituloSalmo3 = optSalmo3 ? (optSalmo3.getAttribute('data-titulo') || optSalmo3.textContent) : (salmo3Obj ? salmo3Obj.titulo : 'SALMO 149 - ALEGRÍA DE LOS SANTOS');
            let textoSalmo3 = salmo3Obj ? salmo3Obj.texto : '';
            textoSalmo3 = asegurarTextoCompletoSalmo(salmo3Id, textoSalmo3, TEXTO_SALMO_149_CANONICO);

            if (previewTituloSalmo3) {
                previewTituloSalmo3.textContent = (tituloSalmo3 || 'SALMO 149 - ALEGRÍA DE LOS SANTOS').toUpperCase();
            }
            if (previewTextoSalmo3) {
                previewTextoSalmo3.textContent = textoSalmo3 || '';
            }
        }

        // 9. LECTURA BREVE Y RESPONSORIO BREVE (DEBAJO DE LA SALMODIA)
        if (selLectura) {
            const infoTiempo = CODIGOS_TIEMPO[tiempoVal] || { codigo: 'to', nombre: 'Tiempo Ordinario' };
            const infoDia    = CODIGOS_DIA[diaVal] || { codigo: 'do', nombre: 'Domingo' };
            const infoLibro  = CODIGOS_LIBRO[libroVal] || { codigo: 'la', nombre: 'Laudes' };
            const numSemana  = parseInt(semanaVal.replace('s', '')) || 1;
            const semCiclo   = ((numSemana - 1) % 4) + 1;

            if (forzarRecomendado || !selLectura.value) {
                let matchLectura = null;

                // 1. Coincidencia por id directo canónico (ej: tos1LAdo, tos1lado, tos1dola)
                const codBuscar1 = `${infoTiempo.codigo}${numSemana}${infoLibro.codigo}${infoDia.codigo}`.toLowerCase();
                const codBuscar2 = `${infoTiempo.codigo}${numSemana}${infoDia.codigo}${infoLibro.codigo}`.toLowerCase();
                const codBuscar3 = `${infoTiempo.codigo}${semCiclo}${infoLibro.codigo}${infoDia.codigo}`.toLowerCase();
                const codBuscar4 = `${infoTiempo.codigo}${semCiclo}${infoDia.codigo}${infoLibro.codigo}`.toLowerCase();

                matchLectura = cacheTodasLasLecturas.find(l => {
                    const lid = (l.id || l.varName || '').toLowerCase();
                    return lid === codBuscar1 || lid === codBuscar2 || lid === codBuscar3 || lid === codBuscar4;
                });

                // 2. Coincidencia por campos litúrgicos (tiempo, semana/ciclo, día)
                if (!matchLectura) {
                    matchLectura = cacheTodasLasLecturas.find(l =>
                        l.tiempo === tiempoVal &&
                        l.dia === diaVal &&
                        (Number(l.semana) === numSemana || Number(l.semana) === semCiclo) &&
                        (!l.libro || l.libro === libroVal)
                    );
                }

                // 3. Coincidencia por tiempo y día
                if (!matchLectura) {
                    matchLectura = cacheTodasLasLecturas.find(l =>
                        l.tiempo === tiempoVal &&
                        l.dia === diaVal &&
                        (!l.libro || l.libro === libroVal)
                    );
                }

                // 4. Fallback: primer elemento del catálogo si existe
                if (!matchLectura && cacheTodasLasLecturas.length > 0) {
                    matchLectura = cacheTodasLasLecturas[0];
                }

                if (matchLectura) {
                    selLectura.value = matchLectura.id || matchLectura.varName;
                }
            }

            const optLectura = selLectura.selectedOptions[0];
            const lecturaId = optLectura ? optLectura.value : (selLectura.value || '');
            const lecturaObj = cacheTodasLasLecturas.find(l => l.id === lecturaId || l.varName === lecturaId);

            let citaLectura = lecturaObj ? (lecturaObj.cita || lecturaObj.id) : (optLectura ? (optLectura.getAttribute('data-cita') || 'Is 61, 1-2a') : 'Is 61, 1-2a');
            let textoLectura = lecturaObj ? (lecturaObj.texto || '') : '';

            // Texto canónico de respaldo si la base de datos aún no terminó de sincronizar
            if (!textoLectura && (lecturaId === 'bautismoLA' || lecturaId === 'tos1LAdo' || citaLectura.includes('Is 61'))) {
                citaLectura = 'Is 61, 1-2a';
                textoLectura = 'El Espíritu del Señor está sobre mí, porque el Señor me ha ungido. Me ha enviado para dar la buena noticia a los pobres, para vendar los corazones desgarrados, para proclamar la amnistía a los cautivos, la libertad a los prisioneros, para proclamar el año de gracia del Señor.';
            }

            const rb1 = lecturaObj ? (lecturaObj.rb1 || lecturaObj.responsorioBreve?.v1 || 'Cristo, Hijo de Dios vivo, ten piedad de nosotros.') : 'Cristo, Hijo de Dios vivo, ten piedad de nosotros.';
            const rb2 = lecturaObj ? (lecturaObj.rb2 || lecturaObj.responsorioBreve?.v2 || 'Tú que hoy te has manifestado.') : 'Tú que hoy te has manifestado.';
            const rb3 = lecturaObj ? (lecturaObj.rb3 || lecturaObj.responsorioBreve?.r2 || 'Ten piedad de nosotros.') : 'Ten piedad de nosotros.';

            if (previewCitaLectura) {
                previewCitaLectura.textContent = citaLectura;
            }
            if (previewTextoLectura) {
                previewTextoLectura.textContent = textoLectura;
            }
            if (previewRespV1) {
                previewRespV1.textContent = rb1;
            }
            if (previewRespR1) {
                previewRespR1.textContent = rb1;
            }
            if (previewRespV2) {
                previewRespV2.textContent = rb2;
            }
            if (previewRespR2) {
                previewRespR2.textContent = rb3;
            }
            if (previewRespR3) {
                previewRespR3.textContent = rb1;
            }
        }

        // 10. CÁNTICO EVANGÉLICO (ZACARÍAS EN LAUDES, MAGNÍFICAT EN VÍSPERAS, NUNC DIMITTIS EN COMPLETAS)
        if (selCantico) {
            const canticoRecomendado = libroVal === 'vispera' ? 'magnificat' : (libroVal === 'completas' ? 'nunc_dimittis' : 'cantico_zacarias');
            if (forzarRecomendado || !selCantico.value) {
                if (Array.from(selCantico.options).some(o => o.value === canticoRecomendado)) {
                    selCantico.value = canticoRecomendado;
                }
            }

            const optCantico = selCantico.selectedOptions[0];
            const cantId = optCantico ? optCantico.value : (selCantico.value || 'cantico_zacarias');
            const cantObj = CATALOGO_CANTICOS.find(c => c.id === cantId) || CATALOGO_CANTICOS[0];

            let nombreCantico = cantObj ? cantObj.nombre : 'Cántico de Zacarías. EL MESÍAS Y SU PRECURSOR';
            let citaCantico = cantObj ? cantObj.cita : 'Lc 1, 68-79';
            let textoCantico = cantObj ? cantObj.texto : TEXTO_CANTICO_ZACARIAS_CANONICO;

            if (previewNombreCantico) previewNombreCantico.textContent = nombreCantico;
            if (previewCitaCantico) previewCitaCantico.textContent = citaCantico;
            if (previewTextoCantico) previewTextoCantico.textContent = textoCantico;
        }

        // Antífona del Cántico Evangélico
        if (selAntifonaCantico && txtAntifonaCantico) {
            if (forzarRecomendado || !selAntifonaCantico.value) {
                const antRecom = obtenerAntifonaCanticoRecomendada(tiempoVal, semanaVal, diaVal, libroVal);
                if (antRecom) {
                    if (Array.from(selAntifonaCantico.options).some(o => o.value === antRecom.id || o.value === antRecom.varName || o.getAttribute('data-texto') === antRecom.texto)) {
                        const m = Array.from(selAntifonaCantico.options).find(o => o.value === antRecom.id || o.value === antRecom.varName || o.getAttribute('data-texto') === antRecom.texto);
                        if (m) selAntifonaCantico.value = m.value;
                    } else {
                        const opt = document.createElement('option');
                        opt.value = antRecom.id || antRecom.varName || antRecom.texto;
                        opt.setAttribute('data-texto', antRecom.texto);
                        opt.textContent = antRecom.texto;
                        selAntifonaCantico.appendChild(opt);
                        selAntifonaCantico.value = opt.value;
                    }
                    txtAntifonaCantico.textContent = antRecom.texto;
                    if (txtAntifonaCanticoFin) txtAntifonaCanticoFin.textContent = antRecom.texto;
                }
            } else {
                const opt = selAntifonaCantico.selectedOptions[0];
                if (opt) {
                    const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                    txtAntifonaCantico.textContent = textoOpt;
                    if (txtAntifonaCanticoFin) txtAntifonaCanticoFin.textContent = textoOpt;
                }
            }
        }

        // 11. PRECES (SEGÚN IMAGEN media_1789937648394.png)
        const precesObj = obtenerPrecesRecomendadas(tiempoVal, semanaVal, diaVal, libroVal);
        if (previewTituloPreces) previewTituloPreces.textContent = 'PRECES';
        if (previewTextoPreces && precesObj) {
            previewTextoPreces.textContent = precesObj.texto || '';
        }
        if (previewIntroPadreNuestro && precesObj) {
            previewIntroPadreNuestro.textContent = precesObj.concl || 'Terminemos nuestra oración con la plegaria que Cristo nos enseñó:';
        }

        // 12. ORACIÓN (SEGÚN IMAGEN media_1789937648394.png)
        const oracionTextoRecom = obtenerOracionRecomendada(tiempoVal, semanaVal, diaVal, libroVal);
        if (previewTituloOracion) previewTituloOracion.textContent = 'ORACION';
        if (previewTextoOracion) {
            previewTextoOracion.textContent = oracionTextoRecom || '';
        }

        // 13. CONCLUSIÓN (SEGÚN IMAGEN media_1789937648394.png)
        if (previewTituloConclusion) previewTituloConclusion.textContent = 'CONCLUSIÓN';
        if (previewConclusionV) previewConclusionV.textContent = 'El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.';
        if (previewConclusionR) previewConclusionR.textContent = 'Amén.';
    }

    // Función auxiliar para seleccionar opción por valor, data-atributo o texto
    function seleccionarOpcion(selectEl, valor, textoAlternativo) {
        if (!selectEl || selectEl.options.length === 0) return false;
        const opts = Array.from(selectEl.options);

        const norm = (s) => (s || '').toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '');

        const vNorm = norm(valor);
        const tNorm = norm(textoAlternativo);

        // 1. Coincidencia exacta o normalizada por value o data-id/varname
        if (valor) {
            let m = opts.find(o => o.value === valor);
            if (!m && vNorm) m = opts.find(o => norm(o.value) === vNorm);
            if (!m && vNorm) m = opts.find(o => norm(o.getAttribute('data-varname') || o.getAttribute('data-id') || '') === vNorm);
            if (m) {
                selectEl.value = m.value;
                return true;
            }
        }

        // 2. Coincidencia por data-texto, data-titulo o textContent
        if (textoAlternativo && tNorm) {
            let m = opts.find(o => {
                const dt = norm(o.getAttribute('data-texto') || o.getAttribute('data-titulo') || '');
                const ct = norm(o.textContent);
                return dt === tNorm || ct === tNorm;
            });
            if (m) {
                selectEl.value = m.value;
                return true;
            }

            // Coincidencia por contención de subcadena (mínimo 6 caracteres para evitar falsos positivos)
            if (tNorm.length >= 6) {
                m = opts.find(o => {
                    const dt = norm(o.getAttribute('data-texto') || o.getAttribute('data-titulo') || '');
                    const ct = norm(o.textContent);
                    return (dt && (dt.includes(tNorm) || tNorm.includes(dt))) ||
                           (ct && (ct.includes(tNorm) || tNorm.includes(ct)));
                });
                if (m) {
                    selectEl.value = m.value;
                    return true;
                }
            }
        }

        // 3. Coincidencia especial para Salmos por número canónico (94, 99, 66, 23, 62, 149)
        const numMatch = `${valor || ''} ${textoAlternativo || ''}`.match(/\b(94|99|66|23|62|149)\b/);
        if (numMatch) {
            const n = numMatch[1];
            const m = opts.find(o => o.value.includes(n) || o.textContent.includes(n));
            if (m) {
                selectEl.value = m.value;
                return true;
            }
        }

        // Coincidencia especial para Cántico de Daniel
        if ((valor && valor.includes('dn_3')) || (textoAlternativo && (textoAlternativo.toLowerCase().includes('daniel') || textoAlternativo.toLowerCase().includes('creacion') || textoAlternativo.includes('Dn 3')))) {
            const m = opts.find(o => o.value.includes('dn_3') || o.textContent.toLowerCase().includes('daniel') || o.textContent.toLowerCase().includes('creacion') || o.textContent.includes('Dn 3'));
            if (m) {
                selectEl.value = m.value;
                return true;
            }
        }

        return false;
    }

    // Restaurar estado visual y selectores a partir de datos guardados
    function restaurarDesdeDatos(datos) {
        if (!datos) return;
        actualizarBadgeEstado(true);

        // 1. ANTÍFONA
        const inv = datos.invitatorio || datos.salmoInvitatorio || {};
        const antId = inv.antifonaId || datos.antifonaId || null;
        const antTexto = inv.antifonaTexto || inv.antifona || datos.antifonaInvitatorio || datos.salmoInvitatorio?.antifonaInvitatorio || null;

        if (selAntifona && (antId || antTexto)) {
            const matched = seleccionarOpcion(selAntifona, antId, antTexto);
            if (!matched && antTexto) {
                // Si la antífona guardada no estaba en las opciones, la insertamos dinámicamente
                const opt = document.createElement('option');
                opt.value = antId || antTexto;
                opt.setAttribute('data-texto', antTexto);
                opt.textContent = antTexto;
                selAntifona.appendChild(opt);
                selAntifona.value = opt.value;
            }
        }

        const optAntActual = selAntifona ? selAntifona.selectedOptions[0] : null;
        const textoAntFinal = optAntActual ? (optAntActual.getAttribute('data-texto') || optAntActual.textContent) : (antTexto || '');
        if (textoAntFinal) {
            if (txtAntifona) txtAntifona.textContent = textoAntFinal;
            if (txtAntifonaFin) txtAntifonaFin.textContent = textoAntFinal;
        }

        // 2. SALMO INVITATORIO
        let salId = inv.salmoId || datos.salmoId || (inv.salmoTitulo && inv.salmoTitulo.includes('94') ? 'salmo94' : null) || 'salmo94';
        let salTitulo = inv.salmoTitulo || inv.titulo || datos.salmoInvitatorio?.titulo || 'SALMO 94 - INVITACIÓN A LA ALABANZA DIVINA';
        let salTexto = inv.salmoTexto || inv.contentInv || datos.salmoInvitatorio?.contentInv || null;

        if (selSalmo) {
            seleccionarOpcion(selSalmo, salId, salTitulo);
        }

        const optSalmoActual = selSalmo ? selSalmo.selectedOptions[0] : null;
        if (optSalmoActual) {
            salId = optSalmoActual.value;
            salTitulo = optSalmoActual.getAttribute('data-titulo') || optSalmoActual.textContent;
        }

        if (previewTituloSalmo && salTitulo) {
            previewTituloSalmo.textContent = salTitulo.toUpperCase();
        }

        // Recuperar texto completo del salmo si estaba vacío o truncado con "..."
        if (!salTexto || (salTexto.includes('demos vítores a la Roca que nos salva...') && salTexto.length < 150)) {
            const sObj = cacheTodosLosSalmos.find(s => s.id === salId) ||
                         (window.SalmosDB && typeof window.SalmosDB.obtener === 'function' ? window.SalmosDB.obtener(salId) : null);
            if (sObj && sObj.texto) {
                salTexto = sObj.texto;
            } else if (salId === 'salmo94') {
                salTexto = TEXTO_SALMO_94_CANONICO;
            }
        }

        if (previewTextoSalmo) {
            previewTextoSalmo.textContent = salTexto || '';
        }

        // 3. HIMNO
        const himData = datos.himno || {};
        const himId = himData.id || inv.himnoId || datos.salmoInvitatorio?.himnoId || null;
        let himTitulo = himData.titulo || datos.salmoInvitatorio?.himnot || null;
        let himTexto = himData.texto || datos.salmoInvitatorio?.himno || null;

        if (selHimno && (himId || himTitulo)) {
            seleccionarOpcion(selHimno, himId, himTitulo);
        }

        const optHimnoActual = selHimno ? selHimno.selectedOptions[0] : null;
        if (optHimnoActual) {
            himTitulo = optHimnoActual.getAttribute('data-titulo') || optHimnoActual.textContent;
        }

        if (!himTexto && optHimnoActual) {
            const hObj = cacheTodosLosHimnos.find(h => (h.id === optHimnoActual.value || h.varName === optHimnoActual.value));
            if (hObj && hObj.texto) {
                himTexto = hObj.texto;
            }
        }

        if (previewTituloHimno && himTitulo) {
            let t = himTitulo;
            if (!t.toUpperCase().startsWith('HIMNO:')) {
                t = `HIMNO: ${t}`;
            }
            previewTituloHimno.textContent = t.toUpperCase();
        }
        if (previewTextoHimno) {
            previewTextoHimno.textContent = himTexto || '';
        }

        // 4. SALMODIA 1
        const salData = datos.salmodia || datos.Salmodias || {};
        const ant1Id = salData.ant1Id || datos.ant1Id || null;
        const ant1Texto = salData.ant1 || salData.Ant1 || null;

        if (selAntifona1 && (ant1Id || ant1Texto)) {
            const matched = seleccionarOpcion(selAntifona1, ant1Id, ant1Texto);
            if (!matched && ant1Texto) {
                const opt = document.createElement('option');
                opt.value = ant1Id || ant1Texto;
                opt.setAttribute('data-texto', ant1Texto);
                opt.textContent = ant1Texto;
                selAntifona1.appendChild(opt);
                selAntifona1.value = opt.value;
            }
        }

        const optAnt1Actual = selAntifona1 ? selAntifona1.selectedOptions[0] : null;
        const textoAnt1Final = optAnt1Actual ? (optAnt1Actual.getAttribute('data-texto') || optAnt1Actual.textContent) : (ant1Texto || '');
        if (textoAnt1Final) {
            if (txtAntifona1) txtAntifona1.textContent = textoAnt1Final;
            if (txtAntifona1Fin) txtAntifona1Fin.textContent = textoAnt1Final;
        }

        let salmo1Id = salData.salmo1Id || datos.salmo1Id || (salData.salmo1Titulo && salData.salmo1Titulo.includes('62') ? 'salmo62_2_9' : null) || 'salmo62_2_9';
        let salmo1Titulo = salData.salmo1Titulo || salData.SalmoUNOt || null;
        let salmo1Texto = salData.salmo1Texto || salData.SalmoUNO || null;

        if (selSalmo1 && (salmo1Id || salmo1Titulo)) {
            seleccionarOpcion(selSalmo1, salmo1Id, salmo1Titulo);
        }

        const optSalmo1Actual = selSalmo1 ? selSalmo1.selectedOptions[0] : null;
        if (optSalmo1Actual) {
            salmo1Id = optSalmo1Actual.value;
            salmo1Titulo = optSalmo1Actual.getAttribute('data-titulo') || optSalmo1Actual.textContent;
        }

        if (previewTituloSalmo1 && salmo1Titulo) {
            previewTituloSalmo1.textContent = salmo1Titulo.toUpperCase();
        }

        salmo1Texto = asegurarTextoCompletoSalmo(salmo1Id, salmo1Texto, TEXTO_SALMO_62_CANONICO);

        if (previewTextoSalmo1) {
            previewTextoSalmo1.textContent = salmo1Texto || '';
        }

        // 5. SALMODIA 2
        const ant2Id = salData.ant2Id || datos.ant2Id || null;
        const ant2Texto = salData.ant2 || salData.Ant2 || null;

        if (selAntifona2 && (ant2Id || ant2Texto)) {
            const matched = seleccionarOpcion(selAntifona2, ant2Id, ant2Texto);
            if (!matched && ant2Texto) {
                const opt = document.createElement('option');
                opt.value = ant2Id || ant2Texto;
                opt.setAttribute('data-texto', ant2Texto);
                opt.textContent = ant2Texto;
                selAntifona2.appendChild(opt);
                selAntifona2.value = opt.value;
            }
        }

        const optAnt2Actual = selAntifona2 ? selAntifona2.selectedOptions[0] : null;
        const textoAnt2Final = optAnt2Actual ? (optAnt2Actual.getAttribute('data-texto') || optAnt2Actual.textContent) : (ant2Texto || '');
        if (textoAnt2Final) {
            if (txtAntifona2) txtAntifona2.textContent = textoAnt2Final;
            if (txtAntifona2Fin) txtAntifona2Fin.textContent = textoAnt2Final;
        }

        let salmo2Id = salData.salmo2Id || datos.salmo2Id || (salData.salmo2Titulo && (salData.salmo2Titulo.toLowerCase().includes('daniel') || salData.salmo2Titulo.toLowerCase().includes('creacion') || salData.salmo2Titulo.toLowerCase().includes('creación') || salData.salmo2Titulo.includes('dn_3')) ? 'dn_3_57_88_56' : null) || 'dn_3_57_88_56';
        let salmo2Titulo = salData.salmo2Titulo || salData.SalmoDOSt || null;
        let salmo2Texto = salData.salmo2Texto || salData.SalmoDOS || null;

        if (selSalmo2 && (salmo2Id || salmo2Titulo)) {
            seleccionarOpcion(selSalmo2, salmo2Id, salmo2Titulo);
        }

        const optSalmo2Actual = selSalmo2 ? selSalmo2.selectedOptions[0] : null;
        if (optSalmo2Actual) {
            salmo2Id = optSalmo2Actual.value;
            salmo2Titulo = optSalmo2Actual.getAttribute('data-titulo') || optSalmo2Actual.textContent;
        }

        if (previewTituloSalmo2 && salmo2Titulo) {
            previewTituloSalmo2.textContent = salmo2Titulo.toUpperCase();
        }

        salmo2Texto = asegurarTextoCompletoSalmo(salmo2Id, salmo2Texto, TEXTO_CANTICO_DANIEL_CANONICO);

        if (previewTextoSalmo2) {
            previewTextoSalmo2.textContent = salmo2Texto || '';
        }

        // 6. SALMODIA 3
        const ant3Id = salData.ant3Id || datos.ant3Id || null;
        const ant3Texto = salData.ant3 || salData.Ant3 || null;

        if (selAntifona3 && (ant3Id || ant3Texto)) {
            const matched = seleccionarOpcion(selAntifona3, ant3Id, ant3Texto);
            if (!matched && ant3Texto) {
                const opt = document.createElement('option');
                opt.value = ant3Id || ant3Texto;
                opt.setAttribute('data-texto', ant3Texto);
                opt.textContent = ant3Texto;
                selAntifona3.appendChild(opt);
                selAntifona3.value = opt.value;
            }
        }

        const optAnt3Actual = selAntifona3 ? selAntifona3.selectedOptions[0] : null;
        const textoAnt3Final = optAnt3Actual ? (optAnt3Actual.getAttribute('data-texto') || optAnt3Actual.textContent) : (ant3Texto || '');
        if (textoAnt3Final) {
            if (txtAntifona3) txtAntifona3.textContent = textoAnt3Final;
            if (txtAntifona3Fin) txtAntifona3Fin.textContent = textoAnt3Final;
        }

        let salmo3Id = salData.salmo3Id || datos.salmo3Id || (salData.salmo3Titulo && salData.salmo3Titulo.includes('149') ? 'salmo149' : null) || 'salmo149';
        let salmo3Titulo = salData.salmo3Titulo || salData.SalmoTRESt || null;
        let salmo3Texto = salData.salmo3Texto || salData.SalmoTRES || null;

        if (selSalmo3 && (salmo3Id || salmo3Titulo)) {
            seleccionarOpcion(selSalmo3, salmo3Id, salmo3Titulo);
        }

        const optSalmo3Actual = selSalmo3 ? selSalmo3.selectedOptions[0] : null;
        if (optSalmo3Actual) {
            salmo3Id = optSalmo3Actual.value;
            salmo3Titulo = optSalmo3Actual.getAttribute('data-titulo') || optSalmo3Actual.textContent;
        }

        if (previewTituloSalmo3 && salmo3Titulo) {
            previewTituloSalmo3.textContent = salmo3Titulo.toUpperCase();
        }

        salmo3Texto = asegurarTextoCompletoSalmo(salmo3Id, salmo3Texto, TEXTO_SALMO_149_CANONICO);

        if (previewTextoSalmo3) {
            previewTextoSalmo3.textContent = salmo3Texto || '';
        }

        // 7. LECTURA BREVE Y RESPONSORIO BREVE
        const lbData = datos.lecturaBreve || datos.LecturaBreve || {};
        const lbId = lbData.id || null;
        let lbCita = lbData.cita || lbData.LecturaCita || null;
        let lbTexto = lbData.texto || lbData.LecturaTexto || null;

        let rbV1 = lbData.responsorioBreve?.v1 || lbData.responsorio1 || null;
        let rbR1 = lbData.responsorioBreve?.r1 || lbData.responsorio2 || rbV1;
        let rbV2 = lbData.responsorioBreve?.v2 || lbData.responsorio3 || null;
        let rbR2 = lbData.responsorioBreve?.r2 || lbData.responsorio4 || null;
        let rbR3 = lbData.responsorioBreve?.r3 || lbData.responsorio5 || rbV1;

        if (selLectura && (lbId || lbCita)) {
            seleccionarOpcion(selLectura, lbId, lbCita);
        }

        const optLecturaActual = selLectura ? selLectura.selectedOptions[0] : null;
        if (optLecturaActual && (!lbTexto || !rbV1)) {
            const lObj = cacheTodasLasLecturas.find(l => l.id === optLecturaActual.value || l.varName === optLecturaActual.value);
            if (lObj) {
                if (!lbCita) lbCita = lObj.cita;
                if (!lbTexto) lbTexto = lObj.texto;
                if (!rbV1) rbV1 = lObj.rb1;
                if (!rbR1) rbR1 = lObj.rb1;
                if (!rbV2) rbV2 = lObj.rb2;
                if (!rbR2) rbR2 = lObj.rb3;
                if (!rbR3) rbR3 = lObj.rb1;
            }
        }

        if (previewCitaLectura && lbCita) previewCitaLectura.textContent = lbCita;
        if (previewTextoLectura && lbTexto) previewTextoLectura.textContent = lbTexto;
        if (previewRespV1 && rbV1) previewRespV1.textContent = rbV1;
        if (previewRespR1 && rbR1) previewRespR1.textContent = rbR1;
        if (previewRespV2 && rbV2) previewRespV2.textContent = rbV2;
        if (previewRespR2 && rbR2) previewRespR2.textContent = rbR2;
        if (previewRespR3 && rbR3) previewRespR3.textContent = rbR3;

        // 8. CÁNTICO EVANGÉLICO
        const ceData = datos.canticoEvangelico || datos.cEvan_Conclusion || {};
        const antCEId = ceData.antifonaId || ceData.antifona || ceData.cEvangelicoAnt || null;
        const antCETexto = ceData.antifonaTexto || ceData.antifona || ceData.cEvangelicoAnt || null;

        if (selAntifonaCantico && (antCEId || antCETexto)) {
            const matched = seleccionarOpcion(selAntifonaCantico, antCEId, antCETexto);
            if (!matched && antCETexto) {
                const opt = document.createElement('option');
                opt.value = antCEId || antCETexto;
                opt.setAttribute('data-texto', antCETexto);
                opt.textContent = antCETexto;
                selAntifonaCantico.appendChild(opt);
                selAntifonaCantico.value = opt.value;
            }
        }

        const optAntCEActual = selAntifonaCantico ? selAntifonaCantico.selectedOptions[0] : null;
        const textoAntCEFinal = optAntCEActual ? (optAntCEActual.getAttribute('data-texto') || optAntCEActual.textContent) : (antCETexto || '');
        if (textoAntCEFinal) {
            if (txtAntifonaCantico) txtAntifonaCantico.textContent = textoAntCEFinal;
            if (txtAntifonaCanticoFin) txtAntifonaCanticoFin.textContent = textoAntCEFinal;
        }

        let canticoId = ceData.tipo || ceData.id || (ceData.canticoZacarias ? 'cantico_zacarias' : null) || 'cantico_zacarias';
        let canticoTitulo = ceData.titulo || ceData.canticoZacariast || null;
        let canticoTexto = ceData.texto || ceData.canticoZacarias || null;

        if (selCantico && (canticoId || canticoTitulo)) {
            seleccionarOpcion(selCantico, canticoId, canticoTitulo);
        }

        const optCantActual = selCantico ? selCantico.selectedOptions[0] : null;
        if (optCantActual) {
            canticoId = optCantActual.value;
        }

        const cantObj = CATALOGO_CANTICOS.find(c => c.id === canticoId) || CATALOGO_CANTICOS[0];
        if (previewNombreCantico) previewNombreCantico.textContent = cantObj.nombre;
        if (previewCitaCantico) previewCitaCantico.textContent = cantObj.cita;
        if (previewTextoCantico) previewTextoCantico.textContent = canticoTexto || cantObj.texto;

        // 9. PRECES
        const precesData = datos.preces || {};
        const precesTextoGuardado = precesData.texto || (datos.cEvan_Conclusion ? datos.cEvan_Conclusion.preces1 : null);
        const precesConclGuardado = precesData.concl || (datos.cEvan_Conclusion ? datos.cEvan_Conclusion.preces2 : null);

        if (previewTextoPreces && precesTextoGuardado) {
            previewTextoPreces.textContent = precesTextoGuardado;
        }
        if (previewIntroPadreNuestro && precesConclGuardado) {
            previewIntroPadreNuestro.textContent = precesConclGuardado;
        }

        // 10. ORACIÓN
        const oracionData = datos.oracion || {};
        const oracionTextoGuardado = (typeof oracionData === 'string' ? oracionData : oracionData.texto) || (datos.cEvan_Conclusion ? datos.cEvan_Conclusion.oracion : null);
        if (previewTextoOracion && oracionTextoGuardado) {
            previewTextoOracion.textContent = oracionTextoGuardado;
        }

        // 11. CONCLUSIÓN
        const conclData = datos.conclusion || {};
        const conclVGuardado = conclData.v || (datos.cEvan_Conclusion ? datos.cEvan_Conclusion.Conclusion1 : null);
        const conclRGuardado = conclData.r || (datos.cEvan_Conclusion ? datos.cEvan_Conclusion.Conclusion2 : null);
        if (previewConclusionV && conclVGuardado) {
            previewConclusionV.textContent = conclVGuardado;
        }
        if (previewConclusionR && conclRGuardado) {
            previewConclusionR.textContent = conclRGuardado;
        }
    }

    // Verificar si el ID actual ya ha sido guardado (asíncrono para Firebase de respaldo)
    async function verificarEstadoId(idCodigo) {
        // Primero revisar si ya existe localmente
        const guardadoLocal = localStorage.getItem(`lh_salterio_${idCodigo}`);
        if (guardadoLocal) {
            try {
                const datos = JSON.parse(guardadoLocal);
                restaurarDesdeDatos(datos);
                return;
            } catch (e) {}
        }

        // Si no está local, buscar en Firebase Firestore
        let datosCargados = null;
        if (window.firebaseAPI && window.firebaseAPI.db) {
            try {
                const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
                const snap = await getDoc(doc(window.firebaseAPI.db, "salterios", idCodigo));
                if (snap && snap.exists()) {
                    datosCargados = snap.data();
                    // Guardar en local para futuras cargas instantáneas
                    localStorage.setItem(`lh_salterio_${idCodigo}`, JSON.stringify(datosCargados));
                }
            } catch (e) {}
        }

        if (datosCargados) {
            restaurarDesdeDatos(datosCargados);
        } else {
            actualizarBadgeEstado(false);
            // Si no está guardado, aplicar la antífona recomendada para este día y salmo 94
            actualizarInvitatorioPreview(true);
        }
    }

    // Calcular y renderizar el código combinado (ej: tos1dola, tos24sala, tos25dola)
    function actualizarCodigoCombinado(esCambioParametro = false) {
        const tiempoVal = selTiempo.value;
        const semanaVal = selSemana.value; // ej: s1, s24 o s25
        const diaVal    = selDia.value;
        const libroVal  = selLibro.value;

        const infoTiempo = CODIGOS_TIEMPO[tiempoVal] || { codigo: 'to', nombre: 'Tiempo Ordinario' };
        const codSemana  = semanaVal || 's1';
        const infoDia    = CODIGOS_DIA[diaVal] || { codigo: 'do', nombre: 'Domingo' };
        const infoLibro  = CODIGOS_LIBRO[libroVal] || { codigo: 'la', nombre: 'Laudes' };

        // Combinación del código
        const codigoFinal = `${infoTiempo.codigo}${codSemana}${infoDia.codigo}${infoLibro.codigo}`.toLowerCase();

        if (inputCodigo) {
            inputCodigo.value = codigoFinal;
        }

        // Actualizar badges explicativos
        const badgeTiempo = document.getElementById('badgeTiempo');
        const badgeSemana = document.getElementById('badgeSemana');
        const badgeDia    = document.getElementById('badgeDia');
        const badgeLibro  = document.getElementById('badgeLibro');
        const textoDesc   = document.getElementById('textoDescriptivo');

        if (badgeTiempo) badgeTiempo.innerHTML = `Tiempo: <strong>${infoTiempo.codigo}</strong> (${infoTiempo.nombre})`;
        if (badgeSemana) badgeSemana.innerHTML = `Semana: <strong>${codSemana}</strong>`;
        if (badgeDia)    badgeDia.innerHTML    = `Día: <strong>${infoDia.codigo}</strong> (${infoDia.nombre})`;
        if (badgeLibro)  badgeLibro.innerHTML  = `Hora: <strong>${infoLibro.codigo}</strong> (${infoLibro.nombre})`;

        if (textoDesc) {
            textoDesc.textContent = `${infoTiempo.nombre} • ${codSemana.toUpperCase()} • ${infoDia.nombre} • ${infoLibro.nombre}`;
        }

        // Sincronizar título y subtítulo de la hora siempre
        const mapaTitulos = {
            laudes:    'LAUDES',
            oficio:    'OFICIO DE LECTURA',
            vispera:   'VÍSPERAS',
            tercia:    'TERCIA',
            sexta:     'SEXTA',
            nona:      'NONA',
            completas: 'COMPLETAS'
        };
        if (previewTituloHora) {
            previewTituloHora.textContent = mapaTitulos[libroVal] || (CODIGOS_LIBRO[libroVal] ? CODIGOS_LIBRO[libroVal].nombre.toUpperCase() : 'LAUDES');
        }
        const mapaSubtitulos = {
            laudes:    '(Oración de la mañana)',
            oficio:    '(Oficio de lectura y contemplación)',
            vispera:   '(Oración de la tarde)',
            tercia:    '(Antes del mediodía)',
            sexta:     '(Al mediodía)',
            nona:      '(De la tarde)',
            completas: '(Oración antes del descanso nocturno)'
        };
        if (previewSubtituloHora) {
            previewSubtituloHora.textContent = mapaSubtitulos[libroVal] || '(Oración de la mañana)';
        }

        // Comprobación sincrónica inmediata de LocalStorage para evitar parpadeos o sobrescrituras
        const localDataRaw = localStorage.getItem(`lh_salterio_${codigoFinal}`);
        if (localDataRaw) {
            try {
                const datos = JSON.parse(localDataRaw);
                restaurarDesdeDatos(datos);
                return;
            } catch (e) {}
        }

        // Si no está en LocalStorage, renderizar recomendaciones por defecto
        actualizarBadgeEstado(false);
        actualizarInvitatorioPreview(esCambioParametro);

        // Y verificar asíncronamente con Firebase
        verificarEstadoId(codigoFinal);
    }

    // Guardar en Firebase y LocalStorage con el ID Primario
    async function guardarEnFirebase() {
        const idCodigo = inputCodigo.value.trim().toLowerCase();
        if (!idCodigo) {
            alert('No hay un código índice generado.');
            return;
        }

        if (!btnGuardar) return;

        const txtOriginal = btnGuardar.innerHTML;
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;">hourglass_top</span> <span>Guardando...</span>`;

        const tiempoVal = selTiempo.value;
        const semanaVal = selSemana.value || 's1';
        const diaVal    = selDia.value;
        const libroVal  = selLibro.value;

        const infoTiempo = CODIGOS_TIEMPO[tiempoVal] || { codigo: 'to', nombre: 'Tiempo Ordinario' };
        const infoDia    = CODIGOS_DIA[diaVal] || { codigo: 'do', nombre: 'Domingo' };
        const infoLibro  = CODIGOS_LIBRO[libroVal] || { codigo: 'la', nombre: 'Laudes' };

        const antifonaTexto = (txtAntifona ? txtAntifona.textContent.trim() : '');
        const antifonaId = (selAntifona ? selAntifona.value : '');
        const salmoId = (selSalmo ? selSalmo.value : 'salmo94');
        const salmoTitulo = (previewTituloSalmo ? previewTituloSalmo.textContent.trim() : 'SALMO 94 - INVITACIÓN A LA ALABANZA DIVINA');

        let salmoTexto = (previewTextoSalmo ? previewTextoSalmo.textContent.trim() : '');
        if (!salmoTexto && salmoId === 'salmo94') {
            salmoTexto = TEXTO_SALMO_94_CANONICO;
        }

        const himnoId = (selHimno ? selHimno.value : '');
        const himnoTitulo = (previewTituloHimno ? previewTituloHimno.textContent.trim() : 'HIMNO');
        const himnoTexto = (previewTextoHimno ? previewTextoHimno.textContent.trim() : '');

        const ant1Texto = (txtAntifona1 ? txtAntifona1.textContent.trim() : '');
        const ant1Id = (selAntifona1 ? selAntifona1.value : '');
        const salmo1Id = (selSalmo1 ? selSalmo1.value : 'salmo62_2_9');
        const salmo1Titulo = (previewTituloSalmo1 ? previewTituloSalmo1.textContent.trim() : 'SALMO 62, 2-9 - EL ALMA SEDIENTA DE DIOS');
        const salmo1Texto = asegurarTextoCompletoSalmo(salmo1Id, previewTextoSalmo1 ? previewTextoSalmo1.textContent.trim() : '', TEXTO_SALMO_62_CANONICO);

        const ant2Texto = (txtAntifona2 ? txtAntifona2.textContent.trim() : '');
        const ant2Id = (selAntifona2 ? selAntifona2.value : '');
        const salmo2Id = (selSalmo2 ? selSalmo2.value : 'dn_3_57_88_56');
        const salmo2Titulo = (previewTituloSalmo2 ? previewTituloSalmo2.textContent.trim() : 'CÁNTICO: TODA LA CREACIÓN ALABE AL SEÑOR - DN 3, 57-88. 56');
        const salmo2Texto = asegurarTextoCompletoSalmo(salmo2Id, previewTextoSalmo2 ? previewTextoSalmo2.textContent.trim() : '', TEXTO_CANTICO_DANIEL_CANONICO);

        const ant3Texto = (txtAntifona3 ? txtAntifona3.textContent.trim() : '');
        const ant3Id = (selAntifona3 ? selAntifona3.value : '');
        const salmo3Id = (selSalmo3 ? selSalmo3.value : 'salmo149');
        const salmo3Titulo = (previewTituloSalmo3 ? previewTituloSalmo3.textContent.trim() : 'SALMO 149 - ALEGRÍA DE LOS SANTOS');
        const salmo3Texto = asegurarTextoCompletoSalmo(salmo3Id, previewTextoSalmo3 ? previewTextoSalmo3.textContent.trim() : '', TEXTO_SALMO_149_CANONICO);

        const lecturaId = (selLectura ? selLectura.value : '');
        const lecturaCita = (previewCitaLectura ? previewCitaLectura.textContent.trim() : 'Is 61, 1-2a');
        const lecturaTexto = (previewTextoLectura ? previewTextoLectura.textContent.trim() : '');
        const respV1 = (previewRespV1 ? previewRespV1.textContent.trim() : 'Cristo, Hijo de Dios vivo, ten piedad de nosotros.');
        const respR1 = (previewRespR1 ? previewRespR1.textContent.trim() : respV1);
        const respV2 = (previewRespV2 ? previewRespV2.textContent.trim() : 'Tú que hoy te has manifestado.');
        const respR2 = (previewRespR2 ? previewRespR2.textContent.trim() : 'Ten piedad de nosotros.');
        const respR3 = (previewRespR3 ? previewRespR3.textContent.trim() : respV1);

        const antCETexto = (txtAntifonaCantico ? txtAntifonaCantico.textContent.trim() : 'Bendito sea el Señor, Dios nuestro.');
        const antCEId = (selAntifonaCantico ? selAntifonaCantico.value : '');
        const cantId = (selCantico ? selCantico.value : 'cantico_zacarias');
        const cantNombre = (previewNombreCantico ? previewNombreCantico.textContent.trim() : 'Cántico de Zacarías. EL MESÍAS Y SU PRECURSOR');
        const cantCita = (previewCitaCantico ? previewCitaCantico.textContent.trim() : 'Lc 1, 68-79');
        const cantTexto = (previewTextoCantico ? previewTextoCantico.textContent.trim() : TEXTO_CANTICO_ZACARIAS_CANONICO);

        const precesTexto = (previewTextoPreces ? previewTextoPreces.textContent.trim() : '');
        const precesIntroPadre = (previewIntroPadreNuestro ? previewIntroPadreNuestro.textContent.trim() : 'Terminemos nuestra oración con la plegaria que Cristo nos enseñó:');
        const oracionTexto = (previewTextoOracion ? previewTextoOracion.textContent.trim() : '');
        const conclusionV = (previewConclusionV ? previewConclusionV.textContent.trim() : 'El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.');
        const conclusionR = (previewConclusionR ? previewConclusionR.textContent.trim() : 'Amén.');

        const payloadBase = {
            id: idCodigo,
            codigo: idCodigo,
            codigoDia: (typeof codigoDia !== 'undefined' ? codigoDia : idCodigo.slice(0, -2)),
            titulo: (previewTituloHora ? previewTituloHora.textContent : infoLibro.nombre.toUpperCase()),
            subtitulo: (previewSubtituloHora ? previewSubtituloHora.textContent : '(Oración de la mañana)'),
            tiempo: tiempoVal,
            tiempoCodigo: infoTiempo.codigo,
            tiempoNombre: infoTiempo.nombre,
            semana: semanaVal,
            dia: diaVal,
            diaCodigo: infoDia.codigo,
            diaNombre: infoDia.nombre,
            libro: libroVal,
            libroCodigo: infoLibro.codigo,
            libroNombre: infoLibro.nombre,
            invitatorio: {
                antifonaId: antifonaId,
                antifonaTexto: antifonaTexto,
                salmoId: salmoId,
                salmoTitulo: salmoTitulo,
                salmoTexto: salmoTexto
            },
            himno: {
                id: himnoId,
                titulo: himnoTitulo,
                texto: himnoTexto
            },
            salmodia: {
                ant1Id: ant1Id,
                ant1: ant1Texto,
                salmo1Id: salmo1Id,
                salmo1Titulo: salmo1Titulo,
                salmo1Texto: salmo1Texto,
                ant2Id: ant2Id,
                ant2: ant2Texto,
                salmo2Id: salmo2Id,
                salmo2Titulo: salmo2Titulo,
                salmo2Texto: salmo2Texto,
                ant3Id: ant3Id,
                ant3: ant3Texto,
                salmo3Id: salmo3Id,
                salmo3Titulo: salmo3Titulo,
                salmo3Texto: salmo3Texto
            },
            lecturaBreve: {
                id: lecturaId,
                cita: lecturaCita,
                texto: lecturaTexto,
                responsorioBreve: {
                    v1: respV1,
                    r1: respR1,
                    v2: respV2,
                    r2: respR2,
                    v3: 'Gloria al Padre, y al Hijo, y al Espíritu Santo.',
                    r3: respR3
                }
            },
            canticoEvangelico: {
                tipo: cantId,
                antifonaId: antCEId,
                antifona: antCETexto,
                antifonaTexto: antCETexto,
                titulo: `${cantNombre}    ${cantCita}`.trim(),
                cita: cantCita,
                texto: cantTexto
            },
            preces: {
                texto: precesTexto,
                intro: precesTexto.split('\n\n')[0] || '',
                respuesta: precesTexto.split('\n\n')[1] || '',
                libre: 'Se pueden añadir algunas intenciones libres',
                concl: precesIntroPadre
            },
            padrenuestro: 'Padre nuestro...',
            oracion: {
                titulo: 'ORACION',
                texto: oracionTexto
            },
            conclusion: {
                titulo: 'CONCLUSIÓN',
                v: conclusionV,
                r: conclusionR
            },
            // Compatibilidad con la estructura canónica tradicional cEvan_Conclusion
            cEvan_Conclusion: {
                cEvangelicoAnt: antCETexto,
                canticoZacariast: `${cantNombre}    ${cantCita}`.trim(),
                canticoZacarias: cantTexto,
                preces1: precesTexto,
                preces2: precesIntroPadre,
                Padren: 'Padre nuestro...',
                oracion: oracionTexto,
                Conclusion1: conclusionV,
                Conclusion2: conclusionR
            },
            actualizadoEn: new Date().toISOString()
        };

        // Enriquecer el objeto litúrgico completo para garantizar consistencia sistémica
        const payload = normalizarObjetoLiturgico(payloadBase, idCodigo);

        // 1. Guardado local inmediato en LocalStorage
        try {
            localStorage.setItem(`lh_salterio_${idCodigo}`, JSON.stringify(payload));
        } catch (e) {
            console.warn("Aviso al guardar copia local:", e);
        }

        // 2. Guardado en Firestore
        let exitoFirebase = false;
        try {
            if (window.firebaseAPI && window.firebaseAPI.db) {
                const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
                const docRef = doc(window.firebaseAPI.db, "salterios", idCodigo);
                await setDoc(docRef, payload, { merge: true });
                exitoFirebase = true;
            }
        } catch (fbErr) {
            console.warn("Error al guardar en Firebase:", fbErr);
        }

        btnGuardar.disabled = false;
        btnGuardar.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;">cloud_upload</span> <span>¡Guardado exitosamente!</span> <span class="material-symbols-outlined" style="font-size:18px;">save</span>`;
        actualizarBadgeEstado(true);

        setTimeout(() => {
            btnGuardar.innerHTML = txtOriginal;
        }, 2200);
    }

    // Copiar código al portapapeles
    if (btnCopiar && inputCodigo) {
        btnCopiar.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(inputCodigo.value);
                const originalText = btnCopiar.innerHTML;
                btnCopiar.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;">check</span> Copiado`;
                btnCopiar.style.background = '#2e7d32';
                setTimeout(() => {
                    btnCopiar.innerHTML = originalText;
                    btnCopiar.style.background = '';
                }, 1800);
            } catch (err) {
                inputCodigo.select();
                document.execCommand('copy');
                alert('Código copiado: ' + inputCodigo.value);
            }
        });
    }

    // Evento botón de guardar en Firebase
    if (btnGuardar) {
        btnGuardar.addEventListener('click', guardarEnFirebase);
    }

    // Eventos interactivos en los selectores del Invitatorio
    if (selAntifona) {
        selAntifona.addEventListener('change', () => {
            const opt = selAntifona.selectedOptions[0];
            if (opt) {
                const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                if (txtAntifona) txtAntifona.textContent = textoOpt;
                if (txtAntifonaFin) txtAntifonaFin.textContent = textoOpt;
            }
            actualizarBadgeEstado(false);
        });
    }

    if (selSalmo) {
        selSalmo.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    if (selHimno) {
        selHimno.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    // Eventos interactivos en los selectores de la Salmodia 1
    if (selAntifona1) {
        selAntifona1.addEventListener('change', () => {
            const opt = selAntifona1.selectedOptions[0];
            if (opt) {
                const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                if (txtAntifona1) txtAntifona1.textContent = textoOpt;
                if (txtAntifona1Fin) txtAntifona1Fin.textContent = textoOpt;
            }
            actualizarBadgeEstado(false);
        });
    }

    if (selSalmo1) {
        selSalmo1.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    // Eventos interactivos en los selectores de la Salmodia 2
    if (selAntifona2) {
        selAntifona2.addEventListener('change', () => {
            const opt = selAntifona2.selectedOptions[0];
            if (opt) {
                const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                if (txtAntifona2) txtAntifona2.textContent = textoOpt;
                if (txtAntifona2Fin) txtAntifona2Fin.textContent = textoOpt;
            }
            actualizarBadgeEstado(false);
        });
    }

    if (selSalmo2) {
        selSalmo2.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    // Eventos interactivos en los selectores de la Salmodia 3
    if (selAntifona3) {
        selAntifona3.addEventListener('change', () => {
            const opt = selAntifona3.selectedOptions[0];
            if (opt) {
                const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                if (txtAntifona3) txtAntifona3.textContent = textoOpt;
                if (txtAntifona3Fin) txtAntifona3Fin.textContent = textoOpt;
            }
            actualizarBadgeEstado(false);
        });
    }

    if (selSalmo3) {
        selSalmo3.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    // Eventos interactivos en el selector de Lectura Breve
    if (selLectura) {
        selLectura.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    // Eventos interactivos en los selectores del Cántico Evangélico
    if (selAntifonaCantico) {
        selAntifonaCantico.addEventListener('change', () => {
            const opt = selAntifonaCantico.selectedOptions[0];
            if (opt) {
                const textoOpt = opt.getAttribute('data-texto') || opt.textContent;
                if (txtAntifonaCantico) txtAntifonaCantico.textContent = textoOpt;
                if (txtAntifonaCanticoFin) txtAntifonaCanticoFin.textContent = textoOpt;
            }
            actualizarBadgeEstado(false);
        });
    }

    if (selCantico) {
        selCantico.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    // Eventos de cambio en los selectores principales
    selTiempo.addEventListener('change', () => {
        actualizarOpcionesSemanas(false);
        actualizarCodigoCombinado(true);
    });

    selSemana.addEventListener('change', () => actualizarCodigoCombinado(true));
    selDia.addEventListener('change', () => actualizarCodigoCombinado(true));
    selLibro.addEventListener('change', () => actualizarCodigoCombinado(true));

    // Inicialización al arrancar
    cargarYPoblarSelectAntifonas();
    cargarYPoblarSelectSalmos('salmo94');
    cargarYPoblarSelectHimnos();
    cargarYPoblarSelectAntifonas1();
    cargarYPoblarSelectSalmos1('salmo62_2_9');
    cargarYPoblarSelectAntifonas2();
    cargarYPoblarSelectSalmos2('dn_3_57_88_56');
    cargarYPoblarSelectAntifonas3();
    cargarYPoblarSelectSalmos3('salmo149');
    cargarYPoblarSelectLecturas();
    cargarYPoblarSelectAntifonasCantico();
    cargarYPoblarSelectCanticos();
    actualizarOpcionesSemanas();
    actualizarCodigoCombinado(true);
});
