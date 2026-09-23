/**
 * descarga_liturgia_de_las_horas.js
 * Módulo de sincronización, normalización y lectura local de la Liturgia de las Horas.
 * Ubicación: src/firebase/descarga_liturgia_de_las_horas.js
 * 
 * ARQUITECTURA "LOCAL FIRST" INTEGRADA AL SISTEMA:
 * 1. LOCAL STORAGE: Consulta inmediata en memoria local (0 ms de latencia, 100% offline).
 * 2. COMPATIBILIDAD DE IDS: Soporta equivalencias entre formato nuevo (tos24sala) y antiguo (tos24lasa).
 * 3. NORMALIZADOR DUAL: Compatibiliza el esquema nuevo (titulo, salmodia, himno, oracion) y el
 *    esquema histórico (tt, Salmodias, cEvan_Conclusion, Padren) para que funcione en cualquier visor.
 * 4. ENRIQUECIMIENTO CANÓNICO: Si un documento en Firebase o LocalStorage solo tiene metadatos
 *    (ej. guardado desde frm_salterios), se fusiona con los textos canónicos para evitar "UNDEFINED undefined".
 * 5. FIREBASE FALLBACK: Si no existe en local, se consulta Firestore y se cachea localmente.
 */

import { db } from '../js/firebase-config.js';
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { CATALOGO_PRECES_SEED, PrecesDB } from '../data/db-preces.js';

export const COLECCION_SALTERIOS = "salterios";
export const PREFIJO_LOCAL = "lh_salterio_";

export const TEXTO_SALMO_62_CANONICO = `¡Oh Dios!, tú eres mi Dios, por ti madrugo,
mi alma está sedienta de ti;
mi carne tiene ansia de ti,
como tierra reseca, agostada, sin agua.

¡Cómo te contemplaba en el santuario
viendo tu fuerza y tu gloria!
Tu gracia vale más que la vida,
te alabarán mis labios.

Toda mi vida te bendeciré
y alzaré las manos invocándote.
Me saciaré de manjares exquisitos,
y mis labios te alabarán jubilosos.

En el lecho me acuerdo de ti
y velando medito en ti,
porque fuiste mi auxilio,
y a la sombra de tus alas canto con júbilo;
mi alma está unida a ti,
y tu diestra me sostiene.

Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`;

export const TEXTO_CANTICO_DANIEL_CANONICO = `Creaturas todas del Señor, bendecid al Señor,
ensalzadlo con himnos por los siglos.

Ángeles del Señor, bendecid al Señor;
cielos, bendecid al Señor.

Aguas del espacio, bendecid al Señor;
ejércitos del Señor, bendecid al Señor.

Sol y luna, bendecid al Señor;
astros del cielo, bendecid al Señor.

Lluvia y rocío, bendecid al Señor;
vientos todos, bendecid al Señor.

Fuego y calor, bendecid al Señor;
fríos y heladas, bendecid al Señor.

Rocíos y nevadas, bendecid al Señor;
témpanos y hielos, bendecid al Señor.

Escarchas y nieves, bendecid al Señor;
noche y día, bendecid al Señor.

Luz y tinieblas, bendecid al Señor;
rayos y nubes, bendecid al Señor.

Bendiga la tierra al Señor,
ensálcelo con himnos por los siglos.

Montes y cumbres, bendecid al Señor;
cuanto germina en la tierra, bendiga al Señor.

Manantiales, bendecid al Señor;
mares y ríos, bendecid al Señor.

Cetáceos y peces, bendecid al Señor;
aves del cielo, bendecid al Señor.

Fieras y ganados, bendecid al Señor,
ensalzadlo con himnos por los siglos.

Hijos de los hombres, bendecid al Señor;
bendiga Israel al Señor.

Sacerdotes del Señor, bendecid al Señor;
siervos del Señor, bendecid al Señor.

Almas y espíritus justos, bendecid al Señor;
santos y humildes de corazón, bendecid al Señor.

Ananías, Azarías y Misael, bendecid al Señor,
ensalzadlo con himnos por los siglos.

Bendigamos al Padre, al Hijo y al Espíritu Santo,
ensalcémoslo con himnos por los siglos.

Bendito el Señor en la bóveda del cielo,
alabado y glorioso y ensalzado por los siglos.

No se dice Gloria al Padre.`;

export const TEXTO_SALMO_149_CANONICO = `Cantad al Señor un cántico nuevo,
resuene su alabanza en la asamblea de los fieles;
que se alegre Israel por su Creador,
los hijos de Sión por su Rey.

Alabad su nombre con danzas,
cantadle con tambores y cítaras;
porque el Señor ama a su pueblo
y adorna con la victoria a los humildes.

Que los fieles festejen su gloria
y canten jubilosos en filas:
con vítores a Dios en la boca
y espadas de dos filos en las manos:

para tomar venganza de los pueblos
y aplicar el castigo a las naciones,
sujetando a los reyes con argollas,
a los nobles con esposas de hierro.

Ejecutar la sentencia dictada
es un honor para todos sus fieles.

Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`;


// =========================================================================
// DECODIFICADOR Y MAPEO DE EQUIVALENCIAS DE CÓDIGOS LITÚRGICOS
// =========================================================================

const MAPA_TIEMPOS = { to: 'ordinario', ta: 'adviento', tn: 'navidad', tc: 'cuaresma', tp: 'pascua', san: 'santos' };
const MAPA_DIAS = { do: 'domingo', lu: 'lunes', ma: 'martes', mi: 'miercoles', ju: 'jueves', vi: 'viernes', sa: 'sabado' };
const MAPA_HORAS = { of: 'oficio', la: 'laudes', te: 'tercia', se: 'sexta', no: 'nona', vi: 'visperas', co: 'completas' };

const REVERSO_TIEMPOS = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp', santos: 'san' };
const REVERSO_DIAS = { domingo: 'do', lunes: 'lu', martes: 'ma', miercoles: 'mi', jueves: 'ju', viernes: 'vi', sabado: 'sa' };
const REVERSO_HORAS = { oficio: 'of', laudes: 'la', tercia: 'te', sexta: 'se', nona: 'no', visperas: 'vi', completas: 'co' };

