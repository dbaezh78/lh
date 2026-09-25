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
];

export class LecturasDB {
    static getCatalogo() {
        if (typeof localStorage !== 'undefined') {
            const cache = localStorage.getItem('lh_lecturas_cache');
            if (cache) {
                try {
                    const parsed = JSON.parse(cache);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                } catch (e) {}
            }
        }
        return CATALOGO_LECTURAS_SEED;
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

        // 1. Coincidencia exacta de tiempo, semana, día y tipo par/impar
        let encontrada = catalogo.find(x => 
            x.tiempo === tiempo &&
            (parseInt(String(x.semana).replace(/[^0-9]/g, ''), 10) || 1) === semNum &&
            x.dia === dia &&
            (x.tipo === tipoBuscado || x.tipo === 'lectura1')
        );

        if (encontrada) return encontrada;

        // 2. Si no encuentra con par/impar, buscar cualquier lectura1 para ese día
        encontrada = catalogo.find(x => 
            x.tiempo === tiempo &&
            (parseInt(String(x.semana).replace(/[^0-9]/g, ''), 10) || 1) === semNum &&
            x.dia === dia &&
            (x.tipo?.startsWith('lectura1'))
        );

        if (encontrada) return encontrada;

        // 3. Fallback al primer elemento lectura1 disponible
        return catalogo.find(x => x.tipo?.startsWith('lectura1')) || CATALOGO_LECTURAS_SEED[0];
    }

    static obtenerLectura2(tiempo = 'ordinario', semana = '1', dia = 'domingo') {
        const catalogo = this.getCatalogo();
        const semNum = parseInt(String(semana).replace(/[^0-9]/g, ''), 10) || 1;

        let encontrada = catalogo.find(x => 
            x.tiempo === tiempo &&
            (parseInt(String(x.semana).replace(/[^0-9]/g, ''), 10) || 1) === semNum &&
            x.dia === dia &&
            x.tipo === 'lectura2'
        );

        if (encontrada) return encontrada;

        return catalogo.find(x => x.tipo === 'lectura2') || CATALOGO_LECTURAS_SEED.find(x => x.tipo === 'lectura2');
    }

    static obtenerTodos() {
        return this.getCatalogo();
    }
}
