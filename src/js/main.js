const app = document.getElementById('app');

// =========================================================
// PORTADA PRINCIPAL — Liturgia de las Horas
// =========================================================
function cargarPortada() {
    app.innerHTML = `
        <div class="background-overlay"></div>
        
        <div class="portada-container">

            <h1 class="main-title">LITURGIA <span class="de-las">de las</span> HORAS</h1>

            <div class="logo-container">
                <img src="src/img/lh.jpg" class="db-mboton rounded-circle" alt="Liturgia de las Horas">
            </div>

            <!-- ===== BOTONES PRINCIPALES (Estilo 2: Pill Gradiente) ===== -->
            <div class="btn-group" style="margin: 12px 0;">
                <a href="/src/html/laudes.html" class="btn-pill btn-verde">
                    Salmodia del día
                    <span class="btn-pill-icon">
                        <span class="material-symbols-outlined" style="font-size:1.1rem;">prayer_times</span>
                    </span>
                </a>
            </div>

            <!-- ===== TIEMPOS LITÚRGICOS (Estilo 1: Icono + Texto) ===== -->
            <div class="btn-group-column" style="margin: 8px 0 16px;">

                <a href="#Adviento" class="btn-icono btn-adviento" data-tiempo="adviento">
                    <span class="btn-icon-box">
                        <span class="material-symbols-outlined">flare</span>
                    </span>
                    <span class="btn-label">Adviento</span>
                </a>

                <a href="#Navidad" class="btn-icono btn-navidad" data-tiempo="navidad">
                    <span class="btn-icon-box">
                        <span class="material-symbols-outlined">star</span>
                    </span>
                    <span class="btn-label">Navidad</span>
                </a>

                <a href="#Ordinario" class="btn-icono btn-ordinario" data-tiempo="ordinario">
                    <span class="btn-icon-box">
                        <span class="material-symbols-outlined">eco</span>
                    </span>
                    <span class="btn-label">Tiempo Ordinario</span>
                </a>

                <a href="#Cuaresma" class="btn-icono btn-cuaresma" data-tiempo="cuaresma">
                    <span class="btn-icon-box">
                        <span class="material-symbols-outlined">church</span>
                    </span>
                    <span class="btn-label">Cuaresma</span>
                </a>

                <a href="#Pascual" class="btn-icono btn-pascua" data-tiempo="pascua">
                    <span class="btn-icon-box">
                        <span class="material-symbols-outlined">brightness_5</span>
                    </span>
                    <span class="btn-label">Pascua</span>
                </a>

                <a href="#santos" class="btn-icono btn-santos" data-tiempo="santos">
                    <span class="btn-icon-box">
                        <span class="material-symbols-outlined">workspace_premium</span>
                    </span>
                    <span class="btn-label">Santos</span>
                </a>

                <a href="#Solemnidades" class="btn-icono btn-solemnidades" data-tiempo="solemnidades">
                    <span class="btn-icon-box">
                        <span class="material-symbols-outlined">auto_awesome</span>
                    </span>
                    <span class="btn-label">Solemnidades</span>
                </a>

            </div>

            <footer class="portada-footer">
                <p class="final-quote">Amad a vuestros enemigos</p>
                <p class="final-quote">Vengo pronto</p>
            </footer>

        </div>
    `;

    vincularEventos();
}

// =========================================================
// EVENTOS — Botones de tiempo litúrgico
// =========================================================
function vincularEventos() {
    const botones = document.querySelectorAll('[data-tiempo]');
    botones.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tiempo = btn.getAttribute('data-tiempo');
            console.log('%c ⛪ Cargando tiempo litúrgico:', 'color:#bc0009;font-weight:bold;', tiempo);
            // TODO: Llamar al selector de semanas cuando esté implementado
            // cargarSelectorSemanas(tiempo);
        });
    });
}

// Arrancar la aplicación
cargarPortada();