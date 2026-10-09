/**
 * db-responsorios.js
 * Repositorio de Responsorios / Versículos Litúrgicos (Post-Salmodia del Oficio de Lectura y Horas Menores)
 * Estructura: V (Versículo) y R (Respuesta)
 */

export const CATALOGO_RESPONSORIOS_SEED = [
    // TIEMPO ORDINARIO - SEMANA 1
    {
        id: "tos01doof_resp",
        varName: "tos01doof_resp",
        titulo: "Responsorio de la Salmodia - Domingo Semana 1 / Bautismo (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "domingo",
        libro: "oficio",
        v: "Éste es mi Hijo amado.",
        r: "Escuchadlo."
    },
    {
        id: "tos01luof_resp",
        varName: "tos01luof_resp",
        titulo: "Responsorio de la Salmodia - Lunes Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "lunes",
        libro: "oficio",
        v: "Hijo mío, haz caso de mi sabiduría.",
        r: "Presta oído a mi inteligencia."
    },
    {
        id: "tos01maof_resp",
        varName: "tos01maof_resp",
        titulo: "Responsorio de la Salmodia - Martes Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "martes",
        libro: "oficio",
        v: "Escucha, pueblo mío, mi enseñanza.",
        r: "Presta oído a las palabras de mi boca."
    },
    {
        id: "tos01miof_resp",
        varName: "tos01miof_resp",
        titulo: "Responsorio de la Salmodia - Miércoles Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "miercoles",
        libro: "oficio",
        v: "Señor, hazme conocer tus caminos.",
        r: "Muéstrame tus senderos."
    },
    {
        id: "tos01juof_resp",
        varName: "tos01juof_resp",
        titulo: "Responsorio de la Salmodia - Jueves Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "jueves",
        libro: "oficio",
        v: "Instrúyeme en tu verdad, enséñame.",
        r: "Porque tú eres mi Dios y Salvador."
    },
    {
        id: "tos01viof_resp",
        varName: "tos01viof_resp",
        titulo: "Responsorio de la Salmodia - Viernes Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "viernes",
        libro: "oficio",
        v: "Acuérdate de mí, Señor, por tu bondad.",
        r: "Acuérdate de tu ternura."
    },
    {
        id: "tos01saof_resp",
        varName: "tos01saof_resp",
        titulo: "Responsorio de la Salmodia - Sábado Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "sabado",
        libro: "oficio",
        v: "El Señor es mi luz y mi salvación.",
        r: "¿A quién temeré?"
    },

    // TIEMPO ORDINARIO - HORA TERCIA (SALTERIO)
    {
        id: "tos01dote_resp",
        varName: "tos01dote_resp",
        titulo: "Responsorio de Tercia - Domingo Semana 1 (Tercia)",
        tiempo: "ordinario",
        semana: "1",
        dia: "domingo",
        libro: "tercia",
        v: "Inclina, Señor, mi corazón a tus preceptos.",
        r: "Dame vida con tu palabra."
    },
    {
        id: "tos01lute_resp",
        varName: "tos01lute_resp",
        titulo: "Responsorio de Tercia - Lunes Semana 1 (Tercia)",
        tiempo: "ordinario",
        semana: "1",
        dia: "lunes",
        libro: "tercia",
        v: "Inclina, Señor, mi corazón a tus preceptos.",
        r: "Dame vida con tu palabra."
    },
    {
        id: "tos01mate_resp",
        varName: "tos01mate_resp",
        titulo: "Responsorio de Tercia - Martes Semana 1 (Tercia)",
        tiempo: "ordinario",
        semana: "1",
        dia: "martes",
        libro: "tercia",
        v: "Inclina, Señor, mi corazón a tus preceptos.",
        r: "Dame vida con tu palabra."
    },
    {
        id: "tos01mite_resp",
        varName: "tos01mite_resp",
        titulo: "Responsorio de Tercia - Miércoles Semana 1 (Tercia)",
        tiempo: "ordinario",
        semana: "1",
        dia: "miercoles",
        libro: "tercia",
        v: "Inclina, Señor, mi corazón a tus preceptos.",
        r: "Dame vida con tu palabra."
    },
    {
        id: "tos01jute_resp",
        varName: "tos01jute_resp",
        titulo: "Responsorio de Tercia - Jueves Semana 1 (Tercia)",
        tiempo: "ordinario",
        semana: "1",
        dia: "jueves",
        libro: "tercia",
        v: "Inclina, Señor, mi corazón a tus preceptos.",
        r: "Dame vida con tu palabra."
    },
    {
        id: "tos01vite_resp",
        varName: "tos01vite_resp",
        titulo: "Responsorio de Tercia - Viernes Semana 1 (Tercia)",
        tiempo: "ordinario",
        semana: "1",
        dia: "viernes",
        libro: "tercia",
        v: "Inclina, Señor, mi corazón a tus preceptos.",
        r: "Dame vida con tu palabra."
    },
    {
        id: "tos01sate_resp",
        varName: "tos01sate_resp",
        titulo: "Responsorio de Tercia - Sábado Semana 1 (Tercia)",
        tiempo: "ordinario",
        semana: "1",
        dia: "sabado",
        libro: "tercia",
        v: "Inclina, Señor, mi corazón a tus preceptos.",
        r: "Dame vida con tu palabra."
    },

    // TIEMPO PASCUAL
    {
        id: "tps01juof_resp",
        varName: "tps01juof_resp",
        titulo: "Responsorio de la Salmodia - Octava de Pascua Jueves (Oficio)",
        tiempo: "pascua",
        semana: "1",
        dia: "jueves",
        libro: "oficio",
        v: "En tu resurrección, oh Cristo. Aleluya.",
        r: "El cielo y la tierra se alegran. Aleluya."
    },
    {
        id: "tps01doof_resp",
        varName: "tps01doof_resp",
        titulo: "Responsorio de la Salmodia - Domingo de Pascua (Oficio)",
        tiempo: "pascua",
        semana: "1",
        dia: "domingo",
        libro: "oficio",
        v: "Ha resucitado el Señor verdaderamente. Aleluya.",
        r: "Y se ha aparecido a Simón. Aleluya."
    },

    // TIEMPO DE ADVIENTO
    {
        id: "tas01doof_resp",
        varName: "tas01doof_resp",
        titulo: "Responsorio de la Salmodia - Domingo Semana 1 (Adviento)",
        tiempo: "adviento",
        semana: "1",
        dia: "domingo",
        libro: "oficio",
        v: "Viene el Señor, el Rey de la gloria.",
        r: "Saldrá a su encuentro la tierra entera."
    },

    // TIEMPO DE CUARESMA
    {
        id: "tcs01doof_resp",
        varName: "tcs01doof_resp",
        titulo: "Responsorio de la Salmodia - Domingo Semana 1 (Cuaresma)",
        tiempo: "cuaresma",
        semana: "1",
        dia: "domingo",
        libro: "oficio",
        v: "Con sus plumas te cubrirá.",
        r: "Y debajo de sus alas estarás seguro."
    }
];

