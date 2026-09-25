(function() {
    // 1. Inyectar los archivos CSS inmediatamente
    const linkNav = document.createElement('link');
    linkNav.rel = 'stylesheet';
    linkNav.href = '/src/css/navigator.css';
    document.head.appendChild(linkNav);

    const linkSettings = document.createElement('link');
    linkSettings.rel = 'stylesheet';
    linkSettings.href = '/src/css/setting.css';
    document.head.appendChild(linkSettings);

// 2. Inyectar archivos JS de ajustes y Firebase
    const v = window.APP_VERSION || Date.now();
    const scriptsToLoad = [
        { src: `/src/js/firebase-config.js?v=${v}`, type: 'module' },
        { src: `/src/js/accesscontrol.js?v=${v}`, type: 'module' },
        { src: `/src/js/setting.js?v=${v}`, type: 'text/javascript' }
    ];

    scriptsToLoad.forEach(s => {
        const script = document.createElement('script');
        script.src = s.src;
        if (s.type === 'module') {
            script.type = 'module';
        }
        document.head.appendChild(script);
    });

    // 3. Crear el HTML de la navegación 
    // Añadimos 'style="visibility: hidden"' para evitar el parpadeo sin estilos
// 3. Crear el HTML de la navegación 
    window.APP_VERSION = '1.0.03';
    const appVersion = window.APP_VERSION;

    // Función universal para mostrar ventana modal de archivos actualizándose
    window.ejecutarActualizacionConListaArchivos = async function(tipo = 'actualizar') {
        // Quitar modal previo si existiese
        const prevModal = document.getElementById('lh-updating-modal');
        if (prevModal) prevModal.remove();

        let titulo = 'Actualizando Liturgia de las Horas';
        let sub = `Sincronizando archivos y recursos a la versión v${appVersion}...`;
        if (tipo === 'cache') {
            titulo = 'Limpiando Caché del Sistema';
            sub = 'Purgando archivos temporales y renovando cachés sin cerrar sesión...';
        } else if (tipo === 'cache_total') {
            titulo = 'Limpieza Total de Caché';
            sub = 'Renovando almacenamiento de caché completo (sesión protegida)...';
        }

        const modalHtml = `
            <div id="lh-updating-modal" style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(10, 14, 23, 0.88); backdrop-filter: blur(10px);
                display: flex; justify-content: center; align-items: center;
                z-index: 9999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                animation: fadeInModal 0.25s ease forwards;
            ">
                <div style="
                    background: #1e2430; border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 18px; width: 92%; max-width: 460px; padding: 24px;
                    box-shadow: 0 16px 40px rgba(0,0,0,0.6); color: #f8fafc;
                ">
                    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
                        <div id="lh-update-icon-wrapper" style="
                            width: 48px; height: 48px; border-radius: 12px; background: rgba(0, 230, 118, 0.12);
                            border: 1px solid rgba(0, 230, 118, 0.35); display: flex; align-items: center;
                            justify-content: center; color: #00e676; flex-shrink: 0;
                        ">
                            <span class="material-symbols-outlined" style="font-size: 28px; animation: spinUpdateIcon 1.8s linear infinite;">sync</span>
                        </div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #fff;">${titulo}</h3>
                            <p id="lh-update-subtitle" style="margin: 3px 0 0 0; font-size: 0.82rem; color: #94a3b8;">${sub}</p>
                        </div>
                    </div>

                    <!-- Barra de progreso -->
                    <div style="background: rgba(255,255,255,0.08); border-radius: 8px; height: 7px; overflow: hidden; margin-bottom: 16px;">
                        <div id="lh-update-progress-bar" style="
                            background: linear-gradient(90deg, #00e676, #00b0ff);
                            height: 100%; width: 5%; transition: width 0.2s ease;
                        "></div>
                    </div>

                    <!-- Lista de Archivos -->
                    <div id="lh-update-list-label" style="font-size: 0.78rem; font-weight: 600; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Archivos en actualización:
                    </div>
                    <div id="lh-update-file-list" style="
                        background: #141821; border: 1px solid rgba(255,255,255,0.07);
                        border-radius: 10px; max-height: 175px; overflow-y: auto; padding: 8px 12px;
                        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                        font-size: 0.8rem; line-height: 1.6; color: #cbd5e1;
                    ">
                    </div>
                    
                    <div id="lh-update-status-msg" style="margin-top: 14px; text-align: center; font-size: 0.82rem; color: #38bdf8; font-weight: 500;">
                        Preparando componentes...
                    </div>

                    <!-- Botón OK al finalizar la actualización -->
                    <div id="lh-update-actions" style="margin-top: 16px; display: none; justify-content: center; align-items: center;">
                        <button id="btn-lh-update-ok" style="
                            background: #00e676; color: #0a1118; border: none;
                            border-radius: 10px; padding: 10px 38px; font-size: 0.95rem;
                            font-weight: 800; cursor: pointer; display: inline-flex;
                            align-items: center; justify-content: center; gap: 8px;
                            box-shadow: 0 4px 16px rgba(0, 230, 118, 0.45);
                            transition: all 0.2s ease; letter-spacing: 0.5px;
                        ">
                            <span class="material-symbols-outlined" style="font-size: 20px; font-weight: 700;">check</span>
                            OK
                        </button>
                    </div>
                </div>
            </div>
            <style>
                @keyframes fadeInModal { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                @keyframes spinUpdateIcon { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                #lh-update-file-list::-webkit-scrollbar { width: 6px; }
                #lh-update-file-list::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 4px; }
                #lh-update-file-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
                #lh-update-file-list::-webkit-scrollbar-thumb:hover { background: #00e676; }
                #btn-lh-update-ok:hover { background: #00c853; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 230, 118, 0.6); }
                #btn-lh-update-ok:active { transform: translateY(0); }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const listEl = document.getElementById('lh-update-file-list');
        const barEl = document.getElementById('lh-update-progress-bar');
        const statusEl = document.getElementById('lh-update-status-msg');

        // Lista de módulos del sistema con los nombres exactos requeridos
        const modulos = [
            { nombre: 'Inicio', icono: 'home', files: ['index.html', 'src/css/main.css', 'src/js/main.js'] },
            { nombre: 'Control de Acceso', icono: 'admin_panel_settings', files: ['src/html/aCtrl.html', 'src/css/aCtrl.css', 'src/js/aCtrl-ui.js', 'src/js/accesscontrol.js'] },
            { nombre: 'Asistencia y Chat', icono: 'forum', files: ['src/html/chat.html', 'src/css/chat.css', 'src/js/chat.js', 'chat.html'] },
            { nombre: 'Año Liturgico', icono: 'calendar_month', files: ['src/html/añoliturgico.html', 'src/css/añoliturgico.css', 'src/js/añoliturgico.js'] },
            { nombre: 'Archivos de Sistema', icono: 'folder_special', files: ['src/html/system.html', 'src/css/system.css', 'src/js/system.js'] },
            { nombre: 'Completas', icono: 'bedtime', files: ['src/html/completas.html', 'src/css/completas.css', 'src/js/completas.js'] },
            { nombre: 'Base de datos', icono: 'dataset', files: ['src/html/datos.html', 'src/css/datos.css', 'src/js/datos.js'] },
            { nombre: 'Cambios Litúrgicos', icono: 'edit_calendar', files: ['src/html/form_etiempo.html', 'src/css/form_etiempo.css', 'src/js/form_etiempo.js'] },
            { nombre: 'Laudes', icono: 'wb_twilight', files: ['src/html/laudes.html', 'src/css/laudes.css', 'src/js/laudes.js'] },
            { nombre: 'Nombre de los Santos', icono: 'person_add', files: ['src/html/nombresanto.html', 'src/css/nombresanto.css', 'src/js/nombresanto.js'] },
            { nombre: 'Nona', icono: 'schedule', files: ['src/html/nona.html', 'src/css/nona.css', 'src/js/nona.js'] },
            { nombre: 'Oficio de Lectura', icono: 'menu_book', files: ['src/html/oficio.html', 'src/css/oficio.css', 'src/js/oficio.js'] },
            { nombre: 'Santos de la Iglesia', icono: 'groups', files: ['src/html/santo.html', 'src/css/santo.css', 'src/js/santo.js'] },
            { nombre: 'Sexta', icono: 'wb_sunny', files: ['src/html/sexta.html', 'src/css/sexta.css', 'src/js/sexta.js'] },
            { nombre: 'Tercia', icono: 'alarm', files: ['src/html/tercia.html', 'src/css/tercia.css', 'src/js/tercia.js'] },
            { nombre: 'Versión de la aplicación', icono: 'history_edu', files: ['src/html/ver.html', 'src/css/ver.css', 'src/js/ver.js'] },
            { nombre: 'Visperas', icono: 'nights_stay', files: ['src/html/visperas.html', 'src/css/visperas.css', 'src/js/visperas.js'] }
        ];

        // Archivos base del sistema a refrescar en segundo plano
        const coreFiles = [
            'src/js/navigator.js',
            'src/css/navigator.css',
            'src/css/buttons.css',
            'src/js/firebase-config.js',
            'src/js/setting.js',
            'src/css/setting.css',
            'src/data/system_files.json'
        ];

        // 1. Limpieza de Caché respetando SIEMPRE la sesión de Firebase
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                for (const cName of cacheNames) {
                    await caches.delete(cName);
                }
            } catch (err) {
                console.warn("Aviso al limpiar CacheStorage:", err);
            }
        }

        if (tipo === 'cache_total') {
            try {
                // Conservar credenciales de sesión en localStorage
                const backupAuth = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && (k.startsWith('firebase:authUser') || k.startsWith('firebase:token') || k === 'pending_login')) {
                        backupAuth[k] = localStorage.getItem(k);
                    }
                }
                // Limpiar claves temporales de la app sin borrar auth
                Object.keys(localStorage).forEach(k => {
                    if (!k.startsWith('firebase:authUser') && !k.startsWith('firebase:token')) {
                        localStorage.removeItem(k);
                    }
                });
                // Restaurar por seguridad
                Object.entries(backupAuth).forEach(([k, v]) => {
                    localStorage.setItem(k, v);
                });
            } catch (err) {
                console.warn("Aviso en limpieza selectiva de localStorage:", err);
            }
        }

        // 2. Ejecutar actualización de cada módulo
        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        const total = modulos.length;

        // Prefetch background de archivos base
        coreFiles.forEach(cf => {
            try { fetch(`/${cf}?_v=${Date.now()}`, { cache: 'reload' }).catch(() => {}); } catch(e) {}
        });

        for (let i = 0; i < total; i++) {
            const mod = modulos[i];
            const p = Math.round(((i + 1) / total) * 100);
            
            if (barEl) barEl.style.width = `${p}%`;
            if (statusEl) statusEl.textContent = `Actualizando (${i + 1}/${total}): ${mod.nombre}`;
            
            if (listEl) {
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.alignItems = 'center';
                item.style.padding = '4px 0';
                item.innerHTML = `
                    <span style="display: inline-flex; align-items: center; gap: 8px;">
                        <span style="color: #00e676; font-weight: bold;">✓</span>
                        <span class="material-symbols-outlined" style="font-size: 16px; color: #94a3b8;">${mod.icono}</span>
                        <span style="color: #f1f5f9; font-weight: 600;">${mod.nombre}</span>
                    </span>
                    <span style="color: #00e676; font-size: 0.72rem; font-weight: 700;">ACTUALIZADO</span>
                `;
                listEl.appendChild(item);
                listEl.scrollTop = listEl.scrollHeight;
            }

            // Prefetch de los archivos del módulo
            if (Array.isArray(mod.files)) {
                mod.files.forEach(file => {
                    try { fetch(`/${file}?_v=${Date.now()}`, { cache: 'reload' }).catch(() => {}); } catch (e) {}
                });
            }

            await delay(55);
        }

        if (barEl) {
            barEl.style.width = '100%';
            barEl.style.background = '#00e676';
        }

        const iconContainer = document.getElementById('lh-update-icon-wrapper');
        if (iconContainer) {
            iconContainer.innerHTML = '<span class="material-symbols-outlined" style="font-size: 28px; color: #00e676;">check_circle</span>';
        }

        const subEl = document.getElementById('lh-update-subtitle');
        if (subEl) {
            subEl.textContent = 'Todos los archivos han sido sincronizados con éxito.';
        }

        const labelEl = document.getElementById('lh-update-list-label');
        if (labelEl) {
            labelEl.textContent = `Archivos actualizados (${total}):`;
        }

        if (statusEl) {
            statusEl.innerHTML = '<span style="color: #00e676; font-weight: 600;">✓ ¡Actualización completada! Puedes revisar los archivos actualizados arriba.</span>';
        }

        try {
            localStorage.setItem('lh_last_updated_version', appVersion);
            localStorage.setItem('lh_app_up_to_date', 'true');
        } catch (e) {}

        // Mostrar botón OK para que el usuario revise los archivos y confirme el reinicio
        const actionsEl = document.getElementById('lh-update-actions');
        if (actionsEl) {
            actionsEl.style.display = 'flex';
            const btnOk = document.getElementById('btn-lh-update-ok');
            if (btnOk) {
                btnOk.focus();
                btnOk.onclick = () => {
                    btnOk.disabled = true;
                    btnOk.innerHTML = '<span class="material-symbols-outlined spin-icon" style="font-size: 18px;">sync</span> Reiniciando...';
                    setTimeout(() => {
                        window.location.reload();
                    }, 300);
                };
            }
        }
    };

    // 3. Crear el HTML de la navegación y el Popup de Cuenta Google
    const navHTML = `
        <div id="nav-wrapper">
            <div id="nav-toggle" onclick="toggleNavbar()">
                <span class="material-symbols-outlined" id="toggle-icon">keyboard_arrow_down</span>
            </div>

            <!-- Card Popup de Cuenta (Estilo Google Account) -->
            <div id="account-popup-card" class="account-popup-card hidden">
                <div class="account-popup-header">
                    <span class="account-user-email" id="account-popup-email">usuario@gmail.com</span>
                    <button class="account-popup-close-btn" id="account-popup-close" title="Cerrar">&times;</button>
                </div>

                <div class="account-popup-profile">
                    <div class="account-avatar-wrapper">
                        <img id="account-popup-img" src="/src/img/icono.png" alt="Perfil" class="account-avatar-img">
                        <div class="account-camera-badge" title="Foto de perfil">
                            <span class="material-symbols-outlined">photo_camera</span>
                        </div>
                    </div>
                    <h3 class="account-greeting" id="account-popup-greeting">¡Hola, Usuario!</h3>
                    <button class="account-manage-btn" id="account-popup-manage">
                        Administrar tu Cuenta de <span style="font-weight: 700;">Liturgia</span>
                    </button>
                </div>

                <div class="account-popup-actions-wrapper">
                    <div class="account-toggle-row" id="account-popup-toggle-header">
                        <span id="account-toggle-text">Ocultar</span>
                        <span class="material-symbols-outlined" id="account-toggle-icon">expand_less</span>
                    </div>

                    <div class="account-actions-list" id="account-actions-list">
                        <button class="account-action-item" id="account-action-chat">
                            <span class="material-symbols-outlined">forum</span>
                            <span>Asistencia y Chat</span>
                        </button>

                        <button class="account-action-item" id="account-action-ajustes">
                            <span class="material-symbols-outlined">settings</span>
                            <span>Ajustes</span>
                        </button>

                        <button class="account-action-item" id="account-action-perfil">
                            <span class="material-symbols-outlined">badge</span>
                            <span>Perfil Cuenta</span>
                        </button>

                        <button class="account-action-item has-update-ready" id="account-action-actualizar">
                            <div class="account-update-halo-ring" id="account-action-actualizar-icon"></div>
                            <span id="account-action-actualizar-text" style="color: #00e676; font-weight: bold;">Actualizar App</span>
                            <span class="account-update-badge-pill" id="account-action-actualizar-pill">v${appVersion}</span>
                        </button>
                    </div>

                    <div class="account-actions-logout">
                        <button class="account-action-item" id="account-action-logout">
                            <span class="material-symbols-outlined">logout</span>
                            <span>Salir de la cuenta</span>
                        </button>
                    </div>
                </div>

                <div class="account-popup-footer">
                    <a href="#" id="account-footer-privacy" class="account-footer-link">Política de Privacidad</a>
                    <span class="account-footer-dot">•</span>
                    <a href="#" id="account-info-app-link" class="account-footer-link">Info de la App</a>
                </div>
            </div>

            <div class="nav-bottom-bar" id="main-navbar">
                <div class="nav-version-display ver">
                    v${appVersion}
                </div>

                <a href="/" class="nav-item">
                    <span class="material-symbols-outlined">home</span>
                    <span>Inicio</span>
                </a>

                <button class="nav-item" id="btn-nav-menu">
                    <span class="material-symbols-outlined">menu</span>
                    <span>Menú</span>
                    <div class="nav-submenu" id="nav-submenu">
                        <a href="https://www.youtube.com/@CristoJesusReydereyes" target="_blank"><span class="material-symbols-outlined">youtube_activity</span> YouTube</a>
                        <a href="https://www.facebook.com/groups/721999947892692" target="_blank"><span class="material-symbols-outlined">communities</span> Facebook</a>
                        <a href="https://dbaezh78.github.io/salterios/" target="_blank"><span class="material-symbols-outlined">prayer_times</span> Laudes</a>
                        <a href="https://dbaezh78.github.io/ev/" target="_blank"><span class="material-symbols-outlined">book_2</span> Evangelio del Día</a>
                    </div>
                </button>

                <button class="nav-item" id="btn-nav-neocate">
                    <span class="material-symbols-outlined">church</span>
                    <span>NeoCate</span>
                    <div class="nav-submenu" id="nav-submenu-neocate">
                        <a href="https://neocatechumenaleiter.org/noticias/" target="_blank"><span class="material-symbols-outlined">newspaper</span> Noticias</a>
                        <a href="https://app.resucito.es/home" target="_blank"><span class="material-symbols-outlined">library_music</span> Cantos del Camino</a>
                        <a href="https://www.facebook.com/groups/323608705177419" target="_blank"><span class="material-symbols-outlined">groups</span> Comunidades</a>
                        <a href="https://www.facebook.com/cantordelcaminoneocatecumenal" target="_blank"><span class="material-symbols-outlined">record_voice_over</span> Cantores</a>
                        
                        <a href="https://carmenhernandez.org/" target="_blank"> 
                            <img src="/src/img/carmen_hernandez.jpg" alt="Carmen Hernández" class="img-perfil-link">
                            <span>Carmen Hernández</span>
                        </a>

                        <a href="https://neocatechumenaleiter.org/historia/kiko-arguello/" target="_blank"> 
                            <img src="/src/img/kiko_arguello.jpg" alt="Kiko Arguello" class="img-perfil-link">
                            <span>Kiko Argüello</span>
                        </a>

                        <a href="https://neocatechumenaleiter.org/historia/mario-pezzi/" target="_blank">
                            <img src="/src/img/mariopezzi.jpg" alt="Mario Pezzi" class="img-perfil-link">
                            <span>Mario Pezzi</span>
                        </a>
                        
                        <a href="https://neocatechumenaleiter.org/historia/maria-ascension/" target="_blank">
                            <img src="/src/img/maria_ascension.jpg" alt="Maria Ascension" class="img-perfil-link">
                            <span>Maria Ascension</span>
                        </a>
                    </div>
                </button>

                <button class="nav-item" id="btn-nav-formularios">
                    <span class="material-symbols-outlined">edit_calendar</span>
                    <span>Formularios</span>
                    <div class="nav-submenu" id="nav-submenu-formularios">
                        <a href="/src/html/frm_salterios.html"><span class="material-symbols-outlined">edit_note</span> Formulario Salterios</a>
                        <a href="/src/html/salmos.html"><span class="material-symbols-outlined">format_list_bulleted</span> Salmos</a>
                        <a href="/src/html/himno.html"><span class="material-symbols-outlined">music_note</span> Himnos</a>
                        <a href="/src/html/lecturabreve.html"><span class="material-symbols-outlined">auto_stories</span> Lectura Breve</a>
                        <a href="/src/html/antifonas.html"><span class="material-symbols-outlined">auto_stories</span> Antífonas</a>
                        <a href="/src/html/preces.html"><span class="material-symbols-outlined">volunteer_activism</span> Preces</a>
                        <a href="/src/html/oracion.html"><span class="material-symbols-outlined">church</span> Oración</a>
                        <a href="/src/html/responsorio.html"><span class="material-symbols-outlined">church</span> Responsorios</a>
                        <a href="/src/html/lectura.html"><span class="material-symbols-outlined">import_contacts</span> Lecturas Oficio</a>
                        <a href="/src/html/form_etiempo.html"><span class="material-symbols-outlined">edit_calendar</span> Cambio litúrgico</a>
                        <a href="/src/html/santo.html"><span class="material-symbols-outlined">calendar_today</span> Santo</a>
                        <a href="/src/html/nombresanto.html"><span class="material-symbols-outlined">person_add</span> Nombre Santo</a>
                    </div>
                </button>

                <button class="nav-item" id="btn-nav-resucito">
                    <span class="material-symbols-outlined">menu_book</span>
                    <span>Liturgia</span>
                    <div class="nav-submenu" id="nav-submenu-resucito">
                        <a href="/salterios.html"><span class="material-symbols-outlined">menu_book</span> Salterios</a>
                        <a href="/src/html/cinta.html"><span class="material-symbols-outlined">graphic_eq</span> Cinta de Audio</a>
                        <a href="/src/html/oficiodelectura.html"><span class="material-symbols-outlined">auto_stories</span> Oficio de Lectura</a>
                        <a href="/src/html/añoliturgico.html"><span class="material-symbols-outlined">calendar_month</span> Año Liturgico</a>
                        <a href="/src/html/datos.html"><span class="material-symbols-outlined">dataset</span> Datos y Años</a>
                        <a href="/src/html/chat.html"><span class="material-symbols-outlined">forum</span> Asistencia y Chat</a>
                        <a href="/src/html/ver.html"><span class="material-symbols-outlined">history_edu</span> Historial de Cambios</a>
                        <a href="/src/html/system.html"><span class="material-symbols-outlined">folder_special</span> Archivos del Sistema</a>
                    </div>
                </button>

                <button class="nav-item" id="btn-open-settings">
                    <span class="material-symbols-outlined">settings</span>
                    <span>Ajustes</span>
                </button>

                <button class="nav-item" id="nav-google-auth">
                    <span class="material-symbols-outlined" id="nav-auth-icon">account_circle</span>
                    <span id="nav-auth-text">Entrar</span>
                </button>
            </div>
        </div>
    `;

    // Modal Info de la App
    const infoModalHTML = `
        <div id="app-info-modal" style="display: none;">
            <div class="settings-modal-content" style="max-width: 480px; width: 92%; padding: 20px; border-radius: 20px; background: #242526; color: #e4e6eb; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 16px 40px rgba(0,0,0,0.5);">
                <div class="settings-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 16px; background: transparent;">
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 1.15rem; color: #fff;">
                        <span class="material-symbols-outlined" style="color: var(--SangreDeCristo, #d01212);">info</span> Info de la App
                    </h3>
                    <button class="modal-close-btn" id="close-app-info-modal" style="background: transparent; border: none; font-size: 1.4rem; cursor: pointer; color: #b0b3b8;">&times;</button>
                </div>
                <div class="settings-body" style="padding: 4px; color: #e4e6eb;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="/src/img/icono.png" alt="Liturgia" style="width: 68px; height: 68px; border-radius: 16px; margin-bottom: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                        <h2 style="margin: 4px 0 2px 0; font-size: 1.35rem; color: #fff;">Liturgia de las Horas</h2>
                        <span style="background: var(--SangreDeCristo, #d01212); color: #fff; padding: 3px 12px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; display: inline-block; margin-top: 4px;">Versión v${appVersion}</span>
                    </div>

                    <h4 style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 12px; font-size: 0.95rem; color: #fff;">Historial y Detalles</h4>
                    <div style="margin-bottom: 16px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <strong style="color: #00e676; font-size: 0.95rem;">v${appVersion} (Versión Actual)</strong>
                            <small style="color: #9aa0a6; font-size: 0.75rem;">2026</small>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; font-size: 0.83rem; color: #b0b3b8; line-height: 1.5;">
                            <li>Panel de cuenta emergente estilo Google Account con control de sesión.</li>
                            <li>Barra de navegación interactiva con accesos rápidos y submenús.</li>
                            <li>Control de acceso, gestión de usuarios (aCtrl) y configuración avanzada.</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin-top: 14px;">
                        <a href="/src/html/ver.html" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #38bdf8; text-decoration: none; font-size: 0.85rem; font-weight: 600;">
                            <span class="material-symbols-outlined" style="font-size: 18px;">history_edu</span>
                            Ver todos los cambios en ver.html
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', navHTML + infoModalHTML);

    // Hacer visible la barra una vez inyectada
    requestAnimationFrame(() => {
        const navBar = document.querySelector('.nav-bottom-bar');
        if (navBar) navBar.style.visibility = 'visible';
    });

    // --- LÓGICA DE SUBMENÚS ---
    const setupSubmenu = (btnId, menuId) => {
        const btn = document.getElementById(btnId);
        const menu = document.getElementById(menuId);
        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Cerrar tarjeta de cuenta al abrir submenú
                const card = document.getElementById('account-popup-card');
                if (card) card.classList.add('hidden');

                document.querySelectorAll('.nav-submenu').forEach(m => {
                    if (m !== menu) m.classList.remove('active');
                });
                menu.classList.toggle('active');
            });
        }
    };

    setupSubmenu('btn-nav-menu', 'nav-submenu');
    setupSubmenu('btn-nav-neocate', 'nav-submenu-neocate');
    setupSubmenu('btn-nav-formularios', 'nav-submenu-formularios');
    setupSubmenu('btn-nav-resucito', 'nav-submenu-resucito');

    // --- LÓGICA DEL POP-UP DE CUENTA GOOGLE ---
    const accountCard = document.getElementById('account-popup-card');
    const closeAccountBtn = document.getElementById('account-popup-close');
    const toggleHeader = document.getElementById('account-popup-toggle-header');
    const actionsList = document.getElementById('account-actions-list');
    const toggleText = document.getElementById('account-toggle-text');
    const toggleIcon = document.getElementById('account-toggle-icon');

    if (closeAccountBtn && accountCard) {
        closeAccountBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accountCard.classList.add('hidden');
        });
    }

    if (toggleHeader && actionsList && toggleText && toggleIcon) {
        toggleHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            const isCollapsed = actionsList.classList.contains('collapsed');
            if (isCollapsed) {
                actionsList.classList.remove('collapsed');
                toggleText.innerText = 'Ocultar';
                toggleIcon.innerText = 'expand_less';
            } else {
                actionsList.classList.add('collapsed');
                toggleText.innerText = 'Mostrar';
                toggleIcon.innerText = 'expand_more';
            }
        });
    }

    const manageBtn = document.getElementById('account-popup-manage');
    const perfilBtn = document.getElementById('account-action-perfil');
    const ajustesBtn = document.getElementById('account-action-ajustes');
    const actualizarBtn = document.getElementById('account-action-actualizar');
    const logoutBtn = document.getElementById('account-action-logout');
    const infoAppLink = document.getElementById('account-info-app-link');
    const privacyLink = document.getElementById('account-footer-privacy');
    const appInfoModal = document.getElementById('app-info-modal');
    const closeAppInfoModal = document.getElementById('close-app-info-modal');

    const goToPerfil = (e) => {
        e.stopPropagation();
        if (accountCard) accountCard.classList.add('hidden');
        window.location.href = '/src/html/aCtrl.html';
    };

    if (manageBtn) manageBtn.addEventListener('click', goToPerfil);
    if (perfilBtn) perfilBtn.addEventListener('click', goToPerfil);

    const chatBtn = document.getElementById('account-action-chat');
    if (chatBtn) {
        chatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (accountCard) accountCard.classList.add('hidden');
            window.location.href = '/src/html/chat.html';
        });
    }

    if (ajustesBtn) {
        ajustesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (accountCard) accountCard.classList.add('hidden');
            abrirModalConfiguracion();
        });
    }

    // Función para verificar y actualizar el estado visual del botón en el popup de cuenta
    function actualizarVisualBotonActualizarApp() {
        const btnAct = document.getElementById('account-action-actualizar');
        const textAct = document.getElementById('account-action-actualizar-text');
        const iconAct = document.getElementById('account-action-actualizar-icon');
        const pillAct = document.getElementById('account-action-actualizar-pill');
        if (!btnAct) return;

        const lastUpdated = localStorage.getItem('lh_last_updated_version');
        const isUpToDate = (lastUpdated === appVersion);

        if (isUpToDate) {
            btnAct.classList.remove('has-update-ready');
            btnAct.classList.add('is-updated');
            if (textAct) textAct.innerText = 'Refrescar App';
            if (pillAct) {
                pillAct.innerText = `v${appVersion}`;
                pillAct.style.background = 'rgba(0, 230, 118, 0.15)';
                pillAct.style.color = '#00e676';
                pillAct.style.border = '1px solid rgba(0, 230, 118, 0.4)';
            }
            if (iconAct) {
                iconAct.className = 'material-symbols-outlined';
                iconAct.style.cssText = 'font-size: 20px; color: #00e676; margin-right: 4px;';
                iconAct.innerText = 'refresh';
            }
        } else {
            btnAct.classList.add('has-update-ready');
            btnAct.classList.remove('is-updated');
            if (textAct) textAct.innerText = 'Actualizar App';
            if (pillAct) {
                pillAct.innerText = `v${appVersion}`;
                pillAct.style.background = '#ffd700';
                pillAct.style.color = '#121212';
                pillAct.style.border = 'none';
            }
        }
    }

    // Inicializar visualización del botón
    actualizarVisualBotonActualizarApp();

    if (actualizarBtn) {
        actualizarBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (accountCard) accountCard.classList.add('hidden');
            const lastUpdated = localStorage.getItem('lh_last_updated_version');
            const isUpToDate = (lastUpdated === appVersion);
            const msg = isUpToDate
                ? `🔄 ¿Desea refrescar y sincronizar los archivos de la aplicación (v${appVersion})?`
                : `🔄 ¿Desea actualizar y sincronizar la aplicación a la última versión (v${appVersion})?`;

            if (confirm(msg)) {
                await window.ejecutarActualizacionConListaArchivos('actualizar');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (accountCard) accountCard.classList.add('hidden');
            if (confirm("👤 ¿Desea cerrar sesión de su cuenta?")) {
                if (window.firebaseAPI?.logout) await window.firebaseAPI.logout();
                else location.reload();
            }
        });
    }

    if (infoAppLink && appInfoModal) {
        infoAppLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (accountCard) accountCard.classList.add('hidden');
            appInfoModal.style.display = 'flex';
        });
    }

    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            alert("🔒 Política de Privacidad:\nEsta aplicación respeta y protege la privacidad de sus datos y de los miembros.");
        });
    }

    if (closeAppInfoModal && appInfoModal) {
        closeAppInfoModal.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            appInfoModal.style.display = 'none';
        });
    }

    if (appInfoModal) {
        appInfoModal.addEventListener('click', (e) => {
            if (e.target === appInfoModal) {
                appInfoModal.style.display = 'none';
            }
        });
    }

    // Cierre al hacer clic fuera
    document.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-submenu').forEach(m => m.classList.remove('active'));
        if (accountCard && !accountCard.contains(e.target) && !e.target.closest('#nav-google-auth')) {
            accountCard.classList.add('hidden');
        }
    });

    // --- LÓGICA DE AUTENTICACIÓN ---
    const updateAuthUI = (user) => {
        const icon = document.getElementById('nav-auth-icon');
        const text = document.getElementById('nav-auth-text');
        const btnAuth = document.getElementById('nav-google-auth');
        const card = document.getElementById('account-popup-card');
        const emailEl = document.getElementById('account-popup-email');
        const greetingEl = document.getElementById('account-popup-greeting');
        const imgEl = document.getElementById('account-popup-img');

        if (!btnAuth || !icon || !text) return;

        if (user) {
            if (emailEl) emailEl.innerText = user.email || 'usuario@gmail.com';
            if (greetingEl) greetingEl.innerText = `¡Hola, ${user.displayName || 'Usuario'}!`;
            if (imgEl && user.photoURL) imgEl.src = user.photoURL;

            icon.innerHTML = user.photoURL 
                ? `<img src="${user.photoURL}" class="dbperfil">`
                : `<span class="material-symbols-outlined">person</span>`;
            text.innerText = "Cuenta";

            btnAuth.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.querySelectorAll('.nav-submenu').forEach(m => m.classList.remove('active'));
                if (card) card.classList.toggle('hidden');
            };
        } else {
            icon.innerHTML = `<span class="material-symbols-outlined">account_circle</span>`;
            text.innerText = "Entrar";
            if (card) card.classList.add('hidden');
            btnAuth.onclick = () => window.firebaseAPI?.login?.();
        }

        verificarPermisosNavegacion();
    };

    // --- CONTROL DE ACCESO Y GUARDIÁN DE PÁGINAS ---
    const verificarPermisosNavegacion = () => {
        if (typeof window.hasPermission !== 'function') return;

        // 1. Filtrar enlaces del submenú Liturgia
        const enlacesLiturgia = document.querySelectorAll('#nav-submenu-resucito a');
        enlacesLiturgia.forEach(a => {
            const href = a.getAttribute('href') || '';
            let perm = null;
            if (href.includes('form_etiempo.html')) perm = 'page_cambio_liturgico';
            else if (href.includes('añoliturgico.html') || href.includes('a%c3%b1oliturgico.html')) perm = 'page_ano_liturgico';
            else if (href.includes('datos.html')) perm = 'page_datos_anios';
            else if (href.includes('santo.html')) perm = 'page_santos_iglesia';
            else if (href.includes('nombresanto.html')) perm = 'page_registro_santo';
            else if (href.includes('chat.html')) perm = 'page_chat';
            else if (href.includes('ver.html')) perm = 'page_ver';
            else if (href.includes('system.html')) perm = 'page_system';

            if (perm) {
                const tienePermiso = window.hasPermission(perm);
                a.style.display = tienePermiso ? 'flex' : 'none';
            }
        });

        // 2. Controlar y filtrar enlaces del submenú Formularios
        const btnNavFormularios = document.getElementById('btn-nav-formularios');
        const puedeVerFormularios = window.hasPermission('page_formulario');
        const enlacesFormularios = document.querySelectorAll('#nav-submenu-formularios a');
        let algunFormularioVisible = false;

        enlacesFormularios.forEach(a => {
            const href = a.getAttribute('href') || '';
            let perm = null;
            if (href.includes('frm_salterios.html')) perm = 'page_frm_salterios';
            else if (href.includes('salmos.html')) perm = 'page_frm_salmos';
            else if (href.includes('himno.html')) perm = 'page_frm_himnos';
            else if (href.includes('lecturabreve.html')) perm = 'page_frm_lecturabreve';
            else if (href.includes('antifonas.html')) perm = 'page_frm_antifonas';
            else if (href.includes('preces.html')) perm = 'page_frm_preces';
            else if (href.includes('oracion.html')) perm = 'page_frm_oracion';
            else if (href.includes('responsorio.html')) perm = 'page_frm_responsorio';
            else if (href.includes('lectura.html')) perm = 'page_frm_lectura';
            else if (href.includes('form_etiempo.html')) perm = 'page_cambio_liturgico';
            else if (href.includes('santo.html')) perm = 'page_santos_iglesia';
            else if (href.includes('nombresanto.html')) perm = 'page_registro_santo';

            if (perm) {
                const tienePermiso = window.hasPermission(perm);
                a.style.display = tienePermiso ? 'flex' : 'none';
                if (tienePermiso) algunFormularioVisible = true;
            }
        });

        if (btnNavFormularios) {
            btnNavFormularios.style.display = (puedeVerFormularios || algunFormularioVisible) ? 'inline-flex' : 'none';
        }

        // 3. Guardián de la página actual
        verificarAccesoPaginaActual();
    };

    const verificarAccesoPaginaActual = () => {
        if (typeof window.hasPermission !== 'function') return;

        const path = window.location.pathname.toLowerCase();
        const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
        const email = currentUser?.email || "";
        if (email.toLowerCase() === "dbaezh78@gmail.com") {
            const overlay = document.getElementById("lh-access-denied-overlay");
            if (overlay) overlay.remove();
            return;
        }

        let requiredPerm = null;
        let pageTitle = "";

        if (path.includes("frm_salterios.html")) {
            requiredPerm = "page_frm_salterios";
            pageTitle = "Formulario Salterios";
        } else if (path.includes("salmos.html")) {
            requiredPerm = "page_frm_salmos";
            pageTitle = "Salmos";
        } else if (path.includes("himno.html")) {
            requiredPerm = "page_frm_himnos";
            pageTitle = "Himnos";
        } else if (path.includes("lecturabreve.html")) {
            requiredPerm = "page_frm_lecturabreve";
            pageTitle = "Lectura Breve";
        } else if (path.includes("antifonas.html")) {
            requiredPerm = "page_frm_antifonas";
            pageTitle = "Antífonas";
        } else if (path.includes("preces.html")) {
            requiredPerm = "page_frm_preces";
            pageTitle = "Preces";
        } else if (path.includes("oracion.html")) {
            requiredPerm = "page_frm_oracion";
            pageTitle = "Oración";
        } else if (path.includes("responsorio.html")) {
            requiredPerm = "page_frm_responsorio";
            pageTitle = "Responsorios";
        } else if (path.includes("lectura.html") && !path.includes("lecturabreve") && !path.includes("oficiodelectura")) {
            requiredPerm = "page_frm_lectura";
            pageTitle = "Lecturas de Oficio";
        } else if (path.includes("form_etiempo.html")) {
            requiredPerm = "page_cambio_liturgico";
            pageTitle = "Cambio Litúrgico";
        } else if (path.includes("añoliturgico.html") || path.includes("a%c3%b1oliturgico.html")) {
            requiredPerm = "page_ano_liturgico";
            pageTitle = "Año Litúrgico";
        } else if (path.includes("datos.html")) {
            requiredPerm = "page_datos_anios";
            pageTitle = "Datos y Años";
        } else if (path.includes("santo.html")) {
            requiredPerm = "page_santos_iglesia";
            pageTitle = "Santos de la Iglesia Católica";
        } else if (path.includes("nombresanto.html")) {
            requiredPerm = "page_registro_santo";
            pageTitle = "Registro del Santo";
        } else if (path.includes("chat.html")) {
            requiredPerm = "page_chat";
            pageTitle = "Asistencia y Chat";
        } else if (path.includes("system.html")) {
            requiredPerm = "page_system";
            pageTitle = "Archivos del Sistema";
        } else if (path.includes("ver.html")) {
            requiredPerm = "page_ver";
            pageTitle = "Actualizaciones";
        }

        if (requiredPerm) {
            const tieneAcceso = window.hasPermission(requiredPerm);
            const overlay = document.getElementById("lh-access-denied-overlay");

            if (!tieneAcceso) {
                if (!overlay) {
                    const el = document.createElement("div");
                    el.id = "lh-access-denied-overlay";
                    el.style.cssText = `
                        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                        background: #18191a; color: #e4e6eb; z-index: 99999;
                        display: flex; flex-direction: column; align-items: center; justify-content: center;
                        text-align: center; padding: 20px; box-sizing: border-box; font-family: sans-serif;
                    `;
                    el.innerHTML = `
                        <div style="max-width: 480px; background: #242526; padding: 32px 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 12px 32px rgba(0,0,0,0.6);">
                            <span class="material-symbols-outlined" style="font-size: 4rem; color: #d01212; margin-bottom: 12px;">lock</span>
                            <h2 style="margin: 0 0 8px 0; font-size: 1.4rem; color: #fff;">Acceso Restringido</h2>
                            <p style="color: #b0b3b8; font-size: 0.95rem; margin-bottom: 16px;">
                                No dispones de los permisos necesarios para visualizar la sección <b>${pageTitle}</b>.
                            </p>
                            <p style="color: #888; font-size: 0.82rem; margin-bottom: 24px;">
                                Si crees que esto es un error, solicita los permisos correspondientes al Administrador del sistema.
                            </p>
                            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                                <a href="/" style="background: #d01212; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 600;">Ir al Inicio</a>
                                <a href="/src/html/aCtrl.html" style="background: rgba(255,255,255,0.1); color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 12px; font-size: 0.9rem;">Ver Mi Cuenta</a>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(el);
                }
            } else if (overlay) {
                overlay.remove();
            }
        }
    };

    window.verificarPermisosNavegacion = verificarPermisosNavegacion;
    window.verificarAccesoPaginaActual = verificarAccesoPaginaActual;

    window.addEventListener('lh-access-control-updated', verificarPermisosNavegacion);
    setTimeout(verificarPermisosNavegacion, 1200);

    if (window.firebaseAPI?.onAuthReady) {
        window.firebaseAPI.onAuthReady(updateAuthUI);
    } else {
        const checkInterval = setInterval(() => {
            if (window.firebaseAPI?.onAuthReady) {
                window.firebaseAPI.onAuthReady(updateAuthUI);
                clearInterval(checkInterval);
            }
        }, 500);
    }
})();

// --- LÓGICA DE AJUSTES ---
document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-open-settings')) {
        e.preventDefault();
        abrirModalConfiguracion();
    }
});

function abrirModalConfiguracion() {
    if (document.getElementById('modal-global-settings')) return;

    const modal = document.createElement('div');
    modal.id = 'modal-global-settings';
    modal.className = 'settings-overlay';
    
    modal.onclick = (e) => {
        if (e.target.id === 'modal-global-settings') cerrarModalConfiguracion();
    };

    modal.innerHTML = `
        <div class="settings-frame">
            <div class="settings-header">
                <h2>
                    <span class="material-symbols-outlined" style="color:#bc0009">settings</span>
                    Configuración
                </h2>
                <button onclick="cerrarModalConfiguracion()" class="btn-close-settings">
                    <span class="material-symbols-outlined close">close</span>
                </button>
            </div>
            <div class="settings-content">
                ${window.generarContenidoSettings ? window.generarContenidoSettings() : '<p>Cargando ajustes...</p>'} 
            </div>
        </div>
    `;
    
    // Bloquear scroll del body
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    
// DISPARAR ANIMACIÓN DE SUBIDA
    setTimeout(() => {
        modal.classList.add('active'); // Activa el fondo oscuro
        modal.querySelector('.settings-frame').classList.add('up'); // Sube el panel
    }, 10);

    document.addEventListener('keydown', manejarEscapeSettings);
}

function manejarEscapeSettings(e) {
    if (e.key === "Escape") {
        cerrarModalConfiguracion();
        window.location.reload();
    }
}

function cerrarModalConfiguracion() {
    const modal = document.getElementById('modal-global-settings');
    
    // Validación inicial
    if (!modal) {
        console.warn("⚠️ [Ajustes] Intento de cerrar modal, pero no se encontró en el DOM.");
        return;
    }

    // 1. ANIMACIÓN DE CIERRE VISUAL
    modal.classList.remove('active');
    const frame = modal.querySelector('.settings-frame');
    if (frame) {
        frame.classList.remove('up');
    }
    
        // 4. LIMPIEZA FINAL DEL DOM
        const modalParaCerrar = modal; // Capturamos la referencia actual

        setTimeout(() => {
                    if (modalParaCerrar) {
                        modalParaCerrar.remove();
                        document.body.classList.remove('modal-open');
                    }
                    
                    // Limpiar el evento de teclado
                    if (typeof manejarEscapeSettings === 'function') {
                        document.removeEventListener('keydown', manejarEscapeSettings);
                    }
                    
                    console.log("✅ %cModal cerrado y limpiado.", "color: #28a745; font-weight: bold;");
                    
                    // Verificamos la bandera global
                    if (window.cambioEnExpandir === true) {
                        // IMPORTANTE: Primero recarga, el reset se hace solo al volver a cargar la web
                        window.cambioEnExpandir = false;
                        console.log("🔘 Boton Expandir cambió, se recargando la pagina 🔄...");
                        
                        //Recarga por haber cambiado el expansor.
                        window.location.reload(); 

                        console.log("🔔 Cambio detectado: Se Recargó la página 🔄!");
                    } else {
                        console.log("🔘 Boton Expandir no ha cambiado, Cierre silencioso y sin recarga.");
                    }
        }, 300); // 300ms coincide con la transición CSS
}

// ==========================================
// MODULO: GESTIÓN DE LOGIN POST-LIMPIEZA (UNIFICADO)
// ==========================================
(function() {
    window.addEventListener('load', () => {
        const needsAutoLogin = sessionStorage.getItem('pending_login') === 'true';
        const needsPrompt = sessionStorage.getItem('force_login_prompt') === 'true';

        if (needsAutoLogin || needsPrompt) {
            console.log("Iniciando protocolo de recuperación de sesión...");

            // 1. Intentar Autologin (Estrategia Silenciosa/Popup)
            if (needsAutoLogin) {
                const loginInterval = setInterval(() => {
                    if (window.firebaseAPI?.login) {
                        clearInterval(loginInterval);
                        sessionStorage.removeItem('pending_login');
                        window.firebaseAPI.login();
                    }
                }, 500);
                setTimeout(() => clearInterval(loginInterval), 5000);
            }

            // 2. Refuerzo Visual (Estrategia Manual)
            // Esperamos 3 segundos para dar tiempo al autologin. 
            // Si el usuario ya está logueado por el paso anterior, no mostramos el alert.
            setTimeout(() => {
                // Verificamos si aún necesitamos el prompt (si no se ha logueado ya)
                if (sessionStorage.getItem('force_login_prompt') === 'true') {
                    sessionStorage.removeItem('force_login_prompt');
                    
                    const btnAuth = document.getElementById('nav-google-auth');
                    const isLogged = document.getElementById('nav-logout')?.style.display === 'flex';

                    if (btnAuth && !isLogged) {
                        btnAuth.style.background = "#bc0009";
                        btnAuth.style.borderRadius = "8px";
                        btnAuth.style.color = "white";
                        btnAuth.style.transform = "scale(1.1)";
                        btnAuth.style.transition = "all 0.5s ease";
                        
                        alert("⚠ Caché limpia. \n Si no viste la ventana de acceso, \n pulsa en el botón 'Entrar' (resaltado en rojo) para iniciar Sesión.");
                    }
                }
            }, 3500); 
        }
    });
})();

// =============================================================
// Funcion de Ocultar y Mostrar
// =============================================================
function toggleNavbar() {
    const wrapper = document.getElementById('nav-wrapper');
    const icon = document.getElementById('toggle-icon');
    const card = document.getElementById('account-popup-card');
    if (!wrapper || !icon) return;
    
    if (card) card.classList.add('hidden');

    // Ocultamos el wrapper completo
    wrapper.classList.toggle('hidden');
    
    // Giramos la flecha
    icon.classList.toggle('rotate-180');
}

// Hacerla accesible globalmente para el onclick="toggleNavbar()"
window.toggleNavbar = toggleNavbar;