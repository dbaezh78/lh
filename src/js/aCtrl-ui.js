/**
 * src/js/aCtrl-ui.js - Controlador Visual para la Página aCtrl.html
 */

import {
  accessControlState,
  ADMIN_EMAIL,
  createGroup,
  updateGroup,
  deleteGroup,
  setUserPrimaryGroup,
  banUser,
  unbanUser,
  deleteUserRegistration,
  getUserEffectivePermissions,
  saveAccessControl,
  saveGroupConfigToCloud,
  syncRegisteredUsersFromFirebase,
  PERMISSIONS,
  PERMISSION_TREE,
  PERMISSION_LABELS
} from "./accesscontrol.js";

const expandedNodes = new Set();

function getIsAdminOrPermitted(user, permKey = "page_actrl") {
  const currentUser = user || (window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null);
  const email = (currentUser?.email || "").toLowerCase().trim();
  const cachedIsAdmin = localStorage.getItem('lh_auth_is_admin') === 'true';
  const isAdmin = (email === ADMIN_EMAIL.toLowerCase()) || (!email && cachedIsAdmin);
  return isAdmin || (typeof window.hasPermission === 'function' && (window.hasPermission(permKey, email) || window.hasPermission("manage_access", email)));
}

function inicializarACtrlUI() {
  // Pestañas Principales (Cuenta vs Acceso)
  const mainTabBtns = document.querySelectorAll(".user-tab-btn");
  const mainPanels = document.querySelectorAll(".user-panel-content");
  const accessSubtabBtns = document.querySelectorAll(".access-subtab-btn");
  const accessSubpanels = document.querySelectorAll(".access-subpanel");

  // Activa la pestaña principal respetando permisos y guardando en localStorage
  function activarMainTab(targetTab) {
    const tabAccessBtn = document.getElementById("tab-btn-access");
    const canAccess = getIsAdminOrPermitted(null, "page_actrl");

    let finalTab = targetTab;
    if (finalTab === "access" && !canAccess) {
      finalTab = "account";
    }

    mainTabBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === finalTab));
    mainPanels.forEach(p => {
      p.style.display = (p.id === `user-panel-${finalTab}`) ? "block" : "none";
    });
    localStorage.setItem("lh_actrl_main_tab", finalTab);

    if (finalTab === "account") {
      renderCuentaPanel();
    }

    if (finalTab === "access") {
      actualizarVisibilidadSubtabsAcceso();
      actualizarControlesSubpanelesAcceso();
      const savedSubtab = localStorage.getItem("lh_actrl_subtab") || "members";
      activarSubtab(savedSubtab);
    }

    if (finalTab === "update") {
      actualizarPanelActualizacion();
    }
  }

  // Controla qué subpestañas de Acceso son visibles según permisos
  function actualizarVisibilidadSubtabsAcceso() {
    const permSubtabs = {
      "members": "actrl_miembros",
      "groups": "actrl_grupos",
      "internal-members": "actrl_miembros_internos_agregar",
      "permissions": "actrl_permisos_ver",
      "inspector": "actrl_inspector_ver"
    };

    const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
    const email = currentUser?.email || "";

    let firstAvailable = null;
    const currentSavedSubtab = localStorage.getItem("lh_actrl_subtab") || "members";
    let isCurrentAllowed = false;

    accessSubtabBtns.forEach(btn => {
      const subtab = btn.dataset.subtab;
      let allowed = true;
      if (typeof window.hasPermission === 'function') {
        if (subtab === "members") {
          allowed = window.hasPermission("actrl_miembros", email) ||
                    window.hasPermission("actrl_miembros_ver_todo", email) ||
                    window.hasPermission("actrl_miembros_buscador", email) ||
                    window.hasPermission("actrl_miembros_ver_correo", email) ||
                    window.hasPermission("actrl_miembros_ver_botones", email) ||
                    window.hasPermission("actrl_miembros_ver_grupo", email) ||
                    window.hasPermission("actrl_miembros_ver_grupo_actual", email) ||
                    window.hasPermission("actrl_miembros_banear", email) ||
                    window.hasPermission("actrl_miembros_eliminar_registro", email) ||
                    window.hasPermission("actrl_miembros_cambiar_grupo", email);
        } else if (subtab === "groups") {
          allowed = window.hasPermission("actrl_grupos", email) ||
                    window.hasPermission("actrl_grupos_ver_grupo", email) ||
                    window.hasPermission("actrl_grupos_ver_miembros", email) ||
                    window.hasPermission("actrl_grupos_crear", email) ||
                    window.hasPermission("actrl_grupos_editar", email) ||
                    window.hasPermission("actrl_grupos_eliminar", email);
        } else if (subtab === "internal-members") {
          allowed = window.hasPermission("actrl_miembros_internos_ver", email) ||
                    window.hasPermission("actrl_miembros_internos_agregar", email);
        } else if (subtab === "permissions") {
          allowed = window.hasPermission("actrl_permisos_ver", email) ||
                    window.hasPermission("actrl_permisos_marcar", email) ||
                    window.hasPermission("actrl_permisos_ver_autorizados", email);
        } else {
          const requiredPerm = permSubtabs[subtab];
          allowed = window.hasPermission(requiredPerm, email);
        }
      }
      btn.style.display = allowed ? "inline-flex" : "none";
      if (allowed) {
        if (!firstAvailable) firstAvailable = subtab;
        if (subtab === currentSavedSubtab) isCurrentAllowed = true;
      }
    });

    if (!isCurrentAllowed && firstAvailable) {
      activarSubtab(firstAvailable);
    }
  }

  // Controla los permisos dentro de los subpaneles de Acceso (Inspector, Miembros Internos, Miembros, Grupos)
  function actualizarControlesSubpanelesAcceso() {
    renderMiembrosList();
    renderGruposList();

    const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
    const email = currentUser?.email || "";

    // Grupos: Crear Grupo
    const formCrearGrupo = document.querySelector("#access-subpanel-groups .form-box");
    if (formCrearGrupo) {
      const pCrear = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_grupos_crear", email) : true;
      formCrearGrupo.style.display = pCrear ? "block" : "none";
    }

    // Miembros internos: Ver y Agregar Hermano
    const subpanelInternal = document.getElementById("access-subpanel-internal-members");
    const formInternal = subpanelInternal?.querySelector(".form-box");
    const btnAddUser = document.getElementById("ac-btn-add-user");
    if (btnAddUser) {
      const pAdd = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_internos_agregar", email) : true;
      btnAddUser.style.display = pAdd ? "inline-flex" : "none";
    }
    if (formInternal) {
      const pVerInternal = (typeof window.hasPermission === 'function') ? (window.hasPermission("actrl_miembros_internos_ver", email) || window.hasPermission("actrl_miembros_internos_agregar", email)) : true;
      formInternal.style.display = pVerInternal ? "block" : "none";
    }

    // Inspector: escribir y verificar
    const inputInspect = document.getElementById("ac-inspect-email-input");
    const btnInspect = document.getElementById("ac-btn-inspect");
    if (inputInspect) {
      const pEscribir = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_inspector_escribir", email) : true;
      inputInspect.disabled = !pEscribir;
      if (!pEscribir) inputInspect.placeholder = "Sin permiso para escribir correo";
      else inputInspect.placeholder = "Ingresa el correo de un hermano para verificar";
    }
    if (btnInspect) {
      const pVerificar = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_inspector_verificar", email) : true;
      btnInspect.style.display = pVerificar ? "inline-flex" : "none";
    }
  }

  // Controla qué botones y enlaces de la pestaña Actualización son visibles según permisos
  function actualizarPanelActualizacion() {
    const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
    const email = currentUser?.email || "";

    const btnActualizar = document.getElementById("btn-actrl-actualizar");
    const btnLimpiar = document.getElementById("btn-actrl-limpiar-cache");
    const btnLimpiarTotal = document.getElementById("btn-actrl-limpiar-cache-total");
    const linkVer = document.querySelector("#user-panel-update a[href='ver.html']");
    const linkSystem = document.querySelector("#user-panel-update a[href='system.html']");
    const linkIp = document.querySelector("#user-panel-update a[href='ipaddr.html']");

    if (btnActualizar) {
      const p = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_actualizacion_refrescar", email) : true;
      btnActualizar.style.display = p ? "inline-flex" : "none";
    }
    if (btnLimpiar) {
      const p = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_actualizacion_limpiar_cache", email) : true;
      btnLimpiar.style.display = p ? "inline-flex" : "none";
    }
    if (btnLimpiarTotal) {
      const p = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_actualizacion_limpiar_cache_total", email) : true;
      btnLimpiarTotal.style.display = p ? "inline-flex" : "none";
    }
    if (linkVer) {
      const p = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_actualizacion_ver_historial", email) : true;
      linkVer.style.display = p ? "inline-flex" : "none";
    }
    if (linkSystem) {
      const p = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_actualizacion_archivos_sistema", email) : true;
      linkSystem.style.display = p ? "inline-flex" : "none";
    }
    if (linkIp) {
      const p = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_actualizacion_registro_ips", email) : true;
      linkIp.style.display = p ? "inline-flex" : "none";
    }
  }

  // Activa la subpestaña de Acceso guardando en localStorage
  function activarSubtab(targetSubtab) {
    accessSubtabBtns.forEach(b => b.classList.toggle("active", b.dataset.subtab === targetSubtab));
    accessSubpanels.forEach(p => {
      p.style.display = (p.id === `access-subpanel-${targetSubtab}`) ? "block" : "none";
    });
    localStorage.setItem("lh_actrl_subtab", targetSubtab);
    if (targetSubtab === "permissions") {
      const selPerm = document.getElementById("ac-select-group-perm");
      if (selPerm) {
        const savedGroup = localStorage.getItem("lh_actrl_last_edited_group");
        const validKeys = Object.keys(accessControlState.groups);
        if (savedGroup && savedGroup !== "administradores" && validKeys.includes(savedGroup)) {
          selPerm.value = savedGroup;
        } else if (validKeys.includes("hermanos")) {
          selPerm.value = "hermanos";
        }
      }
      renderPermissionsPanel();
    }
    if (targetSubtab === "members") renderMiembrosList();
  }

  // Eventos de clic en Pestañas Principales
  mainTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activarMainTab(btn.dataset.tab);
    });
  });

  // Eventos de clic en Subpestañas de Acceso
  accessSubtabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activarSubtab(btn.dataset.subtab);
    });
  });

  // Verificar visibilidad del botón Acceso
  function verificarVisibilidadPestanaAcceso(user) {
    const tabAccessBtn = document.getElementById("tab-btn-access");
    if (!tabAccessBtn) return;
    const canAccess = getIsAdminOrPermitted(user, "page_actrl") ||
                      getIsAdminOrPermitted(user, "actrl_permisos_ver_autorizados") ||
                      getIsAdminOrPermitted(user, "actrl_miembros_autorizo_mostrar_correo");

    if (canAccess) {
      tabAccessBtn.style.display = "inline-flex";
    } else {
      tabAccessBtn.style.display = "none";
      const currentMainTab = localStorage.getItem("lh_actrl_main_tab");
      if (currentMainTab === "access") {
        activarMainTab("account");
      }
    }
  }

  // Expandir y contraer nodos del árbol de permisos
  function expandirTodo(nodes) {
    nodes.forEach(n => {
      if (n.children) {
        expandedNodes.add(n.key);
        expandirTodo(n.children);
      }
    });
  }

  function contraerTodo() {
    expandedNodes.clear();
  }

  // Por defecto todas las categorías inician contraídas
  contraerTodo();

  // Eventos del Buscador de Permisos y controles Expandir/Contraer
  const inputSearchPerms = document.getElementById("ac-search-permissions-input");
  if (inputSearchPerms) {
    inputSearchPerms.addEventListener("input", () => {
      const q = inputSearchPerms.value.trim();
      if (!q) {
        contraerTodo();
      }
      renderPermissionsPanel();
    });
  }

  const btnExpandPerms = document.getElementById("ac-btn-expand-perms");
  if (btnExpandPerms) {
    btnExpandPerms.addEventListener("click", () => {
      expandirTodo(PERMISSION_TREE);
      renderPermissionsPanel();
    });
  }

  const btnCollapsePerms = document.getElementById("ac-btn-collapse-perms");
  if (btnCollapsePerms) {
    btnCollapsePerms.addEventListener("click", () => {
      contraerTodo();
      renderPermissionsPanel();
    });
  }

  // Render inicial y restauración de posición guardada
  renderCuentaPanel();
  renderMiembrosList();
  renderGruposList();
  renderSelectoresGrupos();

  const savedMainTab = localStorage.getItem("lh_actrl_main_tab") || "account";
  const savedSubtab = localStorage.getItem("lh_actrl_subtab") || "members";
  activarMainTab(savedMainTab);
  activarSubtab(savedSubtab);
  actualizarVisibilidadSubtabsAcceso();
  actualizarControlesSubpanelesAcceso();
  actualizarPanelActualizacion();
  verificarVisibilidadPestanaAcceso();

  // Escuchar estado de autenticación
  if (window.firebaseAPI?.onAuthReady) {
    window.firebaseAPI.onAuthReady((user) => {
      if (user) registrarIpAccesoUsuario(user);
      verificarVisibilidadPestanaAcceso(user);
      actualizarVisibilidadSubtabsAcceso();
      actualizarControlesSubpanelesAcceso();
      actualizarPanelActualizacion();
      renderCuentaPanel(user);
      renderMiembrosList();
      renderGruposList();
      activarMainTab(localStorage.getItem("lh_actrl_main_tab") || "account");
    });
  }

  // Escuchar actualizaciones de permisos en tiempo real
  window.addEventListener("lh-access-control-updated", () => {
    console.log("🔄 [aCtrl UI] Actualizando vistas por sincronización en vivo.");
    verificarVisibilidadPestanaAcceso();
    actualizarVisibilidadSubtabsAcceso();
    actualizarControlesSubpanelesAcceso();
    actualizarPanelActualizacion();
    renderCuentaPanel();
    renderMiembrosList();
    renderGruposList();
    renderSelectoresGrupos();
    const subtab = localStorage.getItem("lh_actrl_subtab") || "members";
    if (subtab === "permissions") renderPermissionsPanel();
  });

  // Registra y verifica la IP del usuario que inicia sesión
  async function registrarIpAccesoUsuario(user) {
    if (!user || !user.email) return;
    const email = user.email.toLowerCase().trim();

    let clientIp = "127.0.0.1";
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      if (res.ok) {
        const d = await res.json();
        if (d && d.ip) clientIp = d.ip;
      }
    } catch (e) {
      try {
        const res2 = await fetch("https://ipapi.co/json/");
        if (res2.ok) {
          const d2 = await res2.json();
          if (d2 && d2.ip) clientIp = d2.ip;
        }
      } catch (e2) {}
    }

    // Verificar si la IP o la cuenta están baneadas
    const isIpBanned = window.accessControlAPI?.isIpBanned ? window.accessControlAPI.isIpBanned(clientIp) : false;
    const isUserBanned = accessControlState.bannedUsers ? accessControlState.bannedUsers.has(email) : false;

    if (isIpBanned || isUserBanned) {
      alert(`⚠️ ACCESO DENEGADO: La dirección IP (${clientIp}) o tu cuenta (${email}) han sido suspendidas.`);
      await window.firebaseAPI?.logout?.();
      window.location.reload();
      return;
    }

    const record = {
      id: `${email.replace(/[^a-zA-Z0-9_-]/g, "_")}_${clientIp.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
      email,
      displayName: user.displayName || email.split("@")[0],
      photoURL: user.photoURL || "",
      ip: clientIp,
      lastLogin: new Date().toISOString(),
      status: (window.accessControlAPI?.isIpSuspicious && window.accessControlAPI.isIpSuspicious(clientIp)) ? "Sospechosa" : "Normal",
      reason: ""
    };

    // Guardar en localStorage
    try {
      const raw = localStorage.getItem("lh_user_ips");
      const ipsList = raw ? JSON.parse(raw) : [];
      const idx = ipsList.findIndex(item => item.id === record.id || (item.email === email && item.ip === clientIp));
      if (idx >= 0) {
        record.status = ipsList[idx].status || record.status;
        record.reason = ipsList[idx].reason || "";
        ipsList[idx] = { ...ipsList[idx], ...record };
      } else {
        ipsList.unshift(record);
      }
      localStorage.setItem("lh_user_ips", JSON.stringify(ipsList));
    } catch (err) {
      console.warn("Aviso guardando IP local:", err);
    }

    // Sincronizar en Firestore
    if (window.firebaseAPI?.db) {
      try {
        const authUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
        if (!authUser) {
          return;
        }
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        await setDoc(doc(window.firebaseAPI.db, "user_ips", record.id), record, { merge: true });
      } catch (err) {
        if (err?.code === "permission-denied" || (err?.message && err.message.includes("permissions"))) {
          console.info("ℹ️ [IP] Registro guardado en caché local. Para habilitar la nube a todos los usuarios, recuerda publicar la regla 'user_ips' en la consola de Firebase.");
        } else {
          console.warn("Aviso guardando IP en Firestore:", err);
        }
      }
    }
  }

  // Sincronizar desde Firebase inicial
  syncRegisteredUsersFromFirebase().then(() => {
    verificarVisibilidadPestanaAcceso();
    renderCuentaPanel();
    renderMiembrosList();
    renderGruposList();
    renderSelectoresGrupos();
  });

  // Eventos: Crear Grupo
  const btnCreateGroup = document.getElementById("ac-btn-create-group");
  if (btnCreateGroup) {
    btnCreateGroup.addEventListener("click", () => {
      const idInput = document.getElementById("ac-group-id");
      const nameInput = document.getElementById("ac-group-name");
      const descInput = document.getElementById("ac-group-desc");

      const gid = idInput ? idInput.value.trim() : "";
      const name = nameInput ? nameInput.value.trim() : "";
      const desc = descInput ? descInput.value.trim() : "";

      if (!gid || !name) {
        alert("Por favor indica al menos el ID y el Nombre del grupo.");
        return;
      }

      createGroup(gid, name, [], desc);
      alert(`Grupo "${name}" creado exitosamente.`);
      
      if (idInput) idInput.value = "";
      if (nameInput) nameInput.value = "";
      if (descInput) descInput.value = "";

      renderGruposList();
      renderSelectoresGrupos();
    });
  }

  // Eventos del Modal de Edición de Grupo
  const formModalGrupo = document.getElementById("form-modal-grupo");
  if (formModalGrupo) {
    formModalGrupo.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputId = document.getElementById("modal-grupo-id");
      const inputName = document.getElementById("modal-grupo-name");
      const inputDesc = document.getElementById("modal-grupo-desc");

      const gid = inputId ? inputId.value.trim() : "";
      const name = inputName ? inputName.value.trim() : "";
      const desc = inputDesc ? inputDesc.value.trim() : "";

      if (!gid || !name) {
        alert("Por favor indica al menos el nombre visible del grupo.");
        return;
      }

      await updateGroup(gid, name, desc);
      cerrarModalEditarGrupo();
      renderGruposList();
      renderSelectoresGrupos();
      alert(`Grupo "${name}" actualizado exitosamente.`);
    });
  }

  const btnCerrarModalGrupo = document.getElementById("btn-cerrar-modal-grupo");
  const btnCancelarModalGrupo = document.getElementById("btn-cancelar-modal-grupo");
  const modalGrupo = document.getElementById("modal-grupo");

  if (btnCerrarModalGrupo) btnCerrarModalGrupo.addEventListener("click", cerrarModalEditarGrupo);
  if (btnCancelarModalGrupo) btnCancelarModalGrupo.addEventListener("click", cerrarModalEditarGrupo);
  if (modalGrupo) {
    modalGrupo.addEventListener("click", (e) => {
      if (e.target === modalGrupo) cerrarModalEditarGrupo();
    });
  }

  // Evento: Buscador de Miembros
  const searchInput = document.getElementById("ac-search-members-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderMiembrosList();
    });
  }

  // Evento: Agregar Miembro Interno
  const btnAddUser = document.getElementById("ac-btn-add-user");
  if (btnAddUser) {
    btnAddUser.addEventListener("click", () => {
      const selectG = document.getElementById("ac-select-group-user");
      const emailIn = document.getElementById("ac-user-email-input");
      const rawEmail = (emailIn?.value || "").trim().toLowerCase();

      if (!selectG || !rawEmail) {
        alert("Por favor ingresa el correo electrónico del hermano.");
        emailIn?.focus();
        return;
      }

      // Validación estricta: cuenta@dominio.extension
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(rawEmail)) {
        alert("El correo ingresado no es válido. Debe tener el formato: cuenta@dominio.com (con nombre de cuenta, arroba, dominio y extensión).");
        emailIn?.focus();
        return;
      }

      setUserPrimaryGroup(rawEmail, selectG.value);
      alert(`Hermano con correo "${rawEmail}" agregado correctamente al grupo ${selectG.value}.`);
      emailIn.value = "";
      renderMiembrosList();
      renderGruposList();
    });
  }

  // Evento: Inspector
  const btnInspect = document.getElementById("ac-btn-inspect");
  if (btnInspect) {
    btnInspect.addEventListener("click", () => {
      const emailInput = document.getElementById("ac-inspect-email-input");
      const resultBox = document.getElementById("ac-inspect-result");
      if (!emailInput || !resultBox) return;

      const email = emailInput.value.trim().toLowerCase();
      if (!email) {
        resultBox.innerHTML = "<p style='color: var(--text-muted);'>Ingresa un correo para verificar permisos.</p>";
        return;
      }

      const perms = getUserEffectivePermissions(email);
      const isBanned = accessControlState.bannedUsers.has(email);

      let groupName = "Ninguno / Invitado";
      Object.keys(accessControlState.groups).forEach(gid => {
        if (accessControlState.groups[gid].userIds.has(email)) {
          groupName = accessControlState.groups[gid].name;
        }
      });

      const permArray = Array.from(perms).map(p => PERMISSION_LABELS[p] || p);
      const isAdm = (email === ADMIN_EMAIL.toLowerCase());
      const roleLabel = isAdm ? ' <span class="badge-rol admin" style="padding: 2px 8px; font-size: 0.72rem; margin-left: 6px;"><span class="material-symbols-outlined" style="font-size: 0.85rem;">admin_panel_settings</span> Administrador General</span>' : '';

      resultBox.innerHTML = `
        <div style="margin-bottom: 8px;"><b>Hermano:</b> ${email}${roleLabel}</div>
        <div style="margin-bottom: 8px;"><b>Grupo Principal:</b> ${groupName}</div>
        <div style="margin-bottom: 8px;"><b>Estado:</b> ${isBanned ? '<span style="color:red; font-weight:bold;">BANEADO</span>' : '<span style="color:green; font-weight:bold;">ACTIVO</span>'}</div>
        <div style="margin-bottom: 6px;"><b>Permisos Efectivos (${permArray.length}):</b></div>
        <ul style="margin: 0; padding-left: 20px; max-height: 250px; overflow-y: auto;">
          ${permArray.map(p => `<li>${p}</li>`).join("")}
        </ul>
      `;
    });
  }

  // Selector de Grupo para Permisos
  const selectGroupPerm = document.getElementById("ac-select-group-perm");
  if (selectGroupPerm) {
    selectGroupPerm.addEventListener("change", (e) => {
      const selected = e.target.value;
      if (selected && selected !== "administradores") {
        localStorage.setItem("lh_actrl_last_edited_group", selected);
      }
      renderPermissionsPanel();
    });
  }

  // Eventos de Pestaña Actualización
  const btnActualizar = document.getElementById("btn-actrl-actualizar");
  const btnLimpiarCache = document.getElementById("btn-actrl-limpiar-cache");
  const btnLimpiarCacheTotal = document.getElementById("btn-actrl-limpiar-cache-total");

  // Ajustar etiqueta del botón según si ya está actualizado
  function ajustarBotonActualizarACtrl() {
    if (!btnActualizar) return;
    const currentVer = window.APP_VERSION || "1.0.01";
    const lastUpdated = localStorage.getItem("lh_last_updated_version");
    const isUpToDate = (lastUpdated === currentVer);

    if (isUpToDate) {
      btnActualizar.innerHTML = `<span class="material-symbols-outlined">sync</span> Refrescar`;
      btnActualizar.title = "Refrescar y recargar archivos del sistema que no estén cargados";
    } else {
      btnActualizar.innerHTML = `<span class="material-symbols-outlined">sync</span> Actualizar`;
      btnActualizar.title = "Actualizar a la última versión disponible";
    }
  }

  ajustarBotonActualizarACtrl();

  if (btnActualizar) {
    btnActualizar.addEventListener("click", async () => {
      const currentVer = window.APP_VERSION || "1.0.01";
      const lastUpdated = localStorage.getItem("lh_last_updated_version");
      const isUpToDate = (lastUpdated === currentVer);
      const msg = isUpToDate
        ? "🔄 ¿Desea refrescar los archivos para cargar aquellos que no estén cargados?"
        : "🔄 ¿Desea actualizar y sincronizar la aplicación con los últimos cambios?";

      if (confirm(msg)) {
        if (typeof window.ejecutarActualizacionConListaArchivos === "function") {
          await window.ejecutarActualizacionConListaArchivos("actualizar");
        } else {
          location.reload();
        }
      }
    });
  }

  if (btnLimpiarCache) {
    btnLimpiarCache.addEventListener("click", async () => {
      if (confirm("🧹 ¿Desea limpiar la caché del navegador? (Su sesión permanecerá abierta)")) {
        if (typeof window.ejecutarActualizacionConListaArchivos === "function") {
          await window.ejecutarActualizacionConListaArchivos("cache");
        } else {
          if ('caches' in window) {
            const keys = await caches.keys();
            for (const k of keys) await caches.delete(k);
          }
          location.reload();
        }
      }
    });
  }

  if (btnLimpiarCacheTotal) {
    btnLimpiarCacheTotal.addEventListener("click", async () => {
      if (confirm("⚠️ ¿Desea realizar una limpieza de caché total del sistema? (Su sesión permanecerá abierta)")) {
        if (typeof window.ejecutarActualizacionConListaArchivos === "function") {
          await window.ejecutarActualizacionConListaArchivos("cache_total");
        } else {
          if ('caches' in window) {
            const keys = await caches.keys();
            for (const k of keys) await caches.delete(k);
          }
          location.reload();
        }
      }
    });
  }
}

// Inicialización respetando readyState para módulos ES
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarACtrlUI);
} else {
  inicializarACtrlUI();
}

/**
 * Renderiza el panel de Cuenta
 */
function renderCuentaPanel(user) {
  const currentUser = user || (window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null);
  const unauthBox = document.getElementById("auth-unauthenticated");
  const authBox = document.getElementById("auth-authenticated");

  if (!unauthBox || !authBox) return;

  const email = (currentUser?.email || "").toLowerCase().trim();
  const loginBtn = document.getElementById("auth-login-btn");
  const logoutBtn = document.getElementById("auth-logout-btn");
  const adminActions = document.getElementById("auth-admin-actions");

  const cachedIsAdmin = localStorage.getItem('lh_auth_is_admin') === 'true';
  const isAdmin = (email === ADMIN_EMAIL.toLowerCase()) || (!email && cachedIsAdmin);

  // Permisos de Cuenta evaluados para el usuario actual o invitados
  const canLogin = typeof window.hasPermission === 'function' ? window.hasPermission("actrl_cuenta_login", email) : true;
  const canLogout = typeof window.hasPermission === 'function' ? window.hasPermission("actrl_cuenta_logout", email) : true;
  const canGuardar = isAdmin || (typeof window.hasPermission === 'function' ? window.hasPermission("actrl_cuenta_guardar_ajustes", email) : false);

  if (!currentUser) {
    unauthBox.style.display = "block";
    authBox.style.display = "none";
    if (loginBtn) {
      loginBtn.style.display = canLogin ? "inline-flex" : "none";
      loginBtn.onclick = () => window.firebaseAPI?.login?.();
    }
  } else {
    unauthBox.style.display = "none";
    authBox.style.display = "block";

    const name = currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "Hermano");
    const photo = currentUser.photoURL;

    const emailEl = document.getElementById("auth-user-email");
    const nameEl = document.getElementById("auth-user-welcome");
    const photoEl = document.getElementById("auth-user-photo");
    const iconEl = document.getElementById("auth-user-icon");
    const badgeAdmin = document.getElementById("auth-admin-badge");
    const badgeHermano = document.getElementById("auth-regular-badge");

    if (emailEl) emailEl.textContent = currentUser.email || email;
    if (nameEl) nameEl.textContent = `¡Hola, ${name}!`;

    if (photo && photoEl) {
      photoEl.src = photo;
      photoEl.style.display = "block";
      if (iconEl) iconEl.style.display = "none";
    } else if (iconEl) {
      if (photoEl) photoEl.style.display = "none";
      iconEl.style.display = "flex";
    }

    if (badgeAdmin) {
      badgeAdmin.style.display = isAdmin ? "inline-flex" : "none";
      badgeAdmin.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem;">admin_panel_settings</span> Administrador General`;
    }
    if (badgeHermano) badgeHermano.style.display = !isAdmin ? "inline-flex" : "none";
    if (adminActions) adminActions.style.display = canGuardar ? "flex" : "none";

    if (logoutBtn) {
      logoutBtn.style.display = canLogout ? "inline-flex" : "none";
      logoutBtn.onclick = async () => {
        if (confirm("¿Deseas cerrar sesión?")) {
          await window.firebaseAPI?.logout?.();
          window.location.reload();
        }
      };
    }
  }
}

