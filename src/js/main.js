import { obtenerInfoLiturgica } from '../data/calendarioLiturgico.js';

const app = document.getElementById('app');

// =========================================================
// CONFIGURACIÓN DE LOS TIEMPOS LITÚRGICOS
// =========================================================
const configuracionTiempos = {
    adviento: {
        tipo: 'semanas',
        total: 4,
        prefijoId: 'tas',
        titulo: 'Semanas de Adviento'
    },
    navidad: {
        tipo: 'semanas',
        total: 2,
        prefijoId: 'tns',
        titulo: 'Semanas de Navidad'
    },
    ordinario: {
        tipo: 'semanas',
        total: 34,
        prefijoId: 'tos',
        titulo: 'Semanas del Tiempo Ordinario'
    },
    cuaresma: {
        tipo: 'semanas',
        total: 7,
        prefijoId: 'tcs',
        titulo: 'Semanas de Cuaresma'
    },
    pascua: {
        tipo: 'semanas',
        total: 8,
        prefijoId: 'tps',
        titulo: 'Semanas de Pascua'
    },
    santos: {
        tipo: 'meses',
        titulo: 'Fiestas de los Santos por Mes',
        meses: [
            { nombre: 'Enero', slug: 'enero' },
            { nombre: 'Febrero', slug: 'febrero' },
            { nombre: 'Marzo', slug: 'marzo' },
            { nombre: 'Abril', slug: 'abril' },
            { nombre: 'Mayo', slug: 'mayo' },
            { nombre: 'Junio', slug: 'junio' },
            { nombre: 'Julio', slug: 'julio' },
            { nombre: 'Agosto', slug: 'agosto' },
            { nombre: 'Septiembre', slug: 'septiembre' },
            { nombre: 'Octubre', slug: 'octubre' },
            { nombre: 'Noviembre', slug: 'noviembre' },
            { nombre: 'Diciembre', slug: 'diciembre' }
        ]
    },
    solemnidades: {
        tipo: 'solemnidades',
        titulo: 'Solemnidades',
        items: [
            { nombre: 'La Epifanía del Señor', id: 'epifania' },
            { nombre: 'Bautismo del Señor', id: 'bautismoLA' },
            { nombre: 'San José, Esposo de la Virgen María', id: 'sanjose' },
            { nombre: 'La Anunciación del Señor', id: 'anunciacion' },
            { nombre: 'La Santísima Trinidad', id: 'trinidad' },
            { nombre: 'El Santísimo Cuerpo y Sangre de Cristo (Corpus)', id: 'corpus' },
            { nombre: 'El Sagrado Corazón de Jesús', id: 'sagradocorazon' },
            { nombre: 'San Juan Bautista', id: 'juanbautista' },
            { nombre: 'San Pedro y San Pablo, Apóstoles', id: 'pedroypablo' },
            { nombre: 'La Asunción de la Virgen María', id: 'asuncion' },
            { nombre: 'Todos los Santos', id: 'todoslossantos' },
            { nombre: 'Jesucristo, Rey del Universo', id: 'cristorey' },
            { nombre: 'La Inmaculada Concepción', id: 'inmaculada' },
            { nombre: 'La Natividad del Señor', id: 'navidad' }
        ]
    }
};

