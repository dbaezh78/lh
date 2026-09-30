/**
 * lectura-manager.js
 * Controlador del Gestor de Lecturas del Oficio (lectura.html)
 * 
 * Gestiona 1ª Lecturas (Año Par / Impar) y 2ª Lecturas Patrísticas con sus Responsorios (*).
 * Precarga el catálogo canónico desde src/data/db-lecturas.js
 * Sincroniza con localStorage ('lh_lecturas_cache') y Firebase Firestore ('lecturas_oficio').
 */

import { CATALOGO_LECTURAS_SEED } from '../data/db-lecturas.js';
import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';
import { inicializarSearchableSantoSelect } from './searchable-santo.js';

let listaLecturas = [];
let editandoId = null;

// Obtener catálogo completo de santos
function obtenerCatalogoSantos() {
    try {
        const raw = localStorage.getItem('lh_catalogo_nombres_santos');
        if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list) && list.length > 0) return list;
        }
    } catch (_) {}
    return (typeof catalogoSantosAnual !== 'undefined' && Array.isArray(catalogoSantosAnual)) ? catalogoSantosAnual : [];
}

// Extrae día y mes de la fecha de celebración de un santo
function extraerDiaMesCelebracion(santo) {
    if (!santo) return { dia: '01', mes: '01', texto: '01/01' };
    const raw = (santo.celebracion || santo.fechaFestividad || '').trim();
    const mIso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (mIso) {
        const dia = String(mIso[3]).padStart(2, '0');
        const mes = String(mIso[2]).padStart(2, '0');
        return { dia, mes, texto: `${dia}/${mes}` };
    }
    const mSlash = raw.match(/^(\d{1,2})\/(\d{1,2})/);
    if (mSlash) {
        const dia = String(mSlash[1]).padStart(2, '0');
        const mes = String(mSlash[2]).padStart(2, '0');
        return { dia, mes, texto: `${dia}/${mes}` };
    }
    if (santo.dia && santo.mes) {
        const dia = String(santo.dia).padStart(2, '0');
        const mes = String(santo.mes).padStart(2, '0');
        return { dia, mes, texto: `${dia}/${mes}` };
    }
    return { dia: '01', mes: '01', texto: raw || '—' };
}

