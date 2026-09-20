// =========================================================================
// CONTROLADOR DE LA CINTA SUPERIOR CON DOBLE REPRODUCTOR (cinta.js)
// =========================================================================

export class CintaLiturgica {
    constructor(contenedorId = 'cinta-container', opciones = {}) {
        this.contenedor = typeof contenedorId === 'string' ? document.getElementById(contenedorId) : contenedorId;
        this.opciones = opciones;
        this.audioEvangelio = new Audio();
        this.audioLibro = new Audio();
        this.render();
        this.vincularEventos();
    }

    render() {
        if (!this.contenedor) return;

        const {
            tiempo = 'Tiempo Ordinario',
            semana = 24,
            dia = 'Sábado',
            libro = 'laudes'
        } = this.opciones;

        this.contenedor.innerHTML = `
            <div class="cinta-top-bar">
                <!-- Izquierda: Reproductor del Evangelio del Día -->
                <div class="cinta-seccion-izq">
                    <div class="cinta-mini-player" id="player-evangelio-box">
                        <button class="cinta-btn-play" id="btn-play-evangelio" title="Reproducir Evangelio">
                            <span class="material-symbols-outlined" id="icon-play-evangelio">play_arrow</span>
                        </button>
                        <div class="cinta-player-info">
                            <div class="cinta-player-label">
                                <strong style="color: #fbbf24;">📖 Evangelio del Día</strong> <span id="label-evangelio-sub"></span>
                            </div>
                            <input type="range" class="cinta-slider-barra" id="slider-evangelio" min="0" max="100" value="0">
                            <div class="cinta-player-tiempo">
                                <span id="tiempo-actual-evangelio">0:00</span>
                                <span id="tiempo-total-evangelio">0:00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Centro: Navegación de Libros Litúrgicos -->
                <div class="cinta-seccion-centro">
                    <div class="cinta-liturgia-info">
                        <span class="cinta-tag-tiempo" id="cinta-tag-tiempo">${tiempo}</span>
                        <span id="cinta-texto-dia">Semana ${semana} • ${dia}</span>
                    </div>
                    <nav class="cinta-horas-nav" id="cinta-horas-nav">
                        <a href="?libro=oficio" class="cinta-btn-hora ${libro === 'oficio' ? 'activo' : ''}" data-libro="oficio">Oficio</a>
                        <a href="?libro=laudes" class="cinta-btn-hora ${libro === 'laudes' ? 'activo' : ''}" data-libro="laudes">Laudes</a>
                        <a href="?libro=tercia" class="cinta-btn-hora ${libro === 'tercia' ? 'activo' : ''}" data-libro="tercia">Tercia</a>
                        <a href="?libro=sexta" class="cinta-btn-hora ${libro === 'sexta' ? 'activo' : ''}" data-libro="sexta">Sexta</a>
                        <a href="?libro=nona" class="cinta-btn-hora ${libro === 'nona' ? 'activo' : ''}" data-libro="nona">Nona</a>
                        <a href="?libro=visperas" class="cinta-btn-hora ${libro === 'visperas' ? 'activo' : ''}" data-libro="visperas">Vísperas</a>
                        <a href="?libro=completas" class="cinta-btn-hora ${libro === 'completas' ? 'activo' : ''}" data-libro="completas">Completas</a>
                    </nav>
                </div>

                <!-- Derecha: Reproductor de la Hora / Libro Actual -->
                <div class="cinta-seccion-der">
                    <div class="cinta-mini-player" id="player-libro-box">
                        <button class="cinta-btn-play" id="btn-play-libro" title="Reproducir Hora Actual">
                            <span class="material-symbols-outlined" id="icon-play-libro">play_arrow</span>
                        </button>
                        <div class="cinta-player-info">
                            <div class="cinta-player-label">
                                <strong id="label-libro-nombre" style="color: #f87171;">🙏 ${libro.toUpperCase()}</strong>
                            </div>
                            <input type="range" class="cinta-slider-barra" id="slider-libro" min="0" max="100" value="0">
                            <div class="cinta-player-tiempo">
                                <span id="tiempo-actual-libro">0:00</span>
                                <span id="tiempo-total-libro">0:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    vincularEventos() {
        this.configurarPlayer(
            this.audioEvangelio,
            'btn-play-evangelio',
            'icon-play-evangelio',
            'slider-evangelio',
            'tiempo-actual-evangelio',
            'tiempo-total-evangelio',
            () => {
                if (!this.audioLibro.paused) this.audioLibro.pause();
            }
        );

        this.configurarPlayer(
            this.audioLibro,
            'btn-play-libro',
            'icon-play-libro',
            'slider-libro',
            'tiempo-actual-libro',
            'tiempo-total-libro',
            () => {
                if (!this.audioEvangelio.paused) this.audioEvangelio.pause();
            }
        );
    }

    configurarPlayer(audio, btnId, iconId, sliderId, tActualId, tTotalId, onPlayCallback) {
        const btn = document.getElementById(btnId);
        const icon = document.getElementById(iconId);
        const slider = document.getElementById(sliderId);
        const tActual = document.getElementById(tActualId);
        const tTotal = document.getElementById(tTotalId);

        if (!btn || !slider) return;

        btn.addEventListener('click', () => {
            if (!audio.src || audio.src === window.location.href) {
                alert('No hay audio asignado para reproducir en este momento.');
                return;
            }
            if (audio.paused) {
                if (onPlayCallback) onPlayCallback();
                audio.play().catch(e => console.warn('Error al reproducir audio:', e));
            } else {
                audio.pause();
            }
        });

        audio.addEventListener('play', () => {
            if (icon) icon.textContent = 'pause';
        });

        audio.addEventListener('pause', () => {
            if (icon) icon.textContent = 'play_arrow';
        });

        audio.addEventListener('timeupdate', () => {
            if (!isNaN(audio.duration) && audio.duration > 0) {
                slider.value = (audio.currentTime / audio.duration) * 100;
                if (tActual) tActual.textContent = this.formatearTiempo(audio.currentTime);
                if (tTotal) tTotal.textContent = this.formatearTiempo(audio.duration);
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            if (tTotal && !isNaN(audio.duration)) {
                tTotal.textContent = this.formatearTiempo(audio.duration);
            }
        });

        slider.addEventListener('input', () => {
            if (!isNaN(audio.duration) && audio.duration > 0) {
                audio.currentTime = (slider.value / 100) * audio.duration;
            }
        });
    }

    formatearTiempo(segundos) {
        if (isNaN(segundos) || segundos < 0) return '0:00';
        const mins = Math.floor(segundos / 60);
        const segs = Math.floor(segundos % 60);
        return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
    }

    cargarEvangelio(url, subtitulo = '') {
        if (url) {
            this.audioEvangelio.src = url;
            const sub = document.getElementById('label-evangelio-sub');
            if (sub) sub.textContent = subtitulo ? `(${subtitulo})` : '';
        }
    }

    cargarAudioLibro(url, nombreLibro = '') {
        if (url) {
            this.audioLibro.src = url;
            const lbl = document.getElementById('label-libro-nombre');
            if (lbl && nombreLibro) lbl.textContent = `🙏 ${nombreLibro.toUpperCase()}`;
        }
    }

    actualizarLiturgiaInfo(tiempo, semana, dia, libro) {
        const tag = document.getElementById('cinta-tag-tiempo');
        const txt = document.getElementById('cinta-texto-dia');
        const lbl = document.getElementById('label-libro-nombre');
        if (tag) tag.textContent = tiempo || 'Tiempo Ordinario';
        if (txt) txt.textContent = semana ? `Semana ${semana} • ${dia}` : (dia || '');
        if (lbl && libro) lbl.textContent = `🙏 ${libro.toUpperCase()}`;

        // Actualizar botón activo
        document.querySelectorAll('.cinta-btn-hora').forEach(btn => {
            if (btn.getAttribute('data-libro') === libro) {
                btn.classList.add('activo');
            } else {
                btn.classList.remove('activo');
            }
        });
    }
}

if (typeof window !== 'undefined') {
    window.CintaLiturgica = CintaLiturgica;
}
