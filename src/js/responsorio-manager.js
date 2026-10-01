/**
 * responsorio-manager.js
 * Controlador del Gestor de Responsorios Litúrgicos (responsorio.html)
 * 
 * Gestiona el registro, edición, búsqueda y persistencia de Versículos/Responsorios de la Salmodia (Oficio).
 * Precarga el catálogo canónico desde src/data/db-responsorios.js
 * Sincroniza con localStorage ('lh_responsorios_cache') y Firebase Firestore ('responsorios').
 */

import { CATALOGO_RESPONSORIOS_SEED } from '../data/db-responsorios.js';
import { catalogoSantosAnual } from '../data/catalogoSantosAnual.js';
import { inicializarSearchableSantoSelect } from './searchable-santo.js';

let listaResponsorios = [];
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

// Actualiza las opciones del selector de Semanas / Santos y la visibilidad de Día de la Semana
function actualizarModoTiempo(valorPrevioSemana = null) {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const lblSemana = document.getElementById('lbl-form-semana');
    const grupoDia = document.getElementById('grupo-dia');
    const gridDiaLibro = document.getElementById('grid-dia-libro');

    if (!selSemana) return;

    if (tiempo === 'santos') {
        if (lblSemana) lblSemana.textContent = 'Santo / Celebración:';
        if (grupoDia) grupoDia.style.display = 'none';
        if (gridDiaLibro) gridDiaLibro.classList.add('solo-un-campo');

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
                manejarCambioParametros();
            }
        });
        if (selSemana._customSantoContainer) {
            selSemana._customSantoContainer.style.display = 'block';
        }
    } else {
        if (lblSemana) lblSemana.textContent = 'Semana:';
        if (grupoDia) grupoDia.style.display = '';
        if (gridDiaLibro) gridDiaLibro.classList.remove('solo-un-campo');

        if (selSemana._customSantoContainer) {
            selSemana._customSantoContainer.style.display = 'none';
        }
        selSemana.style.display = 'block';

        // Cantidad de semanas según tiempo
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

// Buscar responsorio existente en memoria/catálogo
function buscarResponsorioExistente(idSugerido, tiempo, semana, dia, libro) {
    if (!listaResponsorios || listaResponsorios.length === 0) return null;
    const norm = (s) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

    // 1. Coincidencia exacta por ID generado
    if (idSugerido) {
        const porId = listaResponsorios.find(r => r.id === idSugerido);
        if (porId) return porId;
    }

    if (tiempo === 'santos') {
        const idSantoNorm = norm(semana);
        return listaResponsorios.find(r => {
            if (r.tiempo !== 'santos' && !(r.id && r.id.startsWith('sa'))) return false;
            const libroMatch = (r.libro === libro) || (libro === 'oficio' && !r.libro);
            const rIdNorm = norm(r.id);
            const rSemNorm = norm(r.semana);
            const rNomNorm = norm(r.santoNombre);
            const santoMatch = idSantoNorm && (
                rIdNorm.includes(idSantoNorm) || idSantoNorm.includes(rIdNorm) ||
                rSemNorm.includes(idSantoNorm) || idSantoNorm.includes(rSemNorm) ||
                (rNomNorm && (rNomNorm.includes(idSantoNorm) || idSantoNorm.includes(rNomNorm)))
            );
            return libroMatch && santoMatch;
        });
    } else {
        return listaResponsorios.find(r => {
            if (r.tiempo !== tiempo) return false;
            const semMatch = String(r.semana) === String(semana);
            const diaMatch = norm(r.dia) === norm(dia);
            const libroMatch = r.libro === libro;
            return semMatch && diaMatch && libroMatch;
        });
    }
}

// Coordinar cambio de parámetros (Santo, Tiempo, Semana, Día, Libro)
function manejarCambioParametros() {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const selSemana = document.getElementById('form-semana');
    const semanaVal = selSemana?.value || '1';
    const dia = document.getElementById('form-dia')?.value || 'domingo';
    const libro = document.getElementById('form-libro')?.value || 'oficio';

    autogenerarIdYTitulo();
    const idSugerido = document.getElementById('form-id')?.value || '';
    const itemExistente = buscarResponsorioExistente(idSugerido, tiempo, semanaVal, dia, libro);

    const txtV = document.getElementById('form-v');
    const txtR = document.getElementById('form-r');
    const btnGuardar = document.getElementById('btn-guardar-texto');
    const tituloForm = document.getElementById('titulo-formulario');

    if (itemExistente) {
        editandoId = itemExistente.id;
        if (txtV) txtV.value = itemExistente.v || '';
        if (txtR) txtR.value = itemExistente.r || '';
        if (btnGuardar) {
            btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Actualizar Responsorio`;
        }
        if (tituloForm) {
            tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-gold);">edit</span> Editando: ${itemExistente.id}`;
        }
        mostrarBannerEstado(`📖 Responsorio existente cargado (${itemExistente.libro || libro}).`, 'info');
    } else {
        editandoId = null;
        if (txtV) txtV.value = '';
        if (txtR) txtR.value = '';
        if (btnGuardar) {
            btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Guardar Responsorio`;
        }
        if (tituloForm) {
            tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-red);">edit_note</span> Nuevo Responsorio`;
        }
    }
    actualizarLivePreview();
}

document.addEventListener('DOMContentLoaded', async () => {
    actualizarModoTiempo();
    configurarEventos();
    await cargarDatos();
    renderizarLista();
    manejarCambioParametros();
    actualizarLivePreview();
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

// Normalizar/migrar formato de ID de responsorios a la nomenclatura canónica (ej: tos05doof_resp)
function migrarIdsResponsorios(items) {
    if (!Array.isArray(items)) return [];
    return items.map(r => {
        if (!r || !r.id) return r;
        // Si ya sigue la nomenclatura estándar o es de santos, verificar
        if (r.tiempo === 'santos') return r;
        const nuevoId = generarIdCanonicoResponsorio(r.tiempo, r.semana, r.dia, r.libro);
        if (nuevoId && r.id !== nuevoId) {
            return {
                ...r,
                id: nuevoId,
                varName: nuevoId
            };
        }
        return r;
    });
}

// Cargar datos: primero Firestore/localStorage, con respaldo en db-responsorios.js
async function cargarDatos() {
    mostrarBannerEstado('Cargando catálogo de responsorios...', 'info');

    // 1. Probar desde Firestore
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.firebaseAPI.db, "responsorios"));
            if (!snap.empty) {
                const desdeFb = [];
                snap.forEach(d => desdeFb.push({ id: d.id, ...d.data() }));
                if (desdeFb.length >= 3) {
                    listaResponsorios = migrarIdsResponsorios(desdeFb);
                    localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));
                    mostrarBannerEstado(`✅ Se cargaron ${listaResponsorios.length} responsorios desde Firebase Firestore.`, 'exito');
                    return;
                }
            }
        }
    } catch (e) {
        console.warn('Fallo al conectar con Firestore para responsorios:', e);
    }

    // 2. Probar caché local
    const cacheLocal = localStorage.getItem('lh_responsorios_cache');
    if (cacheLocal) {
        try {
            const parsed = JSON.parse(cacheLocal);
            if (Array.isArray(parsed) && parsed.length >= 3) {
                listaResponsorios = migrarIdsResponsorios(parsed);
                localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));
                mostrarBannerEstado(`📂 Cargados ${listaResponsorios.length} responsorios desde la caché local.`, 'alerta');
                return;
            }
        } catch (e) {}
    }

    // 3. Fallback a semilla canónica
    if (Array.isArray(CATALOGO_RESPONSORIOS_SEED) && CATALOGO_RESPONSORIOS_SEED.length > 0) {
        listaResponsorios = migrarIdsResponsorios([...CATALOGO_RESPONSORIOS_SEED]);
        localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));
        mostrarBannerEstado(`✨ Cargados los ${listaResponsorios.length} responsorios canónicos desde el catálogo base.`, 'exito');
        return;
    }

    listaResponsorios = [];
    mostrarBannerEstado('No hay responsorios registrados. Agrega uno nuevo con el formulario.', 'alerta');
}

