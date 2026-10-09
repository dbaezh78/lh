/**
 * oracion-manager.js
 * Controlador del Gestor de Oraciones Litúrgicas (oracion.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Oraciones canónicas.
 * Precarga el catálogo canónico desde src/data/db-oracion.js
 * Sincroniza con localStorage ('lh_oracion_cache') y Firebase Firestore ('oraciones_liturgia').
 */

import { CATALOGO_ORACION_SEED, OracionDB } from '../data/db-oracion.js';
import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';
import { inicializarSearchableSantoSelect } from './searchable-santo.js';

let listaOraciones = [];
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

            // Guardar también en IndexedDB si existe
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

            // Sincronizar en Firestore si está conectado
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

    if (!selSemana) return;

    if (tiempo === 'santos') {
        if (lblSemana) lblSemana.textContent = 'Santo / Celebración:';
        if (lblDia) lblDia.textContent = 'Fecha Celebración (dd/mm):';
        if (selDia) selDia.style.display = 'none';
        if (inputFechaCeleb) inputFechaCeleb.style.display = 'block';

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
        if (lblDia) lblDia.textContent = 'Día de la Semana:';
        if (selDia) selDia.style.display = 'block';
        if (inputFechaCeleb) inputFechaCeleb.style.display = 'none';

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
        const dia = document.getElementById('form-dia')?.value || 'lunes';
        const fechaCeleb = document.getElementById('form-fecha-celebracion')?.value || '';
        const libro = document.getElementById('form-libro')?.value || 'laudes';

        const params = { tiempo, semana, santoId, santoNombre, dia, fechaCeleb, libro };
        localStorage.setItem('lh_oracion_ultimos_parametros', JSON.stringify(params));
        localStorage.setItem('lh_parametros_liturgicos_compartidos', JSON.stringify(params));
    } catch (_) {}
}

function restaurarParametros() {
    try {
        const raw = localStorage.getItem('lh_oracion_ultimos_parametros') || localStorage.getItem('lh_parametros_liturgicos_compartidos');
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
            selLibro.value = p.libro;
        }
    } catch (_) {}
}

// Buscar oración existente en memoria/catálogo
function buscarOracionExistente(autoId, tiempo, semana, dia, libro) {
    if (!listaOraciones || listaOraciones.length === 0) return null;
    const norm = (s) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

    // 1. Coincidencia por ID generado (incluyendo equivalencias s01 <-> s1 y orden día/hora)
    if (autoId) {
        const autoNorm = norm(autoId);
        const porId = listaOraciones.find(o => {
            const oIdNorm = norm(o.id);
            if (oIdNorm === autoNorm) return true;
            const semNum = String(semana).replace(/\D/g, '') || '1';
            const semPad = semNum.padStart(2, '0');
            const idAlt1 = autoNorm.replace(`s${semPad}`, `s${semNum}`);
            const idAlt2 = autoNorm.replace(`s${semNum}`, `s${semPad}`);
            if (oIdNorm === idAlt1 || oIdNorm === idAlt2) return true;
            return false;
        });
        if (porId) return porId;
    }

    if (tiempo === 'santos') {
        const idSantoNorm = norm(semana);
        return listaOraciones.find(o => {
            if (o.tiempo !== 'santos' && !(o.id && o.id.startsWith('sa'))) return false;
            const libroMatch = (o.libro === libro) || (libro === 'laudes' && !o.libro);
            const oIdNorm = norm(o.id);
            const oSemNorm = norm(o.semana);
            const oNomNorm = norm(o.santoNombre);
            const santoMatch = idSantoNorm && (
                oIdNorm.includes(idSantoNorm) || idSantoNorm.includes(oIdNorm) ||
                oSemNorm.includes(idSantoNorm) || idSantoNorm.includes(oSemNorm) ||
                (oNomNorm && (oNomNorm.includes(idSantoNorm) || idSantoNorm.includes(oNomNorm)))
            );
            return libroMatch && santoMatch;
        });
    } else {
        const sBusq = parseInt(String(semana).replace(/\D/g, ''), 10);
        return listaOraciones.find(o => {
            if (o.tiempo !== tiempo) return false;
            const oSem = parseInt(String(o.semana).replace(/\D/g, ''), 10);
            const semMatch = (!isNaN(sBusq) && !isNaN(oSem)) ? (oSem === sBusq) : (String(o.semana) === String(semana));
            const diaMatch = norm(o.dia) === norm(dia);
            const libroMatch = o.libro === libro;
            return semMatch && diaMatch && libroMatch;
        });
    }
}

