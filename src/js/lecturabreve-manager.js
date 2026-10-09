/**
 * lecturabreve-manager.js
 * Controlador del Gestor de Lectura Breve y Responsorio Breve (lecturabreve.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Lecturas y Responsorios
 * Precarga el catálogo canónico desde src/data/db-lecturabreve.js
 * Sincroniza con localStorage ('lh_lecturabreve_cache') y Firebase Firestore.
 */

import { CATALOGO_LECTURAS_SEED } from '../data/db-lecturabreve.js';
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

// Actualiza fecha de celebración del santo en el catálogo (localStorage y Firestore)
async function actualizarFechaCelebracionSanto(idOSlug, nuevoDiaMes) {
    if (!nuevoDiaMes || !idOSlug) return;
    try {
        const raw = localStorage.getItem('lh_catalogo_nombres_santos');
        let list = raw ? JSON.parse(raw) : (typeof catalogoSantosAnual !== 'undefined' ? [...catalogoSantosAnual] : []);
        const idx = list.findIndex(s => generarIdSanto(s) === idOSlug || generarSlugSanto(s.nombre) === generarSlugSanto(idOSlug));
        if (idx >= 0) {
            list[idx].celebracion = nuevoDiaMes;
            list[idx].fechaFestividad = nuevoDiaMes;
            localStorage.setItem('lh_catalogo_nombres_santos', JSON.stringify(list));

            // Guardar en IndexedDB si existe
            try {
                const req = indexedDB.open('LH_Santos_DB', 2);
                req.onsuccess = (e) => {
                    const db = e.target.result;
                    if (db.objectStoreNames.contains('catalogo')) {
                        const tx = db.transaction('catalogo', 'readwrite');
                        tx.objectStore('catalogo').put(list, 'santos');
                    }
                };
            } catch (_) {}

            // Sincronizar con Firestore si está conectado
            if (window.firebaseAPI && window.firebaseAPI.guardarUnSantoFirestore) {
                window.firebaseAPI.guardarUnSantoFirestore(list[idx]).catch(() => {});
            }
            console.log(`📅 Fecha de celebración del santo actualizada a ${nuevoDiaMes}`);
        }
    } catch (e) {
        console.warn('Error al actualizar fecha de celebracion del santo:', e);
    }
}

// Actualiza las opciones del selector de Semanas / Santos y Día / Celebración
function actualizarModoTiempo(valorPrevioSemana = null) {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const lblSemana = document.getElementById('lbl-form-semana');
    const selDia = document.getElementById('form-dia');
    const inputFechaCeleb = document.getElementById('form-fecha-celebracion');
    const lblDia = document.getElementById('lbl-form-dia');
    const rowCampos = document.getElementById('row-campos-tiempo');

    if (!selSemana) return;

    if (tiempo === 'santos') {
        if (lblSemana) lblSemana.textContent = 'Santo / Celebración:';
        if (lblDia) lblDia.textContent = 'Fecha Celebración:';
        if (selDia) selDia.style.display = 'none';
        if (inputFechaCeleb) inputFechaCeleb.style.display = 'block';
        if (rowCampos) rowCampos.classList.add('modo-santos');

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

        // Cargar fecha en el input de fecha de celebración
        const optSel = selSemana.selectedOptions[0];
        if (optSel && inputFechaCeleb) {
            inputFechaCeleb.value = optSel.getAttribute('data-fecha') || '';
        }

        // Activar buscador interactivo tipo santo.html
        inicializarSearchableSantoSelect(selSemana, {
            placeholder: 'Buscar santo...',
            onChange: (val, opt) => {
                if (inputFechaCeleb && opt) {
                    inputFechaCeleb.value = opt.getAttribute('data-fecha') || '';
                }
                recordarParametros();
                manejarCambioParametros();
            }
        });
        if (selSemana._customSantoContainer) {
            selSemana._customSantoContainer.style.display = 'block';
        }
    } else {
        if (lblSemana) lblSemana.textContent = 'Semana:';
        if (lblDia) lblDia.textContent = 'Día:';
        if (selDia) selDia.style.display = 'block';
        if (inputFechaCeleb) inputFechaCeleb.style.display = 'none';
        if (rowCampos) rowCampos.classList.remove('modo-santos');

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
        const santoNombre = (tiempo === 'santos') ? (optSanto?.getAttribute('data-nombre') || '') : '';
        const dia = document.getElementById('form-dia')?.value || 'domingo';
        const fechaCeleb = document.getElementById('form-fecha-celebracion')?.value || '';
        const libro = (document.getElementById('form-libro')?.value || 'laudes').toLowerCase();

        const params = { tiempo, semana, santoId, santoNombre, dia, fechaCeleb, libro };
        localStorage.setItem('lh_lecturabreve_ultimos_parametros', JSON.stringify(params));
        localStorage.setItem('lh_parametros_liturgicos_compartidos', JSON.stringify(params));
    } catch (_) {}
}