// =========================================================
// PORTADA PRINCIPAL — Liturgia de las Horas
// =========================================================
function cargarPortada() {
    const infoHoy = obtenerInfoLiturgica();
    const tituloLiturgico = infoHoy.textoCompleto || "Tiempo Ordinario";
    const idSalmodia = infoHoy.id || "tos1lalu";

    // Mapeo de clase de color según el tiempo litúrgico de hoy
    const mapaClasesTiempo = {
        'Tiempo de Adviento': 'btn-adviento',
        'Tiempo de Navidad': 'btn-navidad',
        'Tiempo Ordinario': 'btn-ordinario',
        'Tiempo de Cuaresma': 'btn-cuaresma',
        'Tiempo Pascual': 'btn-pascua',
        'Tiempo de Pascua': 'btn-pascua',
        'Santos': 'btn-santos',
        'Solemnidades': 'btn-solemnidades'
    };

    let claseColorHoy = 'btn-ordinario';
    if (infoHoy.tiempo) {
        for (const [nombreT, clase] of Object.entries(mapaClasesTiempo)) {
            if (infoHoy.tiempo.toLowerCase().includes(nombreT.toLowerCase().replace('tiempo de ', '')) ||
                infoHoy.tiempo.toLowerCase().includes(nombreT.toLowerCase())) {
                claseColorHoy = clase;
                break;
            }
        }
    }

    app.innerHTML = `
        <div class="background-overlay"></div>
        
        <div class="portada-container">

            <h1 class="main-title">LITURGIA <span class="de-las">de las</span> HORAS</h1>

            <div class="logo-container">
                <img src="src/img/lh.jpg" class="db-mboton rounded-circle" alt="Liturgia de las Horas">
            </div>

            <!-- Título Litúrgico del día sobre Salmodia del Día -->
            <div class="portada-liturgia-titulo" id="liturgia-del-dia">
                ${tituloLiturgico}
            </div>

            <!-- ===== BOTÓN PRINCIPAL SALMODIA DEL DÍA ===== -->
            <div class="btn-group" style="margin: 8px 0 4px;">
                <button type="button" class="btn-pill ${claseColorHoy}" id="btn-salmodia-dia">
                    Salmodia del día
                    <span class="btn-pill-icon">
                        <span class="material-symbols-outlined" id="icono-salmodia">keyboard_arrow_down</span>
                    </span>
                </button>
            </div>

            <!-- ===== SUB-BOTONES DESPLEGABLES (Horas Litúrgicas) ===== -->
            <div class="sub-horas-container" id="sub-horas-lista">
                <a href="src/html/oficio.html?oficio=${idSalmodia}" class="btn-flat ${claseColorHoy}">
                    <span class="btn-flat-label">Oficio de Lectura</span>
                    <span class="btn-flat-icon"><span class="material-symbols-outlined">menu_book</span></span>
                </a>
                <a href="src/html/laudes.html?laudes=${idSalmodia}" class="btn-flat ${claseColorHoy}">
                    <span class="btn-flat-label">Laudes</span>
                    <span class="btn-flat-icon"><span class="material-symbols-outlined">wb_twilight</span></span>
                </a>
                <a href="src/html/tercia.html?tercia=${idSalmodia}" class="btn-flat ${claseColorHoy}">
                    <span class="btn-flat-label">Tercia</span>
                    <span class="btn-flat-icon"><span class="material-symbols-outlined">schedule</span></span>
                </a>
                <a href="src/html/sexta.html?sexta=${idSalmodia}" class="btn-flat ${claseColorHoy}">
                    <span class="btn-flat-label">Sexta</span>
                    <span class="btn-flat-icon"><span class="material-symbols-outlined">light_mode</span></span>
                </a>
                <a href="src/html/nona.html?nona=${idSalmodia}" class="btn-flat ${claseColorHoy}">
                    <span class="btn-flat-label">Nona</span>
                    <span class="btn-flat-icon"><span class="material-symbols-outlined">wb_sunny</span></span>
                </a>
                <a href="src/html/visperas.html?visperas=${idSalmodia}" class="btn-flat ${claseColorHoy}">
                    <span class="btn-flat-label">Víspera</span>
                    <span class="btn-flat-icon"><span class="material-symbols-outlined">wb_twilight</span></span>
                </a>
                <a href="src/html/completas.html?completas=${idSalmodia}" class="btn-flat ${claseColorHoy}">
                    <span class="btn-flat-label">Completas</span>
                    <span class="btn-flat-icon"><span class="material-symbols-outlined">bedtime</span></span>
                </a>
            </div>

            <!-- ===== BOTÓN LITURGIA DE LAS HORAS (Desplegable de todos los Tiempos Litúrgicos) ===== -->
            <div class="btn-group-column" style="margin: 8px 0 16px;">

                <button type="button" class="btn-icono btn-rojo" id="btn-liturgia-horas" style="margin-bottom: 4px;">
                    <span class="btn-icon-box">
                        <span class="material-symbols-outlined" id="icono-liturgia-horas">auto_stories</span>
                    </span>
                    <span class="btn-label">Liturgia de las Horas</span>
                </button>

                <!-- Sub-contenedor de todos los Tiempos Litúrgicos -->
                <div class="sub-tiempos-container" id="sub-tiempos-lista">

                    <!-- Adviento (4 semanas) -->
                    <button type="button" class="btn-icono btn-adviento" data-tiempo="adviento" style="margin-bottom: 8px;">
                        <span class="btn-icon-box">
                            <span class="material-symbols-outlined">flare</span>
                        </span>
                        <span class="btn-label">Adviento</span>
                    </button>
                    <div class="sub-acordeon" id="sub-tiempo-adviento"></div>

                    <!-- Navidad (2 semanas) -->
                    <button type="button" class="btn-icono btn-navidad" data-tiempo="navidad" style="margin-bottom: 8px;">
                        <span class="btn-icon-box">
                            <span class="material-symbols-outlined">star</span>
                        </span>
                        <span class="btn-label">Navidad</span>
                    </button>
                    <div class="sub-acordeon" id="sub-tiempo-navidad"></div>

                    <!-- Tiempo Ordinario (34 semanas) -->
                    <button type="button" class="btn-icono btn-ordinario" data-tiempo="ordinario" style="margin-bottom: 8px;">
                        <span class="btn-icon-box">
                            <span class="material-symbols-outlined">eco</span>
                        </span>
                        <span class="btn-label">Tiempo Ordinario</span>
                    </button>
                    <div class="sub-acordeon" id="sub-tiempo-ordinario"></div>

                    <!-- Cuaresma (7 semanas) -->
                    <button type="button" class="btn-icono btn-cuaresma" data-tiempo="cuaresma" style="margin-bottom: 8px;">
                        <span class="btn-icon-box">
                            <span class="material-symbols-outlined">church</span>
                        </span>
                        <span class="btn-label">Cuaresma</span>
                    </button>
                    <div class="sub-acordeon" id="sub-tiempo-cuaresma"></div>

                    <!-- Pascua (8 semanas) -->
                    <button type="button" class="btn-icono btn-pascua" data-tiempo="pascua" style="margin-bottom: 8px;">
                        <span class="btn-icon-box">
                            <span class="material-symbols-outlined">brightness_5</span>
                        </span>
                        <span class="btn-label">Pascua</span>
                    </button>
                    <div class="sub-acordeon" id="sub-tiempo-pascua"></div>

                    <!-- Santos (horizontal: 12 meses) -->
                    <button type="button" class="btn-icono btn-santos" data-tiempo="santos" style="margin-bottom: 8px;">
                        <span class="btn-icon-box">
                            <span class="material-symbols-outlined">workspace_premium</span>
                        </span>
                        <span class="btn-label">Santos</span>
                    </button>
                    <div class="sub-acordeon" id="sub-tiempo-santos"></div>

                    <!-- Solemnidades (vertical) -->
                    <button type="button" class="btn-icono btn-solemnidades" data-tiempo="solemnidades" style="margin-bottom: 8px;">
                        <span class="btn-icon-box">
                            <span class="material-symbols-outlined">auto_awesome</span>
                        </span>
                        <span class="btn-label">Solemnidades</span>
                    </button>
                    <div class="sub-acordeon" id="sub-tiempo-solemnidades"></div>

                </div>

            </div>

            <footer class="portada-footer">
                <p class="final-quote">Amad a vuestros enemigos</p>
                <p class="final-quote">Vengo pronto</p>
            </footer>

        </div>
    `;

    vincularEventos();
}

