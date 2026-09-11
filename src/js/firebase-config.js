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
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: 'select_account'
});

// Exponer API global para el navegador y los ajustes
window.firebaseAPI = {
    app,
    auth,
    login: () => signInWithPopup(auth, provider),
    logout: () => signOut(auth),
    onAuthReady: (callback) => onAuthStateChanged(auth, callback),
    getCurrentUser: () => auth.currentUser
};

console.log("🔥 [Firebase] Inicializado correctamente con CDN modular.");