function restaurarParametros() {
    try {
        const raw = localStorage.getItem('lh_lecturabreve_ultimos_parametros') || localStorage.getItem('lh_parametros_liturgicos_compartidos');
        if (!raw) return;
        const p = JSON.parse(raw);
        if (!p) return;

        const selTiempo = document.getElementById('form-tiempo');
        if (selTiempo && p.tiempo) {
            selTiempo.value = p.tiempo;
            actualizarModoTiempo(p.santoId || p.semana);
        }
        const selSemana = document.getElementById('form-semana');
        if (selSemana && (p.santoId || p.semana)) {
            const val = p.santoId || p.semana;
            if (Array.from(selSemana.options).some(o => o.value === val)) {
                selSemana.value = val;
            }
        }
        if (p.tiempo === 'santos') {
            const inpFecha = document.getElementById('form-fecha-celebracion');
            if (inpFecha && p.fechaCeleb) inpFecha.value = p.fechaCeleb;
        } else {
            const selDia = document.getElementById('form-dia');
            if (selDia && p.dia) selDia.value = p.dia;
        }
        const selLibro = document.getElementById('form-libro');
        if (selLibro && p.libro) {
            selLibro.value = p.libro.toLowerCase();
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

// Mostrar notificaciones dinámicas
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

// Cargar datos: primero desde Firestore/localStorage, con respaldo de db-lecturabreve.js
async function cargarDatos() {
    mostrarBannerEstado('Cargando lecturas breves y responsorios...', 'info');

    // 1. Probar desde Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "lecturas_breves"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 5) {
                    listaLecturas = desdeFb;
                    localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));
                    mostrarBannerEstado(`✅ Se cargaron ${listaLecturas.length} lecturas breves desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para lecturas breves:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_lecturabreve_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 5) {
                listaLecturas = parsed;
                mostrarBannerEstado(`📂 Cargadas ${listaLecturas.length} lecturas breves desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback al catálogo semilla canónico
    if (Array.isArray(CATALOGO_LECTURAS_SEED) && CATALOGO_LECTURAS_SEED.length > 0) {
        listaLecturas = [...CATALOGO_LECTURAS_SEED];
        localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));
        mostrarBannerEstado(`✨ Cargadas las ${listaLecturas.length} lecturas canónicas desde el catálogo base.`, 'exito');
        return;
    }

    listaLecturas = [];
    mostrarBannerEstado('No hay lecturas registradas. Agrega una nueva con el formulario.', 'alerta');
}

// Generar ID automático de lectura breve
function generarIdAutomatico() {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const semana = selSemana?.value || '1';
    const dia = document.getElementById('form-dia')?.value || 'domingo';
    const libro = document.getElementById('form-libro')?.value || 'laudes';
    const inputFechaCeleb = document.getElementById('form-fecha-celebracion');

    const mapaHoras = {
        oficio: 'of',
        laudes: 'la',
        tercia: 'te',
        sexta: 'se',
        nona: 'no',
        visperas: 'vi',
        completas: 'co'
    };
    const horaAbrev = mapaHoras[libro] || 'la';

    if (tiempo === 'santos') {
        const idSanto = semana;
        const fechaVal = inputFechaCeleb?.value?.trim() || '';
        let canonico = idSanto;
        if (/^\d{1,2}\/\d{1,2}$/.test(fechaVal)) {
            const [d, m] = fechaVal.split('/');
            const dd = d.padStart(2, '0');
            const mm = m.padStart(2, '0');
            canonico = idSanto.replace(/^sa\d{4}/, `sa${dd}${mm}`);
        }
        return `${canonico}${horaAbrev}_lb`;
    }

    const mapaDias = {
        domingo: 'do',
        lunes: 'lu',
        martes: 'ma',
        miercoles: 'mi',
        miércoles: 'mi',
        jueves: 'ju',
        viernes: 'vi',
        sabado: 'sa',
        sábado: 'sa'
    };
    const diaAbrev = mapaDias[dia] || 'do';

    const mapaTiempos = {
        ordinario: 'to',
        adviento: 'ta',
        navidad: 'tn',
        cuaresma: 'tc',
        pascua: 'tp'
    };
    const prefix = mapaTiempos[tiempo] || 'to';
    const semNum = String(semana).replace(/\D/g, '') || '1';
    const codSemana = `s${semNum.padStart(2, '0')}`;

    // Nomenclatura uniforme: [tiempo][semana 2 dígitos][día][hora] (ej: tos01dote, tos01dola)
    return `${prefix}${codSemana}${diaAbrev}${horaAbrev}`;
}

