// =========================================================================
// CONTROLADOR DE LA CINTA SUPERIOR CON REPRODUCTOR CUÁDRUPLE Y HORAS (cinta.js)
// =========================================================================

import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';
import { dbAudioDescarga } from './dbaudiodescarga.js';
import { offlineAudioLh } from './offlineAudioLh.js';

export const CONFIGURACION_TIEMPOS_CINTA = {
    adviento: {
        tipo: 'semanas',
        total: 4,
        prefijoId: 'tas',
        titulo: 'Semanas de Adviento'
    },
    navidad: {
        tipo: 'semanas',
        total: 2,
        prefijoId: 'tns',
        titulo: 'Semanas de Navidad'
    },
    ordinario: {
        tipo: 'semanas',
        total: 34,
        prefijoId: 'tos',
        titulo: 'Semanas del Tiempo Ordinario'
    },
    cuaresma: {
        tipo: 'semanas',
        total: 7,
        prefijoId: 'tcs',
        titulo: 'Semanas de Cuaresma'
    },
    pascua: {
        tipo: 'semanas',
        total: 8,
        prefijoId: 'tps',
        titulo: 'Semanas de Pascua'
    },
    solemnidades: {
        tipo: 'solemnidades',
        titulo: 'Solemnidades',
        items: [
            { nombre: 'Santa María, Madre de Dios', id: 'santamariamadrededios', titulo: '1 de Enero - Santa María, Madre de Dios' },
            { nombre: 'La Epifanía del Señor', id: 'laepifaniadelSeñor', titulo: '6 de Enero - Epifania del Señor' },
            { nombre: 'Bautismo del Señor', id: 'elbautismodelSeñor', titulo: 'Domingo - Bautismo del Señor' },
            { nombre: 'San José, esposo de la Bienaventurada Virgen María', id: 'sanjose', titulo: '19 de Marzo - San José, Esposo de la Virgen María' },
            { nombre: 'La Anunciación del Señor', id: 'anunciaciondelseñor', titulo: '25 de Marzo - La Anunciación del Señor' },
            { nombre: 'Lunes de la Octava de Pascua', id: 'lunesoctavapascua', titulo: 'Lunes de la Octava de Pascua' },
            { nombre: 'Martes de la Octava de Pascua', id: 'martesoctavapascua', titulo: 'Martes de la Octava de Pascua' },
            { nombre: 'Miércoles de la Octava de Pascua', id: 'miercolesoctavapascua', titulo: 'Miércoles de la Octava de Pascua' },
            { nombre: 'Jueves de la Octava de Pascua', id: 'juevesoctavapascua', titulo: 'Jueves de la Octava de Pascua' },
            { nombre: 'Viernes de la Octava de Pascua', id: 'viernesoctavapascua', titulo: 'Viernes de la Octava de Pascua' },
            { nombre: 'Sábado de la Octava de Pascua', id: 'sabadooctavapascua', titulo: 'Sábado de la Octava de Pascua' },
            { nombre: 'La Ascensión del Señor', id: 'laascensiondelseñor', titulo: 'Domingo - La Ascensión del Señor' },
            { nombre: 'Domingo de Pentecostés', id: 'domingodepentecostes', titulo: 'Domingo - Pentecostés' },
            { nombre: 'La Santísima Trinidad', id: 'santisimatrinidad', titulo: 'Domingo - La Santísima Trinidad' },
            { nombre: 'El Cuerpo y la Sangre Santísimos de Cristo', id: 'santisimocuerpoyasangredecristo', titulo: 'Domingo - El Santísimo Cuerpo y Sangre de Cristo' },
            { nombre: 'El Sagrado Corazón de Jesús', id: 'sagradocorazondejesus', titulo: 'Viernes - Sagrado Corazón de Jesús' },
            { nombre: 'El Nacimiento de San Juan Bautista', id: 'natividaddesanjuanbautista', titulo: '24 de Junio - El Nacimiento de San Juan Bautista' },
            { nombre: 'Santos Pedro y Pablo, apóstoles', id: 'santospedroypablo', titulo: '29 de Junio - Santos Pedro y Pablo, Apóstoles' },
            { nombre: 'La Asunción de la Santísima Virgen María', id: 'asunciondelavirgenmaria', titulo: '15 de Agosto - La Asunción de la Santísima Virgen María' },
            { nombre: 'Todos los Santos', id: 'todoslossantos', titulo: '1 de Noviembre - Todos los Santos' },
            { nombre: 'Nuestro Señor Jesucristo, Rey del Universo', id: 'jesucristoreydeluniverso', titulo: 'Domingo - Nuestro Señor Jesucristo, Rey del Universo' },
            { nombre: 'La Inmaculada Concepción de la Bienaventurada Virgen María', id: 'inmaculadaconcepcion', titulo: '8 de Diciembre - La Inmaculada Concepción' },
            { nombre: 'La Natividad del Señor', id: 'lanatividaddelseñor', titulo: '25 de Diciembre - La Natividad del Señor' }
        ]
    },
    fiestas: {
        tipo: 'fiestas',
        titulo: 'Fiestas',
        items: [
            { nombre: 'La Presentación del Señor', id: 'presentaciondelseñor', titulo: '2 de Febrero - La Presentación del Señor' },
            { nombre: 'San Marcos, evangelista', id: 'sanmarcos', titulo: '25 de Abril - San Marcos, Evangelista' },
            { nombre: 'San Matías, apóstol', id: 'sanmatias', titulo: '14 de Mayo - San Matías, Apóstol' },
            { nombre: 'Santo Tomás, apóstol', id: 'santotomas', titulo: '3 de Julio - Santo Tomás, Apóstol' },
            { nombre: 'Santa María Magdalena', id: 'santamariamagdalena', titulo: '22 de Julio - Santa María Magdalena' },
            { nombre: 'Santiago, apóstol', id: 'santiagoapostol', titulo: '25 de Julio - Santiago, Apóstol' },
            { nombre: 'La Transfiguración del Señor', id: 'transfiguraciondelseñor', titulo: '6 de Agosto - La Transfiguración del Señor' },
            { nombre: 'San Lorenzo, diácono y mártir', id: 'sanlorenzo', titulo: '10 de Agosto - San Lorenzo, Diácono y Mártir' },
            { nombre: 'San Bartolomé, apóstol', id: 'sanbartolome', titulo: '24 de Agosto - San Bartolomé, Apóstol' },
            { nombre: 'La Natividad de la Bienaventurada Virgen María', id: 'natividaddelavirgenmaria', titulo: '8 de Septiembre - La Natividad de la Virgen María' },
            { nombre: 'La Exaltación de la Santa Cruz', id: 'exaltaciondelasantacruz', titulo: '14 de Septiembre - La Exaltación de la Santa Cruz' },
            { nombre: 'San Mateo, apóstol y evangelista', id: 'sanmateo', titulo: '21 de Septiembre - San Mateo, Apóstol y Evangelista' },
            { nombre: 'Santos Miguel, Gabriel y Rafael, arcángeles', id: 'santosarcangeles', titulo: '29 de Septiembre - Santos Arcángeles Miguel, Gabriel y Rafael' },
            { nombre: 'Santos Simón y Judas, apóstoles', id: 'santossimonyjudas', titulo: '28 de Octubre - Santos Simón y Judas, Apóstoles' },
            { nombre: 'La Dedicación de la Basílica de Letrán', id: 'dedicacionbasilicaletran', titulo: '9 de Noviembre - La Dedicación de la Basílica de Letrán' },
            { nombre: 'San Andrés, apóstol', id: 'sanandres', titulo: '30 de Noviembre - San Andrés, Apóstol' },
            { nombre: 'San Esteban, protomártir', id: 'sanesteban', titulo: '26 de Diciembre - San Esteban, Protomártir' },
            { nombre: 'La Sagrada Familia de Jesús, María y José', id: 'sagradafamilia', titulo: 'Domingo - La Sagrada Familia' },
            { nombre: 'Los Santos Inocentes, mártires', id: 'santosinocentes', titulo: '28 de Diciembre - Los Santos Inocentes, Mártires' }
        ]
    },
    santos: {
        tipo: 'meses',
        titulo: 'Fiestas de los Santos por Mes',
        meses: [
            { nombre: 'Enero', slug: 'enero' },
            { nombre: 'Febrero', slug: 'febrero' },
            { nombre: 'Marzo', slug: 'marzo' },
            { nombre: 'Abril', slug: 'abril' },
            { nombre: 'Mayo', slug: 'mayo' },
            { nombre: 'Junio', slug: 'junio' },
            { nombre: 'Julio', slug: 'julio' },
            { nombre: 'Agosto', slug: 'agosto' },
            { nombre: 'Septiembre', slug: 'septiembre' },
            { nombre: 'Octubre', slug: 'octubre' },
            { nombre: 'Noviembre', slug: 'noviembre' },
            { nombre: 'Diciembre', slug: 'diciembre' }
        ]
    }
};

function generarSlugSantoCinta(nombre) {
    if (!nombre) return '';
    return nombre.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

function obtenerCatalogoCompletoSantosCinta() {
    let catalogo = [];
    try {
        catalogo = JSON.parse(localStorage.getItem('lh_catalogo_nombres_santos')) || [];
    } catch (_) {}
    if (!Array.isArray(catalogo)) catalogo = [];

    const mapaCatalogo = new Map();
    if (Array.isArray(catalogoSantosAnual)) {
        catalogoSantosAnual.forEach(s => {
            if (s && s.nombre) mapaCatalogo.set(s.nombre.toLowerCase().trim(), s);
        });
    }
    catalogo.forEach(s => {
        if (s && s.nombre) {
            const clave = s.nombre.toLowerCase().trim();
            const prev = mapaCatalogo.get(clave);
            mapaCatalogo.set(clave, prev ? { ...prev, ...s, imagen: s.imagen || prev.imagen || '' } : s);
        }
    });
    return mapaCatalogo;
}

function resolverCodigoHoraSantoCinta(dia, mes, nombreSanto, libro, sufijo) {
    const slug = generarSlugSantoCinta(nombreSanto);
    const diaPad = String(dia).padStart(2, '0');
    const mesPad = String(mes).padStart(2, '0');
    const idSantoBase = `sa${diaPad}${mesPad}${slug}`;

    const mapaCatalogo = obtenerCatalogoCompletoSantosCinta();
    const santoObj = mapaCatalogo.get((nombreSanto || '').toLowerCase().trim());

    let codigos = {};
    if (santoObj && (santoObj.codigosLiturgia || santoObj.liturgias)) {
        codigos = { ...(santoObj.codigosLiturgia || santoObj.liturgias) };
    }

    try {
        const raw1 = localStorage.getItem(`lh_santo_codigos_${idSantoBase}`);
        if (raw1) codigos = { ...JSON.parse(raw1), ...codigos };
        const raw2 = localStorage.getItem(`lh_santo_codigos_${slug}`);
        if (raw2) codigos = { ...JSON.parse(raw2), ...codigos };
    } catch (_) {}

    const libroKey = libro === 'visperas' ? 'vispera' : libro;
    if (codigos[libro] && codigos[libro].codigo) {
        return codigos[libro].codigo;
    }
    if (codigos[libroKey] && codigos[libroKey].codigo) {
        return codigos[libroKey].codigo;
    }

    return `${idSantoBase}${sufijo}`;
}

export const MODOS_AUDIO = {
    evangelio: {
        id: 'evangelio',
        icono: '✞',
        nombre: 'Evangelio del Día',
        subtituloDefault: 'Evangelio de hoy',
        claseBtn: 'modo-evangelio',
        claseBadge: 'badge-evangelio'
    },
    hora: {
        id: 'hora',
        icono: '🙏',
        nombre: 'Liturgia de las Horas',
        subtituloDefault: 'Lector de voz de la hora actual',
        claseBtn: 'modo-hora',
        claseBadge: 'badge-hora'
    },
    lectura1: {
        id: 'lectura1',
        icono: '1️⃣',
        nombre: '1ª Lectura del Oficio',
        subtituloDefault: 'Año Par / Impar',
        claseBtn: 'modo-lectura1',
        claseBadge: 'badge-lectura1'
    },
    lectura2: {
        id: 'lectura2',
        icono: '2️⃣',
        nombre: '2ª Lectura del Oficio',
        subtituloDefault: 'Lectura patrística',
        claseBtn: 'modo-lectura2',
        claseBadge: 'badge-lectura2'
    }
};

export const PASOS_VELOCIDAD = [-50, -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

// =========================================================================
// CONFIGURACIÓN Y HELPER DE VOCES TTS (COMPATIBLE CON AJUSTES Y SANTOS)
// =========================================================================

// Precalentar voces en navegadores basados en Chromium
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}

export function obtenerVozConfigurada() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    if (typeof dbAudioDescarga !== 'undefined' && typeof dbAudioDescarga.resolverVozNativa === 'function') {
        const v = dbAudioDescarga.resolverVozNativa();
        if (v) return v;
    }
    if (window.dbAudioDescarga && typeof window.dbAudioDescarga.resolverVozNativa === 'function') {
        const v = window.dbAudioDescarga.resolverVozNativa();
        if (v) return v;
    }

    let vozGuardada = localStorage.getItem('pref-tts-voice') || '';
    if (vozGuardada && (vozGuardada.toLowerCase().includes('raul') || vozGuardada.toLowerCase().includes('sabina') || vozGuardada.toLowerCase().includes('jorge') || vozGuardada.toLowerCase().includes('dalia'))) {
        try { localStorage.removeItem('pref-tts-voice'); } catch (_) {}
        vozGuardada = '';
    }

    const voices = window.speechSynthesis.getVoices() || [];
    let vozElegida = null;

    if (vozGuardada) {
        const vg = vozGuardada.toLowerCase();
        const esEEUU = vg.includes('estados unidos') || vg.includes('es-us') || vg.includes('mujer');
        vozElegida = voices.find(v => v.name === vozGuardada || v.name.toLowerCase() === vg);

        if (!vozElegida) {
            if (esEEUU) {
                vozElegida = voices.find(v => {
                    const vn = v.name.toLowerCase();
                    return vn.includes('google') && (vn.includes('estados unidos') || (v.lang || '').toLowerCase().startsWith('es-us'));
                });
            } else {
                vozElegida = voices.find(v => {
                    const vn = v.name.toLowerCase();
                    return vn.includes('google') && vn.includes('español') && !vn.includes('estados unidos');
                });
            }
        }
    }

    if (!vozElegida) {
        vozElegida = voices.find(v => {
            const vn = v.name.toLowerCase();
            return vn.includes('google') && vn.includes('español') && !vn.includes('estados unidos');
        })
        || voices.find(v => v.name.toLowerCase().includes('google') && (v.name.toLowerCase().includes('estados unidos') || (v.lang || '').toLowerCase().startsWith('es-us')))
        || voices.find(v => (v.lang || '').toLowerCase().startsWith('es'));
    }
    return vozElegida;
}

export function obtenerRateConfigurado(esLiturgia = true) {
    if (typeof window === 'undefined') return 1.0;
    const rateGuardado = localStorage.getItem('pref-tts-rate');
    // Si no está configurado o tenía el 1.3 forzado por versiones previas, establecer 1 por defecto
    if (rateGuardado === null || rateGuardado === '1.3') {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pref-tts-rate', '1');
        }
        return 1.0;
    }
    const r = parseFloat(rateGuardado);
    if (!isNaN(r) && r >= 0.5 && r <= 2.0) return r;
    return 1.0;
}

export function resolverNombreLibroBiblico(cita = '') {
    if (!cita) return 'de la Sagrada Escritura';
    const clean = cita.trim();
    const siglaMatch = clean.match(/^([0-9]?\s*[A-Za-zÁ-ú]+)/);
    const sigla = siglaMatch ? siglaMatch[1].replace(/\s+/g, '').toLowerCase() : '';

    const MAPA_LIBROS = {
        'is': 'del profeta Isaías',
        'isa': 'del profeta Isaías',
        'isaias': 'del profeta Isaías',
        'jer': 'del profeta Jeremías',
        'lam': 'del libro de las Lamentaciones',
        'bar': 'del profeta Baruc',
        'ez': 'del profeta Ezequiel',
        'dan': 'del profeta Daniel',
        'os': 'del profeta Oseas',
        'jl': 'del profeta Joel',
        'am': 'del profeta Amós',
        'abd': 'del profeta Abdías',
        'jon': 'del profeta Jonás',
        'miq': 'del profeta Miqueas',
        'nah': 'del profeta Nahúm',
        'hab': 'del profeta Habacuc',
        'sof': 'del profeta Sofonías',
        'hag': 'del profeta Ageo',
        'zac': 'del profeta Zacarías',
        'mal': 'del profeta Malaquías',
        'rm': 'de la carta del apóstol san Pablo a los Romanos',
        'rom': 'de la carta del apóstol san Pablo a los Romanos',
        '1co': 'de la primera carta del apóstol san Pablo a los Corintios',
        '1cor': 'de la primera carta del apóstol san Pablo a los Corintios',
        '2co': 'de la segunda carta del apóstol san Pablo a los Corintios',
        '2cor': 'de la segunda carta del apóstol san Pablo a los Corintios',
        'ga': 'de la carta del apóstol san Pablo a los Gálatas',
        'gal': 'de la carta del apóstol san Pablo a los Gálatas',
        'ef': 'de la carta del apóstol san Pablo a los Efesios',
        'flp': 'de la carta del apóstol san Pablo a los Filipenses',
        'fil': 'de la carta del apóstol san Pablo a los Filipenses',
        'col': 'de la carta del apóstol san Pablo a los Colosenses',
        '1ts': 'de la primera carta del apóstol san Pablo a los Tesalonicenses',
        '1tes': 'de la primera carta del apóstol san Pablo a los Tesalonicenses',
        '2ts': 'de la segunda carta del apóstol san Pablo a los Tesalonicenses',
        '2tes': 'de la segunda carta del apóstol san Pablo a los Tesalonicenses',
        '1tm': 'de la primera carta del apóstol san Pablo a Timoteo',
        '1tim': 'de la primera carta del apóstol san Pablo a Timoteo',
        '2tm': 'de la segunda carta del apóstol san Pablo a Timoteo',
        '2tim': 'de la segunda carta del apóstol san Pablo a Timoteo',
        'tt': 'de la carta del apóstol san Pablo a Tito',
        'tit': 'de la carta del apóstol san Pablo a Tito',
        'flm': 'de la carta del apóstol san Pablo a Filemón',
        'hb': 'de la carta a los Hebreos',
        'heb': 'de la carta a los Hebreos',
        'sant': 'de la carta del apóstol Santiago',
        'stgo': 'de la carta del apóstol Santiago',
        '1p': 'de la primera carta del apóstol san Pedro',
        '1pe': 'de la primera carta del apóstol san Pedro',
        '2p': 'de la segunda carta del apóstol san Pedro',
        '2pe': 'de la segunda carta del apóstol san Pedro',
        '1jn': 'de la primera carta del apóstol san Juan',
        '2jn': 'de la segunda carta del apóstol san Juan',
        '3jn': 'de la tercera carta del apóstol san Juan',
        'jud': 'de la carta del apóstol san Judas',
        'ap': 'del libro del Apocalipsis',
        'gn': 'del libro del Génesis',
        'ex': 'del libro del Éxodo',
        'dt': 'del libro del Deuteronomio',
        'sab': 'del libro de la Sabiduría',
        'eclo': 'del libro del Eclesiástico'
    };

    return MAPA_LIBROS[sigla] || `del libro de ${clean.replace(/[\d,.\s-]+$/, '')}`;
}

