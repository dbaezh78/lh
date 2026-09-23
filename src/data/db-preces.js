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
        "id": "tos1visab",
        "varName": "tos1visab",
        "titulo": "Preces - Tiempo Ordinario - Semana 1 - Sábado (Vísperas)",
        "tiempo": "ordinario",
        "semana": "1",
        "dia": "sabado",
        "libro": "visperas",
        "intro": "Invoquemos a Cristo, en quien confian los que conocen su nombre, diciendo:",
        "respuesta": "Confirma, Señor, lo que has realizado en nosotros.",
        "intenciones": [
            "Señor Jesucristo, consuelo de los humildes,\ndígnate sostener con tu gracia nuestra fragilidad, siempre inclinada al pecado.",
            "Que los que por nuestra debilidad estamos inclinados al mal,\npor tu misericordia obtengamos el perdón.",
            "Señor, a quien ofende el pecado y aplaca la penitencia,\naparta de nosotros el castigo merecido por nuestros pecados.",
            "Tú que perdonaste a la mujer arrepentida y cargaste sobre los hombros la oveja descarriada,\nno apartes de nosotros tu misericordia.",
            "Tú que por nosotros aceptaste el suplicio de la cruz,\nabre las puertas del cielo a todos los difuntos que en ti confiaron."
        ],
        "libre": "Se pueden añadir algunas intenciones libres",
        "concl": "Siguiendo las enseñanzas de Jesucristo, digamos al Padre celestial:",
        "textoCompleto": "Invoquemos a Cristo, en quien confian los que conocen su nombre, diciendo:\n\nConfirma, Señor, lo que has realizado en nosotros.\n\nSeñor Jesucristo, consuelo de los humildes,\ndígnate sostener con tu gracia nuestra fragilidad, siempre inclinada al pecado.\n\nQue los que por nuestra debilidad estamos inclinados al mal,\npor tu misericordia obtengamos el perdón.\n\nSeñor, a quien ofende el pecado y aplaca la penitencia,\naparta de nosotros el castigo merecido por nuestros pecados.\n\nTú que perdonaste a la mujer arrepentida y cargaste sobre los hombros la oveja descarriada,\nno apartes de nosotros tu misericordia.\n\nTú que por nosotros aceptaste el suplicio de la cruz,\nabre las puertas del cielo a todos los difuntos que en ti confiaron."
    }
];

