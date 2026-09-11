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
        antifonaInvitatorio:                tos1LAdmI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAdmI,
            antifonaInvitatorio_Salida:     tos1LAdmI,
// Himno
            himnot:                         htos1LAdmt,
            himno:                          htos1LAdm,          },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1LAdm1,
            SalmoUNOt:                      salmo117t,
            SalmoUNO:                       salmo117,
// Salmodia 2    
            Ant2:                           tos1LAdm2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,
// Salmodia 3
            Ant3:                           tos1LAdm3,
            SalmoTRESt:                     salmo150t,
            SalmoTRES:                      salmo150,           },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1LAdm_lbt,
            LecturaTexto:                   tos1LAdm_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1LAdm_rb,
            responsorio2:                   tos1LAdm_rb,
            responsorio3:                   tos1LAdm_rb1,
            responsorio4:                   tos1LAdm_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1LAdm_rb,        }};

    // 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
    const s1TO2 = {
//CANTICO EVANGELICO
        canticoZacariast: canticoZacariast,
        canticoZacarias:  canticoZacarias,
// PRECES
        preces1:          tos1LAdm_preces1,
        preces2:          tos1LAdm_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
        Padren:           "Padre nuestro...",
        oracion:          tos1LAdm_oracion,
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
        antifonaInvitatorio:           tos2LAdmI,
        salmoInvitatorio: {
            titulo:                    salmo94t,
            subtitulo:                 invitacion,
            contentInv:                salmo94,
// Antifona de Entrada
            antifonaInvitatorio:       tos2LAdmI,
            antifonaInvitatorio_Salida:tos2LAdmI,
// Himno
            himnot:                    htos2LAdmt,
            himno:                     htos2LAdm,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                      tos2LAdm1,
            SalmoUNOt:                 salmo117t,
            SalmoUNO:                  salmo117,
// Salmodia 2    
            Ant2:                      tos2LAdm2,
            SalmoDOSt:                 dn_3_57_88_56t,
            SalmoDOS:                  dn_3_57_88_56,
// Salmodia 3
            Ant3:                      tos2LAdm3,
            SalmoTRESt:                salmo150t,
            SalmoTRES:                 salmo150,        },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:               tos2LAdm_lbt,
            LecturaTexto:              tos2LAdm_lb,
//RESPONSORIO BREVE
            responsorio1:              tos2LAdm_rb,
            responsorio2:              tos2LAdm_rb,
            responsorio3:              tos2LAdm_rb1,
            responsorio4:              tos2LAdm_rb2,
            gloria:                    gloria,
            responsorio5:              tos2LAdm_rb,         }};

    // 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
    const s2TO2 = {
//CANTICO EVANGELICO
        canticoZacariast: canticoZacariast,
        canticoZacarias:  canticoZacarias,
// PRECES
        preces1:          tos2LAdm_preces1,
        preces2:          tos2LAdm_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
        Padren:           "Padre nuestro...",
        oracion:          tos2LAdm_oracion,
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
        antifonaInvitatorio:                tos3LAdmI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAdmI,
            antifonaInvitatorio_Salida:     tos1LAdmI,  
// Himno
            himnot:                         htos3LAdmt,
            himno:                          htos3LAdm,
        },
        Salmodias: {
// Salmodia 1
            Ant1:                           tos3LAdm1,
            SalmoUNOt:                      salmo92t,
            SalmoUNO:                       salmo92,
// Salmodia 2
            Ant2:                           tos3LAdm2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,
// Salmodia 3
            Ant3:                           tos3LAdm3,
            SalmoTRESt:                     salmo148t,
            SalmoTRES:                      salmo148,
        },
//LECTURA BREVE
        LecturaBreve: {
            LecturaCita:                    tos3LAdm_lbt,
            LecturaTexto:                   tos3LAdm_lb,
//RESPONSORIO BREVE
            responsorio1:                    tos3LAdm_rb,
            responsorio2:                    tos3LAdm_rb,
            responsorio3:                    tos3LAdm_rb1,
            responsorio4:                    tos3LAdm_rb2,
            gloria:                          gloria,
            responsorio5:                    tos3LAdm_rb,
        }
    };

