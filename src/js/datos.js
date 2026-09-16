/**
 * Gestión de Datos y Catálogo de Años (datos.js)
 * Permite registrar y administrar años para el Calendario del Año Litúrgico y otros módulos,
 * calculando con precisión astronómica y canónica años bisiestos, ciclos y paridad.
 * Liturgia de las Horas
 */

// Lista oficial de años bisiestos verificada (2028 - 2196)
export const LISTA_BISIESTOS_OFICIAL = [
    2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064,
    2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2104, 2108,
    2112, 2116, 2120, 2124, 2128, 2132, 2136, 2140, 2144, 2148,
    2152, 2156, 2160, 2164, 2168, 2172, 2176, 2180, 2184, 2188,
    2192, 2196
];

export const ANIOS_POR_DEFECTO = [
    2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035
];

/**
 * Determina si un año es bisiesto según la regla del Calendario Gregoriano:
 * Divisible entre 4 y (no divisible entre 100 o divisible entre 400).
 * Ej: 2096 es bisiesto, 2100 NO es bisiesto, 2104 es bisiesto.
 */
export function esAñoBisiesto(year) {
    const y = parseInt(year, 10);
    if (isNaN(y)) return false;
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

/**
 * Algoritmo eclesiástico del Computus (Meeus/Jones) para calcular Domingo de Pascua y Miércoles de Ceniza
 */
export function calcularPascuaGregoriana(year) {
    const y = parseInt(year, 10);
    const a = y % 19;
    const b = Math.floor(y / 100);
    const c = y % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31); // 3=Marzo, 4=Abril
    const dia = ((h + l - 7 * m + 114) % 31) + 1;

    const mesStr = String(mes).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');
    const pascuaISO = `${y}-${mesStr}-${diaStr}`;

    const pDate = new Date(y, mes - 1, dia);
    const cDate = new Date(pDate);
    cDate.setDate(cDate.getDate() - 46); // Ceniza es exactamente 46 días antes de Pascua
    const cMesStr = String(cDate.getMonth() + 1).padStart(2, '0');
    const cDiaStr = String(cDate.getDate()).padStart(2, '0');
    const cenizaISO = `${y}-${cMesStr}-${cDiaStr}`;

    return { ceniza: cenizaISO, pascua: pascuaISO };
}

/**
 * Calcula el Primer Domingo de Adviento para un año dado
 */
export function calcularInicioAdviento(year) {
    const y = parseInt(year, 10);
    const nov30 = new Date(y, 10, 30);
    const day = nov30.getDay();
    const delta = day === 0 ? 0 : (day <= 3 ? -day : 7 - day);
    const dom = new Date(y, 10, 30 + delta);
    const m = String(dom.getMonth() + 1).padStart(2, '0');
    const d = String(dom.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Paridad del año
 */
export function obtenerParidadAño(year) {
    const y = parseInt(year, 10);
    return (y % 2 === 0) ? 'Par' : 'Impar';
}

/**
 * Ciclo Dominical (A, B, C)
 */
export function obtenerCicloDominical(year) {
    const y = parseInt(year, 10);
    const ciclos = ['A', 'B', 'C'];
    const indice = (((y - 2026) % 3) + 3) % 3;
    return ciclos[indice];
}

/**
 * Lee el catálogo de años guardado o devuelve los años por defecto
 */
export function obtenerCatalogoAños() {
    if (typeof localStorage === 'undefined') return [...ANIOS_POR_DEFECTO];
    try {
        const raw = localStorage.getItem('lh_catalogo_anios');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
            }
        }
    } catch (e) {
        console.warn("Error leyendo lh_catalogo_anios:", e);
    }
    return [...ANIOS_POR_DEFECTO];
}

/**
 * Guarda el catálogo de años en localStorage y notifica eventos
 */
export function guardarCatalogoAños(aniosArray) {
    const limpios = Array.from(new Set(aniosArray.map(Number).filter(n => !isNaN(n)))).sort((a, b) => a - b);
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lh_catalogo_anios', JSON.stringify(limpios));
    }
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lh-anios-catalogo-changed', {
            detail: { anios: limpios }
        }));
        if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
            window.firebaseAPI.guardarAjustesFirestore('catalogo_anios', {
                anios: limpios,
                actualizado: new Date().toISOString()
            }).catch(e => console.warn("Error sincronizando años con Firebase:", e));
        }
    }
    return limpios;
}