// Configuración de eventos
function configurarEventos() {
    // Restaurar semilla
    document.getElementById('btn-restaurar-semilla')?.addEventListener('click', () => {
        if (!Array.isArray(CATALOGO_RESPONSORIOS_SEED) || CATALOGO_RESPONSORIOS_SEED.length === 0) {
            alert('El catálogo base de responsorios no está disponible.');
            return;
        }
        if (!confirm(`¿Restablecer los ${CATALOGO_RESPONSORIOS_SEED.length} responsorios originales del catálogo base?`)) return;
        listaResponsorios = [...CATALOGO_RESPONSORIOS_SEED];
        localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));
        renderizarLista();
        limpiarFormulario();
        mostrarBannerEstado(`🔄 Se restauraron los ${listaResponsorios.length} responsorios del catálogo base.`, 'exito');
    });

    // Subir a Firebase
    document.getElementById('btn-subir-semilla')?.addEventListener('click', subirAFirebase);

    // Exportar JSON
    document.getElementById('btn-exportar-json')?.addEventListener('click', () => {
        if (listaResponsorios.length === 0) {
            alert('No hay responsorios para exportar.');
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaResponsorios, null, 2));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", `responsorios_lh_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
        mostrarBannerEstado('💾 Respaldo JSON descargado correctamente.', 'exito');
    });

    // Formulario guardar
    document.getElementById('form-responsorio')?.addEventListener('submit', guardarResponsorio);
    document.getElementById('btn-limpiar-form')?.addEventListener('click', limpiarFormulario);

    // Cambio de tiempo litúrgico
    document.getElementById('form-tiempo')?.addEventListener('change', () => {
        actualizarModoTiempo();
        manejarCambioParametros();
    });

    // Inputs de texto con live preview
    ['form-id', 'form-v', 'form-r'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', actualizarLivePreview);
    });

    // Selectores de parámetros estructurales
    ['form-semana', 'form-dia', 'form-libro'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            manejarCambioParametros();
        });
    });

    // Filtros de tabla
    document.getElementById('filtro-busqueda')?.addEventListener('input', renderizarLista);
    document.getElementById('filtro-tiempo')?.addEventListener('change', renderizarLista);
    document.getElementById('filtro-dia')?.addEventListener('change', renderizarLista);
}