export const PrecesDB = {
    listar: () => CATALOGO_PRECES_SEED,
    obtener: (id, tiempo = null, semana = null, dia = null, libro = 'laudes') => {
        if (!id && !tiempo) return null;
        const cleanId = String(id || '').toLowerCase().trim();

        // 1. Coincidencia exacta o insensible a mayúsculas
        if (cleanId) {
            const direct = CATALOGO_PRECES_SEED.find(p => 
                (p.id && p.id.toLowerCase() === cleanId) || 
                (p.varName && p.varName.toLowerCase() === cleanId)
            );
            if (direct) return direct;
        }

        // 2. Decodificar códigos litúrgicos (ej: tos01dola, tos1dola, tos01mila, ordinario_semana_1_domingo_laudes)
        let decT = tiempo;
        let decS = semana;
        let decD = dia;
        let decL = libro || 'laudes';

        if (cleanId) {
            const mNuevo = cleanId.match(/^(to|ta|tn|tc|tp|san)(s\d+)(do|lu|ma|mi|ju|vi|sa)(of|la|te|se|no|vi|co)?$/);
            const mAntiguo = cleanId.match(/^(to|ta|tn|tc|tp|san)(s\d+)(of|la|te|se|no|vi|co)(do|lu|ma|mi|ju|vi|sa)$/);
            const mVerboso = cleanId.match(/^([a-z]+)_(?:semana_)?(\d+)_([a-z]+)_([a-z]+)$/);

            const MAPA_T = { to: 'ordinario', ta: 'adviento', tn: 'navidad', tc: 'cuaresma', tp: 'pascua' };
            const MAPA_D = { do: 'domingo', lu: 'lunes', ma: 'martes', mi: 'miercoles', ju: 'jueves', vi: 'viernes', sa: 'sabado' };
            const MAPA_L = { of: 'oficio', la: 'laudes', te: 'tercia', se: 'sexta', no: 'nona', vi: 'visperas', co: 'completas' };

            if (mNuevo) {
                decT = MAPA_T[mNuevo[1]] || decT;
                decS = parseInt(mNuevo[2].replace('s', ''), 10);
                decD = MAPA_D[mNuevo[3]] || decD;
                decL = mNuevo[4] ? (MAPA_L[mNuevo[4]] || decL) : decL;
            } else if (mAntiguo) {
                decT = MAPA_T[mAntiguo[1]] || decT;
                decS = parseInt(mAntiguo[2].replace('s', ''), 10);
                decL = MAPA_L[mAntiguo[3]] || decL;
                decD = MAPA_D[mAntiguo[4]] || decD;
            } else if (mVerboso) {
                decT = mVerboso[1];
                decS = parseInt(mVerboso[2], 10);
                decD = mVerboso[3];
                decL = mVerboso[4];
            }
        }

        if (decT || decS || decD) {
            return PrecesDB.obtenerRecomendada(decT || 'ordinario', decS || 1, decD || 'domingo', decL || 'laudes');
        }

        return CATALOGO_PRECES_SEED[0] || null;
    },
    buscar: (termino) => {
        if (!termino) return CATALOGO_PRECES_SEED;
        const t = termino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return CATALOGO_PRECES_SEED.filter(p => {
            const tit = (p.titulo || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const intro = (p.intro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const resp = (p.respuesta || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const ints = (p.intenciones || []).join(' ').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return tit.includes(t) || intro.includes(t) || resp.includes(t) || ints.includes(t) || p.id.toLowerCase().includes(t);
        });
    },
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
            diaNorm === 'domingo' && semNum === 1 ? 'tos1LAdo' : null,
            diaNorm === 'domingo' ? 'tos' + semNum + 'LAdo' : null,
            diaNorm === 'domingo' ? 'tos' + semCiclo + 'LAdo' : null,
            'tos' + semNum + 'vi' + diaPref,
            'tos' + semCiclo + 'vi' + diaPref
        ].filter(Boolean);

        for (const k of clavesBuscar) {
            const cleanK = k.toLowerCase();
            const found = CATALOGO_PRECES_SEED.find(p => 
                p.id.toLowerCase() === cleanK || 
                (p.varName && p.varName.toLowerCase() === cleanK)
            );
            if (found) return found;
        }

        // Búsqueda por tiempo, semana, día y libro
        const matchExacto = CATALOGO_PRECES_SEED.find(p => 
            p.tiempo === tiempo && 
            Number(p.semana) === semNum && 
            p.dia === diaNorm && 
            (p.libro === libro || (p.libro === 'visperas' && libro === 'vispera'))
        );
        if (matchExacto) return matchExacto;

        const matchCiclo = CATALOGO_PRECES_SEED.find(p => 
            p.tiempo === tiempo && 
            Number(p.semana) === semCiclo && 
            p.dia === diaNorm && 
            (p.libro === libro || (p.libro === 'visperas' && libro === 'vispera'))
        );
        if (matchCiclo) return matchCiclo;

        const matchDia = CATALOGO_PRECES_SEED.find(p => 
            p.dia === diaNorm && 
            (p.libro === libro || (p.libro === 'visperas' && libro === 'vispera'))
        );
        if (matchDia) return matchDia;

        // Fallback primer elemento
        return CATALOGO_PRECES_SEED[0];
    }
};

if (typeof window !== 'undefined') {
    window.PrecesDB = PrecesDB;
    window.CATALOGO_PRECES_SEED = CATALOGO_PRECES_SEED;
}