// =========================================================
// EVENTOS — Despliegue de horas y selección de tiempos
// =========================================================
function vincularEventos() {
    // 1. Salmodia del día (desplegable de horas)
    const btnSalmodia = document.getElementById('btn-salmodia-dia');
    const subHoras = document.getElementById('sub-horas-lista');
    const iconoSalmodia = document.getElementById('icono-salmodia');

    if (btnSalmodia && subHoras) {
        btnSalmodia.addEventListener('click', (e) => {
            e.preventDefault();
            const estaDesplegado = subHoras.classList.toggle('desplegado');
            if (iconoSalmodia) {
                iconoSalmodia.textContent = estaDesplegado ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
            }
        });
    }

    // 2. Botón Liturgia de las Horas (desplegable de tiempos litúrgicos)
    const btnLiturgiaHoras = document.getElementById('btn-liturgia-horas');
    const subTiempos = document.getElementById('sub-tiempos-lista');

    if (btnLiturgiaHoras && subTiempos) {
        btnLiturgiaHoras.addEventListener('click', (e) => {
            e.preventDefault();
            subTiempos.classList.toggle('desplegado');
        });
    }

    // 3. Botones individuales de cada Tiempo Litúrgico
    const botonesTiempo = document.querySelectorAll('[data-tiempo]');
    botonesTiempo.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tiempo = btn.getAttribute('data-tiempo');
            const contenedor = document.getElementById(`sub-tiempo-${tiempo}`);
            if (!contenedor) return;

            // Si ya está abierto, cerrarlo
            if (contenedor.classList.contains('desplegado')) {
                contenedor.classList.remove('desplegado');
                return;
            }

            // Cerrar otros acordeones abiertos
            document.querySelectorAll('.sub-acordeon.desplegado').forEach(el => {
                el.classList.remove('desplegado');
            });

            // Generar contenido dinámico según tipo si aún está vacío
            if (!contenedor.innerHTML.trim()) {
                const config = configuracionTiempos[tiempo];
                // Colores por tiempo litúrgico
                const coloresPorTiempo = {
                    adviento: '#7B2FBE',
                    navidad: '#8B0000',
                    ordinario: '#2E7D32',
                    cuaresma: '#4A0080',
                    pascua: '#0288D1',
                    santos: '#1565C0',
                    solemnidades: '#B71C1C'
                };
                const colorTiempo = coloresPorTiempo[tiempo] || '#2E7D32';
                contenedor.style.setProperty('--color-tiempo', colorTiempo);

                if (config.tipo === 'semanas') {
                    let htmlGrid = '<div class="sub-acordeon-grid">';
                    for (let i = 1; i <= config.total; i++) {
                        htmlGrid += `<button type="button" class="btn-sub-semana" data-semana="${i}" data-prefijo="${config.prefijoId}" title="Semana ${i}">${i}</button>`;
                    }
                    htmlGrid += '<div class="semana-horas-panel" id="panel-horas-' + tiempo + '" style="display:none;"></div>';
                    htmlGrid += '</div>';
                    contenedor.innerHTML = htmlGrid;

                    // Eventos para cada número de semana
                    const panelHoras = contenedor.querySelector('.semana-horas-panel');
                    const botonesSemanas = contenedor.querySelectorAll('.btn-sub-semana');

                    botonesSemanas.forEach((bSemana, index) => {
                        bSemana.addEventListener('click', (e) => {
                            e.preventDefault();
                            const numSem = bSemana.getAttribute('data-semana');
                            const pref = bSemana.getAttribute('data-prefijo');
                            const targetId = `${pref}${numSem}lalu`;

                            // Si ya está activo, ocultar panel
                            if (bSemana.classList.contains('activo')) {
                                bSemana.classList.remove('activo');
                                panelHoras.style.display = 'none';
                                panelHoras.innerHTML = '';
                                return;
                            }

                            // Desmarcar otros números
                            botonesSemanas.forEach(b => b.classList.remove('activo'));
                            bSemana.classList.add('activo');

                            // Ubicar el panel inmediatamente debajo de la fila del botón presionado (grilla de 6 columnas)
                            const columnas = 6;
                            const finFilaIndex = Math.min(Math.floor(index / columnas) * columnas + (columnas - 1), botonesSemanas.length - 1);
                            const botonFinFila = botonesSemanas[finFilaIndex];
                            botonFinFila.after(panelHoras);

                            // Generar las 7 horas para esa semana con el color litúrgico
                            panelHoras.innerHTML = `
                                <div class="semana-horas-panel-header">Semana ${numSem} — Horas Litúrgicas</div>
                                <div class="semana-horas-grid">
                                    <a href="src/html/oficio.html?oficio=${targetId}" class="btn-semana-hora">
                                        <span class="material-symbols-outlined">menu_book</span>
                                        <span>Oficio de Lectura</span>
                                    </a>
                                    <a href="src/html/laudes.html?laudes=${targetId}" class="btn-semana-hora">
                                        <span class="material-symbols-outlined">wb_twilight</span>
                                        <span>Laudes</span>
                                    </a>
                                    <a href="src/html/tercia.html?tercia=${targetId}" class="btn-semana-hora">
                                        <span class="material-symbols-outlined">schedule</span>
                                        <span>Tercia</span>
                                    </a>
                                    <a href="src/html/sexta.html?sexta=${targetId}" class="btn-semana-hora">
                                        <span class="material-symbols-outlined">light_mode</span>
                                        <span>Sexta</span>
                                    </a>
                                    <a href="src/html/nona.html?nona=${targetId}" class="btn-semana-hora">
                                        <span class="material-symbols-outlined">wb_sunny</span>
                                        <span>Nona</span>
                                    </a>
                                    <a href="src/html/visperas.html?visperas=${targetId}" class="btn-semana-hora">
                                        <span class="material-symbols-outlined">wb_twilight</span>
                                        <span>Vísperas</span>
                                    </a>
                                    <a href="src/html/completas.html?completas=${targetId}" class="btn-semana-hora">
                                        <span class="material-symbols-outlined">bedtime</span>
                                        <span>Completas</span>
                                    </a>
                                </div>
                            `;
                            panelHoras.style.display = 'flex';
                        });
                    });
                } else if (config.tipo === 'meses') {
                    let htmlMeses = '<div class="sub-acordeon-h">';
                    config.meses.forEach(m => {
                        htmlMeses += `<a href="src/html/añoliturgico.html?mes=${m.slug}" class="btn-sub-mes">${m.nombre}</a>`;
                    });
                    htmlMeses += '</div>';
                    contenedor.innerHTML = htmlMeses;
                } else if (config.tipo === 'solemnidades') {
                    let htmlSolem = '<div class="sub-acordeon-v">';
                    config.items.forEach(s => {
                        htmlSolem += `
                            <a href="src/html/laudes.html?laudes=${s.id}" class="btn-sub-solem">
                                <span class="material-symbols-outlined">auto_awesome</span>
                                <span>${s.nombre}</span>
                            </a>
                        `;
                    });
                    htmlSolem += '</div>';
                    contenedor.innerHTML = htmlSolem;
                }
            }

            // Abrir contenedor con animación
            contenedor.classList.add('desplegado');
        });
    });
}

// Arrancar la aplicación
cargarPortada();