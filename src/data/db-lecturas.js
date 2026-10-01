/**
 * db-lecturas.js
 * Repositorio de Lecturas del Oficio de Lectura (1ª Lectura Bíblica Año Par/Impar y 2ª Lectura Patrística)
 * Incluye responsorios estructurados con asterisco (*) de repetición.
 */

export const CATALOGO_LECTURAS_SEED = [
    // =========================================================================
    // DOMINGO - TIEMPO ORDINARIO SEMANA 1 / BAUTISMO DEL SEÑOR
    // =========================================================================
    {
        id: "tos1OFdo_lec1_par",
        varName: "tos1OFdo_lec1_par",
        tipo: "lectura1_par",
        tiempo: "ordinario",
        semana: "1",
        dia: "domingo",
        libro: "oficio",
        titulo: "1ª Lectura - Domingo Semana 1 (Año Par)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del libro del profeta Isaías 42, 1-9; 49, 1-9",
        descripcion: "EL SIERVO HUMILDE DEL SEÑOR ES LA LUZ DE LAS NACIONES",
        texto: `Mirad a mi siervo, a quien sostengo; mi elegido, a quien prefiero. Sobre él he puesto mi espíritu, para que traiga el derecho a las naciones.

No gritará, no clamará, no voceará por las calles. La caña cascada no la quebrará, el pabilo vacilante no lo apagará. Promoverá fielmente el derecho, no vacilará ni se quebrará, hasta implantar el derecho en la tierra, y sus leyes que esperan las islas.

Así dice el Señor Dios, creador del cielo y sus extensiones, el que extendió la tierra con sus brotes, el que da el aliento al pueblo que la habita y el espíritu a los que caminan por ella:

«Yo, el Señor, te he llamado con justicia, te he tomado de la mano, te he formado, y te he hecho alianza de un pueblo, luz de las naciones, para que abras los ojos de los ciegos, saques a los cautivos de la prisión, y de la mazmorra a los que habitan en tinieblas.

Yo soy el Señor, éste es mi nombre; no cederé mi gloria a nadie ni mi alabanza a los ídolos. Lo primero ya se ha cumplido, y ahora anuncio cosas nuevas; antes de que sucedan os las hago saber.»

Escuchadme, islas; atended, pueblos lejanos: El Señor me llamó desde el seno materno, desde las entrañas de mi madre pronunció mi nombre. Hizo de mi boca una espada afilada, me escondió en la sombra de su mano; me hizo flecha bruñida, me guardó en su aljaba y me dijo: «Tú eres mi siervo, Israel, de quien estoy orgulloso.»

Poco es que seas mi siervo para restablecer las tribus de Jacob y traer a los supervivientes de Israel; te hago luz de las naciones, para que mi salvación alcance hasta el confín de la tierra. Así dice el Señor: En tiempo favorable te escuché, en día de salvación te ayudé; te he formado y destinado a ser alianza del pueblo, para restaurar la tierra y repartir las heredades devastadas; para decir a los cautivos: «Salid»; a los que están en tinieblas: «Venid a la luz.»`,
        respCita: "Cf. Mt 3, 16. 17; Lc 3, 22",
        respR1: "Hoy se abrieron los cielos cuando fue bautizado el Señor en el Jordán, y descendió la voz del Padre, diciendo: * «Éste es mi Hijo amado, en quien tengo mis complacencias.»",
        respV: "El Espíritu Santo descendió sobre él en forma visible de paloma, y resonó una voz del cielo:",
        respR2: "«Éste es mi Hijo amado, en quien tengo mis complacencias.»",
        audioUrl: ""
    },
    {
        id: "tos1OFdo_lec1_impar",
        varName: "tos1OFdo_lec1_impar",
        tipo: "lectura1_impar",
        tiempo: "ordinario",
        semana: "1",
        dia: "domingo",
        libro: "oficio",
        titulo: "1ª Lectura - Domingo Semana 1 (Año Impar)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del libro del profeta Isaías 40, 1-11",
        descripcion: "CONSOLAD, CONSOLAD A MI PUEBLO",
        texto: `«Consolad, consolad a mi pueblo —dice vuestro Dios—; hablad al corazón de Jerusalén, gritadle que se ha cumplido su servicio, que está pagado su crimen, pues de la mano del Señor ha recibido doble castigo por todos sus pecados.»

Una voz grita: «En el desierto preparadle un camino al Señor; allanad en la estepa una calzada para nuestro Dios; que los valles se levanten, que montes y colinas se abajen, que lo torcido se enderece y lo escabroso se iguale. Se revelará la gloria del Señor, y la verán todos los hombres juntos —ha hablado la boca del Señor—.»

Dice una voz: «Grita.» Respondo: «¿Qué debo gritar?» «Toda carne es hierba y su belleza como flor campestre: se seca la hierba, se marchita la flor, cuando el aliento del Señor sopla sobre ellos; verdaderamente el pueblo es hierba. Se seca la hierba, se marchita la flor, pero la palabra de nuestro Dios permanece para siempre.»

Súbete a un monte elevado, heraldo de Sión; alza con fuerza la voz, heraldo de Jerusalén; álzala, no temas; di a las ciudades de Judá: «Aquí está vuestro Dios.» Mirad, el Señor Dios llega con poder y su brazo manda. Mirad, viene con él su salario y su recompensa lo precede. Como un pastor que apacienta el rebaño, reúne con su brazo los corderos y los lleva sobre el pecho; cuida él mismo a las ovejas que crían.`,
        respCita: "Cf. Is 40, 3. 5; Lc 3, 4. 6",
        respR1: "Una voz grita en el desierto: Preparad el camino del Señor, allanad sus senderos; * Y verán todos la salvación de Dios.",
        respV: "Todo valle sea alzado, y bájese todo monte y collado; y lo torcido se haga derecho:",
        respR2: "Y verán todos la salvación de Dios.",
        audioUrl: ""
    },
    {
        id: "tos1OFdo_lec2",
        varName: "tos1OFdo_lec2",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "1",
        dia: "domingo",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Domingo Semana 1",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De los Sermones de san Máximo de Turín, obispo\n(Sermo 100, De Epiphania, 1. 3: CCL 23, 398-400)",
        descripcion: "CRISTO ES BAUTIZADO PARA SANTIFICAR LAS AGUAS",
        texto: `Nos enseña el relato evangélico que el Señor fue al Jordán para ser bautizado y que quiso recibir en aquel río el bautismo celestial. Consideremos, pues, la razón de este hecho.

El que es santo no necesita ciertamente ser purificado por las aguas; antes bien, al ser purificadas las aguas por él, todos los que son bautizados en ellas quedan limpios. La novedad de esta purificación es tal que no son las aguas las que lavan a Cristo, sino que es Cristo quien santifica las aguas.

El Salvador, pues, fue bautizado no para purificarse él mismo, sino para purificar las aguas, a fin de que las aguas, tocadas por el cuerpo de Cristo que no conoció el pecado, tuvieran la virtud de lavar y regenerar a todos los creyentes. Por tanto, el que desciende a la corriente del Jordán no recibe nada para sí, sino que consagra el agua para nosotros.

Cuando Cristo es sumergido, desciende el Espíritu Santo en figura de paloma, y la voz del Padre declara: «Éste es mi Hijo amado, en quien tengo mis complacencias.» De esta manera, en el bautismo de Cristo se manifiesta la Santa Trinidad, para que comprendamos que en nuestro bautismo la obra de la salvación es llevada a término por el Padre, el Hijo y el Espíritu Santo.`,
        respCita: "Cf. Sal 28, 3. 4; Lc 3, 22",
        respR1: "La voz del Señor sobre las aguas, el Dios de la gloria hace oír su trueno: * La voz del Señor es potente, la voz del Señor es magnífica.",
        respV: "Y se oyó una voz que venía del cielo: «Tú eres mi Hijo amado, en ti me complazco.»",
        respR2: "La voz del Señor es potente, la voz del Señor es magnífica.",
        audioUrl: ""
    },
    {
        id: "tos1OFdo_lec2_nacianzo",
        varName: "tos1OFdo_lec2_nacianzo",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "1",
        dia: "domingo",
        celebracion: "elbautismodelSeñor",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - San Gregorio de Nacianzo (El Bautismo del Señor / Domingo 1 T.O.)",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De las Disertaciones de san Gregorio de Nacianzo, obispo\n(Disertación 39, En las santas Luminarias, 14-16. 20: PG 36, 350-351. 354. 358-359)",
        descripcion: "EL BAUTISMO DE CRISTO",
        texto: `Cristo es hoy iluminado, dejemos que esta luz divina nos penetre también a nosotros; Cristo es bautizado, bajemos con él al agua, para luego subir también con él.

Juan está bautizando, y Jesús acude a él; posiblemente para santificar al mismo que lo bautiza; con toda seguridad para sepultar en el agua a todo el viejo Adán; antes de nosotros y por nosotros, el que era espíritu y carne santifica el Jordán, para así iniciarnos por el Espíritu y el agua en los sagrados misterios.

El Bautista se resiste, Jesús insiste. «Soy yo quien debo ser bautizado por ti», le dice la lámpara al Sol, la voz a la Palabra, el amigo al Esposo, el más grande entre los nacidos de mujer al Primogénito de toda creatura, el que había saltado de gozo ya en el seno materno al que había sido adorado también en el seno de su madre, el que lo había precedido y lo precederá al que se había manifestado y se manifestará. «Soy yo quien debo ser bautizado por ti»; podía haber añadido: «Y por causa de ti.» Él, en efecto, sabía con certeza que recibiría más tarde el bautismo del martirio y que, como a Pedro, le serían lavados no sólo los pies, sino todo su cuerpo.

Pero, además, Jesús sube del agua; lo cual nos recuerda que hizo subir al mundo con él hacia lo alto, porque en aquel momento ve también cómo el cielo se rasga y se abre, aquel cielo que Adán había cerrado para sí y para su posteridad, como había hecho que se le cerrase la entrada al paraíso con una espada de fuego.

El Espíritu atestigua la divinidad de Cristo, acudiendo a él como a su igual; y una voz bajó del cielo, ya que del cielo procedía aquel de quien testificaba esta voz; y el Espíritu se apareció en forma corporal de una paloma, para honrar así el cuerpo de Cristo, que es también divino por su excepcional unión con Dios. Muchos siglos atrás fue asimismo una paloma la que anunció el fin del diluvio.

Honremos hoy, pues, el bautismo de Cristo y celebremos como es debido esta festividad.

Procurad una limpieza de espíritu siempre en aumento. Nada agrada tanto a Dios como la conversión y salvación del hombre, ya que para él tienen lugar todas estas palabras y misterios; sed como lumbreras en medio del mundo, como una fuerza vital para los demás hombres; si así lo hacéis, llegaréis a ser luces perfectas en la presencia de aquella gran luz, impregnados de sus resplandores celestiales, iluminados de un modo más claro y puro por la Trinidad, de la cual habéis recibido ahora, con menos plenitud, un único rayo proveniente de la única Divinidad, en Cristo Jesús, nuestro Señor, a quien sea la gloria y el poder por los siglos de los siglos. Amén.`,
        respCita: "",
        respR1: "Hoy se han abierto los cielos y el mar se dulcificó, la tierra canta de alegría y los montes y colinas se llenan de júbilo: * porque Cristo fue bautizado por Juan en el Jordán.",
        respV: "¿Qué te pasa, mar, por qué huyes? Y tú, Jordán, ¿por qué te echas atrás?",
        respR2: "Porque Cristo fue bautizado por Juan en el Jordán.",
        audioUrl: "/solemnidades/BautismodelSenor/lecturas.mp3"
    },

    // =========================================================================
    // LUNES - TIEMPO ORDINARIO SEMANA 1
    // =========================================================================
    {
        id: "tos1OFlu_lec1_par",
        varName: "tos1OFlu_lec1_par",
        tipo: "lectura1_par",
        tiempo: "ordinario",
        semana: "1",
        dia: "lunes",
        libro: "oficio",
        titulo: "1ª Lectura - Lunes Semana 1 (Año Par)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del primer libro de Samuel 1, 1-28",
        descripcion: "NACIMIENTO Y CONSAGRACIÓN DE SAMUEL",
        texto: `Había un hombre de Ramataim, un zufita de la montaña de Efraín, llamado Elcaná. Tenía dos mujeres: una se llamaba Ana y la otra Peniná. Peniná tenía hijos, pero Ana no los tenía.

Aquel hombre solía subir todos los años desde su ciudad a Siló para adorar y ofrecer sacrificios al Señor del universo... Ana lloraba y no comía. Su marido Elcaná le dijo: «Ana, ¿por qué lloras y no comes? ¿Por qué se aflige tu corazón? ¿No te valgo yo más que diez hijos?»

Ana se levantó después de haber comido y bebido en Siló. El sacerdote Elí estaba sentado en su silla junto a la jamba de la puerta del santuario del Señor. Ella, llena de amargura, oró al Señor y lloró desconsoladamente. E hizo un voto diciendo: «Señor del universo, si te dignas mirar la aflicción de tu sierva y te acuerdas de mí, y das a tu sierva un hijo varón, yo lo entregaré al Señor por todos los días de su vida...»

El Señor se acordó de ella. Concibió Ana y dio a luz un hijo, y le puso por nombre Samuel, diciendo: «Se lo he pedido al Señor.»`,
        respCita: "1Sam 2, 1. 2",
        respR1: "Mi corazón se regocija en el Señor, mi poder se exalta por mi Dios; * No hay santo como el Señor, porque no hay nadie fuera de ti.",
        respV: "Mi boca se dilató contra mis enemigos, porque me alegré en tu salvación.",
        respR2: "No hay santo como el Señor, porque no hay nadie fuera de ti.",
        audioUrl: ""
    },
    {
        id: "tos1OFlu_lec2",
        varName: "tos1OFlu_lec2",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "1",
        dia: "lunes",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Lunes Semana 1",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De la Carta de san Clemente primero, papa, a los Corintios\n(Caps. 1-2: Funk 1, 61-65)",
        descripcion: "LA IGLESIA DE DIOS EN ROMA A LA IGLESIA DE DIOS EN CORINTO",
        texto: `La Iglesia de Dios que peregrina en Roma a la Iglesia de Dios que peregrina en Corinto, a los llamados y santificados por la voluntad de Dios en nuestro Señor Jesucristo: Que la gracia y la paz se multipliquen en vosotros de parte de Dios todopoderoso por medio de Jesucristo.

A causa de las inesperadas y sucesivas calamidades y tribulaciones que nos han sobrevenido, creemos habernos retrasado algo en prestar atención a las cosas que entre vosotros se debaten, carísimos, y a aquella sedición detestable e impía, extraña y ajena a los elegidos de Dios, que unas pocas personas temerarias y presuntuosas han encendido hasta tal punto de insensatez que vuestro venerable nombre, celebrado y amado por todos los hombres, ha sufrido grave descrédito.

¿Quién, en efecto, residió entre vosotros que no experimentara la firmeza y excelencia de vuestra fe? ¿Quién no admiró vuestra prudente y mesurada piedad en Cristo? Todos, en efecto, procedíais sin acepción de personas y caminabais en las leyes de Dios, sumisos a vuestros guías y tributando el debido honor a vuestros ancianos.`,
        respCita: "Ef 4, 1-3",
        respR1: "Os ruego que andéis como es digno de la vocación con que fuisteis llamados, * Con toda humildad y mansedumbre, soportándoos con paciencia los unos a los otros en amor.",
        respV: "Solícitos en guardar la unidad del Espíritu en el vínculo de la paz.",
        respR2: "Con toda humildad y mansedumbre, soportándoos con paciencia los unos a los otros en amor.",
        audioUrl: ""
    },

    // =========================================================================
    // OCTAVA DE PASCUA - JUEVES
    // =========================================================================
    {
        id: "tps1OFjs_lec1",
        varName: "tps1OFjs_lec1",
        tipo: "lectura1_par",
        tiempo: "pascua",
        semana: "1",
        dia: "jueves",
        libro: "oficio",
        titulo: "1ª Lectura - Octava de Pascua Jueves",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "De los Hechos de los apóstoles 2, 42-3, 11",
        descripcion: "LA PRIMERA COMUNIDAD. CURACIÓN DE UN HOMBRE TULLIDO",
        texto: `En aquellos días, los hermanos eran constantes en escuchar la enseñanza de los apóstoles, en la vida común, en la fracción del pan y en las oraciones. Todo el mundo estaba impresionado por los muchos prodigios y signos que los apóstoles hacían en Jerusalén. Los creyentes vivían todos unidos, y lo tenían todo en común; vendían posesiones y bienes, y lo repartían entre todos según la necesidad de cada uno. Cada día, llevados de un mismo afecto, se reunían en el templo; y, partiendo el pan en casa, tomaban juntos el alimento con alegría y sencillez de corazón; alababan a Dios y gozaban de la simpatía general del pueblo. Día tras día iba el Señor incorporando a la comunidad a los que se iban a salvar.

A la hora de la oración de la tarde, a eso de las tres, subían Pedro y Juan al templo. Había allí un hombre, tullido de nacimiento, a quien todos los días llevaban y colocaban a la puerta llamada Hermosa, para que pidiese limosna a los que entraban en el templo. Este hombre, cuando vio a Pedro y Juan que estaban para entrar, les pidió limosna. Pedro y Juan, mirándolo fijamente, le dijeron:

«Míranos.»

Él estaba atento con la esperanza de recibir alguna cosa. Díjole entonces Pedro:

«No tengo oro ni plata; pero lo que tengo te lo doy: en nombre de Jesucristo, el Nazareno, camina.»

Y, asiéndolo de la mano derecha, lo levantó. Al punto cobraron vigor sus pies y tobillos; de un salto se puso en pie y echó a andar, entrando con ellos en el templo por su propio pie; y saltaba y daba gracias a Dios. Toda la gente, que lo vio andar alabando a Dios, cayó en la cuenta de que era el mismo que se sentaba a pedir limosna en la puerta Hermosa del templo; y quedaron llenos de estupor y admiración ante lo ocurrido. Como él no se apartaba un momento de Pedro y de Juan, toda la gente, que no salía de su asombro, corrió al pórtico llamado de Salomón, donde ellos se encontraban.`,
        respCita: "Cf. Hch 3, 7-8a; Is 35, 4b. 6a",
        respR1: "Pedro, asiendo de la mano derecha al tullido, lo levantó; al punto cobraron vigor sus pies y tobillos; * De un salto se puso en pie y echó a andar. Aleluya.",
        respV: "Dios viene en persona y os salvará; entonces saltará como un ciervo el cojo.",
        respR2: "De un salto se puso en pie y echó a andar. Aleluya.",
        audioUrl: ""
    },
    {
        id: "tps1OFjs_lec2",
        varName: "tps1OFjs_lec2",
        tipo: "lectura2",
        tiempo: "pascua",
        semana: "1",
        dia: "jueves",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Octava de Pascua Jueves",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De las Catequesis de Jerusalén\n(Catequesis 20 [Mistagógica 2], 4-6: PG 33, 1079-1082)",
        descripcion: "EL BAUTISMO ES SIGNO VISIBLE DE LA PASIÓN DE CRISTO",
        texto: `Fuisteis conducidos a la sagrada piscina bautismal, del mismo modo que Cristo fue llevado desde la cruz al sepulcro preparado.

Y se os preguntó a cada uno personalmente si creíais en el nombre del Padre y del Hijo y del Espíritu Santo. Y, después de haber hecho esta saludable profesión de fe, fuisteis sumergidos por tres veces en el agua, y otras tantas sacados de ella; y con ello significasteis de un modo simbólico los tres días que estuvo Cristo en el sepulcro.

Porque, así como nuestro Salvador estuvo tres días con sus noches en el vientre de la tierra, así vosotros imitasteis con la primera emersión el primer día que estuvo Cristo en el sepulcro, y con la inmersión imitasteis la primera noche. Pues, del mismo modo que de noche no vemos nada y, en cambio, de día nos hallamos en plena luz, así también cuando estabais sumergidos nada veíais, como si fuera de noche, pero al salir del agua fue como si salierais a la luz del día. Y, así, en un mismo momento moristeis y nacisteis, y aquella agua salvadora fue para vosotros, a la vez, sepulcro y madre.

Y lo que Salomón decía, en otro orden de cosas, a vosotros os cuadra admirablemente; decía, en efecto: Tiene su tiempo el nacer y su tiempo el morir. Mas con vosotros sucedió al revés: tiempo de morir y tiempo de nacer; un mismo instante realizó en vosotros ambas cosas: la muerte y el nacimiento.`,
        respCita: "Cf. Ap 7, 9",
        respR1: "Éstos son los corderos nuevos que han dado su testimonio. Aleluya. Han venido ya a la fuente del agua * Y están llenos de luz. Aleluya.",
        respV: "Están delante del Cordero, vestidos con vestiduras blancas y con palmas en sus manos.",
        respR2: "Y están llenos de luz. Aleluya.",
        audioUrl: ""
    }
,

    // =========================================================================
    // TIEMPO ORDINARIO - SEMANA 2 (AÑO PAR / IMPAR Y PATRÍSTICA)
    // =========================================================================
    {
        id: "tos2OFdo_lec1_par",
        varName: "tos2OFdo_lec1_par",
        tipo: "lectura1_par",
        tiempo: "ordinario",
        semana: "2",
        dia: "domingo",
        libro: "oficio",
        titulo: "1ª Lectura - Domingo Semana 2 (Año Par)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del libro del Génesis 9, 1-19",
        descripcion: "EL PACTO DE DIOS CON NOÉ Y SU DESCENDENCIA",
        texto: "Dios bendijo a Noé y a sus hijos, diciéndoles:\n«Creced, multiplicaos y llenad la tierra. Todos los animales de la tierra os temerán y respetarán: aves del cielo, reptiles del suelo, peces del mar\nestán en vuestro poder. Todo lo que vive y se mueve os servirá de alimento: os lo entrego lo mismo que los vegetales. Pero no comáis carne con sangre, que es su vida. Pediré cuentas de vuestra sangre y vida, se las\npediré a cualquier animal; y al hombre le pediré cuentas de la vida de su hermano. Si uno derrama la sangre de un hombre, otro derramará la suya; porque Dios hizo al hombre a su imagen. Vosotros, creced y multiplicaos,\nmoveos por la tierra y dominadla.»\nDios dijo a Noé y a sus hijos:\n«Yo hago un pacto con vosotros y con vuestros descendientes, con todos los animales que os acompañaron, aves, ganado y fieras, con todos\nlos que salieron del arca y ahora viven en la tierra. Hago un pacto con vosotros: El diluvio no volverá a destruir la vida ni habrá otro diluvio que devaste la tierra.»\nY Dios añadió:\n«Ésta\nes la señal del pacto que hago con vosotros y con todo lo que vive con vosotros, para todas las edades: Pondré mi arco en el cielo, como señal de mi pacto con la tierra. Cuando traiga nubes sobre la tierra,\naparecerá en las nubes el arco y recordaré mi pacto con vosotros y con todos los animales, y el diluvio no volverá a destruir los vivientes. Saldrá el arco en las nubes y, al verlo, recordaré mi pacto\nperpetuo: Pacto de Dios con los animales, con lo que vive en la tierra.»\nDios dijo a Noé:\n«Ésta es la señal del pacto que hago con todo lo que vive en la tierra.»\nLos hijos de Noé\nque salieron del arca fueron: Sem, Cam y Jafet; Cam es el padre de Canaán. Son los tres hijos de Noé que se propagaron por toda la tierra.",
        respCita: "Is 54, 9-10",
        respR1: "Me sucede como en tiempo de Noé: Juré que las aguas del diluvio no volverían a cubrir la tierra; así juro no airarme contra ti; * mi alianza de paz no\nvacilará.",
        respV: "Aunque se retiren los montes y vacilen las colinas, no se retirará de ti mi misericordia.",
        respR2: "Mi alianza de paz no vacilará.",
        audioUrl: "https://to.resucito.do/s02/domingo/lectura2.mp3"
    },
    {
        id: "tos2OFdo_lec1_impar",
        varName: "tos2OFdo_lec1_impar",
        tipo: "lectura1_impar",
        tiempo: "ordinario",
        semana: "2",
        dia: "domingo",
        libro: "oficio",
        titulo: "1ª Lectura - Domingo Semana 2 (Año Impar)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "De la carta a los Romanos 4, 1-25",
        descripcion: "ABRAHAM FUE JUSTIFICADO POR SU FE",
        texto: "Hermanos: ¿Qué diremos respecto de Abraham, nuestro progenitor natural? Si Abraham fue justificado por las obras, tiene un título de gloria, pero no lo tiene ante Dios. Porque, vamos a ver, ¿qué dice la\nEscritura? «Abraham creyó a Dios, y Dios estimó su fe como justificación.» El salario del que ejecuta un trabajo no es estimado como un favor, sino como una deuda; pero la fe del que sin hacer obra alguna cree\nen aquel que justifica al pecador es estimada por Dios como justificación.\nDel mismo modo, proclama también David bienaventurado al hombre a quien Dios confiere la justificación, haciendo caso omiso de las obras:\n«Dichoso el que está absuelto de su culpa, a quien le han sepultado su pecado; dichoso el hombre a quien el Señor no le apunta el delito.»\nAhora bien, esta proclamación de felicidad ¿recae\nsolamente sobre los circuncisos o también sobre los incircuncisos? Ya que decimos que Dios estimó la fe de Abraham como justificación. Pero, ¿cómo la estimó? ¿Después de la\ncircuncisión o antes? No cuando estaba circuncidado, sino cuando todavía estaba sin circuncidar. Y la señal de la circuncisión la recibió como sello de la justificación por la fe, justificación\nque, incircunciso todavía, poseía ya. De este modo, viene a ser padre de todos los creyentes no circuncidados, para que también a éstos se les impute la justificación. Y asimismo viene a ser padre de los\ncircuncisos, de aquellos que no sólo tienen la circuncisión, sino que también siguen las huellas de la fe que tenía nuestro padre Abraham antes de ser circuncidado.\nNo se vinculó tampoco al\ncumplimiento de la ley, sino a la justificación por la fe, la promesa hecha a Abraham y a su posteridad de poseer en herencia el mundo. En efecto, si los sometidos a la ley son los herederos, la fe no tiene razón de ser, y la\npromesa queda sin valor alguno.\nLa ley trae consigo la cólera de Dios; que donde no hay ley, no hay transgresión. Por consiguiente, la transmisión de las promesas es por la fe, para que todo sea gratuito. Así\nlas promesas tienen valor para todos los descendientes de Abraham, no sólo para los sometidos a la ley, sino también para los que tienen la fe de Abraham. Él es padre de todos nosotros, como de él dice la Escritura:\n«Te he constituido padre de muchas naciones.» Es nuestro padre ante Dios, en quien creyó, Dios que da vida a los muertos y llama a la existencia a lo que no es.\nAbraham, esperando en Dios contra toda esperanza, tuvo\nfe; y así llegó a ser padre de muchas naciones, según el oráculo: «Así de numerosa será tu descendencia.» Y no flaqueó en la fe, al considerar su cuerpo ya marchito (era casi\ncentenario) y la incapacidad generativa de Sara; y, ante la promesa de Dios, no vaciló, dejándose llevar de la incredulidad; sino que, fortalecido por la fe, dio gloria a Dios, plenamente convencido de que Dios, que lo\nhabía prometido, tenía también poder para cumplirlo. Por eso, estimó Dios su fe como justificación.\nPero no solamente por él dice la Escritura que Dios estimó su fe, sino que lo dice\ntambién por nosotros. Dios estimará nuestra fe como justificación, creyendo como creemos en aquel que resucitó de entre los muertos a Jesús, nuestro Señor, que fue entregado a la muerte por nuestros\npecados, y resucitado para nuestra justificación.",
        respCita: "Hb 11, 17. 19; Rm 4, 17",
        respR1: "Por la fe, puesto a prueba, ofreció Abraham a Isaac; y ofrecía a su unigénito, a aquel que era el depositario de las promesas; * concluyó de todo ello\nque Dios podía resucitarlo de entre los muertos.",
        respV: "Creyó en aquel que da vida a los muertos y llama a la existencia a lo que no es.",
        respR2: "Concluyó de todo ello que Dios podía resucitarlo de entre los muertos.",
        audioUrl: "https://to.resucito.do/s02/domingo/lectura1.mp3"
    },
    {
        id: "tos2OFdo_lec2",
        varName: "tos2OFdo_lec2",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "2",
        dia: "domingo",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Domingo Semana 2",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De la carta de san Ignacio de Antioquía, obispo y mártir, a los Efesios\n(Cap. 2, 2—5, 2: Funk 1, 175-177)",
        descripcion: "EN LA CONCORDIA DE LA UNIDAD",
        texto: "Es justo que vosotros glorifiquéis de todas las maneras a Jesucristo, que os ha glorificado a vosotros, de modo que, unidos en una perfecta obediencia, sumisos a vuestro obispo y al colegio presbiteral, seáis en todo\nsantificados. No os hablo con autoridad, como si fuera alguien. Pues, aunque estoy encarcelado por el nombre de Cristo, todavía no he llegado a la perfección en Jesucristo. Ahora, precisamente, es cuando empiezo a ser\ndiscípulo suyo y os hablo como a mis condiscípulos. Porque lo que necesito más bien es ser fortalecido por vuestra fe, por vuestras exhortaciones, vuestra paciencia, vuestra ecuanimidad. Pero, como el amor que os tengo me\nobliga a hablaros también acerca de vosotros, por esto me adelanto a exhortaros a que viváis unidos en el sentir de Dios. En efecto, Jesucristo, nuestra vida inseparable, expresa el sentir del Padre, como también los\nobispos, esparcidos por el mundo, son la expresión del sentir de Jesucristo.\nPor esto debéis estar acordes con el sentir de vuestro obispo, como ya lo hacéis. Y en cuanto a vuestro colegio presbiteral, digno de Dios\ny del nombre que lleva, está armonizado con vuestro obispo como las cuerdas de una lira. Este vuestro acuerdo y concordia en el amor es como un himno a Jesucristo. Procurad todos vosotros formar parte de este coro, de modo que, por\nvuestra unión y concordia en el amor, seáis como una melodía que se eleva a una sola voz por Jesucristo al Padre, para que os escuche y os reconozca, por vuestras buenas obras, como miembros de su Hijo. Os conviene, por\ntanto, manteneros en una unidad perfecta, para que seáis siempre partícipes de Dios.\nSi yo, en tan breve espacio de tiempo, contraje con vuestro obispo tal familiaridad, no humana, sino espiritual, ¿cuánto\nmás dichosos debo consideraros a vosotros, que estáis unidos a él como la Iglesia a Jesucristo y como Jesucristo al Padre, resultando así en todo un consentimiento unánime? Nadie se engañe: quien no\nestá unido al altar se priva del pan de Dios. Si tanta fuerza tiene la oración de cada uno en particular, ¿cuánto más la que se hace presidida por el obispo y en unión con toda la Iglesia?",
        respCita: "Cf. Ef 4, 1. 3-4",
        respR1: "Os ruego, por el Señor, que andéis como pide la vocación a la que habéis sido convocados. * Esforzaos por mantener la unidad del Espíritu, con el\nvínculo de la paz.",
        respV: "Un solo cuerpo y un solo Espíritu, como una sola es la meta de la esperanza en la vocación a la que habéis sido convocados.",
        respR2: "Esforzaos por mantener la unidad del Espíritu, con el vínculo de la paz.",
        audioUrl: "https://to.resucito.do/s02/domingo/lecturas.mp3"
    },
    {
        id: "tos2OFlu_lec1_par",
        varName: "tos2OFlu_lec1_par",
        tipo: "lectura1_par",
        tiempo: "ordinario",
        semana: "2",
        dia: "lunes",
        libro: "oficio",
        titulo: "1ª Lectura - Lunes Semana 2 (Año Par)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del libro del Génesis 11, 1-26",
        descripcion: "LA DISPERSIÓN DEL GÉNERO HUMANO",
        texto: "El mundo entero hablaba la misma lengua con las mismas palabras. Al emigrar de oriente, los hombres encontraron una llanura en el país de Senaar, y se establecieron allí. Y se dijeron unos a otros:\n«Vamos a\npreparar ladrillos y a cocerlos.»\nEmpleando ladrillos, en vez de piedras, y alquitrán, en vez de cemento. Y dijeron:\n«Vamos a construir una ciudad y una torre que alcance al cielo, para hacernos famosos y para\nno dispersarnos por la superficie de la tierra.»\nEl Señor bajó a ver la ciudad y la torre que estaban construyendo los hombres; y se dijo:\n«Son un solo pueblo con una sola lengua. Si esto no es\nmás que el comienzo de su actividad, nada de lo que decidan hacer les resultará imposible. Vamos a bajar y a confundir su lengua, de modo que uno no entienda la lengua del prójimo.»\nEl Señor los\ndispersó por la superficie de la tierra y dejaron de construir la ciudad. Por eso se llama Babel, porque allí confundió el Señor la lengua de toda la tierra, y desde allí los dispersó por la superficie\nde la tierra.\nDescendientes de Sem:\nTenía Sem cien años, cuando engendró a Arfaxad dos años después del diluvio; después vivió quinientos años, y engendró hijos e\nhijas.\nTenía Arfaxad treinta y cinco años, cuando engendró a Sela; después vivió cuatrocientos tres años, y engendró hijos e hijas.\nTenía Sela treinta años, cuando\nengendró a Heber; después vivió cuatrocientos tres años, y engendró hijos e hijas.\nTenía Heber treinta y cuatro año, cuando engendró a Peleg; después vivió\ncuatrocientos treinta años, y engendró hijos e hijas.\nTenía Peleg treinta años, cuando engendró a Reu; después vivió doscientos nueve años, y engendró hijos e hijas.\nTenía\nReu treinta y dos años, cuando engendró a Sarug; después vivió doscientos siete años, y engendró hijos e hijas.\nTenía Sarug treinta años, cuando engendró a Najor;\ndespués vivió doscientos años, y engendró hijos e hijas.\nTenía Najor veintinueve años, cuando engendró a Teraj; después vivió ciento diez y nueve años, y\nengendró hijos e hijas.\nTenía Teraj setenta años, cuando engendró a Abram, Najor y Harán.",
        respCita: "Is 66, 18; cf. Mc 13, 27",
        respR1: "Yo vendré para reunir a los pueblos de toda lengua: * acudirán para ver mi gloria.",
        respV: "Entonces enviaré a mis ángeles para que reúnan a mis elegidos de los cuatro puntos cardinales.",
        respR2: "Acudirán para ver mi gloria.",
        audioUrl: "https://to.resucito.do/s02/lunes/lectura2.mp3"
    },
    {
        id: "tos2OFlu_lec1_impar",
        varName: "tos2OFlu_lec1_impar",
        tipo: "lectura1_impar",
        tiempo: "ordinario",
        semana: "2",
        dia: "lunes",
        libro: "oficio",
        titulo: "1ª Lectura - Lunes Semana 2 (Año Impar)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "De la carta a los Romanos 5, 1-11",
        descripcion: "LA JUSTIFICACIÓN DEL HOMBRE, POR MEDIO DE JESUCRISTO",
        texto: "Hermanos: Ya que hemos recibido la justificación por la fe, estamos en paz con Dios, por medio de nuestro Señor Jesucristo. Por él hemos obtenido con la fe el acceso a esta gracia en que estamos; y nos gloriamos\napoyados en la esperanza de la gloria de los hijos de Dios. Y más aún, nos gloriamos hasta de las tribulaciones, sabiendo que la tribulación engendra constancia; la constancia, virtud acrisolada; y la virtud acrisolada,\nesperanza; y la esperanza no defrauda, porque el amor de Dios ha sido derramado en nuestros corazones con el Espíritu Santo que se nos ha dado.\nPrecisamente, cuando estábamos nosotros todavía sumidos en la\nimpotencia del pecado, murió Cristo por los pecadores, en el tiempo prefijado por el Padre. En realidad, apenas habrá quien dé su vida por un justo; quizá por un bienhechor se exponga alguno a perder la vida.\nPero\nDios nos demuestra el amor que nos tiene en el hecho de que, siendo todavía pecadores, murió Cristo por nosotros. Así que, con mayor razón, ahora que hemos sido justificados por su sangre, seremos salvados por\nél de la cólera divina.\nPorque si, siendo aún enemigos, fuimos reconciliados con Dios por la muerte de su Hijo, con mayor razón, estando ya reconciliados, seremos salvos por su vida. Y no sólo eso.\nHasta ponemos nuestra gloria y confianza en Dios gracias a nuestro Señor Jesucristo, por cuyo medio hemos obtenido ahora la reconciliación.",
        respCita: "Rm 5, 8-9",
        respR1: "Dios nos demuestra el amor que nos tiene en el hecho de que, * siendo todavía pecadores, murió Cristo por nosotros.",
        respV: "Con mayor razón, ahora que hemos sido justificados por su sangre, seremos salvados por él de la cólera divina.",
        respR2: "Siendo todavía pecadores, murió Cristo por nosotros.",
        audioUrl: "https://to.resucito.do/s02/lunes/lectura1.mp3"
    },
    {
        id: "tos2OFlu_lec2",
        varName: "tos2OFlu_lec2",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "2",
        dia: "lunes",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Lunes Semana 2",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De la carta de san Ignacio de Antioquía, obispo y mártir, a los Efesios\n(Cap. 13—18, 1: Funk 1, 183-187)",
        descripcion: "TENED FE Y CARIDAD PARA CON CRISTO",
        texto: "Procurad reuniros con más frecuencia para celebrar la acción de gracias y la alabanza divina. Cuando os reunís con frecuencia en un mismo lugar, se debilita el poder de Satanás, y la concordia de vuestra fe le\nimpide causaros mal alguno. Nada mejor que la paz, que pone fin a toda discordia en el cielo y en la tierra.\nNada de esto os es desconocido si mantenéis de un modo perfecto, en Jesucristo, la fe y la caridad, que son el principio\ny el fin de la vida: el principio es la fe, el fin la caridad. Cuando ambas virtudes van a la par se identifican con el mismo Dios, y todo lo demás que contribuye al bien obrar se deriva de ellas. El que profesa la fe no peca, y el que\nposee la caridad no odia. Por el fruto se conoce el árbol; del mismo modo, los que hacen profesión de pertenecer a Cristo se distinguen por sus obras. Lo que nos interesa ahora, más que hacer una profesión de fe, es\nmantenernos firmes en esa fe hasta el fin.\nEs mejor callar y obrar que hablar y no obrar. Buena cosa es enseñar, si el que enseña también obra. Uno solo es el maestro, que lo dijo, y existió; pero\ntambién es digno del Padre lo que enseñó sin palabras. El que posee la palabra de Jesús es capaz de entender lo que él enseñó sin palabras y llegar así a la perfección, obrando\nsegún lo que habla y dándose a conocer por lo que hace sin hablar. Nada hay escondido para el Señor, sino que aun nuestros secretos más íntimos no escapan a su presencia. Obremos, pues, siempre conscientes de\nque él habita en nosotros, para que seamos templos suyos y él sea nuestro Dios en nosotros, tal como es en realidad y tal como se manifestará ante nuestra faz; por esto tenemos motivo más que suficiente para amarlo.\nNo\nos engañéis, hermanos míos. Los que perturban las familias no poseerán el reino de Dios. Ahora bien, si los que así perturban el orden material son reos de muerte, ¿cuánto más los que\ncorrompen con sus falsas enseñanzas la fe que proviene de Dios, por la cual fue crucificado Jesucristo? Estos tales, manchados por su iniquidad, irán al fuego inextinguible, como también los que les hacen caso. Para esto\nel Señor recibió el ungüento en su cabeza, para infundir en la Iglesia la incorrupción. No os unjáis con el repugnante olor de las enseñanzas del príncipe de este mundo, no seaa que os lleve\ncautivos y os aparte de la vida que tenemos prometida. ¿Por qué no somos todos prudentes, si hemos recibido el conocimiento de Dios, que es Jesucristo? ¿Por qué nos perdemos neciamente, no reconociendo el don que en\nverdad nos ha enviado el Señor?\nMi espíritu es el sacrificio expiatorio de la cruz, la cual para los incrédulos es motivo de escándalo, mas para nosotros es la salvación y la vida eterna.",
        respCita: "Col 3, 17; 1Co 10, 31",
        respR1: "Todo lo que de palabra o de obra realicéis, * sea todo en nombre de Jesús, ofreciendo la Acción de Gracias a Dios Padre por medio de él.",
        respV: "Haced todas las cosas a gloria de Dios.",
        respR2: "Sea todo en nombre de Jesús, ofreciendo la Acción de Gracias a Dios Padre por medio de él.\n\nOREMOS,\nDios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que\nvive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos.\nAmén\n\nV. Bendigamos al Señor.\nR. Demos gracias a Dios.\n&#8593; Of La Tr Sx Nn Vs Cm &#8595;",
        audioUrl: "https://to.resucito.do/s02/lunes/lecturas.mp3"
    },
    {
        id: "tos2OFma_lec1_par",
        varName: "tos2OFma_lec1_par",
        tipo: "lectura1_par",
        tiempo: "ordinario",
        semana: "2",
        dia: "martes",
        libro: "oficio",
        titulo: "1ª Lectura - Martes Semana 2 (Año Par)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del libro del Génesis 12, 1-9; 13, 2-18",
        descripcion: "VOCACIÓN Y BENDICIÓN DE ABRAM",
        texto: "En aquellos días, el Señor dijo a Abram:\n«Sal de tu tierra y de la casa de tu padre, hacia la tierra que te mostraré. Haré de ti un gran pueblo, te bendeciré, haré famoso tu nombre y\nserá una bendición. Bendeciré a los que te bendigan, maldeciré a los que te maldigan. Con tu nombre se bendecirán todas las familias del mundo.»\nAbram marchó, como le había dicho el\nSeñor, y con él marchó Lot. Abram tenía setenta y cinco años cuando salió de Harán. Abram llevó consigo a Saray, su mujer, a Lot, su sobrino, todo lo que había adquirido y todos\nlos esclavos que había ganado en Harán. Salieron en dirección de Canaán y llegaron a la tierra de Canaán. Abram atravesó el país hacia la región de Siquem, hasta la encina de Moré\n(en aquel tiempo habitaban allí los cananeos). El Señor se apareció a Abram y le dijo:\n«A tu descendencia le daré esta tierra.»\nEl construyó allí un altar en honor del\nSeñor que se le había aparecido. Desde allí, continuó hacia las montañas, al este de Betel, y plantó allí su tienda, con Betel a poniente y Ay a levante; construyó allí un altar al\nSeñor e invocó el nombre del Señor. Abram se trasladó por etapas al Negueb.\nAbram era muy rico en ganado, plata y oro. Desde el Negueb se trasladó por etapas a Betel, al sitio donde había fijado\nen otro tiempo su tienda, entre Betel y Ay, donde había construido un altar; y allí invocó el nombre del Señor.\nTambién Lot, que acompañaba a Abram, poseía ovejas, vacas y tiendas; de\nmodo que ya no podían vivir juntos en el país, porque sus posesiones eran inmensas y ya no cabían juntos. Por ello surgieron disputas entre los pastores de Abram y los de Lot. (En aquel tiempo, cananeos y fereceos ocupaban\nel país.) Abram dijo a Lot:\n«No haya disputas entre nosotros dos, ni entre nuestros pastores, pues somos hermanos. Tienes delante todo el país, sepárate de mí: si vas a la izquierda, yo iré a la\nderecha; si vas a la derecha, yo iré a la izquierda.»\nLot echó una mirada y vio que toda la vega del Jordán, hasta la entrada de Soar, era de regadío (esto era antes de que el Señor destruyera a\nSodoma y Gomorra); parecía un jardín del Señor, o como Egipto. Lot se escogió la vega del Jordán y marchó hacia levante; y así se separaron los dos hermanos.\nAbram habitó en\nCanaán, Lot en las ciudades de la vega, plantando las tiendas hasta Sodoma. Los habitantes de Sodoma eran malvados y pecaban gravemente contra el Señor. El Señor habló a Abram, después que Lot se había\nseparado de él:\n«Desde tu puesto dirige la mirada hacia el norte, mediodía, levante y poniente. Toda la tierra que abarques te la daré a ti y a tus descendientes para siempre. Haré a tus descendientes\ncomo el polvo: el que pueda contar el polvo podrá contar a tus descendientes. Anda, recorre el país a lo largo y a lo ancho, pues te lo voy a dar.»\nAbram alzó la tienda y fue a establecerse junto a la encina\nde Mambré, en Hebrón, donde construyó un altar en honor del Señor.",
        respCita: "Hb 11, 8; Is 51, 2",
        respR1: "Por la fe obedeció Abraham al ser llamado por Dios, saliendo hacia la tierra que había de recibir en herencia, * y salió sin saber a dónde iba.",
        respV: "Mirad a Abraham, vuestro padre, y a Sara, que os dio a luz; cuando lo llamé, era uno, pero lo bendije y lo multipliqué.",
        respR2: "Y salió sin saber a dónde iba.",
        audioUrl: "https://to.resucito.do/s02/martes/lectura2.mp3"
    },
    {
        id: "tos2OFma_lec1_impar",
        varName: "tos2OFma_lec1_impar",
        tipo: "lectura1_impar",
        tiempo: "ordinario",
        semana: "2",
        dia: "martes",
        libro: "oficio",
        titulo: "1ª Lectura - Martes Semana 2 (Año Impar)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "De la carta a los Romanos 5, 12-21",
        descripcion: "EL VIEJO Y EL NUEVO ADÁN",
        texto: "Hermanos: Así como por un solo hombre entró el pecado en el mundo y, por el pecado, la muerte, y, de este modo, la muerte pasó a todos los hombres, dado que todos han pecado...\n(Porque ya antes de la promulgación de la ley existía el pecado en el mundo, y sin embargo no puede imputarse pecado si no hay ley; vemos, empero, que, de hecho, la muerte reinó ya desde Adán a Moisés sobre todos los que pecaron, aun cuando su transgresión no fue en las mismas condiciones en que pecó Adán, el cual era figura del que había de venir.\nSin embargo, con el don no sucedió como con el delito, pues, si por el delito de uno solo murió la multitud, ¡con cuánta mayor profusión, por la gracia de un solo hombre, Jesucristo, se derramó sobre todos la bondad y el don de Dios! Ni fueron los efectos de este don como los efectos del pecado de aquel único hombre que pecó, porque la sentencia que llevó a la condenación vino por uno solo, en cambio, el don, partiendo de muchas transgresiones, lleva a la justificación.)\n...Así pues (decía), si, por la falta de uno solo, la muerte estableció su reinado, también, con mucha mayor razón, por causa de uno solo, de Jesucristo, reinarán en la vida los que reciben la sobreabundancia de la gracia y el don de la justificación.\nPor consiguiente, así como el delito de uno solo atrajo sobre todos los hombres la condenación, así también la obra de justicia de uno solo procura a todos la justificación que da la vida. Y como por la desobediencia de un solo hombre todos los demás quedaron constituidos pecadores, así también por la obediencia de uno solo todos quedarán constituidos justos.\nLa ley, ciertamente, fue ocasión de que se multiplicasen los delitos, pero donde abundó el pecado sobreabundó la gracia, para que así como reinó el pecado produciendo la muerte, así también reine la gracia dándonos vida eterna por Jesucristo, Señor nuestro.",
        respCita: "Rm 5, 20-21. 19",
        respR1: "Donde abundó el pecado sobreabundó la gracia, * para que así como reinó el pecado produciendo la muerte, así también reine la gracia dándonos vida eterna.",
        respV: "Como por la desobediencia de un solo hombre todos los demás quedaron constituidos pecadores, así también por la obediencia de uno solo todos quedarán constituidos justos.",
        respR2: "Para que así como reinó el pecado produciendo la muerte, así también reine la gracia dándonos vida eterna.",
        audioUrl: "https://to.resucito.do/s02/martes/lectura1.mp3"
    },
    {
        id: "tos2OFma_lec2",
        varName: "tos2OFma_lec2",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "2",
        dia: "martes",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Martes Semana 2",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De la carta de san Clemente primero, papa, a los Corintios.\n(Cap. 49-50: Funk 1, 123-125)",
        descripcion: "¿QUIÉN SERÁ CAPAZ DE EXPLICAR EL VÍNCULO DE LA CARIDAD DIVINA?",
        texto: "El que posee la caridad de Cristo que cumpla sus mandamientos. ¿Quién será capaz de explicar debidamente el vínculo que la caridad divina establece? ¿Quién podrá dar cuenta de la grandeza de su hermosura? La caridad nos eleva hasta unas alturas inefables. La caridad nos une a Dios, la caridad cubre la multitud de los pecados, la caridad lo aguanta todo, lo soporta todo con paciencia; nada sórdido ni altanero hay en ella; la caridad no admite divisiones, no promueve discordias, sino que lo hace todo en la concordia; en la caridad hallan su perfección todos los elegidos de Dios y sin ella nada es grato a Dios. En la caridad nos acogió el Señor: por su caridad hacia nosotros, nuestro Señor Jesucristo, cumpliendo la voluntad del Padre, dio su sangre por nosotros, su carne por nuestra carne, su vida por nuestras vidas.\nYa veis, amados hermanos, cuán grande y admirable es la caridad y cómo es inenarrable su perfección. Nadie es capaz de practicarla adecuadamente, si Dios no le otorga este don. Oremos, por tanto, e imploremos la misericordia divina, para que sepamos practicar sin tacha la caridad, libres de toda parcialidad humana. Todas las generaciones anteriores, desde Adán hasta nuestros días, han pasado; pero los que por gracia de Dios han sido perfectos en la caridad obtienen el lugar destinado a los justos y se manifestarán el día de la visita del reino de Cristo. Porque está escrito: Anda, pueblo mío, entra en los aposentos y cierra la puerta por dentro; escóndete un breve instante mientras pasa la cólera; y me acordaré del día bueno y os haré salir de vuestros sepulcros.\nDichosos nosotros, amados hermanos, si cumplimos los mandatos del Señor en la concordia de la caridad, porque esta caridad nos obtendrá el perdón de los pecados. Está escrito: Dichoso el que está absuelto de su culpa, a quien le han sepultado su pecado; dichoso el hombre a quien el Señor no le apunta el delito y en cuyo espíritu no hay falsedad. Esta proclamación de felicidad atañe a los que, por Jesucristo nuestro Señor, han sido elegidos por Dios, al cual sea la gloria por los siglos de los siglos. Amén.",
        respCita: "1 Jn 4, 16. 7",
        respR1: "Nosotros hemos creído en el amor que Dios nos tiene; * Dios es amor y quien permanece en el amor permanece en Dios, y Dios en él.",
        respV: "Amémonos unos a otros, ya que el amor es de Dios.",
        respR2: "Dios es amor y quien permanece en el amor permanece en Dios, y Dios en él.\n\nOREMOS,\nDios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos.\nAmén\n\nV. Bendigamos al Señor.\nR. Demos gracias a Dios.\n&#8593; Of La Tr Sx Nn Vs Cm &#8595;",
        audioUrl: "https://to.resucito.do/s02/martes/lecturas.mp3"
    },
    {
        id: "tos2OFmi_lec1_par",
        varName: "tos2OFmi_lec1_par",
        tipo: "lectura1_par",
        tiempo: "ordinario",
        semana: "2",
        dia: "miercoles",
        libro: "oficio",
        titulo: "1ª Lectura - Miércoles Semana 2 (Año Par)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del libro del Génesis 14, 1-24",
        descripcion: "MELQUISEDEC BENDICE A ABRAM, QUE VUELVE VICTORIOSO",
        texto: "En aquellos días, siendo Amrafel rey de Senaar, Arioc rey de Elasar, Codorlahomer rey de Elam y Tidgal rey de Pueblos, declararon la guerra a Bera, rey de Sodoma, Birsa, rey de Gomorra; Sinab, rey de Adama, Semeber, rey de\nSeboín y al rey de Bela (o Soar). Éstos se reunieron en Val Sidín (hoy el mar Muerto). Durante doce años habían sido vasallos de Codorlahomer, al décimo tercero se rebelaron; el año\ndécimo cuarto vino Codorlahomer con sus reyes aliados y fue derrotando a los refaitas en Astarot Carnín, a los zuzeos en Ham, a los emeos en Sabe Quiriataín y a los hurritas en los montes de Seir, junto a El Parán,\nal margen del desierto.\nDespués, volvieron y entraron por Fuente del Juicio (que hoy se llama Cadés) y sometieron el territorio amalecita y también a los amorreos, que habitaban en Palma de Hazazón. Entonces,\nhicieron una expedición los reyes de Sodoma, Gomorra, Adama, Seboín y Bela (o Soar), y presentaron batalla en Val Sidín a Codorlahomer, rey de Elam, Tidgal, rey de Pueblos, Amrafel, rey de Senaar, Arioc, rey de Elasar:\ncinco reyes contra cuatro. Val Sidín está lleno de pozos de asfalto, y los reyes de Sodoma y Gomorra cayeron en ellos al huir, mientras que los otros escapaban a los montes. Los vencedores saquearon las posesiones de Sodoma y\nGomorra, con todas las provisiones, y se fueron; al marcharse, se llevaron también a Lot, sobrino de Abram, con sus posesiones, pues Lot habitaba en Sodoma.\nUn fugitivo vino y se lo contó a Abram, el hebreo, que estaba\nacampando junto a las encinas de Mambré, el amorreo, pariente de Escol y Anar, aliados de Abram.\nCuando Abram oyó que su sobrino había caído prisionero, reunió a los esclavos nacidos en su casa,\ntrescientos diez y ocho, y los fue persiguiendo hasta Dan; con su tropa cayó sobre ellos de noche y los persiguió hasta Hoba, al norte de Damasco; recuperó todas las posesiones y se trajo también a Lot, con sus\nposesiones, las mujeres y la tropa.\nCuando Abram volvía después de derrotar a Codorlahomer y los reyes aliados, el rey de Sodoma salió a su encuentro en el valle de Savé, que es Valderrey.\nEntonces,\nMelquisedec, rey de Salem, sacerdote del Dios Altísimo, presentó pan y vino. Y bendijo a Abram, diciendo:\n«Bendito sea Abram por el Dios Altísimo, creador de cielo y tierra; bendito sea el Dios\nAltísimo, que te ha entregado tus enemigos.»\nY Abram le dio un décimo de cada cosa.\nEl rey de Sodoma dijo a Abram:\n«Dame la gente, quédate con las posesiones.»\nPero Abram\nreplicó:\n«Juro por el Señor Dios Altísimo, creador de cielo y tierra, que no aceptaré un hilo ni una correa de sandalia ni nada de lo que te pertenece; para que no digas: \"Yo he enriquecido a Abram.\"\nSólo acepto lo que han comido mis muchachos, y la parte de los que me acompañaron, Aner, Escol y Mambré; que ellos se lleven su parte.»",
        respCita: "Hb 5, 5. 6; 7, 20. 21",
        respR1: "Cristo no se dio a sí mismo la gloria del sumo sacerdocio, sino que la recibió de aquel que le dijo: * «Tú eres sacerdote eterno según el rito de\nMelquisedec.»",
        respV: "Los sacerdotes de la antigua ley fueron constituidos sin juramento, pero Jesús fue constituido con juramento, pronunciado por aquel que le dijo:",
        respR2: "«Tú eres sacerdote eterno según el rito de Melquisedec.»",
        audioUrl: "https://to.resucito.do/s02/miercoles/lectura2.mp3"
    },
    {
        id: "tos2OFmi_lec1_impar",
        varName: "tos2OFmi_lec1_impar",
        tipo: "lectura1_impar",
        tiempo: "ordinario",
        semana: "2",
        dia: "miercoles",
        libro: "oficio",
        titulo: "1ª Lectura - Miércoles Semana 2 (Año Impar)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "De la carta a los Romanos 6, 1-11",
        descripcion: "ESTÁIS MUERTOS AL PECADO, PERO VIVÍS PARA DIOS EN CRISTO JESÚS",
        texto: "Hermanos: ¿Qué concluiremos de todo esto? ¿Continuaremos en pecado para que abunde la gracia? ¡De ninguna manera! Una vez que hemos muerto al pecado, ¿cómo continuar viviendo en él? Cuantos\nen el bautismo fuimos sumergidos en Cristo Jesús fuimos sumergidos en su muerte.\nPor nuestro bautismo fuimos, pues, sepultados con él, para participar de su muerte; para que, así como Cristo fue resucitado de entre\nlos muertos por la gloria del Padre, así también nosotros vivamos una vida nueva. Pues, si hemos sido injertados vitalmente en Cristo por la imagen de su muerte, también lo estaremos por la imagen de su\nresurrección.\nYa sabemos que nuestra antigua condición humana fue crucificada con Cristo, a fin de que la solidaridad general con el pecado fuese destruida y dejásemos de ser esclavos del pecado, pues el que muere\nqueda libre de pecado.\nSi verdaderamente hemos muerto con Cristo, tenemos fe de que también viviremos con él, pues sabemos que Cristo, una vez resucitado de entre los muertos, ya no muere; la muerte no tiene ya poder sobre\nél. Su muerte fue un morir al pecado, de una vez para siempre, mas su vida es un vivir para Dios. Así también considerad vosotros que estáis muertos al pecado, pero que vivís para Dios en unión con\nCristo Jesús.",
        respCita: "Rm 6, 4; Ga 3, 27",
        respR1: "Por nuestro bautismo fuimos sepultados con Cristo, para participar de su muerte; * para que, así como Cristo fue resucitado de entre los muertos por la gloria del Padre,\nasí también nosotros vivamos una vida nueva.",
        respV: "Todos los que habéis sido bautizados en Cristo os habéis revestido de Cristo.",
        respR2: "Para que, así como Cristo fue resucitado de entre los muertos por la gloria del Padre, así también nosotros vivamos una vida nueva.",
        audioUrl: "https://to.resucito.do/s02/miercoles/lectura1.mp3"
    },
    {
        id: "tos2OFmi_lec2",
        varName: "tos2OFmi_lec2",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "2",
        dia: "miercoles",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Miércoles Semana 2",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De la Constitución dogmática Lumen géntium, sobre la Iglesia, del Concilio Vaticano segundo\n(Núms. 2. 16)",
        descripcion: "YO SALVARÉ A MI PUEBLO",
        texto: "El Padre eterno, por un libérrimo y misterioso designio de su sabiduría y de su bondad, creó el mundo universo, decretó elevar a los hombres a la participación de la vida divina y, caídos por el\npecado de Adán, no los abandonó, sino que les otorgó siempre los auxilios necesarios para la salvación, en atención a Cristo redentor, que es imagen de Dios invisible, primogénito de toda creatura. El\nPadre, desde toda la eternidad, conoció a los que había escogido y los predestinó a ser imagen de su Hijo, para que él fuera el primogénito de muchos hermanos.\nDeterminó reunir a cuantos creen\nen Cristo en la santa Iglesia, la cual fue ya prefigurada desde el origen del mundo y preparada admirablemente en la historia del pueblo de Israel y en el antiguo testamento, fue constituida en los últimos tiempos y manifestada por la\nefusión del Espíritu y se perfeccionará gloriosamente al fin de los tiempos. Entonces, como se lee en los santos Padres, todos los justos descendientes de Adán, desde Abel el justo hasta el último elegido, se\ncongregarán delante del Padre en una Iglesia universal.\nPor su parte, todos aquellos que todavía no han recibido el Evangelio están ordenados al pueblo de Dios por varios motivos.\nY en primer lugar aquel\npueblo a quien se confiaron las alianzas y las promesas y del que nació Cristo según la carne; pueblo, según la elección, amadísimo a causa de los padres: porque los dones y la vocación de Dios son\nirrevocables.\nPero el designio de salvación abarca también a todos los que reconocen al Creador, entre los cuales están en primer lugar los musulmanes, que, confesando profesar la fe de Abraham, adoran con nosotros\na un solo Dios, misericordioso, que ha de juzgar a los hombres en el último día. Este mismo Dios tampoco está lejos de aquellos otros que entre sombras e imágenes buscan al Dios desconocido, puesto que es el\nSeñor quien da a todos la vida, el aliento y todas las cosas, y el Salvador quiere que todos los hombres se salven.\nPues los que inculpablemente desconocen el Evangelio y la Iglesia de Cristo pero buscan con sinceridad a Dios y\nse esfuerzan, bajo el influjo de la gracia, en cumplir con sus obras la voluntad divina, conocida por el dictamen de la conciencia, pueden conseguir la salvación eterna. Y la divina Providencia no niega los auxilios necesarios para la\nsalvación a aquellos que, sin culpa por su parte, no han llegado todavía a un expreso conocimiento de Dios y se esfuerzan, con la gracia divina, en conseguir una vida recta.\nLa Iglesia considera que todo lo bueno y\nverdadero que se da entre estos hombres es como una preparación al Evangelio y que es dado por aquel que ilumina a todo hombre para que al fin tenga la vida.",
        respCita: "Cf. Ef 1, 9-10; Col 1, 19-20",
        respR1: "Dios había proyectado que, cuando llegase el momento culminante, todas las cosas tuviesen a Cristo por cabeza,* las del cielo y las de la tierra.",
        respV: "En él quiso Dios que residiera toda plenitud, y por él quiso reconciliar consigo todas las cosas.",
        respR2: "Las del cielo y las de la tierra.\n\nOREMOS,\nDios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que\nvive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos.\nAmén\n\nV. Bendigamos al Señor.\nR. Demos gracias a Dios.\n&#8593; Of La Tr Sx Nn Vs Cm &#8595;",
        audioUrl: "https://to.resucito.do/s02/miercoles/lecturas.mp3"
    },
    {
        id: "tos2OFju_lec1_par",
        varName: "tos2OFju_lec1_par",
        tipo: "lectura1_par",
        tiempo: "ordinario",
        semana: "2",
        dia: "jueves",
        libro: "oficio",
        titulo: "1ª Lectura - Jueves Semana 2 (Año Par)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del libro del Génesis 15, 1-21",
        descripcion: "ALIANZA DE DIOS CON ABRAM",
        texto: "En aquellos días, Abram recibió en visión la palabra del Señor:\n«No temas, Abram; yo soy tu escudo, y tu paga será abundante.»\nRespondió Abram:\n«Señor,\n¿de qué me sirven tus dones si soy estéril, y Eliezer de Damasco será el amo de mi casa?»\nY añadió:\n«No me has dado hijos, y un criado de casa me heredará.»\nLa\npalabra del Señor le respondió:\n«No te heredará ése, sino uno salido de tus entrañas.» Y el Señor lo sacó afuera y le dijo: \n«Mira al cielo, cuenta las estrellas\nsi puedes.»\nY añadió:\n«Así será tu descendencia.»\nAbram creyó al Señor y se le contó en su haber. El Señor le dijo:\n«Yo soy el\nSeñor que te saqué de Ur de los caldeos para darte en posesión esta tierra.»\nÉl replicó:\n«Señor, ¿cómo sabré que voy a poseerla?»\nRespondió\nel Señor:\n«Tráeme una ternera de tres años, una cabra de tres años, un carnero de tres años, una tórtola y un pichón.»\nAbram los trajo y los cortó por en medio,\ncolocando cada mitad frente a la otra, pero no descuartizó las aves. Los buitres bajaban a los cadáveres y Abram los espantaba. Cuando iba a ponerse el sol, un sueño profundo invadió a Abram y un terror intenso y\noscuro cayó sobre él. El Señor dijo a Abram:\n«Has de saber que tu descendencia vivirá como forastera en tierra ajena, tendrá que servir y sufrir opresión durante cuatrocientos años,\npero yo juzgaré al pueblo a quien han de servir, y al final saldrán cargados de riquezas. Tú te reunirás en paz con tus padres y te enterrarán en buena vejez. A la cuarta generación, volverán,\npues hasta entonces no se colmará la culpa de los amorreos.»\nEl sol se puso y vino la oscuridad; una humareda de horno y una antorcha ardiendo pasaban entre los miembros descuartizados. Aquel día el Señor hizo\nalianza con Abram en estos términos:\n«A tus descendientes les daré esta tierra, desde el río de Egipto al Gran Río (Éufrates): quenitas, quenizitas, cadmonitas, hititas, ferezeos, refaitas,\namorreos, cananeos, guirgaseos y jebuseos.»",
        respCita: "St 2, 23; Rm 4, 18",
        respR1: "Abraham se fió de Dios y eso le valió la justificación, * y se le llamó «amigo de Dios».",
        respV: "Esperando en Dios contra toda esperanza, tuvo fe; y así llegó a ser padre de muchas naciones.",
        respR2: "Y se le llamó «amigo de Dios».",
        audioUrl: "https://to.resucito.do/s02/jueves/lectura2.mp3"
    },
    {
        id: "tos2OFju_lec1_impar",
        varName: "tos2OFju_lec1_impar",
        tipo: "lectura1_impar",
        tiempo: "ordinario",
        semana: "2",
        dia: "jueves",
        libro: "oficio",
        titulo: "1ª Lectura - Jueves Semana 2 (Año Impar)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "De la carta a los Romanos 6, 12-23",
        descripcion: "OFRECED VUESTROS MIEMBROS, COMO ARMAS DE LA JUSTIFICACIÓN, A DIOS",
        texto: "Hermanos: Que no continúe el pecado reinando en vuestro cuerpo mortal. No os sometáis a sus malos instintos; ni sigáis ofreciendo vuestros miembros, como armas de la iniquidad, al pecado. Antes bien, como hombres que\nhabéis resucitado de la muerte a la vida, consagraos a Dios y ofreced vuestros miembros, como armas de la justificación, a Dios. El pecado no se adueñará de vosotros; no estáis bajo el régimen de la\nley, sino bajo el de la gracia.\n¿Vamos a concluir de aquí que ya podemos cometer el pecado, porque no nos encontramos bajo la ley, sino bajo la gracia? ¡De ninguna manera! ¿No sabéis que, si os\nofrecéis para someteros como esclavos, os hacéis esclavos de aquel a quien os sometéis, sea del pecado para muerte, sea de Dios para justificación? Pero gracias a Dios que, de esclavos que erais del pecado, os\nhabéis sometido de corazón a las normas de vida evangélica que Dios os ha entregado. Y, libres del pecado, os habéis hecho esclavos de la justificación.\nOs estoy hablando en términos de la vida\nmaterial, en atención a los menos dotados. Pues bien, como ofrecisteis vuestros miembros al servicio de la impureza y de la iniquidad, para terminar en iniquidad, así ahora consagrad vuestros miembros al servicio de la\njustificación, para culminar en santificación.\nCuando erais esclavos del pecado, os encontrabais libres de la justificación. ¿Y qué frutos recogíais entonces? Frutos de que os avergonzáis\nahora, porque su término es la muerte. Pero ahora, libertados del pecado y hechos esclavos de Dios, tenéis por fruto la santificación y por fin la vida eterna. El sueldo del pecado es la muerte; pero el don de Dios es la\nvida eterna en unión con Cristo Jesús, Señor nuestro.",
        respCita: "Rm 6, 22. 16b",
        respR1: "Libertados del dominio del pecado y hechos siervos de Dios, * tenéis como fruto la santidad, y como desenlace la vida eterna.",
        respV: "Os hacéis esclavos de aquel a quien os sometéis, sea del pecado para muerte, sea de Dios para justificación.",
        respR2: "Tenéis como fruto la santidad, y como desenlace la vida eterna.",
        audioUrl: "https://to.resucito.do/s02/jueves/lectura1.mp3"
    },
    {
        id: "tos2OFju_lec2",
        varName: "tos2OFju_lec2",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "2",
        dia: "jueves",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Jueves Semana 2",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De las Cartas de san Fulgencio de Ruspe, obispo\n(Carta 14, 36-37: CCL 91, 429-431)",
        descripcion: "CRISTO VIVE PARA SIEMPRE PARA INTERCEDER POR NOSOTROS",
        texto: "Fijaos que en la conclusión de las oraciones decimos: «Por nuestro Señor Jesucristo, tu Hijo»; en cambio, nunca decimos: «Por el Espíritu Santo.» Esta práctica universal de la Iglesia\ntiene su explicación en aquel misterio, según el cual, el mediador entre Dios y los hombres es Cristo Jesús, hombre también él, sacerdote eterno según el rito de Melquisedec, que entró de una\nvez para siempre con su propia sangre en el santuario, pero no en un santuario hecho por mano de hombre y figura del venidero, sino en el mismo cielo, donde está a la derecha de Dios e intercede por nosotros.\nTeniendo ante sus\nojos este oficio sacerdotal de Cristo, dice el Apóstol: Por medio de él ofrezcamos continuamente a Dios un sacrificio de alabanza, es decir, el tributo de los labios que van bendiciendo su nombre. Por él, pues, ofrecemos\nel sacrificio de nuestra alabanza y oración, ya que por su muerte fuimos reconciliados cuando éramos todavía enemigos. Por él, que se dignó hacerse sacrificio por nosotros, puede nuestro sacrificio ser\nagradable en la presencia de Dios. Por esto nos exhorta san Pedro: También vosotros, como piedras vivas, entráis en la construcción del templo del Espíritu, formando un sacerdocio sagrado, para ofrecer sacrificios\nespirituales que Dios acepta por Jesucristo. Por este motivo decimos a Dios Padre: «Por nuestro Señor Jesucristo.»\nAl referirnos al sacerdocio de Cristo, necesariamente hacemos alusión al misterio de su\nencarnación, en el cual el Hijo de Dios, a pesar de su condición divina, se anonadó a sí mismo, y tomó la condición de esclavo, según la cual se rebajó hasta someterse incluso a la\nmuerte; es decir, fue hecho un poco inferior a los ángeles, conservando no obstante su divinidad igual al Padre. El Hijo fue hecho un poco inferior a los ángeles en cuanto que, permaneciendo igual al Padre, se dignó\nhacerse como un hombre cualquiera. Se abajó cuando se anonadó a sí mismo y tomó la condición de esclavo. Más aún, el abajarse de Cristo es el total anonadamiento, que no otra cosa fue el tomar\nla condición de esclavo.\nCristo, por tanto, permaneciendo en su condición divina, en su condición de Hijo único de Dios, según la cual le ofrecemos el sacrificio igual que al Padre, al tomar la\ncondición de esclavo fue constituido sacerdote, para que, por medio de él, pudiéramos ofrecer la hostia viva, santa, grata a Dios. Nosotros no hubiéramos podido ofrecer nuestro sacrificio a Dios si Cristo no se\nhubiese hecho sacrificio por nosotros: en él nuestra propia raza humana es un verdadero y saludable sacrificio. En efecto, cuando precisamos que nuestras oraciones son ofrecidas por nuestro Señor, sacerdote eterno, reconocemos en\nél la verdadera carne de nuestra misma raza, de conformidad con lo que dice el Apóstol: Todo sumo sacerdote, tomado de entre los hombres, es constituido en favor de los hombres en lo tocante a las relaciones de éstos con\nDios, a fin de que ofrezca dones y sacrificios por los pecados. Pero al decir: «tu Hijo», añadimos: «que vive y reina contigo en la unidad del Espíritu Santo», para recordar, con esta adición, la\nunidad de naturaleza que tienen el Padre, el Hijo y el Espíritu Santo, y significar de este modo que el mismo Cristo, que por nosotros ha asumido el oficio de sacerdote, es por naturaleza igual al Padre y al Espíritu Santo.",
        respCita: "Hb 4, 16. 15",
        respR1: "Acerquémonos, pues, con seguridad y confianza a este trono de la gracia. * Aquí alcanzaremos misericordia y hallaremos gracia para ser socorridos en el momento\noportuno.",
        respV: "Pues no tenemos un sacerdote incapaz de compadecerse de nuestras debilidades.",
        respR2: "Aquí alcanzaremos misericordia y hallaremos gracia para ser socorridos en el momento oportuno.\n\nOREMOS,\nDios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que\nvive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos.\nAmén\n\nV. Bendigamos al Señor.\nR. Demos gracias a Dios.\n&#8593; Of La Tr Sx Nn Vs Cm &#8595;",
        audioUrl: "https://to.resucito.do/s02/jueves/lecturas.mp3"
    },
    {
        id: "tos2OFvi_lec1_par",
        varName: "tos2OFvi_lec1_par",
        tipo: "lectura1_par",
        tiempo: "ordinario",
        semana: "2",
        dia: "viernes",
        libro: "oficio",
        titulo: "1ª Lectura - Viernes Semana 2 (Año Par)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del libro del Génesis 16, 1-16",
        descripcion: "NACIMIENTO DE ISMAEL",
        texto: "En aquellos días, Saray, la mujer de Abram, no le daba hijos; pero tenía una sierva egipcia, llamada Hagar. Y Saray dijo a Abram:\n«El Señor no me deja tener hijos, llégate a mi sierva a ver si por\nella tengo hijos.»\nAbram aceptó la propuesta. A los diez años de habitar Abram en Canaán, Saray, la mujer de Abram, tomó a Hagar, la esclava egipcia, y se la dio a Abram, su marido, como esposa.\nÉl se llegó a Hagar, y ella concibió. Y, al verse encinta, le perdió el respeto a su señora. Entonces Saray dijo a Abram:\n«Tú eres responsable de esta injusticia; yo he puesto en tus\nbrazos a mi esclava, y ella, al verse encinta, me desprecia. El Señor juzgue entre nosotros dos.»\nAbram dijo a Saray:\n«En tu poder está tu esclava, trátala como te parezca.» Saray la\nmaltrató, y ella se escapó. El ángel del Señor la encontró junto a la fuente del desierto, la fuente del camino de Sur, y le dijo:\n«Hagar, esclava de Saray, ¿de dónde vienes y a\ndónde vas?»\nElla respondió:\n«Vengo huyendo de mi señora.» El ángel del Señor le dijo:\n«Vuelve a tu señora y sométete a su poder.» Y el\nángel del Señor añadió:\n«Haré tan numerosa tu descendencia, que no se podrá contar.»\nY el ángel del Señor concluyó:\n«Mira, estás\nencinta y darás a luz un hijo y lo llamarás Ismael, porque el Señor ha escuchado tu aflicción. Será un potro salvaje: su mano irá contra todos, y la de todos contra él; vivirá separado de\nsus hermanos.»\nHagar invocó el nombre del Señor, que le había hablado:\n«Tú eres Dios que me ve.» Pues decía:\n«¿No he visto aquí al que me ve?»\nPor\neso, aquel pozo se llama «Pozo del que vive y me ve» y está entre Cadés y Bared.\nHagar dio un hijo a Abram, y Abram llamó Ismael al hijo que le había dado Hagar. Abram tenía ochenta y seis\naños cuando Hagar le engendró a Ismael",
        respCita: "Cf. Gn 17, 20. 21; 21, 13",
        respR1: "El Señor dijo a Abraham: «Bendeciré a Ismael, lo haré fecundo, lo haré crecer en extremo; * pero mi pacto lo establezco con Isaac, el hijo que te\ndará Sara.»",
        respV: "También al hijo de la criada lo convertiré en un gran pueblo, pues es descendiente tuyo.",
        respR2: "Pero mi pacto lo establezco con Isaac, el hijo que te dará Sara.",
        audioUrl: "https://to.resucito.do/s02/viernes/lectura2.mp3"
    },
    {
        id: "tos2OFvi_lec1_impar",
        varName: "tos2OFvi_lec1_impar",
        tipo: "lectura1_impar",
        tiempo: "ordinario",
        semana: "2",
        dia: "viernes",
        libro: "oficio",
        titulo: "1ª Lectura - Viernes Semana 2 (Año Impar)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "De la carta a los Romanos 7, 1-13",
        descripcion: "NO TUVE CONCIENCIA DEL PECADO SINO POR LA LEY",
        texto: "¿No sabéis, hermanos —hablo a quienes conocen la ley—, que la ley obliga al hombre sólo durante el tiempo de su vida? Así, por ejemplo, la mujer casada está sometida por la ley al marido,\nmientras éste vive; pero, si muere él, ella queda libre de la ley que la sometía al marido.\nPor consiguiente, será tenida por adúltera, si se une a otro hombre en vida del marido; pero, muerto el\nmarido, queda ella libre de la ley; y no será adúltera en el caso de unirse a otro hombre.\nDel mismo modo, hermanos, también vosotros habéis muerto a la ley por vuestra unión al cuerpo de Cristo.\nAsí podéis pertenecer a otro, a aquel que fue resucitado de entre los muertos, para que demos fruto según Dios.\nDe hecho, cuando vivíamos nuestra vida de orden puramente natural, las pasiones pecaminosas,\ninstigadas por la ley, actuaban en nuestros miembros y daban frutos de muerte; pero ahora nos hemos desprendido de la ley, muriendo para aquello en que estábamos presos; sirvamos, pues, a Dios en la novedad del espíritu y no en\nla vejez de la letra.\nPero, vamos a ver, ¿se sigue de esto que la ley es pecado? ¡De ninguna manera! Pero, sin embargo, yo no tuve conciencia del pecado sino por la ley; y no hubiese tenido conciencia de la codicia, por\nejemplo, si la ley no dijese: «No codiciarás.» Y el pecado, instigado por este precepto, obró en mí toda clase de concupiscencias. Sin la ley, el pecado es cosa muerta. Un tiempo vivía yo sin estar\nsometido a la ley; sobreviniendo luego el precepto, tomó vida el pecado, y yo incurrí en muerte; me encontré con que el precepto, que debía llevarme a la vida, me había llevado a la muerte.\nEn efecto,\nel pecado, instigado por el precepto, me sedujo; y por él me dio la muerte.\nEn resumen, quedamos en que la ley es santa y el precepto santo, justo y bueno. Pero, ¿voy a sacar en conclusión que lo que era bueno\nllegó a ser muerte para mí? Nada de eso. Sino que el pecado, para mostrarse verdaderamente tal, sirviéndose de lo que era bueno, me causó la muerte. Así el pecado, al servirse del precepto, aumentó su\nmalicia sobre toda medida.",
        respCita: "7, 6; 5, 5b",
        respR1: "Nos hemos desprendido de la ley, muriendo para aquello en que estábamos presos; * sirvamos a Dios en la novedad del espíritu y no en la vejez de la letra.",
        respV: "El amor de Dios ha sido derramado en nuestros corazones con el Espíritu Santo que se nos ha dado.",
        respR2: "Sirvamos a Dios en la novedad del espíritu y no en la vejez de la letra.",
        audioUrl: "https://to.resucito.do/s02/viernes/lectura1.mp3"
    },
    {
        id: "tos2OFvi_lec2",
        varName: "tos2OFvi_lec2",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "2",
        dia: "viernes",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Viernes Semana 2",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "De los Capítulos de Diadoco de Foticé, obispo, Sobre la perfección espiritual\n(Capítulos 12. 13. 14: PG 65, 1171-1172)",
        descripcion: "HAY QUE AMAR SOLAMENTE A DIOS",
        texto: "El que se ama a sí mismo no puede amar a Dios; en cambio, el que, movido por la superior excelencia de las riquezas del amor a Dios, deja de amarse a sí mismo ama a Dios. Y como consecuencia ya no busca nunca su propia\ngloria, sino más bien la gloria de Dios. El que se ama a sí mismo busca su propia gloria, pero el que ama a Dios desea la gloria de su Hacedor.\nEn efecto, es propio del alma que siente el amor a Dios buscar siempre y en\ntodas sus obras la gloria de Dios y deleitarse en su propia sumisión a él, ya que la gloria conviene a la magnificencia de Dios; al hombre, en cambio, le conviene la humildad, la cual nos hace entrar a formar parte de la familia\nde Dios. Si de tal modo obramos, poniendo nuestra alegría en la gloria del Señor, no nos cansaremos de repetir, a ejemplo de Juan Bautista: Es preciso que él crezca y que yo disminuya.\nSé de cierta persona\nque, aunque se lamentaba de no amar a Dios como ella hubiera querido, sin embargo lo amaba de tal manera que el mayor deseo de su alma consistía en que Dios fuera glorificado en ella y que ella fuese tenida en nada. El que así\npiensa no se deja impresionar por las palabras de alabanza, pues sabe lo que es en realidad; al contrario, por su gran amor a la humildad, no piensa en su propia dignidad, aunque fuese el caso que sirviese a Dios en calidad de sacerdote; su\ndeseo de amar a Dios hace que se vaya olvidando poco a poco de su dignidad y que extinga en las profundidades de su amor a Dios, por el espíritu de humildad, la jactancia que su dignidad pudiese ocasionar, de modo que llega a\nconsiderarse siempre a sí mismo como un siervo inútil, sin pensar para nada en su dignidad, por su amor a la humildad. Lo mismo debemos hacer también nosotros, rehuyendo todo honor y toda gloria, movidos por la superior\nexcelencia de las riquezas del amor a Dios, que nos ha amado de verdad.\nDios conoce a los que lo aman sinceramente, porque cada cual lo ama según la capacidad de amor que hay en su interior. Por tanto, el que así obra\ndesea con ardor que la luz de este conocimiento divino penetre hasta lo más íntimo de su ser, llegando a olvidarse de sí mismo, transformado todo él por el amor.\nEl que es así transformado vive y no\nvive; pues, mientras vive en su cuerpo, el amor lo mantiene en un continuo peregrinar hacia Dios; su corazón, encendido en el ardiente fuego del amor, está unido a Dios por la llama del deseo y su amor a Dios le hace olvidarse\ncompletamente del amor a sí mismo, pues, como dice el Apóstol, si nos hemos portado como faltos de juicio, ha sido por Dios; si ahora somos razonables, es por vuestro bien.",
        respCita: "Jn 3, 16; 1Jn 4, 10",
        respR1: "Tanto amó Dios al mundo que le entregó su Hijo único, * para que todo el que crea en él no perezca, sino que tenga vida eterna.",
        respV: "En esto consiste el amor: no en que nosotros hayamos amado a Dios, sino en que él nos amó.",
        respR2: "Para que todo el que crea en él no perezca, sino que tenga vida eterna.\n\nOREMOS,\nDios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que\nvive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos.\nAmén\n\nV. Bendigamos al Señor.\nR. Demos gracias a Dios.\n&#8593; Of La Tr Sx Nn Vs Cm &#8595;",
        audioUrl: "https://to.resucito.do/s02/viernes/lecturas.mp3"
    },
    {
        id: "tos2OFsa_lec1_par",
        varName: "tos2OFsa_lec1_par",
        tipo: "lectura1_par",
        tiempo: "ordinario",
        semana: "2",
        dia: "sabado",
        libro: "oficio",
        titulo: "1ª Lectura - Sábado Semana 2 (Año Par)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "Del libro del Génesis 17, 1-27",
        descripcion: "LA CIRCUNCISIÓN, SEÑAL DEL PACTO ENTRE DIOS Y ABRAHAM",
        texto: "Cuando Abram tenía noventa y nueve años, se le apareció el Señor y le dijo:\n«Yo soy el Dios Todopoderoso. Camina en mi presencia con lealtad. Estableceré mi alianza contigo y te\nmultiplicaré en modo extraordinariamente grande.»\nAbram cayó de bruces, y Dios le dijo:\n«Mira, éste es mi pacto contigo: Serás padre de muchedumbre de pueblos; ya no te llamarás\nAbram, sino Abraham, porque te hago padre de muchedumbre de pueblos. Te haré crecer sin medida, sacando pueblos de ti, y reyes nacerán de ti. Cumpliré mi pacto contigo y con tu descendencia en futuras generaciones, como\npacto perpetuo. Seré tu Dios y el de tus descendientes futuros. Os daré a ti y a tu descendencia futura la tierra en que peregrinas (la tierra de Canaán), como posesión perpetua; y seré su Dios.»\nEl\nSeñor añadió a Abraham:\n«Tú guarda mi pacto, que hago contigo y tus descendientes por generaciones. Éste es el pacto que hago con vosotros y con tus descendientes, y que habéis de guardar:\ncircuncidad a todos vuestros varones; circuncidaréis la carne del prepucio, y será una señal de mi pacto con vosotros. A los ocho días de nacer, todos vuestros varones, de cada generación, serán\ncircuncidados; también los esclavos nacidos en casa o comprados a extranjeros que no sean de vuestra raza. Circuncidad a los esclavos nacidos en casa o comprados. Así llevaréis en la carne mi pacto como pacto perpetuo.\nTodo varón incircunciso, que no ha circuncidado la carne de su prepucio, será apartado de su pueblo, por haber quebrantado mi pacto.»\nEl Señor dijo a Abraham:\n«Saray, tu mujer, ya no se\nllamará Saray, sino que se llamará Sara. La bendeciré, y te dará un hijo, y lo bendeciré; de ella nacerán pueblos y reyes de naciones.»\nAbraham cayó rostro en tierra y se dijo,\nsonriendo: «¿Un centenario va a tener un hijo, y Sara va a dar a luz a los noventa?»\nY Abraham dijo a Dios:\n«Me contento con que conserves sano a Ismael en tu presencia.»\nDios replicó:\n«No;\nes Sara quien te va a dar un hijo; lo llamarás Isaac; con él estableceré mi pacto y con sus descendientes, un pacto perpetuo. En cuanto a Ismael, escucho tu petición: lo bendeciré, lo haré fecundo, lo\nharé crecer en extremo, engendrará doce príncipes y se hará un pueblo numeroso. Pero mi pacto lo establezco con Isaac, el hijo que te dará Sara, el año que viene por estas fechas.»\nCuando\nel Señor terminó de hablar con Abraham, se retiró. Entonces, Abraham tomó a su hijo Ismael, a los esclavos nacidos en casa o comprados, a todos los varones de la casa de Abraham, y les circuncidó la carne del\nprepucio aquel mismo día, como se lo había mandado Dios.\nAbraham tenía noventa y nueve años cuando circuncidó la carne de su prepucio; Ismael tenía trece años cuando se circuncidó\nla carne de su prepucio. Aquel mismo día, se circuncidaron Abraham y su hijo Ismael. Y todos los varones de casa, nacidos en casa o comprados a extranjeros, se circuncidaron con él.",
        respCita: "Gn 17, 16. 19; cf. Lc 1, 32. 33",
        respR1: "La bendeciré, y te dará un hijo, y lo bendeciré; * con él estableceré mi pacto, un pacto perpetuo.",
        respV: "Será grande, se llamará hijo del Altísimo y reinará para siempre.",
        respR2: "Con él estableceré mi pacto, un pacto perpetuo.",
        audioUrl: "https://to.resucito.do/s02/sabado/lectura2.mp3"
    },
    {
        id: "tos2OFsa_lec1_impar",
        varName: "tos2OFsa_lec1_impar",
        tipo: "lectura1_impar",
        tiempo: "ordinario",
        semana: "2",
        dia: "sabado",
        libro: "oficio",
        titulo: "1ª Lectura - Sábado Semana 2 (Año Impar)",
        epigrafeTipo: "PRIMERA LECTURA",
        cita: "De la carta a los Romanos 7, 14-25",
        descripcion: "ME ENCUENTRO SOMETIDO A LA DEBILIDAD HUMANA Y VENDIDO A LA ACCIÓN DEL PECADO",
        texto: "Hermanos: La ley, como ya lo sabemos, es de orden espiritual; pero yo me encuentro dentro del orden natural, sometido a la debilidad humana y vendido a la acción del pecado. No me explico lo que hago; porque no pongo por obra lo que\nquisiera, sino que ejecuto lo que aborrezco. Y aunque hago lo que no quisiera, reconozco que la ley es buena. Pero, en este caso, ya no soy yo quien lo pone por obra, sino el pecado que mora en mí.\nYa sé que en mí,\nes decir, dentro de mi estado puramente natural, no habita lo bueno; porque el querer está a mi disposición, pero no lo está el ponerlo por obra. En efecto, no hago el bien que quisiera, sino el mal que no quisiera. Y, si\npongo por obra lo que no quisiera, ya no soy yo quien lo hace, sino el pecado que habita en mí. Así que compruebo esta experiencia: que, aunque quisiera practicar el bien, se encuentra en mí el mal.\nSegún el\nhombre interior, me complazco en la ley de Dios; pero siento otra ley en mis miembros, que va luchando contra la ley de mi razón y me va encadenando a la ley del pecado que está en mis miembros.\n¡Desdichado de\nmí! ¿Quién me librará de este cuerpo de muerte? ¡Gracias a Dios, por Jesucristo, Señor nuestro, me veré libre! Así, pues, yo con mi razón sirvo a la ley de Dios; pero, dentro de mi\nestado puramente natural, sirvo a la ley del pecado.",
        respCita: "Ga 5, 18. 22. 25",
        respR1: "Si os dejáis guiar por el Espíritu, ya no estáis bajo la ley. * El fruto del Espíritu es: amor, alegría y paz.",
        respV: "Si vivimos por el Espíritu marchemos tras el Espíritu.",
        respR2: "El fruto del Espíritu es: amor, alegría y paz.",
        audioUrl: "https://to.resucito.do/s02/sabado/lectura1.mp3"
    },
    {
        id: "tos2OFsa_lec2",
        varName: "tos2OFsa_lec2",
        tipo: "lectura2",
        tiempo: "ordinario",
        semana: "2",
        dia: "sabado",
        libro: "oficio",
        titulo: "2ª Lectura Patrística - Sábado Semana 2",
        epigrafeTipo: "SEGUNDA LECTURA",
        cita: "Del Tratado de san Ireneo, obispo, Contra las herejías\n(Libro 4, 18, 1-2. 4. 5: SC 100, 596-598. 606. 610-612)",
        descripcion: "LA OBLACIÓN PURA DE LA IGLESIA",
        texto: "El sacrificio puro y acepto a Dios es la oblación de la Iglesia, que el Señor mandó que se ofreciera en todo el mundo, no porque Dios necesite nuestro sacrificio, sino porque el que ofrece es glorificado él\nmismo en lo que ofrece, con tal de que sea aceptada su ofrenda. La ofrenda que hacemos al rey es una muestra de honor y de afecto; y el Señor nos recordó que debemos ofrecer nuestras ofrendas con toda sinceridad e inocencia,\ncuando dijo: Si al llevar tu ofrenda al altar te acuerdas que un hermano tuyo tiene algo contra ti, deja allí tu ofrenda ante el altar, y ve primero a reconciliarte con tu hermano; vuelve luego y presenta tu ofrenda. Hay que ofrecer a\nDios las primicias de su creación, como dice Moisés: No te presentarás al Señor tu Dios con las manos vacías; de este modo el hombre, hallado grato en aquellas mismas cosas que a él le son gratas, es\nhonrado por parte de Dios.\nY no hemos de pensar que haya sido abolida toda clase de oblación, pues las oblaciones continúan en vigor ahora como antes: el antiguo pueblo de Dios ofrecía sacrificios y la Iglesia los\nofrece también. Lo que ha cambiado es la forma de la oblación, puesto que los que ofrecen no son ya siervos, sino hombres libres. El Señor es uno y el mismo, pero es distinto el carácter de la oblación,\nsegún sea ofrecida por siervos o por hombres libres; así la oblación demuestra el grado de libertad. Por lo que se refiere a Dios nada hay sin sentido, nada que no tenga su significado y su razón de ser. Y por esto\nlos antiguos hombres debían consagrarle los diezmos de sus bienes; pero nosotros, que ya hemos alcanzado la libertad, ponemos al servicio del Señor la totalidad de nuestros bienes, dándolos con libertad y alegría,\naun los de más valor, pues lo que esperamos vale más que todos ellos; echamos en el cepillo de Dios todo nuestro sustento, imitando así el desprendimiento de aquella viuda pobre del evangelio.\nEs necesario, por\ntanto, que presentemos nuestra ofrenda a Dios y que le seamos gratos en todo, ofreciéndole con mente sincera, con fe sin mezcla de engaño, con firme esperanza, con amor ferviente, las primicias de su creación. Esta\noblación pura sólo la Iglesia puede ofrecerla a su Hacedor, ofreciéndole con acción de gracias del fruto de su creación.\nLe ofrecemos, en efecto, lo que es suyo, significando con nuestra ofrenda\nnuestra unión y mutua comunión, y proclamando nuestra fe en la resurrección de la carne y del espíritu. Pues del mismo modo que el pan, fruto de la tierra, cuando recibe la invocación divina, deja de ser pan\ncomún y corriente y se convierte en eucaristía, compuesta de dos realidades, terrena y celestial, así también nuestros cuerpos, cuando reciben la eucaristía, dejan ya de ser corruptibles, pues tienen la\nesperanza de la resurrección.",
        respCita: "Hb 10, 1. 14; Ef 5, 2",
        respR1: "La ley contiene sólo una sombra, no la realidad misma de las cosas; por eso, mediante unos mismos sacrificios que se ofrecen sin cesar, no puede de ninguna manera dar la perfección a quienes\nbuscan acercarse a Dios. Cristo, en cambio, * con una sola oblación, ha llevado para siempre a la perfección a los que ha santificado.",
        respV: "Él nos amó y se entregó por nosotros a Dios como oblación de suave fragancia.",
        respR2: "Con una sola oblación, ha llevado para siempre a la perfección a los que ha santificado.\n\nOREMOS,\nDios todopoderoso y eterno, que gobiernas a un tiempo cielo y tierra, escucha paternalmente las súplicas de tu pueblo y haz que los días de nuestra vida transcurran en tu paz. Por nuestro Señor Jesucristo, tu Hijo, que\nvive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos.\nAmén\n\nV. Bendigamos al Señor.\nR. Demos gracias a Dios.\n&#8593; Of La Tr Sx Nn Vs Cm &#8595;",
        audioUrl: "https://to.resucito.do/s02/sabado/lecturas.mp3"
    }
];

