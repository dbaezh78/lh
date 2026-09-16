/**
 * src/js/accesscontrol.js - Control de Acceso y Gestión de Usuarios (RBAC / Jerarquía)
 * Proyecto: Liturgia de las Horas (lh)
 */

export const ADMIN_EMAIL = "dbaezh78@gmail.com";

// Lista Completa y Jerárquica de Permisos Disponibles en Liturgia de las Horas
export const PERMISSIONS = {
  ALL: "*",
  MANAGE_ACCESS: "manage_access",

  // PÁGINAS DEL SISTEMA (VER)
  PAGE_INICIO: "page_inicio",

  // 1. CAMBIO LITÚRGICO (form_etiempo.html)
  PAGE_CAMBIO_LITURGICO: "page_cambio_liturgico",
  CAMBIO_LITURGICO_GUARDAR: "cambio_liturgico_guardar",
  CAMBIO_LITURGICO_AGREGAR_TABLA: "cambio_liturgico_agregar_tabla",
  CAMBIO_LITURGICO_RESTABLECER: "cambio_liturgico_restablecer",
  CAMBIO_LITURGICO_CAMBIAR_FECHA: "cambio_liturgico_cambiar_fecha",
  CAMBIO_LITURGICO_BORRAR: "cambio_liturgico_borrar",
  CAMBIO_LITURGICO_EDITAR: "cambio_liturgico_editar",

  // 2. AÑO LITÚRGICO (añoliturgico.html)
  PAGE_ANO_LITURGICO: "page_ano_liturgico",
  ANO_LITURGICO_GUARDAR: "ano_liturgico_guardar",
  ANO_LITURGICO_CAMBIAR_FECHA: "ano_liturgico_cambiar_fecha",
  ANO_LITURGICO_EDITAR_URL: "ano_liturgico_editar_url",

  // 3. DATOS Y AÑOS (datos.html)
  PAGE_DATOS_ANIOS: "page_datos_anios",
  DATOS_CATEGORIA: "datos_categoria",
  DATOS_AGREGAR_DIAGNOSTICAR: "datos_agregar_diagnosticar",
  DATOS_AGREGAR_ANIO: "datos_agregar_anio",
  DATOS_PROXIMO_ANIO: "datos_proximo_anio",
  DATOS_CARGAR_BISIESTOS: "datos_cargar_bisiestos",
  DATOS_RESTABLECER: "datos_restablecer",
  DATOS_BORRAR: "datos_borrar",

  // 4. SANTOS DE LA IGLESIA CATÓLICA (santo.html)
  PAGE_SANTOS_IGLESIA: "page_santos_iglesia",
  SANTOS_SUBIR_FIREBASE: "santos_subir_firebase",
  SANTOS_CREAR_EDITAR: "santos_crear_editar",
  SANTOS_NOMBRE_SELECT: "santos_nombre_select",

  // 5. REGISTRO DEL SANTO (nombresanto.html)
  PAGE_REGISTRO_SANTO: "page_registro_santo",
  REGISTRO_AGREGAR_NUEVO: "registro_agregar_nuevo",
  REGISTRO_AGREGAR_NOMBRE: "registro_agregar_nombre",
  REGISTRO_GUARDAR: "registro_guardar",
  REGISTRO_IMPORTAR_CSV: "registro_importar_csv",
  REGISTRO_EXPORTAR_CSV: "registro_exportar_csv",
  REGISTRO_SINCRONIZAR_FIREBASE: "registro_sincronizar_firebase",
  REGISTRO_EDITAR: "registro_editar",
  REGISTRO_ELIMINAR: "registro_eliminar",
  REGISTRO_ORDENAR: "registro_ordenar",
  REGISTRO_COLUMNAS_VISIBILIDAD: "registro_columnas_visibilidad",

  // 6. CONTROL DE ACCESO (aCtrl.html)
  PAGE_ACTRL: "page_actrl",
  ACTRL_MIEMBROS: "actrl_miembros",
  ACTRL_GRUPOS: "actrl_grupos",
  ACTRL_PERMISOS: "actrl_permisos",
  ACTRL_INSPECTOR: "actrl_inspector",

  // 7. AJUSTES DEL SISTEMA
  VIEW_SETTINGS_GENERAL: "view_settings_general",
  VIEW_SETTINGS_THEME: "view_settings_theme",
  VIEW_SETTINGS_TTS: "view_settings_tts",
  
  // 8. AJUSTES: COLUMNAS SANTOS
  VIEW_SETTINGS_SANTOS: "view_settings_santos",
  SETTINGS_SANTOS_VISIBILIDAD: "settings_santos_visibilidad",
  SETTINGS_SANTOS_MOSTRAR_TODAS: "settings_santos_mostrar_todas",
  SETTINGS_SANTOS_RESET_ANCHOS: "settings_santos_reset_anchos",
  SETTINGS_SANTOS_SYNC_FIREBASE: "settings_santos_sync_firebase",

  // 9. AJUSTES: CALENDARIO LITÚRGICO
  VIEW_SETTINGS_CALENDARIO: "view_settings_calendario",
  SETTINGS_CALENDARIO_ADVIENTO: "settings_calendario_adviento",

  // 10. HISTORIAL DE ACTUALIZACIONES (ver.html)
  PAGE_VER: "page_ver",
  VER_EDITAR: "ver_editar",

  // 11. ARCHIVOS DEL SISTEMA (system.html)
  PAGE_SYSTEM: "page_system",
  SYSTEM_GESTIONAR: "system_gestionar"
};