// Buscar lectura existente en el catálogo local
function buscarLecturaExistente(idBuscado, tiempo, semana, dia, libro) {
    if (!listaLecturas || listaLecturas.length === 0) return null;

    const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const idNorm = norm(idBuscado);

    // 1. Coincidencia directa por ID o ID normalizado (incluye compatibilidad s01 <-> s1 y hora/día)
    let m = listaLecturas.find(x => {
        const xNorm = norm(x.id);
        if (x.id === idBuscado || xNorm === idNorm) return true;
        const semNum = String(semana).replace(/\D/g, '') || '1';
        const semPad = semNum.padStart(2, '0');
        const alt1 = idNorm.replace(`s${semPad}`, `s${semNum}`);
        const alt2 = idNorm.replace(`s${semNum}`, `s${semPad}`);
        return xNorm === alt1 || xNorm === alt2;
    });
    if (m) return m;

    // 2. Búsqueda para santos
    if (tiempo === 'santos') {
        const libroNorm = norm(libro);
        m = listaLecturas.find(x => {
            if (x.tiempo !== 'santos') return false;
            const xLibroNorm = norm(x.libro);
            const libroMatch = xLibroNorm === libroNorm;
            const semanaMatch = x.semana === semana || norm(x.semana) === norm(semana);
            const idMatch = norm(x.id).includes(norm(semana));
            return libroMatch && (semanaMatch || idMatch);
        });
        if (m) return m;
    } else {
        // 3. Búsqueda para tiempos litúrgicos ordinarios/temporales
        m = listaLecturas.find(x => {
            const tItem = norm(x.tiempo);
            const tSel = norm(tiempo);
            const semMatch = Number(x.semana) === Number(semana);
            const diaMatch = norm(x.dia) === norm(dia);
            const libroMatch = norm(x.libro) === norm(libro);
            const tiempoMatch = (tItem === tSel) ||
                                (tSel === 'ordinario' && (tItem === 'to' || tItem === 'ordinario')) ||
                                (tSel === 'adviento' && (tItem === 'ta' || tItem === 'adviento')) ||
                                (tSel === 'navidad' && (tItem === 'tn' || tItem === 'navidad')) ||
                                (tSel === 'cuaresma' && (tItem === 'tc' || tItem === 'cuaresma')) ||
                                (tSel === 'pascua' && (tItem === 'tp' || tItem === 'pascua'));
            return semMatch && diaMatch && libroMatch && tiempoMatch;
        });
        if (m) return m;
    }

    return null;
}

// Actualizar la interfaz del formulario y la vista previa según la hora seleccionada (Tercia, Sexta, Nona vs Mayores)
function actualizarModoHora() {
    const libro = (document.getElementById('form-libro')?.value || 'laudes').toLowerCase();
    const esHoraMenor = (libro === 'tercia' || libro === 'sexta' || libro === 'nona');

    const txtTituloSeccion = document.getElementById('texto-titulo-seccion-responsorio');
    const lblRb1 = document.getElementById('lbl-form-rb1');
    const inputRb1 = document.getElementById('form-rb1');
    const rowRb2Rb3 = document.getElementById('row-campos-rb2-rb3');
    const inputRb2 = document.getElementById('form-rb2');
    const inputRb3 = document.getElementById('form-rb3');
    const notaFija = document.getElementById('nota-fija-responsorio');

    const previewTituloResponsorio = document.getElementById('preview-titulo-responsorio');
    const previewBloqueMayor = document.getElementById('preview-bloque-mayor');

    if (esHoraMenor) {
        if (txtTituloSeccion) txtTituloSeccion.textContent = 'VERSÍCULO Y RESPUESTA (V. Y R.)';
        if (lblRb1) {
            lblRb1.innerHTML = `<span style="color: #ff8a80; font-weight: bold;">V. Versículo:</span> (Se dice una sola vez en ${libro.toUpperCase()})`;
        }
        if (inputRb1) {
            inputRb1.placeholder = 'ej: Se acordó el Señor de su misericordia. Aleluya.';
        }
        if (rowRb2Rb3) {
            rowRb2Rb3.style.display = 'grid';
            // En hora menor sólo usamos R. Respuesta
            const grupoRb2 = document.getElementById('grupo-form-rb2');
            const grupoRb3 = document.getElementById('grupo-form-rb3');
            if (grupoRb2) grupoRb2.style.display = 'none';
            if (grupoRb3) {
                grupoRb3.style.display = 'block';
                const lblRb3 = document.getElementById('lbl-form-rb3');
                if (lblRb3) lblRb3.innerHTML = `<span style="color: #ff8a80; font-weight: bold;">R. Respuesta:</span>`;
            }
        }
        if (inputRb2) {
            inputRb2.required = false;
        }
        if (inputRb3) {
            inputRb3.required = true;
            inputRb3.placeholder = 'ej: Y de su fidelidad en favor de la casa de Israel. Aleluya.';
        }
        if (notaFija) {
            notaFija.innerHTML = `<strong>Dato litúrgico para ${libro.toUpperCase()}:</strong> En las horas menores (Tercia, Sexta y Nona) no hay título <em>"RESPONSORIO BREVE"</em> ni repeticiones ni Gloria Patri: solo se recita un <strong>V.</strong> (Versículo) y un <strong>R.</strong> (Respuesta).`;
        }

        // Preview: Ocultar título RESPONSORIO BREVE y ocultar estrofas repetidas / Gloria Patri
        if (previewTituloResponsorio) previewTituloResponsorio.style.display = 'none';
        if (previewBloqueMayor) previewBloqueMayor.style.display = 'none';
    } else {
        if (txtTituloSeccion) txtTituloSeccion.textContent = 'RESPONSORIO BREVE';
        if (lblRb1) {
            lblRb1.innerHTML = `<span style="color: #ff8a80; font-weight: bold;">V. y R. Principal:</span> (Se repite 3 veces en V.1, R.1 y tras el Gloria en R.3)`;
        }
        if (inputRb1) {
            inputRb1.placeholder = 'ej: Cristo, Hijo de Dios vivo, ten piedad de nosotros.';
        }
        if (rowRb2Rb3) {
            rowRb2Rb3.style.display = 'grid';
            const grupoRb2 = document.getElementById('grupo-form-rb2');
            const grupoRb3 = document.getElementById('grupo-form-rb3');
            if (grupoRb2) grupoRb2.style.display = 'block';
            if (grupoRb3) {
                grupoRb3.style.display = 'block';
                const lblRb3 = document.getElementById('lbl-form-rb3');
                if (lblRb3) lblRb3.innerHTML = `<span style="color: #ff8a80; font-weight: bold;">R. Segunda Respuesta:</span>`;
            }
        }
        if (inputRb2) {
            inputRb2.required = true;
            inputRb2.placeholder = 'ej: Tú que hoy te has manifestado.';
        }
        if (inputRb3) {
            inputRb3.required = true;
            inputRb3.placeholder = 'ej: Ten piedad de nosotros.';
        }
        if (notaFija) {
            notaFija.innerHTML = `<strong>Dato litúrgico fijo:</strong> Los rótulos <em>"LECTURA BREVE"</em> y <em>"RESPONSORIO BREVE"</em> son invariables. El tercer versículo <em>"V. Gloria al Padre, y al Hijo, y al Espíritu Santo."</em> se genera automáticamente.`;
        }

        // Preview: Mostrar título RESPONSORIO BREVE y estrofas completas
        if (previewTituloResponsorio) previewTituloResponsorio.style.display = 'block';
        if (previewBloqueMayor) previewBloqueMayor.style.display = 'block';
    }
}

