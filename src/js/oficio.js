import { dbOficio } from '../data/db-Oficio.js';

//*********************************************************************** */

// Esta función se encarga de "armar" el HTML con los colores correctos
function generarTemplateLaudes(datos) {
    const audio = construirUrlLiturgica(datos);
    return `
        <t class="Salmodia">${datos.tt}</t>
        <br>
        <hr>

        <div class="seccion-invitatorio">
        <p class="rubrica">${datos.invitatorio.titulo}</p>
        
        <p class="titulo instruccion">Si ésta es la primera oración del día:</p>        
        
        <span class="verso-linea"><span class="rubrica">V.</span> ${datos.invitatorio.v1}</span><br>
        <span class="verso-linea"><span class="rubrica">R.</span> ${datos.invitatorio.r1}</span>
        </div>
        
        <p class="titulo instruccion">Se añade el Salmo del Invitatorio con la siguiente antífona:</p>
        
        
        <div>
        <p><span class="rubrica">Ant. </span> ${datos.invitatorio.antifonaInvitatorio}</p>
        </div>
        <hr>
        <p class="abajo">Si antes se ha rezado ya alguna otra Hora</p>

        <span class="verso-linea"><span class="rubrica">V.</span> ${datos.invitatorio.v2}</span><br>
        <span class="verso-linea"><span class="rubrica">R.</span> ${datos.invitatorio.r2}</span><br><br>
        <hr>


        </div>
        
        <div>
        
        ${ "" /* HIMNO*/}
        <b class="titulo-salmo94 abajo">${datos.salmoInvitatorio.himnot}</b>
        <div class="cuerpo-salmo">${datos.salmoInvitatorio.himno}</div>
        
        ${ "" /* SALMODIA */}
        <p class="antifona"><span class="rubrica">SALMODIA</span> </p>
        
        ${ "" /* ANTIFONA Y SALMO 1 */}
        <p class="antifona"><span class="rubrica">Ant 1. </span> ${datos.Salmodias.Ant1}</p>
        <p class="abajo"><span class="rubrica"> ${datos.Salmodias.SalmoUNOt}</span></p>
        <div class="cuerpo-salmo">${datos.Salmodias.SalmoUNO}</div>
        <p class="antifona"><span class="rubrica">Ant. </span> ${datos.Salmodias.Ant1}</p>

        ${ "" /* ANTIFONA Y SALMO 2 */}
        <p class="abajo"><span class="rubrica">Ant 2. </span> ${datos.Salmodias.Ant2}</p>
        <p><span class="rubrica"> ${datos.Salmodias.SalmoDOSt}</span></p>
        <div class="cuerpo-salmo">${datos.Salmodias.SalmoDOS}</div>
        <p class="antifona"><span class="rubrica">Ant. </span> ${datos.Salmodias.Ant2}

        ${ "" /* ANTIFONA Y SALMO 3 */}
        <p class="antifona"><span class="rubrica">Ant 3. </span> ${datos.Salmodias.Ant3}</p>
        <p class="abajo"><span class="rubrica"> ${datos.Salmodias.SalmoTRESt}</span></p>
        <div class="cuerpo-salmo">${datos.Salmodias.SalmoTRES}</div>
        <p class="antifona"><span class="rubrica">Ant. </span> ${datos.Salmodias.Ant3}</p>
        </div>
        
        <p><span class="rubrica">V. </span> ${datos.Responde.Resp_antes_LectV}</p>
        <p class="abajo"><span class="rubrica">R. </span> ${datos.Responde.Resp_antes_LectR}</p>
        
        


        ${ "" /* REPRODUCTOR AUTOMÁTICO ENCADENADO */ }
    <div class="audio-container AudioFormato" >
        
        <div class="fila-audio maudio staudio">
            <small class="rubrica Lect1Style">1ra. Lectura</small>
            <audio class="saudio" id="audio1" controls style="flex: 1; height: 30px;">
                <source src="${audio.dinamica}" type="audio/mpeg">
            </audio>
        </div>


        <p class="antifona"><span class="rubrica"> PRIMERA LECTURA</span> </p>
        
        <p class="abajo"></span> ${datos.Lecturas.Lectura11}</p>
        <p class="abajo rubrica">${datos.Lecturas.Lectura12}</span></p>
        <p class="abajo cuerpo-lectura"></span> ${datos.Lecturas.Lectura14}</p>
        <p class="antifona"><span class="rubrica">RESPONSORIO ${datos.Lecturas.Lectura13} </span></p>
        <span class="verso-linea Oracion"><span class="rubrica">R.</span> ${datos.Lecturas.Lectura15}</span>
        <span class="verso-linea Oracion"><span class="rubrica">*.</span> ${datos.Lecturas.Lectura17}</span><br>
        <span class="verso-linea Oracion"><span class="rubrica">V.</span> ${datos.Lecturas.Lectura16}</span><br>
        <span class="verso-linea Oracion abajo"><span class="rubrica">R.</span> ${datos.Lecturas.Lectura17}</span><br><br>

        
        ${ "" /* SEGUNDA LECTURA*/}
        <div class="fila-audio maudio staudio">
            <small class="rubrica Lect1Style">2da. Lectura</small>
            <audio class="saudio" id="audio2" controls style="flex: 1; height: 30px;">
                <source src="${audio.fija}" type="audio/mpeg">
            </audio>
        </div>

                <p class="antifona"><span class="rubrica"> SEGUNDA LECTURA</span> </p>
        
        <p class="abajo"></span> ${datos.Lecturas.Lectura21}</p>
        <p class="abajo rubrica">${datos.Lecturas.Lectura22}</span></p>
        <p class="abajo cuerpo-lectura"></span> ${datos.Lecturas.Lectura24}</p>
        <p class="antifona"><span class="rubrica">RESPONSORIO ${datos.Lecturas.Lectura23} </span></p>
        <span class="verso-linea Oracion"><span class="rubrica">R.</span> ${datos.Lecturas.Lectura25}</span>
        <span class="verso-linea Oracion"><span class="rubrica">*.</span> ${datos.Lecturas.Lectura27}</span><br>
        <span class="verso-linea Oracion"><span class="rubrica">V.</span> ${datos.Lecturas.Lectura26}</span><br>
        <span class="verso-linea Oracion abajo"><span class="rubrica">R.</span> ${datos.Lecturas.Lectura27}</span><br><br>


    </div>
        
        ${ "" /* SECCIÓN DE AUDIO */}


        <p class="antifona"><span class="titulo">CÁNTICO EVANGÉLICO</span></p>

        <p class="abajo"><span class="rubrica">Ant. </span> ${datos.cEvan_Conclusion.cEvangelicoAnt}</p>

        <p class="antifona"><span class="titulo">Cántico de Zacarías. EL MESÍAS Y SU PRECURSOR      Lc 1, 68-79</span> </p>
        
        <div class="cuerpo-salmo">${datos.cEvan_Conclusion.canticoZacarias}</div>
        
        <p class="antifona"><span class="rubrica">Ant. </span> ${datos.cEvan_Conclusion.cEvangelicoAnt}</p>
        
        <p><span class="titulo">PRECES</span></p>
        
        <div class="cuerpo-salmo">${datos.cEvan_Conclusion.preces1}</div>
        
        <p><span class="titulo">Se pueden añadir algunas intenciones libres</span></p>
        
        <div class="cuerpo-salmo">${datos.cEvan_Conclusion.preces2}</div>
        
        <p><span class="titulo">${datos.cEvan_Conclusion.Padren}</span></p>
        
        <p><span class="titulo">ORACIÓN</span></p>
        
        <div class="Oracion">${datos.cEvan_Conclusion.oracion}</div>
        
        <p><span class="titulo">CONCLUSIÓN</span></p>

        <p><span class="rubrica">V.</span> ${datos.cEvan_Conclusion.Conclusion1}</p>
        <p><span class="rubrica">R.</span> ${datos.cEvan_Conclusion.Conclusion2}</p>



        




        
    `;
}