export class ResponsoriosDB {
    static normalizarId(id = '') {
        return (id || '').toString().toLowerCase().trim().replace(/[-_]/g, '');
    }

    static obtener(id, tiempo, semana, dia, libro = 'oficio') {
        let todas = [];
        if (typeof window !== 'undefined') {
            const cache = localStorage.getItem('lh_responsorios_cache');
            if (cache) {
                try { todas = JSON.parse(cache); } catch (e) {}
            }
        }
        if (!Array.isArray(todas) || todas.length === 0) {
            todas = [...CATALOGO_RESPONSORIOS_SEED];
        }

        if (id) {
            const idNorm = this.normalizarId(id);
            let encontrada = todas.find(r => 
                this.normalizarId(r.id) === idNorm || 
                this.normalizarId(r.varName) === idNorm
            );
            if (encontrada) return encontrada;

            // Soporte de equivalencia entre formatos antiguos (tos1ofdo) y nuevos (tos01doof)
            const mOld = id.match(/^(to|ta|tn|tc|tp|sa)s?(\d+)([a-zA-Z]{2})([a-zA-Z]{2})/i);
            if (mOld) {
                const t = mOld[1].toLowerCase();
                const sem = mOld[2];
                const p1 = mOld[3].toLowerCase();
                const p2 = mOld[4].toLowerCase();
                const semPad = String(sem).padStart(2, '0');
                const cand1 = this.normalizarId(`${t}s${semPad}${p1}${p2}resp`);
                const cand2 = this.normalizarId(`${t}s${semPad}${p2}${p1}resp`);
                encontrada = todas.find(r => {
                    const rNorm = this.normalizarId(r.id);
                    return rNorm === cand1 || rNorm === cand2;
                });
                if (encontrada) return encontrada;
            }
        }

        return this.obtenerRecomendado(tiempo, semana, dia, libro);
    }

