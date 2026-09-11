// ================================================
// DECLARANDO VARIABLE
// ================================================

window.valorOriginalExpandir = localStorage.getItem('pref-expandir-todo') === 'true';
window.cambioEnExpandir = false;

// ==========================================
// PROTECCIÓN INICIAL CONTRA SOBREESCRITURA
// ==========================================
    if (typeof window.bloqueoSincronizacion === 'undefined') {
        window.bloqueoSincronizacion = true; // Bloqueamos por defecto al cargar
        console.log("🛡️ [Sistema] Bloqueo inicial activado preventivamente.");
    }

    {
    const urlParams = new URLSearchParams(window.location.search);
    const currentCantoId = urlParams.get('canto') || 'global';

    // ==========================================
    // MODULO: DEFINICION DE PESTAÑAS Y OPCIONES
    // ==========================================
    window.tabsConfig = [
    // ==========================================
    // MODULO: TAB GENERAL
    // ==========================================
        {
            id: 'tab-general',
            label: 'General',
            icon: 'settings',
            secciones: [


                { 
                    id: 'global-set-lang',
                    label: 'Idioma', 
                    tipo: 'select', 
                    storageKey: 'pref-lang',
                    default: 'Español',
                    options: ['Español', 'English', 'Italiano', 'Português', 'Français', 'Latin', 'Ruso', 'Chino'],
                    accion: (val) => {
                        const langActual = localStorage.getItem('pref-lang') || 'Español';
                        if (val !== langActual) {
                            localStorage.setItem('pref-lang', val);
                            
                            // Mapeo de Subdominios para redirección
                            const mapaDominios = {
                                'Español': 'https://resucito.do',
                                'English': 'https://en.resucito.do',
                                'Italiano': 'https://it.resucito.do',
                                'Português': 'https://po.resucito.do',
                                'Français': 'https://fr.resucito.do',
                                'Latin': 'https://la.resucito.do',
                                'Ruso': 'https://ru.resucito.do',
                                'Chino': 'https://ch.resucito.do'
                            };

                            const urlParams = new URLSearchParams(window.location.search);
                            const cantoId = urlParams.get('canto');
                            
                            // Si el idioma no tiene subdominio asignado, vuelve al principal
                            let nuevaUrl = (mapaDominios[val] || mapaDominios['Español']) + '/';
                            if (cantoId) nuevaUrl += '?canto=' + cantoId;

                            window.location.href = nuevaUrl;
                        }
                    }
                },


    // ==========================================
    // MANTENER PANTALLA ENCENDIDA
    // ==========================================

                { 
                    id: 'global-set-wakelock',
                    label: 'Mantener pantalla encendida', 
                    tipo: 'switch',
                    storageKey: 'pref-wakelock',
                    default: false,
                    accion: async (val) => {
                        if (val) {
                            try {
                                window.wakeLock = await navigator.wakeLock.request('screen');
                                document.addEventListener('visibilitychange', window.reestablecerWakeLock);
                            } catch (err) { console.error("WakeLock Error:", err); }
                        } else {
                            if (window.wakeLock) window.wakeLock.release();
                            window.wakeLock = null;
                            document.removeEventListener('visibilitychange', window.reestablecerWakeLock);
                        }
                        localStorage.setItem('pref-wakelock', val);
                    }
                },


    // ==========================================
    // BOTON DE ACTUALIZAR
    // ==========================================

    { 
                    id: 'btn-clear-cache',
                    label: 'Limpiar Caché y Datos', 
                    tipo: 'button',
                    color: '#bc0009',
                    accion: async () => {
                        // --- NUEVA SEGURIDAD POR FALTA DE INTERNET ---
                        if (!navigator.onLine) {
                            const avisoOffline = confirm("🚫 NO TIENES INTERNET.\n\nSi limpias la caché ahora, perderás el acceso offline a los cantos. ¿Deseas continuar...?");
                            if (!avisoOffline) return;

                            const avisoCritico = confirm("🌐📶 AVISO DE CONEXIÓN:\n\nSin Internet / DATA / RED no podrás volver a cargar la aplicación.\n\n⚠️ Asegúrate PRIMERO de que estas conectado a internet.\n\n¿Quieres Continuar?...?");                        if (!avisoCritico) return;
                        }

                        // --- TU BLOQUE ORIGINAL TAL CUAL ME LO PEDISTE ---
                        if(confirm("⚠ Limpiar Cache y 🔃👤 Reiniciar Sesión. ¿Continuar?")) {
                            
                            // 1. PRIMERO: Cerrar sesión en Firebase (Fundamental)
                            if (window.firebaseAPI && window.firebaseAPI.logout) {
                                try {
                                    await window.firebaseAPI.logout();
                                    console.log("Sesión de Firebase cerrada correctamente.");
                                } catch (e) {
                                    console.error("Error al cerrar sesión:", e);
                                }
                            }

                            // 2. Limpiar LocalStorage (Preferencias, acordes, cejillas)
                            localStorage.clear();

                            // 3. Limpiar Caché de la PWA (Archivos offline)
                            if ('caches' in window) {
                                const cacheNames = await caches.keys();
                                await Promise.all(cacheNames.map(name => caches.delete(name)));
                            }

                            // 4. Limpiar IndexedDB (Bases de datos internas)
                            if ('indexedDB' in window) {
                                const dbs = await indexedDB.databases();
                                dbs.forEach(db => { if (db.name) indexedDB.deleteDatabase(db.name); });
                            }

                            // 5. Preparar el re-login
                            sessionStorage.setItem('pending_login', 'true');
                            sessionStorage.setItem('force_login_prompt', 'true');

                            // 6. Recarga total desde el servidor
                            window.location.reload(true);
                        }
                    }
                },


                { 
                    id: 'btn-clear-settings',
                    label: 'Limpiar Ajustes', 
                    tipo: 'button',
                    color: '#28a745', // Verde
                    accion: () => {
                        // Ejecución directa al pulsar
                        if (confirm("¿Deseas limpiar la configuración local y volver a sincronizar con la nube? (No se borrarán tus cantos, solo se refrescarán los ajustes)")) {
                            
                            console.log("🧹 Iniciando limpieza de LocalStorage...");
                            
                            // Borramos solo lo que nos interesa para no cerrar la sesión del usuario
                            Object.keys(localStorage).forEach(key => {
                                if (key.startsWith('pref-') || 
                                    key.startsWith('scroll_') || 
                                    key.startsWith('nota_personal_') ||
                                    key.startsWith('url_personal_') ||
                                    key.startsWith('audio_personal_url_')) {
                                    localStorage.removeItem(key);
                                }
                            });

                            console.log("✅ Limpieza completada. Recargando...");
                            
                            // Recargamos la página para que Firebase vuelva a bajar todo de cero
                            window.location.reload();
                        }
                    }
                }
            ]
        },


    // ==========================================
    // TAB O MODULO DE LOS CANTOS
    // ==========================================


        {
            id: 'tab-tema',
            label: 'Tema',
            icon: 'palette',
            secciones: [

    // MODO OSCURO - TEMA

                { 
                    id: 'global-set-dark',
                    label: 'Modo Oscuro', 
                    tipo: 'switch',
                    storageKey: 'pref-dark-mode',
                    default: false,
                    accion: (val) => {
                        document.body.classList.toggle('dark-theme', val);
                        localStorage.setItem('pref-dark-mode', val);
                    }
                },

    // MODO FUENTE - TEMA
                { 
                    id: 'global-set-font',
                    label: 'Fuente', 
                    tipo: 'select', 
                    storageKey: 'pref-font-size',
                    default: '16px',
                    options: [
                        { val: '16px', text: 'Normal' },
                        { val: '18px', text: 'Grande' },
                        { val: '20px', text: 'Muy Grande' }
                    ],
                    accion: (val) => {
                        document.documentElement.style.setProperty('--font-size-base', val);
                        localStorage.setItem('pref-font-size', val);
                    }
                },

                { label: 'Cintillo / Cabecera', tipo: 'color' },
                { label: 'Texto Cabecera', tipo: 'color' },
                { label: 'Fondo del Canto', tipo: 'color' },
                { label: 'Título', tipo: 'color' },
                { label: 'Subtítulo', tipo: 'color' },
                { label: 'Texto del Canto', tipo: 'color' },
                { label: 'Acorde', tipo: 'color' },
                { label: 'Categoría Pie', tipo: 'color' },
                { label: 'Número Canto', tipo: 'color' }
            ]
        },
    ];

    // ==========================================
    // MODULO: MOTOR DE GENERACION DE HTML
    // ==========================================
    window.generarContenidoSettings = function() {
        const tabsHeader = `
            <div class="settings-tabs-bar">
                ${tabsConfig.map((tab, index) => `
                    <button class="tab-btn ${index === 0 ? 'active' : ''}" onclick="window.cambiarTab('${tab.id}')">
                        <span class="material-symbols-outlined">${tab.icon}</span>
                        <span>${tab.label}</span>
                    </button>
                `).join('')}
            </div>
        `;

        const tabsContent = tabsConfig.map((tab, index) => `
            <div id="${tab.id}" class="tab-panel ${index === 0 ? 'active' : ''}">
                ${tab.secciones.filter(opt => !opt.hidden).map(opt => {
                    // 1. Intentar obtener el valor del LocalStorage
                    const valorGuardado = opt.storageKey ? localStorage.getItem(opt.storageKey) : null;
                    
                    // 2. FILTRO DE SEGURIDAD: 
                    // Si el valor es nulo o es la palabra "undefined"/"null" por error, 
                    // usamos el valor por defecto (opt.default) o una cadena vacía.
                    const valorLimpio = (valorGuardado === null || valorGuardado === "undefined" || valorGuardado === "null") 
                                        ? (opt.default !== undefined ? opt.default : "") 
                                        : valorGuardado;

                    // 3. Lógica para los interruptores (Switch)
                    // Comparamos contra el valor ya limpio
                    const isChecked = opt.tipo === 'switch' 
                                    ? (valorLimpio === 'true' || valorLimpio === true) 
                                    : false;

                    // 4. El valor final que se enviará al renderControl (Input, Select, Range, etc.)
                    const valActual = valorLimpio;

                    return `
                    <div class="setting-row" data-id="${opt.id}">
                        <label>${opt.label}</label>
                        <div class="setting-control">${renderControl(opt, isChecked, valActual)}</div>
                    </div>`;
                }).join('')}
            </div>
        `).join('');

        return tabsHeader + `<div class="settings-tabs-container">${tabsContent}</div>`;
    };

    // ==========================================
    // MODULO: RENDERIZADO DE CONTROLES
    // ==========================================
    function renderControl(opt, isChecked, valActual) {
    if (opt.tipo === 'button') {

        const disabledAttr = opt.isDisabled ? 'disabled' : '';
        const opacityStyle = opt.isDisabled ? 'opacity: 0.5; cursor: not-allowed;' : '';

        return `
            <button id="${opt.id}" 
                    class="btn-setting-action" 
                    style="background:${opt.color || 'deepskyblue'}; ${opacityStyle}" 
                    onclick="window.ejecutarAccionTabs('${opt.id}')"
                    ${disabledAttr}>
                ${opt.icon ? `<span class="material-symbols-outlined">${opt.icon}</span>` : ''}
                <span>${opt.label}</span>
            </button>`;
    }
        const onchange = opt.accion ? `onchange="window.ejecutarAccionTabs('${opt.id}', this.type === 'checkbox' ? this.checked : this.value)"` : '';

        if (opt.tipo === 'switch') return `<label class="switch"><input type="checkbox" ${isChecked ? 'checked' : ''} ${onchange}><span class="slider"></span></label>`;
        
        if (opt.tipo === 'select') {
            const optionsHTML = opt.options ? opt.options.map(o => {
                const val = typeof o === 'object' ? o.val : o;
                const text = typeof o === 'object' ? o.text : o;
                return `<option value="${val}" ${valActual === val ? 'selected' : ''}>${text}</option>`;
            }).join('') : '';
            return `<select ${onchange}>${optionsHTML}</select>`;
        }
        
        if (opt.tipo === 'color') return `<input type="color" value="${valActual || '#bc0009'}" ${onchange}>`;
        if (opt.tipo === 'text') return `<input type="text" placeholder="..." value="${valActual || ''}" ${onchange}>`;
        
        // CONTROL DE RANGO VINCULADO (BARRA + NÚMERO)
    if (opt.tipo === 'range') {
            return `
                <div class="range-controls-wrapper" style="display: flex; align-items: center; gap: 10px; width: 100%;">
                    <input type="range" 
                        id="${opt.id}" 
                        min="${opt.min}" max="${opt.max}" step="${opt.step || 1}" 
                        value="${valActual}" 
                        style="flex-grow: 1;"
                        oninput="window.actualizarInputVinculado('${opt.id}', this.value)">
                    <input type="number" 
                        id="${opt.id}-num"
                        min="${opt.min}" max="${opt.max}" 
                        value="${valActual}" 
                        style="width: 45px; text-align: center;"
                        oninput="window.actualizarSliderVinculado('${opt.id}', this.value)">
                </div>
            `;
        }
    else if (opt.tipo === 'audio-mixer') {
        const radioVal = localStorage.getItem(opt.storageKeyRadio) || opt.defaultRadio;
        
        return `
            <div class="audio-mixer-wrapper" style="display: flex; align-items: center; gap: 10px; width: 100%;">
                <div style="display: flex; gap: 10px; white-space: nowrap;">
                    <label style="cursor: pointer; display: flex; align-items: center; gap: 4px;">
                        <input type="radio" name="radio-${opt.id}" value="original" 
                            ${radioVal === 'original' ? 'checked' : ''} 
                            onchange="window.ejecutarAccionAudioMixer('${opt.id}')"> Default
                    </label>
                    <label style="cursor: pointer; display: flex; align-items: center; gap: 4px;">
                        <input type="radio" name="radio-${opt.id}" value="personal" 
                            ${radioVal === 'personal' ? 'checked' : ''} 
                            onchange="window.ejecutarAccionAudioMixer('${opt.id}')"> Personal
                    </label>
                </div>
                <input type="text" id="input-${opt.id}" 
                    placeholder="${opt.placeholder}" 
                    value="${valActual}" 
                    style="flex-grow: 1; padding: 5px;"
                    oninput="window.ejecutarAccionAudioMixer('${opt.id}')">
            </div>
        `;
    }
        return '';
    }


    // ==========================================
    // MODULO: LOGICA DE NAVEGACION Y EJECUCION
    // ==========================================
    window.cambiarTab = function(tabId) {
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        const targetTab = document.getElementById(tabId);
        if(targetTab) targetTab.classList.add('active');
        if(event) event.currentTarget.classList.add('active');
    };

    window.ejecutarAccionTabs = (id, valor, esManual = false) => {
        let opcion;
        tabsConfig.forEach(tab => {
            const encontrada = tab.secciones.find(s => s.id === id);
            if (encontrada) opcion = encontrada;
        });

    if (opcion) {

            if (opcion.tipo === 'button' && opcion.isDisabled) return; 

            const valorLimpio = (valor === undefined || valor === null || valor === "undefined") ? "" : valor;
            
            // Pasamos esManual a la función accion
            if (opcion.accion) opcion.accion(valorLimpio, esManual);
            
            if (opcion.storageKey) {
                localStorage.setItem(opcion.storageKey, valorLimpio);
            }
        }
    };

    // ==========================================
    // MODULO: VINCULACIÓN BARRA-NÚMERO
    // ==========================================
    window.actualizarInputVinculado = (id, val) => {
        const contenedor = document.querySelector(`[data-id="${id}"]`);
        if (contenedor) {
            const numInput = contenedor.querySelector('input[type="number"]');
            if (numInput) numInput.value = val;
        }
        // Enviamos TRUE porque el usuario está moviendo el slider
        window.ejecutarAccionTabs(id, val, true); 
    };

    window.actualizarSliderVinculado = (id, val) => {
        const contenedor = document.querySelector(`[data-id="${id}"]`);
        if (contenedor) {
            const slider = contenedor.querySelector('input[type="range"]');
            if (slider) {
                let n = parseInt(val);
                if (n > slider.max) n = slider.max;
                if (n < slider.min) n = slider.min;
                slider.value = n;
                window.ejecutarAccionTabs(id, n, true); // Enviamos TRUE
            }
        }
    };


    // ==========================================
    // MODULO: FUNCIONES DE LOS ATRIBUTOS
    // ==========================================
    window.reestablecerWakeLock = async () => {
        const isActive = localStorage.getItem('pref-wakelock') === 'true';
        if (isActive && document.visibilityState === 'visible') {
            window.wakeLock = await navigator.wakeLock.request('screen');
        }
    };



    // ==========================================
    // MODULO: PERSISTENCIA Y CARGA DINÁMICA
    // ==========================================
    (function aplicarPreferenciasGlobales() {
        const ejecutarCarga = () => {
            tabsConfig.forEach(tab => {
                tab.secciones.forEach(opt => {
                    if (opt.accion && opt.storageKey) {
                        const key = typeof opt.storageKey === 'function' ? opt.storageKey() : opt.storageKey;
                        const val = localStorage.getItem(key) || opt.default;
                        const finalVal = opt.tipo === 'switch' ? val === 'true' : val;
                        opt.accion(finalVal);
                    }
                });
            });
        };

        // Ejecución inicial inmediata
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ejecutarCarga);
        } else {
            ejecutarCarga();
        }

    })();

