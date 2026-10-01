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
        const semNum = parseInt(String(semana).replace('s', ''), 10) || 1;

        // Búsqueda exacta
        let match = todas.find(r => 
            (r.tiempo === tNorm || r.tiempo?.includes(tNorm)) &&
            (r.dia === dNorm || !r.dia) &&
            (parseInt(r.semana, 10) === semNum)
        );

        if (!match) {
            // Ciclo de 4 semanas
            const semCiclo = ((semNum - 1) % 4) + 1;
            match = todas.find(r => 
                (r.tiempo === tNorm || r.tiempo?.includes(tNorm)) &&
                (r.dia === dNorm || !r.dia) &&
                (parseInt(r.semana, 10) === semCiclo)
            );
        }

        if (!match) {
            match = todas.find(r => 
                (r.tiempo === tNorm || r.tiempo?.includes(tNorm)) &&
                (r.dia === dNorm || !r.dia)
            );
        }

        if (!match && todas.length > 0) {
            match = todas[0];
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