// Árbol jerárquico anidado para la interfaz visual
export const PERMISSION_TREE = [
  { key: "*", label: "Acceso Total (* / Administrador)" },

  // 0. Inicio
  {
    key: "group_inicio",
    label: "Página: Inicio",
    children: [
      { key: "page_inicio", label: "Ver página" }
    ]
  },

  // 1. Cambio Litúrgico
  {
    key: "group_cambio_liturgico",
    label: "Página: Cambio litúrgico",
    children: [
      { key: "page_cambio_liturgico", label: "Ver página" },
      { key: "cambio_liturgico_guardar", label: "Guardar cambios" },
      { key: "cambio_liturgico_agregar_tabla", label: "Agregar Tabla" },
      { key: "cambio_liturgico_restablecer", label: "Restablecer valores originales" },
      { key: "cambio_liturgico_cambiar_fecha", label: "Cambiar fecha" },
      { key: "cambio_liturgico_borrar", label: "Borrar" },
      { key: "cambio_liturgico_editar", label: "Editar" }
    ]
  },

  // 2. Año Litúrgico
  {
    key: "group_ano_liturgico",
    label: "Página: Año Litúrgico",
    children: [
      { key: "page_ano_liturgico", label: "Ver página" },
      { key: "ano_liturgico_guardar", label: "Guardar" },
      { key: "ano_liturgico_cambiar_fecha", label: "Cambiar fecha" },
      { key: "ano_liturgico_editar_url", label: "Editar URL" }
    ]
  },

  // 3. Datos y Años
  {
    key: "group_datos_anios",
    label: "Página: Datos y Años",
    children: [
      { key: "page_datos_anios", label: "Ver página" },
      { key: "datos_categoria", label: "Módulo / Categoría de Datos" },
      { key: "datos_agregar_diagnosticar", label: "Agregar y Diagnosticar Año" },
      { key: "datos_agregar_anio", label: "Agregar Año" },
      { key: "datos_proximo_anio", label: "Próximo Año" },
      { key: "datos_cargar_bisiestos", label: "Cargar Bisiestos" },
      { key: "datos_restablecer", label: "Restablecer por Defecto" },
      { key: "datos_borrar", label: "Borrar" }
    ]
  },

  // 4. Santos de la Iglesia Católica
  {
    key: "group_santos_iglesia",
    label: "Página: Santos de la Iglesia Católica",
    children: [
      { key: "page_santos_iglesia", label: "Ver página" },
      { key: "santos_subir_firebase", label: "Subir a Firebase" },
      { key: "santos_crear_editar", label: "Crear / Editar Santo" },
      { key: "santos_nombre_select", label: "Nombre del Santo (Select interactivo)" }
    ]
  },

  // 5. Registro del Santo
  {
    key: "group_registro_santo",
    label: "Página: Registro del Santo",
    children: [
      { key: "page_registro_santo", label: "Ver página" },
      { key: "registro_agregar_nuevo", label: "Agregar nuevo santo" },
      { key: "registro_agregar_nombre", label: "Agregar Nombre" },
      { key: "registro_guardar", label: "Guardar Santo" },
      { key: "registro_importar_csv", label: "Importar Archivo CSV" },
      { key: "registro_exportar_csv", label: "Exportar / descargar CSV" },
      { key: "registro_sincronizar_firebase", label: "Sincronizar / Subir a Firebase" },
      { key: "registro_editar", label: "Editar el registro del santo" },
      { key: "registro_eliminar", label: "Eliminar el registro del santo" },
      { key: "registro_ordenar", label: "Ordenar columnas" },
      { key: "registro_columnas_visibilidad", label: "Mostrar u ocultar columnas" }
    ]
  },

  // 6. Control de Acceso
  {
    key: "group_actrl",
    label: "Página: Control de Acceso (aCtrl)",
    children: [
      { key: "page_actrl", label: "Ver página" },
      { key: "actrl_miembros", label: "Gestión de Miembros" },
      { key: "actrl_grupos", label: "Crear y Gestionar Grupos" },
      { key: "actrl_permisos", label: "Asignación de Permisos" },
      { key: "actrl_inspector", label: "Inspector de Permisos" }
    ]
  },

  // 7. Ajustes
  {
    key: "group_ajustes",
    label: "Página: Ajustes",
    children: [
      { key: "view_settings_general", label: "Ver página" },
      { key: "view_settings_theme", label: "Tema y Reproductores" },
      { key: "view_settings_tts", label: "Texto a Voz (TTS)" },
      {
        key: "group_settings_santos",
        label: "Columnas Santos",
        children: [
          { key: "view_settings_santos", label: "Ver página" },
          { key: "settings_santos_visibilidad", label: "Modificar Visibilidad de Columnas" },
          { key: "settings_santos_mostrar_todas", label: "Botón: Mostrar Todas las Columnas" },
          { key: "settings_santos_reset_anchos", label: "Botón: Restablecer Ancho de Columnas" },
          { key: "settings_santos_sync_firebase", label: "Botón: Guardar Columnas en Firebase" }
        ]
      },
      {
        key: "group_settings_calendario",
        label: "Calendario Litúrgico",
        children: [
          { key: "view_settings_calendario", label: "Ver página" },
          { key: "settings_calendario_adviento", label: "Configurar Adviento (Par/Impar)" }
        ]
      }
    ]
  },

  // 8. Historial de Actualizaciones (ver.html)
  {
    key: "group_ver_actualizaciones",
    label: "Página: Actualizaciones y Versiones",
    children: [
      { key: "page_ver", label: "Ver página" },
      { key: "ver_editar", label: "Crear y Editar Actualizaciones" }
    ]
  },

  // 9. Archivos del Sistema (system.html)
  {
    key: "group_archivos_sistema",
    label: "Página: Archivos del Sistema",
    children: [
      { key: "page_system", label: "Ver página" },
      { key: "system_gestionar", label: "Gestionar y Refrescar Archivos" }
    ]
  }
];