// ==========================================
// MODULO: MOVIMIENTO DE BAJADA DEL CANTO
// ==========================================

// Esta función es la que "mueve la bolita" del slider cuando llega el dato de Firebase
// ==========================================
// MODULO: SINCRONIZACIÓN DE DATOS (FIREBASE -> UI -> MOTOR)
// ==========================================


    window.actualizarValoresUI = () => {
        const device = window.innerWidth < 768 ? 'mobile' : window.innerWidth < 992 ? 'tablet' : 'desktop';
        
        const datosCantoBase = (typeof allCantosData !== 'undefined') 
            ? allCantosData.find(c => c.id === currentCantoId) 
            : null;

        const controles = [
            { id: 'set-scroll-v', tipo: 'v' },
            { id: 'set-scroll-i', tipo: 'i' }
        ];

        controles.forEach(control => {
            const storageKey = `scroll_${control.tipo}_${device}_${currentCantoId}`;
            
            // 1. Intentamos obtener lo que descargó Firebase
            let valorNube = localStorage.getItem(storageKey);
            let valorFinal = null;

            // 2. REGLA DE ORO: Si existe en LocalStorage (descargado previamente por Auth), manda la nube.
            // Usamos !isNaN para permitir el valor 0.
            if (valorNube !== null && valorNube !== "null" && !isNaN(parseInt(valorNube))) {
                valorFinal = parseInt(valorNube);
                console.log(`☁️ [Prioridad Nube] ${control.id}: ${valorFinal}`);
            } 
            // 3. Respaldo: Archivo local canto_data.js
            else if (datosCantoBase && datosCantoBase.scrollConfig) {
                const configBase = datosCantoBase.scrollConfig[device] || datosCantoBase.scrollConfig['desktop'];
                valorFinal = configBase[control.tipo];
                console.log(`📦 [Respaldo Local] ${control.id}: ${valorFinal}`);
            }

            if (valorFinal !== null) {
                const valNum = parseInt(valorFinal);
                const inputSlider = document.getElementById(control.id);
                if (inputSlider) {
                    // 1. Movemos la barra
                    inputSlider.value = valNum; 
                    
                    // 2. Buscamos el input de número que está en el mismo contenedor
                    const contenedor = inputSlider.closest('.range-controls-wrapper');
                    if (contenedor) {
                        const numInput = contenedor.querySelector('input[type="number"]');
                        if (numInput) numInput.value = valNum;
                    }
                    console.log(`🎯 UI Sincronizada: ${control.id} a ${valNum}`);
                }

                // Aplicar al motor de scroll
                const seccion = window.tabsConfig.flatMap(t => t.secciones).find(s => s.id === control.id);
                if (seccion && typeof seccion.accion === 'function') {
                    seccion.accion(valNum, false); // false = no volver a subir a la nube
                }
            }
        });

    /*
        // ==========================================
        // Mover Switch de expandir
        // ==========================================
        const expandirTodoStorage = localStorage.getItem('pref-expandir-todo');
        const checkExpandir = document.getElementById('pref-expandir-todo'); 

        if (checkExpandir && expandirTodoStorage !== null) {
            const estadoBool = (expandirTodoStorage === 'true');
            
            // Forzamos un micro-delay para que el DOM se asiente
            setTimeout(() => {
                checkExpandir.checked = estadoBool;
                
                // Disparamos el evento nativo
                checkExpandir.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Si usas jQuery o algún framework que necesite trigger manual:
                // $(checkExpandir).trigger('change'); 

                console.log("🔧 UI: Switch 'Expandir Todo' forzado a:", estadoBool);
            }, 100); 
        }

        */

        // ==========================================
        // Mover Switch de expandir (CORREGIDO)
        // ==========================================
        const expandirTodoStorage = localStorage.getItem('pref-expandir-todo');
        
        // USAMOS EL ID QUE DEFINISTE EN TABSCONFIG: 'set-expandir-canto'
        // El input checkbox suele estar dentro de una etiqueta con ese data-id
        const filaExpandir = document.querySelector('[data-id="set-expandir-canto"]');
        const checkExpandir = filaExpandir ? filaExpandir.querySelector('input[type="checkbox"]') : null;

        if (checkExpandir && expandirTodoStorage !== null) {
            const estadoBool = (expandirTodoStorage === 'true');
            
            setTimeout(() => {
                checkExpandir.checked = estadoBool;
                
                // Esto asegura que el color del switch cambie visualmente
                const slider = checkExpandir.parentElement;
                if (slider) {
                    estadoBool ? slider.classList.add('active') : slider.classList.remove('active');
                }

                console.log("🔧 UI: Switch 'Expandir Todo' sincronizado a:", estadoBool);
            }, 100); 
        }

        
    };

}


