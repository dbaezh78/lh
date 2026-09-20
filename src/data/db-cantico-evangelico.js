/**
 * db-cantico-evangelico.js
 * Repositorio y Módulo Canónico para:
 * 1. Cánticos Evangélicos (Zacarías/Benedictus, Magníficat, Nunc Dimittis)
 * 2. Catálogo de Antífonas para el Cántico Evangélico (extraídas de cantEvangelica.js)
 * 3. Repositorio de Preces con intercesiones y conclusión al Padre Nuestro (de preces.js)
 * 4. Repositorio de Oraciones conclusivas de la Liturgia de las Horas (de oracion.js)
 */

export const TEXTO_CANTICO_ZACARIAS_CANONICO = `Bendito sea el Señor, Dios de Israel,
porque ha visitado y redimido a su pueblo.
suscitándonos una fuerza de salvación
en la casa de David, su siervo,
según lo había predicho desde antiguo
por boca de sus santos profetas:

Es la salvación que nos libra de nuestros enemigos
y de la mano de todos los que nos odian;
ha realizado así la misericordia que tuvo con nuestros padres,
recordando su santa alianza
y el juramento que juró a nuestro padre Abraham.

Para concedernos que, libres de temor,
arrancados de la mano de los enemigos,
le sirvamos con santidad y justicia,
en su presencia, todos nuestros días.

Y a ti, niño, te llamarán Profeta del Altísimo,
porque irás delante del Señor
a preparar sus caminos,
anunciando a su pueblo la salvación,
el perdón de sus pecados.

Por la entrañable misericordia de nuestro Dios,
nos visitará el sol que nace de lo alto,
para iluminar a los que viven en tiniebla
y en sombra de muerte,
para guiar nuestros pasos
por el camino de la paz.

Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre, por los siglos de los siglos.
Amén.`;

export const TEXTO_MAGNIFICAT_CANONICO = `Proclama mi alma la grandeza del Señor,
se alegra mi espíritu en Dios, mi salvador;
porque ha mirado la humillación de su esclava.

Desde ahora me felicitarán todas las generaciones,
porque el Poderoso ha hecho obras grandes por mí:
su nombre es santo,
y su misericordia llega a sus fieles
de generación en generación.

Él hace proezas con su brazo:
dispersa a los soberbios de corazón,
derriba del trono a los poderosos
y enaltece a los humildes,
a los hambrientos los colma de bienes
y a los ricos los despide vacíos.

Auxilia a Israel, su siervo,
acordándose de la misericordia
—como lo había prometido a nuestros padres—
en favor de Abrahán y su descendencia por siempre.

Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre, por los siglos de los siglos.
Amén.`;

export const TEXTO_NUNC_DIMITTIS_CANONICO = `Ahora, Señor, según tu promesa,
puedes dejar a tu siervo irse en paz.

Porque mis ojos han visto a tu Salvador,
a quien has presentado ante todos los pueblos:
luz para alumbrar a las naciones
y gloria de tu pueblo Israel.

Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre, por los siglos de los siglos.
Amén.`;

export const CATALOGO_CANTICOS = [
    {
        id: 'cantico_zacarias',
        nombre: 'Cántico de Zacarías. EL MESÍAS Y SU PRECURSOR',
        cita: 'Lc 1, 68-79',
        libro: 'laudes',
        texto: TEXTO_CANTICO_ZACARIAS_CANONICO
    },
    {
        id: 'magnificat',
        nombre: 'Cántico de la Santísima Virgen María (Magníficat)',
        cita: 'Lc 1, 46-55',
        libro: 'visperas',
        texto: TEXTO_MAGNIFICAT_CANONICO
    },
    {
        id: 'nunc_dimittis',
        nombre: 'Cántico de Simeón (Nunc Dimittis)',
        cita: 'Lc 2, 29-32',
        libro: 'completas',
        texto: TEXTO_NUNC_DIMITTIS_CANONICO
    }
];

