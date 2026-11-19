/**
 * src/js/cloud-sync.js - Motor de Sincronización Inteligente Bidireccional y Gestión de Caché
 * Liturgia de las Horas (lh.resucito.do)
 *
 * Modo Offline-First: Guarda todo el contenido en el dispositivo local y solo descarga de Firebase
 * lo que falte, mitigando consumo de datos y habilitando uso offline instantáneo.
 */

(function(window) {
    'use strict';

    // Claves de almacenamiento local canónicas
    const KEYS = {
        SANTOS: 'lh_catalogo_nombres_santos',
        SANTOS_ELIMINADOS: 'lh_santos_eliminados',
        ANTIFONAS: 'lh_antifonas_cache',
        PREFIX_SALTERIO: 'lh_salterio_',
        SALTERIOS_INDEX: 'lh_salterios_keys_index',
        COLUMNAS_SANTOS_OCULTAS: 'lh_santos_columnas_ocultas',
        COLUMNAS_SANTOS_VISIBLES: 'lh_santos_columnas_visibles',
        ULTIMO_SYNC: 'lh_cloud_ultimo_sync'
    };

    // Helper para normalizar identificadores de santos
    function normalizarSlug(str) {
        if (!str) return '';
        return str
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
    }

    // Helper para normalizar ID de antífonas
    function generarIdAntifona(a) {
        if (!a) return '';
        if (a.id) return a.id.replace(/\//g, '_');
        if (a.varName) return a.varName.replace(/\//g, '_');
        const t = normalizarSlug(a.tiempo || 't');
        const l = normalizarSlug(a.libro || 'l');
        const tip = normalizarSlug(a.tipo || 'tp');
        const s = a.semana !== undefined ? a.semana : '';
        const d = normalizarSlug(a.dia || '');
        const st = normalizarSlug(a.santo || a.fecha || '');
        return `ant_${t}_${l}_${tip}_${s}_${d}_${st}`;
    }

    // =========================================================================
    // ACCESO A DATOS LOCALES
    // =========================================================================

    function getSantosLocales() {
        try {
            const raw = localStorage.getItem(KEYS.SANTOS);
            if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) return arr.filter(s => s && s.nombre);
            }
        } catch (e) {
            console.warn("Error leyendo santos locales:", e);
        }
        return [];
    }

    async function getSantosLocalesAsync() {
        let arr = getSantosLocales();
        if (window.indexedDB) {
            try {
                const arrIDB = await new Promise(res => {
                    const req = indexedDB.open('LH_Santos_DB', 2);
                    req.onsuccess = (e) => {
                        const db = e.target.result;
                        if (db.objectStoreNames.contains('catalogo')) {
                            const tx = db.transaction('catalogo', 'readonly');
                            const sReq = tx.objectStore('catalogo').get('santos');
                            sReq.onsuccess = () => res(sReq.result || null);
                            sReq.onerror = () => res(null);
                        } else res(null);
                    };
                    req.onerror = () => res(null);
                });
                if (Array.isArray(arrIDB) && arrIDB.length > 0) {
                    const mapFotos = new Map();
                    arrIDB.forEach(s => {
                        if (s && s.nombre && s.imagen && s.imagen.trim().length > 0) {
                            mapFotos.set(normalizarSlug(s.nombre), s.imagen);
                        }
                    });
                    if (mapFotos.size > 0) {
                        arr = arr.map(s => {
                            const slug = normalizarSlug(s?.nombre);
                            if ((!s.imagen || s.imagen.trim().length === 0) && mapFotos.has(slug)) {
                                return { ...s, imagen: mapFotos.get(slug) };
                            }
                            return s;
                        });
                    }
                }
            } catch (_) {}
        }
        return arr;
    }

    function setSantosLocales(lista) {
        if (!Array.isArray(lista)) return;
        try {
            localStorage.setItem(KEYS.SANTOS, JSON.stringify(lista));
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.code === 22) {
                try {
                    const listaLigera = lista.map(s => {
                        if (s && s.imagen && s.imagen.length > 500) {
                            const { imagen, ...resto } = s;
                            return { ...resto, imagen: '' };
                        }
                        return s;
                    });
                    localStorage.setItem(KEYS.SANTOS, JSON.stringify(listaLigera));
                } catch (_) {}
            }
        }
        // Guardar lista completa con imágenes en IndexedDB
        if (window.indexedDB) {
            try {
                const req = indexedDB.open('LH_Santos_DB', 2);
                req.onsuccess = (e) => {
                    const db = e.target.result;
                    if (db.objectStoreNames.contains('catalogo')) {
                        const tx = db.transaction('catalogo', 'readwrite');
                        tx.objectStore('catalogo').put(lista, 'santos');
                    }
                };
            } catch (_) {}
        }
        window.dispatchEvent(new CustomEvent('lh-santos-actualizados', { detail: { total: lista.length } }));
    }

    function getAntifonasLocales() {
        try {
            const raw = localStorage.getItem(KEYS.ANTIFONAS);
            if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) return arr.filter(a => a && a.texto);
            }
        } catch (e) {
            console.warn("Error leyendo antífonas locales:", e);
        }
        return [];
    }

    function setAntifonasLocales(lista) {
        if (!Array.isArray(lista)) return;
        localStorage.setItem(KEYS.ANTIFONAS, JSON.stringify(lista));
        window.dispatchEvent(new CustomEvent('lh-antifonas-actualizadas', { detail: { total: lista.length } }));
    }

    function getSalteriosLocales() {
        const resultado = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(KEYS.PREFIX_SALTERIO)) {
                    const docId = key.substring(KEYS.PREFIX_SALTERIO.length);
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data && typeof data === 'object') {
                            resultado.push({ id: docId, ...data });
                        }
                    } catch (_) {}
                }
            }
        } catch (e) {
            console.warn("Error leyendo salterios locales:", e);
        }
        return resultado;
    }

    function setSalterioLocal(docId, data) {
        if (!docId || !data) return;
        try {
            localStorage.setItem(KEYS.PREFIX_SALTERIO + docId, JSON.stringify(data));
        } catch (e) {
            console.warn("Error guardando salterio local:", e);
        }
    }

    // =========================================================================
    // API PRINCIPAL DE CLOUD SYNC
    // =========================================================================

    const cloudSyncAPI = {
        keys: KEYS,

        // Estado y conexión
        estaEnLinea: () => navigator.onLine,
        getUsuarioAuth: () => {
            const api = window.firebaseAPI;
            const user = (api && api.getCurrentUser) ? api.getCurrentUser() : null;
            const email = (user?.email || localStorage.getItem('lh_auth_email') || '').toLowerCase().trim();
            const isAdmin = (api && typeof api.isAdmin === 'function') ? api.isAdmin() : (localStorage.getItem('lh_auth_is_admin') === 'true');
            return {
                autenticado: !!user || !!email,
                email: email || 'Invitado (offline)',
                isAdmin: isAdmin,
                user
            };
        },

        // Lectura de datos locales
        getSantosLocales,
        setSantosLocales,
        getAntifonasLocales,
        setAntifonasLocales,
        getSalteriosLocales,
        setSalterioLocal,

        // =====================================================================
        // 1. REVISAR CARGAS Y DIFERENCIAS (LOCAL VS FIREBASE)
        // =====================================================================
        analizarDiferencias: async function() {
            console.log("🔍 [Cloud-Sync] Iniciando análisis de diferencias Local vs Firebase Cloud...");
            const fb = window.firebaseAPI;
            if (!fb) {
                throw new Error("Firebase API no está cargado.");
            }

            const infoAuth = cloudSyncAPI.getUsuarioAuth();

            // 1.1 Santos
            const localSantos = await getSantosLocalesAsync();
            const localSantosMap = new Map();
            localSantos.forEach(s => {
                const slug = normalizarSlug(s.nombre);
                if (slug) localSantosMap.set(slug, s);
            });

            let cloudSantos = [];
            try {
                if (fb.cargarSantosFirestore) {
                    cloudSantos = await fb.cargarSantosFirestore() || [];
                }
            } catch (err) {
                console.warn("Aviso al consultar santos de Firestore:", err);
            }
            const cloudSantosMap = new Map();
            cloudSantos.forEach(s => {
                const slug = normalizarSlug(s.nombre);
                if (slug) cloudSantosMap.set(slug, s);
            });

            const faltanSantosLocal = [];
            const pendientesSantosSubir = [];
            let sincronizadosSantos = 0;

            cloudSantosMap.forEach((sCloud, slug) => {
                if (!localSantosMap.has(slug)) {
                    faltanSantosLocal.push(sCloud);
                } else {
                    const sLocal = localSantosMap.get(slug);
                    const tCloud = sCloud.ultimaActualizacion ? new Date(sCloud.ultimaActualizacion).getTime() : 0;
                    const tLocal = sLocal.ultimaActualizacion ? new Date(sLocal.ultimaActualizacion).getTime() : 0;
                    if (tCloud > tLocal + 2000) {
                        faltanSantosLocal.push(sCloud);
                    } else if (tLocal > tCloud + 2000) {
                        pendientesSantosSubir.push(sLocal);
                    } else {
                        sincronizadosSantos++;
                    }
                }
            });

            localSantosMap.forEach((sLocal, slug) => {
                if (!cloudSantosMap.has(slug)) {
                    pendientesSantosSubir.push(sLocal);
                }
            });

            // 1.2 Antífonas
            const localAntifonas = getAntifonasLocales();
            const localAntMap = new Map();
            localAntifonas.forEach(a => {
                const id = generarIdAntifona(a);
                if (id) localAntMap.set(id, a);
            });

            let cloudAntifonas = [];
            try {
                if (fb.cargarAntifonasFirestore) {
                    cloudAntifonas = await fb.cargarAntifonasFirestore() || [];
                }
            } catch (err) {
                console.warn("Aviso al consultar antífonas de Firestore:", err);
            }
            const cloudAntMap = new Map();
            cloudAntifonas.forEach(a => {
                const id = generarIdAntifona(a);
                if (id) cloudAntMap.set(id, a);
            });

            const faltanAntifonasLocal = [];
            const pendientesAntifonasSubir = [];
            let sincronizadosAntifonas = 0;

            cloudAntMap.forEach((aCloud, id) => {
                if (!localAntMap.has(id)) {
                    faltanAntifonasLocal.push(aCloud);
                } else {
                    const aLocal = localAntMap.get(id);
                    const tCloud = aCloud.ultimaActualizacion ? new Date(aCloud.ultimaActualizacion).getTime() : 0;
                    const tLocal = aLocal.ultimaActualizacion ? new Date(aLocal.ultimaActualizacion).getTime() : 0;
                    if (tCloud > tLocal + 2000) {
                        faltanAntifonasLocal.push(aCloud);
                    } else if (tLocal > tCloud + 2000) {
                        pendientesAntifonasSubir.push(aLocal);
                    } else {
                        sincronizadosAntifonas++;
                    }
                }
            });

            localAntMap.forEach((aLocal, id) => {
                if (!cloudAntMap.has(id)) {
                    pendientesAntifonasSubir.push(aLocal);
                }
            });

            // 1.3 Salterios (Horas)
            const localSalterios = getSalteriosLocales();
            const localSaltMap = new Map();
            localSalterios.forEach(s => {
                if (s.id) localSaltMap.set(s.id, s);
            });

            let cloudSalterios = [];
            try {
                if (fb.cargarTodosSalteriosFirestore) {
                    cloudSalterios = await fb.cargarTodosSalteriosFirestore() || [];
                }
            } catch (err) {
                console.warn("Aviso al consultar salterios de Firestore:", err);
            }
            const cloudSaltMap = new Map();
            cloudSalterios.forEach(s => {
                if (s.id) cloudSaltMap.set(s.id, s);
            });

            const faltanSalteriosLocal = [];
            const pendientesSalteriosSubir = [];
            let sincronizadosSalterios = 0;

            cloudSaltMap.forEach((sCloud, id) => {
                if (!localSaltMap.has(id)) {
                    faltanSalteriosLocal.push(sCloud);
                } else {
                    const sLocal = localSaltMap.get(id);
                    const tCloud = sCloud.ultimaActualizacion ? new Date(sCloud.ultimaActualizacion).getTime() : 0;
                    const tLocal = sLocal.ultimaActualizacion ? new Date(sLocal.ultimaActualizacion).getTime() : 0;
                    if (tCloud > tLocal + 2000) {
                        faltanSalteriosLocal.push(sCloud);
                    } else if (tLocal > tCloud + 2000) {
                        pendientesSalteriosSubir.push(sLocal);
                    } else {
                        sincronizadosSalterios++;
                    }
                }
            });

            localSaltMap.forEach((sLocal, id) => {
                if (!cloudSaltMap.has(id)) {
                    pendientesSalteriosSubir.push(sLocal);
                }
            });

            const resultado = {
                timestamp: new Date().toISOString(),
                online: navigator.onLine,
                usuario: infoAuth,
                santos: {
                    localTotal: localSantos.length,
                    cloudTotal: cloudSantos.length,
                    faltanLocal: faltanSantosLocal,
                    pendientesSubir: pendientesSantosSubir,
                    sincronizados: sincronizadosSantos
                },
                antifonas: {
                    localTotal: localAntifonas.length,
                    cloudTotal: cloudAntifonas.length,
                    faltanLocal: faltanAntifonasLocal,
                    pendientesSubir: pendientesAntifonasSubir,
                    sincronizados: sincronizadosAntifonas
                },
                salterios: {
                    localTotal: localSalterios.length,
                    cloudTotal: cloudSalterios.length,
                    faltanLocal: faltanSalteriosLocal,
                    pendientesSubir: pendientesSalteriosSubir,
                    sincronizados: sincronizadosSalterios
                }
            };

            // Cachear el último diff
            window._ultimoDiffCloud = resultado;
            cloudSyncAPI.actualizarUIConDiff(resultado);
            return resultado;
        },

        // =====================================================================
        // 2. ACTUALIZAR INTELIGENTE (DESCARGAR SOLO LO QUE FALTE EN EL CELULAR)
        // =====================================================================
        descargarFaltantesDeCloud: async function(notificar = true) {
            console.log("⬇️ [Cloud-Sync] Iniciando descarga inteligente (solo novedades/faltantes)...");
            const fb = window.firebaseAPI;
            if (!fb) throw new Error("Firebase API no disponible.");

            let logMsg = [];
            let totalNuevos = 0;

            // 2.1 Descargar santos faltantes
            try {
                if (fb.cargarSantosFirestore) {
                    const cloudSantos = await fb.cargarSantosFirestore();
                    if (Array.isArray(cloudSantos) && cloudSantos.length > 0) {
                        const localSantos = await getSantosLocalesAsync();
                        const localMap = new Map();
                        localSantos.forEach((s, idx) => {
                            const slug = normalizarSlug(s.nombre);
                            if (slug) localMap.set(slug, { santo: s, idx });
                        });

                        let nuevosSantos = 0;
                        let actualizadosSantos = 0;

                        cloudSantos.forEach(sCloud => {
                            if (!sCloud || !sCloud.nombre) return;
                            const slug = normalizarSlug(sCloud.nombre);
                            if (!slug) return;

                            if (!localMap.has(slug)) {
                                localSantos.push(sCloud);
                                nuevosSantos++;
                            } else {
                                const reg = localMap.get(slug);
                                const tCloud = sCloud.ultimaActualizacion ? new Date(sCloud.ultimaActualizacion).getTime() : 0;
                                const tLocal = reg.santo.ultimaActualizacion ? new Date(reg.santo.ultimaActualizacion).getTime() : 0;
                                const cloudTieneFoto = !!(sCloud.imagen && sCloud.imagen.trim().length > 0);
                                const localTieneFoto = !!(reg.santo.imagen && reg.santo.imagen.trim().length > 0);

                                if ((cloudTieneFoto && !localTieneFoto) || tCloud >= tLocal) {
                                    localSantos[reg.idx] = { 
                                        ...reg.santo, 
                                        ...sCloud, 
                                        imagen: sCloud.imagen || reg.santo.imagen || '' 
                                    };
                                    actualizadosSantos++;
                                } else if (localTieneFoto && !cloudTieneFoto) {
                                    localSantos[reg.idx] = {
                                        ...sCloud,
                                        ...reg.santo,
                                        imagen: reg.santo.imagen
                                    };
                                }
                            }
                        });

                        if (nuevosSantos > 0 || actualizadosSantos > 0) {
                            setSantosLocales(localSantos);
                            totalNuevos += (nuevosSantos + actualizadosSantos);
                            logMsg.push(`Santos: ${nuevosSantos} nuevos, ${actualizadosSantos} actualizados`);
                        }
                    }
                }
            } catch (err) {
                console.warn("Aviso al descargar santos de Firebase:", err);
            }

            // 2.2 Descargar antífonas faltantes
            try {
                if (fb.cargarAntifonasFirestore) {
                    const cloudAntifonas = await fb.cargarAntifonasFirestore();
                    if (Array.isArray(cloudAntifonas) && cloudAntifonas.length > 0) {
                        const localAnt = getAntifonasLocales();
                        const localMap = new Map();
                        localAnt.forEach((a, idx) => {
                            const id = generarIdAntifona(a);
                            if (id) localMap.set(id, { ant: a, idx });
                        });

                        let nuevasAnt = 0;
                        let actualizadasAnt = 0;

                        cloudAntifonas.forEach(aCloud => {
                            if (!aCloud || !aCloud.texto) return;
                            const id = generarIdAntifona(aCloud);
                            if (!id) return;

                            if (!localMap.has(id)) {
                                localAnt.push(aCloud);
                                nuevasAnt++;
                            } else {
                                const reg = localMap.get(id);
                                const tCloud = aCloud.ultimaActualizacion ? new Date(aCloud.ultimaActualizacion).getTime() : 0;
                                const tLocal = reg.ant.ultimaActualizacion ? new Date(reg.ant.ultimaActualizacion).getTime() : 0;
                                if (tCloud > tLocal + 2000) {
                                    localAnt[reg.idx] = { ...reg.ant, ...aCloud };
                                    actualizadasAnt++;
                                }
                            }
                        });

                        if (nuevasAnt > 0 || actualizadasAnt > 0) {
                            setAntifonasLocales(localAnt);
                            totalNuevos += (nuevasAnt + actualizadasAnt);
                            logMsg.push(`Antífonas: ${nuevasAnt} nuevas, ${actualizadasAnt} actualizadas`);
                        }
                    }
                }
            } catch (err) {
                console.warn("Aviso al descargar antífonas de Firebase:", err);
            }

            // 2.3 Descargar salterios faltantes
            try {
                if (fb.cargarTodosSalteriosFirestore) {
                    const cloudSalterios = await fb.cargarTodosSalteriosFirestore();
                    if (Array.isArray(cloudSalterios) && cloudSalterios.length > 0) {
                        let nuevosSalt = 0;
                        cloudSalterios.forEach(sCloud => {
                            if (!sCloud || !sCloud.id) return;
                            const key = KEYS.PREFIX_SALTERIO + sCloud.id;
                            const rawLocal = localStorage.getItem(key);
                            if (!rawLocal) {
                                localStorage.setItem(key, JSON.stringify(sCloud));
                                nuevosSalt++;
                            } else {
                                try {
                                    const localObj = JSON.parse(rawLocal);
                                    const tCloud = sCloud.ultimaActualizacion ? new Date(sCloud.ultimaActualizacion).getTime() : 0;
                                    const tLocal = localObj.ultimaActualizacion ? new Date(localObj.ultimaActualizacion).getTime() : 0;
                                    if (tCloud > tLocal + 2000) {
                                        localStorage.setItem(key, JSON.stringify({ ...localObj, ...sCloud }));
                                        nuevosSalt++;
                                    }
                                } catch (_) {}
                            }
                        });

                        if (nuevosSalt > 0) {
                            totalNuevos += nuevosSalt;
                            logMsg.push(`Salterios: ${nuevosSalt} horas agregadas/actualizadas`);
                        }
                    }
                }
            } catch (err) {
                console.warn("Aviso al descargar salterios de Firebase:", err);
            }

            localStorage.setItem(KEYS.ULTIMO_SYNC, new Date().toISOString());

            const resumen = (totalNuevos > 0)
                ? `✅ Sincronización inteligente completada: ${logMsg.join(' | ')}. Tu celular está al día sin re-descargar datos repetidos.`
                : `✨ Tu celular ya tiene todo el contenido al día. No hubo necesidad de descargar nada adicional.`;

            if (notificar) {
                alert(resumen);
            }
            cloudSyncAPI.analizarDiferencias().catch(() => {});
            return { totalNuevos, logMsg, resumen };
        },

        // =====================================================================
        // 3. CARGAR CONTENIDO PENDIENTE (LOCAL ➔ FIREBASE CLOUD)
        // =====================================================================
        subirContenidoPendienteACloud: async function(notificar = true) {
            console.log("⬆️ [Cloud-Sync] Iniciando subida de contenido pendiente a Firebase Cloud...");
            const fb = window.firebaseAPI;
            if (!fb) throw new Error("Firebase API no disponible.");

            const auth = cloudSyncAPI.getUsuarioAuth();
            if (!auth.autenticado && fb.login) {
                if (confirm("Para subir contenido a Firebase Cloud debes iniciar sesión con Google. ¿Deseas iniciar sesión ahora?")) {
                    await fb.login();
                } else {
                    return { subidos: 0, cancelado: true };
                }
            }

            // Realizar análisis previo si no lo tenemos
            const diff = await cloudSyncAPI.analizarDiferencias();
            let totalSubidos = 0;
            const logMsg = [];

            // 3.1 Subir santos pendientes
            if (diff.santos.pendientesSubir.length > 0 && fb.guardarSantosFirestore) {
                const pendientes = diff.santos.pendientesSubir;
                await fb.guardarSantosFirestore(pendientes);
                totalSubidos += pendientes.length;
                logMsg.push(`${pendientes.length} santos`);
            }

            // 3.2 Subir antífonas pendientes
            if (diff.antifonas.pendientesSubir.length > 0 && fb.guardarLoteAntifonasFirestore) {
                const pendientes = diff.antifonas.pendientesSubir;
                await fb.guardarLoteAntifonasFirestore(pendientes);
                totalSubidos += pendientes.length;
                logMsg.push(`${pendientes.length} antífonas`);
            }

            // 3.3 Subir salterios pendientes
            if (diff.salterios.pendientesSubir.length > 0 && fb.guardarSalterioFirestore) {
                const pendientes = diff.salterios.pendientesSubir;
                for (const s of pendientes) {
                    if (s && s.id) {
                        await fb.guardarSalterioFirestore(s.id, s);
                    }
                }
                totalSubidos += pendientes.length;
                logMsg.push(`${pendientes.length} horas litúrgicas`);
            }

            localStorage.setItem(KEYS.ULTIMO_SYNC, new Date().toISOString());

            const mensaje = (totalSubidos > 0)
                ? `🎉 ¡Carga exitosa! Se subieron a Firebase Cloud: ${logMsg.join(', ')}.`
                : `✨ Todo el contenido de tu celular ya está sincronizado en Firebase Cloud. No hay pendientes de subir.`;

            if (notificar) {
                alert(mensaje);
            }
            cloudSyncAPI.analizarDiferencias().catch(() => {});
            return { totalSubidos, mensaje };
        },

        // =====================================================================
        // 4. SINCRONIZACIÓN TOTAL BIDIRECCIONAL
        // =====================================================================
        sincronizarBidireccional: async function() {
            try {
                // Primero subimos cambios locales para no perderlos
                const resSubida = await cloudSyncAPI.subirContenidoPendienteACloud(false);
                // Luego descargamos las novedades que no estén localmente
                const resDescarga = await cloudSyncAPI.descargarFaltantesDeCloud(false);

                const msg = `🔄 Sincronización Bidireccional Completada:\n` +
                            `• Subidos a Firebase: ${resSubida.totalSubidos || 0} elementos.\n` +
                            `• Descargados a tu celular: ${resDescarga.totalNuevos || 0} novedades.\n` +
                            `Tu almacenamiento local quedó optimizado y 100% sincronizado.`;
                alert(msg);
                cloudSyncAPI.analizarDiferencias().catch(() => {});
            } catch (err) {
                console.error("Error en sincronización bidireccional:", err);
                alert(`⚠️ Error durante la sincronización: ${err.message}`);
            }
        },

        // =====================================================================
        // 5. LIMPIEZA INTELIGENTE DE CACHÉ
        // =====================================================================
        limpiarCacheLocal: async function(tipo = 'menu') {
            if (tipo === 'menu') {
                const opcion = prompt(
                    "🧹 GESTIÓN DE CACHÉ LOCAL:\n\n" +
                    "Escribe el número de la opción que deseas realizar:\n" +
                    "1: Limpiar Caché de Santos (Re-descargará fresca en el próximo sync)\n" +
                    "2: Limpiar Caché de Antífonas\n" +
                    "3: Limpiar Salterios Locales\n" +
                    "4: Limpiar Caché de la Aplicación Web (Service Worker / PWA)\n" +
                    "5: Limpieza Total de Cachés (Sin cerrar tu sesión)\n" +
                    "0: Cancelar",
                    "1"
                );
                if (!opcion || opcion === '0') return;
                switch (opcion.trim()) {
                    case '1': return cloudSyncAPI.limpiarCacheLocal('santos');
                    case '2': return cloudSyncAPI.limpiarCacheLocal('antifonas');
                    case '3': return cloudSyncAPI.limpiarCacheLocal('salterios');
                    case '4': return cloudSyncAPI.limpiarCacheLocal('app_cache');
                    case '5': return cloudSyncAPI.limpiarCacheLocal('todo');
                    default: alert("Opción no válida."); return;
                }
            }

            if (tipo === 'santos') {
                if (confirm("¿Estás seguro de limpiar la caché de Santos del celular? Podrás descargarla fresca desde la nube con un clic en 'Actualizar'.")) {
                    localStorage.removeItem(KEYS.SANTOS);
                    if (window.indexedDB) {
                        try {
                            const req = indexedDB.open('LH_Santos_DB', 2);
                            req.onsuccess = (e) => {
                                const db = e.target.result;
                                if (db.objectStoreNames.contains('catalogo')) {
                                    db.transaction('catalogo', 'readwrite').objectStore('catalogo').delete('santos');
                                }
                            };
                        } catch (_) {}
                    }
                    alert("✅ Caché de Santos limpiada con éxito.");
                    cloudSyncAPI.analizarDiferencias().catch(() => {});
                }
            } else if (tipo === 'antifonas') {
                if (confirm("¿Deseas limpiar la caché local de Antífonas?")) {
                    localStorage.removeItem(KEYS.ANTIFONAS);
                    alert("✅ Caché de Antífonas limpiada.");
                    cloudSyncAPI.analizarDiferencias().catch(() => {});
                }
            } else if (tipo === 'salterios') {
                if (confirm("¿Deseas limpiar las horas y salterios guardados localmente en este dispositivo?")) {
                    const keysBorrar = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const k = localStorage.key(i);
                        if (k && k.startsWith(KEYS.PREFIX_SALTERIO)) keysBorrar.push(k);
                    }
                    keysBorrar.forEach(k => localStorage.removeItem(k));
                    alert(`✅ Se eliminaron ${keysBorrar.length} salterios de la memoria local.`);
                    cloudSyncAPI.analizarDiferencias().catch(() => {});
                }
            } else if (tipo === 'app_cache') {
                if (confirm("¿Deseas limpiar la caché de archivos y Service Worker de la aplicación?")) {
                    if ('caches' in window) {
                        const cacheNames = await caches.keys();
                        await Promise.all(cacheNames.map(name => caches.delete(name)));
                    }
                    alert("✅ Caché de la aplicación web purgada. Los recursos se actualizarán.");
                }
            } else if (tipo === 'todo') {
                if (confirm("⚠️ ¿Deseas realizar una limpieza total de caché y datos litúrgicos locales? (Tu sesión de usuario se mantendrá intacta)")) {
                    localStorage.removeItem(KEYS.SANTOS);
                    localStorage.removeItem(KEYS.ANTIFONAS);
                    const keysBorrar = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const k = localStorage.key(i);
                        if (k && k.startsWith(KEYS.PREFIX_SALTERIO)) keysBorrar.push(k);
                    }
                    keysBorrar.forEach(k => localStorage.removeItem(k));
                    if ('caches' in window) {
                        const cacheNames = await caches.keys();
                        await Promise.all(cacheNames.map(name => caches.delete(name)));
                    }
                    alert("✅ Limpieza total completada. Puedes descargar todo fresco cuando desees con 'Actualizar'.");
                    cloudSyncAPI.analizarDiferencias().catch(() => {});
                }
            }
        },

        // =====================================================================
        // 6. FORZAR DESCARGA / SUBIDA COMPLETA
        // =====================================================================
        forzarDescargaCompleta: async function() {
            if (!confirm("⚠️ ATENCIÓN: Esta acción descargará TODO el catálogo desde Firebase Cloud y reemplazará lo que tengas en este celular. ¿Deseas continuar?")) {
                return;
            }
            try {
                const fb = window.firebaseAPI;
                if (!fb) throw new Error("Firebase API no disponible.");

                let count = 0;
                if (fb.cargarSantosFirestore) {
                    const santos = await fb.cargarSantosFirestore();
                    if (santos) {
                        setSantosLocales(santos);
                        count += santos.length;
                    }
                }
                if (fb.cargarAntifonasFirestore) {
                    const ant = await fb.cargarAntifonasFirestore();
                    if (ant) {
                        setAntifonasLocales(ant);
                        count += ant.length;
                    }
                }
                if (fb.cargarTodosSalteriosFirestore) {
                    const salterios = await fb.cargarTodosSalteriosFirestore();
                    if (salterios) {
                        salterios.forEach(s => {
                            if (s.id) localStorage.setItem(KEYS.PREFIX_SALTERIO + s.id, JSON.stringify(s));
                        });
                        count += salterios.length;
                    }
                }
                alert(`✅ Descarga completa finalizada: ${count} registros restaurados directamente desde Firebase.`);
                cloudSyncAPI.analizarDiferencias().catch(() => {});
            } catch (e) {
                alert(`❌ Error al forzar descarga: ${e.message}`);
            }
        },

        forzarSubidaCompleta: async function() {
            const auth = cloudSyncAPI.getUsuarioAuth();
            if (!auth.isAdmin) {
                alert("⛔ Solo los administradores pueden forzar la subida completa de todo el catálogo a Firebase.");
                return;
            }
            if (!confirm("⚠️ ¿Deseas subir TODO el contenido local de tu celular a Firebase Cloud Firestore?")) {
                return;
            }
            try {
                const fb = window.firebaseAPI;
                let subidos = 0;

                const santos = await getSantosLocalesAsync();
                if (santos.length > 0 && fb.guardarSantosFirestore) {
                    await fb.guardarSantosFirestore(santos);
                    subidos += santos.length;
                }
                const ant = getAntifonasLocales();
                if (ant.length > 0 && fb.guardarLoteAntifonasFirestore) {
                    await fb.guardarLoteAntifonasFirestore(ant);
                    subidos += ant.length;
                }
                const salterios = getSalteriosLocales();
                if (salterios.length > 0 && fb.guardarSalterioFirestore) {
                    for (const s of salterios) {
                        await fb.guardarSalterioFirestore(s.id, s);
                    }
                    subidos += salterios.length;
                }
                alert(`🎉 ¡Subida completa exitosa! Se sincronizaron ${subidos} elementos en Firebase Cloud.`);
                cloudSyncAPI.analizarDiferencias().catch(() => {});
            } catch (e) {
                alert(`❌ Error en subida completa: ${e.message}`);
            }
        },

        // =====================================================================
        // 7. RESPALDOS JSON (EXPORTAR / IMPORTAR)
        // =====================================================================
        exportarBackupJSON: function() {
            const data = {
                version: '1.0',
                exportado: new Date().toISOString(),
                santos: getSantosLocales(),
                antifonas: getAntifonasLocales(),
                salterios: getSalteriosLocales(),
                ajustes: {
                    lang: localStorage.getItem('pref-lang'),
                    advientoParImpar: localStorage.getItem('pref-adviento-par-impar'),
                    columnasOcultas: localStorage.getItem(KEYS.COLUMNAS_SANTOS_OCULTAS)
                }
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const fecha = new Date().toISOString().split('T')[0];
            a.href = url;
            a.download = `liturgia-respaldo-${fecha}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        importarBackupJSON: function(fileInput) {
            if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    if (!parsed || typeof parsed !== 'object') throw new Error("Archivo JSON no válido.");
                    let items = 0;
                    if (Array.isArray(parsed.santos)) {
                        setSantosLocales(parsed.santos);
                        items += parsed.santos.length;
                    }
                    if (Array.isArray(parsed.antifonas)) {
                        setAntifonasLocales(parsed.antifonas);
                        items += parsed.antifonas.length;
                    }
                    if (Array.isArray(parsed.salterios)) {
                        parsed.salterios.forEach(s => {
                            if (s.id) setSalterioLocal(s.id, s);
                        });
                        items += parsed.salterios.length;
                    }
                    alert(`✅ Respaldo restaurado con éxito. Se importaron ${items} elementos a tu dispositivo.`);
                    cloudSyncAPI.analizarDiferencias().catch(() => {});
                } catch (err) {
                    alert(`❌ Error al importar archivo: ${err.message}`);
                }
            };
            reader.readAsText(file);
        },

        // =====================================================================
        // 8. RENDERIZADO DEL DASHBOARD UI DE CLOUD
        // =====================================================================
        renderUI: function() {
            const auth = cloudSyncAPI.getUsuarioAuth();
            const ultimoSync = localStorage.getItem(KEYS.ULTIMO_SYNC);
            const fechaSyncTexto = ultimoSync ? new Date(ultimoSync).toLocaleString() : 'No registrado';
            const diff = window._ultimoDiffCloud || null;

            const badgeClase = (val) => {
                if (val === 0) return 'cloud-badge-ok';
                return 'cloud-badge-pending';
            };

            return `
            <div class="cloud-dashboard-container">
                <!-- Tarjeta de Estado y Autenticación -->
                <div class="cloud-card cloud-card-header">
                    <div class="cloud-header-top">
                        <div class="cloud-header-title">
                            <span class="material-symbols-outlined cloud-icon-main">cloud_sync</span>
                            <div>
                                <h3 style="margin:0; font-size:1.15rem; font-weight:700;">Sincronización Cloud & Caché</h3>
                                <p style="margin:2px 0 0; font-size:0.8rem; opacity:0.8;">Almacenamiento Local Offline-First con Firebase Cloud</p>
                            </div>
                        </div>
                        <div class="cloud-online-pill ${navigator.onLine ? 'online' : 'offline'}">
                            <span class="cloud-dot"></span>
                            <span>${navigator.onLine ? 'En línea' : 'Sin conexión'}</span>
                        </div>
                    </div>

                    <div class="cloud-user-bar">
                        <div class="cloud-user-info">
                            <span class="material-symbols-outlined" style="font-size:20px;">account_circle</span>
                            <span><strong>Usuario:</strong> ${auth.email}</span>
                            ${auth.isAdmin ? '<span class="cloud-tag-admin">ADMIN</span>' : ''}
                        </div>
                        <div class="cloud-user-actions">
                            ${auth.autenticado ? `
                                <button type="button" class="btn-cloud-sm" onclick="window.firebaseAPI?.logout?.().then(() => window.cloudSyncAPI.actualizarUICloudTab())">
                                    Cerrar sesión
                                </button>
                            ` : `
                                <button type="button" class="btn-cloud-sm btn-cloud-login" onclick="window.firebaseAPI?.login?.().then(() => window.cloudSyncAPI.actualizarUICloudTab())">
                                    <span class="material-symbols-outlined" style="font-size:16px;">login</span> Iniciar sesión
                                </button>
                            `}
                        </div>
                    </div>

                    <div class="cloud-banner-offline">
                        <span class="material-symbols-outlined" style="font-size:18px; color:#10b981;">smartphone</span>
                        <span><strong>Modo Celular Activo:</strong> Todo el contenido se guarda en tu dispositivo. Solo se descargan de Firebase los cambios o novedades pendientes para ahorrar datos y batería.</span>
                    </div>
                </div>

                <!-- Tarjeta de Comparativa Local vs Firebase -->
                <div class="cloud-card">
                    <div class="cloud-section-header">
                        <div>
                            <h4 style="margin:0; font-size:0.98rem; font-weight:700;">📊 Comparativa de Contenido (Local vs Firebase)</h4>
                            <span style="font-size:0.78rem; opacity:0.75;">Último chequeo: ${fechaSyncTexto}</span>
                        </div>
                        <button type="button" id="btn-cloud-analizar-diff" class="btn-cloud-action btn-cloud-refresh" onclick="window.cloudSyncAPI.ejecutarAnalisisUI()">
                            <span class="material-symbols-outlined" style="font-size:18px;">sync_alt</span>
                            <span>Revisar Diferencias</span>
                        </button>
                    </div>

                    <!-- Tabla de Métricas -->
                    <div class="cloud-metrics-table-wrapper">
                        <table class="cloud-metrics-table">
                            <thead>
                                <tr>
                                    <th>Contenido</th>
                                    <th>📱 Celular</th>
                                    <th>☁️ Firebase</th>
                                    <th>⬇️ Falta Local</th>
                                    <th>⬆️ Pendiente Subir</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>😇 Santos y Fiestas</strong></td>
                                    <td id="cloud-cell-santos-local">${diff ? diff.santos.localTotal : '--'}</td>
                                    <td id="cloud-cell-santos-cloud">${diff ? diff.santos.cloudTotal : '--'}</td>
                                    <td><span id="cloud-cell-santos-falta" class="cloud-badge ${diff ? badgeClase(diff.santos.faltanLocal.length) : ''}">${diff ? diff.santos.faltanLocal.length : '--'}</span></td>
                                    <td><span id="cloud-cell-santos-subir" class="cloud-badge ${diff ? badgeClase(diff.santos.pendientesSubir.length) : ''}">${diff ? diff.santos.pendientesSubir.length : '--'}</span></td>
                                    <td id="cloud-cell-santos-status">${diff ? (diff.santos.faltanLocal.length === 0 && diff.santos.pendientesSubir.length === 0 ? '🟢 Al día' : '🟡 Diferencias') : 'Pendiente revisión'}</td>
                                </tr>
                                <tr>
                                    <td><strong>📜 Antífonas</strong></td>
                                    <td id="cloud-cell-ant-local">${diff ? diff.antifonas.localTotal : '--'}</td>
                                    <td id="cloud-cell-ant-cloud">${diff ? diff.antifonas.cloudTotal : '--'}</td>
                                    <td><span id="cloud-cell-ant-falta" class="cloud-badge ${diff ? badgeClase(diff.antifonas.faltanLocal.length) : ''}">${diff ? diff.antifonas.faltanLocal.length : '--'}</span></td>
                                    <td><span id="cloud-cell-ant-subir" class="cloud-badge ${diff ? badgeClase(diff.antifonas.pendientesSubir.length) : ''}">${diff ? diff.antifonas.pendientesSubir.length : '--'}</span></td>
                                    <td id="cloud-cell-ant-status">${diff ? (diff.antifonas.faltanLocal.length === 0 && diff.antifonas.pendientesSubir.length === 0 ? '🟢 Al día' : '🟡 Diferencias') : 'Pendiente revisión'}</td>
                                </tr>
                                <tr>
                                    <td><strong>📖 Horas / Salterios</strong></td>
                                    <td id="cloud-cell-salt-local">${diff ? diff.salterios.localTotal : '--'}</td>
                                    <td id="cloud-cell-salt-cloud">${diff ? diff.salterios.cloudTotal : '--'}</td>
                                    <td><span id="cloud-cell-salt-falta" class="cloud-badge ${diff ? badgeClase(diff.salterios.faltanLocal.length) : ''}">${diff ? diff.salterios.faltanLocal.length : '--'}</span></td>
                                    <td><span id="cloud-cell-salt-subir" class="cloud-badge ${diff ? badgeClase(diff.salterios.pendientesSubir.length) : ''}">${diff ? diff.salterios.pendientesSubir.length : '--'}</span></td>
                                    <td id="cloud-cell-salt-status">${diff ? (diff.salterios.faltanLocal.length === 0 && diff.salterios.pendientesSubir.length === 0 ? '🟢 Al día' : '🟡 Diferencias') : 'Pendiente revisión'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Panel de Detalles de Diferencias (Expandible) -->
                    <div id="cloud-diff-details-panel" class="cloud-diff-details" style="${diff ? 'display:block;' : 'display:none;'}">
                        <div id="cloud-diff-details-content">
                            ${diff ? cloudSyncAPI.generarHtmlDetallesDiff(diff) : ''}
                        </div>
                    </div>
                </div>

                <!-- Botones de Acción de Sincronización -->
                <div class="cloud-card">
                    <h4 style="margin:0 0 12px 0; font-size:0.98rem; font-weight:700;">⚡ Acciones de Sincronización</h4>
                    <div class="cloud-actions-grid">
                        <button type="button" class="btn-cloud-grid btn-cloud-descargar" onclick="window.cloudSyncAPI.descargarFaltantesDeCloud()">
                            <span class="material-symbols-outlined">download_for_offline</span>
                            <div>
                                <strong>Actualizar (Descargar Faltantes)</strong>
                                <small>Solo baja novedades de Firebase al celular</small>
                            </div>
                        </button>

                        <button type="button" class="btn-cloud-grid btn-cloud-subir" onclick="window.cloudSyncAPI.subirContenidoPendienteACloud()">
                            <span class="material-symbols-outlined">cloud_upload</span>
                            <div>
                                <strong>Cargar Contenido Pendiente</strong>
                                <small>Sube a Firebase lo nuevo o editado localmente</small>
                            </div>
                        </button>

                        <button type="button" class="btn-cloud-grid btn-cloud-sync-total" onclick="window.cloudSyncAPI.sincronizarBidireccional()">
                            <span class="material-symbols-outlined">published_with_changes</span>
                            <div>
                                <strong>Sincronización Total</strong>
                                <small>Subida y descarga combinadas en un paso</small>
                            </div>
                        </button>

                        <button type="button" class="btn-cloud-grid btn-cloud-limpiar" onclick="window.cloudSyncAPI.limpiarCacheLocal('menu')">
                            <span class="material-symbols-outlined">delete_sweep</span>
                            <div>
                                <strong>Limpiar Caché Local</strong>
                                <small>Libera memoria o renueva datos locales</small>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Opciones Avanzadas y Respaldos -->
                <div class="cloud-card cloud-card-avanzada">
                    <div style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="window.cloudSyncAPI.toggleAvanzado()">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="material-symbols-outlined" style="font-size:20px; color:#f59e0b;">build</span>
                            <strong style="font-size:0.92rem;">Opciones Avanzadas y Respaldos</strong>
                        </div>
                        <span id="cloud-icon-toggle-avanzado" class="material-symbols-outlined">expand_more</span>
                    </div>

                    <div id="cloud-panel-avanzado" style="display:none; margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.1);">
                        <div class="cloud-advanced-grid">
                            <button type="button" class="btn-cloud-adv" onclick="window.cloudSyncAPI.forzarDescargaCompleta()">
                                <span class="material-symbols-outlined" style="color:#38bdf8;">cloud_download</span>
                                <div>
                                    <strong>Forzar Descarga Completa</strong>
                                    <span>Sobreescribe todo el celular con Firebase</span>
                                </div>
                            </button>

                            <button type="button" class="btn-cloud-adv" onclick="window.cloudSyncAPI.forzarSubidaCompleta()">
                                <span class="material-symbols-outlined" style="color:#ec4899;">upload</span>
                                <div>
                                    <strong>Forzar Subida Completa</strong>
                                    <span>Sube todo el catálogo local a Firebase (Admin)</span>
                                </div>
                            </button>

                            <button type="button" class="btn-cloud-adv" onclick="window.cloudSyncAPI.exportarBackupJSON()">
                                <span class="material-symbols-outlined" style="color:#10b981;">save_alt</span>
                                <div>
                                    <strong>Exportar Respaldo Local (JSON)</strong>
                                    <span>Guarda archivo físico en tu celular/PC</span>
                                </div>
                            </button>

                            <label class="btn-cloud-adv" style="cursor:pointer; margin:0;">
                                <input type="file" accept=".json" style="display:none;" onchange="window.cloudSyncAPI.importarBackupJSON(this)">
                                <span class="material-symbols-outlined" style="color:#a855f7;">restore_page</span>
                                <div>
                                    <strong>Importar Respaldo (.json)</strong>
                                    <span>Restaura catálogo desde archivo</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            `;
        },

        // =====================================================================
        // 9. HELPERS UI
        // =====================================================================
        toggleAvanzado: function() {
            const p = document.getElementById('cloud-panel-avanzado');
            const ico = document.getElementById('cloud-icon-toggle-avanzado');
            if (p) {
                const visible = p.style.display !== 'none';
                p.style.display = visible ? 'none' : 'block';
                if (ico) ico.textContent = visible ? 'expand_more' : 'expand_less';
            }
        },

        actualizarUICloudTab: function() {
            const tabEl = document.getElementById('tab-cloud');
            if (tabEl) {
                tabEl.innerHTML = cloudSyncAPI.renderUI();
            }
        },

        ejecutarAnalisisUI: async function() {
            const btn = document.getElementById('btn-cloud-analizar-diff');
            if (btn) {
                btn.innerHTML = `<span class="material-symbols-outlined spin-fast">sync</span> <span>Analizando...</span>`;
                btn.disabled = true;
            }
            try {
                const diff = await cloudSyncAPI.analizarDiferencias();
                cloudSyncAPI.actualizarUICloudTab();
            } catch (err) {
                alert(`Error al analizar diferencias: ${err.message}`);
                if (btn) {
                    btn.innerHTML = `<span class="material-symbols-outlined">sync_alt</span> <span>Revisar Diferencias</span>`;
                    btn.disabled = false;
                }
            }
        },

        actualizarUIConDiff: function(diff) {
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val;
            };
            const setBadge = (id, count) => {
                const el = document.getElementById(id);
                if (el) {
                    el.textContent = count;
                    el.className = 'cloud-badge ' + (count === 0 ? 'cloud-badge-ok' : 'cloud-badge-pending');
                }
            };

            setVal('cloud-cell-santos-local', diff.santos.localTotal);
            setVal('cloud-cell-santos-cloud', diff.santos.cloudTotal);
            setBadge('cloud-cell-santos-falta', diff.santos.faltanLocal.length);
            setBadge('cloud-cell-santos-subir', diff.santos.pendientesSubir.length);
            setVal('cloud-cell-santos-status', (diff.santos.faltanLocal.length === 0 && diff.santos.pendientesSubir.length === 0) ? '🟢 Al día' : '🟡 Diferencias');

            setVal('cloud-cell-ant-local', diff.antifonas.localTotal);
            setVal('cloud-cell-ant-cloud', diff.antifonas.cloudTotal);
            setBadge('cloud-cell-ant-falta', diff.antifonas.faltanLocal.length);
            setBadge('cloud-cell-ant-subir', diff.antifonas.pendientesSubir.length);
            setVal('cloud-cell-ant-status', (diff.antifonas.faltanLocal.length === 0 && diff.antifonas.pendientesSubir.length === 0) ? '🟢 Al día' : '🟡 Diferencias');

            setVal('cloud-cell-salt-local', diff.salterios.localTotal);
            setVal('cloud-cell-salt-cloud', diff.salterios.cloudTotal);
            setBadge('cloud-cell-salt-falta', diff.salterios.faltanLocal.length);
            setBadge('cloud-cell-salt-subir', diff.salterios.pendientesSubir.length);
            setVal('cloud-cell-salt-status', (diff.salterios.faltanLocal.length === 0 && diff.salterios.pendientesSubir.length === 0) ? '🟢 Al día' : '🟡 Diferencias');

            const container = document.getElementById('cloud-diff-details-panel');
            const content = document.getElementById('cloud-diff-details-content');
            if (container && content) {
                container.style.display = 'block';
                content.innerHTML = cloudSyncAPI.generarHtmlDetallesDiff(diff);
            }
        },

        generarHtmlDetallesDiff: function(diff) {
            const renderLista = (items, tipo) => {
                if (!items || items.length === 0) return '<em style="color:#94a3b8; font-size:0.8rem;">Ninguno</em>';
                const nombres = items.slice(0, 15).map(it => {
                    const txt = it.nombre || it.texto || it.id || 'Registro';
                    return `<span class="cloud-diff-chip">${txt.length > 30 ? txt.substring(0, 27) + '...' : txt}</span>`;
                }).join(' ');
                const extra = items.length > 15 ? `<small style="color:#94a3b8;">(+${items.length - 15} más)</small>` : '';
                return `<div class="cloud-chips-box">${nombres} ${extra}</div>`;
            };

            const tieneDiferencias = (
                diff.santos.faltanLocal.length > 0 || diff.santos.pendientesSubir.length > 0 ||
                diff.antifonas.faltanLocal.length > 0 || diff.antifonas.pendientesSubir.length > 0 ||
                diff.salterios.faltanLocal.length > 0 || diff.salterios.pendientesSubir.length > 0
            );

            if (!tieneDiferencias) {
                return `
                    <div style="padding:10px 14px; background:rgba(16, 185, 129, 0.12); border:1px solid rgba(16, 185, 129, 0.3); border-radius:8px; color:#10b981; font-size:0.85rem; display:flex; align-items:center; gap:8px;">
                        <span class="material-symbols-outlined" style="font-size:20px;">verified</span>
                        <span><strong>¡Todo sincronizado!</strong> El contenido de tu celular es idéntico al de Firebase Cloud.</span>
                    </div>
                `;
            }

            return `
                <div style="font-size:0.84rem; margin-top:8px;">
                    <div style="font-weight:700; margin-bottom:6px; color:#38bdf8;">Detalle de diferencias detectadas:</div>
                    ${diff.santos.faltanLocal.length > 0 ? `
                        <div class="cloud-diff-row">
                            <span class="cloud-label-diff">Santos en Cloud que faltan en tu celular (${diff.santos.faltanLocal.length}):</span>
                            ${renderLista(diff.santos.faltanLocal, 'santos')}
                        </div>
                    ` : ''}
                    ${diff.santos.pendientesSubir.length > 0 ? `
                        <div class="cloud-diff-row">
                            <span class="cloud-label-diff">Santos en tu celular pendientes de subir a Cloud (${diff.santos.pendientesSubir.length}):</span>
                            ${renderLista(diff.santos.pendientesSubir, 'santos')}
                        </div>
                    ` : ''}
                    ${diff.antifonas.faltanLocal.length > 0 ? `
                        <div class="cloud-diff-row">
                            <span class="cloud-label-diff">Antífonas en Cloud que faltan en tu celular (${diff.antifonas.faltanLocal.length}):</span>
                            ${renderLista(diff.antifonas.faltanLocal, 'antifonas')}
                        </div>
                    ` : ''}
                    ${diff.antifonas.pendientesSubir.length > 0 ? `
                        <div class="cloud-diff-row">
                            <span class="cloud-label-diff">Antífonas en tu celular pendientes de subir (${diff.antifonas.pendientesSubir.length}):</span>
                            ${renderLista(diff.antifonas.pendientesSubir, 'antifonas')}
                        </div>
                    ` : ''}
                    ${diff.salterios.faltanLocal.length > 0 ? `
                        <div class="cloud-diff-row">
                            <span class="cloud-label-diff">Salterios / Horas en Cloud que faltan localmente (${diff.salterios.faltanLocal.length}):</span>
                            ${renderLista(diff.salterios.faltanLocal, 'salterios')}
                        </div>
                    ` : ''}
                    ${diff.salterios.pendientesSubir.length > 0 ? `
                        <div class="cloud-diff-row">
                            <span class="cloud-label-diff">Salterios locales pendientes de subir (${diff.salterios.pendientesSubir.length}):</span>
                            ${renderLista(diff.salterios.pendientesSubir, 'salterios')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
    };

    // Exponer globalmente
    window.cloudSyncAPI = cloudSyncAPI;
    window.renderModuloCloudSync = cloudSyncAPI.renderUI;

    console.log("☁️ [Cloud-Sync] Motor de sincronización offline-first cargado correctamente.");

})(typeof window !== 'undefined' ? window : this);
