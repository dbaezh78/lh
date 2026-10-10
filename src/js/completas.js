document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('completas') || 'tos1lalu';
    const container = document.getElementById('contenido-dinamico');

    container.innerHTML = `
        <h1 class="Salmodia">COMPLETAS</h1>
        <p class="OraciondelaManana">Oración antes del descanso de la noche</p>
        <div class="seccion-invitatorio">
            <p><span class="rubrica">V.</span> Dios mío, ven en mi auxilio.</p>
            <p><span class="rubrica">R.</span> Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén. Aleluya.</p>
        </div>
        <div class="seccion-examen-conciencia" style="margin: 20px 0;">
            <p class="rubrica" style="color: #ff0000; font-weight: bold; margin-bottom: 12px;">EXAMEN DE CONCIENCIA</p>
            <p style="margin-bottom: 14px;">Hermanos, habiendo llegado al final de esta jornada que Dios nos ha concedido, reconozcamos sinceramente nuestros pecados.</p>
            <p style="white-space: pre-line; margin-bottom: 14px;">Yo confieso ante Dios todopoderoso
y ante vosotros, hermanos,
que he pecado mucho
de pensamiento, palabra, obra y omisión:
por mi culpa, por mi culpa, por mi gran culpa.

Por eso ruego a santa María, siempre Virgen,
a los ángeles, a los santos y a vosotros, hermanos,
que intercedáis por mí ante Dios, nuestro Señor.</p>
            <p><span class="rubrica" style="color: #ff0000;">V.</span> El Señor todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.</p>
            <p><span class="rubrica" style="color: #ff0000;">R.</span> Amén.</p>
        </div>
        <div class="seccion-bendicion-completas" style="margin: 24px 0;">
            <p class="rubrica" style="color: #ff0000; font-weight: bold; margin-bottom: 12px;">BENDICIÓN</p>
            <p><span class="rubrica" style="color: #ff0000;">V.</span> El Señor todopoderoso nos conceda una noche tranquila y una santa muerte.</p>
            <p><span class="rubrica" style="color: #ff0000;">R.</span> Amén.</p>
            <p class="rubrica" style="color: #ff0000; font-weight: bold; margin: 18px 0 12px 0;">ANTIFONA FINAL DE LA SANTISIMA VIRGEN</p>
            <p style="white-space: pre-line; line-height: 1.45;">Madre del Redentor, Virgen fecunda,
puerta del cielo siempre abierta,
estrella del mar,

ven a librar al pueblo que tropieza
y se quiere levantar.

Ante la admiración de cielo y tierra,
engendraste a tu santo Creador,
y permaneces siempre virgen.

Recibe el saludo del ángel Gabriel,
y ten piedad de nosotros, pecadores.</p>
        </div>
    `;
});