// Coordinar cambio de parámetros, cálculo de ID y carga dinámica de la lectura correspondiente
function manejarCambioParametros() {
    actualizarModoHora();

    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const semana = selSemana?.value || '1';
    const dia = (tiempo === 'santos') ? 'propio' : (document.getElementById('form-dia')?.value || 'domingo');
    const libro = (document.getElementById('form-libro')?.value || 'laudes').toLowerCase();

    const autoId = generarIdAutomatico();
    const lecturaExistente = buscarLecturaExistente(autoId, tiempo, semana, dia, libro);

    const inputId = document.getElementById('form-id');
    const inputCita = document.getElementById('form-cita');
    const inputTexto = document.getElementById('form-texto');
    const inputRb1 = document.getElementById('form-rb1');
    const inputRb2 = document.getElementById('form-rb2');
    const inputRb3 = document.getElementById('form-rb3');
    const btnSubmit = document.querySelector('#form-lectura button[type="submit"]');

    if (lecturaExistente) {
        // Cargar lectura existente para esta hora/oficio
        editandoId = lecturaExistente.id;
        if (inputId) {
            inputId.value = lecturaExistente.id;
            inputId.disabled = true;
        }
        if (inputCita) inputCita.value = lecturaExistente.cita || '';
        if (inputTexto) inputTexto.value = lecturaExistente.texto || '';

        const esHoraMenor = (libro === 'tercia' || libro === 'sexta' || libro === 'nona');
        if (esHoraMenor) {
            if (inputRb1) inputRb1.value = lecturaExistente.rb1 || lecturaExistente.v || '';
            if (inputRb2) inputRb2.value = '';
            if (inputRb3) inputRb3.value = lecturaExistente.rb3 || lecturaExistente.r || lecturaExistente.rb2 || '';
        } else {
            if (inputRb1) inputRb1.value = lecturaExistente.rb1 || '';
            if (inputRb2) inputRb2.value = lecturaExistente.rb2 || '';
            if (inputRb3) inputRb3.value = lecturaExistente.rb3 || '';
        }

        if (btnSubmit) {
            btnSubmit.innerHTML = `<span class="material-symbols-outlined">edit</span> Actualizar Lectura y Responsorio`;
        }
        mostrarBannerEstado(`📖 Lectura existente cargada (${lecturaExistente.id}) para ${libro.toUpperCase()}.`, 'info');
    } else {
        // Si no existe, preparar formulario limpio con el ID generado para esa hora
        editandoId = null;
        if (inputId) {
            inputId.value = autoId;
            inputId.disabled = false;
        }
        if (inputCita) inputCita.value = '';
        if (inputTexto) inputTexto.value = '';
        if (inputRb1) inputRb1.value = '';
        if (inputRb2) inputRb2.value = '';
        if (inputRb3) inputRb3.value = '';

        if (btnSubmit) {
            btnSubmit.innerHTML = `<span class="material-symbols-outlined">save</span> Guardar Lectura y Responsorio`;
        }
    }

    actualizarLivePreview();
}

