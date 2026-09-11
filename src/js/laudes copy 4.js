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

${ "" /* REPRODUCTOR AUTOMÁTICO ENCADENADO */ }
        <div class="audio-container">
            
            
            <div>
                <small class="rubrica" style="font-size: 11px;">1ra. Lectura</small>
                <audio class="saudio" id="audio1" controls>
                    <source src="${audio.dinamica}" type="audio/mpeg">
                </audio>
            </div>

            <div>
                <small class="rubrica" style="font-size: 11px;">2da. Lecturas</small>
                <audio class="saudio" id="audio2" controls>
                    <source src="${audio.fija}" type="audio/mpeg">
                </audio>
            </div>
        </div>
        
        ${ "" /* SECCIÓN DE AUDIO */}


        
    `;
}

// 1. FUNCIÓN DE RENDERIZADO (LA QUE CAMBIA)
export function renderizarLaudes(idBusqueda) {
    const datos = dbLaudes.find(item => item.id === idBusqueda);
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
    renderizarLaudes("salt1s1");

    
});