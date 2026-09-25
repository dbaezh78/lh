// =========================================================================
// MOTOR DEL VISOR Y CONSTRUCTOR DE SALTERIOS (salterios.js)
// =========================================================================

import { CintaLiturgica } from './cinta.js';
import { AntifonasDB } from '../data/db-antifonas.js';
import { HimnosDB } from '../data/db-himnos.js';
import { PrecesDB } from '../data/db-preces.js';
import { ResponsoriosDB } from '../data/db-responsorios.js';
import { LecturasDB } from '../data/db-lecturas.js';
import { construirRutaOficioLectura } from './oficiodelectura.js';
import { obtenerLiturgiaHora } from '../firebase/descarga_liturgia_de_las_horas.js';

let horaActualDatos = null;
let cintaInstancia = null;
const currentYear = new Date().getFullYear();

// Configuración de libros e información fija
const LIBROS_CONFIG = {
    oficio: {
        nombre: 'OFICIO DE LECTURA',
        subtitulo: '(Oración de lectura y vigilia)',
        orden: 1,
        icono: 'menu_book'
    },
    laudes: {
        nombre: 'LAUDES',
        subtitulo: '(Oración de la mañana)',
        orden: 2,
        icono: 'wb_sunny'
    },
    tercia: {
        nombre: 'TERCIA',
        subtitulo: '(Antes del mediodía)',
        orden: 3,
        icono: 'alarm'
    },
    sexta: {
        nombre: 'SEXTA',
        subtitulo: '(Al mediodía)',
        orden: 4,
        icono: 'wb_cloudy'
    },
    nona: {
        nombre: 'NONA',
        subtitulo: '(De la tarde)',
        orden: 5,
        icono: 'wb_twilight'
    },
    visperas: {
        nombre: 'VÍSPERAS',
        subtitulo: '(Oración de la tarde)',
        orden: 6,
        icono: 'nightlight'
    },
    completas: {
        nombre: 'COMPLETAS',
        subtitulo: '(Oración antes del descanso nocturno)',
        orden: 7,
        icono: 'bedtime'
    }
};

// =========================================================================
// INICIALIZACIÓN PRINCIPAL
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    aplicarTemaConfigurado();
    const params = obtenerParametrosUrl();
    await cargarYRenderizarHora(params);
    inicializarConstructor();
    inicializarEventosInteractivos();
});

// Decodificador del código litúrgico estándar (ej: tos24sala, tos01dola, tos1LAdo, tos1lami)
export function decodificarCodigoLiturgico(codigo) {
    if (!codigo || typeof codigo !== 'string') return null;
    const clean = codigo.trim().toLowerCase();

    const mapaT = { to: 'ordinario', ta: 'adviento', tn: 'navidad', tc: 'cuaresma', tp: 'pascua', san: 'santos' };
    const mapaD = { do: 'domingo', lu: 'lunes', ma: 'martes', mi: 'miercoles', ju: 'jueves', vi: 'viernes', sa: 'sabado' };
    const mapaL = { of: 'oficio', la: 'laudes', te: 'tercia', se: 'sexta', no: 'nona', vi: 'visperas', co: 'completas' };

    // 1. Formato estándar nuevo: tos24sala, tos01dola, tas1dola
    const mNuevo = clean.match(/^(to|ta|tn|tc|tp|san)(s\d+)(do|lu|ma|mi|ju|vi|sa)(of|la|te|se|no|vi|co)?$/);
    if (mNuevo) {
        return {
            tiempo: mapaT[mNuevo[1]] || 'ordinario',
            semana: parseInt(mNuevo[2].replace('s', ''), 10) || 1,
            dia: mapaD[mNuevo[3]] || 'sabado',
            libro: mNuevo[4] ? (mapaL[mNuevo[4]] || 'laudes') : 'laudes',
            codigoCompleto: clean
        };
    }

    // 2. Formato antiguo con hora antes del día: tos1lado, tos1lami, tos24lasa
    const mAntiguo = clean.match(/^(to|ta|tn|tc|tp|san)(s\d+)(of|la|te|se|no|vi|co)(do|lu|ma|mi|ju|vi|sa)$/);
    if (mAntiguo) {
        return {
            tiempo: mapaT[mAntiguo[1]] || 'ordinario',
            semana: parseInt(mAntiguo[2].replace('s', ''), 10) || 1,
            dia: mapaD[mAntiguo[4]] || 'sabado',
            libro: mapaL[mAntiguo[3]] || 'laudes',
            codigoCompleto: clean
        };
    }

    // 3. Formato Pascua antiguo: tps1LAjs, tps1OFjs
    const mPascua = clean.match(/^tp(s\d+)(la|of|te|se|no|vi|co)(do|lu|ma|mi|ju|vi|sa|sb|vs|js)$/);
    if (mPascua) {
        const diaPascua = mPascua[3] === 'js' ? 'jueves' : (mPascua[3] === 'vs' ? 'viernes' : (mPascua[3] === 'sb' ? 'sabado' : (mapaD[mPascua[3]] || 'domingo')));
        return {
            tiempo: 'pascua',
            semana: parseInt(mPascua[1].replace('s', ''), 10) || 1,
            dia: diaPascua,
            libro: mapaL[mPascua[2]] || 'laudes',
            codigoCompleto: clean
        };
    }

    // 4. Formato verboso: ordinario_semana_1_domingo_laudes
    const mVerboso = clean.match(/^([a-z]+)_(?:semana_)?(\d+)_([a-z]+)_([a-z]+)$/);
    if (mVerboso) {
        return {
            tiempo: mVerboso[1],
            semana: parseInt(mVerboso[2], 10) || 1,
            dia: mVerboso[3],
            libro: mVerboso[4],
            codigoCompleto: clean
        };
    }

    return null;
}

