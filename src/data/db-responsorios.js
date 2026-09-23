/**
 * db-responsorios.js
 * Repositorio de Responsorios / Versículos Litúrgicos (Post-Salmodia del Oficio de Lectura y Horas Menores)
 * Estructura: V (Versículo) y R (Respuesta)
 */

export const CATALOGO_RESPONSORIOS_SEED = [
    // TIEMPO ORDINARIO - SEMANA 1
    {
        id: "tos1OFdo_resp",
        varName: "tos1OFdo_resp",
        titulo: "Responsorio de la Salmodia - Domingo Semana 1 / Bautismo (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "domingo",
        libro: "oficio",
        v: "Éste es mi Hijo amado.",
        r: "Escuchadlo."
    },
    {
        id: "tos1OFlu_resp",
        varName: "tos1OFlu_resp",
        titulo: "Responsorio de la Salmodia - Lunes Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "lunes",
        libro: "oficio",
        v: "Hijo mío, haz caso de mi sabiduría.",
        r: "Presta oído a mi inteligencia."
    },
    {
        id: "tos1OFma_resp",
        varName: "tos1OFma_resp",
        titulo: "Responsorio de la Salmodia - Martes Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "martes",
        libro: "oficio",
        v: "Escucha, pueblo mío, mi enseñanza.",
        r: "Presta oído a las palabras de mi boca."
    },
    {
        id: "tos1OFmi_resp",
        varName: "tos1OFmi_resp",
        titulo: "Responsorio de la Salmodia - Miércoles Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "miercoles",
        libro: "oficio",
        v: "Señor, hazme conocer tus caminos.",
        r: "Muéstrame tus senderos."
    },
    {
        id: "tos1OFju_resp",
        varName: "tos1OFju_resp",
        titulo: "Responsorio de la Salmodia - Jueves Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "jueves",
        libro: "oficio",
        v: "Instrúyeme en tu verdad, enséñame.",
        r: "Porque tú eres mi Dios y Salvador."
    },
    {
        id: "tos1OFvi_resp",
        varName: "tos1OFvi_resp",
        titulo: "Responsorio de la Salmodia - Viernes Semana 1 (Oficio)",
        tiempo: "ordinario",
        semana: "1",
        dia: "viernes",
        libro: "oficio",
        v: "Acuérdate de mí, Señor, por tu bondad.",
        r: "Acuérdate de tu ternura."
    },
    {
        id: "tos1OFsa_resp",
        varName: "tos1OFsa_resp",
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
        id: "tps1OFjs_resp",
        varName: "tps1OFjs_resp",
        titulo: "Responsorio de la Salmodia - Octava de Pascua Jueves (Oficio)",
        tiempo: "pascua",
        semana: "1",
        dia: "jueves",
        libro: "oficio",
        v: "En tu resurrección, oh Cristo. Aleluya.",
        r: "El cielo y la tierra se alegran. Aleluya."
    },
    {
        id: "tps1OFdo_resp",
        varName: "tps1OFdo_resp",
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
        id: "tas1OFdo_resp",
        varName: "tas1OFdo_resp",
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
        id: "tcs1OFdo_resp",
        varName: "tcs1OFdo_resp",
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
            const encontrada = todas.find(r => 
                this.normalizarId(r.id) === idNorm || 
                this.normalizarId(r.varName) === idNorm
            );
            if (encontrada) return encontrada;
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