/**
 * Decodifica un código en sus partes litúrgicas componentes.
 * Soporta formatos:
 * - Nuevo estándar: tos24sala (to + s24 + sa + la)
 * - Histórico dbLaudes: tos24lasa (to + s24 + la + sa) o tps1LAjs
 * - Verboso: ordinario_semana_24_sabado_laudes
 */
export function decodificarCodigoLiturgico(codigo) {
    if (!codigo || typeof codigo !== 'string') return null;
    const clean = codigo.trim().toLowerCase();

    // 1. Formato nuevo: tos24sala o tas1dola
    const mNuevo = clean.match(/^(to|ta|tn|tc|tp|san)(s\d+)(do|lu|ma|mi|ju|vi|sa)(of|la|te|se|no|vi|co)?$/);
    if (mNuevo) {
        return {
            tiempo: MAPA_TIEMPOS[mNuevo[1]] || 'ordinario',
            semana: parseInt(mNuevo[2].replace('s', ''), 10) || 1,
            dia: MAPA_DIAS[mNuevo[3]] || 'sabado',
            libro: mNuevo[4] ? (MAPA_HORAS[mNuevo[4]] || 'laudes') : 'laudes',
            codigoCompleto: clean,
            formato: 'nuevo'
        };
    }

    // 2. Formato antiguo: tos24lasa (hora antes del día)
    const mAntiguo = clean.match(/^(to|ta|tn|tc|tp|san)(s\d+)(of|la|te|se|no|vi|co)(do|lu|ma|mi|ju|vi|sa)$/);
    if (mAntiguo) {
        return {
            tiempo: MAPA_TIEMPOS[mAntiguo[1]] || 'ordinario',
            semana: parseInt(mAntiguo[2].replace('s', ''), 10) || 1,
            dia: MAPA_DIAS[mAntiguo[4]] || 'sabado',
            libro: MAPA_HORAS[mAntiguo[3]] || 'laudes',
            codigoCompleto: clean,
            formato: 'antiguo'
        };
    }

    // 3. Formato Pascua antiguo: tps1LAjs o tps1OFjs
    const mPascua = clean.match(/^tp(s\d+)(la|of|te|se|no|vi|co)(do|lu|ma|mi|ju|vi|sa|sb|vs|js)$/);
    if (mPascua) {
        const diaPascua = mPascua[3] === 'js' ? 'jueves' : (mPascua[3] === 'vs' ? 'viernes' : (mPascua[3] === 'sb' ? 'sabado' : (MAPA_DIAS[mPascua[3]] || 'domingo')));
        return {
            tiempo: 'pascua',
            semana: parseInt(mPascua[1].replace('s', ''), 10) || 1,
            dia: diaPascua,
            libro: MAPA_HORAS[mPascua[2]] || 'laudes',
            codigoCompleto: clean,
            formato: 'pascua_antiguo'
        };
    }

    // 4. Formato verboso con guiones bajos: ordinario_semana_24_sabado_laudes
    const mVerboso = clean.match(/^([a-z]+)_(?:semana_)?(\d+)_([a-z]+)_([a-z]+)$/);
    if (mVerboso) {
        return {
            tiempo: mVerboso[1],
            semana: parseInt(mVerboso[2], 10) || 1,
            dia: mVerboso[3],
            libro: mVerboso[4],
            codigoCompleto: clean,
            formato: 'verboso'
        };
    }

    return null;
}

/**
 * Devuelve una lista de IDs equivalentes para maximizar aciertos de búsqueda en caché local.
 */
export function obtenerIdsEquivalentes(codigo) {
    if (!codigo) return [];
    const clean = codigo.trim().toLowerCase();
    const dec = decodificarCodigoLiturgico(clean);
    const resultado = new Set([clean]);

    if (dec) {
        const codT = REVERSO_TIEMPOS[dec.tiempo] || 'to';
        const codS = `s${dec.semana}`;
        const codSPadded = `s${String(dec.semana).padStart(2, '0')}`;
        const codD = REVERSO_DIAS[dec.dia] || 'sa';
        const codH = REVERSO_HORAS[dec.libro] || 'la';

        // Formato nuevo estándar: ej. tos24sala, tos1doof, tos01doof
        resultado.add(`${codT}${codS}${codD}${codH}`);
        resultado.add(`${codT}${codSPadded}${codD}${codH}`);

        // Formato histórico: ej. tos24lasa, tos1ofdo, tos01ofdo
        resultado.add(`${codT}${codS}${codH}${codD}`);
        resultado.add(`${codT}${codSPadded}${codH}${codD}`);

        // Formato verboso
        resultado.add(`${dec.tiempo}_semana_${dec.semana}_${dec.dia}_${dec.libro}`);
        resultado.add(`${dec.tiempo}_semana_${String(dec.semana).padStart(2, '0')}_${dec.dia}_${dec.libro}`);
        resultado.add(`${dec.tiempo}_s${dec.semana}_${dec.dia}_${dec.libro}`);
        resultado.add(`${dec.tiempo}_s${String(dec.semana).padStart(2, '0')}_${dec.dia}_${dec.libro}`);
    }

    return Array.from(resultado);
}

// =========================================================================
// NORMALIZADOR DUAL LITÚRGICO
// =========================================================================

const CONFIG_LIBROS_DEFECTO = {
    oficio:    { nombre: 'OFICIO DE LECTURA', subtitulo: '(Oración de lectura y vigilia)' },
    laudes:    { nombre: 'LAUDES',            subtitulo: '(Oración de la mañana)' },
    tercia:    { nombre: 'TERCIA',            subtitulo: '(Antes del mediodía)' },
    sexta:     { nombre: 'SEXTA',             subtitulo: '(Al mediodía)' },
    nona:      { nombre: 'NONA',              subtitulo: '(De la tarde)' },
    visperas:  { nombre: 'VÍSPERAS',          subtitulo: '(Oración de la tarde)' },
    completas: { nombre: 'COMPLETAS',         subtitulo: '(Oración antes del descanso nocturno)' }
};

/**
 * Normaliza cualquier objeto litúrgico (nuevo o histórico) para que contenga
 * simultáneamente todas las propiedades requeridas por cualquier visor.
 */