// Obtener parámetros de la URL o usar valores por defecto
function obtenerParametrosUrl() {
    const search = window.location.search || '';
    const p = new URLSearchParams(search);
    const horaParam = p.get('libro') || p.get('hora');

    // 1. Detectar si viene ?id=tos24sala, ?codigo=..., o ?laudes=tas1dola
    const posibleCodigo = p.get('id') || p.get('codigo') || p.get('laudes') || p.get('oficio') || p.get('tercia') || p.get('visperas') || p.get('completas');
    if (posibleCodigo) {
        const dec = decodificarCodigoLiturgico(posibleCodigo);
        if (dec) {
            if (horaParam) dec.libro = horaParam.toLowerCase();
            return dec;
        }
    }

    // 2. Manejar claves directas o combinaciones en query string (ej: ?tos24sala o ?libro=laudes&tas1dola)
    for (const [key, val] of p.entries()) {
        const decK = decodificarCodigoLiturgico(key);
        if (decK) {
            if (horaParam) decK.libro = horaParam.toLowerCase();
            return decK;
        }
        const decV = decodificarCodigoLiturgico(val);
        if (decV) {
            if (horaParam) decV.libro = horaParam.toLowerCase();
            return decV;
        }
    }

    const t = p.get('tiempo') || 'ordinario';
    const s = p.get('semana') ? parseInt(p.get('semana'), 10) : 24;
    const d = p.get('dia') || 'sabado';
    const lib = (horaParam || 'laudes').toLowerCase();

    // Auto-generar el código canónico id (ej: tos01ofdo o tos24lasa)
    const mapT = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp', santos: 'san' };
    const mapD = { domingo: 'do', lunes: 'lu', martes: 'ma', miercoles: 'mi', jueves: 'ju', viernes: 'vi', sabado: 'sa' };
    const mapH = { oficio: 'of', laudes: 'la', tercia: 'te', sexta: 'se', nona: 'no', visperas: 'vi', completas: 'co' };
    const tCode = mapT[t] || 'to';
    const dCode = mapD[d] || 'do';
    const hCode = mapH[lib] || 'la';
    const semPad = String(s).padStart(2, '0');
    const codigoGenerado = (lib === 'oficio') ? `${tCode}s${semPad}of${dCode}` : `${tCode}s${semPad}${dCode}${hCode}`;

    return {
        tiempo: t,
        semana: s,
        dia: d,
        libro: lib,
        fecha: p.get('fecha') || null,
        santo: p.get('santo') || null,
        codigoCompleto: codigoGenerado
    };
}

// Aplicar tema guardado en localStorage
function aplicarTemaConfigurado() {
    const tema = JSON.parse(localStorage.getItem('lh_salterio_tema') || '{}');
    if (tema.bg) document.documentElement.style.setProperty('--salterio-bg', tema.bg);
    if (tema.text) document.documentElement.style.setProperty('--salterio-text', tema.text);
    if (tema.rubrica) document.documentElement.style.setProperty('--salterio-rubrica', tema.rubrica);
    const sizeGuardado = localStorage.getItem('lh_font_size') || tema.fontSize;
    if (sizeGuardado) {
        const val = (!isNaN(sizeGuardado) && typeof sizeGuardado !== 'string' ? `${sizeGuardado}px` : (String(sizeGuardado).endsWith('px') ? sizeGuardado : `${sizeGuardado}px`));
        document.documentElement.style.setProperty('--salterio-font-size', val);
    }
}

// =========================================================================
// CARGA Y ENSAMBLAJE DE LA HORA LITÚRGICA
// =========================================================================

async function cargarYRenderizarHora(params) {
    const { tiempo, semana, dia, libro, fecha, santo, codigoCompleto } = params;
    const docId = codigoCompleto || (tiempo === 'santos' 
        ? `santo_${(fecha || '01_01').replace('/', '_')}_${libro}`
        : `${tiempo}_semana_${semana}_${dia}_${libro}`);

    // LOCAL FIRST -> FIREBASE -> FALLBACK ENSAMBLADO
    let datos = await obtenerLiturgiaHora(docId, params, ensamblarHoraPorDefecto);
    if (!datos) {
        datos = ensamblarHoraPorDefecto(tiempo, semana, dia, libro, fecha, santo);
    }

    horaActualDatos = datos;

    // Montar o actualizar la cinta superior
    const labelTiempo = tiempo === 'santos' ? (santo || 'Santos') : `Tiempo ${capitalizar(tiempo)}`;
    const labelDia = tiempo === 'santos' ? fecha : capitalizar(dia);

    if (!cintaInstancia) {
        cintaInstancia = new CintaLiturgica('cinta-container', {
            tiempo: labelTiempo,
            semana: semana,
            dia: labelDia,
            libro: libro,
            tiempoSlug: tiempo,
            diaSlug: dia
        });
    } else {
        cintaInstancia.actualizarLiturgiaInfo(labelTiempo, semana, labelDia, libro, tiempo);
    }

    // Cargar los 4 audios en la cinta litúrgica
    const currentYear = new Date().getFullYear();
    const esPar = (currentYear % 2 === 0);

    const rutasOficio = construirRutaOficioLectura({
        tiempo: tiempo,
        semana: semana,
        dia: dia
    });

    const urlEvangelio = construirUrlEvangelio(tiempo, semana, dia);
    const urlAudioHora = datos.audioLibro || construirUrlAudioHora(tiempo, semana, dia, libro);
    const urlLectura1 = esPar ? rutasOficio.lecturaPar : rutasOficio.lecturaImpar;
    const urlLectura2 = rutasOficio.segundaLectura;

    cintaInstancia.cargarAudios({
        evangelio: urlEvangelio,
        subEvangelio: `${labelDia}`,
        hora: urlAudioHora,
        subHora: `Rezo de ${libro.toUpperCase()}`,
        lectura1: urlLectura1,
        subLectura1: `${esPar ? 'Año Par' : 'Año Impar'}`,
        lectura2: urlLectura2,
        subLectura2: 'Lectura patrística'
    });

    // Renderizar cuerpo del salterio
    renderizarCuerpoLiturgico(datos);

    // Reaplicar tamaño de fuente preferido por el usuario
    if (cintaInstancia) {
        cintaInstancia.aplicarTamanoTexto(cintaInstancia.fontZoom);
    }
}