// Coordinar cambio de parámetros (Santo, Tiempo, Semana, Día, Libro)
function manejarCambioParametros() {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const semana = selSemana?.value || '1';
    const dia = document.getElementById('form-dia')?.value || 'lunes';
    const libro = document.getElementById('form-libro')?.value || 'laudes';

    const autoId = generarIdAutomatico();
    const oracionExistente = buscarOracionExistente(autoId, tiempo, semana, dia, libro);

    const txtId = document.getElementById('form-id');
    const txtTitulo = document.getElementById('form-titulo');
    const txtOremos = document.getElementById('form-oremos');
    const txtTexto = document.getElementById('form-texto');
    const txtConcl = document.getElementById('form-conclusion');
    const btnGuardar = document.getElementById('btn-guardar-texto');
    const tituloForm = document.getElementById('titulo-formulario');

    if (oracionExistente) {
        editandoId = oracionExistente.id;
        if (txtId) txtId.value = oracionExistente.id || autoId;
        if (txtTitulo) txtTitulo.value = oracionExistente.titulo || '';
        if (txtOremos) txtOremos.value = oracionExistente.oremos || '';
        if (txtTexto) txtTexto.value = oracionExistente.texto || '';
        if (txtConcl) txtConcl.value = oracionExistente.conclusion || '';

        if (btnGuardar) btnGuardar.textContent = 'Actualizar Oración';
        if (tituloForm) tituloForm.innerHTML = `<span class="material-symbols-outlined">edit_note</span> Editando: ${oracionExistente.id}`;
        mostrarBannerEstado(`📖 Oración existente cargada (${oracionExistente.libro || libro}).`, 'info');
    } else {
        editandoId = null;
        if (txtId) txtId.value = autoId;
        actualizarTituloSugerido();
        if (txtOremos) txtOremos.value = '';
        if (txtTexto) txtTexto.value = '';
        if (txtConcl) txtConcl.value = '';

        if (btnGuardar) btnGuardar.textContent = 'Guardar Oración';
        if (tituloForm) tituloForm.innerHTML = `<span class="material-symbols-outlined">add_circle</span> Nueva Oración`;
    }
    actualizarLivePreview();
}

document.addEventListener('DOMContentLoaded', async () => {
    actualizarModoTiempo();
    restaurarParametros();
    configurarEventos();
    await cargarDatos();
    renderizarLista();
    manejarCambioParametros();
    actualizarLivePreview();
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

// Cargar datos: primero desde Firestore/localStorage, con respaldo de db-oracion.js
async function cargarDatos() {
    mostrarBannerEstado('Cargando oraciones canónicas...', 'info');

    // 1. Probar desde Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "oraciones_liturgia"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 5) {
                    listaOraciones = desdeFb;
                    localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));
                    mostrarBannerEstado(`✅ Se cargaron ${listaOraciones.length} oraciones desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para oraciones:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_oracion_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 5) {
                listaOraciones = parsed;
                mostrarBannerEstado(`📂 Cargadas ${listaOraciones.length} oraciones desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback al catálogo semilla canónico
    if (Array.isArray(CATALOGO_ORACION_SEED) && CATALOGO_ORACION_SEED.length > 0) {
        listaOraciones = [...CATALOGO_ORACION_SEED];
        localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));
        mostrarBannerEstado(`✨ Cargadas las ${listaOraciones.length} oraciones canónicas desde el catálogo base.`, 'exito');
        return;
    }

    listaOraciones = [];
    mostrarBannerEstado('No hay oraciones registradas. Agrega una nueva con el formulario.', 'alerta');
}