export function normalizarObjetoLiturgico(raw, idCodigo = null, params = {}, fallbackEnsamblador = null) {
    const id = (idCodigo || raw?.id || raw?.codigo || '').toLowerCase();
    const dec = decodificarCodigoLiturgico(id) || params;

    const tiempo = raw?.tiempo || dec?.tiempo || 'ordinario';
    let rawSem = raw?.semana !== undefined ? String(raw.semana).replace('s', '') : null;
    const semana = parseInt(rawSem || dec?.semana || 24, 10);
    const dia = raw?.dia || dec?.dia || 'sabado';
    const libro = (raw?.libro || dec?.libro || 'laudes').toLowerCase();

    const cfgLibro = CONFIG_LIBROS_DEFECTO[libro] || CONFIG_LIBROS_DEFECTO.laudes;

    // Obtener base canónica en caso de que falten textos
    let base = null;
    if (fallbackEnsamblador && typeof fallbackEnsamblador === 'function') {
        base = fallbackEnsamblador(tiempo, semana, dia, libro, raw?.fecha || dec?.fecha, raw?.santo || dec?.santo);
    } else if (typeof window !== 'undefined' && typeof window.ensamblarHoraPorDefecto === 'function') {
        base = window.ensamblarHoraPorDefecto(tiempo, semana, dia, libro, raw?.fecha, raw?.santo);
    } else {
        base = crearEstructuraMinimaCanonica(tiempo, semana, dia, libro);
    }

    const d = raw || {};

    // 1. TÍTULO Y SUBTÍTULO
    const tituloFinal = d.titulo || d.tt || cfgLibro.nombre;
    const subtituloFinal = d.subtitulo || d.sub || cfgLibro.subtitulo;

    // 2. INVITATORIO
    const invRaw = d.invitatorio || {};
    const salmoInvRaw = d.salmoInvitatorio || {};
    const antifonaFinal = invRaw.antifonaTexto || invRaw.antifona || d.antifonaInvitatorio || salmoInvRaw.antifonaInvitatorio || base.invitatorio?.antifona || "Venid, adoremos al Señor, porque él es nuestro Dios.";
    const antifonaIdFinal = invRaw.antifonaId || d.antifonaId || salmoInvRaw.antifonaId || null;
    
    const salmoIdFinal = invRaw.salmoId || d.salmoId || salmoInvRaw.salmoId || (invRaw.salmoTitulo && invRaw.salmoTitulo.includes('94') ? 'salmo94' : null) || 'salmo94';
    const salmoTituloFinal = invRaw.salmoTitulo || salmoInvRaw.titulo || base.invitatorio?.salmoTitulo || "Salmo 94 - INVITACIÓN A LA ALABANZA DIVINA";
    let salmoTextoFinal = invRaw.salmoTexto || salmoInvRaw.contentInv || base.invitatorio?.salmoTexto || "";

    const invitatorioNorm = {
        activo: invRaw.activo !== undefined ? invRaw.activo : (libro === 'laudes' || libro === 'oficio'),
        titulo: invRaw.titulo || base.invitatorio?.titulo || "INVITATORIO",
        instruccion: invRaw.instruccion || base.invitatorio?.instruccion || "(Si esta no es la primera oración del día se omite el Invitatorio)",
        v: invRaw.v || invRaw.v1 || base.invitatorio?.v || "Señor abre mis labios",
        r: invRaw.r || invRaw.r1 || base.invitatorio?.r || "Y mi boca proclamará tu alabanza",
        antifona: antifonaFinal,
        antifonaId: antifonaIdFinal,
        antifonaTexto: antifonaFinal,
        salmoId: salmoIdFinal,
        salmoTitulo: salmoTituloFinal,
        salmoTexto: salmoTextoFinal
    };

    // 3. HIMNO
    const himnoIdFinal = d.himno?.id || invRaw.himnoId || salmoInvRaw.himnoId || null;
    const himnoTexto = d.himno?.texto || (typeof d.himno === 'string' ? d.himno : '') || salmoInvRaw.himno || base.himno?.texto || "";
    const himnoTitulo = d.himno?.titulo || salmoInvRaw.himnot || base.himno?.titulo || "HIMNO";
    const himnoNorm = {
        id: himnoIdFinal,
        titulo: himnoTitulo,
        texto: himnoTexto
    };

    // 4. SALMODIA
    const salmodiasRaw = d.Salmodias || d.salmodia || {};
    let salmo1TextoNorm = salmodiasRaw.salmo1Texto || salmodiasRaw.SalmoUNO || base.salmodia?.salmo1Texto || TEXTO_SALMO_62_CANONICO;
    if (salmo1TextoNorm.length < 150 || salmo1TextoNorm.trim().endsWith('...')) salmo1TextoNorm = TEXTO_SALMO_62_CANONICO;

    let salmo2TextoNorm = salmodiasRaw.salmo2Texto || salmodiasRaw.SalmoDOS || base.salmodia?.salmo2Texto || TEXTO_CANTICO_DANIEL_CANONICO;
    if (salmo2TextoNorm.length < 150 || salmo2TextoNorm.trim().endsWith('...')) salmo2TextoNorm = TEXTO_CANTICO_DANIEL_CANONICO;

    let salmo3TextoNorm = salmodiasRaw.salmo3Texto || salmodiasRaw.SalmoTRES || base.salmodia?.salmo3Texto || TEXTO_SALMO_149_CANONICO;
    if (salmo3TextoNorm.length < 150 || salmo3TextoNorm.trim().endsWith('...')) salmo3TextoNorm = TEXTO_SALMO_149_CANONICO;

    const salmodiaNorm = {
        ant1Id: salmodiasRaw.ant1Id || d.ant1Id || base.salmodia?.ant1Id || null,
        ant1: salmodiasRaw.ant1 || salmodiasRaw.Ant1 || base.salmodia?.ant1 || "Bendito el que viene en nombre del Señor. Aleluya.",
        salmo1Id: salmodiasRaw.salmo1Id || d.salmo1Id || base.salmodia?.salmo1Id || "salmo62_2_9",
        salmo1Titulo: salmodiasRaw.salmo1Titulo || salmodiasRaw.SalmoUNOt || base.salmodia?.salmo1Titulo || "SALMO 62, 2-9 - EL ALMA SEDIENTA DE DIOS",
        salmo1Texto: salmo1TextoNorm,

        ant2Id: salmodiasRaw.ant2Id || d.ant2Id || base.salmodia?.ant2Id || null,
        ant2: salmodiasRaw.ant2 || salmodiasRaw.Ant2 || base.salmodia?.ant2 || "Cantemos un himno al Señor nuestro Dios. Aleluya.",
        salmo2Id: salmodiasRaw.salmo2Id || d.salmo2Id || base.salmodia?.salmo2Id || "dn_3_57_88_56",
        salmo2Titulo: salmodiasRaw.salmo2Titulo || salmodiasRaw.SalmoDOSt || base.salmodia?.salmo2Titulo || "Cántico: TODA LA CREACIÓN ALABE AL SEÑOR - Dn 3, 57-88. 56",
        salmo2Texto: salmo2TextoNorm,

        ant3Id: salmodiasRaw.ant3Id || d.ant3Id || base.salmodia?.ant3Id || null,
        ant3: salmodiasRaw.ant3 || salmodiasRaw.Ant3 || base.salmodia?.ant3 || "Alabad al Señor por su inmensa grandeza. Aleluya.",
        salmo3Id: salmodiasRaw.salmo3Id || d.salmo3Id || base.salmodia?.salmo3Id || "salmo149",
        salmo3Titulo: salmodiasRaw.salmo3Titulo || salmodiasRaw.SalmoTRESt || base.salmodia?.salmo3Titulo || "SALMO 149 - ALEGRÍA DE LOS SANTOS",
        salmo3Texto: salmo3TextoNorm
    };

    // 5. LECTURA BREVE
    const lbRaw = d.LecturaBreve || d.lecturaBreve || {};
    const rbNorm = d.lecturaBreve?.responsorioBreve || {
        v1: lbRaw.responsorio1 || base.lecturaBreve?.responsorioBreve?.v1 || "Cristo murió por nuestros pecados, para llevarnos a Dios.",
        r1: lbRaw.responsorio2 || base.lecturaBreve?.responsorioBreve?.r1 || "Cristo murió por nuestros pecados, para llevarnos a Dios.",
        v2: lbRaw.responsorio3 || base.lecturaBreve?.responsorioBreve?.v2 || "Muerto en la carne, pero vivificado en el espíritu.",
        r2: lbRaw.responsorio4 || base.lecturaBreve?.responsorioBreve?.r2 || "Para llevarnos a Dios.",
        v3: lbRaw.gloria || base.lecturaBreve?.responsorioBreve?.v3 || "Gloria al Padre, y al Hijo, y al Espíritu Santo.",
        r3: lbRaw.responsorio5 || base.lecturaBreve?.responsorioBreve?.r3 || "Cristo murió por nuestros pecados, para llevarnos a Dios."
    };

    const lecturaBreveNorm = {
        cita: lbRaw.cita || lbRaw.LecturaCita || base.lecturaBreve?.cita || "Rm 8, 1-2",
        texto: lbRaw.texto || lbRaw.LecturaTexto || base.lecturaBreve?.texto || "No hay ya condenación alguna para los que están en Cristo Jesús...",
        responsorioBreve: rbNorm
    };

    // 6. CÁNTICO EVANGÉLICO
    const cEvanRaw = d.cEvan_Conclusion || d.canticoEvangelico || {};
    const canticoEvangelicoNorm = {
        tipo: libro === 'visperas' ? 'Magníficat' : (libro === 'completas' ? 'Nunc Dimittis' : 'Benedictus'),
        antifona: cEvanRaw.antifona || cEvanRaw.cEvangelicoAnt || base.canticoEvangelico?.antifona || "Se presentó Jesús en medio de sus discípulos...",
        titulo: cEvanRaw.titulo || cEvanRaw.canticoZacariast || base.canticoEvangelico?.titulo || "Cántico de Zacarías. EL MESÍAS Y SU PRECURSOR",
        texto: cEvanRaw.texto || cEvanRaw.canticoZacarias || base.canticoEvangelico?.texto || "Bendito sea el Señor, Dios de Israel..."
    };

    // 7. PRECES
    const precesRaw = d.preces || {};
    let canonPreces = null;
    if (typeof PrecesDB !== 'undefined' && PrecesDB.obtener) {
        canonPreces = PrecesDB.obtener(precesRaw.id || id || d.codigo, tiempo, semana, dia, libro);
    } else if (typeof CATALOGO_PRECES_SEED !== 'undefined') {
        const idBuscado = (precesRaw.id || id || d.codigo || '').toLowerCase();
        canonPreces = CATALOGO_PRECES_SEED.find(p => p.id.toLowerCase() === idBuscado || idBuscado.includes(p.id.toLowerCase()));
    }

    let introNorm = precesRaw.intro || canonPreces?.intro || (precesRaw.texto ? '' : base.preces?.intro || "Invoquemos a Cristo diciendo:");
    let respNorm = precesRaw.respuesta || canonPreces?.respuesta || (precesRaw.texto ? '' : base.preces?.respuesta || "");
    let intsNorm = Array.isArray(precesRaw.intenciones) && precesRaw.intenciones.length > 0 
        ? precesRaw.intenciones 
        : (canonPreces?.intenciones || (precesRaw.texto ? [] : (base.preces?.intenciones || [])));
    let libreNorm = precesRaw.libre || canonPreces?.libre || base.preces?.libre || "Se pueden añadir algunas intenciones libres";
    let conclNorm = precesRaw.concl || canonPreces?.concl || cEvanRaw.preces2 || base.preces?.concl || "Siguiendo las enseñanzas de Cristo, digamos al Padre celestial:";

    // Detección estricta de preces corruptas (intro aglutinado con intenciones, respuesta fallback ajena o intenciones genéricas de relleno)
    const introEsMuyLargo = Boolean(introNorm && (introNorm.length > 110 || introNorm.includes('Cristo Jesús, que')));
    const respuestaEsFallbackAjeno = Boolean(respNorm === "Confirma, Señor, lo que has realizado en nosotros." && (dia !== 'sabado' || libro !== 'visperas'));
    const intencionesSonFallback = Boolean(Array.isArray(intsNorm) && intsNorm.some(i => String(i).includes('dígnate sostener nuestra fe')));

    if (canonPreces && (introEsMuyLargo || respuestaEsFallbackAjeno || intencionesSonFallback || intsNorm.length <= 1)) {
        introNorm = canonPreces.intro;
        respNorm = canonPreces.respuesta;
        intsNorm = [...canonPreces.intenciones];
        libreNorm = canonPreces.libre || "Se pueden añadir algunas intenciones libres";
        conclNorm = canonPreces.concl || cEvanRaw.preces2 || "Gracias a Jesucristo somos hijos de Dios; por eso nos atrevemos a decir:";
    } else {
        // Si no hay canónico pero introNorm vino como texto agrupado sin desglosar
        const textoOrigen = (cEvanRaw.preces1 && (!intsNorm || intsNorm.length === 0)) ? cEvanRaw.preces1 : (precesRaw.textoCompleto || precesRaw.texto || '');
        if (textoOrigen && (!intsNorm || intsNorm.length === 0)) {
            const bloques = textoOrigen.split(/\r?\n\s*\r?\n/).map(b => b.trim()).filter(Boolean);
            if (bloques.length >= 3) {
                introNorm = bloques[0];
                respNorm = bloques[1];
                intsNorm = bloques.slice(2);
            } else if (bloques.length === 2) {
                introNorm = bloques[0];
                respNorm = bloques[1];
            }
        }
    }

    const textoCompletoNorm = canonPreces?.textoCompleto || precesRaw.textoCompleto || `${introNorm}\n\n${respNorm}\n\n${intsNorm.join('\n\n')}`;

    const precesNorm = {
        id: canonPreces?.id || precesRaw.id || base.preces?.id || null,
        varName: canonPreces?.varName || precesRaw.varName || base.preces?.varName || null,
        titulo: canonPreces?.titulo || precesRaw.titulo || base.preces?.titulo || "PRECES",
        intro: introNorm,
        respuesta: respNorm,
        intenciones: intsNorm,
        libre: libreNorm,
        concl: conclNorm,
        texto: textoCompletoNorm,
        textoCompleto: textoCompletoNorm
    };

    // 8. ORACIÓN Y CONCLUSIÓN
    const oracionRaw = d.oracion || {};
    const oracionTexto = (typeof oracionRaw === 'string' ? oracionRaw : oracionRaw.texto) || cEvanRaw.oracion || base.oracion?.texto || "Dios todopoderoso y eterno, que nos has concedido llegar al inicio de este día, danos tu ayuda para que no caigamos en pecado. Por Jesucristo nuestro Señor. Amén.";
    const oracionNorm = {
        id: (typeof oracionRaw === 'object' ? oracionRaw.id : null) || base.oracion?.id || null,
        varName: (typeof oracionRaw === 'object' ? oracionRaw.varName : null) || base.oracion?.varName || null,
        titulo: (typeof oracionRaw === 'object' ? oracionRaw.titulo : null) || base.oracion?.titulo || "ORACIÓN",
        texto: oracionTexto,
        textoCompleto: (typeof oracionRaw === 'object' ? oracionRaw.textoCompleto : null) || oracionTexto,
        conclusion: (typeof oracionRaw === 'object' ? oracionRaw.conclusion : null) || base.oracion?.conclusion || null
    };

    const conclusionNorm = {
        v: d.conclusion?.v || cEvanRaw.Conclusion1 || base.conclusion?.v || "El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.",
        r: d.conclusion?.r || cEvanRaw.Conclusion2 || base.conclusion?.r || "Amén."
    };

    // Construcción del objeto integrado de doble compatibilidad
    return {
        // Metadatos
        id: id || `${tiempo}_s${semana}_${dia}_${libro}`,
        codigo: id,
        tiempo,
        semana,
        dia,
        libro,
        fecha: raw?.fecha || null,
        santo: raw?.santo || null,
        origenCarga: raw?.origenCarga || 'local',

        // Esquema Moderno (salterios.js)
        titulo: tituloFinal,
        subtitulo: subtituloFinal,
        invitatorio: invitatorioNorm,
        invocacionInicial: base.invocacionInicial || {
            v: 'Dios mío, ven en mi auxilio',
            r: 'Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo...'
        },
        himno: himnoNorm,
        salmodia: salmodiaNorm,
        versiculo: d.versiculo || base.versiculo || { v: 'Hijo mío, haz caso de mi sabiduría.', r: 'Presta oído a mi inteligencia.' },
        lecturasOficio: d.lecturasOficio || base.lecturasOficio || null,
        lecturaBreve: lecturaBreveNorm,
        canticoEvangelico: canticoEvangelicoNorm,
        preces: precesNorm,
        oracion: oracionNorm,
        conclusion: conclusionNorm,

        // Esquema Histórico Legado (dbLaudes, laudes.js, dbOficio, oficio.js)
        tt: tituloFinal,
        sub: subtituloFinal,
        antifonaInvitatorio: invitatorioNorm.antifona,
        salmoInvitatorio: {
            salmoId: invitatorioNorm.salmoId,
            titulo: invitatorioNorm.salmoTitulo,
            subtitulo: "Invitación a la alabanza divina",
            contentInv: invitatorioNorm.salmoTexto,
            antifonaInvitatorio: invitatorioNorm.antifona,
            antifonaId: invitatorioNorm.antifonaId,
            antifonaInvitatorio_Salida: invitatorioNorm.antifona,
            himnoId: himnoNorm.id,
            himnot: himnoNorm.titulo,
            himno: himnoNorm.texto
        },
        Salmodias: {
            ant1Id: salmodiaNorm.ant1Id,
            Ant1: salmodiaNorm.ant1,
            ant1: salmodiaNorm.ant1,
            salmo1Id: salmodiaNorm.salmo1Id,
            SalmoUNOt: salmodiaNorm.salmo1Titulo,
            SalmoUNO: salmodiaNorm.salmo1Texto,
            salmo1Titulo: salmodiaNorm.salmo1Titulo,
            salmo1Texto: salmodiaNorm.salmo1Texto,

            ant2Id: salmodiaNorm.ant2Id,
            Ant2: salmodiaNorm.ant2,
            ant2: salmodiaNorm.ant2,
            salmo2Id: salmodiaNorm.salmo2Id,
            SalmoDOSt: salmodiaNorm.salmo2Titulo,
            SalmoDOS: salmodiaNorm.salmo2Texto,
            salmo2Titulo: salmodiaNorm.salmo2Titulo,
            salmo2Texto: salmodiaNorm.salmo2Texto,

            ant3Id: salmodiaNorm.ant3Id,
            Ant3: salmodiaNorm.ant3,
            ant3: salmodiaNorm.ant3,
            salmo3Id: salmodiaNorm.salmo3Id,
            SalmoTRESt: salmodiaNorm.salmo3Titulo,
            SalmoTRES: salmodiaNorm.salmo3Texto,
            salmo3Titulo: salmodiaNorm.salmo3Titulo,
            salmo3Texto: salmodiaNorm.salmo3Texto
        },
        LecturaBreve: {
            LecturaCita: lecturaBreveNorm.cita,
            LecturaTexto: lecturaBreveNorm.texto,
            responsorio1: rbNorm.v1,
            responsorio2: rbNorm.r1,
            responsorio3: rbNorm.v2,
            responsorio4: rbNorm.r2,
            gloria: rbNorm.v3,
            responsorio5: rbNorm.r3
        },
        cEvan_Conclusion: {
            cEvangelicoAnt: canticoEvangelicoNorm.antifona,
            canticoZacariast: canticoEvangelicoNorm.titulo,
            canticoZacarias: canticoEvangelicoNorm.texto,
            preces1: precesNorm.textoCompleto || precesNorm.texto || precesNorm.intenciones.join('\n\n'),
            preces2: precesNorm.concl || "",
            Padren: "Padre nuestro...",
            oracion: oracionNorm.texto,
            Conclusion1: conclusionNorm.v,
            Conclusion2: conclusionNorm.r
        },
        Responde: d.Responde || {
            Resp_antes_LectV: d.versiculo?.v || base.versiculo?.v || "Hijo mío, haz caso de mi sabiduría.",
            Resp_antes_LectR: d.versiculo?.r || base.versiculo?.r || "Presta oído a mi inteligencia."
        },
        Lecturas: d.Lecturas || (d.lecturasOficio ? {
            Lectura11: d.lecturasOficio.primera?.cita || "",
            Lectura12: d.lecturasOficio.primera?.subtitulo || "",
            Lectura14: d.lecturasOficio.primera?.texto || "",
            Lectura13: d.lecturasOficio.primera?.responsorio?.ref || "",
            Lectura15: d.lecturasOficio.primera?.responsorio?.r1 || "",
            Lectura16: d.lecturasOficio.primera?.responsorio?.v || "",
            Lectura17: d.lecturasOficio.primera?.responsorio?.r2 || "",
            Lectura21: d.lecturasOficio.segunda?.cita || "",
            Lectura22: d.lecturasOficio.segunda?.subtitulo || "",
            Lectura24: d.lecturasOficio.segunda?.texto || "",
            Lectura23: d.lecturasOficio.segunda?.responsorio?.ref || "",
            Lectura25: d.lecturasOficio.segunda?.responsorio?.r1 || "",
            Lectura26: d.lecturasOficio.segunda?.responsorio?.v || "",
            Lectura27: d.lecturasOficio.segunda?.responsorio?.r2 || ""
        } : (base.lecturasOficio ? {
            Lectura11: base.lecturasOficio.primera?.cita || "",
            Lectura12: base.lecturasOficio.primera?.subtitulo || "",
            Lectura14: base.lecturasOficio.primera?.texto || "",
            Lectura13: base.lecturasOficio.primera?.responsorio?.ref || "",
            Lectura15: base.lecturasOficio.primera?.responsorio?.r1 || "",
            Lectura16: base.lecturasOficio.primera?.responsorio?.v || "",
            Lectura17: base.lecturasOficio.primera?.responsorio?.r2 || "",
            Lectura21: base.lecturasOficio.segunda?.cita || "",
            Lectura22: base.lecturasOficio.segunda?.subtitulo || "",
            Lectura24: base.lecturasOficio.segunda?.texto || "",
            Lectura23: base.lecturasOficio.segunda?.responsorio?.ref || "",
            Lectura25: base.lecturasOficio.segunda?.responsorio?.r1 || "",
            Lectura26: base.lecturasOficio.segunda?.responsorio?.v || "",
            Lectura27: base.lecturasOficio.segunda?.responsorio?.r2 || ""
        } : null))
    };
}