    static obtenerRecomendado(tiempo = 'ordinario', semana = 1, dia = 'domingo', libro = 'oficio') {
        let todas = [];
        if (typeof window !== 'undefined') {
            const cache = localStorage.getItem('lh_responsorios_cache');
            if (cache) {
                try { todas = JSON.parse(cache); } catch (e) {}
            }
        }
        if (!Array.isArray(todas) || todas.length === 0) {
            todas = [...CATALOGO_RESPONSORIOS_SEED];
        }

        const tNorm = (tiempo || 'ordinario').toLowerCase().replace('tiempo ', '');
        const dNorm = (dia || 'domingo').toLowerCase();
        const lNorm = (libro || 'oficio').toLowerCase();
        const semNum = parseInt(String(semana).replace('s', ''), 10) || 1;

        // 1. Búsqueda exacta considerando libro
        let match = todas.find(r => 
            ((r.libro || 'oficio').toLowerCase() === lNorm) &&
            (r.tiempo === tNorm || r.tiempo?.includes(tNorm)) &&
            (r.dia === dNorm || !r.dia) &&
            (parseInt(r.semana, 10) === semNum)
        );

        if (!match) {
            // 2. Ciclo de 4 semanas
            const semCiclo = ((semNum - 1) % 4) + 1;
            match = todas.find(r => 
                ((r.libro || 'oficio').toLowerCase() === lNorm) &&
                (r.tiempo === tNorm || r.tiempo?.includes(tNorm)) &&
                (r.dia === dNorm || !r.dia) &&
                (parseInt(r.semana, 10) === semCiclo)
            );
        }

        if (!match) {
            // 3. Coincidencia por tiempo y libro
            match = todas.find(r => 
                ((r.libro || 'oficio').toLowerCase() === lNorm) &&
                (r.tiempo === tNorm || r.tiempo?.includes(tNorm))
            );
        }

        if (!match && lNorm === 'tercia') {
            return {
                id: `tos${String(semNum).padStart(2, '0')}${dNorm.slice(0, 2)}te_resp`,
                varName: `tos${String(semNum).padStart(2, '0')}${dNorm.slice(0, 2)}te_resp`,
                titulo: `Responsorio de Tercia - Semana ${semNum} (${tNorm})`,
                tiempo: tNorm,
                semana: semNum,
                dia: dNorm,
                libro: 'tercia',
                v: 'Inclina, Señor, mi corazón a tus preceptos.',
                r: 'Dame vida con tu palabra.'
            };
        }

        if (!match && todas.length > 0) {
            match = todas.find(r => (r.libro || 'oficio').toLowerCase() === lNorm) || todas[0];
        }

        return match || {
            id: 'resp_default',
            v: 'Éste es mi Hijo amado.',
            r: 'Escuchadlo.'
        };
    }

    static obtenerTodos() {
        if (typeof window !== 'undefined') {
            const cache = localStorage.getItem('lh_responsorios_cache');
            if (cache) {
                try {
                    const parsed = JSON.parse(cache);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                } catch (e) {}
            }
        }
        return [...CATALOGO_RESPONSORIOS_SEED];
    }
}

if (typeof window !== 'undefined') {
    window.ResponsoriosDB = ResponsoriosDB;
}