// Generar ID automático de oración
function generarIdAutomatico() {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const semana = selSemana?.value || '1';
    const selDia = document.getElementById('form-dia');
    const dia = selDia?.value || 'lunes';
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
        const idSanto = semana; // en modo santos, el value de semana contiene idSanto (ej: sa2801santotomasdeaquino)
        // Extraer fecha del input si fue editada
        const fechaVal = inputFechaCeleb?.value?.trim() || '';
        let canonico = idSanto;
        if (/^\d{1,2}\/\d{1,2}$/.test(fechaVal)) {
            const [d, m] = fechaVal.split('/');
            const dd = d.padStart(2, '0');
            const mm = m.padStart(2, '0');
            // Reemplazar la fecha de idSanto sa{dd}{mm}{slug}
            canonico = idSanto.replace(/^sa\d{4}/, `sa${dd}${mm}`);
        }
        return `${canonico}${horaAbrev}_oracion`;
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

    // Nomenclatura uniforme: [tiempo][semana 2 dígitos][día][hora] (ej: tos01doof, tos01dote)
    return `${prefix}${codSemana}${diaAbrev}${horaAbrev}`;
}

// Configurar listeners de la interfaz
function configurarEventos() {
    // Botón Restaurar Catálogo Base
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_ORACION_SEED) || CATALOGO_ORACION_SEED.length === 0) {
            alert('El catálogo de oraciones no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer las ${CATALOGO_ORACION_SEED.length} oraciones originales?`)) return;
        listaOraciones = [...CATALOGO_ORACION_SEED];
        localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));
        renderizarLista();
        limpiarFormulario();
        mostrarBannerEstado(`🔄 Se restauraron las ${listaOraciones.length} oraciones del catálogo base.`, 'exito');
    });

    const form = document.getElementById('form-oracion');
    if (form) {
        form.addEventListener('submit', guardarOracion);

        // Actualizar Live Preview en tiempo real al escribir
        ['form-id', 'form-titulo', 'form-texto', 'form-conclusion'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', actualizarLivePreview);
            }
        });

        // Cambio en selector de tiempo litúrgico
        document.getElementById('form-tiempo')?.addEventListener('change', () => {
            actualizarModoTiempo();
            recordarParametros();
            manejarCambioParametros();
        });

        // Cambio en selector de semana / santo
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

        // Cambio en día y libro
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
    ['filtro-busqueda', 'filtro-tiempo', 'filtro-dia', 'filtro-libro'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', renderizarLista);
    });
}

function actualizarTituloSugerido() {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const semana = selSemana?.value || '1';
    const libro = document.getElementById('form-libro')?.value || 'laudes';
    const libroCap = libro.charAt(0).toUpperCase() + libro.slice(1);
    const inpTitulo = document.getElementById('form-titulo');
    if (!inpTitulo) return;

    if (tiempo === 'santos') {
        const opt = selSemana?.selectedOptions[0];
        const nombreSanto = opt?.getAttribute('data-nombre') || 'Santo';
        const fecha = document.getElementById('form-fecha-celebracion')?.value || opt?.getAttribute('data-fecha') || '';
        inpTitulo.value = `Oración - ${nombreSanto}${fecha ? ' (' + fecha + ')' : ''} (${libroCap})`;
    } else {
        const dia = document.getElementById('form-dia')?.value || 'lunes';
        const diaCap = dia.charAt(0).toUpperCase() + dia.slice(1);
        const tiempoCap = tiempo.charAt(0).toUpperCase() + tiempo.slice(1);
        inpTitulo.value = `Oración - Tiempo ${tiempoCap} - Semana ${semana} - ${diaCap} (${libroCap})`;
    }
}

