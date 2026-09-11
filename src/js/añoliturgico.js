import { catalogoLiturgico2026 } from '../data/calendarioLiturgico.js';

document.addEventListener('DOMContentLoaded', () => {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    const buscador = document.getElementById('buscador');

    function renderTabla(filtro = '') {
        cuerpoTabla.innerHTML = '';
        const termino = filtro.toLowerCase().trim();

        const entradas = Object.entries(catalogoLiturgico2026);

        entradas.forEach(([fecha, item]) => {
            const match = !termino || 
                fecha.toLowerCase().includes(termino) ||
                item.tiempo.toLowerCase().includes(termino) ||
                item.semana.toLowerCase().includes(termino) ||
                item.dia.toLowerCase().includes(termino) ||
                (item.id && item.id.toLowerCase().includes(termino));

            if (match) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${fecha}</strong></td>
                    <td>${item.tiempo}</td>
                    <td>${item.semana}</td>
                    <td>${item.dia}</td>
                    <td><span class="badge-id">${item.id || '-'}</span></td>
                    <td>
                        <a class="btn-ir" href="laudes.html?laudes=${item.id}">Ver Laudes</a>
                    </td>
                `;
                cuerpoTabla.appendChild(tr);
            }
        });
    }

    buscador.addEventListener('input', (e) => {
        renderTabla(e.target.value);
    });

    renderTabla();
});
