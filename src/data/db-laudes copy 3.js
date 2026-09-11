// 1. El denominador común de la estructura principal (Salmos, Lecturas, etc.)
const s2Comun1 = {
    tt:                            "LAUDES",
    sub:                           "(Oración de la mañana)",
    invitatorio: {
        titulo:                    "INVITATORIO",
        instruccion:               instruccion,
        v:                         invitatorio1,
        r:                         invitatorio2,
    },
    antifonaInvitatorio:           tos2dmLAI,
    salmoInvitatorio: {
        titulo:                    salmo94t,
        subtitulo:                 invitacion,
        contentInv:                salmo94,
        antifonaInvitatorio:       tos2dmLAI,
        antifonaInvitatorio_Salida:tos2dmLAI,
        himnot:                    htos2LAdmt,
        himno:                     htos2LAdm,
    },
    Salmodias: {
        Ant1:                      tos2dmLA1,
        SalmoUNOt:                 salmo117t,
        SalmoUNO:                  salmo117,
        Ant2:                      tos2dmLA2,
        SalmoDOSt:                 dn_3_57_88_56t,
        SalmoDOS:                  dn_3_57_88_56,
        Ant3:                      tos2dmLA3,
        SalmoTRESt:                salmo150t,
        SalmoTRES:                 salmo150,
    },
    LecturaBreve: {
        LecturaCita:               tos2dmLA_lb1,
        LecturaTexto:              tos2dmLA_lb2,
        responsorio1:              tos2dmLA_rb,
        responsorio2:              tos2dmLA_rb,
        responsorio3:              tos2dmLA_rb1,
        responsorio4:              tos2dmLA_rb2,
        gloria:                    gloria,
        responsorio5:              tos2dmLA_rb,
    }
};

