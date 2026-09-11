/* 
dm = Domingo
ln = Lunes
mt = Martes
ml = Miercoles
js = Jueves
vs = Viernes
sb = Sabado
*/
// 1. El denominador común de la estructura principal (Salmos, Lecturas, etc.)
// s1TO1 = Semana 1 Tiempo Ordinario Comun (1,5,9,13,17,21,25,29,33)
    const s1TO1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,       },
// Invitatorio
        antifonaInvitatorio:                tos1LAdoI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAdoI,
            antifonaInvitatorio_Salida:     tos1LAdoI,
// Himno
            himnot:                         htos1LAdot,
            himno:                          htos1LAdo,          },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1LAdo1,
            SalmoUNOt:                      salmo117t,
            SalmoUNO:                       salmo117,
// Salmodia 2    
            Ant2:                           tos1LAdo2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,
// Salmodia 3
            Ant3:                           tos1LAdo3,
            SalmoTRESt:                     salmo150t,
            SalmoTRES:                      salmo150,           },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1LAdo_lbt,
            LecturaTexto:                   tos1LAdo_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1LAdo_rb,
            responsorio2:                   tos1LAdo_rb,
            responsorio3:                   tos1LAdo_rb1,
            responsorio4:                   tos1LAdo_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1LAdo_rb,        }};

    // 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
    const s1TO2 = {
//CANTICO EVANGELICO
        canticoZacariast: canticoZacariast,
        canticoZacarias:  canticoZacarias,
// PRECES
        preces1:          tos1LAdo_preces1,
        preces2:          tos1LAdo_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
        Padren:           "Padre nuestro...",
        oracion:          tos1LAdo_oracion,
        Conclusion1:      Conclusion1,
        Conclusion2:      Conclusion2                           };

// 1. El denominador común de la estructura principal (Salmos, Lecturas, etc.)
// COMUN 2,6,10,14,18,22,26,30
    const s2TO1 = {
        tt:                            "LAUDES",
        sub:                           "(Oración de la mañana)",
        invitatorio: {
            titulo:                    "INVITATORIO",
            instruccion:               instruccion,
            v:                         invitatorio1,
            r:                         invitatorio2,            },
// Invitatorio
        antifonaInvitatorio:           tos2LAdoI,
        salmoInvitatorio: {
            titulo:                    salmo94t,
            subtitulo:                 invitacion,
            contentInv:                salmo94,
// Antifona de Entrada
            antifonaInvitatorio:       tos2LAdoI,
            antifonaInvitatorio_Salida:tos2LAdoI,
// Himno
            himnot:                    htos2LAdot,
            himno:                     htos2LAdo,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                      tos2LAdo1,
            SalmoUNOt:                 salmo117t,
            SalmoUNO:                  salmo117,
// Salmodia 2    
            Ant2:                      tos2LAdo2,
            SalmoDOSt:                 dn_3_57_88_56t,
            SalmoDOS:                  dn_3_57_88_56,
// Salmodia 3
            Ant3:                      tos2LAdo3,
            SalmoTRESt:                salmo150t,
            SalmoTRES:                 salmo150,        },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:               tos2LAdo_lbt,
            LecturaTexto:              tos2LAdo_lb,
//RESPONSORIO BREVE
            responsorio1:              tos2LAdo_rb,
            responsorio2:              tos2LAdo_rb,
            responsorio3:              tos2LAdo_rb1,
            responsorio4:              tos2LAdo_rb2,
            gloria:                    gloria,
            responsorio5:              tos2LAdo_rb,         }};

    // 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
    const s2TO2 = {
//CANTICO EVANGELICO
        canticoZacariast: canticoZacariast,
        canticoZacarias:  canticoZacarias,
// PRECES
        preces1:          tos2LAdo_preces1,
        preces2:          tos2LAdo_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
        Padren:           "Padre nuestro...",
        oracion:          tos2LAdo_oracion,
        Conclusion1:      Conclusion1,
        Conclusion2:      Conclusion2           };

// COMUN 3,7,11,15,19,23,27,31
const s3TO1 = {
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   
              r:                            invitatorio2,          },
// Invitatorio
        antifonaInvitatorio:                tos3LAdoI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAdoI,
            antifonaInvitatorio_Salida:     tos1LAdoI,  
// Himno
            himnot:                         htos3LAdot,
            himno:                          htos3LAdo,
        },
        Salmodias: {
// Salmodia 1
            Ant1:                           tos3LAdo1,
            SalmoUNOt:                      salmo92t,
            SalmoUNO:                       salmo92,
// Salmodia 2
            Ant2:                           tos3LAdo2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,
// Salmodia 3
            Ant3:                           tos3LAdo3,
            SalmoTRESt:                     salmo148t,
            SalmoTRES:                      salmo148,
        },
//LECTURA BREVE
        LecturaBreve: {
            LecturaCita:                    tos3LAdo_lbt,
            LecturaTexto:                   tos3LAdo_lb,
//RESPONSORIO BREVE
            responsorio1:                    tos3LAdo_rb,
            responsorio2:                    tos3LAdo_rb,
            responsorio3:                    tos3LAdo_rb1,
            responsorio4:                    tos3LAdo_rb2,
            gloria:                          gloria,
            responsorio5:                    tos3LAdo_rb,
        }
    };

// 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
    const s3TO2 = {
//CANTICO EVANGELICO
        canticoZacariast:               canticoZacariast,
        canticoZacarias:                canticoZacarias,
//PRECES
        preces1:                        tos3LAdo_preces1,
        preces2:                        tos3LAdo_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
        Padren:                         "Padre nuestro...",
        oracion:                        tos3LAdo_oracion,
        Conclusion1:                    Conclusion1,
        Conclusion2:                    Conclusion2,
    };

// 1. El denominador común de la estructura principal (Salmos, Lecturas, etc.)
// COMUN 4,8,12,16,20,24,28,32
    const s4TO1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos4LAdoI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4LAdoI,
            antifonaInvitatorio_Salida:     tos4LAdoI,
// Himno
            himnot:                         htos4LAdot,
            himno:                          htos4LAdo,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4LAdo1,
            SalmoUNOt:                      salmo117t,
            SalmoUNO:                       salmo117,
// Salmodia 2
            Ant2:                           tos4LAdo2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,
// Salmodia 3
            Ant3:                           tos4LAdo3,
            SalmoTRESt:                     salmo150t,
            SalmoTRES:                      salmo150,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAdo_lbt,
            LecturaTexto:                   tos4LAdo_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4LAdo_rb,
            responsorio2:                   tos4LAdo_rb,
            responsorio3:                   tos4LAdo_rb1,
            responsorio4:                   tos4LAdo_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4LAdo_rb,
        }};

    // 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
    const s4TO2 = {
//CANTICO EVANGELICO
        canticoZacariast: canticoZacariast,
        canticoZacarias:  canticoZacarias,
// PRECES
        preces1:          tos4LAdo_preces1,
        preces2:          tos4LAdo_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
        Padren:           "Padre nuestro...",
        oracion:          tos4LAdo_oracion,
        Conclusion1:      Conclusion1,
        Conclusion2:      Conclusion2           };