/**
 * Renderiza la lista de miembros registrados
 */
function renderMiembrosList() {
  const container = document.getElementById("ac-members-list");
  if (!container) return;

  const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
  const currentEmail = (currentUser?.email || localStorage.getItem('lh_auth_email') || "").toLowerCase().trim();
  const cachedIsAdmin = localStorage.getItem('lh_auth_is_admin') === 'true';
  const isViewerAdmin = (currentEmail === ADMIN_EMAIL.toLowerCase()) || (!currentEmail && cachedIsAdmin);

  // 9 Sub-permisos de Miembros
  const canBuscador = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_buscador", currentEmail) : true;
  const canVerTodo = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_ver_todo", currentEmail) : true;
  const canVerCorreo = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_ver_correo", currentEmail) : true;
  const canVerBotones = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_ver_botones", currentEmail) : true;
  const canVerGrupo = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_ver_grupo", currentEmail) : true;
  const canVerGrupoActual = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_ver_grupo_actual", currentEmail) : true;
  const canBanear = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_banear", currentEmail) : true;
  const canEliminar = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_eliminar_registro", currentEmail) : true;
  const canCambiarGrupo = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_miembros_cambiar_grupo", currentEmail) : true;

  // 1. Control de Visibilidad del Buscador
  const searchBox = document.getElementById("ac-members-search-box");
  if (searchBox) {
    searchBox.style.display = canBuscador ? "flex" : "none";
  }

  // 2. Control de "Ver todo" (si no tiene permiso, no ve el listado de miembros)
  if (!canVerTodo) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.88rem; background: var(--card-bg, #fff); border-radius: 8px; border: 1px dashed var(--border-color, #ccc);">
        <span class="material-symbols-outlined" style="font-size: 2rem; color: #dc2626; display: block; margin-bottom: 6px;">visibility_off</span>
        No tienes permiso para ver la lista de miembros ("Ver todo").
      </div>
    `;
    return;
  }

  const searchInput = document.getElementById("ac-search-members-input");
  const query = (canBuscador && searchInput) ? searchInput.value.trim().toLowerCase() : "";

  let users = Array.from(accessControlState.registeredUsers);
  if (!users.includes(ADMIN_EMAIL)) users.unshift(ADMIN_EMAIL);

  // Si el observador no es el Administrador General:
  // Si un usuario NO ha autorizado ni su nombre ni su correo, NO se muestra nada de esa cuenta o de ese usuario
  if (!isViewerAdmin) {
    users = users.filter(u => {
      const isTargetAdmin = (u.toLowerCase() === ADMIN_EMAIL.toLowerCase());
      const isSelf = (currentEmail.toLowerCase() === u.toLowerCase());
      if (isTargetAdmin || isSelf) return true;

      const nameAuth = (typeof window.isUserNameAuthorized === 'function') && window.isUserNameAuthorized(u);
      const emailAuth = (typeof window.isUserEmailAuthorized === 'function') && window.isUserEmailAuthorized(u);

      // Ocultar por completo si no autorizó ni nombre ni correo
      return (nameAuth || emailAuth);
    });
  }

  if (query) {
    users = users.filter(u => {
      const name = accessControlState.registeredUserNames[u] || "";
      return u.toLowerCase().includes(query) || name.toLowerCase().includes(query);
    });
  }

  if (users.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.88rem; background: var(--card-bg, #fff); border-radius: 8px; border: 1px dashed var(--border-color, #ccc);">
        No hay miembros visibles para mostrar.
      </div>
    `;
    return;
  }

  const groupKeys = Object.keys(accessControlState.groups);

  container.innerHTML = users.map(userEmail => {
    let currentGid = "hermanos";
    groupKeys.forEach(gid => {
      if (accessControlState.groups[gid].userIds.has(userEmail)) {
        currentGid = gid;
      }
    });

    const isBanned = accessControlState.bannedUsers.has(userEmail);
    const isAdmin = (userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    let name = accessControlState.registeredUserNames[userEmail] || "";
    if (isAdmin && !name.includes("Administrador General")) {
      name = name ? `${name} (Administrador General)` : "Carlos David Báez (Administrador General)";
    }

    const optionsHtml = groupKeys.map(gid => {
      const g = accessControlState.groups[gid];
      const gName = (gid === "hermanos") ? "Hermano" : (g ? g.name : gid);
      return `<option value="${g.id}" ${gid === currentGid ? "selected" : ""}>${gName}</option>`;
    }).join("");

    // 3. Control de "ver correo", "Autorizo mostrar mi correo" y "Autorizo mostrar mi Nombre"
    let emailHtml = "";
    const isTargetAdmin = (userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    const isSelf = (currentEmail.toLowerCase() === userEmail.toLowerCase());
    const userAuthorized = (typeof window.isUserEmailAuthorized === 'function')
      ? window.isUserEmailAuthorized(userEmail)
      : false;
    const userNameAuthorized = (typeof window.isUserNameAuthorized === 'function')
      ? window.isUserNameAuthorized(userEmail)
      : false;

    if (canVerCorreo) {
      if (isViewerAdmin || isSelf || isTargetAdmin || userAuthorized) {
        let authBadge = "";
        if (isViewerAdmin && !isTargetAdmin) {
          authBadge = userAuthorized
            ? ' <span style="font-size:0.72rem; color:#16a34a; font-weight:600;">(Correo Autorizado)</span>'
            : ' <span style="font-size:0.72rem; color:#dc2626; font-weight:500;">(Correo No autorizado)</span>';
        }
        emailHtml = `<p>${userEmail}${authBadge} ${isBanned ? '<span style="color:red; font-weight:bold;">(Baneado)</span>' : ''}</p>`;
      } else {
        emailHtml = `<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">Correo privado ${isBanned ? '<span style="color:red; font-weight:bold;">(Baneado)</span>' : ''}</p>`;
      }
    } else if (isBanned) {
      emailHtml = `<p><span style="color:red; font-weight:bold;">(Baneado)</span></p>`;
    }

    // Ocultar nombre real si no está autorizado
    let displayName = name || "Hermano Registrado";
    if (!isTargetAdmin && !isViewerAdmin && !isSelf && !userNameAuthorized) {
      displayName = "Hermano Registrado";
    }

    let authNameBadge = "";
    if (isViewerAdmin && !isTargetAdmin) {
      authNameBadge = userNameAuthorized
        ? ' <span style="font-size:0.72rem; color:#16a34a; font-weight:600;">(Nombre Autorizado)</span>'
        : ' <span style="font-size:0.72rem; color:#dc2626; font-weight:500;">(Nombre No autorizado)</span>';
    }

    const titleText = isTargetAdmin
      ? (name || "Carlos David Báez (Administrador General)")
      : `${displayName}${authNameBadge}`;

    // 6. Control de "ver Grupo actual"
    const currentName = (currentGid === "hermanos") ? "Hermano" : (accessControlState.groups[currentGid]?.name || currentGid);
    const grupoActualHtml = canVerGrupoActual
      ? `<span style="font-size:0.75rem; color:var(--text-muted);">Grupo actual: <b>${currentName}</b></span>`
      : "";

    // Control de Autorizo mostrar mi Nombre y Autorizo mostrar mi correo en la tarjeta
    const canToggleConsent = isViewerAdmin || isSelf;
    let consentHtml = "";
    if (!isTargetAdmin) {
      consentHtml = `
        <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">
          <label style="font-size: 0.78rem; display: inline-flex; align-items: center; gap: 6px; cursor: ${canToggleConsent ? 'pointer' : 'default'}; color: ${userNameAuthorized ? '#16a34a' : 'var(--text-muted)'}; font-weight: ${userNameAuthorized ? '600' : '400'};">
            <input type="checkbox" class="ac-toggle-name-consent" data-email="${userEmail}" ${userNameAuthorized ? 'checked' : ''} ${!canToggleConsent ? 'disabled title="Solo el hermano o el Administrador pueden modificar este permiso"' : ''} style="cursor: ${canToggleConsent ? 'pointer' : 'default'}; accent-color: #16a34a;">
            <span>Autorizo mostrar mi Nombre</span>
          </label>
          <label style="font-size: 0.78rem; display: inline-flex; align-items: center; gap: 6px; cursor: ${canToggleConsent ? 'pointer' : 'default'}; color: ${userAuthorized ? '#16a34a' : 'var(--text-muted)'}; font-weight: ${userAuthorized ? '600' : '400'};">
            <input type="checkbox" class="ac-toggle-email-consent" data-email="${userEmail}" ${userAuthorized ? 'checked' : ''} ${!canToggleConsent ? 'disabled title="Solo el hermano o el Administrador pueden modificar este permiso"' : ''} style="cursor: ${canToggleConsent ? 'pointer' : 'default'}; accent-color: #16a34a;">
            <span>Autorizo mostrar mi correo</span>
          </label>
        </div>
      `;
    }

    // 5. Control de "ver grupo" y 9. "cambiar grupo"
    let grupoControlHtml = "";
    if (canVerGrupo) {
      if (isAdmin) {
        grupoControlHtml = '<span class="badge-rol admin"><span class="material-symbols-outlined" style="font-size:1rem;">lock</span> Administradores</span>';
      } else {
        grupoControlHtml = `
          <select class="form-control ac-change-group-select" data-email="${userEmail}" 
                  style="padding: 6px 10px; width: auto; ${!canCambiarGrupo ? 'opacity: 0.65; cursor: not-allowed;' : ''}"
                  ${!canCambiarGrupo ? 'disabled title="Sin permiso para cambiar grupo"' : ''}>
            ${optionsHtml}
          </select>
        `;
      }
    }

    // 4. Control de "ver botones", 7. "Banear", 8. "Eliminar Registro"
    let actionsHtml = "";
    if (canVerBotones) {
      if (isAdmin) {
        actionsHtml = `
          <div class="ac-member-actions">
            <span style="font-size:0.75rem; color:var(--accent-color); font-weight:700;">Administrador General</span>
          </div>
        `;
      } else {
        let insideButtons = "";
        if (canBanear) {
          insideButtons += `
            <button class="btn-cuenta-accion secundario ac-toggle-ban-btn" data-email="${userEmail}" style="padding: 4px 10px; font-size: 0.78rem; color: ${isBanned ? 'green' : '#dc2626'};">
              ${isBanned ? 'Desbanear' : 'Banear'}
            </button>
          `;
        }
        if (canEliminar) {
          insideButtons += `
            <button class="btn-cuenta-accion secundario ac-delete-user-btn" data-email="${userEmail}" style="padding: 4px 10px; font-size: 0.78rem; color: var(--text-muted);">
              Eliminar Registro
            </button>
          `;
        }
        if (insideButtons) {
          actionsHtml = `<div class="ac-member-actions">${insideButtons}</div>`;
        }
      }
    }

    return `
      <div class="ac-member-card ${isBanned ? 'banned' : ''}">
        <div class="ac-member-card-header">
          <div class="ac-member-info">
            <h4>${titleText}</h4>
            ${emailHtml}
            ${grupoActualHtml}
            ${consentHtml}
          </div>
          <div>
            ${grupoControlHtml}
          </div>
        </div>
        ${actionsHtml}
      </div>
    `;
  }).join("");

  // Event listener para Autorizo mostrar mi Nombre directo en la tarjeta
  container.querySelectorAll(".ac-toggle-name-consent").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const emailTarget = e.target.dataset.email;
      const checked = e.target.checked;
      if (typeof window.setUserNameConsent === 'function') {
        window.setUserNameConsent(emailTarget, checked);
      }
      renderMiembrosList();
      renderPermissionsPanel();
    });
  });

  // Event listener para Autorizo mostrar mi correo directo en la tarjeta
  container.querySelectorAll(".ac-toggle-email-consent").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const emailTarget = e.target.dataset.email;
      const checked = e.target.checked;
      if (typeof window.setUserEmailConsent === 'function') {
        window.setUserEmailConsent(emailTarget, checked);
      }
      renderMiembrosList();
      renderPermissionsPanel();
    });
  });

  if (canCambiarGrupo) {
    container.querySelectorAll(".ac-change-group-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const email = e.target.dataset.email;
        const gid = e.target.value;
        setUserPrimaryGroup(email, gid);
        alert(`El hermano ${email} ahora pertenece a "${accessControlState.groups[gid]?.name || gid}".`);
        renderMiembrosList();
        renderGruposList();
      });
    });
  }

  if (canBanear) {
    container.querySelectorAll(".ac-toggle-ban-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const email = btn.dataset.email;
        if (accessControlState.bannedUsers.has(email)) {
          await unbanUser(email);
          alert(`Hermano ${email} desbaneado.`);
        } else {
          await banUser(email);
          alert(`Hermano ${email} baneado.`);
        }
        renderMiembrosList();
      });
    });
  }

  if (canEliminar) {
    container.querySelectorAll(".ac-delete-user-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const email = btn.dataset.email;
        if (confirm(`¿Seguro que deseas eliminar el registro de ${email}?`)) {
          await deleteUserRegistration(email);
          renderMiembrosList();
          renderGruposList();
        }
      });
    });
  }
}