/**
 * Crea una plantilla canónica mínima estructurada en memoria
 */
function crearEstructuraMinimaCanonica(tiempo, semana, dia, libro) {
    const cfg = CONFIG_LIBROS_DEFECTO[libro] || CONFIG_LIBROS_DEFECTO.laudes;
    return {
        titulo: cfg.nombre,
        subtitulo: cfg.subtitulo,
        invitatorio: {
            v: 'Señor abre mis labios',
            r: 'Y mi boca proclamará tu alabanza',
            antifona: 'Venid, adoremos al Señor, porque él es nuestro Dios.',
            salmoTitulo: 'Salmo 94 - INVITACIÓN A LA ALABANZA DIVINA',
            salmoTexto: `Venid, aclamemos al Señor,
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
Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`
        },
        himno: {
            titulo: 'HIMNO: ERES LA LUZ Y SIEMBRAS CLARIDADES',
            texto: 'Eres la luz y siembras claridades,\neres amor y siembras armonía\ndesde tu eternidad de eternidades.\n\nAmén.'
        },
        salmodia: {
            ant1Id: 'tos1LAdo1',
            ant1: 'Bendito el que viene en nombre del Señor. Aleluya.',
            salmo1Id: 'salmo62_2_9',
            salmo1Titulo: 'SALMO 62, 2-9 - EL ALMA SEDIENTA DE DIOS',
            salmo1Texto: TEXTO_SALMO_62_CANONICO,
            ant2Id: 'tos1LAdo2',
            ant2: 'Cantemos un himno al Señor nuestro Dios. Aleluya.',
            salmo2Id: 'dn_3_57_88_56',
            salmo2Titulo: 'Cántico: TODA LA CREACIÓN ALABE AL SEÑOR - Dn 3, 57-88. 56',
            salmo2Texto: TEXTO_CANTICO_DANIEL_CANONICO,
            ant3Id: 'tos1LAdo3',
            ant3: 'Alabad al Señor por su inmensa grandeza. Aleluya.',
            salmo3Id: 'salmo149',
            salmo3Titulo: 'SALMO 149 - ALEGRÍA DE LOS SANTOS',
            salmo3Texto: TEXTO_SALMO_149_CANONICO
        },
        lecturaBreve: {
            cita: 'Rm 8, 1-2',
            texto: 'No hay ya condenación alguna para los que están en Cristo Jesús.',
            responsorioBreve: {
                v1: 'Cristo murió por nuestros pecados, para llevarnos a Dios.',
                r1: 'Cristo murió por nuestros pecados, para llevarnos a Dios.',
                v2: 'Muerto en la carne, pero vivificado en el espíritu.',
                r2: 'Para llevarnos a Dios.',
                v3: 'Gloria al Padre, y al Hijo, y al Espíritu Santo.',
                r3: 'Cristo murió por nuestros pecados, para llevarnos a Dios.'
            }
        },
        canticoEvangelico: {
            tipo: 'Benedictus',
            antifona: 'Se presentó Jesús en medio de sus discípulos.',
            titulo: 'Cántico de Zacarías Lc 1, 68-79',
            texto: 'Bendito sea el Señor, Dios de Israel, porque ha visitado y redimido a su pueblo...'
        },
        preces: (() => {
            const canonP = (typeof PrecesDB !== 'undefined' && PrecesDB.obtener)
                ? (PrecesDB.obtener(null, tiempo, semana, dia, libro) || PrecesDB.obtenerRecomendada(tiempo, semana, dia, libro))
                : null;
            if (canonP) {
                return {
                    id: canonP.id || canonP.varName,
                    varName: canonP.varName || canonP.id,
                    titulo: canonP.titulo || 'PRECES',
                    intro: canonP.intro,
                    respuesta: canonP.respuesta,
                    intenciones: Array.isArray(canonP.intenciones) ? [...canonP.intenciones] : [canonP.intenciones],
                    libre: canonP.libre || 'Se pueden añadir algunas intenciones libres',
                    concl: canonP.concl,
                    textoCompleto: canonP.textoCompleto
                };
            }
            return {
                intro: 'Invoquemos a Cristo nuestro Señor:',
                respuesta: 'Señor, ten piedad.',
                intenciones: [
                    'Señor Jesucristo, dígnate sostener nuestra fe en este nuevo día.',
                    'Acompaña con tu bendición nuestras palabras y acciones.'
                ],
                libre: 'Se pueden añadir algunas intenciones libres',
                concl: 'Concluyamos nuestra oración diciendo las palabras de Cristo:'
            };
        })(),
        oracion: {
            texto: 'Dios todopoderoso y eterno, guía nuestras acciones según tu santa voluntad. Por Jesucristo nuestro Señor. Amén.'
        },
        conclusion: {
            v: 'El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.',
            r: 'Amén.'
        }
    };
}