// Configurar listeners de la interfaz
function configurarEventos() {
    // Botón Restaurar Catálogo Base
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_LECTURAS_SEED) || CATALOGO_LECTURAS_SEED.length === 0) {
            alert('El catálogo de lecturas no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer las ${CATALOGO_LECTURAS_SEED.length} lecturas breves originales?`)) return;
        listaLecturas = [...CATALOGO_LECTURAS_SEED];
        localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));
        renderizarLista();
        manejarCambioParametros();
        mostrarBannerEstado(`🔄 Se restauraron las ${listaLecturas.length} lecturas del catálogo base.`, 'exito');
    });

    const form = document.getElementById('form-lectura');
    if (form) {
        form.addEventListener('submit', guardarLectura);

        // Actualizar Live Preview en tiempo real al escribir
        ['form-cita', 'form-texto', 'form-rb1', 'form-rb2', 'form-rb3'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', actualizarLivePreview);
            }
        });

        // Cambio en tiempo litúrgico
        document.getElementById('form-tiempo')?.addEventListener('change', () => {
            actualizarModoTiempo();
            recordarParametros();
            manejarCambioParametros();
        });

        // Cambio en semana / santo
        document.getElementById('form-semana')?.addEventListener('change', () => {
            const tiempo = document.getElementById('form-tiempo')?.value;
            if (tiempo === 'santos') {
                const sel = document.getElementById('form-semana');
                const opt = sel?.selectedOptions[0];
                const inputFecha = document.getElementById('form-fecha-celebracion');
                if (opt && inputFecha) {
                    inputFecha.value = opt.getAttribute('data-fecha') || '';
                }
            }
            recordarParametros();
            manejarCambioParametros();
        });

        // Cambio en fecha de celebración
        document.getElementById('form-fecha-celebracion')?.addEventListener('input', () => {
            recordarParametros();
            manejarCambioParametros();
        });

        // Cambio en día y libro (Hora / Oficio)
        ['form-dia', 'form-libro'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => {
                recordarParametros();
                manejarCambioParametros();
            });
        });
    }

    // Botón Limpiar Formulario
    document.getElementById('btn-limpiar-form')?.addEventListener('click', limpiarFormulario);

    // Botón Subir a Firebase
    document.getElementById('btn-subir-semilla')?.addEventListener('click', subirAFirebase);

    // Botón Exportar JSON
    document.getElementById('btn-exportar-json')?.addEventListener('click', exportarJSON);

    // Filtros de búsqueda
    document.getElementById('filtro-buscar')?.addEventListener('input', renderizarLista);
    document.getElementById('filtro-tiempo')?.addEventListener('change', renderizarLista);
    document.getElementById('filtro-dia')?.addEventListener('change', renderizarLista);
}

// Actualizar la vista previa fiel en tiempo real
function actualizarLivePreview() {
    actualizarModoHora();

    const libro = (document.getElementById('form-libro')?.value || 'laudes').toLowerCase();
    const esHoraMenor = (libro === 'tercia' || libro === 'sexta' || libro === 'nona');

    const defaultCita = esHoraMenor ? 'So 3, 14. 15b' : 'Is 61, 1-2a';
    const defaultTexto = esHoraMenor
        ? 'Regocíjate, hija de Sión; grita de júbilo, Israel; alégrate y gózate de todo corazón, hija de Jerusalén. El Señor será el rey de Israel, en medio de ti.'
        : 'El Espíritu del Señor está sobre mí, porque el Señor me ha ungido. Me ha enviado para dar la buena noticia a los pobres, para vendar los corazones desgarrados, para proclamar la amnistía a los cautivos, la libertad a los prisioneros, para proclamar el año de gracia del Señor.';
    const defaultRb1 = esHoraMenor ? 'Se acordó el Señor de su misericordia. Aleluya.' : 'Cristo, Hijo de Dios vivo, ten piedad de nosotros.';
    const defaultRb2 = 'Tú que hoy te has manifestado.';
    const defaultRb3 = esHoraMenor ? 'Y de su fidelidad en favor de la casa de Israel. Aleluya.' : 'Ten piedad de nosotros.';

    const cita = document.getElementById('form-cita')?.value.trim() || defaultCita;
    const texto = document.getElementById('form-texto')?.value.trim() || defaultTexto;
    const rb1 = document.getElementById('form-rb1')?.value.trim() || defaultRb1;
    const rb2 = document.getElementById('form-rb2')?.value.trim() || defaultRb2;
    const rb3 = document.getElementById('form-rb3')?.value.trim() || defaultRb3;

    const elCita = document.getElementById('preview-cita');
    const elTexto = document.getElementById('preview-texto');
    const elV1 = document.getElementById('preview-v1');
    const elR1 = document.getElementById('preview-r1');
    const elV2 = document.getElementById('preview-v2');
    const elR2 = document.getElementById('preview-r2');
    const elR3 = document.getElementById('preview-r3');

    if (elCita) elCita.textContent = cita;
    if (elTexto) elTexto.textContent = texto;

    if (esHoraMenor) {
        // En Tercia, Sexta y Nona: sólo V. y R. una sola vez
        if (elV1) elV1.textContent = rb1;
        if (elR1) elR1.textContent = rb3;
    } else {
        // En Horas Mayores: esquema tripartito de responsorio breve
        if (elV1) elV1.textContent = rb1;
        if (elR1) elR1.textContent = rb1;
        if (elV2) elV2.textContent = rb2;
        if (elR2) elR2.textContent = rb3;
        if (elR3) elR3.textContent = rb1; // Se repite la respuesta principal
    }
}

