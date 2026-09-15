/**
 * Generador y Controlador del Año Litúrgico (añoliturgico.js)
 * Organizado en orden: Tiempo -> Semana -> Día -> Fecha (consecutiva) -> Celebración -> Ciclo/Paridad -> URLs Evangelio -> Oír -> Laudes
 * Liturgia de las Horas
 */

import {
    calcularInicioAdviento,
    formatearFechaISO,
    parsearFechaISO,
    obtenerParidadAño,
    obtenerCicloDominical,
    generarHitosLiturgicos,
    TABLA_CENIZA_BASE
} from './form_etiempo.js';

const DIAS_SEMANA_NOMBRES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/**
 * Genera la secuencia completa de días del año litúrgico
 */
export function generarSecuenciaLiturgica(añoBase) {
    const y = parseInt(añoBase, 10);
    const hitos = generarHitosLiturgicos(y);
    const hitosMap = {};
    hitos.forEach(h => { hitosMap[h.id] = h.fecha; });

    // Hitos clave
    const fechaInicioAdviento = parsearFechaISO(hitosMap['adviento'] || calcularInicioAdviento(y));
    const fechaCeniza = parsearFechaISO(hitosMap['ceniza'] || (TABLA_CENIZA_BASE[y + 1] ? TABLA_CENIZA_BASE[y + 1].ceniza : `${y + 1}-02-18`));
    const fechaPascua = parsearFechaISO(hitosMap['pascua'] || (TABLA_CENIZA_BASE[y + 1] ? TABLA_CENIZA_BASE[y + 1].pascua : `${y + 1}-04-05`));

    const dias = [];
    let fechaActual = new Date(fechaInicioAdviento);

    // ==========================================
    // 1. TIEMPO DE ADVIENTO (4 Semanas)
    // ==========================================
    for (let sem = 1; sem <= 4; sem++) {
        for (let d = 0; d < 7; d++) {
            const diaSemana = DIAS_SEMANA_NOMBRES[fechaActual.getDay()];
            const diaMes = fechaActual.getDate();
            const mes = fechaActual.getMonth() + 1; // 12 para Diciembre

            // 25 de Diciembre rompe Adviento e inicia Navidad
            if (mes === 12 && diaMes >= 25) break;

            let celebracion = '';
            // Del 17 al 24 de Diciembre: Ferias de Adviento
            if (mes === 12 && diaMes >= 17 && diaMes <= 24) {
                celebracion = `Feria de Adviento (${diaMes} de diciembre)`;
            }

            dias.push(crearItemDia({
                tiempo: 'Adviento',
                semana: `S${sem}`,
                dia: diaSemana,
                fecha: formatearFechaISO(fechaActual),
                celebracion: celebracion,
                esFeriaAdviento: (mes === 12 && diaMes >= 17 && diaMes <= 24)
            }));

            fechaActual.setDate(fechaActual.getDate() + 1);
        }
        if (fechaActual.getMonth() === 11 && fechaActual.getDate() >= 25) break;
    }

    // ==========================================
    // 2. TIEMPO DE NAVIDAD (25 Dic a Bautismo del Señor)
    // ==========================================
    // Posicionar exactamente en 25 de Diciembre
    fechaActual = new Date(y, 11, 25);

    // Días de la Octava de Navidad (25 al 31 de Dic)
    const nombresNavidadOctava = {
        25: "La Natividad del Señor (1er día de Navidad)",
        26: "San Esteban, protomártir (2do día de Navidad)",
        27: "San Juan, apóstol y evangelista (3er día de Navidad)",
        28: "Los Santos Inocentes, mártires (4to día de Navidad)",
        29: "5to día de Navidad",
        30: "6to día de Navidad",
        31: "7mo día de Navidad"
    };

    let semNavidad = 1;
    while (fechaActual.getMonth() === 11 && fechaActual.getDate() <= 31) {
        const diaNum = fechaActual.getDate();
        dias.push(crearItemDia({
            tiempo: 'Navidad',
            semana: `S${semNavidad}`,
            dia: DIAS_SEMANA_NOMBRES[fechaActual.getDay()],
            fecha: formatearFechaISO(fechaActual),
            celebracion: nombresNavidadOctava[diaNum] || `Navidad ${diaNum} de diciembre`
        }));
        if (fechaActual.getDay() === 6) semNavidad++;
        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    // 1 de Enero (Santa María Madre de Dios) a Epifanía y Bautismo
    // fechaActual ahora está en 1 de Enero del año siguiente (y + 1)
    const añoSiguiente = y + 1;
    const epifaniaDate = new Date(añoSiguiente, 0, 6);
    const diaEpif = epifaniaDate.getDay();
    const deltaBautismo = diaEpif === 0 ? 7 : (7 - diaEpif);
    const bautismoDate = new Date(añoSiguiente, 0, 6 + deltaBautismo);

    while (fechaActual <= bautismoDate) {
        const diaNum = fechaActual.getDate();
        const diaSemana = DIAS_SEMANA_NOMBRES[fechaActual.getDay()];
        let celebracion = '';

        if (diaNum === 1) {
            celebracion = "Santa María, Madre de Dios (Octava de Navidad)";
        } else if (diaNum === 6) {
            celebracion = "La Epifanía del Señor";
        } else if (fechaActual.getTime() === bautismoDate.getTime()) {
            celebracion = "El Bautismo del Señor";
        } else if (diaNum < 6) {
            celebracion = `Feria antes de la Epifanía (${diaNum} de enero)`;
        } else {
            celebracion = `${diaSemana.toLowerCase()} después de La Epifanía del Señor`;
        }

        dias.push(crearItemDia({
            tiempo: 'Navidad',
            semana: `S${semNavidad}`,
            dia: diaSemana,
            fecha: formatearFechaISO(fechaActual),
            celebracion: celebracion
        }));

        if (fechaActual.getDay() === 6) semNavidad++;
        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    // ==========================================
    // 3. TIEMPO ORDINARIO (I Parte)
    // Lunes después del Bautismo hasta Miércoles de Ceniza
    // ==========================================
    let semOrdinario = 1;
    // fechaActual ya es Lunes después del Bautismo
    while (fechaActual < fechaCeniza) {
        const diaSemana = DIAS_SEMANA_NOMBRES[fechaActual.getDay()];
        if (fechaActual.getDay() === 0) semOrdinario++;

        dias.push(crearItemDia({
            tiempo: 'Ordinario',
            semana: `S${semOrdinario}`,
            dia: diaSemana,
            fecha: formatearFechaISO(fechaActual),
            celebracion: diaSemana === 'Domingo' ? `${semOrdinario}º Domingo del Tiempo Ordinario` : ''
        }));

        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    // ==========================================
    // 4. TIEMPO DE CUARESMA
    // Desde Miércoles de Ceniza hasta Sábado Santo
    // ==========================================
    // Miércoles, Jueves, Viernes, Sábado después de Ceniza
    dias.push(crearItemDia({
        tiempo: 'Cuaresma',
        semana: 'S0',
        dia: 'Miércoles',
        fecha: formatearFechaISO(fechaActual),
        celebracion: 'Miércoles de Ceniza'
    }));
    fechaActual.setDate(fechaActual.getDate() + 1);

    dias.push(crearItemDia({
        tiempo: 'Cuaresma',
        semana: 'S0',
        dia: 'Jueves',
        fecha: formatearFechaISO(fechaActual),
        celebracion: 'Jueves después del Miércoles de Ceniza'
    }));
    fechaActual.setDate(fechaActual.getDate() + 1);

    dias.push(crearItemDia({
        tiempo: 'Cuaresma',
        semana: 'S0',
        dia: 'Viernes',
        fecha: formatearFechaISO(fechaActual),
        celebracion: 'Viernes después del Miércoles de Ceniza'
    }));
    fechaActual.setDate(fechaActual.getDate() + 1);

    dias.push(crearItemDia({
        tiempo: 'Cuaresma',
        semana: 'S0',
        dia: 'Sábado',
        fecha: formatearFechaISO(fechaActual),
        celebracion: 'Sábado después del Miércoles de Ceniza'
    }));
    fechaActual.setDate(fechaActual.getDate() + 1);

    // Semanas 1 a 5 de Cuaresma
    for (let sem = 1; sem <= 5; sem++) {
        for (let d = 0; d < 7; d++) {
            const diaSemana = DIAS_SEMANA_NOMBRES[fechaActual.getDay()];
            let celebracion = '';
            if (d === 0) {
                celebracion = `${sem}º Domingo de Cuaresma`;
            }
            dias.push(crearItemDia({
                tiempo: 'Cuaresma',
                semana: `S${sem}`,
                dia: diaSemana,
                fecha: formatearFechaISO(fechaActual),
                celebracion: celebracion
            }));
            fechaActual.setDate(fechaActual.getDate() + 1);
        }
    }

    // Semana 6 de Cuaresma (Semana Santa)
    const celebracionesSemanaSanta = [
        "Domingo de Ramos en la Pasión del Señor",
        "Lunes Santo",
        "Martes Santo",
        "Miércoles Santo",
        "Jueves Santo",
        "Viernes Santo",
        "Sábado Santo"
    ];
    for (let d = 0; d < 7; d++) {
        dias.push(crearItemDia({
            tiempo: 'Cuaresma',
            semana: 'S6',
            dia: DIAS_SEMANA_NOMBRES[fechaActual.getDay()],
            fecha: formatearFechaISO(fechaActual),
            celebracion: celebracionesSemanaSanta[d]
        }));
        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    // ==========================================
    // 5. TIEMPO DE PASCUA (50 días, de Resurrección a Pentecostés)
    // ==========================================
    // Semana 1: Octava de Pascua
    const octavaNombres = [
        "Domingo de Resurrección",
        "Lunes de la 8va de Pascua",
        "Martes de la 8va de Pascua",
        "Miércoles de la 8va de Pascua",
        "Jueves de la 8va de Pascua",
        "Viernes de la 8va de Pascua",
        "Sábado de la 8va de Pascua"
    ];
    for (let d = 0; d < 7; d++) {
        dias.push(crearItemDia({
            tiempo: 'Pascua',
            semana: 'S1',
            dia: DIAS_SEMANA_NOMBRES[fechaActual.getDay()],
            fecha: formatearFechaISO(fechaActual),
            celebracion: octavaNombres[d]
        }));
        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    // Semanas 2 a 7 de Pascua
    for (let sem = 2; sem <= 7; sem++) {
        for (let d = 0; d < 7; d++) {
            const diaSemana = DIAS_SEMANA_NOMBRES[fechaActual.getDay()];
            let celebracion = '';
            if (d === 0) {
                if (sem === 2) celebracion = "II Domingo de Pascua o de la Divina Misericordia";
                else if (sem === 7) celebracion = "Domingo de Pentecostés";
                else celebracion = `${sem}º Domingo de Pascua`;
            }
            dias.push(crearItemDia({
                tiempo: 'Pascua',
                semana: `S${sem}`,
                dia: diaSemana,
                fecha: formatearFechaISO(fechaActual),
                celebracion: celebracion
            }));
            fechaActual.setDate(fechaActual.getDate() + 1);
        }
    }

    // ==========================================
    // 6. TIEMPO ORDINARIO (II Parte)
    // Reanudación tras Pentecostés hasta Cristo Rey (Semana 34)
    // ==========================================
    const fechaAdvientoSiguiente = parsearFechaISO(hitosMap['adviento'] || calcularInicioAdviento(añoSiguiente));
    while (fechaActual < fechaAdvientoSiguiente) {
        const diaSemana = DIAS_SEMANA_NOMBRES[fechaActual.getDay()];
        if (fechaActual.getDay() === 0) semOrdinario++;

        let celebracion = '';
        // Si es el último domingo antes de Adviento: Jesucristo, Rey del Universo
        const unSemanaMas = new Date(fechaActual);
        unSemanaMas.setDate(unSemanaMas.getDate() + 7);
        if (diaSemana === 'Domingo' && unSemanaMas >= fechaAdvientoSiguiente) {
            celebracion = "Jesucristo, Rey del Universo (Semana 34)";
        } else if (diaSemana === 'Domingo') {
            celebracion = `${semOrdinario}º Domingo del Tiempo Ordinario`;
        }

        dias.push(crearItemDia({
            tiempo: 'Ordinario',
            semana: `S${Math.min(semOrdinario, 34)}`,
            dia: diaSemana,
            fecha: formatearFechaISO(fechaActual),
            celebracion: celebracion
        }));

        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return dias;
}

/**
 * Normaliza y añade identificadores y URLs por defecto a cada día
 */
function crearItemDia(datos) {
    const fechaObj = parsearFechaISO(datos.fecha);
    const año = fechaObj.getFullYear();
    const esDomingo = (datos.dia.toLowerCase() === 'domingo');
    const paridad = obtenerParidadAño(año);
    const ciclo = obtenerCicloDominical(año);

    // Generar prefijo de ID litúrgico consistente
    const tiempoCode = datos.tiempo.substring(0, 2).toLowerCase();
    const semCode = datos.semana.toLowerCase();
    const diaCode = datos.dia.substring(0, 2).toLowerCase();
    const idLiturgico = `t${tiempoCode}${semCode}${diaCode}`;

    // URLs de Evangelio estándar estructuradas
    // En domingos: Ciclos A, B y C
    // En días feriales: Par e Impar
    let urlEvangelioPar = '';
    let urlEvangelioImpar = '';
    let urlEvangelioCicloA = '';
    let urlEvangelioCicloB = '';
    let urlEvangelioCicloC = '';

    const semNum = datos.semana.replace('S', '') || '1';
    const diaUrl = datos.dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (datos.tiempo === 'Ordinario') {
        if (esDomingo) {
            urlEvangelioCicloA = `https://ev.resucito.do/to/${semNum}/domingo-a.mp3`;
            urlEvangelioCicloB = `https://ev.resucito.do/to/${semNum}/domingo-b.mp3`;
            urlEvangelioCicloC = `https://ev.resucito.do/to/${semNum}/domingo-c.mp3`;
        } else {
            urlEvangelioPar = `https://ev.resucito.do/to/${semNum}/${diaUrl}-par.mp3`;
            urlEvangelioImpar = `https://ev.resucito.do/to/${semNum}/${diaUrl}-impar.mp3`;
        }
    } else if (datos.tiempo === 'Adviento') {
        if (esDomingo) {
            urlEvangelioCicloA = `https://ev.resucito.do/adviento/${semNum}/domingo-a.mp3`;
            urlEvangelioCicloB = `https://ev.resucito.do/adviento/${semNum}/domingo-b.mp3`;
            urlEvangelioCicloC = `https://ev.resucito.do/adviento/${semNum}/domingo-c.mp3`;
        } else {
            urlEvangelioPar = `https://ev.resucito.do/adviento/${semNum}/${diaUrl}-par.mp3`;
            urlEvangelioImpar = `https://ev.resucito.do/adviento/${semNum}/${diaUrl}-impar.mp3`;
        }
    } else if (datos.tiempo === 'Cuaresma') {
        if (esDomingo) {
            urlEvangelioCicloA = `https://ev.resucito.do/cuaresma/${semNum}/domingo-a.mp3`;
            urlEvangelioCicloB = `https://ev.resucito.do/cuaresma/${semNum}/domingo-b.mp3`;
            urlEvangelioCicloC = `https://ev.resucito.do/cuaresma/${semNum}/domingo-c.mp3`;
        } else {
            urlEvangelioPar = `https://ev.resucito.do/cuaresma/${semNum}/${diaUrl}-par.mp3`;
            urlEvangelioImpar = `https://ev.resucito.do/cuaresma/${semNum}/${diaUrl}-impar.mp3`;
        }
    } else if (datos.tiempo === 'Pascua') {
        if (esDomingo) {
            urlEvangelioCicloA = `https://ev.resucito.do/pascua/${semNum}/domingo-a.mp3`;
            urlEvangelioCicloB = `https://ev.resucito.do/pascua/${semNum}/domingo-b.mp3`;
            urlEvangelioCicloC = `https://ev.resucito.do/pascua/${semNum}/domingo-c.mp3`;
        } else {
            urlEvangelioPar = `https://ev.resucito.do/pascua/${semNum}/${diaUrl}-par.mp3`;
            urlEvangelioImpar = `https://ev.resucito.do/pascua/${semNum}/${diaUrl}-impar.mp3`;
        }
    } else if (datos.tiempo === 'Navidad') {
        urlEvangelioPar = `https://ev.resucito.do/tn/${diaUrl}.mp3`;
        urlEvangelioImpar = `https://ev.resucito.do/tn/${diaUrl}.mp3`;
        urlEvangelioCicloA = `https://ev.resucito.do/tn/domingo-a.mp3`;
        urlEvangelioCicloB = `https://ev.resucito.do/tn/domingo-b.mp3`;
        urlEvangelioCicloC = `https://ev.resucito.do/tn/domingo-c.mp3`;
    }

    return {
        tiempo: datos.tiempo,
        semana: datos.semana,
        dia: datos.dia,
        fecha: datos.fecha,
        celebracion: datos.celebracion || '',
        id: idLiturgico,
        esDomingo: esDomingo,
        año: año,
        paridad: paridad,
        ciclo: ciclo,
        urlEvangelioPar: urlEvangelioPar,
        urlEvangelioImpar: urlEvangelioImpar,
        urlEvangelioCicloA: urlEvangelioCicloA,
        urlEvangelioCicloB: urlEvangelioCicloB,
        urlEvangelioCicloC: urlEvangelioCicloC
    };
}

// ==========================================
// RENDERIZADO Y CONTROL EN añoliturgico.html
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    const buscador = document.getElementById('buscador');
    const selectAño = document.getElementById('select-año-liturgico');
    const filtroTiempo = document.getElementById('filtro-tiempo');
    const badgeParidad = document.getElementById('badge-año-paridad');
    const badgeCiclo = document.getElementById('badge-año-ciclo');
    const subtituloAño = document.getElementById('subtitulo-año');
    const btnGuardar = document.getElementById('btn-guardar-año');
    const audioGlobal = document.getElementById('audio-tabla');

    if (!cuerpoTabla || !selectAño) return;

    let añoSeleccionado = parseInt(selectAño.value, 10) || 2026;
    let catalogoDias = [];
    let audioActivoBtn = null;

    function cargarDatosAño(y) {
        añoSeleccionado = y;
        if (subtituloAño) subtituloAño.textContent = `Año Litúrgico ${y}`;

        // Cargar desde localStorage si ya hay modificaciones guardadas
        const guardado = localStorage.getItem(`lh-catalogo-liturgico-${y}`);
        if (guardado) {
            try {
                catalogoDias = JSON.parse(guardado);
            } catch (e) {
                catalogoDias = generarSecuenciaLiturgica(y);
            }
        } else {
            catalogoDias = generarSecuenciaLiturgica(y);
        }

        actualizarBadgesAño();
        renderTabla();
    }

    function actualizarBadgesAño() {
        const paridad = obtenerParidadAño(añoSeleccionado);
        const ciclo = obtenerCicloDominical(añoSeleccionado);

        if (badgeParidad) {
            badgeParidad.textContent = `Año ${paridad}`;
            badgeParidad.className = `badge-info-año ${paridad === 'Par' ? 'badge-par' : 'badge-impar'}`;
        }
        if (badgeCiclo) {
            badgeCiclo.textContent = `Ciclo Dominical ${ciclo}`;
        }
    }

    /**
     * Recalcula fechas de manera consecutiva a partir de un índice dado
     */
    function recalcularFechasConsecutivas(desdeIndice, nuevaFechaBase) {
        if (!catalogoDias[desdeIndice]) return;
        let fechaCur = parsearFechaISO(nuevaFechaBase);

        for (let i = desdeIndice; i < catalogoDias.length; i++) {
            const fechaStr = formatearFechaISO(fechaCur);
            catalogoDias[i].fecha = fechaStr;
            const añoFila = fechaCur.getFullYear();
            catalogoDias[i].año = añoFila;
            catalogoDias[i].paridad = obtenerParidadAño(añoFila);
            catalogoDias[i].dia = DIAS_SEMANA_NOMBRES[fechaCur.getDay()];

            fechaCur.setDate(fechaCur.getDate() + 1);
        }
        renderTabla();
    }

    function renderTabla() {
        cuerpoTabla.innerHTML = '';
        const termino = (buscador ? buscador.value : '').toLowerCase().trim();
        const tiempoFiltro = filtroTiempo ? filtroTiempo.value : '';

        catalogoDias.forEach((item, index) => {
            const matchTiempo = !tiempoFiltro || item.tiempo === tiempoFiltro;
            const matchTermino = !termino ||
                item.fecha.toLowerCase().includes(termino) ||
                item.tiempo.toLowerCase().includes(termino) ||
                item.semana.toLowerCase().includes(termino) ||
                item.dia.toLowerCase().includes(termino) ||
                (item.celebracion && item.celebracion.toLowerCase().includes(termino));

            if (!matchTiempo || !matchTermino) return;

            const tr = document.createElement('tr');
            const tagTiempoClass = `tag-${item.tiempo.toLowerCase()}`;
            const esDomingo = item.esDomingo || (item.dia.toLowerCase() === 'domingo');

            // Determinar ciclo/paridad actual de la fila
            let badgeTipoHtml = '';
            let audioUrlActiva = '';

            if (esDomingo) {
                const cicloActivo = obtenerCicloDominical(item.año || añoSeleccionado);
                badgeTipoHtml = `<span class="badge-ciclo-tag">Ciclo ${cicloActivo} (A/B/C)</span>`;
                audioUrlActiva = (cicloActivo === 'A') ? item.urlEvangelioCicloA : ((cicloActivo === 'B') ? item.urlEvangelioCicloB : item.urlEvangelioCicloC);
            } else {
                const paridadActiva = (item.año % 2 === 0) ? 'Par' : 'Impar';
                badgeTipoHtml = `<span class="badge-paridad-tag">Año ${paridadActiva}</span>`;
                audioUrlActiva = (paridadActiva === 'Par') ? item.urlEvangelioPar : item.urlEvangelioImpar;
            }

            tr.innerHTML = `
                <td><span class="tag-tiempo ${tagTiempoClass}">${item.tiempo}</span></td>
                <td><span class="badge-semana">${item.semana}</span></td>
                <td><span class="badge-dia ${esDomingo ? 'dia-domingo' : ''}">${item.dia}</span></td>
                <td>
                    <input type="date" class="input-fecha-consecutiva" value="${item.fecha}" data-index="${index}" title="Cambiar fecha (actualiza consecutivamente las siguientes)">
                </td>
                <td><strong>${item.celebracion || '-'}</strong></td>
                <td>${badgeTipoHtml}</td>
                <td>
                    <input type="text" class="input-url-evangelio" value="${audioUrlActiva || ''}" data-url-index="${index}" placeholder="https://ev.resucito.do/...">
                </td>
                <td>
                    <button type="button" class="btn-play-fila" data-audio="${audioUrlActiva || ''}" title="Escuchar Evangelio">
                        <span class="material-symbols-outlined" style="font-size: 18px;">play_arrow</span>
                    </button>
                </td>
                <td>
                    <a class="btn-ir-laudes" href="laudes.html?laudes=${item.id}" target="_blank">Laudes</a>
                </td>
            `;

            cuerpoTabla.appendChild(tr);
        });

        // Conectar inputs de fecha consecutiva
        cuerpoTabla.querySelectorAll('.input-fecha-consecutiva').forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                const nuevaFecha = e.target.value;
                if (nuevaFecha) {
                    recalcularFechasConsecutivas(idx, nuevaFecha);
                }
            });
        });

        // Conectar inputs de URL personalizada
        cuerpoTabla.querySelectorAll('.input-url-evangelio').forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.urlIndex, 10);
                const val = e.target.value.trim();
                const item = catalogoDias[idx];
                if (item) {
                    if (item.esDomingo) {
                        const c = obtenerCicloDominical(item.año || añoSeleccionado);
                        if (c === 'A') item.urlEvangelioCicloA = val;
                        else if (c === 'B') item.urlEvangelioCicloB = val;
                        else item.urlEvangelioCicloC = val;
                    } else {
                        const p = (item.año % 2 === 0) ? 'Par' : 'Impar';
                        if (p === 'Par') item.urlEvangelioPar = val;
                        else item.urlEvangelioImpar = val;
                    }
                }
            });
        });

        // Conectar botones de reproducción
        cuerpoTabla.querySelectorAll('.btn-play-fila').forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.dataset.audio;
                if (!url) {
                    alert('No hay URL de audio configurada para este día.');
                    return;
                }

                if (audioActivoBtn === btn && !audioGlobal.paused) {
                    audioGlobal.pause();
                    btn.classList.remove('reproduciendo');
                    btn.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
                    audioActivoBtn = null;
                } else {
                    if (audioActivoBtn) {
                        audioActivoBtn.classList.remove('reproduciendo');
                        audioActivoBtn.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
                    }
                    audioGlobal.src = url;
                    audioGlobal.play().then(() => {
                        btn.classList.add('reproduciendo');
                        btn.querySelector('.material-symbols-outlined').textContent = 'pause';
                        audioActivoBtn = btn;
                    }).catch(err => {
                        console.error("Error al reproducir audio:", err);
                        alert(`No se pudo reproducir el audio: ${url}`);
                    });
                }
            });
        });
    }

    if (audioGlobal) {
        audioGlobal.addEventListener('ended', () => {
            if (audioActivoBtn) {
                audioActivoBtn.classList.remove('reproduciendo');
                audioActivoBtn.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
                audioActivoBtn = null;
            }
        });
    }

    if (buscador) {
        buscador.addEventListener('input', () => renderTabla());
    }

    if (filtroTiempo) {
        filtroTiempo.addEventListener('change', () => renderTabla());
    }

    if (selectAño) {
        selectAño.addEventListener('change', (e) => {
            cargarDatosAño(parseInt(e.target.value, 10));
        });
    }

    if (btnGuardar) {
        btnGuardar.addEventListener('click', () => {
            localStorage.setItem(`lh-catalogo-liturgico-${añoSeleccionado}`, JSON.stringify(catalogoDias));
            alert(`Año Litúrgico ${añoSeleccionado} guardado exitosamente.`);
        });
    }

    // Carga inicial
    cargarDatosAño(añoSeleccionado);
});