// Generar ID canónico según tiempo, semana/santo, día y libro litúrgico
function generarIdCanonicoResponsorio(tiempo, semana, dia, libro) {
    const tMap = { ordinario: 'to', adviento: 'ta', navidad: 'tn', cuaresma: 'tc', pascua: 'tp', santos: 'sa' };
    const dMap = { domingo: 'do', lunes: 'lu', martes: 'ma', miercoles: 'mi', miércoles: 'mi', jueves: 'ju', viernes: 'vi', sabado: 'sa', sábado: 'sa' };
    const lMap = { oficio: 'of', laudes: 'la', visperas: 'vi', vispera: 'vi', tercia: 'te', sexta: 'se', nona: 'no', completas: 'co' };

    const tCode = tMap[(tiempo || 'ordinario').toLowerCase()] || 'to';
    const lCode = lMap[(libro || 'oficio').toLowerCase()] || 'of';

    if (tCode === 'sa') {
        const idSanto = String(semana || 'sa0101santo').toLowerCase();
        return `${idSanto}${lCode}_resp`;
    }

    const numSemana = parseInt(semana, 10) || 1;
    const sPad = String(numSemana).padStart(2, '0');
    const dCode = dMap[(dia || 'domingo').toLowerCase()] || 'do';

    return `${tCode}s${sPad}${dCode}${lCode}_resp`;
}

// Generar ID sugerido según tiempo, semana/santo y día
function autogenerarIdYTitulo() {
    const tiempo = document.getElementById('form-tiempo')?.value || 'ordinario';
    const semanaSel = document.getElementById('form-semana');
    const semanaVal = semanaSel?.value || '1';
    const dia = document.getElementById('form-dia')?.value || 'domingo';
    const libro = document.getElementById('form-libro')?.value || 'oficio';

    const idSugerido = generarIdCanonicoResponsorio(tiempo, semanaVal, dia, libro);
    let tituloSugerido = '';

    if (tiempo === 'santos') {
        const optSanto = semanaSel?.selectedOptions[0];
        const nombreSanto = optSanto ? (optSanto.getAttribute('data-nombre') || optSanto.textContent) : 'Santo';
        const fechaSanto = optSanto ? optSanto.getAttribute('data-fecha') : '';
        tituloSugerido = `Responsorio - ${nombreSanto}${fechaSanto ? ' (' + fechaSanto + ')' : ''} (${libro.charAt(0).toUpperCase() + libro.slice(1)})`;
    } else {
        const diaNombre = dia.charAt(0).toUpperCase() + dia.slice(1);
        const tiempoNombre = tiempo.charAt(0).toUpperCase() + tiempo.slice(1);
        tituloSugerido = `Responsorio de la Salmodia - ${diaNombre} Semana ${semanaVal} (${tiempoNombre})`;
    }

    const inputId = document.getElementById('form-id');
    if (inputId) {
        inputId.value = idSugerido;
    }

    const inputTitulo = document.getElementById('form-titulo');
    if (inputTitulo && !editandoId) {
        inputTitulo.value = tituloSugerido;
    }
}

