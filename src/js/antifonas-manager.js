// =========================================================================
// CONTROLADOR DEL GESTOR DE ANTÍFONAS LITÚRGICAS (antifonas-manager.js)
// =========================================================================

import { CATALOGO_ANTIFONAS_SEED } from '../data/db-antifonas.js';
import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';
import { inicializarSearchableSantoSelect } from './searchable-santo.js';

let listaAntifonas = [];
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

// Tiempos litúrgicos y configuración de semanas
const TIEMPOS_CONFIG = {
    adviento: { nombre: 'Adviento', semanas: 4, tieneDias: true },
    navidad: { nombre: 'Navidad', semanas: 2, tieneDias: true },
    ordinario: { nombre: 'Tiempo Ordinario', semanas: 34, tieneDias: true },
    cuaresma: { nombre: 'Cuaresma', semanas: 7, tieneDias: true },
    pascua: { nombre: 'Pascua', semanas: 7, tieneDias: true },
    santos: { nombre: 'Santos (Calendario)', semanas: 0, tieneDias: false, esFecha: true }
};

document.addEventListener('DOMContentLoaded', async () => {
    inicializarSelectores();
    await cargarDatos();
    configurarEventos();
    renderizarLista();
});

// Inicializar y sincronizar selects dinámicos (Semana y Día según Tiempo)
function inicializarSelectores() {
    const selTiempo = document.getElementById('form-tiempo');
    const selSemana = document.getElementById('form-semana');
    const selDia = document.getElementById('form-dia');
    const boxSantoContainer = document.getElementById('box-santo-container');
    const selSanto = document.getElementById('form-santo-select');
    const inputFecha = document.getElementById('form-fecha');
    const inputSantoHidden = document.getElementById('form-santo');

    function poblarSelectSantos(santoSeleccionado = null) {
        if (!selSanto) return;
        const santos = obtenerCatalogoSantos();
        const listaOrdenada = [...santos].sort((a, b) => {
            return (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' });
        });

        selSanto.innerHTML = '<option value="">-- Selecciona un Santo --</option>';
        listaOrdenada.forEach(s => {
            const idSanto = generarIdSanto(s);
            const { texto: fechaTexto } = extraerDiaMesCelebracion(s);
            const opt = document.createElement('option');
            opt.value = idSanto;
            opt.textContent = `${s.nombre} (${fechaTexto})`;
            opt.setAttribute('data-nombre', s.nombre);
            opt.setAttribute('data-fecha', fechaTexto);
            selSanto.appendChild(opt);
        });

        if (santoSeleccionado) {
            const match = Array.from(selSanto.options).find(o => 
                o.value === santoSeleccionado || 
                o.getAttribute('data-nombre') === santoSeleccionado
            );
            if (match) selSanto.value = match.value;
        }

        inicializarSearchableSantoSelect(selSanto, {
            placeholder: 'Buscar santo...',
            onChange: (val, opt) => {
                if (opt && val) {
                    if (inputFecha) inputFecha.value = opt.getAttribute('data-fecha') || '';
                    if (inputSantoHidden) inputSantoHidden.value = opt.getAttribute('data-nombre') || '';
                } else {
                    if (inputSantoHidden) inputSantoHidden.value = '';
                }
            }
        });
        if (selSanto._customSantoContainer) {
            selSanto._customSantoContainer.style.display = 'block';
        }
    }

    selSanto?.addEventListener('change', () => {
        const opt = selSanto.selectedOptions[0];
        if (opt && opt.value) {
            if (inputFecha) inputFecha.value = opt.getAttribute('data-fecha') || '';
            if (inputSantoHidden) inputSantoHidden.value = opt.getAttribute('data-nombre') || '';
        } else {
            if (inputSantoHidden) inputSantoHidden.value = '';
        }
    });

    function actualizarOpcionesTiempo() {
        const tiempo = selTiempo.value;
        const cfg = TIEMPOS_CONFIG[tiempo] || { semanas: 0 };

        // Limpiar y repoblar semanas
        selSemana.innerHTML = '<option value="">Cualquiera / No aplica</option>';
        if (cfg.semanas > 0) {
            for (let i = 1; i <= cfg.semanas; i++) {
                let extra = '';
                if (tiempo === 'ordinario') {
                    extra = i <= 9 ? ' (Bloque 1)' : ' (Bloque 2)';
                }
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = `Semana ${i}${extra}`;
                selSemana.appendChild(opt);
            }
            selSemana.disabled = false;
        } else {
            selSemana.disabled = true;
        }

        // Mostrar / ocultar campos específicos de Santos
        if (tiempo === 'santos') {
            if (boxSantoContainer) boxSantoContainer.style.display = 'block';
            poblarSelectSantos();
            selDia.disabled = true;
        } else {
            if (boxSantoContainer) boxSantoContainer.style.display = 'none';
            selDia.disabled = false;
        }
    }

    selTiempo.addEventListener('change', actualizarOpcionesTiempo);
    actualizarOpcionesTiempo();
}

// Cargar datos: primero desde Firestore, con fallback a localStorage y catálogo semilla
async function cargarDatos() {
    mostrarBannerEstado('Cargando antífonas desde Firebase...', 'info');

    try {
        if (window.firebaseAPI && window.firebaseAPI.cargarAntifonasFirestore) {
            const desdeFirestore = await window.firebaseAPI.cargarAntifonasFirestore();
            if (desdeFirestore && desdeFirestore.length > 0) {
                listaAntifonas = desdeFirestore;
                localStorage.setItem('lh_antifonas_cache', JSON.stringify(listaAntifonas));
                mostrarBannerEstado(`✅ Se cargaron ${listaAntifonas.length} antífonas desde Firestore.`, 'exito');
                return;
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore, usando respaldo local:', e);
    }

    // Fallback a caché local o catálogo semilla
    const cacheLocal = localStorage.getItem('lh_antifonas_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            // Si la caché tiene al menos 50 antífonas, es un catálogo representativo
            if (Array.isArray(parsed) && parsed.length >= 50) {
                listaAntifonas = parsed;
                mostrarBannerEstado(`📂 Cargadas ${listaAntifonas.length} antífonas desde caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    listaAntifonas = [...CATALOGO_ANTIFONAS_SEED];
    localStorage.setItem('lh_antifonas_cache', JSON.stringify(listaAntifonas));
    mostrarBannerEstado(`✨ Cargadas las 131 antífonas del catálogo base desde antifonas.js.`, 'exito');
}

// Buscar antífona existente en memoria/catálogo
function buscarAntifonaExistente(tiempo, semana, dia, fecha, santo, libro, tipo) {
    if (!listaAntifonas || listaAntifonas.length === 0) return null;
    const norm = (s) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

    if (tiempo === 'santos') {
        const santoNorm = norm(santo);
        const fechaNorm = (fecha || '').trim();
        return listaAntifonas.find(a => {
            if (a.tiempo !== 'santos') return false;
            const libroMatch = (a.libro === libro) || (libro === 'general') || (a.libro === 'general');
            const tipoMatch = a.tipo === tipo;
            const santoMatch = santoNorm && (norm(a.santo).includes(santoNorm) || santoNorm.includes(norm(a.santo)) || norm(a.id).includes(santoNorm));
            const fechaMatch = fechaNorm && (a.fecha === fechaNorm || (a.id && a.id.includes(fechaNorm.replace('/', '_'))));
            return libroMatch && tipoMatch && (santoMatch || fechaMatch);
        });
    } else {
        return listaAntifonas.find(a => {
            if (a.tiempo !== tiempo) return false;
            const semMatch = (!semana && !a.semana) || (Number(a.semana) === Number(semana));
            const diaMatch = (!dia && !a.dia) || (norm(a.dia) === norm(dia));
            const libroMatch = a.libro === libro;
            const tipoMatch = a.tipo === tipo;
            return semMatch && diaMatch && libroMatch && tipoMatch;
        });
    }
}

// Coordinar cambio de parámetros (Santo, Tiempo, Semana, Día, Libro, Tipo)
function manejarCambioParametros() {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const semanaVal = document.getElementById('form-semana')?.value;
    const semana = semanaVal ? parseInt(semanaVal, 10) : null;
    const dia = document.getElementById('form-dia')?.value || null;
    const fecha = document.getElementById('form-fecha')?.value?.trim() || null;
    const selSanto = document.getElementById('form-santo-select');
    const optSanto = selSanto?.selectedOptions[0];
    const santo = (tiempo === 'santos' && optSanto && optSanto.value) 
        ? optSanto.getAttribute('data-nombre') 
        : (document.getElementById('form-santo')?.value?.trim() || null);
    const libro = document.getElementById('form-libro')?.value || 'laudes';
    const tipo = document.getElementById('form-tipo')?.value || 'invitatoria';

    const antifonaExistente = buscarAntifonaExistente(tiempo, semana, dia, fecha, santo, libro, tipo);
    const txtArea = document.getElementById('form-texto');
    const btnSubmit = document.querySelector('#form-antifona button[type="submit"]');

    if (antifonaExistente) {
        editandoId = antifonaExistente.id;
        if (txtArea) txtArea.value = antifonaExistente.texto || '';
        if (btnSubmit) btnSubmit.innerHTML = '<span class="material-symbols-outlined">update</span> Actualizar Antífona';
        mostrarBannerEstado(`📖 Antífona existente cargada (${antifonaExistente.libro} • ${formatearTipo(antifonaExistente.tipo)}).`, 'info');
    } else {
        editandoId = null;
        if (txtArea) txtArea.value = '';
        if (btnSubmit) btnSubmit.innerHTML = '<span class="material-symbols-outlined">save</span> Guardar Antífona';
    }
}

function configurarEventos() {
    // Formulario guardar
    const form = document.getElementById('form-antifona');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarAntifona();
    });

    // Botón Limpiar
    document.getElementById('btn-limpiar-form')?.addEventListener('click', limpiarFormulario);

    // Cambio en parámetros del formulario para auto-cargar si existe o preparar nuevo
    ['form-semana', 'form-dia', 'form-libro', 'form-tipo'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            manejarCambioParametros();
        });
    });

    document.getElementById('form-fecha')?.addEventListener('input', () => {
        manejarCambioParametros();
    });

    // Botón "+ Aleluya."
    document.getElementById('btn-add-aleluya')?.addEventListener('click', () => {
        const txt = document.getElementById('form-texto');
        if (txt) {
            txt.value = txt.value.trim().replace(/\.*$/, '') + '. Aleluya.';
        }
    });

    // Filtros de búsqueda en la lista
    document.getElementById('filtro-buscar')?.addEventListener('input', renderizarLista);
    document.getElementById('filtro-tiempo')?.addEventListener('change', renderizarLista);
    document.getElementById('filtro-libro')?.addEventListener('change', renderizarLista);
    document.getElementById('filtro-tipo')?.addEventListener('change', renderizarLista);

    // Botón Subir Semilla a Firebase
    document.getElementById('btn-subir-semilla')?.addEventListener('click', async () => {
        if (!confirm(`¿Deseas subir el catálogo completo (${listaAntifonas.length} antífonas) a Firebase Firestore?`)) return;
        mostrarBannerEstado('Subiendo antífonas en lotes a Firestore...', 'info');
        try {
            if (window.firebaseAPI && window.firebaseAPI.guardarLoteAntifonasFirestore) {
                const count = await window.firebaseAPI.guardarLoteAntifonasFirestore(listaAntifonas);
                mostrarBannerEstado(`🎉 ¡Éxito! Se sincronizaron ${count} antífonas en Firestore.`, 'exito');
            } else {
                alert('Firebase API no está disponible.');
            }
        } catch (e) {
            mostrarBannerEstado(`❌ Error al subir: ${e.message}`, 'alerta');
        }
    });

    // Botón Exportar JSON
    document.getElementById('btn-exportar-json')?.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaAntifonas, null, 2));
        const dl = document.createElement('a');
        dl.setAttribute("href", dataStr);
        dl.setAttribute("download", `antifonas_backup_${new Date().toISOString().split('T')[0]}.json`);
        dl.click();
    });

    // Botón Generar Archivo JS de Respaldo
    document.getElementById('btn-exportar-js')?.addEventListener('click', () => {
        const jsCode = `// Respaldo de Antífonas Litúrgicas generado el ${new Date().toLocaleString()}\nexport const CATALOGO_ANTIFONAS_SEED = ${JSON.stringify(listaAntifonas, null, 2)};\n`;
        const blob = new Blob([jsCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'db-antifonas.js';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Botón Restaurar Catálogo Base Completo (131)
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!confirm(`¿Restablecer el catálogo con las 131 antífonas originales de db-antifonas.js?`)) return;
        listaAntifonas = [...CATALOGO_ANTIFONAS_SEED];
        localStorage.setItem('lh_antifonas_cache', JSON.stringify(listaAntifonas));
        renderizarLista();
        mostrarBannerEstado(`🔄 Catálogo restaurado con éxito (${listaAntifonas.length} antífonas).`, 'exito');
    });

    // Botón Importar JSON
    const inputImportar = document.getElementById('input-importar-json');
    document.getElementById('btn-importar-json')?.addEventListener('click', () => inputImportar.click());
    inputImportar?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const importados = JSON.parse(evt.target.result);
                if (Array.isArray(importados)) {
                    listaAntifonas = importados;
                    localStorage.setItem('lh_antifonas_cache', JSON.stringify(listaAntifonas));
                    renderizarLista();
                    mostrarBannerEstado(`✅ Se importaron ${importados.length} antífonas correctamente.`, 'exito');
                }
            } catch (err) {
                alert('Error al leer el archivo JSON: ' + err.message);
            }
        };
        reader.readAsText(file);
    });
}

// Guardar o Actualizar antífona individual
async function guardarAntifona() {
    const tiempo = document.getElementById('form-tiempo').value;
    const semanaVal = document.getElementById('form-semana').value;
    const semana = semanaVal ? parseInt(semanaVal, 10) : null;
    const dia = document.getElementById('form-dia').value || null;
    const fecha = document.getElementById('form-fecha')?.value.trim() || null;
    const selSanto = document.getElementById('form-santo-select');
    const optSanto = selSanto?.selectedOptions[0];
    const santo = (tiempo === 'santos' && optSanto && optSanto.value) 
        ? optSanto.getAttribute('data-nombre') 
        : (document.getElementById('form-santo')?.value.trim() || null);
    const libro = document.getElementById('form-libro').value;
    const tipo = document.getElementById('form-tipo').value;
    const texto = document.getElementById('form-texto').value.trim();

    if (!texto) {
        alert('Por favor escribe el texto de la antífona.');
        return;
    }

    // Sincronizar fecha de celebración en catálogo de santos si es tiempo santos
    if (tiempo === 'santos' && optSanto && optSanto.value && fecha && /^\d{1,2}\/\d{1,2}$/.test(fecha)) {
        actualizarFechaCelebracionSanto(optSanto.value, fecha);
    }

    const diaFechaLimpia = (dia || fecha || 'gen').replace(/\//g, '_');
    const docId = (editandoId || `${tiempo}_s${semana || '0'}_${diaFechaLimpia}_${libro}_${tipo}_${Date.now()}`).replace(/\//g, '_');
    const payload = {
        id: docId,
        tiempo,
        semana,
        dia,
        fecha,
        santo,
        libro,
        tipo,
        texto,
        ultimaActualizacion: new Date().toISOString()
    };

    // Guardar en Firestore si está disponible
    mostrarBannerEstado('Guardando antífona...', 'info');
    try {
        if (window.firebaseAPI && window.firebaseAPI.guardarAntifonaFirestore) {
            await window.firebaseAPI.guardarAntifonaFirestore(payload);
        }
    } catch (e) {
        console.warn('No se pudo guardar en Firestore directamente (se guardará en local):', e);
    }

    // Actualizar lista en memoria y localStorage
    const idx = listaAntifonas.findIndex(a => a.id === docId);
    if (idx >= 0) {
        listaAntifonas[idx] = payload;
    } else {
        listaAntifonas.unshift(payload);
    }
    localStorage.setItem('lh_antifonas_cache', JSON.stringify(listaAntifonas));

    mostrarBannerEstado(`✅ Antífona guardada exitosamente.`, 'exito');
    limpiarFormulario();
    renderizarLista();
}

function limpiarFormulario() {
    editandoId = null;
    document.getElementById('form-texto').value = '';
    const inpFecha = document.getElementById('form-fecha');
    if (inpFecha) inpFecha.value = '';
    const inpSanto = document.getElementById('form-santo');
    if (inpSanto) inpSanto.value = '';
    const selSanto = document.getElementById('form-santo-select');
    if (selSanto) selSanto.value = '';

    const btnSubmit = document.querySelector('#form-antifona button[type="submit"]');
    if (btnSubmit) btnSubmit.innerHTML = '<span class="material-symbols-outlined">save</span> Guardar Antífona';
}

// Renderizar tabla y lista filtrada
function renderizarLista() {
    const contenedor = document.getElementById('lista-antifonas-items');
    if (!contenedor) return;

    const query = (document.getElementById('filtro-buscar')?.value || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const fTiempo = document.getElementById('filtro-tiempo')?.value || '';
    const fLibro = document.getElementById('filtro-libro')?.value || '';
    const fTipo = document.getElementById('filtro-tipo')?.value || '';

    const filtradas = listaAntifonas.filter(item => {
        if (fTiempo && item.tiempo !== fTiempo) return false;
        if (fLibro && item.libro !== fLibro) return false;
        if (fTipo && item.tipo !== fTipo) return false;
        if (query) {
            const txt = (item.texto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const santo = (item.santo || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (!txt.includes(query) && !santo.includes(query)) return false;
        }
        return true;
    });

    document.getElementById('contador-antifonas').textContent = `${filtradas.length} de ${listaAntifonas.length}`;

    if (filtradas.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No se encontraron antífonas con los filtros seleccionados.</p>';
        return;
    }

    contenedor.innerHTML = filtradas.map(item => {
        const semanaTxt = item.semana ? `Semana ${item.semana}` : '';
        const diaTxt = item.dia ? capitalizar(item.dia) : (item.fecha || '');
        const santoTxt = item.santo ? `• 😇 ${item.santo}` : '';
        
        return `
            <div class="antifona-card-item" data-id="${item.id}">
                <div class="antifona-meta">
                    <span class="badge badge-tiempo">${item.tiempo}</span>
                    ${semanaTxt ? `<span class="badge badge-dia">${semanaTxt}</span>` : ''}
                    ${diaTxt ? `<span class="badge badge-dia">${diaTxt}</span>` : ''}
                    <span class="badge badge-libro">${item.libro}</span>
                    <span class="badge badge-tipo">${formatearTipo(item.tipo)}</span>
                    ${santoTxt ? `<span style="font-size: 0.8rem; color: #fbbf24; font-weight: 600;">${santoTxt}</span>` : ''}
                </div>
                <div class="antifona-texto-cuerpo">
                    "${item.texto}"
                </div>
                <div class="antifona-acciones">
                    <button class="btn-accion-icono" onclick="copiarTexto('${escapeAttr(item.texto)}')" title="Copiar texto">
                        <span class="material-symbols-outlined">content_copy</span>
                    </button>
                    <button class="btn-accion-icono" onclick="editarAntifona('${item.id}')" title="Editar">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-accion-icono borrar" onclick="borrarAntifona('${item.id}')" title="Eliminar">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

window.editarAntifona = (id) => {
    const item = listaAntifonas.find(a => a.id === id);
    if (!item) return;
    editandoId = id;
    document.getElementById('form-tiempo').value = item.tiempo;
    document.getElementById('form-tiempo').dispatchEvent(new Event('change'));
    if (item.semana) document.getElementById('form-semana').value = item.semana;
    if (item.dia) document.getElementById('form-dia').value = item.dia;
    if (item.fecha) document.getElementById('form-fecha').value = item.fecha;
    if (item.santo) {
        document.getElementById('form-santo').value = item.santo;
        const selSanto = document.getElementById('form-santo-select');
        if (selSanto) {
            const opt = Array.from(selSanto.options).find(o => 
                o.getAttribute('data-nombre') === item.santo || 
                o.value === item.santo
            );
            if (opt) selSanto.value = opt.value;
        }
    }
    document.getElementById('form-libro').value = item.libro;
    document.getElementById('form-tipo').value = item.tipo;
    document.getElementById('form-texto').value = item.texto;

    const btnSubmit = document.querySelector('#form-antifona button[type="submit"]');
    if (btnSubmit) btnSubmit.innerHTML = '<span class="material-symbols-outlined">update</span> Actualizar Antífona';
    document.getElementById('form-antifona').scrollIntoView({ behavior: 'smooth' });
};

window.borrarAntifona = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta antífona?')) return;
    try {
        if (window.firebaseAPI && window.firebaseAPI.eliminarAntifonaFirestore) {
            await window.firebaseAPI.eliminarAntifonaFirestore(id);
        }
    } catch (e) {
        console.warn('Error al eliminar en Firestore:', e);
    }
    listaAntifonas = listaAntifonas.filter(a => a.id !== id);
    localStorage.setItem('lh_antifonas_cache', JSON.stringify(listaAntifonas));
    renderizarLista();
    mostrarBannerEstado('🗑️ Antífona eliminada.', 'info');
};

window.copiarTexto = (texto) => {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarBannerEstado('📋 Texto copiado al portapapeles.', 'exito');
    });
};

function mostrarBannerEstado(mensaje, tipo = 'info') {
    const banner = document.getElementById('banner-estado');
    if (!banner) return;
    banner.className = `estado-banner ${tipo}`;
    banner.innerHTML = `<span class="material-symbols-outlined">${tipo === 'exito' ? 'check_circle' : (tipo === 'alerta' ? 'warning' : 'info')}</span> ${mensaje}`;
    banner.style.display = 'flex';
    setTimeout(() => {
        if (banner.className.includes('exito')) banner.style.display = 'none';
    }, 4000);
}

function capitalizar(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatearTipo(tipo) {
    const map = {
        invitatoria: 'Invitatoria',
        salmodia_1: 'Ant 1.',
        salmodia_2: 'Ant 2.',
        salmodia_3: 'Ant 3.',
        cantico_at: 'Cántico AT',
        cantico_nt: 'Cántico NT',
        evangelico: 'Cántico Evangélico',
        virgen: 'Virgen María'
    };
    return map[tipo] || tipo;
}

function escapeAttr(str) {
    return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