// Actualizar la vista previa en el pergamino litúrgico
function actualizarLivePreview() {
    const idVal = document.getElementById('form-id')?.value.trim() || 'Oración';
    const textoVal = document.getElementById('form-texto')?.value.trim() || 'Tu gracia, Señor, inspire nuestras obras, las sostenga y acompañe; para que todo nuestro trabajo brote de ti, como de su fuente, y tienda a ti, como a su fin. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios, por los siglos de los siglos. Amén.';
    const conclusionVal = document.getElementById('form-conclusion')?.value.trim() || '';

    const pBadge = document.getElementById('preview-id-badge');
    if (pBadge) pBadge.textContent = idVal;

    const pTitulo = document.getElementById('preview-titulo');
    if (pTitulo) pTitulo.textContent = 'ORACIÓN';

    const pTexto = document.getElementById('preview-texto');
    if (pTexto) pTexto.textContent = textoVal;

    const pConcl = document.getElementById('preview-conclusion');
    if (pConcl) {
        if (conclusionVal) {
            pConcl.textContent = conclusionVal;
            pConcl.style.display = 'block';
        } else {
            pConcl.style.display = 'none';
        }
    }
}

// Renderizar la tabla del catálogo
function renderizarLista() {
    const contenedor = document.getElementById('cuerpo-tabla-oraciones');
    if (!contenedor) return;

    const fTexto = (document.getElementById('filtro-busqueda')?.value || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const fTiempo = document.getElementById('filtro-tiempo')?.value || 'todos';
    const fDia = document.getElementById('filtro-dia')?.value || 'todos';
    const fLibro = document.getElementById('filtro-libro')?.value || 'todos';

    const filtradas = listaOraciones.filter(o => {
        if (fTiempo !== 'todos' && o.tiempo !== fTiempo) return false;
        if (fDia !== 'todos' && o.dia !== fDia) return false;
        if (fLibro !== 'todos' && o.libro !== fLibro) return false;
        if (fTexto) {
            const tit = (o.titulo || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const txt = (o.texto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const oId = (o.id || '').toLowerCase();
            const sNom = (o.santoNombre || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            let coincideFecha = false;
            const rawFecha = o.fechaCelebracion || o.fecha || '';
            let mF = rawFecha.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
            if (!mF) mF = (o.id || '').match(/^sa(\d{2})(\d{2})/i);
            if (!mF) mF = (o.titulo || '').match(/\((\d{1,2})[\/\-](\d{1,2})\)/);
            if (mF) {
                const dd = String(parseInt(mF[1], 10)).padStart(2, '0');
                const mm = String(parseInt(mF[2], 10)).padStart(2, '0');
                const d = String(parseInt(mF[1], 10));
                const m = String(parseInt(mF[2], 10));
                const variantes = [`${dd}/${mm}`, `${d}/${m}`, `${d}/${mm}`, `${dd}/${m}`, `${dd}-${mm}`, `${d}-${m}`, `${dd}${mm}`];
                coincideFecha = variantes.some(v => v.includes(fTexto) || fTexto.includes(v));
            }

            return tit.includes(fTexto) || txt.includes(fTexto) || oId.includes(fTexto) || sNom.includes(fTexto) || coincideFecha;
        }
        return true;
    });

    const contador = document.getElementById('contador-oraciones');
    if (contador) contador.textContent = `(${filtradas.length} de ${listaOraciones.length})`;

    if (filtradas.length === 0) {
        contenedor.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 30px;">No se encontraron oraciones con los filtros seleccionados.</td></tr>`;
        return;
    }

    contenedor.innerHTML = filtradas.map(o => {
        const esSanto = o.tiempo === 'santos' || (o.id && o.id.startsWith('sa'));
        let celdaDia;
        if (esSanto) {
            const etiqueta = o.santoNombre || o.titulo || o.id;
            const fechaTxt = o.fechaCelebracion ? ` (${o.fechaCelebracion})` : '';
            celdaDia = `<span class="badge-tag santos">😇 ${etiqueta}${fechaTxt}</span>`;
        } else {
            const diaCap = (o.dia || '').charAt(0).toUpperCase() + (o.dia || '').slice(1);
            celdaDia = `${diaCap} (Sem. ${o.semana || '1'})`;
        }

        const snippet = (o.texto || '').replace(/\n/g, ' ').slice(0, 100) + '...';
        return `
            <tr>
                <td class="td-id">${o.id}</td>
                <td class="td-titulo">${o.titulo || o.id}</td>
                <td><span class="badge-tag ${o.libro}">${o.libro || 'laudes'}</span></td>
                <td>${celdaDia}</td>
                <td class="td-texto-snippet" title="${(o.texto || '').replace(/"/g, '&quot;')}">${snippet}</td>
                <td>
                    <div class="acciones-celda">
                        <button class="btn-accion-icono btn-editar-oracion" data-id="${o.id}" title="Editar esta oración">
                            <span class="material-symbols-outlined" style="font-size: 18px;">edit</span>
                        </button>
                        <button class="btn-accion-icono borrar btn-borrar-oracion" data-id="${o.id}" title="Eliminar oración">
                            <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Eventos de botones Editar y Eliminar
    contenedor.querySelectorAll('.btn-editar-oracion').forEach(btn => {
        btn.addEventListener('click', () => editarOracion(btn.getAttribute('data-id')));
    });

    contenedor.querySelectorAll('.btn-borrar-oracion').forEach(btn => {
        btn.addEventListener('click', () => eliminarOracion(btn.getAttribute('data-id')));
    });
}

// Cargar una oración en el formulario para editar
function editarOracion(id) {
    const o = listaOraciones.find(item => item.id === id);
    if (!o) return;

    editandoId = id;

    document.getElementById('form-id').value = o.id || '';
    document.getElementById('form-titulo').value = o.titulo || '';
    document.getElementById('form-tiempo').value = o.tiempo || 'ordinario';

    actualizarModoTiempo(o.semana);

    if (o.tiempo === 'santos') {
        const inputFecha = document.getElementById('form-fecha-celebracion');
        if (inputFecha) inputFecha.value = o.fechaCelebracion || '';
    } else {
        document.getElementById('form-dia').value = o.dia || 'lunes';
    }

    document.getElementById('form-libro').value = o.libro || 'laudes';
    if (document.getElementById('form-oremos')) document.getElementById('form-oremos').value = o.oremos || '';
    document.getElementById('form-texto').value = o.texto || '';
    document.getElementById('form-conclusion').value = o.conclusion || '';

    // Cambiar estado visual del formulario
    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) btnGuardar.textContent = 'Actualizar Oración';
    document.getElementById('titulo-formulario').innerHTML = `<span class="material-symbols-outlined">edit_note</span> Editando: ${o.id}`;

    actualizarLivePreview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Guardar (crear o actualizar) oración
async function guardarOracion(e) {
    e.preventDefault();

    const id = document.getElementById('form-id').value.trim();
    const titulo = document.getElementById('form-titulo').value.trim();
    const tiempo = document.getElementById('form-tiempo').value;
    const semana = document.getElementById('form-semana').value;
    const dia = document.getElementById('form-dia').value;
    const libro = document.getElementById('form-libro').value;
    const oremos = document.getElementById('form-oremos')?.value?.trim() || '';
    const texto = document.getElementById('form-texto').value.trim();
    const conclusion = document.getElementById('form-conclusion').value.trim();
    const inputFechaCeleb = document.getElementById('form-fecha-celebracion');
    const fechaCelebracion = inputFechaCeleb?.value?.trim() || '';

    if (!id || !texto) {
        alert('Por favor complete al menos el ID y el texto de la oración.');
        return;
    }

    let santoNombre = '';
    if (tiempo === 'santos') {
        const selSem = document.getElementById('form-semana');
        const opt = selSem?.selectedOptions[0];
        santoNombre = opt?.getAttribute('data-nombre') || '';

        // Sincronizar fecha de celebración en el catálogo de santos
        if (fechaCelebracion && /^\d{1,2}\/\d{1,2}$/.test(fechaCelebracion)) {
            actualizarFechaCelebracionSanto(semana, fechaCelebracion);
        }
    }

    const oracionObj = {
        id,
        varName: `${id}_oracion`,
        titulo: titulo || `Oración - ${tiempo} - Semana ${semana} - ${dia} (${libro})`,
        tiempo,
        semana,
        dia: tiempo === 'santos' ? 'propio' : dia,
        libro,
        oremos,
        texto,
        conclusion,
        textoCompleto: texto,
        ...(tiempo === 'santos' ? { santoNombre, fechaCelebracion } : {})
    };

    const idx = listaOraciones.findIndex(item => item.id === id);
    if (idx >= 0) {
        listaOraciones[idx] = oracionObj;
        mostrarBannerEstado(`✅ Oración "${id}" actualizada correctamente.`, 'exito');
    } else {
        listaOraciones.push(oracionObj);
        mostrarBannerEstado(`✨ Nueva oración "${id}" registrada con éxito.`, 'exito');
    }

    // Persistir localmente
    localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));

    // Si Firebase está disponible, guardar directamente
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "oraciones_liturgia", id), oracionObj);
        }
    } catch (err) {
        console.warn('No se pudo sincronizar individualmente con Firebase:', err);
    }

    recordarParametros();
    limpiarFormulario(true);
    renderizarLista();
    actualizarLivePreview();
}

// Eliminar oración
async function eliminarOracion(id) {
    if (!confirm(`¿Eliminar definitivamente la oración "${id}"?`)) return;

    listaOraciones = listaOraciones.filter(item => item.id !== id);
    localStorage.setItem('lh_oracion_cache', JSON.stringify(listaOraciones));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "oraciones_liturgia", id));
        }
    } catch (e) {
        console.warn('Error al borrar de Firestore:', e);
    }

    if (editandoId === id) limpiarFormulario();
    renderizarLista();
    mostrarBannerEstado(`🗑️ Se eliminó la oración "${id}".`, 'alerta');
}

// Limpiar formulario y reiniciar estado
function limpiarFormulario(preservarParametros = true) {
    editandoId = null;

    const tiempoActual = document.getElementById('form-tiempo')?.value;
    const semanaActual = document.getElementById('form-semana')?.value;
    const diaActual = document.getElementById('form-dia')?.value;
    const libroActual = document.getElementById('form-libro')?.value;
    const fechaActual = document.getElementById('form-fecha-celebracion')?.value;

    const txtId = document.getElementById('form-id');
    const txtTitulo = document.getElementById('form-titulo');
    const txtOremos = document.getElementById('form-oremos');
    const txtTexto = document.getElementById('form-texto');
    const txtConcl = document.getElementById('form-conclusion');

    if (txtId) txtId.value = '';
    if (txtTitulo) txtTitulo.value = '';
    if (txtOremos) txtOremos.value = '';
    if (txtTexto) txtTexto.value = '';
    if (txtConcl) txtConcl.value = '';

    if (!preservarParametros) {
        document.getElementById('form-oracion')?.reset();
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

    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) btnGuardar.textContent = 'Guardar Oración';
    document.getElementById('titulo-formulario').innerHTML = `<span class="material-symbols-outlined">add_circle</span> Nueva Oración`;

    manejarCambioParametros();
    actualizarLivePreview();
}

// Subir todo el catálogo a Firebase Firestore
async function subirAFirebase() {
    if (!window.firebaseAPI || !window.firebaseAPI.db) {
        alert('Firebase no está disponible en este momento. Verifique la conexión.');
        return;
    }

    if (!confirm(`¿Desea subir ${listaOraciones.length} oraciones a la colección "oraciones_liturgia" de Firebase?`)) {
        return;
    }

    mostrarBannerEstado('Subiendo catálogo de oraciones a Firebase...', 'info');

    try {
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        let subidas = 0;

        for (const o of listaOraciones) {
            await setDoc(doc(window.firebaseAPI.db, "oraciones_liturgia", o.id), o);
            subidas++;
        }

        mostrarBannerEstado(`🚀 Éxito: Se subieron ${subidas} oraciones a Firebase Firestore.`, 'exito');
    } catch (error) {
        console.error('Error al subir a Firebase:', error);
        mostrarBannerEstado(`❌ Error al subir: ${error.message}`, 'alerta');
    }
}

// Exportar catálogo como archivo JSON
function exportarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaOraciones, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `oraciones_liturgia_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}
