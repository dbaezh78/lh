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
    // DEFINICIÓN DE COLUMNAS DE SANTOS (SINCRONIZACIÓN LOCAL Y FIREBASE)
    // ==========================================
    window.COLUMNAS_SANTOS_DEF = [
        { key: 'nombre', label: 'Columna: Nombre' },
        { key: 'nacimiento', label: 'Columna: Nacimiento' },
        { key: 'muerte', label: 'Columna: Mortalidad' },
        { key: 'celebracion', label: 'Columna: Celebración' },
        { key: 'pais', label: 'Columna: País' },
        { key: 'ciudad', label: 'Columna: Ciudad' },
        { key: 'realidad', label: 'Columna: Realidad' },
        { key: 'historia', label: 'Columna: Historial' },
        { key: 'detalle', label: 'Columna: Detalle' },
        { key: 'hijos', label: 'Columna: Hijos en la fe' },
        { key: 'acciones', label: 'Columna: Acciones' }
    ];

    window.obtenerColumnasOcultasSantos = function() {
        try {
            const raw = localStorage.getItem('lh_santos_columnas_ocultas');
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return [];
    };

    window.esColumnaSantoVisible = function(colKey) {
        const ocultas = window.obtenerColumnasOcultasSantos();
        return !ocultas.includes(colKey);
    };

    window.setColumnaSantoVisible = function(colKey, visible) {
        let ocultas = window.obtenerColumnasOcultasSantos();
        if (visible) {
            ocultas = ocultas.filter(k => k !== colKey);
        } else {
            if (!ocultas.includes(colKey)) ocultas.push(colKey);
        }
        localStorage.setItem('lh_santos_columnas_ocultas', JSON.stringify(ocultas));

        const seleccionadas = {};
        window.COLUMNAS_SANTOS_DEF.forEach(c => {
            seleccionadas[c.key] = !ocultas.includes(c.key);
        });
        localStorage.setItem('lh_santos_columnas_visibles', JSON.stringify(seleccionadas));

        // Notificar evento
        window.dispatchEvent(new CustomEvent('lh-columnas-santos-changed', {
            detail: { ocultas, colKey, visible, seleccionadas }
        }));

        // Sincronizar automáticamente en Firebase Firestore
        if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
            window.firebaseAPI.guardarAjustesFirestore('columnas_santos', {
                ocultas,
                seleccionadas,
                actualizado: new Date().toISOString()
            }).catch(e => console.warn("Error guardando columnas en Firebase:", e));
        }
    };

    window.mostrarTodasColumnasSantos = function() {
        localStorage.setItem('lh_santos_columnas_ocultas', JSON.stringify([]));
        const seleccionadas = {};
        window.COLUMNAS_SANTOS_DEF.forEach(c => { seleccionadas[c.key] = true; });
        localStorage.setItem('lh_santos_columnas_visibles', JSON.stringify(seleccionadas));

        window.dispatchEvent(new CustomEvent('lh-columnas-santos-changed', {
            detail: { ocultas: [], seleccionadas }
        }));

        if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
            window.firebaseAPI.guardarAjustesFirestore('columnas_santos', {
                ocultas: [],
                seleccionadas,
                actualizado: new Date().toISOString()
            }).catch(e => console.warn("Error guardando columnas en Firebase:", e));
        }

        const modal = document.getElementById('modal-global-settings');
        if (modal) {
            const content = modal.querySelector('.settings-content');
            if (content && window.generarContenidoSettings) {
                content.innerHTML = window.generarContenidoSettings();
            }
        }
    };

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

    // MODO TIPOGRAFIA - TEMA
                { 
                    id: 'global-set-font-family',
                    label: 'Tipo de Fuente', 
                    tipo: 'select', 
                    storageKey: 'pref-font-family',
                    default: 'Verdana, Arial, sans-serif',
                    options: [
                        { val: 'Verdana, Arial, sans-serif', text: 'Verdana (Resucitó/Salterios)' },
                        { val: "'Caveat', cursive", text: 'Caveat (Manuscrita Portada)' },
                        { val: "'Crimson Pro', Georgia, serif", text: 'Crimson Pro (Litúrgica Serif)' },
                        { val: 'system-ui, -apple-system, sans-serif', text: 'Sistema (Moderna)' }
                    ],
                    accion: (val) => {
                        document.documentElement.style.setProperty('--fuente-portada', val);
                        document.body.style.fontFamily = val;
                        localStorage.setItem('pref-font-family', val);
                    }
                },

    // MODO FUENTE - TEMA
                { 
                    id: 'global-set-font',
                    label: 'Tamaño de Fuente', 
                    tipo: 'select', 
                    storageKey: 'pref-font-size',
                    default: '16px',
                    options: [
                        { val: '14px', text: 'Pequeño' },
                        { val: '16px', text: 'Normal' },
                        { val: '18px', text: 'Grande' },
                        { val: '22px', text: 'Muy Grande' }
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

    // ==========================================
    // MODULO: TAB TEXTO A VOZ (TTS)
    // ==========================================
        {
            id: 'tab-tts',
            label: 'Texto a Voz',
            icon: 'record_voice_over',
            secciones: [
                {
                    id: 'global-tts-voice',
                    label: 'Voz de Lectura',
                    tipo: 'select',
                    storageKey: 'pref-tts-voice',
                    default: 'Google español (Google)',
                    options: () => obtenerListaVocesDisponibles(),
                    accion: (val) => {
                        localStorage.setItem('pref-tts-voice', val);
                    }
                },
                {
                    id: 'global-tts-rate',
                    label: 'Velocidad de Lectura',
                    tipo: 'range',
                    storageKey: 'pref-tts-rate',
                    default: '1.0',
                    min: 0.5,
                    max: 2.0,
                    step: 0.1,
                    accion: (val) => {
                        localStorage.setItem('pref-tts-rate', val);
                    }
                },
                {
                    id: 'btn-test-tts',
                    label: 'Probar Voz y Velocidad',
                    tipo: 'button',
                    icon: 'volume_up',
                    color: '#0288d1',
                    accion: () => {
                        window.probarTextoVozAjustes();
                    }
                }
            ]
        },

        // ==========================================
        // MODULO: TAB COLUMNAS DE SANTOS
        // ==========================================
        {
            id: 'tab-columnas-santos',
            label: 'Columnas Santos',
            icon: 'view_column',
            secciones: [
                ...window.COLUMNAS_SANTOS_DEF.map(c => ({
                    id: `col-santo-${c.key}`,
                    label: c.label,
                    tipo: 'switch',
                    getValue: () => window.esColumnaSantoVisible(c.key),
                    default: true,
                    accion: (val) => {
                        window.setColumnaSantoVisible(c.key, val);
                    }
                })),
                {
                    id: 'btn-mostrar-todas-cols',
                    label: 'Mostrar Todas las Columnas',
                    tipo: 'button',
                    icon: 'visibility',
                    color: '#0288d1',
                    accion: () => {
                        window.mostrarTodasColumnasSantos();
                    }
                },
                {
                    id: 'btn-reset-anchos-cols',
                    label: 'Restablecer Ancho de Columnas',
                    tipo: 'button',
                    icon: 'settings_backup_restore',
                    color: '#e65100',
                    accion: async () => {
                        try {
                            localStorage.removeItem('lh_santos_columnas_anchos');
                            window.dispatchEvent(new CustomEvent('lh-anchos-santos-reset'));
                            if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
                                await window.firebaseAPI.guardarAjustesFirestore('anchos_columnas_santos', {
                                    anchos: null,
                                    actualizado: new Date().toISOString()
                                });
                            }
                            alert("📏 Anchos de columnas restablecidos a los valores por defecto.");
                        } catch (e) {
                            console.error(e);
                        }
                    }
                },
                {
                    id: 'btn-sync-firebase-cols',
                    label: 'Guardar Columnas en Firebase',
                    tipo: 'button',
                    icon: 'cloud_upload',
                    color: '#2e7d32',
                    accion: async () => {
                        if (!window.firebaseAPI || !window.firebaseAPI.guardarAjustesFirestore) {
                            alert("Firebase aún se está conectando. Espera unos segundos y reintenta.");
                            return;
                        }
                        const ocultas = window.obtenerColumnasOcultasSantos();
                        const seleccionadas = {};
                        window.COLUMNAS_SANTOS_DEF.forEach(c => {
                            seleccionadas[c.key] = !ocultas.includes(c.key);
                        });
                        const ok = await window.firebaseAPI.guardarAjustesFirestore('columnas_santos', {
                            ocultas,
                            seleccionadas,
                            actualizado: new Date().toISOString()
                        });
                        if (ok) {
                            alert("🎉 ¡Selección de columnas guardada correctamente en Firebase Cloud Firestore!");
                        } else {
                            alert("⚠️ Hubo un inconveniente al guardar en Firebase. Revisa tu conexión a internet.");
                        }
                    }
                }
            ]
        }
    ];

    // ==========================================
    // MODULO: VOCES PARA TEXTO A VOZ (TTS)
    // ==========================================
    function obtenerListaVocesDisponibles() {
        const top4 = [
            { id: 'Microsoft Raul - Spanish (Mexico)', match: ['raul'], label: 'Microsoft Raul - Spanish (Mexico)' },
            { id: 'Microsoft Sabina - Spanish (Mexico)', match: ['sabina'], label: 'Microsoft Sabina - Spanish (Mexico)' },
            { id: 'Google español (Google)', realName: 'Google español', match: ['google español', 'google spanish'], label: 'Google español (Google)' },
            { id: 'Google español de Estados Unidos (Google)', realName: 'Google español de Estados Unidos', match: ['estados unidos'], label: 'Google español de Estados Unidos (Google)' }
        ];

        const list = [];
        const voices = (typeof window !== 'undefined' && 'speechSynthesis' in window) 
            ? (window.speechSynthesis.getVoices() || []) 
            : [];

        // 1. Agregar de primero las cuatro voces preferidas
        top4.forEach(top => {
            const voiceFound = voices.find(v => {
                const vName = (v.name || '').toLowerCase();
                if (top.id.toLowerCase() === vName) return true;
                if (top.realName && top.realName.toLowerCase() === vName) return true;
                if (top.id.includes('Estados Unidos')) {
                    return vName.includes('estados unidos') && vName.includes('google');
                }
                if (top.id.includes('Google español') && !top.id.includes('Estados Unidos')) {
                    return vName.includes('google') && vName.includes('español') && !vName.includes('estados unidos');
                }
                if (top.match && top.match.some(m => vName.includes(m))) return true;
                return false;
            });

            list.push({
                val: voiceFound ? voiceFound.name : top.id,
                text: top.label
            });
        });

        // 2. Agregar el resto de voces disponibles en el navegador
        if (voices.length > 0) {
            const ordenIdiomas = ['es', 'en', 'it', 'pt', 'fr', 'la', 'de', 'ru', 'zh'];
            const nombresIdiomas = {
                'es': 'Español',
                'en': 'Inglés',
                'it': 'Italiano',
                'pt': 'Portugués',
                'fr': 'Francés',
                'la': 'Latín',
                'de': 'Alemán',
                'ru': 'Ruso',
                'zh': 'Chino'
            };

            const restantes = voices.filter(v => {
                const vName = (v.name || '').toLowerCase();
                // Excluir si ya fue incluida en las 4 principales
                const yaEsta = list.some(item => {
                    const itemVal = (item.val || '').toLowerCase();
                    if (itemVal === vName) return true;
                    if (vName.includes('raul') && itemVal.includes('raul')) return true;
                    if (vName.includes('sabina') && itemVal.includes('sabina')) return true;
                    if (vName.includes('google') && vName.includes('español')) return true;
                    return false;
                });
                return !yaEsta;
            });

            restantes.sort((a, b) => {
                const langA = (a.lang || '').toLowerCase().replace(/_/g, '-');
                const langB = (b.lang || '').toLowerCase().replace(/_/g, '-');
                const prefA = langA.split('-')[0];
                const prefB = langB.split('-')[0];
                const idxA = ordenIdiomas.indexOf(prefA);
                const idxB = ordenIdiomas.indexOf(prefB);
                const rankA = idxA === -1 ? 999 : idxA;
                const rankB = idxB === -1 ? 999 : idxB;

                if (rankA !== rankB) return rankA - rankB;
                if (langA !== langB) return langA.localeCompare(langB);
                return a.name.localeCompare(b.name);
            });

            restantes.forEach(v => {
                const langCode = (v.lang || '').replace(/_/g, '-');
                const pref = langCode.toLowerCase().split('-')[0];
                const nombreIdioma = nombresIdiomas[pref] || langCode;
                list.push({
                    val: v.name,
                    text: `${nombreIdioma} - ${v.name} (${langCode})`
                });
            });
        }

        return list;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            const select = document.querySelector('[data-id="global-tts-voice"] select');
            if (select) {
                const valActual = localStorage.getItem('pref-tts-voice') || '';
                const opts = obtenerListaVocesDisponibles();
                select.innerHTML = opts.map(o => `<option value="${o.val}" ${(o.val === valActual || o.text === valActual) ? 'selected' : ''}>${o.text}</option>`).join('');
            }
        };
    }

    window.probarTextoVozAjustes = () => {
        if (!('speechSynthesis' in window)) {
            alert('Tu navegador no soporta síntesis de voz.');
            return;
        }
        window.speechSynthesis.cancel();
        const texto = 'Liturgia de las Horas. Esta es una prueba de voz con la velocidad configurada.';
        const utter = new SpeechSynthesisUtterance(texto);
        const vozGuardada = localStorage.getItem('pref-tts-voice') || '';
        const voices = window.speechSynthesis.getVoices() || [];

        let encontrada = null;
        if (vozGuardada) {
            encontrada = voices.find(v => 
                v.name === vozGuardada || 
                v.name.toLowerCase() === vozGuardada.toLowerCase() ||
                (vozGuardada.includes('Raul') && v.name.includes('Raul')) ||
                (vozGuardada.includes('Sabina') && v.name.includes('Sabina')) ||
                (vozGuardada.includes('Estados Unidos') && v.name.includes('Estados Unidos') && v.name.includes('Google')) ||
                (vozGuardada.startsWith('Google español') && !vozGuardada.includes('Estados Unidos') && v.name.startsWith('Google español') && !v.name.includes('Estados Unidos'))
            );
        }
        if (!encontrada) {
            encontrada = voices.find(v => v.name.includes('Raul'))
                      || voices.find(v => v.name.includes('Sabina'))
                      || voices.find(v => v.name.startsWith('Google español'))
                      || voices.find(v => (v.lang || '').toLowerCase().startsWith('es'));
        }

        if (encontrada) utter.voice = encontrada;

        const rateGuardado = parseFloat(localStorage.getItem('pref-tts-rate') || '1.0');
        utter.rate = (!isNaN(rateGuardado) && rateGuardado >= 0.5 && rateGuardado <= 2.0) ? rateGuardado : 1.0;

        window.speechSynthesis.speak(utter);
    };

    // ==========================================
    // MODULO: MOTOR DE GENERACION DE HTML
    // ==========================================
    window.generarContenidoSettings = function() {
        const tabGuardado = localStorage.getItem('pref-active-tab');
        const activeTabId = (tabGuardado && tabsConfig.some(t => t.id === tabGuardado)) 
                            ? tabGuardado 
                            : tabsConfig[0].id;

        const tabsHeader = `
            <div class="settings-tabs-bar">
                ${tabsConfig.map((tab) => `
                    <button class="tab-btn ${tab.id === activeTabId ? 'active' : ''}" onclick="window.cambiarTab('${tab.id}')">
                        <span class="material-symbols-outlined">${tab.icon}</span>
                        <span>${tab.label}</span>
                    </button>
                `).join('')}
            </div>
        `;

        const tabsContent = tabsConfig.map((tab) => `
            <div id="${tab.id}" class="tab-panel ${tab.id === activeTabId ? 'active' : ''}">
                ${tab.secciones.filter(opt => !opt.hidden).map(opt => {
                    // 1. Intentar obtener el valor de getValue o de LocalStorage
                    const valorGuardado = (typeof opt.getValue === 'function')
                                        ? opt.getValue()
                                        : (opt.storageKey ? localStorage.getItem(typeof opt.storageKey === 'function' ? opt.storageKey() : opt.storageKey) : null);
                    
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
            const rawOptions = typeof opt.options === 'function' ? opt.options() : opt.options;
            const optionsHTML = rawOptions ? rawOptions.map(o => {
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
                        min="${opt.min}" max="${opt.max}" step="${opt.step || 1}"
                        value="${valActual}" 
                        style="width: 55px; text-align: center;"
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
        if(window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');
        localStorage.setItem('pref-active-tab', tabId);
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
                let n = parseFloat(val);
                if (isNaN(n)) return;
                if (n > parseFloat(slider.max)) n = parseFloat(slider.max);
                if (n < parseFloat(slider.min)) n = parseFloat(slider.min);
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

    // ==========================================
    // SINCRONIZACIÓN INICIAL CON FIREBASE (COLUMNAS SANTOS)
    // ==========================================
    if (typeof window !== 'undefined') {
        const sincronizarColumnasDesdeFirebase = async () => {
            if (window.firebaseAPI && window.firebaseAPI.cargarAjustesFirestore) {
                try {
                    const datos = await window.firebaseAPI.cargarAjustesFirestore('columnas_santos');
                    if (datos) {
                        const ocultasRemotas = Array.isArray(datos) ? datos : (datos.ocultas || []);
                        if (Array.isArray(ocultasRemotas)) {
                            localStorage.setItem('lh_santos_columnas_ocultas', JSON.stringify(ocultasRemotas));
                            window.dispatchEvent(new CustomEvent('lh-columnas-santos-changed', { detail: { ocultas: ocultasRemotas } }));
                            console.log("☁️ [Ajustes] Columnas de santos sincronizadas desde Firebase.");
                        }
                    }
                } catch (err) {
                    console.warn("Aviso cargando columnas de Firebase:", err);
                }
            }
        };

        if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
            window.firebaseAPI.onAuthReady(sincronizarColumnasDesdeFirebase);
        } else {
            const checkFBC = setInterval(() => {
                if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
                    window.firebaseAPI.onAuthReady(sincronizarColumnasDesdeFirebase);
                    clearInterval(checkFBC);
                }
            }, 600);
        }
    }

}



