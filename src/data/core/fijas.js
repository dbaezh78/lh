/**
 * TEXTOS Y ESTRUCTURAS FIJAS DE LA LITURGIA DE LAS HORAS
 * Se definen en un solo lugar y se reutilizan por referencia. Cero duplicación.
 */

// ====================================================
// INVITATORIO FIJO
// ====================================================
export const instruccion = "(Si Laudes no es la primera oración del día se sigue el esquema del Invitatorio explicado en el Oficio de Lectura)";
export const invitacion = "INVITACIÓN A LA ALABANZA DIVINA";

export const invitatorio1 = "Señor abre mis labios";
export const invitatorio2 = "Y mi boca proclamará tu alabanza";
export const invitatorio3 = "Dios mío, ven en mi auxilio";
export const invitatorio4 = "Señor, date prisa en socorrerme. Gloria al Padre, y al Hijo, y al Espíritu Santo. \n Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén. Aleluya.";

// ====================================================
// ORACIONES CONCLUSIVAS FIJAS
// ====================================================
export const gloria = "Gloria al Padre, y al Hijo, y al Espíritu Santo.";
export const Conclusion1 = "El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna.";
export const Conclusion2 = "Amén.";

// ====================================================
// SALMO 94 — INVITATORIO (invariable)
// ====================================================
export const salmo94t = "Salmo 94";
export const salmo94 = `Venid, aclamemos al Señor,
demos vítores a la Roca que nos salva;
entremos a su presencia dándole gracias,
aclamándolo con cantos.

Porque el Señor es un Dios grande,
soberano de todos los dioses:
tiene en su mano las simas de la tierra,
son suyas las cumbres de los montes;
suyo es el mar, porque él lo hizo,
la tierra firme que modelaron sus manos.

Venid, postrémonos por tierra,
bendiciendo al Señor, creador nuestro.
Porque él es nuestro Dios,
y nosotros su pueblo,
el rebaño que él guía.

Ojalá escuchéis hoy su voz:
«No endurezcáis el corazón como en Meribá,
como el día de Masá en el desierto;
cuando vuestros padres me pusieron a prueba
y dudaron de mí, aunque habían visto mis obras.

Durante cuarenta años
aquella generación me repugnó, y dije:
Es un pueblo de corazón extraviado,
que no reconoce mi camino;
por eso he jurado en mi cólera
que no entrarán en mi descanso»

Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`;

// ====================================================
// CÁNTICO DE ZACARÍAS (BENEDICTUS) - Lc 1, 68-79
// Fijo en Laudes de todos los días
// ====================================================
export const canticoZacariast = "Cántico de Zacarías. EL MESÍAS Y SU PRECURSOR - Lc 1, 68-79";
export const canticoZacarias = `Bendito sea el Señor, Dios de Israel,
porque ha visitado y redimido a su pueblo.
suscitándonos una fuerza de salvación
en la casa de David, su siervo,
según lo había predicho desde antiguo
por boca de sus santos profetas:

Es la salvación que nos libra de nuestros enemigos
y de la mano de todos los que nos odian;
ha realizado así la misericordia que tuvo con nuestros padres,
recordando su santa alianza
y el juramento que juró a nuestro padre Abraham.

Para concedernos que, libres de temor,
arrancados de la mano de los enemigos,
le sirvamos con santidad y justicia,
en su presencia, todos nuestros días.

Y a ti, niño, te llamarán Profeta del Altísimo,
porque irás delante del Señor
a preparar sus caminos,
anunciando a su pueblo la salvación,
el perdón de sus pecados.

Por la entrañable misericordia de nuestro Dios,
nos visitará el sol que nace de lo alto,
para iluminar a los que viven en tiniebla
y en sombra de muerte,
para guiar nuestros pasos
por el camino de la paz.

Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`;

// ====================================================
// MOTOR DE SELECCIÓN DE AÑO LITÚRGICO (A, B, C)
// ====================================================
export function antifonaDomingo(antA, antB, antC) {
    const anioActual = new Date().getFullYear();
    const diferencia = (anioActual - 2026) % 3;
    const indice = diferencia < 0 ? diferencia + 3 : diferencia;
    if (indice === 0) return antA;
    if (indice === 1) return antB;
    return antC;
}