// 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
const s2Comun2 = {
    canticoZacariast: canticoZacariast,
    canticoZacarias:  canticoZacarias,
    Padren:           "Padre nuestro...",
    Conclusion1:      Conclusion1,
    Conclusion2:      Conclusion2
};


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
    {        id:                            "tos1LAdm",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
        
        antifonaInvitatorio:                inv_bautismo,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            inv_bautismo,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_bautismo,
            
            // Himno
            himnot:                         htos1LAdmt,
            himno:                          htos1LAdm,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos1dmLA1,
            SalmoUNOt:                      salmo62_2_9t,
            SalmoUNO:                       salmo62_2_9,

            Ant2:                           tos1dmLA2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos1dmLA3,
            SalmoTRESt:                     salmo149t,
            SalmoTRES:                      salmo149,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos1dmLA_t,
            LecturaTexto:                   tos1dmLA,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos1dmLA_rb,
            responsorio2:                    tos1dmLA_rb,
            responsorio3:                    tos1dmLA_rb1,
            responsorio4:                    tos1dmLA_rb2,
            gloria:                          gloria,
            responsorio5:                    tos1dmLA_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos1dmLA_cE_A, tos1dmLA_cE_B, tos1dmLA_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos1dmLA_preces1,
            preces2:                        tos1dmLA_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos1dmLA_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

/*  TIEMPO ORDINARIO
    DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX
    De la Feria. Salterio II    */

// ********* tps1js: Tiempo Pascual, Semana 1 Jueves Oficio de Lectura*********
    {        id:                            "tos2LAdm",
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
        
        antifonaInvitatorio:                tos2dmLAI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            tos2dmLAI,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     tos2dmLAI,
            
            // Himno
            himnot:                         htos2LAdmt,
            himno:                          htos2LAdm,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos2dmLA1,
            SalmoUNOt:                      sal117_1t,
            SalmoUNO:                       sal117_1,

            Ant2:                           tos2dmLA2,
            SalmoDOSt:                      dn_3_52_57t,
            SalmoDOS:                       dn_3_52_57,

            Ant3:                           tos2dmLA3,
            SalmoTRESt:                     salmo150t,
            SalmoTRES:                      salmo150,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos2dmLA_lb1,
            LecturaTexto:                   tos2dmLA_lb2,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos2dmLA_rb,
            responsorio2:                    tos2dmLA_rb,
            responsorio3:                    tos2dmLA_rb1,
            responsorio4:                    tos2dmLA_rb2,
            gloria:                          gloria,
            responsorio5:                    tos2dmLA_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos2dmLA_cE_A, tos2dmLA_cE_B, tos2dmLA_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos2dmLA_preces1,
            preces2:                        tos2dmLA_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos2dmLA_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

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
        
        antifonaInvitatorio:                tos3dmLAI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            inv_bautismo,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_bautismo,
            
            // Himno
            himnot:                         htos3LAdmt,
            himno:                          htos3LAdm,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos3dmLA1,
            SalmoUNOt:                      salmo92t,
            SalmoUNO:                       salmo92,

            Ant2:                           tos3dmLA2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos3dmLA3,
            SalmoTRESt:                     salmo148t,
            SalmoTRES:                      salmo148,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos3dmLA_lb1,
            LecturaTexto:                   tos3dmLA_lb2,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos3dmLA_rb,
            responsorio2:                    tos3dmLA_rb,
            responsorio3:                    tos3dmLA_rb1,
            responsorio4:                    tos3dmLA_rb2,
            gloria:                          gloria,
            responsorio5:                    tos3dmLA_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos3dmLA_cE_A, tos3dmLA_cE_B, tos3dmLA_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos3dmLA_preces1,
            preces2:                        tos3dmLA_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos3dmLA_oracion,

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
        
        antifonaInvitatorio:                tos4dmLAI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            inv_bautismo,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_bautismo,
            
            // Himno
            himnot:                         htos4LAdmt,
            himno:                          htos4LAdm,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos4dmLA1,
            SalmoUNOt:                      salmo92t,
            SalmoUNO:                       salmo92,

            Ant2:                           tos4dmLA2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos4dmLA3,
            SalmoTRESt:                     salmo148t,
            SalmoTRES:                      salmo148,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos4dmLA_lb1,
            LecturaTexto:                   tos4dmLA_lb2,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos4dmLA_rb,
            responsorio2:                    tos4dmLA_rb,
            responsorio3:                    tos4dmLA_rb1,
            responsorio4:                    tos4dmLA_rb2,
            gloria:                          gloria,
            responsorio5:                    tos4dmLA_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos4dmLA_cE_A, tos4dmLA_cE_B, tos4dmLA_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos4dmLA_preces1,
            preces2:                        tos4dmLA_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos4dmLA_oracion,

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
        
        antifonaInvitatorio:                tos5dmLAI,

        // datos.salmoInvitatorio.VARIABLE
        salmoInvitatorio: {
            titulo:                         salmo94t,
            subtitulo:                      invitacion,
            contentInv:                     salmo94,
            antifonaInvitatorio:            inv_bautismo,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_bautismo,
            
            // Himno
            himnot:                         htos5LAdmt,
            himno:                          htos5LAdm,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           tos5dmLA1,
            SalmoUNOt:                      salmo62_2_9t,
            SalmoUNO:                       salmo62_2_9,

            Ant2:                           tos5dmLA2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           tos5dmLA3,
            SalmoTRESt:                     salmo149t,
            SalmoTRES:                      salmo149,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    tos5dmLA_lb1,
            LecturaTexto:                   tos5dmLA_lb2,
            
        //RESPONSORIO BREVE    
            responsorio1:                    tos5dmLA_rb,
            responsorio2:                    tos5dmLA_rb,
            responsorio3:                    tos5dmLA_rb1,
            responsorio4:                    tos5dmLA_rb2,
            gloria:                          gloria,
            responsorio5:                    tos5dmLA_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos5dmLA_cE_A, tos5dmLA_cE_B, tos5dmLA_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        tos5dmLA_preces1,
            preces2:                        tos5dmLA_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        tos5dmLA_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

    

];