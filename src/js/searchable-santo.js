/**
 * Reusable Component: Searchable Dropdown for Saints and Liturgical Selectors
 * Liturgia de las Horas
 */

function normalizarTextoBusqueda(texto) {
    if (!texto) return '';
    return texto
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

/**
 * Convierte o asocia un <select> existente a un selector visual con buscador tipo santo.html.
 * Mantiene sincronizado el select original nativo y dispara eventos 'change'.
 * 
 * @param {HTMLSelectElement} selectElement Elemento <select> original
 * @param {Object} options Opciones de configuración
 * @returns {HTMLElement} Contenedor del selector personalizado
 */
export function inicializarSearchableSantoSelect(selectElement, options = {}) {
    if (!selectElement) return null;

    const placeholder = options.placeholder || 'Buscar santo...';
    const allowEmpty = options.allowEmpty !== undefined ? options.allowEmpty : false;
    const emptyText = options.emptyText || '-- Selecciona un Santo --';

    // Si ya tiene un custom select asociado, solo devolver o actualizar
    if (selectElement._customSantoContainer) {
        if (typeof selectElement._actualizarCustomSanto === 'function') {
            selectElement._actualizarCustomSanto();
        }
        return selectElement._customSantoContainer;
    }

    // Ocultar select nativo de forma accesible
    selectElement.style.display = 'none';

    // Crear contenedor
    const container = document.createElement('div');
    container.className = 'custom-select-santo-wrap';

    // Trigger (botón visible que muestra la opción seleccionada)
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-santo-trigger';
    const label = document.createElement('span');
    label.className = 'custom-select-santo-label';
    trigger.appendChild(label);

    // Dropdown popup
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-select-santo-dropdown';

    // Search box
    const searchBox = document.createElement('div');
    searchBox.className = 'custom-select-santo-search-box';
    searchBox.addEventListener('click', (e) => e.stopPropagation());

    const searchIcon = document.createElement('span');
    searchIcon.className = 'material-symbols-outlined';
    searchIcon.textContent = 'search';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = placeholder;
    searchInput.autocomplete = 'off';
    searchInput.spellcheck = false;
    searchInput.addEventListener('click', (e) => e.stopPropagation());

    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);
    dropdown.appendChild(searchBox);

    // Lista de opciones UL
    const ul = document.createElement('ul');
    ul.className = 'custom-select-santo-opciones';
    dropdown.appendChild(ul);

    container.appendChild(trigger);
    container.appendChild(dropdown);

    // Insertar justo después del select nativo
    if (selectElement.parentNode) {
        selectElement.parentNode.insertBefore(container, selectElement.nextSibling);
    }

    // Función que sincroniza las opciones del <select> con la lista visual
    const sincronizarOpciones = () => {
        const opts = Array.from(selectElement.options);
        const valActual = selectElement.value;
        const optSel = selectElement.selectedOptions[0] || opts[0];
        label.textContent = optSel ? (optSel.textContent || optSel.value) : emptyText;

        ul.innerHTML = '';
        if (opts.length === 0) {
            const liVacio = document.createElement('li');
            liVacio.className = 'custom-select-santo-opcion opcion-vacia';
            liVacio.textContent = emptyText;
            ul.appendChild(liVacio);
            return;
        }

        opts.forEach(opt => {
            const li = document.createElement('li');
            li.className = 'custom-select-santo-opcion';
            if (opt.value === valActual) {
                li.classList.add('seleccionado');
            }
            li.textContent = opt.textContent;
            li.setAttribute('data-value', opt.value);

            // Atributos de búsqueda
            const tText = normalizarTextoBusqueda(opt.textContent || '');
            const tNombre = normalizarTextoBusqueda(opt.getAttribute('data-nombre') || '');
            const tFecha = normalizarTextoBusqueda(opt.getAttribute('data-fecha') || '');

            // Variantes de fecha de celebración (ej: 01/01, 1/1, 01-01, 0101, 29/06, 29/6, 2906)
            let dateVariants = [];
            const rawFecha = opt.getAttribute('data-fecha') || '';
            let mFecha = rawFecha.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
            if (!mFecha) {
                mFecha = (opt.textContent || '').match(/\((\d{1,2})[\/\-](\d{1,2})\)/);
            }
            if (!mFecha) {
                mFecha = (opt.value || '').match(/^sa(\d{2})(\d{2})/i);
            }
            if (mFecha) {
                const dNum = parseInt(mFecha[1], 10);
                const mNum = parseInt(mFecha[2], 10);
                if (!isNaN(dNum) && !isNaN(mNum) && dNum >= 1 && dNum <= 31 && mNum >= 1 && mNum <= 12) {
                    const dd = String(dNum).padStart(2, '0');
                    const mm = String(mNum).padStart(2, '0');
                    const dStr = String(dNum);
                    const mStr = String(mNum);
                    dateVariants = [
                        `${dd}/${mm}`,
                        `${dStr}/${mStr}`,
                        `${dStr}/${mm}`,
                        `${dd}/${mStr}`,
                        `${dd}-${mm}`,
                        `${dStr}-${mStr}`,
                        `${dd}${mm}`,
                        `${dd} ${mm}`
                    ];
                }
            }

            li.setAttribute('data-search', `${tText} ${tNombre} ${tFecha} ${dateVariants.join(' ')}`.trim());

            li.addEventListener('click', (e) => {
                e.stopPropagation();
                selectElement.value = opt.value;
                label.textContent = opt.textContent;

                ul.querySelectorAll('.custom-select-santo-opcion').forEach(el => el.classList.remove('seleccionado'));
                li.classList.add('seleccionado');

                dropdown.classList.remove('abierto');
                trigger.classList.remove('activo');
                container.classList.remove('dropdown-activo');

                selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                if (typeof options.onChange === 'function') {
                    options.onChange(opt.value, opt);
                }
            });

            ul.appendChild(li);
        });
    };

    // Filtro en tiempo real al tipear
    searchInput.addEventListener('input', () => {
        const raw = searchInput.value.trim();
        const query = normalizarTextoBusqueda(raw);
        const lis = ul.querySelectorAll('.custom-select-santo-opcion:not(.sin-resultados)');
        let visibles = 0;
        lis.forEach(li => {
            const searchStr = li.getAttribute('data-search') || normalizarTextoBusqueda(li.textContent || '');
            let coincide = !query || searchStr.includes(query);
            if (!coincide && raw) {
                coincide = searchStr.includes(raw.toLowerCase());
            }
            li.style.display = coincide ? 'block' : 'none';
            if (coincide) visibles++;
        });

        let sinResultados = ul.querySelector('.sin-resultados');
        if (visibles === 0) {
            if (!sinResultados) {
                sinResultados = document.createElement('li');
                sinResultados.className = 'custom-select-santo-opcion sin-resultados';
                ul.appendChild(sinResultados);
            }
            sinResultados.textContent = `No se encontraron santos para "${searchInput.value.trim()}"`;
            sinResultados.style.display = 'block';
        } else if (sinResultados) {
            sinResultados.style.display = 'none';
        }
    });

    // Abrir/cerrar dropdown
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const estaAbierto = dropdown.classList.contains('abierto');

        // Cerrar todos los demás dropdowns abiertos
        document.querySelectorAll('.custom-select-santo-dropdown.abierto').forEach(dd => {
            if (dd !== dropdown) {
                dd.classList.remove('abierto');
                if (dd.previousElementSibling) dd.previousElementSibling.classList.remove('activo');
                if (dd.parentElement) dd.parentElement.classList.remove('dropdown-activo');
            }
        });
        document.querySelectorAll('.custom-select-dropdown.abierto').forEach(dd => {
            dd.classList.remove('abierto');
            if (dd.previousElementSibling) dd.previousElementSibling.classList.remove('activo');
            if (dd.parentElement) dd.parentElement.classList.remove('dropdown-activo');
        });

        if (!estaAbierto) {
            dropdown.classList.add('abierto');
            trigger.classList.add('activo');
            container.classList.add('dropdown-activo');
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            setTimeout(() => searchInput.focus(), 60);

            const selItem = ul.querySelector('.custom-select-santo-opcion.seleccionado');
            if (selItem) {
                selItem.scrollIntoView({ block: 'nearest' });
            }
        } else {
            dropdown.classList.remove('abierto');
            trigger.classList.remove('activo');
            container.classList.remove('dropdown-activo');
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown.classList.remove('abierto');
            trigger.classList.remove('activo');
            container.classList.remove('dropdown-activo');
        }
    });

    // Listener para actualizar el label si el select nativo cambia externamente
    selectElement.addEventListener('change', () => {
        const optSel = selectElement.selectedOptions[0];
        if (optSel) {
            label.textContent = optSel.textContent;
            ul.querySelectorAll('.custom-select-santo-opcion').forEach(li => {
                if (li.getAttribute('data-value') === selectElement.value) {
                    li.classList.add('seleccionado');
                } else {
                    li.classList.remove('seleccionado');
                }
            });
        }
    });

    selectElement._customSantoContainer = container;
    selectElement._actualizarCustomSanto = sincronizarOpciones;

    sincronizarOpciones();
    return container;
}

// Cierre global al hacer clic fuera del componente
if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-santo-wrap')) {
            document.querySelectorAll('.custom-select-santo-dropdown.abierto').forEach(dd => {
                dd.classList.remove('abierto');
                if (dd.previousElementSibling) dd.previousElementSibling.classList.remove('activo');
                if (dd.parentElement) dd.parentElement.classList.remove('dropdown-activo');
            });
        }
    });
}
