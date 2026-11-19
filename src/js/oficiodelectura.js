/**
 * oficiodelectura.js
 * Generador, Gestor y Reproductor de Lecturas del Oficio de Lectura
 * Liturgia de las Horas - Versión 1.0.12
 * 
 * Gestiona las 3 lecturas oficiales del Oficio:
 * 1. 1ª Lectura Año Impar: lectura1.mp3
 * 2. 1ª Lectura Año Par:   lectura2.mp3 (En Santos: 1ª lectura común para ambos años)
 * 3. 2ª Lectura (Patrística): lecturas.mp3
 * 
 * Soporta Tiempos Litúrgicos y Santos / Fiestas del Año:
 * - Tiempos: ta|tn|to|tc|tp.resucito.do o github.io
 * - Santos: https://santos.resucito.do/[mes]/[carpeta]/ o github.io/santos
 * - Edición de ubicación / rutas de servidor persistente en localStorage
 */

import { SANTOS_CARPETAS_GITHUB } from '../data/santosCarpetas.js';
import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';

export const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
export const DIAS_LABELS = {
    domingo: 'Domingo',
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado'
};

export const MESES_NOMBRES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

export const MESES_LABELS = {
    '01': '01 - Enero',
    '02': '02 - Febrero',
    '03': '03 - Marzo',
    '04': '04 - Abril',
    '05': '05 - Mayo',
    '06': '06 - Junio',
    '07': '07 - Julio',
    '08': '08 - Agosto',
    '09': '09 - Septiembre',
    '10': '10 - Octubre',
    '11': '11 - Noviembre',
    '12': '12 - Diciembre'
};

export const TIEMPOS_CONFIG = {
    adviento: {
        id: 'adviento',
        nombre: 'Adviento',
        slug: 'adviento',
        subdominio: 'ta',
        githubPath: 'tadviento',
        semanas: 4,
        color: '#6b21a8'
    },
    navidad: {
        id: 'navidad',
        nombre: 'Navidad',
        slug: 'navidad',
        subdominio: 'tn',
        githubPath: 'tnavidad',
        semanas: 2,
        color: '#b91c1c',
        diasEspeciales: [
            { id: 'sagradaFamilia', nombre: 'Sagrada Familia (Último domingo de diciembre)', carpeta: 'dias/sagradaFamilia' },
            { id: 'sd26', nombre: 'San Esteban, protomártir (26 de diciembre)', carpeta: 'dias/sd26' },
            { id: 'sd27', nombre: 'San Juan, apóstol y evangelista (27 de diciembre)', carpeta: 'dias/sd27' },
            { id: 'sd28', nombre: 'Los Santos Inocentes, mártires (28 de diciembre)', carpeta: 'dias/sd28' },
            { id: 'sd6reyes', nombre: 'Día de Reyes / La Epifanía (6 de enero)', carpeta: 'dias/sd6reyes' }
        ]
    },
    cuaresma: {
        id: 'cuaresma',
        nombre: 'Cuaresma',
        slug: 'cuaresma',
        subdominio: 'tc',
        githubPath: 'tcuaresma',
        semanas: 7,
        color: '#3b0764'
    },
    pascua: {
        id: 'pascua',
        nombre: 'Pascua',
        slug: 'pascua',
        subdominio: 'tp',
        githubPath: 'tpascual',
        semanas: 7,
        incluyePentecostesSem8: true,
        color: '#d97706'
    },
    ordinario: {
        id: 'ordinario',
        nombre: 'Ordinario',
        slug: 'ordinario',
        subdominio: 'to',
        githubPath: 'tordinario',
        semanas: 34,
        color: '#008f39'
    },
    santos: {
        id: 'santos',
        nombre: 'Santos',
        slug: 'santos',
        subdominio: 'santos',
        githubPath: 'santos',
        color: '#b45309'
    }
};

/**
 * Resuelve la subcarpeta exacta de un Santo o Celebración dentro de santos.resucito.do
 * mediante día, mes y similitud de tokens con el catálogo de 93 carpetas oficiales.
 */
export function resolverSubRutaSanto(nombreSanto = '', fechaStr = '', codigoStr = '') {
    let diaNum = null, mesNum = null;

    if (fechaStr && typeof fechaStr === 'string') {
        const m1 = fechaStr.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
        if (m1) {
            diaNum = parseInt(m1[1], 10);
            mesNum = parseInt(m1[2], 10);
        } else {
            const m2 = fechaStr.match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)/i);
            if (m2) {
                diaNum = parseInt(m2[1], 10);
                const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
                const idx = meses.findIndex(mes => m2[2].toLowerCase().startsWith(mes));
                if (idx >= 0) mesNum = idx + 1;
            }
        }
    }

    if ((!diaNum || !mesNum) && codigoStr && typeof codigoStr === 'string') {
        const mCod = codigoStr.match(/^sa(\d{2})(\d{2})/i);
        if (mCod) {
            diaNum = parseInt(mCod[1], 10);
            mesNum = parseInt(mCod[2], 10);
        }
    }

    if ((!diaNum || !mesNum) && nombreSanto && typeof nombreSanto === 'string') {
        const mNom = nombreSanto.match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)/i);
        if (mNom) {
            diaNum = parseInt(mNom[1], 10);
            const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
            const idx = meses.findIndex(mes => mNom[2].toLowerCase().startsWith(mes));
            if (idx >= 0) mesNum = idx + 1;
        }
    }

    if (!diaNum || !mesNum) return null;

    if (typeof SANTOS_CARPETAS_GITHUB !== 'undefined' && Array.isArray(SANTOS_CARPETAS_GITHUB)) {
        const matches = SANTOS_CARPETAS_GITHUB.filter(f => f.dia === diaNum && f.mesNum === mesNum);
        if (matches.length === 1) return matches[0].subRuta;
        if (matches.length > 1) {
            const clean = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ');
            const stopwords = new Set(['santa', 'santo', 'san', 'virgen', 'esposo', 'madre', 'padre', 'del', 'de', 'la', 'los', 'las', 'el', 'en', 'y', 'oficio', 'laudes', 'memoria', 'fiesta', 'solemnidad']);
            const tokens = clean(nombreSanto || codigoStr).split(/\s+/).filter(w => w.length > 2 && !stopwords.has(w));

            let best = matches[0], maxScore = -1;
            matches.forEach(f => {
                const fTokens = clean(f.folder).split(/\s+/).filter(w => w.length > 2 && !stopwords.has(w));
                let score = 0;
                tokens.forEach(t => {
                    if (fTokens.some(ft => ft.includes(t) || t.includes(ft))) score += 2;
                });
                if (score > maxScore) {
                    maxScore = score;
                    best = f;
                }
            });
            return best.subRuta;
        }
    }

    // Ruta canónica estándar si aún no tiene carpeta física
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const mesNombre = (mesNum >= 1 && mesNum <= 12) ? meses[mesNum - 1] : 'enero';
    const slugMayus = (nombreSanto || 'SANTO').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `${mesNombre}/${String(diaNum).padStart(2, '0')}-${slugMayus}`;
}

/**
 * Construye las 3 rutas del Oficio de Lectura para un día específico o Santo
 */
