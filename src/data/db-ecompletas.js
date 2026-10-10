// =========================================================================
// REPOSITORIO Y SEMILLA DE COMPLETAS: EXAMEN DE CONCIENCIA Y BENDICIÓN (db-ecompletas.js)
// =========================================================================

export const CATALOGO_ECOMPLETAS_SEED = [
    // ---------------------------------------------------------------------
    // 1. EXAMEN DE CONCIENCIA (SEGÚN IMAGEN 1 - CANÓNICO)
    // ---------------------------------------------------------------------
    {
        id: "examen_conciencia_canonico",
        tipo: "examen",
        nombre: "Examen de Conciencia - Yo confieso (Fórmula I)",
        titulo: "EXAMEN DE CONCIENCIA",
        monicion: "Hermanos, habiendo llegado al final de esta jornada que Dios nos ha concedido, reconozcamos sinceramente nuestros pecados.",
        confesion: `Yo confieso ante Dios todopoderoso
y ante vosotros, hermanos,
que he pecado mucho
de pensamiento, palabra, obra y omisión:
por mi culpa, por mi culpa, por mi gran culpa.

Por eso ruego a santa María, siempre Virgen,
a los ángeles, a los santos y a vosotros, hermanos,
que intercedáis por mí ante Dios, nuestro Señor.`,
        v: "El Señor todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.",
        r: "Amén."
    },
    {
        id: "examen_conciencia_formula2",
        tipo: "examen",
        nombre: "Examen de Conciencia - Señor, ten misericordia (Fórmula II)",
        titulo: "EXAMEN DE CONCIENCIA",
        monicion: "Al terminar el día, pongámonos en la presencia del Señor y pidámosle perdón por nuestras faltas y pecados.",
        confesion: `Señor, ten misericordia de nosotros.
Porque hemos pecado contra ti.

Muéstranos, Señor, tu misericordia.
Y danos tu salvación.`,
        v: "El Señor todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.",
        r: "Amén."
    },
    {
        id: "examen_conciencia_formula3",
        tipo: "examen",
        nombre: "Examen de Conciencia - Tropos Penitenciales (Fórmula III)",
        titulo: "EXAMEN DE CONCIENCIA",
        monicion: "Reconozcamos con sinceridad ante el Señor que somos pecadores y acojámonos a su misericordia infinita.",
        confesion: `Tú que has venido a sanar los corazones afligidos: Señor, ten piedad.
Señor, ten piedad.

Tú que has venido a llamar a los pecadores: Cristo, ten piedad.
Cristo, ten piedad.

Tú que estás sentado a la derecha del Padre para interceder por nosotros: Señor, ten piedad.
Señor, ten piedad.`,
        v: "Dios todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.",
        r: "Amén."
    },

    // ---------------------------------------------------------------------
    // 2. BENDICIÓN Y ANTÍFONA FINAL DE LA VIRGEN (SEGÚN IMAGEN 2 - CANÓNICO)
    // ---------------------------------------------------------------------
    {
        id: "bendicion_madre_del_redentor",
        tipo: "bendicion",
        nombre: "Bendición y Madre del Redentor (Alma Redemptoris Mater)",
        titulo: "BENDICIÓN",
        v: "El Señor todopoderoso nos conceda una noche tranquila y una santa muerte.",
        r: "Amén.",
        tituloMariana: "ANTIFONA FINAL DE LA SANTISIMA VIRGEN",
        textoMariana: `Madre del Redentor, Virgen fecunda,
puerta del cielo siempre abierta,
estrella del mar,

ven a librar al pueblo que tropieza
y se quiere levantar.

Ante la admiración de cielo y tierra,
engendraste a tu santo Creador,
y permaneces siempre virgen.

Recibe el saludo del ángel Gabriel,
y ten piedad de nosotros, pecadores.`
    },
    {
        id: "bendicion_salve_regina",
        tipo: "bendicion",
        nombre: "Bendición y Salve Regina (Dios te salve, Reina y Madre)",
        titulo: "BENDICIÓN",
        v: "El Señor todopoderoso nos conceda una noche tranquila y una santa muerte.",
        r: "Amén.",
        tituloMariana: "ANTIFONA FINAL DE LA SANTISIMA VIRGEN",
        textoMariana: `Dios te salve, Reina y Madre de misericordia,
vida, dulzura y esperanza nuestra;
Dios te salve.

A ti llamamos los desterrados hijos de Eva;
a ti suspiramos, gimiendo y llorando,
en este valle de lágrimas.

Ella, pues, Señora, abogada nuestra,
vuelve a nosotros esos tus ojos misericordiosos;
y después de este destierro muéstranos a Jesús,
fruto bendito de tu vientre.

¡Oh clemente, oh piadosa, oh dulce Virgen María!`
    },
    {
        id: "bendicion_bajo_tu_amparo",
        tipo: "bendicion",
        nombre: "Bendición y Bajo tu amparo (Sub tuum praesidium)",
        titulo: "BENDICIÓN",
        v: "El Señor todopoderoso nos conceda una noche tranquila y una santa muerte.",
        r: "Amén.",
        tituloMariana: "ANTIFONA FINAL DE LA SANTISIMA VIRGEN",
        textoMariana: `Bajo tu amparo nos acogemos,
santa Madre de Dios;
no deseches las súplicas
que te dirigimos en nuestras necesidades,
antes bien, líbranos de todo peligro,
¡oh Virgen gloriosa y bendita!`
    },
    {
        id: "bendicion_regina_caeli",
        tipo: "bendicion",
        nombre: "Bendición y Regina Caeli (Tiempo Pascual)",
        titulo: "BENDICIÓN",
        v: "El Señor todopoderoso nos conceda una noche tranquila y una santa muerte.",
        r: "Amén.",
        tituloMariana: "ANTIFONA FINAL DE LA SANTISIMA VIRGEN",
        textoMariana: `Reina del cielo, alégrate, aleluya.
Porque el Señor, a quien has merecido llevar, aleluya.
Ha resucitado según su palabra, aleluya.
Ruega al Señor por nosotros, aleluya.`
    },
    {
        id: "bendicion_ave_regina_caelorum",
        tipo: "bendicion",
        nombre: "Bendición y Ave Regina Caelorum",
        titulo: "BENDICIÓN",
        v: "El Señor todopoderoso nos conceda una noche tranquila y una santa muerte.",
        r: "Amén.",
        tituloMariana: "ANTIFONA FINAL DE LA SANTISIMA VIRGEN",
        textoMariana: `Reina de los cielos, alégrate;
Señora de los ángeles, sálvanos;
raíz florida, puerta santa,
de donde la luz al mundo brotó.

Gózate, Virgen gloriosa,
entre todas la más bella;
salve, doncella sin mancha,
ruega a Cristo por nosotros.`
    }
];