// =========================================================================
// MÉTODOS DE LECTURA Y SINCRONIZACIÓN INTEGRADA
// =========================================================================

/**
 * Consulta de forma SÍNCRONA en memoria local (LocalStorage / Catálogo en memoria)
 * Garantiza respuesta inmediata (0ms) sin pausas de red.
 */
export function obtenerHoraLocalSincrona(idCodigo) {
    if (!idCodigo) return null;
    const equivalentes = obtenerIdsEquivalentes(idCodigo);

    for (const candId of equivalentes) {
        try {
            const raw = localStorage.getItem(`${PREFIJO_LOCAL}${candId}`);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed) {
                    console.log(`📦 [Local Síncrono] Hora litúrgica '${candId}' recuperada de LocalStorage.`);
                    return normalizarObjetoLiturgico(parsed, idCodigo);
                }
            }
        } catch (_) {}
    }

    return null;
}

/**
 * Obtiene una hora litúrgica aplicando la estrategia completa:
 * 1. LOCAL FIRST (Búsqueda en LocalStorage con todos los IDs equivalentes)
 * 2. FIREBASE FIRESTORE (Si no existe en local o requiere sincronización)
 * 3. ENSAMBLADOR CANÓNICO (Garantía contra pantallas rotas o errores de "no existe")
 */