export function construirRutaOficioLectura(opciones = {}) {
    const {
        tiempo = 'ordinario',
        semana = 1,
        dia = null,
        diaSemana = null,
        diaEspecial = null,
        subRutaPersonalizada = null,
        santo = null,
        fecha = null,
        clave = null,
        usarMirror = false,
        servidor = null
    } = opciones;

    const tSlug = (tiempo || 'ordinario').toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let cfg = TIEMPOS_CONFIG.ordinario;
    let esSanto = false;

    if (tSlug === 'ta' || tSlug.includes('adviento')) {
        cfg = TIEMPOS_CONFIG.adviento;
    } else if (tSlug === 'tn' || tSlug.includes('navidad')) {
        cfg = TIEMPOS_CONFIG.navidad;
    } else if (tSlug === 'tc' || tSlug.includes('cuaresma')) {
        cfg = TIEMPOS_CONFIG.cuaresma;
    } else if (tSlug === 'tp' || tSlug.includes('pascua')) {
        cfg = TIEMPOS_CONFIG.pascua;
    } else if (tSlug === 'san' || tSlug.includes('santo') || tSlug.includes('fiesta') || tSlug.includes('solemnidad')) {
        cfg = TIEMPOS_CONFIG.santos;
        esSanto = true;
    } else if (tSlug === 'to' || tSlug.includes('ordinario')) {
        cfg = TIEMPOS_CONFIG.ordinario;
    }

    const esMirror = Boolean(usarMirror || servidor === 'github' || (typeof window !== 'undefined' && window.OFICIO_SERVER === 'github'));
    let host = esMirror 
        ? `http://dbaezh78.github.io/${cfg.githubPath}`
        : `https://${cfg.subdominio}.resucito.do`;

    // Permite anulación global del host en localStorage
    if (typeof localStorage !== 'undefined') {
        const hostCustomGlobal = localStorage.getItem('lh_oficio_servidor_host_' + cfg.slug);
        if (hostCustomGlobal && hostCustomGlobal.trim()) {
            host = hostCustomGlobal.trim().replace(/\/+$/, '');
        }
    }

    let subRuta = '';
    if (subRutaPersonalizada) {
        subRuta = subRutaPersonalizada;
    } else if (esSanto) {
        if (diaEspecial) {
            subRuta = diaEspecial;
        } else if (dia && typeof dia === 'string' && dia.includes('/')) {
            subRuta = dia;
        } else {
            // Autodetectar carpeta oficial del santo por nombre, fecha o código canónico
            const detectada = resolverSubRutaSanto(santo || dia, fecha || dia, dia);
            if (detectada) {
                subRuta = detectada;
            } else if (dia && typeof dia === 'string' && dia.startsWith('sa')) {
                subRuta = `dias/${dia}`;
            } else {
                subRuta = dia || 'enero/01-SANTAMARÍAMADREDEDIOS';
            }
        }
    } else if (diaEspecial) {
        subRuta = diaEspecial.startsWith('dias/') ? diaEspecial : `dias/${diaEspecial}`;
    } else {
        const numSem = String(semana).replace(/\D/g, '') || '1';
        const semCod = `s${numSem.padStart(2, '0')}`;
        
        let diaVal = dia !== null ? dia : (diaSemana !== null ? diaSemana : 'domingo');
        if (typeof diaVal === 'number') {
            const diasArr = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            diaVal = diasArr[diaVal] || 'domingo';
        }
        const diaNorm = String(diaVal).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        subRuta = `${semCod}/${diaNorm}`;
    }

    // Normalizar subRuta y codificar adecuadamente para URLs (espacios y tildes)
    subRuta = String(subRuta).replace(/^\/+|\/+$/g, '');
    let basePath = `${host}/${encodeURI(subRuta)}/`.replace(/([^:]\/)\/+/g, "$1");

    // Verificar si hay una ruta personalizada en localStorage para esta celebración
    let esPersonalizada = false;
    const cKey = clave || (esSanto ? `santos_${subRuta}` : `${cfg.slug}_${semana}_${dia}`);
    if (typeof localStorage !== 'undefined') {
        try {
            const rutasGuardadas = JSON.parse(localStorage.getItem('lh_oficio_rutas_personalizadas') || '{}');
            if (rutasGuardadas[cKey]) {
                basePath = rutasGuardadas[cKey];
                if (!basePath.endsWith('/')) basePath += '/';
                esPersonalizada = true;
            }
        } catch (_) {}
    }

    return {
        host,
        subRuta,
        basePath,
        clave: cKey,
        esPersonalizada,
        // En los santos no hay par e impar: la 1ª lectura se presenta en ambos años
        lecturaImpar: `${basePath}lectura1.mp3`,
        lecturaPar: esSanto ? `${basePath}lectura1.mp3` : `${basePath}lectura2.mp3`,
        segundaLectura: `${basePath}lecturas.mp3`
    };
}

if (typeof window !== 'undefined') {
    window.construirRutaOficioLectura = construirRutaOficioLectura;
}

/**
 * Obtiene la lista completa de celebraciones de Santos y Fiestas
 * combinando las carpetas existentes en santos.resucito.do y el calendario anual
 */
