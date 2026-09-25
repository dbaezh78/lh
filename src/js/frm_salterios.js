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
    obtenerIdsEquivalentes,
    guardarHoraEnLocalStorage,
    TEXTO_SALMO_62_CANONICO,
    TEXTO_CANTICO_DANIEL_CANONICO,
    TEXTO_SALMO_149_CANONICO 
} from '../firebase/descarga_liturgia_de_las_horas.js';
import { CATALOGO_ANTIFONAS_SEED } from '../data/db-antifonas.js';
import { CATALOGO_HIMNOS_SEED, HimnosDB } from '../data/db-himnos.js';
import { CATALOGO_LECTURAS_SEED, LecturaBreveDB } from '../data/db-lecturabreve.js';
import { CATALOGO_PRECES_SEED, PrecesDB } from '../data/db-preces.js';
import { CATALOGO_ORACION_SEED, OracionDB } from '../data/db-oracion.js';
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
import { CATALOGO_RESPONSORIOS_SEED, ResponsoriosDB } from '../data/db-responsorios.js';
import { CATALOGO_LECTURAS_SEED as CATALOGO_LECTURAS_OFICIO_SEED, LecturasDB } from '../data/db-lecturas.js';
import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';
import { generarHitosLiturgicos } from './form_etiempo.js';

export const TEXTO_TEDUEM_CANONICO = `A ti, oh Dios, te alabamos, a ti, Señor, te reconocemos.
A ti, eterno Padre, te venera toda la creación.
Los ángeles todos, los cielos y todas las potestades te honran.
Los querubines y serafines te cantan sin cesar:
Santo, Santo, Santo es el Señor, Dios del universo.
Llenos están el cielo y la tierra de la majestad de tu gloria.

A ti te ensalza el glorioso coro de los apóstoles,
la multitud admirable de los profetas,
el blanco ejército de los mártires.
A ti la santa Iglesia confiesa por toda la redondez de la tierra:
Padre de inmensa majestad,
Hijo único y verdadero, digno de adoración,
Espíritu Santo Defensor.

Tú eres el Rey de la gloria, oh Cristo.
Tú eres el Hijo eterno del Padre.
Tú, para librar al hombre, no te horrorizaste del seno de la Virgen.
Tú, rota la cadena de la muerte, abriste a los creyentes el reino de los cielos.
Tú estás sentado a la derecha de Dios en la gloria del Padre.
Creemos que vendrás como juez.

Te rogamos, pues, socorras a tus siervos,
a quienes redimiste con tu preciosa sangre.
Haz que seamos contados entre tus santos en la gloria eterna.`;

export const TEXTO_OPCIONAL_TEDUM_DOMINGO = `Salva a tu pueblo, Señor,
y bendice a tu heredad.

Sé su pastor,
y guíalos por siempre.

Día tras día te bendeciremos
y alabaremos tu nombre por siempre jamás.

Dígnate, Señor,
guardarnos de pecado en este día.

Ten piedad de nosotros, Señor,
ten piedad de nosotros.

Que tu misericordia, Señor, venga sobre nosotros,
como lo esperamos de ti.

A ti, Señor, me acojo,
no quede yo nunca defraudado.`;

// Mapeo de códigos según especificación
export const CODIGOS_TIEMPO = {
    ordinario: { codigo: 'to', nombre: 'Tiempo Ordinario' },
    adviento:  { codigo: 'ta', nombre: 'Adviento' },
    navidad:   { codigo: 'tn', nombre: 'Navidad' },
    cuaresma:  { codigo: 'tc', nombre: 'Cuaresma' },
    pascua:    { codigo: 'tp', nombre: 'Pascua' },
    santos:    { codigo: 'san', nombre: 'Fiestas' }
};

export const SEMANAS_POR_TIEMPO = {
    ordinario: Array.from({ length: 34 }, (_, i) => ({ valor: `s${String(i + 1).padStart(2, '0')}`, texto: `Semana ${i + 1}` })),
    adviento:  Array.from({ length: 4 }, (_, i) => ({ valor: `s${String(i + 1).padStart(2, '0')}`, texto: `Semana ${i + 1}` })),
    navidad:   [
        { valor: 's01', texto: 'Semana 1 (Octava de Navidad)' },
        { valor: 's02', texto: 'Semana 2 (Tiempo de Epifanía)' }
    ],
    cuaresma:  [
        { valor: 's01', texto: 'Semana 1' },
        { valor: 's02', texto: 'Semana 2' },
        { valor: 's03', texto: 'Semana 3' },
        { valor: 's04', texto: 'Semana 4' },
        { valor: 's05', texto: 'Semana 5' },
        { valor: 's06', texto: 'Semana 6 (Semana Santa)' },
        { valor: 's07', texto: 'Triduo Pascual' }
    ],
    pascua:    [
        { valor: 's01', texto: 'Semana 1 (Octava de Pascua)' },
        { valor: 's02', texto: 'Semana 2' },
        { valor: 's03', texto: 'Semana 3' },
        { valor: 's04', texto: 'Semana 4' },
        { valor: 's05', texto: 'Semana 5' },
        { valor: 's06', texto: 'Semana 6' },
        { valor: 's07', texto: 'Semana 7 (Ascensión / Pentecostés)' }
    ],
    santos:    [
        { valor: 's01', texto: 'Común de Santos' },
        { valor: 's02', texto: 'Propio de los Santos' },
        { valor: 's03', texto: 'Solemnidades' },
        { valor: 's04', texto: 'Fiestas y Memorias' }
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

/**
 * Recupera el catálogo completo de santos desde localStorage o fallback en memoria.
 */
export function obtenerCatalogoSantos() {
    try {
        const raw = localStorage.getItem('lh_catalogo_nombres_santos');
        if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list) && list.length > 0) return list;
        }
    } catch (_) {}
    return (typeof catalogoSantosAnual !== 'undefined' && Array.isArray(catalogoSantosAnual)) ? catalogoSantosAnual : [];
}

/**
 * Extrae día y mes (2 dígitos) a partir del campo celebración o festividad del santo.
 */
export function extraerDiaMesCelebracion(santo) {
    if (!santo) return { dia: '01', mes: '01', texto: '01/01' };
    const raw = (santo.celebracion || santo.fechaFestividad || '').trim();
    const mIso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (mIso) {
        const dia = String(mIso[3]).padStart(2, '0');
        const mes = String(mIso[2]).padStart(2, '0');
        return { dia, mes, texto: `${dia}/${mes}` };
    }
    const mSlash = raw.match(/^(\d{1,2})\/(\d{1,2})/);
    if (mSlash) {
        const dia = String(mSlash[1]).padStart(2, '0');
        const mes = String(mSlash[2]).padStart(2, '0');
        return { dia, mes, texto: `${dia}/${mes}` };
    }
    if (santo.dia && santo.mes) {
        const dia = String(santo.dia).padStart(2, '0');
        const mes = String(santo.mes).padStart(2, '0');
        return { dia, mes, texto: `${dia}/${mes}` };
    }
    return { dia: '01', mes: '01', texto: raw || '—' };
}

/**
 * Genera el slug normalizado del nombre de un santo (minúsculas, sin espacios ni acentos ni signos).
 * Ej: "Santos Pedro y Pablo" -> "santospedroypablo"
 * Ej: "Santa María" -> "santamaria"
 */
export function generarSlugSanto(nombre) {
    if (!nombre) return '';
    return nombre
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

/**
 * Genera el ID canónico para un santo según la especificación:
 * "sa de santo, el dia01, y el mes 01, y el nombre del santo santamaria, entonces quedaria: sa0101santamaria"
 * Ej: San Pedro y San Pablo (29/06) -> "sa2906santospedroypablo"
 */
export function generarIdSanto(santo) {
    if (!santo) return 'sa0101santamaria';
    const { dia, mes } = extraerDiaMesCelebracion(santo);
    const slug = generarSlugSanto(santo.nombre);
    return `sa${dia}${mes}${slug}`;
}

const MAPA_SOLEMNIDADES_EXACTAS = {
    'la epifania del senor': 'laepifaniadelSeñor',
    'la epifania del señor': 'laepifaniadelSeñor',
    'el bautismo del senor': 'elbautismodelSeñor',
    'el bautismo del señor': 'elbautismodelSeñor',
    'miercoles de ceniza': 'miercolesdeceniza',
    'domingo de ramos': 'domingoderamos',
    'jueves santo': 'juevessanto',
    'viernes santo': 'viernessanto',
    'sabado santo': 'sabadosanto',
    'domingo de resurreccion': 'domingoderesurreccion',
    'domingo de pentecostes': 'domingodepentecostes',
    'la santisima trinidad': 'lasantisimatrinidad',
    'jesucristo, rey del universo': 'jesucristoreydeluniverso',
    'jesucristo rey del universo': 'jesucristoreydeluniverso',
    'la natividad del senor': 'lanatividaddelSeñor',
    'la natividad del señor': 'lanatividaddelSeñor'
};

/**
 * Genera la nomenclatura para una solemnidad litúrgica de form_etiempo:
 * "laepifaniadelSeñor, elbautismodelSeñor, miercolesdeceniza"
 */
export function generarNomenclaturaSolemnidad(nombre) {
    if (!nombre) return '';
    const limpio = nombre.replace(/\s*\([^)]*\)/g, '').trim();
    const claveMin = limpio
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    if (MAPA_SOLEMNIDADES_EXACTAS[claveMin]) {
        return MAPA_SOLEMNIDADES_EXACTAS[claveMin];
    }

    const slug = limpio
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9ñÑ]/g, '');
    return slug.charAt(0).toLowerCase() + slug.slice(1);
}

// Variables globales en memoria para las fuentes compartidas con antifonas.html, salmos.html e himno.html
let cacheAntifonasInvitatorias = [];
let cacheAntifonasSalmodia1 = [];
let cacheAntifonasSalmodia2 = [];
let cacheAntifonasSalmodia3 = [];
let cacheTodosLosSalmos = [];
let cacheTodosLosHimnos = [];
let cacheTodasLasLecturas = [];
let cacheAntifonasCantico = [];
let cacheTodasLasPreces = [];
let cacheTodasLasOraciones = [];
let cacheTodosLosResponsorios = [];
let cacheTodasLasLecturasOficio = [];

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
 * Obtener todos los responsorios desde responsorio.html / db-responsorios.js / 'lh_responsorios_cache'
 */
export function obtenerTodosLosResponsoriosDesdeCatalogo() {
    let responsorios = [];
    const cacheLocal = localStorage.getItem('lh_responsorios_cache');
    if (cacheLocal) {
        try {
            responsorios = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_responsorios_cache:", e);
        }
    }

    if (!Array.isArray(responsorios) || responsorios.length === 0) {
        if (Array.isArray(CATALOGO_RESPONSORIOS_SEED) && CATALOGO_RESPONSORIOS_SEED.length > 0) {
            responsorios = [...CATALOGO_RESPONSORIOS_SEED];
        }
    }

    return responsorios;
}

/**
 * Obtener todas las lecturas de oficio desde lectura.html / db-lecturas.js / 'lh_lecturas_cache'
 */
export function obtenerTodasLasLecturasOficioDesdeCatalogo() {
    let lecturas = [];
    const cacheLocal = localStorage.getItem('lh_lecturas_cache');
    if (cacheLocal) {
        try {
            lecturas = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_lecturas_cache:", e);
        }
    }

    const mapa = new Map();
    // 1. Semillas canónicas base
    if (Array.isArray(CATALOGO_LECTURAS_OFICIO_SEED)) {
        CATALOGO_LECTURAS_OFICIO_SEED.forEach(s => {
            if (s && (s.id || s.varName)) mapa.set(s.id || s.varName, s);
        });
    }
    // 2. Elementos en caché local (añadir o actualizar)
    if (Array.isArray(lecturas)) {
        lecturas.forEach(l => {
            if (l && (l.id || l.varName)) mapa.set(l.id || l.varName, l);
        });
    }

    return Array.from(mapa.values());
}