export function limpiarTextoParaVoz(texto = '') {
    if (!texto) return '';
    return texto
        .replace(/ANT[IÍ]FONA\s+FINAL\s+DE\s+LA\s+SANT[IÍ]SIMA\s+VIRGEN/gi, 'Antífona final de la Santísima Virgen.')
        .replace(/ANT[IÍ]FONA\s+FINAL/gi, 'Antífona final.')
        .replace(/\bANT[IÍ]FONA\s+(\d+)\b/gi, 'Antífona $1.')
        .replace(/\bANT[IÍ]FONA\b/g, 'Antífona.')
        .replace(/\bSALMODIA\b/g, 'Salmodia.')
        .replace(/\bPRECES\b/g, 'Preces.')
        .replace(/\bBENDICI[OÓ]N\b/g, 'Bendición.')
        .replace(/\bCONCLUSI[OÓ]N\b/g, 'Conclusión.')
        .replace(/\bORACI[OÓ]N\b/g, 'Oración.')
        .replace(/\bHIMNO\b/g, 'Himno.')
        .replace(/\[?\s*\(?\s*no\s+se\s+dice\s+(?:el\s+)?(?:«|"|'|“)?gloria\s+al\s+padre(?:»|"|'|”)?(?:\s|[^a-záéíóúüñ\n])*/gi, '') // Omitir "No se dice Gloria al Padre"
        .replace(/\([^\)]*\)/g, '') // Eliminar notas parentéticas
        .replace(/[*✦]/g, '')       // Eliminar asteriscos y cruces de pausa métrica
        .replace(/^[℟R]\/?\.\s*/gi, '') // Omitir R. o ℟. al inicio
        .replace(/\b[℟R]\/?\.\s*/gi, '')   // Omitir R.
        .replace(/^[℣V]\/?\.\s*/gi, '') // Omitir V. o ℣. al inicio
        .replace(/\b[℣V]\/?\.\s*/gi, '')   // Omitir V.
        .replace(/\bAnt\.\s*/gi, '') // Omitir Ant.
        .replace(/\bN:\./g, 'N.')     // Convertir N:. a N. para voz limpia
        .replace(/\bN:(?!\w)/g, 'N')   // Convertir N: a N para voz limpia
        .replace(/[«»"“”]/g, '')    // Omitir comillas que puedan interferir con TTS
        .replace(/\s+/g, ' ')
        .trim();
}

export function construirSegmentosResponsorio(r1 = '', v = '', r2 = '') {
    const segmentos = [];
    if (!r1 && !v && !r2) return segmentos;

    let respuesta = '';
    if (r1 && r1.includes('*')) {
        const partes = r1.split('*');
        respuesta = partes[1].trim();
    } else if (r2) {
        respuesta = r2.trim();
    } else if (r1) {
        respuesta = r1.trim();
    }

    const respLimpia = limpiarTextoParaVoz(respuesta).replace(/[.,;:»«"“”‘’]+$/, '').trim();
    let r1Limpio = limpiarTextoParaVoz(r1).replace(/[.,;:»«"“”‘’]+$/, '').trim();
    if (r1Limpio && !/[.!?]$/.test(r1Limpio)) r1Limpio += '.';
    let vLimpio = limpiarTextoParaVoz(v).replace(/[.,;:»«"“”‘’]+$/, '').trim();
    if (vLimpio && !/[.!?]$/.test(vLimpio)) vLimpio += '.';

    segmentos.push({ texto: "Responsorio." });

    if (respLimpia) {
        segmentos.push({ texto: `Responderemos: ${respLimpia}.` });
    }

    if (r1Limpio) {
        const r1Proclamado = r1Limpio.replace(/\s*\*\s*/g, ', ');
        segmentos.push({ texto: r1Proclamado });
    }

    if (respLimpia) {
        segmentos.push({ texto: `${respLimpia}.` });
    }

    if (vLimpio) {
        segmentos.push({ texto: vLimpio });
        if (respLimpia) {
            segmentos.push({ texto: `${respLimpia}.` });
        }
    }

    return segmentos;
}

export function dividirEnFrasesLectura(texto, maxLen = 140) {
    if (!texto || !texto.trim()) return [];

    const limpio = texto
        .replace(/[“”«»]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/—/g, ', ')
        .replace(/\u00A0/g, ' ')
        .trim();

    const chunks = [];
    const oraciones = limpio.match(/[^.!?;\n]+[.!?;\n]*|\s+/g) || [limpio];

    let curChunk = '';
    let curStart = 0;
    let runningIdx = 0;

    const agregarTrozo = (trozo, start, end) => {
        trozo = (trozo || '').trim();
        if (!trozo) return;
        if (trozo.length <= maxLen) {
            chunks.push({ text: trozo, start: start, end: end });
            return;
        }
        // Subdividir por comas, dos puntos o punto y coma
        const subPartes = trozo.match(/[^,;:]+[,;:]*|\s+/g) || [trozo];
        let subCur = '';
        let subStart = start;
        let subRunning = start;
        for (const sp of subPartes) {
            const spLen = sp.length;
            if ((subCur.length + spLen) > maxLen && subCur.trim().length > 0) {
                agregarTrozo(subCur, subStart, subStart + subCur.length);
                subStart = subRunning;
                subCur = sp;
            } else {
                if (!subCur) subStart = subRunning;
                subCur += sp;
            }
            subRunning += spLen;
        }
        if (subCur.trim().length > 0) {
            if (subCur.trim().length > maxLen) {
                // Si aún supera maxLen, dividir por palabras
                const palabras = subCur.trim().split(/\s+/);
                let pCur = '';
                let pStart = subStart;
                for (const p of palabras) {
                    if ((pCur.length + p.length + 1) > maxLen && pCur.length > 0) {
                        chunks.push({ text: pCur.trim(), start: pStart, end: pStart + pCur.length });
                        pStart += pCur.length + 1;
                        pCur = p;
                    } else {
                        pCur += (pCur ? ' ' : '') + p;
                    }
                }
                if (pCur.trim()) {
                    chunks.push({ text: pCur.trim(), start: pStart, end: end });
                }
            } else {
                chunks.push({ text: subCur.trim(), start: subStart, end: end });
            }
        }
    };

    for (const seg of oraciones) {
        const segLen = seg.length;
        if (curChunk.length + segLen > maxLen && curChunk.trim().length > 0) {
            agregarTrozo(curChunk, curStart, curStart + curChunk.length);
            curStart = runningIdx;
            curChunk = seg;
        } else {
            if (!curChunk) curStart = runningIdx;
            curChunk += seg;
        }
        runningIdx += segLen;
    }

    if (curChunk.trim().length > 0) {
        agregarTrozo(curChunk, curStart, limpio.length);
    }

    return chunks;
}

// =========================================================================
// CLASE PRINCIPAL CINTA LITÚRGICA
// =========================================================================

export class CintaLiturgica {
    constructor(contenedorId = 'cinta-container', opciones = {}) {
        this.contenedor = typeof contenedorId === 'string' ? document.getElementById(contenedorId) : contenedorId;
        this.opciones = {
            tiempo: 'Tiempo Ordinario',
            semana: 25,
            dia: 'Lunes',
            libro: 'laudes',
            tiempoSlug: 'ordinario',
            diaSlug: 'lunes',
            textoMetadatos: null,
            baseCelebracionId: '',
            ...opciones
        };

        // Estado del Reproductor y Modo Activo (Por defecto: Lector de voz / Texto a voz)
        let modoDefecto = 'hora';
        try {
            const guardado = localStorage.getItem('pref-audio-modo-defecto');
            if (guardado && MODOS_AUDIO[guardado]) {
                modoDefecto = guardado;
            }
        } catch (_) {}
        this.modoActivo = modoDefecto;

        if (typeof window !== 'undefined') {
            window.cinta = this;
            window.cintaInstancia = this;
        }
        // Ciclo de lectura para Oficio: 'par' (Año II) o 'impar' (Año I) según el calendario real (2026 = Par / II)
        const anioActual = new Date().getFullYear();
        this.cicloAnio = (typeof window !== 'undefined' && window.__cicloAnioOficio)
            ? window.__cicloAnioOficio
            : (anioActual % 2 === 0 ? 'par' : 'impar');
        if (typeof window !== 'undefined') {
            window.__cicloAnioOficio = this.cicloAnio;
        }
        this.audios = {
            evangelio: '',
            hora: '',
            lectura1: '',
            lectura2: ''
        };
        this.subtitulos = {
            evangelio: '',
            hora: '',
            lectura1: '',
            lectura2: ''
        };
        // Registro de URLs de audio que devolvieron 404 o error para fallback inmediato a TTS
        this.audiosFallidos = new Set();
        this.fuenteActiva = null; // 'audio' | 'tts'

        // Reproductor de Audio HTML5 (para Evangelio, Lectura 1, Lectura 2 y Rezo de las Horas)
        this.audio = new Audio();
        this.audio.autoplay = false;

        // Cancelar cualquier locución TTS residual del navegador al iniciar o navegar
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
            } catch (_) {}
            window.addEventListener('beforeunload', () => {
                try {
                    window.speechSynthesis.cancel();
                } catch (_) {}
            });
        }

        // Motor de Texto a Voz (TTS) para el Rezo de las Horas (segundo icono)
        this.ttsState = {
            fullText: '',
            chunks: [],
            currentChunkIndex: 0,
            currentCharIndex: 0,
            isSpeaking: false,
            heartbeatId: null,
            timerId: null,
            totalDurationSecs: 0
        };

        // Control de Zoom con fórmula: font-size: calc(var(--size) * var(--font-zoom));
        // Base: --size: 16px, --font-zoom: 1 (rango de 10px a 50px => fontZoom entre 0.625 y 3.125)
        const guardadoZoom = parseFloat(localStorage.getItem('lh_font_zoom'));
        if (!isNaN(guardadoZoom) && guardadoZoom >= 0.625 && guardadoZoom <= 3.125) {
            this.fontZoom = guardadoZoom;
        } else {
            const guardadoSize = parseInt(localStorage.getItem('lh_font_size'), 10);
            this.fontZoom = (!isNaN(guardadoSize) && guardadoSize >= 10 && guardadoSize <= 50) ? (guardadoSize / 16) : 1.0;
        }
        this.aplicarTamanoTexto(this.fontZoom);

        // Sincronizar tamaño desde Firebase al inicializar o autenticar
        const sincronizarZoomDesdeFirebase = async () => {
            if (window.firebaseAPI && window.firebaseAPI.cargarAjustesFirestore) {
                try {
                    const datos = await window.firebaseAPI.cargarAjustesFirestore('cinta_zoom');
                    if (datos && (datos.fontZoom !== undefined || datos.fontSize !== undefined)) {
                        let zoomRemoto = datos.fontZoom !== undefined ? parseFloat(datos.fontZoom) : (parseFloat(datos.fontSize) / 16);
                        if (!isNaN(zoomRemoto) && zoomRemoto >= 0.625 && zoomRemoto <= 3.125) {
                            this.fontZoom = zoomRemoto;
                            localStorage.setItem('lh_font_zoom', this.fontZoom.toFixed(4));
                            localStorage.setItem('lh_font_size', String(Math.round(this.fontZoom * 16)));
                            this.aplicarTamanoTexto(this.fontZoom);
                            console.log(`☁️ [Cinta] Tamaño de texto sincronizado desde Firebase: ${Math.round(this.fontZoom * 16)}px`);
                        }
                    }
                } catch (err) {
                    console.warn("⚠️ Aviso al sincronizar tamaño de texto desde Firebase:", err);
                }
            }
        };

        if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
            window.firebaseAPI.onAuthReady(sincronizarZoomDesdeFirebase);
        } else {
            const checkAuth = setInterval(() => {
                if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
                    window.firebaseAPI.onAuthReady(sincronizarZoomDesdeFirebase);
                    clearInterval(checkAuth);
                }
            }, 500);
            setTimeout(() => clearInterval(checkAuth), 8000);
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'lh_font_zoom' || e.key === 'lh_font_size') {
                const z = parseFloat(localStorage.getItem('lh_font_zoom'));
                if (!isNaN(z) && z >= 0.625 && z <= 3.125 && z !== this.fontZoom) {
                    this.fontZoom = z;
                    this.aplicarTamanoTexto(this.fontZoom);
                }
            }
        });

        this.render();
        this.vincularEventos();

        // Aplicar velocidad inicial según el modo activo:
        // Velocidad normal por defecto en 0 (1.00x)
        this.establecerVelocidadSegunModo(this.modoActivo);
    }

    formatearTextoMetadatos(semana, dia) {
        if (this.opciones.textoMetadatos) {
            return this.opciones.textoMetadatos;
        }
        const slugT = (this.opciones.tiempoSlug || '').toLowerCase();
        const tiempoStr = (this.opciones.tiempo || '').toLowerCase();
        const celebracionesSlugs = ['santos', 'solemnidades', 'fiestas'];
        if (celebracionesSlugs.includes(slugT) || celebracionesSlugs.includes(tiempoStr)) {
            if (dia) return dia;
            if (slugT === 'solemnidades' || tiempoStr === 'solemnidades') return 'Solemnidades';
            if (slugT === 'fiestas' || tiempoStr === 'fiestas') return 'Fiestas';
            return 'Santos';
        }
        if (!semana) return dia || '';
        const numSemana = String(semana).replace(/^semana\s*/i, '').replace(/^sem\s*/i, '').trim();
        return `<span class="lbl-semana-larga">Semana</span><span class="lbl-semana-corta">SEM</span> ${numSemana} • ${dia}`;
    }

    formatearTextoTiempo(tiempo) {
        const t = (tiempo || 'Tiempo Ordinario').toString().trim();
        const tUpper = t.toUpperCase();
        if (tUpper === 'TIEMPO ORDINARIO' || t.toLowerCase() === 'ordinario') {
            return `<span class="lbl-tiempo-largo">TIEMPO ORDINARIO</span><span class="lbl-tiempo-corto">T.ORDINARIO</span>`;
        }
        return tUpper;
    }

    render() {
        if (!this.contenedor) return;

        const {
            tiempo = 'Tiempo Ordinario',
            semana = 25,
            dia = 'Lunes',
            libro = 'laudes',
            tiempoSlug = 'ordinario',
            diaSlug = 'lunes'
        } = this.opciones;

        const horas = [
            { id: 'oficio', label: 'Oficio' },
            { id: 'laudes', label: 'Laudes' },
            { id: 'tercia', label: 'Tercia' },
            { id: 'sexta', label: 'Sexta' },
            { id: 'nona', label: 'Nona' },
            { id: 'visperas', label: 'Vísperas' },
            { id: 'completas', label: 'Completas' }
        ];

        const slugTiempo = (tiempoSlug || 'ordinario').toLowerCase();
        const mapT = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp', santos: 'san', solemnidades: 'sol', fiestas: 'fie' };
        const mapD = { domingo: 'do', lunes: 'lu', martes: 'ma', miercoles: 'mi', jueves: 'ju', viernes: 'vi', sabado: 'sa' };
        const mapH = { oficio: 'of', laudes: 'la', tercia: 'te', sexta: 'se', nona: 'no', visperas: 'vi', completas: 'co' };
        const tCode = mapT[slugTiempo] || 'to';
        const dCode = mapD[diaSlug] || 'do';
        const semPad = String(semana).padStart(2, '0');

        const horaBtnsHtml = horas.map(h => {
            const activo = (libro.toLowerCase() === h.id.toLowerCase()) ? 'activo' : '';
            const hCode = mapH[h.id] || 'la';
            let href = '';
            if (slugTiempo === 'santos' || slugTiempo === 'solemnidades' || slugTiempo === 'fiestas') {
                const baseId = this.opciones.baseCelebracionId || (diaSlug || '').replace(/(of|la|te|se|no|vi|co)$/i, '') || 'sa0101santamariamadrededios';
                const sParam = this.opciones.santo ? `&santo=${encodeURIComponent(this.opciones.santo)}` : '';
                const fParam = this.opciones.fecha ? `&fecha=${encodeURIComponent(this.opciones.fecha)}` : '';
                href = `salterios.html?tiempo=santos&libro=${h.id}&id=${baseId}${hCode}${sParam}${fParam}`;
            } else {
                const docId = `${tCode}s${semPad}${dCode}${hCode}`;
                href = `?tiempo=${slugTiempo}&semana=${semana}&dia=${diaSlug}&libro=${h.id}&hora=${h.id}&id=${docId}`;
            }
            return `<a href="${href}" class="cinta-btn-hora ${activo}" data-libro="${h.id}">${h.label}</a>`;
        }).join('');

        this.contenedor.innerHTML = `
            <div class="cinta-top-bar" id="cinta-top-bar">
                <!-- Fila 1: Metadatos, Zoom y Selector de Iglesia -->
                <div class="cinta-fila-sup">
                    <div class="cinta-sup-izq">
                        <button type="button" class="cinta-badge-tiempo tiempo-${slugTiempo}" id="btn-toggle-tiempo" title="Toca para ocultar o mostrar el reproductor y las horas">
                            ${this.formatearTextoTiempo(tiempo)}
                        </button>
                        <span class="cinta-texto-metadatos" id="cinta-texto-metadatos" title="Toca para seleccionar semana o celebración">${this.formatearTextoMetadatos(semana, dia)}</span>
                        <div class="cinta-zoom-controles">
                            <button type="button" class="cinta-btn-zoom" id="btn-zoom-menos" title="Disminuir tamaño de letra">−</button>
                            <button type="button" class="cinta-btn-zoom" id="btn-zoom-mas" title="Aumentar tamaño de letra">+</button>
                            <span class="cinta-zoom-valor" id="cinta-zoom-valor" title="Doble clic para restablecer tamaño (16px)">${Math.round(this.fontZoom * 16)}px</span>
                        </div>
                        <div class="cinta-velocidad-box" id="cinta-velocidad-box">
                            <button type="button" class="cinta-btn-velocidad" id="btn-cinta-velocidad" title="Velocidad">x1</button>
                            <div class="cinta-velocidad-popover" id="cinta-velocidad-popover">
                                <div class="cinta-velocidad-lista">
                                    ${this.generarPasosVelocidadHtml()}
                                </div>
                            </div>
                        </div>
                        <div class="cinta-scroll-controles">
                            <button type="button" class="cinta-btn-scroll" id="btn-scroll-arriba" title="Ir hasta arriba" aria-label="Ir hasta arriba">
                                <span class="material-symbols-outlined">arrow_upward</span>
                            </button>
                            <button type="button" class="cinta-btn-scroll" id="btn-scroll-abajo" title="Ir hasta el final" aria-label="Ir hasta el final">
                                <span class="material-symbols-outlined">arrow_downward</span>
                            </button>
                        </div>
                    </div>

                    <div class="cinta-sup-der">
                        <button type="button" class="cinta-btn-ciclo-anio ${libro.toLowerCase() === 'oficio' ? 'visible' : ''}" id="btn-ciclo-anio" title="${this.cicloAnio === 'par' ? 'Año II (Par) - Toca para cambiar a Año I (Impar)' : 'Año I (Impar) - Toca para cambiar a Año II (Par)'}">${this.cicloAnio === 'par' ? 'II' : 'I'}</button>
                        <button type="button" class="cinta-btn-iglesia" id="btn-iglesia-selector" title="Seleccionar fuente de audio">
                            <span class="material-symbols-outlined">church</span>
                        </button>

                        <!-- Menú Desplegable con Efecto Slide-Down -->
                        <div class="cinta-menu-audios" id="cinta-menu-audios">
                            <div class="cinta-menu-item ${this.modoActivo === 'evangelio' ? 'activo' : ''}" data-modo="evangelio" role="button" tabindex="0">
                                <span class="cinta-item-badge badge-evangelio">✞</span>
                                <div class="cinta-item-info">
                                    <div class="cinta-item-titulo">Evangelio del Día</div>
                                    <div class="cinta-item-sub" id="menu-sub-evangelio">Blanco con flecha negra</div>
                                </div>
                                <button type="button" class="cinta-btn-offline" data-offline-modo="evangelio" title="Descargar audio para escuchar sin internet">
                                    <span class="material-symbols-outlined">download</span>
                                </button>
                            </div>
                            <div class="cinta-menu-item ${this.modoActivo === 'hora' ? 'activo' : ''}" data-modo="hora" role="button" tabindex="0">
                                <span class="cinta-item-badge badge-hora">🙏</span>
                                <div class="cinta-item-info">
                                    <div class="cinta-item-titulo">Liturgia de la Hora (${libro.toUpperCase()})</div>
                                    <div class="cinta-item-sub" id="menu-sub-hora">Lector de voz (Azul con flecha blanca)</div>
                                </div>
                                <button type="button" class="cinta-btn-offline" data-offline-modo="hora" title="Descargar audio para escuchar sin internet">
                                    <span class="material-symbols-outlined">download</span>
                                </button>
                            </div>
                            <div class="cinta-menu-item ${this.modoActivo === 'lectura1' ? 'activo' : ''}" data-modo="lectura1" role="button" tabindex="0">
                                <span class="cinta-item-badge badge-lectura1">1️⃣</span>
                                <div class="cinta-item-info">
                                    <div class="cinta-item-titulo">1ª Lectura del Oficio</div>
                                    <div class="cinta-item-sub" id="menu-sub-lectura1">Verde con flecha blanca</div>
                                </div>
                                <button type="button" class="cinta-btn-offline" data-offline-modo="lectura1" title="Descargar audio para escuchar sin internet">
                                    <span class="material-symbols-outlined">download</span>
                                </button>
                            </div>
                            <div class="cinta-menu-item ${this.modoActivo === 'lectura2' ? 'activo' : ''}" data-modo="lectura2" role="button" tabindex="0">
                                <span class="cinta-item-badge badge-lectura2">2️⃣</span>
                                <div class="cinta-item-info">
                                    <div class="cinta-item-titulo">2ª Lectura del Oficio</div>
                                    <div class="cinta-item-sub" id="menu-sub-lectura2">Rojo con flecha blanca</div>
                                </div>
                                <button type="button" class="cinta-btn-offline" data-offline-modo="lectura2" title="Descargar audio para escuchar sin internet">
                                    <span class="material-symbols-outlined">download</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fila 2: Reproductor y Navegación de Horas (Colapsable al pulsar en el Tiempo Litúrgico) -->
                <div class="cinta-fila-inf" id="cinta-fila-inf">
                    <div class="cinta-reproductor-horas">
                        <button type="button" class="cinta-btn-play ${(MODOS_AUDIO[this.modoActivo] || MODOS_AUDIO.hora).claseBtn}" id="btn-cinta-play" title="Reproducir ${(MODOS_AUDIO[this.modoActivo] || MODOS_AUDIO.hora).nombre}">
                            <span class="material-symbols-outlined" id="cinta-icon-play">play_arrow</span>
                        </button>
                        <nav class="cinta-horas-nav" id="cinta-horas-nav">
                            ${horaBtnsHtml}
                        </nav>
                    </div>

                    <!-- Barra de Progreso y Tiempos con Scrubber Amarillo -->
                    <div class="cinta-barra-progreso-box">
                        <span class="cinta-tiempo-num" id="cinta-tiempo-actual" title="Doble clic o dos toques para descargar el audio">0:00</span>
                        <input type="range" class="cinta-slider-progreso" id="cinta-slider-progreso" min="0" max="100" value="0">
                        <span class="cinta-tiempo-num" id="cinta-tiempo-total" title="Doble clic o dos toques para descargar el audio">0:00</span>
                    </div>
                </div>

                <!-- Panel Desplegable de Semanas / Santos / Celebraciones (al pulsar en Semana X • Día) -->
                <div class="cinta-selector-semanas sub-acordeon" id="cinta-selector-semanas"></div>
            </div>
        `;
    }

    vincularEventos() {
        // 1. Botón Colapsar / Desplegar Fila Inferior
        const btnToggleTiempo = document.getElementById('btn-toggle-tiempo');
        const filaInf = document.getElementById('cinta-fila-inf');
        if (btnToggleTiempo && filaInf) {
            btnToggleTiempo.addEventListener('click', () => {
                filaInf.classList.toggle('colapsado');
            });
        }

        // 1b. Selector desplegable al hacer clic en Semana X • Día (#cinta-texto-metadatos)
        const txtMetadatos = document.getElementById('cinta-texto-metadatos');
        const selectorSemanas = document.getElementById('cinta-selector-semanas');
        if (txtMetadatos && selectorSemanas) {
            txtMetadatos.addEventListener('click', (e) => {
                e.stopPropagation();
                if (selectorSemanas.classList.contains('desplegado')) {
                    selectorSemanas.classList.remove('desplegado');
                    txtMetadatos.classList.remove('activo');
                    return;
                }
                if (!selectorSemanas.innerHTML.trim()) {
                    this.renderizarSelectorSemanas(selectorSemanas);
                }
                selectorSemanas.classList.add('desplegado');
                txtMetadatos.classList.add('activo');
            });

            document.addEventListener('click', (e) => {
                if (selectorSemanas.classList.contains('desplegado') &&
                    !selectorSemanas.contains(e.target) &&
                    !txtMetadatos.contains(e.target)) {
                    selectorSemanas.classList.remove('desplegado');
                    txtMetadatos.classList.remove('activo');
                }
            });
        }

        // 2. Controles de Zoom de Tipografía (Usa --font-zoom)
        document.getElementById('btn-zoom-mas')?.addEventListener('click', () => {
            this.cambiarTamanoTexto(1);
        });

        document.getElementById('btn-zoom-menos')?.addEventListener('click', () => {
            this.cambiarTamanoTexto(-1);
        });

        // Doble clic o doble toque para restablecer a 16px (1.0)
        const spanZoom = document.getElementById('cinta-zoom-valor');
        if (spanZoom) {
            let ultimoClic = 0;
            const manejarDobleAccion = (e) => {
                const ahora = Date.now();
                const diferencia = ahora - ultimoClic;
                if (diferencia < 350 && diferencia > 0) {
                    if (e && e.preventDefault) e.preventDefault();
                    this.resetearTamanoTexto();
                    ultimoClic = 0;
                } else {
                    ultimoClic = ahora;
                }
            };

            spanZoom.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.resetearTamanoTexto();
            });

            spanZoom.addEventListener('click', (e) => {
                manejarDobleAccion(e);
            });

            spanZoom.addEventListener('touchend', (e) => {
                manejarDobleAccion(e);
            });
        }

        // 2b. Botón Conmutador de Ciclo Año I (Impar) / Año II (Par) para Oficio
        const btnCicloAnio = document.getElementById('btn-ciclo-anio');
        if (btnCicloAnio) {
            btnCicloAnio.addEventListener('click', (e) => {
                e.stopPropagation();
                const nuevoCiclo = this.cicloAnio === 'par' ? 'impar' : 'par';
                this.establecerCicloAnio(nuevoCiclo);
                window.dispatchEvent(new CustomEvent('lh-cambiar-ciclo-anio', {
                    detail: { ciclo: nuevoCiclo, esPar: nuevoCiclo === 'par' }
                }));
            });
        }

        // 2c. Botones de Scroll Rápido (Ir hasta arriba / Ir hasta el final)
        const btnScrollArriba = document.getElementById('btn-scroll-arriba');
        if (btnScrollArriba) {
            btnScrollArriba.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } catch (_) {
                    window.scrollTo(0, 0);
                }
            });
        }

        const btnScrollAbajo = document.getElementById('btn-scroll-abajo');
        if (btnScrollAbajo) {
            btnScrollAbajo.addEventListener('click', (e) => {
                e.preventDefault();
                const scrollTotal = Math.max(
                    document.body ? document.body.scrollHeight : 0,
                    document.documentElement ? document.documentElement.scrollHeight : 0,
                    document.body ? document.body.offsetHeight : 0,
                    document.documentElement ? document.documentElement.offsetHeight : 0
                );
                try {
                    window.scrollTo({ top: scrollTotal, behavior: 'smooth' });
                } catch (_) {
                    window.scrollTo(0, scrollTotal);
                }
            });
        }

        // 2d. Control de Velocidad Desplegable (-25 a 25)
        const btnVelocidad = document.getElementById('btn-cinta-velocidad');
        const popoverVelocidad = document.getElementById('cinta-velocidad-popover');

        if (btnVelocidad && popoverVelocidad) {
            btnVelocidad.addEventListener('click', (e) => {
                e.stopPropagation();
                const menuAudios = document.getElementById('cinta-menu-audios');
                if (menuAudios) menuAudios.classList.remove('abierto');
                const menuSemanas = document.getElementById('cinta-selector-semanas');
                if (menuSemanas) menuSemanas.classList.remove('abierto');

                popoverVelocidad.classList.toggle('abierto');
                btnVelocidad.classList.toggle('abierto');

                if (popoverVelocidad.classList.contains('abierto')) {
                    const itemActivo = popoverVelocidad.querySelector('.cinta-vel-item.activo');
                    if (itemActivo && typeof itemActivo.scrollIntoView === 'function') {
                        itemActivo.scrollIntoView({ inline: 'center', block: 'nearest' });
                    }
                }
            });

            popoverVelocidad.querySelectorAll('.cinta-vel-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const step = item.getAttribute('data-step');
                    this.establecerVelocidad(step);
                    // Desaparecer inmediatamente después de la selección
                    popoverVelocidad.classList.remove('abierto');
                    btnVelocidad.classList.remove('abierto');
                });
            });

            document.addEventListener('click', (e) => {
                if (!popoverVelocidad.contains(e.target) && !btnVelocidad.contains(e.target)) {
                    popoverVelocidad.classList.remove('abierto');
                    btnVelocidad.classList.remove('abierto');
                }
            });
        }

        // 3. Menú Desplegable de la Iglesia
        const btnIglesia = document.getElementById('btn-iglesia-selector');
        const menuAudios = document.getElementById('cinta-menu-audios');

        if (btnIglesia && menuAudios) {
            btnIglesia.addEventListener('click', (e) => {
                e.stopPropagation();
                menuAudios.classList.toggle('abierto');
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!menuAudios.contains(e.target) && !btnIglesia.contains(e.target)) {
                    menuAudios.classList.remove('abierto');
                }
            });

            // Selección de modo en el menú
            menuAudios.querySelectorAll('.cinta-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    // Si el clic vino del botón de descarga offline, no activar el cambio de modo
                    if (e.target.closest('.cinta-btn-offline')) return;
                    const modo = item.getAttribute('data-modo');
                    if (modo) {
                        this.cambiarModoAudio(modo, true);
                        menuAudios.classList.remove('abierto');
                    }
                });
            });

            // Configurar botones de descarga offline (estilo Resucitó)
            this.configurarBotonesOfflineMenu();
        }

        // 4. Controles del Reproductor Unificado
        const btnPlay = document.getElementById('btn-cinta-play');
        const slider = document.getElementById('cinta-slider-progreso');
        const tActual = document.getElementById('cinta-tiempo-actual');
        const tTotal = document.getElementById('cinta-tiempo-total');
        const iconPlay = document.getElementById('cinta-icon-play');

        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                this.togglePlay();
            });
        }

        // Eventos del Audio HTML5 (Evangelio, Lectura 1, Lectura 2 y Rezo de las Horas)
        this.audio.addEventListener('play', () => {
            this.audio.playbackRate = obtenerRateConfigurado(true);
            if (this.fuenteActiva === 'audio' || !this.ttsState.isSpeaking) {
                if (iconPlay) iconPlay.textContent = 'pause';
            }
        });

        this.audio.addEventListener('pause', () => {
            if (this.fuenteActiva === 'audio' || !this.ttsState.isSpeaking) {
                if (iconPlay) iconPlay.textContent = 'play_arrow';
            }
        });

        this.audio.addEventListener('ended', () => {
            if (this.fuenteActiva === 'audio' || !this.ttsState.isSpeaking) {
                if (iconPlay) iconPlay.textContent = 'play_arrow';
                if (slider) slider.value = 0;
                if (tActual) tActual.textContent = '0:00';
                document.documentElement.style.setProperty('--progreso-reproduccion', '0%');

                // Encadenamiento automático de lecturas:
                // 1ª Lectura -> 2ª Lectura -> Evangelio
                if (this.modoActivo === 'lectura1') {
                    console.log('⏭️ [Cinta] Fin de 1ª Lectura: Continuando automáticamente con 2ª Lectura');
                    this.mostrarToastAviso('Continuando con 2ª Lectura...', 2500);
                    setTimeout(() => {
                        this.cambiarModoAudio('lectura2', true);
                    }, 400);
                } else if (this.modoActivo === 'lectura2') {
                    console.log('⏭️ [Cinta] Fin de 2ª Lectura: Continuando automáticamente con Evangelio');
                    this.mostrarToastAviso('Continuando con Evangelio del Día...', 2500);
                    setTimeout(() => {
                        this.cambiarModoAudio('evangelio', true);
                    }, 400);
                }
            }
        });

        this.audio.addEventListener('timeupdate', () => {
            if (this.fuenteActiva === 'audio' || !this.ttsState.isSpeaking) {
                if (!isNaN(this.audio.duration) && this.audio.duration > 0) {
                    const porcentaje = (this.audio.currentTime / this.audio.duration) * 100;
                    if (slider) slider.value = porcentaje;
                    document.documentElement.style.setProperty('--progreso-reproduccion', `${porcentaje.toFixed(1)}%`);
                    if (tActual) tActual.textContent = this.formatearTiempo(this.audio.currentTime);
                    if (tTotal) tTotal.textContent = this.formatearTiempo(this.audio.duration);
                }
            }
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.audio.playbackRate = obtenerRateConfigurado(true);
            if (this.fuenteActiva === 'audio' || !this.ttsState.isSpeaking) {
                if (tTotal && !isNaN(this.audio.duration)) {
                    tTotal.textContent = this.formatearTiempo(this.audio.duration);
                }
            }
        });

        // Detección automática de error (404 Not Found o fallo de red): fallback silencioso a TTS sin autoplay
        this.audio.addEventListener('error', (e) => {
            const urlFallida = this.audio.src;
            if (urlFallida) {
                this.audiosFallidos.add(urlFallida);
            }
            // Solo continuar reproduciendo en TTS si el usuario estaba reproduciendo activamente
            const estabaSonando = !this.audio.paused && this.audio.currentTime > 0;
            if (this.fuenteActiva === 'audio') {
                console.warn('[Cinta] Audio de servidor no disponible (404/red), conmutando a TTS:', urlFallida);
                try {
                    this.audio.removeAttribute('src');
                    this.audio.load();
                } catch (_) {}
                this.ejecutarFallbackTTS(this.modoActivo, estabaSonando);
            }
        });

        if (slider) {
            slider.addEventListener('input', () => {
                if (this.fuenteActiva === 'tts' || this.ttsState.isSpeaking || (!this.audio.src && this.modoActivo === 'hora')) {
                    // Seek en lectura de voz TTS
                    this.seekTTS((slider.value / 100));
                } else {
                    if (!isNaN(this.audio.duration) && this.audio.duration > 0) {
                        this.audio.currentTime = (slider.value / 100) * this.audio.duration;
                        document.documentElement.style.setProperty('--progreso-reproduccion', `${Number(slider.value).toFixed(1)}%`);
                    }
                }
            });
        }

        // Doble clic o dos toques en el reloj de inicio o final para descargar el audio activo
        const vincularDescargaReloj = (elem) => {
            if (!elem) return;
            let ultimoToque = 0;
            let ultimoTouchAction = 0;
            const dispararDescarga = (e) => {
                if (this._descargaEnCurso) return;
                if (e && e.preventDefault) e.preventDefault();
                if (e && e.stopPropagation) e.stopPropagation();
                this.descargarAudioActual();
            };
            const manejarToque = (e) => {
                const ahora = Date.now();
                const diff = ahora - ultimoToque;
                if (diff > 40 && diff < 380) {
                    ultimoToque = 0;
                    dispararDescarga(e);
                } else {
                    ultimoToque = ahora;
                }
            };
            elem.addEventListener('dblclick', (e) => {
                ultimoToque = 0;
                dispararDescarga(e);
            });
            elem.addEventListener('touchend', (e) => {
                ultimoTouchAction = Date.now();
                manejarToque(e);
            });
            elem.addEventListener('click', (e) => {
                if (Date.now() - ultimoTouchAction < 450) return;
                manejarToque(e);
            });
        };

        vincularDescargaReloj(tActual);
        vincularDescargaReloj(tTotal);

        // 5. Escuchar cambios de preferencia de audio por defecto desde la configuración
        window.addEventListener('lh-audio-modo-defecto-changed', (e) => {
            const nuevoModo = e.detail && e.detail.modo;
            if (nuevoModo && MODOS_AUDIO[nuevoModo] && nuevoModo !== this.modoActivo) {
                this.cambiarModoAudio(nuevoModo, false);
            }
        });
    }

    async descargarAudioActual() {
        if (this._descargaEnCurso) return;
        this._descargaEnCurso = true;

        let nombreArchivo = 'audio.mp3';
        if (this.modoActivo === 'hora') {
            const libroNom = String(this.opciones?.libro || 'hora').toLowerCase();
            if (libroNom === 'oficio') {
                nombreArchivo = (this.cicloAnio === 'par') ? 'oficio2.mp3' : 'oficio1.mp3';
            } else {
                nombreArchivo = `${libroNom}.mp3`;
            }
        } else if (this.modoActivo === 'lectura1') {
            nombreArchivo = (this.cicloAnio === 'par') ? 'lectura2.mp3' : 'lectura1.mp3';
        } else if (this.modoActivo === 'lectura2') {
            nombreArchivo = 'lecturas.mp3';
        } else if (this.modoActivo === 'evangelio') {
            const dNorm = String(this.opciones?.diaSlug || this.opciones?.dia || 'domingo').toLowerCase();
            if (dNorm === 'domingo') {
                const ciclo = String(this.opciones?.ciclo || 'a').toLowerCase();
                nombreArchivo = `domingo-${ciclo}.mp3`;
            } else {
                nombreArchivo = `${dNorm}.mp3`;
            }
        }

        const libroNom = String(this.opciones?.libro || 'hora').toLowerCase();
        const slugReal = String(this.opciones?.tiempoSlug || 'ordinario').toLowerCase();
        const esCompletasOrdinario = (libroNom === 'completas' && (slugReal === 'ordinario' || slugReal === 'to'));

        const sem = esCompletasOrdinario ? '1' : String(this.opciones?.semana || '1');
        const semPad = sem.padStart(2, '0');
        const dia = String(this.opciones?.diaSlug || this.opciones?.dia || 'domingo').toLowerCase();

        let urlCandidata = (this.modoActivo !== 'hora')
            ? (this.audios[this.modoActivo] || this.audio?.src)
            : (this.audios.hora || '');

        if (!urlCandidata || urlCandidata.startsWith('blob:')) {
            urlCandidata = `https://to.resucito.do/s${semPad}/${dia}/${nombreArchivo}`;
        }

        if (this.modoActivo === 'hora') {
            this.prepararTTS('hora');
        } else {
            const txt = this.obtenerTextoParaModo(this.modoActivo);
            if (txt) {
                this.prepararTTSConTexto(txt);
            } else if (!this.ttsState.fullText || this.ttsState.chunks.length === 0) {
                this.prepararTTS(this.modoActivo);
            }
        }
        const textoLiturgico = this.ttsState.fullText || this.obtenerTextoParaModo(this.modoActivo) || '';

        try {
            const pluginDescarga = (typeof dbAudioDescarga !== 'undefined') ? dbAudioDescarga : (window.dbAudioDescarga || null);
            if (pluginDescarga && typeof pluginDescarga.descargarAudio === 'function') {
                const partes = (this.ttsState.chunks || []).map(c => c.text).filter(Boolean);
                await pluginDescarga.descargarAudio({
                    url: urlCandidata,
                    filename: nombreArchivo,
                    textoLiturgico,
                    partes,
                    semana: sem,
                    dia: dia,
                    cinta: this
                });
            } else {
                const fetchUrl = urlCandidata.includes('?') ? `${urlCandidata}&_cb=${Date.now()}` : `${urlCandidata}?_cb=${Date.now()}`;
                const res = await fetch(fetchUrl);
                if (res.ok) {
                    const blob = await res.blob();
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = nombreArchivo;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => document.body.removeChild(a), 2000);
                    this.mostrarToastAviso(`¡${nombreArchivo} descargado exitosamente!`, 4000);
                } else {
                    this.mostrarToastAviso(`El audio '${nombreArchivo}' se está sincronizando con el servidor. Puedes rezar en directo pulsando el botón de lectura en la cinta.`, 6000);
                }
            }
        } catch (err) {
            console.warn('[Cinta] Error en proceso de descarga:', err);
            this.mostrarToastAviso('No se pudo completar la descarga.');
        } finally {
            this._descargaEnCurso = false;
        }
    }

    // =========================================================================
    // REPRODUCCIÓN INTELIGENTE HÍBRIDA (AUDIO SERVIDOR O FALLBACK A TTS)
    // =========================================================================

    // Alternar Reproducción / Pausa
    togglePlay() {
        // 1. Si el lector TTS está hablando actualmente -> Pausar TTS
        if (this.ttsState.isSpeaking) {
            this.pausarTTS();
            return;
        }

        // 2. Si el audio HTML5 está sonando actualmente -> Pausar audio HTML5
        if (this.audio && !this.audio.paused && this.audio.currentTime > 0) {
            this.audio.pause();
            return;
        }

        // 3. Si estábamos pausados en TTS (progreso > 0 o en pausa) y la fuente activa es TTS
        if (this.fuenteActiva === 'tts' && this.ttsState.fullText && (this.ttsState.currentChunkIndex > 0 || this.ttsState.currentCharIndex > 0)) {
            this.reproducirTTS();
            return;
        }

        // 4. Si estábamos pausados en HTML5 audio y la fuente activa es audio
        if (this.fuenteActiva === 'audio' && this.audio && this.audio.src && this.audio.paused && this.audio.currentTime > 0) {
            this.detenerTTS();
            this.audio.play().catch(err => {
                console.warn('[Cinta] Error al reanudar audio:', err);
                this.ejecutarFallbackTTS(this.modoActivo, true);
            });
            return;
        }

        // 5. Iniciar nueva reproducción para el modo activo (usando archivo MP3 si existe o TTS si no)
        this.iniciarReproduccionModo(this.modoActivo);
    }

    iniciarReproduccionModo(modo) {
        const forzarTTS = localStorage.getItem('pref-forzar-tts') === 'true';

        // Si el usuario activó la opción "Forzar siempre Lector de voz (Texto a voz)"
        if (modo === 'hora' && forzarTTS) {
            this.ejecutarFallbackTTS(modo, true);
            return;
        }

        const urlAudio = (modo === 'hora')
            ? (this.audios.hora || '')
            : (this.audios[modo] || '');

        // Si tenemos un archivo de audio y no está marcado como 404 / fallido
        if (urlAudio && !this.audiosFallidos.has(urlAudio)) {
            this.fuenteActiva = 'audio';
            this.detenerTTS();

            // Resolver URL offline si está descargado en caché local
            offlineAudioLh.getPlayableAudioUrl(urlAudio).then(playableUrl => {
                if (this.audio.src !== playableUrl) {
                    this.audio.src = playableUrl;
                    this.audio.load();
                }

                this.audio.play().then(() => {
                    const sub = document.getElementById(`menu-sub-${modo}`);
                    if (sub && modo === 'hora') {
                        const libroNom = (this.opciones?.libro || 'hora').toUpperCase();
                        sub.textContent = `Rezo de ${libroNom}`;
                    }
                }).catch(err => {
                    console.warn(`[Cinta] Audio no disponible en servidor para '${modo}' (${urlAudio}):`, err);
                    this.audiosFallidos.add(urlAudio);

                    // Si era oficio1.mp3 u oficio2.mp3 y falló, probar con oficio.mp3 antes de TTS
                    if (modo === 'hora' && /oficio[12]\.mp3$/i.test(urlAudio)) {
                        const urlGenerica = urlAudio.replace(/oficio[12]\.mp3$/i, 'oficio.mp3');
                        if (!this.audiosFallidos.has(urlGenerica)) {
                            offlineAudioLh.getPlayableAudioUrl(urlGenerica).then(playableGen => {
                                this.audio.src = playableGen;
                                this.audio.load();
                                this.audio.play().then(() => {
                                    const sub = document.getElementById(`menu-sub-${modo}`);
                                    if (sub) sub.textContent = `Rezo de OFICIO`;
                                }).catch(() => {
                                    this.audiosFallidos.add(urlGenerica);
                                    this.ejecutarFallbackTTS(modo, true);
                                });
                            });
                            return;
                        }
                    }

                    this.ejecutarFallbackTTS(modo, true);
                });
            }).catch(() => {
                this.ejecutarFallbackTTS(modo, true);
            });
            return;
        }

        // Si no hay audio asignado o ya se confirmó que devolvió 404:
        this.ejecutarFallbackTTS(modo, true);
    }

    ejecutarFallbackTTS(modo, autoPlay = false) {
        if (this._conmutandoTTS) return;
        this._conmutandoTTS = true;
        setTimeout(() => { this._conmutandoTTS = false; }, 600);

        this.fuenteActiva = 'tts';
        try {
            if (this.audio) {
                if (!this.audio.paused) this.audio.pause();
                this.audio.removeAttribute('src');
                this.audio.load();
            }
        } catch (_) {}

        if (modo === 'hora') {
            const libroNombre = (this.opciones?.libro || 'hora').toUpperCase();
            const sub = document.getElementById('menu-sub-hora');
            if (sub) sub.textContent = `Lector de voz (${libroNombre})`;

            this.prepararTTS('hora');
            if (autoPlay) {
                this.mostrarToastAviso('Audio en servidor no disponible. Leyendo con lector de voz...');
                this.reproducirTTS();
            } else {
                this.actualizarIconoPlay(false);
            }
            return;
        }

        // Para otros modos (evangelio, lectura1, lectura2):
        const sub = document.getElementById(`menu-sub-${modo}`);
        if (sub) sub.textContent = `Lector de voz (${MODOS_AUDIO[modo]?.nombre || modo})`;

        const segs = this.prepararTTS(modo);
        if (segs && segs.length > 0) {
            if (autoPlay) {
                this.mostrarToastAviso(`Audio en servidor no disponible. Leyendo con lector de voz...`);
                this.reproducirTTS();
            } else {
                this.actualizarIconoPlay(false);
            }
        } else {
            if (autoPlay) {
                alert(`No hay archivo de audio ni texto litúrgico disponible para ${MODOS_AUDIO[modo]?.nombre || 'este modo'}.`);
            }
        }
    }

    construirSegmentosParaModo(modo) {
        if (modo === 'hora') {
            return this.construirGuionLiturgico();
        }

        const d = (typeof window !== 'undefined' && window.__salterioDataActual) ? window.__salterioDataActual : (this && this.datosLiturgia ? this.datosLiturgia : null);
        const ldb = (typeof window !== 'undefined' && window.LecturasDB) ? window.LecturasDB : null;
        const segmentos = [];

        if (modo === 'lectura1') {
            let l1 = d?.lecturasOficio?.primera;
            if ((!l1 || !l1.texto) && ldb) {
                const sem = String(this.opciones?.semana || '1');
                const dia = String(this.opciones?.diaSlug || this.opciones?.dia || 'domingo').toLowerCase();
                const esPar = this.cicloAnio === 'par';
                if (typeof ldb.obtenerLectura1 === 'function') {
                    l1 = ldb.obtenerLectura1(this.opciones?.tiempo || 'ordinario', sem, dia, esPar);
                } else if (Array.isArray(ldb)) {
                    const tipoBuscado = esPar ? 'lectura1_par' : 'lectura1_impar';
                    l1 = ldb.find(it => it.semana == sem && it.dia == dia && it.tipo === tipoBuscado);
                }
            }

            if (l1) {
                // Limpiar título e introducción para omitir año par/impar
                let cita1 = '';
                if (l1.cita) {
                    const cLimpia = l1.cita.replace(/\(?[Aa]ño\s+(?:par|impar|[I|V|X]+)\)?/gi, '').replace(/[\d,.\s:-]+$/g, '').trim();
                    if (/^de\s+/i.test(cLimpia)) {
                        cita1 = cLimpia;
                    } else {
                        cita1 = resolverNombreLibroBiblico(l1.cita);
                    }
                }
                let desc1 = limpiarTextoParaVoz(l1.descripcion || l1.subtitulo || '');
                desc1 = desc1.replace(/\(?[Aa]ño\s+(?:par|impar|[I|V|X]+)\)?/gi, '').replace(/\b(?:par|impar)\b/gi, '').trim();

                const introLectura1 = `Primera lectura. ${cita1 ? cita1 + '.' : ''} ${desc1}`.replace(/\s+/g, ' ').trim();
                segmentos.push({ texto: introLectura1 });

                if (l1.texto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(l1.texto) });
                }
                // Al final de la primera lectura: "Palabra de Dios. Te alabamos, Señor."
                segmentos.push({ texto: "Palabra de Dios. Te alabamos, Señor." });

                // Responsorio de la 1ª Lectura
                const r1 = l1.respR1 || l1.responsorio?.r1 || '';
                const v1 = l1.respV || l1.responsorio?.v || '';
                const r2 = l1.respR2 || l1.responsorio?.r2 || '';
                if (r1) {
                    segmentos.push(...construirSegmentosResponsorio(r1, v1, r2));
                }
            }
            return segmentos;
        }

        if (modo === 'lectura2') {
            let l2 = d?.lecturasOficio?.segunda;
            if ((!l2 || !l2.texto) && ldb) {
                const sem = String(this.opciones?.semana || '1');
                const dia = String(this.opciones?.diaSlug || this.opciones?.dia || 'domingo').toLowerCase();
                if (typeof ldb.obtenerLectura2 === 'function') {
                    l2 = ldb.obtenerLectura2(this.opciones?.tiempo || 'ordinario', sem, dia);
                } else if (Array.isArray(ldb)) {
                    l2 = ldb.find(it => it.semana == sem && it.dia == dia && it.tipo === 'lectura2');
                }
            }

            if (l2) {
                let cita2 = limpiarTextoParaVoz(l2.cita || '');
                let desc2 = limpiarTextoParaVoz(l2.descripcion || l2.subtitulo || '');
                cita2 = cita2.replace(/\(?[Aa]ño\s+(?:par|impar|[I|V|X]+)\)?/gi, '').replace(/\b(?:par|impar)\b/gi, '').trim();
                desc2 = desc2.replace(/\(?[Aa]ño\s+(?:par|impar|[I|V|X]+)\)?/gi, '').replace(/\b(?:par|impar)\b/gi, '').trim();

                const introLectura2 = `Segunda lectura. ${cita2 ? cita2 + '.' : ''} ${desc2}`.replace(/\s+/g, ' ').trim();
                segmentos.push({ texto: introLectura2 });

                if (l2.texto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(l2.texto) });
                }

                // Al terminar la segunda lectura, decir el nombre de la lectura
                const nombreLectura2 = desc2 || cita2 || l2.titulo || '';
                if (nombreLectura2) {
                    segmentos.push({ texto: nombreLectura2.endsWith('.') ? nombreLectura2 : `${nombreLectura2}.` });
                }

                // Responsorio de la 2ª Lectura (sigue el mismo patrón)
                const r1_2 = l2.respR1 || l2.responsorio?.r1 || '';
                const v_2 = l2.respV || l2.responsorio?.v || '';
                const r2_2 = l2.respR2 || l2.responsorio?.r2 || '';
                if (r1_2) {
                    segmentos.push(...construirSegmentosResponsorio(r1_2, v_2, r2_2));
                }
            }
            return segmentos;
        }

        if (modo === 'evangelio') {
            if (d?.evangelio?.texto) {
                const citaEv = limpiarTextoParaVoz(d.evangelio.cita || '');
                segmentos.push({ texto: `Evangelio. ${citaEv ? citaEv + '.' : ''}`.trim() });
                segmentos.push({ texto: limpiarTextoParaVoz(d.evangelio.texto) });
                segmentos.push({ texto: "Palabra del Señor. Gloria a ti, Señor Jesús." });
            }
            return segmentos;
        }

        return segmentos;
    }

    obtenerTextoParaModo(modo) {
        const segs = this.construirSegmentosParaModo(modo);
        if (segs && segs.length > 0) {
            return segs.map(s => s.texto).join(' ');
        }
        return '';
    }

    prepararTTSConTexto(textoPlano, titulo = '') {
        const segmentos = [];
        if (titulo) segmentos.push({ texto: titulo });
        segmentos.push({ texto: limpiarTextoParaVoz(textoPlano) });
        this.prepararTTSDesdeSegmentos(segmentos);
    }

    mostrarToastAviso(mensaje, duracion = 3500) {
        let toast = document.getElementById('cinta-toast-fallback');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cinta-toast-fallback';
            toast.className = 'cinta-toast-fallback';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `
            <span class="material-symbols-outlined" style="font-size:20px;color:#38bdf8;">record_voice_over</span>
            <span style="font-size:13.5px;font-weight:500;">${mensaje}</span>
        `;
        toast.classList.add('visible');
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => {
            toast.classList.remove('visible');
        }, duracion);
    }

    // =========================================================================
    // MOTOR DE TEXTO A VOZ (TTS) PARA EL REZO DE LAS HORAS
    // =========================================================================

    construirGuionLiturgico() {
        const d = (typeof window !== 'undefined' && window.__salterioDataActual) ? window.__salterioDataActual : (this && this.datosLiturgia ? this.datosLiturgia : null);
        const segmentos = [];

        if (d) {
            // Manejo específico para Oficio de Lectura
            if (d.libro === 'oficio') {
                // 1. INVITATORIO E INVOCACIÓN INICIAL OFICIO
                segmentos.push({ texto: "Señor, abre mis labios. Y mi boca proclamará tu alabanza." });
                segmentos.push({ texto: "Dios mío, ven en mi auxilio. Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén. Aleluya." });

                // 2. HIMNO
                if (d.himno && d.himno.texto) {
                    segmentos.push({ texto: "Himno." });
                    segmentos.push({ texto: limpiarTextoParaVoz(d.himno.texto) });
                }

                // 3. SALMODIA
                if (d.salmodia) {
                    segmentos.push({ texto: "Salmodia." });
                    if (d.salmodia.salmo1Texto) {
                        segmentos.push({ texto: `Antífona 1. ${limpiarTextoParaVoz(d.salmodia.ant1 || '')}` });
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo1Texto) });
                        if (d.salmodia.ant1) segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant1) });
                    }
                    if (d.salmodia.salmo2Texto) {
                        segmentos.push({ texto: `Antífona 2. ${limpiarTextoParaVoz(d.salmodia.ant2 || '')}` });
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo2Texto) });
                        if (d.salmodia.ant2) segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant2) });
                    }
                    if (d.salmodia.salmo3Texto) {
                        segmentos.push({ texto: `Antífona 3. ${limpiarTextoParaVoz(d.salmodia.ant3 || '')}` });
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo3Texto) });
                        if (d.salmodia.ant3) segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant3) });
                    }
                }

                // 4. RESPONSORIO POST-SALMODIA (IMAGEN 3)
                if (d.versiculo) {
                    if (d.versiculo.v) segmentos.push({ texto: limpiarTextoParaVoz(d.versiculo.v) });
                    if (d.versiculo.r) segmentos.push({ texto: limpiarTextoParaVoz(d.versiculo.r) });
                }

                // 5. PRIMERA LECTURA (IMAGEN 4)
                segmentos.push(...this.construirSegmentosParaModo('lectura1'));

                // 6. SEGUNDA LECTURA PATRÍSTICA
                segmentos.push(...this.construirSegmentosParaModo('lectura2'));

                // 7. HIMNO TE DEUM
                if (d.dia === 'domingo' || d.tiempo === 'pascua' || d.tiempo === 'navidad' || d.himnoTeDeum) {
                    segmentos.push({ texto: "Himno. A ti, oh Dios." });
                    const teDeumTexto = d.himnoTeDeum?.texto || `A ti, oh Dios, te alabamos, a ti, Señor, te reconocemos. A ti, eterno Padre, te venera toda la creación.`;
                    segmentos.push({ texto: limpiarTextoParaVoz(teDeumTexto) });
                }

                // 8. SECCIÓN OPCIONAL
                if (d.seccionOpcional?.texto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.seccionOpcional.texto) });
                }

                // 9. ORACIÓN
                if (d.oracion) {
                    segmentos.push({ texto: "Oración." });
                    const textoOr = typeof d.oracion === 'string' ? d.oracion : (d.oracion.texto || '');
                    segmentos.push({ texto: limpiarTextoParaVoz(textoOr) });
                }

                // 10. CONCLUSIÓN
                segmentos.push({ texto: "Bendigamos al Señor. Demos gracias a Dios." });
                return segmentos;
            }

            const libroNormalizado = (this.opciones?.libro || d.libro || '').toLowerCase();

            // 1. INVITATORIO / INVOCACION INICIAL (Laudes y otras horas)
            if (libroNormalizado === 'laudes' && d.invitatorio && d.invitatorio.activo) {
                segmentos.push({ texto: "Señor, abre mis labios. Y mi boca proclamará tu alabanza." });
                if (d.invitatorio.antifona) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.invitatorio.antifona) });
                }
                if (d.invitatorio.salmoTexto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.invitatorio.salmoTexto) });
                }
                if (d.invitatorio.antifona) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.invitatorio.antifona) });
                }
            } else if (d.invocacionInicial || libroNormalizado === 'completas' || libroNormalizado === 'visperas' || libroNormalizado === 'tercia' || libroNormalizado === 'sexta' || libroNormalizado === 'nona') {
                segmentos.push({ texto: "Dios mío, ven en mi auxilio. Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén. Aleluya." });
            }

            // Examen de Conciencia (Completas - antes del himno)
            if (libroNormalizado === 'completas' && !d.omisiones?.examenConciencia) {
                segmentos.push({ texto: "Examen de conciencia." });
                const ex = d.examenConciencia || {
                    monicion: 'Hermanos, habiendo llegado al final de esta jornada que Dios nos ha concedido, reconozcamos sinceramente nuestros pecados.',
                    confesion: 'Yo confieso ante Dios todopoderoso y ante vosotros, hermanos, que he pecado mucho de pensamiento, palabra, obra y omisión: por mi culpa, por mi culpa, por mi gran culpa. Por eso ruego a santa María, siempre Virgen, a los ángeles, a los santos y a vosotros, hermanos, que intercedáis por mí ante Dios, nuestro Señor.',
                    v: 'El Señor todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.',
                    r: 'Amén.'
                };
                if (ex.monicion) segmentos.push({ texto: limpiarTextoParaVoz(ex.monicion) });
                if (ex.confesion) segmentos.push({ texto: limpiarTextoParaVoz(ex.confesion) });
                const vText = ex.v || "El Señor todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.";
                const rText = ex.r || "Amén.";
                segmentos.push({ texto: `${limpiarTextoParaVoz(vText)} ${limpiarTextoParaVoz(rText)}` });
            }

            // 2. HIMNO
            if (d.himno && d.himno.texto) {
                segmentos.push({ texto: "Himno." });
                segmentos.push({ texto: limpiarTextoParaVoz(d.himno.texto) });
            }

            // 3. SALMODIA
            if (d.salmodia) {
                segmentos.push({ texto: "Salmodia." });

                const esCompletas = (libroNormalizado === 'completas');

                if (d.salmodia.salmo1Texto) {
                    const prefAnt1 = esCompletas ? "Antífona." : "Antífona 1.";
                    segmentos.push({ texto: `${prefAnt1} ${limpiarTextoParaVoz(d.salmodia.ant1 || '')}` });
                    segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo1Texto) });
                    if (d.salmodia.ant1) {
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant1) });
                    }
                }

                // En Completas solo existe 1 salmo/antífona (o dos salmos bajo una sola antífona), nunca Antífona 2 ni Antífona 3
                if (!esCompletas && d.salmodia.salmo2Texto) {
                    segmentos.push({ texto: `Antífona 2. ${limpiarTextoParaVoz(d.salmodia.ant2 || '')}` });
                    segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo2Texto) });
                    if (d.salmodia.ant2) {
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant2) });
                    }
                }

                if (!esCompletas && d.salmodia.salmo3Texto) {
                    segmentos.push({ texto: `Antífona 3. ${limpiarTextoParaVoz(d.salmodia.ant3 || '')}` });
                    segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.salmo3Texto) });
                    if (d.salmodia.ant3) {
                        segmentos.push({ texto: limpiarTextoParaVoz(d.salmodia.ant3) });
                    }
                }
            }

            // 4. LECTURA BREVE
            if (d.lecturaBreve) {
                const nombreLibro = resolverNombreLibroBiblico(d.lecturaBreve.cita);
                segmentos.push({ texto: `Lectura breve ${nombreLibro}.` });
                if (d.lecturaBreve.texto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.lecturaBreve.texto) });
                }
                segmentos.push({ texto: "Palabra de Dios. Te alabamos, Señor." });
            }

            // 5. RESPONSORIO BREVE
            if (d.lecturaBreve && d.lecturaBreve.responsorioBreve) {
                const rb = d.lecturaBreve.responsorioBreve;
                segmentos.push({ texto: "Responderemos:" });
                if (rb.v1) segmentos.push({ texto: limpiarTextoParaVoz(rb.v1) });
                if (rb.r1) segmentos.push({ texto: limpiarTextoParaVoz(rb.r1) });
                if (rb.v2) segmentos.push({ texto: limpiarTextoParaVoz(rb.v2) });
                if (rb.r2) segmentos.push({ texto: limpiarTextoParaVoz(rb.r2) });
                if (rb.v3) segmentos.push({ texto: limpiarTextoParaVoz(rb.v3) });
                if (rb.r3) {
                    segmentos.push({ texto: limpiarTextoParaVoz(rb.r3) });
                }
            }

            // 6. CÁNTICO EVANGÉLICO
            if (d.canticoEvangelico) {
                segmentos.push({ texto: "Cántico evangélico.", esInicioSegundaParte: true });
                if (d.canticoEvangelico.antifona) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.canticoEvangelico.antifona) });
                }
                if (d.canticoEvangelico.texto) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.canticoEvangelico.texto) });
                }
                if (d.canticoEvangelico.antifona) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.canticoEvangelico.antifona) });
                }
            }

            // 7. PRECES (Solo en Laudes y Vísperas; NO en Completas ni Oficio ni Horas Menores)
            if (d.preces && libroNormalizado !== 'completas' && libroNormalizado !== 'oficio' && libroNormalizado !== 'tercia' && libroNormalizado !== 'sexta' && libroNormalizado !== 'nona' && !d.omisiones?.preces) {
                segmentos.push({ texto: "Preces." });
                if (d.preces.intro) segmentos.push({ texto: limpiarTextoParaVoz(d.preces.intro) });
                if (d.preces.respuesta) segmentos.push({ texto: limpiarTextoParaVoz(d.preces.respuesta) });
                if (Array.isArray(d.preces.intenciones)) {
                    d.preces.intenciones.forEach(it => {
                        segmentos.push({ texto: limpiarTextoParaVoz(it) });
                    });
                } else if (d.preces.intenciones) {
                    segmentos.push({ texto: limpiarTextoParaVoz(d.preces.intenciones) });
                }
                segmentos.push({ texto: "Se pueden añadir algunas intenciones libres." });
                if (d.preces.concl) segmentos.push({ texto: limpiarTextoParaVoz(d.preces.concl) });
            }

            // 8. PADRE NUESTRO (Laudes y Vísperas)
            if (libroNormalizado !== 'oficio' && libroNormalizado !== 'completas' && libroNormalizado !== 'tercia' && libroNormalizado !== 'sexta' && libroNormalizado !== 'nona' && !d.omisiones?.preces) {
                segmentos.push({ 
                    texto: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén." 
                });
            }

            // 9. ORACIÓN
            if (d.oracion) {
                segmentos.push({ texto: "Oración." });
                const textoOr = typeof d.oracion === 'string' ? d.oracion : (d.oracion.texto || '');
                segmentos.push({ texto: limpiarTextoParaVoz(textoOr) });
            }

            // 10. CONCLUSIÓN O BENDICIÓN (Completas)
            if (libroNormalizado === 'completas' && !d.omisiones?.bendicionCompletas) {
                segmentos.push({ texto: "Bendición." });
                const ben = d.bendicionCompletas || {};
                const vBen = ben.v || ben.bendicionV || "El Señor todopoderoso nos conceda una noche tranquila y una santa muerte.";
                const rBen = ben.r || ben.bendicionR || "Amén.";
                segmentos.push({ texto: `${limpiarTextoParaVoz(vBen)} ${limpiarTextoParaVoz(rBen)}` });

                let titMar = ben.tituloMariana || ben.tituloAntifonaMariana || "Antífona final de la Santísima Virgen.";
                if (/ANT[IÍ]FONA\s+FINAL\s+DE\s+LA\s+SANT[IÍ]SIMA\s+VIRGEN/i.test(titMar)) {
                    titMar = "Antífona final de la Santísima Virgen.";
                }
                segmentos.push({ texto: limpiarTextoParaVoz(titMar) });
                const txtMar = ben.textoMariana || ben.textoAntifonaMariana || "Madre del Redentor, Virgen fecunda, puerta del cielo siempre abierta, estrella del mar, ven a librar al pueblo que tropieza y se quiere levantar. Ante la admiración de cielo y tierra, engendraste a tu santo Creador, y permaneces siempre virgen. Recibe el saludo del ángel Gabriel, y ten piedad de nosotros, pecadores.";
                segmentos.push({ texto: limpiarTextoParaVoz(txtMar) });
            } else if (libroNormalizado === 'oficio' || libroNormalizado === 'tercia' || libroNormalizado === 'sexta' || libroNormalizado === 'nona') {
                segmentos.push({ texto: "Bendigamos al Señor. Demos gracias a Dios." });
            } else {
                segmentos.push({ texto: "El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna. Amén." });
            }
        } else {
            const fallbackTexto = this.extraerTextoLiturgicoDOM();
            segmentos.push({ texto: fallbackTexto });
        }

        return segmentos;
    }

    extraerTextoLiturgicoDOM() {
        const contenedor = document.getElementById('salterio-contenido');
        if (!contenedor) return '';

        const clone = contenedor.cloneNode(true);
        clone.querySelectorAll('button, .material-symbols-outlined, style, script, input, .admin-toolbar-salterios, .rubrica-nota, .salterio-libro-subtitulo').forEach(n => n.remove());

        let texto = clone.innerText || clone.textContent || '';
        return limpiarTextoParaVoz(texto);
    }

    prepararTTS(modo = this.modoActivo) {
        const segmentos = this.construirSegmentosParaModo(modo);
        this.prepararTTSDesdeSegmentos(segmentos);
        return segmentos;
    }

    prepararTTSDesdeSegmentos(segmentos) {
        const allChunks = [];
        let runningStart = 0;
        let resumeIdx = null;

        segmentos.forEach(seg => {
            if (!seg || !seg.texto || !seg.texto.trim()) return;
            const subchunks = dividirEnFrasesLectura(seg.texto, 170);
            subchunks.forEach((sc, idx) => {
                const chunkStart = runningStart;
                const chunkEnd = runningStart + sc.text.length;
                runningStart = chunkEnd + 1;

                const chunkObj = {
                    text: sc.text,
                    start: chunkStart,
                    end: chunkEnd,
                    esPausaPedagogica: (idx === subchunks.length - 1) && !!seg.esPausaPedagogica,
                    mensajePausa: seg.mensajePausa || ''
                };

                if (seg.esInicioSegundaParte && resumeIdx === null) {
                    resumeIdx = allChunks.length;
                }

                allChunks.push(chunkObj);
            });
        });

        this.ttsState.chunks = allChunks;
        this.ttsState.fullText = allChunks.map(c => c.text).join(' ');
        this.ttsState.checkpointResumeIndex = resumeIdx;
        this.ttsState.currentChunkIndex = 0;
        this.ttsState.currentCharIndex = 0;
        this.ttsState.bufferListo = false;

        const rate = obtenerRateConfigurado(true);
        const words = this.ttsState.fullText.split(/\s+/).filter(Boolean).length;
        this.ttsState.totalDurationSecs = Math.max(10, Math.round((words / (135 * rate)) * 60));

        const tTotal = document.getElementById('cinta-tiempo-total');
        if (tTotal) tTotal.textContent = this.formatearTiempo(this.ttsState.totalDurationSecs);
    }

    togglePlayTTS() {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert('Tu navegador no soporta la función de lectura por voz (SpeechSynthesis).');
            return;
        }

        // Detener audio HTML5 si estaba sonando
        if (!this.audio.paused) this.audio.pause();

        if (this.ttsState.isSpeaking) {
            this.pausarTTS();
        } else {
            this.reproducirTTS();
        }
    }

    reproducirTTS() {
        if (!this.ttsState.fullText || this.ttsState.chunks.length === 0) {
            this.prepararTTS();
        }

        if (!this.ttsState.fullText) {
            alert('No hay contenido litúrgico disponible para leer por voz en esta hora.');
            return;
        }

        // Si el buffer no ha cargado, simular carga en barra de progreso hasta el 3% para arrancar
        if (!this.ttsState.bufferListo) {
            let bufferPct = 0;
            const stepBuffer = () => {
                bufferPct += 1;
                document.documentElement.style.setProperty('--progreso-buffer', `${bufferPct}%`);
                if (bufferPct === 3) {
                    this.ttsState.bufferListo = true;
                    this.iniciarLocucionActivaTTS();
                }
                if (bufferPct < 100) {
                    setTimeout(stepBuffer, bufferPct < 6 ? 90 : 30);
                }
            };
            stepBuffer();
        } else {
            this.iniciarLocucionActivaTTS();
        }
    }

    iniciarLocucionActivaTTS() {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            this.ttsState.isSpeaking = true;
            this.actualizarIconoPlay(true);
            this.iniciarHeartbeatTTS();
            this.iniciarTrackingProgresoTTS();
            return;
        }

        window.speechSynthesis.cancel();

        if (this.ttsState.currentCharIndex >= this.ttsState.fullText.length) {
            this.ttsState.currentCharIndex = 0;
            this.ttsState.currentChunkIndex = 0;
        }

        let targetIndex = this.ttsState.chunks.findIndex(c => this.ttsState.currentCharIndex < c.end);
        if (targetIndex === -1) targetIndex = 0;
        this.ttsState.currentChunkIndex = targetIndex;

        this.ttsState.isSpeaking = true;
        this.actualizarIconoPlay(true);
        this.iniciarHeartbeatTTS();
        this.iniciarTrackingProgresoTTS();
        this.reproducirChunkActualTTS();
    }

    reproducirChunkActualTTS() {
        if (!this.ttsState.isSpeaking) return;
        if (this.ttsState.currentChunkIndex >= this.ttsState.chunks.length) {
            this.finalizarTTS();
            return;
        }

        const chunk = this.ttsState.chunks[this.ttsState.currentChunkIndex];
        if (!chunk || !chunk.text) {
            this.finalizarTTS();
            return;
        }

        let offsetInChunk = 0;
        let textoChunk = chunk.text;
        if (this.ttsState.currentCharIndex > chunk.start && this.ttsState.currentCharIndex < chunk.end) {
            offsetInChunk = this.ttsState.currentCharIndex - chunk.start;
            textoChunk = chunk.text.slice(offsetInChunk).trim();
            if (!textoChunk) {
                this.ttsState.currentChunkIndex++;
                this.ttsState.currentCharIndex = chunk.end;
                this.reproducirChunkActualTTS();
                return;
            }
        }

        const vozElegida = obtenerVozConfigurada();
        const rateFinal = obtenerRateConfigurado(true);

        const utterance = new SpeechSynthesisUtterance(textoChunk);
        utterance.lang = (vozElegida && vozElegida.lang) ? vozElegida.lang : 'es-ES';
        utterance.rate = rateFinal;
        if (vozElegida) utterance.voice = vozElegida;

        utterance.onboundary = (e) => {
            if (e.charIndex !== undefined && this.ttsState.fullText) {
                const absChar = Math.min(chunk.end, chunk.start + offsetInChunk + e.charIndex);
                this.ttsState.currentCharIndex = absChar;
            }
        };

        utterance.onend = () => {
            if (this.ttsState.isSpeaking) {
                this.ttsState.currentCharIndex = chunk.end;
                this.ttsState.currentChunkIndex++;
                if (this.ttsState.currentChunkIndex < this.ttsState.chunks.length) {
                    this.reproducirChunkActualTTS();
                } else {
                    this.finalizarTTS();
                }
            }
        };

        utterance.onerror = (err) => {
            if (err && (err.error === 'canceled' || err.error === 'interrupted')) return;
            console.warn('Error en TTS litúrgico:', err);
            this.ttsState.currentChunkIndex++;
            if (this.ttsState.currentChunkIndex < this.ttsState.chunks.length) {
                // Usar setTimeout para evitar bucle sincrónico infinito (Maximum call stack size exceeded)
                setTimeout(() => {
                    if (this.ttsState.isSpeaking) {
                        this.reproducirChunkActualTTS();
                    }
                }, 40);
            } else {
                this.finalizarTTS();
            }
        };

        try {
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Error al invocar speechSynthesis.speak:', e);
            setTimeout(() => {
                if (this.ttsState.isSpeaking) {
                    this.ttsState.currentChunkIndex++;
                    this.reproducirChunkActualTTS();
                }
            }, 60);
        }
    }

    iniciarTrackingProgresoTTS() {
        if (this.ttsState.trackerId) clearInterval(this.ttsState.trackerId);
        this.ttsState.trackerId = setInterval(() => {
            if (!this.ttsState.isSpeaking) {
                if (this.ttsState.trackerId) clearInterval(this.ttsState.trackerId);
                this.ttsState.trackerId = null;
                return;
            }

            const totalChars = this.ttsState.fullText ? this.ttsState.fullText.length : 1;
            const currentChars = this.ttsState.currentCharIndex || 0;
            const ratio = Math.max(0, Math.min(1, currentChars / totalChars));

            const slider = document.getElementById('cinta-slider-progreso');
            const tActual = document.getElementById('cinta-tiempo-actual');

            if (slider) slider.value = ratio * 100;
            document.documentElement.style.setProperty('--progreso-reproduccion', `${(ratio * 100).toFixed(1)}%`);
            if (tActual) tActual.textContent = this.formatearTiempo(Math.round(ratio * (this.ttsState.totalDurationSecs || 60)));
        }, 200);
    }

    mostrarToastPausa(mensaje) {
        const prevToast = document.getElementById('cinta-toast-pausa');
        if (prevToast) prevToast.remove();
        const prevSvg = document.getElementById('cinta-overlay-flecha');
        if (prevSvg) prevSvg.remove();

        const btnIglesia = document.getElementById('btn-iglesia-selector');
        const menuAudios = document.getElementById('cinta-menu-audios');

        // 1. Abrir menú de audios de la iglesia y resaltar botón
        if (btnIglesia) btnIglesia.classList.add('resaltado-atencion');
        if (menuAudios) menuAudios.classList.add('abierto');

        // 2. Crear y desplegar toast de aviso
        const toast = document.createElement('div');
        toast.id = 'cinta-toast-pausa';
        toast.className = 'cinta-toast-pausa';
        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icono">info</span>
            <span class="toast-texto">${mensaje}</span>
            <button type="button" class="btn-cerrar-toast" title="Cerrar aviso">
                <span class="material-symbols-outlined">close</span>
            </button>
        `;
        document.body.appendChild(toast);

        // 3. Crear overlay SVG con flecha curva amarilla apuntando del toast al icono de la iglesia
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'cinta-overlay-flecha';
        svg.setAttribute('class', 'cinta-overlay-flecha');
        svg.innerHTML = `
            <defs>
                <marker id="flecha-punta-amarilla" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#eab308" />
                </marker>
                <filter id="flecha-sombra" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.8"/>
                </filter>
            </defs>
            <path d="" fill="none" stroke="#eab308" stroke-width="4.5" stroke-linecap="round" marker-end="url(#flecha-punta-amarilla)" filter="url(#flecha-sombra)" stroke-dasharray="10 5" class="cinta-path-flecha"/>
        `;
        document.body.appendChild(svg);

        const actualizarFlecha = () => {
            if (!document.body.contains(toast) || !btnIglesia) return;
            const rT = toast.getBoundingClientRect();
            const rB = btnIglesia.getBoundingClientRect();

            // Origen: borde superior derecho del toast
            const startX = rT.right - 14;
            const startY = rT.top + 8;

            // Destino: centro inferior del botón de la iglesia
            const endX = rB.left + (rB.width / 2);
            const endY = rB.bottom + 6;

            // Punto de control de curvatura hacia la derecha y arriba
            const cpX = Math.max(startX, endX) + 24;
            const cpY = Math.min(startY, endY) + 8;

            const path = svg.querySelector('path');
            if (path) {
                path.setAttribute('d', `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`);
            }
        };

        requestAnimationFrame(actualizarFlecha);
        window.addEventListener('resize', actualizarFlecha);
        window.addEventListener('scroll', actualizarFlecha);

        const limpiarAvisoYFlecha = () => {
            window.removeEventListener('resize', actualizarFlecha);
            window.removeEventListener('scroll', actualizarFlecha);
            if (btnIglesia) btnIglesia.classList.remove('resaltado-atencion');
            if (document.body.contains(svg)) svg.remove();
            if (document.body.contains(toast)) {
                toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(-10px)';
                setTimeout(() => toast.remove(), 300);
            }
        };

        toast.querySelector('.btn-cerrar-toast').addEventListener('click', limpiarAvisoYFlecha);

        if (menuAudios) {
            menuAudios.querySelectorAll('.cinta-menu-item').forEach(item => {
                item.addEventListener('click', limpiarAvisoYFlecha, { once: true });
            });
        }

        setTimeout(() => {
            limpiarAvisoYFlecha();
        }, 7000);
    }

    pausarTTS() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.pause();
        }
        this.ttsState.isSpeaking = false;
        this.limpiarTemporizadoresTTS();
        this.actualizarIconoPlay(false);
    }

    detenerTTS() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        this.ttsState.isSpeaking = false;
        this.limpiarTemporizadoresTTS();
        this.actualizarIconoPlay(false);
    }

    finalizarTTS() {
        const modoTerminado = this.modoActivo;
        this.detenerTTS();
        this.ttsState.currentCharIndex = 0;
        this.ttsState.currentChunkIndex = 0;
        const slider = document.getElementById('cinta-slider-progreso');
        const tActual = document.getElementById('cinta-tiempo-actual');
        if (slider) slider.value = 0;
        if (tActual) tActual.textContent = '0:00';
        document.documentElement.style.setProperty('--progreso-reproduccion', '0%');

        // Encadenamiento automático de lecturas en TTS:
        // 1ª Lectura -> 2ª Lectura -> Evangelio
        if (modoTerminado === 'lectura1') {
            console.log('⏭️ [Cinta TTS] Fin de 1ª Lectura: Continuando automáticamente con 2ª Lectura');
            this.mostrarToastAviso('Continuando con 2ª Lectura...', 2500);
            setTimeout(() => {
                this.cambiarModoAudio('lectura2', true);
            }, 400);
        } else if (modoTerminado === 'lectura2') {
            console.log('⏭️ [Cinta TTS] Fin de 2ª Lectura: Continuando automáticamente con Evangelio');
            this.mostrarToastAviso('Continuando con Evangelio del Día...', 2500);
            setTimeout(() => {
                this.cambiarModoAudio('evangelio', true);
            }, 400);
        }
    }

    seekTTS(fraction) {
        if (!this.ttsState.fullText) this.prepararTTS();
        if (!this.ttsState.fullText) return;

        const targetChar = Math.round(fraction * this.ttsState.fullText.length);
        this.ttsState.currentCharIndex = targetChar;

        const tActual = document.getElementById('cinta-tiempo-actual');
        if (tActual) tActual.textContent = this.formatearTiempo(Math.round(fraction * this.ttsState.totalDurationSecs));

        if (this.ttsState.isSpeaking) {
            window.speechSynthesis.cancel();
            let targetIndex = this.ttsState.chunks.findIndex(c => targetChar < c.end);
            if (targetIndex === -1) targetIndex = 0;
            this.ttsState.currentChunkIndex = targetIndex;
            this.reproducirChunkActualTTS();
        }
    }

    iniciarHeartbeatTTS() {
        if (this.ttsState.heartbeatId) clearInterval(this.ttsState.heartbeatId);
        this.ttsState.heartbeatId = setInterval(() => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking && this.ttsState.isSpeaking) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
            } else if (!this.ttsState.isSpeaking) {
                if (this.ttsState.heartbeatId) {
                    clearInterval(this.ttsState.heartbeatId);
                    this.ttsState.heartbeatId = null;
                }
            }
        }, 7000);
    }

    limpiarTemporizadoresTTS() {
        if (this.ttsState.heartbeatId) {
            clearInterval(this.ttsState.heartbeatId);
            this.ttsState.heartbeatId = null;
        }
        if (this.ttsState.trackerId) {
            clearInterval(this.ttsState.trackerId);
            this.ttsState.trackerId = null;
        }
    }

    actualizarIconoPlay(sonando) {
        const iconPlay = document.getElementById('cinta-icon-play');
        if (iconPlay) {
            iconPlay.textContent = sonando ? 'pause' : 'play_arrow';
        }
    }

    // =========================================================================
    // CONMUTACIÓN DE MODOS DE AUDIO
    // =========================================================================

    cambiarModoAudio(nuevoModo, autoPlay = false) {
        if (!MODOS_AUDIO[nuevoModo]) return;
        this.modoActivo = nuevoModo;

        // Ajustar velocidad automáticamente según el modo:
        // Velocidad normal por defecto en 0 (1.00x)
        this.establecerVelocidadSegunModo(nuevoModo);

        try {
            localStorage.setItem('pref-audio-modo-defecto', nuevoModo);
            const selectDefault = document.querySelector('[data-id="global-audio-default-mode"] select');
            if (selectDefault && selectDefault.value !== nuevoModo) {
                selectDefault.value = nuevoModo;
            }
        } catch (_) {}

        const infoModo = MODOS_AUDIO[nuevoModo];
        const btnPlay = document.getElementById('btn-cinta-play');
        const iconPlay = document.getElementById('cinta-icon-play');
        const slider = document.getElementById('cinta-slider-progreso');
        const tActual = document.getElementById('cinta-tiempo-actual');
        const tTotal = document.getElementById('cinta-tiempo-total');

        // Actualizar botón Play y menú
        if (btnPlay) {
            btnPlay.className = `cinta-btn-play ${infoModo.claseBtn}`;
            btnPlay.title = `Reproducir ${infoModo.nombre}`;
        }

        document.querySelectorAll('.cinta-menu-item').forEach(it => {
            if (it.getAttribute('data-modo') === nuevoModo) {
                it.classList.add('activo');
            } else {
                it.classList.remove('activo');
            }
        });

        // Detener reproducciones anteriores
        this.audio.pause();
        this.detenerTTS();
        this.fuenteActiva = null;

        if (slider) slider.value = 0;
        if (tActual) tActual.textContent = '0:00';
        if (tTotal) tTotal.textContent = '0:00';
        if (iconPlay) iconPlay.textContent = 'play_arrow';
        document.documentElement.style.setProperty('--progreso-buffer', '0%');
        document.documentElement.style.setProperty('--progreso-reproduccion', '0%');

        const urlCandidata = (nuevoModo === 'hora') ? (this.audios.hora || '') : (this.audios[nuevoModo] || '');

        if (urlCandidata && !this.audiosFallidos.has(urlCandidata)) {
            // Intentar cargar archivo MP3 del servidor
            this.fuenteActiva = 'audio';
            this.audio.src = urlCandidata;
            this.audio.load();
            if (autoPlay) {
                this.audio.play().catch(() => {
                    this.audiosFallidos.add(urlCandidata);
                    this.ejecutarFallbackTTS(nuevoModo, autoPlay);
                });
            }
        } else {
            // Modo TTS directo
            this.fuenteActiva = 'tts';
            this.prepararTTS(nuevoModo);
            if (autoPlay) {
                this.reproducirTTS();
            }
        }
    }

    // Carga de URLs individuales y múltiples
    cargarEvangelio(url, subtitulo = '') {
        if (url) {
            this.audios.evangelio = url;
            this.subtitulos.evangelio = subtitulo;
            const sub = document.getElementById('menu-sub-evangelio');
            if (sub && subtitulo) sub.textContent = subtitulo;
            if (this.modoActivo === 'evangelio' && (!this.audio.src || this.audio.paused)) {
                this.audio.src = url;
            }
            this.actualizarBotonesOfflineMenu();
        }
    }

    cargarAudioLibro(url, nombreLibro = '') {
        if (url) {
            this.audios.hora = url;
            this.subtitulos.hora = nombreLibro;
            const sub = document.getElementById('menu-sub-hora');
            if (sub && nombreLibro) sub.textContent = nombreLibro;
            if (this.modoActivo === 'hora' && (!this.audio.src || this.audio.paused)) {
                this.audio.src = url;
            }
            this.actualizarBotonesOfflineMenu();
        }
    }

    cargarLectura1(url, subtitulo = '') {
        if (url) {
            this.audios.lectura1 = url;
            this.subtitulos.lectura1 = subtitulo;
            const sub = document.getElementById('menu-sub-lectura1');
            if (sub && subtitulo) sub.textContent = subtitulo;
            if (this.modoActivo === 'lectura1') {
                const estabaReproduciendo = !this.audio.paused && this.audio.currentTime > 0;
                if (this.audio.src !== url) {
                    this.audio.src = url;
                    if (estabaReproduciendo) {
                        this.audio.play().catch(() => {});
                    }
                }
            }
            this.actualizarBotonesOfflineMenu();
        }
    }

    cargarLectura2(url, subtitulo = '') {
        if (url) {
            this.audios.lectura2 = url;
            this.subtitulos.lectura2 = subtitulo;
            const sub = document.getElementById('menu-sub-lectura2');
            if (sub && subtitulo) sub.textContent = subtitulo;
            if (this.modoActivo === 'lectura2' && (!this.audio.src || this.audio.paused)) {
                this.audio.src = url;
            }
            this.actualizarBotonesOfflineMenu();
        }
    }

    cargarAudios(mapAudios = {}) {
        this.audiosFallidos.clear();
        this.fuenteActiva = null;
        if (this.audio) {
            this.audio.pause();
            this.audio.autoplay = false;
        }
        this.detenerTTS();
        this.actualizarIconoPlay(false);

        if (mapAudios.evangelio) this.cargarEvangelio(mapAudios.evangelio, mapAudios.subEvangelio);
        if (mapAudios.hora) this.cargarAudioLibro(mapAudios.hora, mapAudios.subHora);
        if (mapAudios.lectura1) this.cargarLectura1(mapAudios.lectura1, mapAudios.subLectura1);
        if (mapAudios.lectura2) this.cargarLectura2(mapAudios.lectura2, mapAudios.subLectura2);
        this.actualizarBotonesOfflineMenu();
    }

    // =========================================================================
    // ADMINISTRACIÓN DE AUDIOS OFFLINE EN EL MENÚ (ESTILO RESUCITÓ)
    // =========================================================================

    configurarBotonesOfflineMenu() {
        const menuAudios = document.getElementById('cinta-menu-audios');
        if (!menuAudios) return;

        // Escuchar eventos globales de cambio en caché offline
        window.addEventListener('lh_offline_audio_changed', () => {
            this.actualizarBotonesOfflineMenu();
        });

        // Event listener delegado para los botones offline
        menuAudios.addEventListener('click', (e) => {
            const btn = e.target.closest('.cinta-btn-offline');
            if (!btn) return;
            e.stopPropagation();

            const modo = btn.getAttribute('data-offline-modo');
            if (!modo) return;

            const urlAudio = (modo === 'hora') ? (this.audios.hora || '') : (this.audios[modo] || '');
            if (!urlAudio) {
                this.mostrarToastAviso('No hay audio en el servidor para esta opción');
                return;
            }

            const itemTitulo = btn.closest('.cinta-menu-item')?.querySelector('.cinta-item-titulo')?.textContent || MODOS_AUDIO[modo]?.nombre || modo;

            if (offlineAudioLh.isDownloading(urlAudio)) {
                this.mostrarToastAviso(`El audio de "${itemTitulo}" ya se está descargando...`);
                return;
            }

            // Si ya está descargado, mostrar popover para "Liberar"
            if (offlineAudioLh.isDownloaded(urlAudio)) {
                this.abrirPopoverLiberarAudio(btn, { id: urlAudio, title: itemTitulo, audioSrc: urlAudio, modo });
                return;
            }

            // Si está pendiente, descargarlo
            this.descargarAudioOffline(btn, { id: urlAudio, title: itemTitulo, audioSrc: urlAudio, modo });
        });

        this.actualizarBotonesOfflineMenu();
    }

    actualizarBotonesOfflineMenu() {
        const menuAudios = document.getElementById('cinta-menu-audios');
        if (!menuAudios) return;

        menuAudios.querySelectorAll('.cinta-btn-offline').forEach(btn => {
            const modo = btn.getAttribute('data-offline-modo');
            const urlAudio = (modo === 'hora') ? (this.audios.hora || '') : (this.audios[modo] || '');

            const iconSpan = btn.querySelector('.material-symbols-outlined');
            if (!iconSpan) return;

            if (offlineAudioLh.isDownloading(urlAudio)) {
                btn.className = 'cinta-btn-offline downloading';
                iconSpan.textContent = 'progress_activity';
                btn.title = 'Descargando audio para escuchar sin internet...';
            } else if (urlAudio && offlineAudioLh.isDownloaded(urlAudio)) {
                btn.className = 'cinta-btn-offline downloaded';
                iconSpan.textContent = 'download_done';
                btn.title = 'Audio descargado (Toca para liberar o ver detalles)';
            } else {
                btn.className = 'cinta-btn-offline';
                iconSpan.textContent = 'download';
                btn.title = urlAudio ? 'Descargar audio para escuchar sin conexión' : 'Audio aún no disponible para descarga';
                btn.style.opacity = urlAudio ? '1' : '0.4';
            }
        });
    }

    async descargarAudioOffline(btn, audioInfo) {
        if (!audioInfo || !audioInfo.audioSrc) return;

        btn.classList.add('downloading');
        const iconSpan = btn.querySelector('.material-symbols-outlined');
        if (iconSpan) iconSpan.textContent = 'progress_activity';

        try {
            const ok = await offlineAudioLh.downloadAudio(audioInfo);
            if (ok) {
                this.mostrarToastAviso(`¡Audio de "${audioInfo.title}" guardado! Ya puedes escucharlo sin conexión.`);
            }
        } catch (err) {
            console.warn('[Cinta] Error al descargar audio offline:', err);
            this.mostrarToastAviso(`No se pudo descargar el audio: ${err.message}`);
        } finally {
            this.actualizarBotonesOfflineMenu();
        }
    }

    abrirPopoverLiberarAudio(targetBtn, audioInfo) {
        this.cerrarPopoverLiberarAudio();

        const regItem = offlineAudioLh.getItem(audioInfo.id || audioInfo.audioSrc);
        let sizeText = 'Guardado localmente en este equipo';
        if (regItem && regItem.sizeBytes > 0) {
            const mb = (regItem.sizeBytes / (1024 * 1024)).toFixed(1);
            sizeText = `${mb} MB · Guardado en este equipo`;
        }

        const overlay = document.createElement('div');
        overlay.className = 'lh-offline-popover-overlay';
        overlay.id = 'lh-offline-popover-overlay';
        overlay.addEventListener('click', () => this.cerrarPopoverLiberarAudio());

        const popover = document.createElement('div');
        popover.className = 'lh-offline-popover';
        popover.id = 'lh-offline-popover';
        popover.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                <div class="popover-header">
                    <span class="material-symbols-outlined" style="font-size: 18px;">download_done</span>
                    <span>Audio Descargado</span>
                </div>
                <button type="button" class="btn-close-popover" style="background: none; border: none; padding: 2px; cursor: pointer; color: #94a3b8; display: flex; align-items: center;" title="Cerrar">
                    <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
                </button>
            </div>
            <div class="popover-audio-name" title="${audioInfo.title}">${audioInfo.title}</div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 3px;">${sizeText}</div>
            <div class="popover-divider"></div>
            <button type="button" class="btn-popover-liberar" data-action="confirm-liberar-audio">
                <span class="material-symbols-outlined" style="font-size: 19px;">delete_outline</span>
                <span>Liberar (Escuchar solo online)</span>
            </button>
            <div class="popover-hint">Al liberar se borra el archivo del equipo. Si quieres, podrás volver a descargarlo en cualquier momento.</div>
        `;

        popover.querySelector('.btn-close-popover')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.cerrarPopoverLiberarAudio();
        });

        const btnLiberar = popover.querySelector('[data-action="confirm-liberar-audio"]');
        btnLiberar?.addEventListener('click', async (e) => {
            e.stopPropagation();
            this.cerrarPopoverLiberarAudio();
            try {
                await offlineAudioLh.deleteAudio(audioInfo.id || audioInfo.audioSrc);
                this.mostrarToastAviso(`Audio de "${audioInfo.title}" liberado del equipo. Ahora se reproducirá online.`);
            } catch (err) {
                console.warn('[Cinta] Error al liberar audio offline:', err);
                this.mostrarToastAviso(`No se pudo liberar el audio: ${err.message}`);
            } finally {
                this.actualizarBotonesOfflineMenu();
            }
        });

        document.body.appendChild(overlay);
        document.body.appendChild(popover);

        // Posicionar popover cerca del botón objetivo
        const rect = targetBtn.getBoundingClientRect();
        const popoverWidth = 260;
        let left = rect.left - popoverWidth + rect.width;
        let top = rect.bottom + 8;

        if (left < 10) left = 10;
        if (left + popoverWidth > window.innerWidth - 10) {
            left = window.innerWidth - popoverWidth - 10;
        }
        if (top + 180 > window.innerHeight) {
            top = Math.max(10, rect.top - 190);
        }

        popover.style.left = `${Math.round(left)}px`;
        popover.style.top = `${Math.round(top)}px`;
    }

    cerrarPopoverLiberarAudio() {
        document.getElementById('lh-offline-popover-overlay')?.remove();
        document.getElementById('lh-offline-popover')?.remove();
    }

    // =========================================================================
    // CONTROL DE ZOOM CON FÓRMULA CALC(VAR(--SIZE) * VAR(--FONT-ZOOM))
    // =========================================================================

    cambiarTamanoTexto(delta) {
        // delta: +1 para aumentar, -1 para disminuir (equivalente a 1px sobre base de 16px)
        const paso = 1 / 16; // 0.0625
        let nuevoZoom = this.fontZoom + (delta * paso);
        const minZoom = 10 / 16; // 0.625 (10px)
        const maxZoom = 50 / 16; // 3.125 (50px)

        if (nuevoZoom < minZoom) nuevoZoom = minZoom;
        if (nuevoZoom > maxZoom) nuevoZoom = maxZoom;

        this.fontZoom = nuevoZoom;
        localStorage.setItem('lh_font_zoom', this.fontZoom.toFixed(4));
        localStorage.setItem('lh_font_size', String(Math.round(this.fontZoom * 16)));
        this.aplicarTamanoTexto(this.fontZoom);
        this.guardarTamanoEnFirebase(this.fontZoom);
    }

    resetearTamanoTexto() {
        this.fontZoom = 1.0;
        localStorage.setItem('lh_font_zoom', '1.0000');
        localStorage.setItem('lh_font_size', '16');
        this.aplicarTamanoTexto(1.0);
        this.guardarTamanoEnFirebase(1.0);
        console.log("🔄 [Cinta] Tamaño de texto restablecido a 16px (1.0)");
    }

    guardarTamanoEnFirebase(zoom) {
        if (this._debounceFirebaseZoom) {
            clearTimeout(this._debounceFirebaseZoom);
        }
        this._debounceFirebaseZoom = setTimeout(async () => {
            if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
                try {
                    await window.firebaseAPI.guardarAjustesFirestore('cinta_zoom', {
                        fontZoom: parseFloat(zoom.toFixed(4)),
                        fontSize: Math.round(zoom * 16),
                        actualizado: new Date().toISOString()
                    });
                    console.log(`☁️ [Cinta] Tamaño de texto guardado en Firebase: ${Math.round(zoom * 16)}px (${zoom.toFixed(4)})`);
                } catch (err) {
                    console.warn("⚠️ Error guardando tamaño en Firebase:", err);
                }
            }
        }, 400);
    }

    aplicarTamanoTexto(zoom) {
        const valZoom = (typeof zoom === 'number' && !isNaN(zoom)) ? zoom : 1.0;
        document.documentElement.style.setProperty('--size', '16px');
        document.documentElement.style.setProperty('--font-zoom', valZoom.toFixed(4));
        document.documentElement.style.setProperty('--salterio-font-size', 'calc(var(--size) * var(--font-zoom))');
        const spanZoom = document.getElementById('cinta-zoom-valor');
        if (spanZoom) {
            spanZoom.textContent = `${Math.round(valZoom * 16)}px`;
        }
    }

    // =========================================================================
    // CONTROL DE VELOCIDAD DE AUDIO (DE 5 EN 5: -25 A 25)
    // =========================================================================

    obtenerPasoVelocidadActual() {
        const stepSaved = localStorage.getItem('pref-audio-speed-step');
        if (stepSaved !== null && !isNaN(parseInt(stepSaved, 10))) {
            const s = parseInt(stepSaved, 10);
            if (PASOS_VELOCIDAD.includes(s)) return s;
        }
        const r = obtenerRateConfigurado(true);
        const dif = Math.round((r - 1.0) * 100);
        return PASOS_VELOCIDAD.reduce((prev, curr) => Math.abs(curr - dif) < Math.abs(prev - dif) ? curr : prev, 0);
    }

    formatearTextoVelocidad(rate = null) {
        const r = (typeof rate === 'number' && !isNaN(rate)) ? rate : obtenerRateConfigurado(true);
        const dif = Math.round((r - 1.0) * 100);
        if (dif === 0) return 'x1';
        const s = r.toFixed(2).replace(/0$/, '');
        return `x${s}`;
    }

    generarPasosVelocidadHtml() {
        const pasoActual = this.obtenerPasoVelocidadActual();
        return PASOS_VELOCIDAD.map(p => {
            const esActivo = (p === pasoActual) ? 'activo' : '';
            const esCero = (p === 0) ? 'cinta-vel-cero' : '';
            return `<button type="button" class="cinta-vel-item ${esCero} ${esActivo}" data-step="${p}">${p}</button>`;
        }).join('');
    }

    establecerVelocidad(step) {
        const s = parseInt(step, 10) || 0;
        const rate = parseFloat((1.0 + (s / 100)).toFixed(2));
        localStorage.setItem('pref-tts-rate', String(rate));
        localStorage.setItem('pref-audio-speed-step', String(s));

        if (this.audio) {
            this.audio.playbackRate = rate;
        }

        // El botón solo dice x1 como solicitó el usuario
        const btn = document.getElementById('btn-cinta-velocidad');
        if (btn) btn.textContent = 'x1';

        document.querySelectorAll('.cinta-vel-item').forEach(it => {
            const itStep = parseInt(it.getAttribute('data-step'), 10);
            if (itStep === s) {
                it.classList.add('activo');
            } else {
                it.classList.remove('activo');
            }
        });

        // Actualizar control en Configuración si existe
        if (typeof window !== 'undefined' && typeof window.actualizarVelocidadEnAjustes === 'function') {
            window.actualizarVelocidadEnAjustes(s, rate);
        }

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('lh-tts-rate-changed', { detail: { rate, step: s } }));
        }
    }

    establecerVelocidadSegunModo(modo) {
        // Velocidad normal en 0 (1.00x) para todos los modos (incluyendo Liturgia de las Horas)
        const step = 0;
        this.establecerVelocidad(step);
    }

    // Actualización de Información Litúrgica y Botones Activos
    actualizarLiturgiaInfo(tiempo, semana, dia, libro, tiempoSlug = '', diaSlug = '', extras = {}) {
        // Al actualizar o cambiar la hora litúrgica, pausar reproducciones previas y esperar al usuario
        if (this.audio) {
            this.audio.pause();
            this.audio.autoplay = false;
        }
        this.detenerTTS();
        this.actualizarIconoPlay(false);

        this.opciones = {
            ...this.opciones,
            tiempo: tiempo || this.opciones.tiempo,
            semana: semana !== undefined ? semana : this.opciones.semana,
            dia: dia || this.opciones.dia,
            libro: libro || this.opciones.libro,
            tiempoSlug: tiempoSlug || this.opciones.tiempoSlug,
            diaSlug: diaSlug || this.opciones.diaSlug,
            ...extras
        };

        const btnTiempo = document.getElementById('btn-toggle-tiempo');
        const txtMetadatos = document.getElementById('cinta-texto-metadatos');

        if (btnTiempo) {
            btnTiempo.innerHTML = this.formatearTextoTiempo(tiempo || this.opciones.tiempo || 'Tiempo Ordinario');
            const slug = (tiempoSlug || this.opciones.tiempoSlug || 'ordinario').toLowerCase();
            btnTiempo.className = `cinta-badge-tiempo tiempo-${slug}`;
        }
        if (txtMetadatos) {
            txtMetadatos.innerHTML = this.formatearTextoMetadatos(this.opciones.semana, this.opciones.dia);
            txtMetadatos.classList.remove('activo');
        }

        const selectorSemanas = document.getElementById('cinta-selector-semanas');
        if (selectorSemanas) {
            selectorSemanas.classList.remove('desplegado');
            selectorSemanas.innerHTML = '';
        }

        // Actualizar hora activa y enlaces si aplica
        const libroNorm = (libro || this.opciones.libro || 'laudes').toLowerCase();
        const mapT = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp', santos: 'san', solemnidades: 'sol', fiestas: 'fie' };
        const mapD = { domingo: 'do', lunes: 'lu', martes: 'ma', miercoles: 'mi', jueves: 'ju', viernes: 'vi', sabado: 'sa' };
        const mapH = { oficio: 'of', laudes: 'la', tercia: 'te', sexta: 'se', nona: 'no', visperas: 'vi', completas: 'co' };
        const slugReal = (tiempoSlug || this.opciones.tiempoSlug || 'ordinario').toLowerCase();
        const esCelebracion = ['santos', 'solemnidades', 'fiestas'].includes(slugReal);
        const tCode = mapT[slugReal] || 'to';
        const dSlugNorm = (diaSlug || this.opciones.diaSlug || 'domingo').toLowerCase();
        const dCode = mapD[dSlugNorm] || 'do';
        const semActual = this.opciones.semana || 1;
        const semPad = String(semActual).padStart(2, '0');

        document.querySelectorAll('.cinta-btn-hora').forEach(btn => {
            const hId = btn.getAttribute('data-libro');
            if (hId === libroNorm) {
                btn.classList.add('activo');
            } else {
                btn.classList.remove('activo');
            }
            const hCode = mapH[hId] || 'la';
            if (esCelebracion) {
                const baseId = this.opciones.baseCelebracionId || dSlugNorm.replace(/(of|la|te|se|no|vi|co)$/i, '');
                if (baseId) {
                    const sParam = this.opciones.santo ? `&santo=${encodeURIComponent(this.opciones.santo)}` : '';
                    const fParam = this.opciones.fecha ? `&fecha=${encodeURIComponent(this.opciones.fecha)}` : '';
                    btn.setAttribute('href', `salterios.html?tiempo=santos&libro=${hId}&id=${baseId}${hCode}${sParam}${fParam}`);
                }
            } else {
                const docId = `${tCode}s${semPad}${dCode}${hCode}`;
                btn.setAttribute('href', `?tiempo=${slugReal}&semana=${semActual}&dia=${dSlugNorm}&libro=${hId}&hora=${hId}&id=${docId}`);
            }
        });

        // Actualizar botón conmutador de ciclo de lectura en Oficio
        const btnCicloAnio = document.getElementById('btn-ciclo-anio');
        if (btnCicloAnio) {
            if (libroNorm === 'oficio') {
                btnCicloAnio.classList.add('visible');
                btnCicloAnio.textContent = this.cicloAnio === 'par' ? 'II' : 'I';
                btnCicloAnio.title = this.cicloAnio === 'par'
                    ? 'Año II (Par) - Toca para cambiar a Año I (Impar)'
                    : 'Año I (Impar) - Toca para cambiar a Año II (Par)';
            } else {
                btnCicloAnio.classList.remove('visible');
            }
        }

        // Si el modo activo es hora, refrescar texto para TTS
        if (this.modoActivo === 'hora' && !this.ttsState.isSpeaking) {
            this.prepararTTS();
        }
    }

    normalizarTiempoSlug(rawSlug) {
        const s = (rawSlug || 'ordinario').toLowerCase().trim();
        if (s.includes('adviento') || s === 'ta') return 'adviento';
        if (s.includes('navidad') || s === 'tn') return 'navidad';
        if (s.includes('cuaresma') || s === 'tc') return 'cuaresma';
        if (s.includes('pascua') || s === 'tp') return 'pascua';
        if (s.includes('solemnidad') || s === 'sol') return 'solemnidades';
        if (s.includes('fiesta') || s === 'fie') return 'fiestas';
        if (s.includes('santo') || s === 'san') return 'santos';
        return 'ordinario';
    }

    renderizarSelectorSemanas(contenedor) {
        if (!contenedor) return;
        const tiempo = this.normalizarTiempoSlug(this.opciones.tiempoSlug || this.opciones.tiempo);
        const config = CONFIGURACION_TIEMPOS_CINTA[tiempo] || CONFIGURACION_TIEMPOS_CINTA.ordinario;

        const coloresPorTiempo = {
            adviento: '#7B2FBE',
            navidad: '#8B0000',
            ordinario: '#2E7D32',
            cuaresma: '#4A0080',
            pascua: '#0288D1',
            santos: '#B71C1C',
            solemnidades: '#0288D1',
            fiestas: '#D97706'
        };
        const colorTiempo = coloresPorTiempo[tiempo] || '#2E7D32';
        contenedor.style.setProperty('--color-tiempo', colorTiempo);

        if (config.tipo === 'semanas') {
            let htmlGrid = '<div class="sub-acordeon-grid">';
            for (let i = 1; i <= config.total; i++) {
                htmlGrid += `<button type="button" class="btn-sub-semana" data-semana="${i}" data-prefijo="${config.prefijoId}" title="Semana ${i}">${i}</button>`;
            }
            htmlGrid += `<div class="semana-horas-panel" id="cinta-panel-horas-${tiempo}" style="display:none;"></div>`;
            htmlGrid += '</div>';
            contenedor.innerHTML = htmlGrid;

            const panelHoras = contenedor.querySelector('.semana-horas-panel');
            const botonesSemanas = contenedor.querySelectorAll('.btn-sub-semana');

            const DIAS_SEMANA_LITURGICA = [
                { inicial: 'D', dia: 'domingo', cod: 'do', nombre: 'Domingo' },
                { inicial: 'L', dia: 'lunes', cod: 'lu', nombre: 'Lunes' },
                { inicial: 'M', dia: 'martes', cod: 'ma', nombre: 'Martes' },
                { inicial: 'M', dia: 'miercoles', cod: 'mi', nombre: 'Miércoles' },
                { inicial: 'J', dia: 'jueves', cod: 'ju', nombre: 'Jueves' },
                { inicial: 'V', dia: 'viernes', cod: 'vi', nombre: 'Viernes' },
                { inicial: 'S', dia: 'sabado', cod: 'sa', nombre: 'Sábado' }
            ];

            const generarGridHoras = (t, s, dSlug, dCod) => {
                const semPad = String(s).padStart(2, '0');
                const mapT = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp', santos: 'san' };
                const tCode = mapT[t] || 'to';

                const horasConfig = [
                    { id: 'oficio', label: 'Oficio de Lectura', icon: 'menu_book', docId: `${tCode}s${semPad}${dCod}of` },
                    { id: 'laudes', label: 'Laudes', icon: 'wb_twilight', docId: `${tCode}s${semPad}${dCod}la` },
                    { id: 'tercia', label: 'Tercia', icon: 'schedule', docId: `${tCode}s${semPad}${dCod}te` },
                    { id: 'sexta', label: 'Sexta', icon: 'light_mode', docId: `${tCode}s${semPad}${dCod}se` },
                    { id: 'nona', label: 'Nona', icon: 'wb_sunny', docId: `${tCode}s${semPad}${dCod}no` },
                    { id: 'visperas', label: 'Vísperas', icon: 'wb_twilight', docId: `${tCode}s${semPad}${dCod}vi` },
                    { id: 'completas', label: 'Completas', icon: 'bedtime', docId: `${tCode}s${semPad}${dCod}co` }
                ];

                return horasConfig.map(h => {
                    const url = `salterios.html?tiempo=${t}&semana=${s}&dia=${dSlug}&libro=${h.id}&hora=${h.id}&id=${h.docId}`;
                    return `
                        <a href="${url}" class="btn-semana-hora">
                            <span class="material-symbols-outlined">${h.icon}</span>
                            <span>${h.label}</span>
                        </a>
                    `;
                }).join('');
            };

            botonesSemanas.forEach((bSemana, index) => {
                bSemana.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const numSem = bSemana.getAttribute('data-semana');

                    if (bSemana.classList.contains('activo')) {
                        bSemana.classList.remove('activo');
                        panelHoras.style.display = 'none';
                        panelHoras.innerHTML = '';
                        return;
                    }

                    botonesSemanas.forEach(b => b.classList.remove('activo'));
                    bSemana.classList.add('activo');

                    const columnas = 6;
                    const finFilaIndex = Math.min(Math.floor(index / columnas) * columnas + (columnas - 1), botonesSemanas.length - 1);
                    const botonFinFila = botonesSemanas[finFilaIndex];
                    botonFinFila.after(panelHoras);

                    const diaSlugActual = (this.opciones.diaSlug || '').toLowerCase();
                    const diaInfoInicial = DIAS_SEMANA_LITURGICA.find(d => d.dia === diaSlugActual) || DIAS_SEMANA_LITURGICA[0];
                    let diaActivo = diaInfoInicial.dia;
                    let codActivo = diaInfoInicial.cod;

                    const actualizarPanel = (dSel, cSel) => {
                        diaActivo = dSel;
                        codActivo = cSel;
                        panelHoras.innerHTML = `
                            <div class="semana-horas-panel-header">Semana ${numSem} — Horas Litúrgicas</div>
                            <div class="semana-dias-selector">
                                ${DIAS_SEMANA_LITURGICA.map(d => `
                                    <button type="button" class="btn-semana-dia ${d.dia === diaActivo ? 'activo' : ''}" data-dia="${d.dia}" data-cod="${d.cod}" title="${d.nombre}">
                                        ${d.inicial}
                                    </button>
                                `).join('')}
                            </div>
                            <div class="semana-horas-grid">
                                ${generarGridHoras(tiempo, numSem, diaActivo, codActivo)}
                            </div>
                        `;

                        panelHoras.querySelectorAll('.btn-semana-dia').forEach(bDia => {
                            bDia.addEventListener('click', (ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                const nuevoDia = bDia.getAttribute('data-dia');
                                const nuevoCod = bDia.getAttribute('data-cod');
                                actualizarPanel(nuevoDia, nuevoCod);
                            });
                        });
                    };

                    actualizarPanel(diaActivo, codActivo);
                    panelHoras.style.display = 'flex';
                });
            });
        } else if (config.tipo === 'meses') {
            let htmlMeses = '<div class="sub-acordeon-h" id="cinta-meses-santos-lista">';
            config.meses.forEach((m, idx) => {
                htmlMeses += `<button type="button" class="btn-sub-mes" data-mes-num="${idx + 1}" data-mes-nombre="${m.nombre}">${m.nombre}</button>`;
            });
            htmlMeses += '</div>';
            htmlMeses += `
                <div class="santos-mes-contenedor" id="cinta-santos-mes-contenedor" style="display:none;">
                    <div class="santos-dias-grid" id="cinta-grid-dias-santos"></div>
                    <div class="semana-horas-panel panel-santos-rojo" id="cinta-panel-horas-santos" style="display:none;"></div>
                </div>
            `;
            contenedor.innerHTML = htmlMeses;

            const botonesMeses = contenedor.querySelectorAll('.btn-sub-mes');
            const contenedorMes = contenedor.querySelector('#cinta-santos-mes-contenedor');
            const gridDias = contenedor.querySelector('#cinta-grid-dias-santos');
            const panelHorasSantos = contenedor.querySelector('#cinta-panel-horas-santos');

            const obtenerAsignacionesCompletas = () => {
                let asignaciones = {};
                try {
                    asignaciones = JSON.parse(localStorage.getItem('lh_santos_calendario_anual')) || {};
                } catch (_) {}

                const mapaCatalogo = obtenerCatalogoCompletoSantosCinta();
                const normalizarClaveFecha = (str) => {
                    if (!str || typeof str !== 'string') return null;
                    const match = str.trim().match(/^(\d{1,2})[\/\-](\d{1,2})/);
                    if (match) {
                        const dia = parseInt(match[1], 10);
                        const mes = parseInt(match[2], 10);
                        if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12) return `${dia}/${mes}`;
                    }
                    return null;
                };

                mapaCatalogo.forEach(s => {
                    if (!s || !s.nombre) return;
                    const claveFest = normalizarClaveFecha(s.fechaFestividad || s.celebracion);
                    const claveMuerte = normalizarClaveFecha(s.muerte);
                    const claveDestino = claveFest || claveMuerte;
                    if (claveDestino && !asignaciones[claveDestino]) {
                        asignaciones[claveDestino] = s.nombre;
                    }
                });

                return asignaciones;
            };

            const generarGridHorasSanto = (d, mNum, sNombre) => {
                const horasConfig = [
                    { id: 'oficio', label: 'Oficio de Lectura', icon: 'menu_book', cod: 'of' },
                    { id: 'laudes', label: 'Laudes', icon: 'wb_twilight', cod: 'la' },
                    { id: 'tercia', label: 'Tercia', icon: 'schedule', cod: 'te' },
                    { id: 'sexta', label: 'Sexta', icon: 'light_mode', cod: 'se' },
                    { id: 'nona', label: 'Nona', icon: 'wb_sunny', cod: 'no' },
                    { id: 'visperas', label: 'Vísperas', icon: 'wb_twilight', cod: 'vi' },
                    { id: 'completas', label: 'Completas', icon: 'bedtime', cod: 'co' }
                ];

                const mesesEsp = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                const mesNombre = mesesEsp[mNum - 1] || '';
                const fechaTexto = `${d} de ${mesNombre}`;

                return horasConfig.map(h => {
                    const codLiturgia = resolverCodigoHoraSantoCinta(d, mNum, sNombre, h.id, h.cod);
                    const url = `salterios.html?tiempo=santos&libro=${h.id}&id=${codLiturgia}&santo=${encodeURIComponent(sNombre)}&fecha=${encodeURIComponent(fechaTexto)}`;
                    return `
                        <a href="${url}" class="btn-semana-hora">
                            <span class="material-symbols-outlined">${h.icon}</span>
                            <span>${h.label}</span>
                        </a>
                    `;
                }).join('');
            };

            botonesMeses.forEach(bMes => {
                bMes.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const mesNum = parseInt(bMes.getAttribute('data-mes-num'), 10);
                    const mesNombre = bMes.getAttribute('data-mes-nombre');

                    if (bMes.classList.contains('activo')) {
                        bMes.classList.remove('activo');
                        contenedorMes.style.display = 'none';
                        gridDias.innerHTML = '';
                        panelHorasSantos.style.display = 'none';
                        panelHorasSantos.innerHTML = '';
                        return;
                    }

                    botonesMeses.forEach(b => b.classList.remove('activo'));
                    bMes.classList.add('activo');

                    contenedorMes.style.display = 'flex';
                    panelHorasSantos.style.display = 'none';
                    panelHorasSantos.innerHTML = '';

                    const anio = new Date().getFullYear();
                    const totalDias = new Date(anio, mesNum, 0).getDate();
                    const asignaciones = obtenerAsignacionesCompletas();

                    let htmlDias = '';
                    for (let d = 1; d <= totalDias; d++) {
                        const clave = `${d}/${mesNum}`;
                        const santoAsignado = asignaciones[clave];
                        const tieneSanto = santoAsignado && typeof santoAsignado === 'string' && santoAsignado.trim() && !santoAsignado.includes('-- Sin santo asignado --') && !santoAsignado.includes('— Sin santo asignado —');

                        if (tieneSanto) {
                            const nombreLimpio = santoAsignado.trim();
                            htmlDias += `
                                <button type="button" 
                                        class="btn-sub-semana btn-santo-dia-activo" 
                                        data-dia="${d}" 
                                        data-mes="${mesNum}" 
                                        data-santo="${nombreLimpio.replace(/"/g, '&quot;')}" 
                                        title="${d} de ${mesNombre}: ${nombreLimpio}">
                                    ${d}
                                </button>
                            `;
                        } else {
                            htmlDias += `
                                <button type="button" 
                                        class="btn-sub-semana btn-santo-dia-inactivo" 
                                        disabled 
                                        data-dia="${d}" 
                                        title="${d} de ${mesNombre}: Sin fiesta asignada">
                                    ${d}
                                </button>
                            `;
                        }
                    }
                    gridDias.innerHTML = htmlDias;

                    const botonesDiasActivos = gridDias.querySelectorAll('.btn-santo-dia-activo');
                    const todosLosBotones = gridDias.querySelectorAll('.btn-sub-semana');

                    botonesDiasActivos.forEach(bDia => {
                        bDia.addEventListener('click', (ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            const d = parseInt(bDia.getAttribute('data-dia'), 10);
                            const sNombre = bDia.getAttribute('data-santo');

                            if (bDia.classList.contains('activo')) {
                                bDia.classList.remove('activo');
                                panelHorasSantos.style.display = 'none';
                                panelHorasSantos.innerHTML = '';
                                return;
                            }

                            todosLosBotones.forEach(b => b.classList.remove('activo'));
                            bDia.classList.add('activo');

                            const indexTotal = Array.from(todosLosBotones).indexOf(bDia);
                            const columnas = 7;
                            const finFilaIndex = Math.min(Math.floor(indexTotal / columnas) * columnas + (columnas - 1), todosLosBotones.length - 1);
                            const botonFinFila = todosLosBotones[finFilaIndex];
                            botonFinFila.after(panelHorasSantos);

                            panelHorasSantos.innerHTML = `
                                <div class="semana-horas-panel-header">${sNombre}</div>
                                <div class="semana-horas-grid">
                                    ${generarGridHorasSanto(d, mesNum, sNombre)}
                                </div>
                            `;
                            panelHorasSantos.style.display = 'flex';
                            panelHorasSantos.style.flexDirection = 'column';
                        });
                    });
                });
            });
        } else if (config.tipo === 'solemnidades') {
            let htmlSolem = '<div class="sub-acordeon-v">';
            config.items.forEach(s => {
                htmlSolem += `
                    <button type="button" class="btn-sub-solem" data-solem-id="${s.id}" data-solem-titulo="${s.titulo || s.nombre}">
                        <span class="material-symbols-outlined">auto_awesome</span>
                        <span>${s.nombre}</span>
                    </button>
                `;
            });
            htmlSolem += '<div class="semana-horas-panel panel-solemnidad-pascua" id="cinta-panel-horas-solemnidades" style="display:none;"></div>';
            htmlSolem += '</div>';
            contenedor.innerHTML = htmlSolem;

            const panelHorasSolem = contenedor.querySelector('#cinta-panel-horas-solemnidades');
            const botonesSolem = contenedor.querySelectorAll('.btn-sub-solem');

            const generarGridHorasSolemnidad = (baseId, solemNombre, solemTitulo) => {
                const horasConfig = [
                    { id: 'oficio', label: 'Oficio de Lectura', icon: 'menu_book', cod: 'of' },
                    { id: 'laudes', label: 'Laudes', icon: 'wb_twilight', cod: 'la' },
                    { id: 'tercia', label: 'Tercia', icon: 'schedule', cod: 'te' },
                    { id: 'sexta', label: 'Sexta', icon: 'light_mode', cod: 'se' },
                    { id: 'nona', label: 'Nona', icon: 'wb_sunny', cod: 'no' },
                    { id: 'visperas', label: 'Vísperas', icon: 'wb_twilight', cod: 'vi' },
                    { id: 'completas', label: 'Completas', icon: 'bedtime', cod: 'co' }
                ];

                const mapaCatalogo = obtenerCatalogoCompletoSantosCinta();
                const norm = (s) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
                const targetNorm = norm(solemNombre);

                let santoEncontrado = mapaCatalogo.get((solemNombre || '').toLowerCase().trim());
                if (!santoEncontrado) {
                    for (const s of mapaCatalogo.values()) {
                        if (s && s.nombre && norm(s.nombre) === targetNorm) {
                            santoEncontrado = s;
                            break;
                        }
                    }
                }

                let diaNum = 1;
                let mesNum = 1;
                if (santoEncontrado) {
                    const raw = (santoEncontrado.celebracion || santoEncontrado.fechaFestividad || '').trim();
                    const mSlash = raw.match(/^(\d{1,2})\/(\d{1,2})/);
                    if (mSlash) {
                        diaNum = parseInt(mSlash[1], 10);
                        mesNum = parseInt(mSlash[2], 10);
                    }
                } else {
                    const mTit = (solemTitulo || '').match(/^(\d{1,2})\s+de\s+([A-Za-z]+)/i);
                    if (mTit) {
                        diaNum = parseInt(mTit[1], 10);
                        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                        const mIdx = meses.indexOf(mTit[2].toLowerCase());
                        if (mIdx >= 0) mesNum = mIdx + 1;
                    }
                }

                return horasConfig.map(h => {
                    let codFinal = '';
                    if (santoEncontrado) {
                        codFinal = resolverCodigoHoraSantoCinta(diaNum, mesNum, santoEncontrado.nombre, h.id, h.cod);
                    } else {
                        codFinal = `${baseId}${h.cod}`;
                    }
                    const url = `salterios.html?tiempo=santos&libro=${h.id}&id=${codFinal}&santo=${encodeURIComponent(solemNombre)}&fecha=${encodeURIComponent(solemTitulo || solemNombre)}`;
                    return `
                        <a href="${url}" class="btn-semana-hora">
                            <span class="material-symbols-outlined">${h.icon}</span>
                            <span>${h.label}</span>
                        </a>
                    `;
                }).join('');
            };

            botonesSolem.forEach(bSolem => {
                bSolem.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const solemId = bSolem.getAttribute('data-solem-id');
                    const solemTitulo = bSolem.getAttribute('data-solem-titulo');
                    const solemItem = config.items.find(it => it.id === solemId);
                    const solemNombre = solemItem ? solemItem.nombre : solemTitulo;

                    if (bSolem.classList.contains('activo')) {
                        bSolem.classList.remove('activo');
                        panelHorasSolem.style.display = 'none';
                        panelHorasSolem.innerHTML = '';
                        return;
                    }

                    botonesSolem.forEach(b => b.classList.remove('activo'));
                    bSolem.classList.add('activo');
                    bSolem.after(panelHorasSolem);

                    panelHorasSolem.innerHTML = `
                        <div class="semana-horas-panel-header">${solemTitulo}</div>
                        <div class="semana-horas-grid">
                            ${generarGridHorasSolemnidad(solemId, solemNombre, solemTitulo)}
                        </div>
                    `;
                    panelHorasSolem.style.display = 'flex';
                    panelHorasSolem.style.flexDirection = 'column';
                });
            });
        } else if (config.tipo === 'fiestas') {
            let htmlFiesta = '<div class="sub-acordeon-v">';
            config.items.forEach(f => {
                htmlFiesta += `
                    <button type="button" class="btn-sub-fiesta" data-fiesta-id="${f.id}" data-fiesta-titulo="${f.titulo || f.nombre}">
                        <span class="material-symbols-outlined">celebration</span>
                        <span>${f.nombre}</span>
                    </button>
                `;
            });
            htmlFiesta += '<div class="semana-horas-panel panel-fiestas" id="cinta-panel-horas-fiestas" style="display:none;"></div>';
            htmlFiesta += '</div>';
            contenedor.innerHTML = htmlFiesta;

            const panelHorasFiesta = contenedor.querySelector('#cinta-panel-horas-fiestas');
            const botonesFiesta = contenedor.querySelectorAll('.btn-sub-fiesta');

            const generarGridHorasFiesta = (baseId, fiestaNombre, fiestaTitulo) => {
                const horasConfig = [
                    { id: 'oficio', label: 'Oficio de Lectura', icon: 'menu_book', cod: 'of' },
                    { id: 'laudes', label: 'Laudes', icon: 'wb_twilight', cod: 'la' },
                    { id: 'tercia', label: 'Tercia', icon: 'schedule', cod: 'te' },
                    { id: 'sexta', label: 'Sexta', icon: 'light_mode', cod: 'se' },
                    { id: 'nona', label: 'Nona', icon: 'wb_sunny', cod: 'no' },
                    { id: 'visperas', label: 'Vísperas', icon: 'wb_twilight', cod: 'vi' },
                    { id: 'completas', label: 'Completas', icon: 'bedtime', cod: 'co' }
                ];

                const mapaCatalogo = obtenerCatalogoCompletoSantosCinta();
                const norm = (s) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
                const targetNorm = norm(fiestaNombre);

                let santoEncontrado = mapaCatalogo.get((fiestaNombre || '').toLowerCase().trim());
                if (!santoEncontrado) {
                    for (const s of mapaCatalogo.values()) {
                        if (s && s.nombre && norm(s.nombre) === targetNorm) {
                            santoEncontrado = s;
                            break;
                        }
                    }
                }

                let diaNum = 1;
                let mesNum = 1;
                if (santoEncontrado) {
                    const raw = (santoEncontrado.celebracion || santoEncontrado.fechaFestividad || '').trim();
                    const mSlash = raw.match(/^(\d{1,2})\/(\d{1,2})/);
                    if (mSlash) {
                        diaNum = parseInt(mSlash[1], 10);
                        mesNum = parseInt(mSlash[2], 10);
                    }
                } else {
                    const mTit = (fiestaTitulo || '').match(/^(\d{1,2})\s+de\s+([A-Za-z]+)/i);
                    if (mTit) {
                        diaNum = parseInt(mTit[1], 10);
                        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                        const mIdx = meses.indexOf(mTit[2].toLowerCase());
                        if (mIdx >= 0) mesNum = mIdx + 1;
                    }
                }

                return horasConfig.map(h => {
                    let codFinal = '';
                    if (santoEncontrado) {
                        codFinal = resolverCodigoHoraSantoCinta(diaNum, mesNum, santoEncontrado.nombre, h.id, h.cod);
                    } else {
                        codFinal = `${baseId}${h.cod}`;
                    }
                    const url = `salterios.html?tiempo=santos&libro=${h.id}&id=${codFinal}&santo=${encodeURIComponent(fiestaNombre)}&fecha=${encodeURIComponent(fiestaTitulo || fiestaNombre)}`;
                    return `
                        <a href="${url}" class="btn-semana-hora">
                            <span class="material-symbols-outlined">${h.icon}</span>
                            <span>${h.label}</span>
                        </a>
                    `;
                }).join('');
            };

            botonesFiesta.forEach(bFiesta => {
                bFiesta.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const fiestaId = bFiesta.getAttribute('data-fiesta-id');
                    const fiestaTitulo = bFiesta.getAttribute('data-fiesta-titulo');
                    const fiestaItem = config.items.find(it => it.id === fiestaId);
                    const fiestaNombre = fiestaItem ? fiestaItem.nombre : fiestaTitulo;

                    if (bFiesta.classList.contains('activo')) {
                        bFiesta.classList.remove('activo');
                        panelHorasFiesta.style.display = 'none';
                        panelHorasFiesta.innerHTML = '';
                        return;
                    }

                    botonesFiesta.forEach(b => b.classList.remove('activo'));
                    bFiesta.classList.add('activo');
                    bFiesta.after(panelHorasFiesta);

                    panelHorasFiesta.innerHTML = `
                        <div class="semana-horas-panel-header">${fiestaTitulo}</div>
                        <div class="semana-horas-grid">
                            ${generarGridHorasFiesta(fiestaId, fiestaNombre, fiestaTitulo)}
                        </div>
                    `;
                    panelHorasFiesta.style.display = 'flex';
                    panelHorasFiesta.style.flexDirection = 'column';
                });
            });
        }
    }

    establecerCicloAnio(ciclo) {
        const cNorm = (ciclo === 'impar' || ciclo === 1 || ciclo === '1') ? 'impar' : 'par';
        this.cicloAnio = cNorm;
        if (typeof window !== 'undefined') {
            window.__cicloAnioOficio = cNorm;
        }
        const btnCicloAnio = document.getElementById('btn-ciclo-anio');
        if (btnCicloAnio) {
            btnCicloAnio.textContent = cNorm === 'par' ? 'II' : 'I';
            btnCicloAnio.title = cNorm === 'par'
                ? 'Año II (Par) - Toca para cambiar a Año I (Impar)'
                : 'Año I (Impar) - Toca para cambiar a Año II (Par)';
        }
    }

    formatearTiempo(segundos) {
        if (isNaN(segundos) || segundos < 0) return '0:00';
        const mins = Math.floor(segundos / 60);
        const segs = Math.floor(segundos % 60);
        return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
    }
}

if (typeof window !== 'undefined') {
    window.CintaLiturgica = CintaLiturgica;
    window.MODOS_AUDIO = MODOS_AUDIO;
}