// Guardar lectura breve y responsorio
async function guardarLectura(e) {
    e.preventDefault();

    const id = document.getElementById('form-id').value.trim();
    const tiempo = document.getElementById('form-tiempo').value;
    const semana = document.getElementById('form-semana').value;
    const dia = document.getElementById('form-dia').value;
    const libro = (document.getElementById('form-libro').value || 'laudes').toLowerCase();
    const cita = document.getElementById('form-cita').value.trim();
    const texto = document.getElementById('form-texto').value.trim();
    const rb1 = document.getElementById('form-rb1').value.trim();
    const rb2 = document.getElementById('form-rb2').value.trim();
    const rb3 = document.getElementById('form-rb3').value.trim();
    const inputFechaCeleb = document.getElementById('form-fecha-celebracion');
    const fechaCelebracion = inputFechaCeleb?.value?.trim() || '';

    const esHoraMenor = (libro === 'tercia' || libro === 'sexta' || libro === 'nona');

    if (esHoraMenor) {
        if (!id || !cita || !texto || !rb1 || !rb3) {
            alert('Por favor complete los campos requeridos (ID, Cita, Texto, V. Versículo y R. Respuesta).');
            return;
        }
    } else {
        if (!id || !cita || !texto || !rb1) {
            alert('Por favor complete los campos requeridos (ID, Cita, Texto y Responsorio Principal).');
            return;
        }
    }

    let santoNombre = '';
    if (tiempo === 'santos') {
        const selSem = document.getElementById('form-semana');
        const opt = selSem?.selectedOptions[0];
        santoNombre = opt?.getAttribute('data-nombre') || '';

        // Sincronizar fecha de celebración en catálogo de santos si es válida
        if (fechaCelebracion && /^\d{1,2}\/\d{1,2}$/.test(fechaCelebracion)) {
            actualizarFechaCelebracionSanto(semana, fechaCelebracion);
        }
    }

    const nuevoItem = {
        id,
        varName: id,
        tiempo,
        semana,
        dia: tiempo === 'santos' ? 'propio' : dia,
        libro,
        cita,
        texto,
        rb1: rb1 || '',
        rb2: esHoraMenor ? '' : (rb2 || ''),
        rb3: rb3 || '',
        ...(esHoraMenor ? { v: rb1, r: rb3 } : {}),
        actualizadoEn: new Date().toISOString(),
        ...(tiempo === 'santos' ? { santoNombre, fechaCelebracion } : {})
    };

    // Actualizar o añadir a lista local
    const idx = listaLecturas.findIndex(l => l.id === id);
    if (idx >= 0) {
        listaLecturas[idx] = nuevoItem;
        mostrarBannerEstado(`💾 Lectura '${cita}' (${id}) actualizada localmente.`, 'exito');
    } else {
        listaLecturas.unshift(nuevoItem);
        mostrarBannerEstado(`✨ Lectura '${cita}' (${id}) registrada exitosamente.`, 'exito');
    }

    localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));

    // Guardar en Firestore si está conectado
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "lecturas_breves", id), nuevoItem, { merge: true });
        }
    } catch (fbErr) {
        console.warn('No se pudo sincronizar inmediatamente con Firestore:', fbErr);
    }

    recordarParametros();
    limpiarFormulario(true);
    renderizarLista();
}

