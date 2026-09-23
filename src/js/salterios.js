// =========================================================================
// MOTOR DEL VISOR Y CONSTRUCTOR DE SALTERIOS (salterios.js)
// =========================================================================

import { CintaLiturgica } from './cinta.js';
import { AntifonasDB } from '../data/db-antifonas.js';
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

// Decodificador del código litúrgico estándar (ej: tos24sala, tas1dola)
export function decodificarCodigoLiturgico(codigo) {
    if (!codigo || typeof codigo !== 'string') return null;
    const clean = codigo.trim().toLowerCase();
    
    // Formato con hora: ej. tos24sala, o base ej. tos24sa
    const match = clean.match(/^(to|ta|tn|tc|tp|san)(s\d+)(do|lu|ma|mi|ju|vi|sa)(of|la|te|se|no|vi|co)?$/);
    if (!match) return null;

    const mapaT = { to: 'ordinario', ta: 'adviento', tn: 'navidad', tc: 'cuaresma', tp: 'pascua', san: 'santos' };
    const mapaD = { do: 'domingo', lu: 'lunes', ma: 'martes', mi: 'miercoles', ju: 'jueves', vi: 'viernes', sa: 'sabado' };
    const mapaL = { of: 'oficio', la: 'laudes', te: 'tercia', se: 'sexta', no: 'nona', vi: 'visperas', co: 'completas' };

    return {
        tiempo: mapaT[match[1]] || 'ordinario',
        semana: parseInt(match[2].replace('s', ''), 10) || 1,
        dia: mapaD[match[3]] || 'sabado',
        libro: match[4] ? (mapaL[match[4]] || 'laudes') : 'laudes',
        codigoCompleto: clean
    };
}

// Obtener parámetros de la URL o usar valores por defecto
function obtenerParametrosUrl() {
    const search = window.location.search || '';
    const p = new URLSearchParams(search);

    // 1. Detectar si viene ?id=tos24sala, ?codigo=..., o ?laudes=tas1dola
    const posibleCodigo = p.get('id') || p.get('codigo') || p.get('laudes') || p.get('oficio') || p.get('tercia') || p.get('visperas') || p.get('completas');
    if (posibleCodigo) {
        const dec = decodificarCodigoLiturgico(posibleCodigo);
        if (dec) {
            if (p.get('libro')) dec.libro = p.get('libro');
            return dec;
        }
    }

    // 2. Manejar claves directas o combinaciones en query string (ej: ?tos24sala o ?libro=laudes&tas1dola)
    for (const [key, val] of p.entries()) {
        const decK = decodificarCodigoLiturgico(key);
        if (decK) {
            if (p.get('libro')) decK.libro = p.get('libro');
            return decK;
        }
        const decV = decodificarCodigoLiturgico(val);
        if (decV) {
            if (p.get('libro')) decV.libro = p.get('libro');
            return decV;
        }
    }

    return {
        tiempo: p.get('tiempo') || 'ordinario',
        semana: p.get('semana') ? parseInt(p.get('semana'), 10) : 24,
        dia: p.get('dia') || 'sabado',
        libro: p.get('libro') || 'laudes',
        fecha: p.get('fecha') || null,
        santo: p.get('santo') || null,
        codigoCompleto: null
    };
}

// Aplicar tema guardado en localStorage
function aplicarTemaConfigurado() {
    const tema = JSON.parse(localStorage.getItem('lh_salterio_tema') || '{}');
    if (tema.bg) document.documentElement.style.setProperty('--salterio-bg', tema.bg);
    if (tema.text) document.documentElement.style.setProperty('--salterio-text', tema.text);
    if (tema.rubrica) document.documentElement.style.setProperty('--salterio-rubrica', tema.rubrica);
    if (tema.fontSize) document.documentElement.style.setProperty('--salterio-font-size', tema.fontSize);
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
            libro: libro
        });
    } else {
        cintaInstancia.actualizarLiturgiaInfo(labelTiempo, semana, labelDia, libro);
    }

    // Cargar audios en la cinta
    const urlEvangelio = construirUrlEvangelio(tiempo, semana, dia);
    cintaInstancia.cargarEvangelio(urlEvangelio, `${labelDia}`);

    const urlAudioHora = datos.audioLibro || construirUrlAudioHora(tiempo, semana, dia, libro);
    cintaInstancia.cargarAudioLibro(urlAudioHora, libro);

    // Renderizar cuerpo del salterio
    renderizarCuerpoLiturgico(datos);
}