/**************************************************************************
***************** SEMANA 1 TIEMPO ORDINARIO LUNES PARTE 1 *****************
******** APLICA PARA LOS LUNES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s1TOln1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos1laluI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1laluI,
            antifonaInvitatorio_Salida:     tos1laluI,
// Himno
            himnot:                         htos1lalut,
            himno:                          htos1lalu,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1lalu1,
            SalmoUNOt:                      salmo_5_2_10_12_13t,
            SalmoUNO:                       salmo_5_2_10_12_13,
// Salmodia 2
            Ant2:                           tos1lalu2,
            SalmoDOSt:                      ICro29_10_13t,
            SalmoDOS:                       ICro29_10_13,
// Salmodia 3
            Ant3:                           tos1lalu3,
            SalmoTRESt:                     salmo28t,
            SalmoTRES:                      salmo28,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1lalu_lbt,
            LecturaTexto:                   tos1lalu_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1lalu_rb,
            responsorio2:                   tos1lalu_rb,
            responsorio3:                   tos1lalu_rb1,
            responsorio4:                   tos1lalu_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1lalu_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1lalu_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1lalu_preces1,
            preces2:                        tos1lalu_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1lalu_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};

/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO LUNES *********************
******** APLICA PARA LOS LUNES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s2TOln1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos2laluI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2laluI,
            antifonaInvitatorio_Salida:     tos2laluI,
// Himno
            himnot:                         htos2lalut,
            himno:                          htos2lalu,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2lalu1,
            SalmoUNOt:                      salmo_5_2_10_12_13t,
            SalmoUNO:                       salmo_5_2_10_12_13,
// Salmodia 2
            Ant2:                           tos2lalu2,
            SalmoDOSt:                      ICro29_10_13t,
            SalmoDOS:                       ICro29_10_13,
// Salmodia 3
            Ant3:                           tos2lalu3,
            SalmoTRESt:                     salmo28t,
            SalmoTRES:                      salmo28,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2lalu_lbt,
            LecturaTexto:                   tos2lalu_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2lalu_rb,
            responsorio2:                   tos2lalu_rb,
            responsorio3:                   tos2lalu_rb1,
            responsorio4:                   tos2lalu_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2lalu_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2lalu_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2lalu_preces1,
            preces2:                        tos2lalu_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2lalu_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO LUNES *********************
******** APLICA PARA LOS LUNES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/

/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO LUNES *********************
********* APLICA PARA LOS LUNES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/
const s3TOln1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos3laluI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3laluI,
            antifonaInvitatorio_Salida:     tos3laluI,
// Himno
            himnot:                         htos3lalut,
            himno:                          htos3lalu,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3lalu1,
            SalmoUNOt:                      salmo_5_2_10_12_13t,
            SalmoUNO:                       salmo_5_2_10_12_13,
// Salmodia 2
            Ant2:                           tos3lalu2,
            SalmoDOSt:                      ICro29_10_13t,
            SalmoDOS:                       ICro29_10_13,
// Salmodia 3
            Ant3:                           tos3lalu3,
            SalmoTRESt:                     salmo28t,
            SalmoTRES:                      salmo28,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3lalu_lbt,
            LecturaTexto:                   tos3lalu_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3lalu_rb,
            responsorio2:                   tos3lalu_rb,
            responsorio3:                   tos3lalu_rb1,
            responsorio4:                   tos3lalu_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3lalu_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3lalu_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3lalu_preces1,
            preces2:                        tos3lalu_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3lalu_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO LUNES *********************
********* APLICA PARA LOS LUNES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/

/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO LUNES *********************
********* APLICA PARA LOS LUNES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/
const s4TOln1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos4laluI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4laluI,
            antifonaInvitatorio_Salida:     tos4laluI,
// Himno
            himnot:                         htos4lalut,
            himno:                          htos4lalu,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4lalu1,
            SalmoUNOt:                      salmo_5_2_10_12_13t,
            SalmoUNO:                       salmo_5_2_10_12_13,
// Salmodia 2
            Ant2:                           tos4lalu2,
            SalmoDOSt:                      ICro29_10_13t,
            SalmoDOS:                       ICro29_10_13,
// Salmodia 3
            Ant3:                           tos4lalu3,
            SalmoTRESt:                     salmo28t,
            SalmoTRES:                      salmo28,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4lalu_lbt,
            LecturaTexto:                   tos4lalu_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4lalu_rb,
            responsorio2:                   tos4lalu_rb,
            responsorio3:                   tos4lalu_rb1,
            responsorio4:                   tos4lalu_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4lalu_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4lalu_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4lalu_preces1,
            preces2:                        tos4lalu_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4lalu_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO LUNES *********************
********* APLICA PARA LOS LUNES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/

//******************************** MARTES ********************************/

/**************************************************************************
******************** SEMANA 1 TIEMPO ORDINARIO MARTES *********************
******** APLICA PARA LOS MARTES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s1TOmt1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos1lamaI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1lamaI,
            antifonaInvitatorio_Salida:     tos1lamaI,
// Himno
            himnot:                         htos1lamat,
            himno:                          htos1lama,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1lama1,
            SalmoUNOt:                      salmo23t,
            SalmoUNO:                       salmo23,
// Salmodia 2
            Ant2:                           tos1lama2,
            SalmoDOSt:                      tb_13_1_10t,
            SalmoDOS:                       tb_13_1_10,
// Salmodia 3
            Ant3:                           tos1lama3,
            SalmoTRESt:                     salmo32t,
            SalmoTRES:                      salmo32,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1lama_lbt,
            LecturaTexto:                   tos1lama_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1lama_rb,
            responsorio2:                   tos1lama_rb,
            responsorio3:                   tos1lama_rb1,
            responsorio4:                   tos1lama_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1lama_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1lama_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1lama_preces1,
            preces2:                        tos1lama_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1lama_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};

/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO MARTES *********************
******** APLICA PARA LOS MARTES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s2TOmt1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos2lamaI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2lamaI,
            antifonaInvitatorio_Salida:     tos2lamaI,
// Himno
            himnot:                         htos2lamat,
            himno:                          htos2lama,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2lama1,
            SalmoUNOt:                      salmo42t,
            SalmoUNO:                       salmo42,
// Salmodia 2
            Ant2:                           tos2lama2,
            SalmoDOSt:                      is_38_10_14_17_20t,
            SalmoDOS:                       is_38_10_14_17_20,
// Salmodia 3
            Ant3:                           tos2lama3,
            SalmoTRESt:                     salmo64t,
            SalmoTRES:                      salmo64,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2lama_lbt,
            LecturaTexto:                   tos2lama_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2lama_rb,
            responsorio2:                   tos2lama_rb,
            responsorio3:                   tos2lama_rb1,
            responsorio4:                   tos2lama_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2lama_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2lama_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2lama_preces1,
            preces2:                        tos2lama_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2lama_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO MARTES *********************
******** APLICA PARA LOS MARTES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/

/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO MARTES *********************
********* APLICA PARA LOS MARTES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/
const s3TOmt1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos3lamaI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3lamaI,
            antifonaInvitatorio_Salida:     tos3lamaI,
// Himno
            himnot:                         htos3lamat,
            himno:                          htos3lama,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3lama1,
            SalmoUNOt:                      salmo84t,
            SalmoUNO:                       salmo84,
// Salmodia 2
            Ant2:                           tos3lama2,
            SalmoDOSt:                      is_26_1_4_7_9_12t,
            SalmoDOS:                       is_26_1_4_7_9_12,
// Salmodia 3
            Ant3:                           tos3lama3,
            SalmoTRESt:                     salmo66t,
            SalmoTRES:                      salmo66,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3lama_lbt,
            LecturaTexto:                   tos3lama_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3lama_rb,
            responsorio2:                   tos3lama_rb,
            responsorio3:                   tos3lama_rb1,
            responsorio4:                   tos3lama_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3lama_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3lama_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3lama_preces1,
            preces2:                        tos3lama_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3lama_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO MARTES *********************
********* APLICA PARA LOS MARTES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/

/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO MARTES *********************
********* APLICA PARA LOS MARTES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/
const s4TOmt1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos4lamaI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4lamaI,
            antifonaInvitatorio_Salida:     tos4lamaI,
// Himno
            himnot:                         htos4lamat,
            himno:                          htos4lama,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4lama1,
            SalmoUNOt:                      salmo100t,
            SalmoUNO:                       salmo100,
// Salmodia 2
            Ant2:                           tos4lama2,
            SalmoDOSt:                      dn_3_26_27_29_34_41t,
            SalmoDOS:                       dn_3_26_27_29_34_41,
// Salmodia 3
            Ant3:                           tos4lama3,
            SalmoTRESt:                     salmo143_1_10t,
            SalmoTRES:                      salmo143_1_10,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4lama_lbt,
            LecturaTexto:                   tos4lama_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4lama_rb,
            responsorio2:                   tos4lama_rb,
            responsorio3:                   tos4lama_rb1,
            responsorio4:                   tos4lama_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4lama_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4lama_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4lama_preces1,
            preces2:                        tos4lama_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4lama_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO MARTES *********************
********* APLICA PARA LOS MARTES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/

//╔════════════════════════════════════════════════════════╗
//║                       MIERCOLES                        ║
//╚════════════════════════════════════════════════════════╝

//******************************** MIERCOLES ********************************/