/**
 * Renderiza la lista de grupos
 */
function renderGruposList() {
  const container = document.getElementById("ac-groups-list");
  if (!container) return;

  const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
  const email = currentUser?.email || "";
  const canVerGrupo = (typeof window.hasPermission === 'function') ? (window.hasPermission("actrl_grupos_ver_grupo", email) || window.hasPermission("actrl_grupos", email)) : true;
  const canVerMiembros = (typeof window.hasPermission === 'function') ? (window.hasPermission("actrl_grupos_ver_miembros", email) || window.hasPermission("actrl_grupos", email)) : true;
  const canEditar = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_grupos_editar", email) : true;
  const canEliminar = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_grupos_eliminar", email) : true;

  if (!canVerGrupo) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.88rem; background: var(--card-bg, #fff); border-radius: 8px; border: 1px dashed var(--border-color, #ccc);">
        <span class="material-symbols-outlined" style="font-size: 2rem; color: #dc2626; display: block; margin-bottom: 6px;">visibility_off</span>
        No tienes permiso para ver los grupos ("ver grupo").
      </div>
    `;
    return;
  }

  const allKeys = Object.keys(accessControlState.groups);
  // Ordenar grupos: 'hermanos' de primero, grupos adicionales en medio, 'administradores' de ÚLTIMO
  const gKeys = [];
  if (allKeys.includes("hermanos")) gKeys.push("hermanos");
  allKeys.forEach(k => {
    if (k !== "hermanos" && k !== "administradores") gKeys.push(k);
  });
  if (allKeys.includes("administradores")) gKeys.push("administradores");

  container.innerHTML = gKeys.map(gid => {
    const g = accessControlState.groups[gid];
    const isBase = (gid === "administradores" || gid === "hermanos" || gid === "invitados");
    const countMembers = g.userIds ? g.userIds.size : 0;
    const countSub = g.subgroupIds ? g.subgroupIds.size : 0;
    const gName = (gid === "hermanos") ? "Hermano" : g.name;

    const miembrosSpan = canVerMiembros
      ? `<b>Miembros:</b> ${countMembers} | <b>Subgrupos anidados:</b> ${countSub}`
      : `<b>Subgrupos anidados:</b> ${countSub}`;

    return `
      <div class="ac-member-card">
        <div class="ac-member-card-header">
          <div class="ac-member-info">
            <h4>${gName} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">(${g.id})</span></h4>
            <p>${g.description || 'Sin descripción'}</p>
            <span style="font-size:0.75rem; color:var(--text-muted);">
              ${miembrosSpan}
            </span>
          </div>
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            ${canEditar ? `
              <button class="btn-cuenta-accion secundario ac-edit-group-btn" data-gid="${g.id}" style="padding: 4px 10px; font-size: 0.78rem; color: var(--accent-color); display: inline-flex; align-items: center; gap: 4px;" title="Editar nombre y descripción">
                <span class="material-symbols-outlined" style="font-size: 0.95rem;">edit</span>
                Editar
              </button>
            ` : ''}
            ${!isBase ? (canEliminar ? `
              <button class="btn-cuenta-accion secundario ac-delete-group-btn" data-gid="${g.id}" style="padding: 4px 10px; font-size: 0.78rem; color: #dc2626; display: inline-flex; align-items: center; gap: 4px;" title="Eliminar grupo permanentemente">
                <span class="material-symbols-outlined" style="font-size: 0.95rem;">delete</span>
                Eliminar
              </button>
            ` : '') : '<span style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-left: 4px;">Grupo Base</span>'}
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Botones de Editar
  container.querySelectorAll(".ac-edit-group-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const gid = btn.dataset.gid;
      abrirModalEditarGrupo(gid);
    });
  });

  // Botones de Eliminar
  container.querySelectorAll(".ac-delete-group-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const gid = btn.dataset.gid;
      const g = accessControlState.groups[gid];
      const gName = g ? g.name : gid;
      if (confirm(`¿Estás seguro de eliminar el grupo "${gName}" (${gid})? Sus miembros volverán al grupo Hermanos.`)) {
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:0.95rem;">hourglass_top</span> Eliminando...`;
        const ok = await deleteGroup(gid);
        if (ok) {
          renderGruposList();
          renderMiembrosList();
          renderSelectoresGrupos();
          alert(`Grupo "${gName}" eliminado correctamente.`);
        } else {
          btn.disabled = false;
          btn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 0.95rem;">delete</span> Eliminar`;
        }
      }
    });
  });
}

