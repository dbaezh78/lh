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
            SalmoTRES:                 salmo150,
        },

// Lectura Breve
        LecturaBreve: {
            LecturaCita:               tos2LAdo_lb1,
            LecturaTexto:              tos2LAdo_lb2,

//RESPONSORIO BREVE
            responsorio1:              tos2LAdo_rb,
            responsorio2:              tos2LAdo_rb,
            responsorio3:              tos2LAdo_rb1,
            responsorio4:              tos2LAdo_rb2,
            gloria:                    gloria,
            responsorio5:              tos2LAdo_rb,
        }
    };

// 2. El denominador común para el bloque de conclusión (Zacarías, Padre Nuestro, Final)
    const s2Comun2 = {

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
        Conclusion2:      Conclusion2
    };

// COMUN 3,7,11,15,19,23,27,31
const s3Comun1 = {
             tt:                            "LAUDES",
            sub:                            "(Oración de la mañana)",
    invitatorio: {
         titulo:                            "INVITATORIO",
    instruccion:                            instruccion, //(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)
              v:                            invitatorio1,   // V. Señor abre mis labios
              r:                            invitatorio2,   // R. y mi boca proclamará tu alabanza
        },
  
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
            LecturaCita:                    tos3LAdo_lb1,
            LecturaTexto:                   tos3LAdo_lb2,
            
//RESPONSORIO BREVE
            responsorio1:                    tos3LAdo_rb,
            responsorio2:                    tos3LAdo_rb,
            responsorio3:                    tos3LAdo_rb1,
            responsorio4:                    tos3LAdo_rb2,
            gloria:                          gloria,
            responsorio5:                    tos3LAdo_rb,
        }
    };

    s3Comun2 = {

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
    {        id:                            "bautismo",
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
            himnot:                         hbautismot,
            himno:                          hbautismo,
        },

        // Salmodia 1, 2, 3
        Salmodias: {
            Ant1:                           bautismo1,
            SalmoUNOt:                      salmo62_2_9t,
            SalmoUNO:                       salmo62_2_9,

            Ant2:                           bautismo2,
            SalmoDOSt:                      dn_3_57_88_56t,
            SalmoDOS:                       dn_3_57_88_56,

            Ant3:                           bautismo3,
            SalmoTRESt:                     salmo149t,
            SalmoTRES:                      salmo149,
        },

        //Lectura Breve
        LecturaBreve: {
            LecturaCita:                    bautismo_lbt,
            LecturaTexto:                   bautismo_lb,
            
        //RESPONSORIO BREVE    
            responsorio1:                    bautismo_rb,
            responsorio2:                    bautismo_rb,
            responsorio3:                    bautismo_rb1,
            responsorio4:                    bautismo_rb2,
            gloria:                          gloria,
            responsorio5:                    bautismo_rb,
        },


        //Cantico Evangelico
        cEvan_Conclusion: {
            cEvangelicoAnt:                 window.antifonaDomingo(tos1LAdo_cE_A, tos1LAdo_cE_B, tos1LAdo_cE_C),
            canticoZacariast:               canticoZacariast,
            canticoZacarias:                canticoZacarias,
            
            
        //PRECES
            preces1:                        bautismo_preces1,
            preces2:                        bautismo_preces2,
    
            Padren:                         "Padre nuestro...",
    
            oracion:                        bautismo_oracion,

            Conclusion1:                    Conclusion1,
            Conclusion2:                    Conclusion2,
        },
    },  // ***********************************************************

// ********* tos2LAdo: Tiempo Ordinario, Semana 2,6,10,14,18,22,26,30 Laudes DOMINGO *********
/*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos2LAdo", ...s2Comun1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos2LAdo_cE_A, tos2LAdo_cE_B, tos2LAdo_cE_C),...s2Comun2,}},
// ********* tos2LAdo: Tiempo Ordinario, Semana 2 Laudes DOMINGO *********

// ********* tos3LAdo: Tiempo Ordinario, Semana 3,7,11,15,19,23,27,31 Laudes DOMINGO *********
/*  TIEMPO ORDINARIO | DOMINGO DE LA SEMANA II, VI, X, XIV, XVIII, XXII, XXVI, XXX De la Feria. Salterio II    */
    {id: "tos3LAdo", ...s3Comun1,cEvan_Conclusion: {cEvangelicoAnt:   window.antifonaDomingo(tos3LAdo_cE_A, tos3LAdo_cE_B, tos3LAdo_cE_C),...s3Comun2,}},
// ********* tos2LAdo: Tiempo Ordinario, Semana 2 Laudes DOMINGO *********




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
            antifonaInvitatorio:            inv_bautismo,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_bautismo,
            
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
            LecturaCita:                    tos3LAdo_lb1,
            LecturaTexto:                   tos3LAdo_lb2,
            
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
            antifonaInvitatorio:            inv_bautismo,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_bautismo,
            
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
            LecturaCita:                    tos4LAdo_lb1,
            LecturaTexto:                   tos4LAdo_lb2,
            
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
            antifonaInvitatorio:            inv_bautismo,

            // Antifona de Entrada
            antifonaInvitatorio_Salida:     inv_bautismo,
            
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
            LecturaCita:                    tos5LAdo_lb1,
            LecturaTexto:                   tos5LAdo_lb2,
            
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