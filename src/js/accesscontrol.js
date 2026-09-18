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
  INICIO_VER_PERMISOS_AUTORIZADOS: "actrl_permisos_ver_autorizados",

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
  // Cuenta
  ACTRL_CUENTA_LOGIN: "actrl_cuenta_login",
  ACTRL_CUENTA_LOGOUT: "actrl_cuenta_logout",
  ACTRL_CUENTA_GUARDAR_AJUSTES: "actrl_cuenta_guardar_ajustes",
  // Acceso - Miembros
  ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE: "actrl_miembros_autorizo_mostrar_nombre",
  ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO: "actrl_miembros_autorizo_mostrar_correo",
  ACTRL_MIEMBROS_BUSCADOR: "actrl_miembros_buscador",
  ACTRL_MIEMBROS_VER_TODO: "actrl_miembros_ver_todo",
  ACTRL_MIEMBROS_VER_CORREO: "actrl_miembros_ver_correo",
  ACTRL_MIEMBROS_VER_BOTONES: "actrl_miembros_ver_botones",
  ACTRL_MIEMBROS_VER_GRUPO: "actrl_miembros_ver_grupo",
  ACTRL_MIEMBROS_VER_GRUPO_ACTUAL: "actrl_miembros_ver_grupo_actual",
  ACTRL_MIEMBROS_BANEAR: "actrl_miembros_banear",
  ACTRL_MIEMBROS_ELIMINAR_REGISTRO: "actrl_miembros_eliminar_registro",
  ACTRL_MIEMBROS_CAMBIAR_GRUPO: "actrl_miembros_cambiar_grupo",
  // Acceso - Grupos
  ACTRL_GRUPOS_VER_GRUPO: "actrl_grupos_ver_grupo",
  ACTRL_GRUPOS_VER_MIEMBROS: "actrl_grupos_ver_miembros",
  ACTRL_GRUPOS_CREAR: "actrl_grupos_crear",
  ACTRL_GRUPOS_EDITAR: "actrl_grupos_editar",
  ACTRL_GRUPOS_ELIMINAR: "actrl_grupos_eliminar",
  // Acceso - Miembros Internos
  ACTRL_MIEMBROS_INTERNOS_VER: "actrl_miembros_internos_ver",
  ACTRL_MIEMBROS_INTERNOS_AGREGAR: "actrl_miembros_internos_agregar",
  ACTRL_PERMISOS_VER: "actrl_permisos_ver",
  ACTRL_PERMISOS_MARCAR: "actrl_permisos_marcar",
  ACTRL_PERMISOS_VER_AUTORIZADOS: "actrl_permisos_ver_autorizados",
  ACTRL_INSPECTOR_VER: "actrl_inspector_ver",
  ACTRL_INSPECTOR_ESCRIBIR: "actrl_inspector_escribir",
  ACTRL_INSPECTOR_VERIFICAR: "actrl_inspector_verificar",
  // Actualización
  ACTRL_ACTUALIZACION_REFRESCAR: "actrl_actualizacion_refrescar",
  ACTRL_ACTUALIZACION_LIMPIAR_CACHE: "actrl_actualizacion_limpiar_cache",
  ACTRL_ACTUALIZACION_LIMPIAR_CACHE_TOTAL: "actrl_actualizacion_limpiar_cache_total",
  ACTRL_ACTUALIZACION_VER_HISTORIAL: "actrl_actualizacion_ver_historial",
  ACTRL_ACTUALIZACION_ARCHIVOS_SISTEMA: "actrl_actualizacion_archivos_sistema",
  ACTRL_ACTUALIZACION_REGISTRO_IPS: "actrl_actualizacion_registro_ips",

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
  SYSTEM_GESTIONAR: "system_gestionar",

  // 12. DIRECCIÓN IP PUBLICAS (ipaddr.html)
  IPADDR_VER_USUARIO: "ipaddr_ver_usuario",
  IPADDR_VER_IP: "ipaddr_ver_ip",
  IPADDR_ULTIMO_ACCESO: "ipaddr_ultimo_acceso",
  IPADDR_ESTADO: "ipaddr_estado",
  IPADDR_MOTIVO: "ipaddr_motivo",
  IPADDR_BANEAR: "ipaddr_banear",
  IPADDR_EDITAR: "ipaddr_editar",
  IPADDR_ELIMINAR: "ipaddr_eliminar",

  // 13. ASISTENCIA Y CHAT (chat.html)
  PAGE_CHAT: "page_chat",
  CHAT_VER_TODOS: "chat_ver_todos",
  CHAT_ENVIAR: "chat_enviar",
  CHAT_ELIMINAR: "chat_eliminar"
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
    label: "Página: Control de Acceso",
    children: [
      { key: "page_actrl", label: "Ver página" },
      {
        key: "group_actrl_cuenta",
        label: "Cuenta",
        children: [
          { key: "actrl_cuenta_login", label: "Iniciar Sesión con Google" },
          { key: "actrl_cuenta_logout", label: "Cerrar Sesión" },
          { key: "actrl_cuenta_guardar_ajustes", label: "Guardar Ajustes en Firebase" }
        ]
      },
      {
        key: "group_actrl_acceso",
        label: "Acceso",
        children: [
          {
            key: "group_actrl_miembros",
            label: "Miembros",
            children: [
              { key: "actrl_miembros_buscador", label: "ver Buscador" },
              { key: "actrl_miembros_ver_todo", label: "Ver todo" },
              { key: "actrl_miembros_ver_correo", label: "ver correo" },
              { key: "actrl_miembros_ver_botones", label: "ver botones" },
              { key: "actrl_miembros_ver_grupo", label: "ver grupo" },
              { key: "actrl_miembros_ver_grupo_actual", label: "ver Grupo actual" },
              { key: "actrl_miembros_banear", label: "Banear" },
              { key: "actrl_miembros_eliminar_registro", label: "Eliminar Registro" },
              { key: "actrl_miembros_cambiar_grupo", label: "cambiar grupo" }
            ]
          },
          {
            key: "group_actrl_grupos",
            label: "Grupos",
            children: [
              { key: "actrl_grupos_ver_grupo", label: "ver grupo" },
              { key: "actrl_grupos_ver_miembros", label: "ver Miembros" },
              { key: "actrl_grupos_crear", label: "Crear Grupo" },
              { key: "actrl_grupos_editar", label: "Editar" },
              { key: "actrl_grupos_eliminar", label: "Eliminar" }
            ]
          },
          {
            key: "group_actrl_miembros_internos",
            label: "Miembros Internos",
            children: [
              { key: "actrl_miembros_internos_ver", label: "ver" },
              { key: "actrl_miembros_internos_agregar", label: "Agregar Hermano" }
            ]
          },
          {
            key: "group_actrl_permisos",
            label: "Permisos",
            children: [
              { key: "actrl_permisos_ver", label: "ver" },
              { key: "actrl_permisos_marcar", label: "marcar" },
              { key: "actrl_permisos_ver_autorizados", label: "Ver permisos autorizados" }
            ]
          },
          {
            key: "group_actrl_inspector",
            label: "Inspector",
            children: [
              { key: "actrl_inspector_ver", label: "ver" },
              { key: "actrl_inspector_escribir", label: "escribir" },
              { key: "actrl_inspector_verificar", label: "Verificar" }
            ]
          }
        ]
      },
      {
        key: "group_actrl_actualizacion",
        label: "Actualización",
        children: [
          { key: "actrl_actualizacion_refrescar", label: "Refrescar" },
          { key: "actrl_actualizacion_limpiar_cache", label: "Limpiar Caché" },
          { key: "actrl_actualizacion_limpiar_cache_total", label: "Limpiar Caché Total" },
          { key: "actrl_actualizacion_ver_historial", label: "Ver Historial de cambios" },
          { key: "actrl_actualizacion_archivos_sistema", label: "Archivos de Sistema" },
          { key: "actrl_actualizacion_registro_ips", label: "Registro de Direcciones IP" }
        ]
      }
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
  },

  // 10. Dirección IP Públicas (ipaddr.html)
  {
    key: "group_ipaddr",
    label: "Página: Dirección IP Publicas",
    children: [
      { key: "ipaddr_ver_usuario", label: "ver usuario" },
      { key: "ipaddr_ver_ip", label: "ver dirección IP" },
      { key: "ipaddr_ultimo_acceso", label: "ultimo acceso" },
      { key: "ipaddr_estado", label: "estado" },
      { key: "ipaddr_motivo", label: "Motivo / Observaciones" },
      { key: "ipaddr_banear", label: "banear" },
      { key: "ipaddr_editar", label: "editar" },
      { key: "ipaddr_eliminar", label: "eliminar" }
    ]
  },

  // 11. Asistencia y Chat (chat.html)
  {
    key: "group_chat",
    label: "Página: Asistencia y Chat",
    children: [
      { key: "page_chat", label: "Ver página y acceder al chat" },
      { key: "chat_ver_todos", label: "Ver todos los chats (soporte/admin)" },
      { key: "chat_enviar", label: "Enviar mensajes y archivos" },
      { key: "chat_eliminar", label: "Eliminar mensajes" }
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

// Claves de permisos obsoletas que han sido reemplazadas por permisos granulares
export const OBSOLETE_PERMISSIONS = [
  "actrl_grupos",
  "actrl_miembros",
  "actrl_permisos",
  "actrl_inspector",
  "inicio_ver_permisos_autorizados"
];

export function cleanObsoletePermissions(setOrObj) {
  if (!setOrObj) return;
  OBSOLETE_PERMISSIONS.forEach(k => {
    if (typeof setOrObj.delete === "function") {
      setOrObj.delete(k);
    }
  });
}

// Estado local
export const accessControlState = {
  groups: {},
  userDirectPermissions: {},
  userDirectGroups: {},
  userConsents: {},
  registeredUsers: new Set(),
  registeredUserNames: {},
  registeredUserPhotos: {},
  bannedUsers: new Set(),
  bannedIps: new Set(),
  suspiciousIps: new Set(),
  ipRecords: {}
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
        cleanObsoletePermissions(accessControlState.groups[gid].permissions);
      });
      Object.keys(parsed.userDirectPermissions || {}).forEach(uid => {
        accessControlState.userDirectPermissions[uid] = new Set(parsed.userDirectPermissions[uid] || []);
      });
      Object.keys(parsed.userDirectGroups || {}).forEach(uid => {
        accessControlState.userDirectGroups[uid] = new Set(parsed.userDirectGroups[uid] || []);
      });
      if (parsed.userConsents && typeof parsed.userConsents === "object") {
        accessControlState.userConsents = { ...parsed.userConsents };
      } else {
        accessControlState.userConsents = {};
      }
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
      if (Array.isArray(parsed.bannedIps)) {
        accessControlState.bannedIps = new Set(parsed.bannedIps);
      }
      if (Array.isArray(parsed.suspiciousIps)) {
        accessControlState.suspiciousIps = new Set(parsed.suspiciousIps);
      }
      if (parsed.ipRecords && typeof parsed.ipRecords === "object") {
        accessControlState.ipRecords = { ...parsed.ipRecords };
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
  createGroup("administradores", "Administradores del Sistema", [PERMISSIONS.ALL, ...Object.values(PERMISSIONS)], "Grupo con control total del sistema");
  
  // 2. Hermanos (grupo por defecto al autenticarse)
  // Incluye permisos de lectura y uso interactivo de todas las páginas y herramientas
  const permisosHermano = Object.values(PERMISSIONS).filter(p => p !== "*" && p !== "manage_access" && p !== "chat_ver_todos" && !p.startsWith("actrl_") && !p.startsWith("ipaddr_"));
  permisosHermano.push(PERMISSIONS.ACTRL_CUENTA_LOGOUT);
  createGroup("hermanos", "Hermano", permisosHermano, "Hermanos registrados y autenticados");

  // 3. Invitados (sin inicio de sesión: solo lectura básica + botón de login)
  createGroup("invitados", "Usuarios Invitados", [
    PERMISSIONS.PAGE_CAMBIO_LITURGICO,
    PERMISSIONS.PAGE_ANO_LITURGICO,
    PERMISSIONS.PAGE_DATOS_ANIOS,
    PERMISSIONS.PAGE_SANTOS_IGLESIA,
    PERMISSIONS.PAGE_REGISTRO_SANTO,
    PERMISSIONS.PAGE_CHAT,
    PERMISSIONS.PAGE_VER,
    PERMISSIONS.PAGE_SYSTEM,
    PERMISSIONS.VIEW_SETTINGS_GENERAL,
    PERMISSIONS.VIEW_SETTINGS_THEME,
    PERMISSIONS.VIEW_SETTINGS_TTS,
    PERMISSIONS.VIEW_SETTINGS_CALENDARIO,
    PERMISSIONS.ACTRL_CUENTA_LOGIN
  ], "Usuarios visitantes sin inicio de sesión");

  // Asignar al admin principal por defecto
  setUserPrimaryGroup(ADMIN_EMAIL, "administradores");
  accessControlState.registeredUserNames[ADMIN_EMAIL] = "Carlos David Báez (Administrador General)";
  saveAccessControl();
}

function asegurarGruposBase() {
  if (!accessControlState.groups["administradores"]) {
    createGroup("administradores", "Administradores del Sistema", [PERMISSIONS.ALL, ...Object.values(PERMISSIONS)], "Grupo con control total del sistema");
  } else {
    // Garantizar y restablecer siempre Acceso Total (*) y todos los permisos para el grupo Administradores
    accessControlState.groups["administradores"].permissions.add(PERMISSIONS.ALL);
    Object.values(PERMISSIONS).forEach(p => accessControlState.groups["administradores"].permissions.add(p));
  }
  if (!accessControlState.groups["hermanos"]) {
    const permisosHermano = Object.values(PERMISSIONS).filter(p => p !== "*" && p !== "manage_access" && p !== "chat_ver_todos" && !p.startsWith("actrl_") && !p.startsWith("ipaddr_"));
    permisosHermano.push(PERMISSIONS.ACTRL_CUENTA_LOGOUT);
    createGroup("hermanos", "Hermano", permisosHermano, "Hermanos registrados y autenticados");
  } else {
    // Actualizar nombre a Hermano si estaba guardado como Grupo General de Hermanos
    accessControlState.groups["hermanos"].name = "Hermano";
    cleanObsoletePermissions(accessControlState.groups["hermanos"].permissions);
    accessControlState.groups["hermanos"].permissions.add(PERMISSIONS.PAGE_CHAT);
    accessControlState.groups["hermanos"].permissions.add(PERMISSIONS.CHAT_ENVIAR);
    accessControlState.groups["hermanos"].permissions.add(PERMISSIONS.CHAT_ELIMINAR);
    accessControlState.groups["hermanos"].permissions.delete("chat_ver_todos");
  }
  if (!accessControlState.groups["invitados"]) {
    createGroup("invitados", "Usuarios Invitados", [
      PERMISSIONS.PAGE_CAMBIO_LITURGICO,
      PERMISSIONS.PAGE_ANO_LITURGICO,
      PERMISSIONS.PAGE_DATOS_ANIOS,
      PERMISSIONS.PAGE_SANTOS_IGLESIA,
      PERMISSIONS.PAGE_REGISTRO_SANTO,
      PERMISSIONS.PAGE_CHAT,
      PERMISSIONS.ACTRL_CUENTA_LOGIN
    ], "Usuarios visitantes sin inicio de sesión");
  } else {
    accessControlState.groups["invitados"].permissions.add(PERMISSIONS.PAGE_CHAT);
  }
  
  // Asegurar siempre a dbaezh78@gmail.com como Administrador General
  accessControlState.registeredUserNames[ADMIN_EMAIL] = "Carlos David Báez (Administrador General)";
  if (!accessControlState.groups["administradores"].userIds.has(ADMIN_EMAIL)) {
    setUserPrimaryGroup(ADMIN_EMAIL, "administradores");
  }

  saveAccessControl();
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
 * Edita un grupo existente (nombre visible y descripción)
 */
export async function updateGroup(groupId, newName, newDescription = "") {
  const gid = (groupId || "").toLowerCase().trim();
  if (!gid || !accessControlState.groups[gid]) {
    alert("El grupo especificado no existe.");
    return false;
  }

  const trimmedName = (newName || "").trim();
  if (!trimmedName) {
    alert("El nombre del grupo no puede estar vacío.");
    return false;
  }

  accessControlState.groups[gid].name = trimmedName;
  accessControlState.groups[gid].description = (newDescription || "").trim();

  saveAccessControl();
  await saveGroupConfigToCloud();
  window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
  return true;
}

/**
 * Elimina un grupo y purga su existencia tanto local como en Firestore
 */
export async function deleteGroup(groupId) {
  const gid = (groupId || "").toLowerCase().trim();
  if (gid === "administradores" || gid === "hermanos" || gid === "invitados") {
    alert("No se pueden eliminar los grupos base del sistema.");
    return false;
  }

  if (accessControlState.groups[gid]) {
    // Reasignar miembros al grupo general de Hermanos
    accessControlState.groups[gid].userIds.forEach(uid => {
      setUserPrimaryGroup(uid, "hermanos");
    });

    delete accessControlState.groups[gid];

    Object.keys(accessControlState.groups).forEach(otherId => {
      accessControlState.groups[otherId].subgroupIds.delete(gid);
    });

    saveAccessControl();

    // Eliminar campo específico en Firestore de manera atómica
    if (window.firebaseAPI && window.firebaseAPI.db) {
      try {
        const { doc, updateDoc, deleteField } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        const docRef = doc(window.firebaseAPI.db, "access_control", "groups_config");
        await updateDoc(docRef, {
          [`groups.${gid}`]: deleteField(),
          updatedAt: new Date().toISOString()
        });
        console.log(`🗑️ [Firebase] Grupo '${gid}' eliminado de Firestore.`);
      } catch (err) {
        console.warn("⚠️ Aviso al eliminar campo con updateDoc:", err);
      }
    }

    await saveGroupConfigToCloud();
    window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
    return true;
  }
  return false;
}

/**
 * Valida que una cadena sea un correo válido en formato cuenta@dominio.extension
 */
export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

/**
 * Asigna de forma EXCLUSIVA a un usuario su grupo primario
 */
export function setUserPrimaryGroup(userEmail, groupId, skipCloud = false) {
  if (!userEmail || !groupId) return;
  const uid = userEmail.toLowerCase().trim();
  const gid = groupId.toLowerCase().trim();

  // Validación estricta: cuenta@dominio.extension
  if (!isValidEmail(uid)) {
    console.warn(`[AccessControl] Correo inválido rechazado: "${uid}"`);
    alert(`El correo "${uid}" no es válido. Debe tener el formato: cuenta@dominio.com (cuenta, arroba, dominio y extensión).`);
    return;
  }

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
 * Verifica si una dirección IP está baneada
 */
export function isIpBanned(ip) {
  if (!ip) return false;
  return accessControlState.bannedIps ? accessControlState.bannedIps.has(ip) : false;
}

/**
 * Verifica si una dirección IP está marcada como sospechosa
 */
export function isIpSuspicious(ip) {
  if (!ip) return false;
  return accessControlState.suspiciousIps ? accessControlState.suspiciousIps.has(ip) : false;
}

/**
 * Banea una dirección IP en memoria y en Firestore
 */
export async function banIp(ip, reason = "") {
  if (!ip) return;
  if (!accessControlState.bannedIps) accessControlState.bannedIps = new Set();
  accessControlState.bannedIps.add(ip);
  if (!accessControlState.ipRecords) accessControlState.ipRecords = {};
  if (!accessControlState.ipRecords[ip]) {
    accessControlState.ipRecords[ip] = { ip, email: "desconocido", status: "Baneada", reason, updatedAt: new Date().toISOString() };
  } else {
    accessControlState.ipRecords[ip].status = "Baneada";
    accessControlState.ipRecords[ip].reason = reason || accessControlState.ipRecords[ip].reason || "Baneo administrativo";
    accessControlState.ipRecords[ip].updatedAt = new Date().toISOString();
  }
  saveAccessControl();

  if (window.firebaseAPI && window.firebaseAPI.db) {
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
      const cleanIp = ip.replace(/[^a-zA-Z0-9_-]/g, "_");
      await setDoc(doc(window.firebaseAPI.db, "user_ips", cleanIp), {
        ip,
        status: "Baneada",
        banned: true,
        reason,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("⚠️ Error guardando baneo de IP en Firestore:", e);
    }
  }
}

/**
 * Desbanea una dirección IP
 */
export async function unbanIp(ip) {
  if (!ip) return;
  if (accessControlState.bannedIps) accessControlState.bannedIps.delete(ip);
  if (accessControlState.ipRecords && accessControlState.ipRecords[ip]) {
    accessControlState.ipRecords[ip].status = "Normal";
    accessControlState.ipRecords[ip].updatedAt = new Date().toISOString();
  }
  saveAccessControl();

  if (window.firebaseAPI && window.firebaseAPI.db) {
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
      const cleanIp = ip.replace(/[^a-zA-Z0-9_-]/g, "_");
      await setDoc(doc(window.firebaseAPI.db, "user_ips", cleanIp), {
        status: "Normal",
        banned: false,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("⚠️ Error desbaneando IP en Firestore:", e);
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
  if (!uid && typeof window !== 'undefined' && window.currentUser?.email) {
    uid = (window.currentUser.email || "").toLowerCase().trim();
  }
  if (!uid && typeof localStorage !== 'undefined' && localStorage.getItem('lh_auth_email')) {
    uid = (localStorage.getItem('lh_auth_email') || "").toLowerCase().trim();
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

  const visitedGroups = new Set();

  function collect(gid) {
    if (visitedGroups.has(gid)) return;
    visitedGroups.add(gid);
    const g = accessControlState.groups[gid];
    if (!g) return;
    cleanObsoletePermissions(g.permissions);
    g.permissions.forEach(p => {
      if (!OBSOLETE_PERMISSIONS.includes(p)) effective.add(p);
    });
    g.subgroupIds.forEach(sub => collect(sub));
  }

  let inAnyGroup = false;
  Object.keys(accessControlState.groups).forEach(gid => {
    if (accessControlState.groups[gid]?.userIds?.has(uid)) {
      inAnyGroup = true;
      collect(gid);
    }
  });

  if (accessControlState.userDirectGroups && accessControlState.userDirectGroups[uid]) {
    accessControlState.userDirectGroups[uid].forEach(gid => {
      inAnyGroup = true;
      collect(gid);
    });
  }

  // Si el usuario está autenticado pero aún no tiene grupo asignado explícitamente, hereda 'hermanos' por defecto
  if (!inAnyGroup && uid && uid !== ADMIN_EMAIL.toLowerCase() && accessControlState.groups["hermanos"]) {
    collect("hermanos");
  }

  // Permisos directos individuales asignados al usuario (ej: Autorizo mostrar mi correo)
  if (accessControlState.userDirectPermissions && accessControlState.userDirectPermissions[uid]) {
    accessControlState.userDirectPermissions[uid].forEach(p => effective.add(p));
  }

  // El administrador principal siempre tiene garantizado Acceso Total
  if (uid === ADMIN_EMAIL) {
    effective.add(PERMISSIONS.ALL);
  }

  return effective;
}

/**
 * Establece o revoca la autorización de un usuario para mostrar su correo a los demás hermanos
 */
export function setUserEmailConsent(userEmail, authorized) {
  const uid = (userEmail || "").toLowerCase().trim();
  if (!uid || !isValidEmail(uid)) return;

  if (!accessControlState.userConsents) accessControlState.userConsents = {};
  if (!accessControlState.userConsents[uid]) accessControlState.userConsents[uid] = {};
  accessControlState.userConsents[uid].email = !!authorized;

  if (!accessControlState.userDirectPermissions) accessControlState.userDirectPermissions = {};
  if (!accessControlState.userDirectPermissions[uid]) {
    accessControlState.userDirectPermissions[uid] = new Set();
  }
  if (authorized) {
    accessControlState.userDirectPermissions[uid].add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);
  } else {
    accessControlState.userDirectPermissions[uid].delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);
  }
  saveAccessControl();

  // Sincronizar en el documento individual del usuario en Firestore (registered_users)
  if (window.firebaseAPI && window.firebaseAPI.db) {
    import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js").then(({ doc, setDoc }) => {
      const cleanDocId = uid.replace(/[^a-zA-Z0-9_-]/g, "_");
      setDoc(doc(window.firebaseAPI.db, "registered_users", cleanDocId), {
        email: uid,
        autorizoMostrarCorreo: !!authorized,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => {
        console.warn("⚠️ Error guardando consentimiento de correo en Firestore:", err);
      });
    }).catch(err => console.warn(err));
  }

  window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
}

/**
 * Establece o revoca la autorización de un usuario para mostrar su nombre a los demás hermanos
 */
export function setUserNameConsent(userEmail, authorized) {
  const uid = (userEmail || "").toLowerCase().trim();
  if (!uid || !isValidEmail(uid)) return;

  if (!accessControlState.userConsents) accessControlState.userConsents = {};
  if (!accessControlState.userConsents[uid]) accessControlState.userConsents[uid] = {};
  accessControlState.userConsents[uid].name = !!authorized;

  if (!accessControlState.userDirectPermissions) accessControlState.userDirectPermissions = {};
  if (!accessControlState.userDirectPermissions[uid]) {
    accessControlState.userDirectPermissions[uid] = new Set();
  }
  if (authorized) {
    accessControlState.userDirectPermissions[uid].add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
  } else {
    accessControlState.userDirectPermissions[uid].delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
  }
  saveAccessControl();

  // Sincronizar en el documento individual del usuario en Firestore (registered_users)
  if (window.firebaseAPI && window.firebaseAPI.db) {
    import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js").then(({ doc, setDoc }) => {
      const cleanDocId = uid.replace(/[^a-zA-Z0-9_-]/g, "_");
      setDoc(doc(window.firebaseAPI.db, "registered_users", cleanDocId), {
        email: uid,
        autorizoMostrarNombre: !!authorized,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => {
        console.warn("⚠️ Error guardando consentimiento de nombre en Firestore:", err);
      });
    }).catch(err => console.warn(err));
  }

  window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
}

/**
 * Consulta si un usuario ha autorizado que su nombre sea visible para otros hermanos.
 * Es un consentimiento estrictamente individual y personal del usuario.
 */
export function isUserNameAuthorized(userEmail) {
  const uid = (userEmail || "").toLowerCase().trim();
  if (!uid) return false;

  // Si el usuario (incluyendo el Administrador) ha establecido su consentimiento explícito
  if (accessControlState.userConsents?.[uid]?.name !== undefined) {
    return !!accessControlState.userConsents[uid].name;
  }
  if (accessControlState.userDirectPermissions?.[uid]?.has(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE)) {
    return true;
  }

  // Por defecto el administrador está autorizado si no lo ha desactivado
  if (uid === ADMIN_EMAIL.toLowerCase()) return true;

  return false;
}

/**
 * Consulta si un usuario ha autorizado que su correo sea visible para otros hermanos.
 * Es un consentimiento estrictamente individual y personal del usuario.
 */
export function isUserEmailAuthorized(userEmail) {
  const uid = (userEmail || "").toLowerCase().trim();
  if (!uid) return false;

  // Si el usuario (incluyendo el Administrador) ha establecido su consentimiento explícito
  if (accessControlState.userConsents?.[uid]?.email !== undefined) {
    return !!accessControlState.userConsents[uid].email;
  }
  if (accessControlState.userDirectPermissions?.[uid]?.has(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO)) {
    return true;
  }

  // Por defecto el administrador está autorizado si no lo ha desactivado
  if (uid === ADMIN_EMAIL.toLowerCase()) return true;

  return false;
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
    userConsents: accessControlState.userConsents || {},
    registeredUsers: Array.from(accessControlState.registeredUsers),
    registeredUserNames: accessControlState.registeredUserNames,
    registeredUserPhotos: accessControlState.registeredUserPhotos,
    bannedUsers: Array.from(accessControlState.bannedUsers),
    bannedIps: Array.from(accessControlState.bannedIps || []),
    suspiciousIps: Array.from(accessControlState.suspiciousIps || []),
    ipRecords: accessControlState.ipRecords || {}
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

  Object.keys(accessControlState.userDirectPermissions || {}).forEach(uid => {
    serializable.userDirectPermissions[uid] = Array.from(accessControlState.userDirectPermissions[uid] || []);
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

/**
 * Sincroniza definición de grupos en Firestore
 */
export async function saveGroupConfigToCloud() {
  if (!window.firebaseAPI?.db) return;
  const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
  const currentEmail = (currentUser?.email || localStorage.getItem('lh_auth_email') || "").toLowerCase().trim();
  const cachedIsAdmin = localStorage.getItem('lh_auth_is_admin') === 'true';
  const isAdmin = (currentEmail === ADMIN_EMAIL.toLowerCase()) || (!currentEmail && cachedIsAdmin);
  const canMarcar = (typeof hasPermission === 'function') && hasPermission(PERMISSIONS.ACTRL_PERMISOS_MARCAR, currentEmail);
  if (!isAdmin && !canMarcar) {
    // Solo el Administrador General o un usuario con permiso de marcar pueden modificar /access_control/groups_config
    return;
  }
  try {
    // Protección garantizada: Administradores siempre conserva Acceso Total
    if (accessControlState.groups["administradores"]) {
      accessControlState.groups["administradores"].permissions.add(PERMISSIONS.ALL);
      Object.values(PERMISSIONS).forEach(p => accessControlState.groups["administradores"].permissions.add(p));
    }
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
    const serializableGroups = {};
    Object.keys(accessControlState.groups).forEach(gid => {
      const g = accessControlState.groups[gid];
      cleanObsoletePermissions(g.permissions);
      serializableGroups[gid] = {
        id: g.id,
        name: g.name,
        description: g.description,
        permissions: Array.from(g.permissions),
        subgroupIds: Array.from(g.subgroupIds)
      };
    });

    const serializableUserDirectPerms = {};
    Object.keys(accessControlState.userDirectPermissions || {}).forEach(uid => {
      // Filtrar consentimientos individuales para que pertenezcan exclusivamente a registered_users
      const perms = Array.from(accessControlState.userDirectPermissions[uid] || [])
        .filter(p => p !== PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO && p !== PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
      if (perms.length > 0) {
        serializableUserDirectPerms[uid] = perms;
      }
    });

    // Guardar reemplazando el mapa completo para purgar grupos eliminados
    await setDoc(doc(window.firebaseAPI.db, "access_control", "groups_config"), {
      groups: serializableGroups,
      userDirectPermissions: serializableUserDirectPerms,
      updatedAt: new Date().toISOString()
    });
    console.log("☁️ [Firebase] Configuración de grupos guardada en Firestore (sincronización limpia).");
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

        if (!accessControlState.userConsents) accessControlState.userConsents = {};
        if (!accessControlState.userConsents[em]) accessControlState.userConsents[em] = {};
        if (!accessControlState.userDirectPermissions) accessControlState.userDirectPermissions = {};
        if (!accessControlState.userDirectPermissions[em]) accessControlState.userDirectPermissions[em] = new Set();

        if (d.autorizoMostrarCorreo !== undefined) {
          accessControlState.userConsents[em].email = !!d.autorizoMostrarCorreo;
          if (d.autorizoMostrarCorreo) {
            accessControlState.userDirectPermissions[em].add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);
          } else {
            accessControlState.userDirectPermissions[em].delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);
          }
        }
        if (d.autorizoMostrarNombre !== undefined) {
          accessControlState.userConsents[em].name = !!d.autorizoMostrarNombre;
          if (d.autorizoMostrarNombre) {
            accessControlState.userDirectPermissions[em].add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
          } else {
            accessControlState.userDirectPermissions[em].delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
          }
        }
      }
    });
    saveAccessControl();
    window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
  } catch (err) {
    console.warn("⚠️ Error sincronizando usuarios de Firebase:", err);
  }
}

// =========================================================================
// SINCRONIZACIÓN EN TIEMPO REAL (ONSNAPSHOT) CON FIREBASE FIRESTORE
// =========================================================================
let unsubGroupsListener = null;
let unsubUsersListener = null;
let currentUsersListenerType = null;

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
              cleanObsoletePermissions(accessControlState.groups[gid].permissions);
            });

            // Si un grupo no-base fue eliminado de Firestore, purgarlo de la memoria local
            Object.keys(accessControlState.groups).forEach(localGid => {
              if (localGid !== "administradores" && localGid !== "hermanos" && localGid !== "invitados" && !data.groups[localGid]) {
                delete accessControlState.groups[localGid];
              }
            });

            if (accessControlState.groups["administradores"]) {
              accessControlState.groups["administradores"].permissions.add(PERMISSIONS.ALL);
            }

            if (data.userDirectPermissions) {
              if (!accessControlState.userDirectPermissions) accessControlState.userDirectPermissions = {};
              Object.keys(data.userDirectPermissions).forEach(uid => {
                const currentSet = accessControlState.userDirectPermissions[uid] || new Set();
                const newSet = new Set(data.userDirectPermissions[uid] || []);

                // Conservar consentimientos del usuario si ya estaban cargados o en accessControlState.userConsents
                const nameConsent = accessControlState.userConsents?.[uid]?.name ?? currentSet.has(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
                const emailConsent = accessControlState.userConsents?.[uid]?.email ?? currentSet.has(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);

                if (nameConsent) newSet.add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
                else newSet.delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);

                if (emailConsent) newSet.add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);
                else newSet.delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);

                accessControlState.userDirectPermissions[uid] = newSet;
              });
            }

            saveAccessControl();
            window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
          }
        }
      }, err => console.warn("Aviso listener grupos Firestore:", err.message));
    }

    // 2. Escuchar usuarios registrados:
    // En aCtrl.html, cualquier usuario escucha toda la colección para sincronizar miembros y consentimientos en tiempo real.
    // En las demás páginas, se escucha únicamente el documento propio del usuario para optimizar cuota.
    const isActrlPage = (typeof window !== 'undefined') && window.location.pathname.toLowerCase().includes("actrl.html");
    const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
    const currentEmail = (currentUser?.email || localStorage.getItem('lh_auth_email') || "").toLowerCase().trim();

    if (isActrlPage) {
      if (currentUsersListenerType !== 'collection') {
        if (typeof unsubUsersListener === 'function') {
          unsubUsersListener();
        }
        currentUsersListenerType = 'collection';
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

              if (!accessControlState.userConsents) accessControlState.userConsents = {};
              if (!accessControlState.userConsents[em]) accessControlState.userConsents[em] = {};
              if (!accessControlState.userDirectPermissions) accessControlState.userDirectPermissions = {};
              if (!accessControlState.userDirectPermissions[em]) accessControlState.userDirectPermissions[em] = new Set();

              if (d.autorizoMostrarCorreo !== undefined) {
                accessControlState.userConsents[em].email = !!d.autorizoMostrarCorreo;
                if (d.autorizoMostrarCorreo) {
                  accessControlState.userDirectPermissions[em].add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);
                } else {
                  accessControlState.userDirectPermissions[em].delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);
                }
              }
              if (d.autorizoMostrarNombre !== undefined) {
                accessControlState.userConsents[em].name = !!d.autorizoMostrarNombre;
                if (d.autorizoMostrarNombre) {
                  accessControlState.userDirectPermissions[em].add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
                } else {
                  accessControlState.userDirectPermissions[em].delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
                }
              }
            }
          });
          saveAccessControl();
          window.dispatchEvent(new CustomEvent('lh-access-control-updated'));
        }, err => console.warn("Aviso listener usuarios Firestore:", err.message));
      }
    } else if (currentEmail) {
      if (currentUsersListenerType !== currentEmail) {
        if (typeof unsubUsersListener === 'function') {
          unsubUsersListener();
        }
        currentUsersListenerType = currentEmail;
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

              if (!accessControlState.userConsents) accessControlState.userConsents = {};
              if (!accessControlState.userConsents[em]) accessControlState.userConsents[em] = {};
              if (!accessControlState.userDirectPermissions) accessControlState.userDirectPermissions = {};
              if (!accessControlState.userDirectPermissions[em]) accessControlState.userDirectPermissions[em] = new Set();

              if (d.autorizoMostrarCorreo !== undefined) {
                accessControlState.userConsents[em].email = !!d.autorizoMostrarCorreo;
                if (d.autorizoMostrarCorreo) {
                  accessControlState.userDirectPermissions[em].add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);
                } else {
                  accessControlState.userDirectPermissions[em].delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_CORREO);
                }
              }
              if (d.autorizoMostrarNombre !== undefined) {
                accessControlState.userConsents[em].name = !!d.autorizoMostrarNombre;
                if (d.autorizoMostrarNombre) {
                  accessControlState.userDirectPermissions[em].add(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
                } else {
                  accessControlState.userDirectPermissions[em].delete(PERMISSIONS.ACTRL_MIEMBROS_AUTORIZO_MOSTRAR_NOMBRE);
                }
              }
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

if (typeof window !== 'undefined') {
  window.addEventListener('lh-user-changed', () => {
    iniciarSincronizacionEnTiempoRealFirebase();
  });
}

// =========================================================================
// EXPORTACIÓN A WINDOW GLOBAL (CRÍTICO PARA QUE FUNCIONE EN TODAS LAS PÁGINAS)
// =========================================================================
window.hasPermission = hasPermission;
window.canAccessPage = canAccessPage;
window.getUserEffectivePermissions = getUserEffectivePermissions;
window.isUserNameAuthorized = isUserNameAuthorized;
window.setUserNameConsent = setUserNameConsent;
window.isUserEmailAuthorized = isUserEmailAuthorized;
window.setUserEmailConsent = setUserEmailConsent;

window.accessControlAPI = {
  initAccessControl,
  createGroup,
  updateGroup,
  deleteGroup,
  setUserPrimaryGroup,
  isValidEmail,
  setUserNameConsent,
  isUserNameAuthorized,
  setUserEmailConsent,
  isUserEmailAuthorized,
  banUser,
  unbanUser,
  deleteUserRegistration,
  registerUser,
  banIp,
  unbanIp,
  isIpBanned,
  isIpSuspicious,
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