function abrirModalEditarGrupo(gid) {
  const g = accessControlState.groups[gid];
  if (!g) return;

  const modal = document.getElementById("modal-grupo");
  const title = document.getElementById("modal-grupo-title");
  const inputId = document.getElementById("modal-grupo-id");
  const inputIdDisplay = document.getElementById("modal-grupo-id-display");
  const inputName = document.getElementById("modal-grupo-name");
  const inputDesc = document.getElementById("modal-grupo-desc");

  if (!modal) return;

  if (inputId) inputId.value = gid;
  if (inputIdDisplay) inputIdDisplay.value = `${gid} (${g.name})`;
  if (inputName) inputName.value = g.name || "";
  if (inputDesc) inputDesc.value = g.description || "";
  if (title) title.textContent = `Editar Grupo: ${g.name}`;

  modal.style.display = "flex";
  if (inputName) {
    inputName.focus();
    inputName.select();
  }
}

function cerrarModalEditarGrupo() {
  const modal = document.getElementById("modal-grupo");
  if (modal) modal.style.display = "none";
}

/**
 * Renderiza los desplegables de selección de grupos
 */
function renderSelectoresGrupos() {
  const allKeys = Object.keys(accessControlState.groups);
  // Ordenar grupos: 'hermanos' de primero, grupos adicionales en medio, 'administradores' de ÚLTIMO
  const gKeys = [];
  if (allKeys.includes("hermanos")) gKeys.push("hermanos");
  allKeys.forEach(k => {
    if (k !== "hermanos" && k !== "administradores") gKeys.push(k);
  });
  if (allKeys.includes("administradores")) gKeys.push("administradores");

  const optionsHtml = gKeys.map(gid => {
    const g = accessControlState.groups[gid];
    const gName = (gid === "hermanos") ? "Hermano" : g.name;
    return `<option value="${g.id}">${gName} (${g.id})</option>`;
  }).join("");

  const selUser = document.getElementById("ac-select-group-user");
  if (selUser) selUser.innerHTML = optionsHtml;

  const selSub = document.getElementById("ac-select-subgroup");
  if (selSub) selSub.innerHTML = optionsHtml;

  const selParent = document.getElementById("ac-select-parentgroup");
  if (selParent) selParent.innerHTML = optionsHtml;

  const selPerm = document.getElementById("ac-select-group-perm");
  if (selPerm) {
    const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
    const userEmail = (currentUser?.email || "").toLowerCase().trim();
    const isAdmin = (userEmail === ADMIN_EMAIL.toLowerCase());

    const canMarcar = (typeof window.hasPermission === 'function') ? window.hasPermission("actrl_permisos_marcar", userEmail) : false;

    if (!isAdmin && !canMarcar && userEmail) {
      let myGroup = "hermanos";
      if (accessControlState.userDirectGroups && accessControlState.userDirectGroups[userEmail]) {
        myGroup = Array.from(accessControlState.userDirectGroups[userEmail])[0] || "hermanos";
      } else {
        allKeys.forEach(gid => {
          if (accessControlState.groups[gid]?.userIds?.has(userEmail)) myGroup = gid;
        });
      }
      const gName = (myGroup === "hermanos") ? "Hermano" : (accessControlState.groups[myGroup]?.name || myGroup);
      selPerm.innerHTML = `<option value="${myGroup}">${gName} (${myGroup})</option>`;
      selPerm.value = myGroup;
      selPerm.disabled = true;
    } else {
      selPerm.innerHTML = optionsHtml;
      selPerm.disabled = false;
      // Cargar último grupo editado pero NUNCA administradores, por defecto 'hermanos'
      const savedGroup = localStorage.getItem("lh_actrl_last_edited_group");
      if (savedGroup && savedGroup !== "administradores" && gKeys.includes(savedGroup)) {
        selPerm.value = savedGroup;
      } else if (gKeys.includes("hermanos")) {
        selPerm.value = "hermanos";
      }
    }
  }
}