// Variables y métodos expuestos en window
if (typeof window !== 'undefined') {
    window.esAñoBisiesto = esAñoBisiesto;
    window.obtenerCatalogoAños = obtenerCatalogoAños;
    window.guardarCatalogoAños = guardarCatalogoAños;
    window.calcularPascuaGregoriana = calcularPascuaGregoriana;
    window.calcularInicioAdviento = calcularInicioAdviento;
    window.obtenerParidadAño = obtenerParidadAño;
    window.obtenerCicloDominical = obtenerCicloDominical;
    window.LISTA_BISIESTOS_OFICIAL = LISTA_BISIESTOS_OFICIAL;
}

// Controlador de interfaz para datos.html
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const inputAño = document.getElementById('input-año-nuevo');
        const selectSugerido = document.getElementById('select-año-sugerido');
        const selectCategoria = document.getElementById('select-categoria-datos');
        const btnAgregar = document.getElementById('btn-agregar-año');
        const btnProximo = document.getElementById('btn-proximo-año');
        const btnBisiestos = document.getElementById('btn-cargar-bisiestos');
        const btnReset = document.getElementById('btn-reset-anios');
        const cuerpoTabla = document.getElementById('cuerpo-tabla-años');
        const filtroTipo = document.getElementById('filtro-tipo-año');
        const inputBuscador = document.getElementById('buscador-años');

        if (!cuerpoTabla) return; // No estamos en datos.html

        let aniosRegistrados = obtenerCatalogoAños();

        // Rellenar select sugerido con años desde 2024 hasta 2196
        function poblarSelectSugerido() {
            if (!selectSugerido) return;
            const fragment = document.createDocumentFragment();
            const optDefault = document.createElement('option');
            optDefault.value = '';
            optDefault.textContent = '-- Seleccionar un año sugerido --';
            fragment.appendChild(optDefault);

            // Generar lista de 2024 a 2196
            for (let y = 2024; y <= 2196; y++) {
                const opt = document.createElement('option');
                opt.value = y;
                const bisiestoTxt = esAñoBisiesto(y) ? ' [Bisiesto 366d]' : '';
                const yaEsta = aniosRegistrados.includes(y) ? ' (Registrado)' : '';
                opt.textContent = `${y}${bisiestoTxt}${yaEsta}`;
                fragment.appendChild(opt);
            }
            selectSugerido.innerHTML = '';
            selectSugerido.appendChild(fragment);
        }

        // Actualizar tarjeta de diagnóstico en tiempo real
        function actualizarDiagnostico() {
            const val = parseInt(inputAño.value, 10);
            const badgeBisiesto = document.getElementById('diag-badge-bisiesto');
            const txtDias = document.getElementById('diag-dias');
            const txtParidad = document.getElementById('diag-paridad');
            const txtCiclo = document.getElementById('diag-ciclo');
            const txtCeniza = document.getElementById('diag-ceniza');
            const txtPascua = document.getElementById('diag-pascua');
            const txtAdviento = document.getElementById('diag-adviento');

            if (isNaN(val) || val < 1000 || val > 3000) {
                if (badgeBisiesto) {
                    badgeBisiesto.className = 'badge-bisiesto no-bisiesto';
                    badgeBisiesto.innerHTML = 'Año no válido';
                }
                return;
            }

            const bisiesto = esAñoBisiesto(val);
            const paridad = obtenerParidadAño(val);
            const ciclo = obtenerCicloDominical(val);
            const { ceniza, pascua } = calcularPascuaGregoriana(val);
            const adviento = calcularInicioAdviento(val);

            if (badgeBisiesto) {
                if (bisiesto) {
                    badgeBisiesto.className = 'badge-bisiesto es-bisiesto';
                    badgeBisiesto.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">verified</span> Año Bisiesto (Febrero: 29 días)';
                } else {
                    badgeBisiesto.className = 'badge-bisiesto no-bisiesto';
                    badgeBisiesto.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">calendar_today</span> Año Común (Febrero: 28 días)';
                }
            }

            if (txtDias) txtDias.textContent = bisiesto ? '366 días' : '365 días';
            if (txtParidad) txtParidad.textContent = `Año ${paridad}`;
            if (txtCiclo) txtCiclo.textContent = `Ciclo ${ciclo}`;
            if (txtCeniza) txtCeniza.textContent = ceniza;
            if (txtPascua) txtPascua.textContent = pascua;
            if (txtAdviento) txtAdviento.textContent = adviento;
        }

        // Renderizado de tabla y estadísticas
        function renderizarUI() {
            aniosRegistrados.sort((a, b) => a - b);
            const termino = (inputBuscador ? inputBuscador.value.trim().toLowerCase() : '');
            const filtro = (filtroTipo ? filtroTipo.value : 'todos');

            const filtrados = aniosRegistrados.filter(y => {
                const bisiesto = esAñoBisiesto(y);
                const par = (y % 2 === 0);

                if (filtro === 'bisiestos' && !bisiesto) return false;
                if (filtro === 'comunes' && bisiesto) return false;
                if (filtro === 'pares' && !par) return false;
                if (filtro === 'impares' && par) return false;

                if (termino) {
                    const str = `${y} ${bisiesto ? 'bisiesto' : 'comun'} ${par ? 'par' : 'impar'} ciclo ${obtenerCicloDominical(y)}`.toLowerCase();
                    if (!str.includes(termino)) return false;
                }
                return true;
            });

            // Estadísticas
            const total = aniosRegistrados.length;
            const bisiestosCount = aniosRegistrados.filter(esAñoBisiesto).length;
            const comunesCount = total - bisiestosCount;
            const minAño = total > 0 ? Math.min(...aniosRegistrados) : '-';
            const maxAño = total > 0 ? Math.max(...aniosRegistrados) : '-';

            const elTotal = document.getElementById('stat-total-anios');
            const elBisiestos = document.getElementById('stat-bisiestos');
            const elComunes = document.getElementById('stat-comunes');
            const elRango = document.getElementById('stat-rango');

            if (elTotal) elTotal.textContent = total;
            if (elBisiestos) elBisiestos.textContent = bisiestosCount;
            if (elComunes) elComunes.textContent = comunesCount;
            if (elRango) elRango.textContent = `${minAño} - ${maxAño}`;

            // Filas de la tabla
            if (filtrados.length === 0) {
                cuerpoTabla.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 24px; color: #888;">
                            No se encontraron años que coincidan con los filtros.
                        </td>
                    </tr>
                `;
                return;
            }

            const puedeBorrar = (typeof window.hasPermission !== 'function') || window.hasPermission('datos_borrar');

            cuerpoTabla.innerHTML = filtrados.map(y => {
                const bisiesto = esAñoBisiesto(y);
                const paridad = obtenerParidadAño(y);
                const ciclo = obtenerCicloDominical(y);
                const { ceniza, pascua } = calcularPascuaGregoriana(y);
                const adviento = calcularInicioAdviento(y);
                const esActual = (y === añoActual);

                return `
                    <tr class="${esActual ? 'fila-actual' : ''}">
                        <td>
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span class="tag-año">${y}</span>
                                ${esActual ? '<span class="badge-tag" style="background:#fef08a; color:#854d0e;">Hoy</span>' : ''}
                            </div>
                        </td>
                        <td>
                            ${bisiesto 
                                ? '<span class="badge-tag" style="background:#dcfce7; color:#15803d; border:1px solid #86efac;">🟢 Bisiesto (366d)</span>' 
                                : '<span class="badge-tag" style="background:#f1f5f9; color:#475569;">⚪ Común (365d)</span>'}
                        </td>
                        <td>
                            <span class="badge-tag ${paridad === 'Par' ? 'par' : 'impar'}">Año ${paridad}</span>
                        </td>
                        <td>
                            <span class="badge-tag ciclo-${ciclo.toLowerCase()}">Ciclo ${ciclo}</span>
                        </td>
                        <td>
                            <div style="font-size:0.83rem;">
                                <div><strong>Ceniza:</strong> ${ceniza}</div>
                                <div><strong>Pascua:</strong> ${pascua}</div>
                            </div>
                        </td>
                        <td>
                            <span style="font-size:0.85rem; font-weight:600;">${adviento}</span>
                        </td>
                        <td>
                            <div class="acciones-celda">
                                <a href="añoliturgico.html" class="btn-tabla" title="Ver en Calendario del Año Litúrgico" onclick="localStorage.setItem('pref-año-seleccionado', '${y}')">
                                    <span class="material-symbols-outlined" style="font-size:16px;">calendar_month</span>
                                    <span>Calendario</span>
                                </a>
                                <a href="form_etiempo.html" class="btn-tabla" title="Configurar Hitos Litúrgicos" onclick="localStorage.setItem('pref-año-etiempo', '${y}')">
                                    <span class="material-symbols-outlined" style="font-size:16px;">tune</span>
                                    <span>Hitos</span>
                                </a>
                                <button type="button" class="btn-tabla eliminar" title="${puedeBorrar ? 'Eliminar año' : 'Sin permiso para eliminar año'}" 
                                        onclick="${puedeBorrar ? `window.eliminarAñoCatalogo(${y})` : 'return false;'}"
                                        ${puedeBorrar ? '' : 'disabled'}
                                        style="${puedeBorrar ? '' : 'opacity: 0.45; cursor: not-allowed; background: #e2e8f0; color: #94a3b8; border-color: #cbd5e1;'}">
                                    <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function mostrarToast(msg) {
            const toast = document.getElementById('toast-notificacion');
            if (toast) {
                toast.innerHTML = `<span class="material-symbols-outlined">check_circle</span> <span>${msg}</span>`;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }
        }

        // Agregar año
        window.agregarAñoCatalogo = (añoNuevo) => {
            if (typeof window.hasPermission === 'function' && !window.hasPermission('datos_agregar_anio')) {
                alert("No tienes permiso para agregar años al catálogo.");
                return;
            }
            const y = parseInt(añoNuevo || inputAño.value, 10);
            if (isNaN(y) || y < 1900 || y > 3000) {
                alert("Por favor introduce un año válido entre 1900 y 3000.");
                return;
            }

            if (aniosRegistrados.includes(y)) {
                alert(`El año ${y} ya se encuentra registrado en el catálogo.`);
                return;
            }

            aniosRegistrados.push(y);
            guardarCatalogoAños(aniosRegistrados);
            poblarSelectSugerido();
            renderizarUI();
            const bisiestoTxt = esAñoBisiesto(y) ? " (Año Bisiesto)" : "";
            mostrarToast(`Año ${y}${bisiestoTxt} agregado con éxito al catálogo.`);

            // Preparar siguiente año en el input
            inputAño.value = y + 1;
            actualizarDiagnostico();
        };

        // Eliminar año
        window.eliminarAñoCatalogo = (y) => {
            if (typeof window.hasPermission === 'function' && !window.hasPermission('datos_borrar')) {
                alert("No tienes permiso para eliminar años del catálogo.");
                return;
            }
            if (!confirm(`¿Estás seguro de eliminar el año ${y} del catálogo?`)) return;
            aniosRegistrados = aniosRegistrados.filter(item => item !== y);
            guardarCatalogoAños(aniosRegistrados);
            poblarSelectSugerido();
            renderizarUI();
            mostrarToast(`Año ${y} eliminado del catálogo.`);
        };

        // Aplicar permisos en controles estáticos de la página
        function aplicarPermisosUI() {
            if (typeof window.hasPermission !== 'function') return;

            if (selectCategoria) {
                const puedeCat = window.hasPermission('datos_categoria');
                selectCategoria.disabled = !puedeCat;
                selectCategoria.style.opacity = puedeCat ? '1' : '0.55';
                selectCategoria.style.cursor = puedeCat ? 'pointer' : 'not-allowed';
                selectCategoria.title = puedeCat ? '' : 'Sin permiso para cambiar categoría de datos';
            }

            const seccionGestion = document.getElementById('seccion-gestion-años');
            if (seccionGestion) {
                const puedeDiag = window.hasPermission('datos_agregar_diagnosticar');
                if (!puedeDiag) {
                    seccionGestion.style.opacity = '0.5';
                    seccionGestion.style.pointerEvents = 'none';
                    seccionGestion.title = 'Sin permiso para agregar y diagnosticar año';
                } else {
                    seccionGestion.style.opacity = '1';
                    seccionGestion.style.pointerEvents = '';
                    seccionGestion.title = '';
                }
            }

            if (btnAgregar) {
                const puedeAdd = window.hasPermission('datos_agregar_anio');
                btnAgregar.disabled = !puedeAdd;
                btnAgregar.style.opacity = puedeAdd ? '1' : '0.45';
                btnAgregar.style.cursor = puedeAdd ? 'pointer' : 'not-allowed';
                btnAgregar.title = puedeAdd ? '' : 'Sin permiso para agregar año';
            }

            if (btnProximo) {
                const puedeProx = window.hasPermission('datos_proximo_anio');
                btnProximo.disabled = !puedeProx;
                btnProximo.style.opacity = puedeProx ? '1' : '0.45';
                btnProximo.style.cursor = puedeProx ? 'pointer' : 'not-allowed';
                btnProximo.title = puedeProx ? '' : 'Sin permiso para agregar próximo año';
            }

            if (btnBisiestos) {
                const puedeBis = window.hasPermission('datos_cargar_bisiestos');
                btnBisiestos.disabled = !puedeBis;
                btnBisiestos.style.opacity = puedeBis ? '1' : '0.45';
                btnBisiestos.style.cursor = puedeBis ? 'pointer' : 'not-allowed';
                btnBisiestos.title = puedeBis ? '' : 'Sin permiso para cargar bisiestos';
            }

            if (btnReset) {
                const puedeReset = window.hasPermission('datos_restablecer');
                btnReset.disabled = !puedeReset;
                btnReset.style.opacity = puedeReset ? '1' : '0.45';
                btnReset.style.cursor = puedeReset ? 'pointer' : 'not-allowed';
                btnReset.title = puedeReset ? '' : 'Sin permiso para restablecer valores por defecto';
            }
        }

        // Eventos
        if (inputAño) {
            inputAño.addEventListener('input', actualizarDiagnostico);
        }

        if (selectSugerido) {
            selectSugerido.addEventListener('change', () => {
                if (selectSugerido.value) {
                    inputAño.value = selectSugerido.value;
                    actualizarDiagnostico();
                }
            });
        }

        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => {
                if (typeof window.hasPermission === 'function' && !window.hasPermission('datos_agregar_anio')) {
                    alert("No tienes permiso para agregar años.");
                    return;
                }
                window.agregarAñoCatalogo();
            });
        }

        if (btnProximo) {
            btnProximo.addEventListener('click', () => {
                if (typeof window.hasPermission === 'function' && !window.hasPermission('datos_proximo_anio')) {
                    alert("No tienes permiso para agregar el próximo año.");
                    return;
                }
                const max = aniosRegistrados.length > 0 ? Math.max(...aniosRegistrados) : 2026;
                window.agregarAñoCatalogo(max + 1);
            });
        }

        if (btnBisiestos) {
            btnBisiestos.addEventListener('click', () => {
                if (typeof window.hasPermission === 'function' && !window.hasPermission('datos_cargar_bisiestos')) {
                    alert("No tienes permiso para cargar años bisiestos.");
                    return;
                }
                const faltantes = LISTA_BISIESTOS_OFICIAL.filter(y => !aniosRegistrados.includes(y));
                if (faltantes.length === 0) {
                    alert("Todos los años bisiestos de la lista oficial (hasta 2196) ya están registrados.");
                    return;
                }
                const confirmar = confirm(`Se agregarán ${faltantes.length} años bisiestos oficiales desde ${faltantes[0]} hasta ${faltantes[faltantes.length - 1]}. ¿Continuar?`);
                if (!confirmar) return;

                faltantes.forEach(y => aniosRegistrados.push(y));
                guardarCatalogoAños(aniosRegistrados);
                poblarSelectSugerido();
                renderizarUI();
                mostrarToast(`¡Se agregaron ${faltantes.length} años bisiestos exitosamente!`);
            });
        }

        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (typeof window.hasPermission === 'function' && !window.hasPermission('datos_restablecer')) {
                    alert("No tienes permiso para restablecer el catálogo.");
                    return;
                }
                if (!confirm("¿Deseas restablecer el catálogo de años a los valores por defecto (2024 - 2035)?")) return;
                aniosRegistrados = [...ANIOS_POR_DEFECTO];
                guardarCatalogoAños(aniosRegistrados);
                poblarSelectSugerido();
                renderizarUI();
                mostrarToast("Catálogo restablecido a valores por defecto.");
            });
        }

        if (filtroTipo) {
            filtroTipo.addEventListener('change', renderizarUI);
        }

        if (inputBuscador) {
            inputBuscador.addEventListener('input', renderizarUI);
        }

        // Inicialización
        poblarSelectSugerido();
        actualizarDiagnostico();
        aplicarPermisosUI();
        renderizarUI();

        window.addEventListener('lh-user-changed', () => {
            aplicarPermisosUI();
            renderizarUI();
        });
        window.addEventListener('lh-access-control-updated', () => {
            aplicarPermisosUI();
            renderizarUI();
        });
        if (window.onAuthReady) {
            window.onAuthReady(() => {
                aplicarPermisosUI();
                renderizarUI();
            });
        }
    });
}
