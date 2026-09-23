/**
 * db-oracion.js
 * Catálogo Canónico y Repositorio de Oraciones Litúrgicas Conclusivas (Laudes y Vísperas)
 * 
 * Estructura estándar:
 * - id: Identificador único (ej: tos1lalu, tos2LAdo, bautismoLA, tos1lasa)
 * - varName: Nombre de la variable original (ej: tos1lalu_oracion)
 * - titulo: Nombre canónico descriptivo
 * - tiempo: ordinario | adviento | navidad | cuaresma | pascua | santos
 * - semana: número de semana ('1', '2', '3', '4', ...)
 * - dia: domingo | lunes | martes | miercoles | jueves | viernes | sabado
 * - libro: laudes | visperas
 * - oremos: Rúbrica inicial ('OREMOS' u 'Oremos')
 * - texto: Cuerpo de la oración conclusiva
 * - conclusion: Fórmula trinitaria conclusiva
 * - textoCompleto: Texto integral listo para lectura y rezo
 */

export const CATALOGO_ORACION_SEED = [
    {
        "id": "tos1LAdo",
        "varName": "tos1LAdo_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 1 - Domingo / Bautismo del Señor (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "domingo",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios todopoderoso y eterno, que proclamaste solemnemente a Cristo como tu Hijo amado, cuando era bautizado en el Jordán y descendía el Espíritu Santo sobre él, concede a tus hijos de adopción, renacidos del agua y del Espíritu Santo, que se conserven siempre dignos de tu complacencia. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios todopoderoso y eterno, que proclamaste solemnemente a Cristo como tu Hijo amado, cuando era bautizado en el Jordán y descendía el Espíritu Santo sobre él, concede a tus hijos de adopción, renacidos del agua y del Espíritu Santo, que se conserven siempre dignos de tu complacencia. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "bautismoLA",
        "varName": "bautismoLA_oracion",
        "titulo": "Oración - Fiesta del Bautismo del Señor (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "domingo",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios todopoderoso y eterno, que proclamaste solemnemente a Cristo como tu Hijo amado, cuando era bautizado en el Jordán y descendía el Espíritu Santo sobre él, concede a tus hijos de adopción, renacidos del agua y del Espíritu Santo, que se conserven siempre dignos de tu complacencia. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios todopoderoso y eterno, que proclamaste solemnemente a Cristo como tu Hijo amado, cuando era bautizado en el Jordán y descendía el Espíritu Santo sobre él, concede a tus hijos de adopción, renacidos del agua y del Espíritu Santo, que se conserven siempre dignos de tu complacencia. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos2LAdo",
        "varName": "tos2LAdo_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 2 - Domingo (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "domingo",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos3LAdo",
        "varName": "tos3LAdo_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 3 - Domingo (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "domingo",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios todopoderoso y eterno, dirige nuestras acciones según tu voluntad, para que, invocando el nombre de tu Hijo, abundemos en buenas obras. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios todopoderoso y eterno, dirige nuestras acciones según tu voluntad, para que, invocando el nombre de tu Hijo, abundemos en buenas obras. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos4LAdo",
        "varName": "tos4LAdo_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 4 - Domingo (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "domingo",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Concédenos, Señor, Dios nuestro, venerarte con toda el alma y amar a todos los hombres con afecto espiritual. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Concédenos, Señor, Dios nuestro, venerarte con toda el alma y amar a todos los hombres con afecto espiritual. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos5LAdo",
        "varName": "tos5LAdo_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 5 - Domingo (Laudes)",
        "tiempo": "ordinario",
        "semana": "5",
        "dia": "domingo",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Señor, protege a tu pueblo con tu amor siempre fiel y, ya que sólo en ti hemos puesto nuestra esperanza, defiéndenos siempre con tu poder. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Señor, protege a tu pueblo con tu amor siempre fiel y, ya que sólo en ti hemos puesto nuestra esperanza, defiéndenos siempre con tu poder. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tps1jsLaud",
        "varName": "tps1jsLaud_oracion",
        "titulo": "Oración - Pascua - Semana 1 - Jueves (Laudes)",
        "tiempo": "pascua",
        "semana": "1",
        "dia": "jueves",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Oh Dios, que has reunido a pueblos diversos en la confesión de tu nombre, concede a los que han renacido en la fuente bautismal una misma fe en su espíritu y una misma caridad en sus vidas. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Oh Dios, que has reunido a pueblos diversos en la confesión de tu nombre, concede a los que han renacido en la fuente bautismal una misma fe en su espíritu y una misma caridad en sus vidas. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos1lalu",
        "varName": "tos1lalu_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 1 - Lunes (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "lunes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Tu gracia, Señor, inspire nuestras obras, las sostenga y acompañe; para que todo nuestro trabajo brote de ti, como de su fuente, y tienda a ti, como a su fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Tu gracia, Señor, inspire nuestras obras, las sostenga y acompañe; para que todo nuestro trabajo brote de ti, como de su fuente, y tienda a ti, como a su fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos2lalu",
        "varName": "tos2lalu_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 2 - Lunes (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "lunes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Señor, Dios todopoderoso, que nos has hecho llegar al comienzo de este día: danos tu ayuda para que no caigamos hoy en pecado, sino que nuestras palabras, pensamientos y acciones sigan el camino de tus mandatos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Señor, Dios todopoderoso, que nos has hecho llegar al comienzo de este día: danos tu ayuda para que no caigamos hoy en pecado, sino que nuestras palabras, pensamientos y acciones sigan el camino de tus mandatos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos3lalu",
        "varName": "tos3lalu_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 3 - Lunes (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "lunes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Señor Dios, rey de cielos y tierra, dirige y santifica en este día nuestros cuerpos y nuestros corazones, nuestros sentidos, palabras y acciones, según tu ley y tus mandatos; para que, con tu auxilio, podamos ofrecerte hoy en todas nuestras actividades un sacrificio de alabanza grato a tus ojos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Señor Dios, rey de cielos y tierra, dirige y santifica en este día nuestros cuerpos y nuestros corazones, nuestros sentidos, palabras y acciones, según tu ley y tus mandatos; para que, con tu auxilio, podamos ofrecerte hoy en todas nuestras actividades un sacrificio de alabanza grato a tus ojos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos4lalu",
        "varName": "tos4lalu_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 4 - Lunes (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "lunes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Señor Dios, que encomendaste al hombre la guarda y el cultivo de la tierra, y creaste la luz del sol en su servicio, concédenos hoy que, con tu ayuda, trabajemos sin desfallecer para tu gloria y para el bien de nuestro prójimo. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Señor Dios, que encomendaste al hombre la guarda y el cultivo de la tierra, y creaste la luz del sol en su servicio, concédenos hoy que, con tu ayuda, trabajemos sin desfallecer para tu gloria y para el bien de nuestro prójimo. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos1lama",
        "varName": "tos1lama_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 1 - Martes (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "martes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Escucha, Señor, nuestra oración matutina y con la luz de tu misericordia alumbra la oscuridad de nuestro corazón: para que, habiendo sido iluminados por tu claridad, no andemos nunca tras las obras de las tinieblas. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Escucha, Señor, nuestra oración matutina y con la luz de tu misericordia alumbra la oscuridad de nuestro corazón: para que, habiendo sido iluminados por tu claridad, no andemos nunca tras las obras de las tinieblas. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos2lama",
        "varName": "tos2lama_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 2 - Martes (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "martes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Señor Jesucristo, luz verdadera que alumbras a todo hombre y le muestras el camino de la salvación: concédenos la abundancia de tu gracia para que preparemos, delante de ti, sendas de justicia y de paz. Tú que vives y reinas con el Padre, en la unidad del Espíritu Santo y eres Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Tú que vives y reinas con el Padre, en la unidad del Espíritu Santo y eres Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Señor Jesucristo, luz verdadera que alumbras a todo hombre y le muestras el camino de la salvación: concédenos la abundancia de tu gracia para que preparemos, delante de ti, sendas de justicia y de paz. Tú que vives y reinas con el Padre, en la unidad del Espíritu Santo y eres Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos3lama",
        "varName": "tos3lama_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 3 - Martes (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "martes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios todopoderoso, de quien dimana la bondad y hermosura de todo lo creado; haz que comencemos este día con ánimo alegre, y que realicemos nuestras obras movidos por el amor a ti y a los hermanos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios todopoderoso, de quien dimana la bondad y hermosura de todo lo creado; haz que comencemos este día con ánimo alegre, y que realicemos nuestras obras movidos por el amor a ti y a los hermanos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos4lama",
        "varName": "tos4lama_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 4 - Martes (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "martes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Aumenta, Señor, nuestra fe, para que esta alabanza que brota de nuestro corazón vaya siempre acompañada de frutos de vida eterna. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Aumenta, Señor, nuestra fe, para que esta alabanza que brota de nuestro corazón vaya siempre acompañada de frutos de vida eterna. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos1lami",
        "varName": "tos1lami_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 1 - Miércoles (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "miercoles",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Señor Dios, salvador nuestro, danos tu ayuda para que siempre deseemos las obras de la luz y realicemos la verdad: así, los que de ti hemos nacido en el bautismo, seremos tus testigos ante los hombres. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Señor Dios, salvador nuestro, danos tu ayuda para que siempre deseemos las obras de la luz y realicemos la verdad: así, los que de ti hemos nacido en el bautismo, seremos tus testigos ante los hombres. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos2lami",
        "varName": "tos2lami_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 2 - Miércoles (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "miercoles",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Envía, Señor, a nuestros corazones la abundancia de tu luz, para que, avanzando siempre por el camino de tus mandatos, nos veamos libres de todo error. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Envía, Señor, a nuestros corazones la abundancia de tu luz, para que, avanzando siempre por el camino de tus mandatos, nos veamos libres de todo error. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos3lami",
        "varName": "tos3lami_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 3 - Miércoles (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "miercoles",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Señor Dios, que nos has creado con tu sabiduría y nos gobiernas con tu providencia, infunde en nuestras almas la claridad de tu luz, y haz que nuestra vida y nuestras acciones estén del todo consagradas a ti. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Señor Dios, que nos has creado con tu sabiduría y nos gobiernas con tu providencia, infunde en nuestras almas la claridad de tu luz, y haz que nuestra vida y nuestras acciones estén del todo consagradas a ti. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos4lami",
        "varName": "tos4lami_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 4 - Miércoles (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "miercoles",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Recuerda, Señor, tu santa alianza consagrada con el nuevo sacramento de la sangre del Cordero, para que tu pueblo obtenga el perdón de sus pecados, y un aumento constante de salvación. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Recuerda, Señor, tu santa alianza consagrada con el nuevo sacramento de la sangre del Cordero, para que tu pueblo obtenga el perdón de sus pecados, y un aumento constante de salvación. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos1laju",
        "varName": "tos1laju_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 1 - Jueves (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "jueves",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios todopoderoso y eterno, humildemente acudimos a ti, al empezar el día, a media jornada y al atardecer, para pedirte que, alejando de nosotros las tinieblas del pecado, nos hagas alcanzar la luz verdadera que es Cristo. Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios todopoderoso y eterno, humildemente acudimos a ti, al empezar el día, a media jornada y al atardecer, para pedirte que, alejando de nosotros las tinieblas del pecado, nos hagas alcanzar la luz verdadera que es Cristo. Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos2laju",
        "varName": "tos2laju_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 2 - Jueves (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "jueves",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "A ti, Señor, que eres la luz verdadera y la fuente misma de toda luz, te pedimos humildemente que meditando fielmente tu palabra vivamos siempre en la claridad de tu luz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "A ti, Señor, que eres la luz verdadera y la fuente misma de toda luz, te pedimos humildemente que meditando fielmente tu palabra vivamos siempre en la claridad de tu luz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos3laju",
        "varName": "tos3laju_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 3 - Jueves (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "jueves",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios todopoderoso y eterno: a los pueblos que viven en tiniebla y en sombra de muerte, ilumínalos con tu luz, ya que con ella nos ha visitado el sol que nace de lo alto, Jesucristo, nuestro Señor. Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios todopoderoso y eterno: a los pueblos que viven en tiniebla y en sombra de muerte, ilumínalos con tu luz, ya que con ella nos ha visitado el sol que nace de lo alto, Jesucristo, nuestro Señor. Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos4laju",
        "varName": "tos4laju_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 4 - Jueves (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "jueves",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Concédenos, Señor, acoger siempre el anuncio de la salvación para que, libres de temor, arrancados de la mano de los enemigos te sirvamos, con santidad y justicia, todos nuestros días. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Concédenos, Señor, acoger siempre el anuncio de la salvación para que, libres de temor, arrancados de la mano de los enemigos te sirvamos, con santidad y justicia, todos nuestros días. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos1lavi",
        "varName": "tos1lavi_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 1 - Viernes (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "viernes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios misericordioso, que has iluminado las tinieblas de nuestra ignorancia con la luz de tu palabra: acrecienta en nosotros la fe que tú mismo nos has dado; que ninguna tentación pueda nunca destruir el ardor de la fe y de la caridad que tu gracia ha encendido en nuestro Espíritu. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios misericordioso, que has iluminado las tinieblas de nuestra ignorancia con la luz de tu palabra: acrecienta en nosotros la fe que tú mismo nos has dado; que ninguna tentación pueda nunca destruir el ardor de la fe y de la caridad que tu gracia ha encendido en nuestro Espíritu. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos2lavi",
        "varName": "tos2lavi_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 2 - Viernes (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "viernes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Señor, Dios todopoderoso, te pedimos nos concedas que del mismo modo que hemos cantado tus alabanzas en esta celebración matutina así también las podamos cantar plenamente en la asamblea de tus santos por toda la eternidad. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Señor, Dios todopoderoso, te pedimos nos concedas que del mismo modo que hemos cantado tus alabanzas en esta celebración matutina así también las podamos cantar plenamente en la asamblea de tus santos por toda la eternidad. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos3lavi",
        "varName": "tos3lavi_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 3 - Viernes (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "viernes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Ilumina, Señor, nuestros corazones y fortalece nuestras voluntades, para que sigamos siempre el camino de tus mandatos, reconociéndote como nuestro guía y maestro. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Ilumina, Señor, nuestros corazones y fortalece nuestras voluntades, para que sigamos siempre el camino de tus mandatos, reconociéndote como nuestro guía y maestro. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos4lavi",
        "varName": "tos4lavi_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 4 - Viernes (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "viernes",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Te pedimos, Señor, tu gracia abundante, para que nos ayude a seguir el camino de tus mandatos, y así gocemos de tu consuelo en esta vida y alcancemos la felicidad eterna. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Te pedimos, Señor, tu gracia abundante, para que nos ayude a seguir el camino de tus mandatos, y así gocemos de tu consuelo en esta vida y alcancemos la felicidad eterna. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos1lasa",
        "varName": "tos1lasa_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 1 - Sábado (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "sabado",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Te pedimos, Señor, que la claridad de la resurrección de tu Hijo ilumine las dificultades de nuestra vida; que no temamos ante la oscuridad de la muerte y podamos llegar un día a la luz que no tiene fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Te pedimos, Señor, que la claridad de la resurrección de tu Hijo ilumine las dificultades de nuestra vida; que no temamos ante la oscuridad de la muerte y podamos llegar un día a la luz que no tiene fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos2lasa",
        "varName": "tos2lasa_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 2 - Sábado (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "sabado",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Que nuestra voz, Señor, nuestro espíritu y toda nuestra vida sean una continua alabanza en tu honor, y ya que toda nuestra existencia es un don gratuito de tu liberalidad, haz que también cada una de nuestras acciones te esté plenamente dedicada. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Que nuestra voz, Señor, nuestro espíritu y toda nuestra vida sean una continua alabanza en tu honor, y ya que toda nuestra existencia es un don gratuito de tu liberalidad, haz que también cada una de nuestras acciones te esté plenamente dedicada. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos3lasa",
        "varName": "tos3lasa_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 3 - Sábado (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "sabado",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios misericordioso, fuente y origen de nuestra salvación, haz que, mientras dure nuestra vida aquí en la tierra, te alabemos constantemente y podamos así participar un día en la alabanza eterna del cielo. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios misericordioso, fuente y origen de nuestra salvación, haz que, mientras dure nuestra vida aquí en la tierra, te alabemos constantemente y podamos así participar un día en la alabanza eterna del cielo. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos4lasa",
        "varName": "tos4lasa_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 4 - Sábado (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "sabado",
        "libro": "laudes",
        "oremos": "OREMOS",
        "texto": "Dios todopoderoso y eterno, luz esplendente y día sin ocaso, al volver a comenzar un nuevo día te pedimos que nos visites con el esplendor de tu luz y disipes así las tinieblas de nuestros pecados. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios todopoderoso y eterno, luz esplendente y día sin ocaso, al volver a comenzar un nuevo día te pedimos que nos visites con el esplendor de tu luz y disipes así las tinieblas de nuestros pecados. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    },
    {
        "id": "tos1visab",
        "varName": "tos1visab_oracion",
        "titulo": "Oración - Tiempo Ordinario - Semana 1 - Sábado (Vísperas)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "sabado",
        "libro": "visperas",
        "oremos": "OREMOS",
        "texto": "Dios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "conclusion": "Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
        "textoCompleto": "Dios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
    }
];

export const OracionDB = {
    /**
     * Devuelve la lista completa de oraciones semilla
     */
    listar: () => CATALOGO_ORACION_SEED,

    /**
     * Busca una oración por su ID o varName
     */
    obtener: (id) => {
        if (!id) return null;
        return CATALOGO_ORACION_SEED.find(o => o.id === id || o.varName === id) || null;
    },

    /**
     * Búsqueda por texto (insensible a acentos y mayúsculas)
     */
    buscar: (termino) => {
        if (!termino) return CATALOGO_ORACION_SEED;
        const t = termino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return CATALOGO_ORACION_SEED.filter(o => {
            const tit = (o.titulo || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const txt = (o.texto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const id = (o.id || '').toLowerCase();
            return tit.includes(t) || txt.includes(t) || id.includes(t);
        });
    },

    /**
     * Obtiene la oración litúrgica recomendada según tiempo, semana, día y libro
     */
    obtenerRecomendada: (tiempo, semana, dia, libro = 'laudes') => {
        const semNum = parseInt(String(semana).replace(/[^0-9]/g, ''), 10) || 1;
        const semCiclo = ((semNum - 1) % 4) + 1;
        const diaNorm = (dia || 'lunes').toLowerCase();
        const diaPref = diaNorm.slice(0, 2);

        // Claves prioritarias
        const clavesBuscar = [
            'tos' + semNum + 'la' + diaPref,
            'tos' + semCiclo + 'la' + diaPref,
            'tos' + semNum + 'LA' + diaPref,
            'tos' + semCiclo + 'LA' + diaPref,
            diaNorm === 'domingo' && semNum === 1 ? 'bautismoLA' : null,
            diaNorm === 'domingo' ? 'tos' + semNum + 'LAdo' : null,
            diaNorm === 'domingo' ? 'tos' + semCiclo + 'LAdo' : null,
            'tos' + semNum + 'vi' + diaPref,
            'tos' + semCiclo + 'vi' + diaPref
        ].filter(Boolean);

        for (const k of clavesBuscar) {
            const found = CATALOGO_ORACION_SEED.find(o => o.id === k || o.varName === k || o.varName === k + '_oracion');
            if (found) return found;
        }

        // Búsqueda por tiempo, semana, día y libro
        const matchExacto = CATALOGO_ORACION_SEED.find(o => 
            o.tiempo === tiempo && 
            Number(o.semana) === semNum && 
            o.dia === diaNorm && 
            o.libro === libro
        );
        if (matchExacto) return matchExacto;

        const matchCiclo = CATALOGO_ORACION_SEED.find(o => 
            o.tiempo === tiempo && 
            Number(o.semana) === semCiclo && 
            o.dia === diaNorm && 
            o.libro === libro
        );
        if (matchCiclo) return matchCiclo;

        const matchDia = CATALOGO_ORACION_SEED.find(o => o.dia === diaNorm && o.libro === libro);
        if (matchDia) return matchDia;

        // Fallback primer elemento
        return CATALOGO_ORACION_SEED[0];
    }
};

if (typeof window !== 'undefined') {
    window.OracionDB = OracionDB;
    window.CATALOGO_ORACION_SEED = CATALOGO_ORACION_SEED;
}
