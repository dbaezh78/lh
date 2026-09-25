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

    // ================================================
    // VERIFICACIÓN DE ADMINISTRADOR GENERAL (dbaezh78@gmail.com)
    // ================================================
    window.esUsuarioAdminAutorizado = function() {
        const ADMIN_EMAIL = 'dbaezh78@gmail.com';
        const currentUser = (window.firebaseAPI && window.firebaseAPI.getCurrentUser) 
            ? window.firebaseAPI.getCurrentUser() 
            : (window.firebaseAPI?.auth?.currentUser || window.currentUser);
        const email = (currentUser?.email || localStorage.getItem('lh_auth_email') || localStorage.getItem('user_email') || '').toLowerCase().trim();
        const cachedIsAdmin = localStorage.getItem('lh_auth_is_admin') === 'true';
        if (email === ADMIN_EMAIL.toLowerCase()) return true;
        if (cachedIsAdmin && (!email || email === ADMIN_EMAIL.toLowerCase())) return true;
        if (window.firebaseAPI && typeof window.firebaseAPI.isAdmin === 'function' && window.firebaseAPI.isAdmin()) return true;
        return false;
    };

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
    // MODULO: PERSONALIZACIÓN DE REPRODUCTORES (EVANGELIO Y SANTO)
    // ==========================================
    window.DEFAULTS_REPRODUCTORES = {
        evangelio: {
            bg: 'rgba(255, 255, 255, 0.2)',
            icon: '#ffffff',
            border: 'rgba(255, 255, 255, 0.6)',
            ringBg: 'rgba(255, 255, 255, 0.3)',
            ringBar: '#ffffff',
            playBg: '#2f5cd3',
            playIcon: '#ffffff',
            playBorder: '#5298ff',
            playRingBar: '#ffffff'
        },
        santo: {
            bg: '#ffffff',
            icon: '#0288d1',
            border: '#e1f5fe',
            ringBg: '#e1f5fe',
            ringBar: '#0288d1',
            playBg: '#ffffff',
            playIcon: '#d32f2f',
            playBorder: '#d32f2f',
            playRingBar: '#d32f2f'
        }
    };

    window.PRESETS_REPRODUCTORES = {
        original: {
            nombre: 'Predeterminado (Original)'
        },
        azul: {
            nombre: 'Azul Litúrgico',
            bg: '#e1f5fe',
            icon: '#0288d1',
            border: '#0288d1',
            ringBg: '#b3e5fc',
            ringBar: '#01579b',
            playBg: '#0288d1',
            playIcon: '#ffffff',
            playBorder: '#01579b',
            playRingBar: '#b3e5fc'
        },
        rojo: {
            nombre: 'Rojo Carmesí',
            bg: '#ffebee',
            icon: '#d32f2f',
            border: '#d32f2f',
            ringBg: '#ffcdd2',
            ringBar: '#b71c1c',
            playBg: '#d32f2f',
            playIcon: '#ffffff',
            playBorder: '#b71c1c',
            playRingBar: '#ffebee'
        },
        verde: {
            nombre: 'Verde Esperanza',
            bg: '#e8f5e9',
            icon: '#2e7d32',
            border: '#2e7d32',
            ringBg: '#c8e6c9',
            ringBar: '#1b5e20',
            playBg: '#2e7d32',
            playIcon: '#ffffff',
            playBorder: '#1b5e20',
            playRingBar: '#e8f5e9'
        },
        dorado: {
            nombre: 'Dorado / Oro',
            bg: '#fff8e1',
            icon: '#f57f17',
            border: '#fbc02d',
            ringBg: '#ffecb3',
            ringBar: '#f57f17',
            playBg: '#f57f17',
            playIcon: '#ffffff',
            playBorder: '#ff6f00',
            playRingBar: '#fff8e1'
        },
        morado: {
            nombre: 'Morado Penitencial',
            bg: '#f3e5f5',
            icon: '#7b1fa2',
            border: '#7b1fa2',
            ringBg: '#e1bee7',
            ringBar: '#4a148c',
            playBg: '#7b1fa2',
            playIcon: '#ffffff',
            playBorder: '#4a148c',
            playRingBar: '#f3e5f5'
        },
        blanco: {
            nombre: 'Blanco Puro',
            bg: '#ffffff',
            icon: '#37474f',
            border: '#cfd8dc',
            ringBg: '#eceff1',
            ringBar: '#607d8b',
            playBg: '#37474f',
            playIcon: '#ffffff',
            playBorder: '#263238',
            playRingBar: '#eceff1'
        },
        oscuro: {
            nombre: 'Modo Noche (Oscuro)',
            bg: '#263238',
            icon: '#eceff1',
            border: '#37474f',
            ringBg: '#455a64',
            ringBar: '#80d8ff',
            playBg: '#00b0ff',
            playIcon: '#ffffff',
            playBorder: '#80d8ff',
            playRingBar: '#ffffff'
        }
    };

    window.PROPIEDADES_REPRODUCTOR_DEF = [
        { key: 'bg', label: 'Fondo del botón (Reposo)' },
        { key: 'icon', label: 'Color del Ícono (Reposo)' },
        { key: 'border', label: 'Borde del botón (Reposo)' },
        { key: 'ringBg', label: 'Pista redonda (Fondo de barra circular)' },
        { key: 'ringBar', label: 'Barra de progreso redonda' },
        { key: 'playBg', label: 'Fondo del botón (Al dar Play)' },
        { key: 'playIcon', label: 'Color del Ícono (Al dar Play)' },
        { key: 'playBorder', label: 'Borde del botón (Al dar Play)' },
        { key: 'playRingBar', label: 'Barra de progreso redonda (Al dar Play)' }
    ];

    window.reproductorActivoPersonalizar = localStorage.getItem('pref-player-custom-active') || 'evangelio';
    window.previewEnPlay = false;

    window.colorAHex = function(color, fallback = '#0288d1') {
        if (!color || color === 'transparent') return fallback;
        color = (color + '').trim();
        if (color.startsWith('#')) {
            if (color.length === 4) {
                return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
            }
            if (color.length >= 7) return color.substring(0, 7).toLowerCase();
            return color.toLowerCase();
        }
        if (color.startsWith('rgb')) {
            const match = color.match(/\d+(\.\d+)?/g);
            if (match && match.length >= 3) {
                const r = Math.min(255, Math.max(0, parseInt(match[0], 10))).toString(16).padStart(2, '0');
                const g = Math.min(255, Math.max(0, parseInt(match[1], 10))).toString(16).padStart(2, '0');
                const b = Math.min(255, Math.max(0, parseInt(match[2], 10))).toString(16).padStart(2, '0');
                return '#' + r + g + b;
            }
        }
        const named = {
            white: '#ffffff', black: '#000000', red: '#ff0000', green: '#008000',
            blue: '#0000ff', yellow: '#ffff00', orange: '#ffa500', purple: '#800080',
            deepskyblue: '#00bfff', transparent: fallback
        };
        if (named[color.toLowerCase()]) return named[color.toLowerCase()];
        return fallback;
    };

    window.getCssVarReproductor = function(tipo, prop) {
        const pfx = tipo === 'evangelio' ? 'ev' : 'santo';
        const mapa = {
            bg: `--player-${pfx}-bg`,
            icon: `--player-${pfx}-icon`,
            border: `--player-${pfx}-border`,
            ringBg: `--player-${pfx}-ring-bg`,
            ringBar: `--player-${pfx}-ring-bar`,
            playBg: `--player-${pfx}-play-bg`,
            playIcon: `--player-${pfx}-play-icon`,
            playBorder: `--player-${pfx}-play-border`,
            playRingBar: `--player-${pfx}-play-ring-bar`
        };
        return mapa[prop];
    };

    window.obtenerColorReproductor = function(tipo, prop) {
        const key = `pref-player-${tipo}-${prop}`;
        const guardado = localStorage.getItem(key);
        if (guardado !== null && guardado !== undefined && guardado !== '') return guardado;
        const defs = window.DEFAULTS_REPRODUCTORES[tipo] || {};
        return defs[prop] || '#0288d1';
    };

    window.guardarColorReproductor = function(tipo, prop, valor) {
        const key = `pref-player-${tipo}-${prop}`;
        localStorage.setItem(key, valor);
        const cssVar = window.getCssVarReproductor(tipo, prop);
        if (cssVar) {
            document.documentElement.style.setProperty(cssVar, valor);
        }
        if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
            window.firebaseAPI.guardarAjustesFirestore(`player_${tipo}_${prop}`, {
                valor,
                actualizado: new Date().toISOString()
            }).catch(() => {});
        }
    };

    window.aplicarColoresReproductoresGlobales = function() {
        ['evangelio', 'santo'].forEach(tipo => {
            const defs = window.DEFAULTS_REPRODUCTORES[tipo];
            Object.keys(defs).forEach(prop => {
                const val = localStorage.getItem(`pref-player-${tipo}-${prop}`) || defs[prop];
                const cssVar = window.getCssVarReproductor(tipo, prop);
                if (cssVar) {
                    document.documentElement.style.setProperty(cssVar, val);
                }
            });
        });
    };

    // Aplicar estilos inmediatamente
    window.aplicarColoresReproductoresGlobales();

    window.actualizarEstiloPreview = function() {
        const tipo = window.reproductorActivoPersonalizar || 'evangelio';
        const btnReposo = document.getElementById('preview-btn-reposo');
        const btnPlay = document.getElementById('preview-btn-play');
        if (!btnReposo || !btnPlay) return;

        const colBg = window.obtenerColorReproductor(tipo, 'bg');
        const colIcon = window.obtenerColorReproductor(tipo, 'icon');
        const colBorder = window.obtenerColorReproductor(tipo, 'border');
        const colRingBg = window.obtenerColorReproductor(tipo, 'ringBg');
        const colRingBar = window.obtenerColorReproductor(tipo, 'ringBar');
        const colPlayBg = window.obtenerColorReproductor(tipo, 'playBg');
        const colPlayIcon = window.obtenerColorReproductor(tipo, 'playIcon');
        const colPlayBorder = window.obtenerColorReproductor(tipo, 'playBorder');
        const colPlayRingBar = window.obtenerColorReproductor(tipo, 'playRingBar');

        // Estado Reposo
        btnReposo.style.background = colBg;
        btnReposo.style.color = colIcon;
        btnReposo.style.border = `1.5px solid ${colBorder}`;
        const circleBgReposo = btnReposo.querySelector('.preview-circle-bg');
        const circleBarReposo = btnReposo.querySelector('.preview-circle-bar');
        if (circleBgReposo) circleBgReposo.style.stroke = colRingBg;
        if (circleBarReposo) circleBarReposo.style.stroke = colRingBar;

        // Estado Play
        btnPlay.style.background = colPlayBg;
        btnPlay.style.color = colPlayIcon;
        btnPlay.style.border = `1.5px solid ${colPlayBorder}`;
        const circleBgPlay = btnPlay.querySelector('.preview-circle-bg');
        const circleBarPlay = btnPlay.querySelector('.preview-circle-bar');
        if (circleBgPlay) circleBgPlay.style.stroke = colRingBg;
        if (circleBarPlay) circleBarPlay.style.stroke = colPlayRingBar;
    };

    window.togglePreviewReproductor = function(forzar) {
        if (typeof forzar === 'boolean') {
            window.previewEnPlay = forzar;
        } else {
            window.previewEnPlay = !window.previewEnPlay;
        }
        const btnPlay = document.getElementById('preview-btn-play');
        if (btnPlay) {
            btnPlay.classList.toggle('speaking', window.previewEnPlay);
        }
        const cont = document.getElementById('contenedor-reproductor-config');
        if (cont) {
            const headerBtn = cont.querySelector('.player-preview-header button');
            if (headerBtn) {
                headerBtn.innerHTML = `
                    <span class="material-symbols-outlined" style="font-size: 14px;">${window.previewEnPlay ? 'pause' : 'play_arrow'}</span>
                    <span>${window.previewEnPlay ? 'Pausar' : 'Probar Play'}</span>
                `;
            }
        }
    };

    window.cambiarReproductorSeleccionado = function(nuevoTipo) {
        window.reproductorActivoPersonalizar = nuevoTipo;
        localStorage.setItem('pref-player-custom-active', nuevoTipo);
        const cont = document.getElementById('contenedor-reproductor-config');
        if (cont) {
            cont.innerHTML = window.renderModuloReproductor();
        }
        window.actualizarEstiloPreview();
    };

    window.actualizarColorReproductor = function(prop, nuevoValor) {
        const tipo = window.reproductorActivoPersonalizar || 'evangelio';
        window.guardarColorReproductor(tipo, prop, nuevoValor);

        const fila = document.querySelector(`[data-player-prop="${prop}"]`);
        if (fila) {
            const badge = fila.querySelector('.color-hex-badge');
            if (badge) badge.textContent = nuevoValor;
        }

        window.actualizarEstiloPreview();
    };

    window.aplicarPresetReproductor = function(presetKey) {
        const tipo = window.reproductorActivoPersonalizar || 'evangelio';
        let paleta = null;
        if (presetKey === 'original') {
            paleta = window.DEFAULTS_REPRODUCTORES[tipo];
        } else if (window.PRESETS_REPRODUCTORES[presetKey]) {
            paleta = window.PRESETS_REPRODUCTORES[presetKey];
        }
        if (!paleta) return;

        Object.keys(paleta).forEach(prop => {
            if (prop === 'nombre') return;
            const val = paleta[prop];
            window.guardarColorReproductor(tipo, prop, val);
        });

        const cont = document.getElementById('contenedor-reproductor-config');
        if (cont) {
            cont.innerHTML = window.renderModuloReproductor();
        }
        window.actualizarEstiloPreview();
    };

    window.restablecerColoresReproductor = function() {
        const tipo = window.reproductorActivoPersonalizar || 'evangelio';
        const nombreTipo = tipo === 'evangelio' ? 'Evangelio' : 'Santo';
        if (!confirm(`¿Deseas restablecer los colores por defecto del Reproductor del ${nombreTipo}?`)) return;

        const defs = window.DEFAULTS_REPRODUCTORES[tipo];
        Object.keys(defs).forEach(prop => {
            const key = `pref-player-${tipo}-${prop}`;
            localStorage.removeItem(key);
            const cssVar = window.getCssVarReproductor(tipo, prop);
            if (cssVar) {
                document.documentElement.style.setProperty(cssVar, defs[prop]);
            }
        });

        const cont = document.getElementById('contenedor-reproductor-config');
        if (cont) {
            cont.innerHTML = window.renderModuloReproductor();
        }
        window.actualizarEstiloPreview();
    };

    window.renderModuloReproductor = function() {
        const tipo = window.reproductorActivoPersonalizar || 'evangelio';
        const esEvangelio = (tipo === 'evangelio');
        const labelNombre = esEvangelio ? 'Reproductor del Evangelio' : 'Reproductor del Santo';
        const iconoBoton = esEvangelio ? 'menu_book' : 'hearing';

        const filasColores = window.PROPIEDADES_REPRODUCTOR_DEF.map(prop => {
            const valActual = window.obtenerColorReproductor(tipo, prop.key);
            const hexVal = window.colorAHex(valActual, esEvangelio ? '#ffffff' : '#0288d1');
            return `
                <div class="setting-row" data-player-prop="${prop.key}">
                    <label>${prop.label}</label>
                    <div class="setting-control" style="display: flex; align-items: center; gap: 8px;">
                        <input type="color" value="${hexVal}" 
                               onchange="window.actualizarColorReproductor('${prop.key}', this.value)" 
                               oninput="window.actualizarColorReproductor('${prop.key}', this.value)">
                        <span class="color-hex-badge" style="font-family: monospace; font-size: 11px; opacity: 0.8; min-width: 58px;">${hexVal}</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <!-- Selector de Reproductor -->
            <div class="setting-row" style="margin-bottom: 12px;">
                <label style="font-weight: 700; color: #bc0009; display: flex; align-items: center; gap: 6px;">
                    <span class="material-symbols-outlined" style="font-size: 18px;">tune</span>
                    <span>Seleccionar Reproductor</span>
                </label>
                <div class="setting-control">
                    <select onchange="window.cambiarReproductorSeleccionado(this.value)" style="font-weight: 600;">
                        <option value="evangelio" ${esEvangelio ? 'selected' : ''}>📖 Reproductor del Evangelio</option>
                        <option value="santo" ${!esEvangelio ? 'selected' : ''}>😇 Reproductor del Santo</option>
                    </select>
                </div>
            </div>

            <!-- Paleta Predefinida -->
            <div class="setting-row" style="margin-bottom: 14px;">
                <label style="display: flex; align-items: center; gap: 6px;">
                    <span class="material-symbols-outlined" style="font-size: 18px;">palette</span>
                    <span>Paleta / Preset Rápido</span>
                </label>
                <div class="setting-control">
                    <select onchange="window.aplicarPresetReproductor(this.value)">
                        <option value="personalizado">🎨 Personalizado</option>
                        <option value="original">⭐ Predeterminado (Original)</option>
                        <option value="azul">💎 Azul Litúrgico</option>
                        <option value="rojo">🔥 Rojo Carmesí</option>
                        <option value="verde">🌿 Verde Esperanza</option>
                        <option value="dorado">✨ Dorado / Oro</option>
                        <option value="morado">💜 Morado Penitencial</option>
                        <option value="blanco">⚪ Blanco Puro</option>
                        <option value="oscuro">🌙 Modo Noche (Oscuro)</option>
                    </select>
                </div>
            </div>

            <!-- Tarjeta de Vista Previa Interactiva -->
            <div class="player-preview-card">
                <div class="player-preview-header">
                    <span>Vista Previa: ${labelNombre}</span>
                    <button type="button" class="btn-setting-action" style="padding: 4px 10px; font-size: 11px; width: auto; background: #0288d1; border-radius: 6px;" onclick="window.togglePreviewReproductor()">
                        <span class="material-symbols-outlined" style="font-size: 14px;">${window.previewEnPlay ? 'pause' : 'play_arrow'}</span>
                        <span>${window.previewEnPlay ? 'Pausar' : 'Probar Play'}</span>
                    </button>
                </div>
                <div class="player-preview-body">
                    <div class="player-preview-item">
                        <span class="preview-label">Estado Reposo</span>
                        <div id="preview-btn-reposo" class="player-preview-btn" title="En reposo" onclick="window.togglePreviewReproductor(false)">
                            <svg viewBox="0 0 32 32">
                                <circle class="preview-circle-bg" cx="16" cy="16" r="13.5" fill="none" stroke-width="2.8"></circle>
                                <circle class="preview-circle-bar" cx="16" cy="16" r="13.5" fill="none" stroke-width="2.8" stroke-linecap="round" stroke-dasharray="84.82" stroke-dashoffset="84.82"></circle>
                            </svg>
                            <span class="material-symbols-outlined">${iconoBoton}</span>
                        </div>
                    </div>
                    <div class="player-preview-item">
                        <span class="preview-label">Estado Play (Barra redonda)</span>
                        <div id="preview-btn-play" class="player-preview-btn ${window.previewEnPlay ? 'speaking' : ''}" title="Al reproducir" onclick="window.togglePreviewReproductor(true)">
                            <svg viewBox="0 0 32 32">
                                <circle class="preview-circle-bg" cx="16" cy="16" r="13.5" fill="none" stroke-width="2.8"></circle>
                                <circle class="preview-circle-bar" cx="16" cy="16" r="13.5" fill="none" stroke-width="2.8" stroke-linecap="round" stroke-dasharray="84.82" stroke-dashoffset="25" transform="rotate(-90 16 16)"></circle>
                            </svg>
                            <span class="material-symbols-outlined">${iconoBoton}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Personalización detallada de colores -->
            <div style="margin: 10px 0 6px 0; font-weight: 700; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.05em;">
                Personalización de Colores
            </div>
            ${filasColores}

            <!-- Botón Restablecer -->
            <button type="button" class="btn-setting-action" style="background: #e65100; margin-top: 14px;" onclick="window.restablecerColoresReproductor()">
                <span class="material-symbols-outlined">restart_alt</span>
                <span>Restablecer Colores de ${esEvangelio ? 'Evangelio' : 'Santo'}</span>
            </button>
        `;
    };

    window.cambiarSubtabGeneral = function(subtabId) {
        document.querySelectorAll('.settings-subtabs-bar .subtab-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-subtab') === subtabId);
        });
        document.querySelectorAll('.subtab-panel').forEach(p => {
            p.classList.toggle('active', p.id === subtabId);
        });
        localStorage.setItem('pref-active-subtab-general', subtabId);
    };

    window.cambiarNestedSubtabTema = function(nestedId) {
        document.querySelectorAll('.settings-nested-subtabs-bar .nested-subtab-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-nested') === nestedId);
        });
        document.querySelectorAll('.nested-subtab-panel').forEach(p => {
            p.classList.toggle('active', p.id === nestedId);
        });
        localStorage.setItem('pref-active-nested-tema', nestedId);
        if (nestedId === 'nested-reproductor') {
            setTimeout(() => {
                if (typeof window.actualizarEstiloPreview === 'function') {
                    window.actualizarEstiloPreview();
                }
            }, 50);
        }
    };

    window.obtenerTodasLasSecciones = function(tabs) {
        const resultado = [];
        function extraer(lista) {
            if (!lista || !Array.isArray(lista)) return;
            lista.forEach(item => {
                if (item.secciones && Array.isArray(item.secciones)) {
                    resultado.push(...item.secciones);
                }
                if (item.submodulos && Array.isArray(item.submodulos)) {
                    extraer(item.submodulos);
                }
            });
        }
        extraer(tabs);
        return resultado;
    };

    // ==========================================
    // MODULO: DEFINICION DE PESTAÑAS Y OPCIONES
    // ==========================================
    window.tabsConfig = [
        // ==========================================
        // MODULO: TAB GENERAL (CON SUBMÓDULOS AJUSTES Y TEMA)
        // ==========================================
        {
            id: 'tab-general',
            label: 'General',
            icon: 'settings',
            submodulos: [
                // ------------------------------------------
                // SUBMÓDULO 1: AJUSTES (Idioma, Pantalla, Caché, Reset)
                // ------------------------------------------
                {
                    id: 'subtab-ajustes',
                    label: 'Ajustes',
                    icon: 'tune',
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

                        // MANTENER PANTALLA ENCENDIDA
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

                        // BOTON DE LIMPIAR CACHE
                        { 
                            id: 'btn-clear-cache',
                            label: 'Limpiar Caché y Datos', 
                            tipo: 'button',
                            color: '#bc0009',
                            accion: async () => {
                                if (!navigator.onLine) {
                                    const avisoOffline = confirm("🚫 NO TIENES INTERNET.\n\nSi limpias la caché ahora, perderás el acceso offline a los cantos. ¿Deseas continuar...?");
                                    if (!avisoOffline) return;

                                    const avisoCritico = confirm("🌐📶 AVISO DE CONEXIÓN:\n\nSin Internet / DATA / RED no podrás volver a cargar la aplicación.\n\n⚠️ Asegúrate PRIMERO de que estas conectado a internet.\n\n¿Quieres Continuar?...?");
                                    if (!avisoCritico) return;
                                }

                                if(confirm("⚠ Limpiar Cache y 🔃👤 Reiniciar Sesión. ¿Continuar?")) {
                                    if (window.firebaseAPI && window.firebaseAPI.logout) {
                                        try {
                                            await window.firebaseAPI.logout();
                                            console.log("Sesión de Firebase cerrada correctamente.");
                                        } catch (e) {
                                            console.error("Error al cerrar sesión:", e);
                                        }
                                    }

                                    localStorage.clear();

                                    if ('caches' in window) {
                                        const cacheNames = await caches.keys();
                                        await Promise.all(cacheNames.map(name => caches.delete(name)));
                                    }

                                    if ('indexedDB' in window) {
                                        const dbs = await indexedDB.databases();
                                        dbs.forEach(db => { if (db.name) indexedDB.deleteDatabase(db.name); });
                                    }

                                    sessionStorage.setItem('pending_login', 'true');
                                    sessionStorage.setItem('force_login_prompt', 'true');

                                    window.location.reload(true);
                                }
                            }
                        },

                        // BOTON DE LIMPIAR AJUSTES
                        { 
                            id: 'btn-clear-settings',
                            label: 'Limpiar Ajustes', 
                            tipo: 'button',
                            color: '#28a745',
                            accion: () => {
                                if (confirm("¿Deseas limpiar la configuración local y volver a sincronizar con la nube? (No se borrarán tus cantos, solo se refrescarán los ajustes)")) {
                                    console.log("🧹 Iniciando limpieza de LocalStorage...");
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
                                    window.location.reload();
                                }
                            }
                        },

                        // SWITCH CONSTRUCTOR DE SALTERIO (DESACTIVADO POR DEFECTO, SOLO ADMIN DBAEZH78@GMAIL.COM)
                        {
                            id: 'global-set-constructor-salterio',
                            label: 'Constructor de Salterio',
                            tipo: 'switch',
                            storageKey: 'pref-activar-constructor-salterio',
                            default: false,
                            isDisabled: () => !window.esUsuarioAdminAutorizado(),
                            accion: (val, isUserInteraction = true) => {
                                if (val && !window.esUsuarioAdminAutorizado()) {
                                    if (isUserInteraction) {
                                        alert("⛔ Acceso denegado: Solo el administrador general (dbaezh78@gmail.com) tiene permiso para activar el Constructor de Salterio.");
                                    }
                                    localStorage.setItem('pref-activar-constructor-salterio', 'false');
                                    const sw = document.querySelector('#modal-global-settings input[type="checkbox"][onchange*="global-set-constructor-salterio"]');
                                    if (sw) sw.checked = false;
                                    window.dispatchEvent(new CustomEvent('lh-constructor-salterio-toggle', {
                                        detail: { activado: false }
                                    }));
                                    return;
                                }
                                const estado = val === true || val === 'true';
                                localStorage.setItem('pref-activar-constructor-salterio', estado ? 'true' : 'false');
                                window.dispatchEvent(new CustomEvent('lh-constructor-salterio-toggle', {
                                    detail: { activado: estado }
                                }));

                                if (isUserInteraction && window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
                                    window.firebaseAPI.guardarAjustesFirestore('constructor_salterio', {
                                        activado: estado,
                                        actualizado: new Date().toISOString()
                                    }).catch(e => console.warn("Error guardando ajuste de constructor en Firebase:", e));
                                }
                            }
                        }
                    ]
                },

                // ------------------------------------------
                // SUBMÓDULO 2: TEMA (Con sub-submódulos Temas y Reproductor)
                // ------------------------------------------
                {
                    id: 'subtab-tema',
                    label: 'Tema',
                    icon: 'palette',
                    submodulos: [
                        // Sub-submódulo A: Temas
                        {
                            id: 'nested-temas',
                            label: 'Temas',
                            icon: 'format_paint',
                            secciones: [
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

                        // Sub-submódulo B: Reproductor
                        {
                            id: 'nested-reproductor',
                            label: 'Reproductor',
                            icon: 'play_circle',
                            tipo: 'custom-reproductor'
                        },

                        // Sub-submódulo C: Salterios y Horas Litúrgicas
                        {
                            id: 'nested-salterios',
                            label: 'Salterios',
                            icon: 'menu_book',
                            secciones: [
                                {
                                    id: 'salterio-set-bg',
                                    label: 'Color de Fondo (Salterios)',
                                    tipo: 'color',
                                    storageKey: 'pref-salterio-bg',
                                    default: '#FFFFCB',
                                    accion: (val) => {
                                        document.documentElement.style.setProperty('--salterio-bg', val);
                                        const tema = JSON.parse(localStorage.getItem('lh_salterio_tema') || '{}');
                                        tema.bg = val;
                                        localStorage.setItem('lh_salterio_tema', JSON.stringify(tema));
                                        localStorage.setItem('pref-salterio-bg', val);
                                        if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
                                            window.firebaseAPI.guardarAjustesFirestore('salterio_tema', tema);
                                        }
                                    }
                                },
                                {
                                    id: 'salterio-set-text',
                                    label: 'Color Texto (Salmos y Lecturas)',
                                    tipo: 'color',
                                    storageKey: 'pref-salterio-text',
                                    default: '#1a1a1a',
                                    accion: (val) => {
                                        document.documentElement.style.setProperty('--salterio-text', val);
                                        const tema = JSON.parse(localStorage.getItem('lh_salterio_tema') || '{}');
                                        tema.text = val;
                                        localStorage.setItem('lh_salterio_tema', JSON.stringify(tema));
                                        localStorage.setItem('pref-salterio-text', val);
                                        if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
                                            window.firebaseAPI.guardarAjustesFirestore('salterio_tema', tema);
                                        }
                                    }
                                },
                                {
                                    id: 'salterio-set-rubrica',
                                    label: 'Color de Antífonas y Rúbricas',
                                    tipo: 'color',
                                    storageKey: 'pref-salterio-rubrica',
                                    default: '#d01212',
                                    accion: (val) => {
                                        document.documentElement.style.setProperty('--salterio-rubrica', val);
                                        const tema = JSON.parse(localStorage.getItem('lh_salterio_tema') || '{}');
                                        tema.rubrica = val;
                                        localStorage.setItem('lh_salterio_tema', JSON.stringify(tema));
                                        localStorage.setItem('pref-salterio-rubrica', val);
                                        if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
                                            window.firebaseAPI.guardarAjustesFirestore('salterio_tema', tema);
                                        }
                                    }
                                },
                                {
                                    id: 'salterio-set-font-size',
                                    label: 'Tamaño de Fuente Litúrgica',
                                    tipo: 'select',
                                    storageKey: 'pref-salterio-font-size',
                                    default: '1.06rem',
                                    options: [
                                        { val: '0.92rem', text: 'Pequeño (15px)' },
                                        { val: '1.06rem', text: 'Normal Litúrgico (17px)' },
                                        { val: '1.18rem', text: 'Grande (19px)' },
                                        { val: '1.35rem', text: 'Muy Grande (22px)' }
                                    ],
                                    accion: (val) => {
                                        document.documentElement.style.setProperty('--salterio-font-size', val);
                                        const tema = JSON.parse(localStorage.getItem('lh_salterio_tema') || '{}');
                                        tema.fontSize = val;
                                        localStorage.setItem('lh_salterio_tema', JSON.stringify(tema));
                                        localStorage.setItem('pref-salterio-font-size', val);
                                        if (window.firebaseAPI && window.firebaseAPI.guardarAjustesFirestore) {
                                            window.firebaseAPI.guardarAjustesFirestore('salterio_tema', tema);
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
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
                    default: '1.3',
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
            hidden: () => typeof window.hasPermission === 'function' && !window.hasPermission('view_settings_santos'),
            secciones: [
                ...window.COLUMNAS_SANTOS_DEF.map(c => ({
                    id: `col-santo-${c.key}`,
                    label: c.label,
                    tipo: 'switch',
                    getValue: () => window.esColumnaSantoVisible(c.key),
                    default: true,
                    isDisabled: () => typeof window.hasPermission === 'function' && !window.hasPermission('settings_santos_visibilidad'),
                    accion: (val, esManual = false) => {
                        if (esManual && typeof window.hasPermission === 'function' && !window.hasPermission('settings_santos_visibilidad')) {
                            alert("⛔ No tienes permiso para modificar la visibilidad de columnas.");
                            return;
                        }
                        window.setColumnaSantoVisible(c.key, val);
                    }
                })),
                {
                    id: 'btn-mostrar-todas-cols',
                    label: 'Mostrar Todas las Columnas',
                    tipo: 'button',
                    icon: 'visibility',
                    color: '#0288d1',
                    isDisabled: () => typeof window.hasPermission === 'function' && !window.hasPermission('settings_santos_mostrar_todas'),
                    accion: () => {
                        if (typeof window.hasPermission === 'function' && !window.hasPermission('settings_santos_mostrar_todas')) {
                            alert("⛔ No tienes permiso para mostrar todas las columnas.");
                            return;
                        }
                        window.mostrarTodasColumnasSantos();
                    }
                },
                {
                    id: 'btn-reset-anchos-cols',
                    label: 'Restablecer Ancho de Columnas',
                    tipo: 'button',
                    icon: 'settings_backup_restore',
                    color: '#e65100',
                    isDisabled: () => typeof window.hasPermission === 'function' && !window.hasPermission('settings_santos_reset_anchos'),
                    accion: async () => {
                        if (typeof window.hasPermission === 'function' && !window.hasPermission('settings_santos_reset_anchos')) {
                            alert("⛔ No tienes permiso para restablecer el ancho de columnas.");
                            return;
                        }
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
                    isDisabled: () => typeof window.hasPermission === 'function' && !window.hasPermission('settings_santos_sync_firebase'),
                    accion: async () => {
                        if (typeof window.hasPermission === 'function' && !window.hasPermission('settings_santos_sync_firebase')) {
                            alert("⛔ No tienes permiso para sincronizar columnas con Firebase.");
                            return;
                        }
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
        },
        // ==========================================
        // MODULO: TAB CALENDARIO
        // ==========================================
        {
            id: 'tab-calendario',
            label: 'Calendario',
            icon: 'calendar_month',
            hidden: () => typeof window.hasPermission === 'function' && !window.hasPermission('view_settings_calendario'),
            secciones: [
                {
                    id: 'global-set-adviento-par-impar',
                    label: 'Adviento(Par/Impar)',
                    tipo: 'switch',
                    storageKey: 'pref-adviento-par-impar',
                    default: true,
                    isDisabled: () => typeof window.hasPermission === 'function' && !window.hasPermission('settings_calendario_adviento'),
                    accion: (val, esManual = false) => {
                        if (esManual && typeof window.hasPermission === 'function' && !window.hasPermission('settings_calendario_adviento')) {
                            alert("⛔ No tienes permiso para modificar el calendario litúrgico.");
                            return;
                        }
                        localStorage.setItem('pref-adviento-par-impar', val);
                        window.dispatchEvent(new CustomEvent('lh-calendario-config-changed', {
                            detail: { advientoParImpar: val }
                        }));
                    }
                }
            ]
        },
        // ==========================================
        // MODULO: TAB CHAT (ASISTENCIA Y SOPORTE)
        // ==========================================
        {
            id: 'tab-chat',
            label: 'Chat',
            icon: 'chat',
            secciones: [
                {
                    id: 'chat-set-reaction-size',
                    label: 'Tamaño del icono de reacción',
                    tipo: 'select',
                    storageKey: 'pref-chat-reaction-size',
                    default: '24px',
                    options: [
                        { val: '18px', text: 'Pequeño (18px)' },
                        { val: '22px', text: 'Normal (22px)' },
                        { val: '26px', text: 'Grande (26px)' },
                        { val: '32px', text: 'Muy Grande (32px)' },
                        { val: '40px', text: 'Extra Grande (40px)' }
                    ],
                    accion: (val) => {
                        localStorage.setItem('pref-chat-reaction-size', val);
                        document.documentElement.style.setProperty('--chat-reaction-size', val);
                        window.dispatchEvent(new CustomEvent('lh-chat-reaction-size-changed', { detail: { size: val } }));
                    }
                },
                {
                    id: 'chat-set-reaction-range',
                    label: 'Ajuste fino tamaño de reacción (px)',
                    tipo: 'range',
                    storageKey: 'pref-chat-reaction-size-num',
                    default: '24',
                    min: 16,
                    max: 48,
                    step: 2,
                    accion: (val) => {
                        const sizeStr = `${val}px`;
                        localStorage.setItem('pref-chat-reaction-size', sizeStr);
                        localStorage.setItem('pref-chat-reaction-size-num', val);
                        document.documentElement.style.setProperty('--chat-reaction-size', sizeStr);
                        window.dispatchEvent(new CustomEvent('lh-chat-reaction-size-changed', { detail: { size: sizeStr } }));
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

        const rateGuardado = parseFloat(localStorage.getItem('pref-tts-rate') || '1.3');
        utter.rate = (!isNaN(rateGuardado) && rateGuardado >= 0.5 && rateGuardado <= 2.0) ? rateGuardado : 1.3;

        window.speechSynthesis.speak(utter);
    };

    // ==========================================
    // MODULO: MOTOR DE GENERACION DE HTML
    // ==========================================
    function renderizarListaSecciones(secciones) {
        if (!secciones || !Array.isArray(secciones)) return '';
        return secciones.filter(opt => !opt.hidden).map(opt => {
            const valorGuardado = (typeof opt.getValue === 'function')
                                ? opt.getValue()
                                : (opt.storageKey ? localStorage.getItem(typeof opt.storageKey === 'function' ? opt.storageKey() : opt.storageKey) : null);
            
            const valorLimpio = (valorGuardado === null || valorGuardado === "undefined" || valorGuardado === "null") 
                                ? (opt.default !== undefined ? opt.default : "") 
                                : valorGuardado;

            const isChecked = opt.tipo === 'switch' 
                            ? (valorLimpio === 'true' || valorLimpio === true) 
                            : false;

            const valActual = valorLimpio;

            return `
            <div class="setting-row" data-id="${opt.id || ''}">
                <label>${opt.label}</label>
                <div class="setting-control">${renderControl(opt, isChecked, valActual)}</div>
            </div>`;
        }).join('');
    }

    window.generarContenidoSettings = function() {
        let tabGuardado = localStorage.getItem('pref-active-tab');
        if (tabGuardado === 'tab-tema') {
            tabGuardado = 'tab-general';
            localStorage.setItem('pref-active-tab', 'tab-general');
            localStorage.setItem('pref-active-subtab-general', 'subtab-tema');
        }

        const tabsVisibles = tabsConfig.filter(tab => {
            if (typeof tab.hidden === 'function') return !tab.hidden();
            return !tab.hidden;
        });

        const activeTabId = (tabGuardado && tabsVisibles.some(t => t.id === tabGuardado)) 
                            ? tabGuardado 
                            : (tabsVisibles[0]?.id || 'tab-general');

        const activeSubtabGeneral = localStorage.getItem('pref-active-subtab-general') || 'subtab-ajustes';
        const activeNestedTema = localStorage.getItem('pref-active-nested-tema') || 'nested-temas';

        const tabsHeader = `
            <div class="settings-tabs-bar">
                ${tabsVisibles.map((tab) => `
                    <button type="button" class="tab-btn ${tab.id === activeTabId ? 'active' : ''}" onclick="window.cambiarTab('${tab.id}')">
                        <span class="material-symbols-outlined">${tab.icon}</span>
                        <span>${tab.label}</span>
                    </button>
                `).join('')}
            </div>
        `;

        const tabsContent = tabsVisibles.map((tab) => {
            let contenidoPanel = '';

            // Caso 1: La pestaña principal tiene submódulos (como Tab General)
            if (tab.submodulos && Array.isArray(tab.submodulos)) {
                const subtabsBar = `
                    <div class="settings-subtabs-bar">
                        ${tab.submodulos.map(sub => `
                            <button type="button" class="subtab-btn ${sub.id === activeSubtabGeneral ? 'active' : ''}" 
                                    data-subtab="${sub.id}" 
                                    onclick="window.cambiarSubtabGeneral('${sub.id}')">
                                ${sub.icon ? `<span class="material-symbols-outlined">${sub.icon}</span>` : ''}
                                <span>${sub.label}</span>
                            </button>
                        `).join('')}
                    </div>
                `;

                const subtabsContent = tab.submodulos.map(sub => {
                    let subPanelHtml = '';

                    // Caso 1.1: El submódulo tiene sub-submódulos anidados (como Tema -> Temas vs Reproductor)
                    if (sub.submodulos && Array.isArray(sub.submodulos)) {
                        const nestedBar = `
                            <div class="settings-nested-subtabs-bar">
                                ${sub.submodulos.map(nested => `
                                    <button type="button" class="nested-subtab-btn ${nested.id === activeNestedTema ? 'active' : ''}"
                                            data-nested="${nested.id}"
                                            onclick="window.cambiarNestedSubtabTema('${nested.id}')">
                                        ${nested.icon ? `<span class="material-symbols-outlined">${nested.icon}</span>` : ''}
                                        <span>${nested.label}</span>
                                    </button>
                                `).join('')}
                            </div>
                        `;

                        const nestedPanels = sub.submodulos.map(nested => {
                            let nestedContent = '';
                            if (nested.tipo === 'custom-reproductor') {
                                nestedContent = `<div id="contenedor-reproductor-config">${window.renderModuloReproductor()}</div>`;
                            } else if (nested.secciones) {
                                nestedContent = renderizarListaSecciones(nested.secciones);
                            }
                            return `
                                <div id="${nested.id}" class="nested-subtab-panel ${nested.id === activeNestedTema ? 'active' : ''}">
                                    ${nestedContent}
                                </div>
                            `;
                        }).join('');

                        subPanelHtml = nestedBar + nestedPanels;
                    } else if (sub.secciones) {
                        subPanelHtml = renderizarListaSecciones(sub.secciones);
                    }

                    return `
                        <div id="${sub.id}" class="subtab-panel ${sub.id === activeSubtabGeneral ? 'active' : ''}">
                            ${subPanelHtml}
                        </div>
                    `;
                }).join('');

                contenidoPanel = subtabsBar + subtabsContent;
            } else if (tab.secciones) {
                // Caso 2: Pestaña estándar directa con secciones (TTS, Columnas, Calendario)
                contenidoPanel = renderizarListaSecciones(tab.secciones);
            }

            return `
                <div id="${tab.id}" class="tab-panel ${tab.id === activeTabId ? 'active' : ''}">
                    ${contenidoPanel}
                </div>
            `;
        }).join('');

        setTimeout(() => {
            if (typeof window.actualizarEstiloPreview === 'function') {
                window.actualizarEstiloPreview();
            }
        }, 50);

        return tabsHeader + `<div class="settings-tabs-container">${tabsContent}</div>`;
    };

    // ==========================================
    // MODULO: RENDERIZADO DE CONTROLES
    // ==========================================
    function renderControl(opt, isChecked, valActual) {
        const isOptDisabled = typeof opt.isDisabled === 'function' ? opt.isDisabled() : !!opt.isDisabled;
        const disabledAttr = isOptDisabled ? 'disabled' : '';
        const opacityStyle = isOptDisabled ? 'opacity: 0.5; cursor: not-allowed;' : '';

        if (opt.tipo === 'button') {
            return `
                <button id="${opt.id}" 
                        class="btn-setting-action" 
                        style="background:${opt.color || 'deepskyblue'}; ${opacityStyle}" 
                        onclick="window.ejecutarAccionTabs('${opt.id}', null, true)"
                        ${disabledAttr}>
                    ${opt.icon ? `<span class="material-symbols-outlined">${opt.icon}</span>` : ''}
                    <span>${opt.label}</span>
                </button>`;
        }
        const onchange = opt.accion ? `onchange="window.ejecutarAccionTabs('${opt.id}', this.type === 'checkbox' ? this.checked : this.value, true)"` : '';

        if (opt.tipo === 'switch') return `<label class="switch" style="${opacityStyle}"><input type="checkbox" ${disabledAttr} ${isChecked ? 'checked' : ''} ${onchange}><span class="slider"></span></label>`;
        
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
        const todas = window.obtenerTodasLasSecciones(tabsConfig);
        const opcion = todas.find(s => s.id === id);

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
            // 1. Aplicar colores personalizados de reproductores
            if (typeof window.aplicarColoresReproductoresGlobales === 'function') {
                window.aplicarColoresReproductoresGlobales();
            }

            // 2. Aplicar resto de opciones configuradas
            const todas = window.obtenerTodasLasSecciones(tabsConfig);
            todas.forEach(opt => {
                if (opt.accion && opt.storageKey) {
                    const key = typeof opt.storageKey === 'function' ? opt.storageKey() : opt.storageKey;
                    const val = localStorage.getItem(key) || opt.default;
                    const finalVal = opt.tipo === 'switch' ? val === 'true' : val;
                    opt.accion(finalVal, false);
                }
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
                const seccion = window.obtenerTodasLasSecciones(window.tabsConfig).find(s => s.id === control.id);
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

        const sincronizarConstructorDesdeFirebase = async () => {
            if (window.firebaseAPI && window.firebaseAPI.cargarAjustesFirestore) {
                try {
                    const datos = await window.firebaseAPI.cargarAjustesFirestore('constructor_salterio');
                    if (datos && typeof datos.activado === 'boolean') {
                        if (window.esUsuarioAdminAutorizado()) {
                            localStorage.setItem('pref-activar-constructor-salterio', datos.activado ? 'true' : 'false');
                            window.dispatchEvent(new CustomEvent('lh-constructor-salterio-toggle', { detail: { activado: datos.activado } }));
                        }
                    }
                } catch (err) {
                    console.warn("Aviso cargando ajuste constructor de Firebase:", err);
                }
            }
        };

        const ejecutarSincronizacionesFirebase = () => {
            sincronizarColumnasDesdeFirebase();
            sincronizarConstructorDesdeFirebase();
        };

        if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
            window.firebaseAPI.onAuthReady(ejecutarSincronizacionesFirebase);
        } else {
            const checkFBC = setInterval(() => {
                if (window.firebaseAPI && window.firebaseAPI.onAuthReady) {
                    window.firebaseAPI.onAuthReady(ejecutarSincronizacionesFirebase);
                    clearInterval(checkFBC);
                }
            }, 600);
            setTimeout(() => clearInterval(checkFBC), 10000);
        }
    }

}



