/**
 * preces-manager.js
 * Controlador del Gestor de Preces e Intercesiones (preces.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Preces canónicas.
 * Precarga el catálogo canónico desde src/data/db-preces.js
 * Sincroniza con localStorage ('lh_preces_cache') y Firebase Firestore ('preces_liturgia').
 */

import { CATALOGO_PRECES_SEED, PrecesDB } from '../data/db-preces.js';
import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';
import { inicializarSearchableSantoSelect } from './searchable-santo.js';

let listaPreces = [];
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
        const libro = document.getElementById('form-libro')?.value || 'laudes';

        const params = { tiempo, semana, santoId, santoNombre, dia, fechaCeleb, libro };
        localStorage.setItem('lh_preces_ultimos_parametros', JSON.stringify(params));
        localStorage.setItem('lh_parametros_liturgicos_compartidos', JSON.stringify(params));
    } catch (_) {}
}

function restaurarParametros() {
    try {
        const raw = localStorage.getItem('lh_preces_ultimos_parametros') || localStorage.getItem('lh_parametros_liturgicos_compartidos');
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

// Buscar preces existente en memoria/catálogo
function buscarPrecesExistente(autoId, tiempo, semana, dia, libro) {
    if (!listaPreces || listaPreces.length === 0) return null;
    const norm = (s) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

    // 1. Coincidencia exacta por ID generado
    if (autoId) {
        const porId = listaPreces.find(p => p.id === autoId);
        if (porId) return porId;
    }

    if (tiempo === 'santos') {
        const idSantoNorm = norm(semana);
        return listaPreces.find(p => {
            if (p.tiempo !== 'santos' && !(p.id && p.id.startsWith('sa'))) return false;
            const libroMatch = (p.libro === libro) || (libro === 'laudes' && !p.libro);
            const pIdNorm = norm(p.id);
            const pSemNorm = norm(p.semana);
            const pNomNorm = norm(p.santoNombre);
            const santoMatch = idSantoNorm && (
                pIdNorm.includes(idSantoNorm) || idSantoNorm.includes(pIdNorm) ||
                pSemNorm.includes(idSantoNorm) || idSantoNorm.includes(pSemNorm) ||
                (pNomNorm && (pNomNorm.includes(idSantoNorm) || idSantoNorm.includes(pNomNorm)))
            );
            return libroMatch && santoMatch;
        });
    } else {
        return listaPreces.find(p => {
            if (p.tiempo !== tiempo) return false;
            const semMatch = String(p.semana) === String(semana);
            const diaMatch = norm(p.dia) === norm(dia);
            const libroMatch = p.libro === libro;
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
    const precesExistente = buscarPrecesExistente(autoId, tiempo, semana, dia, libro);

    const txtId = document.getElementById('form-id');
    const txtTitulo = document.getElementById('form-titulo');
    const txtIntro = document.getElementById('form-intro');
    const txtRespuesta = document.getElementById('form-respuesta');
    const txtIntenciones = document.getElementById('form-intenciones');
    const txtLibre = document.getElementById('form-libre');
    const txtConcl = document.getElementById('form-concl');
    const btnGuardar = document.getElementById('btn-guardar-texto');
    const tituloForm = document.getElementById('titulo-formulario');

    if (precesExistente) {
        editandoId = precesExistente.id;
        if (txtId) txtId.value = precesExistente.id || autoId;
        if (txtTitulo) txtTitulo.value = precesExistente.titulo || '';
        if (txtIntro) txtIntro.value = precesExistente.introduccion || '';
        if (txtRespuesta) txtRespuesta.value = precesExistente.respuesta || '';
        
        // Manejar intenciones array u objeto/string
        if (txtIntenciones) {
            if (Array.isArray(precesExistente.intenciones)) {
                txtIntenciones.value = precesExistente.intenciones.map(item => {
                    if (typeof item === 'string') return item;
                    return (item.peticion ? item.peticion + (item.respuesta ? '\n' + item.respuesta : '') : '');
                }).join('\n\n');
            } else {
                txtIntenciones.value = precesExistente.intenciones || '';
            }
        }
        if (txtLibre) txtLibre.value = precesExistente.oracionLibre || '';
        if (txtConcl) txtConcl.value = precesExistente.padrenuestro || precesExistente.conclusion || '';

        if (btnGuardar) btnGuardar.textContent = 'Actualizar Preces';
        if (tituloForm) tituloForm.innerHTML = `<span class="material-symbols-outlined">edit_note</span> Editando: ${precesExistente.id}`;
        mostrarBannerEstado(`📖 Preces existentes cargadas (${precesExistente.libro || libro}).`, 'info');
    } else {
        editandoId = null;
        if (txtId) txtId.value = autoId;
        if (txtTitulo) {
            const libroCap = libro.charAt(0).toUpperCase() + libro.slice(1);
            if (tiempo === 'santos') {
                const opt = selSemana?.selectedOptions[0];
                const sNom = opt?.getAttribute('data-nombre') || 'Santo';
                txtTitulo.value = `Preces - ${sNom} (${libroCap})`;
            } else {
                const diaCap = dia.charAt(0).toUpperCase() + dia.slice(1);
                txtTitulo.value = `Preces - Semana ${semana} - ${diaCap} (${libroCap})`;
            }
        }
        if (txtIntro) txtIntro.value = '';
        if (txtRespuesta) txtRespuesta.value = '';
        if (txtIntenciones) txtIntenciones.value = '';
        if (txtLibre) txtLibre.value = '';
        if (txtConcl) txtConcl.value = '';

        if (btnGuardar) btnGuardar.textContent = 'Guardar Preces';
        if (tituloForm) tituloForm.innerHTML = `<span class="material-symbols-outlined">add_circle</span> Nuevas Preces`;
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

// Cargar datos: primero desde Firestore/localStorage, con respaldo de db-preces.js
async function cargarDatos() {
    mostrarBannerEstado('Cargando preces canónicas...', 'info');

    // 1. Probar desde Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "preces_liturgia"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 5) {
                    listaPreces = desdeFb;
                    localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));
                    mostrarBannerEstado(`✅ Se cargaron ${listaPreces.length} preces desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para preces:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_preces_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 5) {
                listaPreces = parsed;
                mostrarBannerEstado(`📂 Cargadas ${listaPreces.length} preces desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback al catálogo semilla canónico
    if (Array.isArray(CATALOGO_PRECES_SEED) && CATALOGO_PRECES_SEED.length > 0) {
        listaPreces = [...CATALOGO_PRECES_SEED];
        localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));
        mostrarBannerEstado(`✨ Cargadas las ${listaPreces.length} preces canónicas desde el catálogo base.`, 'exito');
        return;
    }

    listaPreces = [];
    mostrarBannerEstado('No hay preces registradas. Agrega una nueva con el formulario.', 'alerta');
}

// Generar ID automático de preces
function generarIdAutomatico() {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const semana = selSemana?.value || '1';
    const dia = document.getElementById('form-dia')?.value || 'lunes';
    const libro = document.getElementById('form-libro')?.value || 'laudes';
    const inputFechaCeleb = document.getElementById('form-fecha-celebracion');

    const mapaHoras = {
        oficio: 'OF',
        laudes: 'LA',
        tercia: 'TE',
        sexta: 'SE',
        nona: 'NO',
        visperas: 'VI',
        completas: 'CO'
    };
    const horaAbrev = mapaHoras[libro] || 'LA';

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
        return `${canonico}${horaAbrev.toLowerCase()}_prec`;
    }

    const mapaDias = {
        domingo: 'do',
        lunes: 'lu',
        martes: 'ma',
        miercoles: 'mi',
        jueves: 'ju',
        viernes: 'vi',
        sabado: 'sa'
    };
    const diaAbrev = mapaDias[dia] || 'lu';

    let prefix = 'to';
    if (tiempo === 'adviento') prefix = 'adv';
    else if (tiempo === 'navidad') prefix = 'nav';
    else if (tiempo === 'cuaresma') prefix = 'cua';
    else if (tiempo === 'pascua') prefix = 'pas';

    return `${prefix}s${semana}${horaAbrev.toLowerCase()}${diaAbrev}_preces`;
}

// Configurar listeners de la interfaz
function configurarEventos() {
    // Botón Restaurar Catálogo Base
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_PRECES_SEED) || CATALOGO_PRECES_SEED.length === 0) {
            alert('El catálogo de preces no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer las ${CATALOGO_PRECES_SEED.length} preces originales?`)) return;
        listaPreces = [...CATALOGO_PRECES_SEED];
        localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));
        renderizarLista();
        limpiarFormulario();
        mostrarBannerEstado(`🔄 Se restauraron las ${listaPreces.length} preces del catálogo base.`, 'exito');
    });

    const form = document.getElementById('form-preces');
    if (form) {
        form.addEventListener('submit', guardarPreces);

        // Actualizar Live Preview en tiempo real al escribir
        ['form-titulo', 'form-intro', 'form-respuesta', 'form-intenciones', 'form-libre', 'form-concl'].forEach(id => {
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

        // Cambio en día y libro
        ['form-dia', 'form-libro'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => {
                recordarParametros();
                manejarCambioParametros();
            });
        });
    }

    // Botón Limpiar Formulario (preserva parámetros litúrgicos)
    document.getElementById('btn-limpiar-form')?.addEventListener('click', () => limpiarFormulario(true));

    // Botón Subir a Firebase
    document.getElementById('btn-subir-semilla')?.addEventListener('click', subirAFirebase);

    // Botón Exportar JSON
    document.getElementById('btn-exportar-json')?.addEventListener('click', exportarJSON);

    // Filtros de búsqueda
    ['filtro-busqueda', 'filtro-tiempo', 'filtro-dia', 'filtro-libro'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', renderizarLista);
    });
}