// Limpiar formulario y reiniciar campos a valores por defecto
function limpiarFormulario(preservarParametros = true) {
    editandoId = null;

    const tiempoActual = document.getElementById('form-tiempo')?.value;
    const semanaActual = document.getElementById('form-semana')?.value;
    const diaActual = document.getElementById('form-dia')?.value;
    const libroActual = document.getElementById('form-libro')?.value;
    const fechaActual = document.getElementById('form-fecha-celebracion')?.value;

    const inputCita = document.getElementById('form-cita');
    const inputTexto = document.getElementById('form-texto');
    const inputRb1 = document.getElementById('form-rb1');
    const inputRb2 = document.getElementById('form-rb2');
    const inputRb3 = document.getElementById('form-rb3');

    if (inputCita) inputCita.value = '';
    if (inputTexto) inputTexto.value = '';
    if (inputRb1) inputRb1.value = '';
    if (inputRb2) inputRb2.value = '';
    if (inputRb3) inputRb3.value = '';

    const inputId = document.getElementById('form-id');
    if (inputId) {
        inputId.disabled = false;
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
        actualizarModoTiempo(semanaActual);
        if (document.getElementById('form-semana') && semanaActual) {
            document.getElementById('form-semana').value = semanaActual;
        }
        if (tiempoActual === 'santos') {
            if (document.getElementById('form-fecha-celebracion') && fechaActual) {
                document.getElementById('form-fecha-celebracion').value = fechaActual;
            }
        } else {
            if (document.getElementById('form-dia') && diaActual) {
                document.getElementById('form-dia').value = diaActual;
            }
        }
        if (document.getElementById('form-libro') && libroActual) {
            document.getElementById('form-libro').value = libroActual;
        }
    }

    const btnSubmit = document.querySelector('#form-lectura button[type="submit"]');
    if (btnSubmit) {
        btnSubmit.innerHTML = `<span class="material-symbols-outlined">save</span> Guardar Lectura y Responsorio`;
    }

    actualizarModoHora();
    manejarCambioParametros();
    actualizarLivePreview();
}

// Cargar item en formulario para edición
function editarLectura(id) {
    const item = listaLecturas.find(l => l.id === id);
    if (!item) return;

    editandoId = id;

    const inputId = document.getElementById('form-id');
    if (inputId) {
        inputId.value = item.id;
        inputId.disabled = true;
    }

    if (document.getElementById('form-tiempo')) document.getElementById('form-tiempo').value = item.tiempo || 'ordinario';
    
    actualizarModoTiempo(item.semana);

    if (item.tiempo === 'santos') {
        const inputFecha = document.getElementById('form-fecha-celebracion');
        if (inputFecha) inputFecha.value = item.fechaCelebracion || '';
    } else {
        if (document.getElementById('form-dia')) document.getElementById('form-dia').value = item.dia || 'domingo';
    }

    const libroNorm = (item.libro || 'laudes').toLowerCase();
    if (document.getElementById('form-libro')) document.getElementById('form-libro').value = libroNorm;
    actualizarModoHora();

    if (document.getElementById('form-cita')) document.getElementById('form-cita').value = item.cita || '';
    if (document.getElementById('form-texto')) document.getElementById('form-texto').value = item.texto || '';

    const esHoraMenor = (libroNorm === 'tercia' || libroNorm === 'sexta' || libroNorm === 'nona');
    if (esHoraMenor) {
        if (document.getElementById('form-rb1')) document.getElementById('form-rb1').value = item.rb1 || item.v || '';
        if (document.getElementById('form-rb2')) document.getElementById('form-rb2').value = '';
        if (document.getElementById('form-rb3')) document.getElementById('form-rb3').value = item.rb3 || item.r || item.rb2 || '';
    } else {
        if (document.getElementById('form-rb1')) document.getElementById('form-rb1').value = item.rb1 || '';
        if (document.getElementById('form-rb2')) document.getElementById('form-rb2').value = item.rb2 || '';
        if (document.getElementById('form-rb3')) document.getElementById('form-rb3').value = item.rb3 || '';
    }

    const btnSubmit = document.querySelector('#form-lectura button[type="submit"]');
    if (btnSubmit) {
        btnSubmit.innerHTML = `<span class="material-symbols-outlined">edit</span> Actualizar Lectura`;
    }

    actualizarLivePreview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Eliminar lectura
async function eliminarLectura(id) {
    if (!confirm(`¿Eliminar la lectura con ID '${id}'?`)) return;

    listaLecturas = listaLecturas.filter(l => l.id !== id);
    localStorage.setItem('lh_lecturabreve_cache', JSON.stringify(listaLecturas));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "lecturas_breves", id));
        }
    } catch (fbErr) {
        console.warn('Error al eliminar de Firestore:', fbErr);
    }

    mostrarBannerEstado(`🗑️ Lectura '${id}' eliminada.`, 'alerta');
    if (editandoId === id) limpiarFormulario();
    renderizarLista();
}