/**************************************************************************
******************** SEMANA 1 TIEMPO ORDINARIO MIERCOLES *********************
******** APLICA PARA LOS MIERCOLES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s1TOml1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos1lamiI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1lamiI,
            antifonaInvitatorio_Salida:     tos1lamiI,
// Himno
            himnot:                         htos1lamit,
            himno:                          htos1lami,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1lami1,
            SalmoUNOt:                      salmo35t,
            SalmoUNO:                       salmo35,
// Salmodia 2
            Ant2:                           tos1lami2,
            SalmoDOSt:                      Jdt_16_2_3_15_19t,
            SalmoDOS:                       Jdt_16_2_3_15_19,
// Salmodia 3
            Ant3:                           tos1lami3,
            SalmoTRESt:                     salmo46t,
            SalmoTRES:                      salmo46,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1lami_lbt,
            LecturaTexto:                   tos1lami_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1lami_rb,
            responsorio2:                   tos1lami_rb,
            responsorio3:                   tos1lami_rb1,
            responsorio4:                   tos1lami_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1lami_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1lami_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1lami_preces1,
            preces2:                        tos1lami_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1lami_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};

/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO MIERCOLES *********************
******** APLICA PARA LOS MIERCOLES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s2TOml1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos2lamiI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2lamiI,
            antifonaInvitatorio_Salida:     tos2lamiI,
// Himno
            himnot:                         htos2lamit,
            himno:                          htos2lami,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2lami1,
            SalmoUNOt:                      salmo76t,
            SalmoUNO:                       salmo76,
// Salmodia 2
            Ant2:                           tos2lami2,
            SalmoDOSt:                      ISa2_1_10t,
            SalmoDOS:                       ISa2_1_10,
// Salmodia 3
            Ant3:                           tos2lami3,
            SalmoTRESt:                     salmo96t,
            SalmoTRES:                      salmo96,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2lami_lbt,
            LecturaTexto:                   tos2lami_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2lami_rb,
            responsorio2:                   tos2lami_rb,
            responsorio3:                   tos2lami_rb1,
            responsorio4:                   tos2lami_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2lami_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2lami_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2lami_preces1,
            preces2:                        tos2lami_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2lami_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO MIERCOLES *********************
******** APLICA PARA LOS MIERCOLES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/

/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO MIERCOLES *********************
********* APLICA PARA LOS MIERCOLES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/
const s3TOml1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos3lamiI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3lamiI,
            antifonaInvitatorio_Salida:     tos3lamiI,
// Himno
            himnot:                         htos3lamit,
            himno:                          htos3lami,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3lami1,
            SalmoUNOt:                      salmo85t,
            SalmoUNO:                       salmo85,
// Salmodia 2
            Ant2:                           tos3lami2,
            SalmoDOSt:                      is_33_13_16t,
            SalmoDOS:                       is_33_13_16,
// Salmodia 3
            Ant3:                           tos3lami3,
            SalmoTRESt:                     salmo97t,
            SalmoTRES:                      salmo97,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3lami_lbt,
            LecturaTexto:                   tos3lami_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3lami_rb,
            responsorio2:                   tos3lami_rb,
            responsorio3:                   tos3lami_rb1,
            responsorio4:                   tos3lami_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3lami_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3lami_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3lami_preces1,
            preces2:                        tos3lami_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3lami_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO MIERCOLES *********************
********* APLICA PARA LOS MIERCOLES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/

/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO MIERCOLES *********************
********* APLICA PARA LOS MIERCOLES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/
const s4TOml1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos4lamiI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4lamiI,
            antifonaInvitatorio_Salida:     tos4lamiI,
// Himno
            himnot:                         htos4lamit,
            himno:                          htos4lami,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4lami1,
            SalmoUNOt:                      salmo107t,
            SalmoUNO:                       salmo107,
// Salmodia 2
            Ant2:                           tos4lami2,
            SalmoDOSt:                      is_61_10_62_5t,
            SalmoDOS:                       is_61_10_62_5,
// Salmodia 3
            Ant3:                           tos4lami3,
            SalmoTRESt:                     salmo145t,
            SalmoTRES:                      salmo145,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4lami_lbt,
            LecturaTexto:                   tos4lami_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4lami_rb,
            responsorio2:                   tos4lami_rb,
            responsorio3:                   tos4lami_rb1,
            responsorio4:                   tos4lami_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4lami_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4lami_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4lami_preces1,
            preces2:                        tos4lami_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4lami_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO MIERCOLES *********************
********* APLICA PARA LOS MIERCOLES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/
//╔════════════════════════════════════════════════════════╗
//║                         JUEVES                         ║
//╚════════════════════════════════════════════════════════╝

/**************************************************************************
******************** SEMANA 1 TIEMPO ORDINARIO JUEVES *********************
******** APLICA PARA LOS JUEVES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s1TOjs1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos1lajuI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1lajuI,
            antifonaInvitatorio_Salida:     tos1lajuI,
// Himno
            himnot:                         htos1lajut,
            himno:                          htos1laju,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1laju1,
            SalmoUNOt:                      salmo56t,
            SalmoUNO:                       salmo56,
// Salmodia 2
            Ant2:                           tos1laju2,
            SalmoDOSt:                      jr_31_10_14t,
            SalmoDOS:                       jr_31_10_14,
// Salmodia 3
            Ant3:                           tos1laju3,
            SalmoTRESt:                     salmo47t,
            SalmoTRES:                      salmo47,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1laju_lbt,
            LecturaTexto:                   tos1laju_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1laju_rb,
            responsorio2:                   tos1laju_rb,
            responsorio3:                   tos1laju_rb1,
            responsorio4:                   tos1laju_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1laju_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1laju_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1laju_preces1,
            preces2:                        tos1laju_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1laju_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};

/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO JUEVES *********************
******** APLICA PARA LOS JUEVES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s2TOjs1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos2lajuI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2lajuI,
            antifonaInvitatorio_Salida:     tos2lajuI,
// Himno
            himnot:                         htos2lajut,
            himno:                          htos2laju,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2laju1,
            SalmoUNOt:                      salmo79t,
            SalmoUNO:                       salmo79,
// Salmodia 2
            Ant2:                           tos2laju2,
            SalmoDOSt:                      is_12_1_6t,
            SalmoDOS:                       is_12_1_6,
// Salmodia 3
            Ant3:                           tos2laju3,
            SalmoTRESt:                     salmo80t,
            SalmoTRES:                      salmo80,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2laju_lbt,
            LecturaTexto:                   tos2laju_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2laju_rb,
            responsorio2:                   tos2laju_rb,
            responsorio3:                   tos2laju_rb1,
            responsorio4:                   tos2laju_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2laju_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2laju_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2laju_preces1,
            preces2:                        tos2laju_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2laju_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO JUEVES *********************
******** APLICA PARA LOS JUEVES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/

/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO JUEVES *********************
********* APLICA PARA LOS JUEVES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/
const s3TOjs1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos3lajuI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3lajuI,
            antifonaInvitatorio_Salida:     tos3lajuI,
// Himno
            himnot:                         htos3lajut,
            himno:                          htos3laju,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3laju1,
            SalmoUNOt:                      salmo86t,
            SalmoUNO:                       salmo86,
// Salmodia 2
            Ant2:                           tos3laju2,
            SalmoDOSt:                      is_40_10_17t,
            SalmoDOS:                       is_40_10_17,
// Salmodia 3
            Ant3:                           tos3laju3,
            SalmoTRESt:                     salmo98t,
            SalmoTRES:                      salmo98,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3laju_lbt,
            LecturaTexto:                   tos3laju_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3laju_rb,
            responsorio2:                   tos3laju_rb,
            responsorio3:                   tos3laju_rb1,
            responsorio4:                   tos3laju_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3laju_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3laju_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3laju_preces1,
            preces2:                        tos3laju_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3laju_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO JUEVES *********************
********* APLICA PARA LOS JUEVES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/

/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO JUEVES *********************
********* APLICA PARA LOS JUEVES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/
const s4TOjs1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos4lajuI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4lajuI,
            antifonaInvitatorio_Salida:     tos4lajuI,
// Himno
            himnot:                         htos4lajut,
            himno:                          htos4laju,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4laju1,
            SalmoUNOt:                      salmo142_1_11t,
            SalmoUNO:                       salmo142_1_11,
// Salmodia 2
            Ant2:                           tos4laju2,
            SalmoDOSt:                      is_66_10_14at,
            SalmoDOS:                       is_66_10_14a,
// Salmodia 3
            Ant3:                           tos4laju3,
            SalmoTRESt:                     salmo146t,
            SalmoTRES:                      salmo146,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4laju_lbt,
            LecturaTexto:                   tos4laju_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4laju_rb,
            responsorio2:                   tos4laju_rb,
            responsorio3:                   tos4laju_rb1,
            responsorio4:                   tos4laju_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4laju_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4laju_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4laju_preces1,
            preces2:                        tos4laju_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4laju_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO JUEVES *********************
********* APLICA PARA LOS JUEVES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/


//******************************** VIERNES ********************************/