export const CATALOGO_ANTIFONAS_CANTICO_SEED = [
  {
    "id": "tps1js_cEvangelico",
    "varName": "tps1js_cEvangelico",
    "tiempo": "pascua",
    "semana": 1,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Se presentó Jesús en medio de sus discípulos y les dijo: «La paz sea con vosotros.» Aleluya."
  },
  {
    "id": "bautismo_cE",
    "varName": "bautismo_cE",
    "tiempo": "navidad",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Cristo es bautizado y el universo entero se purifica; el Señor nos obtiene el perdón de los pecados: purifiquémonos todos por el agua y el Espíritu."
  },
  {
    "id": "bautismo_cE_A",
    "varName": "bautismo_cE_A",
    "tiempo": "navidad",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Cristo es bautizado y el universo entero se purifica; el Señor nos obtiene el perdón de los pecados: purifiquémonos todos por el agua y el Espíritu."
  },
  {
    "id": "bautismo_cE_B",
    "varName": "bautismo_cE_B",
    "tiempo": "navidad",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Cristo es bautizado y el universo entero se purifica; el Señor nos obtiene el perdón de los pecados: purifiquémonos todos por el agua y el Espíritu."
  },
  {
    "id": "bautismo_cE_C",
    "varName": "bautismo_cE_C",
    "tiempo": "navidad",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Cristo es bautizado y el universo entero se purifica; el Señor nos obtiene el perdón de los pecados: purifiquémonos todos por el agua y el Espíritu."
  },
  {
    "id": "tos1LAdo_cE_A",
    "varName": "tos1LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Cristo es bautizado y el universo entero se purifica; el Señor nos obtiene el perdón de los pecados: purifiquémonos todos por el agua y el Espíritu."
  },
  {
    "id": "tos1LAdo_cE_B",
    "varName": "tos1LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Cristo es bautizado y el universo entero se purifica; el Señor nos obtiene el perdón de los pecados: purifiquémonos todos por el agua y el Espíritu."
  },
  {
    "id": "tos1LAdo_cE_C",
    "varName": "tos1LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Cristo es bautizado y el universo entero se purifica; el Señor nos obtiene el perdón de los pecados: purifiquémonos todos por el agua y el Espíritu."
  },
  {
    "id": "tos2LAdo_cE_A",
    "varName": "tos2LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "El Espíritu Santo bajó del cielo como una paloma y se posó sobre Jesús."
  },
  {
    "id": "tos2LAdo_cE_B",
    "varName": "tos2LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "«Maestro, ¿dónde vives?» Jesús les contestó: «Venid y lo veréis.»"
  },
  {
    "id": "tos2LAdo_cE_C",
    "varName": "tos2LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Jesús, a petición de María, su madre, cambió el agua en el vino de la nueva Alianza."
  },
  {
    "id": "tos3LAdo_cE_A",
    "varName": "tos3LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "«Arrepentíos —dice el Señor—, porque se acerca el reino de Dios.»"
  },
  {
    "id": "tos3LAdo_cE_B",
    "varName": "tos3LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "«Convertíos y creed la Buena Noticia», dice el Señor"
  },
  {
    "id": "tos3LAdo_cE_C",
    "varName": "tos3LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "El Espíritu del Señor está sobre mí, me envío a evangelizar a los pobres."
  },
  {
    "id": "tos4LAdo_cE_A",
    "varName": "tos4LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Dichosos los limpios de corazón, porque ellos verán a Dios."
  },
  {
    "id": "tos4LAdo_cE_B",
    "varName": "tos4LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Jesús de Nazaret, el Santo de Dios, ha visitado a su pueblo y lo ha redimido."
  },
  {
    "id": "tos4LAdo_cE_C",
    "varName": "tos4LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Jesús, hablando en Nazaret, donde se había criado, dijo: «Tened por cierto que ningún profeta es bien recibido en su patria.»"
  },
  {
    "id": "tos5LAdo_cE_A",
    "varName": "tos5LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Vosotros sois la luz del mundo; alumbre vuestra luz a los hombres para que, viendo vuestras buenas obras, den gloria a vuestro Padre celestial."
  },
  {
    "id": "tos5LAdo_cE_B",
    "varName": "tos5LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Se levantó Jesús muy de mañana y fue a un lugar solitario, donde se puso a hacer oración."
  },
  {
    "id": "tos5LAdo_cE_C",
    "varName": "tos5LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Maestro, toda la noche hemos estado trabajando y no hemos recogido nada, pero, ya que tú lo mandas, voy a echar la red."
  },
  {
    "id": "tos6LAdo_cE_A",
    "varName": "tos6LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 6,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Si al llevar tu ofrenda al altar no estás en paz con el hermano, ve primero a reconciliarte con él; luego, presenta tu ofrenda."
  },
  {
    "id": "tos6LAdo_cE_B",
    "varName": "tos6LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 6,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "«Señor, si tú quieres, puedes curarme.» Respondió Jesús: «Quiero, queda limpio.»"
  },
  {
    "id": "tos6LAdo_cE_C",
    "varName": "tos6LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 6,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Dichosos los que ahora lloráis, porque reiréis."
  },
  {
    "id": "tos7LAdo_cE_A",
    "varName": "tos7LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 7,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Dios, vuestro Padre, hace salir su sol sobre malos y buenos."
  },
  {
    "id": "tos7LAdo_cE_B",
    "varName": "tos7LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 7,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El Hijo del hombre tiene poder en la tierra para perdonar los pecados. Aleluya."
  },
  {
    "id": "tos7LAdo_cE_C",
    "varName": "tos7LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 7,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "«Como queréis que los demás hagan con vosotros, hacedlo igualmente con ellos», dice el Señor."
  },
  {
    "id": "tos8LAdo_cE_A",
    "varName": "tos8LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 8,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "No podéis servir a Dios y al dinero; Dios es el único Señor."
  },
  {
    "id": "tos8LAdo_cE_B",
    "varName": "tos8LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 8,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Cristo, Esposo y Señor de la Iglesia, quédate siempre con nosotros."
  },
  {
    "id": "tos8LAdo_cE_C",
    "varName": "tos8LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 8,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Un árbol bueno no puede dar frutos malos, ni un árbol malo puede dar frutos buenos."
  },
  {
    "id": "tos9LAdo_cE_A",
    "varName": "tos9LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 9,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Todo el que escucha éstas mis palabras las pone por obra será como el varón inteligente, que construyó su casa sobre roca."
  },
  {
    "id": "tos9LAdo_cE_B",
    "varName": "tos9LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 9,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Jesús dice: «El Hijo del hombre es dueño también del sábado.»"
  },
  {
    "id": "tos9LAdo_cE_C",
    "varName": "tos9LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 9,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "«Ni siquiera en Israel he encontrado una fe tan grande», dice el Señor."
  },
  {
    "id": "tos10LAdo_cE_A",
    "varName": "tos10LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 10,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Yo quiero misericordia y no sacrificios, pues no he venido a llamar a los justos, sino a los pecadores."
  },
  {
    "id": "tos10LAdo_cE_B",
    "varName": "tos10LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 10,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El que hace la voluntad de Dios es mi hermano y mi hermana y mi madre."
  },
  {
    "id": "tos10LAdo_cE_C",
    "varName": "tos10LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 10,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Un gran profeta ha surgido entre nosotros: Dios ha visitado a su pueblo."
  },
  {
    "id": "tos11LAdo_cE_A",
    "varName": "tos11LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 11,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Señor, envía más trabajadores a tu mies."
  },
  {
    "id": "tos11LAdo_cE_B",
    "varName": "tos11LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 11,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Sucede con el reino de Dios como con un hombre que siembra la semilla en la tierra. Ya duerma, ya vele todo el día, el grano germina y va creciendo."
  },
  {
    "id": "tos11LAdo_cE_C",
    "varName": "tos11LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 11,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Mujer, quedan perdonados tus pecados, porque has amado mucho."
  },
  {
    "id": "tos12LAdo_cE_A",
    "varName": "tos12LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 12,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "«Lo que os confío al oído, pregonadlo de lo alto de los terrados», dice el Señor."
  },
  {
    "id": "tos12LAdo_cE_B",
    "varName": "tos12LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 12,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Se levantó el Señor e increpó al viento y al mar; y sobrevino gran bonanza."
  },
  {
    "id": "tos12LAdo_cE_C",
    "varName": "tos12LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 12,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "El Hijo del hombre tiene que sufrir mucho: tiene que ser condenado y muerto, pero al tercer día resucitará."
  },
  {
    "id": "tos13LAdo_cE_A",
    "varName": "tos13LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 13,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "«El que no toma su cruz y sigue en pos de mí no es digno de mí», dice el Señor."
  },
  {
    "id": "tos13LAdo_cE_B",
    "varName": "tos13LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 13,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Hija mía, tu fe te ha curado; vete en paz."
  },
  {
    "id": "tos13LAdo_cE_C",
    "varName": "tos13LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 13,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Las raposas tienen sus cuevas, y los pájaros del cielo sus nidos; pero el Hijo del hombre no tiene donde reclinar su cabeza."
  },
  {
    "id": "tos14LAdo_cE_A",
    "varName": "tos14LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 14,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Yo te bendigo, oh Padre, Señor del cielo y de la tierra, porque has ocultado estas cosas a los sabios y prudentes y las has descubierto a los pequeños."
  },
  {
    "id": "tos14LAdo_cE_B",
    "varName": "tos14LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 14,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Muchos quedaban admirados de Cristo y se preguntaban: «¿De dónde le viene tanta sabiduría?»"
  },
  {
    "id": "tos14LAdo_cE_C",
    "varName": "tos14LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 14,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "En cualquier casa donde entréis, decid: «paz sea en esta casa»; y que vuestra paz los inunde."
  },
  {
    "id": "tos15LAdo_cE_A",
    "varName": "tos15LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 15,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "La semilla es la palabra de Dios, el sembrado es Cristo; todo el que lo escuche vivirá eternamente."
  },
  {
    "id": "tos15LAdo_cE_B",
    "varName": "tos15LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 15,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Enviados por el Señor, los discípulos arrojaban a los demonios, ungían con aceite a muchos enfermos y los sanaban."
  },
  {
    "id": "tos15LAdo_cE_C",
    "varName": "tos15LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 15,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "El buen samaritano se acercó al herido y él curó las llagas."
  },
  {
    "id": "tos16LAdo_cE_A",
    "varName": "tos16LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 16,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "El reino de los cielos se parece a la levadura que una mujer mezcla en tres medidas de harina, hasta que se fermenta toda la masa."
  },
  {
    "id": "tos16LAdo_cE_B",
    "varName": "tos16LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 16,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Volvieron a reunirse los apóstoles con Jesús y le refirieron todo lo que habían hecho y enseñado."
  },
  {
    "id": "tos16LAdo_cE_C",
    "varName": "tos16LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 16,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Una hermana de Marta, llamada María, sentada a los pies del Señor, escuchaba sus palabras."
  },
  {
    "id": "tos17LAdo_cE_A",
    "varName": "tos17LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 17,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Sucede con el reino de los cielos como con una red que se echa en el mar; una vez llena, separan los peces buenos y tiran los malos."
  },
  {
    "id": "tos17LAdo_cE_B",
    "varName": "tos17LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 17,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Un muchacho ofreció cinco panes de cebada y dos peces. Jesús dijo la acción de gracias y los repartió, dándoles cuanto querían."
  },
  {
    "id": "tos17LAdo_cE_C",
    "varName": "tos17LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 17,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Si vosotros, siendo malos como sois, sabéis dar cosas buenas a vuestros hijos, ¿con cuánta mayor razón dará vuestro Padre desde el cielo el Espíritu Santo a quienes se lo pidan?"
  },
  {
    "id": "tos18LAdo_cE_A",
    "varName": "tos18LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 18,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Jesús multiplicó los panes, y comieron todos hasta quedar satisfechos."
  },
  {
    "id": "tos18LAdo_cE_B",
    "varName": "tos18LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 18,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Yo soy el pan de vida; el que venga a mí no tendrá más hambre, y el que crea en mí jamás tendrá sed."
  },
  {
    "id": "tos18LAdo_cE_C",
    "varName": "tos18LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 18,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Si habéis sido resucitados con Cristo, buscad las cosas de arriba. Aleluya"
  },
  {
    "id": "tos19LAdo_cE_A",
    "varName": "tos19LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 19,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "De madrugada, Jesús, caminando por encima del mar, vino hacia sus discípulos y les dijo: «Tened valor, que soy yo; no tengáis miedo.»"
  },
  {
    "id": "tos19LAdo_cE_B",
    "varName": "tos19LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 19,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El pan que yo voy a dar es mi carne ofrecida por la vida del mundo."
  },
  {
    "id": "tos19LAdo_cE_C",
    "varName": "tos19LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 19,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Donde esté tu tesoro, allí estará tu corazón."
  },
  {
    "id": "tos20LAdo_cE_A",
    "varName": "tos20LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 20,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Dios encerró a todos los hombres en la desobediencia, a fin de hacer misericordia con todos."
  },
  {
    "id": "tos20LAdo_cE_B",
    "varName": "tos20LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 20,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El que come mi carne y bebe mi sangre permanece en mí, y yo en él."
  },
  {
    "id": "tos20LAdo_cE_C",
    "varName": "tos20LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 20,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Jesús quiso recibir el bautismo del sufrimiento y beber el cáliz de la pasión."
  },
  {
    "id": "tos21LAdo_cE_A",
    "varName": "tos21LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 21,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "«Tú eres el Mesías, el Hijo del Dios vivo.» «Bienaventurado eres tú, Simón: mi Padre te lo ha revelado.»"
  },
  {
    "id": "tos21LAdo_cE_B",
    "varName": "tos21LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 21,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El Espíritu es el que da vida; la carne no vale nada. Las palabras que acabo de deciros son espíritu y vida."
  },
  {
    "id": "tos21LAdo_cE_C",
    "varName": "tos21LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 21,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Procurad entrar por la puerta estrecha —dice el Señor—; es la puerta de la vida."
  },
  {
    "id": "tos22LAdo_cE_A",
    "varName": "tos22LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 22,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Presentad vuestros cuerpos como hostia viva, santa, agradable a Dios; éste es vuestro culto razonable."
  },
  {
    "id": "tos22LAdo_cE_B",
    "varName": "tos22LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 22,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Recibid con docilidad la Palabra de Dios que ha sido sembrada en vosotros, y que tiene poder para salvar vuestras almas."
  },
  {
    "id": "tos22LAdo_cE_C",
    "varName": "tos22LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 22,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Invita a tu mesa a los pobres que no tienen con qué pagarte; porque Dios te lo recompensará en la resurrección de los justos."
  },
  {
    "id": "tos23LAdo_cE_A",
    "varName": "tos23LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 23,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "El único deber vuestro ha de ser amaros los unos a los otros. porque quien ama al prójimo ya ha cumplido la ley."
  },
  {
    "id": "tos23LAdo_cE_B",
    "varName": "tos23LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 23,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Abre, Señor, nuestro corazón para que comprendamos tus palabras; abre nuestros labios y proclamaremos tu alabanza."
  },
  {
    "id": "tos23LAdo_cE_C",
    "varName": "tos23LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 23,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Dice el Señor: El que no renuncia a todos sus bienes no puede ser discípulo mío."
  },
  {
    "id": "tos24LAdo_cE_A",
    "varName": "tos24LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 24,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "El Padre celestial os perdonará, si vosotros perdonáis de corazón a vuestro hermano."
  },
  {
    "id": "tos24LAdo_cE_B",
    "varName": "tos24LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 24,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El que quiera venir en pos de mí, renúnciese a sí mismo, tome su cruz y sígame."
  },
  {
    "id": "tos24LAdo_cE_C",
    "varName": "tos24LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 24,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Sentencia verdadera y digna de universal adhesión es ésta: Cristo Jesús vino al mundo para salvar a los pecadores. Aleluya."
  },
  {
    "id": "tos25LAdo_cE_A",
    "varName": "tos25LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 25,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "El rico hacendado sale muy de mañana a contratar jornaleros para su viña."
  },
  {
    "id": "tos25LAdo_cE_B",
    "varName": "tos25LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 25,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El Hijo del hombre tenía que sufrir y resucitar para salvar al mundo."
  },
  {
    "id": "tos25LAdo_cE_C",
    "varName": "tos25LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 25,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Sed fieles en lo poco, y Dios os confiará las riquezas verdaderas."
  },
  {
    "id": "tos26LAdo_cE_A",
    "varName": "tos26LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 26,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Todo el que hace la voluntad del Padre es verdadero hijo de Dios. Aleluya."
  },
  {
    "id": "tos26LAdo_cE_B",
    "varName": "tos26LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 26,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "«El que no está contra nosotros está a nuestro favor», dice el Señor."
  },
  {
    "id": "tos26LAdo_cE_C",
    "varName": "tos26LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 26,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Dichosos los pobres de espíritu, porque de ellos es el reino de los cielos."
  },
  {
    "id": "tos27LAdo_cE_A",
    "varName": "tos27LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 27,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "La piedra que rechazaron los constructores vino a convertirse en piedra angular para el nuevo templo de Dios."
  },
  {
    "id": "tos27LAdo_cE_B",
    "varName": "tos27LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 27,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Quien no recibe la doctrina del reino de Dios con las disposiciones de un niño no puede entrar en la casa del Padre."
  },
  {
    "id": "tos27LAdo_cE_C",
    "varName": "tos27LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 27,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Conserva el precioso depósito de la fe, bajo la acción del Espíritu Santo que mora en nosotros. Aleluya."
  },
  {
    "id": "tos28LAdo_cE_A",
    "varName": "tos28LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 28,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Salid a las encrucijadas, y a todos cuantos encontréis invitadlos a las bodas."
  },
  {
    "id": "tos28LAdo_cE_B",
    "varName": "tos28LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 28,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Invoqué y vino a mí un espíritu de sabiduría; todos los bienes me vinieron con ella."
  },
  {
    "id": "tos28LAdo_cE_C",
    "varName": "tos28LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 28,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Si tenemos constancia en el sufrir, reinaremos con Cristo; si le somos infieles, él permanece fiel."
  },
  {
    "id": "tos29LAdo_cE_A",
    "varName": "tos29LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 29,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Jesús, maestro, tú enseñas con veracidad la manera de vivir según Dios. Aleluya."
  },
  {
    "id": "tos29LAdo_cE_B",
    "varName": "tos29LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 29,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El que quiera ser el mayor, que sea vuestro servidor; y el que quiera ser el primero, que sea esclavo de todos."
  },
  {
    "id": "tos29LAdo_cE_C",
    "varName": "tos29LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 29,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Dios hará justicia a sus elegidos que claman a él día y noche."
  },
  {
    "id": "tos30LAdo_cE_A",
    "varName": "tos30LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 30,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Amarás al prójimo como a ti mismo."
  },
  {
    "id": "tos30LAdo_cE_B",
    "varName": "tos30LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 30,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "¡Hijo de David, ten compasión de mí! ¡Señor, que vea!"
  },
  {
    "id": "tos30LAdo_cE_C",
    "varName": "tos30LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 30,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "El publicano, quedándose a cierta distancia y sin levantar los ojos, se daba golpes de pecho e iba repitiendo: « ¡Dios mío, ten compasión de mí, que soy un pecador!»"
  },
  {
    "id": "tos31LAdo_cE_A",
    "varName": "tos31LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 31,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Uno solo es vuestro Padre: el Dios de cielo y tierra."
  },
  {
    "id": "tos31LAdo_cE_B",
    "varName": "tos31LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 31,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Amar al prójimo como a sí mismo vale más que todos los holocaustos y sacrificios."
  },
  {
    "id": "tos31LAdo_cE_C",
    "varName": "tos31LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 31,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Zaqueo, muy contento, recibió a Jesús en su casa. A esta casa hoy ha llegado la salvación."
  },
  {
    "id": "tos32LAdo_cE_A",
    "varName": "tos32LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 32,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Saldremos al encuentro del Señor, y así estaremos siempre con él."
  },
  {
    "id": "tos32LAdo_cE_B",
    "varName": "tos32LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 32,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Nos tienen como gente triste, aunque estamos siempre alegres; por mendigos, cuando enriquecemos a muchos; o por gente que nada tiene, cuando en realidad todo lo poseemos: poseemos al Señor del cielo y tierra."
  },
  {
    "id": "tos32LAdo_cE_C",
    "varName": "tos32LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 32,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "El que alcance a ser digno de tener parte en el otro mundo es hijo de la resurrección e hijo de Dios."
  },
  {
    "id": "tos33LAdo_cE_A",
    "varName": "tos33LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 33,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Nosotros somos hijos de la luz e hijos del día; por eso, estemos alerta en espera del Señor."
  },
  {
    "id": "tos33LAdo_cE_B",
    "varName": "tos33LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 33,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Los justos brillarán como el fulgor del firmamento por toda la eternidad."
  },
  {
    "id": "tos33LAdo_cE_C",
    "varName": "tos33LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 33,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Por mi causa os perseguirán; eso os dará ocasión de profesar vuestra fe: yo os daré palabras y sabiduría a las que no podrá hacer frente ningún adversario vuestro."
  },
  {
    "id": "tos34LAdo_cE_A",
    "varName": "tos34LAdo_cE_A",
    "tiempo": "ordinario",
    "semana": 34,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "El primogénito de entre los muertos y príncipe de los reyes de la tierra nos ha convertido en un reino para Dios, su Padre. Aleluya."
  },
  {
    "id": "tos34LAdo_cE_B",
    "varName": "tos34LAdo_cE_B",
    "tiempo": "ordinario",
    "semana": 34,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El primogénito de entre los muertos y príncipe de los reyes de la tierra nos ha convertido en un reino para Dios, su Padre. Aleluya."
  },
  {
    "id": "tos34LAdo_cE_C",
    "varName": "tos34LAdo_cE_C",
    "tiempo": "ordinario",
    "semana": 34,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "El primogénito de entre los muertos y príncipe de los reyes de la tierra nos ha convertido en un reino para Dios, su Padre. Aleluya."
  },
  {
    "id": "tas1LAdm_cE",
    "varName": "tas1LAdm_cE",
    "tiempo": "adviento",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El Espíritu Santo descenderá sobre ti, María; no temas, concebirás en tu seno al Hijo de Dios. Aleluya."
  },
  {
    "id": "tas1LAdm_cE_A",
    "varName": "tas1LAdm_cE_A",
    "tiempo": "adviento",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Si supiera el dueño de casa a qué hora de la noche viene el ladrón, estaría en vela y no dejaría abrir un boquete en su casa."
  },
  {
    "id": "tas1LAdm_cE_B",
    "varName": "tas1LAdm_cE_B",
    "tiempo": "adviento",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Velad, pues no sabéis cuándo vendrá el dueño de la casa, si al atardecer, o a medianoche, o al canto del gallo, o al amanecer."
  },
  {
    "id": "tas1LAdm_cE_C",
    "varName": "tas1LAdm_cE_C",
    "tiempo": "adviento",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Levantaos, alzad la cabeza: se acerca vuestra liberación."
  },
  {
    "id": "tas2LAdm",
    "varName": "tas2LAdm",
    "tiempo": "adviento",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Mira, yo envío a mi Mensajero para que prepare mi camino delante de ti."
  },
  {
    "id": "tas2LAdm_cE_A",
    "varName": "tas2LAdm_cE_A",
    "tiempo": "adviento",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Una voz grita en el desierto: «Preparad el camino del Señor, allanad sus senderos.»"
  },
  {
    "id": "tas2LAdm_cE_B",
    "varName": "tas2LAdm_cE_B",
    "tiempo": "adviento",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Juan bautizaba en el desierto; predicaba que se convirtieran y se bautizaran, para que se les perdonasen los pecados."
  },
  {
    "id": "tas2LAdm_cE_C",
    "varName": "tas2LAdm_cE_C",
    "tiempo": "adviento",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Vino la palabra de Dios sobre Juan, hijo de Zacarías, en el desierto, y predicaba un bautismo de conversión para perdón de los pecados."
  },
  {
    "id": "tas3LAdm_cE_A",
    "varName": "tas3LAdm_cE_A",
    "tiempo": "adviento",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Juan, habiendo oído en la cárcel las obras de Cristo, le mandó a preguntar por medio de dos de sus discípulos: «¿Eres tú el que ha de venir, o tenemos que esperar a otro?»"
  },
  {
    "id": "tas3LAdm_cE_B",
    "varName": "tas3LAdm_cE_B",
    "tiempo": "adviento",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Juan dijo: «Yo soy la voz que grita en el desierto: “Allanad el camino del Señor.”»"
  },
  {
    "id": "tas3LAdm_cE_C",
    "varName": "tas3LAdm_cE_C",
    "tiempo": "adviento",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Juan dijo a todos: «Yo os bautizo con agua; pero viene el que puede más que yo. Él os bautizará con Espíritu Santo y fuego.»"
  },
  {
    "id": "tas4LAdm_cE_A",
    "varName": "tas4LAdm_cE_A",
    "tiempo": "adviento",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "José, hijo de David, no tengas reparo en llevarte a María, tu mujer, porque la criatura que hay en ella viene del Espíritu Santo. Aleluya."
  },
  {
    "id": "tas4LAdm_cE_B",
    "varName": "tas4LAdm_cE_B",
    "tiempo": "adviento",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El ángel Gabriel fue enviado por Dios a la Virgen María, desposada con José, de la estirpe de David; la virgen se llamaba María. Aleluya."
  },
  {
    "id": "tas4LAdm_cE_C",
    "varName": "tas4LAdm_cE_C",
    "tiempo": "adviento",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "María se puso en camino y fue aprisa a la montaña, a un pueblo de Judá; entró en casa de Zacarías y saludó a Isabel."
  },
  {
    "id": "tas5LAdm_cE_A",
    "varName": "tas5LAdm_cE_A",
    "tiempo": "adviento",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "El ángel del Señor se apareció en sueños a José en Egipto y le dijo: «Levántate, coge al niño y a su madre y vuélvete a Israel; ya han muerto los que atentaban contra la vida del niño.»"
  },
  {
    "id": "tas5LAdm_cE_B",
    "varName": "tas5LAdm_cE_B",
    "tiempo": "adviento",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "El padre y la madre de Jesús estaban admirados por lo que se decía del niño. Aleluya."
  },
  {
    "id": "tas5LAdm_cE_C",
    "varName": "tas5LAdm_cE_C",
    "tiempo": "adviento",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "«Hijo, ¿por qué nos has tratado así? Mira que tu padre y yo te buscábamos angustiados.» «¿Por qué me buscabais? ¿No sabíais que yo debía estar en la casa de mi Padre?»"
  },
  {
    "id": "tcsbcLA",
    "varName": "tcsbcLA",
    "tiempo": "cuaresma",
    "semana": null,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Atesorad tesoros en el cielo, donde no hay polilla ni carcoma que se los coman."
  },
  {
    "id": "tcs1LAdo_cE_A",
    "varName": "tcs1LAdo_cE_A",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "No sólo de pan vive el hombre, sino de toda palabra, que sale de la boca de Dios."
  },
  {
    "id": "tcs1LAdo_cE_B",
    "varName": "tcs1LAdo_cE_B",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Jesús se marchó a Galilea a proclamar el Evangelio de Dios. Decía: «Se ha cumplido el plazo, está cerca el reino de Dios: convertíos y creed en el Evangelio.»"
  },
  {
    "id": "tcs1LAdo_cE_C",
    "varName": "tcs1LAdo_cE_C",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Todo aquel tiempo Jesús estuvo sin comer, y al final sintió hambre."
  },
  {
    "id": "tcs1LAdo",
    "varName": "tcs1LAdo",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Jesús fue llevado al desierto por el Espíritu para ser tentado por el diablo; y, después de ayunar cuarenta días con sus cuarenta noches, al fin sintió hambre."
  },
  {
    "id": "tcs1LAlu",
    "varName": "tcs1LAlu",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Venid, benditos de mi Padre, a tomar posesión del reino que está preparado para vosotros desde la creación del mundo."
  },
  {
    "id": "tcs1LAma",
    "varName": "tcs1LAma",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Señor, enséñanos a orar, como enseñó Juan a sus discípulos."
  },
  {
    "id": "tcs1LAmi",
    "varName": "tcs1LAmi",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Esta raza es una raza perversa: pide una señal, pero no se le dará otra señal que la de Jonás."
  },
  {
    "id": "tcs1LAju",
    "varName": "tcs1LAju",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Si vosotros, siendo malos como sois, sabéis dar cosas buenas a vuestros hijos, ¡con cuánta mayor razón las dará vuestro Padre celestial al que se las pida!"
  },
  {
    "id": "tcs1LAvi",
    "varName": "tcs1LAvi",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Si vuestra virtud no es superior a la de los escribas y fariseos, no entraréis en el reino de los cielos."
  },
  {
    "id": "tcs1LAsb",
    "varName": "tcs1LAsb",
    "tiempo": "cuaresma",
    "semana": 1,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Amad a vuestros enemigos y rogad por los que os persiguen; así seréis hijos de vuestro Padre celestial”, dice el Señor."
  },
  {
    "id": "tcs2LAdo_cE_A",
    "varName": "tcs2LAdo_cE_A",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Una voz desde la nube decía: «Este es mi Hijo, el amado, mi predilecto. Escuchadla.»"
  },
  {
    "id": "tcs2LAdo_cE_B",
    "varName": "tcs2LAdo_cE_B",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Pedro le dijo a Jesús: «Maestro, ¡qué bien se está aquí! Vamos a hacer tres tiendas, una para ti, otra para Moisés y otra para Elías.»"
  },
  {
    "id": "tcs2LAdo_cE_C",
    "varName": "tcs2LAdo_cE_C",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Por medio del Evangelio, nuestro Salvador Jesucristo destruyó la muerte y sacó a la luz la vida inmortal."
  },
  {
    "id": "tcs2LAdo",
    "varName": "tcs2LAdo",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Por medio del Evangelio, nuestro Salvador Jesucristo destruyó la muerte y sacó a la luz la vida inmortal."
  },
  {
    "id": "tcs2LAlu",
    "varName": "tcs2LAlu",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "«Sed misericordiosos, como es misericordioso vuestro Padre», dice el Señor."
  },
  {
    "id": "tcs2LAma",
    "varName": "tcs2LAma",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Uno solo es vuestro maestro, Cristo el Señor, que está, en los cielos."
  },
  {
    "id": "tcs2LAmi",
    "varName": "tcs2LAmi",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El Hijo del hombre no ha venido a ser servido, sino a servir y a entregar su vida como rescate de una multitud."
  },
  {
    "id": "tcs2LAju",
    "varName": "tcs2LAju",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Hijo mío, acuérdate de que ya recibiste tus bienes en la vida; Lázaro, en cambio, recibió males."
  },
  {
    "id": "tcs2LAvi",
    "varName": "tcs2LAvi",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Dará una muerte afrentosa a esos malvados y arrendará la viña a otros viñadores, que le paguen la renta a su tiempo."
  },
  {
    "id": "tcs2LAsb",
    "varName": "tcs2LAsb",
    "tiempo": "cuaresma",
    "semana": 2,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Padre mío, he pecado contra el cielo y contra ti; ya no merezco ser llamado hijo tuyo, trátame como a uno de tus jornaleros."
  },
  {
    "id": "tcs3LAdo_cE_A",
    "varName": "tcs3LAdo_cE_A",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Dios es espíritu, y los que le dan culto deben hacerlo en espíritu y verdad."
  },
  {
    "id": "tcs3LAdo_cE_B",
    "varName": "tcs3LAdo_cE_B",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "“Destruid este templo —dice el Señor— y yo lo levantaré en tres días”. Él hablaba del templo de su cuerpo."
  },
  {
    "id": "tcs3LAdo_cE_C",
    "varName": "tcs3LAdo_cE_C",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "El Señor Dios de vuestros padres me envía a vosotros."
  },
  {
    "id": "tcs3LAdo_cE_A2",
    "varName": "tcs3LAdo_cE_A2",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Se acerca la hora, ya está aquí, en que los que quieran dar culto verdadero adorarán al Padre en espíritu y verdad, porque el Padre desea que le den culto así."
  },
  {
    "id": "tcs3LAdo_cE_B2",
    "varName": "tcs3LAdo_cE_B2",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "«Destruid este templo —dice el Señor—, y en tres días lo levantaré.» Él hablaba del templo de su cuerpo."
  },
  {
    "id": "tcs3LAdo_cE_C2",
    "varName": "tcs3LAdo_cE_C2",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Justificados por la fe, estamos en paz con Dios por medio de nuestro Señor Jesucristo."
  },
  {
    "id": "tcs3LAlu",
    "varName": "tcs3LAlu",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Tened por cierto que ningún profeta es bien recibido en su patria."
  },
  {
    "id": "tcs3LAma",
    "varName": "tcs3LAma",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“Yo te digo, Pedro: No has de perdonar hasta siete veces, sino hasta setenta veces siete”, dice el Señor."
  },
  {
    "id": "tcs3LAmi",
    "varName": "tcs3LAmi",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“No penséis que he venido a abolir la ley o los profetas; no he venido a abolirlos, sino a darles plenitud”, dice el Señor."
  },
  {
    "id": "tcs3LAju",
    "varName": "tcs3LAju",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“Si yo arrojo los demonios por el poder de Dios es señal de que ha llegado a vosotros el reino de Dios”, dice el Señor."
  },
  {
    "id": "tcs3LAvi",
    "varName": "tcs3LAvi",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Uno de los escribas se acercó a Jesús para preguntarle cuál era el primero de todos los mandamientos. Jesús le respondió: “Amarás al Señor, tu Dios, con todo tu corazón.”"
  },
  {
    "id": "tcs3LAsb",
    "varName": "tcs3LAsb",
    "tiempo": "cuaresma",
    "semana": 3,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El publicano, quedándose a cierta distancia, no se atrevía ni siquiera a levantar los ojos al cielo; y se daba golpes de pecho, mientras decía: “¡Dios mío, ten compasión de mí, que soy un pecador!”"
  },
  {
    "id": "tcs4LAdo_cE_A",
    "varName": "tcs4LAdo_cE_A",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Jamás se oyó decir que nadie, a no ser Cristo, el Hijo de Dios, abriera los ojos a un ciego de nacimiento."
  },
  {
    "id": "tcs4LAdo_cE_B",
    "varName": "tcs4LAdo_cE_B",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Dios, por el gran amor con que nos amó, estando nosotros muertos por los pecados, nos ha hecho vivir con Cristo."
  },
  {
    "id": "tcs4LAdo_cE_C",
    "varName": "tcs4LAdo_cE_C",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Padre, he pecado contra ti; ya no merezco llamarme hijo tuyo."
  },
  {
    "id": "tcs4LAdo_cE_A2",
    "varName": "tcs4LAdo_cE_A2",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Ese hombre que se llama Jesús hizo barro y me lo untó en los ojos; fui, me lavé y ahora veo."
  },
  {
    "id": "tcs4LAdo_cE_B2",
    "varName": "tcs4LAdo_cE_B2",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Tanto amó Dios al mundo que entregó a su Hijo único para que no perezca ninguno de los que ere en él, sino que tengan vida eterna."
  },
  {
    "id": "tcs4LAdo_cE_C2",
    "varName": "tcs4LAdo_cE_C2",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Sacad en seguida el mejor traje y vestidlo; ponedle un anillo en la mano y sandalias en los pies; porque este hijo mío estaba muerto y ha revivido; estaba perdido, y lo hemos encontrado."
  },
  {
    "id": "tcs4LAlu",
    "varName": "tcs4LAlu",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Había un funcionario de la corte que tenía un hijo enfermo en Cafarnaúm; y, habiéndose enterado de que Jesús había vuelto a Galilea, le pidió que bajase a curar a su hijo"
  },
  {
    "id": "tcs4LAma",
    "varName": "tcs4LAma",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El que me curó me dijo: “Toma tu camilla y vete en paz.”"
  },
  {
    "id": "tcs4LAmi",
    "varName": "tcs4LAmi",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“El que escucha mi palabra y cree en aquel que me ha enviado tiene vida eterna”, dice el Señor."
  },
  {
    "id": "tcs4LAju",
    "varName": "tcs4LAju",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“No es que yo quiera invocar a mi favor declaración alguna, prestada por los hombres; si aduzco ésta, es mirando por vuestra salvación”, dice el Señor."
  },
  {
    "id": "tcs4LAvi",
    "varName": "tcs4LAvi",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“¡Vosotros me conocéis y sabéis de dónde soy!; pero yo no he venido por cuenta propia, sino que me ha enviado mi Padre”, dice el Señor."
  },
  {
    "id": "tcs4LAsb",
    "varName": "tcs4LAsb",
    "tiempo": "cuaresma",
    "semana": 4,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Jamás hombre alguno ha hablado como éste."
  },
  {
    "id": "tcs5LAdo_cE_A",
    "varName": "tcs5LAdo_cE_A",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Lázaro, nuestro amigo, está dormido: voy a despertarlo."
  },
  {
    "id": "tcs5LAdo_cE_B",
    "varName": "tcs5LAdo_cE_B",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Haré con vosotros una alianza nueva: yo seré vuestro Dios, y vosotros seréis mi pueblo."
  },
  {
    "id": "tcs5LAdo_cE_C",
    "varName": "tcs5LAdo_cE_C",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "No penséis en lo antiguo: mirad que realizo algo nuevo."
  },
  {
    "id": "tcs5LAdo_cE_A2",
    "varName": "tcs5LAdo_cE_A2",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Yo soy la resurrección y la vida: el que cree en mí, aunque haya muerto, vivirá; y el que está vivo y cree en mí, no morirá para siempre."
  },
  {
    "id": "tcs5LAdo_cE_B2",
    "varName": "tcs5LAdo_cE_B2",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El que quiera servirme, que me siga, y donde esté yo, allí también estará mi servidor."
  },
  {
    "id": "tcs5LAdo_cE_C2",
    "varName": "tcs5LAdo_cE_C2",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Al oírlo, se fueron escabullendo uno a uno, empezando por los más viejos, Y quedó solo Jesús, con la mujer, en medio."
  },
  {
    "id": "tcs5LAlu",
    "varName": "tcs5LAlu",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“El que me sigue no camina en tinieblas, sino que tendrá la luz de la vida”, dice el Señor"
  },
  {
    "id": "tcs5LAma",
    "varName": "tcs5LAma",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“Cuando levantéis en alto al Hijo del hombre, entonces sabréis que “Yo soy”, dice el Señor"
  },
  {
    "id": "tcs5LAmi",
    "varName": "tcs5LAmi",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“Si permanecéis en mi palabra seréis en verdad discípulos míos —dice el Señor— y llegaréis al conocimiento de la verdad y la verdad os librará de la esclavitud.”"
  },
  {
    "id": "tcs5LAju",
    "varName": "tcs5LAju",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Decía Jesús a los judíos y a los príncipes de los sacerdotes: “El que procede de Dios da oídos a las palabras de Dios. Por eso no las escucháis vosotros, porque no sois de Dios.”"
  },
  {
    "id": "tcs5LAvi",
    "varName": "tcs5LAvi",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "“Muchas y buenas obras os he hecho ver —dice el Señor—, ¿por cuál de ellas me queréis apedrear?”"
  },
  {
    "id": "tcs5LAsb",
    "varName": "tcs5LAsb",
    "tiempo": "cuaresma",
    "semana": 5,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Jesús murió para reunir a los hijos de Dios dispersos"
  },
  {
    "id": "tcs6LAdo_cE",
    "varName": "tcs6LAdo_cE",
    "tiempo": "cuaresma",
    "semana": 6,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Aclamemos con palmas de victoria al Señor que viene, y salgamos a su encuentro con himnos y cantos, dándole gloria y diciendo: «Bendito eres, Señor.»"
  },
  {
    "id": "tcs6LAdo_cE_A",
    "varName": "tcs6LAdo_cE_A",
    "tiempo": "cuaresma",
    "semana": 6,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "Aclamemos con palmas de victoria al Señor que viene, y salgamos a su encuentro con himnos y cantos, dándole gloria y diciendo: «Bendito eres, Señor.»"
  },
  {
    "id": "tcs6LAdo_cE_B",
    "varName": "tcs6LAdo_cE_B",
    "tiempo": "cuaresma",
    "semana": 6,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Los que iban delante y detrás gritaban: «Hosanna, bendito el que viene en nombre del Señor. Bendito el reino que llega, el de nuestro padre David.»"
  },
  {
    "id": "tcs6LAdo_cE_C",
    "varName": "tcs6LAdo_cE_C",
    "tiempo": "cuaresma",
    "semana": 6,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "La masa de los discípulos, entusiasmados, se pusieron a alabar a Dios a gritos, diciendo: «¡Bendito el que viene como rey, en nombre del Señor! Paz en el cielo y gloria en lo alto.»"
  },
  {
    "id": "tcssLAlu",
    "varName": "tcssLAlu",
    "tiempo": "cuaresma",
    "semana": null,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Padre justo, si es verdad que el mundo no te ha conocido, yo sí te he conocido y sé que tú me has enviado."
  },
  {
    "id": "tcssLAma",
    "varName": "tcssLAma",
    "tiempo": "cuaresma",
    "semana": null,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Glorifícame tú, Padre, con la gloria que tenía junto a ti, antes que el mundo existiese."
  },
  {
    "id": "tcssLAmi",
    "varName": "tcssLAmi",
    "tiempo": "cuaresma",
    "semana": null,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "La sangre de Cristo, que por medio del Espíritu eterno se ofreció inmaculado a Dios, purificará nuestra conciencia de las obras muertas, para dar culto al Dios vivo."
  },
  {
    "id": "tcssLAju",
    "varName": "tcssLAju",
    "tiempo": "cuaresma",
    "semana": null,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Con verdadero anhelo he deseado comer esta Pascua con vosotros antes de padecer."
  },
  {
    "id": "tcssLAvi",
    "varName": "tcssLAvi",
    "tiempo": "cuaresma",
    "semana": null,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Fijaron encima de su cabeza un letrero indicando el motivo de su condenación: «Éste es Jesús, el rey de los judíos.»"
  },
  {
    "id": "tcssLAsb",
    "varName": "tcssLAsb",
    "tiempo": "cuaresma",
    "semana": null,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Salvador del mundo, sálvanos; tú que con tu cruz y con tu sangre nos redimiste, socórrenos, Dios nuestro."
  },
  {
    "id": "tpdrLAdo_cE",
    "varName": "tpdrLAdo_cE",
    "tiempo": "pascua",
    "semana": null,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Muy temprano, el primer día de la semana, al salir el sol, fueron al sepulcro. Aleluya."
  },
  {
    "id": "tps2LAdo",
    "varName": "tps2LAdo",
    "tiempo": "pascua",
    "semana": 2,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Trae tu mano y métela en mi costado; y no seas incrédulo, sino fiel. Aleluya."
  },
  {
    "id": "tps2LAlu",
    "varName": "tps2LAlu",
    "tiempo": "pascua",
    "semana": 2,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Os digo con toda verdad: el que no nace de arriba no podrá entrar en el reino de Dios. Aleluya"
  },
  {
    "id": "tps2LAma",
    "varName": "tps2LAma",
    "tiempo": "pascua",
    "semana": 2,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Yo soy el alfa y la omega, el primero y el último; yo soy el vástago y la descendencia de David, el lucero radiante de la mañana. Aleluya."
  },
  {
    "id": "tps2LAmi",
    "varName": "tps2LAmi",
    "tiempo": "pascua",
    "semana": 2,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Tanto amó Dios al mundo que le entregó su Hijo único, para que todo el que crea en él no perezca, sino que tenga vida eterna. Aleluya."
  },
  {
    "id": "tps2LAju",
    "varName": "tps2LAju",
    "tiempo": "pascua",
    "semana": 2,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El Padre ama al Hijo y ha puesto en sus manos todas las cosas. Aleluya."
  },
  {
    "id": "tps2LAvi",
    "varName": "tps2LAvi",
    "tiempo": "pascua",
    "semana": 2,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Tomó Jesús los panes, y, después de haber dado gracias, los repartió entre los que estaban recostados en el suelo. Aleluya,"
  },
  {
    "id": "tps2LAsb",
    "varName": "tps2LAsb",
    "tiempo": "pascua",
    "semana": 2,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "La paz sea con vosotros, soy yo; aleluya; no tengáis miedo. Aleluya."
  },
  {
    "id": "tps3LAdo_cE_A",
    "varName": "tps3LAdo_cE_A",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "A",
    "texto": "El Mesías tenía que morir, y resucitar de entre los muertos al tercer día, Aleluya."
  },
  {
    "id": "tps3LAdo_cE_B",
    "varName": "tps3LAdo_cE_B",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "B",
    "texto": "Se presentó Jesús en medio de sus discípulos y les dijo: «La paz sea con vosotros.» Aleluya."
  },
  {
    "id": "tps3LAdo_cE_C",
    "varName": "tps3LAdo_cE_C",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": "C",
    "texto": "Ninguno de los discípulos se atrevía a preguntar a Jesús quién era, sabiendo que era el Señor. Aleluya."
  },
  {
    "id": "tps3LAdo_cE_A2",
    "varName": "tps3LAdo_cE_A2",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Era necesario que el Mesías padeciera y resucitara de entre los muertos al tercer día. Aleluya."
  },
  {
    "id": "tps3LAdo_cE_B2",
    "varName": "tps3LAdo_cE_B2",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Mirad mis manos y mis pies: soy yo. Palpadme y ved. Aleluya."
  },
  {
    "id": "tps3LAdo_cE_C2",
    "varName": "tps3LAdo_cE_C2",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Jesús se acerca, toma el pan y se lo da, y lo mismo el pescado. Ésta fue la tercera vez que Jesús se apareció a los discípulos, después de resucitar de entre los muertos. Aleluya."
  },
  {
    "id": "tps3LAlu",
    "varName": "tps3LAlu",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Trabajad por conseguir no el alimento perecedero, sino el alimento que permanece y da vida eterna. Aleluya."
  },
  {
    "id": "tps3LAma",
    "varName": "tps3LAma",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Os lo digo con toda verdad: Moisés no os dio el pan del cielo; es mi Padre el que os da el verdadero pan del cielo. Aleluya."
  },
  {
    "id": "tps3LAmi",
    "varName": "tps3LAmi",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Todo el que ve al Hijo y cree en él tiene vida eterna, y yo lo resucitaré en el último día. Aleluya."
  },
  {
    "id": "tps3LAju",
    "varName": "tps3LAju",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Os lo aseguro con toda verdad: el que cree en mí tiene vida eterna. Aleluya."
  },
  {
    "id": "tps3LAvi",
    "varName": "tps3LAvi",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El que come mi carne y bebe mi sangre permanece en mí, y yo en él. Aleluya."
  },
  {
    "id": "tps3LAsb",
    "varName": "tps3LAsb",
    "tiempo": "pascua",
    "semana": 3,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Dijo Simón Pedro: «Señor, ¿a quién vamos a ir? Tú tienes palabras de vida eterna. Y nosotros hemos creído y sabemos que tú eres el Santo de Dios.» Aleluya."
  },
  {
    "id": "tps4LAdo_cE",
    "varName": "tps4LAdo_cE",
    "tiempo": "pascua",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Yo soy el Pastor de las ovejas; yo soy el camino, la verdad y la vida; yo soy el buen Pastor, y conozco a mis ovejas y ellas me conocen a mí. Aleluya."
  },
  {
    "id": "tps4LAdo_cE_A2",
    "varName": "tps4LAdo_cE_A2",
    "tiempo": "pascua",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "«Yo soy la puerta —dice el Señor—: quien entre por mí se salvará y encontrará pastos.» Aleluya."
  },
  {
    "id": "tps4LAdo_cE_B2",
    "varName": "tps4LAdo_cE_B2",
    "tiempo": "pascua",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Yo soy el Pastor de las ovejas; yo soy el camino, la verdad, y la vida. Yo soy el buen Pastor, que conozco a mis ovejas, y las mías me conocen. Aleluya."
  },
  {
    "id": "tps4LAdo_cE_C2",
    "varName": "tps4LAdo_cE_C2",
    "tiempo": "pascua",
    "semana": 4,
    "dia": "domingo",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Yo doy la vida eterna a mis ovejas; no perecerán para siempre, y nadie las arrebatará de mi mano. Aleluya."
  },
  {
    "id": "tps4LAlu",
    "varName": "tps4LAlu",
    "tiempo": "pascua",
    "semana": 4,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Yo soy el buen Pastor, que apaciento a mis ovejas y doy mi vida por ellas. Aleluya"
  },
  {
    "id": "tps4LAma",
    "varName": "tps4LAma",
    "tiempo": "pascua",
    "semana": 4,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El Señor ha resucitado del sepulcro. Aleluya, aleluya."
  },
  {
    "id": "tps4LAmi",
    "varName": "tps4LAmi",
    "tiempo": "pascua",
    "semana": 4,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "«Yo he venido al mundo como luz, para que nadie que crea en mí quede en tinieblas», dice el Señor. Aleluya."
  },
  {
    "id": "tos1lalu_cE",
    "varName": "tos1lalu_cE",
    "tiempo": "ordinario",
    "semana": 1,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Bendito sea el Señor, Dios nuestro."
  },
  {
    "id": "tos2lalu_cE",
    "varName": "tos2lalu_cE",
    "tiempo": "ordinario",
    "semana": 2,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Bendito sea el Señor, Dios de Israel, porque ha visitado y redimido a su pueblo."
  },
  {
    "id": "tos3lalu_cE",
    "varName": "tos3lalu_cE",
    "tiempo": "ordinario",
    "semana": 3,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Bendito sea el Señor, Dios nuestro."
  },
  {
    "id": "tos4lalu_cE",
    "varName": "tos4lalu_cE",
    "tiempo": "ordinario",
    "semana": 4,
    "dia": "lunes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Bendito sea el Señor, Dios de Israel, porque ha visitado y redimido a su pueblo."
  },
  {
    "id": "tos1lama_cE",
    "varName": "tos1lama_cE",
    "tiempo": "ordinario",
    "semana": 1,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Nos ha suscitado el Señor una fuerza de salvación, según lo había predicho por boca de sus Santos profetas."
  },
  {
    "id": "tos2lama_cE",
    "varName": "tos2lama_cE",
    "tiempo": "ordinario",
    "semana": 2,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "De la mano de nuestros enemigos, líbranos, Señor."
  },
  {
    "id": "tos3lama_cE",
    "varName": "tos3lama_cE",
    "tiempo": "ordinario",
    "semana": 3,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Nos ha suscitado el Señor una fuerza de salvación, según lo había predicho por boca de sus Santos profetas."
  },
  {
    "id": "tos4lama_cE",
    "varName": "tos4lama_cE",
    "tiempo": "ordinario",
    "semana": 4,
    "dia": "martes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "De la mano de nuestros enemigos, líbranos, Señor."
  },
  {
    "id": "tos1lami_cE",
    "varName": "tos1lami_cE",
    "tiempo": "ordinario",
    "semana": 1,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Realiza, Señor, con nosotros la misericordia y recuerda tu santa alianza."
  },
  {
    "id": "tos2lami_cE",
    "varName": "tos2lami_cE",
    "tiempo": "ordinario",
    "semana": 2,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Sirvamos al Señor con santidad todos nuestros días."
  },
  {
    "id": "tos3lami_cE",
    "varName": "tos3lami_cE",
    "tiempo": "ordinario",
    "semana": 3,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Realiza, Señor, con nosotros la misericordia y recuerda tu santa alianza."
  },
  {
    "id": "tos4lami_cE",
    "varName": "tos4lami_cE",
    "tiempo": "ordinario",
    "semana": 4,
    "dia": "miercoles",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Sirvamos al Señor con santidad todos nuestros días."
  },
  {
    "id": "tos1laju_cE",
    "varName": "tos1laju_cE",
    "tiempo": "ordinario",
    "semana": 1,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Sirvamos al Señor con santidad y nos librará de la mano de nuestros enemigos."
  },
  {
    "id": "tos2laju_cE",
    "varName": "tos2laju_cE",
    "tiempo": "ordinario",
    "semana": 2,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Anuncia, Señor, la salvación a tu pueblo y perdónanos nuestros pecados."
  },
  {
    "id": "tos3laju_cE",
    "varName": "tos3laju_cE",
    "tiempo": "ordinario",
    "semana": 3,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Sirvamos al Señor con santidad y nos librará de la mano de nuestros enemigos."
  },
  {
    "id": "tos4laju_cE",
    "varName": "tos4laju_cE",
    "tiempo": "ordinario",
    "semana": 4,
    "dia": "jueves",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Anuncia, Señor, la salvación a tu pueblo y perdónanos nuestros pecados."
  },
  {
    "id": "tos1lavi_cE",
    "varName": "tos1lavi_cE",
    "tiempo": "ordinario",
    "semana": 1,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El Señor ha visitado y redimido a su pueblo."
  },
  {
    "id": "tos2lavi_cE",
    "varName": "tos2lavi_cE",
    "tiempo": "ordinario",
    "semana": 2,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Por la entrañable misericordia de nuestro Dios, nos visitará el sol que nace de lo alto."
  },
  {
    "id": "tos3lavi_cE",
    "varName": "tos3lavi_cE",
    "tiempo": "ordinario",
    "semana": 3,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "El Señor ha visitado y redimido a su pueblo."
  },
  {
    "id": "tos4lavi_cE",
    "varName": "tos4lavi_cE",
    "tiempo": "ordinario",
    "semana": 4,
    "dia": "viernes",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Por la entrañable misericordia de nuestro Dios, nos visitará el sol que nace de lo alto."
  },
  {
    "id": "tos1lasa_cE",
    "varName": "tos1lasa_cE",
    "tiempo": "ordinario",
    "semana": 1,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Ilumina, Señor, a los que viven en tiniebla y en sombra de muerte."
  },
  {
    "id": "tos2lasa_cE",
    "varName": "tos2lasa_cE",
    "tiempo": "ordinario",
    "semana": 2,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Guía nuestros pasos, Dios de Israel, por el camino de la paz."
  },
  {
    "id": "tos3lasa_cE",
    "varName": "tos3lasa_cE",
    "tiempo": "ordinario",
    "semana": 3,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Ilumina, Señor, a los que viven en tiniebla y en sombra de muerte."
  },
  {
    "id": "tos4lasa_cE",
    "varName": "tos4lasa_cE",
    "tiempo": "ordinario",
    "semana": 4,
    "dia": "sabado",
    "libro": "laudes",
    "ciclo": null,
    "texto": "Guía nuestros pasos, Dios de Israel, por el camino de la paz."
  }
];