// Ensamblar estructura limpia usando los salmos y antífonas disponibles
function ensamblarHoraPorDefecto(tiempo, semana, dia, libro, fecha, santo) {
    const cfg = LIBROS_CONFIG[libro] || LIBROS_CONFIG.laudes;
    const salmosDB = window.SalmosDB;
    const gloria = salmosDB ? salmosDB.obtenerGloriaPatri(tiempo === 'pascua') : '';

    // Buscar antífonas de la base de datos de antífonas
    const antInvObj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'invitatoria')[0] 
                   || AntifonasDB.filtrar('ordinario', 1, dia, libro, 'invitatoria')[0]
                   || AntifonasDB.filtrar(tiempo, semana, dia, 'laudes', 'invitatoria')[0]
                   || AntifonasDB.filtrar('ordinario', 1, dia, 'laudes', 'invitatoria')[0]
                   || { texto: 'Venid, adoremos al Señor, porque él es nuestro Dios.' };

    const ant1Obj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'salmodia_1')[0] 
                 || AntifonasDB.filtrar('ordinario', 1, dia, libro, 'salmodia_1')[0]
                 || AntifonasDB.filtrar(tiempo, semana, dia, 'laudes', 'salmodia_1')[0]
                 || { texto: 'Día tras día te bendeciré, Señor.' };
    const ant2Obj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'salmodia_2')[0] 
                 || AntifonasDB.filtrar('ordinario', 1, dia, libro, 'salmodia_2')[0]
                 || AntifonasDB.filtrar(tiempo, semana, dia, 'laudes', 'salmodia_2')[0]
                 || { texto: 'Canten al Señor un cántico nuevo.' };
    const ant3Obj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'salmodia_3')[0] 
                 || AntifonasDB.filtrar('ordinario', 1, dia, libro, 'salmodia_3')[0]
                 || AntifonasDB.filtrar(tiempo, semana, dia, 'laudes', 'salmodia_3')[0]
                 || { texto: 'Grandes y maravillosas son tus obras, Señor.' };
    const antEvObj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'evangelico')[0] || { texto: 'Se presentó Jesús en medio de sus discípulos y les dijo: Paz a vosotros.' };

    // Determinar salmos según el libro
    let salmo1 = null;
    let salmo2 = null;
    let salmo3 = null;

    if (libro === 'oficio') {
        salmo1 = salmosDB ? (salmosDB.obtener('salmo23') || salmosDB.obtener('salmo144')) : null;
        salmo2 = salmosDB ? (salmosDB.obtener('salmo66') || salmosDB.obtener('salmo100') || salmosDB.obtener('salmo117')) : null;
        salmo3 = salmosDB ? (salmosDB.obtener('salmo99') || salmosDB.obtener('salmo149')) : null;
    } else {
        salmo1 = salmosDB ? (salmosDB.obtener('salmo144') || salmosDB.obtener('salmo62_2_9')) : null;
        salmo2 = salmosDB ? (salmosDB.obtener('canticoZacarias') || salmosDB.obtener('ISa2_1_10')) : null;
        salmo3 = salmosDB ? (salmosDB.obtener('salmo149') || salmosDB.obtener('salmo150')) : null;
    }

    // Calcular URLs de audio para Oficio de Lectura (Par vs Impar)
    const esPar = currentYear % 2 === 0;
    const rutaOficio = construirRutaOficioLectura({ tiempo, semana, dia });
    const audioLectura1 = esPar ? rutaOficio.lecturaPar : rutaOficio.lecturaImpar;
    const audioLectura2 = rutaOficio.segundaLectura;

    // Buscar himno en el catálogo de himnos
    const himnoObj = (HimnosDB && typeof HimnosDB.filtrar === 'function')
        ? (HimnosDB.filtrar(tiempo, semana, dia, libro)[0] 
           || (libro === 'oficio' ? HimnosDB.obtenerPorId('hbautismoOF') : null)
           || HimnosDB.filtrar(tiempo, semana, dia, 'laudes')[0]
           || HimnosDB.filtrar('ordinario', 1, dia, libro)[0])
        : null;

    const himnoFinal = himnoObj ? {
        id: himnoObj.id || himnoObj.varName,
        titulo: himnoObj.titulo || 'HIMNO',
        texto: himnoObj.texto || ''
    } : (libro === 'oficio' ? {
        titulo: 'HIMNO: HOY DOS EXTREMOS SE HAN VISTO',
        texto: `Hoy dos extremos se han visto,\r\ncuales nunca se verán:\r\nCristo arrodillado a Juan,\r\ny Juan bautizando a Cristo.\r\n\r\nEl mar y abismo profundo\r\nde la pureza infinita,\r\nque las inmundicias quita\r\ny los pecados del mundo,\r\n\r\nhoy del Bautista se ha visto\r\nser lavado en el Jordán;\r\nCristo arrodillado a Juan,\r\ny Juan bautizando a Cristo.\r\n\r\nBautiza la voz al Verbo,\r\nel criado al Criador;\r\nved qué humildad de Señor\r\ny qué autoridad de siervo.\r\n\r\nFavor otra vez no visto\r\nentre los hijos de Adán,\r\nCristo arrodillado a Juan,\r\ny Juan bautizando a Cristo. Amén.`
    } : {
        titulo: 'HIMNO: ERES LA LUZ Y SIEMBRAS CLARIDADES.',
        texto: `Eres la luz y siembras claridades,\neres amor y siembras armonía\ndesde tu eternidad de eternidades.\n\nPor tu roja frescura de alegría,\nla tierra se estremece de rocío,\nHijo eterno del Padre y de María.\n\nEntro en tus esplendores, Cristo, ciego;\nmientras corre la vida paso a paso,\npongo mis horas grises en tu brazo,\ny a ti, Señor, mi corazón entrego. Amén.`
    });

    return {
        tiempo,
        semana,
        dia,
        fecha,
        santo,
        libro,
        titulo: cfg.nombre,
        subtitulo: cfg.subtitulo,
        invitatorio: {
            activo: (libro === 'laudes' || libro === 'oficio'),
            v: 'Señor abre mis labios',
            r: 'Y mi boca proclamará tu alabanza',
            antifona: antInvObj.texto,
            salmoTitulo: 'Salmo 94 - INVITACIÓN A LA ALABANZA DIVINA',
            salmoTexto: (salmosDB && salmosDB.obtener('salmo94')) ? salmosDB.obtener('salmo94').texto : ''
        },
        invocacionInicial: {
            v: 'Dios mío, ven en mi auxilio',
            r: `Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo.\nComo era en el principio, ahora y siempre, por los siglos de los siglos. Amén.${tiempo === 'pascua' ? ' Aleluya.' : ''}`
        },
        himno: himnoFinal,
        salmodia: {
            ant1: ant1Obj.texto,
            salmo1Titulo: salmo1 ? salmo1.titulo : (libro === 'oficio' ? 'Salmo 23 - ENTRADA SOLEMNE DE DIOS EN SU SANTUARIO' : 'Salmo 62 - EL ALMA SEDIENTA DE DIOS'),
            salmo1Texto: salmo1 ? salmo1.texto : '',
            ant2: ant2Obj.texto,
            salmo2Titulo: salmo2 ? salmo2.titulo : (libro === 'oficio' ? 'Salmo 66 - INVITACIÓN A LOS PUEBLOS A ALABAR A DIOS' : 'Cántico: BENEFICIOS DE DIOS'),
            salmo2Texto: salmo2 ? salmo2.texto : '',
            ant3: ant3Obj.texto,
            salmo3Titulo: salmo3 ? salmo3.titulo : (libro === 'oficio' ? 'Salmo 99 - ALEGRÍA DE LOS QUE ENTRAN EN EL TEMPLO' : 'Salmo 149 - ALEGRÍA DE LOS SANTOS'),
            salmo3Texto: salmo3 ? salmo3.texto : ''
        },
        versiculo: (() => {
            const respObj = (ResponsoriosDB && typeof ResponsoriosDB.obtenerRecomendado === 'function')
                ? ResponsoriosDB.obtenerRecomendado(tiempo, semana, dia)
                : null;
            if (respObj) {
                return { v: respObj.v, r: respObj.r, id: respObj.id };
            }
            return {
                v: 'Éste es mi Hijo amado.',
                r: 'Escuchadlo.'
            };
        })(),
        lecturasOficio: (() => {
            const l1Data = (LecturasDB && typeof LecturasDB.obtenerLectura1 === 'function')
                ? LecturasDB.obtenerLectura1(tiempo, semana, dia, esPar)
                : null;
            const l2Data = (LecturasDB && typeof LecturasDB.obtenerLectura2 === 'function')
                ? LecturasDB.obtenerLectura2(tiempo, semana, dia)
                : null;

            return {
                primera: l1Data ? {
                    id: l1Data.id,
                    etiqueta: '1ra Lectura',
                    audioUrl: l1Data.audioUrl || audioLectura1,
                    esPar: esPar,
                    titulo: l1Data.epigrafeTipo || 'PRIMERA LECTURA',
                    epigrafeTipo: l1Data.epigrafeTipo || 'PRIMERA LECTURA',
                    cita: l1Data.cita,
                    subtitulo: l1Data.descripcion,
                    descripcion: l1Data.descripcion,
                    texto: l1Data.texto,
                    respCita: l1Data.respCita,
                    respR1: l1Data.respR1,
                    respV: l1Data.respV,
                    respR2: l1Data.respR2,
                    responsorio: {
                        ref: l1Data.respCita,
                        r1: l1Data.respR1,
                        v: l1Data.respV,
                        r2: l1Data.respR2
                    }
                } : {
                    etiqueta: '1ra Lectura',
                    audioUrl: audioLectura1,
                    esPar: esPar,
                    titulo: 'PRIMERA LECTURA',
                    epigrafeTipo: 'PRIMERA LECTURA',
                    cita: 'Del libro del profeta Isaías 42, 1-9; 49, 1-9',
                    subtitulo: 'EL SIERVO HUMILDE DEL SEÑOR ES LA LUZ DE LAS NACIONES',
                    descripcion: 'EL SIERVO HUMILDE DEL SEÑOR ES LA LUZ DE LAS NACIONES',
                    texto: `Mirad a mi siervo, a quien sostengo; mi elegido, a quien prefiero...`,
                    respCita: 'Cf. Mt 3, 16. 17; Lc 3, 22',
                    respR1: 'Hoy se abrieron los cielos cuando fue bautizado el Señor en el Jordán... * «Éste es mi Hijo amado, en quien tengo mis complacencias.»',
                    respV: 'El Espíritu Santo descendió sobre él en forma visible de paloma, y resonó una voz del cielo:',
                    respR2: '«Éste es mi Hijo amado, en quien tengo mis complacencias.»',
                    responsorio: {
                        ref: 'Cf. Mt 3, 16. 17; Lc 3, 22',
                        r1: 'Hoy se abrieron los cielos cuando fue bautizado el Señor en el Jordán... * «Éste es mi Hijo amado, en quien tengo mis complacencias.»',
                        v: 'El Espíritu Santo descendió sobre él en forma visible de paloma, y resonó una voz del cielo:',
                        r2: '«Éste es mi Hijo amado, en quien tengo mis complacencias.»'
                    }
                },
                segunda: l2Data ? {
                    id: l2Data.id,
                    etiqueta: '2da Lectura',
                    audioUrl: l2Data.audioUrl || audioLectura2,
                    titulo: l2Data.epigrafeTipo || 'SEGUNDA LECTURA',
                    epigrafeTipo: l2Data.epigrafeTipo || 'SEGUNDA LECTURA',
                    cita: l2Data.cita,
                    subtitulo: l2Data.descripcion,
                    descripcion: l2Data.descripcion,
                    texto: l2Data.texto,
                    respCita: l2Data.respCita,
                    respR1: l2Data.respR1,
                    respV: l2Data.respV,
                    respR2: l2Data.respR2,
                    responsorio: {
                        ref: l2Data.respCita,
                        r1: l2Data.respR1,
                        v: l2Data.respV,
                        r2: l2Data.respR2
                    }
                } : {
                    etiqueta: '2da Lectura',
                    audioUrl: audioLectura2,
                    titulo: 'SEGUNDA LECTURA',
                    epigrafeTipo: 'SEGUNDA LECTURA',
                    cita: 'De los Sermones de san Máximo de Turín, obispo',
                    subtitulo: 'CRISTO ES BAUTIZADO PARA SANTIFICAR LAS AGUAS',
                    descripcion: 'CRISTO ES BAUTIZADO PARA SANTIFICAR LAS AGUAS',
                    texto: `Nos enseña el relato evangélico que el Señor fue al Jordán...`,
                    respCita: 'Cf. Sal 28, 3. 4; Lc 3, 22',
                    respR1: 'La voz del Señor sobre las aguas, el Dios de la gloria hace oír su trueno: * La voz del Señor es potente, la voz del Señor es magnífica.',
                    respV: 'Y se oyó una voz que venía del cielo: «Tú eres mi Hijo amado, en ti me complazco.»',
                    respR2: 'La voz del Señor es potente, la voz del Señor es magnífica.',
                    responsorio: {
                        ref: 'Cf. Sal 28, 3. 4; Lc 3, 22',
                        r1: 'La voz del Señor sobre las aguas, el Dios de la gloria hace oír su trueno: * La voz del Señor es potente, la voz del Señor es magnífica.',
                        v: 'Y se oyó una voz que venía del cielo: «Tú eres mi Hijo amado, en ti me complazco.»',
                        r2: 'La voz del Señor es potente, la voz del Señor es magnífica.'
                    }
                }
            };
        })(),
        lecturaBreve: {
            cita: 'Rm 8, 1-2',
            texto: 'No hay ya condenación alguna para los que están en Cristo Jesús, porque la ley del espíritu de vida en Cristo Jesús me libró de la ley del pecado y de la muerte.',
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
            tipo: libro === 'visperas' ? 'Magníficat' : (libro === 'completas' ? 'Nunc Dimittis' : 'Benedictus'),
            antifona: antEvObj.texto,
            titulo: libro === 'visperas' 
                ? 'Cántico de María. ALEGRÍA DEL ALMA EN EL SEÑOR Lc 1, 46-55' 
                : (libro === 'completas' ? 'CÁNTICO DE SIMEÓN Lc 2, 29-32' : 'Cántico de Zacarías. EL MESÍAS Y SU PRECURSOR Lc 1, 68-79'),
            texto: (salmosDB && salmosDB.obtener('canticoZacarias')) ? salmosDB.obtener('canticoZacarias').texto : ''
        },
        preces: (() => {
            const canonP = (PrecesDB && typeof PrecesDB.obtener === 'function')
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
                intro: 'Invoquemos a Cristo, en quien confían los que conocen su nombre, diciendo:',
                respuesta: 'Señor, ten piedad.',
                intenciones: [
                    'Señor Jesucristo, dígnate sostener nuestra fe en este nuevo día.',
                    'Acompaña con tu bendición nuestras palabras y acciones.'
                ],
                libre: 'Se pueden añadir algunas intenciones libres',
                concl: 'Siguiendo las enseñanzas de Jesucristo, digamos al Padre celestial:'
            };
        })(),
        oracion: {
            texto: 'Dios todopoderoso y eterno, que quisiste que tu Hijo sufriese por la salvación de todos, haz que, inflamados en tu amor, sepamos ofrecernos a ti como víctima viva. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.'
        },
        conclusion: {
            v: libro === 'oficio' || libro === 'tercia' || libro === 'sexta' || libro === 'nona' ? 'Bendigamos al Señor.' : 'El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.',
            r: libro === 'oficio' || libro === 'tercia' || libro === 'sexta' || libro === 'nona' ? 'Demos gracias a Dios.' : 'Amén.'
        }
    };
}