/**************************************************************************
******************** SEMANA 1 TIEMPO ORDINARIO VIERNES *********************
******** APLICA PARA LOS VIERNES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s1TOvs1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos1laviI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1laviI,
            antifonaInvitatorio_Salida:     tos1laviI,
// Himno
            himnot:                         htos1lavit,
            himno:                          htos1lavi,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1lavi1,
            SalmoUNOt:                      salmo50t,
            SalmoUNO:                       salmo50,
// Salmodia 2
            Ant2:                           tos1lavi2,
            SalmoDOSt:                      is_45_15_25t,
            SalmoDOS:                       is_45_15_25,
// Salmodia 3
            Ant3:                           tos1lavi3,
            SalmoTRESt:                     salmo99t,
            SalmoTRES:                      salmo99,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1lavi_lbt,
            LecturaTexto:                   tos1lavi_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1lavi_rb,
            responsorio2:                   tos1lavi_rb,
            responsorio3:                   tos1lavi_rb1,
            responsorio4:                   tos1lavi_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1lavi_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1lavi_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1lavi_preces1,
            preces2:                        tos1lavi_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1lavi_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};

/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO VIERNES *********************
******** APLICA PARA LOS VIERNES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s2TOvs1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos2laviI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2laviI,
            antifonaInvitatorio_Salida:     tos2laviI,
// Himno
            himnot:                         htos2lavit,
            himno:                          htos2lavi,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2lavi1,
            SalmoUNOt:                      salmo50t,
            SalmoUNO:                       salmo50,
// Salmodia 2
            Ant2:                           tos2lavi2,
            SalmoDOSt:                      ha3_2_4_13a_15_19t,
            SalmoDOS:                       ha3_2_4_13a_15_19,
// Salmodia 3
            Ant3:                           tos2lavi3,
            SalmoTRESt:                     salmo147t,
            SalmoTRES:                      salmo147,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2lavi_lbt,
            LecturaTexto:                   tos2lavi_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2lavi_rb,
            responsorio2:                   tos2lavi_rb,
            responsorio3:                   tos2lavi_rb1,
            responsorio4:                   tos2lavi_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2lavi_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2lavi_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2lavi_preces1,
            preces2:                        tos2lavi_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2lavi_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO VIERNES *********************
******** APLICA PARA LOS VIERNES DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/

/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO VIERNES *********************
********* APLICA PARA LOS VIERNES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/
const s3TOvs1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos3laviI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3laviI,
            antifonaInvitatorio_Salida:     tos3laviI,
// Himno
            himnot:                         htos3lavit,
            himno:                          htos3lavi,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3lavi1,
            SalmoUNOt:                      salmo50t,
            SalmoUNO:                       salmo50,
// Salmodia 2
            Ant2:                           tos3lavi2,
            SalmoDOSt:                      jr_14_17_21t,
            SalmoDOS:                       jr_14_17_21,
// Salmodia 3
            Ant3:                           tos3lavi3,
            SalmoTRESt:                     salmo99t,
            SalmoTRES:                      salmo99,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3lavi_lbt,
            LecturaTexto:                   tos3lavi_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3lavi_rb,
            responsorio2:                   tos3lavi_rb,
            responsorio3:                   tos3lavi_rb1,
            responsorio4:                   tos3lavi_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3lavi_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3lavi_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3lavi_preces1,
            preces2:                        tos3lavi_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3lavi_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO VIERNES *********************
********* APLICA PARA LOS VIERNES DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/

/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO VIERNES *********************
********* APLICA PARA LOS VIERNES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/
const s4TOvs1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos4laviI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4laviI,
            antifonaInvitatorio_Salida:     tos4laviI,
// Himno
            himnot:                         htos4lavit,
            himno:                          htos4lavi,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4lavi1,
            SalmoUNOt:                      salmo50t,
            SalmoUNO:                       salmo50,
// Salmodia 2
            Ant2:                           tos4lavi2,
            SalmoDOSt:                      tb_13_10_15_17_19t,
            SalmoDOS:                       tb_13_10_15_17_19,
// Salmodia 3
            Ant3:                           tos4lavi3,
            SalmoTRESt:                     salmo147t,
            SalmoTRES:                      salmo147,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4lavi_lbt,
            LecturaTexto:                   tos4lavi_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4lavi_rb,
            responsorio2:                   tos4lavi_rb,
            responsorio3:                   tos4lavi_rb1,
            responsorio4:                   tos4lavi_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4lavi_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4lavi_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4lavi_preces1,
            preces2:                        tos4lavi_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4lavi_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO VIERNES *********************
********* APLICA PARA LOS VIERNES DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/

//******************************** SABADO ********************************/

/**************************************************************************
******************** SEMANA 1 TIEMPO ORDINARIO SABADO *********************
******** APLICA PARA LOS SABADO DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s1TOsb1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos1lasaI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1lasaI,
            antifonaInvitatorio_Salida:     tos1lasaI,
// Himno
            himnot:                         htos1lasat,
            himno:                          htos1lasa,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1lasa1,
            SalmoUNOt:                      salmo_118_145_152t,
            SalmoUNO:                       salmo_118_145_152,
// Salmodia 2
            Ant2:                           tos1lasa2,
            SalmoDOSt:                      Ex_15_1_4_8_13_17_18t,
            SalmoDOS:                       Ex_15_1_4_8_13_17_18,
// Salmodia 3
            Ant3:                           tos1lasa3,
            SalmoTRESt:                     salmo116t,
            SalmoTRES:                      salmo116,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1lasa_lbt,
            LecturaTexto:                   tos1lasa_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1lasa_rb,
            responsorio2:                   tos1lasa_rb,
            responsorio3:                   tos1lasa_rb1,
            responsorio4:                   tos1lasa_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1lasa_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1lasa_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1lasa_preces1,
            preces2:                        tos1lasa_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1lasa_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};

/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO SABADO *********************
******** APLICA PARA LOS SABADO DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/
const s2TOsb1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos2lasaI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2lasaI,
            antifonaInvitatorio_Salida:     tos2lasaI,
// Himno
            himnot:                         htos2lasat,
            himno:                          htos2lasa,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2lasa1,
            SalmoUNOt:                      salmo91t,
            SalmoUNO:                       salmo91,
// Salmodia 2
            Ant2:                           tos2lasa2,
            SalmoDOSt:                      dt_32_1_12t,
            SalmoDOS:                       dt_32_1_12,
// Salmodia 3
            Ant3:                           tos2lasa3,
            SalmoTRESt:                     salmo8t,
            SalmoTRES:                      salmo8,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2lasa_lbt,
            LecturaTexto:                   tos2lasa_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2lasa_rb,
            responsorio2:                   tos2lasa_rb,
            responsorio3:                   tos2lasa_rb1,
            responsorio4:                   tos2lasa_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2lasa_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2lasa_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2lasa_preces1,
            preces2:                        tos2lasa_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2lasa_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 2 TIEMPO ORDINARIO SABADO *********************
******** APLICA PARA LOS SABADO DE LA SEMANA 1,5,9,13,17,21,25,29,33 *******
***************************************************************************/