// Actualizar la vista previa en el pergamino litúrgico
function actualizarLivePreview() {
    const idVal = document.getElementById('form-id')?.value.trim() || 'Preces';
    const tituloVal = document.getElementById('form-titulo')?.value.trim() || 'PRECES';
    const introVal = document.getElementById('form-intro')?.value.trim() || 'Invoquemos a Cristo nuestro Salvador, diciendo:';
    const respVal = document.getElementById('form-respuesta')?.value.trim() || 'Escúchanos, Señor.';
    const intencionesVal = document.getElementById('form-intenciones')?.value.trim() || 'Te bendecimos, Señor, por este nuevo día.\nGuía nuestros pasos en tu paz.';
    const libreVal = document.getElementById('form-libre')?.value.trim() || 'Se pueden añadir algunas intenciones libres';
    const conclVal = document.getElementById('form-concl')?.value.trim() || 'Terminemos nuestra oración con la plegaria que Cristo nos enseñó:';

    const pBadge = document.getElementById('preview-id-badge');
    if (pBadge) pBadge.textContent = idVal;

    const pTitulo = document.getElementById('preview-titulo');
    if (pTitulo) pTitulo.textContent = 'PRECES';

    const pIntro = document.getElementById('preview-intro');
    if (pIntro) pIntro.textContent = introVal;

    const pResp = document.getElementById('preview-respuesta');
    if (pResp) pResp.textContent = respVal;

    const pIntenciones = document.getElementById('preview-intenciones');
    if (pIntenciones) {
        const estrofas = intencionesVal.split(/\n\s*\n/).filter(Boolean);
        pIntenciones.innerHTML = estrofas.map(est => `
            <div class="preview-intencion-item">${est.replace(/\n/g, '<br>')}</div>
        `).join('');
    }

    const pLibre = document.getElementById('preview-libre');
    if (pLibre) pLibre.textContent = libreVal;

    const pConcl = document.getElementById('preview-concl');
    if (pConcl) {
        const parrafos = conclVal.split(/\n\s*\n/).filter(Boolean);
        if (parrafos.length > 0) {
            pConcl.innerHTML = parrafos.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
        } else {
            pConcl.innerHTML = '';
        }
    }
}

