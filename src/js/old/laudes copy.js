import { dbLaudes } from '../data/db-laudes.js';

// Esta función se encarga de "armar" el HTML con los colores correctos
function generarTemplateLaudes(datos) {
    return `
        <t class="Salmodia">${datos.tt}</t>
        <br>
        <t class="OraciondelaManana">${datos.sub}</t>
    <br>
    <br>
        <div class="seccion-invitatorio">

        
        <p class="rubrica">${datos.invitatorio.titulo}</p>
        <p class="rubrica instruccion">${datos.invitatorio.instruccion}</p>
        
        
        <br>
        <span class="verso-linea"><span class="rubrica">V.</span> ${datos.invitatorio.v}</span>
        <br>
        <span class="verso-linea"><span class="rubrica">R.</span> ${datos.invitatorio.r}</span>
        </div>
        
        
        <div class="antifona" style="margin-top: 20px;">
        <p><span class="rubrica">Ant.</span> ${datos.antifonaInvitatorio}</p>
        </div>
        
        
        <div class="salmo-completo">
        <div class="salmo-Invitatorio">
        <b class="titulo-salmo94">${datos.salmoInvitatorio.titulo}</b>
        <b class="titulo-salmo94">${datos.salmoInvitatorio.subtitulo}</b>
        </div>
        
        
        <div class="cuerpo-salmo">${datos.salmoInvitatorio.contentInv}</div>

        <br>
        <br>
        <p><span class="rubrica">Ant.</span> ${datos.antifonaInvitatorio}</p>
        
        </div>
        
        <div>
        <br>
        
        <b class="titulo-salmo94">${datos.salmoInvitatorio.himnot}</b>
        <br>
        <br>
        <div class="cuerpo-salmo">${datos.salmoInvitatorio.himno}</div>
        
        <br>
        <p><span class="rubrica">SALMODIA</span> </p>
        <br>
        
        ${ "" /* ANTIFONA Y SALMO 1 */}
        <p><span class="rubrica">Ant 1.</span> ${datos.Salmodias.Ant1}</p><br>
        <p><span class="rubrica"> ${datos.Salmodias.SalmoUNOt}</span></p><br>
        <div class="cuerpo-salmo">${datos.Salmodias.SalmoUNO}</div><br>
        <p><span class="rubrica">Ant.</span> ${datos.Salmodias.Ant1}</p>

        <br>

        ${ "" /* ANTIFONA Y SALMO 2 */}
        <p><span class="rubrica">Ant 2.</span> ${datos.Salmodias.Ant2}</p><br>
        <p><span class="rubrica"> ${datos.Salmodias.SalmoDOSt}</span></p><br>
        <div class="cuerpo-salmo">${datos.Salmodias.SalmoDOS}</div><br>
        <p><span class="rubrica">Ant.</span> ${datos.Salmodias.Ant2}</p>

        <br>

        ${ "" /* ANTIFONA Y SALMO 3 */}
        <p><span class="rubrica">Ant 3.</span> ${datos.Salmodias.Ant3}</p><br>
        <p><span class="rubrica"> ${datos.Salmodias.SalmoTRESt}</span></p><br>
        <div class="cuerpo-salmo">${datos.Salmodias.SalmoTRES}</div><br>
        <p><span class="rubrica">Ant.</span> ${datos.Salmodias.Ant3}</p>

        </div>

        <br>

        <div> ${ "" /* LLAVE LECTURA BREVE */}

        <p><span class="rubrica">LECTURA BREVE   ${datos.LecturaBreve.LecturaCita}</span></p><br>
        <div class="Lectura-Breve">${datos.LecturaBreve.LecturaTexto}</div><br>

        <p><span class="rubrica">RESPONSORIO BREVE</span></p><br>

        <p><span class="rubrica"> ${datos.LecturaBreve.nota}</span></p><br>
        <div class="Lectura-Breve">${datos.LecturaBreve.responsorio}</div><br>


        </div> ${ "" /* LLAVE LECTURA BREVE */}
        
        ${ "" /* SECCIÓN DE AUDIO */}

${ "" /* REPRODUCTORES DE AUDIO */ }
        <div class="seccion-audio" style="margin: 20px 0; display: flex; flex-direction: column; gap: 10px;">
            
            <div class="player-unit">
                <audio controls style="width: 100%;">
                    <source src="../audio/${obtenerRutasAudio().archivoVariable}" type="audio/mpeg">
                </audio>
            </div>

            <div class="player-unit">
                <audio controls style="width: 100%;">
                    <source src="../audio/${obtenerRutasAudio().archivoFijo}" type="audio/mpeg">
                </audio>
            </div>
            
        </div>
        ${ "" /* SECCIÓN DE AUDIO */}


        
    `;
}

export function renderizarLaudes(idBusqueda) {
    const datos = dbLaudes.find(item => item.id === idBusqueda);
    const contenedor = document.getElementById('contenido-dinamico');

    if (!datos) {
        contenedor.innerHTML = "<p>Error: No se encontró la salmodia seleccionada.</p>";
        return;
    }

    contenedor.innerHTML = generarTemplateLaudes(datos);
}


// Función técnica para decidir la ruta del audio según el año
function construirUrlAudio(datos) {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const diaSemana = ahora.getDay(); // 0: Domingo, 1: Lunes...
    
    // 1. Mapeo del día (según tu servidor)
    const nombresDias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const diaRuta = nombresDias[diaSemana];

    // 2. Extraer el número de semana del ID (ej: de "salt1s1" extrae el "1")
    // Usamos una expresión regular para buscar el número después de la 's'
    const matchSemana = datos.id.match(/s(\d+)/);
    const numSemana = matchSemana ? matchSemana[1] : "1";
    const semanaRuta = "s" + numSemana.padStart(2, '0');

    // 3. Lógica de paridad del año
    const archivoLectura = (year % 2 === 0) ? "lectura2.mp3" : "lectura1.mp3";

    // 4. Retornar las rutas finales
    const baseUrl = "https://ta.resucito.do/";
    return {
        dinamica: `${baseUrl}${semanaRuta}/${diaRuta}/${archivoLectura}`,
        fija: `${baseUrl}${semanaRuta}/${diaRuta}/lecturas.mp3`
    };
}

// Función para determinar si el audio debe ser el de año par o impar



// Para probarlo de inmediato, puedes ejecutarlo al cargar (luego se hará por evento)
document.addEventListener('DOMContentLoaded', () => {
    renderizarLaudes("salt1s1");
});