/**
 * Helper para obtener solo las claves de permisos reales (hojas) de un subárbol
 */
function getLeafPermKeys(node) {
  let keys = [];
  if (node.children && node.children.length > 0) {
    node.children.forEach(c => {
      keys = keys.concat(getLeafPermKeys(c));
    });
  } else if (!node.key.startsWith("group_")) {
    keys.push(node.key);
  }
  return keys;
}

/**
 * Helper para obtener todos los descendientes de un nodo del árbol
 */
function getSubtreePermKeys(node) {
  let keys = [node.key];
  if (node.children) {
    node.children.forEach(c => {
      keys = keys.concat(getSubtreePermKeys(c));
    });
  }
  return keys;
}

/**
 * Filtra el árbol de permisos según el término de búsqueda ingresado
 * y expande automáticamente las categorías que contengan coincidencias.
 */
function searchPermissionTree(nodes, query) {
  const result = [];
  const q = (query || "").toLowerCase().trim();
  if (!q) return nodes;

  nodes.forEach(node => {
    const labelMatch = (node.label || "").toLowerCase().includes(q) || (node.key || "").toLowerCase().includes(q);
    if (node.children && node.children.length > 0) {
      const matchingChildren = searchPermissionTree(node.children, q);
      if (matchingChildren.length > 0) {
        expandedNodes.add(node.key);
        result.push({
          ...node,
          children: matchingChildren
        });
      } else if (labelMatch) {
        expandedNodes.add(node.key);
        result.push(node);
      }
    } else if (labelMatch) {
      result.push(node);
    }
  });
  return result;
}