export async function obtenerLiturgiaHora(idCodigo, params = {}, fallbackEnsamblador = null) {
    const idPrincipal = (idCodigo || params.codigoCompleto || `${params.tiempo || 'ordinario'}_s${params.semana || 24}_${params.dia || 'sabado'}_${params.libro || 'laudes'}`).toLowerCase();
    
    // 1. PASO 1: LOCAL FIRST (Retorno inmediato si proviene de Firebase y tiene datos completos)
    const localDirecto = obtenerHoraLocalSincrona(idPrincipal);
    if (localDirecto && localDirecto.origenCarga === 'firebase' && localDirecto.salmodia?.salmo1Texto && localDirecto.himno?.texto) {
        console.log(`⚡ [Local First] Hora '${idPrincipal}' cargada localmente sin esperas.`);
        return localDirecto;
    }

    let datos = localDirecto || null;
    let origen = localDirecto ? (localDirecto.origenCarga || 'local') : 'desconocido';

    // 2. PASO 2: FIREBASE FIRESTORE (si no está verificado de Firebase o le faltaban textos)
    if (!datos || datos.origenCarga !== 'firebase' || !datos.salmodia?.salmo1Texto) {
        const idsABuscar = obtenerIdsEquivalentes(idPrincipal);
        for (const candId of idsABuscar) {
            try {
                console.log(`☁️ [Firebase] Buscando '${candId}' en Firestore...`);
                const docRef = doc(db, COLECCION_SALTERIOS, candId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const fbData = docSnap.data();
                    origen = 'firebase';
                    console.log(`✅ [Firebase] Documento '${candId}' descargado con éxito.`);
                    datos = datos ? { ...datos, ...fbData } : fbData;
                    datos.origenCarga = 'firebase';
                    break;
                }
            } catch (errFb) {
                console.warn(`⚠️ [Firebase] Consulta Firestore para '${candId}':`, errFb.message);
            }
        }
    }

    // 3. PASO 3: NORMALIZACIÓN DUAL Y SALVAGUARDA CANÓNICA
    const resultadoNormalizado = normalizarObjetoLiturgico(datos, idPrincipal, params, fallbackEnsamblador);
    resultadoNormalizado.origenCarga = origen === 'firebase' ? 'firebase' : (datos ? 'local' : 'canonico');

    // 4. PASO 4: ALMACENAR DE INMEDIATO EN LOCAL PARA FUTURAS CONSULTAS (EN TODOS LOS EQUIVALENTES)
    try {
        localStorage.setItem(`${PREFIJO_LOCAL}${idPrincipal}`, JSON.stringify(resultadoNormalizado));
        const equivs = obtenerIdsEquivalentes(idPrincipal);
        equivs.forEach(eq => {
            try {
                localStorage.setItem(`${PREFIJO_LOCAL}${eq}`, JSON.stringify(resultadoNormalizado));
            } catch (_) {}
        });
        
        // Registrar en el catálogo de IDs descargados
        const catalogo = JSON.parse(localStorage.getItem('lh_catalogo_ids_descargados') || '[]');
        if (!catalogo.includes(idPrincipal)) {
            catalogo.push(idPrincipal);
            localStorage.setItem('lh_catalogo_ids_descargados', JSON.stringify(catalogo));
        }
    } catch (eGuardar) {
        console.warn("Aviso guardando en LocalStorage:", eGuardar);
    }

    return resultadoNormalizado;
}