// Renderizar la tabla del catálogo
function renderizarLista() {
    const contenedor = document.getElementById('cuerpo-tabla-preces');
    if (!contenedor) return;

    const fTexto = (document.getElementById('filtro-busqueda')?.value || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const fTiempo = document.getElementById('filtro-tiempo')?.value || 'todos';
    const fDia = document.getElementById('filtro-dia')?.value || 'todos';
    const fLibro = document.getElementById('filtro-libro')?.value || 'todos';

    const filtradas = listaPreces.filter(p => {
        if (fTiempo !== 'todos' && p.tiempo !== fTiempo) return false;
        if (fDia !== 'todos' && p.dia !== fDia) return false;
        if (fLibro !== 'todos' && p.libro !== fLibro) return false;
        if (fTexto) {
            const tit = (p.titulo || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const intro = (p.intro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const resp = (p.respuesta || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const ints = (Array.isArray(p.intenciones) ? p.intenciones.join(' ') : (p.intenciones || '')).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const pId = (p.id || '').toLowerCase();
            const sNom = (p.santoNombre || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            let coincideFecha = false;
            const rawFecha = p.fechaCelebracion || '';
            let mF = rawFecha.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
            if (!mF) mF = (p.id || '').match(/^sa(\d{2})(\d{2})/i);
            if (!mF) mF = (p.titulo || '').match(/\((\d{1,2})[\/\-](\d{1,2})\)/);
            if (mF) {
                const dd = String(parseInt(mF[1], 10)).padStart(2, '0');
                const mm = String(parseInt(mF[2], 10)).padStart(2, '0');
                const d = String(parseInt(mF[1], 10));
                const m = String(parseInt(mF[2], 10));
                const variantes = [`${dd}/${mm}`, `${d}/${m}`, `${d}/${mm}`, `${dd}/${m}`, `${dd}-${mm}`, `${d}-${m}`, `${dd}${mm}`];
                coincideFecha = variantes.some(v => v.includes(fTexto) || fTexto.includes(v));
            }

            return tit.includes(fTexto) || intro.includes(fTexto) || resp.includes(fTexto) || ints.includes(fTexto) || pId.includes(fTexto) || sNom.includes(fTexto) || coincideFecha;
        }
        return true;
    });

    const contador = document.getElementById('contador-preces');
    if (contador) contador.textContent = `(${filtradas.length} de ${listaPreces.length})`;

    if (filtradas.length === 0) {
        contenedor.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 30px;">No se encontraron preces con los filtros seleccionados.</td></tr>`;
        return;
    }

    contenedor.innerHTML = filtradas.map(p => {
        const esActivo = p.id === editandoId ? 'class="activo"' : '';
        const esSanto = p.tiempo === 'santos' || (p.id && p.id.startsWith('sa'));
        let diaNombre;
        let semTxt;

        if (esSanto) {
            const nomb = p.santoNombre || p.titulo || p.id;
            const fec = p.fechaCelebracion ? ` (${p.fechaCelebracion})` : '';
            diaNombre = `<span class="badge-tag santos">😇 ${nomb}${fec}</span>`;
            semTxt = '';
        } else {
            diaNombre = p.dia ? p.dia.charAt(0).toUpperCase() + p.dia.slice(1) : '';
            semTxt = p.semana ? `S${p.semana}` : '';
        }

        const numInts = Array.isArray(p.intenciones) ? p.intenciones.length : (p.intenciones ? p.intenciones.split(/\n\s*\n/).length : 0);
        return `
            <tr ${esActivo} data-id="${p.id}">
                <td><strong style="color: var(--accent-red); font-family: monospace;">${p.id}</strong></td>
                <td><span style="font-weight: 600;">${p.titulo || p.id}</span></td>
                <td><span style="text-transform: capitalize; color: #93c5fd;">${p.tiempo}</span> ${semTxt}</td>
                <td>${diaNombre}</td>
                <td><span style="background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${numInts} peticiones</span></td>
                <td class="col-acciones">
                    <button class="btn-accion-mini btn-editar" title="Editar Preces" data-id="${p.id}">
                        <span class="material-symbols-outlined" style="font-size: 15px;">edit</span>
                    </button>
                    <button class="btn-accion-mini eliminar btn-eliminar" title="Eliminar" data-id="${p.id}">
                        <span class="material-symbols-outlined" style="font-size: 15px;">delete</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Eventos de edición y eliminación
    contenedor.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            cargarEnFormulario(btn.dataset.id);
        });
    });

    contenedor.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarPreces(btn.dataset.id);
        });
    });

    contenedor.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', () => {
            if (tr.dataset.id) cargarEnFormulario(tr.dataset.id);
        });
    });
}

// Cargar item en el formulario para editar
function cargarEnFormulario(id) {
    const item = listaPreces.find(p => p.id === id);
    if (!item) return;

    editandoId = item.id;

    document.getElementById('form-id').value = item.id;
    document.getElementById('form-id').disabled = true;
    document.getElementById('form-titulo').value = item.titulo || '';
    document.getElementById('form-tiempo').value = item.tiempo || 'ordinario';
    
    actualizarModoTiempo(item.semana);

    if (item.tiempo === 'santos') {
        const inputFecha = document.getElementById('form-fecha-celebracion');
        if (inputFecha) inputFecha.value = item.fechaCelebracion || '';
    } else {
        document.getElementById('form-dia').value = item.dia || 'lunes';
    }

    document.getElementById('form-libro').value = item.libro || 'laudes';
    document.getElementById('form-intro').value = item.intro || '';
    document.getElementById('form-respuesta').value = item.respuesta || '';

    const intencionesTxt = Array.isArray(item.intenciones) 
        ? item.intenciones.join('\n\n') 
        : (item.intenciones || '');
    document.getElementById('form-intenciones').value = intencionesTxt;

    document.getElementById('form-libre').value = item.libre || 'Se pueden añadir algunas intenciones libres';
    document.getElementById('form-concl').value = item.concl || '';

    const btnSubmit = document.getElementById('btn-guardar-form');
    if (btnSubmit) {
        btnSubmit.innerHTML = `<span class="material-symbols-outlined">save</span> Actualizar Preces`;
    }

    renderizarLista();
    actualizarLivePreview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Limpiar formulario para nuevo registro
function limpiarFormulario(preservarParametros = true) {
    editandoId = null;

    const tiempoActual = document.getElementById('form-tiempo')?.value;
    const semanaActual = document.getElementById('form-semana')?.value;
    const diaActual = document.getElementById('form-dia')?.value;
    const fechaActual = document.getElementById('form-fecha-celebracion')?.value;
    const libroActual = document.getElementById('form-libro')?.value;

    const txtIntro = document.getElementById('form-intro');
    const txtRespuesta = document.getElementById('form-respuesta');
    const txtIntenciones = document.getElementById('form-intenciones');
    const txtLibre = document.getElementById('form-libre');
    const txtConcl = document.getElementById('form-concl');

    if (txtIntro) txtIntro.value = '';
    if (txtRespuesta) txtRespuesta.value = '';
    if (txtIntenciones) txtIntenciones.value = '';
    if (txtLibre) txtLibre.value = 'Se pueden añadir algunas intenciones libres';
    if (txtConcl) txtConcl.value = 'Terminemos nuestra oración con la plegaria que Cristo nos enseñó:';

    if (!preservarParametros) {
        const form = document.getElementById('form-preces');
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

    const inputId = document.getElementById('form-id');
    if (inputId) {
        inputId.disabled = false;
        inputId.value = '';
    }

    const btnSubmit = document.getElementById('btn-guardar-form');
    if (btnSubmit) {
        btnSubmit.innerHTML = `<span class="material-symbols-outlined">add_task</span> Guardar Preces`;
    }

    manejarCambioParametros();
    renderizarLista();
    actualizarLivePreview();
}

// Guardar o Actualizar Preces
async function guardarPreces(e) {
    e.preventDefault();

    const id = document.getElementById('form-id').value.trim();
    if (!id) {
        alert('Por favor especifica un ID primario único.');
        return;
    }

    const titulo = document.getElementById('form-titulo').value.trim();
    const tiempo = document.getElementById('form-tiempo').value;
    const semana = document.getElementById('form-semana').value;
    const dia = document.getElementById('form-dia').value;
    const libro = document.getElementById('form-libro').value;
    const intro = document.getElementById('form-intro').value.trim();
    const respuesta = document.getElementById('form-respuesta').value.trim();
    const intencionesRaw = document.getElementById('form-intenciones').value.trim();
    const intenciones = intencionesRaw.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    const libre = document.getElementById('form-libre').value.trim();
    const concl = document.getElementById('form-concl').value.trim();
    const inputFechaCeleb = document.getElementById('form-fecha-celebracion');
    const fechaCelebracion = inputFechaCeleb?.value?.trim() || '';

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

    const nuevoObjeto = {
        id,
        varName: id,
        titulo: titulo || `Preces ${id}`,
        tiempo,
        semana,
        dia: tiempo === 'santos' ? 'propio' : dia,
        libro,
        intro,
        respuesta,
        intenciones,
        libre,
        concl,
        textoCompleto: `${intro}\n\n${respuesta}\n\n${intenciones.join('\n\n')}`,
        ...(tiempo === 'santos' ? { santoNombre, fechaCelebracion } : {})
    };

    const idx = listaPreces.findIndex(p => p.id === id);
    if (idx >= 0) {
        listaPreces[idx] = nuevoObjeto;
        mostrarBannerEstado(`✅ Preces "${id}" actualizadas exitosamente.`, 'exito');
    } else {
        listaPreces.unshift(nuevoObjeto);
        mostrarBannerEstado(`✨ Preces "${id}" registradas exitosamente.`, 'exito');
    }

    localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));
    recordarParametros();

    // Si Firebase está activo, guardar también en Firestore
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "preces_liturgia", id), nuevoObjeto);
        }
    } catch (err) {
        console.warn('No se pudo guardar en Firestore inmediatamente:', err);
    }

    limpiarFormulario(true);
}

// Eliminar Preces
async function eliminarPreces(id) {
    if (!confirm(`¿Estás seguro de eliminar las preces "${id}"?`)) return;

    listaPreces = listaPreces.filter(p => p.id !== id);
    localStorage.setItem('lh_preces_cache', JSON.stringify(listaPreces));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "preces_liturgia", id));
        }
    } catch (err) {
        console.warn('Error al eliminar en Firestore:', err);
    }

    if (editandoId === id) limpiarFormulario();
    renderizarLista();
    mostrarBannerEstado(`🗑️ Preces "${id}" eliminadas.`, 'alerta');
}

// Subir todo el catálogo a Firebase Firestore
async function subirAFirebase() {
    if (!listaPreces || listaPreces.length === 0) {
        alert('No hay preces para sincronizar.');
        return;
    }

    if (!confirm(`¿Subir ${listaPreces.length} preces a la colección 'preces_liturgia' en Firebase Firestore?`)) return;

    mostrarBannerEstado('Subiendo catálogo a Firebase Firestore...', 'info');

    try {
        if (!window.firebaseAPI || !window.firebaseAPI.db) {
            throw new Error('Firebase no está inicializado o no hay conexión.');
        }

        const { doc, writeBatch } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        const batch = writeBatch(window.firebaseAPI.db);

        // Firestore admite hasta 500 escrituras por batch
        let subidas = 0;
        for (const item of listaPreces) {
            const ref = doc(window.firebaseAPI.db, "preces_liturgia", item.id);
            batch.set(ref, item);
            subidas++;
            if (subidas >= 450) break;
        }

        await batch.commit();
        mostrarBannerEstado(`🎉 ¡Éxito! Se subieron ${subidas} preces a Firestore en tiempo real.`, 'exito');
    } catch (e) {
        console.error('Error al subir a Firebase:', e);
        alert('Fallo al subir a Firebase: ' + (e.message || e));
        mostrarBannerEstado('Error en la sincronización con Firebase.', 'alerta');
    }
}

// Exportar como archivo JSON descargable
function exportarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaPreces, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `catalogo_preces_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    mostrarBannerEstado('📥 Archivo JSON descargado exitosamente.', 'exito');
}