/**
 * Filtra el árbol de permisos para mostrar únicamente aquellos a los que el grupo/usuario tiene autorización.
 * Oculta todos los permisos excepto los autorizados.
 */
function filterAuthorizedTree(nodes, group, isUserView, email) {
  return nodes.map(node => {
    if (node.children && node.children.length > 0) {
      const filteredChildren = filterAuthorizedTree(node.children, group, isUserView, email);
      if (filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren
        };
      }
      return null;
    }

    if (isUserView) {
      // Ocultar el interruptor 'Ver permisos autorizados' en la vista de usuario
      if (node.key === "inicio_ver_permisos_autorizados" || node.key === "actrl_permisos_ver_autorizados") return null;

      // El usuario solo ve los permisos a los que tiene acceso
      const hasPerm = group.permissions.has(node.key) ||
                      (typeof window.hasPermission === 'function' && window.hasPermission(node.key, email));
      if (hasPerm) {
        return node;
      }
      return null;
    }

    return node;
  }).filter(Boolean);
}

/**
 * Construye recursivamente el HTML del árbol anidado de permisos
 */
function buildTreeHtml(nodes, depth, group, isUserView = false, email = "", searchQuery = "") {
  // Si el grupo tiene Acceso Total (* / Administrador) o es administradores, ¡TODOS los permisos están marcados!
  const hasTotalAccess = group.permissions.has("*") || (group.id === "administradores");

  return nodes.map(node => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.key);

    let isChecked = false;
    let isIndeterminate = false;

    if (hasTotalAccess) {
      isChecked = true;
      isIndeterminate = false;
    } else if (hasChildren) {
      const leafKeys = getLeafPermKeys(node);
      if (leafKeys.length > 0) {
        const checkedCount = leafKeys.filter(k => group.permissions.has(k)).length;
        isChecked = (checkedCount === leafKeys.length);
        isIndeterminate = (checkedCount > 0 && checkedCount < leafKeys.length);
      }
    } else {
      isChecked = group.permissions.has(node.key);
    }

    // Para el grupo Administradores, todo está concedido, protegido y bloqueado
    const isProtectedAdmin = (group.id === "administradores");
    if (isProtectedAdmin) {
      isChecked = true;
      isIndeterminate = false;
    }

    const toggleSign = hasChildren 
      ? `<span class="ac-tree-toggle material-symbols-outlined" data-key="${node.key}" style="font-size: 1.15rem; cursor: pointer; user-select: none; color: var(--accent-color); margin-right: 6px; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 4px; background: rgba(0,0,0,0.04);">${isExpanded ? 'remove' : 'add'}</span>`
      : `<span style="width: 28px; display: inline-block;"></span>`;

    const paddingLeft = depth * 22;

    const childrenHtml = (hasChildren && isExpanded)
      ? `<div style="display: flex; flex-direction: column;">${buildTreeHtml(node.children, depth + 1, group, isUserView, email, searchQuery)}</div>`
      : '';

    const labelStyle = isProtectedAdmin
      ? `cursor: default; margin: 0; font-weight: ${depth === 0 ? '700' : (hasChildren ? '600' : '500')}; color: ${node.key === '*' ? 'var(--accent-color)' : 'var(--text-color)'}; display: inline-flex; align-items: center; gap: 4px;`
      : `cursor: pointer; margin: 0; font-weight: ${depth === 0 ? '700' : (hasChildren ? '600' : '400')}; color: var(--text-color);`;

    const labelExtra = (isProtectedAdmin && node.key === '*')
      ? '<span class="material-symbols-outlined" style="font-size: 1.05rem; vertical-align: middle; color: var(--accent-color);" title="Permiso Protegido de Administrador">lock</span>'
      : '';

    let checkboxDisabled = isProtectedAdmin
      ? 'disabled style="cursor: not-allowed; opacity: 0.85;" title="El grupo Administradores posee Acceso Total sobre todas las funciones y no se puede modificar."'
      : '';

    // Si es un usuario normal marcando 'Autorizo mostrar mi correo', siempre está habilitado
    if (isUserView && node.key === "actrl_miembros_autorizo_mostrar_correo") {
      checkboxDisabled = '';
    }

    let displayLabel = node.label || "";
    if (searchQuery && node.label) {
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      displayLabel = node.label.replace(regex, '<mark style="background: rgba(255, 235, 59, 0.45); color: inherit; padding: 0 3px; border-radius: 3px; font-weight: 700;">$1</mark>');
    }

    return `
      <div class="ac-tree-row-container" style="display: flex; flex-direction: column;">
        <div class="perm-item-row" style="padding-left: ${paddingLeft + 12}px; background: ${depth === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'};">
          <div style="display: flex; align-items: center; flex: 1;">
            ${toggleSign}
            <label for="perm-${node.key}" style="${labelStyle}">
              ${displayLabel} ${labelExtra}
            </label>
          </div>
          <input type="checkbox" id="perm-${node.key}" class="perm-checkbox ac-perm-checkbox" data-key="${node.key}" data-indeterminate="${isIndeterminate ? 'true' : 'false'}" ${isChecked ? 'checked' : ''} ${checkboxDisabled}>
        </div>
        ${childrenHtml}
      </div>
    `;
  }).join("");
}