export const MAPA_PRECES_SEED = {
  "tps1jslaud": {
    "p1": "Glorifiquemos a Cristo resucitado y siempre presente en su Iglesia, y supliquémosle, diciendo:\n\nQuédate con nosotros, Señor.\n\nSeñor Jesús, vencedor del pecado y de la muerte,\npermanece en medio de nosotros, tú que vives por los siglos de los siglos.\n\nSeñor, ven a nosotros con tu poder invencible\ny muéstranos la bondad de Dios Padre.\n\nSeñor, ayuda al mundo abrumado por las discordias,\nya que tú solo tienes el poder de salvar y reconciliar.\n\nConfírmanos en la fe de la victoria final\ny arraiga en nosotros la esperanza de tu manifestación gloriosa.",
    "p2": "Porque Jesucristo nos ha hecho participar de su propia vida, somos hijos de Dios, y por ello nos atrevemos a decir:"
  },
  "bautismoLA": {
    "p1": "Roguemos a nuestro Redentor, bautizado por Juan en el Jordán, y digámosle:\n\nSeñor, ten piedad.\n\nCristo Jesús, que al manifestarte al mundo has iluminado a todos los hombres, concede luz abundante a cuantos hoy se relacionen con nosotros.\n\nCristo Jesús, que para enseñarnos un camino de humildad te humillaste recibiendo el bautismo de Juan, danos un espíritu de humilde servicio para con todos los hombres.\n\nCristo Jesús, que por tu bautismo nos purificaste de todo pecado y nos hiciste hijos del Padre, concede el espíritu de adopción a todos los que buscan a Dios con sinceridad.\n\nCristo Jesús, que en tu bautismo abriste una puerta de salvación para los cristianos y santificaste la creación entera, haz de todos nosotros ministros de tu Evangelio en el mundo.\n\nCristo Jesús, que en tu bautismo nos revelaste a la Trinidad, renueva el espíritu de adopción y el sacerdocio real de los bautizados.",
    "p2": "Gracias a Jesucristo somos hijos de Dios; por eso nos atrevemos a decir:"
  },
  "tos2LAdo": {
    "p1": "Invoquemos, hermanos, a nuestro Salvador, que ha venido al mundo para ser «Dios-con-nosotros», y digámosle confiadamente:\n\nSeñor Jesús, rey de la gloria, sé tú nuestra luz y nuestro gozo.\n\nSeñor Jesús, sol que nace de lo alto y primicia de la humanidad resucitada,\nhaz que siguiéndote a ti no caminemos nunca en sombras de muerte, sino que tengamos siempre la luz de la vida.\n\nQue sepamos descubrir, Señor, cómo todas las creaturas están llenas de tus perfecciones,\npara que así, en todas ellas, sepamos contemplarte a ti.\n\nNo permitas, Señor, que hoy nos dejemos vencer por el mal,\nantes danos tu fuerza para que venzamos al mal a fuerza del bien.\n\nTú que, bautizado por Juan en el Jordán, fuiste ungido con el Espíritu Santo,\nasístenos durante este día para que actuemos movidos por este mismo Espíritu.",
    "p2": "Por Jesús nos llamamos y somos hijos de Dios; por ello nos atrevemos a decir:"
  },
  "tos3LAdo": {
    "p1": "Invoquemos a Dios Padre que envió al Espíritu Santo, para que con su luz santísima penetrara las almas de sus fieles, y digámosle:\n\nIlumina, Señor, a tu pueblo.\n\nTe bendecimos, Señor, luz nuestra,\nporque a gloria de tu nombre nos has hecho llegar a este nuevo día.\n\nTú que por la resurrección de tu Hijo quisiste iluminar el mundo,\nhaz que tu Iglesia difunda entre todos los hombres la alegría pascual.\n\nTú que por el Espíritu de la verdad adoctrinaste a los discípulos de tu Hijo,\nenvía este mismo Espíritu a tu Iglesia para que permanezca siempre fiel a ti.\n\nTú que eres luz para todos los hombres, acuérdate de los que viven aún en las tinieblas\ny abre los ojos de su mente para que te reconozcan a ti, único Dios verdadero.",
    "p2": "Por Jesús hemos sido hechos hijos de Dios; por esto nos atrevemos a decir:"
  },
  "tos4LAdo": {
    "p1": "Dios nos ama y sabe lo que nos hace falta; invoquémosle, pues, diciendo:\n\nTe bendecimos y en ti confiamos, Señor.\n\nTe alabamos, Dios todopoderoso, Rey del universo, porque a nosotros, injustos y pecadores, nos has llamado al conocimiento de la verdad;\nhaz que te sirvamos con santidad y justicia.\n\nVuélvete hacia nosotros, Señor, tú que has querido abrirnos la puerta de tu misericordia,\ny haz que nunca nos apartemos del camino que lleva a la vida.\n\nYa que hoy celebramos la resurrección del Hijo de tu amor,\nhaz que este día transcurra lleno de gozo espiritual.\n\nDa, Señor, a tus fieles el espíritu de oración y de alabanza,\npara que en toda ocasión te demos gracias.",
    "p2": "Movidos ahora todos por el mismo Espíritu que nos da Cristo resucitado acudamos a Dios, de quien somos verdaderos hijos, diciendo:"
  },
  "tos5LAdo": {
    "p1": "Glorifiquemos al Señor Jesús, luz que alumbra a todo hombre y sol de justicia que no conoce el ocaso, y digámosle:\n\nTú que eres nuestra vida y nuestra salvación, Señor, ten piedad.\n\nCreador de la luz, de cuya bondad recibimos, con acción de gracias, las primicias de este día;\nte pedimos que el recuerdo de tu santa resurrección sea nuestro gozo durante este domingo.\n\nQue tu Espíritu Santo nos enseñe a cumplir tu voluntad,\ny que tu sabiduría dirija hoy todas nuestras acciones.\n\nQue al celebrar la eucaristía de este domingo tu palabra nos llene de gozo,\ny que la participación en el banquete de tu amor haga crecer nuestra esperanza.\n\nQue sepamos contemplar las maravillas que tu generosidad nos concede,\ny vivamos durante todo el día en acción de gracias.",
    "p2": "Digamos ahora todos juntos la oración que Cristo nos enseñó:"
  },
  "tos1lalu": {
    "p1": "Proclamemos la grandeza de Cristo, lleno de gracia y del Espíritu Santo, y acudamos a él diciendo:\n\nConcédenos, Señor, tu Espíritu.\n\nConcédenos, Señor, un día lleno de paz, de alegría y de inocencia\npara que, al llegar a la noche, podamos alabarte con gozo y limpios de pecado.\n\nQue baje hoy a nosotros tu bondad\ny haga prósperas las obras de nuestras manos.\n\nMuéstranos tu rostro propicio y danos tu paz\npara que durante todo el día sintamos cómo tu mano nos protege.\n\nMira con bondad a cuantos se han encomendado a nuestras oraciones\ny enriquécelos con toda clase de bienes.",
    "p2": "Terminemos nuestra oración con la plegaria que Cristo nos enseñó:"
  },
  "tos2lalu": {
    "p1": "Demos gracias a nuestro salvador que ha hecho de nosotros un pueblo de reyes y sacerdotes, y digámosle:\n\nConsérvanos, Señor, en tu servicio.\n\nSeñor Jesús, sacerdote eterno, que has querido que tu pueblo participara de tu sacerdocio:\nhaz que ofrezcamos siempre sacrificios espirituales, agradables al Padre.\n\nDanos, Señor, la abundancia de los frutos del Espíritu Santo:\ncomprensión, bondad, amabilidad.\n\nQue la luz de la fe ilumine este nuevo día\ny que durante el mismo caminemos por las sendas del amor.\n\nHaz que busquemos siempre el bien de nuestros hermanos\ny les ayudemos a progresar en su salvación.",
    "p2": "Con el gozo que nos da el sabernos hijos de Dios, digamos confiadamente:"
  },
  "tos3lalu": {
    "p1": "Invoquemos a Dios, que puso en el mundo a los hombres para que trabajasen concordes para su gloria, y digámosle:\n\nHaz, Señor, que te glorifiquemos.\n\nTe bendecimos, Señor, creador del universo, porque has conservado nuestra vida hasta el día de hoy;\nHaz que en toda nuestra jornada te alabemos y te bendigamos.\n\nMíranos benigno, Señor, ahora que vamos a comenzar nuestra labor cotidiana;\nhaz que, obrando conforme a tu voluntad, cooperemos en tu obra.\n\nQue nuestro trabajo de hoy sea provechoso para nuestros hermanos,\ny así todos juntos edifiquemos un mundo grato a tus ojos.\n\nA nosotros y a todos los que hoy entrarán en contacto con nosotros,\nconcédenos el gozo y la paz.",
    "p2": "Llenos de alegría por nuestra condición de hijos de Dios, digamos confiadamente:"
  },
  "tos4lalu": {
    "p1": "Ya que Cristo escucha y salva a cuantos en él se refugian, acudamos a él diciendo:\n\nEscúchanos, Señor.\n\nTe damos gracias, Señor, por el gran amor con que nos amaste;\ncontinúa mostrándote con nosotros rico en misericordia.\n\nTú que con el Padre sigues actuando siempre en el mundo,\nrenueva todas las cosas con la fuerza de tu Espíritu.\n\nAbre nuestros ojos y los de nuestros hermanos\npara que podamos contemplar hoy tus maravillas.\n\nYa que nos llamas hoy a tu servicio,\nhaz que seamos buenos administradores de tu multiforme gracia en favor de nuestros hermanos.",
    "p2": "Acudamos a Dios Padre, tal como nos enseñó Jesucristo:"
  },
  "tos1lama": {
    "p1": "Ya que hemos sido llamados a participar de una vocación celestial, bendigamos por ello a Jesús, el pontífice de nuestra fe, y supliquémosle diciendo:\n\nEscúchanos, Señor.\n\nSeñor Jesús, que por el bautismo has hecho de nosotros un sacerdocio real,\nhaz que nuestra vida sea un continuo sacrificio de alabanza.\n\nAyúdanos, Señor, a guardar tus mandatos\npara que por la fuerza del Espíritu Santo nosotros permanezcamos en ti y tú en nosotros.\n\nDanos tu sabiduría eterna\npara que permanezca con nosotros y con nosotros trabaje.\n\nConcédenos ser la alegría de cuantos nos rodean\ny fuente de esperanza para los decaídos.",
    "p2": "Como hijos que somos de Dios, dirijámonos a nuestro Padre con la oración que Cristo nos enseñó:"
  },
  "tos2lama": {
    "p1": "Bendigamos a nuestro Salvador, que con su resurrección ha iluminado el mundo, y digámosle suplicantes:\n\nHaz, Señor, que caminemos por tu senda.\n\nSeñor Jesús, al consagrar nuestra oración matinal en memoria de tu santa resurrección,\nte pedimos que la esperanza de participar de tu gloria ilumine todo nuestro día.\n\nTe ofrecemos, Señor, los deseos y proyectos de nuestra jornada:\ndígnate aceptarlos y bendecirlos como primicia de nuestro día.\n\nConcédenos crecer hoy en tu amor,\na fin de que todo concurra para nuestro bien y el de nuestros hermanos.\n\nHaz, Señor, que el ejemplo de nuestra vida resplandezca como una luz ante los hombres,\npara que todos den gloria al Padre que está en los cielos.",
    "p2": "Porque deseamos que la luz de Cristo ilumine a todos los hombres, pidamos al Padre que su reino llegue a nosotros:"
  },
  "tos3lama": {
    "p1": "Adoremos a Cristo, que con su sangre ha adquirido el pueblo de la nueva alianza, y digámosle suplicantes:\n\nAcuérdate, Señor, de tu pueblo.\n\nRey y redentor nuestro, escucha la alabanza que te dirige tu Iglesia en el comienzo de este día,\ny haz que no deje nunca de glorificarte.\n\nQue nunca, Señor, quedemos confundidos\nlos que en ti ponemos nuestra fe y nuestra esperanza.\n\nMira compasivo nuestra debilidad y ven en ayuda nuestra,\nya que sin ti nada podemos hacer.\n\nAcuérdate de los pobres y desvalidos;\nque este día que comienza les traiga solaz y alegría.",
    "p2": "Ya que deseamos que la luz de Cristo ilumine a todos los hombres, pidamos al Padre que a todos llegue el reino de su Hijo:"
  },
  "tos4lama": {
    "p1": "Dios nos otorga el gozo de poder alabarlo en este comienzo del día, reavivando con ello nuestra esperanza. Invoquémosle, pues, diciendo:\n\nPor el honor de tu nombre, escúchanos, Señor.\n\nDios y Padre de nuestro Salvador Jesucristo,\nte damos gracias porque, por mediación de tu Hijo, nos has dado el conocimiento y la inmortalidad.\n\nDanos, Señor, un corazón humilde\npara que vivamos sujetos unos a otros en el temor de Cristo.\n\nInfunde tu Espíritu en nosotros, tus siervos,\npara que nuestro amor fraterno sea sin fingimiento.\n\nTú que has dispuesto que el hombre dominara el mundo con su esfuerzo,\nhaz que nuestro trabajo te glorifique y santifique a nuestros hermanos.",
    "p2": "Ya que Dios nos muestra siempre su amor de Padre, velando amorosamente por nosotros, nos atrevemos a decir:"
  },
  "tos1lami": {
    "p1": "Demos gracias a Cristo y alabémoslo porque ha querido santificarnos y llamarnos hermanos suyos; digámosle, pues, confiados:\n\nSantifica, Señor, a tus hermanos.\n\nConcédenos, Señor, consagrar el principio de este día en honor de tu resurrección\ny haz que todos los trabajos que realicemos durante esta jornada te sean agradables.\n\nHaz que sepamos descubrirte a ti en todos nuestros hermanos,\nsobre todo en los tristes, en los más pobres y en los que son menos útiles a los ojos del mundo.\n\nTú que para aumentar nuestra alegría y afianzar nuestra salvación nos das el nuevo día, signo de tu amor,\nrenuévanos hoy y siempre para gloria de tu nombre.\n\nHaz que durante este día estemos en paz con todo el mundo\ny que a nadie devolvamos mal por mal.",
    "p2": "Tal como Cristo nos enseñó, terminemos nuestra oración diciendo:"
  },
  "tos2lami": {
    "p1": "Oremos a nuestro Señor Jesucristo, que prometió estar con nosotros todos los días hasta el fin del mundo, y digámosle confiados:\n\nEscúchanos, Señor.\n\nQuédate con nosotros, Señor, durante todo el día:\nque la luz de tu gracia no conozca nunca el anochecer en nuestras vidas.\n\nQue el trabajo de este día sea como una oblación sin defecto,\ny que sea agradable a tus ojos.\n\nQue en todas nuestras palabras y acciones seamos hoy luz del mundo\ny sal de la tierra para cuantos nos traten.\n\nQue la gracia del Espíritu Santo habite en nuestros corazones y resplandezca en nuestras obras\npara que así permanezcamos en tu amor y en tu alabanza.",
    "p2": "Terminemos nuestra oración diciendo juntos las palabras del Señor y pidiendo al Padre que nos libre de todo mal:"
  },
  "tos3lami": {
    "p1": "Invoquemos a Cristo, que se entregó a sí mismo por la Iglesia, y le da alimento y calor, diciendo:\n\nAcuérdate, Señor, de tu Iglesia.\n\nBendito seas, Señor, Pastor de la Iglesia, que nos vuelves a dar hoy la luz y la vida;\nhaz que sepamos agradecerte este magnífico don.\n\nMira con amor a tu grey, que has congregado en tu nombre;\nhaz que no se pierda ni uno solo de los que el Padre te ha dado.\n\nGuía a tu Iglesia por el camino de tus mandatos,\ny haz que el Espíritu Santo la conserve en la fidelidad.\n\nQue tus fieles, Señor, cobren nueva vida participando en la mesa de tu pan y de tu palabra,\npara que, con la fuerza de este alimento, te sigan con alegría.",
    "p2": "Concluyamos nuestra oración diciendo juntos las palabras de Jesús, nuestro Maestro:"
  },
  "tos4lami": {
    "p1": "Cristo, reflejo de la gloria del Padre, nos ilumina con su palabra; acudamos pues a él diciendo:\n\nRey de la gloria, escúchanos.\n\nTe bendecimos, Señor, autor y consumador de nuestra fe,\nporque de las tinieblas nos has trasladado a tu luz admirable.\n\nTú que abriste los ojos de los ciegos y diste oído a los sordos,\naumenta nuestra fe.\n\nHaz, Señor, que permanezcamos siempre en tu amor,\ny que este amor nos guarde fraternalmente unidos.\n\nAyúdanos para que resistamos a la tentación, aguantemos en la tribulación\ny te demos gracias en la prosperidad.",
    "p2": "Dejemos que el espíritu de Dios, que ha sido derramado en nuestros corazones, se una a nuestro espíritu, para clamar:"
  },
  "tos1laju": {
    "p1": "Demos gracias a Cristo que nos ha dado la luz del día y supliquémosle diciendo:\n\nBendícenos y santifícanos, Señor.\n\nTú que te entregaste como víctima por nuestros pecados,\nacepta los deseos y las acciones de este día.\n\nTú que nos alegras con la claridad del nuevo día,\nsé tú mismo el lucero brillante de nuestros corazones.\n\nHaz que seamos bondadosos y comprensivos con los que nos rodean\npara que logremos así ser imágenes de tu bondad.\n\nEn la mañana haznos escuchar tu gracia\ny que tu gozo sea hoy nuestra fortaleza.",
    "p2": "Fieles a la recomendación del salvador, digamos llenos de confianza filial:"
  },
  "tos2laju": {
    "p1": "Bendigamos a Dios, nuestro Padre, que mira siempre con amor a sus hijos y nunca desatiende sus súplicas, y digámosle con humildad:\n\nIlumínanos, Señor.\n\nTe damos gracias, Señor, porque nos has iluminado con la luz de Jesucristo;\nque esta claridad ilumine hoy todos nuestros actos.\n\nQue tu sabiduría nos dirija en nuestra jornada;\nasí andaremos por sendas de vida nueva.\n\nAyúdanos a superar con fortaleza las adversidades\ny haz que te sirvamos con generosidad de espíritu.\n\nDirige y santifica los pensamientos, palabras y obras de nuestro día\ny danos un espíritu dócil a tus inspiraciones.",
    "p2": "Dirijamos ahora, todos juntos, nuestra oración al Padre y digámosle:"
  },
  "tos3laju": {
    "p1": "Demos gracias al Señor, que guía y alimenta con amor a su pueblo, y digámosle:\n\nTe glorificamos por siempre, Señor.\n\nSeñor, rey del universo, te alabamos por el amor que nos tienes,\nporque de manera admirable nos creaste y más admirablemente aún nos redimiste.\n\nAl comenzar este nuevo día, pon en nuestros corazones el anhelo de servirte,\npara que te glorifiquemos en todos nuestros pensamientos y acciones.\n\nPurifica nuestros corazones de todo mal deseo,\ny haz que estemos siempre atentos a tu voluntad.\n\nDanos un corazón abierto a las necesidades de nuestros hermanos,\npara que a nadie falte la ayuda de nuestro amor.",
    "p2": "Acudamos ahora a nuestro Padre celestial, diciendo:"
  },
  "tos4laju": {
    "p1": "Invoquemos a Dios, de quien viene la salvación para su pueblo, diciendo:\n\nTú, que eres nuestra vida, escúchanos, Señor.\n\nBendito seas, Dios, Padre de nuestro Señor Jesucristo, porque en tu gran misericordia nos has hecho nacer de nuevo para una esperanza viva,\npor la resurrección de Jesucristo de entre los muertos.\n\nTú que, en Cristo, renovaste al hombre, creado a imagen tuya,\nhaz que reproduzcamos la imagen de tu Hijo.\n\nDerrama en nuestros corazones, lastimados por el odio y la envidia,\ntu Espíritu de amor.\n\nConcede hoy trabajo a quienes lo buscan, pan a los hambrientos, alegría a los tristes,\na todos la gracia y la salvación.",
    "p2": "Por Jesús hemos sido hechos hijos de Dios; por esto nos atrevemos a decir:"
  },
  "tos1lavi": {
    "p1": "Adoremos a Cristo, que salvó al mundo con su cruz, y supliquémosle diciendo:\n\nSeñor, ten misericordia de nosotros.\n\nSeñor Jesucristo, cuya claridad es nuestro sol y nuestro día,\nhaz que, desde el amanecer, desaparezca de nosotros todo sentimiento malo.\n\nVela, Señor, sobre nuestros pensamientos, palabras y obras,\na fin de que nuestro día sea agradable ante tus ojos.\n\nAparta de nuestros pecados tu vista,\ny borra en nosotros toda culpa.\n\nPor tu cruz y tu resurrección,\nllénanos del gozo del Espíritu Santo.",
    "p2": "Ya que somos hijos de Dios, oremos a nuestro Padre como Cristo nos enseñó:"
  },
  "tos2lavi": {
    "p1": "Adoremos a Cristo, que se ofreció a Dios como sacrificio sin mancha para purificar nuestras conciencias de las obras muertas, y digámosle con fe:\n\nEn tu voluntad, Señor, encontramos nuestra paz.\n\nTú que nos has dado la luz del nuevo día,\nconcédenos también caminar durante sus horas por sendas de vida nueva.\n\nTú que todo lo has creado con tu poder y con tu providencia lo conservas,\nayúdanos a descubrirte presente en todas tus creaturas.\n\nTú que has sellado con tu sangre una alianza nueva y eterna,\nhaz que, obedeciendo siempre tus mandatos, permanezcamos fieles a esa alianza.\n\nTú que colgado en la cruz quisiste que de tu costado manara sangre y agua,\npurifica con esta agua nuestros pecados y alegra con este manantial a la ciudad de Dios.",
    "p2": "Ya que Dios nos ha adoptado como hijos, oremos al Padre como nos enseñó Jesucristo:"
  },
  "tos3lavi": {
    "p1": "Invoquemos a Cristo, que nació, murió y resucitó por su pueblo, diciendo:\n\nSalva, Señor, al pueblo que redimiste con tu sangre.\n\nTe bendecimos, Señor, a ti que por nosotros aceptaste el suplicio de la cruz:\nmira con bondad a tu familia santa, redimida con tu sangre.\n\nTú que prometiste a los que en ti creyeran que manarían de su interior torrentes de agua viva,\nderrama tu Espíritu sobre todos los hombres.\n\nTú que enviaste a los discípulos a predicar el Evangelio,\nhaz que los cristianos anuncien tu palabra con fidelidad.\n\nA los enfermos y a todos los que has asociado a los sufrimientos de tu pasión,\nconcédeles fortaleza y paciencia.",
    "p2": "Llenos del Espíritu de Jesucristo, acudamos a nuestro Padre común, diciendo:"
  },
  "tos4lavi": {
    "p1": "Confiados en Dios, que cuida con solicitud de todos los que ha creado y redimido con la sangre de su Hijo, invoquémosle diciendo:\n\nEscucha, Señor, y ten piedad.\n\nDios misericordioso, asegura nuestros pasos en el camino de la verdadera santidad,\ny haz que busquemos siempre cuanto hay de verdadero, noble y justo.\n\nNo nos abandones para siempre, por amor de tu nombre\nno olvides tu alianza con nosotros.\n\nCon alma contrita y espíritu humillado te seamos aceptos,\nporque no hay confusión para los que en ti confían.\n\nTú que has querido que participáramos en la misión profética de Cristo,\nhaz que proclamemos ante el mundo tus maravillas.",
    "p2": "Dirijámonos al Padre, con las mismas palabras que Cristo nos enseñó:"
  },
  "tos1lasa": {
    "p1": "Bendigamos a Cristo que para ser ante Dios el pontífice misericordioso y fiel de los hombres se hizo en todo semejante a nosotros, y supliquémosle diciendo:\n\nMuéstranos, Señor, los tesoros de tu amor.\n\nSeñor, sol de justicia, que nos iluminaste en el bautismo,\nte consagramos este nuevo día.\n\nQue sepamos bendecirte en cada uno de los momentos de nuestra jornada\ny glorifiquemos tu nombre con cada una de nuestras acciones.\n\nTú que tuviste por madre a María, siempre dócil a tu palabra,\nencamina hoy nuestros pasos para que obremos también como ella según tu voluntad.\n\nHaz que mientras vivimos aún en este mundo que pasa anhelemos la vida eterna\ny por la fe, la esperanza y el amor vivamos ya contigo en tu reino.",
    "p2": "Con la misma confianza que tienen los hijos con su padre, acudamos nosotros a nuestro Dios, diciéndole:"
  },
  "tos2lasa": {
    "p1": "Celebremos la sabiduría y la bondad de Cristo, que ha querido ser amado y servido en los hermanos, especialmente en los que sufren, y supliquémosle insistentemente diciendo:\n\nSeñor, acrecienta nuestro amor.\n\nAl recordar esta mañana tu santa resurrección,\nte pedimos, Señor, que extiendas los beneficios de tu redención a todos los hombres.\n\nQue todo el día de hoy sepamos dar buen testimonio del nombre cristiano\ny ofrezcamos nuestra jornada como un culto espiritual agradable al Padre.\n\nEnséñanos, Señor, a descubrir tu imagen en todos los hombres\ny a saberte servir a ti en cada uno de ellos.\n\nCristo, Señor nuestro, vid verdadera de la que nosotros somos sarmientos,\nhaz que permanezcamos en ti y demos fruto abundante para que con ello sea glorificado nuestro Padre que está en el cielo.",
    "p2": "Con la confianza que nos da nuestra fe, acudamos ahora al Padre, diciendo como Cristo nos enseñó:"
  },
  "tos3lasa": {
    "p1": "Invoquemos a Dios por intercesión de María, a quien el Señor colocó por encima de todas las creaturas celestiales y terrenas, diciendo:\n\nContempla, Señor, a la Madre de tu Hijo y escúchanos.\n\nPadre de misericordia, te damos gracias porque nos has dado a María como madre y ejemplo;\nsantifícanos por su intercesión.\n\nTú que hiciste que María meditara tus palabras, guardándolas en su corazón, y fuera siempre fidelísima hija tuya,\npor su intercesión haz que también nosotros seamos de verdad hijos tuyos y discípulos de tu Hijo.\n\nTú que quisiste que María concibiera por obra del Espíritu Santo,\npor intercesión de María otórganos los frutos de este mismo Espíritu.\n\nTú que diste fuerza a María para permanecer junto a la cruz y la llenaste de alegría con la resurrección de tu Hijo,\npor intercesión de María confórtanos en la tribulación y reanima nuestra esperanza.",
    "p2": "Concluyamos nuestras súplicas con la oración que el mismo Cristo nos enseñó:"
  },
  "tos4lasa": {
    "p1": "Adoremos a Dios, que por su Hijo ha dado vida y esperanza al mundo, y supliquémosle diciendo:\n\nEscúchanos, Señor.\n\nSeñor, Padre de todos, tú que nos has hecho llegar al comienzo de este día,\nhaz que toda nuestra vida unida a la de Cristo sea alabanza de tu gloria.\n\nQue vivamos siempre arraigados en la fe, esperanza y caridad,\nque tú mismo has infundido en nuestras almas.\n\nHaz que nuestros ojos estén siempre levantados hacia ti,\npara que respondamos con presteza a tus llamadas.\n\nDefiéndenos de los engaños y seducciones del mal,\ny presérvanos de todo pecado.",
    "p2": "Contentos por sabernos hijos de Dios, digamos a nuestro padre:"
  }
};