export function formatAsterisco(texto, textoR2 = '') {
    const r1 = (texto || '').trim();
    const r2 = (textoR2 || '').trim();
    if (!r1 && !r2) return '';
    const asteriscoHtml = '<span class="asterisco-rojo" style="color: #ff0000; font-weight: bold; margin: 0 4px; font-size: 1.15em;">*</span>';
    if (!r1) return r2 ? `${asteriscoHtml} ${r2}` : '';
    if (r1.includes('*')) {
        return r1.replace(/\*/g, asteriscoHtml);
    }
    if (r2) {
        return `${r1} ${asteriscoHtml} ${r2}`;
    }
    return r1;
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

/**
 * Obtener todas las preces desde catálogo / 'lh_preces_cache'
 */
export function obtenerTodasLasPrecesDesdeCatalogo() {
    let todas = [];
    const cacheLocal = localStorage.getItem('lh_preces_cache');
    if (cacheLocal) {
        try {
            todas = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_preces_cache:", e);
        }
    }

    if (!Array.isArray(todas) || todas.length === 0) {
        todas = Array.isArray(CATALOGO_PRECES_SEED) ? [...CATALOGO_PRECES_SEED] : [];
    }

    return todas;
}

/**
 * Obtener todas las oraciones desde oracion.html / db-oracion.js / 'lh_oracion_cache'
 */
export function obtenerTodasLasOracionesDesdeCatalogo() {
    let todas = [];
    const cacheLocal = localStorage.getItem('lh_oracion_cache');
    if (cacheLocal) {
        try {
            todas = JSON.parse(cacheLocal);
        } catch (e) {
            console.warn("Error leyendo lh_oracion_cache:", e);
        }
    }

    if (!Array.isArray(todas) || todas.length === 0) {
        todas = Array.isArray(CATALOGO_ORACION_SEED) ? [...CATALOGO_ORACION_SEED] : [];
    }

    return todas;
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
    const selPreces = document.getElementById('selectPreces');
    const selOracion = document.getElementById('selectOracion');
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

    // Contenedores de controles por Hora (Laudes vs Oficio)
    const ctrlBoxLecturaBreve = document.getElementById('ctrlBoxLecturaBreve');
    const ctrlBoxAntifonaCantico = document.getElementById('ctrlBoxAntifonaCantico');
    const ctrlBoxCantico = document.getElementById('ctrlBoxCantico');
    const ctrlBoxPreces = document.getElementById('ctrlBoxPreces');
    const ctrlBoxResponsorioOficio = document.getElementById('ctrlBoxResponsorioOficio');
    const ctrlBoxLectura1Oficio = document.getElementById('ctrlBoxLectura1Oficio');
    const ctrlBoxLectura2Oficio = document.getElementById('ctrlBoxLectura2Oficio');
    const ctrlBoxTeDeumOficio = document.getElementById('ctrlBoxTeDeumOficio');
    const ctrlBoxOpcionalOficio = document.getElementById('ctrlBoxOpcionalOficio');

    // Selectores y campos específicos de Oficio
    const selResponsorioOficio = document.getElementById('selectResponsorioOficio');
    const selLectura1Oficio = document.getElementById('selectLectura1Oficio');
    const selLectura2Oficio = document.getElementById('selectLectura2Oficio');
    const selTeDeumOficio = document.getElementById('selectTeDeumOficio');
    const inputOpcionalOficio = document.getElementById('inputOpcionalOficio');

    // Secciones de vista previa pergamino
    const seccionInvitatorioLaudesPreview = document.getElementById('seccionInvitatorioLaudesPreview');
    const seccionInvitatorioOficioPreview = document.getElementById('seccionInvitatorioOficioPreview');
    const txtAntifonaOficio = document.getElementById('txtAntifonaOficio');
    const previewInvocacionOficioR = document.getElementById('previewInvocacionOficioR');

    const seccionResponsorioOficioPreview = document.getElementById('seccionResponsorioOficioPreview');
    const previewRespOficioV = document.getElementById('previewRespOficioV');
    const previewRespOficioR = document.getElementById('previewRespOficioR');

    const seccionLectura1OficioPreview = document.getElementById('seccionLectura1OficioPreview');
    const previewLec1Epigrafe = document.getElementById('previewLec1Epigrafe');
    const previewLec1Cita = document.getElementById('previewLec1Cita');
    const previewLec1Desc = document.getElementById('previewLec1Desc');
    const previewLec1Texto = document.getElementById('previewLec1Texto');
    const previewLec1RespCita = document.getElementById('previewLec1RespCita');
    const previewLec1RespR1 = document.getElementById('previewLec1RespR1');
    const previewLec1RespV = document.getElementById('previewLec1RespV');
    const previewLec1RespR2 = document.getElementById('previewLec1RespR2');

    const seccionLectura2OficioPreview = document.getElementById('seccionLectura2OficioPreview');
    const previewLec2Epigrafe = document.getElementById('previewLec2Epigrafe');
    const previewLec2Cita = document.getElementById('previewLec2Cita');
    const previewLec2Desc = document.getElementById('previewLec2Desc');
    const previewLec2Texto = document.getElementById('previewLec2Texto');
    const previewLec2RespCita = document.getElementById('previewLec2RespCita');
    const previewLec2RespR1 = document.getElementById('previewLec2RespR1');
    const previewLec2RespV = document.getElementById('previewLec2RespV');
    const previewLec2RespR2 = document.getElementById('previewLec2RespR2');

    const seccionTeDeumPreview = document.getElementById('seccionTeDeumPreview');
    const previewTituloTeDeum = document.getElementById('previewTituloTeDeum');
    const previewTextoTeDeum = document.getElementById('previewTextoTeDeum');

    const seccionOpcionalOficioPreview = document.getElementById('seccionOpcionalOficioPreview');
    const previewTextoOpcionalOficio = document.getElementById('previewTextoOpcionalOficio');

    const seccionLecturaBrevePreview = document.getElementById('seccionLecturaBrevePreview');
    const seccionCanticoEvangelicoPreview = document.getElementById('seccionCanticoEvangelicoPreview');
    const seccionPrecesPreview = document.getElementById('seccionPrecesPreview');

    // ==========================================
    // UTILIDADES DE FILTRADO Y ORDENAMIENTO A-Z
    // ==========================================

    // Normalizar texto para búsquedas (sin tildes, minúsculas, espacios recortados)
    function normalizarTextoBusqueda(str) {
        if (!str) return '';
        return str.toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    // Ordenar alfabéticamente de la A a la Z todas las opciones de un selector
    function ordenarOpcionesAZ(selectElement, valorSeleccionado = null) {
        if (!selectElement) return;
        const opciones = Array.from(selectElement.options);
        if (opciones.length <= 1) {
            selectElement._todasLasOpciones = opciones.map(o => o.cloneNode(true));
            return;
        }

        const valorDeseado = valorSeleccionado !== null ? valorSeleccionado : selectElement.value;

        opciones.sort((a, b) => {
            const textoA = (a.textContent || '').trim();
            const textoB = (b.textContent || '').trim();
            return textoA.localeCompare(textoB, 'es', { numeric: true, sensitivity: 'accent' });
        });

        selectElement.innerHTML = '';
        opciones.forEach(opt => selectElement.appendChild(opt));

        if (valorDeseado && Array.from(selectElement.options).some(o => o.value === valorDeseado || o.getAttribute('data-texto') === valorDeseado)) {
            const match = Array.from(selectElement.options).find(o => o.value === valorDeseado || o.getAttribute('data-texto') === valorDeseado);
            if (match) selectElement.value = match.value;
        } else if (selectElement.options.length > 0 && !selectElement.value) {
            selectElement.selectedIndex = 0;
        }

        // Guardar copia maestra de todas las opciones ordenadas de la A a la Z
        selectElement._todasLasOpciones = Array.from(selectElement.options).map(o => o.cloneNode(true));

        if (typeof selectElement._actualizarCustomSelect === 'function') {
            selectElement._actualizarCustomSelect();
        }
    }

    // =========================================================================
    // SELECTOR PERSONALIZADO COMPACTO CON BUSCADOR INTEGRADO (ESTILO IMAGEN 1 / SANTO)
    // =========================================================================
    function crearCustomSelectBuscador(selectElement, placeholder = 'Buscar...') {
        if (!selectElement) return null;
        if (selectElement._customSelectContainer) {
            if (typeof selectElement._actualizarCustomSelect === 'function') {
                selectElement._actualizarCustomSelect();
            }
            return selectElement._customSelectContainer;
        }

        // Ocultar select nativo de forma limpia
        selectElement.style.display = 'none';

        // Crear contenedor .custom-select-lh
        const container = document.createElement('div');
        container.className = 'custom-select-lh';

        // Crear trigger
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        const label = document.createElement('span');
        label.className = 'custom-select-label';
        trigger.appendChild(label);

        // Crear dropdown popup
        const dropdown = document.createElement('div');
        dropdown.className = 'custom-select-dropdown';

        // Search box
        const searchBox = document.createElement('div');
        searchBox.className = 'custom-select-search-box';
        searchBox.addEventListener('click', (e) => e.stopPropagation());

        const searchIcon = document.createElement('span');
        searchIcon.className = 'material-symbols-outlined';
        searchIcon.textContent = 'search';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = placeholder;
        searchInput.autocomplete = 'off';
        searchInput.spellcheck = false;
        searchInput.addEventListener('click', (e) => e.stopPropagation());

        searchBox.appendChild(searchIcon);
        searchBox.appendChild(searchInput);
        dropdown.appendChild(searchBox);

        // Lista de opciones
        const ul = document.createElement('ul');
        ul.className = 'custom-select-opciones';
        dropdown.appendChild(ul);

        container.appendChild(trigger);
        container.appendChild(dropdown);

        // Insertar justo después del select nativo
        selectElement.parentNode.insertBefore(container, selectElement.nextSibling);

        // Función para sincronizar opciones desde el select nativo
        const sincronizarOpciones = () => {
            const opts = Array.from(selectElement.options);
            const valActual = selectElement.value;
            const optSel = selectElement.selectedOptions[0] || opts[0];
            label.textContent = optSel ? (optSel.textContent || optSel.value) : '-- Seleccionar --';

            ul.innerHTML = '';
            if (opts.length === 0) {
                const liVacio = document.createElement('li');
                liVacio.className = 'custom-select-opcion opcion-vacia';
                liVacio.textContent = '-- Sin opciones --';
                ul.appendChild(liVacio);
                return;
            }

            opts.forEach(opt => {
                const li = document.createElement('li');
                li.className = 'custom-select-opcion';
                if (opt.value === valActual) {
                    li.classList.add('seleccionado');
                }
                li.textContent = opt.textContent;
                li.setAttribute('data-value', opt.value);

                // Guardar atributos de búsqueda normalizados
                const tText = normalizarTextoBusqueda(opt.textContent || '');
                const tDataTexto = normalizarTextoBusqueda(opt.getAttribute('data-texto') || '');
                const tDataTitulo = normalizarTextoBusqueda(opt.getAttribute('data-titulo') || '');
                const tDataCita = normalizarTextoBusqueda(opt.getAttribute('data-cita') || '');
                const tDataDesc = normalizarTextoBusqueda(opt.getAttribute('data-desc') || '');
                li.setAttribute('data-search', `${tText} ${tDataTexto} ${tDataTitulo} ${tDataCita} ${tDataDesc}`.trim());

                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectElement.value = opt.value;
                    label.textContent = opt.textContent;

                    ul.querySelectorAll('.custom-select-opcion').forEach(el => el.classList.remove('seleccionado'));
                    li.classList.add('seleccionado');

                    dropdown.classList.remove('abierto');
                    trigger.classList.remove('activo');
                    container.classList.remove('dropdown-activo');

                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                });

                ul.appendChild(li);
            });
        };

        // Filtro de búsqueda al escribir
        searchInput.addEventListener('input', () => {
            const query = normalizarTextoBusqueda(searchInput.value);
            const lis = ul.querySelectorAll('.custom-select-opcion:not(.sin-resultados)');
            let visibles = 0;
            lis.forEach(li => {
                const searchStr = li.getAttribute('data-search') || normalizarTextoBusqueda(li.textContent || '');
                const coincide = !query || searchStr.includes(query);
                li.style.display = coincide ? 'block' : 'none';
                if (coincide) visibles++;
            });

            let sinResultados = ul.querySelector('.sin-resultados');
            if (visibles === 0) {
                if (!sinResultados) {
                    sinResultados = document.createElement('li');
                    sinResultados.className = 'custom-select-opcion sin-resultados';
                    ul.appendChild(sinResultados);
                }
                sinResultados.textContent = `No se encontraron resultados para "${searchInput.value.trim()}"`;
                sinResultados.style.display = 'block';
            } else if (sinResultados) {
                sinResultados.style.display = 'none';
            }
        });

        // Toggle del dropdown al hacer clic en el trigger
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const estaAbierto = dropdown.classList.contains('abierto');

            // Cerrar cualquier otro dropdown abierto
            document.querySelectorAll('.custom-select-dropdown.abierto').forEach(dd => {
                if (dd !== dropdown) {
                    dd.classList.remove('abierto');
                    if (dd.previousElementSibling) dd.previousElementSibling.classList.remove('activo');
                    if (dd.parentElement) dd.parentElement.classList.remove('dropdown-activo');
                }
            });

            if (!estaAbierto) {
                dropdown.classList.add('abierto');
                trigger.classList.add('activo');
                container.classList.add('dropdown-activo');
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                setTimeout(() => searchInput.focus(), 50);

                const selItem = ul.querySelector('.custom-select-opcion.seleccionado');
                if (selItem) {
                    selItem.scrollIntoView({ block: 'nearest' });
                }
            } else {
                dropdown.classList.remove('abierto');
                trigger.classList.remove('activo');
                container.classList.remove('dropdown-activo');
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.classList.remove('abierto');
                trigger.classList.remove('activo');
                container.classList.remove('dropdown-activo');
            }
        });

        // Sincronizar trigger y clase seleccionado cuando el select nativo cambie externamente
        selectElement.addEventListener('change', () => {
            const optSel = selectElement.selectedOptions[0];
            if (optSel) {
                label.textContent = optSel.textContent;
                ul.querySelectorAll('.custom-select-opcion').forEach(li => {
                    if (li.getAttribute('data-value') === selectElement.value) {
                        li.classList.add('seleccionado');
                    } else {
                        li.classList.remove('seleccionado');
                    }
                });
            }
        });

        selectElement._customSelectContainer = container;
        selectElement._actualizarCustomSelect = sincronizarOpciones;

        sincronizarOpciones();
        return container;
    }

    // Configurar todos los selects litúrgicos con el selector personalizado
    function configurarTodosLosCustomSelects() {
        const ids = [
            'selectAntifonaInvitatorio', 'selectSalmoInvitatorio', 'selectHimno',
            'selectAntifona1', 'selectSalmo1', 'selectAntifona2', 'selectSalmo2',
            'selectAntifona3', 'selectSalmo3', 'selectLecturaBreve',
            'selectAntifonaCantico', 'selectCantico', 'selectPreces', 'selectOracion',
            'selectResponsorioOficio', 'selectLectura1Oficio', 'selectLectura2Oficio', 'selectTeDeumOficio'
        ];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                crearCustomSelectBuscador(el, 'Buscar...');
            }
        });
    }

    // Cierre global al hacer clic fuera o pulsar Escape
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-lh')) {
            document.querySelectorAll('.custom-select-dropdown.abierto').forEach(dd => {
                dd.classList.remove('abierto');
                if (dd.previousElementSibling) dd.previousElementSibling.classList.remove('activo');
                if (dd.parentElement) dd.parentElement.classList.remove('dropdown-activo');
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.custom-select-dropdown.abierto').forEach(dd => {
                dd.classList.remove('abierto');
                if (dd.previousElementSibling) dd.previousElementSibling.classList.remove('activo');
                if (dd.parentElement) dd.parentElement.classList.remove('dropdown-activo');
            });
        }
    });

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

        ordenarOpcionesAZ(selAntifona, valorSeleccionadoPrevio);
        if (selAntifona._reaplicarFiltro) selAntifona._reaplicarFiltro();
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

        ordenarOpcionesAZ(selAntifona1, valorSeleccionadoPrevio);
        if (selAntifona1._reaplicarFiltro) selAntifona1._reaplicarFiltro();
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

        ordenarOpcionesAZ(selSalmo, valorSeleccionadoPrevio || 'salmo94');
        if (selSalmo._reaplicarFiltro) selSalmo._reaplicarFiltro();
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

        ordenarOpcionesAZ(selSalmo1, valorSeleccionadoPrevio || 'salmo62_2_9');
        if (selSalmo1._reaplicarFiltro) selSalmo1._reaplicarFiltro();
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

        ordenarOpcionesAZ(selAntifona2, valorSeleccionadoPrevio);
        if (selAntifona2._reaplicarFiltro) selAntifona2._reaplicarFiltro();
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

        ordenarOpcionesAZ(selSalmo2, valorSeleccionadoPrevio || 'dn_3_57_88_56');
        if (selSalmo2._reaplicarFiltro) selSalmo2._reaplicarFiltro();
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

        ordenarOpcionesAZ(selAntifona3, valorSeleccionadoPrevio);
        if (selAntifona3._reaplicarFiltro) selAntifona3._reaplicarFiltro();
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

        ordenarOpcionesAZ(selSalmo3, valorSeleccionadoPrevio || 'salmo149');
        if (selSalmo3._reaplicarFiltro) selSalmo3._reaplicarFiltro();
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

        ordenarOpcionesAZ(selHimno, valorSeleccionadoPrevio);
        if (selHimno._reaplicarFiltro) selHimno._reaplicarFiltro();
    }

    // Cargar y poblar el selector de Himnos Post-Lecturas (Te Deum / Catálogo) para Oficio de Lectura (solo domingos)
    function cargarYPoblarSelectHimnoPostLecturas(valorSeleccionadoPrevio = null) {
        if (!selTeDeumOficio) return;
        cacheTodosLosHimnos = obtenerTodosLosHimnosDesdeCatalogo();

        selTeDeumOficio.innerHTML = '';

        // 1. Te Deum Canónico por defecto
        const optTeDeum = document.createElement('option');
        optTeDeum.value = 'tedeum_canonico';
        optTeDeum.setAttribute('data-titulo', 'HIMNO: A TI, OH DIOS (TE DEUM)');
        optTeDeum.textContent = 'A ti, oh Dios (Te Deum) [Recomendado]';
        selTeDeumOficio.appendChild(optTeDeum);

        // 2. Himnos del catálogo
        if (Array.isArray(cacheTodosLosHimnos) && cacheTodosLosHimnos.length > 0) {
            cacheTodosLosHimnos.forEach(h => {
                const opt = document.createElement('option');
                const hid = h.id || h.varName;
                opt.value = hid;
                opt.setAttribute('data-titulo', h.titulo || hid);
                opt.textContent = `[Himno] ${h.titulo || hid}`;
                selTeDeumOficio.appendChild(opt);
            });
        }

        // 3. Opción Ninguno
        const optNinguno = document.createElement('option');
        optNinguno.value = 'ninguno';
        optNinguno.setAttribute('data-titulo', '');
        optNinguno.textContent = 'Ninguno (Omitir himno)';
        selTeDeumOficio.appendChild(optNinguno);

        if (valorSeleccionadoPrevio && Array.from(selTeDeumOficio.options).some(o => o.value === valorSeleccionadoPrevio)) {
            selTeDeumOficio.value = valorSeleccionadoPrevio;
        } else {
            selTeDeumOficio.value = 'tedeum_canonico';
        }

        if (typeof selTeDeumOficio._actualizarCustomSelect === 'function') {
            selTeDeumOficio._actualizarCustomSelect();
        }
    }

    // Actualizar vista previa del himno post-2ª lectura y sección opcional (domingos y fiestas/santos)
    function actualizarHimnoPostLecturasPreview() {
        const libroVal = selLibro ? selLibro.value : 'laudes';
        const diaVal = selDia ? selDia.value : 'domingo';
        const tiempoVal = selTiempo ? selTiempo.value : 'ordinario';
        const esOficio = (libroVal === 'oficio');
        const esDomingoOFiesta = (diaVal === 'domingo' || tiempoVal === 'santos');
        const mostrar = esOficio && esDomingoOFiesta;

        if (ctrlBoxTeDeumOficio) ctrlBoxTeDeumOficio.style.display = mostrar ? 'block' : 'none';
        if (ctrlBoxOpcionalOficio) ctrlBoxOpcionalOficio.style.display = mostrar ? 'block' : 'none';

        if (!mostrar || !selTeDeumOficio || selTeDeumOficio.value === 'ninguno') {
            if (seccionTeDeumPreview) seccionTeDeumPreview.style.display = 'none';
            if (seccionOpcionalOficioPreview) seccionOpcionalOficioPreview.style.display = 'none';
            return;
        }

        if (seccionTeDeumPreview) seccionTeDeumPreview.style.display = 'block';
        if (seccionOpcionalOficioPreview) seccionOpcionalOficioPreview.style.display = 'block';

        const val = selTeDeumOficio.value;
        if (val === 'tedeum_canonico') {
            if (previewTituloTeDeum) previewTituloTeDeum.textContent = 'HIMNO: A TI, OH DIOS (TE DEUM)';
            if (previewTextoTeDeum) previewTextoTeDeum.textContent = TEXTO_TEDUEM_CANONICO;
        } else {
            const hEncontrado = (Array.isArray(cacheTodosLosHimnos) ? cacheTodosLosHimnos.find(h => (h.id === val || h.varName === val)) : null) ||
                                HimnosDB.obtener(val);
            if (hEncontrado) {
                if (previewTituloTeDeum) previewTituloTeDeum.textContent = hEncontrado.titulo || 'HIMNO';
                if (previewTextoTeDeum) previewTextoTeDeum.textContent = hEncontrado.texto || '';
            } else {
                if (previewTituloTeDeum) previewTituloTeDeum.textContent = 'HIMNO: A TI, OH DIOS (TE DEUM)';
                if (previewTextoTeDeum) previewTextoTeDeum.textContent = TEXTO_TEDUEM_CANONICO;
            }
        }

        // Parte opcional en domingos
        if (inputOpcionalOficio && !inputOpcionalOficio.value.trim()) {
            inputOpcionalOficio.value = TEXTO_OPCIONAL_TEDUM_DOMINGO;
        }
        if (previewTextoOpcionalOficio) {
            previewTextoOpcionalOficio.textContent = (inputOpcionalOficio && inputOpcionalOficio.value.trim())
                ? inputOpcionalOficio.value.trim()
                : TEXTO_OPCIONAL_TEDUM_DOMINGO;
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

        ordenarOpcionesAZ(selLectura, valorSeleccionadoPrevio);
        if (selLectura._reaplicarFiltro) selLectura._reaplicarFiltro();
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

        ordenarOpcionesAZ(selAntifonaCantico, valorSeleccionadoPrevio);
        if (selAntifonaCantico._reaplicarFiltro) selAntifonaCantico._reaplicarFiltro();
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

        ordenarOpcionesAZ(selCantico, valorSeleccionadoPrevio || 'cantico_zacarias');
        if (selCantico._reaplicarFiltro) selCantico._reaplicarFiltro();
    }

    // Cargar y poblar el selector de Preces desde db-preces.js / 'lh_preces_cache'
    function cargarYPoblarSelectPreces(valorSeleccionadoPrevio = null) {
        if (!selPreces) return;
        cacheTodasLasPreces = obtenerTodasLasPrecesDesdeCatalogo();

        selPreces.innerHTML = '';
        if (cacheTodasLasPreces.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay preces registradas';
            selPreces.appendChild(opt);
            return;
        }

        cacheTodasLasPreces.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id || p.varName;
            opt.setAttribute('data-titulo', p.titulo || p.id);
            opt.setAttribute('data-respuesta', p.respuesta || '');
            const tit = p.titulo || p.id;
            const resp = p.respuesta ? ` — ${p.respuesta}` : '';
            opt.textContent = `${tit}${resp}`;
            selPreces.appendChild(opt);
        });

        let targetVal = valorSeleccionadoPrevio;
        if (!targetVal && selTiempo && selSemana && selDia && selLibro) {
            const recom = PrecesDB.obtenerRecomendada(selTiempo.value, selSemana.value, selDia.value, selLibro.value);
            if (recom) targetVal = recom.id || recom.varName;
        }
        ordenarOpcionesAZ(selPreces, targetVal);
        if (selPreces._reaplicarFiltro) selPreces._reaplicarFiltro();
    }

    // Cargar y poblar el selector de Oración desde db-oracion.js / 'lh_oracion_cache'
    function cargarYPoblarSelectOracion(valorSeleccionadoPrevio = null) {
        if (!selOracion) return;
        cacheTodasLasOraciones = obtenerTodasLasOracionesDesdeCatalogo();

        selOracion.innerHTML = '';
        if (cacheTodasLasOraciones.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay oraciones registradas';
            selOracion.appendChild(opt);
            return;
        }

        cacheTodasLasOraciones.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.id || o.varName;
            opt.setAttribute('data-titulo', o.titulo || o.id);
            const tit = o.titulo || o.id;
            const snip = o.texto ? ` — ${o.texto.slice(0, 50)}...` : '';
            opt.textContent = `${tit}${snip}`;
            selOracion.appendChild(opt);
        });

        let targetVal = valorSeleccionadoPrevio;
        if (!targetVal && selTiempo && selSemana && selDia && selLibro) {
            const recom = OracionDB.obtenerRecomendada(selTiempo.value, selSemana.value, selDia.value, selLibro.value);
            if (recom) targetVal = recom.id || recom.varName;
        }
        ordenarOpcionesAZ(selOracion, targetVal);
        if (selOracion._reaplicarFiltro) selOracion._reaplicarFiltro();
    }

    // Cargar y poblar el selector de Responsorios (Oficio) desde db-responsorios.js / 'lh_responsorios_cache'
    function cargarYPoblarSelectResponsorios(valorSeleccionadoPrevio = null) {
        if (!selResponsorioOficio) return;
        cacheTodosLosResponsorios = obtenerTodosLosResponsoriosDesdeCatalogo();

        selResponsorioOficio.innerHTML = '';
        if (cacheTodosLosResponsorios.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No hay responsorios registrados';
            selResponsorioOficio.appendChild(opt);
            return;
        }

        cacheTodosLosResponsorios.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id || item.varName;
            opt.setAttribute('data-v', item.v || '');
            opt.setAttribute('data-r', item.r || '');
            opt.textContent = `V. ${item.v ? item.v.slice(0, 45) : ''}... / R. ${item.r ? item.r.slice(0, 30) : ''}`;
            selResponsorioOficio.appendChild(opt);
        });

        let targetVal = valorSeleccionadoPrevio;
        if (!targetVal && selTiempo && selSemana && selDia) {
            const recom = ResponsoriosDB.obtenerRecomendado(selTiempo.value, selSemana.value, selDia.value);
            if (recom) targetVal = recom.id || recom.varName;
        }
        ordenarOpcionesAZ(selResponsorioOficio, targetVal);
        if (selResponsorioOficio._reaplicarFiltro) selResponsorioOficio._reaplicarFiltro();
    }

    // Cargar y poblar los selectores de Lecturas de Oficio (Bíblica y Patrística)
    function cargarYPoblarSelectLecturasOficio(valLec1Previo = null, valLec2Previo = null) {
        cacheTodasLasLecturasOficio = obtenerTodasLasLecturasOficioDesdeCatalogo();
        const anioActual = new Date().getFullYear();
        const esPar = (anioActual % 2 === 0);

        const esPatristica = (l) => l && (
            l.tipo === 'lectura2' || 
            l.tipo === 'patristica' || 
            l.tipo === 'segunda' || 
            (l.epigrafeTipo && l.epigrafeTipo.toUpperCase().includes('SEGUNDA')) || 
            (l.id && (l.id.includes('lec2') || l.id.includes('lect2')))
        );

        const esBiblica = (l) => l && (
            l.tipo === 'lectura1' || 
            l.tipo === 'lectura1_par' || 
            l.tipo === 'lectura1_impar' || 
            l.tipo === 'biblica' || 
            (l.epigrafeTipo && l.epigrafeTipo.toUpperCase().includes('PRIMERA')) || 
            (l.id && (l.id.includes('lec1') || l.id.includes('lect1')))
        );

        if (selLectura1Oficio) {
            selLectura1Oficio.innerHTML = '';
            // Todas las lecturas bíblicas (1ª lectura) de todo el catálogo abierto
            const biblicas = cacheTodasLasLecturasOficio.filter(l => !esPatristica(l));
            const lista1 = biblicas.length > 0 ? biblicas : cacheTodasLasLecturasOficio;
            lista1.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id || item.varName;
                opt.setAttribute('data-cita', item.cita || '');
                opt.setAttribute('data-desc', item.descripcion || item.subtitulo || '');
                opt.setAttribute('data-texto', (item.texto || '').slice(0, 300));
                opt.setAttribute('data-titulo', item.titulo || '');
                const anioTxt = item.esPar || item.tipo === 'lectura1_par' ? '[Año Par]' : ((item.esImpar || item.tipo === 'lectura1_impar') ? '[Año Impar]' : '');
                const citaCorta = (item.cita || item.id).replace(/\n/g, ' ');
                const descCorta = item.descripcion ? ` - ${item.descripcion.slice(0, 45)}...` : '';
                opt.textContent = `${anioTxt} ${citaCorta}${descCorta}`.trim();
                selLectura1Oficio.appendChild(opt);
            });

            let targetL1 = valLec1Previo;
            if (!targetL1 && selTiempo && selSemana && selDia) {
                const recomL1 = LecturasDB.obtenerLectura1(selTiempo.value, selSemana.value, selDia.value, esPar);
                if (recomL1) targetL1 = recomL1.id || recomL1.varName;
            }
            ordenarOpcionesAZ(selLectura1Oficio, targetL1);
            if (selLectura1Oficio._reaplicarFiltro) selLectura1Oficio._reaplicarFiltro();
        }

        if (selLectura2Oficio) {
            selLectura2Oficio.innerHTML = '';
            // Todas las lecturas patrísticas (2ª lectura) de todo el catálogo abierto
            const patristicas = cacheTodasLasLecturasOficio.filter(l => esPatristica(l));
            const lista2 = patristicas.length > 0 ? patristicas : cacheTodasLasLecturasOficio;
            lista2.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id || item.varName;
                opt.setAttribute('data-cita', item.cita || '');
                opt.setAttribute('data-desc', item.descripcion || item.subtitulo || '');
                opt.setAttribute('data-texto', (item.texto || '').slice(0, 300));
                opt.setAttribute('data-titulo', item.titulo || '');
                const citaCorta = (item.cita || item.id).split('\n')[0];
                const descCorta = item.descripcion ? ` - ${item.descripcion.slice(0, 45)}...` : '';
                opt.textContent = `[Patrística] ${citaCorta}${descCorta}`;
                selLectura2Oficio.appendChild(opt);
            });

            let targetL2 = valLec2Previo;
            if (!targetL2 && selTiempo && selSemana && selDia) {
                const recomL2 = LecturasDB.obtenerLectura2(selTiempo.value, selSemana.value, selDia.value);
                if (recomL2) targetL2 = recomL2.id || recomL2.varName;
            }
            ordenarOpcionesAZ(selLectura2Oficio, targetL2);
            if (selLectura2Oficio._reaplicarFiltro) selLectura2Oficio._reaplicarFiltro();
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
        if (e.key === 'lh_preces_cache') {
            const valorPrecesActual = selPreces ? selPreces.value : null;
            cargarYPoblarSelectPreces(valorPrecesActual);
            actualizarInvitatorioPreview(false);
        }
        if (e.key === 'lh_oracion_cache') {
            const valorOracionActual = selOracion ? selOracion.value : null;
            cargarYPoblarSelectOracion(valorOracionActual);
            actualizarInvitatorioPreview(false);
        }
        if (e.key === 'lh_lecturas_cache') {
            const val1 = selLectura1Oficio ? selLectura1Oficio.value : null;
            const val2 = selLectura2Oficio ? selLectura2Oficio.value : null;
            cargarYPoblarSelectLecturasOficio(val1, val2);
            manejarCambioParametros(false);
        }
    });

    // Sincronizar lecturas del Oficio desde Firestore al arrancar
    async function sincronizarLecturasDesdeFirestore() {
        try {
            if (window.firebaseAPI && window.firebaseAPI.db) {
                const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
                const snap = await getDocs(collection(window.firebaseAPI.db, "lecturas_oficio"));
                if (!snap.empty) {
                    const desdeFb = [];
                    snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                    if (desdeFb.length > 0) {
                        const todas = obtenerTodasLasLecturasOficioDesdeCatalogo();
                        const mapa = new Map();
                        todas.forEach(x => { if (x && (x.id || x.varName)) mapa.set(x.id || x.varName, x); });
                        desdeFb.forEach(x => { if (x && (x.id || x.varName)) mapa.set(x.id || x.varName, x); });
                        const combinadas = Array.from(mapa.values());
                        localStorage.setItem('lh_lecturas_cache', JSON.stringify(combinadas));
                        const val1 = selLectura1Oficio ? selLectura1Oficio.value : null;
                        const val2 = selLectura2Oficio ? selLectura2Oficio.value : null;
                        cargarYPoblarSelectLecturasOficio(val1, val2);
                    }
                }
            }
        } catch (e) {
            console.warn("Fallo sincronización Firestore lecturas:", e);
        }
    }

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
        poblarSelectorDiasOSantos();
    }

    // Poblar Selector 3 (Días / Santos / Solemnidades) según el Tiempo Litúrgico y la Semana
    function poblarSelectorDiasOSantos(valorSeleccionadoPrevio = null) {
        if (!selDia) return;
        const tiempoVal = selTiempo ? selTiempo.value : 'ordinario';
        const semanaVal = selSemana ? selSemana.value : 's01';
        const lblSelectDia = document.getElementById('lblSelectDia');
        const icoSelectDia = document.getElementById('icoSelectDia');
        const txtSelectDia = document.getElementById('txtSelectDia');

        if (tiempoVal !== 'santos') {
            // Restaurar modo días estándar (Domingo a Sábado)
            if (lblSelectDia) lblSelectDia.title = 'Seleccionar día de la semana';
            if (icoSelectDia) icoSelectDia.textContent = 'today';
            if (txtSelectDia) txtSelectDia.textContent = 'Días';

            const opcionesActuales = Array.from(selDia.options).map(o => o.value);
            const esListaDias = opcionesActuales.includes('domingo') && opcionesActuales.includes('sabado');
            if (!esListaDias) {
                selDia.innerHTML = `
                    <option value="domingo">Domingo</option>
                    <option value="lunes">Lunes</option>
                    <option value="martes">Martes</option>
                    <option value="miercoles">Miércoles</option>
                    <option value="jueves">Jueves</option>
                    <option value="viernes">Viernes</option>
                    <option value="sabado">Sábado</option>
                `;
                if (valorSeleccionadoPrevio && CODIGOS_DIA[valorSeleccionadoPrevio]) {
                    selDia.value = valorSeleccionadoPrevio;
                } else {
                    selDia.value = 'domingo';
                }
            }
            return;
        }

        // Modo Fiestas (Santos / Solemnidades)
        selDia.innerHTML = '';

        if (semanaVal === 's03') {
            // Solemnidades
            if (lblSelectDia) lblSelectDia.title = 'Seleccionar solemnidad litúrgica o santo';
            if (icoSelectDia) icoSelectDia.textContent = 'auto_awesome';
            if (txtSelectDia) txtSelectDia.textContent = 'Solemnidad / Santos';

            // 1. Grupo Solemnidades de form_etiempo
            const anioActual = new Date().getFullYear();
            let hitos = [];
            try {
                hitos = (typeof generarHitosLiturgicos === 'function') ? generarHitosLiturgicos(anioActual) : [];
            } catch (_) {}

            const grpHitos = document.createElement('optgroup');
            grpHitos.label = 'Solemnidades Litúrgicas';

            hitos.forEach(h => {
                const nombreLimpio = (h.nombre || '').replace(/\s*\([^)]*\)/g, '').trim();
                const idSolemnidad = generarNomenclaturaSolemnidad(h.nombre);
                let fechaCorta = '';
                if (h.fecha) {
                    const parts = h.fecha.split('-');
                    if (parts.length === 3) fechaCorta = ` (${parts[2]}/${parts[1]})`;
                }
                const opt = document.createElement('option');
                opt.value = idSolemnidad;
                opt.textContent = `${nombreLimpio}${fechaCorta}`;
                opt.setAttribute('data-tipo', 'solemnidad');
                opt.setAttribute('data-nombre', nombreLimpio);
                grpHitos.appendChild(opt);
            });
            selDia.appendChild(grpHitos);

            // 2. Grupo Santos del Catálogo
            const santos = obtenerCatalogoSantos();
            const grpSantos = document.createElement('optgroup');
            grpSantos.label = 'Santos del Catálogo';

            const listaSantosOrdenada = [...santos].sort((a, b) => {
                return (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' });
            });

            listaSantosOrdenada.forEach(s => {
                const idSanto = generarIdSanto(s);
                const { texto: fechaTexto } = extraerDiaMesCelebracion(s);
                const opt = document.createElement('option');
                opt.value = idSanto;
                opt.textContent = `${s.nombre} (${fechaTexto})`;
                opt.setAttribute('data-tipo', 'santo');
                opt.setAttribute('data-nombre', s.nombre);
                grpSantos.appendChild(opt);
            });
            selDia.appendChild(grpSantos);

        } else {
            // Común de Santos (s01), Propio de los Santos (s02) y Fiestas y Memorias (s04)
            if (lblSelectDia) lblSelectDia.title = 'Seleccionar santo a trabajar';
            if (icoSelectDia) icoSelectDia.textContent = 'person';
            if (txtSelectDia) txtSelectDia.textContent = 'Santos';

            const santos = obtenerCatalogoSantos();
            const listaSantosOrdenada = [...santos].sort((a, b) => {
                return (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' });
            });

            listaSantosOrdenada.forEach(s => {
                const idSanto = generarIdSanto(s);
                const { texto: fechaTexto } = extraerDiaMesCelebracion(s);
                const opt = document.createElement('option');
                opt.value = idSanto;
                opt.textContent = `${s.nombre} (${fechaTexto})`;
                opt.setAttribute('data-tipo', 'santo');
                opt.setAttribute('data-nombre', s.nombre);
                selDia.appendChild(opt);
            });
        }

        if (valorSeleccionadoPrevio && Array.from(selDia.options).some(o => o.value === valorSeleccionadoPrevio)) {
            selDia.value = valorSeleccionadoPrevio;
        } else if (selDia.options.length > 0) {
            selDia.selectedIndex = 0;
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
        const semanaVal = selSemana.value || 's01';
        const diaVal    = selDia.value;
        const libroVal  = selLibro.value;
        const esOficio  = (libroVal === 'oficio');
        const esDomingo = (diaVal === 'domingo');
        const mostrarHimnoPost = esOficio && esDomingo;

        // Alternancia de cajas de control entre Laudes y Oficio
        if (ctrlBoxResponsorioOficio) ctrlBoxResponsorioOficio.style.display = esOficio ? 'block' : 'none';
        if (ctrlBoxLectura1Oficio) ctrlBoxLectura1Oficio.style.display = esOficio ? 'block' : 'none';
        if (ctrlBoxLectura2Oficio) ctrlBoxLectura2Oficio.style.display = esOficio ? 'block' : 'none';
        if (ctrlBoxTeDeumOficio) ctrlBoxTeDeumOficio.style.display = mostrarHimnoPost ? 'block' : 'none';
        if (ctrlBoxOpcionalOficio) ctrlBoxOpcionalOficio.style.display = mostrarHimnoPost ? 'block' : 'none';

        if (ctrlBoxLecturaBreve) ctrlBoxLecturaBreve.style.display = esOficio ? 'none' : 'block';
        if (ctrlBoxAntifonaCantico) ctrlBoxAntifonaCantico.style.display = esOficio ? 'none' : 'block';
        if (ctrlBoxCantico) ctrlBoxCantico.style.display = esOficio ? 'none' : 'block';
        if (ctrlBoxPreces) ctrlBoxPreces.style.display = esOficio ? 'none' : 'block';

        // Alternancia de secciones de la hoja de pergamino
        if (seccionInvitatorioLaudesPreview) seccionInvitatorioLaudesPreview.style.display = esOficio ? 'none' : 'block';
        if (seccionInvitatorioOficioPreview) seccionInvitatorioOficioPreview.style.display = esOficio ? 'block' : 'none';

        if (seccionResponsorioOficioPreview) seccionResponsorioOficioPreview.style.display = esOficio ? 'block' : 'none';
        if (seccionLectura1OficioPreview) seccionLectura1OficioPreview.style.display = esOficio ? 'block' : 'none';
        if (seccionLectura2OficioPreview) seccionLectura2OficioPreview.style.display = esOficio ? 'block' : 'none';

        // Himno post-2ª lectura (solo domingos) y sección opcional
        actualizarHimnoPostLecturasPreview();

        if (seccionLecturaBrevePreview) seccionLecturaBrevePreview.style.display = esOficio ? 'none' : 'block';
        if (seccionCanticoEvangelicoPreview) seccionCanticoEvangelicoPreview.style.display = esOficio ? 'none' : 'block';
        if (seccionPrecesPreview) seccionPrecesPreview.style.display = esOficio ? 'none' : 'block';

        // Conclusión fija
        if (previewTituloConclusion) previewTituloConclusion.textContent = 'CONCLUSIÓN';
        if (esOficio) {
            if (previewConclusionV) previewConclusionV.textContent = 'Bendigamos al Señor.';
            if (previewConclusionR) previewConclusionR.textContent = 'Demos gracias a Dios.';
        } else {
            if (previewConclusionV) previewConclusionV.textContent = 'El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.';
            if (previewConclusionR) previewConclusionR.textContent = 'Amén.';
        }

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
            oficio:    '',
            vispera:   '(Oración de la tarde)',
            tercia:    '(Antes del mediodía)',
            sexta:     '(Al mediodía)',
            nona:      '(De la tarde)',
            completas: '(Oración antes del descanso nocturno)'
        };
        if (previewSubtituloHora) {
            if (esOficio) {
                previewSubtituloHora.style.display = 'none';
                previewSubtituloHora.textContent = '';
                if (previewTituloHora) previewTituloHora.style.marginBottom = '';
            } else {
                previewSubtituloHora.style.display = 'block';
                previewSubtituloHora.textContent = mapaSubtitulos[libroVal] || '(Oración de la mañana)';
                if (previewTituloHora) previewTituloHora.style.marginBottom = '';
            }
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

            if (txtAntifonaOficio && txtAntifona) {
                txtAntifonaOficio.textContent = txtAntifona.textContent;
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

        // 8B. ELEMENTOS ESPECÍFICOS DE OFICIO DE LECTURA (IMÁGENES 3 Y 4)
        if (esOficio) {
            // Responsorio post-salmodia (Imagen 3)
            if (selResponsorioOficio) {
                if (forzarRecomendado || !selResponsorioOficio.value) {
                    const respRecom = ResponsoriosDB.obtenerRecomendado(tiempoVal, semanaVal, diaVal);
                    if (respRecom) {
                        if (!Array.from(selResponsorioOficio.options).some(o => o.value === respRecom.id || o.value === respRecom.varName)) {
                            const opt = document.createElement('option');
                            opt.value = respRecom.id;
                            opt.setAttribute('data-v', respRecom.v);
                            opt.setAttribute('data-r', respRecom.r);
                            opt.textContent = `V. ${respRecom.v ? respRecom.v.slice(0, 45) : ''}... / R. ${respRecom.r ? respRecom.r.slice(0, 30) : ''}`;
                            selResponsorioOficio.appendChild(opt);
                        }
                        selResponsorioOficio.value = respRecom.id;
                    }
                }

                const optRespActual = selResponsorioOficio.selectedOptions[0];
                const respId = optRespActual ? optRespActual.value : selResponsorioOficio.value;
                const respObj = cacheTodosLosResponsorios.find(r => r.id === respId || r.varName === respId) ||
                                ResponsoriosDB.obtener(respId) ||
                                ResponsoriosDB.obtenerRecomendado(tiempoVal, semanaVal, diaVal);

                if (previewRespOficioV) previewRespOficioV.textContent = respObj ? respObj.v : 'Éste es mi Hijo amado.';
                if (previewRespOficioR) previewRespOficioR.textContent = respObj ? respObj.r : 'Escuchadlo.';
            }

            const anioActual = new Date().getFullYear();
            const esPar = (anioActual % 2 === 0);

            // 1ª Lectura Bíblica (Imagen 4)
            if (selLectura1Oficio) {
                if (forzarRecomendado || !selLectura1Oficio.value) {
                    const recomL1 = LecturasDB.obtenerLectura1(tiempoVal, semanaVal, diaVal, esPar);
                    if (recomL1) {
                        if (!Array.from(selLectura1Oficio.options).some(o => o.value === recomL1.id || o.value === recomL1.varName)) {
                            const opt = document.createElement('option');
                            opt.value = recomL1.id;
                            opt.textContent = `[${esPar ? 'Año Par' : 'Año Impar'}] ${recomL1.cita} - ${recomL1.descripcion ? recomL1.descripcion.slice(0, 45) : ''}...`;
                            selLectura1Oficio.appendChild(opt);
                        }
                        selLectura1Oficio.value = recomL1.id;
                    }
                }

                const optL1Actual = selLectura1Oficio.selectedOptions[0];
                const l1Id = optL1Actual ? optL1Actual.value : selLectura1Oficio.value;
                const l1Obj = cacheTodasLasLecturasOficio.find(l => l.id === l1Id || l.varName === l1Id) ||
                              LecturasDB.obtener(l1Id) ||
                              LecturasDB.obtenerLectura1(tiempoVal, semanaVal, diaVal, esPar);

                if (l1Obj) {
                    if (previewLec1Epigrafe) previewLec1Epigrafe.textContent = l1Obj.epigrafeTipo || 'PRIMERA LECTURA';
                    if (previewLec1Cita) previewLec1Cita.textContent = l1Obj.cita || '';
                    if (previewLec1Desc) previewLec1Desc.textContent = l1Obj.descripcion || l1Obj.subtitulo || '';
                    if (previewLec1Texto) previewLec1Texto.textContent = l1Obj.texto || '';
                    const r1_1 = l1Obj.respR1 || l1Obj.responsorio?.r1 || '';
                    const r2_1 = l1Obj.respR2 || l1Obj.responsorio?.r2 || '';
                    if (previewLec1RespCita) previewLec1RespCita.textContent = l1Obj.respCita || l1Obj.responsorio?.ref || '';
                    if (previewLec1RespR1) previewLec1RespR1.innerHTML = formatAsterisco(r1_1, r2_1);
                    if (previewLec1RespV) previewLec1RespV.textContent = l1Obj.respV || l1Obj.responsorio?.v || '';
                    if (previewLec1RespR2) previewLec1RespR2.textContent = r2_1;
                }
            }

            // 2ª Lectura Patrística (Imagen 4)
            if (selLectura2Oficio) {
                if (forzarRecomendado || !selLectura2Oficio.value) {
                    const recomL2 = LecturasDB.obtenerLectura2(tiempoVal, semanaVal, diaVal);
                    if (recomL2) {
                        if (!Array.from(selLectura2Oficio.options).some(o => o.value === recomL2.id || o.value === recomL2.varName)) {
                            const opt = document.createElement('option');
                            opt.value = recomL2.id;
                            opt.textContent = `[Patrística] ${recomL2.cita} - ${recomL2.descripcion ? recomL2.descripcion.slice(0, 45) : ''}...`;
                            selLectura2Oficio.appendChild(opt);
                        }
                        selLectura2Oficio.value = recomL2.id;
                    }
                }

                const optL2Actual = selLectura2Oficio.selectedOptions[0];
                const l2Id = optL2Actual ? optL2Actual.value : selLectura2Oficio.value;
                const l2Obj = cacheTodasLasLecturasOficio.find(l => l.id === l2Id || l.varName === l2Id) ||
                              LecturasDB.obtener(l2Id) ||
                              LecturasDB.obtenerLectura2(tiempoVal, semanaVal, diaVal);

                if (l2Obj) {
                    if (previewLec2Epigrafe) previewLec2Epigrafe.textContent = l2Obj.epigrafeTipo || 'SEGUNDA LECTURA';
                    if (previewLec2Cita) previewLec2Cita.textContent = l2Obj.cita || '';
                    if (previewLec2Desc) previewLec2Desc.textContent = l2Obj.descripcion || l2Obj.subtitulo || '';
                    if (previewLec2Texto) previewLec2Texto.textContent = l2Obj.texto || '';
                    const r1_2 = l2Obj.respR1 || l2Obj.responsorio?.r1 || '';
                    const r2_2 = l2Obj.respR2 || l2Obj.responsorio?.r2 || '';
                    if (previewLec2RespCita) previewLec2RespCita.textContent = l2Obj.respCita || l2Obj.responsorio?.ref || '';
                    if (previewLec2RespR1) previewLec2RespR1.innerHTML = formatAsterisco(r1_2, r2_2);
                    if (previewLec2RespV) previewLec2RespV.textContent = l2Obj.respV || l2Obj.responsorio?.v || '';
                    if (previewLec2RespR2) previewLec2RespR2.textContent = r2_2;
                }
            }

            // Himno post-2ª lectura (solo domingos) y sección opcional
            actualizarHimnoPostLecturasPreview();
        }

        // 9. LECTURA BREVE Y RESPONSORIO BREVE (DEBAJO DE LA SALMODIA)
        if (!esOficio && selLectura) {
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
        if (selPreces) {
            if (forzarRecomendado || !selPreces.value) {
                const precesRecom = PrecesDB.obtenerRecomendada(tiempoVal, semanaVal, diaVal, libroVal);
                if (precesRecom) {
                    if (!Array.from(selPreces.options).some(o => o.value === precesRecom.id || o.value === precesRecom.varName)) {
                        const opt = document.createElement('option');
                        opt.value = precesRecom.id;
                        opt.textContent = `${precesRecom.titulo || precesRecom.id} — ${precesRecom.respuesta || ''}`;
                        selPreces.appendChild(opt);
                    }
                    selPreces.value = precesRecom.id;
                }
            }

            const optPrecesActual = selPreces.selectedOptions[0];
            const precesId = optPrecesActual ? optPrecesActual.value : selPreces.value;
            const precesObj = cacheTodasLasPreces.find(p => p.id === precesId || p.varName === precesId) ||
                              PrecesDB.obtener(precesId) ||
                              PrecesDB.obtenerRecomendada(tiempoVal, semanaVal, diaVal, libroVal);

            if (previewTituloPreces) previewTituloPreces.textContent = 'PRECES';
            if (previewTextoPreces && precesObj) {
                let textoMostrar = '';
                if (precesObj.textoCompleto) {
                    textoMostrar = precesObj.textoCompleto;
                } else {
                    const intro = precesObj.intro || '';
                    const resp = precesObj.respuesta || '';
                    const ints = Array.isArray(precesObj.intenciones) ? precesObj.intenciones.join('\n\n') : (precesObj.intenciones || '');
                    textoMostrar = `${intro}\n\n${resp}\n\n${ints}`;
                }
                previewTextoPreces.textContent = textoMostrar;
            }
            if (previewIntroPadreNuestro && precesObj) {
                previewIntroPadreNuestro.textContent = precesObj.concl || 'Terminemos nuestra oración con la plegaria que Cristo nos enseñó:';
            }
        }

        // 12. ORACIÓN
        if (selOracion) {
            if (forzarRecomendado || !selOracion.value) {
                const oracionRecom = OracionDB.obtenerRecomendada(tiempoVal, semanaVal, diaVal, libroVal);
                if (oracionRecom) {
                    if (!Array.from(selOracion.options).some(o => o.value === oracionRecom.id || o.value === oracionRecom.varName)) {
                        const opt = document.createElement('option');
                        opt.value = oracionRecom.id;
                        opt.textContent = `${oracionRecom.titulo || oracionRecom.id} — ${oracionRecom.texto ? oracionRecom.texto.slice(0, 50) + '...' : ''}`;
                        selOracion.appendChild(opt);
                    }
                    selOracion.value = oracionRecom.id;
                }
            }

            const optOracionActual = selOracion.selectedOptions[0];
            const oracionId = optOracionActual ? optOracionActual.value : selOracion.value;
            const oracionObj = cacheTodasLasOraciones.find(o => o.id === oracionId || o.varName === oracionId) ||
                               OracionDB.obtener(oracionId) ||
                               OracionDB.obtenerRecomendada(tiempoVal, semanaVal, diaVal, libroVal);

            if (previewTituloOracion) previewTituloOracion.textContent = 'ORACIÓN';
            if (previewTextoOracion && oracionObj) {
                previewTextoOracion.textContent = oracionObj.textoCompleto || oracionObj.texto || '';
            }
        } else {
            const oracionTextoRecom = obtenerOracionRecomendada(tiempoVal, semanaVal, diaVal, libroVal);
            if (previewTituloOracion) previewTituloOracion.textContent = 'ORACIÓN';
            if (previewTextoOracion) {
                previewTextoOracion.textContent = oracionTextoRecom || '';
            }
        }

        // 13. CONCLUSIÓN
        if (previewTituloConclusion) previewTituloConclusion.textContent = 'CONCLUSIÓN';
        if (esOficio) {
            if (previewConclusionV) previewConclusionV.textContent = 'Bendigamos al Señor.';
            if (previewConclusionR) previewConclusionR.textContent = 'Demos gracias a Dios.';
        } else {
            if (previewConclusionV) previewConclusionV.textContent = 'El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.';
            if (previewConclusionR) previewConclusionR.textContent = 'Amén.';
        }
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
        const libroSolicitado = selLibro ? selLibro.value : 'laudes';
        if (datos.horas && datos.horas[libroSolicitado]) {
            datos = { ...datos, ...datos.horas[libroSolicitado] };
        }
        actualizarBadgeEstado(true);

        // Limpiar cualquier filtro de texto activo para que todas las opciones estén disponibles
        document.querySelectorAll('.input-filtro-select').forEach(inp => { inp.value = ''; });
        document.querySelectorAll('.btn-limpiar-filtro-select').forEach(btn => { btn.style.display = 'none'; });
        document.querySelectorAll('.grid-controles-invitatorio select').forEach(sel => {
            if (sel._todasLasOpciones && sel._todasLasOpciones.length > 0) {
                const valActual = sel.value;
                sel.innerHTML = '';
                sel._todasLasOpciones.forEach(o => sel.appendChild(o.cloneNode(true)));
                if (valActual) sel.value = valActual;
            }
        });

        const libroActual = datos.libro || selLibro.value;
        const esOficio = (libroActual === 'oficio');

        if (previewSubtituloHora) {
            if (esOficio) {
                previewSubtituloHora.style.display = 'none';
                previewSubtituloHora.textContent = '';
                if (previewTituloHora) previewTituloHora.style.marginBottom = '';
            } else {
                previewSubtituloHora.style.display = 'block';
                if (previewTituloHora) previewTituloHora.style.marginBottom = '';
            }
        }

        if (ctrlBoxResponsorioOficio) ctrlBoxResponsorioOficio.style.display = esOficio ? 'block' : 'none';
        if (ctrlBoxLectura1Oficio) ctrlBoxLectura1Oficio.style.display = esOficio ? 'block' : 'none';
        if (ctrlBoxLectura2Oficio) ctrlBoxLectura2Oficio.style.display = esOficio ? 'block' : 'none';
        if (ctrlBoxTeDeumOficio) ctrlBoxTeDeumOficio.style.display = esOficio ? 'block' : 'none';
        if (ctrlBoxOpcionalOficio) ctrlBoxOpcionalOficio.style.display = esOficio ? 'block' : 'none';

        if (ctrlBoxLecturaBreve) ctrlBoxLecturaBreve.style.display = esOficio ? 'none' : 'block';
        if (ctrlBoxAntifonaCantico) ctrlBoxAntifonaCantico.style.display = esOficio ? 'none' : 'block';
        if (ctrlBoxCantico) ctrlBoxCantico.style.display = esOficio ? 'none' : 'block';
        if (ctrlBoxPreces) ctrlBoxPreces.style.display = esOficio ? 'none' : 'block';

        if (seccionInvitatorioLaudesPreview) seccionInvitatorioLaudesPreview.style.display = esOficio ? 'none' : 'block';
        if (seccionInvitatorioOficioPreview) seccionInvitatorioOficioPreview.style.display = esOficio ? 'block' : 'none';

        if (seccionResponsorioOficioPreview) seccionResponsorioOficioPreview.style.display = esOficio ? 'block' : 'none';
        if (seccionLectura1OficioPreview) seccionLectura1OficioPreview.style.display = esOficio ? 'block' : 'none';
        if (seccionLectura2OficioPreview) seccionLectura2OficioPreview.style.display = esOficio ? 'block' : 'none';
        if (seccionTeDeumPreview) seccionTeDeumPreview.style.display = (esOficio && datos.himnoTeDeum && datos.himnoTeDeum.id !== 'ninguno') ? 'block' : 'none';
        if (seccionOpcionalOficioPreview) {
            const txtOpc = (datos.seccionOpcional && typeof datos.seccionOpcional === 'object') ? datos.seccionOpcional.texto : (datos.seccionOpcional || '');
            seccionOpcionalOficioPreview.style.display = (esOficio && txtOpc) ? 'block' : 'none';
            if (previewTextoOpcionalOficio) previewTextoOpcionalOficio.textContent = txtOpc;
        }

        if (seccionLecturaBrevePreview) seccionLecturaBrevePreview.style.display = esOficio ? 'none' : 'block';
        if (seccionCanticoEvangelicoPreview) seccionCanticoEvangelicoPreview.style.display = esOficio ? 'none' : 'block';
        if (seccionPrecesPreview) seccionPrecesPreview.style.display = esOficio ? 'none' : 'block';

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
        let precesIdGuardado = precesData.id || precesData.varName || null;
        let precesTextoGuardado = precesData.texto || precesData.textoCompleto || (datos.cEvan_Conclusion ? datos.cEvan_Conclusion.preces1 : null);
        let precesConclGuardado = precesData.concl || (datos.cEvan_Conclusion ? datos.cEvan_Conclusion.preces2 : null);

        // Si precesData contiene intro y respuesta pero no texto, reconstruirlo PRIMERO
        if ((!precesTextoGuardado || precesTextoGuardado.length < 80) && precesData.intro && precesData.respuesta) {
            const ints = Array.isArray(precesData.intenciones) ? precesData.intenciones.join('\n\n') : (precesData.intenciones || '');
            precesTextoGuardado = `${precesData.intro}\n\n${precesData.respuesta}\n\n${ints}`.trim();
        }

        const introRaw = precesData.intro || '';
        const respRaw = precesData.respuesta || '';
        const intsRaw = Array.isArray(precesData.intenciones) ? precesData.intenciones : [];

        // Detección de preces corruptas o desgloses fallidos guardados previamente
        const canonPreces = (typeof PrecesDB !== 'undefined' && PrecesDB.obtener)
            ? PrecesDB.obtener(precesIdGuardado || (datos.id || datos.codigo), selTiempo.value, selSemana.value, selDia.value, selLibro.value)
            : null;

        const esCorrupta = Boolean(
            (introRaw.length > 110 || introRaw.includes('Cristo Jesús, que')) ||
            (respRaw === "Confirma, Señor, lo que has realizado en nosotros." && (selDia.value !== 'sabado' || !selLibro.value.startsWith('vispera'))) ||
            (intsRaw.some(i => String(i).includes('dígnate sostener nuestra fe') || String(i).includes('Acompaña con tu bendición'))) ||
            (precesTextoGuardado && (
                (precesTextoGuardado.includes('bautizado por Juan') && precesTextoGuardado.includes('dígnate sostener nuestra fe')) ||
                (precesTextoGuardado.includes('Confirma, Señor, lo que has realizado en nosotros.') && (selDia.value !== 'sabado' || !selLibro.value.startsWith('vispera')))
            )) ||
            (canonPreces && intsRaw.length <= 1)
        );

        if (canonPreces && (esCorrupta || !precesIdGuardado)) {
            precesIdGuardado = canonPreces.id || canonPreces.varName;
            precesTextoGuardado = canonPreces.textoCompleto || canonPreces.texto;
            precesConclGuardado = canonPreces.concl;
        }

        // Si no tenemos ID guardado, buscar coincidencia en cache o deducir por recomendación litúrgica
        if (!precesIdGuardado) {
            if (precesTextoGuardado || precesData.respuesta || precesData.intro) {
                const matchObj = cacheTodasLasPreces.find(p => 
                    (precesTextoGuardado && (p.textoCompleto === precesTextoGuardado || p.texto === precesTextoGuardado)) ||
                    (precesData.respuesta && p.respuesta === precesData.respuesta) ||
                    (precesData.intro && p.intro === precesData.intro)
                );
                if (matchObj) {
                    precesIdGuardado = matchObj.id || matchObj.varName;
                }
            }

            if (!precesIdGuardado) {
                const precesRecom = PrecesDB.obtenerRecomendada(selTiempo.value, selSemana.value, selDia.value, selLibro.value);
                if (precesRecom) {
                    precesIdGuardado = precesRecom.id || precesRecom.varName;
                }
            }
        }

        // Seleccionar la opción en selPreces
        if (selPreces && precesIdGuardado) {
            const matched = seleccionarOpcion(selPreces, precesIdGuardado, precesTextoGuardado);
            if (!matched) {
                const opt = document.createElement('option');
                opt.value = precesIdGuardado;
                opt.textContent = `${precesData.titulo || precesIdGuardado} — ${precesData.respuesta || ''}`;
                selPreces.appendChild(opt);
                selPreces.value = precesIdGuardado;
            }
        }

        // Obtener el objeto definitivo de preces para asegurar texto íntegro y conclusión
        const optPrecesActual = selPreces ? selPreces.selectedOptions[0] : null;
        const precesIdFinal = optPrecesActual ? optPrecesActual.value : (selPreces ? selPreces.value : precesIdGuardado);
        const pObj = canonPreces ||
                     cacheTodasLasPreces.find(p => p.id === precesIdFinal || p.varName === precesIdFinal) ||
                     PrecesDB.obtener(precesIdFinal, selTiempo.value, selSemana.value, selDia.value, selLibro.value) ||
                     PrecesDB.obtenerRecomendada(selTiempo.value, selSemana.value, selDia.value, selLibro.value);

        if (pObj) {
            if (!precesTextoGuardado || precesTextoGuardado.length < 80 || esCorrupta) {
                precesTextoGuardado = pObj.textoCompleto || pObj.texto;
            }
            if (!precesConclGuardado || esCorrupta) {
                precesConclGuardado = pObj.concl;
            }
        }

        if (esCorrupta && canonPreces) {
            datos.preces = {
                id: canonPreces.id,
                varName: canonPreces.varName,
                titulo: canonPreces.titulo,
                intro: canonPreces.intro,
                respuesta: canonPreces.respuesta,
                intenciones: [...canonPreces.intenciones],
                libre: canonPreces.libre,
                concl: canonPreces.concl,
                texto: canonPreces.textoCompleto,
                textoCompleto: canonPreces.textoCompleto
            };
            const idCod = datos.id || datos.codigo || (inputCodigo ? inputCodigo.value : null);
            if (idCod) {
                try {
                    localStorage.setItem(`lh_salterio_${idCod}`, JSON.stringify(datos));
                } catch (e) {}
            }
        }

        if (previewTituloPreces) previewTituloPreces.textContent = 'PRECES';
        if (previewTextoPreces && precesTextoGuardado) {
            previewTextoPreces.textContent = precesTextoGuardado;
        }
        if (previewIntroPadreNuestro && precesConclGuardado) {
            previewIntroPadreNuestro.textContent = precesConclGuardado;
        }

        // 10. ORACIÓN
        const oracionData = datos.oracion || {};
        let oracionIdGuardado = (typeof oracionData === 'object' ? (oracionData.id || oracionData.varName) : null);
        let oracionTextoGuardado = (typeof oracionData === 'string' ? oracionData : (oracionData.texto || oracionData.textoCompleto)) || (datos.cEvan_Conclusion ? datos.cEvan_Conclusion.oracion : null);

        if (!oracionIdGuardado) {
            if (oracionTextoGuardado) {
                const matchObj = cacheTodasLasOraciones.find(o => 
                    (o.texto && oracionTextoGuardado.includes(o.texto.slice(0, 30))) ||
                    (o.textoCompleto && oracionTextoGuardado.includes(o.textoCompleto.slice(0, 30)))
                );
                if (matchObj) {
                    oracionIdGuardado = matchObj.id || matchObj.varName;
                }
            }
            if (!oracionIdGuardado) {
                const oracionRecom = OracionDB.obtenerRecomendada(selTiempo.value, selSemana.value, selDia.value, selLibro.value);
                if (oracionRecom) {
                    oracionIdGuardado = oracionRecom.id || oracionRecom.varName;
                }
            }
        }

        if (selOracion && oracionIdGuardado) {
            const matched = seleccionarOpcion(selOracion, oracionIdGuardado, oracionTextoGuardado);
            if (!matched) {
                const opt = document.createElement('option');
                opt.value = oracionIdGuardado;
                opt.textContent = `${oracionData.titulo || oracionIdGuardado} — ${oracionTextoGuardado ? oracionTextoGuardado.slice(0, 50) + '...' : ''}`;
                selOracion.appendChild(opt);
                selOracion.value = oracionIdGuardado;
            }
        }

        const optOracionActual = selOracion ? selOracion.selectedOptions[0] : null;
        const oracionIdFinal = optOracionActual ? optOracionActual.value : (selOracion ? selOracion.value : oracionIdGuardado);
        const oObj = cacheTodasLasOraciones.find(o => o.id === oracionIdFinal || o.varName === oracionIdFinal) ||
                     OracionDB.obtener(oracionIdFinal) ||
                     OracionDB.obtenerRecomendada(selTiempo.value, selSemana.value, selDia.value, selLibro.value);

        if (oObj) {
            if (!oracionTextoGuardado || oracionTextoGuardado.length < 30) {
                oracionTextoGuardado = oObj.textoCompleto || oObj.texto;
            }
        }

        if (previewTituloOracion) previewTituloOracion.textContent = 'ORACIÓN';
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

        // 12. CAMPOS ESPECÍFICOS DE OFICIO DE LECTURA
        if (esOficio) {
            if (txtAntifonaOficio && textoAntFinal) {
                txtAntifonaOficio.textContent = textoAntFinal;
            }

            // Responsorio
            const vData = datos.versiculo || {};
            if (selResponsorioOficio && vData.id) {
                selResponsorioOficio.value = vData.id;
            }
            if (previewRespOficioV && vData.v) previewRespOficioV.textContent = vData.v;
            if (previewRespOficioR && vData.r) previewRespOficioR.textContent = vData.r;

            // Lecturas Oficio
            const lData = datos.lecturasOficio || {};
            const l1 = lData.primera;
            if (l1) {
                if (selLectura1Oficio && l1.id) selLectura1Oficio.value = l1.id;
                if (previewLec1Epigrafe) previewLec1Epigrafe.textContent = l1.titulo || l1.epigrafeTipo || 'PRIMERA LECTURA';
                if (previewLec1Cita) previewLec1Cita.textContent = l1.cita || '';
                if (previewLec1Desc) previewLec1Desc.textContent = l1.descripcion || l1.subtitulo || '';
                if (previewLec1Texto) previewLec1Texto.textContent = l1.texto || '';
                const r1_1 = l1.respR1 || l1.responsorio?.r1 || '';
                const r2_1 = l1.respR2 || l1.responsorio?.r2 || '';
                if (previewLec1RespCita) previewLec1RespCita.textContent = l1.respCita || l1.responsorio?.ref || '';
                if (previewLec1RespR1) previewLec1RespR1.innerHTML = formatAsterisco(r1_1, r2_1);
                if (previewLec1RespV) previewLec1RespV.textContent = l1.respV || l1.responsorio?.v || '';
                if (previewLec1RespR2) previewLec1RespR2.textContent = r2_1;
            }

            const l2 = lData.segunda;
            if (l2) {
                if (selLectura2Oficio && l2.id) selLectura2Oficio.value = l2.id;
                if (previewLec2Epigrafe) previewLec2Epigrafe.textContent = l2.titulo || l2.epigrafeTipo || 'SEGUNDA LECTURA';
                if (previewLec2Cita) previewLec2Cita.textContent = l2.cita || '';
                if (previewLec2Desc) previewLec2Desc.textContent = l2.descripcion || l2.subtitulo || '';
                if (previewLec2Texto) previewLec2Texto.textContent = l2.texto || '';
                const r1_2 = l2.respR1 || l2.responsorio?.r1 || '';
                const r2_2 = l2.respR2 || l2.responsorio?.r2 || '';
                if (previewLec2RespCita) previewLec2RespCita.textContent = l2.respCita || l2.responsorio?.ref || '';
                if (previewLec2RespR1) previewLec2RespR1.innerHTML = formatAsterisco(r1_2, r2_2);
                if (previewLec2RespV) previewLec2RespV.textContent = l2.respV || l2.responsorio?.v || '';
                if (previewLec2RespR2) previewLec2RespR2.textContent = r2_2;
            }

            // Himno post-2ª lectura y sección opcional (domingos y fiestas/santos)
            const diaVal = selDia ? selDia.value : 'domingo';
            const tiempoVal = selTiempo ? selTiempo.value : 'ordinario';
            const esDomingoOFiesta = (diaVal === 'domingo' || tiempoVal === 'santos');

            if (selTeDeumOficio) {
                const himnoIdGuardado = datos.himnoTeDeum ? (datos.himnoTeDeum.id || datos.himnoTeDeum) : (esDomingoOFiesta ? 'tedeum_canonico' : 'ninguno');
                cargarYPoblarSelectHimnoPostLecturas(himnoIdGuardado);
            }

            if (inputOpcionalOficio) {
                const txtOpc = (typeof datos.seccionOpcional === 'object') ? (datos.seccionOpcional ? datos.seccionOpcional.texto : '') : datos.seccionOpcional;
                inputOpcionalOficio.value = (txtOpc !== undefined && txtOpc !== null && txtOpc !== '')
                    ? txtOpc
                    : (esDomingoOFiesta ? TEXTO_OPCIONAL_TEDUM_DOMINGO : '');
            }

            actualizarHimnoPostLecturasPreview();
        }

        // Sincronizar todos los selectores personalizados compactos con los datos restaurados
        document.querySelectorAll('.select-liturgico').forEach(sel => {
            if (typeof sel._actualizarCustomSelect === 'function') {
                sel._actualizarCustomSelect();
            }
        });
    }

    // Verificar si el ID actual ya ha sido guardado (asíncrono para Firebase de respaldo)
    async function verificarEstadoId(idCodigo) {
        const candidatos = (typeof obtenerIdsEquivalentes === 'function') ? obtenerIdsEquivalentes(idCodigo) : [idCodigo];
        const tiempoVal = selTiempo ? selTiempo.value : 'ordinario';
        const libroVal = selLibro ? selLibro.value : 'laudes';

        if (tiempoVal === 'santos') {
            candidatos.unshift(idCodigo);
            candidatos.push(idCodigo.toLowerCase());
            const idCelebracion = selDia ? selDia.value : '';
            if (idCelebracion) {
                candidatos.push(`${idCelebracion}_${libroVal}`);
                candidatos.push(idCelebracion);
                candidatos.push(idCelebracion.toLowerCase());
            }
        }

        // Primero revisar si ya existe localmente bajo el ID o cualquier equivalente
        for (const candId of candidatos) {
            const guardadoLocal = localStorage.getItem(`lh_salterio_${candId}`);
            if (guardadoLocal) {
                try {
                    let datos = JSON.parse(guardadoLocal);
                    if (datos && datos.horas && datos.horas[libroVal]) {
                        datos = { ...datos, ...datos.horas[libroVal] };
                        restaurarDesdeDatos(datos);
                        return;
                    } else if (datos && (!datos.libro || datos.libro === libroVal)) {
                        restaurarDesdeDatos(datos);
                        return;
                    }
                } catch (e) {}
            }
        }

        // Si no está local, buscar en Firebase Firestore probando los identificadores equivalentes
        let datosCargados = null;
        if (window.firebaseAPI && window.firebaseAPI.db) {
            try {
                const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
                for (const candId of candidatos) {
                    const snap = await getDoc(doc(window.firebaseAPI.db, "salterios", candId));
                    if (snap && snap.exists()) {
                        const raw = snap.data();
                        if (raw.horas && raw.horas[libroVal]) {
                            datosCargados = { ...raw, ...raw.horas[libroVal] };
                        } else if (!raw.libro || raw.libro === libroVal) {
                            datosCargados = raw;
                        }
                        if (datosCargados) {
                            localStorage.setItem(`lh_salterio_${idCodigo}`, JSON.stringify(raw));
                            if (tiempoVal === 'santos') {
                                localStorage.setItem(`lh_salterio_${idCodigo}_${libroVal}`, JSON.stringify(datosCargados));
                            }
                            break;
                        }
                    }
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

    // Calcular y renderizar el código combinado (ej: tos01dola, tos01doof, tos24sala)
    function actualizarCodigoCombinado(esCambioParametro = false) {
        const tiempoVal = selTiempo.value;
        const semanaVal = selSemana.value; // ej: s01, s24 o s25
        const diaVal    = selDia.value;
        const libroVal  = selLibro.value;

        const infoTiempo = CODIGOS_TIEMPO[tiempoVal] || { codigo: 'to', nombre: 'Tiempo Ordinario' };
        let codSemana  = semanaVal || 's01';
        const mSem = codSemana.match(/^s?(\d+)$/i);
        if (mSem) {
            codSemana = `s${mSem[1].padStart(2, '0')}`;
        }
        const infoDia    = CODIGOS_DIA[diaVal] || { codigo: 'do', nombre: 'Domingo' };
        const infoLibro  = CODIGOS_LIBRO[libroVal] || { codigo: 'la', nombre: 'Laudes' };

        let codigoFinal = '';

        if (tiempoVal === 'santos') {
            const optDiaSel = selDia.selectedOptions[0];
            const nombreCelebracion = optDiaSel ? (optDiaSel.getAttribute('data-nombre') || optDiaSel.textContent) : 'Santos';
            const catNombre = (SEMANAS_POR_TIEMPO.santos.find(s => s.valor === semanaVal) || {}).texto || 'Común de Santos';
            const idCelebracion = selDia.value || 'sa0101santamaria';

            // El código final incluye el sufijo de la liturgia de las horas (ej: elbautismodelSeñorof, elbautismodelSeñorla, elbautismodelSeñorse, sa2906santospedroypabloof)
            codigoFinal = `${idCelebracion}${infoLibro.codigo}`;

            if (inputCodigo) {
                inputCodigo.value = codigoFinal;
            }

            // Actualizar badges explicativos
            const badgeTiempo = document.getElementById('badgeTiempo');
            const badgeSemana = document.getElementById('badgeSemana');
            const badgeDia    = document.getElementById('badgeDia');
            const badgeLibro  = document.getElementById('badgeLibro');
            const textoDesc   = document.getElementById('textoDescriptivo');

            if (badgeTiempo) badgeTiempo.innerHTML = `Tiempo: <strong>san</strong> (${infoTiempo.nombre})`;
            if (badgeSemana) badgeSemana.innerHTML = `Categoría: <strong>${catNombre}</strong>`;
            if (badgeDia)    badgeDia.innerHTML    = `Celebración: <strong>${idCelebracion}</strong>`;
            if (badgeLibro)  badgeLibro.innerHTML  = `Hora: <strong>${infoLibro.codigo}</strong> (${infoLibro.nombre})`;

            if (textoDesc) {
                textoDesc.textContent = `${infoTiempo.nombre} • ${catNombre} • ${nombreCelebracion} • ${infoLibro.nombre}`;
            }
        } else {
            // Combinación del código canónico: [tiempo][semana 2 dígitos][día][hora al final] (ej: tos01doof, tos01dola)
            codigoFinal = `${infoTiempo.codigo}${codSemana}${infoDia.codigo}${infoLibro.codigo}`.toLowerCase();

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
            oficio:    '',
            vispera:   '(Oración de la tarde)',
            tercia:    '(Antes del mediodía)',
            sexta:     '(Al mediodía)',
            nona:      '(De la tarde)',
            completas: '(Oración antes del descanso nocturno)'
        };
        if (previewSubtituloHora) {
            if (libroVal === 'oficio') {
                previewSubtituloHora.style.display = 'none';
                previewSubtituloHora.textContent = '';
                if (previewTituloHora) previewTituloHora.style.marginBottom = '';
            } else {
                previewSubtituloHora.style.display = 'block';
                previewSubtituloHora.textContent = mapaSubtitulos[libroVal] || '(Oración de la mañana)';
                if (previewTituloHora) previewTituloHora.style.marginBottom = '';
            }
        }

        // Comprobación sincrónica inmediata de LocalStorage para evitar parpadeos o sobrescrituras
        const candidatos = (typeof obtenerIdsEquivalentes === 'function') ? obtenerIdsEquivalentes(codigoFinal) : [codigoFinal];
        if (tiempoVal === 'santos') {
            candidatos.unshift(codigoFinal);
            candidatos.push(codigoFinal.toLowerCase());
            const idCelebracion = selDia ? selDia.value : '';
            if (idCelebracion) {
                candidatos.push(`${idCelebracion}_${libroVal}`);
                candidatos.push(idCelebracion);
                candidatos.push(idCelebracion.toLowerCase());
            }
        }
        for (const candId of candidatos) {
            const localDataRaw = localStorage.getItem(`lh_salterio_${candId}`);
            if (localDataRaw) {
                try {
                    let datos = JSON.parse(localDataRaw);
                    if (datos && datos.horas && datos.horas[libroVal]) {
                        datos = { ...datos, ...datos.horas[libroVal] };
                        restaurarDesdeDatos(datos);
                        return;
                    } else if (datos && (!datos.libro || datos.libro === libroVal)) {
                        restaurarDesdeDatos(datos);
                        return;
                    }
                } catch (e) {}
            }
        }

        // Si no está en LocalStorage, renderizar recomendaciones por defecto
        actualizarBadgeEstado(false);
        actualizarInvitatorioPreview(esCambioParametro);

        // Y verificar asíncronamente con Firebase
        verificarEstadoId(codigoFinal);
    }

    // Guardar en Firebase y LocalStorage con el ID Primario
    async function guardarEnFirebase() {
        if (typeof window.hasPermission === 'function' && !window.hasPermission('frm_salterios_guardar')) {
            alert('No tienes permiso para guardar cambios en este formulario (requiere permiso "Guardar en Firebase").');
            return;
        }

        const idCodigo = inputCodigo.value.trim();
        if (!idCodigo) {
            alert('No hay un código índice generado.');
            return;
        }

        if (!btnGuardar) return;

        const txtOriginal = btnGuardar.innerHTML;
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;">hourglass_top</span> <span>Guardando...</span>`;

        const tiempoVal = selTiempo.value;
        let semanaVal = selSemana.value || 's01';
        const mSemG = semanaVal.match(/^s?(\d+)$/i);
        if (mSemG) {
            semanaVal = `s${mSemG[1].padStart(2, '0')}`;
        }
        const diaVal    = selDia.value;
        const libroVal  = selLibro.value;
        const esOficio  = (libroVal === 'oficio');

        const infoTiempo = CODIGOS_TIEMPO[tiempoVal] || { codigo: 'to', nombre: 'Tiempo Ordinario' };
        let infoDia    = CODIGOS_DIA[diaVal] || { codigo: 'do', nombre: 'Domingo' };
        const infoLibro  = CODIGOS_LIBRO[libroVal] || { codigo: 'la', nombre: 'Laudes' };

        if (tiempoVal === 'santos') {
            const optDiaSel = selDia ? selDia.selectedOptions[0] : null;
            const nombreCelebracion = optDiaSel ? (optDiaSel.getAttribute('data-nombre') || optDiaSel.textContent) : diaVal;
            infoDia = {
                codigo: diaVal,
                nombre: nombreCelebracion
            };
        }

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

        const optPrecesSel = selPreces ? selPreces.selectedOptions[0] : null;
        const precesIdSel = optPrecesSel ? optPrecesSel.value : (selPreces ? selPreces.value : '');
        const pObjSel = cacheTodasLasPreces.find(p => p.id === precesIdSel || p.varName === precesIdSel) ||
                        PrecesDB.obtener(precesIdSel) ||
                        PrecesDB.obtenerRecomendada(tiempoVal, semanaVal, diaVal, libroVal);

        const optOracionSel = selOracion ? selOracion.selectedOptions[0] : null;
        const oracionIdSel = optOracionSel ? optOracionSel.value : (selOracion ? selOracion.value : '');
        const oObjSel = cacheTodasLasOraciones.find(o => o.id === oracionIdSel || o.varName === oracionIdSel) ||
                        OracionDB.obtener(oracionIdSel) ||
                        OracionDB.obtenerRecomendada(tiempoVal, semanaVal, diaVal, libroVal);

        // Datos específicos de Oficio de Lectura
        const respOficioId = (selResponsorioOficio ? selResponsorioOficio.value : '');
        const versiculoOficio = {
            id: respOficioId,
            v: (previewRespOficioV ? previewRespOficioV.textContent.trim() : 'Éste es mi Hijo amado.'),
            r: (previewRespOficioR ? previewRespOficioR.textContent.trim() : 'Escuchadlo.')
        };

        const anioActual = new Date().getFullYear();
        const esPar = (anioActual % 2 === 0);

        const lec1Id = (selLectura1Oficio ? selLectura1Oficio.value : '');
        const lec2Id = (selLectura2Oficio ? selLectura2Oficio.value : '');

        const lecturasOficio = {
            primera: {
                id: lec1Id,
                etiqueta: '1ra Lectura',
                esPar: esPar,
                titulo: (previewLec1Epigrafe ? previewLec1Epigrafe.textContent.trim() : 'PRIMERA LECTURA'),
                epigrafeTipo: (previewLec1Epigrafe ? previewLec1Epigrafe.textContent.trim() : 'PRIMERA LECTURA'),
                cita: (previewLec1Cita ? previewLec1Cita.textContent.trim() : ''),
                subtitulo: (previewLec1Desc ? previewLec1Desc.textContent.trim() : ''),
                descripcion: (previewLec1Desc ? previewLec1Desc.textContent.trim() : ''),
                texto: (previewLec1Texto ? previewLec1Texto.textContent.trim() : ''),
                respCita: (previewLec1RespCita ? previewLec1RespCita.textContent.trim() : ''),
                respR1: (previewLec1RespR1 ? previewLec1RespR1.textContent.trim() : ''),
                respV: (previewLec1RespV ? previewLec1RespV.textContent.trim() : ''),
                respR2: (previewLec1RespR2 ? previewLec1RespR2.textContent.trim() : ''),
                responsorio: {
                    ref: (previewLec1RespCita ? previewLec1RespCita.textContent.trim() : ''),
                    r1: (previewLec1RespR1 ? previewLec1RespR1.textContent.trim() : ''),
                    v: (previewLec1RespV ? previewLec1RespV.textContent.trim() : ''),
                    r2: (previewLec1RespR2 ? previewLec1RespR2.textContent.trim() : '')
                }
            },
            segunda: {
                id: lec2Id,
                etiqueta: '2da Lectura',
                titulo: (previewLec2Epigrafe ? previewLec2Epigrafe.textContent.trim() : 'SEGUNDA LECTURA'),
                epigrafeTipo: (previewLec2Epigrafe ? previewLec2Epigrafe.textContent.trim() : 'SEGUNDA LECTURA'),
                cita: (previewLec2Cita ? previewLec2Cita.textContent.trim() : ''),
                subtitulo: (previewLec2Desc ? previewLec2Desc.textContent.trim() : ''),
                descripcion: (previewLec2Desc ? previewLec2Desc.textContent.trim() : ''),
                texto: (previewLec2Texto ? previewLec2Texto.textContent.trim() : ''),
                respCita: (previewLec2RespCita ? previewLec2RespCita.textContent.trim() : ''),
                respR1: (previewLec2RespR1 ? previewLec2RespR1.textContent.trim() : ''),
                respV: (previewLec2RespV ? previewLec2RespV.textContent.trim() : ''),
                respR2: (previewLec2RespR2 ? previewLec2RespR2.textContent.trim() : ''),
                responsorio: {
                    ref: (previewLec2RespCita ? previewLec2RespCita.textContent.trim() : ''),
                    r1: (previewLec2RespR1 ? previewLec2RespR1.textContent.trim() : ''),
                    v: (previewLec2RespV ? previewLec2RespV.textContent.trim() : ''),
                    r2: (previewLec2RespR2 ? previewLec2RespR2.textContent.trim() : '')
                }
            }
        };

        let himnoTeDeum = null;
        if (esOficio && (diaVal === 'domingo' || tiempoVal === 'santos')) {
            if (selTeDeumOficio && selTeDeumOficio.value === 'ninguno') {
                himnoTeDeum = { id: 'ninguno' };
            } else if (selTeDeumOficio && selTeDeumOficio.value) {
                himnoTeDeum = {
                    id: selTeDeumOficio.value,
                    titulo: (previewTituloTeDeum ? previewTituloTeDeum.textContent.trim() : 'HIMNO: A TI, OH DIOS (TE DEUM)'),
                    texto: (previewTextoTeDeum ? previewTextoTeDeum.textContent.trim() : '')
                };
            }
        }

        const seccionOpcional = (esOficio && (diaVal === 'domingo' || tiempoVal === 'santos')) ? {
            rubrica: 'La parte que sigue puede omitirse, si se cree oportuno.',
            texto: (inputOpcionalOficio ? inputOpcionalOficio.value.trim() : '')
        } : null;

        const payloadBase = {
            id: idCodigo,
            codigo: idCodigo,
            codigoDia: (typeof codigoDia !== 'undefined' ? codigoDia : idCodigo.slice(0, -2)),
            titulo: (previewTituloHora ? previewTituloHora.textContent : infoLibro.nombre.toUpperCase()),
            subtitulo: (esOficio ? '' : (previewSubtituloHora ? previewSubtituloHora.textContent : (libroVal === 'oficio' ? '' : '(Oración de la mañana)'))),
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
            versiculo: versiculoOficio,
            lecturasOficio: lecturasOficio,
            himnoTeDeum: himnoTeDeum,
            seccionOpcional: seccionOpcional,
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
                id: precesIdSel || (pObjSel ? pObjSel.id : ''),
                varName: pObjSel ? (pObjSel.varName || pObjSel.id) : precesIdSel,
                titulo: pObjSel ? pObjSel.titulo : 'PRECES',
                texto: precesTexto || (pObjSel ? pObjSel.textoCompleto : ''),
                textoCompleto: precesTexto || (pObjSel ? pObjSel.textoCompleto : ''),
                intro: pObjSel ? pObjSel.intro : (precesTexto.split('\n\n')[0] || ''),
                respuesta: pObjSel ? pObjSel.respuesta : (precesTexto.split('\n\n')[1] || ''),
                intenciones: (pObjSel && pObjSel.intenciones) ? pObjSel.intenciones : (precesTexto.split('\n\n').length > 2 ? precesTexto.split('\n\n').slice(2) : []),
                libre: 'Se pueden añadir algunas intenciones libres',
                concl: precesIntroPadre
            },
            padrenuestro: 'Padre nuestro...',
            oracion: {
                id: oracionIdSel || (oObjSel ? oObjSel.id : ''),
                varName: oObjSel ? (oObjSel.varName || oObjSel.id) : oracionIdSel,
                titulo: oObjSel ? oObjSel.titulo : 'ORACION',
                texto: oracionTexto || (oObjSel ? oObjSel.texto : ''),
                textoCompleto: oracionTexto || (oObjSel ? (oObjSel.textoCompleto || oObjSel.texto) : ''),
                conclusion: oObjSel ? (oObjSel.conclusion || '') : ''
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
                preces1: precesTexto || (pObjSel ? pObjSel.textoCompleto : ''),
                preces2: precesIntroPadre,
                Padren: 'Padre nuestro...',
                oracion: oracionTexto || (oObjSel ? (oObjSel.textoCompleto || oObjSel.texto) : ''),
                Conclusion1: conclusionV,
                Conclusion2: conclusionR
            },
            actualizadoEn: new Date().toISOString()
        };

        // Enriquecer el objeto litúrgico completo para garantizar consistencia sistémica
        const payload = normalizarObjetoLiturgico(payloadBase, idCodigo);

        // 1. Guardado local inmediato en LocalStorage bajo ID y todos sus equivalentes
        try {
            payload.origenCarga = 'firebase';
            guardarHoraEnLocalStorage(idCodigo, payload);
            if (tiempoVal === 'santos') {
                localStorage.setItem(`lh_salterio_${idCodigo}`, JSON.stringify(payload));
                localStorage.setItem(`lh_salterio_${idCodigo.toLowerCase()}`, JSON.stringify(payload));
                const idCelebracion = selDia ? selDia.value : '';
                if (idCelebracion && idCelebracion !== idCodigo) {
                    try {
                        let consolidado = {};
                        try {
                            consolidado = JSON.parse(localStorage.getItem(`lh_salterio_${idCelebracion}`)) || {};
                        } catch (_) {}
                        if (!consolidado.horas) consolidado.horas = {};
                        consolidado.horas[libroVal] = payload;
                        consolidado = { ...consolidado, ...payload };
                        localStorage.setItem(`lh_salterio_${idCelebracion}`, JSON.stringify(consolidado));
                    } catch (_) {}
                }
            }
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
                const idCelebracion = selDia ? selDia.value : '';
                if (tiempoVal === 'santos' && idCelebracion && idCelebracion !== idCodigo) {
                    const docBaseRef = doc(window.firebaseAPI.db, "salterios", idCelebracion);
                    await setDoc(docBaseRef, {
                        ...payload,
                        horas: {
                            [libroVal]: payload
                        }
                    }, { merge: true });
                }
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
            if (typeof window.hasPermission === 'function' && !window.hasPermission('frm_salterios_copiar')) {
                alert('No tienes permiso para copiar el código.');
                return;
            }

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
                if (txtAntifonaOficio) txtAntifonaOficio.textContent = textoOpt;
            }
            actualizarInvitatorioPreview(false);
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

    // Eventos interactivos en el selector de Preces
    if (selPreces) {
        selPreces.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    // Eventos interactivos en el selector de Oración
    if (selOracion) {
        selOracion.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    // Eventos interactivos en los selectores de Oficio de Lectura
    if (selResponsorioOficio) {
        selResponsorioOficio.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    if (selLectura1Oficio) {
        selLectura1Oficio.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    if (selLectura2Oficio) {
        selLectura2Oficio.addEventListener('change', () => {
            actualizarInvitatorioPreview(false);
            actualizarBadgeEstado(false);
        });
    }

    if (selTeDeumOficio) {
        selTeDeumOficio.addEventListener('change', () => {
            actualizarHimnoPostLecturasPreview();
            actualizarBadgeEstado(false);
        });
    }

    if (inputOpcionalOficio) {
        inputOpcionalOficio.addEventListener('input', () => {
            const textoOpc = inputOpcionalOficio.value.trim();
            if (seccionOpcionalOficioPreview) {
                seccionOpcionalOficioPreview.style.display = textoOpc ? 'block' : 'none';
            }
            if (previewTextoOpcionalOficio) {
                previewTextoOpcionalOficio.textContent = textoOpc;
            }
            actualizarBadgeEstado(false);
        });
    }

    // Eventos de cambio en los selectores principales
    selTiempo.addEventListener('change', () => {
        actualizarOpcionesSemanas(false);
        actualizarCodigoCombinado(true);
    });

    selSemana.addEventListener('change', () => {
        if (selTiempo.value === 'santos') {
            poblarSelectorDiasOSantos();
        }
        actualizarCodigoCombinado(true);
    });
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
    cargarYPoblarSelectPreces();
    cargarYPoblarSelectOracion();
    cargarYPoblarSelectResponsorios();
    cargarYPoblarSelectLecturasOficio();
    if (selTeDeumOficio) {
        cargarYPoblarSelectHimnoPostLecturas();
    }
    configurarTodosLosCustomSelects();
    actualizarCodigoCombinado(true);
    sincronizarLecturasDesdeFirestore();
});