export const CLAVE_LOCAL_ECOMPLETAS = "lh_ecompletas_cache";

export class CompletasDB {
    static obtenerTodos() {
        let lista = [];
        try {
            const raw = localStorage.getItem(CLAVE_LOCAL_ECOMPLETAS);
            if (raw) lista = JSON.parse(raw);
        } catch (_) {}
        if (!Array.isArray(lista) || lista.length === 0) {
            lista = [...CATALOGO_ECOMPLETAS_SEED];
            try {
                localStorage.setItem(CLAVE_LOCAL_ECOMPLETAS, JSON.stringify(lista));
            } catch (_) {}
        }
        return lista;
    }

    static obtenerPorTipo(tipo) {
        const todos = this.obtenerTodos();
        return todos.filter(item => (item.tipo || '').toLowerCase() === (tipo || '').toLowerCase());
    }

    static obtenerExamenes() {
        return this.obtenerPorTipo('examen');
    }

    static obtenerBendiciones() {
        return this.obtenerPorTipo('bendicion');
    }

    static obtener(id) {
        if (!id) return null;
        const todos = this.obtenerTodos();
        return todos.find(item => item.id === id) || null;
    }

    static guardar(item) {
        if (!item || !item.id) return false;
        const todos = this.obtenerTodos();
        const idx = todos.findIndex(t => t.id === item.id);
        if (idx >= 0) {
            todos[idx] = { ...todos[idx], ...item };
        } else {
            todos.push(item);
        }
        try {
            localStorage.setItem(CLAVE_LOCAL_ECOMPLETAS, JSON.stringify(todos));
            return true;
        } catch (e) {
            console.error("Error al guardar en CompletasDB:", e);
            return false;
        }
    }

    static eliminar(id) {
        if (!id) return false;
        let todos = this.obtenerTodos();
        todos = todos.filter(item => item.id !== id);
        try {
            localStorage.setItem(CLAVE_LOCAL_ECOMPLETAS, JSON.stringify(todos));
            return true;
        } catch (e) {
            console.error("Error al eliminar de CompletasDB:", e);
            return false;
        }
    }

    static restaurar() {
        const lista = [...CATALOGO_ECOMPLETAS_SEED];
        try {
            localStorage.setItem(CLAVE_LOCAL_ECOMPLETAS, JSON.stringify(lista));
            return lista;
        } catch (e) {
            console.error("Error al restaurar CompletasDB:", e);
            return lista;
        }
    }
}

// Exportar globalmente para scripts estándar
if (typeof window !== 'undefined') {
    window.CompletasDB = CompletasDB;
    window.CATALOGO_ECOMPLETAS_SEED = CATALOGO_ECOMPLETAS_SEED;
}
