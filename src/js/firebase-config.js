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
    adminEmail: ADMIN_EMAIL,
    login: () => signInWithPopup(auth, provider),
    logout: () => signOut(auth),
    onAuthReady: (callback) => onAuthStateChanged(auth, (user) => {
        const isAdmin = user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        localStorage.setItem('lh_auth_is_admin', isAdmin ? 'true' : 'false');
        if (callback) callback(user, isAdmin);
    }),
    getCurrentUser: () => auth.currentUser,
    isAdmin: () => {
        const user = auth.currentUser;
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
    }
};

console.log("🔥 [Firebase] Inicializado correctamente con CDN modular. Admin autorizado:", ADMIN_EMAIL);