/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO SABADO *********************
********* APLICA PARA LOS SABADO DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/
const s3TOsb1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos3lasaI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3lasaI,
            antifonaInvitatorio_Salida:     tos3lasaI,
// Himno
            himnot:                         htos3lasat,
            himno:                          htos3lasa,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3lasa1,
            SalmoUNOt:                      salmo_118_145_152t,
            SalmoUNO:                       salmo_118_145_152,
// Salmodia 2
            Ant2:                           tos3lasa2,
            SalmoDOSt:                      sb_9_1_6_9_11t,
            SalmoDOS:                       sb_9_1_6_9_11,
// Salmodia 3
            Ant3:                           tos3lasa3,
            SalmoTRESt:                     salmo116t,
            SalmoTRES:                      salmo116,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3lasa_lbt,
            LecturaTexto:                   tos3lasa_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3lasa_rb,
            responsorio2:                   tos3lasa_rb,
            responsorio3:                   tos3lasa_rb1,
            responsorio4:                   tos3lasa_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3lasa_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3lasa_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3lasa_preces1,
            preces2:                        tos3lasa_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3lasa_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 3 TIEMPO ORDINARIO SABADO *********************
********* APLICA PARA LOS SABADO DE LA SEMANA 3,7,11,15,19,23,27,31 ********
***************************************************************************/

/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO SABADO *********************
********* APLICA PARA LOS SABADO DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/
const s4TOsb1 = {
        tt:                                 "LAUDES",
        sub:                                "(Oración de la mañana)",
        invitatorio: {
            titulo:                         "INVITATORIO",
            instruccion:                    instruccion,
            v:                              invitatorio1,
            r:                              invitatorio2,
        },

// Invitatorio
        antifonaInvitatorio:                tos4lasaI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4lasaI,
            antifonaInvitatorio_Salida:     tos4lasaI,
// Himno
            himnot:                         htos4lasat,
            himno:                          htos4lasa,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4lasa1,
            SalmoUNOt:                      salmo91t,
            SalmoUNO:                       salmo91,
// Salmodia 2
            Ant2:                           tos4lasa2,
            SalmoDOSt:                      ez_36_24_28t,
            SalmoDOS:                       ez_36_24_28,
// Salmodia 3
            Ant3:                           tos4lasa3,
            SalmoTRESt:                     salmo8t,
            SalmoTRES:                      salmo8,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4lasa_lbt,
            LecturaTexto:                   tos4lasa_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4lasa_rb,
            responsorio2:                   tos4lasa_rb,
            responsorio3:                   tos4lasa_rb1,
            responsorio4:                   tos4lasa_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4lasa_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4lasa_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4lasa_preces1,
            preces2:                        tos4lasa_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4lasa_oracion,
            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        }};
/**************************************************************************
********************* SEMANA 4 TIEMPO ORDINARIO SABADO *********************
********* APLICA PARA LOS SABADO DE LA SEMANA 4,8,12,16,20,24,28,32 ********
***************************************************************************/

export const dbLaudes = [

//datos.Variable
    
// ********* tps1js: Tiempo Pascual, Semana 1 Jueves Oficio de Lectura*********
    {        id:                            "tps1LAjs",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,
              r:                            invitatorio2,
        },
        
        antifonaInvitatorio:                inv_tiempo_pacual,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            inv_tiempo_pacual,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_tiempo_pacual,
            
            // Himno
            himnot:                         htps1jsLAt,
            himno:                          htps1jsLA,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tps1jsantLA1,
            SalmoUNOt:                      salmo62_2_9t,
            SalmoUNO:                       salmo62_2_9,

            Ant2:                           tps1jsantLA2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tps1jsantLA3,
            SalmoTRESt:                     salmo149t,
            SalmoTRES:                      salmo149,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    lb_rm8_10_11t,
            LecturaTexto:                   lb_rm8_10_11,
            responsoriobreve:               "RESPONSORIO BREVE",
            nota:                           tps1jlaudes_respt,
            responsorio:                    tps1jlaudes_resp,
        },

        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 tps1js_cEvangelico,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            cEvangelico:                    tps1js_cEvangelico,
    
            preces1:                        tps1jslaud_preces1,
            preces2:                        tps1jslaud_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tps1jsLaud_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

// ********* tps1jsLA: Tiempo Pascual, Semana 1 Jueves - Laudes *********
    {        id:                            "tps1LAjs",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,
              r:                            invitatorio2,
        },
        
        antifonaInvitatorio:                inv_tiempo_pacual,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            inv_tiempo_pacual,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_tiempo_pacual,
            
            // Himno
            himnot:                         htps1jsLAt,
            himno:                          htps1jsLA,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tps1jsantLA1,
            SalmoUNOt:                      salmo62_2_9t,
            SalmoUNO:                       salmo62_2_9,

            Ant2:                           tps1jsantLA2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tps1jsantLA3,
            SalmoTRESt:                     salmo149t,
            SalmoTRES:                      salmo149,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    lb_rm8_10_11t,
            LecturaTexto:                   lb_rm8_10_11,
            responsoriobreve:               "RESPONSORIO BREVE",
            nota:                           tps1jlaudes_respt,
            responsorio:                    tps1jlaudes_resp,
        },

        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 tps1js_cEvangelico,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            cEvangelico:                    tps1js_cEvangelico,
    
            preces1:                        tps1jslaud_preces1,
            preces2:                        tps1jslaud_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tps1jsLaud_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************
    // 

// ********* tps1LAjs: Tiempo Pascual, Semana 1 Viernes - Laudes *********
    {        id:                            "tps1LAvs",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,
              r:                            invitatorio2,
        },
        
        antifonaInvitatorio:                inv_tiempo_pacual,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            inv_tiempo_pacual,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_tiempo_pacual,
            
            // Himno
            himnot:                         htps1vsLAt,
            himno:                          htps1vsLA,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tps1jsantLA1,
            SalmoUNOt:                      salmo62_2_9t,
            SalmoUNO:                       salmo62_2_9,

            Ant2:                           tps1jsantLA2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tps1jsantLA3,
            SalmoTRESt:                     salmo149t,
            SalmoTRES:                      salmo149,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    lb_rm8_10_11t,
            LecturaTexto:                   lb_rm8_10_11,
            responsoriobreve:               "RESPONSORIO BREVE",
            nota:                           tps1jlaudes_respt,
            responsorio:                    tps1jlaudes_resp,
        },

        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 tps1js_cEvangelico,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            cEvangelico:                    tps1js_cEvangelico,
    
            preces1:                        tps1jslaud_preces1,
            preces2:                        tps1jslaud_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tps1jsLaud_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************
    // 


// Tiempo Ordinario Semana 1 DOMINGO 1 - BAUTISMO DEL SEÑOR