export const MAPA_ORACIONES_SEED = {
  "tps1jsLaud": "Oh Dios, que has reunido a pueblos diversos en la confesión de tu nombre, concede a los que han renacido en la fuente bautismal una misma fe en su espíritu y una misma caridad en sus vidas. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tps1jsLaud_oracion": "Oh Dios, que has reunido a pueblos diversos en la confesión de tu nombre, concede a los que han renacido en la fuente bautismal una misma fe en su espíritu y una misma caridad en sus vidas. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "bautismoLA": "Dios todopoderoso y eterno, que proclamaste solemnemente a Cristo como tu Hijo amado, cuando era bautizado en el Jordán y descendía el Espíritu Santo sobre él, concede a tus hijos de adopción, renacidos del agua y del Espíritu Santo, que se conserven siempre dignos de tu complacencia. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "bautismoLA_oracion": "Dios todopoderoso y eterno, que proclamaste solemnemente a Cristo como tu Hijo amado, cuando era bautizado en el Jordán y descendía el Espíritu Santo sobre él, concede a tus hijos de adopción, renacidos del agua y del Espíritu Santo, que se conserven siempre dignos de tu complacencia. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tos2LAdo": "Dios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tos2LAdo_oracion": "Dios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tos3LAdo": "Dios todopoderoso y eterno, dirige nuestras acciones según tu voluntad, para que, invocando el nombre de tu Hijo, abundemos en buenas obras. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tos3LAdo_oracion": "Dios todopoderoso y eterno, dirige nuestras acciones según tu voluntad, para que, invocando el nombre de tu Hijo, abundemos en buenas obras. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tos4LAdo": "Concédenos, Señor, Dios nuestro, venerarte con toda el alma y amar a todos los hombres con afecto espiritual. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tos4LAdo_oracion": "Concédenos, Señor, Dios nuestro, venerarte con toda el alma y amar a todos los hombres con afecto espiritual. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tos5LAdo": "Señor, protege a tu pueblo con tu amor siempre fiel y, ya que sólo en ti hemos puesto nuestra esperanza, defiéndenos siempre con tu poder. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tos5LAdo_oracion": "Señor, protege a tu pueblo con tu amor siempre fiel y, ya que sólo en ti hemos puesto nuestra esperanza, defiéndenos siempre con tu poder. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén",
  "tos1lalu": "Tu gracia, Señor, inspire nuestras obras, las sostenga y acompañe; para que todo nuestro trabajo brote de ti, como de su fuente, y tienda a ti, como a su fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1lalu_oracion": "Tu gracia, Señor, inspire nuestras obras, las sostenga y acompañe; para que todo nuestro trabajo brote de ti, como de su fuente, y tienda a ti, como a su fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2lalu": "Señor, Dios todopoderoso, que nos has hecho llegar al comienzo de este día: danos tu ayuda para que no caigamos hoy en pecado, sino que nuestras palabras, pensamientos y acciones sigan el camino de tus mandatos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2lalu_oracion": "Señor, Dios todopoderoso, que nos has hecho llegar al comienzo de este día: danos tu ayuda para que no caigamos hoy en pecado, sino que nuestras palabras, pensamientos y acciones sigan el camino de tus mandatos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3lalu": "Señor Dios, rey de cielos y tierra, dirige y santifica en este día nuestros cuerpos y nuestros corazones, nuestros sentidos, palabras y acciones, según tu ley y tus mandatos; para que, con tu auxilio, podamos ofrecerte hoy en todas nuestras actividades un sacrificio de alabanza grato a tus ojos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3lalu_oracion": "Señor Dios, rey de cielos y tierra, dirige y santifica en este día nuestros cuerpos y nuestros corazones, nuestros sentidos, palabras y acciones, según tu ley y tus mandatos; para que, con tu auxilio, podamos ofrecerte hoy en todas nuestras actividades un sacrificio de alabanza grato a tus ojos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1lama": "Escucha, Señor, nuestra oración matutina y con la luz de tu misericordia alumbra la oscuridad de nuestro corazón: para que, habiendo sido iluminados por tu claridad, no andemos nunca tras las obras de las tinieblas. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1lama_oracion": "Escucha, Señor, nuestra oración matutina y con la luz de tu misericordia alumbra la oscuridad de nuestro corazón: para que, habiendo sido iluminados por tu claridad, no andemos nunca tras las obras de las tinieblas. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2lama": "Señor Jesucristo, luz verdadera que alumbras a todo hombre y le muestras el camino de la salvación: concédenos la abundancia de tu gracia para que preparemos, delante de ti, sendas de justicia y de paz. Tú que vives y reinas con el Padre, en la unidad del Espíritu Santo y eres Dios, por los siglos de los siglos. Amén.",
  "tos2lama_oracion": "Señor Jesucristo, luz verdadera que alumbras a todo hombre y le muestras el camino de la salvación: concédenos la abundancia de tu gracia para que preparemos, delante de ti, sendas de justicia y de paz. Tú que vives y reinas con el Padre, en la unidad del Espíritu Santo y eres Dios, por los siglos de los siglos. Amén.",
  "tos3lama": "Dios todopoderoso, de quien dimana la bondad y hermosura de todo lo creado; haz que comencemos este día con ánimo alegre, y que realicemos nuestras obras movidos por el amor a ti y a los hermanos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3lama_oracion": "Dios todopoderoso, de quien dimana la bondad y hermosura de todo lo creado; haz que comencemos este día con ánimo alegre, y que realicemos nuestras obras movidos por el amor a ti y a los hermanos. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4lama": "Aumenta, Señor, nuestra fe, para que esta alabanza que brota de nuestro corazón vaya siempre acompañada de frutos de vida eterna. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4lama_oracion": "Aumenta, Señor, nuestra fe, para que esta alabanza que brota de nuestro corazón vaya siempre acompañada de frutos de vida eterna. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1lami": "Señor Dios, salvador nuestro, danos tu ayuda para que siempre deseemos las obras de la luz y realicemos la verdad: así, los que de ti hemos nacido en el bautismo, seremos tus testigos ante los hombres. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1lami_oracion": "Señor Dios, salvador nuestro, danos tu ayuda para que siempre deseemos las obras de la luz y realicemos la verdad: así, los que de ti hemos nacido en el bautismo, seremos tus testigos ante los hombres. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2lami": "Envía, Señor, a nuestros corazones la abundancia de tu luz, para que, avanzando siempre por el camino de tus mandatos, nos veamos libres de todo error. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2lami_oracion": "Envía, Señor, a nuestros corazones la abundancia de tu luz, para que, avanzando siempre por el camino de tus mandatos, nos veamos libres de todo error. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3lami": "Señor Dios, que nos has creado con tu sabiduría y nos gobiernas con tu providencia, infunde en nuestras almas la claridad de tu luz, y haz que nuestra vida y nuestras acciones estén del todo consagradas a ti. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3lami_oracion": "Señor Dios, que nos has creado con tu sabiduría y nos gobiernas con tu providencia, infunde en nuestras almas la claridad de tu luz, y haz que nuestra vida y nuestras acciones estén del todo consagradas a ti. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4lami": "Recuerda, Señor, tu santa alianza consagrada con el nuevo sacramento de la sangre del Cordero, para que tu pueblo obtenga el perdón de sus pecados, y un aumento constante de salvación. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4lami_oracion": "Recuerda, Señor, tu santa alianza consagrada con el nuevo sacramento de la sangre del Cordero, para que tu pueblo obtenga el perdón de sus pecados, y un aumento constante de salvación. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1laju": "Dios todopoderoso y eterno, humildemente acudimos a ti, al empezar el día, a media jornada y al atardecer, para pedirte que, alejando de nosotros las tinieblas del pecado, nos hagas alcanzar la luz verdadera que es Cristo. Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1laju_oracion": "Dios todopoderoso y eterno, humildemente acudimos a ti, al empezar el día, a media jornada y al atardecer, para pedirte que, alejando de nosotros las tinieblas del pecado, nos hagas alcanzar la luz verdadera que es Cristo. Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2laju": "A ti, Señor, que eres la luz verdadera y la fuente misma de toda luz, te pedimos humildemente que meditando fielmente tu palabra vivamos siempre en la claridad de tu luz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2laju_oracion": "A ti, Señor, que eres la luz verdadera y la fuente misma de toda luz, te pedimos humildemente que meditando fielmente tu palabra vivamos siempre en la claridad de tu luz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3laju": "Dios todopoderoso y eterno: a los pueblos que viven en tiniebla y en sombra de muerte, ilumínalos con tu luz, ya que con ella nos ha visitado el sol que nace de lo alto, Jesucristo, nuestro Señor. Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3laju_oracion": "Dios todopoderoso y eterno: a los pueblos que viven en tiniebla y en sombra de muerte, ilumínalos con tu luz, ya que con ella nos ha visitado el sol que nace de lo alto, Jesucristo, nuestro Señor. Él, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4laju": "Concédenos, Señor, acoger siempre el anuncio de la salvación para que, libres de temor, arrancados de la mano de los enemigos te sirvamos, con santidad y justicia, todos nuestros días. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4laju_oracion": "Concédenos, Señor, acoger siempre el anuncio de la salvación para que, libres de temor, arrancados de la mano de los enemigos te sirvamos, con santidad y justicia, todos nuestros días. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1lavi": "Dios misericordioso, que has iluminado las tinieblas de nuestra ignorancia con la luz de tu palabra: acrecienta en nosotros la fe que tú mismo nos has dado; que ninguna tentación pueda nunca destruir el ardor de la fe y de la caridad que tu gracia ha encendido en nuestro Espíritu. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1lavi_oracion": "Dios misericordioso, que has iluminado las tinieblas de nuestra ignorancia con la luz de tu palabra: acrecienta en nosotros la fe que tú mismo nos has dado; que ninguna tentación pueda nunca destruir el ardor de la fe y de la caridad que tu gracia ha encendido en nuestro Espíritu. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2lavi": "Señor, Dios todopoderoso, te pedimos nos concedas que del mismo modo que hemos cantado tus alabanzas en esta celebración matutina así también las podamos cantar plenamente en la asamblea de tus santos por toda la eternidad. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2lavi_oracion": "Señor, Dios todopoderoso, te pedimos nos concedas que del mismo modo que hemos cantado tus alabanzas en esta celebración matutina así también las podamos cantar plenamente en la asamblea de tus santos por toda la eternidad. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3lavi": "Ilumina, Señor, nuestros corazones y fortalece nuestras voluntades, para que sigamos siempre el camino de tus mandatos, reconociéndote como nuestro guía y maestro. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3lavi_oracion": "Ilumina, Señor, nuestros corazones y fortalece nuestras voluntades, para que sigamos siempre el camino de tus mandatos, reconociéndote como nuestro guía y maestro. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4lavi": "Te pedimos, Señor, tu gracia abundante, para que nos ayude a seguir el camino de tus mandatos, y así gocemos de tu consuelo en esta vida y alcancemos la felicidad eterna. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4lavi_oracion": "Te pedimos, Señor, tu gracia abundante, para que nos ayude a seguir el camino de tus mandatos, y así gocemos de tu consuelo en esta vida y alcancemos la felicidad eterna. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1lasa": "Te pedimos, Señor, que la claridad de la resurrección de tu Hijo ilumine las dificultades de nuestra vida; que no temamos ante la oscuridad de la muerte y podamos llegar un día a la luz que no tiene fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos1lasa_oracion": "Te pedimos, Señor, que la claridad de la resurrección de tu Hijo ilumine las dificultades de nuestra vida; que no temamos ante la oscuridad de la muerte y podamos llegar un día a la luz que no tiene fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2lasa": "Que nuestra voz, Señor, nuestro espíritu y toda nuestra vida sean una continua alabanza en tu honor, y ya que toda nuestra existencia es un don gratuito de tu liberalidad, haz que también cada una de nuestras acciones te esté plenamente dedicada. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos2lasa_oracion": "Que nuestra voz, Señor, nuestro espíritu y toda nuestra vida sean una continua alabanza en tu honor, y ya que toda nuestra existencia es un don gratuito de tu liberalidad, haz que también cada una de nuestras acciones te esté plenamente dedicada. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3lasa": "Dios misericordioso, fuente y origen de nuestra salvación, haz que, mientras dure nuestra vida aquí en la tierra, te alabemos constantemente y podamos así participar un día en la alabanza eterna del cielo. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos3lasa_oracion": "Dios misericordioso, fuente y origen de nuestra salvación, haz que, mientras dure nuestra vida aquí en la tierra, te alabemos constantemente y podamos así participar un día en la alabanza eterna del cielo. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4lasa": "Dios todopoderoso y eterno, luz esplendente y día sin ocaso, al volver a comenzar un nuevo día te pedimos que nos visites con el esplendor de tu luz y disipes así las tinieblas de nuestros pecados. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.",
  "tos4lasa_oracion": "Dios todopoderoso y eterno, luz esplendente y día sin ocaso, al volver a comenzar un nuevo día te pedimos que nos visites con el esplendor de tu luz y disipes así las tinieblas de nuestros pecados. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén."
};

