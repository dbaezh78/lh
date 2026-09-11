import { dbLaudes } from '../data/db-laudes.js';

// Esta función se encarga de "armar" el HTML con los colores correctos
function generarTemplateLaudes(datos) {
    const audio = construirUrlLiturgica(datos);
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

        <div class="audio-container" style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 15px;">
            <p class="rubrica" style="font-size: 14px;">AUDIO DE LA LITURGIA</p>
            
            <span class="rubrica" style="font-size: 13px; font-style: italic;">1ra Lectura</span>
            <audio controls style="width: 100%; margin-bottom: 10px;">
                <source src="${audio.dinamica}" type="audio/mpeg">
            </audio>

            <span class="rubrica" style="font-size: 13px; font-style: italic;">Lecturas Varias</span>
            <audio controls style="width: 100%;">
                <source src="${audio.fija}" type="audio/mpeg">
            </audio>
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
function construirUrlLiturgica(datos) {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const diaSemana = ahora.getDay();
    
    // 1. Mapeo de subdominios por tiempo
    // Asumimos que en tus 'datos' vendrá una propiedad 'tiempo' (ej: 'pascua', 'cuaresma')
    const subdominios = {
        'adviento':  'ta',
        'navidad':   'tn',
        'ordinario': 'to',
        'cuaresma':  'tc',
        'pascua':    'tp'
    };

    // Obtenemos el prefijo. Si no se encuentra, por defecto usamos ordinario (to)
    const tiempo = datos.tiempoLiturgico ? datos.tiempoLiturgico.toLowerCase() : 'ordinario';
    const prefijo = subdominios[tiempo] || 'to';
    const baseUrl = `https://${prefijo}.resucito.do/`;

    // 2. Mapeo del día
    const nombresDias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const diaRuta = nombresDias[diaSemana];

    // 3. Extraer semana del ID (ej: de "salt1s1" extrae "01")
    const matchSemana = datos.id.match(/s(\d+)/);
    const numSemana = matchSemana ? matchSemana[1] : "1";
    const semanaRuta = "s" + numSemana.padStart(2, '0');

    // 4. Paridad del año
    const archivoLectura = (year % 2 === 0) ? "lectura2.mp3" : "lectura1.mp3";

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