export function obtenerListaCompletaSantos() {
    const santosResultado = [];
    const setRutas = new Set();

    function normalizarClave(texto) {
        return (texto || '')
            .replace(/^\d+[-_]/, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
    }

    function extraerTipoLimpio(texto) {
        if (!texto || typeof texto !== 'string') return 'Memoria';
        const t = texto.toLowerCase();
        if (t.includes('solemnidad')) return 'Solemnidad';
        if (t.includes('fiesta')) return 'Fiesta';
        return 'Memoria';
    }

    // Comprueba si ya existe una celebración para este día con nombre o carpeta similar
    function buscarSantoExistente(diaNum, mesNum, nombreCandidato, folderCandidato) {
        const normCand = normalizarClave(nombreCandidato);
        const normFold = normalizarClave(folderCandidato);
        return santosResultado.find(s => {
            if (s.mesNum !== mesNum || s.dia !== diaNum) return false;
            const normS = normalizarClave(s.nombre);
            const normF = normalizarClave(s.folder);
            if (normCand && (normS === normCand || normF === normCand)) return true;
            if (normFold && (normS === normFold || normF === normFold)) return true;
            if (normCand && normCand.length > 5 && normS.length > 5 && (normS.includes(normCand) || normCand.includes(normS))) return true;
            if (normCand && normCand.length > 5 && normF.length > 5 && (normF.includes(normCand) || normCand.includes(normF))) return true;
            if (normFold && normFold.length > 5 && normS.length > 5 && (normS.includes(normFold) || normFold.includes(normS))) return true;
            if (normFold && normFold.length > 5 && normF.length > 5 && (normF.includes(normFold) || normFold.includes(normF))) return true;
            return false;
        });
    }

    // 1. Añadir las carpetas oficiales existentes en C:\db\Github\santos
    if (Array.isArray(SANTOS_CARPETAS_GITHUB)) {
        SANTOS_CARPETAS_GITHUB.forEach(f => {
            if (!f.subRuta || setRutas.has(f.subRuta.toLowerCase())) return;

            // Evitar carpetas duplicadas para la misma celebración en el mismo día (ej. 01-SANTAMARÍAMADREDEDIOS vs 01-SANTA_MARÍA_MADRE_DE_DIOS)
            const existente = buscarSantoExistente(f.dia, f.mesNum, f.nombre, f.folder);
            if (existente) {
                setRutas.add(f.subRuta.toLowerCase());
                return;
            }

            let nombreFormateado = f.nombre;
            let tipo = extraerTipoLimpio(f.tipo);

            // Buscar en catalogoSantosAnual por coincidencia de día/mes o nombre
            if (Array.isArray(catalogoSantosAnual)) {
                const matchCat = catalogoSantosAnual.find(c => {
                    const partes = (c.fechaFestividad || '').match(/(\d+)\/(\d+)/);
                    if (!partes) return false;
                    const d = parseInt(partes[1], 10);
                    const m = parseInt(partes[2], 10);
                    if (d !== f.dia || m !== f.mesNum) return false;
                    const normC = normalizarClave(c.nombre);
                    const normF = normalizarClave(f.folder);
                    return normC === normF || (normC.length > 5 && (normF.includes(normC) || normC.includes(normF)));
                });
                if (matchCat && matchCat.nombre) {
                    nombreFormateado = matchCat.nombre;
                    if (matchCat.realidad) {
                        tipo = extraerTipoLimpio(matchCat.realidad);
                    }
                }
            }

            setRutas.add(f.subRuta.toLowerCase());
            santosResultado.push({
                mes: f.mes,
                mesNum: f.mesNum,
                dia: f.dia,
                folder: f.folder,
                subRuta: f.subRuta,
                nombre: nombreFormateado,
                tipo: tipo,
                slug: f.folder.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
            });
        });
    }

    // 2. Incorporar cualquier otro santo del catálogo anual que no tenga carpeta todavía
    if (Array.isArray(catalogoSantosAnual)) {
        catalogoSantosAnual.forEach(c => {
            const partes = (c.fechaFestividad || '').match(/(\d+)\/(\d+)/);
            if (!partes) return;
            const diaNum = parseInt(partes[1], 10);
            const mesNum = parseInt(partes[2], 10);
            if (mesNum < 1 || mesNum > 12) return;

            const mesNombre = MESES_NOMBRES[mesNum - 1];
            const slugLimpio = (c.nombre || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            const subRutaCandidata = `${mesNombre}/${String(diaNum).padStart(2, '0')}-${slugLimpio}`;

            // Si ya existe una celebración para este santo en este día, actualizar nombre si el actual es carpeta/mayúsculas
            const existente = buscarSantoExistente(diaNum, mesNum, c.nombre, slugLimpio);
            if (existente) {
                if (c.nombre && c.nombre.length > 3) {
                    existente.nombre = c.nombre;
                }
                if (c.realidad && existente.tipo === 'Memoria') {
                    existente.tipo = extraerTipoLimpio(c.realidad);
                }
                return;
            }

            if (!setRutas.has(subRutaCandidata.toLowerCase())) {
                setRutas.add(subRutaCandidata.toLowerCase());
                const tipo = extraerTipoLimpio(c.realidad);
                santosResultado.push({
                    mes: mesNombre,
                    mesNum: mesNum,
                    dia: diaNum,
                    folder: `${String(diaNum).padStart(2, '0')}-${slugLimpio}`,
                    subRuta: subRutaCandidata,
                    nombre: c.nombre,
                    tipo: tipo,
                    slug: slugLimpio.toLowerCase()
                });
            }
        });
    }

    // 3. Incorporar santos personalizados de localStorage si los hubiere
    if (typeof localStorage !== 'undefined') {
        try {
            const rawCustom = localStorage.getItem('lh_catalogo_nombres_santos');
            if (rawCustom) {
                const customs = JSON.parse(rawCustom);
                if (Array.isArray(customs)) {
                    customs.forEach(c => {
                        const partes = (c.fechaFestividad || c.fecha || '').match(/(\d+)\/(\d+)/);
                        if (!partes) return;
                        const diaNum = parseInt(partes[1], 10);
                        const mesNum = parseInt(partes[2], 10);
                        if (mesNum < 1 || mesNum > 12) return;
                        const mesNombre = MESES_NOMBRES[mesNum - 1];
                        const slugLimpio = (c.nombre || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                        const subRutaCandidata = `${mesNombre}/${String(diaNum).padStart(2, '0')}-${slugLimpio}`;

                        // Si ya existe la celebración, actualizar con el nombre canónico y evitar fila duplicada
                        const existente = buscarSantoExistente(diaNum, mesNum, c.nombre, slugLimpio);
                        if (existente) {
                            if (c.nombre && c.nombre.length > 3) {
                                existente.nombre = c.nombre;
                            }
                            return;
                        }

                        if (!setRutas.has(subRutaCandidata.toLowerCase())) {
                            setRutas.add(subRutaCandidata.toLowerCase());
                            const tipo = extraerTipoLimpio(c.realidad);
                            santosResultado.push({
                                mes: mesNombre,
                                mesNum: mesNum,
                                dia: diaNum,
                                folder: `${String(diaNum).padStart(2, '0')}-${slugLimpio}`,
                                subRuta: subRutaCandidata,
                                nombre: c.nombre,
                                tipo: tipo,
                                slug: slugLimpio.toLowerCase()
                            });
                        }
                    });
                }
            }
        } catch (_) {}
    }

    // Ordenar cronológicamente por mes (1 a 12) y día (1 a 31)
    santosResultado.sort((a, b) => {
        if (a.mesNum !== b.mesNum) return a.mesNum - b.mesNum;
        return a.dia - b.dia;
    });

    return santosResultado;
}

/**
 * Genera el catálogo completo de todos los días y semanas del Oficio de Lectura
 * incluyendo Tiempos Litúrgicos y Santos / Fiestas
 */
export function generarCatalogoCompletoOficio(usarMirror = false) {
    const registros = [];

    // 1. ADVIENTO
    for (let s = 1; s <= TIEMPOS_CONFIG.adviento.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const clave = `adviento_s${String(s).padStart(2, '0')}_${d}`;
            const rutas = construirRutaOficioLectura({ tiempo: 'adviento', semana: s, dia: d, clave, usarMirror });
            registros.push({
                tiempo: 'Adviento',
                tiempoSlug: 'adviento',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                semanaLabel: `Semana ${s} (s${String(s).padStart(2, '0')})`,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                fechaTexto: DIAS_LABELS[d],
                celebracion: `Semana ${s} de Adviento - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                clave,
                ...rutas
            });
        });
    }

    // 2. NAVIDAD (Semanas 1 y 2 + Días especiales)
    for (let s = 1; s <= TIEMPOS_CONFIG.navidad.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const clave = `navidad_s${String(s).padStart(2, '0')}_${d}`;
            const rutas = construirRutaOficioLectura({ tiempo: 'navidad', semana: s, dia: d, clave, usarMirror });
            registros.push({
                tiempo: 'Navidad',
                tiempoSlug: 'navidad',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                semanaLabel: `Semana ${s} (s${String(s).padStart(2, '0')})`,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                fechaTexto: DIAS_LABELS[d],
                celebracion: `Semana ${s} de Navidad - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                clave,
                ...rutas
            });
        });
    }

    TIEMPOS_CONFIG.navidad.diasEspeciales.forEach(esp => {
        const clave = `navidad_especial_${esp.id}`;
        const rutas = construirRutaOficioLectura({ tiempo: 'navidad', diaEspecial: esp.carpeta, clave, usarMirror });
        registros.push({
            tiempo: 'Navidad',
            tiempoSlug: 'navidad',
            semana: 'Especial',
            semanaNum: 0,
            semanaLabel: 'Días Especiales',
            dia: esp.id,
            diaNombre: esp.nombre,
            fechaTexto: 'Especial',
            celebracion: esp.nombre,
            esEspecial: true,
            diaEspecialCod: esp.id,
            clave,
            ...rutas
        });
    });

    // 3. CUARESMA
    for (let s = 1; s <= TIEMPOS_CONFIG.cuaresma.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const clave = `cuaresma_s${String(s).padStart(2, '0')}_${d}`;
            const rutas = construirRutaOficioLectura({ tiempo: 'cuaresma', semana: s, dia: d, clave, usarMirror });
            registros.push({
                tiempo: 'Cuaresma',
                tiempoSlug: 'cuaresma',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                semanaLabel: `Semana ${s} (s${String(s).padStart(2, '0')})`,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                fechaTexto: DIAS_LABELS[d],
                celebracion: s === 7 ? `Semana Santa / Triduo Pascual - ${DIAS_LABELS[d]}` : `Semana ${s} de Cuaresma - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                clave,
                ...rutas
            });
        });
    }

    // 4. PASCUA (Semanas 1 a 7 + Pentecostés)
    for (let s = 1; s <= TIEMPOS_CONFIG.pascua.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const clave = `pascua_s${String(s).padStart(2, '0')}_${d}`;
            const rutas = construirRutaOficioLectura({ tiempo: 'pascua', semana: s, dia: d, clave, usarMirror });
            registros.push({
                tiempo: 'Pascua',
                tiempoSlug: 'pascua',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                semanaLabel: `Semana ${s} (s${String(s).padStart(2, '0')})`,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                fechaTexto: DIAS_LABELS[d],
                celebracion: `Semana ${s} de Pascua - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                clave,
                ...rutas
            });
        });
    }

    // Pentecostés (Domingo Semana 8)
    const clavePent = 'pascua_s08_domingo';
    const rutasPent = construirRutaOficioLectura({ tiempo: 'pascua', semana: 8, dia: 'domingo', clave: clavePent, usarMirror });
    registros.push({
        tiempo: 'Pascua',
        tiempoSlug: 'pascua',
        semana: 's08',
        semanaNum: 8,
        semanaLabel: 'Semana 8 (Pentecostés)',
        dia: 'domingo',
        diaNombre: 'Domingo',
        fechaTexto: 'Pentecostés',
        celebracion: 'Solemnidad de Pentecostés (Semana 8)',
        esEspecial: true,
        clave: clavePent,
        ...rutasPent
    });

    // 5. TIEMPO ORDINARIO (34 Semanas)
    for (let s = 1; s <= TIEMPOS_CONFIG.ordinario.semanas; s++) {
        DIAS_SEMANA.forEach(d => {
            const clave = `ordinario_s${String(s).padStart(2, '0')}_${d}`;
            const rutas = construirRutaOficioLectura({ tiempo: 'ordinario', semana: s, dia: d, clave, usarMirror });
            registros.push({
                tiempo: 'Ordinario',
                tiempoSlug: 'ordinario',
                semana: `s${String(s).padStart(2, '0')}`,
                semanaNum: s,
                semanaLabel: `Semana ${s} (s${String(s).padStart(2, '0')})`,
                dia: d,
                diaNombre: DIAS_LABELS[d],
                fechaTexto: DIAS_LABELS[d],
                celebracion: `Semana ${s} del Tiempo Ordinario - ${DIAS_LABELS[d]}`,
                esEspecial: false,
                clave,
                ...rutas
            });
        });
    }

    // 6. SANTOS Y FIESTAS
    const listaSantosGenerada = obtenerListaCompletaSantos();
    listaSantosGenerada.forEach(santo => {
        const clave = `santos_${santo.subRuta}`;
        const rutas = construirRutaOficioLectura({
            tiempo: 'santos',
            subRutaPersonalizada: santo.subRuta,
            clave,
            usarMirror
        });

        registros.push({
            tiempo: 'Santos',
            tiempoSlug: 'santos',
            tipoCeleb: santo.tipo || 'Memoria',
            mesNum: santo.mesNum,
            mesNombre: MESES_NOMBRES[santo.mesNum - 1],
            semana: String(santo.mesNum).padStart(2, '0'),
            semanaNum: santo.mesNum,
            semanaLabel: `Mes ${String(santo.mesNum).padStart(2, '0')} (${MESES_NOMBRES[santo.mesNum - 1]})`,
            dia: santo.folder || santo.slug || `sa${String(santo.dia).padStart(2, '0')}${String(santo.mesNum).padStart(2, '0')}`,
            diaNombre: `${santo.dia} de ${MESES_NOMBRES[santo.mesNum - 1]}`,
            fechaTexto: `${String(santo.dia).padStart(2, '0')}/${String(santo.mesNum).padStart(2, '0')}`,
            celebracion: santo.nombre,
            folder: santo.folder,
            esEspecial: true,
            esSanto: true,
            clave,
            ...rutas
        });
    });

    return registros;
}

