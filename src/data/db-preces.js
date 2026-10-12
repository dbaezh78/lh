/**
 * db-preces.js
 * Catálogo Canónico y Repositorio de Preces Litúrgicas (Intercesiones)
 * 
 * Estructura estándar:
 * - id: Identificador único (ej: tos1lalu, tos2LAdo, bautismoLA)
 * - titulo: Nombre canónico descriptivo
 * - tiempo: ordinario | adviento | navidad | cuaresma | pascua | santos
 * - semana: número de semana ('1', '2', ...)
 * - dia: domingo | lunes | martes | miercoles | jueves | viernes | sabado
 * - libro: laudes | visperas
 * - intro: Invocación inicial o llamamiento a la oración
 * - respuesta: Aclamación o súplica del pueblo (en negrita)
 * - intenciones: Array de estrofas con las peticiones
 * - libre: Rúbrica en rojo 'Se pueden añadir algunas intenciones libres'
 * - concl: Invitación a la oración dominical (Padre Nuestro)
 */

export const CATALOGO_PRECES_SEED = [
    {
        "id": "tos1LAdo",
        "varName": "tos1LAdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Domingo / Bautismo (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "domingo",
        "libro": "laudes",
        "intro": "Roguemos a nuestro Redentor, bautizado por Juan en el Jordán, y digámosle:",
        "respuesta": "Señor, ten piedad.",
        "intenciones": [
            "Cristo Jesús, que al manifestarte al mundo has iluminado a todos los hombres, concede luz abundante a cuantos hoy se relacionen con nosotros.",
            "Cristo Jesús, que para enseñarnos un camino de humildad te humillaste recibiendo el bautismo de Juan, danos un espíritu de humilde servicio para con todos los hombres.",
            "Cristo Jesús, que por tu bautismo nos purificaste de todo pecado y nos hiciste hijos del Padre, concede el espíritu de adopción a todos los que buscan a Dios con sinceridad.",
            "Cristo Jesús, que en tu bautismo abriste una puerta de salvación para los cristianos y santificaste la creación entera, haz de todos nosotros ministros de tu Evangelio en el mundo.",
            "Cristo Jesús, que en tu bautismo nos revelaste a la Trinidad, renueva el espíritu de adopción y el sacerdocio real de los bautizados."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Gracias a Jesucristo somos hijos de Dios; por eso nos atrevemos a decir:",
        "textoCompleto": "Roguemos a nuestro Redentor, bautizado por Juan en el Jordán, y digámosle:\r\n\r\nSeñor, ten piedad.\r\n\r\nCristo Jesús, que al manifestarte al mundo has iluminado a todos los hombres, concede luz abundante a cuantos hoy se relacionen con nosotros.\r\n\r\nCristo Jesús, que para enseñarnos un camino de humildad te humillaste recibiendo el bautismo de Juan, danos un espíritu de humilde servicio para con todos los hombres.\r\n\r\nCristo Jesús, que por tu bautismo nos purificaste de todo pecado y nos hiciste hijos del Padre, concede el espíritu de adopción a todos los que buscan a Dios con sinceridad.\r\n\r\nCristo Jesús, que en tu bautismo abriste una puerta de salvación para los cristianos y santificaste la creación entera, haz de todos nosotros ministros de tu Evangelio en el mundo.\r\n\r\nCristo Jesús, que en tu bautismo nos revelaste a la Trinidad, renueva el espíritu de adopción y el sacerdocio real de los bautizados."
    },
    {
        "id": "tps1jslaud",
        "varName": "tps1jslaud",
        "titulo": "Preces de Pascua - Semana 1 - Jueves (Laudes)",
        "tiempo": "pascua",
        "semana": "1",
        "dia": "jueves",
        "libro": "laudes",
        "intro": "Glorifiquemos a Cristo resucitado y siempre presente en su Iglesia, y supliquémosle, diciendo:",
        "respuesta": "Quédate con nosotros, Señor.",
        "intenciones": [
            "Señor Jesús, vencedor del pecado y de la muerte,\r\npermanece en medio de nosotros, tú que vives por los siglos de los siglos.",
            "Señor, ven a nosotros con tu poder invencible\r\ny muéstranos la bondad de Dios Padre.",
            "Señor, ayuda al mundo abrumado por las discordias,\r\nya que tú solo tienes el poder de salvar y reconciliar.",
            "Confírmanos en la fe de la victoria final\r\ny arraiga en nosotros la esperanza de tu manifestación gloriosa."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Porque Jesucristo nos ha hecho participar de su propia vida, somos hijos de Dios, y por ello nos atrevemos a decir:",
        "textoCompleto": "Glorifiquemos a Cristo resucitado y siempre presente en su Iglesia, y supliquémosle, diciendo:\r\n\r\nQuédate con nosotros, Señor.\r\n\r\nSeñor Jesús, vencedor del pecado y de la muerte,\r\npermanece en medio de nosotros, tú que vives por los siglos de los siglos.\r\n\r\nSeñor, ven a nosotros con tu poder invencible\r\ny muéstranos la bondad de Dios Padre.\r\n\r\nSeñor, ayuda al mundo abrumado por las discordias,\r\nya que tú solo tienes el poder de salvar y reconciliar.\r\n\r\nConfírmanos en la fe de la victoria final\r\ny arraiga en nosotros la esperanza de tu manifestación gloriosa."
    },
    {
        "id": "bautismoLA",
        "varName": "bautismoLA",
        "titulo": "Bautismo del Señor - Domingo (Laudes)",
        "tiempo": "navidad",
        "semana": "2",
        "dia": "domingo",
        "libro": "laudes",
        "intro": "Roguemos a nuestro Redentor, bautizado por Juan en el Jordán, y digámosle:",
        "respuesta": "Señor, ten piedad.",
        "intenciones": [
            "Cristo Jesús, que al manifestarte al mundo has iluminado a todos los hombres, concede luz abundante a cuantos hoy se relacionen con nosotros.",
            "Cristo Jesús, que para enseñarnos un camino de humildad te humillaste recibiendo el bautismo de Juan, danos un espíritu de humilde servicio para con todos los hombres.",
            "Cristo Jesús, que por tu bautismo nos purificaste de todo pecado y nos hiciste hijos del Padre, concede el espíritu de adopción a todos los que buscan a Dios con sinceridad.",
            "Cristo Jesús, que en tu bautismo abriste una puerta de salvación para los cristianos y santificaste la creación entera, haz de todos nosotros ministros de tu Evangelio en el mundo.",
            "Cristo Jesús, que en tu bautismo nos revelaste a la Trinidad, renueva el espíritu de adopción y el sacerdocio real de los bautizados."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Gracias a Jesucristo somos hijos de Dios; por eso nos atrevemos a decir:",
        "textoCompleto": "Roguemos a nuestro Redentor, bautizado por Juan en el Jordán, y digámosle:\r\n\r\nSeñor, ten piedad.\r\n\r\nCristo Jesús, que al manifestarte al mundo has iluminado a todos los hombres, concede luz abundante a cuantos hoy se relacionen con nosotros.\r\n\r\nCristo Jesús, que para enseñarnos un camino de humildad te humillaste recibiendo el bautismo de Juan, danos un espíritu de humilde servicio para con todos los hombres.\r\n\r\nCristo Jesús, que por tu bautismo nos purificaste de todo pecado y nos hiciste hijos del Padre, concede el espíritu de adopción a todos los que buscan a Dios con sinceridad.\r\n\r\nCristo Jesús, que en tu bautismo abriste una puerta de salvación para los cristianos y santificaste la creación entera, haz de todos nosotros ministros de tu Evangelio en el mundo.\r\n\r\nCristo Jesús, que en tu bautismo nos revelaste a la Trinidad, renueva el espíritu de adopción y el sacerdocio real de los bautizados."
    },
    {
        "id": "tos2LAdo",
        "varName": "tos2LAdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Domingo (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "domingo",
        "libro": "laudes",
        "intro": "Invoquemos, hermanos, a nuestro Salvador, que ha venido al mundo para ser «Dios-con-nosotros», y digámosle confiadamente:",
        "respuesta": "Señor Jesús, rey de la gloria, sé tú nuestra luz y nuestro gozo.",
        "intenciones": [
            "Señor Jesús, sol que nace de lo alto y primicia de la humanidad resucitada,\r\nhaz que siguiéndote a ti no caminemos nunca en sombras de muerte, sino que tengamos siempre la luz de la vida.",
            "Que sepamos descubrir, Señor, cómo todas las creaturas están llenas de tus perfecciones,\r\npara que así, en todas ellas, sepamos contemplarte a ti.",
            "No permitas, Señor, que hoy nos dejemos vencer por el mal,\r\nantes danos tu fuerza para que venzamos al mal a fuerza del bien.",
            "Tú que, bautizado por Juan en el Jordán, fuiste ungido con el Espíritu Santo,\r\nasístenos durante este día para que actuemos movidos por este mismo Espíritu."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Por Jesús nos llamamos y somos hijos de Dios; por ello nos atrevemos a decir:",
        "textoCompleto": "Invoquemos, hermanos, a nuestro Salvador, que ha venido al mundo para ser «Dios-con-nosotros», y digámosle confiadamente:\r\n\r\nSeñor Jesús, rey de la gloria, sé tú nuestra luz y nuestro gozo.\r\n\r\nSeñor Jesús, sol que nace de lo alto y primicia de la humanidad resucitada,\r\nhaz que siguiéndote a ti no caminemos nunca en sombras de muerte, sino que tengamos siempre la luz de la vida.\r\n\r\nQue sepamos descubrir, Señor, cómo todas las creaturas están llenas de tus perfecciones,\r\npara que así, en todas ellas, sepamos contemplarte a ti.\r\n\r\nNo permitas, Señor, que hoy nos dejemos vencer por el mal,\r\nantes danos tu fuerza para que venzamos al mal a fuerza del bien.\r\n\r\nTú que, bautizado por Juan en el Jordán, fuiste ungido con el Espíritu Santo,\r\nasístenos durante este día para que actuemos movidos por este mismo Espíritu."
    },
    {
        "id": "tos3LAdo",
        "varName": "tos3LAdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Domingo (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "domingo",
        "libro": "laudes",
        "intro": "Invoquemos a Dios Padre que envió al Espíritu Santo, para que con su luz santísima penetrara las almas de sus fieles, y digámosle:",
        "respuesta": "Ilumina, Señor, a tu pueblo.",
        "intenciones": [
            "Te bendecimos, Señor, luz nuestra,\r\nporque a gloria de tu nombre nos has hecho llegar a este nuevo día.",
            "Tú que por la resurrección de tu Hijo quisiste iluminar el mundo,\r\nhaz que tu Iglesia difunda entre todos los hombres la alegría pascual.",
            "Tú que por el Espíritu de la verdad adoctrinaste a los discípulos de tu Hijo,\r\nenvía este mismo Espíritu a tu Iglesia para que permanezca siempre fiel a ti.",
            "Tú que eres luz para todos los hombres, acuérdate de los que viven aún en las tinieblas\r\ny abre los ojos de su mente para que te reconozcan a ti, único Dios verdadero."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Por Jesús hemos sido hechos hijos de Dios; por esto nos atrevemos a decir:",
        "textoCompleto": "Invoquemos a Dios Padre que envió al Espíritu Santo, para que con su luz santísima penetrara las almas de sus fieles, y digámosle:\r\n\r\nIlumina, Señor, a tu pueblo.\r\n\r\nTe bendecimos, Señor, luz nuestra,\r\nporque a gloria de tu nombre nos has hecho llegar a este nuevo día.\r\n\r\nTú que por la resurrección de tu Hijo quisiste iluminar el mundo,\r\nhaz que tu Iglesia difunda entre todos los hombres la alegría pascual.\r\n\r\nTú que por el Espíritu de la verdad adoctrinaste a los discípulos de tu Hijo,\r\nenvía este mismo Espíritu a tu Iglesia para que permanezca siempre fiel a ti.\r\n\r\nTú que eres luz para todos los hombres, acuérdate de los que viven aún en las tinieblas\r\ny abre los ojos de su mente para que te reconozcan a ti, único Dios verdadero."
    },
    {
        "id": "tos4LAdo",
        "varName": "tos4LAdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Domingo (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "domingo",
        "libro": "laudes",
        "intro": "Dios nos ama y sabe lo que nos hace falta; invoquémosle, pues, diciendo:",
        "respuesta": "Te bendecimos y en ti confiamos, Señor.",
        "intenciones": [
            "Te alabamos, Dios todopoderoso, Rey del universo, porque a nosotros, injustos y pecadores, nos has llamado al conocimiento de la verdad;\r\nhaz que te sirvamos con santidad y justicia.",
            "Vuélvete hacia nosotros, Señor, tú que has querido abrirnos la puerta de tu misericordia,\r\ny haz que nunca nos apartemos del camino que lleva a la vida.",
            "Ya que hoy celebramos la resurrección del Hijo de tu amor,\r\nhaz que este día transcurra lleno de gozo espiritual.",
            "Da, Señor, a tus fieles el espíritu de oración y de alabanza,\r\npara que en toda ocasión te demos gracias."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Movidos ahora todos por el mismo Espíritu que nos da Cristo resucitado acudamos a Dios, de quien somos verdaderos hijos, diciendo:",
        "textoCompleto": "Dios nos ama y sabe lo que nos hace falta; invoquémosle, pues, diciendo:\r\n\r\nTe bendecimos y en ti confiamos, Señor.\r\n\r\nTe alabamos, Dios todopoderoso, Rey del universo, porque a nosotros, injustos y pecadores, nos has llamado al conocimiento de la verdad;\r\nhaz que te sirvamos con santidad y justicia.\r\n\r\nVuélvete hacia nosotros, Señor, tú que has querido abrirnos la puerta de tu misericordia,\r\ny haz que nunca nos apartemos del camino que lleva a la vida.\r\n\r\nYa que hoy celebramos la resurrección del Hijo de tu amor,\r\nhaz que este día transcurra lleno de gozo espiritual.\r\n\r\nDa, Señor, a tus fieles el espíritu de oración y de alabanza,\r\npara que en toda ocasión te demos gracias."
    },
    {
        "id": "tos5LAdo",
        "varName": "tos5LAdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 5 - Domingo (Laudes)",
        "tiempo": "ordinario",
        "semana": "5",
        "dia": "domingo",
        "libro": "laudes",
        "intro": "Glorifiquemos al Señor Jesús, luz que alumbra a todo hombre y sol de justicia que no conoce el ocaso, y digámosle:",
        "respuesta": "Tú que eres nuestra vida y nuestra salvación, Señor, ten piedad.",
        "intenciones": [
            "Creador de la luz, de cuya bondad recibimos, con acción de gracias, las primicias de este día;\r\nte pedimos que el recuerdo de tu santa resurrección sea nuestro gozo durante este domingo.",
            "Que tu Espíritu Santo nos enseñe a cumplir tu voluntad,\r\ny que tu sabiduría dirija hoy todas nuestras acciones.",
            "Que al celebrar la eucaristía de este domingo tu palabra nos llene de gozo,\r\ny que la participación en el banquete de tu amor haga crecer nuestra esperanza.",
            "Que sepamos contemplar las maravillas que tu generosidad nos concede,\r\ny vivamos durante todo el día en acción de gracias."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Digamos ahora todos juntos la oración que Cristo nos enseñó:",
        "textoCompleto": "Glorifiquemos al Señor Jesús, luz que alumbra a todo hombre y sol de justicia que no conoce el ocaso, y digámosle:\r\n\r\nTú que eres nuestra vida y nuestra salvación, Señor, ten piedad.\r\n\r\nCreador de la luz, de cuya bondad recibimos, con acción de gracias, las primicias de este día;\r\nte pedimos que el recuerdo de tu santa resurrección sea nuestro gozo durante este domingo.\r\n\r\nQue tu Espíritu Santo nos enseñe a cumplir tu voluntad,\r\ny que tu sabiduría dirija hoy todas nuestras acciones.\r\n\r\nQue al celebrar la eucaristía de este domingo tu palabra nos llene de gozo,\r\ny que la participación en el banquete de tu amor haga crecer nuestra esperanza.\r\n\r\nQue sepamos contemplar las maravillas que tu generosidad nos concede,\r\ny vivamos durante todo el día en acción de gracias."
    },
    {
        "id": "tos1lalu",
        "varName": "tos1lalu",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Lunes (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "lunes",
        "libro": "laudes",
        "intro": "Proclamemos la grandeza de Cristo, lleno de gracia y del Espíritu Santo, y acudamos a él diciendo:",
        "respuesta": "Concédenos, Señor, tu Espíritu.",
        "intenciones": [
            "Concédenos, Señor, un día lleno de paz, de alegría y de inocencia\r\npara que, al llegar a la noche, podamos alabarte con gozo y limpios de pecado.",
            "Que baje hoy a nosotros tu bondad\r\ny haga prósperas las obras de nuestras manos.",
            "Muéstranos tu rostro propicio y danos tu paz\r\npara que durante todo el día sintamos cómo tu mano nos protege.",
            "Mira con bondad a cuantos se han encomendado a nuestras oraciones\r\ny enriquécelos con toda clase de bienes."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Terminemos nuestra oración con la plegaria que Cristo nos enseñó:",
        "textoCompleto": "Proclamemos la grandeza de Cristo, lleno de gracia y del Espíritu Santo, y acudamos a él diciendo:\r\n\r\nConcédenos, Señor, tu Espíritu.\r\n\r\nConcédenos, Señor, un día lleno de paz, de alegría y de inocencia\r\npara que, al llegar a la noche, podamos alabarte con gozo y limpios de pecado.\r\n\r\nQue baje hoy a nosotros tu bondad\r\ny haga prósperas las obras de nuestras manos.\r\n\r\nMuéstranos tu rostro propicio y danos tu paz\r\npara que durante todo el día sintamos cómo tu mano nos protege.\r\n\r\nMira con bondad a cuantos se han encomendado a nuestras oraciones\r\ny enriquécelos con toda clase de bienes."
    },
    {
        "id": "tos2lalu",
        "varName": "tos2lalu",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Lunes (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "lunes",
        "libro": "laudes",
        "intro": "Demos gracias a nuestro salvador que ha hecho de nosotros un pueblo de reyes y sacerdotes, y digámosle:",
        "respuesta": "Consérvanos, Señor, en tu servicio.",
        "intenciones": [
            "Señor Jesús, sacerdote eterno, que has querido que tu pueblo participara de tu sacerdocio:\r\nhaz que ofrezcamos siempre sacrificios espirituales, agradables al Padre.",
            "Danos, Señor, la abundancia de los frutos del Espíritu Santo:\r\ncomprensión, bondad, amabilidad.",
            "Que la luz de la fe ilumine este nuevo día\r\ny que durante el mismo caminemos por las sendas del amor.",
            "Haz que busquemos siempre el bien de nuestros hermanos\r\ny les ayudemos a progresar en su salvación."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Con el gozo que nos da el sabernos hijos de Dios, digamos confiadamente:",
        "textoCompleto": "Demos gracias a nuestro salvador que ha hecho de nosotros un pueblo de reyes y sacerdotes, y digámosle:\r\n\r\nConsérvanos, Señor, en tu servicio.\r\n\r\nSeñor Jesús, sacerdote eterno, que has querido que tu pueblo participara de tu sacerdocio:\r\nhaz que ofrezcamos siempre sacrificios espirituales, agradables al Padre.\r\n\r\nDanos, Señor, la abundancia de los frutos del Espíritu Santo:\r\ncomprensión, bondad, amabilidad.\r\n\r\nQue la luz de la fe ilumine este nuevo día\r\ny que durante el mismo caminemos por las sendas del amor.\r\n\r\nHaz que busquemos siempre el bien de nuestros hermanos\r\ny les ayudemos a progresar en su salvación."
    },
    {
        "id": "tos3lalu",
        "varName": "tos3lalu",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Lunes (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "lunes",
        "libro": "laudes",
        "intro": "Invoquemos a Dios, que puso en el mundo a los hombres para que trabajasen concordes para su gloria, y digámosle:",
        "respuesta": "Haz, Señor, que te glorifiquemos.",
        "intenciones": [
            "Te bendecimos, Señor, creador del universo, porque has conservado nuestra vida hasta el día de hoy;\r\nHaz que en toda nuestra jornada te alabemos y te bendigamos.",
            "Míranos benigno, Señor, ahora que vamos a comenzar nuestra labor cotidiana;\r\nhaz que, obrando conforme a tu voluntad, cooperemos en tu obra.",
            "Que nuestro trabajo de hoy sea provechoso para nuestros hermanos,\r\ny así todos juntos edifiquemos un mundo grato a tus ojos.",
            "A nosotros y a todos los que hoy entrarán en contacto con nosotros,\r\nconcédenos el gozo y la paz."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Llenos de alegría por nuestra condición de hijos de Dios, digamos confiadamente:",
        "textoCompleto": "Invoquemos a Dios, que puso en el mundo a los hombres para que trabajasen concordes para su gloria, y digámosle:\r\n\r\nHaz, Señor, que te glorifiquemos.\r\n\r\nTe bendecimos, Señor, creador del universo, porque has conservado nuestra vida hasta el día de hoy;\r\nHaz que en toda nuestra jornada te alabemos y te bendigamos.\r\n\r\nMíranos benigno, Señor, ahora que vamos a comenzar nuestra labor cotidiana;\r\nhaz que, obrando conforme a tu voluntad, cooperemos en tu obra.\r\n\r\nQue nuestro trabajo de hoy sea provechoso para nuestros hermanos,\r\ny así todos juntos edifiquemos un mundo grato a tus ojos.\r\n\r\nA nosotros y a todos los que hoy entrarán en contacto con nosotros,\r\nconcédenos el gozo y la paz."
    },
    {
        "id": "tos4lalu",
        "varName": "tos4lalu",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Lunes (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "lunes",
        "libro": "laudes",
        "intro": "Ya que Cristo escucha y salva a cuantos en él se refugian, acudamos a él diciendo:",
        "respuesta": "Escúchanos, Señor.",
        "intenciones": [
            "Te damos gracias, Señor, por el gran amor con que nos amaste;\r\ncontinúa mostrándote con nosotros rico en misericordia.",
            "Tú que con el Padre sigues actuando siempre en el mundo,\r\nrenueva todas las cosas con la fuerza de tu Espíritu.",
            "Abre nuestros ojos y los de nuestros hermanos\r\npara que podamos contemplar hoy tus maravillas.",
            "Ya que nos llamas hoy a tu servicio,\r\nhaz que seamos buenos administradores de tu multiforme gracia en favor de nuestros hermanos."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Acudamos a Dios Padre, tal como nos enseñó Jesucristo:",
        "textoCompleto": "Ya que Cristo escucha y salva a cuantos en él se refugian, acudamos a él diciendo:\r\n\r\nEscúchanos, Señor.\r\n\r\nTe damos gracias, Señor, por el gran amor con que nos amaste;\r\ncontinúa mostrándote con nosotros rico en misericordia.\r\n\r\nTú que con el Padre sigues actuando siempre en el mundo,\r\nrenueva todas las cosas con la fuerza de tu Espíritu.\r\n\r\nAbre nuestros ojos y los de nuestros hermanos\r\npara que podamos contemplar hoy tus maravillas.\r\n\r\nYa que nos llamas hoy a tu servicio,\r\nhaz que seamos buenos administradores de tu multiforme gracia en favor de nuestros hermanos."
    },
    {
        "id": "tos1lama",
        "varName": "tos1lama",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Martes (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "martes",
        "libro": "laudes",
        "intro": "Ya que hemos sido llamados a participar de una vocación celestial, bendigamos por ello a Jesús, el pontífice de nuestra fe, y supliquémosle diciendo:",
        "respuesta": "Escúchanos, Señor.",
        "intenciones": [
            "Señor Jesús, que por el bautismo has hecho de nosotros un sacerdocio real,\r\nhaz que nuestra vida sea un continuo sacrificio de alabanza.",
            "Ayúdanos, Señor, a guardar tus mandatos\r\npara que por la fuerza del Espíritu Santo nosotros permanezcamos en ti y tú en nosotros.",
            "Danos tu sabiduría eterna\r\npara que permanezca con nosotros y con nosotros trabaje.",
            "Concédenos ser la alegría de cuantos nos rodean\r\ny fuente de esperanza para los decaídos."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Como hijos que somos de Dios, dirijámonos a nuestro Padre con la oración que Cristo nos enseñó:",
        "textoCompleto": "Ya que hemos sido llamados a participar de una vocación celestial, bendigamos por ello a Jesús, el pontífice de nuestra fe, y supliquémosle diciendo:\r\n\r\nEscúchanos, Señor.\r\n\r\nSeñor Jesús, que por el bautismo has hecho de nosotros un sacerdocio real,\r\nhaz que nuestra vida sea un continuo sacrificio de alabanza.\r\n\r\nAyúdanos, Señor, a guardar tus mandatos\r\npara que por la fuerza del Espíritu Santo nosotros permanezcamos en ti y tú en nosotros.\r\n\r\nDanos tu sabiduría eterna\r\npara que permanezca con nosotros y con nosotros trabaje.\r\n\r\nConcédenos ser la alegría de cuantos nos rodean\r\ny fuente de esperanza para los decaídos."
    },
    {
        "id": "tos2lama",
        "varName": "tos2lama",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Martes (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "martes",
        "libro": "laudes",
        "intro": "Bendigamos a nuestro Salvador, que con su resurrección ha iluminado el mundo, y digámosle suplicantes:",
        "respuesta": "Haz, Señor, que caminemos por tu senda.",
        "intenciones": [
            "Señor Jesús, al consagrar nuestra oración matinal en memoria de tu santa resurrección,\r\nte pedimos que la esperanza de participar de tu gloria ilumine todo nuestro día.",
            "Te ofrecemos, Señor, los deseos y proyectos de nuestra jornada:\r\ndígnate aceptarlos y bendecirlos como primicia de nuestro día.",
            "Concédenos crecer hoy en tu amor,\r\na fin de que todo concurra para nuestro bien y el de nuestros hermanos.",
            "Haz, Señor, que el ejemplo de nuestra vida resplandezca como una luz ante los hombres,\r\npara que todos den gloria al Padre que está en los cielos."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Porque deseamos que la luz de Cristo ilumine a todos los hombres, pidamos al Padre que su reino llegue a nosotros:",
        "textoCompleto": "Bendigamos a nuestro Salvador, que con su resurrección ha iluminado el mundo, y digámosle suplicantes:\r\n\r\nHaz, Señor, que caminemos por tu senda.\r\n\r\nSeñor Jesús, al consagrar nuestra oración matinal en memoria de tu santa resurrección,\r\nte pedimos que la esperanza de participar de tu gloria ilumine todo nuestro día.\r\n\r\nTe ofrecemos, Señor, los deseos y proyectos de nuestra jornada:\r\ndígnate aceptarlos y bendecirlos como primicia de nuestro día.\r\n\r\nConcédenos crecer hoy en tu amor,\r\na fin de que todo concurra para nuestro bien y el de nuestros hermanos.\r\n\r\nHaz, Señor, que el ejemplo de nuestra vida resplandezca como una luz ante los hombres,\r\npara que todos den gloria al Padre que está en los cielos."
    },
    {
        "id": "tos3lama",
        "varName": "tos3lama",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Martes (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "martes",
        "libro": "laudes",
        "intro": "Adoremos a Cristo, que con su sangre ha adquirido el pueblo de la nueva alianza, y digámosle suplicantes:",
        "respuesta": "Acuérdate, Señor, de tu pueblo.",
        "intenciones": [
            "Rey y redentor nuestro, escucha la alabanza que te dirige tu Iglesia en el comienzo de este día,\r\ny haz que no deje nunca de glorificarte.",
            "Que nunca, Señor, quedemos confundidos\r\nlos que en ti ponemos nuestra fe y nuestra esperanza.",
            "Mira compasivo nuestra debilidad y ven en ayuda nuestra,\r\nya que sin ti nada podemos hacer.",
            "Acuérdate de los pobres y desvalidos;\r\nque este día que comienza les traiga solaz y alegría."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Ya que deseamos que la luz de Cristo ilumine a todos los hombres, pidamos al Padre que a todos llegue el reino de su Hijo:",
        "textoCompleto": "Adoremos a Cristo, que con su sangre ha adquirido el pueblo de la nueva alianza, y digámosle suplicantes:\r\n\r\nAcuérdate, Señor, de tu pueblo.\r\n\r\nRey y redentor nuestro, escucha la alabanza que te dirige tu Iglesia en el comienzo de este día,\r\ny haz que no deje nunca de glorificarte.\r\n\r\nQue nunca, Señor, quedemos confundidos\r\nlos que en ti ponemos nuestra fe y nuestra esperanza.\r\n\r\nMira compasivo nuestra debilidad y ven en ayuda nuestra,\r\nya que sin ti nada podemos hacer.\r\n\r\nAcuérdate de los pobres y desvalidos;\r\nque este día que comienza les traiga solaz y alegría."
    },
    {
        "id": "tos4lama",
        "varName": "tos4lama",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Martes (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "martes",
        "libro": "laudes",
        "intro": "Dios nos otorga el gozo de poder alabarlo en este comienzo del día, reavivando con ello nuestra esperanza. Invoquémosle, pues, diciendo:",
        "respuesta": "Por el honor de tu nombre, escúchanos, Señor.",
        "intenciones": [
            "Dios y Padre de nuestro Salvador Jesucristo,\r\nte damos gracias porque, por mediación de tu Hijo, nos has dado el conocimiento y la inmortalidad.",
            "Danos, Señor, un corazón humilde\r\npara que vivamos sujetos unos a otros en el temor de Cristo.",
            "Infunde tu Espíritu en nosotros, tus siervos,\r\npara que nuestro amor fraterno sea sin fingimiento.",
            "Tú que has dispuesto que el hombre dominara el mundo con su esfuerzo,\r\nhaz que nuestro trabajo te glorifique y santifique a nuestros hermanos."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Ya que Dios nos muestra siempre su amor de Padre, velando amorosamente por nosotros, nos atrevemos a decir:",
        "textoCompleto": "Dios nos otorga el gozo de poder alabarlo en este comienzo del día, reavivando con ello nuestra esperanza. Invoquémosle, pues, diciendo:\r\n\r\nPor el honor de tu nombre, escúchanos, Señor.\r\n\r\nDios y Padre de nuestro Salvador Jesucristo,\r\nte damos gracias porque, por mediación de tu Hijo, nos has dado el conocimiento y la inmortalidad.\r\n\r\nDanos, Señor, un corazón humilde\r\npara que vivamos sujetos unos a otros en el temor de Cristo.\r\n\r\nInfunde tu Espíritu en nosotros, tus siervos,\r\npara que nuestro amor fraterno sea sin fingimiento.\r\n\r\nTú que has dispuesto que el hombre dominara el mundo con su esfuerzo,\r\nhaz que nuestro trabajo te glorifique y santifique a nuestros hermanos."
    },
    {
        "id": "tos1lami",
        "varName": "tos1lami",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Miercoles (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "miercoles",
        "libro": "laudes",
        "intro": "Demos gracias a Cristo y alabémoslo porque ha querido santificarnos y llamarnos hermanos suyos; digámosle, pues, confiados:",
        "respuesta": "Santifica, Señor, a tus hermanos.",
        "intenciones": [
            "Concédenos, Señor, consagrar el principio de este día en honor de tu resurrección\r\ny haz que todos los trabajos que realicemos durante esta jornada te sean agradables.",
            "Haz que sepamos descubrirte a ti en todos nuestros hermanos,\r\nsobre todo en los tristes, en los más pobres y en los que son menos útiles a los ojos del mundo.",
            "Tú que para aumentar nuestra alegría y afianzar nuestra salvación nos das el nuevo día, signo de tu amor,\r\nrenuévanos hoy y siempre para gloria de tu nombre.",
            "Haz que durante este día estemos en paz con todo el mundo\r\ny que a nadie devolvamos mal por mal."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Tal como Cristo nos enseñó, terminemos nuestra oración diciendo:",
        "textoCompleto": "Demos gracias a Cristo y alabémoslo porque ha querido santificarnos y llamarnos hermanos suyos; digámosle, pues, confiados:\r\n\r\nSantifica, Señor, a tus hermanos.\r\n\r\nConcédenos, Señor, consagrar el principio de este día en honor de tu resurrección\r\ny haz que todos los trabajos que realicemos durante esta jornada te sean agradables.\r\n\r\nHaz que sepamos descubrirte a ti en todos nuestros hermanos,\r\nsobre todo en los tristes, en los más pobres y en los que son menos útiles a los ojos del mundo.\r\n\r\nTú que para aumentar nuestra alegría y afianzar nuestra salvación nos das el nuevo día, signo de tu amor,\r\nrenuévanos hoy y siempre para gloria de tu nombre.\r\n\r\nHaz que durante este día estemos en paz con todo el mundo\r\ny que a nadie devolvamos mal por mal."
    },
    {
        "id": "tos2lami",
        "varName": "tos2lami",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Miercoles (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "miercoles",
        "libro": "laudes",
        "intro": "Oremos a nuestro Señor Jesucristo, que prometió estar con nosotros todos los días hasta el fin del mundo, y digámosle confiados:",
        "respuesta": "Escúchanos, Señor.",
        "intenciones": [
            "Quédate con nosotros, Señor, durante todo el día:\r\nque la luz de tu gracia no conozca nunca el anochecer en nuestras vidas.",
            "Que el trabajo de este día sea como una oblación sin defecto,\r\ny que sea agradable a tus ojos.",
            "Que en todas nuestras palabras y acciones seamos hoy luz del mundo\r\ny sal de la tierra para cuantos nos traten.",
            "Que la gracia del Espíritu Santo habite en nuestros corazones y resplandezca en nuestras obras\r\npara que así permanezcamos en tu amor y en tu alabanza."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Terminemos nuestra oración diciendo juntos las palabras del Señor y pidiendo al Padre que nos libre de todo mal:",
        "textoCompleto": "Oremos a nuestro Señor Jesucristo, que prometió estar con nosotros todos los días hasta el fin del mundo, y digámosle confiados:\r\n\r\nEscúchanos, Señor.\r\n\r\nQuédate con nosotros, Señor, durante todo el día:\r\nque la luz de tu gracia no conozca nunca el anochecer en nuestras vidas.\r\n\r\nQue el trabajo de este día sea como una oblación sin defecto,\r\ny que sea agradable a tus ojos.\r\n\r\nQue en todas nuestras palabras y acciones seamos hoy luz del mundo\r\ny sal de la tierra para cuantos nos traten.\r\n\r\nQue la gracia del Espíritu Santo habite en nuestros corazones y resplandezca en nuestras obras\r\npara que así permanezcamos en tu amor y en tu alabanza."
    },
    {
        "id": "tos3lami",
        "varName": "tos3lami",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Miercoles (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "miercoles",
        "libro": "laudes",
        "intro": "Invoquemos a Cristo, que se entregó a sí mismo por la Iglesia, y le da alimento y calor, diciendo:",
        "respuesta": "Acuérdate, Señor, de tu Iglesia.",
        "intenciones": [
            "Bendito seas, Señor, Pastor de la Iglesia, que nos vuelves a dar hoy la luz y la vida;\r\nhaz que sepamos agradecerte este magnífico don.",
            "Mira con amor a tu grey, que has congregado en tu nombre;\r\nhaz que no se pierda ni uno solo de los que el Padre te ha dado.",
            "Guía a tu Iglesia por el camino de tus mandatos,\r\ny haz que el Espíritu Santo la conserve en la fidelidad.",
            "Que tus fieles, Señor, cobren nueva vida participando en la mesa de tu pan y de tu palabra,\r\npara que, con la fuerza de este alimento, te sigan con alegría."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Concluyamos nuestra oración diciendo juntos las palabras de Jesús, nuestro Maestro:",
        "textoCompleto": "Invoquemos a Cristo, que se entregó a sí mismo por la Iglesia, y le da alimento y calor, diciendo:\r\n\r\nAcuérdate, Señor, de tu Iglesia.\r\n\r\nBendito seas, Señor, Pastor de la Iglesia, que nos vuelves a dar hoy la luz y la vida;\r\nhaz que sepamos agradecerte este magnífico don.\r\n\r\nMira con amor a tu grey, que has congregado en tu nombre;\r\nhaz que no se pierda ni uno solo de los que el Padre te ha dado.\r\n\r\nGuía a tu Iglesia por el camino de tus mandatos,\r\ny haz que el Espíritu Santo la conserve en la fidelidad.\r\n\r\nQue tus fieles, Señor, cobren nueva vida participando en la mesa de tu pan y de tu palabra,\r\npara que, con la fuerza de este alimento, te sigan con alegría."
    },
    {
        "id": "tos4lami",
        "varName": "tos4lami",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Miercoles (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "miercoles",
        "libro": "laudes",
        "intro": "Cristo, reflejo de la gloria del Padre, nos ilumina con su palabra; acudamos pues a él diciendo:",
        "respuesta": "Rey de la gloria, escúchanos.",
        "intenciones": [
            "Te bendecimos, Señor, autor y consumador de nuestra fe,\r\nporque de las tinieblas nos has trasladado a tu luz admirable.",
            "Tú que abriste los ojos de los ciegos y diste oído a los sordos,\r\naumenta nuestra fe.",
            "Haz, Señor, que permanezcamos siempre en tu amor,\r\ny que este amor nos guarde fraternalmente unidos.",
            "Ayúdanos para que resistamos a la tentación, aguantemos en la tribulación\r\ny te demos gracias en la prosperidad."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Dejemos que el espíritu de Dios, que ha sido derramado en nuestros corazones, se una a nuestro espíritu, para clamar:",
        "textoCompleto": "Cristo, reflejo de la gloria del Padre, nos ilumina con su palabra; acudamos pues a él diciendo:\r\n\r\nRey de la gloria, escúchanos.\r\n\r\nTe bendecimos, Señor, autor y consumador de nuestra fe,\r\nporque de las tinieblas nos has trasladado a tu luz admirable.\r\n\r\nTú que abriste los ojos de los ciegos y diste oído a los sordos,\r\naumenta nuestra fe.\r\n\r\nHaz, Señor, que permanezcamos siempre en tu amor,\r\ny que este amor nos guarde fraternalmente unidos.\r\n\r\nAyúdanos para que resistamos a la tentación, aguantemos en la tribulación\r\ny te demos gracias en la prosperidad."
    },
    {
        "id": "tos1laju",
        "varName": "tos1laju",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Jueves (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "jueves",
        "libro": "laudes",
        "intro": "Demos gracias a Cristo que nos ha dado la luz del día y supliquémosle diciendo:",
        "respuesta": "Bendícenos y santifícanos, Señor.",
        "intenciones": [
            "Tú que te entregaste como víctima por nuestros pecados,\r\nacepta los deseos y las acciones de este día.",
            "Tú que nos alegras con la claridad del nuevo día,\r\nsé tú mismo el lucero brillante de nuestros corazones.",
            "Haz que seamos bondadosos y comprensivos con los que nos rodean\r\npara que logremos así ser imágenes de tu bondad.",
            "En la mañana haznos escuchar tu gracia\r\ny que tu gozo sea hoy nuestra fortaleza."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Fieles a la recomendación del salvador, digamos llenos de confianza filial:",
        "textoCompleto": "Demos gracias a Cristo que nos ha dado la luz del día y supliquémosle diciendo:\r\n\r\nBendícenos y santifícanos, Señor.\r\n\r\nTú que te entregaste como víctima por nuestros pecados,\r\nacepta los deseos y las acciones de este día.\r\n\r\nTú que nos alegras con la claridad del nuevo día,\r\nsé tú mismo el lucero brillante de nuestros corazones.\r\n\r\nHaz que seamos bondadosos y comprensivos con los que nos rodean\r\npara que logremos así ser imágenes de tu bondad.\r\n\r\nEn la mañana haznos escuchar tu gracia\r\ny que tu gozo sea hoy nuestra fortaleza."
    },
    {
        "id": "tos2laju",
        "varName": "tos2laju",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Jueves (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "jueves",
        "libro": "laudes",
        "intro": "Bendigamos a Dios, nuestro Padre, que mira siempre con amor a sus hijos y nunca desatiende sus súplicas, y digámosle con humildad:",
        "respuesta": "Ilumínanos, Señor.",
        "intenciones": [
            "Te damos gracias, Señor, porque nos has iluminado con la luz de Jesucristo;\r\nque esta claridad ilumine hoy todos nuestros actos.",
            "Que tu sabiduría nos dirija en nuestra jornada;\r\nasí andaremos por sendas de vida nueva.",
            "Ayúdanos a superar con fortaleza las adversidades\r\ny haz que te sirvamos con generosidad de espíritu.",
            "Dirige y santifica los pensamientos, palabras y obras de nuestro día\r\ny danos un espíritu dócil a tus inspiraciones."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Dirijamos ahora, todos juntos, nuestra oración al Padre y digámosle:",
        "textoCompleto": "Bendigamos a Dios, nuestro Padre, que mira siempre con amor a sus hijos y nunca desatiende sus súplicas, y digámosle con humildad:\r\n\r\nIlumínanos, Señor.\r\n\r\nTe damos gracias, Señor, porque nos has iluminado con la luz de Jesucristo;\r\nque esta claridad ilumine hoy todos nuestros actos.\r\n\r\nQue tu sabiduría nos dirija en nuestra jornada;\r\nasí andaremos por sendas de vida nueva.\r\n\r\nAyúdanos a superar con fortaleza las adversidades\r\ny haz que te sirvamos con generosidad de espíritu.\r\n\r\nDirige y santifica los pensamientos, palabras y obras de nuestro día\r\ny danos un espíritu dócil a tus inspiraciones."
    },
    {
        "id": "tos3laju",
        "varName": "tos3laju",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Jueves (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "jueves",
        "libro": "laudes",
        "intro": "Demos gracias al Señor, que guía y alimenta con amor a su pueblo, y digámosle:",
        "respuesta": "Te glorificamos por siempre, Señor.",
        "intenciones": [
            "Señor, rey del universo, te alabamos por el amor que nos tienes,\r\nporque de manera admirable nos creaste y más admirablemente aún nos redimiste.",
            "Al comenzar este nuevo día, pon en nuestros corazones el anhelo de servirte,\r\npara que te glorifiquemos en todos nuestros pensamientos y acciones.",
            "Purifica nuestros corazones de todo mal deseo,\r\ny haz que estemos siempre atentos a tu voluntad.",
            "Danos un corazón abierto a las necesidades de nuestros hermanos,\r\npara que a nadie falte la ayuda de nuestro amor."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Acudamos ahora a nuestro Padre celestial, diciendo:",
        "textoCompleto": "Demos gracias al Señor, que guía y alimenta con amor a su pueblo, y digámosle:\r\n\r\nTe glorificamos por siempre, Señor.\r\n\r\nSeñor, rey del universo, te alabamos por el amor que nos tienes,\r\nporque de manera admirable nos creaste y más admirablemente aún nos redimiste.\r\n\r\nAl comenzar este nuevo día, pon en nuestros corazones el anhelo de servirte,\r\npara que te glorifiquemos en todos nuestros pensamientos y acciones.\r\n\r\nPurifica nuestros corazones de todo mal deseo,\r\ny haz que estemos siempre atentos a tu voluntad.\r\n\r\nDanos un corazón abierto a las necesidades de nuestros hermanos,\r\npara que a nadie falte la ayuda de nuestro amor."
    },
    {
        "id": "tos4laju",
        "varName": "tos4laju",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Jueves (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "jueves",
        "libro": "laudes",
        "intro": "Invoquemos a Dios, de quien viene la salvación para su pueblo, diciendo:",
        "respuesta": "Tú, que eres nuestra vida, escúchanos, Señor.",
        "intenciones": [
            "Bendito seas, Dios, Padre de nuestro Señor Jesucristo, porque en tu gran misericordia nos has hecho nacer de nuevo para una esperanza viva,\r\npor la resurrección de Jesucristo de entre los muertos.",
            "Tú que, en Cristo, renovaste al hombre, creado a imagen tuya,\r\nhaz que reproduzcamos la imagen de tu Hijo.",
            "Derrama en nuestros corazones, lastimados por el odio y la envidia,\r\ntu Espíritu de amor.",
            "Concede hoy trabajo a quienes lo buscan, pan a los hambrientos, alegría a los tristes,\r\na todos la gracia y la salvación."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Por Jesús hemos sido hechos hijos de Dios; por esto nos atrevemos a decir:",
        "textoCompleto": "Invoquemos a Dios, de quien viene la salvación para su pueblo, diciendo:\r\n\r\nTú, que eres nuestra vida, escúchanos, Señor.\r\n\r\nBendito seas, Dios, Padre de nuestro Señor Jesucristo, porque en tu gran misericordia nos has hecho nacer de nuevo para una esperanza viva,\r\npor la resurrección de Jesucristo de entre los muertos.\r\n\r\nTú que, en Cristo, renovaste al hombre, creado a imagen tuya,\r\nhaz que reproduzcamos la imagen de tu Hijo.\r\n\r\nDerrama en nuestros corazones, lastimados por el odio y la envidia,\r\ntu Espíritu de amor.\r\n\r\nConcede hoy trabajo a quienes lo buscan, pan a los hambrientos, alegría a los tristes,\r\na todos la gracia y la salvación."
    },
    {
        "id": "tos1lavi",
        "varName": "tos1lavi",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Viernes (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "viernes",
        "libro": "laudes",
        "intro": "Adoremos a Cristo, que salvó al mundo con su cruz, y supliquémosle diciendo:",
        "respuesta": "Señor, ten misericordia de nosotros.",
        "intenciones": [
            "Señor Jesucristo, cuya claridad es nuestro sol y nuestro día,\r\nhaz que, desde el amanecer, desaparezca de nosotros todo sentimiento malo.",
            "Vela, Señor, sobre nuestros pensamientos, palabras y obras,\r\na fin de que nuestro día sea agradable ante tus ojos.",
            "Aparta de nuestros pecados tu vista,\r\ny borra en nosotros toda culpa.",
            "Por tu cruz y tu resurrección,\r\nllénanos del gozo del Espíritu Santo."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Ya que somos hijos de Dios, oremos a nuestro Padre como Cristo nos enseñó:",
        "textoCompleto": "Adoremos a Cristo, que salvó al mundo con su cruz, y supliquémosle diciendo:\r\n\r\nSeñor, ten misericordia de nosotros.\r\n\r\nSeñor Jesucristo, cuya claridad es nuestro sol y nuestro día,\r\nhaz que, desde el amanecer, desaparezca de nosotros todo sentimiento malo.\r\n\r\nVela, Señor, sobre nuestros pensamientos, palabras y obras,\r\na fin de que nuestro día sea agradable ante tus ojos.\r\n\r\nAparta de nuestros pecados tu vista,\r\ny borra en nosotros toda culpa.\r\n\r\nPor tu cruz y tu resurrección,\r\nllénanos del gozo del Espíritu Santo."
    },
    {
        "id": "tos2lavi",
        "varName": "tos2lavi",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Viernes (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "viernes",
        "libro": "laudes",
        "intro": "Adoremos a Cristo, que se ofreció a Dios como sacrificio sin mancha para purificar nuestras conciencias de las obras muertas, y digámosle con fe:",
        "respuesta": "En tu voluntad, Señor, encontramos nuestra paz.",
        "intenciones": [
            "Tú que nos has dado la luz del nuevo día,\r\nconcédenos también caminar durante sus horas por sendas de vida nueva.",
            "Tú que todo lo has creado con tu poder y con tu providencia lo conservas,\r\nayúdanos a descubrirte presente en todas tus creaturas.",
            "Tú que has sellado con tu sangre una alianza nueva y eterna,\r\nhaz que, obedeciendo siempre tus mandatos, permanezcamos fieles a esa alianza.",
            "Tú que colgado en la cruz quisiste que de tu costado manara sangre y agua,\r\npurifica con esta agua nuestros pecados y alegra con este manantial a la ciudad de Dios."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Ya que Dios nos ha adoptado como hijos, oremos al Padre como nos enseñó Jesucristo:",
        "textoCompleto": "Adoremos a Cristo, que se ofreció a Dios como sacrificio sin mancha para purificar nuestras conciencias de las obras muertas, y digámosle con fe:\r\n\r\nEn tu voluntad, Señor, encontramos nuestra paz.\r\n\r\nTú que nos has dado la luz del nuevo día,\r\nconcédenos también caminar durante sus horas por sendas de vida nueva.\r\n\r\nTú que todo lo has creado con tu poder y con tu providencia lo conservas,\r\nayúdanos a descubrirte presente en todas tus creaturas.\r\n\r\nTú que has sellado con tu sangre una alianza nueva y eterna,\r\nhaz que, obedeciendo siempre tus mandatos, permanezcamos fieles a esa alianza.\r\n\r\nTú que colgado en la cruz quisiste que de tu costado manara sangre y agua,\r\npurifica con esta agua nuestros pecados y alegra con este manantial a la ciudad de Dios."
    },
    {
        "id": "tos3lavi",
        "varName": "tos3lavi",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Viernes (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "viernes",
        "libro": "laudes",
        "intro": "Invoquemos a Cristo, que nació, murió y resucitó por su pueblo, diciendo:",
        "respuesta": "Salva, Señor, al pueblo que redimiste con tu sangre.",
        "intenciones": [
            "Te bendecimos, Señor, a ti que por nosotros aceptaste el suplicio de la cruz:\r\nmira con bondad a tu familia santa, redimida con tu sangre.",
            "Tú que prometiste a los que en ti creyeran que manarían de su interior torrentes de agua viva,\r\nderrama tu Espíritu sobre todos los hombres.",
            "Tú que enviaste a los discípulos a predicar el Evangelio,\r\nhaz que los cristianos anuncien tu palabra con fidelidad.",
            "A los enfermos y a todos los que has asociado a los sufrimientos de tu pasión,\r\nconcédeles fortaleza y paciencia."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Llenos del Espíritu de Jesucristo, acudamos a nuestro Padre común, diciendo:",
        "textoCompleto": "Invoquemos a Cristo, que nació, murió y resucitó por su pueblo, diciendo:\r\n\r\nSalva, Señor, al pueblo que redimiste con tu sangre.\r\n\r\nTe bendecimos, Señor, a ti que por nosotros aceptaste el suplicio de la cruz:\r\nmira con bondad a tu familia santa, redimida con tu sangre.\r\n\r\nTú que prometiste a los que en ti creyeran que manarían de su interior torrentes de agua viva,\r\nderrama tu Espíritu sobre todos los hombres.\r\n\r\nTú que enviaste a los discípulos a predicar el Evangelio,\r\nhaz que los cristianos anuncien tu palabra con fidelidad.\r\n\r\nA los enfermos y a todos los que has asociado a los sufrimientos de tu pasión,\r\nconcédeles fortaleza y paciencia."
    },
    {
        "id": "tos4lavi",
        "varName": "tos4lavi",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Viernes (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "viernes",
        "libro": "laudes",
        "intro": "Confiados en Dios, que cuida con solicitud de todos los que ha creado y redimido con la sangre de su Hijo, invoquémosle diciendo:",
        "respuesta": "Escucha, Señor, y ten piedad.",
        "intenciones": [
            "Dios misericordioso, asegura nuestros pasos en el camino de la verdadera santidad,\r\ny haz que busquemos siempre cuanto hay de verdadero, noble y justo.",
            "No nos abandones para siempre, por amor de tu nombre\r\nno olvides tu alianza con nosotros.",
            "Con alma contrita y espíritu humillado te seamos aceptos,\r\nporque no hay confusión para los que en ti confían.",
            "Tú que has querido que participáramos en la misión profética de Cristo,\r\nhaz que proclamemos ante el mundo tus maravillas."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Dirijámonos al Padre, con las mismas palabras que Cristo nos enseñó:",
        "textoCompleto": "Confiados en Dios, que cuida con solicitud de todos los que ha creado y redimido con la sangre de su Hijo, invoquémosle diciendo:\r\n\r\nEscucha, Señor, y ten piedad.\r\n\r\nDios misericordioso, asegura nuestros pasos en el camino de la verdadera santidad,\r\ny haz que busquemos siempre cuanto hay de verdadero, noble y justo.\r\n\r\nNo nos abandones para siempre, por amor de tu nombre\r\nno olvides tu alianza con nosotros.\r\n\r\nCon alma contrita y espíritu humillado te seamos aceptos,\r\nporque no hay confusión para los que en ti confían.\r\n\r\nTú que has querido que participáramos en la misión profética de Cristo,\r\nhaz que proclamemos ante el mundo tus maravillas."
    },
    {
        "id": "tos1lasa",
        "varName": "tos1lasa",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Sabado (Laudes)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "sabado",
        "libro": "laudes",
        "intro": "Bendigamos a Cristo que para ser ante Dios el pontífice misericordioso y fiel de los hombres se hizo en todo semejante a nosotros, y supliquémosle diciendo:",
        "respuesta": "Muéstranos, Señor, los tesoros de tu amor.",
        "intenciones": [
            "Señor, sol de justicia, que nos iluminaste en el bautismo,\r\nte consagramos este nuevo día.",
            "Que sepamos bendecirte en cada uno de los momentos de nuestra jornada\r\ny glorifiquemos tu nombre con cada una de nuestras acciones.",
            "Tú que tuviste por madre a María, siempre dócil a tu palabra,\r\nencamina hoy nuestros pasos para que obremos también como ella según tu voluntad.",
            "Haz que mientras vivimos aún en este mundo que pasa anhelemos la vida eterna\r\ny por la fe, la esperanza y el amor vivamos ya contigo en tu reino."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Con la misma confianza que tienen los hijos con su padre, acudamos nosotros a nuestro Dios, diciéndole:",
        "textoCompleto": "Bendigamos a Cristo que para ser ante Dios el pontífice misericordioso y fiel de los hombres se hizo en todo semejante a nosotros, y supliquémosle diciendo:\r\n\r\nMuéstranos, Señor, los tesoros de tu amor.\r\n\r\nSeñor, sol de justicia, que nos iluminaste en el bautismo,\r\nte consagramos este nuevo día.\r\n\r\nQue sepamos bendecirte en cada uno de los momentos de nuestra jornada\r\ny glorifiquemos tu nombre con cada una de nuestras acciones.\r\n\r\nTú que tuviste por madre a María, siempre dócil a tu palabra,\r\nencamina hoy nuestros pasos para que obremos también como ella según tu voluntad.\r\n\r\nHaz que mientras vivimos aún en este mundo que pasa anhelemos la vida eterna\r\ny por la fe, la esperanza y el amor vivamos ya contigo en tu reino."
    },
    {
        "id": "tos2lasa",
        "varName": "tos2lasa",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Sabado (Laudes)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "sabado",
        "libro": "laudes",
        "intro": "Celebremos la sabiduría y la bondad de Cristo, que ha querido ser amado y servido en los hermanos, especialmente en los que sufren, y supliquémosle insistentemente diciendo:",
        "respuesta": "Señor, acrecienta nuestro amor.",
        "intenciones": [
            "Al recordar esta mañana tu santa resurrección,\r\nte pedimos, Señor, que extiendas los beneficios de tu redención a todos los hombres.",
            "Que todo el día de hoy sepamos dar buen testimonio del nombre cristiano\r\ny ofrezcamos nuestra jornada como un culto espiritual agradable al Padre.",
            "Enséñanos, Señor, a descubrir tu imagen en todos los hombres\r\ny a saberte servir a ti en cada uno de ellos.",
            "Cristo, Señor nuestro, vid verdadera de la que nosotros somos sarmientos,\r\nhaz que permanezcamos en ti y demos fruto abundante para que con ello sea glorificado nuestro Padre que está en el cielo."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Con la confianza que nos da nuestra fe, acudamos ahora al Padre, diciendo como Cristo nos enseñó:",
        "textoCompleto": "Celebremos la sabiduría y la bondad de Cristo, que ha querido ser amado y servido en los hermanos, especialmente en los que sufren, y supliquémosle insistentemente diciendo:\r\n\r\nSeñor, acrecienta nuestro amor.\r\n\r\nAl recordar esta mañana tu santa resurrección,\r\nte pedimos, Señor, que extiendas los beneficios de tu redención a todos los hombres.\r\n\r\nQue todo el día de hoy sepamos dar buen testimonio del nombre cristiano\r\ny ofrezcamos nuestra jornada como un culto espiritual agradable al Padre.\r\n\r\nEnséñanos, Señor, a descubrir tu imagen en todos los hombres\r\ny a saberte servir a ti en cada uno de ellos.\r\n\r\nCristo, Señor nuestro, vid verdadera de la que nosotros somos sarmientos,\r\nhaz que permanezcamos en ti y demos fruto abundante para que con ello sea glorificado nuestro Padre que está en el cielo."
    },
    {
        "id": "tos3lasa",
        "varName": "tos3lasa",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Sabado (Laudes)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "sabado",
        "libro": "laudes",
        "intro": "Invoquemos a Dios por intercesión de María, a quien el Señor colocó por encima de todas las creaturas celestiales y terrenas, diciendo:",
        "respuesta": "Contempla, Señor, a la Madre de tu Hijo y escúchanos.",
        "intenciones": [
            "Padre de misericordia, te damos gracias porque nos has dado a María como madre y ejemplo;\r\nsantifícanos por su intercesión.",
            "Tú que hiciste que María meditara tus palabras, guardándolas en su corazón, y fuera siempre fidelísima hija tuya,\r\npor su intercesión haz que también nosotros seamos de verdad hijos tuyos y discípulos de tu Hijo.",
            "Tú que quisiste que María concibiera por obra del Espíritu Santo,\r\npor intercesión de María otórganos los frutos de este mismo Espíritu.",
            "Tú que diste fuerza a María para permanecer junto a la cruz y la llenaste de alegría con la resurrección de tu Hijo,\r\npor intercesión de María confórtanos en la tribulación y reanima nuestra esperanza."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Concluyamos nuestras súplicas con la oración que el mismo Cristo nos enseñó:",
        "textoCompleto": "Invoquemos a Dios por intercesión de María, a quien el Señor colocó por encima de todas las creaturas celestiales y terrenas, diciendo:\r\n\r\nContempla, Señor, a la Madre de tu Hijo y escúchanos.\r\n\r\nPadre de misericordia, te damos gracias porque nos has dado a María como madre y ejemplo;\r\nsantifícanos por su intercesión.\r\n\r\nTú que hiciste que María meditara tus palabras, guardándolas en su corazón, y fuera siempre fidelísima hija tuya,\r\npor su intercesión haz que también nosotros seamos de verdad hijos tuyos y discípulos de tu Hijo.\r\n\r\nTú que quisiste que María concibiera por obra del Espíritu Santo,\r\npor intercesión de María otórganos los frutos de este mismo Espíritu.\r\n\r\nTú que diste fuerza a María para permanecer junto a la cruz y la llenaste de alegría con la resurrección de tu Hijo,\r\npor intercesión de María confórtanos en la tribulación y reanima nuestra esperanza."
    },
    {
        "id": "tos4lasa",
        "varName": "tos4lasa",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Sabado (Laudes)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "sabado",
        "libro": "laudes",
        "intro": "Adoremos a Dios, que por su Hijo ha dado vida y esperanza al mundo, y supliquémosle diciendo:",
        "respuesta": "Escúchanos, Señor.",
        "intenciones": [
            "Señor, Padre de todos, tú que nos has hecho llegar al comienzo de este día,\r\nhaz que toda nuestra vida unida a la de Cristo sea alabanza de tu gloria.",
            "Que vivamos siempre arraigados en la fe, esperanza y caridad,\r\nque tú mismo has infundido en nuestras almas.",
            "Haz que nuestros ojos estén siempre levantados hacia ti,\r\npara que respondamos con presteza a tus llamadas.",
            "Defiéndenos de los engaños y seducciones del mal,\r\ny presérvanos de todo pecado."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Contentos por sabernos hijos de Dios, digamos a nuestro padre:",
        "textoCompleto": "Adoremos a Dios, que por su Hijo ha dado vida y esperanza al mundo, y supliquémosle diciendo:\r\n\r\nEscúchanos, Señor.\r\n\r\nSeñor, Padre de todos, tú que nos has hecho llegar al comienzo de este día,\r\nhaz que toda nuestra vida unida a la de Cristo sea alabanza de tu gloria.\r\n\r\nQue vivamos siempre arraigados en la fe, esperanza y caridad,\r\nque tú mismo has infundido en nuestras almas.\r\n\r\nHaz que nuestros ojos estén siempre levantados hacia ti,\r\npara que respondamos con presteza a tus llamadas.\r\n\r\nDefiéndenos de los engaños y seducciones del mal,\r\ny presérvanos de todo pecado."
    },
    {
        "id": "tos01dovi",
        "varName": "tos1VIdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Domingo / Bautismo (Vísperas)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "domingo",
        "libro": "visperas",
        "intro": "Roguemos a nuestro Redentor, bautizado por Juan en el Jordán, y supliquémosle, diciendo:",
        "respuesta": "Envía, Señor, tu Espíritu sobre nosotros.",
        "intenciones": [
            "Cristo, siervo de Dios, en quien el Padre tiene todo su gozo,\nenvía tu Espíritu sobre nosotros.",
            "Cristo, elegido de Dios, tú que no rompiste la caña resquebrajada ni apagaste la mecha humeante,\ncompadécete de cuantos te buscan con sinceridad.",
            "Cristo, Hijo de Dios, a quien el Padre ha elegido como nueva alianza del pueblo y luz de las naciones,\nabre por el bautismo los ojos de los que no ven.",
            "Cristo, salvador de los hombres, a quien el Padre ungió con el Espíritu Santo y envió para salvación del mundo,\nhaz que todos los hombres te conozcan y crean en ti para que así obtengan la vida eterna."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Cristo, esperanza nuestra, que llevas la luz de la salvación a los pueblos que yacen en las tinieblas de la ignorancia,\nrecibe en tu reino a nuestros difuntos.\n\nYa que somos la familia de Dios, digamos con grande confianza a nuestro Padre del cielo:",
        "textoCompleto": "Roguemos a nuestro Redentor, bautizado por Juan en el Jordán, y supliquémosle, diciendo:\n\nEnvía, Señor, tu Espíritu sobre nosotros.\n\nCristo, siervo de Dios, en quien el Padre tiene todo su gozo,\nenvía tu Espíritu sobre nosotros.\n\nCristo, elegido de Dios, tú que no rompiste la caña resquebrajada ni apagaste la mecha humeante,\ncompadécete de cuantos te buscan con sinceridad.\n\nCristo, Hijo de Dios, a quien el Padre ha elegido como nueva alianza del pueblo y luz de las naciones,\nabre por el bautismo los ojos de los que no ven.\n\nCristo, salvador de los hombres, a quien el Padre ungió con el Espíritu Santo y envió para salvación del mundo,\nhaz que todos los hombres te conozcan y crean en ti para que así obtengan la vida eterna."
    },
    {
        "id": "tos01luvi",
        "varName": "tos1vilu",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Lunes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "lunes",
        "libro": "visperas",
        "intro": "Demos gracias a Dios, nuestro Padre, que recordando siempre su santa alianza, no cesa de bendecirnos, y digámosle con ánimo confiado:",
        "respuesta": "Favorece a tu pueblo, Señor.",
        "intenciones": [
            "Salva a tu pueblo, Señor,\ny bendice a tu heredad.",
            "Congrega en la unidad a todos los cristianos:\npara que el mundo crea en Cristo, tu enviado.",
            "Derrama tu gracia sobre nuestros familiares y amigos:\nque encuentren en ti, Señor, su verdadera felicidad.",
            "Muestra tu amor a los agonizantes:\nque puedan contemplar tu salvación."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Ten piedad de los que han muerto\ny acógelos en el descanso de Cristo.\n\nTerminemos nuestra oración con las palabras que nos enseñó Cristo:",
        "textoCompleto": "Demos gracias a Dios, nuestro Padre, que recordando siempre su santa alianza, no cesa de bendecirnos, y digámosle con ánimo confiado:\n\nFavorece a tu pueblo, Señor.\n\nSalva a tu pueblo, Señor,\ny bendice a tu heredad.\n\nCongrega en la unidad a todos los cristianos:\npara que el mundo crea en Cristo, tu enviado.\n\nDerrama tu gracia sobre nuestros familiares y amigos:\nque encuentren en ti, Señor, su verdadera felicidad.\n\nMuestra tu amor a los agonizantes:\nque puedan contemplar tu salvación."
    },
    {
        "id": "tos01mavi",
        "varName": "tos1vima",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Martes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "martes",
        "libro": "visperas",
        "intro": "Alabemos a Cristo, que mora en medio de nosotros, su pueblo adquirido, y supliquémosle diciendo:",
        "respuesta": "Por el honor de tu nombre, escúchanos, Señor.",
        "intenciones": [
            "Dueño y Señor de los pueblos, acude en ayuda de todas las naciones y de los que las gobiernan:\nque todos los hombres sean fieles a tu voluntad y trabajen por el bien y la paz.",
            "Tú que al subir al cielo llevaste contigo una gran multitud de cautivos,\ndevuelve la libertad de los hijos de Dios a nuestros hermanos que sufren esclavitud en el cuerpo o en el espíritu.",
            "Concede, Señor, a los jóvenes la realización de sus esperanzas\ny que sepan responder a tus llamadas en el transcurso de su vida.",
            "Que los niños imiten tu ejemplo\ny crezcan siempre en sabiduría y en gracia."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Acoge a los difuntos en tu reino,\ndonde también nosotros esperamos reinar un día contigo.\n\nCon el gozo de sabernos hijos de Dios, acudamos a nuestro Padre:",
        "textoCompleto": "Alabemos a Cristo, que mora en medio de nosotros, su pueblo adquirido, y supliquémosle diciendo:\n\nPor el honor de tu nombre, escúchanos, Señor.\n\nDueño y Señor de los pueblos, acude en ayuda de todas las naciones y de los que las gobiernan:\nque todos los hombres sean fieles a tu voluntad y trabajen por el bien y la paz.\n\nTú que al subir al cielo llevaste contigo una gran multitud de cautivos,\ndevuelve la libertad de los hijos de Dios a nuestros hermanos que sufren esclavitud en el cuerpo o en el espíritu.\n\nConcede, Señor, a los jóvenes la realización de sus esperanzas\ny que sepan responder a tus llamadas en el transcurso de su vida.\n\nQue los niños imiten tu ejemplo\ny crezcan siempre en sabiduría y en gracia."
    },
    {
        "id": "tos01mivi",
        "varName": "tos1vimi",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Miércoles (Vísperas)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "miercoles",
        "libro": "visperas",
        "intro": "Oremos, hermanos, a Dios Padre, que en su amor nos mira como hijos, y digámosle:",
        "respuesta": "Muéstranos, Señor, la abundancia de tu amor.",
        "intenciones": [
            "Acuérdate, Señor, de tu Iglesia: guárdala de todo mal\ny haz que crezca en tu amor.",
            "Que todos los pueblos, Señor, te reconozcan como al único Dios verdadero,\ny a Jesucristo como al Salvador que tú has enviado.",
            "A nuestros parientes y bienhechores concédeles tus bienes\ny que tu bondad les dé la vida eterna.",
            "Te pedimos, Señor, por los trabajadores que sufren: alivia sus dificultades\ny haz que todos los hombres reconozcan su dignidad."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "En tu misericordia acoge a los que hoy han muerto\ny dales posesión de tu reino.\n\nUnidos fraternalmente como hermanos de una misma familia, invoquemos a nuestro Padre común:",
        "textoCompleto": "Oremos, hermanos, a Dios Padre, que en su amor nos mira como hijos, y digámosle:\n\nMuéstranos, Señor, la abundancia de tu amor.\n\nAcuérdate, Señor, de tu Iglesia: guárdala de todo mal\ny haz que crezca en tu amor.\n\nQue todos los pueblos, Señor, te reconozcan como al único Dios verdadero,\ny a Jesucristo como al Salvador que tú has enviado.\n\nA nuestros parientes y bienhechores concédeles tus bienes\ny que tu bondad les dé la vida eterna.\n\nTe pedimos, Señor, por los trabajadores que sufren: alivia sus dificultades\ny haz que todos los hombres reconozcan su dignidad."
    },
    {
        "id": "tos01juvi",
        "varName": "tos1viju",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Jueves (Vísperas)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "jueves",
        "libro": "visperas",
        "intro": "Invoquemos a Dios, nuestro refugio y nuestra fortaleza, y digámosle:",
        "respuesta": "Escucha, Señor, nuestra oración.",
        "intenciones": [
            "Dios de amor que has hecho alianza con tu pueblo,\nhaz que recordemos siempre tus maravillas.",
            "Que los sacerdotes, Señor, crezcan en la caridad\ny que los fieles vivan en la unidad del Espíritu y en el vínculo de la paz.",
            "Que el mundo prospere y avance según tus designios\ny que los que lo construyen no trabajen en vano.",
            "Envía, Señor, operarios a tu mies\npara que tu nombre sea conocido en el mundo."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "A nuestros familiares y bienhechores difuntos dales un lugar entre los santos\ny haz que nosotros un día nos encontremos con ellos en tu reino.\n\nYa que por Jesucristo hemos llegado a ser hijos de Dios, nos atrevemos a decir:",
        "textoCompleto": "Invoquemos a Dios, nuestro refugio y nuestra fortaleza, y digámosle:\n\nEscucha, Señor, nuestra oración.\n\nDios de amor que has hecho alianza con tu pueblo,\nhaz que recordemos siempre tus maravillas.\n\nQue los sacerdotes, Señor, crezcan en la caridad\ny que los fieles vivan en la unidad del Espíritu y en el vínculo de la paz.\n\nQue el mundo prospere y avance según tus designios\ny que los que lo construyen no trabajen en vano.\n\nEnvía, Señor, operarios a tu mies\npara que tu nombre sea conocido en el mundo."
    },
    {
        "id": "tos01vivi",
        "varName": "tos1vivi",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Viernes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "viernes",
        "libro": "visperas",
        "intro": "Bendigamos a Dios que escucha con amor la oración de los humildes y a los hambrientos los colma de bienes; digámosle confiados:",
        "respuesta": "Muéstranos, Señor, tu misericordia.",
        "intenciones": [
            "Señor, Padre lleno de amor, te pedimos por todos los miembros de la iglesia que sufren:\nacuérdate que por ellos, Cristo, cabeza de la iglesia, ofreció en la cruz el verdadero sacrificio vespertino.",
            "Libra a los encarcelados, ilumina a los que viven en tinieblas, sé la ayuda de las viudas y de los huérfanos,\ny haz que todos nos preocupemos de los que sufren.",
            "Concede a tus hijos la fuerza necesaria\npara resistir las tentaciones del Maligno.",
            "Acude en nuestro auxilio, Señor, cuando llegue la hora de nuestra muerte:\nque seamos fieles hasta el fin y dejemos este mundo en tu paz."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Conduce a los difuntos a la luz donde tu habitas\npara que puedan contemplarte eternamente.\n\nFieles a la recomendación del Salvador, nos atrevemos a decir:",
        "textoCompleto": "Bendigamos a Dios que escucha con amor la oración de los humildes y a los hambrientos los colma de bienes; digámosle confiados:\n\nMuéstranos, Señor, tu misericordia.\n\nSeñor, Padre lleno de amor, te pedimos por todos los miembros de la iglesia que sufren:\nacuérdate que por ellos, Cristo, cabeza de la iglesia, ofreció en la cruz el verdadero sacrificio vespertino.\n\nLibra a los encarcelados, ilumina a los que viven en tinieblas, sé la ayuda de las viudas y de los huérfanos,\ny haz que todos nos preocupemos de los que sufren.\n\nConcede a tus hijos la fuerza necesaria\npara resistir las tentaciones del Maligno.\n\nAcude en nuestro auxilio, Señor, cuando llegue la hora de nuestra muerte:\nque seamos fieles hasta el fin y dejemos este mundo en tu paz."
    },
    {
        "id": "tos01savi",
        "varName": "tos1visa",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Sábado (Vísperas)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "sabado",
        "libro": "visperas",
        "intro": "Demos gracias al Señor que ayuda y protege al pueblo que se ha escogido como heredad, y recordando su amor para con nosotros supliquémosle diciendo:",
        "respuesta": "Escúchanos, Señor, que confiamos en ti.",
        "intenciones": [
            "Padre lleno de amor, te pedimos por el papa Francisco y por nuestro obispo N.;\nprotégelos con tu fuerza y santifícalos con tu gracia.",
            "Que los enfermos vean en sus dolores una participación de la pasión de tu Hijo,\npara que así tengan también parte en su consuelo.",
            "Mira con piedad a los que no tienen techo donde cobijarse\ny haz que encuentren pronto el hogar que desean.",
            "Dígnate dar y conservar los frutos de la tierra\npara que a nadie falte el pan de cada día."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Señor, ten piedad de los difuntos\ny ábreles la puerta de tu mansión eterna.\n\nMovidos por el Espíritu Santo, dirijamos al Padre la oración que Cristo nos enseñó:",
        "textoCompleto": "Demos gracias al Señor que ayuda y protege al pueblo que se ha escogido como heredad, y recordando su amor para con nosotros supliquémosle diciendo:\n\nEscúchanos, Señor, que confiamos en ti.\n\nPadre lleno de amor, te pedimos por el papa Francisco y por nuestro obispo N.;\nprotégelos con tu fuerza y santifícalos con tu gracia.\n\nQue los enfermos vean en sus dolores una participación de la pasión de tu Hijo,\npara que así tengan también parte en su consuelo.\n\nMira con piedad a los que no tienen techo donde cobijarse\ny haz que encuentren pronto el hogar que desean.\n\nDígnate dar y conservar los frutos de la tierra\npara que a nadie falte el pan de cada día."
    },
    {
        "id": "tos02dovi",
        "varName": "tos2VIdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Domingo (Vísperas)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "domingo",
        "libro": "visperas",
        "intro": "Demos gloria y honor a Cristo, que puede salvar definitivamente a los que por medio de él se acercan a Dios, porque vive para interceder en su favor, y digámosle con plena confianza:",
        "respuesta": "Acuérdate, Señor, de tu pueblo.",
        "intenciones": [
            "Señor Jesús, sol de justicia que iluminas nuestras vidas, al llegar al umbral de la noche te pedimos por todos los hombres,\nque todos lleguen a gozar eternamente de tu luz.",
            "Guarda, Señor, la alianza sellada con tu sangre\ny santifica a tu iglesia para que sea siempre inmaculada y santa.",
            "Acuérdate de esta comunidad aquí reunida,\nque tú elegiste como morada de tu gloria.",
            "Que los que están en camino tengan un viaje feliz\ny regresen a sus hogares con salud y alegría."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Acoge, Señor, a tus hijos difuntos\ny concédeles tu perdón y la vida eterna.\n\nTerminemos nuestras preces con la oración que Cristo nos enseñó:",
        "textoCompleto": "Demos gloria y honor a Cristo, que puede salvar definitivamente a los que por medio de él se acercan a Dios, porque vive para interceder en su favor, y digámosle con plena confianza:\n\nAcuérdate, Señor, de tu pueblo.\n\nSeñor Jesús, sol de justicia que iluminas nuestras vidas, al llegar al umbral de la noche te pedimos por todos los hombres,\nque todos lleguen a gozar eternamente de tu luz.\n\nGuarda, Señor, la alianza sellada con tu sangre\ny santifica a tu iglesia para que sea siempre inmaculada y santa.\n\nAcuérdate de esta comunidad aquí reunida,\nque tú elegiste como morada de tu gloria.\n\nQue los que están en camino tengan un viaje feliz\ny regresen a sus hogares con salud y alegría."
    },
    {
        "id": "tos02luvi",
        "varName": "tos2vilu",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Lunes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "lunes",
        "libro": "visperas",
        "intro": "Alabemos a Cristo, que ama a la Iglesia y le da alimento y calor, y roguémosle confiados diciendo:",
        "respuesta": "Atiende, Señor, los deseos de tu pueblo.",
        "intenciones": [
            "Haz, Señor, que todos los hombres se salven\ny lleguen al conocimiento de la verdad.",
            "Guarda con tu protección al papa Francisco y a nuestro obispo N.,\nayúdalos con el poder de tu brazo.",
            "Ten compasión de los que no encuentran trabajo\ny haz que consigan un empleo digno y estable.",
            "Señor, sé refugio de los oprimidos\ny protégelos en todas sus necesidades."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Te pedimos por el eterno descanso de los que durante su vida ejercieron el ministerio para el bien de tu iglesia:\nque también te celebren eternamente en tu reino.\n\nFieles a la recomendación del Salvador nos atrevemos a decir:",
        "textoCompleto": "Alabemos a Cristo, que ama a la Iglesia y le da alimento y calor, y roguémosle confiados diciendo:\n\nAtiende, Señor, los deseos de tu pueblo.\n\nHaz, Señor, que todos los hombres se salven\ny lleguen al conocimiento de la verdad.\n\nGuarda con tu protección al papa Francisco y a nuestro obispo N.,\nayúdalos con el poder de tu brazo.\n\nTen compasión de los que no encuentran trabajo\ny haz que consigan un empleo digno y estable.\n\nSeñor, sé refugio de los oprimidos\ny protégelos en todas sus necesidades."
    },
    {
        "id": "tos02mavi",
        "varName": "tos2vima",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Martes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "martes",
        "libro": "visperas",
        "intro": "Alabemos a Cristo, pastor y obispo de nuestras vidas, que vela siempre con amor por su pueblo, y digámosle suplicantes:",
        "respuesta": "Protege, Señor, a tu pueblo.",
        "intenciones": [
            "Pastor eterno, protege a nuestro obispo N.\ny a todos los pastores de la Iglesia.",
            "Mira con bondad a los que sufren persecución\ny líbralos de todas sus angustias.",
            "Compadécete de los pobres y necesitados\ny da pan a los hambrientos.",
            "Ilumina a los que tienen la misión de gobernar a los pueblos\ny dales sabiduría y prudencia."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "No olvides, Señor, a los difuntos redimidos por tu sangre\ny admítelos en el festín de las bodas eternas.\n\nUnidos fraternalmente como hermanos de una misma familia, invoquemos al Padre común:",
        "textoCompleto": "Alabemos a Cristo, pastor y obispo de nuestras vidas, que vela siempre con amor por su pueblo, y digámosle suplicantes:\n\nProtege, Señor, a tu pueblo.\n\nPastor eterno, protege a nuestro obispo N.\ny a todos los pastores de la Iglesia.\n\nMira con bondad a los que sufren persecución\ny líbralos de todas sus angustias.\n\nCompadécete de los pobres y necesitados\ny da pan a los hambrientos.\n\nIlumina a los que tienen la misión de gobernar a los pueblos\ny dales sabiduría y prudencia."
    },
    {
        "id": "tos02mivi",
        "varName": "tos2vimi",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Miércoles (Vísperas)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "miercoles",
        "libro": "visperas",
        "intro": "Aclamemos, hermanos, a Dios, nuestro salvador, que se complace en enriquecernos con sus dones, y digámosle con fe:",
        "respuesta": "Muéstranos, Señor, tu amor y danos tu paz.",
        "intenciones": [
            "Dios eterno, mil años en tu presencia son como un ayer que pasó;\nayúdanos a recordar siempre que nuestra vida es como una hierba que se renueva por la mañana y se seca por la tarde.",
            "Alimenta a tu pueblo con el maná para que no perezca de hambre\ny dale el agua viva para que nunca más tenga sed.",
            "Que tus fieles busquen y saboreen los bienes de arriba\ny te glorifiquen también con su descanso.",
            "Concede, Señor, buen tiempo a las cosechas,\npara que la tierra de fruto abundante."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Que los difuntos puedan contemplar tu faz\ny que nosotros tengamos un día parte en su felicidad.\n\nConfiemos nuestras súplicas a Dios nuestro Padre, terminando nuestra oración con las palabras que Cristo nos enseñó:",
        "textoCompleto": "Aclamemos, hermanos, a Dios, nuestro salvador, que se complace en enriquecernos con sus dones, y digámosle con fe:\n\nMuéstranos, Señor, tu amor y danos tu paz.\n\nDios eterno, mil años en tu presencia son como un ayer que pasó;\nayúdanos a recordar siempre que nuestra vida es como una hierba que se renueva por la mañana y se seca por la tarde.\n\nAlimenta a tu pueblo con el maná para que no perezca de hambre\ny dale el agua viva para que nunca más tenga sed.\n\nQue tus fieles busquen y saboreen los bienes de arriba\ny te glorifiquen también con su descanso.\n\nConcede, Señor, buen tiempo a las cosechas,\npara que la tierra de fruto abundante."
    },
    {
        "id": "tos02juvi",
        "varName": "tos2viju",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Jueves (Vísperas)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "jueves",
        "libro": "visperas",
        "intro": "Elevemos a Dios nuestros corazones agradecidos porque ha bendecido a su pueblo con toda clase de bienes espirituales y digámosle con fe:",
        "respuesta": "Bendice, Señor, a tu pueblo.",
        "intenciones": [
            "Dios todopoderoso y lleno de misericordia, protege al Papa Francisco y a nuestro obispo N.,\nque tú mismo has elegido para guiar a la Iglesia.",
            "Protege, Señor, a nuestros pueblos y ciudades\ny aleja de ellos todo mal.",
            "Multiplica como renuevos de olivo alrededor de tu mesa hijos que se consagren a tu reino,\nsiguiendo a Jesucristo en pobreza, castidad y obediencia.",
            "Conserva el propósito de aquellas de tus hijas que han consagrado a ti su virginidad,\npara que, en la integridad de su cuerpo y de su espíritu, sigan al cordero donde quiera que vaya."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Da la paz a los difuntos\ny permítenos encontrarlos nuevamente un día en tu reino.\n\nYa que por Jesucristo hemos llegado a ser hijos de Dios, acudamos con confianza a nuestro Padre:",
        "textoCompleto": "Elevemos a Dios nuestros corazones agradecidos porque ha bendecido a su pueblo con toda clase de bienes espirituales y digámosle con fe:\n\nBendice, Señor, a tu pueblo.\n\nDios todopoderoso y lleno de misericordia, protege al Papa Francisco y a nuestro obispo N.,\nque tú mismo has elegido para guiar a la Iglesia.\n\nProtege, Señor, a nuestros pueblos y ciudades\ny aleja de ellos todo mal.\n\nMultiplica como renuevos de olivo alrededor de tu mesa hijos que se consagren a tu reino,\nsiguiendo a Jesucristo en pobreza, castidad y obediencia.\n\nConserva el propósito de aquellas de tus hijas que han consagrado a ti su virginidad,\npara que, en la integridad de su cuerpo y de su espíritu, sigan al cordero donde quiera que vaya."
    },
    {
        "id": "tos02vivi",
        "varName": "tos2vivi",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Viernes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "viernes",
        "libro": "visperas",
        "intro": "Bendigamos ahora al Señor Jesús, que en su vida mortal escuchó siempre con bondad las súplicas de los que acudían a él y enjugaba con amor las lágrimas de los que lloraban, y digámosle también nosotros:",
        "respuesta": "Señor, ten piedad.",
        "intenciones": [
            "Señor Jesucristo, tú que consolaste a los tristes y desconsolados, pon ahora tus ojos en los sufrimientos de los pobres\ny consuela a los deprimidos.",
            "Escucha los gemidos de los agonizantes\ny envíales tus ángeles para que los consuelen y conforten.",
            "Que los emigrantes sientan el consuelo de tu amor en el destierro, que puedan regresar a su patria\ny que un día alcancen también la patria eterna.",
            "Que los pecadores escuchando tu voz se conviertan,\ny encuentren en tu Iglesia el perdón y la paz."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Perdona las faltas de los que han muerto\ny dales la plenitud de tu salvación.\n\nCon el gozo que nos da el saber que somos hijos de Dios, digamos con plena confianza:",
        "textoCompleto": "Bendigamos ahora al Señor Jesús, que en su vida mortal escuchó siempre con bondad las súplicas de los que acudían a él y enjugaba con amor las lágrimas de los que lloraban, y digámosle también nosotros:\n\nSeñor, ten piedad.\n\nSeñor Jesucristo, tú que consolaste a los tristes y desconsolados, pon ahora tus ojos en los sufrimientos de los pobres\ny consuela a los deprimidos.\n\nEscucha los gemidos de los agonizantes\ny envíales tus ángeles para que los consuelen y conforten.\n\nQue los emigrantes sientan el consuelo de tu amor en el destierro, que puedan regresar a su patria\ny que un día alcancen también la patria eterna.\n\nQue los pecadores escuchando tu voz se conviertan,\ny encuentren en tu Iglesia el perdón y la paz."
    },
    {
        "id": "tos02savi",
        "varName": "tos2visa",
        "titulo": "Preces - Tiempo Ordinario - Semana 2 - Sábado (Vísperas)",
        "tiempo": "ordinario",
        "semana": "2",
        "dia": "sabado",
        "libro": "visperas",
        "intro": "Recordando la bondad de Cristo, que se compadeció del pueblo hambriento y obró en favor suyo los prodigios de su amor, digámosle con fe:",
        "respuesta": "Escúchanos, Señor.",
        "intenciones": [
            "Reconocemos, Señor, que todos los beneficios que hoy hemos recibido proceden de tu bondad;\nhaz que no sean estériles, sino que den fruto, encontrando un corazón noble de nuestra parte.",
            "Dios nuestro, luz y salvación de todos los pueblos, protege a los que dan testimonio de ti en el mundo,\ny enciende en ellos el fuego de tu Espíritu.",
            "Haz, Señor, que todos los hombres respeten la dignidad de sus hermanos,\ny que todos juntos edifiquemos un mundo cada vez más humano.",
            "A ti, que eres el médico de las almas y de los cuerpos,\nte pedimos que alivies a los enfermos y des la paz a los agonizantes, visitándolos con tu bondad."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Dígnate agregar a los difuntos al número de tus escogidos,\ncuyos nombres están escritos en el libro de la vida.\n\nPorque Jesús ha resucitado, todos somos hijos de Dios; por eso nos atrevemos a decir:",
        "textoCompleto": "Recordando la bondad de Cristo, que se compadeció del pueblo hambriento y obró en favor suyo los prodigios de su amor, digámosle con fe:\n\nEscúchanos, Señor.\n\nReconocemos, Señor, que todos los beneficios que hoy hemos recibido proceden de tu bondad;\nhaz que no sean estériles, sino que den fruto, encontrando un corazón noble de nuestra parte.\n\nDios nuestro, luz y salvación de todos los pueblos, protege a los que dan testimonio de ti en el mundo,\ny enciende en ellos el fuego de tu Espíritu.\n\nHaz, Señor, que todos los hombres respeten la dignidad de sus hermanos,\ny que todos juntos edifiquemos un mundo cada vez más humano.\n\nA ti, que eres el médico de las almas y de los cuerpos,\nte pedimos que alivies a los enfermos y des la paz a los agonizantes, visitándolos con tu bondad."
    },
    {
        "id": "tos03dovi",
        "varName": "tos3VIdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Domingo (Vísperas)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "domingo",
        "libro": "visperas",
        "intro": "Invoquemos a Dios, nuestro Padre, que maravillosamente creó el mundo, lo redimió de forma más admirable aún y no cesa de conservarlo con amor, y digámosle:",
        "respuesta": "Renueva, Señor, las maravillas de tu amor.",
        "intenciones": [
            "Señor, tú que en el universo, obra de tus manos, nos revelas tu poder,\nhaz que sepamos ver tu providencia en los acontecimientos del mundo.",
            "Tú que por la victoria de tu Hijo en la cruz anunciaste la paz al mundo,\nlíbranos de todo desaliento y de todo temor.",
            "A todos los que aman la justicia y trabajan por conseguirla,\nconcédeles que cooperen con sinceridad y concordia en la edificación de un mundo mejor.",
            "Ayuda a los oprimidos, consuela a los afligidos, libra a los cautivos, da pan a los hambrientos\ny fortalece a los débiles, para que en todos se manifieste el triunfo de la cruz."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Tú que al tercer día resucitaste a tu Hijo gloriosamente del sepulcro,\nhaz que nuestros hermanos difuntos lleguen también a la plenitud de la vida.\n\nConcluyamos nuestra súplica con la oración que el mismo Cristo nos enseñó:",
        "textoCompleto": "Invoquemos a Dios, nuestro Padre, que maravillosamente creó el mundo, lo redimió de forma más admirable aún y no cesa de conservarlo con amor, y digámosle:\n\nRenueva, Señor, las maravillas de tu amor.\n\nSeñor, tú que en el universo, obra de tus manos, nos revelas tu poder,\nhaz que sepamos ver tu providencia en los acontecimientos del mundo.\n\nTú que por la victoria de tu Hijo en la cruz anunciaste la paz al mundo,\nlíbranos de todo desaliento y de todo temor.\n\nA todos los que aman la justicia y trabajan por conseguirla,\nconcédeles que cooperen con sinceridad y concordia en la edificación de un mundo mejor.\n\nAyuda a los oprimidos, consuela a los afligidos, libra a los cautivos, da pan a los hambrientos\ny fortalece a los débiles, para que en todos se manifieste el triunfo de la cruz."
    },
    {
        "id": "tos03luvi",
        "varName": "tos3vilu",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Lunes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "lunes",
        "libro": "visperas",
        "intro": "Cristo quiere que todos los hombres alcancen la salvación. Digámosle, pues, confiadamente:",
        "respuesta": "Atrae, Señor, a todos hacia ti.",
        "intenciones": [
            "Te bendecimos, Señor, porque nos has redimido con tu preciosa sangre de la esclavitud del pecado;\nhaz que participemos en la gloriosa libertad de los hijos de Dios.",
            "Ayuda con tu gracia a nuestro obispo N. y a todos los obispos de la Iglesia,\npara que con gozo y fervor sirvan a tu pueblo.",
            "Que todos los que consagran su vida a la investigación de la verdad logren encontrarla\ny que, habiéndola encontrado, se esfuercen por difundirla entre sus hermanos.",
            "Atiende, Señor, a los huérfanos, a las viudas y a los que viven abandonados;\nayúdalos en sus necesidades para que experimenten tu solicitud hacia ellos."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Acoge a nuestros hermanos difuntos en la ciudad santa de la Jerusalén celestial,\nallí donde tú, con el Padre y el Espíritu Santo, serás todo en todos.\n\nAdoctrinados por el mismo Señor, nos atrevemos a decir:",
        "textoCompleto": "Cristo quiere que todos los hombres alcancen la salvación. Digámosle, pues, confiadamente:\n\nAtrae, Señor, a todos hacia ti.\n\nTe bendecimos, Señor, porque nos has redimido con tu preciosa sangre de la esclavitud del pecado;\nhaz que participemos en la gloriosa libertad de los hijos de Dios.\n\nAyuda con tu gracia a nuestro obispo N. y a todos los obispos de la Iglesia,\npara que con gozo y fervor sirvan a tu pueblo.\n\nQue todos los que consagran su vida a la investigación de la verdad logren encontrarla\ny que, habiéndola encontrado, se esfuercen por difundirla entre sus hermanos.\n\nAtiende, Señor, a los huérfanos, a las viudas y a los que viven abandonados;\nayúdalos en sus necesidades para que experimenten tu solicitud hacia ellos."
    },
    {
        "id": "tos03mavi",
        "varName": "tos3vima",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Martes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "martes",
        "libro": "visperas",
        "intro": "Invoquemos a Dios, esperanza de su pueblo, diciendo:",
        "respuesta": "Escúchanos, Señor.",
        "intenciones": [
            "Te damos gracias, Señor, porque hemos sido enriquecidos en todo por Cristo, tu Hijo;\nhaz que por él crezcamos en todo conocimiento.",
            "En tus manos, Señor, están el corazón y la mente de los que gobiernan;\ndales, pues, acierto en sus decisiones para que te sean gratos en su pensar y obrar.",
            "Tú que a los artistas concedes inspiración para plasmar la belleza que de ti procede,\nhaz que con sus obras aumente el gozo y la esperanza de los hombres.",
            "Tú que no permites que seamos tentados por encima de nuestras fuerzas,\nda fortaleza a los débiles, levanta a los caídos."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Tú que nos has prometido la resurrección en el último día,\nno te olvides de tus hijos que ya han dejado el cuerpo mortal.\n\nUnidos fraternalmente como hermanos de una misma familia, invoquemos al Padre común:",
        "textoCompleto": "Invoquemos a Dios, esperanza de su pueblo, diciendo:\n\nEscúchanos, Señor.\n\nTe damos gracias, Señor, porque hemos sido enriquecidos en todo por Cristo, tu Hijo;\nhaz que por él crezcamos en todo conocimiento.\n\nEn tus manos, Señor, están el corazón y la mente de los que gobiernan;\ndales, pues, acierto en sus decisiones para que te sean gratos en su pensar y obrar.\n\nTú que a los artistas concedes inspiración para plasmar la belleza que de ti procede,\nhaz que con sus obras aumente el gozo y la esperanza de los hombres.\n\nTú que no permites que seamos tentados por encima de nuestras fuerzas,\nda fortaleza a los débiles, levanta a los caídos."
    },
    {
        "id": "tos03mivi",
        "varName": "tos3vimi",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Miércoles (Vísperas)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "miercoles",
        "libro": "visperas",
        "intro": "Invoquemos a Dios, que envió a su Hijo como salvador y modelo supremo de su pueblo, diciendo:",
        "respuesta": "Que tu pueblo, Señor, te alabe.",
        "intenciones": [
            "Te damos gracias, Señor, porque nos has escogido como primicias para la salvación;\nhaz que sepamos corresponder y así logremos la gloria de nuestro Señor Jesucristo.",
            "Haz que todos los que confiesan tu santo nombre sean concordes en la verdad\ny vivan unidos por la caridad.",
            "Creador del universo, cuyo Hijo, al venir a este mundo, quiso trabajar con sus propias manos:\nacuérdate de los trabajadores que ganan el pan con el sudor de su rostro.",
            "Acuérdate también de todos los que viven entregados al servicio de los demás;\nque no se dejen vencer por el desaliento ante la incomprensión de los hombres."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Ten piedad de nuestros hermanos difuntos\ny líbralos del poder del Maligno.\n\nLlenos de fe invoquemos juntos al Padre común, repitiendo la oración que Jesús nos enseñó:",
        "textoCompleto": "Invoquemos a Dios, que envió a su Hijo como salvador y modelo supremo de su pueblo, diciendo:\n\nQue tu pueblo, Señor, te alabe.\n\nTe damos gracias, Señor, porque nos has escogido como primicias para la salvación;\nhaz que sepamos corresponder y así logremos la gloria de nuestro Señor Jesucristo.\n\nHaz que todos los que confiesan tu santo nombre sean concordes en la verdad\ny vivan unidos por la caridad.\n\nCreador del universo, cuyo Hijo, al venir a este mundo, quiso trabajar con sus propias manos:\nacuérdate de los trabajadores que ganan el pan con el sudor de su rostro.\n\nAcuérdate también de todos los que viven entregados al servicio de los demás;\nque no se dejen vencer por el desaliento ante la incomprensión de los hombres."
    },
    {
        "id": "tos03juvi",
        "varName": "tos3viju",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Jueves (Vísperas)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "jueves",
        "libro": "visperas",
        "intro": "Invoquemos a Cristo, pastor, protector y ayuda de su pueblo, diciendo:",
        "respuesta": "Señor, refugio nuestro, escúchanos.",
        "intenciones": [
            "Bendito seas, Señor, que nos has llamado a tu santa Iglesia;\nhaz que seamos fieles a esta dignación de tu amor.",
            "Tú que has encomendado al Papa Francisco la preocupación por todas las Iglesias,\nconcédele una fe inquebrantable, una esperanza viva y una caridad solícita.",
            "Da a los pecadores la conversión, a los que caen, fortaleza,\ny concede a todos la penitencia y la salvación.",
            "Tú que quisiste habitar en un país extranjero,\nacuérdate de los que viven lejos de su familia y de su patria."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "A todos los difuntos que esperaron en ti,\nconcédeles el descanso eterno.\n\nYa que por Jesucristo somos hijos de Dios, oremos con plena confianza a Dios nuestro Padre:",
        "textoCompleto": "Invoquemos a Cristo, pastor, protector y ayuda de su pueblo, diciendo:\n\nSeñor, refugio nuestro, escúchanos.\n\nBendito seas, Señor, que nos has llamado a tu santa Iglesia;\nhaz que seamos fieles a esta dignación de tu amor.\n\nTú que has encomendado al Papa Francisco la preocupación por todas las Iglesias,\nconcédele una fe inquebrantable, una esperanza viva y una caridad solícita.\n\nDa a los pecadores la conversión, a los que caen, fortaleza,\ny concede a todos la penitencia y la salvación.\n\nTú que quisiste habitar en un país extranjero,\nacuérdate de los que viven lejos de su familia y de su patria."
    },
    {
        "id": "tos03vivi",
        "varName": "tos3vivi",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Viernes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "viernes",
        "libro": "visperas",
        "intro": "Invoquemos al Hijo de Dios, a quien el Padre entregó por nuestras faltas y lo resucitó para nuestra justificación, diciendo:",
        "respuesta": "Señor, ten piedad.",
        "intenciones": [
            "Escucha, Señor, nuestras súplicas, perdona los pecados de los que se confiesen culpables\ny en tu bondad otórganos el perdón y la paz.",
            "Tú que, por medio del Apóstol nos has enseñado que donde se multiplicó el pecado sobreabundó mucho más la gracia,\nperdona con largueza nuestros muchos pecados.",
            "Hemos pecado mucho, Señor, pero confiamos en tu misericordia infinita;\nvuélvete a nosotros para que podamos convertirnos a ti.",
            "Salva a tu pueblo de sus pecados, Señor,\ny sé benévolo con nosotros."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Tú que abriste las puertas del paraíso al buen ladrón,\nábrelas también para nuestros hermanos difuntos.\n\nReconociendo que nuestra fuerza para no caer en la tentación se halla en Dios, digamos confiadamente:",
        "textoCompleto": "Invoquemos al Hijo de Dios, a quien el Padre entregó por nuestras faltas y lo resucitó para nuestra justificación, diciendo:\n\nSeñor, ten piedad.\n\nEscucha, Señor, nuestras súplicas, perdona los pecados de los que se confiesen culpables\ny en tu bondad otórganos el perdón y la paz.\n\nTú que, por medio del Apóstol nos has enseñado que donde se multiplicó el pecado sobreabundó mucho más la gracia,\nperdona con largueza nuestros muchos pecados.\n\nHemos pecado mucho, Señor, pero confiamos en tu misericordia infinita;\nvuélvete a nosotros para que podamos convertirnos a ti.\n\nSalva a tu pueblo de sus pecados, Señor,\ny sé benévolo con nosotros."
    },
    {
        "id": "tos03savi",
        "varName": "tos3visa",
        "titulo": "Preces - Tiempo Ordinario - Semana 3 - Sábado (Vísperas)",
        "tiempo": "ordinario",
        "semana": "3",
        "dia": "sabado",
        "libro": "visperas",
        "intro": "Invoquemos a Cristo, alegría de cuantos se refugian en él, y digámosle:",
        "respuesta": "Míranos y escúchanos, Señor.",
        "intenciones": [
            "Testigo fiel y primogénito de entre los muertos, tú que nos purificaste con tu sangre\nno permitas que olvidemos nunca tus beneficios.",
            "Haz que aquellos a quienes elegiste como ministros de tu Evangelio\nsean siempre fieles y celosos dispensadores de los misterios del reino.",
            "Rey de la paz, concede abundantemente tu Espíritu a los que gobiernan las naciones\npara que cuiden con interés de los pobres y postergados.",
            "Sé ayuda para cuantos son víctimas de cualquier segregación por causa de su raza, color, condición social, lengua o religión\ny haz que todos reconozcan su dignidad y respeten sus derechos."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "A los que han muerto en tu amor dales también parte en tu felicidad\ncon María y con todos tus santos.\n\nPorque Jesús ha resucitado, todos somos hijos de Dios; por eso nos atrevemos a decir:",
        "textoCompleto": "Invoquemos a Cristo, alegría de cuantos se refugian en él, y digámosle:\n\nMíranos y escúchanos, Señor.\n\nTestigo fiel y primogénito de entre los muertos, tú que nos purificaste con tu sangre\nno permitas que olvidemos nunca tus beneficios.\n\nHaz que aquellos a quienes elegiste como ministros de tu Evangelio\nsean siempre fieles y celosos dispensadores de los misterios del reino.\n\nRey de la paz, concede abundantemente tu Espíritu a los que gobiernan las naciones\npara que cuiden con interés de los pobres y postergados.\n\nSé ayuda para cuantos son víctimas de cualquier segregación por causa de su raza, color, condición social, lengua o religión\ny haz que todos reconozcan su dignidad y respeten sus derechos."
    },
    {
        "id": "tos04dovi",
        "varName": "tos4VIdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Domingo (Vísperas)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "domingo",
        "libro": "visperas",
        "intro": "Alegrándonos en el Señor, de quien vienen todos los dones, digámosle:",
        "respuesta": "Escucha, Señor, nuestra oración.",
        "intenciones": [
            "Padre y Señor de todos, que enviaste a tu Hijo al mundo para que tu nombre fuese glorificado desde donde sale el sol hasta el ocaso,\nfortalece el testimonio de tu Iglesia entre los pueblos.",
            "Haz que seamos dóciles a la predicación de los apóstoles,\ny sumisos a la fe verdadera.",
            "Tú que amas la justicia,\nhaz justicia a los oprimidos.",
            "Libera a los cautivos, abre los ojos al ciego,\nendereza a los que ya se doblan, guarda a los peregrinos."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Haz que nuestros hermanos que duermen ya el sueño de la paz\nlleguen, por tu Hijo, a la santa resurrección.\n\nUnidos entre nosotros y con Jesucristo, y dispuestos a perdonarnos siempre unos a otros, dirijamos al Padre nuestra súplica confiada:",
        "textoCompleto": "Alegrándonos en el Señor, de quien vienen todos los dones, digámosle:\n\nEscucha, Señor, nuestra oración.\n\nPadre y Señor de todos, que enviaste a tu Hijo al mundo para que tu nombre fuese glorificado desde donde sale el sol hasta el ocaso,\nfortalece el testimonio de tu Iglesia entre los pueblos.\n\nHaz que seamos dóciles a la predicación de los apóstoles,\ny sumisos a la fe verdadera.\n\nTú que amas la justicia,\nhaz justicia a los oprimidos.\n\nLibera a los cautivos, abre los ojos al ciego,\nendereza a los que ya se doblan, guarda a los peregrinos."
    },
    {
        "id": "tos04luvi",
        "varName": "tos4vilu",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Lunes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "lunes",
        "libro": "visperas",
        "intro": "Llenos de confianza en el Señor Jesús que no abandona nunca a los que se acogen a él, invoquémosle diciendo:",
        "respuesta": "Escúchanos, Señor, Dios nuestro.",
        "intenciones": [
            "Señor Jesucristo, tú eres nuestra luz; ilumina a tu Iglesia\npara que proclame a todas las naciones el gran misterio de piedad manifestado en tu encarnación.",
            "Guarda a los sacerdotes y ministros de la Iglesia,\ny haz que con su palabra y su ejemplo edifiquen tu pueblo santo.",
            "Tú que, por tu sangre, pacificaste el mundo,\naparta de nosotros el pecado de discordia y el azote de la guerra.",
            "Ayuda, Señor, a los que uniste con la gracia del matrimonio,\npara que su unión sea efectivamente signo del misterio de la Iglesia."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Concede, por tu misericordia, a todos los difuntos el perdón de sus faltas,\npara que sean contados entre tus elegidos.\n\nUnidos a Jesucristo, supliquemos ahora al Padre con la oración de los hijos de Dios:",
        "textoCompleto": "Llenos de confianza en el Señor Jesús que no abandona nunca a los que se acogen a él, invoquémosle diciendo:\n\nEscúchanos, Señor, Dios nuestro.\n\nSeñor Jesucristo, tú eres nuestra luz; ilumina a tu Iglesia\npara que proclame a todas las naciones el gran misterio de piedad manifestado en tu encarnación.\n\nGuarda a los sacerdotes y ministros de la Iglesia,\ny haz que con su palabra y su ejemplo edifiquen tu pueblo santo.\n\nTú que, por tu sangre, pacificaste el mundo,\naparta de nosotros el pecado de discordia y el azote de la guerra.\n\nAyuda, Señor, a los que uniste con la gracia del matrimonio,\npara que su unión sea efectivamente signo del misterio de la Iglesia."
    },
    {
        "id": "tos04mavi",
        "varName": "tos4vima",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Martes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "martes",
        "libro": "visperas",
        "intro": "Invoquemos a Cristo, que da fuerza y poder a su pueblo, diciendo:",
        "respuesta": "Señor, escúchanos.",
        "intenciones": [
            "Cristo, fortaleza nuestra, concede a todos tus fieles, a quienes has llamado a la luz de tu verdad,\nque tengan siempre fidelidad y constancia.",
            "Haz, Señor, que los que gobiernan el mundo lo hagan conforme a tu querer,\ny que sus decisiones vayan encaminadas a la consecución de la paz.",
            "Tú que con cinco panes saciaste a la multitud,\nenséñanos a socorrer con nuestros bienes a los hambrientos.",
            "Que los que tienen en su mano los destinos de los pueblos no cuiden sólo del bienestar de su nación,\nsino que piensen también en los otros pueblos."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Cuando vengas en tu día a ser glorificado en los santos,\nda a nuestros hermanos difuntos la resurrección y la vida feliz.\n\nTodos juntos, en familia, repitamos las palabras que nos enseñó Jesús, y oremos al Padre diciendo:",
        "textoCompleto": "Invoquemos a Cristo, que da fuerza y poder a su pueblo, diciendo:\n\nSeñor, escúchanos.\n\nCristo, fortaleza nuestra, concede a todos tus fieles, a quienes has llamado a la luz de tu verdad,\nque tengan siempre fidelidad y constancia.\n\nHaz, Señor, que los que gobiernan el mundo lo hagan conforme a tu querer,\ny que sus decisiones vayan encaminadas a la consecución de la paz.\n\nTú que con cinco panes saciaste a la multitud,\nenséñanos a socorrer con nuestros bienes a los hambrientos.\n\nQue los que tienen en su mano los destinos de los pueblos no cuiden sólo del bienestar de su nación,\nsino que piensen también en los otros pueblos."
    },
    {
        "id": "tos04mivi",
        "varName": "tos4vimi",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Miércoles (Vísperas)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "miercoles",
        "libro": "visperas",
        "intro": "Invoquemos a Dios, cuya bondad para con su pueblo es más grande que los cielos, y digámosle:",
        "respuesta": "Que se alegren los que se acogen a ti, Señor.",
        "intenciones": [
            "Acuérdate, Señor, que enviaste a tu Hijo al mundo, no para condenarlo, sino para salvarlo;\nhaz que su muerte gloriosa nos traiga la salvación.",
            "Tú que constituiste a tus sacerdotes servidores de Cristo y administradores de tus misterios,\nconcédeles un corazón fiel, ciencia abundante y caridad intensa.",
            "Tú que desde el principio creaste hombre y mujer,\nguarda a todas las familias unidas en el verdadero amor.",
            "Haz que los que has llamado a la castidad perfecta por el reino de los cielos,\nsigan con fidelidad a tu Hijo."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Tú que enviaste a Jesucristo al mundo para salvar a los pecadores,\nConcede a todos los difuntos el perdón de sus faltas.\n\nMovidos por el Espíritu Santo y llenos de su amor, dirijamos al Padre nuestra oración:",
        "textoCompleto": "Invoquemos a Dios, cuya bondad para con su pueblo es más grande que los cielos, y digámosle:\n\nQue se alegren los que se acogen a ti, Señor.\n\nAcuérdate, Señor, que enviaste a tu Hijo al mundo, no para condenarlo, sino para salvarlo;\nhaz que su muerte gloriosa nos traiga la salvación.\n\nTú que constituiste a tus sacerdotes servidores de Cristo y administradores de tus misterios,\nconcédeles un corazón fiel, ciencia abundante y caridad intensa.\n\nTú que desde el principio creaste hombre y mujer,\nguarda a todas las familias unidas en el verdadero amor.\n\nHaz que los que has llamado a la castidad perfecta por el reino de los cielos,\nsigan con fidelidad a tu Hijo."
    },
    {
        "id": "tos04juvi",
        "varName": "tos4viju",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Jueves (Vísperas)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "jueves",
        "libro": "visperas",
        "intro": "Invoquemos a Cristo, luz del mundo y alegría de todo ser viviente, y digámosle confiados:",
        "respuesta": "Señor, danos tu luz, la salvación y la paz.",
        "intenciones": [
            "Luz indeficiente y palabra eterna del Padre, tú que has venido a salvar a los hombres,\nilumina a los catecúmenos de la Iglesia con la luz de tu verdad.",
            "No lleves cuenta de nuestros delitos, Señor,\npues de ti procede el perdón.",
            "Señor, tú que has querido que la inteligencia del hombre investigara los secretos de la naturaleza,\nhaz que la ciencia y las artes contribuyan a tu gloria y al bienestar de todos los hombres.",
            "Protege, Señor, a los que se han consagrado en el mundo al servicio de sus hermanos;\nque con libertad de espíritu y sin desánimo puedan realizar su ideal."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Señor, tú que abres y nadie puede cerrar, ilumina a nuestros difuntos que yacen en tiniebla y en sombra de muerte,\ny ábreles las puertas de tu reino.\n\nPorque todos nos sabemos hermanos, hijos de un mismo Dios, confiadamente nos atrevemos a decir:",
        "textoCompleto": "Invoquemos a Cristo, luz del mundo y alegría de todo ser viviente, y digámosle confiados:\n\nSeñor, danos tu luz, la salvación y la paz.\n\nLuz indeficiente y palabra eterna del Padre, tú que has venido a salvar a los hombres,\nilumina a los catecúmenos de la Iglesia con la luz de tu verdad.\n\nNo lleves cuenta de nuestros delitos, Señor,\npues de ti procede el perdón.\n\nSeñor, tú que has querido que la inteligencia del hombre investigara los secretos de la naturaleza,\nhaz que la ciencia y las artes contribuyan a tu gloria y al bienestar de todos los hombres.\n\nProtege, Señor, a los que se han consagrado en el mundo al servicio de sus hermanos;\nque con libertad de espíritu y sin desánimo puedan realizar su ideal."
    },
    {
        "id": "tos04vivi",
        "varName": "tos4vivi",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Viernes (Vísperas)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "viernes",
        "libro": "visperas",
        "intro": "Invoquemos a Cristo, en quien confían los que conocen su nombre, diciendo:",
        "respuesta": "Confirma, Señor, lo que has realizado en nosotros.",
        "intenciones": [
            "Señor Jesucristo, consuelo de los humildes,\ndígnate sostener con tu gracia nuestra fragilidad, siempre inclinada al pecado.",
            "Que los que por nuestra debilidad estamos inclinados al mal,\npor tu misericordia obtengamos el perdón.",
            "Señor, a quien ofende el pecado y aplaca la penitencia,\naparta de nosotros el castigo merecido por nuestros pecados.",
            "Tú que perdonaste a la mujer arrepentida y cargaste sobre los hombros la oveja descarriada,\nno apartes de nosotros tu misericordia."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Tú que por nosotros aceptaste el suplicio de la cruz,\nabre las puertas del cielo a todos los difuntos que en ti confiaron.\n\nSiguiendo las enseñanzas de Jesucristo, digamos al Padre celestial:",
        "textoCompleto": "Invoquemos a Cristo, en quien confían los que conocen su nombre, diciendo:\n\nConfirma, Señor, lo que has realizado en nosotros.\n\nSeñor Jesucristo, consuelo de los humildes,\ndígnate sostener con tu gracia nuestra fragilidad, siempre inclinada al pecado.\n\nQue los que por nuestra debilidad estamos inclinados al mal,\npor tu misericordia obtengamos el perdón.\n\nSeñor, a quien ofende el pecado y aplaca la penitencia,\naparta de nosotros el castigo merecido por nuestros pecados.\n\nTú que perdonaste a la mujer arrepentida y cargaste sobre los hombros la oveja descarriada,\nno apartes de nosotros tu misericordia."
    },
    {
        "id": "tos04savi",
        "varName": "tos4visa",
        "titulo": "Preces - Tiempo Ordinario - Semana 4 - Sábado (Vísperas)",
        "tiempo": "ordinario",
        "semana": "4",
        "dia": "sabado",
        "libro": "visperas",
        "intro": "Glorifiquemos a Dios, Padre, Hijo, y Espíritu Santo, y supliquémosle diciendo:",
        "respuesta": "Escucha a tu pueblo, Señor.",
        "intenciones": [
            "Padre todopoderoso, haz que abunde en la tierra la justicia\ny que tu pueblo se alegre en la paz.",
            "Que todos los pueblos entren a formar parte de tu reino\ny que el pueblo judío sea salvado.",
            "Que los esposos cumplan tu voluntad, vivan en concordia\ny que sean siempre fieles a su mutuo amor.",
            "Recompensa, Señor, a nuestros bienhechores\ny concédeles la vida eterna."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Acoge con amor a los que han muerto víctimas del odio, de la violencia o de la guerra\ny dales el descanso eterno.\n\nMovidos por el Espíritu Santo, dirijamos al Padre la oración que Cristo nos enseñó:",
        "textoCompleto": "Glorifiquemos a Dios, Padre, Hijo, y Espíritu Santo, y supliquémosle diciendo:\n\nEscucha a tu pueblo, Señor.\n\nPadre todopoderoso, haz que abunde en la tierra la justicia\ny que tu pueblo se alegre en la paz.\n\nQue todos los pueblos entren a formar parte de tu reino\ny que el pueblo judío sea salvado.\n\nQue los esposos cumplan tu voluntad, vivan en concordia\ny que sean siempre fieles a su mutuo amor.\n\nRecompensa, Señor, a nuestros bienhechores\ny concédeles la vida eterna."
    },
    {
        "id": "tos05dovi",
        "varName": "tos5VIdo",
        "titulo": "Preces - Tiempo Ordinario - Semana 5 - Domingo (Vísperas)",
        "tiempo": "ordinario",
        "semana": "5",
        "dia": "domingo",
        "libro": "visperas",
        "intro": "Adoremos a Cristo, Señor nuestro y cabeza de la Iglesia, y digámosle confiadamente:",
        "respuesta": "Venga a nosotros tu reino, Señor.",
        "intenciones": [
            "Señor, amigo de los hombres, haz de tu Iglesia instrumento de concordia y unidad entre ellos\ny signo de salvación para todos los pueblos.",
            "Protege con tu brazo poderoso al Papa y a todos los obispos\ny concédeles trabajar en unidad, amor y paz.",
            "A los cristianos concédenos vivir íntimamente unidos a ti, nuestro Maestro,\ny dar testimonio en nuestras vidas de la llegada de tu reino.",
            "Concede, Señor, al mundo el don de la paz\ny haz que en todos los pueblos reine la justicia y el bienestar."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Otorga, a los que han muerto, una resurrección gloriosa\ny haz que los que aún vivimos en este mundo gocemos un día con ellos de la felicidad eterna.\n\nTerminemos nuestra oración con las palabras del Señor:",
        "textoCompleto": "Adoremos a Cristo, Señor nuestro y cabeza de la Iglesia, y digámosle confiadamente:\n\nVenga a nosotros tu reino, Señor.\n\nSeñor, amigo de los hombres, haz de tu Iglesia instrumento de concordia y unidad entre ellos\ny signo de salvación para todos los pueblos.\n\nProtege con tu brazo poderoso al Papa y a todos los obispos\ny concédeles trabajar en unidad, amor y paz.\n\nA los cristianos concédenos vivir íntimamente unidos a ti, nuestro Maestro,\ny dar testimonio en nuestras vidas de la llegada de tu reino.\n\nConcede, Señor, al mundo el don de la paz\ny haz que en todos los pueblos reine la justicia y el bienestar."
    }
];

function normalizarLibroPreces(libro) {
    const l = String(libro || 'laudes').toLowerCase().trim();
    if (l === 'vispera' || l === 'visperas' || l === 'vi') return 'visperas';
    if (l === 'laudes' || l === 'laud' || l === 'la') return 'laudes';
    return l;
}

function coincideLibroPreces(pLibro, libroBuscado) {
    if (!pLibro || !libroBuscado) return true;
    return normalizarLibroPreces(pLibro) === normalizarLibroPreces(libroBuscado);
}

export const PrecesDB = {
    getCatalogo: () => {
        const mapa = new Map();
        if (typeof localStorage !== 'undefined') {
            try {
                const raw = localStorage.getItem('lh_preces_cache');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        for (const p of parsed) {
                            if (!p || !p.id) continue;
                            // Ignorar semilla antigua errónea tos1visab (que tenía texto de viernes semana 4)
                            if (p.id === 'tos1visab' && p.respuesta === 'Confirma, Señor, lo que has realizado en nosotros.') {
                                continue;
                            }
                            mapa.set(String(p.id).toLowerCase(), p);
                        }
                    }
                }
            } catch (_) {}
        }
        for (const s of CATALOGO_PRECES_SEED) {
            const k = String(s.id).toLowerCase();
            const kVar = s.varName ? String(s.varName).toLowerCase() : null;
            if (!mapa.has(k) && (!kVar || !mapa.has(kVar))) {
                mapa.set(k, s);
            }
        }
        return Array.from(mapa.values());
    },
    listar: () => PrecesDB.getCatalogo(),
    obtenerPorId: (id) => {
        if (!id) return null;
        let cleanId = String(id).toLowerCase().trim().replace(/_(prec|preces)$/, '');
        if (cleanId === 'tos1visab') cleanId = 'tos01savi';
        const catalogo = PrecesDB.getCatalogo();
        const exact = catalogo.find(p =>
            (p.id && p.id.toLowerCase().replace(/_(prec|preces)$/, '') === cleanId) ||
            (p.varName && p.varName.toLowerCase().replace(/_(prec|preces)$/, '') === cleanId)
        );
        if (exact) return exact;

        // Probar equivalencia entre formato nuevo (tos01dovi) y antiguo (tos1vido)
        const mDiaHora = cleanId.match(/^(to|ta|tn|tc|tp)s0?(\d+)(do|lu|ma|mi|ju|vi|sa)(of|la|te|se|no|vi|co)$/);
        if (mDiaHora) {
            const [, t, s, d, h] = mDiaHora;
            const sNum = parseInt(s, 10);
            const sPad = String(sNum).padStart(2, '0');
            const cands = [
                `${t}s${sPad}${d}${h}`,
                `${t}s${sNum}${d}${h}`,
                `${t}s${sNum}${h}${d}`,
                `${t}s${sPad}${h}${d}`
            ];
            for (const c of cands) {
                const f = catalogo.find(p =>
                    (p.id && p.id.toLowerCase() === c) ||
                    (p.varName && p.varName.toLowerCase() === c)
                );
                if (f) return f;
            }
        }
        return null;
    },
    obtener: (id, tiempo = null, semana = null, dia = null, libro = null) => {
        if (!id && !tiempo) return null;
        const cleanId = String(id || '').toLowerCase().trim();
        const libroTarget = libro ? normalizarLibroPreces(libro) : null;

        // 1. Coincidencia por ID (verificando que no sea una preces de Laudes inyectada por error en Vísperas)
        if (cleanId) {
            const direct = PrecesDB.obtenerPorId(cleanId);
            if (direct) {
                if (!libroTarget || coincideLibroPreces(direct.libro, libroTarget) || cleanId.startsWith('sa') || tiempo === 'santos') {
                    return direct;
                }
            }
        }

        if (cleanId.startsWith('sa') || tiempo === 'santos') {
            return null;
        }

        // 2. Decodificar códigos litúrgicos (ej: tos01dovi, tos1vido, tos01dola, ordinario_semana_1_domingo_visperas)
        let decT = tiempo;
        let decS = semana;
        let decD = dia;
        let decL = libroTarget || 'laudes';

        if (cleanId) {
            const cleanSinSuf = cleanId.replace(/_(prec|preces)$/, '');
            const mNuevo = cleanSinSuf.match(/^(to|ta|tn|tc|tp|san)(s\d+)(do|lu|ma|mi|ju|vi|sa)(of|la|te|se|no|vi|co)?$/);
            const mAntiguo = cleanSinSuf.match(/^(to|ta|tn|tc|tp|san)(s\d+)(of|la|te|se|no|vi|co)(do|lu|ma|mi|ju|vi|sa)$/);
            const mVerboso = cleanSinSuf.match(/^([a-z]+)_(?:semana_)?(\d+)_([a-z]+)_([a-z]+)$/);

            const MAPA_T = { to: 'ordinario', ta: 'adviento', tn: 'navidad', tc: 'cuaresma', tp: 'pascua' };
            const MAPA_D = { do: 'domingo', lu: 'lunes', ma: 'martes', mi: 'miercoles', ju: 'jueves', vi: 'viernes', sa: 'sabado' };
            const MAPA_L = { of: 'oficio', la: 'laudes', te: 'tercia', se: 'sexta', no: 'nona', vi: 'visperas', co: 'completas' };

            if (mNuevo) {
                decT = decT || MAPA_T[mNuevo[1]];
                decS = decS || parseInt(mNuevo[2].replace('s', ''), 10);
                decD = decD || MAPA_D[mNuevo[3]];
                decL = libroTarget || (mNuevo[4] ? (MAPA_L[mNuevo[4]] || decL) : decL);
            } else if (mAntiguo) {
                decT = decT || MAPA_T[mAntiguo[1]];
                decS = decS || parseInt(mAntiguo[2].replace('s', ''), 10);
                decL = libroTarget || MAPA_L[mAntiguo[3]] || decL;
                decD = decD || MAPA_D[mAntiguo[4]];
            } else if (mVerboso) {
                decT = decT || mVerboso[1];
                decS = decS || parseInt(mVerboso[2], 10);
                decD = decD || mVerboso[3];
                decL = libroTarget || normalizarLibroPreces(mVerboso[4]);
            }
        }

        if (decT === 'santos') return null;

        if (decT || decS || decD) {
            return PrecesDB.obtenerRecomendada(decT || 'ordinario', decS || 1, decD || 'domingo', decL || 'laudes');
        }

        return null;
    },
    buscar: (termino) => {
        const catalogo = PrecesDB.getCatalogo();
        if (!termino) return catalogo;
        const t = termino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return catalogo.filter(p => {
            const tit = (p.titulo || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const intro = (p.intro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const resp = (p.respuesta || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const ints = (Array.isArray(p.intenciones) ? p.intenciones.join(' ') : (p.intenciones || '')).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const concl = (p.concl || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return tit.includes(t) || intro.includes(t) || resp.includes(t) || ints.includes(t) || concl.includes(t) || (p.id && p.id.toLowerCase().includes(t));
        });
    },
    obtenerRecomendada: (tiempo, semana, dia, libro = 'laudes') => {
        const catalogo = PrecesDB.getCatalogo();
        const semNum = parseInt(String(semana).replace(/[^0-9]/g, ''), 10) || 1;
        const semCiclo = ((semNum - 1) % 4) + 1;
        const semPad = String(semNum).padStart(2, '0');
        const semCicloPad = String(semCiclo).padStart(2, '0');
        const diaNorm = (dia || 'lunes').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const diaPref = diaNorm.slice(0, 2);
        const libroNorm = normalizarLibroPreces(libro);
        const mapT = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp' };
        const tPref = mapT[tiempo] || 'to';
        const hPref = libroNorm === 'visperas' ? 'vi' : (libroNorm === 'laudes' ? 'la' : libroNorm.slice(0, 2));

        const esDomCiclo1Posterior = (tiempo === 'ordinario' && diaNorm === 'domingo' && semNum > 1 && semCiclo === 1);

        const clavesBuscar = [
            `${tPref}s${semPad}${diaPref}${hPref}`,
            `${tPref}s${semNum}${diaPref}${hPref}`,
            `${tPref}s${semNum}${hPref}${diaPref}`,
            `${tPref}s${semPad}${hPref}${diaPref}`,
            esDomCiclo1Posterior ? `${tPref}s05do${hPref}` : null,
            esDomCiclo1Posterior ? `${tPref}s5${hPref}do` : null,
            `${tPref}s${semCicloPad}${diaPref}${hPref}`,
            `${tPref}s${semCiclo}${diaPref}${hPref}`,
            `${tPref}s${semCiclo}${hPref}${diaPref}`,
            `${tPref}s${semCicloPad}${hPref}${diaPref}`,
            (libroNorm === 'laudes' && diaNorm === 'domingo' && semNum === 1) ? 'tos1LAdo' : null,
            (libroNorm === 'laudes' && diaNorm === 'domingo' && semNum === 1) ? 'bautismoLA' : null
        ].filter(Boolean);

        for (const k of clavesBuscar) {
            const cleanK = k.toLowerCase();
            const found = catalogo.find(p =>
                coincideLibroPreces(p.libro, libroNorm) && (
                    (p.id && p.id.toLowerCase().replace(/_(prec|preces)$/, '') === cleanK) ||
                    (p.varName && p.varName.toLowerCase().replace(/_(prec|preces)$/, '') === cleanK)
                )
            );
            if (found) return found;
        }

        // Búsqueda por tiempo, semana exacta, día y libro
        const matchExacto = catalogo.find(p =>
            p.tiempo === tiempo &&
            parseInt(String(p.semana).replace(/\D/g, ''), 10) === semNum &&
            (p.dia || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === diaNorm &&
            coincideLibroPreces(p.libro, libroNorm)
        );
        if (matchExacto) return matchExacto;

        // Búsqueda por ciclo de 4 semanas
        const matchCiclo = catalogo.find(p =>
            p.tiempo === tiempo &&
            parseInt(String(p.semana).replace(/\D/g, ''), 10) === (esDomCiclo1Posterior ? 5 : semCiclo) &&
            (p.dia || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === diaNorm &&
            coincideLibroPreces(p.libro, libroNorm)
        ) || catalogo.find(p =>
            p.tiempo === tiempo &&
            parseInt(String(p.semana).replace(/\D/g, ''), 10) === semCiclo &&
            (p.dia || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === diaNorm &&
            coincideLibroPreces(p.libro, libroNorm)
        );
        if (matchCiclo) return matchCiclo;

        const matchDia = catalogo.find(p =>
            (p.dia || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === diaNorm &&
            coincideLibroPreces(p.libro, libroNorm)
        );
        if (matchDia) return matchDia;

        // Fallback primer elemento del mismo libro
        return catalogo.find(p => coincideLibroPreces(p.libro, libroNorm)) || catalogo[0];
    }
};

if (typeof window !== 'undefined') {
    window.PrecesDB = PrecesDB;
    window.CATALOGO_PRECES_SEED = CATALOGO_PRECES_SEED;
}