// Actualizar vista previa en tiempo real
function actualizarLivePreview() {
    const id = document.getElementById('form-id')?.value || 'resp_demo';
    const v = document.getElementById('form-v')?.value.trim() || 'Éste es mi Hijo amado.';
    const r = document.getElementById('form-r')?.value.trim() || 'Escuchadlo.';

    const badge = document.getElementById('preview-id-badge');
    if (badge) badge.textContent = id;

    const elV = document.getElementById('preview-v');
    if (elV) elV.textContent = v;

    const elR = document.getElementById('preview-r');
    if (elR) elR.textContent = r;
}

// Renderizar la tabla de responsorios
function renderizarLista() {
    const cuerpo = document.getElementById('cuerpo-tabla-responsorios');
    const contador = document.getElementById('contador-responsorios');
    if (!cuerpo) return;

    const query = (document.getElementById('filtro-busqueda')?.value || '').toLowerCase().trim();
    const fTiempo = document.getElementById('filtro-tiempo')?.value || 'todos';
    const fDia = document.getElementById('filtro-dia')?.value || 'todos';

    const filtrados = listaResponsorios.filter(item => {
        if (fTiempo !== 'todos' && item.tiempo !== fTiempo) return false;
        if (fDia !== 'todos' && item.tiempo !== 'santos' && item.dia !== fDia) return false;
        if (!query) return true;

        const idMatch = (item.id || '').toLowerCase().includes(query);
        const titMatch = (item.titulo || '').toLowerCase().includes(query);
        const vMatch = (item.v || '').toLowerCase().includes(query);
        const rMatch = (item.r || '').toLowerCase().includes(query);
        const santoMatch = (item.santoNombre || item.nombreSanto || '').toLowerCase().includes(query);
        return idMatch || titMatch || vMatch || rMatch || santoMatch;
    });

    if (contador) {
        contador.textContent = `(${filtrados.length} de ${listaResponsorios.length})`;
    }

    if (filtrados.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 24px;">No se encontraron responsorios con los filtros seleccionados.</td></tr>`;
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

        const resumenVR = `<strong>V.</strong> ${item.v || ''}<br><strong>R.</strong> ${item.r || ''}`;
        return `
            <tr ${esActivo}>
                <td><code class="badge-id">${item.id}</code></td>
                <td><strong>${item.titulo || item.id}</strong></td>
                <td>${colDiaSem}</td>
                <td><div style="max-height: 48px; overflow: hidden; font-size: 0.82rem; line-height: 1.3;">${resumenVR}</div></td>
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
        btn.addEventListener('click', () => editarResponsorio(btn.dataset.id));
    });

    cuerpo.querySelectorAll('.btn-borrar').forEach(btn => {
        btn.addEventListener('click', () => eliminarResponsorio(btn.dataset.id));
    });
}

// Guardar o actualizar responsorio
async function guardarResponsorio(e) {
    e.preventDefault();

    const id = document.getElementById('form-id')?.value.trim();
    const titulo = document.getElementById('form-titulo')?.value.trim();
    const tiempo = document.getElementById('form-tiempo')?.value;
    const selSemana = document.getElementById('form-semana');
    const semana = selSemana?.value;
    const dia = (tiempo === 'santos') ? '' : (document.getElementById('form-dia')?.value || 'domingo');
    const libro = document.getElementById('form-libro')?.value || 'oficio';
    const v = document.getElementById('form-v')?.value.trim();
    const r = document.getElementById('form-r')?.value.trim();

    if (!id || !v || !r) {
        alert('Por favor completa el ID, el Versículo (V) y la Respuesta (R).');
        return;
    }

    let santoNombre = '';
    if (tiempo === 'santos') {
        const optSanto = selSemana?.selectedOptions[0];
        santoNombre = optSanto ? (optSanto.getAttribute('data-nombre') || optSanto.textContent) : '';
    }

    const nuevoObj = {
        id,
        varName: id,
        titulo: titulo || id,
        tiempo,
        semana,
        dia,
        libro,
        v,
        r,
        actualizadoEn: new Date().toISOString()
    };

    if (santoNombre) {
        nuevoObj.santoNombre = santoNombre;
    }

    const idx = listaResponsorios.findIndex(x => x.id === id || (editandoId && x.id === editandoId));
    if (idx >= 0) {
        // Si el ID cambió respecto al editandoId anterior en Firestore, eliminar el viejo
        const viejoId = listaResponsorios[idx].id;
        if (viejoId && viejoId !== id) {
            try {
                if (window.firebaseAPI && window.firebaseAPI.db) {
                    import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js").then(({ doc, deleteDoc }) => {
                        deleteDoc(doc(window.firebaseAPI.db, "responsorios", viejoId)).catch(() => {});
                    });
                }
            } catch (e) {}
        }
        listaResponsorios[idx] = nuevoObj;
    } else {
        listaResponsorios.push(nuevoObj);
    }

    // Persistir localmente
    localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));

    // Guardar en Firestore si está disponible
    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseAPI.db, "responsorios", id), nuevoObj);
        }
    } catch (err) {
        console.warn('Error al guardar en Firestore:', err);
    }

    mostrarBannerEstado(`✅ Responsorio "${id}" guardado exitosamente.`, 'exito');
    limpiarFormulario();
    renderizarLista();
}

// Editar responsorio existente
function editarResponsorio(id) {
    const item = listaResponsorios.find(x => x.id === id);
    if (!item) return;

    editandoId = id;

    const setVal = (elId, val) => {
        const el = document.getElementById(elId);
        if (el && val !== undefined) el.value = val;
    };

    setVal('form-id', item.id);
    setVal('form-titulo', item.titulo || '');
    setVal('form-tiempo', item.tiempo || 'ordinario');
    
    // Actualizar interfaz según el tiempo litúrgico del responsorio
    actualizarModoTiempo(item.semana);

    if (item.tiempo !== 'santos') {
        setVal('form-dia', item.dia || 'domingo');
    }
    setVal('form-libro', item.libro || 'oficio');
    setVal('form-v', item.v || '');
    setVal('form-r', item.r || '');

    autogenerarIdYTitulo();
    const idCanonico = document.getElementById('form-id')?.value || item.id;
    editandoId = idCanonico;

    const tituloForm = document.getElementById('titulo-formulario');
    if (tituloForm) {
        tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-gold);">edit</span> Editando: ${idCanonico}`;
    }

    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) {
        btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Actualizar Responsorio`;
    }

    document.getElementById('form-id')?.setAttribute('readonly', 'true');
    actualizarLivePreview();
    renderizarLista();
}

// Eliminar responsorio
async function eliminarResponsorio(id) {
    if (!confirm(`¿Estás seguro de eliminar el responsorio "${id}"?`)) return;

    listaResponsorios = listaResponsorios.filter(x => x.id !== id);
    localStorage.setItem('lh_responsorios_cache', JSON.stringify(listaResponsorios));

    try {
        if (window.firebaseAPI && window.firebaseAPI.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
            await deleteDoc(doc(window.firebaseAPI.db, "responsorios", id));
        }
    } catch (err) {
        console.warn('Error al borrar de Firestore:', err);
    }

    if (editandoId === id) limpiarFormulario();
    renderizarLista();
    mostrarBannerEstado(`🗑️ Responsorio "${id}" eliminado.`, 'info');
}

// Limpiar formulario y reiniciar estado
function limpiarFormulario() {
    editandoId = null;
    const form = document.getElementById('form-responsorio');
    if (form) form.reset();

    document.getElementById('form-id')?.removeAttribute('readonly');

    const tituloForm = document.getElementById('titulo-formulario');
    if (tituloForm) {
        tituloForm.innerHTML = `<span class="material-symbols-outlined" style="color: var(--accent-red);">edit_note</span> Nuevo Responsorio`;
    }

    const btnGuardar = document.getElementById('btn-guardar-texto');
    if (btnGuardar) {
        btnGuardar.innerHTML = `<span class="material-symbols-outlined">save</span> Guardar Responsorio`;
    }

    actualizarModoTiempo();
    autogenerarIdYTitulo();
    actualizarLivePreview();
}

// Subir todo el catálogo a Firebase
async function subirAFirebase() {
    if (listaResponsorios.length === 0) {
        alert('No hay responsorios para subir.');
        return;
    }
    if (!window.firebaseAPI || !window.firebaseAPI.db) {
        alert('Firebase no está disponible en este momento.');
        return;
    }
    if (!confirm(`¿Deseas sincronizar todos los ${listaResponsorios.length} responsorios en Firestore ("responsorios")?`)) return;

    mostrarBannerEstado(`Subiendo ${listaResponsorios.length} responsorios a Firebase...`, 'info');

    try {
        const { doc, writeBatch } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        const batch = writeBatch(window.firebaseAPI.db);

        listaResponsorios.forEach(item => {
            const docRef = doc(window.firebaseAPI.db, "responsorios", item.id);
            batch.set(docRef, item, { merge: true });
        });

        await batch.commit();
        mostrarBannerEstado(`✨ ¡Éxito! ${listaResponsorios.length} responsorios sincronizados en Firestore.`, 'exito');
    } catch (e) {
        console.error('Error al subir catálogo de responsorios a Firebase:', e);
        mostrarBannerEstado('❌ Error al subir a Firebase. Consulta la consola.', 'alerta');
    }
}
