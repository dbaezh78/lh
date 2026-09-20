/**
 * db-lecturabreve.js
 * Catálogo Canónico y Repositorio de Lecturas Breves y Responsorios
 * 
 * Estructura estándar:
 * - id: Identificador único (ej: tos1LAdo, bautismoLA)
 * - tiempo: ordinario | adviento | navidad | cuaresma | pascua | santos
 * - semana: número de semana
 * - dia: domingo | lunes | martes | miercoles | jueves | viernes | sabado
 * - libro: laudes | visperas | completas | tercia | sexta | nona
 * - cita: Código/cita bíblica fija en rojo (ej: Is 61, 1-2a)
 * - texto: Texto de la lectura breve
 * - rb1: Responsorio principal (se repite 3 veces: V1, R1 y R3 tras Gloria Patri)
 * - rb2: Segundo versículo (V2)
 * - rb3: Segunda respuesta (R2)
 */

export const CATALOGO_LECTURAS_SEED = [
    {
        "id": "bautismoLA",
        "varName": "bautismoLA",
        "tiempo": "navidad",
        "semana": "2",
        "dia": "domingo",
        "libro": "laudes",
        "cita": "Is 61, 1-2a",
        "texto": "El Espíritu del Señor está sobre mí, porque el Señor me ha ungido. Me ha enviado para dar la buena noticia a los pobres, para vendar los corazones desgarrados, para proclamar la amnistía a los cautivos, la libertad a los prisioneros, para proclamar el año de gracia del Señor.",
        "rb1": "Cristo, Hijo de Dios vivo, ten piedad de nosotros.",
        "rb2": "Tú que hoy te has manifestado.",
        "rb3": "Ten piedad de nosotros."
    },
    {
        "id": "tos1LAdo",
        "varName": "tos1LAdo",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "domingo",
        "libro": "laudes",
        "cita": "Is 61, 1-2a",
        "texto": "El Espíritu del Señor está sobre mí, porque el Señor me ha ungido. Me ha enviado para dar la buena noticia a los pobres, para vendar los corazones desgarrados, para proclamar la amnistía a los cautivos, la libertad a los prisioneros, para proclamar el año de gracia del Señor.",
        "rb1": "Cristo, Hijo de Dios vivo, ten piedad de nosotros.",
        "rb2": "Tú que hoy te has manifestado.",
        "rb3": "Ten piedad de nosotros."
    },
    {
        "id": "tos2LAdo",
        "varName": "tos2LAdo",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "domingo",
        "libro": "laudes",
        "cita": "Ez 36, 25-27",
        "texto": "Derramaré sobre vosotros un agua pura que os purificará: de todas vuestras inmundicias e idolatrías os he de purificar; y os daré un corazón nuevo, y os infundiré un espíritu nuevo; arrancaré de vuestra carne el corazón de piedra, y os daré un corazón de carne. Os infundiré mi espíritu, y haré que caminéis según mis preceptos, y que guardéis y cumpláis mis mandatos.",
        "rb1": "Te damos gracias, ¡oh Dios!, invocando tu nombre.",
        "rb2": "Pregonando tus maravillas.",
        "rb3": "Invocando tu nombre."
    },
    {
        "id": "tos3LAdo",
        "varName": "tos3LAdo",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "domingo",
        "libro": "laudes",
        "cita": "Ez 37, 12b-14",
        "texto": "Así dice el Señor. «Yo mismo abriré vuestros sepulcros, y os haré salir de vuestros sepulcros, pueblo mío, y os traeré a la tierra de Israel. Y cuando abra vuestros sepulcros y os saque de vuestros sepulcros, pueblo mío, sabréis que yo soy el Señor: os infundiré mi espíritu y viviréis, os colocaré en vuestra tierra y sabréis que yo el Señor lo digo y lo hago.» Oráculo del Señor.",
        "rb1": "Cristo, Hijo de Dios vivo, ten piedad de nosotros.",
        "rb2": "Tú que estás sentado a la derecha del Padre.",
        "rb3": "Ten piedad de nosotros."
    },
    {
        "id": "tos4LAdo",
        "varName": "tos4LAdo",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "domingo",
        "libro": "laudes",
        "cita": "2Tm 2, 8. 11-13",
        "texto": "Acuérdate de Cristo Jesús, del linaje de David, que vive resucitado de entre los muertos. Verdadera es la sentencia que dice: Si hemos muerto con él, viviremos también con él. Si tenemos constancia en el sufrir, reinaremos también con él; si rehusamos reconocerle, también él nos rechazará; si le somos infieles, él permanece fiel; no puede él desmentirse a sí mismo.",
        "rb1": "Te damos gracias, ¡oh Dios!, invocando tu nombre.",
        "rb2": "Pregonando tus maravillas.",
        "rb3": "Invocando tu nombre."
    },
    {
        "id": "tos5LAdo",
        "varName": "tos5LAdo",
        "tiempo": "ordinario",
        "semana": "5",
        "dia": "domingo",
        "libro": "laudes",
        "cita": "Ap 7, 10. 12",
        "texto": "¡La salvación es de nuestro Dios, que está sentado en el trono, y del Cordero! La bendición, y la gloria, y la sabiduría, y la acción de gracias, y el honor, y el poder, y la fuerza son de nuestro Dios por los siglos de los siglos. Amén.",
        "rb1": "Cristo, Hijo de Dios vivo, ten piedad de nosotros.",
        "rb2": "Tú que estás sentado a la derecha del Padre.",
        "rb3": "Ten piedad de nosotros."
    },
    {
        "id": "tos6LAdo",
        "varName": "tos6LAdo",
        "tiempo": "ordinario",
        "semana": "6",
        "dia": "domingo",
        "libro": "laudes",
        "cita": "2Pe 1, 10-11",
        "texto": "Hermanos, poned más empeño todavía en consolidar vuestra vocación y elección. Si hacéis así, nunca jamás tropezaréis; de este modo se os concederá generosamente la entrada en el reino eterno de nuestro Señor y salvador Jesucristo.",
        "rb1": "A ti grito, Señor, tú eres mi refugio.",
        "rb2": "Mi heredad en el país de la vida.",
        "rb3": "Tú eres mi refugio."
    },
    {
        "id": "tos1lalu",
        "varName": "tos1lalu",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "lunes",
        "libro": "laudes",
        "cita": "2Ts 3, 10b-13",
        "texto": "Si alguno no quiere trabajar, que tampoco coma. Porque nos hemos enterado que hay entre vosotros algunos que viven desconcertados, sin trabajar nada, pero metiéndose en todo. A éstos les mandamos y les exhortamos en el Señor Jesucristo a que trabajen con sosiego para comer su propio pan. Vosotros, hermanos, no os canséis de hacer el bien.",
        "rb1": "Bendito el Señor ahora y por siempre.",
        "rb2": "Solo él hizo maravillas.",
        "rb3": "Ahora y por siempre."
    },
    {
        "id": "tos2lalu",
        "varName": "tos2lalu",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "lunes",
        "libro": "laudes",
        "cita": "Jr 15, 16",
        "texto": "Cuando encontraba palabras tuyas las devoraba; tus palabras eran mi gozo y la alegría de mi corazón, porque tu nombre fue pronunciado sobre mí, ¡Señor, Dios de los ejércitos!",
        "rb1": "Aclamad, justos, al Señor, que merece la alabanza de los buenos.",
        "rb2": "Cantadle un cántico nuevo.",
        "rb3": "Que merece la alabanza de los buenos."
    },
    {
        "id": "tos3lalu",
        "varName": "tos3lalu",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "lunes",
        "libro": "laudes",
        "cita": "St 2, 12-13",
        "texto": "Hablad y actuad como quienes han de ser juzgados por una ley de libertad. Pues habrá un juicio sin misericordia para quien no practicó misericordia; pero la misericordia triunfa sobre el juicio.",
        "rb1": "Bendito el Señor ahora y por siempre.",
        "rb2": "Solo él hizo maravillas.",
        "rb3": "Ahora y por siempre."
    },
    {
        "id": "tos4lalu",
        "varName": "tos4lalu",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "lunes",
        "libro": "laudes",
        "cita": "Jdt 8, 21b-23",
        "texto": "Recordad que Dios ha querido probarnos como a nuestros padres. Recordad lo que hizo con Abraham, las pruebas por que hizo pasar a Isaac, lo que aconteció a Jacob. Como les puso a ellos en el crisol para sondear sus corazones, así el Señor nos hiere a nosotros, los que nos acercamos a él, no para castigarnos, sino para amonestarnos.",
        "rb1": "Aclamad, justos, al Señor, que merece la alabanza de los buenos.",
        "rb2": "Cantadle un cántico nuevo.",
        "rb3": "Que merece la alabanza de los buenos."
    },
    {
        "id": "tos1lama",
        "varName": "tos1lama",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "martes",
        "libro": "laudes",
        "cita": "Rm 13, 11b. 12-13a",
        "texto": "Ya es hora que despertéis del sueño. La noche va pasando, el día está encima; desnudémonos, pues, de las obras de las tinieblas y vistámonos de las armas de la luz. Andemos como en pleno día, con dignidad.",
        "rb1": "Dios mío, mi escudo y peña en que me amparo.",
        "rb2": "Mi alcázar, mi libertador.",
        "rb3": "En que me amparo."
    },
    {
        "id": "tos2lama",
        "varName": "tos2lama",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "martes",
        "libro": "laudes",
        "cita": "1Ts 5, 4-5",
        "texto": "No viváis, hermanos, en tinieblas para que el día del Señor no os sorprenda como ladrón; porque todos sois hijos de la luz e hijos del día. No somos de la noche ni de las tinieblas.",
        "rb1": "Escucha mi voz, Señor; espero en tu palabra.",
        "rb2": "Me adelanto a la aurora pidiendo auxilio.",
        "rb3": "Espero en tu palabra."
    },
    {
        "id": "tos3lama",
        "varName": "tos3lama",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "martes",
        "libro": "laudes",
        "cita": "1Jn 4, 14-15",
        "texto": "Nosotros hemos visto y damos testimonio de que el Padre envió a su Hijo para ser Salvador del mundo. Quien confiese que Jesús es el Hijo de Dios, Dios permanece en él y él en Dios.",
        "rb1": "Dios mío, mi escudo y peña en que me amparo.",
        "rb2": "Mi alcázar, mi libertador.",
        "rb3": "En que me amparo."
    },
    {
        "id": "tos4lama",
        "varName": "tos4lama",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "martes",
        "libro": "laudes",
        "cita": "Is 55, 1",
        "texto": "Oíd, sedientos todos, acudid por agua, también los que no tenéis dinero: venid, comprad trigo, comed sin pagar: vino y leche de balde.",
        "rb1": "Escucha mi voz, Señor; espero en tu palabra.",
        "rb2": "Me adelanto a la aurora pidiendo auxilio.",
        "rb3": "Espero en tu palabra."
    },
    {
        "id": "tos1lami",
        "varName": "tos1lami",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "miercoles",
        "libro": "laudes",
        "cita": "Tb 4, 16-17. 19-20",
        "texto": "No hagas a nadie lo que no quieras que te hagan. Da de tu pan al hambriento y da tus vestidos al desnudo. Busca el consejo de los prudentes. Bendice al Señor en toda circunstancia, pídele que sean rectos todos tus caminos y que lleguen a buen fin todas tus sendas y proyectos.",
        "rb1": "Inclina, Señor, mi corazón a tus preceptos.",
        "rb2": "Dame vida con tu palabra.",
        "rb3": "Inclina, Señor, mi corazón a tus preceptos."
    },
    {
        "id": "tos2lami",
        "varName": "tos2lami",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "miercoles",
        "libro": "laudes",
        "cita": "Rm 8, 35. 37",
        "texto": "¿Quién podrá apartarnos del amor de Cristo? ¿La aflicción? ¿La angustia? ¿La persecución? ¿El hambre? ¿La desnudez? ¿El peligro? ¿La espada? En todo esto vencemos fácilmente por aquel que nos ha amado.",
        "rb1": "Bendigo al Señor en todo momento.",
        "rb2": "Su alabanza está siempre en mi boca.",
        "rb3": "En todo momento."
    },
    {
        "id": "tos3lami",
        "varName": "tos3lami",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "miercoles",
        "libro": "laudes",
        "cita": "Jb 1, 21; 2, 10b",
        "texto": "Desnudo salí del vientre de mi madre y desnudo volveré a él. El Señor me lo dio, el Señor me lo quitó, bendito sea el nombre del Señor. Si aceptamos de Dios los bienes, ¿no vamos a aceptar los males?",
        "rb1": "Inclina, Señor, mi corazón a tus preceptos.",
        "rb2": "Dame vida con tu palabra.",
        "rb3": "Inclina, Señor, mi corazón a tus preceptos."
    },
    {
        "id": "tos4lami",
        "varName": "tos4lami",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "miercoles",
        "libro": "laudes",
        "cita": "Dt 4, 39-40a",
        "texto": "Has de reconocer hoy y recordar que el Señor es Dios, en lo alto del cielo y abajo en la tierra, y que no hay otro. Guarda los mandatos y preceptos que te voy a dar hoy.",
        "rb1": "Bendigo al Señor en todo momento.",
        "rb2": "Su alabanza está siempre en mi boca.",
        "rb3": "En todo momento."
    },
    {
        "id": "tos1laju",
        "varName": "tos1laju",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "jueves",
        "libro": "laudes",
        "cita": "Is 66, 1-2",
        "texto": "Así dice el Señor: «El cielo es mi trono y la tierra el estrado de mis pies: ¿Qué templo podréis construirme?; ¿o qué lugar para mi descanso? Todo esto lo hicieron mis manos, todo es mío —oráculo del Señor—. En ése pondré mis ojos: en el humilde y el abatido que se estremece ante mis palabras.»",
        "rb1": "Te invoco de todo corazón, respóndeme, Señor.",
        "rb2": "Guardaré tus leyes.",
        "rb3": "Respóndeme, Señor."
    },
    {
        "id": "tos2laju",
        "varName": "tos2laju",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "jueves",
        "libro": "laudes",
        "cita": "Rm 14, 17-19",
        "texto": "El reino de Dios no es comida ni bebida, sino justicia y paz y gozo en el Espíritu Santo, pues el que en esto sirve a Cristo es grato a Dios y acepto a los hombres. Por tanto, trabajemos por la paz y por nuestra mutua edificación.",
        "rb1": "Velando medito en ti, Señor.",
        "rb2": "Porque fuiste mi auxilio.",
        "rb3": "Medito en ti, Señor."
    },
    {
        "id": "tos3laju",
        "varName": "tos3laju",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "jueves",
        "libro": "laudes",
        "cita": "1Pe 4, 10-11",
        "texto": "Que cada uno, con el don que ha recibido, se ponga al servicio de los demás, como buenos administradores de la multiforme gracia de Dios. El que toma la palabra que hable palabra de Dios. El que se dedica al servicio que lo haga en virtud del encargo recibido de Dios. Así, Dios será glorificado en todo, por medio de Jesucristo, Señor nuestro, cuya es la gloria y el imperio por los siglos de los siglos. Amén.",
        "rb1": "Te invoco de todo corazón, respóndeme, Señor.",
        "rb2": "Guardaré tus leyes.",
        "rb3": "Respóndeme, Señor."
    },
    {
        "id": "tos4laju",
        "varName": "tos4laju",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "jueves",
        "libro": "laudes",
        "cita": "Rm 8, 18-21",
        "texto": "Los padecimientos de esta vida presente tengo por cierto que no son nada en comparación con la gloria futura que se ha de revelar en nosotros. La creación entera está en expectación, suspirando por esa manifestación gloriosa de los hijos de Dios; porque las creaturas todas quedaron sometidas al desorden, no porque a ello tendiesen de suyo, sino por culpa del hombre que las sometió. Y abrigan la esperanza de quedar ellas, a su vez, libres de la esclavitud de la corrupción, para tomar parte en la libertad gloriosa que han de recibir los hijos de Dios.",
        "rb1": "Velando medito en ti, Señor.",
        "rb2": "Porque fuiste mi auxilio.",
        "rb3": "Medito en ti, Señor."
    },
    {
        "id": "tos1lavi",
        "varName": "tos1lavi",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "viernes",
        "libro": "laudes",
        "cita": "Ef 4, 29-32",
        "texto": "No salga de vuestra boca palabra desedificante, sino la que sirva para la necesaria edificación, comunicando la gracia a los oyentes. Y no provoquéis más al santo Espíritu de Dios, con el cual fuisteis marcados para el día de la redención. Desterrad de entre vosotros todo exacerbamiento, animosidad, ira, pendencia, insulto y toda clase de maldad. Sed, por el contrario, bondadosos y compasivos unos con otros, y perdonaos mutuamente como también Dios os ha perdonado en Cristo.",
        "rb1": "En la mañana hazme escuchar tu gracia.",
        "rb2": "Indícame el camino que he de seguir.",
        "rb3": "Hazme escuchar tu gracia."
    },
    {
        "id": "tos2lavi",
        "varName": "tos2lavi",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "viernes",
        "libro": "laudes",
        "cita": "Ef 2,13-16",
        "texto": "Ahora estáis en Cristo Jesús. Ahora, por la sangre de Cristo, estáis cerca los que antes estabais lejos. Él es nuestra paz. Él ha hecho de los dos pueblos, judíos y gentiles, una sola cosa, derribando con su cuerpo el muro que los separaba: el odio. Él ha abolido la ley con sus mandamientos y reglas, haciendo las paces, para crear en él un solo hombre nuevo. Reconcilió con Dios a los dos pueblos, uniéndolos en un solo cuerpo mediante la cruz, dando muerte en él al odio.",
        "rb1": "Invoco al Dios Altísimo, al Dios que hace tanto por mí.",
        "rb2": "Desde el cielo me enviará la salvación.",
        "rb3": "El Dios que hace tanto por mí."
    },
    {
        "id": "tos3lavi",
        "varName": "tos3lavi",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "viernes",
        "libro": "laudes",
        "cita": "2Co 12, 9b-10",
        "texto": "Muy a gusto presumo de mis debilidades, porque así residirá en mí la fuerza de Cristo. Por eso vivo contento en medio de mis debilidades, de los insultos, las privaciones, las persecuciones y las dificultades sufridas por Cristo. Porque cuando soy débil, entonces soy fuerte.",
        "rb1": "En la mañana hazme escuchar tu gracia.",
        "rb2": "Indícame el camino que he de seguir.",
        "rb3": "Hazme escuchar tu gracia."
    },
    {
        "id": "tos4lavi",
        "varName": "tos4lavi",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "viernes",
        "libro": "laudes",
        "cita": "Ga 2, 19b-20",
        "texto": "Estoy crucificado con Cristo; vivo yo, pero no soy yo, es Cristo quien vive en mi. Y, mientras vivo en esta carne, vivo de la fe en el Hijo de Dios, que me amó hasta entregarse por mí.",
        "rb1": "Invoco al Dios Altísimo, al Dios que hace tanto por mí.",
        "rb2": "Desde el cielo me enviará la salvación.",
        "rb3": "El Dios que hace tanto por mí."
    },
    {
        "id": "tos1lasa",
        "varName": "tos1lasa",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "sabado",
        "libro": "laudes",
        "cita": "2Pe 1, 10-11",
        "texto": "Hermanos, poned más empeño todavía en consolidar vuestra vocación y elección. Si hacéis así, nunca jamás tropezaréis; de este modo se os concederá generosamente la entrada en el reino eterno de nuestro Señor y salvador Jesucristo.",
        "rb1": "A ti grito, Señor, tú eres mi refugio.",
        "rb2": "Mi heredad en el país de la vida.",
        "rb3": "Tú eres mi refugio."
    },
    {
        "id": "tos2lasa",
        "varName": "tos2lasa",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "sabado",
        "libro": "laudes",
        "cita": "Rm 12, 14-16a",
        "texto": "Bendecid a los que os persiguen, no maldigáis. Alegraos con los que se alegran; llorad con los que lloran. Tened un mismo sentir entre vosotros, sin apetecer grandezas; atraídos más bien por lo humilde.",
        "rb1": "Te aclamarán mis labios, Señor, cuando salmodie para ti.",
        "rb2": "Mi lengua recitará tu auxilio.",
        "rb3": "Cuando salmodie para ti."
    },
    {
        "id": "tos3lasa",
        "varName": "tos3lasa",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "sabado",
        "libro": "laudes",
        "cita": "Flp 2, 14-15",
        "texto": "Hacedlo todo sin murmuraciones ni discusiones, a fin de que seáis irreprensibles y sencillos, hijos de Dios sin mancha, en medio de esta generación mala y perversa, entre la cual aparecéis como antorchas en el mundo.",
        "rb1": "A ti grito, Señor, tú eres mi refugio.",
        "rb2": "Mi heredad en el país de la vida.",
        "rb3": "Tú eres mi refugio."
    },
    {
        "id": "tos4lasa",
        "varName": "tos4lasa",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "sabado",
        "libro": "laudes",
        "cita": "2 Pe 3, 13-15a",
        "texto": "Nosotros conforme a la promesa del Señor esperamos cielos nuevos y tierra nueva, en los que tiene su morada la santidad. Por eso, carísimos, mientras esperáis estos acontecimientos, procurad con toda diligencia que él os encuentre en paz, sin mancha e irreprensibles. Considerad esta paciente espera de nuestro Señor como una oportunidad para alcanzar la salud.",
        "rb1": "Te aclamarán mis labios, Señor, cuando salmodie para ti.",
        "rb2": "Mi lengua recitará tu auxilio.",
        "rb3": "Cuando salmodie para ti."
    }
];

export const LecturaBreveDB = {
    listar: () => CATALOGO_LECTURAS_SEED,
    obtener: (id) => CATALOGO_LECTURAS_SEED.find(l => l.id === id || l.varName === id) || null,
    buscar: (termino) => {
        if (!termino) return CATALOGO_LECTURAS_SEED;
        const t = termino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return CATALOGO_LECTURAS_SEED.filter(l => {
            const c = (l.cita || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const txt = (l.texto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const r1 = (l.rb1 || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return c.includes(t) || txt.includes(t) || r1.includes(t) || l.id.toLowerCase().includes(t);
        });
    }
};

if (typeof window !== 'undefined') {
    window.LecturaBreveDB = LecturaBreveDB;
    window.CATALOGO_LECTURAS_SEED = CATALOGO_LECTURAS_SEED;
}