// 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
    const s3TO2 = {
//CANTICO EVANGELICO
        canticoZacariast:               canticoZacariast,
        canticoZacarias:                canticoZacarias,
//PRECES
        preces1:                        tos3LAdm_preces1,
        preces2:                        tos3LAdm_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
        Padren:                         "Padre nuestro...",
        oracion:                        tos3LAdm_oracion,
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
        antifonaInvitatorio:                tos4LAdmI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4LAdmI,
            antifonaInvitatorio_Salida:     tos4LAdmI,
// Himno
            himnot:                         htos4LAdmt,
            himno:                          htos4LAdm,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4LAdm1,
            SalmoUNOt:                      salmo117t,
            SalmoUNO:                       salmo117,
// Salmodia 2
            Ant2:                           tos4LAdm2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,
// Salmodia 3
            Ant3:                           tos4LAdm3,
            SalmoTRESt:                     salmo150t,
            SalmoTRES:                      salmo150,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAdm_lbt,
            LecturaTexto:                   tos4LAdm_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4LAdm_rb,
            responsorio2:                   tos4LAdm_rb,
            responsorio3:                   tos4LAdm_rb1,
            responsorio4:                   tos4LAdm_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4LAdm_rb,
        }};

    // 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
    const s4TO2 = {
//CANTICO EVANGELICO
        canticoZacariast: canticoZacariast,
        canticoZacarias:  canticoZacarias,
// PRECES
        preces1:          tos4LAdm_preces1,
        preces2:          tos4LAdm_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
        Padren:           "Padre nuestro...",
        oracion:          tos4LAdm_oracion,
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
        antifonaInvitatorio:                tos1LAlnI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAlnI,
            antifonaInvitatorio_Salida:     tos1LAlnI,
// Himno
            himnot:                         htos1LAlnt,
            himno:                          htos1LAln,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1LAln1,
            SalmoUNOt:                      salmo_5_2_10_12_13t,
            SalmoUNO:                       salmo_5_2_10_12_13,
// Salmodia 2
            Ant2:                           tos1LAln2,
            SalmoDOSt:                      ICro29_10_13t,
            SalmoDOS:                       ICro29_10_13,
// Salmodia 3
            Ant3:                           tos1LAln3,
            SalmoTRESt:                     salmo28t,
            SalmoTRES:                      salmo28,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1LAln_lbt,
            LecturaTexto:                   tos1LAln_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1LAln_rb,
            responsorio2:                   tos1LAln_rb,
            responsorio3:                   tos1LAln_rb1,
            responsorio4:                   tos1LAln_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1LAln_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1LAln_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1LAln_preces1,
            preces2:                        tos1LAln_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1LAln_oracion,
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
        antifonaInvitatorio:                tos2LAlnI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2LAlnI,
            antifonaInvitatorio_Salida:     tos2LAlnI,
// Himno
            himnot:                         htos2LAlnt,
            himno:                          htos2LAln,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2LAln1,
            SalmoUNOt:                      salmo_5_2_10_12_13t,
            SalmoUNO:                       salmo_5_2_10_12_13,
// Salmodia 2
            Ant2:                           tos2LAln2,
            SalmoDOSt:                      ICro29_10_13t,
            SalmoDOS:                       ICro29_10_13,
// Salmodia 3
            Ant3:                           tos2LAln3,
            SalmoTRESt:                     salmo28t,
            SalmoTRES:                      salmo28,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2LAln_lbt,
            LecturaTexto:                   tos2LAln_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2LAln_rb,
            responsorio2:                   tos2LAln_rb,
            responsorio3:                   tos2LAln_rb1,
            responsorio4:                   tos2LAln_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2LAln_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2LAln_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2LAln_preces1,
            preces2:                        tos2LAln_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2LAln_oracion,
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
        antifonaInvitatorio:                tos3LAlnI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3LAlnI,
            antifonaInvitatorio_Salida:     tos3LAlnI,
// Himno
            himnot:                         htos3LAlnt,
            himno:                          htos3LAln,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3LAln1,
            SalmoUNOt:                      salmo_5_2_10_12_13t,
            SalmoUNO:                       salmo_5_2_10_12_13,
// Salmodia 2
            Ant2:                           tos3LAln2,
            SalmoDOSt:                      ICro29_10_13t,
            SalmoDOS:                       ICro29_10_13,
// Salmodia 3
            Ant3:                           tos3LAln3,
            SalmoTRESt:                     salmo28t,
            SalmoTRES:                      salmo28,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3LAln_lbt,
            LecturaTexto:                   tos3LAln_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3LAln_rb,
            responsorio2:                   tos3LAln_rb,
            responsorio3:                   tos3LAln_rb1,
            responsorio4:                   tos3LAln_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3LAln_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3LAln_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3LAln_preces1,
            preces2:                        tos3LAln_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3LAln_oracion,
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
        antifonaInvitatorio:                tos4LAlnI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4LAlnI,
            antifonaInvitatorio_Salida:     tos4LAlnI,
// Himno
            himnot:                         htos4LAlnt,
            himno:                          htos4LAln,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4LAln1,
            SalmoUNOt:                      salmo_5_2_10_12_13t,
            SalmoUNO:                       salmo_5_2_10_12_13,
// Salmodia 2
            Ant2:                           tos4LAln2,
            SalmoDOSt:                      ICro29_10_13t,
            SalmoDOS:                       ICro29_10_13,
// Salmodia 3
            Ant3:                           tos4LAln3,
            SalmoTRESt:                     salmo28t,
            SalmoTRES:                      salmo28,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAln_lbt,
            LecturaTexto:                   tos4LAln_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4LAln_rb,
            responsorio2:                   tos4LAln_rb,
            responsorio3:                   tos4LAln_rb1,
            responsorio4:                   tos4LAln_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4LAln_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4LAln_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4LAln_preces1,
            preces2:                        tos4LAln_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4LAln_oracion,
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
        antifonaInvitatorio:                tos1LAmtI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAmtI,
            antifonaInvitatorio_Salida:     tos1LAmtI,
// Himno
            himnot:                         htos1LAmtt,
            himno:                          htos1LAmt,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1LAmt1,
            SalmoUNOt:                      salmo23t,
            SalmoUNO:                       salmo23,
// Salmodia 2
            Ant2:                           tos1LAmt2,
            SalmoDOSt:                      tb_13_1_10t,
            SalmoDOS:                       tb_13_1_10,
// Salmodia 3
            Ant3:                           tos1LAmt3,
            SalmoTRESt:                     salmo32t,
            SalmoTRES:                      salmo32,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1LAmt_lbt,
            LecturaTexto:                   tos1LAmt_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1LAmt_rb,
            responsorio2:                   tos1LAmt_rb,
            responsorio3:                   tos1LAmt_rb1,
            responsorio4:                   tos1LAmt_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1LAmt_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1LAmt_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1LAmt_preces1,
            preces2:                        tos1LAmt_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1LAmt_oracion,
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
        antifonaInvitatorio:                tos2LAmtI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2LAmtI,
            antifonaInvitatorio_Salida:     tos2LAmtI,
// Himno
            himnot:                         htos2LAmtt,
            himno:                          htos2LAmt,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2LAmt1,
            SalmoUNOt:                      salmo42t,
            SalmoUNO:                       salmo42,
// Salmodia 2
            Ant2:                           tos2LAmt2,
            SalmoDOSt:                      is_38_10_14_17_20t,
            SalmoDOS:                       is_38_10_14_17_20,
// Salmodia 3
            Ant3:                           tos2LAmt3,
            SalmoTRESt:                     salmo64t,
            SalmoTRES:                      salmo64,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2LAmt_lbt,
            LecturaTexto:                   tos2LAmt_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2LAmt_rb,
            responsorio2:                   tos2LAmt_rb,
            responsorio3:                   tos2LAmt_rb1,
            responsorio4:                   tos2LAmt_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2LAmt_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2LAmt_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2LAmt_preces1,
            preces2:                        tos2LAmt_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2LAmt_oracion,
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
        antifonaInvitatorio:                tos3LAmtI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3LAmtI,
            antifonaInvitatorio_Salida:     tos3LAmtI,
// Himno
            himnot:                         htos3LAmtt,
            himno:                          htos3LAmt,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3LAmt1,
            SalmoUNOt:                      salmo84t,
            SalmoUNO:                       salmo84,
// Salmodia 2
            Ant2:                           tos3LAmt2,
            SalmoDOSt:                      is_26_1_4_7_9_12t,
            SalmoDOS:                       is_26_1_4_7_9_12,
// Salmodia 3
            Ant3:                           tos3LAmt3,
            SalmoTRESt:                     salmo66t,
            SalmoTRES:                      salmo66,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3LAmt_lbt,
            LecturaTexto:                   tos3LAmt_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3LAmt_rb,
            responsorio2:                   tos3LAmt_rb,
            responsorio3:                   tos3LAmt_rb1,
            responsorio4:                   tos3LAmt_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3LAmt_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3LAmt_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3LAmt_preces1,
            preces2:                        tos3LAmt_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3LAmt_oracion,
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
        antifonaInvitatorio:                tos4LAmtI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4LAmtI,
            antifonaInvitatorio_Salida:     tos4LAmtI,
// Himno
            himnot:                         htos4LAmtt,
            himno:                          htos4LAmt,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4LAmt1,
            SalmoUNOt:                      salmo100t,
            SalmoUNO:                       salmo100,
// Salmodia 2
            Ant2:                           tos4LAmt2,
            SalmoDOSt:                      dn_3_26_27_29_34_41t,
            SalmoDOS:                       dn_3_26_27_29_34_41,
// Salmodia 3
            Ant3:                           tos4LAmt3,
            SalmoTRESt:                     salmo143_1_10t,
            SalmoTRES:                      salmo143_1_10,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAmt_lbt,
            LecturaTexto:                   tos4LAmt_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4LAmt_rb,
            responsorio2:                   tos4LAmt_rb,
            responsorio3:                   tos4LAmt_rb1,
            responsorio4:                   tos4LAmt_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4LAmt_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4LAmt_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4LAmt_preces1,
            preces2:                        tos4LAmt_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4LAmt_oracion,
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
        antifonaInvitatorio:                tos1LAmlI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAmlI,
            antifonaInvitatorio_Salida:     tos1LAmlI,
// Himno
            himnot:                         htos1LAmlt,
            himno:                          htos1LAml,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1LAml1,
            SalmoUNOt:                      salmo35t,
            SalmoUNO:                       salmo35,
// Salmodia 2
            Ant2:                           tos1LAml2,
            SalmoDOSt:                      Jdt_16_2_3_15_19t,
            SalmoDOS:                       Jdt_16_2_3_15_19,
// Salmodia 3
            Ant3:                           tos1LAml3,
            SalmoTRESt:                     salmo46t,
            SalmoTRES:                      salmo46,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1LAml_lbt,
            LecturaTexto:                   tos1LAml_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1LAml_rb,
            responsorio2:                   tos1LAml_rb,
            responsorio3:                   tos1LAml_rb1,
            responsorio4:                   tos1LAml_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1LAml_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1LAml_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1LAml_preces1,
            preces2:                        tos1LAml_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1LAml_oracion,
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
        antifonaInvitatorio:                tos2LAmlI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2LAmlI,
            antifonaInvitatorio_Salida:     tos2LAmlI,
// Himno
            himnot:                         htos2LAmlt,
            himno:                          htos2LAml,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2LAml1,
            SalmoUNOt:                      salmo76t,
            SalmoUNO:                       salmo76,
// Salmodia 2
            Ant2:                           tos2LAml2,
            SalmoDOSt:                      ISa2_1_10t,
            SalmoDOS:                       ISa2_1_10,
// Salmodia 3
            Ant3:                           tos2LAml3,
            SalmoTRESt:                     salmo96t,
            SalmoTRES:                      salmo96,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2LAml_lbt,
            LecturaTexto:                   tos2LAml_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2LAml_rb,
            responsorio2:                   tos2LAml_rb,
            responsorio3:                   tos2LAml_rb1,
            responsorio4:                   tos2LAml_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2LAml_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2LAml_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2LAml_preces1,
            preces2:                        tos2LAml_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2LAml_oracion,
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
        antifonaInvitatorio:                tos3LAmlI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3LAmlI,
            antifonaInvitatorio_Salida:     tos3LAmlI,
// Himno
            himnot:                         htos3LAmlt,
            himno:                          htos3LAml,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3LAml1,
            SalmoUNOt:                      salmo85t,
            SalmoUNO:                       salmo85,
// Salmodia 2
            Ant2:                           tos3LAml2,
            SalmoDOSt:                      is_33_13_16t,
            SalmoDOS:                       is_33_13_16,
// Salmodia 3
            Ant3:                           tos3LAml3,
            SalmoTRESt:                     salmo97t,
            SalmoTRES:                      salmo97,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3LAml_lbt,
            LecturaTexto:                   tos3LAml_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3LAml_rb,
            responsorio2:                   tos3LAml_rb,
            responsorio3:                   tos3LAml_rb1,
            responsorio4:                   tos3LAml_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3LAml_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3LAml_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3LAml_preces1,
            preces2:                        tos3LAml_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3LAml_oracion,
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
        antifonaInvitatorio:                tos4LAmlI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4LAmlI,
            antifonaInvitatorio_Salida:     tos4LAmlI,
// Himno
            himnot:                         htos4LAmlt,
            himno:                          htos4LAml,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4LAml1,
            SalmoUNOt:                      salmo107t,
            SalmoUNO:                       salmo107,
// Salmodia 2
            Ant2:                           tos4LAml2,
            SalmoDOSt:                      is_61_10_62_5t,
            SalmoDOS:                       is_61_10_62_5,
// Salmodia 3
            Ant3:                           tos4LAml3,
            SalmoTRESt:                     salmo145t,
            SalmoTRES:                      salmo145,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAml_lbt,
            LecturaTexto:                   tos4LAml_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4LAml_rb,
            responsorio2:                   tos4LAml_rb,
            responsorio3:                   tos4LAml_rb1,
            responsorio4:                   tos4LAml_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4LAml_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4LAml_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4LAml_preces1,
            preces2:                        tos4LAml_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4LAml_oracion,
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
        antifonaInvitatorio:                tos1LAjsI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAjsI,
            antifonaInvitatorio_Salida:     tos1LAjsI,
// Himno
            himnot:                         htos1LAjst,
            himno:                          htos1LAjs,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1LAjs1,
            SalmoUNOt:                      salmo56t,
            SalmoUNO:                       salmo56,
// Salmodia 2
            Ant2:                           tos1LAjs2,
            SalmoDOSt:                      jr_31_10_14t,
            SalmoDOS:                       jr_31_10_14,
// Salmodia 3
            Ant3:                           tos1LAjs3,
            SalmoTRESt:                     salmo47t,
            SalmoTRES:                      salmo47,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1LAjs_lbt,
            LecturaTexto:                   tos1LAjs_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1LAjs_rb,
            responsorio2:                   tos1LAjs_rb,
            responsorio3:                   tos1LAjs_rb1,
            responsorio4:                   tos1LAjs_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1LAjs_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1LAjs_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1LAjs_preces1,
            preces2:                        tos1LAjs_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1LAjs_oracion,
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
        antifonaInvitatorio:                tos2LAjsI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2LAjsI,
            antifonaInvitatorio_Salida:     tos2LAjsI,
// Himno
            himnot:                         htos2LAjst,
            himno:                          htos2LAjs,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2LAjs1,
            SalmoUNOt:                      salmo79t,
            SalmoUNO:                       salmo79,
// Salmodia 2
            Ant2:                           tos2LAjs2,
            SalmoDOSt:                      is_12_1_6t,
            SalmoDOS:                       is_12_1_6,
// Salmodia 3
            Ant3:                           tos2LAjs3,
            SalmoTRESt:                     salmo80t,
            SalmoTRES:                      salmo80,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2LAjs_lbt,
            LecturaTexto:                   tos2LAjs_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2LAjs_rb,
            responsorio2:                   tos2LAjs_rb,
            responsorio3:                   tos2LAjs_rb1,
            responsorio4:                   tos2LAjs_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2LAjs_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2LAjs_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2LAjs_preces1,
            preces2:                        tos2LAjs_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2LAjs_oracion,
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
        antifonaInvitatorio:                tos3LAjsI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3LAjsI,
            antifonaInvitatorio_Salida:     tos3LAjsI,
// Himno
            himnot:                         htos3LAjst,
            himno:                          htos3LAjs,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3LAjs1,
            SalmoUNOt:                      salmo86t,
            SalmoUNO:                       salmo86,
// Salmodia 2
            Ant2:                           tos3LAjs2,
            SalmoDOSt:                      is_40_10_17t,
            SalmoDOS:                       is_40_10_17,
// Salmodia 3
            Ant3:                           tos3LAjs3,
            SalmoTRESt:                     salmo98t,
            SalmoTRES:                      salmo98,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3LAjs_lbt,
            LecturaTexto:                   tos3LAjs_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3LAjs_rb,
            responsorio2:                   tos3LAjs_rb,
            responsorio3:                   tos3LAjs_rb1,
            responsorio4:                   tos3LAjs_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3LAjs_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3LAjs_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3LAjs_preces1,
            preces2:                        tos3LAjs_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3LAjs_oracion,
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
        antifonaInvitatorio:                tos4LAjsI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4LAjsI,
            antifonaInvitatorio_Salida:     tos4LAjsI,
// Himno
            himnot:                         htos4LAjst,
            himno:                          htos4LAjs,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4LAjs1,
            SalmoUNOt:                      salmo142_1_11t,
            SalmoUNO:                       salmo142_1_11,
// Salmodia 2
            Ant2:                           tos4LAjs2,
            SalmoDOSt:                      is_66_10_14at,
            SalmoDOS:                       is_66_10_14a,
// Salmodia 3
            Ant3:                           tos4LAjs3,
            SalmoTRESt:                     salmo146t,
            SalmoTRES:                      salmo146,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAjs_lbt,
            LecturaTexto:                   tos4LAjs_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4LAjs_rb,
            responsorio2:                   tos4LAjs_rb,
            responsorio3:                   tos4LAjs_rb1,
            responsorio4:                   tos4LAjs_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4LAjs_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4LAjs_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4LAjs_preces1,
            preces2:                        tos4LAjs_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4LAjs_oracion,
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
        antifonaInvitatorio:                tos1LAvsI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAvsI,
            antifonaInvitatorio_Salida:     tos1LAvsI,
// Himno
            himnot:                         htos1LAvst,
            himno:                          htos1LAvs,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1LAvs1,
            SalmoUNOt:                      salmo50t,
            SalmoUNO:                       salmo50,
// Salmodia 2
            Ant2:                           tos1LAvs2,
            SalmoDOSt:                      is_45_15_25t,
            SalmoDOS:                       is_45_15_25,
// Salmodia 3
            Ant3:                           tos1LAvs3,
            SalmoTRESt:                     salmo99t,
            SalmoTRES:                      salmo99,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1LAvs_lbt,
            LecturaTexto:                   tos1LAvs_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1LAvs_rb,
            responsorio2:                   tos1LAvs_rb,
            responsorio3:                   tos1LAvs_rb1,
            responsorio4:                   tos1LAvs_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1LAvs_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1LAvs_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1LAvs_preces1,
            preces2:                        tos1LAvs_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1LAvs_oracion,
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
        antifonaInvitatorio:                tos2LAvsI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2LAvsI,
            antifonaInvitatorio_Salida:     tos2LAvsI,
// Himno
            himnot:                         htos2LAvst,
            himno:                          htos2LAvs,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2LAvs1,
            SalmoUNOt:                      salmo50t,
            SalmoUNO:                       salmo50,
// Salmodia 2
            Ant2:                           tos2LAvs2,
            SalmoDOSt:                      ha3_2_4_13a_15_19t,
            SalmoDOS:                       ha3_2_4_13a_15_19,
// Salmodia 3
            Ant3:                           tos2LAvs3,
            SalmoTRESt:                     salmo147t,
            SalmoTRES:                      salmo147,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2LAvs_lbt,
            LecturaTexto:                   tos2LAvs_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2LAvs_rb,
            responsorio2:                   tos2LAvs_rb,
            responsorio3:                   tos2LAvs_rb1,
            responsorio4:                   tos2LAvs_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2LAvs_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2LAvs_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2LAvs_preces1,
            preces2:                        tos2LAvs_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2LAvs_oracion,
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
        antifonaInvitatorio:                tos3LAvsI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3LAvsI,
            antifonaInvitatorio_Salida:     tos3LAvsI,
// Himno
            himnot:                         htos3LAvst,
            himno:                          htos3LAvs,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3LAvs1,
            SalmoUNOt:                      salmo50t,
            SalmoUNO:                       salmo50,
// Salmodia 2
            Ant2:                           tos3LAvs2,
            SalmoDOSt:                      jr_14_17_21t,
            SalmoDOS:                       jr_14_17_21,
// Salmodia 3
            Ant3:                           tos3LAvs3,
            SalmoTRESt:                     salmo99t,
            SalmoTRES:                      salmo99,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3LAvs_lbt,
            LecturaTexto:                   tos3LAvs_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3LAvs_rb,
            responsorio2:                   tos3LAvs_rb,
            responsorio3:                   tos3LAvs_rb1,
            responsorio4:                   tos3LAvs_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3LAvs_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3LAvs_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3LAvs_preces1,
            preces2:                        tos3LAvs_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3LAvs_oracion,
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
        antifonaInvitatorio:                tos4LAvsI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4LAvsI,
            antifonaInvitatorio_Salida:     tos4LAvsI,
// Himno
            himnot:                         htos4LAvst,
            himno:                          htos4LAvs,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4LAvs1,
            SalmoUNOt:                      salmo50t,
            SalmoUNO:                       salmo50,
// Salmodia 2
            Ant2:                           tos4LAvs2,
            SalmoDOSt:                      tb_13_10_15_17_19t,
            SalmoDOS:                       tb_13_10_15_17_19,
// Salmodia 3
            Ant3:                           tos4LAvs3,
            SalmoTRESt:                     salmo147t,
            SalmoTRES:                      salmo147,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAvs_lbt,
            LecturaTexto:                   tos4LAvs_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4LAvs_rb,
            responsorio2:                   tos4LAvs_rb,
            responsorio3:                   tos4LAvs_rb1,
            responsorio4:                   tos4LAvs_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4LAvs_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4LAvs_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4LAvs_preces1,
            preces2:                        tos4LAvs_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4LAvs_oracion,
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
        antifonaInvitatorio:                tos1LAsbI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos1LAsbI,
            antifonaInvitatorio_Salida:     tos1LAsbI,
// Himno
            himnot:                         htos1LAsbt,
            himno:                          htos1LAsb,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos1LAsb1,
            SalmoUNOt:                      salmo_118_145_152t,
            SalmoUNO:                       salmo_118_145_152,
// Salmodia 2
            Ant2:                           tos1LAsb2,
            SalmoDOSt:                      Ex_15_1_4_8_13_17_18t,
            SalmoDOS:                       Ex_15_1_4_8_13_17_18,
// Salmodia 3
            Ant3:                           tos1LAsb3,
            SalmoTRESt:                     salmo116t,
            SalmoTRES:                      salmo116,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1LAsb_lbt,
            LecturaTexto:                   tos1LAsb_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos1LAsb_rb,
            responsorio2:                   tos1LAsb_rb,
            responsorio3:                   tos1LAsb_rb1,
            responsorio4:                   tos1LAsb_rb2,
            gloria:                         gloria,
            responsorio5:                   tos1LAsb_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos1LAsb_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos1LAsb_preces1,
            preces2:                        tos1LAsb_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos1LAsb_oracion,
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
        antifonaInvitatorio:                tos2LAsbI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos2LAsbI,
            antifonaInvitatorio_Salida:     tos2LAsbI,
// Himno
            himnot:                         htos2LAsbt,
            himno:                          htos2LAsb,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos2LAsb1,
            SalmoUNOt:                      salmo91t,
            SalmoUNO:                       salmo91,
// Salmodia 2
            Ant2:                           tos2LAsb2,
            SalmoDOSt:                      dt_32_1_12t,
            SalmoDOS:                       dt_32_1_12,
// Salmodia 3
            Ant3:                           tos2LAsb3,
            SalmoTRESt:                     salmo8t,
            SalmoTRES:                      salmo8,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2LAsb_lbt,
            LecturaTexto:                   tos2LAsb_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos2LAsb_rb,
            responsorio2:                   tos2LAsb_rb,
            responsorio3:                   tos2LAsb_rb1,
            responsorio4:                   tos2LAsb_rb2,
            gloria:                         gloria,
            responsorio5:                   tos2LAsb_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos2LAsb_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos2LAsb_preces1,
            preces2:                        tos2LAsb_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos2LAsb_oracion,
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
        antifonaInvitatorio:                tos3LAsbI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos3LAsbI,
            antifonaInvitatorio_Salida:     tos3LAsbI,
// Himno
            himnot:                         htos3LAsbt,
            himno:                          htos3LAsb,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos3LAsb1,
            SalmoUNOt:                      salmo_118_145_152t,
            SalmoUNO:                       salmo_118_145_152,
// Salmodia 2
            Ant2:                           tos3LAsb2,
            SalmoDOSt:                      sb_9_1_6_9_11t,
            SalmoDOS:                       sb_9_1_6_9_11,
// Salmodia 3
            Ant3:                           tos3LAsb3,
            SalmoTRESt:                     salmo116t,
            SalmoTRES:                      salmo116,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3LAsb_lbt,
            LecturaTexto:                   tos3LAsb_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos3LAsb_rb,
            responsorio2:                   tos3LAsb_rb,
            responsorio3:                   tos3LAsb_rb1,
            responsorio4:                   tos3LAsb_rb2,
            gloria:                         gloria,
            responsorio5:                   tos3LAsb_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos3LAsb_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos3LAsb_preces1,
            preces2:                        tos3LAsb_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos3LAsb_oracion,
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
        antifonaInvitatorio:                tos4LAsbI,
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
// Antifona de Entrada
            antifonaInvitatorio:            tos4LAsbI,
            antifonaInvitatorio_Salida:     tos4LAsbI,
// Himno
            himnot:                         htos4LAsbt,
            himno:                          htos4LAsb,
        },

        Salmodias: {
// Salmodia 1    
            Ant1:                           tos4LAsb1,
            SalmoUNOt:                      salmo91t,
            SalmoUNO:                       salmo91,
// Salmodia 2
            Ant2:                           tos4LAsb2,
            SalmoDOSt:                      ez_36_24_28t,
            SalmoDOS:                       ez_36_24_28,
// Salmodia 3
            Ant3:                           tos4LAsb3,
            SalmoTRESt:                     salmo8t,
            SalmoTRES:                      salmo8,       },
// Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAsb_lbt,
            LecturaTexto:                   tos4LAsb_lb,
//RESPONSORIO BREVE
            responsorio1:                   tos4LAsb_rb,
            responsorio2:                   tos4LAsb_rb,
            responsorio3:                   tos4LAsb_rb1,
            responsorio4:                   tos4LAsb_rb2,
            gloria:                         gloria,
            responsorio5:                   tos4LAsb_rb,    },

//CANTICO EVANGELICO

        cEvan_Conclusion: {
            cEvangelicoAnt:                 tos4LAsb_cE,
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,

// PRECES
            preces1:                        tos4LAsb_preces1,
            preces2:                        tos4LAsb_preces2,
// PADRE NUESTRO Y ORACIONES CONCUSIVAS
            Padren:                         "Padre nuestro...",
            oracion:                        tos4LAsb_oracion,
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
            cEvangelicoAnt:                 window.antifonaDomingo(tos1LAdm_cE_A, tos1LAdm_cE_B, tos1LAdm_cE_C),
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

    // ********* TOS1LADM: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES DOMINGO *********
    /*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos1LAdm",  ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos1LAdm_cE_A,  tos1LAdm_cE_B,  tos1LAdm_cE_C),...s1TO2,}},
    {id: "tos5LAdm",  ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos5LAdm_cE_A,  tos5LAdm_cE_B,  tos5LAdm_cE_C),...s1TO2,}},
    {id: "tos9LAdm",  ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos9LAdm_cE_A,  tos9LAdm_cE_B,  tos9LAdm_cE_C),...s1TO2,}},
    {id: "tos13LAdm", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos13LAdm_cE_A, tos13LAdm_cE_B, tos13LAdm_cE_C),...s1TO2,}},
    {id: "tos17LAdm", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos17LAdm_cE_A, tos17LAdm_cE_B, tos17LAdm_cE_C),...s1TO2,}},
    {id: "tos21LAdm", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos21LAdm_cE_A, tos21LAdm_cE_B, tos21LAdm_cE_C),...s1TO2,}},
    {id: "tos25LAdm", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos25LAdm_cE_A, tos25LAdm_cE_B, tos25LAdm_cE_C),...s1TO2,}},
    {id: "tos29LAdm", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos29LAdm_cE_A, tos29LAdm_cE_B, tos29LAdm_cE_C),...s1TO2,}},
    {id: "tos33LAdm", ...s1TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos33LAdm_cE_A, tos33LAdm_cE_B, tos33LAdm_cE_C),...s1TO2,}},
    // ********* tos2LAdm: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes DOMINGO *********
// ********* TOS2LADM: Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 Laudes DOMINGO *********
/*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos2LAdm",  ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos2LAdm_cE_A,  tos2LAdm_cE_B,  tos2LAdm_cE_C),...s2TO2,}},
    {id: "tos6LAdm",  ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos6LAdm_cE_A,  tos6LAdm_cE_B,  tos6LAdm_cE_C),...s2TO2,}},
    {id: "tos10LAdm", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos10LAdm_cE_A, tos10LAdm_cE_B, tos10LAdm_cE_C),...s2TO2,}},
    {id: "tos14LAdm", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos14LAdm_cE_A, tos14LAdm_cE_B, tos14LAdm_cE_C),...s2TO2,}},
    {id: "tos18LAdm", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos18LAdm_cE_A, tos18LAdm_cE_B, tos18LAdm_cE_C),...s2TO2,}},
    {id: "tos22LAdm", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos22LAdm_cE_A, tos22LAdm_cE_B, tos22LAdm_cE_C),...s2TO2,}},
    {id: "tos26LAdm", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos26LAdm_cE_A, tos26LAdm_cE_B, tos26LAdm_cE_C),...s2TO2,}},
    {id: "tos30LAdm", ...s2TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos30LAdm_cE_A, tos30LAdm_cE_B, tos30LAdm_cE_C),...s2TO2,}},
// ********* tos2LAdm: Tiempo Ordinario, Semana 2 Laudes DOMINGO *********
// ********* TOS3LADM: Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 Laudes DOMINGO *********
/*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos3LAdm",  ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos3LAdm_cE_A,  tos3LAdm_cE_B,  tos3LAdm_cE_C),...s3TO2,}},
    {id: "tos7LAdm",  ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos7LAdm_cE_A,  tos7LAdm_cE_B,  tos7LAdm_cE_C),...s3TO2,}},
    {id: "tos11LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos11LAdm_cE_A, tos11LAdm_cE_B, tos11LAdm_cE_C),...s3TO2,}},
    {id: "tos15LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos15LAdm_cE_A, tos15LAdm_cE_B, tos15LAdm_cE_C),...s3TO2,}},
    {id: "tos19LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos19LAdm_cE_A, tos19LAdm_cE_B, tos19LAdm_cE_C),...s3TO2,}},
    {id: "tos23LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos23LAdm_cE_A, tos23LAdm_cE_B, tos23LAdm_cE_C),...s3TO2,}},
    {id: "tos27LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos27LAdm_cE_A, tos27LAdm_cE_B, tos27LAdm_cE_C),...s3TO2,}},
    {id: "tos31LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos31LAdm_cE_A, tos31LAdm_cE_B, tos31LAdm_cE_C),...s3TO2,}},
// ********* tos2LAdm: Tiempo Ordinario, Semana 2 Laudes DOMINGO *********
// ********* TOS4LADM: Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 Laudes DOMINGO *********
/*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos4LAdm",  ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos4LAdm_cE_A,  tos3LAdm_cE_B,  tos4LAdm_cE_C),...s3TO2,}},
    {id: "tos8LAdm",  ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos8LAdm_cE_A,  tos7LAdm_cE_B,  tos8LAdm_cE_C),...s3TO2,}},
    {id: "tos12LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos12LAdm_cE_A, tos11LAdm_cE_B, tos12LAdm_cE_C),...s3TO2,}},
    {id: "tos16LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos16LAdm_cE_A, tos15LAdm_cE_B, tos16LAdm_cE_C),...s3TO2,}},
    {id: "tos20LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos20LAdm_cE_A, tos19LAdm_cE_B, tos20LAdm_cE_C),...s3TO2,}},
    {id: "tos24LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos24LAdm_cE_A, tos23LAdm_cE_B, tos24LAdm_cE_C),...s3TO2,}},
    {id: "tos28LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos28LAdm_cE_A, tos27LAdm_cE_B, tos28LAdm_cE_C),...s3TO2,}},
    {id: "tos32LAdm", ...s3TO1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos32LAdm_cE_A, tos31LAdm_cE_B, tos32LAdm_cE_C),...s3TO2,}},
// ********* tos2LAdm: Tiempo Ordinario, Semana 2 Laudes DOMINGO *********

    /****************************************************************************************
    ******************************************** LUNES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES LUNES *********
    {id: "tos1LAln",  ...s1TOln1,},
    {id: "tos5LAln",  ...s1TOln1,},
    {id: "tos9LAln",  ...s1TOln1,},
    {id: "tos13LAln", ...s1TOln1,},
    {id: "tos17LAln", ...s1TOln1,},
    {id: "tos21LAln", ...s1TOln1,},
    {id: "tos25LAln", ...s1TOln1,},
    {id: "tos29LAln", ...s1TOln1,},
    {id: "tos33LAln", ...s1TOln1,},
    // ********* tos2LAdm: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes DOMINGO *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES LUNES *********
    {id: "tos2LAln",  ...s2TOln1,},
    {id: "tos6LAln",  ...s2TOln1,},
    {id: "tos10LAln", ...s2TOln1,},
    {id: "tos14LAln", ...s2TOln1,},
    {id: "tos18LAln", ...s2TOln1,},
    {id: "tos22LAln", ...s2TOln1,},
    {id: "tos26LAln", ...s2TOln1,},
    {id: "tos30LAln", ...s2TOln1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES LUNES *********
    {id: "tos3LAln",  ...s3TOln1,},
    {id: "tos7LAln",  ...s3TOln1,},
    {id: "tos11LAln", ...s3TOln1,},
    {id: "tos15LAln", ...s3TOln1,},
    {id: "tos19LAln", ...s3TOln1,},
    {id: "tos23LAln", ...s3TOln1,},
    {id: "tos27LAln", ...s3TOln1,},
    {id: "tos31LAln", ...s3TOln1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES LUNES *********
    {id: "tos4LAln",  ...s4TOln1,},
    {id: "tos8LAln",  ...s4TOln1,},
    {id: "tos12LAln", ...s4TOln1,},
    {id: "tos16LAln", ...s4TOln1,},
    {id: "tos20LAln", ...s4TOln1,},
    {id: "tos24LAln", ...s4TOln1,},
    {id: "tos28LAln", ...s4TOln1,},
    {id: "tos32LAln", ...s4TOln1,},
    /****************************************************************************************
    ******************************************** LUNES **************************************
    ****************************************************************************************/

    // MARTES

        /****************************************************************************************
    ******************************************** MARTES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES MARTES *********
    {id: "tos1LAmt",  ...s1TOmt1,},
    {id: "tos5LAmt",  ...s1TOmt1,},
    {id: "tos9LAmt",  ...s1TOmt1,},
    {id: "tos13LAmt", ...s1TOmt1,},
    {id: "tos17LAmt", ...s1TOmt1,},
    {id: "tos21LAmt", ...s1TOmt1,},
    {id: "tos25LAmt", ...s1TOmt1,},
    {id: "tos29LAmt", ...s1TOmt1,},
    {id: "tos33LAmt", ...s1TOmt1,},
    // ********* tos2LAdm: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes MARTES *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES MARTES *********
    {id: "tos2LAmt",  ...s2TOmt1,},
    {id: "tos6LAmt",  ...s2TOmt1,},
    {id: "tos10LAmt", ...s2TOmt1,},
    {id: "tos14LAmt", ...s2TOmt1,},
    {id: "tos18LAmt", ...s2TOmt1,},
    {id: "tos22LAmt", ...s2TOmt1,},
    {id: "tos26LAmt", ...s2TOmt1,},
    {id: "tos30LAmt", ...s2TOmt1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES MARTES *********
    {id: "tos3LAmt",  ...s3TOmt1,},
    {id: "tos7LAmt",  ...s3TOmt1,},
    {id: "tos11LAmt", ...s3TOmt1,},
    {id: "tos15LAmt", ...s3TOmt1,},
    {id: "tos19LAmt", ...s3TOmt1,},
    {id: "tos23LAmt", ...s3TOmt1,},
    {id: "tos27LAmt", ...s3TOmt1,},
    {id: "tos31LAmt", ...s3TOmt1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES MARTES *********
    {id: "tos4LAmt",  ...s4TOmt1,},
    {id: "tos8LAmt",  ...s4TOmt1,},
    {id: "tos12LAmt", ...s4TOmt1,},
    {id: "tos16LAmt", ...s4TOmt1,},
    {id: "tos20LAmt", ...s4TOmt1,},
    {id: "tos24LAmt", ...s4TOmt1,},
    {id: "tos28LAmt", ...s4TOmt1,},
    {id: "tos32LAmt", ...s4TOmt1,},
    /****************************************************************************************
    ******************************************** MARTES **************************************
    ****************************************************************************************/


    // MIERCOLES

    /****************************************************************************************
    ******************************************** MIERCOLES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES MIERCOLES *********
    {id: "tos1LAml",  ...s1TOml1,},
    {id: "tos5LAml",  ...s1TOml1,},
    {id: "tos9LAml",  ...s1TOml1,},
    {id: "tos13LAml", ...s1TOml1,},
    {id: "tos17LAml", ...s1TOml1,},
    {id: "tos21LAml", ...s1TOml1,},
    {id: "tos25LAml", ...s1TOml1,},
    {id: "tos29LAml", ...s1TOml1,},
    {id: "tos33LAml", ...s1TOml1,},
    // ********* tos2LAdm: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes MIERCOLES *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES MIERCOLES *********
    {id: "tos2LAml",  ...s2TOml1,},
    {id: "tos6LAml",  ...s2TOml1,},
    {id: "tos10LAml", ...s2TOml1,},
    {id: "tos14LAml", ...s2TOml1,},
    {id: "tos18LAml", ...s2TOml1,},
    {id: "tos22LAml", ...s2TOml1,},
    {id: "tos26LAml", ...s2TOml1,},
    {id: "tos30LAml", ...s2TOml1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES MIERCOLES *********
    {id: "tos3LAml",  ...s3TOml1,},
    {id: "tos7LAml",  ...s3TOml1,},
    {id: "tos11LAml", ...s3TOml1,},
    {id: "tos15LAml", ...s3TOml1,},
    {id: "tos19LAml", ...s3TOml1,},
    {id: "tos23LAml", ...s3TOml1,},
    {id: "tos27LAml", ...s3TOml1,},
    {id: "tos31LAml", ...s3TOml1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES MIERCOLES *********
    {id: "tos4LAml",  ...s4TOml1,},
    {id: "tos8LAml",  ...s4TOml1,},
    {id: "tos12LAml", ...s4TOml1,},
    {id: "tos16LAml", ...s4TOml1,},
    {id: "tos20LAml", ...s4TOml1,},
    {id: "tos24LAml", ...s4TOml1,},
    {id: "tos28LAml", ...s4TOml1,},
    {id: "tos32LAml", ...s4TOml1,},
    /****************************************************************************************
    ******************************************** MIERCOLES **************************************
    ****************************************************************************************/

    // JUEVES

    /****************************************************************************************
    ******************************************** JUEVES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES JUEVES *********
    {id: "tos1LAjs",  ...s1TOjs1,},
    {id: "tos5LAjs",  ...s1TOjs1,},
    {id: "tos9LAjs",  ...s1TOjs1,},
    {id: "tos13LAjs", ...s1TOjs1,},
    {id: "tos17LAjs", ...s1TOjs1,},
    {id: "tos21LAjs", ...s1TOjs1,},
    {id: "tos25LAjs", ...s1TOjs1,},
    {id: "tos29LAjs", ...s1TOjs1,},
    {id: "tos33LAjs", ...s1TOjs1,},
    // ********* tos2LAdm: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes JUEVES *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES JUEVES *********
    {id: "tos2LAjs",  ...s2TOjs1,},
    {id: "tos6LAjs",  ...s2TOjs1,},
    {id: "tos10LAjs", ...s2TOjs1,},
    {id: "tos14LAjs", ...s2TOjs1,},
    {id: "tos18LAjs", ...s2TOjs1,},
    {id: "tos22LAjs", ...s2TOjs1,},
    {id: "tos26LAjs", ...s2TOjs1,},
    {id: "tos30LAjs", ...s2TOjs1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES JUEVES *********
    {id: "tos3LAjs",  ...s3TOjs1,},
    {id: "tos7LAjs",  ...s3TOjs1,},
    {id: "tos11LAjs", ...s3TOjs1,},
    {id: "tos15LAjs", ...s3TOjs1,},
    {id: "tos19LAjs", ...s3TOjs1,},
    {id: "tos23LAjs", ...s3TOjs1,},
    {id: "tos27LAjs", ...s3TOjs1,},
    {id: "tos31LAjs", ...s3TOjs1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES JUEVES *********
    {id: "tos4LAjs",  ...s4TOjs1,},
    {id: "tos8LAjs",  ...s4TOjs1,},
    {id: "tos12LAjs", ...s4TOjs1,},
    {id: "tos16LAjs", ...s4TOjs1,},
    {id: "tos20LAjs", ...s4TOjs1,},
    {id: "tos24LAjs", ...s4TOjs1,},
    {id: "tos28LAjs", ...s4TOjs1,},
    {id: "tos32LAjs", ...s4TOjs1,},
    /****************************************************************************************
    ******************************************** JUEVES **************************************
    ****************************************************************************************/

        // VIERNES

    /****************************************************************************************
    ******************************************** VIERNES **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES VIERNES *********
    {id: "tos1LAvs",  ...s1TOvs1,},
    {id: "tos5LAvs",  ...s1TOvs1,},
    {id: "tos9LAvs",  ...s1TOvs1,},
    {id: "tos13LAvs", ...s1TOvs1,},
    {id: "tos17LAvs", ...s1TOvs1,},
    {id: "tos21LAvs", ...s1TOvs1,},
    {id: "tos25LAvs", ...s1TOvs1,},
    {id: "tos29LAvs", ...s1TOvs1,},
    {id: "tos33LAvs", ...s1TOvs1,},
    // ********* tos2LAdm: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes VIERNES *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES VIERNES *********
    {id: "tos2LAvs",  ...s2TOvs1,},
    {id: "tos6LAvs",  ...s2TOvs1,},
    {id: "tos10LAvs", ...s2TOvs1,},
    {id: "tos14LAvs", ...s2TOvs1,},
    {id: "tos18LAvs", ...s2TOvs1,},
    {id: "tos22LAvs", ...s2TOvs1,},
    {id: "tos26LAvs", ...s2TOvs1,},
    {id: "tos30LAvs", ...s2TOvs1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES VIERNES *********
    {id: "tos3LAvs",  ...s3TOvs1,},
    {id: "tos7LAvs",  ...s3TOvs1,},
    {id: "tos11LAvs", ...s3TOvs1,},
    {id: "tos15LAvs", ...s3TOvs1,},
    {id: "tos19LAvs", ...s3TOvs1,},
    {id: "tos23LAvs", ...s3TOvs1,},
    {id: "tos27LAvs", ...s3TOvs1,},
    {id: "tos31LAvs", ...s3TOvs1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES VIERNES *********
    {id: "tos4LAvs",  ...s4TOvs1,},
    {id: "tos8LAvs",  ...s4TOvs1,},
    {id: "tos12LAvs", ...s4TOvs1,},
    {id: "tos16LAvs", ...s4TOvs1,},
    {id: "tos20LAvs", ...s4TOvs1,},
    {id: "tos24LAvs", ...s4TOvs1,},
    {id: "tos28LAvs", ...s4TOvs1,},
    {id: "tos32LAvs", ...s4TOvs1,},
    /****************************************************************************************
    ******************************************** VIERNES **************************************
    ****************************************************************************************/

    // SABADO

    /****************************************************************************************
    ******************************************** SABADO **************************************
    ****************************************************************************************/
   // Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 LAUDES SABADO *********
    {id: "tos1LAsb",  ...s1TOsb1,},
    {id: "tos5LAsb",  ...s1TOsb1,},
    {id: "tos9LAsb",  ...s1TOsb1,},
    {id: "tos13LAsb", ...s1TOsb1,},
    {id: "tos17LAsb", ...s1TOsb1,},
    {id: "tos21LAsb", ...s1TOsb1,},
    {id: "tos25LAsb", ...s1TOsb1,},
    {id: "tos29LAsb", ...s1TOsb1,},
    {id: "tos33LAsb", ...s1TOsb1,},
    // ********* tos2LAdm: Tiempo Ordinario, Semana 1,5,9,13,21,25,29,33 Laudes SABADO *********
    
    // Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 LAUDES SABADO *********
    {id: "tos2LAsb",  ...s2TOsb1,},
    {id: "tos6LAsb",  ...s2TOsb1,},
    {id: "tos10LAsb", ...s2TOsb1,},
    {id: "tos14LAsb", ...s2TOsb1,},
    {id: "tos18LAsb", ...s2TOsb1,},
    {id: "tos22LAsb", ...s2TOsb1,},
    {id: "tos26LAsb", ...s2TOsb1,},
    {id: "tos30LAsb", ...s2TOsb1,},

    // Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 LAUDES SABADO *********
    {id: "tos3LAsb",  ...s3TOsb1,},
    {id: "tos7LAsb",  ...s3TOsb1,},
    {id: "tos11LAsb", ...s3TOsb1,},
    {id: "tos15LAsb", ...s3TOsb1,},
    {id: "tos19LAsb", ...s3TOsb1,},
    {id: "tos23LAsb", ...s3TOsb1,},
    {id: "tos27LAsb", ...s3TOsb1,},
    {id: "tos31LAsb", ...s3TOsb1,},

        // Tiempo Ordinario, Semana 4,8,12,16,20,24,28,32 LAUDES SABADO *********
    {id: "tos4LAsb",  ...s4TOsb1,},
    {id: "tos8LAsb",  ...s4TOsb1,},
    {id: "tos12LAsb", ...s4TOsb1,},
    {id: "tos16LAsb", ...s4TOsb1,},
    {id: "tos20LAsb", ...s4TOsb1,},
    {id: "tos24LAsb", ...s4TOsb1,},
    {id: "tos28LAsb", ...s4TOsb1,},
    {id: "tos32LAsb", ...s4TOsb1,},
    /****************************************************************************************
    ******************************************** SABADO **************************************
    ****************************************************************************************/




/*  TIEMPO ORDINARIO
    DOMINGO DE LA SEMANA III
    De la Feria. Salterio III    */

// ********* tps1js: Tiempo Pascual, Semana 1 Jueves Oficio de Lectura*********
    {        id:                            "tos3LAdm",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
        
        antifonaInvitatorio:                tos3LAdmI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            tos3LAdmI,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     tos3LAdmI,
            
            // Himno
            himnot:                         htos3LAdmt,
            himno:                          htos3LAdm,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos3LAdm1,
            SalmoUNOt:                      salmo92t,
            SalmoUNO:                       salmo92,

            Ant2:                           tos3LAdm2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos3LAdm3,
            SalmoTRESt:                     salmo148t,
            SalmoTRES:                      salmo148,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3LAdm_lbt,
            LecturaTexto:                   tos3LAdm_lb,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos3LAdm_rb,
            responsorio2:                    tos3LAdm_rb,
            responsorio3:                    tos3LAdm_rb1,
            responsorio4:                    tos3LAdm_rb2,
            gloria:                          gloria,
            responsorio5:                    tos3LAdm_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos3LAdm_cE_A, tos3LAdm_cE_B, tos3LAdm_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos3LAdm_preces1,
            preces2:                        tos3LAdm_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos3LAdm_oracion,

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
    {        id:                            "tos4LAdm",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
        
        antifonaInvitatorio:                tos4LAdmI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            tos4LAdmI,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     tos4LAdmI,
            
            // Himno
            himnot:                         htos4LAdmt,
            himno:                          htos4LAdm,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos4LAdm1,
            SalmoUNOt:                      salmo92t,
            SalmoUNO:                       salmo92,

            Ant2:                           tos4LAdm2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos4LAdm3,
            SalmoTRESt:                     salmo148t,
            SalmoTRES:                      salmo148,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4LAdm_lbt,
            LecturaTexto:                   tos4LAdm_lb,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos4LAdm_rb,
            responsorio2:                    tos4LAdm_rb,
            responsorio3:                    tos4LAdm_rb1,
            responsorio4:                    tos4LAdm_rb2,
            gloria:                          gloria,
            responsorio5:                    tos4LAdm_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos4LAdm_cE_A, tos4LAdm_cE_B, tos4LAdm_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos4LAdm_preces1,
            preces2:                        tos4LAdm_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos4LAdm_oracion,

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
    {        id:                            "tos5LAdm",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
        
        antifonaInvitatorio:                tos5LAdmI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            tos5LAdmI,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     tos5LAdmI,
            
            // Himno
            himnot:                         htos5LAdmt,
            himno:                          htos5LAdm,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos5LAdm1,
            SalmoUNOt:                      salmo62_2_9t,
            SalmoUNO:                       salmo62_2_9,

            Ant2:                           tos5LAdm2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos5LAdm3,
            SalmoTRESt:                     salmo149t,
            SalmoTRES:                      salmo149,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos5LAdm_lbt,
            LecturaTexto:                   tos5LAdm_lb,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos5LAdm_rb,
            responsorio2:                    tos5LAdm_rb,
            responsorio3:                    tos5LAdm_rb1,
            responsorio4:                    tos5LAdm_rb2,
            gloria:                          gloria,
            responsorio5:                    tos5LAdm_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos5LAdm_cE_A, tos5LAdm_cE_B, tos5LAdm_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos5LAdm_preces1,
            preces2:                        tos5LAdm_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos5LAdm_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

    

];