// Genera slug normalizado para ID de santo
function generarSlugSanto(nombre) {
    if (!nombre) return '';
    return nombre
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

// Genera el ID canónico de santo
function generarIdSanto(santo) {
    if (!santo) return 'sa0101santamaria';
    const { dia, mes } = extraerDiaMesCelebracion(santo);
    const slug = generarSlugSanto(santo.nombre);
    return `sa${dia}${mes}${slug}`;
}

// Actualiza las opciones de Tipo de Lectura, Semanas / Santos y visibilidad de Día de la Semana
function actualizarModoTiempo(valorPrevioSemana = null, valorPrevioTipo = null) {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const lblSemana = document.getElementById('lbl-form-semana');
    const grupoDia = document.getElementById('grupo-dia');
    const gridTiempo = document.getElementById('grid-tiempo-semana-dia');
    const selTipo = document.getElementById('form-tipo');

    if (!selSemana) return;

    if (tiempo === 'santos') {
        // En santos no se distingue año par o impar: sólo 1ª Lectura o 2ª Lectura
        if (selTipo) {
            const tipoDeseado = valorPrevioTipo || (selTipo.value.startsWith('lectura1') ? 'lectura1' : 'lectura2');
            selTipo.innerHTML = `
                <option value="lectura1">1ª Lectura Bíblica</option>
                <option value="lectura2">2ª Lectura Patrística</option>
            `;
            if (tipoDeseado === 'lectura2') {
                selTipo.value = 'lectura2';
            } else {
                selTipo.value = 'lectura1';
            }
        }

        if (lblSemana) lblSemana.textContent = 'Santo / Celebración:';
        if (grupoDia) grupoDia.style.display = 'none';
        if (gridTiempo) gridTiempo.classList.add('modo-santos');

        const santos = obtenerCatalogoSantos();
        const listaOrdenada = [...santos].sort((a, b) => {
            return (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' });
        });

        selSemana.innerHTML = '';
        listaOrdenada.forEach(s => {
            const idSanto = generarIdSanto(s);
            const { texto: fechaTexto } = extraerDiaMesCelebracion(s);
            const opt = document.createElement('option');
            opt.value = idSanto;
            opt.textContent = `${s.nombre} (${fechaTexto})`;
            opt.setAttribute('data-nombre', s.nombre);
            opt.setAttribute('data-fecha', fechaTexto);
            selSemana.appendChild(opt);
        });

        if (valorPrevioSemana && Array.from(selSemana.options).some(o => o.value === valorPrevioSemana)) {
            selSemana.value = valorPrevioSemana;
        } else if (selSemana.options.length > 0) {
            selSemana.selectedIndex = 0;
        }

        // Activar buscador interactivo tipo santo.html
        inicializarSearchableSantoSelect(selSemana, {
            placeholder: 'Buscar santo...',
            onChange: () => {
                recordarParametros();
                manejarCambioParametros();
            }
        });
        if (selSemana._customSantoContainer) {
            selSemana._customSantoContainer.style.display = 'block';
        }
    } else {
        // Tiempos litúrgicos estándar: restaurar Año Par / Impar / Patrística
        if (selTipo) {
            const tipoDeseado = valorPrevioTipo || selTipo.value || 'lectura1_par';
            selTipo.innerHTML = `
                <option value="lectura1_par">1ª Lectura — Año Par</option>
                <option value="lectura1_impar">1ª Lectura — Año Impar</option>
                <option value="lectura2">2ª Lectura — Patrística</option>
            `;
            if (tipoDeseado === 'lectura2') {
                selTipo.value = 'lectura2';
            } else if (tipoDeseado === 'lectura1_impar') {
                selTipo.value = 'lectura1_impar';
            } else {
                selTipo.value = 'lectura1_par';
            }
        }

        if (lblSemana) lblSemana.textContent = 'Semana:';
        if (grupoDia) grupoDia.style.display = '';
        if (gridTiempo) gridTiempo.classList.remove('modo-santos');

        if (selSemana._customSantoContainer) {
            selSemana._customSantoContainer.style.display = 'none';
        }
        selSemana.style.display = 'block';

        let maxSemanas = 34;
        if (tiempo === 'adviento') maxSemanas = 4;
        else if (tiempo === 'navidad') maxSemanas = 2;
        else if (tiempo === 'cuaresma') maxSemanas = 7;
        else if (tiempo === 'pascua') maxSemanas = 7;

        selSemana.innerHTML = '';
        for (let i = 1; i <= maxSemanas; i++) {
            const opt = document.createElement('option');
            opt.value = String(i);
            opt.textContent = `Semana ${i}`;
            selSemana.appendChild(opt);
        }

        if (valorPrevioSemana && Array.from(selSemana.options).some(o => o.value === String(valorPrevioSemana))) {
            selSemana.value = String(valorPrevioSemana);
        } else {
            selSemana.selectedIndex = 0;
        }
    }
}

// Guardar y restaurar parámetros litúrgicos seleccionados
function recordarParametros() {
    try {
        const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
        const selSem = document.getElementById('form-semana');
        const semana = selSem?.value || '1';
        const optSanto = (tiempo === 'santos') ? selSem?.selectedOptions[0] : null;
        const santoId = (tiempo === 'santos') ? (optSanto?.value || semana) : '';
        const santoNombre = (tiempo === 'santos') ? (optSanto?.getAttribute('data-nombre') || optSanto?.textContent || '') : '';
        const dia = document.getElementById('form-dia')?.value || 'domingo';
        const tipo = document.getElementById('form-tipo')?.value || 'lectura1_par';

        const params = { tiempo, semana, santoId, santoNombre, dia, tipo, libro: 'oficio' };
        localStorage.setItem('lh_lectura_ultimos_parametros', JSON.stringify(params));
        localStorage.setItem('lh_parametros_liturgicos_compartidos', JSON.stringify(params));
    } catch (_) {}
}

function restaurarParametros() {
    try {
        const raw = localStorage.getItem('lh_lectura_ultimos_parametros') || localStorage.getItem('lh_parametros_liturgicos_compartidos');
        if (!raw) return;
        const p = JSON.parse(raw);
        if (!p) return;

        const selTiempo = document.getElementById('form-tiempo');
        if (selTiempo && p.tiempo) {
            selTiempo.value = p.tiempo;
            actualizarModoTiempo(p.santoId || p.semana, p.tipo);
        }
        const selSemana = document.getElementById('form-semana');
        if (selSemana && (p.santoId || p.semana)) {
            const val = p.santoId || p.semana;
            if (Array.from(selSemana.options).some(o => o.value === val)) {
                selSemana.value = val;
            }
        }
        if (p.tiempo !== 'santos') {
            const selDia = document.getElementById('form-dia');
            if (selDia && p.dia) selDia.value = p.dia;
        }
        const selTipo = document.getElementById('form-tipo');
        if (selTipo && p.tipo) {
            if (Array.from(selTipo.options).some(o => o.value === p.tipo)) {
                selTipo.value = p.tipo;
            }
        }
    } catch (_) {}
}

document.addEventListener('DOMContentLoaded', async () => {
    actualizarModoTiempo();
    restaurarParametros();
    configurarEventos();
    await cargarDatos();
    renderizarLista();
    manejarCambioParametros();
});

// Mostrar notificaciones en la interfaz
function mostrarBannerEstado(mensaje, tipo = 'info') {
    const banner = document.getElementById('banner-estado');
    if (!banner) return;
    banner.className = `estado-banner ${tipo}`;
    banner.innerHTML = `<span class="material-symbols-outlined">${tipo === 'exito' ? 'check_circle' : tipo === 'alerta' ? 'warning' : 'info'}</span> ${mensaje}`;
    banner.style.display = 'flex';

    if (tipo === 'exito') {
        setTimeout(() => {
            banner.style.display = 'none';
        }, 3500);
    }
}

// Cargar datos: Firestore -> localStorage -> Semilla canónica
async function cargarDatos() {
    mostrarBannerEstado('Cargando catálogo de lecturas...', 'info');

    // 1. Probar desde Firestore
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "lecturas_oficio"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 2) {
                    listaLecturas = desdeFb;
                    localStorage.setItem('lh_lecturas_cache', JSON.stringify(listaLecturas));
                    mostrarBannerEstado(`✅ Se cargaron ${listaLecturas.length} lecturas desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para lecturas:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_lecturas_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 2) {
                listaLecturas = parsed;
                mostrarBannerEstado(`📂 Cargadas ${listaLecturas.length} lecturas desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback a semilla canónica
    if (Array.isArray(CATALOGO_LECTURAS_SEED) && CATALOGO_LECTURAS_SEED.length > 0) {
        listaLecturas = [...CATALOGO_LECTURAS_SEED];
        localStorage.setItem('lh_lecturas_cache', JSON.stringify(listaLecturas));
        mostrarBannerEstado(`✨ Cargadas las ${listaLecturas.length} lecturas canónicas desde el catálogo base.`, 'exito');
        return;
    }

    listaLecturas = [];
    mostrarBannerEstado('No hay lecturas registradas. Agrega una nueva con el formulario.', 'alerta');
}

// Configurar listeners de la interfaz
function configurarEventos() {
    // Restaurar semilla
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_LECTURAS_SEED) || CATALOGO_LECTURAS_SEED.length === 0) {
            alert('El catálogo base de lecturas no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer las ${CATALOGO_LECTURAS_SEED.length} lecturas originales del catálogo base?`)) return;
        listaLecturas = [...CATALOGO_LECTURAS_SEED];
        localStorage.setItem('lh_lecturas_cache', JSON.stringify(listaLecturas));
        renderizarLista();
        limpiarFormulario();
        mostrarBannerEstado(`🔄 Se restauraron las ${listaLecturas.length} lecturas del catálogo base.`, 'exito');
    });

    // Subir a Firebase
    document.getElementById('btn-subir-semilla')?.addEventListener('click', subirAFirebase);

    // Exportar JSON
    document.getElementById('btn-exportar-json')?.addEventListener('click', () => {
        if (listaLecturas.length === 0) {
            alert('No hay lecturas para exportar.');
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaLecturas, null, 2));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", `lecturas_oficio_lh_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
        mostrarBannerEstado('💾 Respaldo JSON descargado correctamente.', 'exito');
    });

    // Formulario guardar y cancelar
    document.getElementById('form-lectura')?.addEventListener('submit', guardarLectura);
    document.getElementById('btn-limpiar-form')?.addEventListener('click', limpiarFormulario);

    // Detección y distribución automática al pegar o escribir en Respuesta Inicial
    const inputR1 = document.getElementById('form-resp-r1');
    const inputR2 = document.getElementById('form-resp-r2');

    inputR1?.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.includes('*')) {
            const partes = val.split('*');
            const antes = partes[0].trim();
            const despues = partes.slice(1).join('*').trim();
            if (despues) {
                e.target.value = antes;
                if (inputR2) {
                    inputR2.value = despues;
                }
            }
        }
        actualizarLivePreview();
    });

    inputR2?.addEventListener('input', () => {
        actualizarLivePreview();
    });

    // Cambio de tiempo litúrgico
    document.getElementById('form-tiempo')?.addEventListener('change', () => {
        actualizarModoTiempo();
        recordarParametros();
        manejarCambioParametros();
    });

    // Auto-generación de ID, URL de audio y búsqueda de datos existentes al modificar selects
    ['form-tipo', 'form-semana', 'form-dia'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            recordarParametros();
            manejarCambioParametros();
        });
    });

    // Inputs que refrescan la vista previa
    const inputs = [
        'form-id', 'form-tipo', 'form-cita', 'form-desc', 'form-texto',
        'form-resp-cita', 'form-resp-r1', 'form-resp-v', 'form-resp-r2'
    ];
    inputs.forEach(id => {
        document.getElementById(id)?.addEventListener('input', actualizarLivePreview);
    });

    // Filtros de tabla
    document.getElementById('filtro-busqueda')?.addEventListener('input', renderizarLista);
    document.getElementById('filtro-tiempo')?.addEventListener('change', renderizarLista);
    document.getElementById('filtro-dia')?.addEventListener('change', renderizarLista);
    document.getElementById('filtro-tipo')?.addEventListener('change', renderizarLista);
}

