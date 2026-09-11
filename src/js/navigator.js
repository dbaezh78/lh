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
    const scriptsToLoad = [
        { src: '/src/js/setting.js', type: 'text/javascript' }
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
    const navHTML = `
        <div id="nav-wrapper">
            <div id="nav-toggle" onclick="toggleNavbar()">
                <span class="material-symbols-outlined" id="toggle-icon">keyboard_arrow_down</span>
            </div>

            <div class="nav-bottom-bar" id="main-navbar">
                <div class="nav-version-display ver">
                    v${window.APP_VERSION}
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

                <button class="nav-item" id="btn-nav-resucito">
                    <span class="material-symbols-outlined">menu_book</span>
                    <span>Salmodias</span>
                    <div class="nav-submenu" id="nav-submenu-resucito">
                        <a href="/"><span class="material-symbols-outlined">flare</span>Adviento</a>
                        <a href="/index-joven.html"><span class="material-symbols-outlined">auto_awesome</span>Navidad</a>
                        <a href="/index-ae.html"><span class="material-symbols-outlined">eco</span>Ordinario</a>
                        <a href="/perfil.html"><span class="material-symbols-outlined">church</span>Cuaresma</a>
                        <a href="/src/select.html"><span class="material-symbols-outlined">brightness_5</span>Pascua</a>
                        <a href="/src/html/intro.html"><span class="material-symbols-outlined">workspace_premium</span>Solemnidades</a>
                        <a href="/src/catequesis.html"><span class="material-symbols-outlined">face_6</span>Santos</a>
                    </div>
                </button>

                <button class="nav-item" id="btn-open-settings">
                    <span class="material-symbols-outlined">settings</span>
                    <span>Ajustes</span>
                </button>

            </div>
        </div>
    `;


    document.body.insertAdjacentHTML('beforeend', navHTML);

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
                document.querySelectorAll('.nav-submenu').forEach(m => {
                    if (m !== menu) m.classList.remove('active');
                });
                menu.classList.toggle('active');
            });
        }
    };

    setupSubmenu('btn-nav-menu', 'nav-submenu');
    setupSubmenu('btn-nav-neocate', 'nav-submenu-neocate');
    setupSubmenu('btn-nav-resucito', 'nav-submenu-resucito');

    document.addEventListener('click', () => {
        document.querySelectorAll('.nav-submenu').forEach(m => m.classList.remove('active'));
    });

    // --- LÓGICA DE AUTENTICACIÓN ---
    const updateAuthUI = (user) => {
        const icon = document.getElementById('nav-auth-icon');
        const text = document.getElementById('nav-auth-text');
        const btnAuth = document.getElementById('nav-google-auth');
        const btnLogout = document.getElementById('nav-logout');

        if (!btnAuth || !icon || !text || !btnLogout) return;

        if (user) {
            icon.innerHTML = user.photoURL 
                ? `<img src="${user.photoURL}" class="dbperfil">`
                : `<span class="material-symbols-outlined">person</span>`;
            text.innerText = "Perfil";
            btnAuth.onclick = () => window.location.href = '/perfil.html';
            btnLogout.style.display = "flex";
            
            btnLogout.onclick = async () => {
            if (confirm("👤 Desea cerrar sesión?")) { //lo agregué aqui

                if (window.firebaseAPI?.logout) await window.firebaseAPI.logout();
                else location.reload();
                } //agregué esta llave
            };
        } else {
            icon.innerHTML = "account_circle";
            text.innerText = "Entrar";
            btnAuth.onclick = () => window.firebaseAPI?.login?.();
            btnLogout.style.display = "none";
        }
    };

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

    console.log("🎬 %cIniciando proceso de cierre y sincronización...", "color: #007bff; font-weight: bold;");

    // 1. GUARDAR EN FIREBASE (Subida a la nube)
    // Esto asegura que 'global-set-dark', 'syncToggle' y 'pref-expandir-todo' suban a la base de datos
    if (window.guardarPreferenciasGlobales) {
        console.log("☁️ %cSincronizando preferencias con Firebase...", "color: #28a745;");
        window.guardarPreferenciasGlobales();
    } else {
        console.error("❌ %cError: 'window.guardarPreferenciasGlobales' no está definida.", "color: red;");
    }

    // 2. REFRESCAR INTERFAZ (Sin recargar página)
    // Refresco de Notas/Acordes
    if (window.renderizarNotasCanto) {
        console.log("🎸 %cRefrescando acordes y visualización de notas...", "color: #6f42c1;");
        window.renderizarNotasCanto();
    }
    
    // Refresco de Expansión de Estrofas (La nueva lógica)
    if (window.aplicarExpansionVisual) {
        console.log("📖 %cAplicando estado de expansión (Expandir Todo)...", "color: #fd7e14;");
        window.aplicarExpansionVisual();
    }

    // 3. ANIMACIÓN DE CIERRE VISUAL
    console.log("⏳ %cAplicando animaciones de salida...", "color: #6c757d;");
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
    
    // Ocultamos el wrapper completo
    wrapper.classList.toggle('hidden');
    
    // Giramos la flecha
    icon.classList.toggle('rotate-180');
}