/**
 * Obtener todas las antífonas de cántico evangélico (con soporte para cache local)
 */
export function obtenerTodasLasAntifonasCantico() {
    let list = [];
    const cacheLocal = typeof localStorage !== 'undefined' ? localStorage.getItem('lh_antifonas_cantico_cache') : null;
    if (cacheLocal) {
        try {
            list = JSON.parse(cacheLocal);
        } catch (e) {}
    }
    if (!Array.isArray(list) || list.length === 0) {
        list = [...CATALOGO_ANTIFONAS_CANTICO_SEED];
    }
    return list;
}

/**
 * Obtener recomendación de antífona evangélica para tiempo, semana, día y hora
 */
export function obtenerAntifonaCanticoRecomendada(tiempo, semana, dia, libro = 'laudes', ciclo = 'A') {
    const list = obtenerTodasLasAntifonasCantico();
    const semNum = parseInt(String(semana).replace(/[^0-9]/g, ''), 10) || 1;
    const semCiclo = ((semNum - 1) % 4) + 1;

    // 1. Caso especial Domingo
    if (dia === 'domingo') {
        if (tiempo === 'navidad' || (tiempo === 'ordinario' && semNum === 1)) {
            const m = list.find(a => a.varName === 'bautismo_cE' || a.id.includes('bautismo'));
            if (m) return m;
        }
        let matchDom = list.find(a => 
            a.tiempo === tiempo && 
            a.dia === 'domingo' && 
            Number(a.semana) === semNum && 
            (!a.ciclo || a.ciclo === ciclo)
        );
        if (matchDom) return matchDom;

        matchDom = list.find(a => 
            a.tiempo === tiempo && 
            a.dia === 'domingo' && 
            Number(a.semana) === semCiclo
        );
        if (matchDom) return matchDom;
    }

    // 2. Días de semana (Lunes a Sábado) en Tiempo Ordinario
    if (tiempo === 'ordinario' && dia !== 'domingo') {
        const diaPrefijo = (dia || 'lunes').slice(0, 2); // lu, ma, mi, ju, vi, sa
        const keyExacta = ('tos' + semNum + 'la' + diaPrefijo + '_cE').toLowerCase();
        const keyCiclo = ('tos' + semCiclo + 'la' + diaPrefijo + '_cE').toLowerCase();

        let mDia = list.find(a => (a.varName || a.id).toLowerCase() === keyExacta);
        if (!mDia) mDia = list.find(a => (a.varName || a.id).toLowerCase() === keyCiclo);
        if (mDia) return mDia;
    }

    // 3. Otros tiempos litúrgicos por tiempo, día, semana
    let matchOtro = list.find(a => 
        a.tiempo === tiempo && 
        a.dia === dia && 
        (Number(a.semana) === semNum || Number(a.semana) === semCiclo)
    );
    if (matchOtro) return matchOtro;

    matchOtro = list.find(a => a.tiempo === tiempo && a.dia === dia);
    if (matchOtro) return matchOtro;

    // Fallback canónico Lunes Semana 1 Ordinario: Bendito sea el Señor, Dios nuestro.
    return {
        id: 'tos1lalu_cE',
        varName: 'tos1lalu_cE',
        texto: 'Bendito sea el Señor, Dios nuestro.'
    };
}