export class LecturasDB {
    static getCatalogo() {
        const catalogo = [...CATALOGO_LECTURAS_SEED];
        if (typeof localStorage !== 'undefined') {
            const cache = localStorage.getItem('lh_lecturas_cache');
            if (cache) {
                try {
                    const parsed = JSON.parse(cache);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        const seedIds = new Set(catalogo.map(x => x.id));
                        for (const item of parsed) {
                            if (!seedIds.has(item.id)) {
                                catalogo.push(item);
                            }
                        }
                    }
                } catch (e) {}
            }
        }
        return catalogo;
    }

    static obtener(id) {
        if (!id) return null;
        const catalogo = this.getCatalogo();
        return catalogo.find(item => item.id === id) || null;
    }

    static obtenerLectura1(tiempo = 'ordinario', semana = '1', dia = 'domingo', anioPar = true) {
        const catalogo = this.getCatalogo();
        const semNum = parseInt(String(semana).replace(/[^0-9]/g, ''), 10) || 1;
        const tipoBuscado = anioPar ? 'lectura1_par' : 'lectura1_impar';

        let diaNorm = String(dia || '').toLowerCase().trim();
        const mapD = { do: 'domingo', lu: 'lunes', ma: 'martes', mi: 'miercoles', ju: 'jueves', vi: 'viernes', sa: 'sabado' };
        if (mapD[diaNorm]) diaNorm = mapD[diaNorm];

        let tNorm = String(tiempo || 'ordinario').toLowerCase().replace(/tiempo\s*/i, '').trim();
        const mapT = { to: 'ordinario', ta: 'adviento', tn: 'navidad', tc: 'cuaresma', tp: 'pascua', san: 'santos' };
        if (mapT[tNorm]) tNorm = mapT[tNorm];

        // 1. Coincidencia por celebración específica (ej. Bautismo del Señor)
        if (diaNorm.includes('bautismo')) {
            const espBautismo = catalogo.find(x => 
                (x.celebracion === 'elbautismodelSeñor' || x.id.includes('tos1OFdo_lec1')) &&
                x.tipo === tipoBuscado
            ) || catalogo.find(x => 
                (x.celebracion === 'elbautismodelSeñor' || x.id.includes('tos1OFdo_lec1')) &&
                (x.tipo === tipoBuscado || x.tipo === 'lectura1')
            );
            if (espBautismo) return espBautismo;
        }

        // 2. Coincidencia exacta de tiempo, semana, día y tipo par/impar específico
        let encontrada = catalogo.find(x => 
            (x.tiempo === tNorm || x.tiempo === tiempo) &&
            (parseInt(String(x.semana).replace(/[^0-9]/g, ''), 10) || 1) === semNum &&
            String(x.dia || '').toLowerCase() === diaNorm &&
            x.tipo === tipoBuscado
        );

        if (encontrada) return encontrada;

        // 2b. Coincidencia con tipo 'lectura1' genérica para ese día
        encontrada = catalogo.find(x => 
            (x.tiempo === tNorm || x.tiempo === tiempo) &&
            (parseInt(String(x.semana).replace(/[^0-9]/g, ''), 10) || 1) === semNum &&
            String(x.dia || '').toLowerCase() === diaNorm &&
            x.tipo === 'lectura1'
        );

        if (encontrada) return encontrada;

        // 3. Si no encuentra con par/impar, buscar cualquier lectura1 para ese día
        encontrada = catalogo.find(x => 
            (x.tiempo === tNorm || x.tiempo === tiempo) &&
            (parseInt(String(x.semana).replace(/[^0-9]/g, ''), 10) || 1) === semNum &&
            String(x.dia || '').toLowerCase() === diaNorm &&
            (x.tipo?.startsWith('lectura1') || x.tipo === 'biblica')
        );

        if (encontrada) return encontrada;

        // 4. Fallback al primer elemento del tipo buscado (par/impar)
        const fallbackTipo = catalogo.find(x => x.tipo === tipoBuscado);
        if (fallbackTipo) return fallbackTipo;

        return catalogo.find(x => x.tipo?.startsWith('lectura1') || x.tipo === 'biblica') || CATALOGO_LECTURAS_SEED[0];
    }

    static obtenerLectura2(tiempo = 'ordinario', semana = '1', dia = 'domingo') {
        const catalogo = this.getCatalogo();
        const semNum = parseInt(String(semana).replace(/[^0-9]/g, ''), 10) || 1;

        let diaNorm = String(dia || '').toLowerCase().trim();
        const mapD = { do: 'domingo', lu: 'lunes', ma: 'martes', mi: 'miercoles', ju: 'jueves', vi: 'viernes', sa: 'sabado' };
        if (mapD[diaNorm]) diaNorm = mapD[diaNorm];

        let tNorm = String(tiempo || 'ordinario').toLowerCase().replace(/tiempo\s*/i, '').trim();
        const mapT = { to: 'ordinario', ta: 'adviento', tn: 'navidad', tc: 'cuaresma', tp: 'pascua', san: 'santos' };
        if (mapT[tNorm]) tNorm = mapT[tNorm];

        // 1. Coincidencia por celebración específica (ej. Bautismo del Señor, santos)
        let encontrada = catalogo.find(x => 
            (x.celebracion && diaNorm.includes(x.celebracion.toLowerCase())) ||
            (diaNorm.includes('bautismo') && (x.id.includes('bautismo') || x.id.includes('nacianzo') || x.celebracion === 'elbautismodelSeñor'))
        );
        if (encontrada) return encontrada;

        // 2. Coincidencia de tiempo, semana y día
        encontrada = catalogo.find(x => 
            (x.tiempo === tNorm || x.tiempo === tiempo) &&
            (parseInt(String(x.semana).replace(/[^0-9]/g, ''), 10) || 1) === semNum &&
            String(x.dia || '').toLowerCase() === diaNorm &&
            (x.tipo === 'lectura2' || x.tipo === 'patristica')
        );

        if (encontrada) return encontrada;

        // 3. Si es Bautismo del Señor o semana 1 domingo, devolver San Gregorio de Nacianzo si existe
        if (diaNorm.includes('bautismo') || (tNorm === 'ordinario' && semNum === 1 && diaNorm === 'domingo')) {
            const nacianzo = catalogo.find(x => x.id === 'tos1OFdo_lec2_nacianzo' || x.id.includes('nacianzo'));
            if (nacianzo) return nacianzo;
        }

        return catalogo.find(x => x.tipo === 'lectura2' || x.tipo === 'patristica') || CATALOGO_LECTURAS_SEED.find(x => x.tipo === 'lectura2');
    }

    static obtenerTodos() {
        return this.getCatalogo();
    }
}

if (typeof window !== 'undefined') {
    window.LecturasDB = LecturasDB;
    window.CATALOGO_LECTURAS_SEED = CATALOGO_LECTURAS_SEED;
}