// Búsqueda inteligente de lectura existente por ID directo, normalizado o combinación litúrgica
function buscarLecturaExistente(idBuscado, tipo, tiempo, semana, dia) {
    if (!listaLecturas || listaLecturas.length === 0) return null;

    const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const idNorm = norm(idBuscado);

    // 1. Por ID directo o normalizado
    let m = listaLecturas.find(x => x.id === idBuscado || norm(x.id) === idNorm);
    if (m) return m;

    if (tiempo === 'santos') {
        m = listaLecturas.find(x => {
            return x.tiempo === 'santos' &&
                   (x.semana === semana || norm(x.id).includes(norm(semana))) &&
                   (x.tipo === tipo || (tipo === 'lectura1' && x.tipo?.startsWith('lectura1')));
        });
        if (m) return m;
    } else {
        // 2. Equivalencia con IDs de semilla canónica
        const semNum = parseInt(semana, 10);
        const idLegacy1 = `${norm(tiempo)}${semNum}of${norm(dia)}_${norm(tipo)}`.replace('lectura', 'lec');
        const idLegacy2 = `${norm(tiempo)}${semNum}${norm(dia)}of_${norm(tipo)}`.replace('lectura', 'lec');
        m = listaLecturas.find(x => {
            const nx = norm(x.id);
            return nx === norm(idLegacy1) || nx === norm(idLegacy2);
        });
        if (m) return m;

        // 3. Por combinación exacta de atributos
        m = listaLecturas.find(x => {
            const tItem = norm(x.tiempo);
            const tSel = norm(tiempo);
            const tipoMatch = x.tipo === tipo;
            const semMatch = Number(x.semana) === Number(semana);
            const diaMatch = norm(x.dia) === norm(dia);
            const tiempoMatch = (tItem === tSel) ||
                                (tSel === 'ordinario' && (tItem === 'to' || tItem === 'ordinario')) ||
                                (tSel === 'adviento' && (tItem === 'ta' || tItem === 'adviento')) ||
                                (tSel === 'navidad' && (tItem === 'tn' || tItem === 'navidad')) ||
                                (tSel === 'cuaresma' && (tItem === 'tc' || tItem === 'cuaresma')) ||
                                (tSel === 'pascua' && (tItem === 'tp' || tItem === 'pascua'));
            return tipoMatch && semMatch && diaMatch && tiempoMatch;
        });
        if (m) return m;
    }

    return null;
}