// Mapa plano de etiquetas para búsqueda e inspector
export const PERMISSION_LABELS = {};
function llenarLabels(nodes, parentPrefix = "") {
  nodes.forEach(n => {
    const fullLabel = parentPrefix ? `${parentPrefix} > ${n.label}` : n.label;
    PERMISSION_LABELS[n.key] = fullLabel;
    if (n.children) llenarLabels(n.children, n.label);
  });
}
llenarLabels(PERMISSION_TREE);

// Estado local
export const accessControlState = {
  groups: {},
  userDirectPermissions: {},
  userDirectGroups: {},
  registeredUsers: new Set(),
  registeredUserNames: {},
  registeredUserPhotos: {},
  bannedUsers: new Set()
};

const STORAGE_KEY = "lh_access_control";

/**
 * Inicializa grupos por defecto
 */
export function initAccessControl() {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      Object.keys(parsed.groups || {}).forEach(gid => {
        const g = parsed.groups[gid];
        accessControlState.groups[gid] = {
          ...g,
          userIds: new Set(g.userIds || []),
          subgroupIds: new Set(g.subgroupIds || []),
          permissions: new Set(g.permissions || [])
        };
      });
      Object.keys(parsed.userDirectPermissions || {}).forEach(uid => {
        accessControlState.userDirectPermissions[uid] = new Set(parsed.userDirectPermissions[uid] || []);
      });
      Object.keys(parsed.userDirectGroups || {}).forEach(uid => {
        accessControlState.userDirectGroups[uid] = new Set(parsed.userDirectGroups[uid] || []);
      });
      if (Array.isArray(parsed.registeredUsers)) {
        accessControlState.registeredUsers = new Set(parsed.registeredUsers);
      }
      if (parsed.registeredUserNames) {
        accessControlState.registeredUserNames = { ...parsed.registeredUserNames };
      }
      if (parsed.registeredUserPhotos) {
        accessControlState.registeredUserPhotos = { ...parsed.registeredUserPhotos };
      }
      if (Array.isArray(parsed.bannedUsers)) {
        accessControlState.bannedUsers = new Set(parsed.bannedUsers);
      }
      
      asegurarGruposBase();
      return;
    } catch (e) {
      console.warn("⚠️ Error cargando access control de localStorage:", e);
    }
  }

  crearGruposPorDefecto();
}