// 1. FUNCIÓN DE RENDERIZADO (LA QUE CAMBIA)
export function renderizarLaudes(idBusqueda) {
    const datos = dbOficio.find(item => item.id === idBusqueda);
    const contenedor = document.getElementById('contenido-dinamico');

    if (!datos) {
        contenedor.innerHTML = "<p>Error: No se encontró la salmodia seleccionada.</p>";
        return;
    }

    // Inyectamos el HTML generado por el template
    contenedor.innerHTML = generarTemplateLaudes(datos);

    // LÓGICA DE ENCADENAMIENTO DE AUDIOS
    // Se ejecuta justo después de inyectar el HTML para encontrar los IDs
    const a1 = document.getElementById('audio1');
    const a2 = document.getElementById('audio2');

    if (a1 && a2) {
        a1.onended = function() {
            console.log("%c ⏭️ Cambio de audio: Iniciando Lecturas Varias", "color: #008000; font-weight: bold;");
            a2.play();
            // Desplazamiento suave para que el usuario vea el segundo reproductor activo
            a2.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        console.log(`%c 🎧 Audios vinculados para ${idBusqueda}`, "color: #bc0009; font-weight: bold;");
    }
}

// CALCULANDO EL TIEMPO LITURGICO

// Función para calcular el Domingo de Pascua (Algoritmo de Butcher)
function calcularPascua(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, mes - 1, dia);
}