// Renderizar la lista del catálogo
function renderizarLista() {
    const contenedor = document.getElementById('lista-lecturas-items');
    const contador = document.getElementById('contador-lecturas');
    if (!contenedor) return;

    const textoBuscar = (document.getElementById('filtro-buscar')?.value || '').toLowerCase().trim();
    const filtroTiempo = document.getElementById('filtro-tiempo')?.value || '';
    const filtroDia = document.getElementById('filtro-dia')?.value || '';

    const filtrados = listaLecturas.filter(l => {
        const cita = (l.cita || '').toLowerCase();
        const texto = (l.texto || '').toLowerCase();
        const rb1 = (l.rb1 || '').toLowerCase();
        const id = (l.id || '').toLowerCase();
        const sNom = (l.santoNombre || '').toLowerCase();

        let coincideFecha = false;
        if (textoBuscar) {
            const rawFecha = l.fechaCelebracion || '';
            let mF = rawFecha.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
            if (!mF) mF = (l.id || '').match(/^sa(\d{2})(\d{2})/i);
            if (!mF) mF = (l.cita || '').match(/\((\d{1,2})[\/\-](\d{1,2})\)/);
            if (mF) {
                const dd = String(parseInt(mF[1], 10)).padStart(2, '0');
                const mm = String(parseInt(mF[2], 10)).padStart(2, '0');
                const d = String(parseInt(mF[1], 10));
                const m = String(parseInt(mF[2], 10));
                const variantes = [`${dd}/${mm}`, `${d}/${m}`, `${d}/${mm}`, `${dd}/${m}`, `${dd}-${mm}`, `${d}-${m}`, `${dd}${mm}`];
                coincideFecha = variantes.some(v => v.includes(textoBuscar) || textoBuscar.includes(v));
            }
        }

        const coincideBusqueda = !textoBuscar || cita.includes(textoBuscar) || texto.includes(textoBuscar) || rb1.includes(textoBuscar) || id.includes(textoBuscar) || sNom.includes(textoBuscar) || coincideFecha;
        const coincideTiempo = !filtroTiempo || l.tiempo === filtroTiempo;
        const coincideDia = !filtroDia || l.dia === filtroDia;

        return coincideBusqueda && coincideTiempo && coincideDia;
    });

    if (contador) contador.textContent = filtrados.length;

    contenedor.innerHTML = '';
    if (filtrados.length === 0) {
        contenedor.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); padding: 40px 10px;">
                <span class="material-symbols-outlined" style="font-size: 3rem; opacity: 0.4;">auto_stories</span>
                <p style="margin-top: 8px;">No se encontraron lecturas breves con los filtros seleccionados.</p>
            </div>
        `;
        return;
    }

    filtrados.forEach(item => {
        const esSanto = item.tiempo === 'santos' || (item.id && item.id.startsWith('sa'));
        let badgeInfo;
        if (esSanto) {
            const nomb = item.santoNombre || item.cita || item.id;
            const fec = item.fechaCelebracion ? ` (${item.fechaCelebracion})` : '';
            badgeInfo = `<span class="item-badge-tiempo santos">😇 ${nomb}${fec}</span>`;
        } else {
            badgeInfo = `<span class="item-badge-tiempo">${(item.tiempo || 'ordinario').toUpperCase()} • S${item.semana || '1'} • ${item.dia || ''}</span>`;
        }

        const card = document.createElement('div');
        card.className = `item-lectura-card ${editandoId === item.id ? 'activo' : ''}`;
        card.innerHTML = `
            <div class="item-header">
                <span class="item-cita">${item.cita || item.id}</span>
                ${badgeInfo}
            </div>
            <div class="item-snippet">${item.texto || ''}</div>
            <div class="item-rb-refrain">V/R: ${item.rb1 || 'Sin responsorio'}</div>
            <div class="item-acciones">
                <button class="btn-mini-accion btn-editar" data-id="${item.id}">
                    <span class="material-symbols-outlined" style="font-size: 16px;">edit</span> Cargar
                </button>
                <button class="btn-mini-accion eliminar btn-eliminar" data-id="${item.id}">
                    <span class="material-symbols-outlined" style="font-size: 16px;">delete</span> Eliminar
                </button>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-eliminar')) {
                eliminarLectura(item.id);
            } else {
                editarLectura(item.id);
            }
        });

        contenedor.appendChild(card);
    });
}

// Subir todo el catálogo actual a Firebase Firestore
async function subirAFirebase() {
    if (listaLecturas.length === 0) {
        alert('No hay lecturas cargadas para subir.');
        return;
    }

    if (!confirm(`¿Subir los ${listaLecturas.length} registros a la colección 'lecturas_breves' de Firebase Firestore?`)) return;

    const btn = document.getElementById('btn-subir-semilla');
    const txtOriginal = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined" style="animation: spinUpdateIcon 1s linear infinite;">sync</span> Subiendo...`;
    }

    try {
        if (!window.firebaseAPI || !window.firebaseAPI.db) {
            throw new Error('Firebase no está inicializado.');
        }

        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        let subidos = 0;
        for (const lectura of listaLecturas) {
            if (lectura.id) {
                await setDoc(doc(window.firebaseAPI.db, "lecturas_breves", lectura.id), lectura, { merge: true });
                subidos++;
            }
        }
        mostrarBannerEstado(`🚀 ¡Éxito! Se subieron ${subidos} lecturas y responsorios a Firebase Firestore.`, 'exito');
    } catch (err) {
        console.error('Error al subir a Firebase:', err);
        mostrarBannerEstado(`❌ Error al subir a Firebase: ${err.message}`, 'alerta');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = txtOriginal;
        }
    }
}

// Exportar catálogo como JSON
function exportarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaLecturas, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `lecturas_breves_backup_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
}