function crearGruposPorDefecto() {
  // 1. Administradores (Acceso Total)
  createGroup("administradores", "Administradores del Sistema", [PERMISSIONS.ALL], "Grupo con control total del sistema");
  
  // 2. Hermanos (grupo por defecto al autenticarse)
  // Incluye permisos de lectura y uso interactivo de todas las páginas y herramientas
  const permisosHermano = Object.values(PERMISSIONS).filter(p => p !== "*" && p !== "manage_access" && !p.startsWith("actrl_"));
  createGroup("hermanos", "Grupo General de Hermanos", permisosHermano, "Hermanos registrados y autenticados");

  // 3. Invitados (sin inicio de sesión: solo lectura básica)
  createGroup("invitados", "Usuarios Invitados", [
    PERMISSIONS.PAGE_CAMBIO_LITURGICO,
    PERMISSIONS.PAGE_ANO_LITURGICO,
    PERMISSIONS.PAGE_DATOS_ANIOS,
    PERMISSIONS.PAGE_SANTOS_IGLESIA,
    PERMISSIONS.PAGE_REGISTRO_SANTO,
    PERMISSIONS.PAGE_VER,
    PERMISSIONS.PAGE_SYSTEM,
    PERMISSIONS.VIEW_SETTINGS_GENERAL,
    PERMISSIONS.VIEW_SETTINGS_THEME,
    PERMISSIONS.VIEW_SETTINGS_TTS,
    PERMISSIONS.VIEW_SETTINGS_CALENDARIO
  ], "Usuarios visitantes sin inicio de sesión");

  // Asignar al admin principal por defecto
  setUserPrimaryGroup(ADMIN_EMAIL, "administradores");
  accessControlState.registeredUserNames[ADMIN_EMAIL] = "Carlos David Báez";
  saveAccessControl();
}

function asegurarGruposBase() {
  if (!accessControlState.groups["administradores"]) {
    createGroup("administradores", "Administradores del Sistema", [PERMISSIONS.ALL], "Grupo con control total del sistema");
  }
  if (!accessControlState.groups["hermanos"]) {
    const permisosHermano = Object.values(PERMISSIONS).filter(p => p !== "*" && p !== "manage_access" && !p.startsWith("actrl_"));
    createGroup("hermanos", "Grupo General de Hermanos", permisosHermano, "Hermanos registrados y autenticados");
  }
  if (!accessControlState.groups["invitados"]) {
    createGroup("invitados", "Usuarios Invitados", [
      PERMISSIONS.PAGE_CAMBIO_LITURGICO,
      PERMISSIONS.PAGE_ANO_LITURGICO,
      PERMISSIONS.PAGE_DATOS_ANIOS,
      PERMISSIONS.PAGE_SANTOS_IGLESIA,
      PERMISSIONS.PAGE_REGISTRO_SANTO
    ], "Usuarios visitantes sin inicio de sesión");
  }
  
  // Asegurar siempre a dbaezh78@gmail.com como administrador
  if (!accessControlState.groups["administradores"].userIds.has(ADMIN_EMAIL)) {
    setUserPrimaryGroup(ADMIN_EMAIL, "administradores");
  }
}

/**
 * Crea o actualiza un grupo
 */