// Ensamblar estructura limpia usando los salmos y antífonas disponibles
function ensamblarHoraPorDefecto(tiempo, semana, dia, libro, fecha, santo) {
    const cfg = LIBROS_CONFIG[libro] || LIBROS_CONFIG.laudes;
    const salmosDB = window.SalmosDB;
    const gloria = salmosDB ? salmosDB.obtenerGloriaPatri(tiempo === 'pascua') : '';

    // Buscar antífonas de la base de datos de antífonas
    const antInvObj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'invitatoria')[0] 
                   || AntifonasDB.filtrar('ordinario', 1, dia, 'laudes', 'invitatoria')[0]
                   || { texto: 'Venid, adoremos al Señor, porque él es nuestro Dios.' };

    const ant1Obj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'salmodia_1')[0] || { texto: 'Día tras día te bendeciré, Señor.' };
    const ant2Obj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'salmodia_2')[0] || { texto: 'Canten al Señor un cántico nuevo.' };
    const ant3Obj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'salmodia_3')[0] || { texto: 'Grandes y maravillosas son tus obras, Señor.' };
    const antEvObj = AntifonasDB.filtrar(tiempo, semana, dia, libro, 'evangelico')[0] || { texto: 'Se presentó Jesús en medio de sus discípulos y les dijo: Paz a vosotros.' };

    // Determinar salmos según el libro
    let salmo1 = salmosDB ? salmosDB.obtener('salmo144') || salmosDB.obtener('salmo62_2_9') : null;
    let salmo2 = salmosDB ? salmosDB.obtener('canticoZacarias') || salmosDB.obtener('ISa2_1_10') : null;
    let salmo3 = salmosDB ? salmosDB.obtener('salmo149') || salmosDB.obtener('salmo150') : null;

    // Calcular URLs de audio para Oficio de Lectura (Par vs Impar)
    const esPar = currentYear % 2 === 0;
    const audioLectura1 = `https://to.resucito.do/s${semana}/${dia}/${esPar ? 'lectura2.mp3' : 'lectura1.mp3'}`;
    const audioLectura2 = `https://to.resucito.do/s${semana}/${dia}/lecturas.mp3`;

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
        himno: {
            titulo: 'HIMNO: ERES LA LUZ Y SIEMBRAS CLARIDADES.',
            texto: `Eres la luz y siembras claridades,\neres amor y siembras armonía\ndesde tu eternidad de eternidades.\n\nPor tu roja frescura de alegría,\nla tierra se estremece de rocío,\nHijo eterno del Padre y de María.\n\nEntro en tus esplendores, Cristo, ciego;\nmientras corre la vida paso a paso,\npongo mis horas grises en tu brazo,\ny a ti, Señor, mi corazón entrego. Amén.`
        },
        salmodia: {
            ant1: ant1Obj.texto,
            salmo1Titulo: salmo1 ? salmo1.titulo : 'Salmo 62 - EL ALMA SEDIENTA DE DIOS',
            salmo1Texto: salmo1 ? salmo1.texto : '',
            ant2: ant2Obj.texto,
            salmo2Titulo: salmo2 ? salmo2.titulo : 'Cántico: BENEFICIOS DE DIOS',
            salmo2Texto: salmo2 ? salmo2.texto : '',
            ant3: ant3Obj.texto,
            salmo3Titulo: salmo3 ? salmo3.titulo : 'Salmo 149 - ALEGRÍA DE LOS SANTOS',
            salmo3Texto: salmo3 ? salmo3.texto : ''
        },
        versiculo: {
            v: 'Hijo mío, haz caso de mi sabiduría.',
            r: 'Presta oído a mi inteligencia.'
        },
        lecturasOficio: {
            primera: {
                etiqueta: '1ra Lectura',
                audioUrl: audioLectura1,
                esPar: esPar,
                titulo: 'PRIMERA LECTURA',
                cita: 'Del libro del profeta Baruc 1, 14—2, 5; 3, 1-8',
                subtitulo: 'SÚPLICA DEL PUEBLO ARREPENTIDO',
                texto: `En aquellos días, los desterrados que habitaban en Babilonia enviaron a decir al pueblo que se encontraba en Jerusalén:\n\n«Leed este libro (de Baruc) que os enviamos para que se haga confesión en la casa del Señor, el día de la fiesta (de los Tabernáculos) y los días de la asamblea. Diréis:\n\n"Al Señor, Dios nuestro, la justicia; a nosotros en cambio la confusión del rostro, como sucede en este día; a los hombres de Judá y a los habitantes de Jerusalén, a nuestros reyes, a nuestros príncipes, a nuestros sacerdotes, a nuestros profetas y a nuestros padres. Porque hemos pecado ante el Señor, lo hemos desobedecido y no hemos escuchado la voz del Señor, Dios nuestro, siguiendo las órdenes que el Señor nos había puesto delante. Oh Señor omnipotente, Dios de Israel, escucha la oración de los muertos de Israel, pues tú te sientas en tu trono eternamente; mas nosotros por siempre perecemos."»`,
                responsorio: {
                    ref: 'Ef 2, 4-5; cf. Ba 2, 12',
                    r1: 'Dios, que es rico en misericordia, por el gran amor con que nos amó, * aun cuando estábamos muertos por nuestros pecados, nos vivificó con Cristo.',
                    v: 'Hemos pecado, hemos sido impíos, hemos cometido injusticia contra nuestro Dios, faltando a todos sus decretos.',
                    r2: 'Aun cuando estábamos muertos por nuestros pecados, nos vivificó con Cristo.'
                }
            },
            segunda: {
                etiqueta: '2da Lectura',
                audioUrl: audioLectura2,
                titulo: 'SEGUNDA LECTURA',
                cita: 'Del Sermón de san Agustín, obispo, Sobre los pastores (Sermón 46, 10-11: CCL 41, 536-538)',
                subtitulo: 'PREPÁRATE PARA LAS PRUEBAS',
                texto: `Oísteis ya qué cosas buscan los malos pastores. Considerad ahora también lo que descuidan. No fortalecéis a las débiles, ni curáis a las enfermas, ni vendáis a las heridas, es decir, a las que sufren; no recogéis las descarriadas, ni buscáis a las perdidas y maltratáis brutalmente a las fuertes, destrozándolas y llevándolas a la muerte. Pues si la oveja está enferma, es decir, si tiene el corazón enfermo, y se presenta ante ella un hombre incauto y mal preparado, la oveja puede caer en la tentación.\n\nEl pastor negligente cuando se presenta la prueba no dice a la oveja: Hijo mío, si te llegas a servir al Señor, prepárate para las pruebas; mantén el corazón firme, sé valiente. Quien de esta forma habla da ánimo al débil y hace fuerte al que flaqueaba, afianzándole de tal modo en la fe que ya no pone más su esperanza en los éxitos de este mundo. Pues si se acostumbrara a poner su esperanza en los éxitos de este mundo, estos mismos éxitos lo llevarían a la perdición, ya que al sobrevenir las adversidades se conturbaría ante ellas y aun quizá decaería totalmente. Arranca, pues, a tus ovejas de este fundamento de arena y colócalas sobre la roca; quien desee ser cristiano debe estar cimentado sobre Cristo.`,
                responsorio: {
                    ref: '1Ts 2, 4. 3',
                    r1: 'Así como hemos sido juzgados aptos por Dios para confiarnos el Evangelio, así lo predicamos. * No buscamos agradar a los hombres, sino a Dios.',
                    v: 'Nuestra exhortación no procede del error, ni de la impureza, ni con engaño.',
                    r2: 'No buscamos agradar a los hombres, sino a Dios.'
                }
            }
        },
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
        preces: {
            intro: 'Invoquemos a Cristo, en quien confían los que conocen su nombre, diciendo:',
            respuesta: 'Confirma, Señor, lo que has realizado en nosotros.',
            intenciones: [
                'Señor Jesucristo, consuelo de los humildes, dígnate sostener con tu gracia nuestra fragilidad, siempre inclinada al pecado.',
                'Que los que por nuestra debilidad estamos inclinados al mal, por tu misericordia obtengamos el perdón.',
                'Señor, a quien ofende el pecado y aplaca la penitencia, aparta de nosotros el castigo merecido por nuestros pecados.',
                'Tú que perdonaste a la mujer arrepentida y cargaste sobre los hombros la oveja descarriada, no apartes de nosotros tu misericordia.'
            ],
            libre: 'Se pueden añadir algunas intenciones libres',
            concl: 'Tú que por nosotros aceptaste el suplicio de la cruz, abre las puertas del cielo a todos los difuntos que en ti confiaron.\n\nSiguiendo las enseñanzas de Jesucristo, digamos al Padre celestial:'
        },
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
    const origenIcono = d.origenCarga === 'firebase' ? '☁️ Sincronizado de Firebase' : (d.origenCarga === 'local' ? '⚡ Cargado en Local' : '📖 Ensamblado Canónico');

    let html = '';

    // Badge sutil de estado de sincronización local
    html += `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.8rem; color: #888;">
            <span style="font-family: monospace; font-weight: 700; color: var(--salterio-rubrica);">${d.id || d.codigo || ''}</span>
            <span style="background: rgba(0,0,0,0.04); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">${origenIcono}</span>
        </div>
    `;

    // 1. TÍTULO Y SUBTÍTULO DEL LIBRO
    html += `
        <h1 class="salterio-libro-titulo">${tituloLibro}</h1>
        <div class="salterio-libro-subtitulo">${subtituloLibro}</div>
    `;

    // 2. INVITATORIO (Si corresponde a Laudes / Oficio y está activo)
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
    }

    // 3. INVOCACIÓN INICIAL (Para todas las horas excepto si ya se hizo Invitatorio)
    if (d.invocacionInicial && (!d.invitatorio || !d.invitatorio.activo)) {
        html += `
            <div class="salterio-seccion-header">INVOCACIÓN INICIAL</div>
            <div class="linea-vr"><span class="rubrica-vr">V.</span> ${d.invocacionInicial.v}</div>
            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${d.invocacionInicial.r}</div>
        `;
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

    // 6. VERSÍCULO (Oficio y Horas menores)
    if (d.versiculo && (d.libro === 'oficio' || d.libro === 'tercia' || d.libro === 'sexta' || d.libro === 'nona')) {
        html += `
            <div style="margin: 20px 0;">
                <div class="linea-vr"><span class="rubrica-vr">V.</span> ${d.versiculo.v}</div>
                <div class="linea-vr"><span class="rubrica-vr">R.</span> ${d.versiculo.r}</div>
            </div>
        `;
    }

    // 7. LECTURAS DE OFICIO (Con Reproductor Cuadrado y Texto Justificado)
    if (d.libro === 'oficio' && d.lecturasOficio) {
        // Primera Lectura
        const l1 = d.lecturasOficio.primera;
        if (l1) {
            html += `
                <div class="lectura-oficio-contenedor">
                    <span class="lectura-etiqueta-roja">${l1.etiqueta} (${currentYear % 2 === 0 ? 'Año Par' : 'Año Impar'})</span>
                    <div class="reproductor-lectura-box">
                        <audio controls class="audio-lectura-cuadrado" src="${l1.audioUrl}" preload="none"></audio>
                    </div>
                    <div class="salterio-seccion-header">${l1.titulo}</div>
                    <div class="lectura-cita-rubrica">${l1.cita}</div>
                    <div class="lectura-subtitulo-rubrica">${l1.subtitulo}</div>
                    <div class="texto-lectura-justificado">${l1.texto}</div>
                    ${l1.responsorio ? `
                        <div class="salterio-seccion-header" style="font-size: 1rem;">RESPONSORIO <span style="font-weight: normal; font-size: 0.9rem;">${l1.responsorio.ref || ''}</span></div>
                        <div class="responsorio-bloque">
                            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${l1.responsorio.r1}</div>
                            <div class="linea-vr"><span class="rubrica-vr">V.</span> ${l1.responsorio.v}</div>
                            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${l1.responsorio.r2}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Segunda Lectura
        const l2 = d.lecturasOficio.segunda;
        if (l2) {
            html += `
                <div class="lectura-oficio-contenedor">
                    <span class="lectura-etiqueta-roja">${l2.etiqueta}</span>
                    <div class="reproductor-lectura-box">
                        <audio controls class="audio-lectura-cuadrado" src="${l2.audioUrl}" preload="none"></audio>
                    </div>
                    <div class="salterio-seccion-header">${l2.titulo}</div>
                    <div class="lectura-cita-rubrica">${l2.cita}</div>
                    <div class="lectura-subtitulo-rubrica">${l2.subtitulo}</div>
                    <div class="texto-lectura-justificado">${l2.texto}</div>
                    ${l2.responsorio ? `
                        <div class="salterio-seccion-header" style="font-size: 1rem;">RESPONSORIO <span style="font-weight: normal; font-size: 0.9rem;">${l2.responsorio.ref || ''}</span></div>
                        <div class="responsorio-bloque">
                            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${l2.responsorio.r1}</div>
                            <div class="linea-vr"><span class="rubrica-vr">V.</span> ${l2.responsorio.v}</div>
                            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${l2.responsorio.r2}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        }
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
        html += `
            <div class="salterio-seccion-header">PRECES</div>
            <div class="preces-bloque">
                <div class="preces-intro">${d.preces.intro}</div>
                <div class="preces-respuesta-pueblo">${d.preces.respuesta}</div>
                ${d.preces.intenciones.map(it => `<div class="preces-intencion">${it}</div>`).join('')}
                <div class="rubrica-intenciones-libres">${d.preces.libre}</div>
                <div class="preces-intencion" style="white-space: pre-line;">${d.preces.concl}</div>
            </div>
        `;
    }

    // 11. PADRE NUESTRO DESPLEGABLE EN TEXTO PLANO
    const padreNuestroTexto = window.SalmosDB ? window.SalmosDB.obtenerPadreNuestro() : `Padre nuestro, que estás en el cielo,\nsantificado sea tu Nombre;\nvenga a nosotros tu reino;\nhágase tu voluntad en la tierra como en el cielo.\nDanos hoy nuestro pan de cada día;\nperdona nuestras ofensas,\ncomo también nosotros perdonamos a los que nos ofenden;\nno nos dejes caer en la tentación,\ny líbranos del mal. \nAmen`;

    html += `
        <div class="padre-nuestro-trigger" id="btn-padre-nuestro">
            Padre nuestro...
            <span class="material-symbols-outlined" style="font-size: 18px; vertical-align: middle; display: none;">expand_more</span>
        </div>
        <div class="padre-nuestro-expandido" id="bloque-padre-nuestro-expandido">${padreNuestroTexto}</div>
    `;

    // 12. ORACIÓN
    if (d.oracion) {
        html += `
            <div class="salterio-seccion-header">ORACIÓN</div>
            <div style="font-weight: 700; margin-bottom: 4px;">OREMOS,</div>
            <div style="margin-bottom: 20px; line-height: 1.6;">${d.oracion.texto}</div>
        `;
    }

    // 13. CONCLUSIÓN
    if (d.conclusion) {
        html += `
            <div class="salterio-seccion-header">CONCLUSIÓN</div>
            <div class="linea-vr"><span class="rubrica-vr">V.</span> ${d.conclusion.v}</div>
            <div class="linea-vr"><span class="rubrica-vr">R.</span> ${d.conclusion.r}</div>
        `;
    }

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

function inicializarConstructor() {
    const fab = document.getElementById('btn-abrir-constructor');
    const drawer = document.getElementById('constructor-drawer');
    const btnCerrar = document.getElementById('btn-cerrar-drawer');

    if (fab && drawer) {
        fab.addEventListener('click', () => {
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