if (typeof window !== 'undefined') {
    window.generarCatalogoCompletoOficio = generarCatalogoCompletoOficio;
}

// =========================================================================
// CONTROLADOR DE LA INTERFAZ DE USUARIO (oficiodelectura.html)
// =========================================================================

class OficioLecturaUI {
    constructor() {
        this.usarMirror = localStorage.getItem('lh_oficio_servidor') === 'mirror';
        this.audioElement = new Audio();
        this.currentAudioUrl = null;
        this.currentYear = new Date().getFullYear();
        this.esPar = (this.currentYear % 2 === 0);

        this.catalogo = [];
        this.registrosFiltrados = [];
        this.registroEnEdicion = null;

        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.cargarDatos();
        this.bindEvents();
        this.renderizarTabla();
    }

    cacheDOMElements() {
        this.selectTiempo = document.getElementById('filtro-tiempo');
        this.selectSemana = document.getElementById('filtro-semana');
        this.labelFiltroSemana = document.getElementById('label-filtro-semana');
        this.inputBuscador = document.getElementById('buscador');
        this.tbody = document.getElementById('cuerpo-tabla');
        this.switchServidor = document.getElementById('switch-servidor');
        this.lblServidor = document.getElementById('label-servidor-activo');
        this.btnConfigServidor = document.getElementById('btn-config-servidor');
        this.badgeAñoParidad = document.getElementById('badge-año-paridad');

        // Reproductor Flotante
        this.reproductorBarra = document.getElementById('reproductor-barra-oficio');
        this.audioTitulo = document.getElementById('reproductor-audio-titulo');
        this.audioPlayBtn = document.getElementById('btn-reproductor-play');
        this.audioProgress = document.getElementById('reproductor-slider');
        this.audioTime = document.getElementById('reproductor-tiempo');

        // Modal Editar Ruta
        this.modalEditarRuta = document.getElementById('modal-editar-ruta');
        this.modalRutaTitulo = document.getElementById('modal-ruta-titulo');
        this.modalRutaCelebNombre = document.getElementById('modal-ruta-celeb-nombre');
        this.modalRutaCelebDetalle = document.getElementById('modal-ruta-celeb-detalle');
        this.inputModalBasepath = document.getElementById('input-modal-basepath');
        this.contenedorBotonesPreset = document.getElementById('contenedor-botones-preset');
        this.previewUrlImpar = document.getElementById('preview-url-impar');
        this.previewUrlPar = document.getElementById('preview-url-par');
        this.previewUrlSegunda = document.getElementById('preview-url-segunda');
        this.btnProbarAudioModal = document.getElementById('btn-probar-audio-modal');
        this.resultadoPruebaAudio = document.getElementById('resultado-prueba-audio');
        this.btnCerrarModalRuta = document.getElementById('btn-cerrar-modal-ruta');
        this.btnCancelarModalRuta = document.getElementById('btn-cancelar-modal-ruta');
        this.btnGuardarModalRuta = document.getElementById('btn-guardar-modal-ruta');
        this.btnResetRutaModal = document.getElementById('btn-reset-ruta-modal');

        // Modal Configuración de Servidor
        this.modalConfigServidor = document.getElementById('modal-config-servidor-box');
        this.btnCerrarConfigServidor = document.getElementById('btn-cerrar-config-servidor');
        this.btnCancelarConfigServidor = document.getElementById('btn-cancelar-config-servidor');
        this.btnGuardarConfigServidor = document.getElementById('btn-guardar-config-servidor');
        this.btnLimpiarTodasRutas = document.getElementById('btn-limpiar-todas-rutas');
        this.inputCfgDominioSantos = document.getElementById('cfg-dominio-santos');
        this.listaRutasPersonalizadas = document.getElementById('lista-rutas-personalizadas');

        // Toast
        this.toastEl = document.getElementById('toast-notificacion-oficio');
    }

