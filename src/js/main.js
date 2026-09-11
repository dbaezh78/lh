const app = document.getElementById('app');

// Función para inicializar la Portada de Bienvenida
function cargarPortada() {
    app.innerHTML = `
        <div class="background-overlay"></div>
        
        <div class="portada-container">
            <h1 class="main-title">LITURGIA <span class="de-las">de las</span> HORAS</h1>

            <div class="logo-container">

            <img src="src/img/lh.jpg" class="db-mboton rounded-circle" ;="">
                
            </div>

            <div class="main-buttons-container">
                <button class="btn-main">Salmodia del día</button>
                <button class="btn-main special-border">San Juan Bautista De La Salle</button>
            </div>

            <section class="evangelio-section">
                <h2 class="section-title">Evangelio del día</h2>
                <p class="liturgical-date">Tiempo Pascual, Semana I, Octava de Pascua, MARTES</p>
                
                <div class="audio-container">
                    <audio controls>
                        <source src="src/audio/evangelio_hoy.mp3" type="audio/mpeg">
                    </audio>
                </div>
            </section>

            <div class="calendar-icon-container">
                <img src="src/img/icons/calendar.png" class="icon-calendar">
            </div>

            <footer class="portada-footer">
                <p class="final-quote">Amad a vuestros enemigos</p>
                <p class="final-quote">Vengo pronto</p>
            </footer>
        </div>
    `;

    // Asignar eventos a los botones después de crearlos
    vincularEventos();
}

function vincularEventos() {
    const botones = document.querySelectorAll('.btn-tiempo');
    botones.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tiempo = e.target.getAttribute('data-tiempo');
            console.log("Cargando tiempo:", tiempo);
            // Aquí llamarás a la función que limpie el 'app' y cargue la lista de días
            cargarSelectorSemanas(tiempo);
        });
    });
}

// Arrancar la aplicación
cargarPortada();