/**
 * Renderiza la matriz jerárquica de permisos para el grupo seleccionado
 */
function renderPermissionsPanel() {
  const selectGroup = document.getElementById("ac-select-group-perm");
  const container = document.getElementById("ac-permissions-checkboxes");
  if (!selectGroup || !container) return;

  const gid = selectGroup.value;
  const group = accessControlState.groups[gid];
  if (!group) return;

  const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
  const email = (currentUser?.email || localStorage.getItem('lh_auth_email') || "").toLowerCase().trim();
  const cachedIsAdmin = localStorage.getItem('lh_auth_is_admin') === 'true';
  const isAdmin = (email === ADMIN_EMAIL.toLowerCase()) || (!email && cachedIsAdmin);
  const isUserView = !isAdmin;

  const canMarcar = isAdmin || ((typeof window.hasPermission === 'function') ? window.hasPermission("actrl_permisos_marcar", email) : false);
  const canVerAutorizados = (typeof window.hasPermission === 'function')
    ? (window.hasPermission("actrl_permisos_ver_autorizados", email) || window.hasPermission("inicio_ver_permisos_autorizados", email) || group.permissions.has("actrl_permisos_ver_autorizados") || group.permissions.has("inicio_ver_permisos_autorizados"))
    : false;

  // Si es un usuario normal (no admin):
  if (isUserView) {
    if (!canMarcar && !canVerAutorizados) {
      // "sino tiene permiso no puede ver nada sino solo la pantalla en el modulo sin nada"
      container.innerHTML = "";
      return;
    }
  }

  const searchInput = document.getElementById("ac-search-permissions-input");
  const query = (searchInput?.value || "").trim();

  let treeToRender = PERMISSION_TREE;
  if (isUserView && canVerAutorizados && !canMarcar) {
    // "y si lo marco puede ver solo los permisos a los que tiene acceso"
    treeToRender = filterAuthorizedTree(PERMISSION_TREE, group, true, email);
  }

  if (query) {
    treeToRender = searchPermissionTree(treeToRender, query);
  }

  if (isUserView && treeToRender.length === 0 && !query) {
    container.innerHTML = "";
    return;
  }

  if (treeToRender.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 20px; color: var(--text-muted);">
        <span class="material-symbols-outlined" style="font-size: 2.2rem; opacity: 0.45; display: block; margin-bottom: 8px;">search_off</span>
        No se encontraron permisos que coincidan con "<strong>${query.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</strong>".
      </div>
    `;
    return;
  }

  container.innerHTML = buildTreeHtml(treeToRender, 0, group, isUserView, email, query);

  // Aplicar estado indeterminado visualmente
  container.querySelectorAll(".ac-perm-checkbox[data-indeterminate='true']").forEach(chk => {
    chk.indeterminate = true;
  });

  // Aplicar restricción si no tiene permiso de marcar o si es el grupo Administradores
  if (!isAdmin && !canMarcar) {
    container.querySelectorAll(".ac-perm-checkbox").forEach(chk => {
      chk.disabled = true;
      chk.title = "No tienes permiso para marcar o modificar permisos";
    });
  } else if (group.id === "administradores") {
    container.querySelectorAll(".ac-perm-checkbox").forEach(chk => {
      chk.disabled = true;
      chk.checked = true;
      chk.title = "El grupo Administradores posee Acceso Total sobre todas las funciones del sistema.";
    });
  } else if (!isAdmin) {
    // Protección para no-administradores: no pueden marcar Acceso Total (*)
    const chkAll = container.querySelector(".ac-perm-checkbox[data-key='*']");
    if (chkAll) {
      chkAll.disabled = true;
      chkAll.title = "Solo el Administrador General puede conceder Acceso Total (*)";
    }
  }

  // Toggle de expandir / contraer (+) y (-)
  container.querySelectorAll(".ac-tree-toggle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const k = btn.dataset.key;
      if (expandedNodes.has(k)) expandedNodes.delete(k);
      else expandedNodes.add(k);
      renderPermissionsPanel();
    });
  });

  // Checkboxes de permisos
  container.querySelectorAll(".ac-perm-checkbox").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const key = e.target.dataset.key;
      const checked = e.target.checked;

      // Protección absoluta: no se puede editar ni desmarcar permisos para el grupo administradores
      if (group.id === "administradores") {
        e.target.checked = true;
        group.permissions.add("*");
        Object.values(PERMISSIONS).forEach(p => group.permissions.add(p));
        saveAccessControl();
        alert("El grupo Administradores posee Acceso Total (* / Administrador) y control completo sobre todas las funciones. No se pueden desactivar sus permisos.");
        return;
      }

      // Buscar el nodo en el árbol
      function findNode(nodes, targetKey) {
        for (let n of nodes) {
          if (n.key === targetKey) return n;
          if (n.children) {
            const found = findNode(n.children, targetKey);
            if (found) return found;
          }
        }
        return null;
      }

      const node = findNode(PERMISSION_TREE, key);
      if (node && node.children && node.children.length > 0) {
        // Es un nodo padre/categoría: afecta a todos sus descendientes hoja
        const leafKeys = getLeafPermKeys(node);
        if (!checked && group.permissions.has("*") && group.id !== "administradores") {
          group.permissions.delete("*");
          Object.values(PERMISSIONS).forEach(p => {
            if (p !== "*" && !leafKeys.includes(p)) group.permissions.add(p);
          });
        }
        leafKeys.forEach(k => {
          if (checked) group.permissions.add(k);
          else group.permissions.delete(k);
        });
        if (checked && !key.startsWith("group_")) group.permissions.add(key);
        else group.permissions.delete(key);
      } else {
        // Es una hoja individual (ej: "Iniciar Sesion", "Cerrar sesion", "Guardar Ajustes", "*")
        if (!checked && group.permissions.has("*") && group.id !== "administradores") {
          // Desarmar comodín '*' para que desmarcar este permiso realmente surta efecto
          group.permissions.delete("*");
          if (key === "*") {
            group.permissions.clear();
          } else {
            Object.values(PERMISSIONS).forEach(p => {
              if (p !== "*" && p !== key) group.permissions.add(p);
            });
          }
        }
        if (checked) {
          group.permissions.add(key);
          if (key === "*") {
            Object.values(PERMISSIONS).forEach(p => group.permissions.add(p));
          }
        } else {
          group.permissions.delete(key);
        }
      }

      // Asegurar que administradores nunca pierda Acceso Total
      if (group.id === "administradores") {
        group.permissions.add(PERMISSIONS.ALL);
      } else {
        localStorage.setItem("lh_actrl_last_edited_group", group.id);
      }

      saveAccessControl();
      saveGroupConfigToCloud();
      renderPermissionsPanel();
      renderCuentaPanel();
      window.dispatchEvent(new CustomEvent("lh-access-control-updated"));
    });
  });
}