export function createGroup(groupId, name, permissions = [], description = "") {
  const cleanId = (groupId || "").toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
  if (!cleanId) return null;

  if (!accessControlState.groups[cleanId]) {
    accessControlState.groups[cleanId] = {
      id: cleanId,
      name: name || cleanId,
      description: description || "",
      userIds: new Set(),
      subgroupIds: new Set(),
      permissions: new Set(permissions)
    };
  } else {
    if (name) accessControlState.groups[cleanId].name = name;
    if (description) accessControlState.groups[cleanId].description = description;
    if (permissions && permissions.length > 0) {
      permissions.forEach(p => accessControlState.groups[cleanId].permissions.add(p));
    }
  }

  saveAccessControl();
  saveGroupConfigToCloud();
  return accessControlState.groups[cleanId];
}

/**
 * Elimina un grupo
 */
export function deleteGroup(groupId) {
  const gid = (groupId || "").toLowerCase().trim();
  if (gid === "administradores" || gid === "hermanos" || gid === "invitados") {
    alert("No se pueden eliminar los grupos base del sistema.");
    return false;
  }

  if (accessControlState.groups[gid]) {
    accessControlState.groups[gid].userIds.forEach(uid => {
      setUserPrimaryGroup(uid, "hermanos");
    });

    delete accessControlState.groups[gid];

    Object.keys(accessControlState.groups).forEach(otherId => {
      accessControlState.groups[otherId].subgroupIds.delete(gid);
    });

    saveAccessControl();
    saveGroupConfigToCloud();
    return true;
  }
  return false;
}

/**
 * Asigna de forma EXCLUSIVA a un usuario su grupo primario
 */
/**
 * Asigna de forma EXCLUSIVA a un usuario su grupo primario
 */
export function setUserPrimaryGroup(userEmail, groupId, skipCloud = false) {
  if (!userEmail || !groupId) return;
  const uid = userEmail.toLowerCase().trim();
  const gid = groupId.toLowerCase().trim();

  if (uid === ADMIN_EMAIL && gid !== "administradores") {
    alert("El administrador principal siempre debe pertenecer a Administradores.");
    return;
  }

  Object.keys(accessControlState.groups).forEach(otherGid => {
    accessControlState.groups[otherGid].userIds.delete(uid);
  });

  if (!accessControlState.groups[gid]) {
    createGroup(gid, gid);
  }

  accessControlState.groups[gid].userIds.add(uid);
  accessControlState.registeredUsers.add(uid);
  accessControlState.userDirectGroups[uid] = new Set([gid]);

  saveAccessControl();

  // Guardar en Firestore automáticamente si no se ha omitido
  if (!skipCloud && window.firebaseAPI && window.firebaseAPI.db) {
    import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js").then(({ doc, setDoc }) => {
      const cleanDocId = uid.replace(/[^a-zA-Z0-9_-]/g, "_");
      setDoc(doc(window.firebaseAPI.db, "registered_users", cleanDocId), {
        email: uid,
        group: gid,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => {
        console.warn("⚠️ Error guardando grupo en Firestore:", err);
      });
    }).catch(err => console.warn(err));
  }
}

/**
 * Banea o desbanea a un usuario y sincroniza con Firestore
 */