    cargarDatos() {
        this.catalogo = generarCatalogoCompletoOficio(this.usarMirror);
        this.filtrarRegistros();
        if (this.badgeAñoParidad) {
            this.badgeAñoParidad.textContent = `Año ${this.currentYear} (${this.esPar ? 'PAR' : 'IMPAR'})`;
        }
        if (this.switchServidor) {
            this.switchServidor.checked = this.usarMirror;
            this.actualizarLabelServidor();
        }
    }

    actualizarLabelServidor() {
        if (!this.lblServidor) return;
        if (this.usarMirror) {
            this.lblServidor.textContent = 'Servidor: GitHub Mirror (github.io)';
            this.lblServidor.style.color = '#0284c7';
        } else {
            this.lblServidor.textContent = 'Servidor: Principal (resucito.do)';
            this.lblServidor.style.color = '#16a34a';
        }
    }

    bindEvents() {
        if (this.selectTiempo) {
            this.selectTiempo.addEventListener('change', () => {
                this.poblarSemanasPorTiempo();
                this.filtrarRegistros();
                this.renderizarTabla();
            });
        }

        if (this.selectSemana) {
            this.selectSemana.addEventListener('change', () => {
                this.filtrarRegistros();
                this.renderizarTabla();
            });
        }

        if (this.inputBuscador) {
            this.inputBuscador.addEventListener('input', () => {
                this.filtrarRegistros();
                this.renderizarTabla();
            });
        }

        if (this.switchServidor) {
            this.switchServidor.addEventListener('change', (e) => {
                this.usarMirror = e.target.checked;
                localStorage.setItem('lh_oficio_servidor', this.usarMirror ? 'mirror' : 'resucito');
                this.actualizarLabelServidor();
                this.catalogo = generarCatalogoCompletoOficio(this.usarMirror);
                this.filtrarRegistros();
                this.renderizarTabla();
            });
        }

        if (this.btnConfigServidor) {
            this.btnConfigServidor.addEventListener('click', () => {
                this.abrirModalConfigServidor();
            });
        }

        // Eventos del modal de editar ruta
        if (this.btnCerrarModalRuta) this.btnCerrarModalRuta.addEventListener('click', () => this.cerrarModalEditarRuta());
        if (this.btnCancelarModalRuta) this.btnCancelarModalRuta.addEventListener('click', () => this.cerrarModalEditarRuta());
        if (this.btnGuardarModalRuta) this.btnGuardarModalRuta.addEventListener('click', () => this.guardarRutaEditada());
        if (this.btnResetRutaModal) this.btnResetRutaModal.addEventListener('click', () => this.restaurarRutaDefault());
        if (this.inputModalBasepath) {
            this.inputModalBasepath.addEventListener('input', () => this.actualizarPreviewsEnVivo());
        }
        if (this.btnProbarAudioModal) {
            this.btnProbarAudioModal.addEventListener('click', () => this.probarAudioModal());
        }

        // Eventos del modal de configuración de servidor
        if (this.btnCerrarConfigServidor) this.btnCerrarConfigServidor.addEventListener('click', () => this.cerrarModalConfigServidor());
        if (this.btnCancelarConfigServidor) this.btnCancelarConfigServidor.addEventListener('click', () => this.cerrarModalConfigServidor());
        if (this.btnGuardarConfigServidor) this.btnGuardarConfigServidor.addEventListener('click', () => this.guardarConfigServidor());
        if (this.btnLimpiarTodasRutas) this.btnLimpiarTodasRutas.addEventListener('click', () => this.limpiarTodasLasRutasEditadas());

        // Eventos del reproductor
        if (this.audioElement) {
            this.audioElement.addEventListener('timeupdate', () => {
                if (this.audioProgress && this.audioElement.duration) {
                    const pct = (this.audioElement.currentTime / this.audioElement.duration) * 100;
                    this.audioProgress.value = pct;
                }
                if (this.audioTime) {
                    this.audioTime.textContent = `${this.formatearSegundos(this.audioElement.currentTime)} / ${this.formatearSegundos(this.audioElement.duration || 0)}`;
                }
            });

            this.audioElement.addEventListener('ended', () => {
                if (this.audioPlayBtn) {
                    this.audioPlayBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
                }
            });

            this.audioElement.addEventListener('play', () => {
                if (this.audioPlayBtn) {
                    this.audioPlayBtn.innerHTML = '<span class="material-symbols-outlined">pause</span>';
                }
            });

            this.audioElement.addEventListener('pause', () => {
                if (this.audioPlayBtn) {
                    this.audioPlayBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
                }
            });
        }

        if (this.audioPlayBtn) {
            this.audioPlayBtn.addEventListener('click', () => {
                if (!this.currentAudioUrl) return;
                if (this.audioElement.paused) {
                    this.audioElement.play();
                } else {
                    this.audioElement.pause();
                }
            });
        }

        if (this.audioProgress) {
            this.audioProgress.addEventListener('input', (e) => {
                if (this.audioElement.duration) {
                    this.audioElement.currentTime = (e.target.value / 100) * this.audioElement.duration;
                }
            });
        }
    }