// Calcular ID, Audio URL y buscar lectura existente o dejar lienzo en blanco
function manejarCambioParametros() {
    const tipo = document.getElementById('form-tipo')?.value || 'lectura1_par';
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const semanaSel = document.getElementById('form-semana');
    const semana = semanaSel?.value || '1';
    const dia = (tiempo === 'santos') ? '' : (document.getElementById('form-dia')?.value || 'domingo');

    let idGenerado = '';
    let tituloGenerado = '';
    let epigrafe = (tipo === 'lectura2') ? 'SEGUNDA LECTURA' : 'PRIMERA LECTURA';
    let audioUrlGenerada = '';

    if (tiempo === 'santos') {
        const optSanto = semanaSel?.selectedOptions[0];
        const nombreSanto = optSanto ? (optSanto.getAttribute('data-nombre') || optSanto.textContent) : 'Santo';
        const fechaSanto = optSanto ? optSanto.getAttribute('data-fecha') : '';
        const idSanto = semana || 'sa0101santo';
        const sufLectura = (tipo === 'lectura2') ? 'of_lect2' : 'of_lect1';

        idGenerado = `${idSanto}${sufLectura}`;
        const tipoLabel = (tipo === 'lectura2') ? '2ª Lectura Patrística' : '1ª Lectura Bíblica';
        tituloGenerado = `${tipoLabel} - ${nombreSanto}${fechaSanto ? ' (' + fechaSanto + ')' : ''}`;
        audioUrlGenerada = '';
    } else {
        const tMap = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp' };
        const dMap = { domingo: 'do', lunes: 'lu', martes: 'ma', miercoles: 'mi', jueves: 'ju', viernes: 'vi', sabado: 'sa' };

        const tiempoCod = tMap[tiempo] || 'to';
        const semanaPadded = `s${String(semana).padStart(2, '0')}`;
        const diaCod = dMap[dia] || 'do';

        let tipoSuffix = '_lect1par';
        let tipoNombre = '1ª Lectura (Año Par)';
        let audioArchivo = 'lectura2.mp3';

        if (tipo === 'lectura1_impar') {
            tipoSuffix = '_lect1impar';
            tipoNombre = '1ª Lectura (Año Impar)';
            audioArchivo = 'lectura1.mp3';
        } else if (tipo === 'lectura2') {
            tipoSuffix = '_lect2';
            tipoNombre = '2ª Lectura Patrística';
            audioArchivo = 'lecturas.mp3';
        }

        idGenerado = `${tiempoCod}${semanaPadded}${diaCod}of${tipoSuffix}`;
        const subdominio = tiempoCod;
        audioUrlGenerada = `https://${subdominio}.resucito.do/${semanaPadded}/${dia}/${audioArchivo}`;

        const diaNombre = dia.charAt(0).toUpperCase() + dia.slice(1);
        tituloGenerado = `${tipoNombre} - ${diaNombre} Semana ${semana}`;
    }

    // Buscar si ya existe una lectura para esta combinación
    const lecturaExistente = buscarLecturaExistente(idGenerado, tipo, tiempo, semana, dia);

    const inputId = document.getElementById('form-id');
    const inputTitulo = document.getElementById('form-titulo');
    const inputEpigrafe = document.getElementById('form-epigrafe');
    const inputCita = document.getElementById('form-cita');
    const inputDesc = document.getElementById('form-desc');
    const inputTexto = document.getElementById('form-texto');
    const inputRespCita = document.getElementById('form-resp-cita');
    const inputRespR1 = document.getElementById('form-resp-r1');
    const inputRespV = document.getElementById('form-resp-v');
    const inputRespR2 = document.getElementById('form-resp-r2');
    const inputAudio = document.getElementById('form-audio-url');
    const tituloForm = document.getElementById('titulo-formulario');
    const btnGuardar = document.getElementById('btn-guardar-texto');

    if (lecturaExistente) {
        // Cargar lectura existente encontrada
        editandoId = lecturaExistente.id;
        if (inputId) inputId.value = lecturaExistente.id;
        if (inputTitulo) inputTitulo.value = lecturaExistente.titulo || tituloGenerado;
        if (inputEpigrafe) inputEpigrafe.value = lecturaExistente.epigrafeTipo || lecturaExistente.epigrafe || epigrafe;
        if (inputCita) inputCita.value = lecturaExistente.cita || '';
        if (inputDesc) inputDesc.value = lecturaExistente.descripcion || '';
        if (inputTexto) inputTexto.value = lecturaExistente.texto || '';
        let r1 = lecturaExistente.respR1 || lecturaExistente.responsorio?.r1 || '';
        let r2 = lecturaExistente.respR2 || lecturaExistente.responsorio?.r2 || '';
        let v = lecturaExistente.respV || lecturaExistente.responsorio?.v || '';

        if (lecturaExistente.respR1_inicial) {
            r1 = lecturaExistente.respR1_inicial;
        } else if (r1.includes('*')) {
            const partes = r1.split('*');
            r1 = partes[0].trim();
            if (!r2 && partes[1]) {
                r2 = partes[1].trim();
            }
        }

        if (inputRespCita) inputRespCita.value = lecturaExistente.respCita || lecturaExistente.responsorio?.cita || '';
        if (inputRespR1) inputRespR1.value = r1;
        if (inputRespV) inputRespV.value = v;
        if (inputRespR2) inputRespR2.value = r2;
        if (inputAudio) inputAudio.value = lecturaExistente.audioUrl || audioUrlGenerada;

        if (tituloForm) {
            tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-gold);">edit</span> Editando: ${lecturaExistente.id}`;
        }
        if (btnGuardar) {
            btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Actualizar Lectura`;
        }
        mostrarBannerEstado(`📖 Lectura existente cargada (${lecturaExistente.id}). Puedes modificarla o guardar cambios.`, 'info');
    } else {
        // Lienzo en blanco para nueva lectura
        editandoId = null;
        if (inputId) inputId.value = idGenerado;
        if (inputTitulo) inputTitulo.value = tituloGenerado;
        if (inputEpigrafe) inputEpigrafe.value = epigrafe;
        if (inputCita) inputCita.value = '';
        if (inputDesc) inputDesc.value = '';
        if (inputTexto) inputTexto.value = '';
        if (inputRespCita) inputRespCita.value = '';
        if (inputRespR1) inputRespR1.value = '';
        if (inputRespV) inputRespV.value = '';
        if (inputRespR2) inputRespR2.value = '';
        if (inputAudio) inputAudio.value = audioUrlGenerada;

        if (tituloForm) {
            tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-red);">edit_note</span> Nueva Lectura`;
        }
        if (btnGuardar) {
            btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Guardar Lectura`;
        }
    }

    actualizarLivePreview();
}

// Actualizar vista previa en tiempo real
function actualizarLivePreview() {
    const id = document.getElementById('form-id')?.value || 'tos1OFdo_lec1_par';
    const epigrafe = document.getElementById('form-epigrafe')?.value.trim() || 'PRIMERA LECTURA';
    const cita = document.getElementById('form-cita')?.value.trim() || 'Del libro del profeta Isaías 42, 1-9; 49, 1-9';
    const desc = document.getElementById('form-desc')?.value.trim() || 'EL SIERVO HUMILDE DEL SEÑOR ES LA LUZ DE LAS NACIONES';
    const texto = document.getElementById('form-texto')?.value.trim() || '';
    const respCita = document.getElementById('form-resp-cita')?.value.trim() || 'Cf. Mt 3, 16. 17; Lc 3, 22';
    const respR1 = document.getElementById('form-resp-r1')?.value.trim() || '';
    const respV = document.getElementById('form-resp-v')?.value.trim() || '';
    const respR2 = document.getElementById('form-resp-r2')?.value.trim() || '';

    const badge = document.getElementById('preview-id-badge');
    if (badge) badge.textContent = id;

    const elEpigrafe = document.getElementById('preview-epigrafe');
    if (elEpigrafe) elEpigrafe.textContent = epigrafe;

    const elCita = document.getElementById('preview-cita');
    if (elCita) elCita.innerHTML = cita.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');

    const elDesc = document.getElementById('preview-desc');
    if (elDesc) elDesc.textContent = desc;

    const elTexto = document.getElementById('preview-texto');
    if (elTexto) elTexto.textContent = texto;

    const elRespCita = document.getElementById('preview-resp-cita');
    if (elRespCita) elRespCita.textContent = respCita;

    // Responsorio R1 con asterisco rojo y respuesta complementaria
    const elRespR1 = document.getElementById('preview-resp-r1');
    if (elRespR1) {
        if (!respR1 && !respR2) {
            elRespR1.innerHTML = '';
        } else if (respR1.includes('*')) {
            const r1Formateado = respR1.replace(/\*/g, '<span class="asterisco-rojo">*</span>');
            elRespR1.innerHTML = `<span class="rubrica-roja">R.</span> <span class="texto-resp">${r1Formateado}</span>`;
        } else if (respR2) {
            elRespR1.innerHTML = `<span class="rubrica-roja">R.</span> <span class="texto-resp">${respR1} <span class="asterisco-rojo">*</span> ${respR2}</span>`;
        } else {
            elRespR1.innerHTML = `<span class="rubrica-roja">R.</span> <span class="texto-resp">${respR1}</span>`;
        }
    }

    const elRespV = document.getElementById('preview-resp-v');
    if (elRespV) {
        elRespV.innerHTML = respV ? `<span class="rubrica-roja">V.</span> <span class="texto-resp">${respV}</span>` : '';
    }

    const elRespR2 = document.getElementById('preview-resp-r2');
    if (elRespR2) {
        elRespR2.innerHTML = respR2 ? `<span class="rubrica-roja">R.</span> <span class="texto-resp">${respR2}</span>` : '';
    }
}

// Renderizar tabla
function renderizarLista() {
    const cuerpo = document.getElementById('cuerpo-tabla-lecturas');
    const contador = document.getElementById('contador-lecturas');
    if (!cuerpo) return;

    const query = (document.getElementById('filtro-busqueda')?.value || '').toLowerCase().trim();
    const fTiempo = document.getElementById('filtro-tiempo')?.value || 'todos';
    const fDia = document.getElementById('filtro-dia')?.value || 'todos';
    const fTipo = document.getElementById('filtro-tipo')?.value || 'todos';

    const filtrados = listaLecturas.filter(item => {
        if (fTiempo !== 'todos' && item.tiempo !== fTiempo) return false;
        if (fDia !== 'todos' && item.tiempo !== 'santos' && item.dia !== fDia) return false;
        if (fTipo !== 'todos' && item.tipo !== fTipo) return false;
        if (!query) return true;

        const idMatch = (item.id || '').toLowerCase().includes(query);
        const titMatch = (item.titulo || '').toLowerCase().includes(query);
        const citaMatch = (item.cita || '').toLowerCase().includes(query);
        const descMatch = (item.descripcion || '').toLowerCase().includes(query);
        const txtMatch = (item.texto || '').toLowerCase().includes(query);
        const santoMatch = (item.santoNombre || item.nombreSanto || '').toLowerCase().includes(query);

        let dateMatch = false;
        const rawFecha = item.fechaCelebracion || item.fecha || '';
        let mF = rawFecha.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
        if (!mF) mF = (item.id || '').match(/^sa(\d{2})(\d{2})/i);
        if (!mF) mF = (item.titulo || '').match(/\((\d{1,2})[\/\-](\d{1,2})\)/);
        if (mF) {
            const dd = String(parseInt(mF[1], 10)).padStart(2, '0');
            const mm = String(parseInt(mF[2], 10)).padStart(2, '0');
            const d = String(parseInt(mF[1], 10));
            const m = String(parseInt(mF[2], 10));
            const variantes = [`${dd}/${mm}`, `${d}/${m}`, `${d}/${mm}`, `${dd}/${m}`, `${dd}-${mm}`, `${d}-${m}`, `${dd}${mm}`];
            dateMatch = variantes.some(v => v.includes(query) || query.includes(v));
        }

        return idMatch || titMatch || citaMatch || descMatch || txtMatch || santoMatch || dateMatch;
    });

    if (contador) {
        contador.textContent = `(${filtrados.length} de ${listaLecturas.length})`;
    }

    if (filtrados.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 24px;">No se encontraron lecturas con los filtros seleccionados.</td></tr>`;
        return;
    }

    cuerpo.innerHTML = filtrados.map(item => {
        const esActivo = editandoId === item.id ? 'class="fila-activa"' : '';
        let colDiaSem = '';
        if (item.tiempo === 'santos') {
            const labelSanto = item.santoNombre || item.nombreSanto || item.semana || 'Santo / Fiesta';
            colDiaSem = `<span style="display: inline-block; padding: 2px 7px; border-radius: 10px; font-size: 0.76rem; background: #e0f2fe; color: #0369a1; font-weight: 600;">😇 ${labelSanto}</span>`;
        } else {
            const diaNombre = (item.dia || '').charAt(0).toUpperCase() + (item.dia || '').slice(1);
            colDiaSem = `${diaNombre} (Sem. ${item.semana || '1'})`;
        }

        const tipoLabel = item.tipo === 'lectura2' ? '2ª Patrística' : item.tipo === 'lectura1_impar' ? '1ª Impar' : item.tipo === 'lectura1' ? '1ª Bíblica' : '1ª Par';

        return `
            <tr ${esActivo}>
                <td><code class="badge-id">${item.id}</code></td>
                <td><span style="font-size: 0.78rem; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.08);">${tipoLabel}</span></td>
                <td><strong>${item.titulo || item.id}</strong></td>
                <td>${colDiaSem}</td>
                <td><div style="max-height: 44px; overflow: hidden; font-size: 0.82rem; line-height: 1.3;"><em>${item.cita || ''}</em> — ${item.descripcion || ''}</div></td>
                <td>
                    <div class="celda-acciones">
                        <button class="btn-accion-icono btn-editar" data-id="${item.id}" title="Editar">
                            <span class="material-symbols-outlined" style="font-size: 1.15rem;">edit</span>
                        </button>
                        <button class="btn-accion-icono btn-borrar" data-id="${item.id}" title="Eliminar">
                            <span class="material-symbols-outlined" style="font-size: 1.15rem;">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Listeners de botones de fila
    cuerpo.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => editarLectura(btn.dataset.id));
    });

    cuerpo.querySelectorAll('.btn-borrar').forEach(btn => {
        btn.addEventListener('click', () => eliminarLectura(btn.dataset.id));
    });
}

// Guardar o actualizar lectura
async function guardarLectura(e) {
    e.preventDefault();

    const id = document.getElementById('form-id')?.value.trim();
    const titulo = document.getElementById('form-titulo')?.value.trim();
    const tipo = document.getElementById('form-tipo')?.value || 'lectura1_par';
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const semana = selSemana?.value || '1';
    const dia = (tiempo === 'santos') ? '' : (document.getElementById('form-dia')?.value || 'domingo');
    const libro = 'oficio';
    const epigrafeTipo = document.getElementById('form-epigrafe')?.value.trim() || (tipo === 'lectura2' ? 'SEGUNDA LECTURA' : 'PRIMERA LECTURA');
    const cita = document.getElementById('form-cita')?.value.trim();
    const descripcion = document.getElementById('form-desc')?.value.trim();
    const texto = document.getElementById('form-texto')?.value.trim();
    const respCita = document.getElementById('form-resp-cita')?.value.trim();
    const respR1Inicial = document.getElementById('form-resp-r1')?.value.trim();
    const respV = document.getElementById('form-resp-v')?.value.trim();
    const respR2 = document.getElementById('form-resp-r2')?.value.trim();
    const audioUrl = document.getElementById('form-audio-url')?.value.trim() || '';

    if (!id || !cita || !descripcion || !texto || !respR1Inicial || !respV || !respR2) {
        alert('Por favor completa todos los campos obligatorios de la lectura y su responsorio.');
        return;
    }

    let santoNombre = '';
    if (tiempo === 'santos') {
        const optSanto = selSemana?.selectedOptions[0];
        santoNombre = optSanto ? (optSanto.getAttribute('data-nombre') || optSanto.textContent) : '';
    }

    // Componer respR1 canónico litúrgico con asterisco si no lo trae
    let respR1Completo = respR1Inicial;
    if (respR2 && !respR1Completo.includes('*')) {
        respR1Completo = `${respR1Inicial} * ${respR2}`;
    }

    const nuevoObj = {
        id,
        varName: id,
        titulo: titulo || id,
        tipo,
        tiempo,
        semana,
        dia,
        libro,
        epigrafeTipo,
        cita,
        descripcion,
        texto,
        respCita,
        respR1: respR1Completo,
        respR1_inicial: respR1Inicial,
        respV,
        respR2,
        audioUrl,
        actualizadoEn: new Date().toISOString()
    };

    if (santoNombre) {
        nuevoObj.santoNombre = santoNombre;
    }

    const idx = listaLecturas.findIndex(x => x.id === id);
    if (idx >= 0) {
        listaLecturas[idx] = nuevoObj;
    } else {
        listaLecturas.push(nuevoObj);
    }

    localStorage.setItem('lh_lecturas_cache', JSON.stringify(listaLecturas));

    // Guardar en Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "lecturas_oficio", id), nuevoObj);
        }
    } catch (err) {
        console.warn('Error al guardar en Firestore:', err);
    }

    mostrarBannerEstado(`✅ Lectura "${id}" guardada exitosamente.`, 'exito');
    recordarParametros();
    limpiarFormulario(true);
    renderizarLista();
}

// Editar lectura
function editarLectura(id) {
    const item = listaLecturas.find(x => x.id === id);
    if (!item) return;

    editandoId = id;

    const setVal = (elId, val) => {
        const el = document.getElementById(elId);
        if (el && val !== undefined) el.value = val;
    };

    setVal('form-id', item.id);
    setVal('form-titulo', item.titulo || '');
    setVal('form-tiempo', item.tiempo || 'ordinario');

    // Actualizar UI del modo tiempo litúrgico (santos vs ordinario/otros)
    actualizarModoTiempo(item.semana, item.tipo);

    setVal('form-tipo', item.tipo || (item.tiempo === 'santos' ? 'lectura1' : 'lectura1_par'));
    if (item.tiempo !== 'santos') {
        setVal('form-dia', item.dia || 'domingo');
    }

    setVal('form-epigrafe', item.epigrafeTipo || (item.tipo === 'lectura2' ? 'SEGUNDA LECTURA' : 'PRIMERA LECTURA'));
    setVal('form-cita', item.cita || '');
    setVal('form-desc', item.descripcion || '');
    setVal('form-texto', item.texto || '');
    let r1 = item.respR1 || item.responsorio?.r1 || '';
    let r2 = item.respR2 || item.responsorio?.r2 || '';
    let v = item.respV || item.responsorio?.v || '';

    if (item.respR1_inicial) {
        r1 = item.respR1_inicial;
    } else if (r1.includes('*')) {
        const partes = r1.split('*');
        r1 = partes[0].trim();
        if (!r2 && partes[1]) {
            r2 = partes[1].trim();
        }
    }

    setVal('form-resp-cita', item.respCita || item.responsorio?.cita || '');
    setVal('form-resp-r1', r1);
    setVal('form-resp-v', v);
    setVal('form-resp-r2', r2);
    setVal('form-audio-url', item.audioUrl || '');

    const tituloForm = document.getElementById('titulo-formulario');
    if (tituloForm) {
        tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-gold);">edit</span> Editando: ${item.id}`;
    }

    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) {
        btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Actualizar Lectura`;
    }

    document.getElementById('form-id')?.setAttribute('readonly', 'true');
    actualizarLivePreview();
    renderizarLista();
}

// Eliminar lectura
async function eliminarLectura(id) {
    if (!confirm(`¿Estás seguro de eliminar la lectura "${id}"?`)) return;

    listaLecturas = listaLecturas.filter(x => x.id !== id);
    localStorage.setItem('lh_lecturas_cache', JSON.stringify(listaLecturas));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "lecturas_oficio", id));
        }
    } catch (err) {
        console.warn('Error al borrar de Firestore:', err);
    }

    if (editandoId === id) limpiarFormulario();
    renderizarLista();
    mostrarBannerEstado(`🗑️ Lectura "${id}" eliminada.`, 'info');
}

// Limpiar formulario
function limpiarFormulario(preservarParametros = true) {
    editandoId = null;

    const tiempoActual = document.getElementById('form-tiempo')?.value;
    const semanaActual = document.getElementById('form-semana')?.value;
    const diaActual = document.getElementById('form-dia')?.value;
    const tipoActual = document.getElementById('form-tipo')?.value;

    const camposTexto = [
        'form-cita', 'form-desc', 'form-texto',
        'form-resp-cita', 'form-resp-r1', 'form-resp-v', 'form-resp-r2'
    ];
    camposTexto.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const inputR2 = document.getElementById('form-resp-r2');
    if (inputR2) delete inputR2.dataset.autocompletado;

    const inputId = document.getElementById('form-id');
    if (inputId) {
        inputId.removeAttribute('readonly');
        inputId.value = '';
    }

    if (!preservarParametros) {
        const form = document.getElementById('form-lectura');
        if (form) form.reset();
        actualizarModoTiempo();
    } else {
        if (document.getElementById('form-tiempo') && tiempoActual) {
            document.getElementById('form-tiempo').value = tiempoActual;
        }
        actualizarModoTiempo(semanaActual, tipoActual);
        if (document.getElementById('form-semana') && semanaActual) {
            document.getElementById('form-semana').value = semanaActual;
        }
        if (tiempoActual !== 'santos') {
            if (document.getElementById('form-dia') && diaActual) {
                document.getElementById('form-dia').value = diaActual;
            }
        }
        if (document.getElementById('form-tipo') && tipoActual) {
            document.getElementById('form-tipo').value = tipoActual;
        }
    }

    const tituloForm = document.getElementById('titulo-formulario');
    if (tituloForm) {
        tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-red);">edit_note</span> Nueva Lectura`;
    }

    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) {
        btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Guardar Lectura`;
    }

    manejarCambioParametros();
}

// Sincronizar catálogo completo a Firestore
async function subirAFirebase() {
    if (listaLecturas.length === 0) {
        alert('No hay lecturas para subir.');
        return;
    }
    if (!window.firebaseAPI || !window.firebaseAPI.db) {
        alert('Firebase no está disponible en este momento.');
        return;
    }
    if (!confirm(`¿Deseas sincronizar todas las ${listaLecturas.length} lecturas en Firestore ("lecturas_oficio")?`)) return;

    mostrarBannerEstado(`Subiendo ${listaLecturas.length} lecturas a Firebase...`, 'info');

    try {
        const { doc, writeBatch } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        const batch = writeBatch(window.firebaseAPI.db);

        listaLecturas.forEach(item => {
            const docRef = doc(window.firebaseAPI.db, "lecturas_oficio", item.id);
            batch.set(docRef, item, { merge: true });
        });

        await batch.commit();
        mostrarBannerEstado(`✨ ¡Éxito! ${listaLecturas.length} lecturas sincronizadas en Firestore.`, 'exito');
    } catch (e) {
        console.error('Error al subir catálogo de lecturas a Firebase:', e);
        mostrarBannerEstado('❌ Error al subir a Firebase. Consulta la consola.', 'alerta');
    }
}