/**
 * Obtener preces estructuradas según tiempo, semana, día y hora
 */
export function obtenerPrecesRecomendadas(tiempo, semana, dia, libro = 'laudes') {
    const semNum = parseInt(String(semana).replace(/[^0-9]/g, ''), 10) || 1;
    const semCiclo = ((semNum - 1) % 4) + 1;
    const diaPrefijo = (dia || 'lunes').slice(0, 2);

    const clavesBuscar = [
        'tos' + semNum + 'la' + diaPrefijo,
        'tos' + semCiclo + 'la' + diaPrefijo,
        'tos' + semNum + 'LA' + diaPrefijo,
        'tos' + semCiclo + 'LA' + diaPrefijo,
        dia === 'domingo' && semNum === 1 ? 'bautismoLA' : null,
        dia === 'domingo' ? 'tos' + semNum + 'LAdo' : null,
        dia === 'domingo' ? 'tos' + semCiclo + 'LAdo' : null,
        tiempo.slice(0, 2) + 's' + semNum + 'la' + diaPrefijo,
        tiempo.slice(0, 2) + 's' + semCiclo + 'la' + diaPrefijo
    ].filter(Boolean);

    for (const k of clavesBuscar) {
        if (MAPA_PRECES_SEED[k]) {
            return {
                texto: MAPA_PRECES_SEED[k].p1,
                concl: MAPA_PRECES_SEED[k].p2
            };
        }
    }

    // Default canónico Lunes Semana 1 Ordinario
    return {
        texto: `Proclamemos la grandeza de Cristo, lleno de gracia y del Espíritu Santo, y acudamos a él diciendo:

Concédenos, Señor, tu Espíritu.

Concédenos, Señor, un día lleno de paz, de alegría y de inocencia para que, al llegar a la noche, podamos alabarte con gozo y limpios de pecado.

Que baje hoy a nosotros tu bondad
y haga prósperas las obras de nuestras manos.

Muéstranos tu rostro propicio y danos tu paz
para que durante todo el día sintamos cómo tu mano nos protege.

Mira con bondad a cuantos se han encomendado a nuestras oraciones y enriquécelos con toda clase de bienes.`,
        concl: 'Terminemos nuestra oración con la plegaria que Cristo nos enseñó:'
    };
}