    poblarSemanasPorTiempo() {
        if (!this.selectSemana) return;
        const tiempoVal = this.selectTiempo ? this.selectTiempo.value : '';
        this.selectSemana.innerHTML = '';

        if (tiempoVal === 'Santos') {
            if (this.labelFiltroSemana) this.labelFiltroSemana.textContent = 'Mes / Filtro:';
            this.selectSemana.innerHTML = '<option value="">Todos los Meses / Categorías</option>';

            const optGroupCat = document.createElement('optgroup');
            optGroupCat.label = '— Categorías —';
            optGroupCat.innerHTML = `
                <option value="cat:solemnidad">★ Solemnidades</option>
                <option value="cat:fiesta">❖ Fiestas</option>
                <option value="cat:memoria">✦ Memorias / Santos</option>
            `;
            this.selectSemana.appendChild(optGroupCat);

            const optGroupMeses = document.createElement('optgroup');
            optGroupMeses.label = '— Meses del Año —';
            for (let i = 1; i <= 12; i++) {
                const cod = String(i).padStart(2, '0');
                const opt = document.createElement('option');
                opt.value = `mes:${cod}`;
                opt.textContent = MESES_LABELS[cod] || `Mes ${i}`;
                optGroupMeses.appendChild(opt);
            }
            this.selectSemana.appendChild(optGroupMeses);
            return;
        }

        if (this.labelFiltroSemana) this.labelFiltroSemana.textContent = 'Semana:';
        this.selectSemana.innerHTML = '<option value="">Todas las Semanas</option>';

        let maxSemanas = 34;
        if (tiempoVal === 'Adviento') maxSemanas = 4;
        else if (tiempoVal === 'Navidad') maxSemanas = 2;
        else if (tiempoVal === 'Cuaresma') maxSemanas = 7;
        else if (tiempoVal === 'Pascua') maxSemanas = 8;
        else if (tiempoVal === 'Tiempo Ordinario' || tiempoVal === 'Ordinario') maxSemanas = 34;

        for (let i = 1; i <= maxSemanas; i++) {
            const cod = `s${String(i).padStart(2, '0')}`;
            const opt = document.createElement('option');
            opt.value = cod;
            opt.textContent = `Semana ${i} (${cod})`;
            this.selectSemana.appendChild(opt);
        }
    }

    filtrarRegistros() {
        const tiempoFiltro = (this.selectTiempo?.value || '').toLowerCase().trim();
        const semanaFiltro = (this.selectSemana?.value || '').toLowerCase().trim();
        const query = (this.inputBuscador?.value || '').toLowerCase().trim();

        this.registrosFiltrados = this.catalogo.filter(reg => {
            // Filtro de tiempo
            if (tiempoFiltro) {
                if (tiempoFiltro === 'santos') {
                    if (reg.tiempoSlug !== 'santos') return false;
                } else if (tiempoFiltro.includes('ordinario')) {
                    if (reg.tiempoSlug !== 'ordinario') return false;
                } else if (!reg.tiempo.toLowerCase().includes(tiempoFiltro)) {
                    return false;
                }
            }

            // Filtro de semana / mes / categoría
            if (semanaFiltro) {
                if (semanaFiltro.startsWith('cat:')) {
                    const catTarget = semanaFiltro.replace('cat:', '');
                    if (!reg.tipoCeleb || !reg.tipoCeleb.toLowerCase().includes(catTarget)) return false;
                } else if (semanaFiltro.startsWith('mes:')) {
                    const mesTarget = semanaFiltro.replace('mes:', '');
                    if (reg.semana !== mesTarget) return false;
                } else {
                    if (reg.semana.toLowerCase() !== semanaFiltro) return false;
                }
            }

            // Búsqueda por texto
            if (query) {
                const matchTexto = (reg.celebracion && reg.celebracion.toLowerCase().includes(query)) ||
                                   (reg.diaNombre && reg.diaNombre.toLowerCase().includes(query)) ||
                                   (reg.semana && reg.semana.toLowerCase().includes(query)) ||
                                   (reg.fechaTexto && reg.fechaTexto.toLowerCase().includes(query)) ||
                                   (reg.subRuta && reg.subRuta.toLowerCase().includes(query)) ||
                                   (reg.tiempo && reg.tiempo.toLowerCase().includes(query));
                if (!matchTexto) return false;
            }
            return true;
        });
    }

    reproducirAudio(url, titulo) {
        if (!url) return;
        this.currentAudioUrl = url;
        this.audioElement.src = url;
        this.audioElement.play().catch(e => {
            console.warn("Error reproduciendo audio:", e);
            this.mostrarToast(`No se pudo reproducir: ${url}`);
        });

        if (this.reproductorBarra) {
            this.reproductorBarra.style.display = 'flex';
        }
        if (this.audioTitulo) {
            this.audioTitulo.textContent = titulo;
            this.audioTitulo.title = url;
        }
    }