// Exportar ensamblador globalmente para el normalizador
if (typeof window !== 'undefined') {
    window.ensamblarHoraPorDefecto = ensamblarHoraPorDefecto;
}

// =========================================================================
// RENDERIZADOR VISUAL EXACTO (Fiel a capturas OL1..5, LA1..5, etc.)
// =========================================================================

function renderizarCuerpoLiturgico(d) {
    const contenedor = document.getElementById('salterio-contenido');
    if (!contenedor) return;

    // Si el documento cargado carece de salmodia o textos completos, fusionar con la plantilla completa
    if (!d || !d.salmodia || !d.himno) {
        const plantilla = ensamblarHoraPorDefecto(d?.tiempo || 'ordinario', d?.semana || 24, d?.dia || 'sabado', d?.libro || 'laudes', d?.fecha, d?.santo);
        d = { ...plantilla, ...(d || {}) };
        if (!d.salmodia) d.salmodia = plantilla.salmodia;
        if (!d.himno) d.himno = plantilla.himno;
        if (!d.invitatorio) d.invitatorio = plantilla.invitatorio;
        if (!d.lecturaBreve) d.lecturaBreve = plantilla.lecturaBreve;
        if (!d.canticoEvangelico) d.canticoEvangelico = plantilla.canticoEvangelico;
        if (!d.preces) d.preces = plantilla.preces;
        if (!d.oracion) d.oracion = plantilla.oracion;
    }

    const libroKey = (d.libro || 'laudes').toLowerCase();
    const cfg = LIBROS_CONFIG[libroKey] || LIBROS_CONFIG.laudes;
    const tituloLibro = d.titulo || cfg.nombre;
    const subtituloLibro = d.subtitulo || cfg.subtitulo;

    let html = '';

    // 1. TÍTULO Y SUBTÍTULO DEL LIBRO
    html += `
        <h1 class="salterio-libro-titulo">${tituloLibro}</h1>
        <div class="salterio-libro-subtitulo">${subtituloLibro}</div>
    `;

    // 2. INVITATORIO E INVOCACIÓN INICIAL (Fiel a Imagen 2 para Oficio)
    if (libroKey === 'oficio') {
        const antInv = d.invitatorio?.antifonaTexto || d.invitatorio?.antifona || 'Venid, adoremos a Cristo, el Hijo amado, en quien el Padre tiene sus complacencias.';
        html += `
            <div class="salterio-seccion-header">INVITATORIO</div>
            <div class="rubrica-nota">Si ésta es la primera oración del día:</div>
            <div class="linea-vr"><span class="rubrica-vr">V.</span> Señor abre mis labios</div>
            <div class="linea-vr"><span class="rubrica-vr">R.</span> Y mi boca proclamará tu alabanza</div>
            <div class="rubrica-nota" style="margin-top: 8px;">Se añade el Salmo del Invitatorio con la siguiente antífona:</div>
            <div class="antifona-bloque"><span class="rubrica-ant">Ant.</span> ${antInv}</div>
            <hr class="salterio-divider" style="margin: 18px 0; border: none; border-top: 1px solid rgba(0,0,0,0.15);">
            <div class="rubrica-nota-roja" style="color: #ff0000; font-style: italic; margin-bottom: 8px;">Si antes se ha rezado ya alguna otra Hora:</div>
            <div class="linea-vr"><span class="rubrica-vr">V.</span> Dios mío, ven en mi auxilio</div>
            <div class="linea-vr"><span class="rubrica-vr">R.</span> Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.${d.tiempo === 'pascua' ? ' Aleluya.' : ''}</div>
            <hr class="salterio-divider" style="margin: 18px 0; border: none; border-top: 1px solid rgba(0,0,0,0.15);">
        `;
    } else {
        if (d.invitatorio && d.invitatorio.activo) {
            html += `
                <div class="salterio-seccion-header">INVITATORIO</div>
                <div class="rubrica-nota">(Si esta no es la primera oración del día, se omite el Invitatorio y se inicia directamente con la Invocación inicial)</div>
                <div class="linea-vr"><span class="rubrica-vr">V.</span> ${d.invitatorio.v}</div>
                <div class="linea-vr"><span class="rubrica-vr">R.</span> ${d.invitatorio.r}</div>
                <div class="antifona-bloque"><span class="rubrica-ant">Ant.</span> ${d.invitatorio.antifona}</div>
                <div class="salmo-titulo-rubrica">${d.invitatorio.salmoTitulo}</div>
                <div class="texto-estrofas-salmo">${d.invitatorio.salmoTexto}</div>
                <div class="antifona-bloque"><span class="rubrica-ant">Ant.</span> ${d.invitatorio.antifona}</div>
            `;
        } else if (d.invocacionInicial) {
            html += `
                <div class="salterio-seccion-header">INVOCACIÓN INICIAL</div>
                <div class="linea-vr"><span class="rubrica-vr">V.</span> ${d.invocacionInicial.v}</div>
                <div class="linea-vr"><span class="rubrica-vr">R.</span> ${d.invocacionInicial.r}</div>
            `;
        }
    }

    // 4. HIMNO
    if (d.himno) {
        html += `
            <div class="salterio-seccion-header">${d.himno.titulo}</div>
            <div class="texto-estrofas-salmo">${d.himno.texto}</div>
        `;
    }

    // 5. SALMODIA
    if (d.salmodia) {
        html += `<div class="salterio-seccion-header">SALMODIA</div>`;

        // Salmo 1
        if (d.salmodia.salmo1Texto) {
            html += `
                <div class="antifona-bloque"><span class="rubrica-ant">Ant 1.</span> ${d.salmodia.ant1}</div>
                <div class="salmo-titulo-rubrica">${d.salmodia.salmo1Titulo}</div>
                <div class="texto-estrofas-salmo">${d.salmodia.salmo1Texto}</div>
                <div class="antifona-bloque"><span class="rubrica-ant">Ant.</span> ${d.salmodia.ant1}</div>
            `;
        }

        // Salmo 2
        if (d.salmodia.salmo2Texto) {
            html += `
                <div class="antifona-bloque"><span class="rubrica-ant">Ant 2.</span> ${d.salmodia.ant2}</div>
                <div class="salmo-titulo-rubrica">${d.salmodia.salmo2Titulo}</div>
                <div class="texto-estrofas-salmo">${d.salmodia.salmo2Texto}</div>
                <div class="antifona-bloque"><span class="rubrica-ant">Ant.</span> ${d.salmodia.ant2}</div>
            `;
        }

        // Salmo 3
        if (d.salmodia.salmo3Texto) {
            html += `
                <div class="antifona-bloque"><span class="rubrica-ant">Ant 3.</span> ${d.salmodia.ant3}</div>
                <div class="salmo-titulo-rubrica">${d.salmodia.salmo3Titulo}</div>
                <div class="texto-estrofas-salmo">${d.salmodia.salmo3Texto}</div>
                <div class="antifona-bloque"><span class="rubrica-ant">Ant.</span> ${d.salmodia.ant3}</div>
            `;
        }
    }

    // 6. VERSÍCULO (Oficio y Horas menores - Fiel a Imagen 3)
    if (d.versiculo && (libroKey === 'oficio' || libroKey === 'tercia' || libroKey === 'sexta' || libroKey === 'nona')) {
        html += `
            <div style="margin: 22px 0;">
                <div class="linea-vr"><span class="rubrica-vr">V.</span> ${d.versiculo.v}</div>
                <div class="linea-vr"><span class="rubrica-vr">R.</span> ${d.versiculo.r}</div>
            </div>
        `;
    }

    // 7. LECTURAS DE OFICIO (Fiel a Imagen 4)
    if (libroKey === 'oficio' && d.lecturasOficio) {
        // Primera Lectura
        const l1 = d.lecturasOficio.primera;
        if (l1) {
            const resp1Obj = l1.responsorio || {};
            const r1Txt = l1.respR1 || resp1Obj.r1 || '';
            const r1Formateado = r1Txt.replace(/\*/g, '<span class="asterisco-rojo" style="color: #ff0000; font-weight: bold; font-size: 1.25rem;">*</span>');
            const v1Txt = l1.respV || resp1Obj.v || '';
            const r2Txt = l1.respR2 || resp1Obj.r2 || '';
            const citaResp1 = l1.respCita || resp1Obj.ref || '';

            html += `
                <div class="lectura-oficio-contenedor" style="margin-top: 26px;">
                    <div class="salterio-seccion-header" style="color: #ff0000; font-size: 1.15rem; margin-bottom: 4px;">${l1.epigrafeTipo || l1.titulo || 'PRIMERA LECTURA'}</div>
                    <div class="lectura-cita-rubrica" style="font-weight: 500; margin-bottom: 4px; color: #000000;">${l1.cita || ''}</div>
                    <div class="lectura-subtitulo-rubrica" style="font-weight: bold; text-transform: uppercase; margin-bottom: 12px; color: #ff0000;">${l1.descripcion || l1.subtitulo || ''}</div>
                    <div class="texto-lectura-justificado">${l1.texto || ''}</div>
                    ${r1Txt ? `
                        <div class="responsorio-lectura-caja" style="margin-top: 16px; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 12px;">
                            <div class="salterio-seccion-header" style="color: #ff0000; font-size: 1.05rem; margin-bottom: 8px;">
                                RESPONSORIO <span style="font-weight: normal; font-size: 0.9rem; color: #555555; margin-left: 8px;">${citaResp1}</span>
                            </div>
                            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${r1Formateado}</div>
                            <div class="linea-vr"><span class="rubrica-vr">V.</span> ${v1Txt}</div>
                            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${r2Txt}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Segunda Lectura (Patrística)
        const l2 = d.lecturasOficio.segunda;
        if (l2) {
            const resp2Obj = l2.responsorio || {};
            const r1Txt2 = l2.respR1 || resp2Obj.r1 || '';
            const r1Formateado2 = r1Txt2.replace(/\*/g, '<span class="asterisco-rojo" style="color: #ff0000; font-weight: bold; font-size: 1.25rem;">*</span>');
            const v2Txt = l2.respV || resp2Obj.v || '';
            const r2Txt2 = l2.respR2 || resp2Obj.r2 || '';
            const citaResp2 = l2.respCita || resp2Obj.ref || '';

            html += `
                <div class="lectura-oficio-contenedor" style="margin-top: 28px;">
                    <div class="salterio-seccion-header" style="color: #ff0000; font-size: 1.15rem; margin-bottom: 4px;">${l2.epigrafeTipo || l2.titulo || 'SEGUNDA LECTURA'}</div>
                    <div class="lectura-cita-rubrica" style="font-weight: 500; margin-bottom: 4px; color: #000000;">${l2.cita || ''}</div>
                    <div class="lectura-subtitulo-rubrica" style="font-weight: bold; text-transform: uppercase; margin-bottom: 12px; color: #ff0000;">${l2.descripcion || l2.subtitulo || ''}</div>
                    <div class="texto-lectura-justificado">${l2.texto || ''}</div>
                    ${r1Txt2 ? `
                        <div class="responsorio-lectura-caja" style="margin-top: 16px; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 12px;">
                            <div class="salterio-seccion-header" style="color: #ff0000; font-size: 1.05rem; margin-bottom: 8px;">
                                RESPONSORIO <span style="font-weight: normal; font-size: 0.9rem; color: #555555; margin-left: 8px;">${citaResp2}</span>
                            </div>
                            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${r1Formateado2}</div>
                            <div class="linea-vr"><span class="rubrica-vr">V.</span> ${v2Txt}</div>
                            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${r2Txt2}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Himno Te Deum
        if (d.dia === 'domingo' || d.tiempo === 'pascua' || d.tiempo === 'navidad' || d.himnoTeDeum) {
            const textoTeDeum = d.himnoTeDeum?.texto || `A ti, oh Dios, te alabamos, a ti, Señor, te reconocemos.
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

            html += `
                <div class="salterio-seccion-header" style="margin-top: 30px;">HIMNO: A TI, OH DIOS (TE DEUM)</div>
                <div class="texto-estrofas-salmo">${textoTeDeum}</div>
            `;
        }

        // Sección opcional (Vigilia)
        html += `
            <div class="seccion-opcional-oficio" style="margin: 26px 0;">
                <div class="rubrica-nota-roja" style="color: #ff0000; font-style: italic; margin-bottom: 8px;">La parte que sigue puede omitirse, si se cree oportuno.</div>
                ${d.seccionOpcional?.texto ? `<div class="texto-lectura-justificado">${d.seccionOpcional.texto}</div>` : ''}
            </div>
        `;
    }

    // 8. LECTURA BREVE Y RESPONSORIO (Laudes, Horas menores, Vísperas, Completas)
    if (d.libro !== 'oficio' && d.lecturaBreve) {
        html += `
            <div style="margin: 24px 0;">
                <div class="salterio-seccion-header">LECTURA BREVE <span style="font-weight: normal; font-size: 0.95rem;">${d.lecturaBreve.cita}</span></div>
                <div class="texto-lectura-justificado">${d.lecturaBreve.texto}</div>
            </div>
        `;

        if (d.lecturaBreve.responsorioBreve) {
            const rb = d.lecturaBreve.responsorioBreve;
            html += `
                <div class="salterio-seccion-header">RESPONSORIO BREVE</div>
                <div class="responsorio-bloque">
                    <div class="linea-vr"><span class="rubrica-vr">V.</span> ${rb.v1}</div>
                    <div class="linea-vr"><span class="rubrica-vr">R.</span> ${rb.r1}</div>
                    <div class="linea-vr"><span class="rubrica-vr">V.</span> ${rb.v2}</div>
                    <div class="linea-vr"><span class="rubrica-vr">R.</span> ${rb.r2}</div>
                    <div class="linea-vr"><span class="rubrica-vr">V.</span> ${rb.v3}</div>
                    <div class="linea-vr"><span class="rubrica-vr">R.</span> ${rb.r3}</div>
                </div>
            `;
        }
    }

    // 9. CÁNTICO EVANGÉLICO (Laudes, Vísperas, Completas)
    if (d.canticoEvangelico && (d.libro === 'laudes' || d.libro === 'visperas' || d.libro === 'completas')) {
        html += `
            <div class="salterio-seccion-header">CÁNTICO EVANGÉLICO</div>
            <div class="antifona-bloque"><span class="rubrica-ant">Ant.</span> ${d.canticoEvangelico.antifona}</div>
            <div class="salmo-titulo-rubrica">${d.canticoEvangelico.titulo}</div>
            <div class="texto-estrofas-salmo">${d.canticoEvangelico.texto}</div>
            <div class="antifona-bloque"><span class="rubrica-ant">Ant.</span> ${d.canticoEvangelico.antifona}</div>
        `;
    }

    // 10. PRECES
    if (d.preces && (d.libro === 'laudes' || d.libro === 'visperas')) {
        let precesObj = d.preces;
        const canon = (PrecesDB && typeof PrecesDB.obtener === 'function') 
            ? PrecesDB.obtener(precesObj.id || d.codigo || d.id, d.tiempo, d.semana, d.dia, d.libro)
            : null;

        const introRaw = precesObj.intro || '';
        const respRaw = precesObj.respuesta || '';
        const intsRaw = Array.isArray(precesObj.intenciones) ? precesObj.intenciones : [];

        const esCorrupta = (introRaw.length > 110 || introRaw.includes('Cristo Jesús, que')) ||
                           (respRaw === "Confirma, Señor, lo que has realizado en nosotros." && (d.dia !== 'sabado' || d.libro !== 'visperas')) ||
                           (intsRaw.some(i => String(i).includes('dígnate sostener nuestra fe')));

        if (canon && (esCorrupta || intsRaw.length <= 1)) {
            precesObj = { ...canon };
            d.preces = precesObj;
        }

        let intro = precesObj.intro || '';
        let respuesta = precesObj.respuesta || '';
        let intenciones = Array.isArray(precesObj.intenciones) ? [...precesObj.intenciones] : [];
        let libre = precesObj.libre || 'Se pueden añadir algunas intenciones libres';
        let concl = precesObj.concl || '';

        // Si intenciones está vacío pero hay texto agrupado con saltos dobles
        if (intenciones.length === 0 && (precesObj.textoCompleto || precesObj.texto || intro)) {
            const textoFuente = precesObj.textoCompleto || precesObj.texto || intro;
            const bloques = textoFuente.split(/\r?\n\s*\r?\n/).map(b => b.trim()).filter(Boolean);
            if (bloques.length >= 3) {
                intro = bloques[0];
                respuesta = bloques[1];
                intenciones = bloques.slice(2);
            }
        }

        const intencionesHtml = intenciones.map(it => `<div class="preces-intencion">${String(it).replace(/\n/g, '<br>')}</div>`).join('');

        html += `
            <div class="salterio-seccion-header">PRECES</div>
            <div class="preces-bloque">
                ${intro ? `<div class="preces-intro">${intro}</div>` : ''}
                ${respuesta ? `<div class="preces-respuesta-pueblo">${respuesta}</div>` : ''}
                ${intencionesHtml}
                <div class="rubrica-intenciones-libres">${libre}</div>
                ${concl ? `<div class="preces-conclusion">${concl}</div>` : ''}
            </div>
        `;
    }

    if (typeof window !== 'undefined') {
        window.__salterioDataActual = d;
    }

    // 11. PADRE NUESTRO DESPLEGABLE EN TEXTO PLANO (Solo en Laudes y Vísperas)
    if (libroKey !== 'oficio') {
        const padreNuestroTexto = window.SalmosDB ? window.SalmosDB.obtenerPadreNuestro() : `Padre nuestro, que estás en el cielo,\nsantificado sea tu Nombre;\nvenga a nosotros tu reino;\nhágase tu voluntad en la tierra como en el cielo.\nDanos hoy nuestro pan de cada día;\nperdona nuestras ofensas,\ncomo también nosotros perdonamos a los que nos ofenden;\nno nos dejes caer en la tentación,\ny líbranos del mal. \nAmen`;

        html += `
            <div class="padre-nuestro-trigger" id="btn-padre-nuestro">
                Padre nuestro...
                <span class="material-symbols-outlined" style="font-size: 18px; vertical-align: middle; display: none;">expand_more</span>
            </div>
            <div class="padre-nuestro-expandido" id="bloque-padre-nuestro-expandido">${padreNuestroTexto}</div>
        `;
    }

    // 12. ORACIÓN
    if (d.oracion) {
        const textoOracion = typeof d.oracion === 'string' ? d.oracion : (d.oracion.textoCompleto || d.oracion.texto || '');
        html += `
            <div class="salterio-seccion-header">ORACIÓN</div>
            <div style="margin-bottom: 20px; line-height: 1.6; text-align: justify;">${textoOracion}</div>
        `;
    }

    // 13. CONCLUSIÓN
    const vConc = (libroKey === 'oficio' || libroKey === 'tercia' || libroKey === 'sexta' || libroKey === 'nona') 
        ? 'Bendigamos al Señor.' 
        : (d.conclusion?.v || 'El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.');
    const rConc = (libroKey === 'oficio' || libroKey === 'tercia' || libroKey === 'sexta' || libroKey === 'nona') 
        ? 'Demos gracias a Dios.' 
        : (d.conclusion?.r || 'Amén.');
    html += `
        <div class="salterio-seccion-header">CONCLUSIÓN</div>
        <div class="linea-vr"><span class="rubrica-vr">V.</span> ${vConc}</div>
        <div class="linea-vr"><span class="rubrica-vr">R.</span> ${rConc}</div>
    `;

    contenedor.innerHTML = html;
}

// =========================================================================
// EVENTOS INTERACTIVOS (PADRE NUESTRO, AUDIO, ETC.)
// =========================================================================

function inicializarEventosInteractivos() {
    // Delegación de eventos para el Padre Nuestro interactivo
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('#btn-padre-nuestro');
        if (trigger) {
            const bloque = document.getElementById('bloque-padre-nuestro-expandido');
            if (bloque) {
                bloque.classList.toggle('activo');
                const icono = trigger.querySelector('.material-symbols-outlined');
                if (icono) {
                    icono.textContent = bloque.classList.contains('activo') ? 'expand_less' : 'expand_more';
                }
            }
        }
    });
}

// =========================================================================
// PANEL CONSTRUCTOR Y SINCRONIZACIÓN FIREBASE (ADMIN)
// =========================================================================

function esAdminAutorizado() {
    if (typeof window.esUsuarioAdminAutorizado === 'function') {
        return window.esUsuarioAdminAutorizado();
    }
    const ADMIN_EMAIL = 'dbaezh78@gmail.com';
    const currentUser = (window.firebaseAPI && window.firebaseAPI.getCurrentUser) 
        ? window.firebaseAPI.getCurrentUser() 
        : (window.firebaseAPI?.auth?.currentUser || window.currentUser);
    const email = (currentUser?.email || localStorage.getItem('lh_auth_email') || localStorage.getItem('user_email') || '').toLowerCase().trim();
    const cachedIsAdmin = localStorage.getItem('lh_auth_is_admin') === 'true';
    if (email === ADMIN_EMAIL.toLowerCase()) return true;
    if (cachedIsAdmin && (!email || email === ADMIN_EMAIL.toLowerCase())) return true;
    if (window.firebaseAPI && typeof window.firebaseAPI.isAdmin === 'function' && window.firebaseAPI.isAdmin()) return true;
    return false;
}

function actualizarVisibilidadConstructor() {
    const toolbar = document.querySelector('.admin-toolbar-salterios');
    const drawer = document.getElementById('constructor-drawer');
    const activadoPref = localStorage.getItem('pref-activar-constructor-salterio') === 'true';
    const esAdmin = esAdminAutorizado();
    const visible = activadoPref && esAdmin;

    if (toolbar) {
        toolbar.style.display = visible ? 'flex' : 'none';
    }
    if (!visible && drawer) {
        drawer.classList.remove('abierto');
    }
}

function inicializarConstructor() {
    const fab = document.getElementById('btn-abrir-constructor');
    const drawer = document.getElementById('constructor-drawer');
    const btnCerrar = document.getElementById('btn-cerrar-drawer');

    // Inicializar visibilidad del botón y drawer
    actualizarVisibilidadConstructor();

    // Sincronizar preferencia si existe en Firebase
    if (window.firebaseAPI && window.firebaseAPI.cargarAjustesFirestore) {
        window.firebaseAPI.cargarAjustesFirestore('constructor_salterio').then(res => {
            if (res && typeof res.activado === 'boolean') {
                if (esAdminAutorizado()) {
                    localStorage.setItem('pref-activar-constructor-salterio', res.activado ? 'true' : 'false');
                    actualizarVisibilidadConstructor();
                }
            }
        }).catch(e => console.warn(e));
    }

    // Escuchar cambios de estado en settings
    window.addEventListener('lh-constructor-salterio-toggle', () => {
        actualizarVisibilidadConstructor();
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'pref-activar-constructor-salterio' || e.key === 'lh_auth_email' || e.key === 'lh_auth_is_admin') {
            actualizarVisibilidadConstructor();
        }
    });

    if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
        window.firebaseAPI.onAuthReady(() => {
            actualizarVisibilidadConstructor();
        });
    } else {
        const checkAuth = setInterval(() => {
            if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
                window.firebaseAPI.onAuthReady(() => {
                    actualizarVisibilidadConstructor();
                });
                clearInterval(checkAuth);
            }
        }, 500);
        setTimeout(() => clearInterval(checkAuth), 8000);
    }

    if (fab && drawer) {
        fab.addEventListener('click', () => {
            if (!esAdminAutorizado()) {
                alert("Acceso denegado: Solo el administrador (dbaezh78@gmail.com) puede abrir el constructor.");
                return;
            }
            drawer.classList.add('abierto');
            poblarFormularioConstructor();
        });
    }

    if (btnCerrar && drawer) {
        btnCerrar.addEventListener('click', () => {
            drawer.classList.remove('abierto');
        });
    }

    // Botón Guardar en Firebase
    document.getElementById('btn-c-guardar-firebase')?.addEventListener('click', async () => {
        if (!horaActualDatos) return;
        try {
            const p = obtenerParametrosUrl();
            const docId = p.tiempo === 'santos'
                ? `santo_${(p.fecha || '01_01').replace('/', '_')}_${p.libro}`
                : `${p.tiempo}_semana_${p.semana}_${p.dia}_${p.libro}`;

            if (window.firebaseAPI && window.firebaseAPI.guardarSalterioFirestore) {
                await window.firebaseAPI.guardarSalterioFirestore(docId, horaActualDatos);
                alert(`✅ Hora litúrgica '${docId}' guardada con éxito en Firestore.`);
            } else {
                alert('Firebase API no está disponible en este momento.');
            }
        } catch (e) {
            alert('Error al guardar en Firebase: ' + e.message);
        }
    });

    // Botón Exportar Respaldo Local (JSON)
    document.getElementById('btn-c-exportar-json')?.addEventListener('click', () => {
        if (!horaActualDatos) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(horaActualDatos, null, 2));
        const dl = document.createElement('a');
        dl.setAttribute("href", dataStr);
        dl.setAttribute("download", `salterio_${horaActualDatos.libro}_${horaActualDatos.dia}.json`);
        dl.click();
    });

    // Botón Generar JS de Respaldo Local
    document.getElementById('btn-c-exportar-js')?.addEventListener('click', () => {
        if (!horaActualDatos) return;
        const jsCode = `// Respaldo de Salterio generado el ${new Date().toLocaleString()}\nexport const dbSalterioHora = ${JSON.stringify(horaActualDatos, null, 2)};\n`;
        const blob = new Blob([jsCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `db-${horaActualDatos.libro}.js`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

function poblarFormularioConstructor() {
    if (!horaActualDatos) return;
    const p = obtenerParametrosUrl();
    const selTiempo = document.getElementById('c-tiempo');
    const selSemana = document.getElementById('c-semana');
    const selDia = document.getElementById('c-dia');
    const selLibro = document.getElementById('c-libro');

    if (selTiempo) selTiempo.value = p.tiempo;
    if (selSemana) selSemana.value = p.semana;
    if (selDia) selDia.value = p.dia;
    if (selLibro) selLibro.value = p.libro;
}

// Helpers para construir URLs de audio litúrgico
function construirUrlEvangelio(tiempo, semana, dia) {
    const diaMap = { domingo: 'domingo', lunes: 'lunes', martes: 'martes', miercoles: 'miercoles', jueves: 'jueves', viernes: 'viernes', sabado: 'sabado' };
    const diaRuta = diaMap[dia] || 'domingo';
    return `https://ev.resucito.do/to/${semana}/${diaRuta}.mp3`;
}

function construirUrlAudioHora(tiempo, semana, dia, libro) {
    return `https://to.resucito.do/s${semana}/${dia}/${libro}.mp3`;
}

function capitalizar(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Exportar globalmente
window.cargarYRenderizarHora = cargarYRenderizarHora;