/**
 * Descarga masiva de todas las horas almacenadas en Firebase Firestore
 * y las integra al LocalStorage del sistema.
 */
export async function descargarTodasLasHorasFirebase(onProgress = null) {
    console.log("🚀 Iniciando descarga e integración de todas las horas desde Firebase...");
    try {
        const querySnapshot = await getDocs(collection(db, COLECCION_SALTERIOS));
        const listaDescargada = [];
        let contador = 0;
        const total = querySnapshot.size;

        querySnapshot.forEach((documento) => {
            const rawData = documento.data();
            const id = documento.id.toLowerCase();
            
            // Normalizar antes de guardar para que contenga ambos esquemas
            const normData = normalizarObjetoLiturgico(rawData, id);
            normData.origenCarga = 'firebase';
            listaDescargada.push(normData);

            // Guardar con su ID primario y sus equivalentes en LocalStorage
            try {
                localStorage.setItem(`${PREFIJO_LOCAL}${id}`, JSON.stringify(normData));
                const equivs = obtenerIdsEquivalentes(id);
                equivs.forEach(eq => {
                    if (eq !== id) {
                        localStorage.setItem(`${PREFIJO_LOCAL}${eq}`, JSON.stringify(normData));
                    }
                });
            } catch (e) {
                console.warn(`Límite de LocalStorage al guardar ${id}`);
            }

            contador++;
            if (onProgress && typeof onProgress === 'function') {
                onProgress({ actual: contador, total, id });
            }
        });

        // Guardar catálogo maestro
        const idsGuardados = listaDescargada.map(item => item.id);
        localStorage.setItem('lh_catalogo_ids_descargados', JSON.stringify(idsGuardados));
        localStorage.setItem('lh_ultima_descarga_firebase', new Date().toISOString());

        // Disparar evento para que otros componentes del sistema se enteren
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('lh-liturgia-sincronizada', {
                detail: { total: contador, items: listaDescargada }
            }));
        }

        console.log(`✅ ${contador} horas litúrgicas sincronizadas y listas para uso local.`);
        return { total: contador, items: listaDescargada };
    } catch (e) {
        console.error("❌ Error descargando Liturgia de las Horas de Firebase:", e);
        throw e;
    }
}