// ********* tps1js: Tiempo Pascual, Semana 1 Jueves Oficio de Lectura*********
    {        id:                            "bautismoLA",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
        
        antifonaInvitatorio:                inv_bautismoLA,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            inv_bautismoLA,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_bautismoLA,
            
            // Himno
            himnot:                         hbautismoLAt,
            himno:                          hbautismoLA,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           bautismoLA1,
            SalmoUNOt:                      salmo62_2_9t,
            SalmoUNO:                       salmo62_2_9,

            Ant2:                           bautismoLA2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           bautismoLA3,
            SalmoTRESt:                     salmo149t,
            SalmoTRES:                      salmo149,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    bautismoLA_lbt,
            LecturaTexto:                   bautismoLA_lb,
            
        //RESPONSORIO BREVE    
            responsorio1:                    bautismoLA_rb,
            responsorio2:                    bautismoLA_rb,
            responsorio3:                    bautismoLA_rb1,
            responsorio4:                    bautismoLA_rb2,
            gloria:                          gloria,
            responsorio5:                    bautismoLA_rb,
        },

        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos1LAdo_cE_A, tos1LAdo_cE_B, tos1LAdo_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
        //PRECES
            preces1:                        bautismoLA_preces1,
            preces2:                        bautismoLA_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        bautismoLA_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

    // ********* TOS1LAdo: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES DOMINGO *********
    /*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos1LAdo",  ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos1LAdo_cE_A,  tos1LAdo_cE_B,  tos1LAdo_cE_C),...s1TO2,}},
    {id: "tos5LAdo",  ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos5LAdo_cE_A,  tos5LAdo_cE_B,  tos5LAdo_cE_C),...s1TO2,}},
    {id: "tos9LAdo",  ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos9LAdo_cE_A,  tos9LAdo_cE_B,  tos9LAdo_cE_C),...s1TO2,}},
    {id: "tos13LAdo", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos13LAdo_cE_A, tos13LAdo_cE_B, tos13LAdo_cE_C),...s1TO2,}},
    {id: "tos17LAdo", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos17LAdo_cE_A, tos17LAdo_cE_B, tos17LAdo_cE_C),...s1TO2,}},
    {id: "tos21LAdo", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos21LAdo_cE_A, tos21LAdo_cE_B, tos21LAdo_cE_C),...s1TO2,}},
    {id: "tos25LAdo", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos25LAdo_cE_A, tos25LAdo_cE_B, tos25LAdo_cE_C),...s1TO2,}},
    {id: "tos29LAdo", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos29LAdo_cE_A, tos29LAdo_cE_B, tos29LAdo_cE_C),...s1TO2,}},
    {id: "tos33LAdo", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos33LAdo_cE_A, tos33LAdo_cE_B, tos33LAdo_cE_C),...s1TO2,}},
    // ********* tos2LAdo: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes DOMINGO *********
// ********* TOS2LAdo: Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 Laudes DOMINGO *********
/*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos2LAdo",  ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos2LAdo_cE_A,  tos2LAdo_cE_B,  tos2LAdo_cE_C),...s2TO2,}},
    {id: "tos6LAdo",  ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos6LAdo_cE_A,  tos6LAdo_cE_B,  tos6LAdo_cE_C),...s2TO2,}},
    {id: "tos10LAdo", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos10LAdo_cE_A, tos10LAdo_cE_B, tos10LAdo_cE_C),...s2TO2,}},
    {id: "tos14LAdo", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos14LAdo_cE_A, tos14LAdo_cE_B, tos14LAdo_cE_C),...s2TO2,}},
    {id: "tos18LAdo", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos18LAdo_cE_A, tos18LAdo_cE_B, tos18LAdo_cE_C),...s2TO2,}},
    {id: "tos22LAdo", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos22LAdo_cE_A, tos22LAdo_cE_B, tos22LAdo_cE_C),...s2TO2,}},
    {id: "tos26LAdo", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos26LAdo_cE_A, tos26LAdo_cE_B, tos26LAdo_cE_C),...s2TO2,}},
    {id: "tos30LAdo", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos30LAdo_cE_A, tos30LAdo_cE_B, tos30LAdo_cE_C),...s2TO2,}},
// ********* tos2LAdo: Tiempo Ordinario, Semana 2 Laudes DOMINGO *********
// ********* TOS3LAdo: Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 Laudes DOMINGO *********
/*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos3LAdo",  ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos3LAdo_cE_A,  tos3LAdo_cE_B,  tos3LAdo_cE_C),...s3TO2,}},
    {id: "tos7LAdo",  ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos7LAdo_cE_A,  tos7LAdo_cE_B,  tos7LAdo_cE_C),...s3TO2,}},
    {id: "tos11LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos11LAdo_cE_A, tos11LAdo_cE_B, tos11LAdo_cE_C),...s3TO2,}},
    {id: "tos15LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos15LAdo_cE_A, tos15LAdo_cE_B, tos15LAdo_cE_C),...s3TO2,}},
    {id: "tos19LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos19LAdo_cE_A, tos19LAdo_cE_B, tos19LAdo_cE_C),...s3TO2,}},
    {id: "tos23LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos23LAdo_cE_A, tos23LAdo_cE_B, tos23LAdo_cE_C),...s3TO2,}},
    {id: "tos27LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos27LAdo_cE_A, tos27LAdo_cE_B, tos27LAdo_cE_C),...s3TO2,}},
    {id: "tos31LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos31LAdo_cE_A, tos31LAdo_cE_B, tos31LAdo_cE_C),...s3TO2,}},
// ********* tos2LAdo: Tiempo Ordinario, Semana 2 Laudes DOMINGO *********
// ********* TOS4LAdo: Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 Laudes DOMINGO *********
/*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos4LAdo",  ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos4LAdo_cE_A,  tos3LAdo_cE_B,  tos4LAdo_cE_C),...s3TO2,}},
    {id: "tos8LAdo",  ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos8LAdo_cE_A,  tos7LAdo_cE_B,  tos8LAdo_cE_C),...s3TO2,}},
    {id: "tos12LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos12LAdo_cE_A, tos11LAdo_cE_B, tos12LAdo_cE_C),...s3TO2,}},
    {id: "tos16LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos16LAdo_cE_A, tos15LAdo_cE_B, tos16LAdo_cE_C),...s3TO2,}},
    {id: "tos20LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos20LAdo_cE_A, tos19LAdo_cE_B, tos20LAdo_cE_C),...s3TO2,}},
    {id: "tos24LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos24LAdo_cE_A, tos23LAdo_cE_B, tos24LAdo_cE_C),...s3TO2,}},
    {id: "tos28LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos28LAdo_cE_A, tos27LAdo_cE_B, tos28LAdo_cE_C),...s3TO2,}},
    {id: "tos32LAdo", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos32LAdo_cE_A, tos31LAdo_cE_B, tos32LAdo_cE_C),...s3TO2,}},
// ********* tos2LAdo: Tiempo Ordinario, Semana 2 Laudes DOMINGO *********

    /****************************************************************************************
    ******************************************** LUNES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES LUNES *********
    {id: "tos1lalu",  ...s1TOln1,},
    {id: "tos5lalu",  ...s1TOln1,},
    {id: "tos9lalu",  ...s1TOln1,},
    {id: "tos13lalu", ...s1TOln1,},
    {id: "tos17lalu", ...s1TOln1,},
    {id: "tos21lalu", ...s1TOln1,},
    {id: "tos25lalu", ...s1TOln1,},
    {id: "tos29lalu", ...s1TOln1,},
    {id: "tos33lalu", ...s1TOln1,},
    // ********* tos2LAdo: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes DOMINGO *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES LUNES *********
    {id: "tos2lalu",  ...s2TOln1,},
    {id: "tos6lalu",  ...s2TOln1,},
    {id: "tos10lalu", ...s2TOln1,},
    {id: "tos14lalu", ...s2TOln1,},
    {id: "tos18lalu", ...s2TOln1,},
    {id: "tos22lalu", ...s2TOln1,},
    {id: "tos26lalu", ...s2TOln1,},
    {id: "tos30lalu", ...s2TOln1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES LUNES *********
    {id: "tos3lalu",  ...s3TOln1,},
    {id: "tos7lalu",  ...s3TOln1,},
    {id: "tos11lalu", ...s3TOln1,},
    {id: "tos15lalu", ...s3TOln1,},
    {id: "tos19lalu", ...s3TOln1,},
    {id: "tos23lalu", ...s3TOln1,},
    {id: "tos27lalu", ...s3TOln1,},
    {id: "tos31lalu", ...s3TOln1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES LUNES *********
    {id: "tos4lalu",  ...s4TOln1,},
    {id: "tos8lalu",  ...s4TOln1,},
    {id: "tos12lalu", ...s4TOln1,},
    {id: "tos16lalu", ...s4TOln1,},
    {id: "tos20lalu", ...s4TOln1,},
    {id: "tos24lalu", ...s4TOln1,},
    {id: "tos28lalu", ...s4TOln1,},
    {id: "tos32lalu", ...s4TOln1,},
    /****************************************************************************************
    ******************************************** LUNES **************************************
    ****************************************************************************************/

    // MARTES

        /****************************************************************************************
    ******************************************** MARTES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES MARTES *********
    {id: "tos1lama",  ...s1TOmt1,},
    {id: "tos5lama",  ...s1TOmt1,},
    {id: "tos9lama",  ...s1TOmt1,},
    {id: "tos13lama", ...s1TOmt1,},
    {id: "tos17lama", ...s1TOmt1,},
    {id: "tos21lama", ...s1TOmt1,},
    {id: "tos25lama", ...s1TOmt1,},
    {id: "tos29lama", ...s1TOmt1,},
    {id: "tos33lama", ...s1TOmt1,},
    // ********* tos2LAdo: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes MARTES *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES MARTES *********
    {id: "tos2lama",  ...s2TOmt1,},
    {id: "tos6lama",  ...s2TOmt1,},
    {id: "tos10lama", ...s2TOmt1,},
    {id: "tos14lama", ...s2TOmt1,},
    {id: "tos18lama", ...s2TOmt1,},
    {id: "tos22lama", ...s2TOmt1,},
    {id: "tos26lama", ...s2TOmt1,},
    {id: "tos30lama", ...s2TOmt1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES MARTES *********
    {id: "tos3lama",  ...s3TOmt1,},
    {id: "tos7lama",  ...s3TOmt1,},
    {id: "tos11lama", ...s3TOmt1,},
    {id: "tos15lama", ...s3TOmt1,},
    {id: "tos19lama", ...s3TOmt1,},
    {id: "tos23lama", ...s3TOmt1,},
    {id: "tos27lama", ...s3TOmt1,},
    {id: "tos31lama", ...s3TOmt1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES MARTES *********
    {id: "tos4lama",  ...s4TOmt1,},
    {id: "tos8lama",  ...s4TOmt1,},
    {id: "tos12lama", ...s4TOmt1,},
    {id: "tos16lama", ...s4TOmt1,},
    {id: "tos20lama", ...s4TOmt1,},
    {id: "tos24lama", ...s4TOmt1,},
    {id: "tos28lama", ...s4TOmt1,},
    {id: "tos32lama", ...s4TOmt1,},
    /****************************************************************************************
    ******************************************** MARTES **************************************
    ****************************************************************************************/


    // MIERCOLES

    /****************************************************************************************
    ******************************************** MIERCOLES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES MIERCOLES *********
    {id: "tos1lami",  ...s1TOml1,},
    {id: "tos5lami",  ...s1TOml1,},
    {id: "tos9lami",  ...s1TOml1,},
    {id: "tos13lami", ...s1TOml1,},
    {id: "tos17lami", ...s1TOml1,},
    {id: "tos21lami", ...s1TOml1,},
    {id: "tos25lami", ...s1TOml1,},
    {id: "tos29lami", ...s1TOml1,},
    {id: "tos33lami", ...s1TOml1,},
    // ********* tos2LAdo: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes MIERCOLES *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES MIERCOLES *********
    {id: "tos2lami",  ...s2TOml1,},
    {id: "tos6lami",  ...s2TOml1,},
    {id: "tos10lami", ...s2TOml1,},
    {id: "tos14lami", ...s2TOml1,},
    {id: "tos18lami", ...s2TOml1,},
    {id: "tos22lami", ...s2TOml1,},
    {id: "tos26lami", ...s2TOml1,},
    {id: "tos30lami", ...s2TOml1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES MIERCOLES *********
    {id: "tos3lami",  ...s3TOml1,},
    {id: "tos7lami",  ...s3TOml1,},
    {id: "tos11lami", ...s3TOml1,},
    {id: "tos15lami", ...s3TOml1,},
    {id: "tos19lami", ...s3TOml1,},
    {id: "tos23lami", ...s3TOml1,},
    {id: "tos27lami", ...s3TOml1,},
    {id: "tos31lami", ...s3TOml1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES MIERCOLES *********
    {id: "tos4lami",  ...s4TOml1,},
    {id: "tos8lami",  ...s4TOml1,},
    {id: "tos12lami", ...s4TOml1,},
    {id: "tos16lami", ...s4TOml1,},
    {id: "tos20lami", ...s4TOml1,},
    {id: "tos24lami", ...s4TOml1,},
    {id: "tos28lami", ...s4TOml1,},
    {id: "tos32lami", ...s4TOml1,},
    /****************************************************************************************
    ******************************************** MIERCOLES **************************************
    ****************************************************************************************/

    // JUEVES

    /****************************************************************************************
    ******************************************** JUEVES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES JUEVES *********
    {id: "tos1laju",  ...s1TOjs1,},
    {id: "tos5laju",  ...s1TOjs1,},
    {id: "tos9laju",  ...s1TOjs1,},
    {id: "tos13laju", ...s1TOjs1,},
    {id: "tos17laju", ...s1TOjs1,},
    {id: "tos21laju", ...s1TOjs1,},
    {id: "tos25laju", ...s1TOjs1,},
    {id: "tos29laju", ...s1TOjs1,},
    {id: "tos33laju", ...s1TOjs1,},
    // ********* tos2LAdo: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes JUEVES *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES JUEVES *********
    {id: "tos2laju",  ...s2TOjs1,},
    {id: "tos6laju",  ...s2TOjs1,},
    {id: "tos10laju", ...s2TOjs1,},
    {id: "tos14laju", ...s2TOjs1,},
    {id: "tos18laju", ...s2TOjs1,},
    {id: "tos22laju", ...s2TOjs1,},
    {id: "tos26laju", ...s2TOjs1,},
    {id: "tos30laju", ...s2TOjs1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES JUEVES *********
    {id: "tos3laju",  ...s3TOjs1,},
    {id: "tos7laju",  ...s3TOjs1,},
    {id: "tos11laju", ...s3TOjs1,},
    {id: "tos15laju", ...s3TOjs1,},
    {id: "tos19laju", ...s3TOjs1,},
    {id: "tos23laju", ...s3TOjs1,},
    {id: "tos27laju", ...s3TOjs1,},
    {id: "tos31laju", ...s3TOjs1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES JUEVES *********
    {id: "tos4laju",  ...s4TOjs1,},
    {id: "tos8laju",  ...s4TOjs1,},
    {id: "tos12laju", ...s4TOjs1,},
    {id: "tos16laju", ...s4TOjs1,},
    {id: "tos20laju", ...s4TOjs1,},
    {id: "tos24laju", ...s4TOjs1,},
    {id: "tos28laju", ...s4TOjs1,},
    {id: "tos32laju", ...s4TOjs1,},
    /****************************************************************************************
    ******************************************** JUEVES **************************************
    ****************************************************************************************/

        // VIERNES

    /****************************************************************************************
    ******************************************** VIERNES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES VIERNES *********
    {id: "tos1lavi",  ...s1TOvs1,},
    {id: "tos5lavi",  ...s1TOvs1,},
    {id: "tos9lavi",  ...s1TOvs1,},
    {id: "tos13lavi", ...s1TOvs1,},
    {id: "tos17lavi", ...s1TOvs1,},
    {id: "tos21lavi", ...s1TOvs1,},
    {id: "tos25lavi", ...s1TOvs1,},
    {id: "tos29lavi", ...s1TOvs1,},
    {id: "tos33lavi", ...s1TOvs1,},
    // ********* tos2LAdo: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes VIERNES *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES VIERNES *********
    {id: "tos2lavi",  ...s2TOvs1,},
    {id: "tos6lavi",  ...s2TOvs1,},
    {id: "tos10lavi", ...s2TOvs1,},
    {id: "tos14lavi", ...s2TOvs1,},
    {id: "tos18lavi", ...s2TOvs1,},
    {id: "tos22lavi", ...s2TOvs1,},
    {id: "tos26lavi", ...s2TOvs1,},
    {id: "tos30lavi", ...s2TOvs1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES VIERNES *********
    {id: "tos3lavi",  ...s3TOvs1,},
    {id: "tos7lavi",  ...s3TOvs1,},
    {id: "tos11lavi", ...s3TOvs1,},
    {id: "tos15lavi", ...s3TOvs1,},
    {id: "tos19lavi", ...s3TOvs1,},
    {id: "tos23lavi", ...s3TOvs1,},
    {id: "tos27lavi", ...s3TOvs1,},
    {id: "tos31lavi", ...s3TOvs1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES VIERNES *********
    {id: "tos4lavi",  ...s4TOvs1,},
    {id: "tos8lavi",  ...s4TOvs1,},
    {id: "tos12lavi", ...s4TOvs1,},
    {id: "tos16lavi", ...s4TOvs1,},
    {id: "tos20lavi", ...s4TOvs1,},
    {id: "tos24lavi", ...s4TOvs1,},
    {id: "tos28lavi", ...s4TOvs1,},
    {id: "tos32lavi", ...s4TOvs1,},
    /****************************************************************************************
    ******************************************** VIERNES **************************************
    ****************************************************************************************/

    // SABADO

    /****************************************************************************************
    ******************************************** SABADO **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES SABADO *********
    {id: "tos1lasa",  ...s1TOsb1,},
    {id: "tos5lasa",  ...s1TOsb1,},
    {id: "tos9lasa",  ...s1TOsb1,},
    {id: "tos13lasa", ...s1TOsb1,},
    {id: "tos17lasa", ...s1TOsb1,},
    {id: "tos21lasa", ...s1TOsb1,},
    {id: "tos25lasa", ...s1TOsb1,},
    {id: "tos29lasa", ...s1TOsb1,},
    {id: "tos33lasa", ...s1TOsb1,},
    // ********* tos2LAdo: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes SABADO *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES SABADO *********
    {id: "tos2lasa",  ...s2TOsb1,},
    {id: "tos6lasa",  ...s2TOsb1,},
    {id: "tos10lasa", ...s2TOsb1,},
    {id: "tos14lasa", ...s2TOsb1,},
    {id: "tos18lasa", ...s2TOsb1,},
    {id: "tos22lasa", ...s2TOsb1,},
    {id: "tos26lasa", ...s2TOsb1,},
    {id: "tos30lasa", ...s2TOsb1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES SABADO *********
    {id: "tos3lasa",  ...s3TOsb1,},
    {id: "tos7lasa",  ...s3TOsb1,},
    {id: "tos11lasa", ...s3TOsb1,},
    {id: "tos15lasa", ...s3TOsb1,},
    {id: "tos19lasa", ...s3TOsb1,},
    {id: "tos23lasa", ...s3TOsb1,},
    {id: "tos27lasa", ...s3TOsb1,},
    {id: "tos31lasa", ...s3TOsb1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES SABADO *********
    {id: "tos4lasa",  ...s4TOsb1,},
    {id: "tos8lasa",  ...s4TOsb1,},
    {id: "tos12lasa", ...s4TOsb1,},
    {id: "tos16lasa", ...s4TOsb1,},
    {id: "tos20lasa", ...s4TOsb1,},
    {id: "tos24lasa", ...s4TOsb1,},
    {id: "tos28lasa", ...s4TOsb1,},
    {id: "tos32lasa", ...s4TOsb1,},
    /****************************************************************************************
    ******************************************** SABADO **************************************
    ****************************************************************************************/