/**
 * Obtener oración conclusiva según tiempo, semana, día y hora
 */
export function obtenerOracionRecomendada(tiempo, semana, dia, libro = 'laudes') {
    const semNum = parseInt(String(semana).replace(/[^0-9]/g, ''), 10) || 1;
    const semCiclo = ((semNum - 1) % 4) + 1;
    const diaPrefijo = (dia || 'lunes').slice(0, 2);

    const clavesBuscar = [
        'tos' + semNum + 'la' + diaPrefijo,
        'tos' + semCiclo + 'la' + diaPrefijo,
        'tos' + semNum + 'LA' + diaPrefijo,
        'tos' + semCiclo + 'LA' + diaPrefijo,
        dia === 'domingo' && semNum === 1 ? 'bautismoLA' : null,
        dia === 'domingo' ? 'tos' + semNum + 'LAdo' : null,
        dia === 'domingo' ? 'tos' + semCiclo + 'LAdo' : null
    ].filter(Boolean);

    for (const k of clavesBuscar) {
        if (MAPA_ORACIONES_SEED[k]) {
            return MAPA_ORACIONES_SEED[k];
        }
        if (MAPA_ORACIONES_SEED[k + '_oracion']) {
            return MAPA_ORACIONES_SEED[k + '_oracion'];
        }
    }

    return "Tu gracia, Señor, inspire nuestras obras, las sostenga y acompañe; para que todo nuestro trabajo brote de ti, como de su fuente, y tienda a ti, como a su fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.";
}
