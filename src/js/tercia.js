document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('tercia') || 'tos1lalu';
    const container = document.getElementById('contenido-dinamico');

    container.innerHTML = `
        <h1 class="Salmodia">HORA TERCIA</h1>
        <p class="OraciondelaManana">Salmodia ${id}</p>
        <div class="seccion-invitatorio">
            <p><span class="rubrica">V.</span> Dios mío, ven en mi auxilio.</p>
            <p><span class="rubrica">R.</span> Señor, date prisa en socorrerme.</p>
            <p class="rubrica">Gloria al Padre, y al Hijo, y al Espíritu Santo...</p>
        </div>
        <p class="rubrica">Próximamente contenido completo sincronizado con la base de datos.</p>
    `;
});
