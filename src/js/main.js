import { obtenerInfoLiturgica } from '../data/calendarioLiturgico.js';
import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';
import { obtenerParidadAño, obtenerCicloDominical } from './form_etiempo.js';
import { generarSecuenciaLiturgica } from './añoliturgico.js';

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

    // Obtener santo del día desde las asignaciones y catálogo
    let textoBotonSanto = "";
    let imagenBotonSanto = "";
    try {
        const fechaActual = new Date();
        const diaActual = fechaActual.getDate();
        const mesActual = fechaActual.getMonth() + 1;
        const claveDiaMes = `${diaActual}/${mesActual}`;
        const asignacionesSantos = JSON.parse(localStorage.getItem('lh_santos_calendario_anual')) || {};
        
        // Catálogo local y predeterminado
        let catalogo = [];
        try {
            catalogo = JSON.parse(localStorage.getItem('lh_catalogo_nombres_santos')) || [];
        } catch (_) {}
        if (!Array.isArray(catalogo)) catalogo = [];

        // Combinar catálogo predeterminado si no está en el local
        const mapaCatalogo = new Map();
        if (Array.isArray(catalogoSantosAnual)) {
            catalogoSantosAnual.forEach(s => {
                if (s && s.nombre) mapaCatalogo.set(s.nombre.toLowerCase().trim(), s);
            });
        }
        catalogo.forEach(s => {
            if (s && s.nombre) {
                const clave = s.nombre.toLowerCase().trim();
                const prev = mapaCatalogo.get(clave);
                mapaCatalogo.set(clave, prev ? { ...prev, ...s, imagen: s.imagen || prev.imagen || '' } : s);
            }
        });

        // Determinar si hoy es el primer domingo después del 6 de enero (Bautismo del Señor)
        const fechaBautismo = new Date(fechaActual.getFullYear(), 0, 7);
        while (fechaBautismo.getDay() !== 0) {
            fechaBautismo.setDate(fechaBautismo.getDate() + 1);
        }
        const claveBautismoHoy = `${fechaBautismo.getDate()}/${fechaBautismo.getMonth() + 1}`;

        // Determinar nombre del santo asignado o buscar por fecha en catálogo
        if (asignacionesSantos[claveDiaMes] && asignacionesSantos[claveDiaMes].trim()) {
            textoBotonSanto = asignacionesSantos[claveDiaMes].trim();
        } else if (claveDiaMes === claveBautismoHoy) {
            textoBotonSanto = "El Bautismo del Señor";
        } else {
            // Buscar si hay un santo cuya festividad coincida con hoy
            const santoPorFecha = Array.from(mapaCatalogo.values()).find(s => {
                if (!s) return false;
                if (s.fechaFestividad === claveDiaMes) return true;
                if (s.muerte && typeof s.muerte === 'string') {
                    const m = s.muerte.trim().match(/^(\d{1,2})[\/\-](\d{1,2})/);
                    if (m && parseInt(m[1], 10) === diaActual && parseInt(m[2], 10) === mesActual) return true;
                }
                return false;
            });
            if (santoPorFecha) {
                textoBotonSanto = santoPorFecha.nombre;
            } else {
                const mesesEsp = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
                textoBotonSanto = `${diaActual} de ${mesesEsp[fechaActual.getMonth()]}`;
            }
        }

        // Buscar imagen del santo
        if (textoBotonSanto) {
            const santoEncontrado = mapaCatalogo.get(textoBotonSanto.toLowerCase().trim());
            if (santoEncontrado) {
                window.santoDelDiaObjeto = santoEncontrado;
                if (santoEncontrado.imagen && santoEncontrado.imagen.trim()) {
                    let imgPath = santoEncontrado.imagen.trim();
                    // Si la ruta en el catálogo empieza con ../img/, en la raíz (index.html) es src/img/
                    if (imgPath.startsWith('../img/')) {
                        imgPath = 'src/' + imgPath.substring(3);
                    }
                    imagenBotonSanto = imgPath;
                }
            }
        }
    } catch (e) {
        console.warn("Error al resolver santo del día:", e);
        const f = new Date();
        textoBotonSanto = `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
    }

    const iconoBotonSantoHtml = imagenBotonSanto
        ? `<img src="${imagenBotonSanto}" alt="${textoBotonSanto}" class="img-santo-pill" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'material-symbols-outlined\\'>person</span>';">`
        : `<span class="material-symbols-outlined">person</span>`;

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

            <!-- ===== BOTONES PRINCIPALES: SALMODIA DEL DÍA (CON REPRODUCTOR DE EVANGELIO) Y SANTO DEL DÍA ===== -->
            <div class="btn-group" style="margin: 8px 0 4px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center;">
                <div class="btn-pill btn-pill-salmodia-wrapper ${claseColorHoy}" id="btn-salmodia-dia" style="cursor: pointer;" title="Desplegar Horas Litúrgicas">
                    <button type="button" class="btn-tts-portada btn-reproductor-evangelio" id="btn-reproductor-evangelio-dia" title="Escuchar Evangelio del día" onclick="event.preventDefault(); event.stopPropagation(); if(typeof window.toggleReproducirEvangelioPortada==='function') window.toggleReproducirEvangelioPortada();">
                        <svg class="tts-portada-circular-ring" viewBox="0 0 32 32">
                            <circle class="tts-portada-circular-bg" cx="16" cy="16" r="13.5"></circle>
                            <circle class="tts-portada-circular-bar" id="evangelio-portada-circular-bar" cx="16" cy="16" r="13.5"></circle>
                        </svg>
                        <span class="material-symbols-outlined" id="icono-reproductor-evangelio">play_arrow</span>
                    </button>
                    <span class="btn-salmodia-texto">Salmodia del día</span>
                    <span class="btn-pill-icon">
                        <span class="material-symbols-outlined" id="icono-salmodia">keyboard_arrow_down</span>
                    </span>
                </div>

                <a href="src/html/santo.html" class="btn-pill btn-santo" id="btn-santo-dia" title="Ver calendario de Santos">
                    <span class="btn-pill-icon">
                        ${iconoBotonSantoHtml}
                    </span>
                    <span class="btn-santo-texto">${textoBotonSanto}</span>
                    <button type="button" class="btn-tts-portada" id="btn-tts-portada-santo" title="Escuchar lectura de ${textoBotonSanto}" onclick="event.preventDefault(); event.stopPropagation(); if(typeof window.toggleLeerSantoPortada==='function') window.toggleLeerSantoPortada();">
                        <svg class="tts-portada-circular-ring" viewBox="0 0 32 32">
                            <circle class="tts-portada-circular-bg" cx="16" cy="16" r="13.5"></circle>
                            <circle class="tts-portada-circular-bar" id="tts-portada-circular-bar" cx="16" cy="16" r="13.5"></circle>
                        </svg>
                        <span class="material-symbols-outlined" id="icono-tts-portada">play_arrow</span>
                    </button>
                </a>
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

    // Actualizar icono con la imagen de IndexedDB si no estaba disponible sincrónicamente
    if (textoBotonSanto) {
        cargarImagenSantoDesdeIndexedDB(textoBotonSanto).then(imgSrc => {
            if (imgSrc) {
                const btnSantoIcon = document.querySelector('#btn-santo-dia .btn-pill-icon');
                if (btnSantoIcon) {
                    btnSantoIcon.innerHTML = `<img src="${imgSrc}" alt="${textoBotonSanto}" class="img-santo-pill" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'material-symbols-outlined\\'>person</span>';">`;
                }
            }
        });
    }
}