export async function banUser(userEmail) {
  const uid = (userEmail || "").toLowerCase().trim();
  if (!uid || uid === ADMIN_EMAIL) return;
  accessControlState.bannedUsers.add(uid);
  saveAccessControl();

  if (window.firebaseAPI && window.firebaseAPI.db) {
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
      const cleanDocId = uid.replace(/[^a-zA-Z0-9_-]/g, "_");
      await setDoc(doc(window.firebaseAPI.db, "registered_users", cleanDocId), {
        banned: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("⚠️ Error baneando usuario en Firestore:", e);
    }
  }
}

export async function unbanUser(userEmail) {
  const uid = (userEmail || "").toLowerCase().trim();
  if (!uid) return;
  accessControlState.bannedUsers.delete(uid);
  saveAccessControl();

  if (window.firebaseAPI && window.firebaseAPI.db) {
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
      const cleanDocId = uid.replace(/[^a-zA-Z0-9_-]/g, "_");
      await setDoc(doc(window.firebaseAPI.db, "registered_users", cleanDocId), {
        banned: false,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("⚠️ Error desbaneando usuario en Firestore:", e);
    }
  }
}

/**
 * Elimina registro de usuario local y remotamente
 */
export async function deleteUserRegistration(userEmail) {
  const uid = (userEmail || "").toLowerCase().trim();
  if (!uid || uid === ADMIN_EMAIL) return;
  accessControlState.registeredUsers.delete(uid);
  delete accessControlState.registeredUserNames[uid];
  delete accessControlState.registeredUserPhotos[uid];
  accessControlState.bannedUsers.delete(uid);
  Object.keys(accessControlState.groups).forEach(gid => {
    accessControlState.groups[gid].userIds.delete(uid);
  });
  saveAccessControl();

  if (window.firebaseAPI && window.firebaseAPI.db) {
    try {
      const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
      const cleanDocId = uid.replace(/[^a-zA-Z0-9_-]/g, "_");
      await deleteDoc(doc(window.firebaseAPI.db, "registered_users", cleanDocId));
    } catch (e) {
      console.warn("⚠️ Error eliminando usuario en Firestore:", e);
    }
  }
}

/**
 * Registra o actualiza a un usuario que inicia sesión
 */
export async function registerUser(user) {
  if (!user || !user.email) return;
  const email = user.email.toLowerCase().trim();

  accessControlState.registeredUsers.add(email);
  if (user.displayName) accessControlState.registeredUserNames[email] = user.displayName;
  if (user.photoURL) accessControlState.registeredUserPhotos[email] = user.photoURL;

  let currentGroup = null;
  Object.keys(accessControlState.groups).forEach(gid => {
    if (accessControlState.groups[gid].userIds.has(email)) {
      currentGroup = gid;
    }
  });

  if (!currentGroup) {
    const targetGroup = (email === ADMIN_EMAIL) ? "administradores" : "hermanos";
    setUserPrimaryGroup(email, targetGroup);
    currentGroup = targetGroup;
  }

  saveAccessControl();

  // Optimización de cuota de Firebase: guardar solo una vez por sesión de navegación
  const sessionSyncKey = `lh_synced_user_${email}`;
  if (sessionStorage.getItem(sessionSyncKey)) {
    return; // Ya sincronizado en esta sesión, ahorra escrituras a Firestore
  }

  if (window.firebaseAPI && window.firebaseAPI.db) {
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
      const cleanDocId = email.replace(/[^a-zA-Z0-9_-]/g, "_");
      await setDoc(doc(window.firebaseAPI.db, "registered_users", cleanDocId), {
        email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        group: currentGroup,
        lastLogin: new Date().toISOString()
      }, { merge: true });
      sessionStorage.setItem(sessionSyncKey, "true");
    } catch (e) {
      console.warn("⚠️ No se pudo registrar usuario en Firestore:", e);
    }
  }
}

/**
 * Obtiene permisos efectivos recursivos
 */
export function getUserEffectivePermissions(userIdOrEmail) {
  let uid = (userIdOrEmail || "").toLowerCase().trim();
  if (!uid && typeof window !== 'undefined' && window.firebaseAPI?.getCurrentUser) {
    uid = (window.firebaseAPI.getCurrentUser()?.email || "").toLowerCase().trim();
  }

  const effective = new Set();

  if (!uid) {
    // Modo invitado sin autenticar
    const gInvitados = accessControlState.groups["invitados"];
    if (gInvitados) {
      gInvitados.permissions.forEach(p => effective.add(p));
    }
    return effective;
  }

  if (accessControlState.bannedUsers.has(uid)) {
    return effective;
  }

  if (uid === ADMIN_EMAIL) {
    effective.add(PERMISSIONS.ALL);
    return effective;
  }

  const visitedGroups = new Set();

  function collect(gid) {
    if (visitedGroups.has(gid)) return;
    visitedGroups.add(gid);
    const g = accessControlState.groups[gid];
    if (!g) return;
    g.permissions.forEach(p => effective.add(p));
    g.subgroupIds.forEach(sub => collect(sub));
  }

  Object.keys(accessControlState.groups).forEach(gid => {
    if (accessControlState.groups[gid].userIds.has(uid)) {
      collect(gid);
    }
  });

  return effective;
}

export function hasPermission(permissionKey, userEmail) {
  const perms = getUserEffectivePermissions(userEmail);
  return perms.has(PERMISSIONS.ALL) || perms.has(permissionKey);
}

export function canAccessPage(pageKey) {
  return hasPermission(pageKey);
}

/**
 * Guarda estado en localStorage
 */
export function saveAccessControl() {
  const serializable = {
    groups: {},
    userDirectPermissions: {},
    userDirectGroups: {},
    registeredUsers: Array.from(accessControlState.registeredUsers),
    registeredUserNames: accessControlState.registeredUserNames,
    registeredUserPhotos: accessControlState.registeredUserPhotos,
    bannedUsers: Array.from(accessControlState.bannedUsers)
  };

  Object.keys(accessControlState.groups).forEach(gid => {
    const g = accessControlState.groups[gid];
    serializable.groups[gid] = {
      id: g.id,
      name: g.name,
      description: g.description,
      userIds: Array.from(g.userIds),
      subgroupIds: Array.from(g.subgroupIds),
      permissions: Array.from(g.permissions)
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

/**
 * Sincroniza definición de grupos en Firestore
 */
export async function saveGroupConfigToCloud() {
  if (!window.firebaseAPI?.db) return;
  try {
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
    const serializableGroups = {};
    Object.keys(accessControlState.groups).forEach(gid => {
      const g = accessControlState.groups[gid];
      serializableGroups[gid] = {
        id: g.id,
        name: g.name,
        description: g.description,
        permissions: Array.from(g.permissions),
        subgroupIds: Array.from(g.subgroupIds)
      };
    });

    await setDoc(doc(window.firebaseAPI.db, "access_control", "groups_config"), {
      groups: serializableGroups,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("☁️ [Firebase] Configuración de grupos guardada en Firestore.");
  } catch (err) {
    console.warn("⚠️ Error guardando grupos en Firestore:", err);
  }
}

/**
 * Sincroniza usuarios registrados desde Firebase
 */
export async function syncRegisteredUsersFromFirebase() {
  if (!window.firebaseAPI?.db) return;
  try {
    const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
    const snap = await getDocs(collection(window.firebaseAPI.db, "registered_users"));
    snap.forEach(docSnap => {
      const d = docSnap.data();
      if (d && d.email && !d.deleted) {
        const em = d.email.toLowerCase().trim();
        accessControlState.registeredUsers.add(em);
        if (d.displayName) accessControlState.registeredUserNames[em] = d.displayName;
        if (d.photoURL) accessControlState.registeredUserPhotos[em] = d.photoURL;
        if (d.group) setUserPrimaryGroup(em, d.group, true);
        if (d.banned) accessControlState.bannedUsers.add(em);
        else accessControlState.bannedUsers.delete(em);
      }
    });
    saveAccessControl();
  } catch (err) {
    console.warn("⚠️ Error sincronizando usuarios de Firebase:", err);
  }
}

// =========================================================================
// SINCRONIZACIÓN EN TIEMPO REAL (ONSNAPSHOT) CON FIREBASE FIRESTORE
// =========================================================================
let unsubGroupsListener = null;
let unsubUsersListener = null;

export async function iniciarSincronizacionEnTiempoRealFirebase() {
  if (!window.firebaseAPI?.db) {
    setTimeout(iniciarSincronizacionEnTiempoRealFirebase, 800);
    return;
  }

  try {
    const { doc, collection, onSnapshot } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");

    // 1. Escuchar grupos y permisos en vivo
    if (!unsubGroupsListener) {
      const groupDocRef = doc(window.firebaseAPI.db, "access_control", "groups_config");
      unsubGroupsListener = onSnapshot(groupDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.groups) {
            console.log("⚡ [Firebase RT] Grupos y permisos actualizados en directo desde la nube.");
            Object.keys(data.groups).forEach(gid => {
              const remote = data.groups[gid];
              if (!accessControlState.groups[gid]) {
                accessControlState.groups[gid] = {
                  id: remote.id || gid,
                  name: remote.name || gid,
                  description: remote.description || "",
                  userIds: new Set(),
                  subgroupIds: new Set(remote.subgroupIds || []),
                  permissions: new Set(remote.permissions || [])
                };
              } else {
                accessControlState.groups[gid].name = remote.name || accessControlState.groups[gid].name;
                accessControlState.groups[gid].description = remote.description || accessControlState.groups[gid].description;
                accessControlState.groups[gid].permissions = new Set(remote.permissions || []);
                accessControlState.groups[gid].subgroupIds = new Set(remote.subgroupIds || []);
              }
            });
            saveAccessControl();
            window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
          }
        }
      }, err => console.warn("Aviso listener grupos Firestore:", err.message));
    }

    // 2. Escuchar usuarios registrados:
    // OPTIMIZACIÓN DE CUOTA: Solo si estamos en aCtrl.html y somos admin escuchamos toda la colección.
    // En las demás páginas o para usuarios normales, escuchamos ÚNICAMENTE el documento propio del usuario.
    // Esto ahorra el 99% de lecturas y previene bloqueos por límites de cuota de Firebase.
    const isActrlPage = (typeof window !== 'undefined') && window.location.pathname.toLowerCase().includes("actrl.html");
    const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
    const currentEmail = (currentUser?.email || "").toLowerCase().trim();
    const isAdmin = (currentEmail === ADMIN_EMAIL.toLowerCase());

    if (isActrlPage && isAdmin) {
      if (!unsubUsersListener) {
        const usersColRef = collection(window.firebaseAPI.db, "registered_users");
        unsubUsersListener = onSnapshot(usersColRef, (snapshot) => {
          snapshot.forEach(docSnap => {
            const d = docSnap.data();
            if (d && d.email && !d.deleted) {
              const em = d.email.toLowerCase().trim();
              accessControlState.registeredUsers.add(em);
              if (d.displayName) accessControlState.registeredUserNames[em] = d.displayName;
              if (d.photoURL) accessControlState.registeredUserPhotos[em] = d.photoURL;
              if (d.group) {
                Object.keys(accessControlState.groups).forEach(otherGid => {
                  accessControlState.groups[otherGid].userIds.delete(em);
                });
                if (!accessControlState.groups[d.group]) {
                  createGroup(d.group, d.group);
                }
                accessControlState.groups[d.group].userIds.add(em);
                accessControlState.userDirectGroups[em] = new Set([d.group]);
              }
              if (d.banned) accessControlState.bannedUsers.add(em);
              else accessControlState.bannedUsers.delete(em);
            }
          });
          saveAccessControl();
          window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
        }, err => console.warn("Aviso listener usuarios Firestore:", err.message));
      }
    } else if (currentEmail) {
      if (!unsubUsersListener) {
        const cleanDocId = currentEmail.replace(/[^a-zA-Z0-9_-]/g, "_");
        const userDocRef = doc(window.firebaseAPI.db, "registered_users", cleanDocId);
        unsubUsersListener = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const d = docSnap.data();
            if (d && d.email && !d.deleted) {
              const em = d.email.toLowerCase().trim();
              if (d.group) {
                Object.keys(accessControlState.groups).forEach(otherGid => {
                  accessControlState.groups[otherGid].userIds.delete(em);
                });
                if (!accessControlState.groups[d.group]) {
                  createGroup(d.group, d.group);
                }
                accessControlState.groups[d.group].userIds.add(em);
                accessControlState.userDirectGroups[em] = new Set([d.group]);
              }
              if (d.banned) accessControlState.bannedUsers.add(em);
              else accessControlState.bannedUsers.delete(em);
              saveAccessControl();
              window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
            }
          }
        }, err => console.warn("Aviso listener usuario propio:", err.message));
      }
    }
  } catch (err) {
    console.warn("Error iniciando listener RT:", err);
  }
}

// Inicialización automática local
initAccessControl();

// Iniciar sincronización RT
if (window.firebaseAPI?.onAuthReady) {
  window.firebaseAPI.onAuthReady(() => {
    iniciarSincronizacionEnTiempoRealFirebase();
  });
} else {
  setTimeout(iniciarSincronizacionEnTiempoRealFirebase, 1000);
}

// =========================================================================
// EXPORTACIÓN A WINDOW GLOBAL (CRÍTICO PARA QUE FUNCIONE EN TODAS LAS PÁGINAS)
// =========================================================================
window.hasPermission = hasPermission;
window.canAccessPage = canAccessPage;
window.getUserEffectivePermissions = getUserEffectivePermissions;

window.accessControlAPI = {
  initAccessControl,
  createGroup,
  deleteGroup,
  setUserPrimaryGroup,
  banUser,
  unbanUser,
  deleteUserRegistration,
  registerUser,
  hasPermission,
  canAccessPage,
  getUserEffectivePermissions,
  saveAccessControl,
  saveGroupConfigToCloud,
  syncRegisteredUsersFromFirebase,
  iniciarSincronizacionEnTiempoRealFirebase,
  accessControlState,
  PERMISSIONS,
  PERMISSION_TREE,
  PERMISSION_LABELS
};
