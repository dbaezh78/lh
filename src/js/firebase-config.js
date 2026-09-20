// =========================================================================
// FIREBASE CONFIGURATION & INITIALIZATION (CDN Modular)
// =========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { 
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// Configuración de tu app Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA9wF5xM4FKHTuKNxxXyClQFkIOCkmhuTA",
    authDomain: "liturgia-de-la-hora.firebaseapp.com",
    projectId: "liturgia-de-la-hora",
    storageBucket: "liturgia-de-la-hora.firebasestorage.app",
    messagingSenderId: "555982117149",
    appId: "1:555982117149:web:216aa062e2f6ed41d729f4"
};

// Inicializar instancia de Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: 'select_account'
});

// Administrador autorizado para editar y eliminar
export const ADMIN_EMAIL = "dbaezh78@gmail.com";

// Exponer API global para el navegador y los ajustes
window.firebaseAPI = {
    app,
    auth,
    db,
    adminEmail: ADMIN_EMAIL,
    login: () => signInWithPopup(auth, provider).then(res => {
        window.currentUser = res.user;
        return res;
    }),
    logout: () => signOut(auth).then(() => {
        window.currentUser = null;
        localStorage.removeItem('lh_auth_email');
        localStorage.setItem('lh_auth_is_admin', 'false');
    }),
    onAuthReady: (callback) => onAuthStateChanged(auth, (user) => {
        window.currentUser = user;
        const isAdmin = user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        localStorage.setItem('lh_auth_is_admin', isAdmin ? 'true' : 'false');
        if (user && user.email) {
            localStorage.setItem('lh_auth_email', user.email.toLowerCase().trim());
        } else if (!user) {
            localStorage.removeItem('lh_auth_email');
        }
        if (user && window.accessControlAPI?.registerUser) {
            window.accessControlAPI.registerUser(user);
        }
        if (callback) callback(user, isAdmin);
        window.dispatchEvent(new CustomEvent('lh-user-changed', { detail: { user, isAdmin } }));
    }),
    getCurrentUser: () => auth.currentUser || window.currentUser,
    isAdmin: () => {
        const user = auth.currentUser || window.currentUser;
        return !!(user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    },
    // Métodos para sincronizar Santos con Cloud Firestore (Cada santo como documento individual)
    guardarSantosFirestore: async (listaSantos) => {
        console.log("🚀 [Firebase] Iniciando guardarSantosFirestore con", listaSantos ? listaSantos.length : 0, "santos.");
        const user = auth.currentUser;
        console.log("👤 [Firebase] Usuario autenticado actual:", user ? user.email : "NINGUNO (null)");
        if (!user) {
            console.error("❌ [Firebase] No hay usuario logueado en Firebase Auth. Abortando setDoc.");
            throw new Error("No hay usuario autenticado en Firebase Auth.");
        }
        if (!Array.isArray(listaSantos)) {
            console.error("❌ [Firebase] listaSantos no es un array:", listaSantos);
            return;
        }

        console.log("📦 [Firebase] Subiendo documentos en lotes optimizados...");
        
        // Para evitar [resource-exhausted]: Write stream exhausted maximum allowed queued writes
        // usamos lotes moderados de 25 documentos y una breve pausa entre lotes.
        const BATCH_SIZE = 25;
        let count = 0;
        
        for (let i = 0; i < listaSantos.length; i += BATCH_SIZE) {
            const chunk = listaSantos.slice(i, i + BATCH_SIZE);
            const batch = writeBatch(db);
            
            for (const s of chunk) {
                if (!s || !s.nombre) continue;
                const docId = s.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
                const docRef = doc(db, "santos", docId);
                batch.set(docRef, { ...s, ultimaActualizacion: new Date().toISOString() });
                count++;
            }
            
            await batch.commit();
            console.log(`✅ [Firebase] Lote guardado: ${count}/${listaSantos.length} santos.`);
            // Pausa de 250ms para que el flujo de escritura (webchannel stream) vacíe su cola
            await new Promise(res => setTimeout(res, 250));
        }

        console.log(`🎉 [Firebase] ¡Éxito total! Se guardaron ${count} santos en la colección 'santos'.`);
    },
    guardarUnSantoFirestore: async (santo) => {
        if (!auth.currentUser) return;
        if (!santo || !santo.nombre) return;
        const docId = santo.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
        const docRef = doc(db, "santos", docId);
        await setDoc(docRef, { ...santo, ultimaActualizacion: new Date().toISOString() });
        console.log(`☁️ [Firebase] Documento '${docId}' guardado individualmente en Firestore.`);
    },
    eliminarSantoFirestore: async (nombreSanto) => {
        if (!auth.currentUser) return;
        if (!nombreSanto) return;
        const docId = nombreSanto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
        const docRef = doc(db, "santos", docId);
        await deleteDoc(docRef);
        console.log(`🗑️ [Firebase] Documento '${docId}' eliminado de Firestore.`);
    },
    cargarSantosFirestore: async () => {
        const querySnapshot = await getDocs(collection(db, "santos"));
        if (!querySnapshot.empty) {
            const lista = [];
            querySnapshot.forEach((doc) => {
                lista.push(doc.data());
            });
            return lista;
        }
        const docRef = doc(db, "catalogo", "santos");
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return snapshot.data().lista || null;
        }
        return null;
    },
    // Métodos para sincronizar Asignaciones del Calendario Anual
    guardarAsignacionesFirestore: async (asignaciones) => {
        const docRef = doc(db, "catalogo", "asignaciones");
        await setDoc(docRef, { mapa: asignaciones, ultimaActualizacion: new Date().toISOString() });
    },
    cargarAsignacionesFirestore: async () => {
        const docRef = doc(db, "catalogo", "asignaciones");
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return snapshot.data().mapa || null;
        }
        return null;
    },
    // =====================================================================
    // MÉTODOS PARA ANTÍFONAS (Colección 'antifonas')
    // =====================================================================
    guardarAntifonaFirestore: async (antifona) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Debes iniciar sesión para guardar antífonas.");
        if (!antifona || !antifona.texto) throw new Error("Datos de antífona inválidos.");
        const docId = antifona.id || `ant_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const docRef = doc(db, "antifonas", docId);
        const payload = {
            ...antifona,
            id: docId,
            modificadoPor: user.email,
            ultimaActualizacion: new Date().toISOString()
        };
        await setDoc(docRef, payload, { merge: true });
        console.log(`☁️ [Firebase] Antífona '${docId}' guardada en Firestore.`);
        return payload;
    },
    guardarLoteAntifonasFirestore: async (listaAntifonas) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Debes iniciar sesión para guardar antífonas.");
        if (!Array.isArray(listaAntifonas)) throw new Error("listaAntifonas debe ser un array.");
        const BATCH_SIZE = 25;
        let count = 0;
        for (let i = 0; i < listaAntifonas.length; i += BATCH_SIZE) {
            const chunk = listaAntifonas.slice(i, i + BATCH_SIZE);
            const batch = writeBatch(db);
            for (const ant of chunk) {
                if (!ant || !ant.texto) continue;
                const docId = ant.id || `ant_${Date.now()}_${count}_${Math.random().toString(36).substr(2, 4)}`;
                const docRef = doc(db, "antifonas", docId);
                batch.set(docRef, {
                    ...ant,
                    id: docId,
                    modificadoPor: user.email,
                    ultimaActualizacion: new Date().toISOString()
                }, { merge: true });
                count++;
            }
            await batch.commit();
            await new Promise(res => setTimeout(res, 200));
        }
        console.log(`✅ [Firebase] ${count} antífonas guardadas en lote.`);
        return count;
    },
    cargarAntifonasFirestore: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "antifonas"));
            if (!querySnapshot.empty) {
                const lista = [];
                querySnapshot.forEach((doc) => {
                    lista.push({ id: doc.id, ...doc.data() });
                });
                return lista;
            }
        } catch (e) {
            console.warn("⚠️ Error cargando antífonas de Firestore:", e);
        }
        return null;
    },
    eliminarAntifonaFirestore: async (docId) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Debes iniciar sesión para eliminar.");
        const docRef = doc(db, "antifonas", docId);
        await deleteDoc(docRef);
        console.log(`🗑️ [Firebase] Antífona '${docId}' eliminada.`);
        return true;
    },
    // =====================================================================
    // MÉTODOS PARA SALTERIOS Y HORAS LITÚRGICAS (Colección 'salterios')
    // =====================================================================
    guardarSalterioFirestore: async (docId, datosHora) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Debes iniciar sesión para guardar horas litúrgicas.");
        if (!docId || !datosHora) throw new Error("Identificador y datos de la hora requeridos.");
        const docRef = doc(db, "salterios", docId);
        const payload = {
            ...datosHora,
            id: docId,
            modificadoPor: user.email,
            ultimaActualizacion: new Date().toISOString()
        };
        await setDoc(docRef, payload, { merge: true });
        console.log(`☁️ [Firebase] Hora litúrgica '${docId}' guardada en Firestore.`);
        return payload;
    },
    cargarSalterioFirestore: async (docId) => {
        try {
            const docRef = doc(db, "salterios", docId);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                return snapshot.data();
            }
        } catch (e) {
            console.warn(`⚠️ Error al cargar salterio '${docId}' de Firestore:`, e);
        }
        return null;
    },
    cargarTodosSalteriosFirestore: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "salterios"));
            const lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({ id: doc.id, ...doc.data() });
            });
            return lista;
        } catch (e) {
            console.warn("⚠️ Error cargando salterios de Firestore:", e);
            return [];
        }
    },
    eliminarSalterioFirestore: async (docId) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Debes iniciar sesión para eliminar.");
        const docRef = doc(db, "salterios", docId);
        await deleteDoc(docRef);
        console.log(`🗑️ [Firebase] Salterio '${docId}' eliminado.`);
        return true;
    },
    // Métodos para el orden personalizado de Archivos del Sistema
    guardarOrdenArchivosSistema: async (ordenIds) => {
        const user = auth.currentUser;
        if (!user || (user.email && user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase())) {
            throw new Error("No tienes permisos de administrador para guardar el orden de los archivos.");
        }
        const docRef = doc(db, "catalogo", "orden_archivos_sistema");
        await setDoc(docRef, {
            orden: ordenIds,
            modificadoPor: user.email,
            ultimaActualizacion: new Date().toISOString()
        }, { merge: true });
        console.log("☁️ [Firebase] Orden de archivos del sistema guardado con éxito.");
        return true;
    },
    cargarOrdenArchivosSistema: async () => {
        try {
            const docRef = doc(db, "catalogo", "orden_archivos_sistema");
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const data = snapshot.data();
                return data.orden || null;
            }
        } catch (e) {
            console.warn("⚠️ Error al leer orden_archivos_sistema de Firestore:", e);
        }
        return null;
    },
    // Métodos para sincronizar Ajustes y Preferencias (Área de Setting)
    guardarAjustesFirestore: async (seccion, datos) => {
        try {
            const user = auth.currentUser;
            const coleccion = "ajustes";
            const payload = {
                [seccion]: datos,
                ultimaActualizacion: new Date().toISOString()
            };
            if (user) {
                payload.email = user.email || null;
                payload.uid = user.uid || null;
                try {
                    const userDocRef = doc(db, coleccion, user.uid);
                    await setDoc(userDocRef, payload, { merge: true });
                } catch (eUser) {
                    console.warn("⚠️ Aviso al guardar ajustes por usuario en Firestore:", eUser);
                }
            }
            // También guardar en documento global/compartido para la sección
            const globalDocRef = doc(db, coleccion, seccion);
            await setDoc(globalDocRef, payload, { merge: true });
            console.log(`☁️ [Firebase] Ajustes sección '${seccion}' guardados en Firestore.`);
            return true;
        } catch (err) {
            console.warn(`⚠️ Error guardando ajustes en Firestore (${seccion}):`, err);
            return false;
        }
    },
    cargarAjustesFirestore: async (seccion) => {
        try {
            const user = auth.currentUser;
            const coleccion = "ajustes";
            // Intentar primero por usuario si está autenticado
            if (user) {
                try {
                    const userDocRef = doc(db, coleccion, user.uid);
                    const userSnap = await getDoc(userDocRef);
                    if (userSnap.exists() && userSnap.data()[seccion] !== undefined) {
                        console.log(`☁️ [Firebase] Ajustes '${seccion}' cargados del usuario.`);
                        return userSnap.data()[seccion];
                    }
                } catch (eUser) {
                    console.warn("⚠️ Aviso al leer ajustes por usuario en Firestore:", eUser);
                }
            }
            // Si no o como respaldo, leer del documento compartido de la sección
            const globalDocRef = doc(db, coleccion, seccion);
            const globalSnap = await getDoc(globalDocRef);
            if (globalSnap.exists()) {
                const data = globalSnap.data();
                return data[seccion] !== undefined ? data[seccion] : data;
            }
            return null;
        } catch (err) {
            console.warn(`⚠️ Error cargando ajustes de Firestore (${seccion}):`, err);
            return null;
        }
    },
    // Métodos para historial de versiones y cambios (ver.html)
    guardarActualizacionFirestore: async (registro) => {
        try {
            if (!registro || !registro.version) throw new Error("Versión requerida.");
            const docId = registro.id || `v_${registro.version.replace(/[^a-zA-Z0-9_-]/g, "_")}_${Date.now()}`;
            const docRef = doc(db, "actualizaciones", docId);
            const payload = {
                id: docId,
                version: registro.version.trim(),
                fecha: registro.fecha || new Date().toISOString().split("T")[0],
                detalles: registro.detalles || "",
                ultimaModificacion: new Date().toISOString()
            };
            const user = auth.currentUser;
            if (user) {
                payload.autor = user.email || user.displayName || "Usuario";
            }
            await setDoc(docRef, payload, { merge: true });
            console.log(`☁️ [Firebase] Actualización '${docId}' guardada en Firestore.`);
            return { success: true, id: docId };
        } catch (err) {
            console.error("❌ [Firebase] Error al guardar actualización:", err);
            throw err;
        }
    },
    cargarActualizacionesFirestore: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "actualizaciones"));
            const lista = [];
            querySnapshot.forEach((d) => {
                lista.push({ id: d.id, ...d.data() });
            });
            // Ordenar por fecha o última modificación descendente
            lista.sort((a, b) => {
                const fa = a.fecha || a.ultimaModificacion || "";
                const fb = b.fecha || b.ultimaModificacion || "";
                return fb.localeCompare(fa);
            });
            return lista;
        } catch (err) {
            console.warn("⚠️ Error cargando actualizaciones de Firestore:", err);
            return [];
        }
    },
    eliminarActualizacionFirestore: async (docId) => {
        try {
            if (!docId) return false;
            const docRef = doc(db, "actualizaciones", docId);
            await deleteDoc(docRef);
            console.log(`🗑️ [Firebase] Actualización '${docId}' eliminada.`);
            return true;
        } catch (err) {
            console.error("❌ [Firebase] Error al eliminar actualización:", err);
            throw err;
        }
    }
};

window.onAuthReady = window.firebaseAPI.onAuthReady;
window.getCurrentUser = window.firebaseAPI.getCurrentUser;

console.log("🔥 [Firebase] Inicializado correctamente con CDN modular. Admin autorizado:", ADMIN_EMAIL);