function obtenerTiempoLiturgicoReal(fecha) {
    const anio = fecha.getFullYear();
    const pascua = calcularPascua(anio);
    
    // Fechas clave
    const navidad = new Date(anio, 11, 25);
    const bautismo = new Date(anio, 0, 13); // Aproximado (Fin Navidad)
    const miercolesCeniza = new Date(pascua);
    miercolesCeniza.setDate(pascua.getDate() - 46);
    
    const pentecostes = new Date(pascua);
    pentecostes.setDate(pascua.getDate() + 50);

    // Adviento (4 domingos antes de Navidad)
    let adviento = new Date(anio, 11, 25);
    adviento.setDate(adviento.getDate() - (adviento.getDay() || 7) - 21);

    let tiempo = "ordinario"; // Por defecto
    
    if (fecha >= navidad || fecha < bautismo) {
        tiempo = "navidad";
    } else if (fecha >= adviento && fecha < navidad) {
        tiempo = "adviento";
    } else if (fecha >= miercolesCeniza && fecha < pascua) {
        tiempo = "cuaresma";
    } else if (fecha >= pascua && fecha < pentecostes) {
        tiempo = "pascua";
    }

    // LOG PARA DEPURACIÓN
    console.log(`%c 📅 CALENDARIO: ${fecha.toLocaleDateString()} -> TIEMPO: ${tiempo.toUpperCase()}`, "color: blue; font-weight: bold;");
    
    return tiempo;
}

// CALCULANDO EL TIEMPO LITURGICO


// Función técnica para decidir la ruta del audio según el año
function construirUrlLiturgica(datos) {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const diaSemana = ahora.getDay();
    
    const subdominios = {
        'adviento':  'ta',
        'navidad':   'tn',
        'ordinario': 'to',
        'cuaresma':  'tc',
        'pascua':    'tp'
    };

    // USAMOS EL CÁLCULO REAL EN LUGAR DE LOS DATOS FIJOS
    const tiempoDetectado = obtenerTiempoLiturgicoReal(ahora);
    const prefijo = subdominios[tiempoDetectado];
    const baseUrl = `https://${prefijo}.resucito.do/`;

    // Identificar Día y Semana (Extrayendo de salt1s1...)
    const nombresDias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const diaRuta = nombresDias[diaSemana];
    const matchSemana = datos.id.match(/s(\d+)/);
    const numSemana = matchSemana ? matchSemana[1] : "1";
    const semanaRuta = "s" + numSemana.padStart(2, '0');

    const archivoLectura = (year % 2 === 0) ? "lectura2.mp3" : "lectura1.mp3";
    const urlFinal = `${baseUrl}${semanaRuta}/${diaRuta}/${archivoLectura}`;

    // --- LOG DE CARGA ---
    console.group("%c 🎧 REPRODUCTOR ACTIVADO ", "background: #222; color: #bada55");
    console.log("Archivo cargado:", archivoLectura);
    console.log("Desde servidor:", baseUrl);
    console.log("URL completa:", urlFinal);
    console.groupEnd();

    return {
        dinamica: urlFinal,
        fija: `${baseUrl}${semanaRuta}/${diaRuta}/lecturas.mp3`
    };
}

// Función para determinar si el audio debe ser el de año par o impar


// Para probarlo de inmediato, puedes ejecutarlo al cargar (luego se hará por evento)
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    
    // Intenta obtener 'oficio', y si no existe, intenta con 'laudes'
    const idUrl = params.get('oficio') || params.get('laudes');

    const container = document.getElementById('contenido-dinamico');

    if (idUrl) {
        // Buscamos en la base de datos el ID que llegó por URL
        const datosOficio = dbOficio.find(item => item.id === idUrl);

        if (datosOficio) {
            container.innerHTML = generarTemplateLaudes(datosOficio);
            console.log("Cargado con éxito:", datosOficio.id);
        } else {
            container.innerHTML = `<h2>El ID "${idUrl}" no existe en la base de datos</h2>`;
        }
    } else {
        // Si no hay ID en la URL, no carga el Jueves, muestra este mensaje:
        container.innerHTML = `<h2>Por favor, selecciona un oficio del menú.</h2>`;
    }
});