    renderizarTabla() {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        if (this.registrosFiltrados.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 36px; color: #64748b;">
                        No se encontraron lecturas que coincidan con los filtros aplicados.
                    </td>
                </tr>
            `;
            return;
        }

        const frag = document.createDocumentFragment();

        this.registrosFiltrados.forEach(reg => {
            const tr = document.createElement('tr');

            // Determinar color de badge por tiempo
            let badgeClass = 'badge-ordinario';
            if (reg.tiempoSlug === 'adviento') badgeClass = 'badge-adviento';
            else if (reg.tiempoSlug === 'navidad') badgeClass = 'badge-navidad';
            else if (reg.tiempoSlug === 'cuaresma') badgeClass = 'badge-cuaresma';
            else if (reg.tiempoSlug === 'pascua') badgeClass = 'badge-pascua';
            else if (reg.tiempoSlug === 'santos') badgeClass = 'badge-santos';

            // URL para rezar en Salterios
            let urlSalterio = `salterios.html?tiempo=${reg.tiempoSlug}&semana=${reg.semanaNum || 1}&dia=${reg.dia}&libro=oficio`;
            if (reg.esSanto) {
                const sParam = encodeURIComponent(reg.celebracion);
                const fParam = encodeURIComponent(reg.fechaTexto);
                const idSanto = (reg.dia || '').replace(/[^a-zA-Z0-9]/g, '');
                urlSalterio = `salterios.html?tiempo=santos&libro=oficio&id=${idSanto}of&santo=${sParam}&fecha=${fParam}`;
            }

            // Columna de Semana / Mes
            const colSemana = reg.esSanto
                ? `<strong>${reg.mesNombre ? reg.mesNombre.slice(0, 3).toUpperCase() : reg.semana}</strong>`
                : `<strong>${reg.semana.toUpperCase()}</strong>`;

            // Columna de Día / Fecha
            const colDia = reg.esSanto ? reg.fechaTexto : reg.diaNombre;

            tr.innerHTML = `
                <td>
                    <span class="badge-tiempo-oficio ${badgeClass}">${reg.tiempo}</span>
                </td>
                <td>${colSemana}</td>
                <td>${colDia}</td>
                <td>
                    <div class="celeb-nombre-texto" title="${reg.celebracion}">
                        <span>${reg.celebracion}</span>
                    </div>
                    <div class="ruta-contenedor">
                        <span class="ruta-base-sub" title="${reg.basePath}">${reg.basePath}</span>
                        <button type="button" class="btn-editar-ruta" title="Editar ubicación en servidor para esta celebración" data-clave="${reg.clave}">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        ${reg.esPersonalizada ? `
                            <button type="button" class="btn-reset-ruta" title="Restaurar ruta original del servidor" data-clave="${reg.clave}">
                                <span class="material-symbols-outlined">restart_alt</span>
                            </button>
                            <span class="badge-personalizada">Editada</span>
                        ` : ''}
                    </div>
                </td>
                <td>
                    <div class="audio-celda-box">
                        <button type="button" class="btn-play-celda btn-impar" title="Oír 1ª Lectura (Año Impar)" data-url="${reg.lecturaImpar}" data-titulo="${reg.celebracion} • 1ª Lectura (Año Impar)">
                            <span class="material-symbols-outlined">play_arrow</span>
                            Año Impar
                        </button>
                        <a href="${reg.lecturaImpar}" target="_blank" class="enlace-descarga" title="Abrir MP3">
                            <span class="material-symbols-outlined">open_in_new</span>
                        </a>
                    </div>
                </td>
                <td>
                    <div class="audio-celda-box">
                        <button type="button" class="btn-play-celda btn-par" title="Oír 1ª Lectura (Año Par)" data-url="${reg.lecturaPar}" data-titulo="${reg.celebracion} • 1ª Lectura (Año Par)">
                            <span class="material-symbols-outlined">play_arrow</span>
                            Año Par
                        </button>
                        <a href="${reg.lecturaPar}" target="_blank" class="enlace-descarga" title="Abrir MP3">
                            <span class="material-symbols-outlined">open_in_new</span>
                        </a>
                    </div>
                </td>
                <td>
                    <div class="audio-celda-box">
                        <button type="button" class="btn-play-celda btn-segunda" title="Oír 2ª Lectura (Patrística)" data-url="${reg.segundaLectura}" data-titulo="${reg.celebracion} • 2ª Lectura Patrística">
                            <span class="material-symbols-outlined">play_arrow</span>
                            2ª Lectura
                        </button>
                        <a href="${reg.segundaLectura}" target="_blank" class="enlace-descarga" title="Abrir MP3">
                            <span class="material-symbols-outlined">open_in_new</span>
                        </a>
                    </div>
                </td>
                <td style="text-align: center;">
                    <a href="${urlSalterio}" class="btn-abrir-oficio" title="Abrir Oficio de Lectura completo">
                        <span class="material-symbols-outlined">menu_book</span>
                    </a>
                </td>
            `;

            // Botones de reproducción
            tr.querySelectorAll('.btn-play-celda').forEach(btn => {
                btn.addEventListener('click', () => {
                    const u = btn.getAttribute('data-url');
                    const t = btn.getAttribute('data-titulo');
                    this.reproducirAudio(u, t);
                });
            });

            // Botón editar ruta individual
            const btnEditar = tr.querySelector('.btn-editar-ruta');
            if (btnEditar) {
                btnEditar.addEventListener('click', () => {
                    this.abrirModalEditarRuta(reg);
                });
            }

            // Botón reset ruta individual
            const btnReset = tr.querySelector('.btn-reset-ruta');
            if (btnReset) {
                btnReset.addEventListener('click', () => {
                    this.restaurarRutaDefault(reg.clave, reg.celebracion);
                });
            }

            frag.appendChild(tr);
        });

        this.tbody.appendChild(frag);
    }

    // =========================================================================
    // MODAL EDITAR RUTA INDIVIDUAL
    // =========================================================================

    abrirModalEditarRuta(reg) {
        if (!reg || !this.modalEditarRuta) return;
        this.registroEnEdicion = reg;

        if (this.modalRutaCelebNombre) this.modalRutaCelebNombre.textContent = reg.celebracion;
        if (this.modalRutaCelebDetalle) {
            this.modalRutaCelebDetalle.textContent = `${reg.tiempo} • ${reg.diaNombre || reg.fechaTexto} • Subruta: ${reg.subRuta}`;
        }
        if (this.inputModalBasepath) {
            this.inputModalBasepath.value = reg.basePath;
        }
        if (this.resultadoPruebaAudio) {
            this.resultadoPruebaAudio.textContent = '';
        }

        // Mostrar / ocultar botón reset en modal
        if (this.btnResetRutaModal) {
            this.btnResetRutaModal.style.display = reg.esPersonalizada ? 'inline-flex' : 'none';
        }

        // Generar atajos / presets rápidos
        if (this.contenedorBotonesPreset) {
            this.contenedorBotonesPreset.innerHTML = '';
            const presets = [];

            if (reg.esSanto) {
                presets.push({
                    label: 'santos.resucito.do',
                    url: `https://santos.resucito.do/${encodeURI(reg.subRuta)}/`
                });
                presets.push({
                    label: 'GitHub Mirror',
                    url: `http://dbaezh78.github.io/santos/${encodeURI(reg.subRuta)}/`
                });
                presets.push({
                    label: 'Localhost (4000)',
                    url: `http://localhost:4000/santos/${encodeURI(reg.subRuta)}/`
                });
                if (reg.folder) {
                    presets.push({
                        label: 'Carpeta Directa',
                        url: `https://santos.resucito.do/${encodeURI(reg.folder)}/`
                    });
                }
            } else {
                presets.push({
                    label: 'Oficial (resucito.do)',
                    url: `https://${reg.tiempoSlug === 'ordinario' ? 'to' : reg.tiempoSlug}.resucito.do/${reg.subRuta}/`
                });
                presets.push({
                    label: 'GitHub Mirror',
                    url: `http://dbaezh78.github.io/t${reg.tiempoSlug}/${reg.subRuta}/`
                });
                presets.push({
                    label: 'Localhost (4000)',
                    url: `http://localhost:4000/${reg.subRuta}/`
                });
            }

            presets.forEach(p => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-preset-ruta';
                btn.textContent = p.label;
                btn.title = p.url;
                btn.addEventListener('click', () => {
                    if (this.inputModalBasepath) {
                        this.inputModalBasepath.value = p.url;
                        this.actualizarPreviewsEnVivo();
                    }
                });
                this.contenedorBotonesPreset.appendChild(btn);
            });
        }

        this.actualizarPreviewsEnVivo();
        this.modalEditarRuta.style.display = 'flex';
    }

    actualizarPreviewsEnVivo() {
        if (!this.inputModalBasepath) return;
        let base = this.inputModalBasepath.value.trim();
        if (base && !base.endsWith('/')) base += '/';

        const esSanto = this.registroEnEdicion?.esSanto || false;
        const uImpar = `${base}lectura1.mp3`;
        const uPar = esSanto ? `${base}lectura1.mp3` : `${base}lectura2.mp3`;
        const uSegunda = `${base}lecturas.mp3`;

        if (this.previewUrlImpar) this.previewUrlImpar.textContent = uImpar;
        if (this.previewUrlPar) this.previewUrlPar.textContent = uPar;
        if (this.previewUrlSegunda) this.previewUrlSegunda.textContent = uSegunda;
    }

    probarAudioModal() {
        if (!this.previewUrlImpar || !this.resultadoPruebaAudio) return;
        const urlAProbar = this.previewUrlImpar.textContent;
        this.resultadoPruebaAudio.textContent = 'Verificando audio...';
        this.resultadoPruebaAudio.style.color = '#0284c7';

        const testAudio = new Audio(urlAProbar);
        testAudio.play().then(() => {
            this.resultadoPruebaAudio.textContent = '✓ Audio accesible y reproduciendo';
            this.resultadoPruebaAudio.style.color = '#16a34a';
            setTimeout(() => {
                testAudio.pause();
            }, 5000);
        }).catch(err => {
            this.resultadoPruebaAudio.textContent = `✗ No se pudo cargar: ${err.message || 'error 404 o CORS'}`;
            this.resultadoPruebaAudio.style.color = '#dc2626';
        });
    }

    guardarRutaEditada() {
        if (!this.registroEnEdicion || !this.inputModalBasepath) return;
        let nuevaRuta = this.inputModalBasepath.value.trim();
        if (!nuevaRuta) {
            alert('Por favor ingresa una ruta válida.');
            return;
        }
        if (!nuevaRuta.endsWith('/')) nuevaRuta += '/';

        try {
            const rutasGuardadas = JSON.parse(localStorage.getItem('lh_oficio_rutas_personalizadas') || '{}');
            rutasGuardadas[this.registroEnEdicion.clave] = nuevaRuta;
            localStorage.setItem('lh_oficio_rutas_personalizadas', JSON.stringify(rutasGuardadas));

            this.mostrarToast(`Ubicación actualizada para "${this.registroEnEdicion.celebracion}"`);
            this.cerrarModalEditarRuta();

            // Recargar catálogo y tabla
            this.catalogo = generarCatalogoCompletoOficio(this.usarMirror);
            this.filtrarRegistros();
            this.renderizarTabla();
        } catch (e) {
            console.error('Error guardando ruta personalizada:', e);
            alert('Error al guardar la ruta personalizada.');
        }
    }

    restaurarRutaDefault(claveOpt = null, celebNombre = '') {
        const cKey = claveOpt || (this.registroEnEdicion ? this.registroEnEdicion.clave : null);
        if (!cKey) return;

        try {
            const rutasGuardadas = JSON.parse(localStorage.getItem('lh_oficio_rutas_personalizadas') || '{}');
            if (rutasGuardadas[cKey]) {
                delete rutasGuardadas[cKey];
                localStorage.setItem('lh_oficio_rutas_personalizadas', JSON.stringify(rutasGuardadas));
            }

            const nombre = celebNombre || (this.registroEnEdicion ? this.registroEnEdicion.celebracion : 'la celebración');
            this.mostrarToast(`Ruta restaurada por defecto para "${nombre}"`);
            this.cerrarModalEditarRuta();

            // Recargar catálogo y tabla
            this.catalogo = generarCatalogoCompletoOficio(this.usarMirror);
            this.filtrarRegistros();
            this.renderizarTabla();
        } catch (e) {
            console.error('Error restaurando ruta default:', e);
        }
    }

    cerrarModalEditarRuta() {
        if (this.modalEditarRuta) {
            this.modalEditarRuta.style.display = 'none';
        }
        this.registroEnEdicion = null;
    }

    // =========================================================================
    // MODAL CONFIGURACIÓN GENERAL DE SERVIDORES
    // =========================================================================

    abrirModalConfigServidor() {
        if (!this.modalConfigServidor) return;

        const hostActualSantos = localStorage.getItem('lh_oficio_servidor_host_santos') || 'https://santos.resucito.do';
        if (this.inputCfgDominioSantos) {
            this.inputCfgDominioSantos.value = hostActualSantos;
        }

        this.renderizarListaRutasPersonalizadas();
        this.modalConfigServidor.style.display = 'flex';
    }

    renderizarListaRutasPersonalizadas() {
        if (!this.listaRutasPersonalizadas) return;
        this.listaRutasPersonalizadas.innerHTML = '';

        let rutas = {};
        try {
            rutas = JSON.parse(localStorage.getItem('lh_oficio_rutas_personalizadas') || '{}');
        } catch (_) {}

        const entries = Object.entries(rutas);
        if (entries.length === 0) {
            this.listaRutasPersonalizadas.innerHTML = `
                <div style="color: #64748b; font-size: 0.85rem; padding: 12px; text-align: center;">
                    No hay rutas personalizadas guardadas. Todas las lecturas usan las rutas estándar del servidor.
                </div>
            `;
            if (this.btnLimpiarTodasRutas) this.btnLimpiarTodasRutas.style.display = 'none';
            return;
        }

        if (this.btnLimpiarTodasRutas) this.btnLimpiarTodasRutas.style.display = 'inline-flex';

        entries.forEach(([clave, ruta]) => {
            const item = document.createElement('div');
            item.className = 'item-ruta-guardada';
            item.innerHTML = `
                <div style="overflow: hidden; text-overflow: ellipsis; padding-right: 8px;">
                    <div style="font-weight: 600; color: #1e293b;">${clave}</div>
                    <code style="font-size: 0.75rem; color: #0369a1;">${ruta}</code>
                </div>
                <button type="button" class="btn-reset-ruta" title="Eliminar personalización" data-key="${clave}">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            `;

            item.querySelector('.btn-reset-ruta').addEventListener('click', () => {
                delete rutas[clave];
                localStorage.setItem('lh_oficio_rutas_personalizadas', JSON.stringify(rutas));
                this.renderizarListaRutasPersonalizadas();
                this.catalogo = generarCatalogoCompletoOficio(this.usarMirror);
                this.filtrarRegistros();
                this.renderizarTabla();
                this.mostrarToast(`Personalización eliminada para "${clave}"`);
            });

            this.listaRutasPersonalizadas.appendChild(item);
        });
    }

    guardarConfigServidor() {
        if (this.inputCfgDominioSantos) {
            const nuevoHostSantos = this.inputCfgDominioSantos.value.trim().replace(/\/+$/, '');
            if (nuevoHostSantos) {
                localStorage.setItem('lh_oficio_servidor_host_santos', nuevoHostSantos);
            } else {
                localStorage.removeItem('lh_oficio_servidor_host_santos');
            }
        }

        this.mostrarToast('Configuración de servidor guardada');
        this.cerrarModalConfigServidor();

        this.catalogo = generarCatalogoCompletoOficio(this.usarMirror);
        this.filtrarRegistros();
        this.renderizarTabla();
    }

    limpiarTodasLasRutasEditadas() {
        if (!confirm('¿Deseas restaurar todas las rutas personalizadas a sus valores predeterminados?')) return;
        localStorage.removeItem('lh_oficio_rutas_personalizadas');
        this.renderizarListaRutasPersonalizadas();
        this.catalogo = generarCatalogoCompletoOficio(this.usarMirror);
        this.filtrarRegistros();
        this.renderizarTabla();
        this.mostrarToast('Todas las rutas han sido restauradas');
    }

    cerrarModalConfigServidor() {
        if (this.modalConfigServidor) {
            this.modalConfigServidor.style.display = 'none';
        }
    }

    // =========================================================================
    // UTILIDADES
    // =========================================================================

    mostrarToast(mensaje) {
        if (!this.toastEl) return;
        this.toastEl.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 20px; color: #4ade80;">check_circle</span>
            <span>${mensaje}</span>
        `;
        this.toastEl.style.display = 'flex';
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            if (this.toastEl) this.toastEl.style.display = 'none';
        }, 3800);
    }

    formatearSegundos(s) {
        if (isNaN(s) || s < 0) return '0:00';
        const mins = Math.floor(s / 60);
        const segs = Math.floor(s % 60);
        return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
    }
}

// Inicialización automática en navegador
if (typeof window !== 'undefined') {
    window.resolverSubRutaSanto = resolverSubRutaSanto;
    window.construirRutaOficioLectura = construirRutaOficioLectura;
    window.generarCatalogoCompletoOficio = generarCatalogoCompletoOficio;
    window.obtenerListaCompletaSantos = obtenerListaCompletaSantos;

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('tabla-oficio-lectura')) {
            window.oficioLecturaUI = new OficioLecturaUI();
        }
    });
}