/**
 * Precarga en LocalStorage horas litúrgicas canónicas completas
 * para que el sistema funcione 100% offline de inmediato.
 */
export function precargarHorasCanonicasLocal(semanas = [1, 2, 3, 4]) {
    const tiempos = ['ordinario'];
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const horas = ['oficio', 'laudes', 'tercia', 'sexta', 'nona', 'visperas', 'completas'];

    let precargadas = 0;
    tiempos.forEach(t => {
        const codT = REVERSO_TIEMPOS[t] || 'to';
        semanas.forEach(s => {
            const codS = `s${s}`;
            dias.forEach(d => {
                const codD = REVERSO_DIAS[d] || 'do';
                horas.forEach(h => {
                    const codH = REVERSO_HORAS[h] || 'la';
                    const idNuevo = `${codT}${codS}${codD}${codH}`;
                    const idAntiguo = `${codT}${codS}${codH}${codD}`;

                    const obj = normalizarObjetoLiturgico(null, idNuevo, { tiempo: t, semana: s, dia: d, libro: h });
                    try {
                        localStorage.setItem(`${PREFIJO_LOCAL}${idNuevo}`, JSON.stringify(obj));
                        localStorage.setItem(`${PREFIJO_LOCAL}${idAntiguo}`, JSON.stringify(obj));
                        precargadas++;
                    } catch (_) {}
                });
            });
        });
    });

    console.log(`📦 Se precargaron ${precargadas} claves de horas litúrgicas canónicas en LocalStorage.`);
    return precargadas;
}

/**
 * Exporta el catálogo descargado a un archivo JSON
 */
export async function exportarRespaldoJSON() {
    const res = await descargarTodasLasHorasFirebase();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.items, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `liturgia_de_las_horas_firebase_${new Date().toISOString().slice(0,10)}.json`);
    dl.click();
}

// Exposición global en window
if (typeof window !== 'undefined') {
    window.DescargaLiturgiaHoras = {
        obtenerLiturgiaHora,
        obtenerHoraLocalSincrona,
        normalizarObjetoLiturgico,
        descargarTodasLasHorasFirebase,
        precargarHorasCanonicasLocal,
        exportarRespaldoJSON,
        decodificarCodigoLiturgico,
        obtenerIdsEquivalentes
    };
    window.LiturgiaHorasLocal = window.DescargaLiturgiaHoras;
}