/*  TIEMPO ORDINARIO
    DOMINGO DE LA SEMANA III
    De la Feria. Salterio III    */

// ********* tps1js: Tiempo Pascual, Semana 1 Jueves Oficio de Lectura*********
    {        id:                            "tos3LAdo",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
        
        antifonaInvitatorio:                tos3LAdoI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            tos3LAdoI,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     tos3LAdoI,
            
            // Himno
            himnot:                         htos3LAdot,
            himno:                          htos3LAdo,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos3LAdo1,
            SalmoUNOt:                      salmo92t,
            SalmoUNO:                       salmo92,

            Ant2:                           tos3LAdo2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos3LAdo3,
            SalmoTRESt:                     salmo148t,
            SalmoTRES:                      salmo148,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3LAdo_lbt,
            LecturaTexto:                   tos3LAdo_lb,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos3LAdo_rb,
            responsorio2:                    tos3LAdo_rb,
            responsorio3:                    tos3LAdo_rb1,
            responsorio4:                    tos3LAdo_rb2,
            gloria:                          gloria,
            responsorio5:                    tos3LAdo_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos3LAdo_cE_A, tos3LAdo_cE_B, tos3LAdo_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos3LAdo_preces1,
            preces2:                        tos3LAdo_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos3LAdo_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

/*  
TIEMPO ORDINARIO
DOMINGO DE LA SEMANA IV
De la Feria. Salterio IV
*/

// ********* tps1js: Tiempo Pascual, Semana 1 Jueves Oficio de Lectura*********
    {        id:                            "tos4LAdo",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
        
        antifonaInvitatorio:                tos4LAdoI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            tos4LAdoI,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     tos4LAdoI,
            
            // Himno
            himnot:                         htos4LAdot,
            himno:                          htos4LAdo,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos4LAdo1,
            SalmoUNOt:                      salmo92t,
            SalmoUNO:                       salmo92,

            Ant2:                           tos4LAdo2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos4LAdo3,
            SalmoTRESt:                     salmo148t,
            SalmoTRES:                      salmo148,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAdo_lbt,
            LecturaTexto:                   tos4LAdo_lb,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos4LAdo_rb,
            responsorio2:                    tos4LAdo_rb,
            responsorio3:                    tos4LAdo_rb1,
            responsorio4:                    tos4LAdo_rb2,
            gloria:                          gloria,
            responsorio5:                    tos4LAdo_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos4LAdo_cE_A, tos4LAdo_cE_B, tos4LAdo_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos4LAdo_preces1,
            preces2:                        tos4LAdo_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos4LAdo_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

/*  
TIEMPO ORDINARIO
DOMINGO DE LA SEMANA V
De la Feria. Salterio V
*/

// ********* tps1js: Tiempo Pascual, Semana 1 Jueves Oficio de Lectura*********
    {        id:                            "tos5LAdo",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
        
        antifonaInvitatorio:                tos5LAdoI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            tos5LAdoI,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     tos5LAdoI,
            
            // Himno
            himnot:                         htos5LAdot,
            himno:                          htos5LAdo,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos5LAdo1,
            SalmoUNOt:                      salmo62_2_9t,
            SalmoUNO:                       salmo62_2_9,

            Ant2:                           tos5LAdo2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos5LAdo3,
            SalmoTRESt:                     salmo149t,
            SalmoTRES:                      salmo149,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos5LAdo_lbt,
            LecturaTexto:                   tos5LAdo_lb,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos5LAdo_rb,
            responsorio2:                    tos5LAdo_rb,
            responsorio3:                    tos5LAdo_rb1,
            responsorio4:                    tos5LAdo_rb2,
            gloria:                          gloria,
            responsorio5:                    tos5LAdo_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos5LAdo_cE_A, tos5LAdo_cE_B, tos5LAdo_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos5LAdo_preces1,
            preces2:                        tos5LAdo_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos5LAdo_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

    

];