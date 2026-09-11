document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('completas') || 'tos1lalu';
    const container = document.getElementById('contenido-dinamico');

    container.innerHTML = `
        <h1 class="Salmodia">COMPLETAS</h1>
        <p class="OraciondelaManana">Oración antes del descanso de la noche</p>
        <div class="seccion-invitatorio">
            <p><span class="rubrica">V.</span> El Señor todopoderoso nos conceda una noche tranquila y una muerte santa.</p>
            <p><span class="rubrica">R.</span> Amén.</p>
        </div>
        <p class="rubrica">Próximamente contenido completo sincronizado con la base de datos.</p>
    `;
});