async function cargarImagenSantoDesdeIndexedDB(nombreSanto) {
    if (!window.indexedDB || !nombreSanto) return null;
    try {
        const db = await new Promise((resolve) => {
            const req = indexedDB.open('LH_Santos_DB', 2);
            req.onupgradeneeded = (e) => {
                const d = e.target.result;
                if (!d.objectStoreNames.contains('catalogo')) {
                    d.createObjectStore('catalogo');
                }
            };
            req.onsuccess = (e) => resolve(e.target.result);
            req.onerror = () => resolve(null);
        });
        if (!db || !db.objectStoreNames.contains('catalogo')) return null;
        const lista = await new Promise((resolve) => {
            try {
                const tx = db.transaction('catalogo', 'readonly');
                const req = tx.objectStore('catalogo').get('santos');
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => resolve(null);
            } catch (_) {
                resolve(null);
            }
        });
        if (Array.isArray(lista)) {
            const normalizar = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const claveBuscada = normalizar(nombreSanto);
            
            // 1. Coincidencia exacta o normalizada
            let encontrado = lista.find(s => s && s.nombre && normalizar(s.nombre) === claveBuscada);
            // 2. Coincidencia si contiene el término clave
            if (!encontrado && claveBuscada.length > 3) {
                encontrado = lista.find(s => s && s.nombre && (normalizar(s.nombre).includes(claveBuscada) || claveBuscada.includes(normalizar(s.nombre))));
            }

            if (encontrado && encontrado.imagen && encontrado.imagen.trim()) {
                let img = encontrado.imagen.trim();
                if (img.startsWith('../img/')) {
                    img = 'src/' + img.substring(3);
                }
                return img;
            }
        }
    } catch (e) {
        console.warn("Error leyendo imagen de IndexedDB en main.js:", e);
    }
    return null;
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
            if (e.target.closest('#btn-reproductor-evangelio-dia')) {
                return;
            }
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

// =========================================================
// REPRODUCTOR DEL EVANGELIO DEL DÍA (PORTADA)
// =========================================================
let audioEvangelioGlobal = null;
let evangelioEstaReproduciendo = false;

export function pausarEvangelioPortada() {
    if (audioEvangelioGlobal && !audioEvangelioGlobal.paused) {
        audioEvangelioGlobal.pause();
    }
    evangelioEstaReproduciendo = false;
    const btnEvangelio = document.getElementById('btn-reproductor-evangelio-dia');
    const iconoEvangelio = document.getElementById('icono-reproductor-evangelio');
    if (btnEvangelio) btnEvangelio.classList.remove('reproduciendo', 'speaking');
    if (iconoEvangelio) iconoEvangelio.textContent = 'play_arrow';
}
window.pausarEvangelioPortada = pausarEvangelioPortada;

export function resolverUrlEvangelioHoy() {
    const hoy = new Date();
    const y = hoy.getFullYear();
    const m = String(hoy.getMonth() + 1).padStart(2, '0');
    const d = String(hoy.getDate()).padStart(2, '0');
    const fechaISO = `${y}-${m}-${d}`;
    const esDomingo = (hoy.getDay() === 0);

    let catalogo = null;
    const guardado = localStorage.getItem(`lh-catalogo-liturgico-${y}`);
    if (guardado) {
        try { catalogo = JSON.parse(guardado); } catch (_) {}
    }
    if (!catalogo || !Array.isArray(catalogo)) {
        catalogo = generarSecuenciaLiturgica(y);
    }

    const itemHoy = catalogo.find(item => item.fecha === fechaISO);
    if (itemHoy) {
        if (esDomingo) {
            const ciclo = obtenerCicloDominical(y);
            if (ciclo === 'A' && itemHoy.urlEvangelioCicloA) return itemHoy.urlEvangelioCicloA;
            if (ciclo === 'B' && itemHoy.urlEvangelioCicloB) return itemHoy.urlEvangelioCicloB;
            if (ciclo === 'C' && itemHoy.urlEvangelioCicloC) return itemHoy.urlEvangelioCicloC;
            return itemHoy.urlEvangelioCicloA || itemHoy.urlEvangelioCicloB || itemHoy.urlEvangelioCicloC;
        } else {
            const esPar = (y % 2 === 0);
            if (esPar && itemHoy.urlEvangelioPar) return itemHoy.urlEvangelioPar;
            if (!esPar && itemHoy.urlEvangelioImpar) return itemHoy.urlEvangelioImpar;
            return itemHoy.urlEvangelioPar || itemHoy.urlEvangelioImpar;
        }
    }

    const nombresDias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const diaUrl = nombresDias[hoy.getDay()];
    if (esDomingo) {
        const ciclo = obtenerCicloDominical(y).toLowerCase();
        return `https://ev.resucito.do/to/1/domingo-${ciclo}.mp3`;
    } else {
        const sufijo = (y % 2 === 0) ? 'par' : 'impar';
        return `https://ev.resucito.do/to/1/${diaUrl}-${sufijo}.mp3`;
    }
}

export function toggleReproducirEvangelioPortada() {
    const btnEvangelio = document.getElementById('btn-reproductor-evangelio-dia');
    const iconoEvangelio = document.getElementById('icono-reproductor-evangelio');
    const ringBar = document.getElementById('evangelio-portada-circular-bar');

    if (!audioEvangelioGlobal) {
        audioEvangelioGlobal = new Audio();

        audioEvangelioGlobal.addEventListener('timeupdate', () => {
            if (audioEvangelioGlobal.duration && ringBar) {
                const progreso = audioEvangelioGlobal.currentTime / audioEvangelioGlobal.duration;
                const offset = 84.82 * (1 - progreso);
                ringBar.style.strokeDashoffset = offset;
            }
        });

        audioEvangelioGlobal.addEventListener('ended', () => {
            evangelioEstaReproduciendo = false;
            if (btnEvangelio) btnEvangelio.classList.remove('reproduciendo', 'speaking');
            if (iconoEvangelio) iconoEvangelio.textContent = 'play_arrow';
            if (ringBar) ringBar.style.strokeDashoffset = '84.82';
        });

        audioEvangelioGlobal.addEventListener('error', (e) => {
            console.error("Error al cargar audio del evangelio:", e);
            evangelioEstaReproduciendo = false;
            if (btnEvangelio) btnEvangelio.classList.remove('reproduciendo', 'speaking');
            if (iconoEvangelio) iconoEvangelio.textContent = 'play_arrow';
            alert("No se encontró el archivo de audio para el Evangelio del día de hoy.");
        });
    }

    if (evangelioEstaReproduciendo) {
        audioEvangelioGlobal.pause();
        evangelioEstaReproduciendo = false;
        if (btnEvangelio) btnEvangelio.classList.remove('reproduciendo', 'speaking');
        if (iconoEvangelio) iconoEvangelio.textContent = 'play_arrow';
    } else {
        // Pausar audio del santo si estuviera activo
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            const btnSanto = document.getElementById('btn-tts-portada-santo');
            const iconoSanto = document.getElementById('icono-tts-portada');
            if (btnSanto) btnSanto.classList.remove('speaking', 'cargando-tts');
            if (iconoSanto) iconoSanto.textContent = 'play_arrow';
        }

        const urlEvangelio = resolverUrlEvangelioHoy();
        if (!urlEvangelio) {
            alert("No hay una URL configurada para el Evangelio de hoy.");
            return;
        }

        if (audioEvangelioGlobal.src !== urlEvangelio) {
            audioEvangelioGlobal.src = urlEvangelio;
        }

        audioEvangelioGlobal.play().then(() => {
            evangelioEstaReproduciendo = true;
            if (btnEvangelio) btnEvangelio.classList.add('reproduciendo', 'speaking');
            if (iconoEvangelio) iconoEvangelio.textContent = 'pause';
        }).catch(err => {
            console.error("Error reproduciendo audio del evangelio:", err);
            alert("No se pudo iniciar la reproducción del Evangelio.");
        });
    }
}
window.toggleReproducirEvangelioPortada = toggleReproducirEvangelioPortada;