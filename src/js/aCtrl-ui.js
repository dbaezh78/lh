/**
 * src/js/aCtrl-ui.js - Controlador Visual para la Página aCtrl.html
 */

import {
  accessControlState,
  ADMIN_EMAIL,
  createGroup,
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

document.addEventListener("DOMContentLoaded", () => {
  // Pestañas Principales (Cuenta vs Acceso)
  const mainTabBtns = document.querySelectorAll(".user-tab-btn");
  const mainPanels = document.querySelectorAll(".user-panel-content");
  const accessSubtabBtns = document.querySelectorAll(".access-subtab-btn");
  const accessSubpanels = document.querySelectorAll(".access-subpanel");

  // Activa la pestaña principal respetando permisos y guardando en localStorage
  function activarMainTab(targetTab) {
    const tabAccessBtn = document.getElementById("tab-btn-access");
    const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
    const email = currentUser?.email || "";
    const isAdmin = (email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    const canAccess = isAdmin || (typeof window.hasPermission === 'function' && (window.hasPermission("page_actrl") || window.hasPermission("manage_access")));

    let finalTab = targetTab;
    if (finalTab === "access" && !canAccess) {
      finalTab = "account";
    }

    mainTabBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === finalTab));
    mainPanels.forEach(p => {
      p.style.display = (p.id === `user-panel-${finalTab}`) ? "block" : "none";
    });
    localStorage.setItem("lh_actrl_main_tab", finalTab);

    if (finalTab === "access") {
      const savedSubtab = localStorage.getItem("lh_actrl_subtab") || "members";
      activarSubtab(savedSubtab);
    }
  }

  // Activa la subpestaña de Acceso guardando en localStorage
  function activarSubtab(targetSubtab) {
    accessSubtabBtns.forEach(b => b.classList.toggle("active", b.dataset.subtab === targetSubtab));
    accessSubpanels.forEach(p => {
      p.style.display = (p.id === `access-subpanel-${targetSubtab}`) ? "block" : "none";
    });
    localStorage.setItem("lh_actrl_subtab", targetSubtab);
    if (targetSubtab === "permissions") renderPermissionsPanel();
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
    const currentUser = user || (window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null);
    const email = currentUser?.email || "";
    const isAdmin = (email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    const canAccess = isAdmin || (typeof window.hasPermission === 'function' && (window.hasPermission("page_actrl") || window.hasPermission("manage_access")));

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

  // Expandir inicialmente los nodos principales y subgrupos
  function expandirTodo(nodes) {
    nodes.forEach(n => {
      if (n.children) {
        expandedNodes.add(n.key);
        expandirTodo(n.children);
      }
    });
  }
  expandirTodo(PERMISSION_TREE);

  // Render inicial y restauración de posición guardada
  renderCuentaPanel();
  renderMiembrosList();
  renderGruposList();
  renderSelectoresGrupos();

  const savedMainTab = localStorage.getItem("lh_actrl_main_tab") || "account";
  const savedSubtab = localStorage.getItem("lh_actrl_subtab") || "members";
  activarMainTab(savedMainTab);
  activarSubtab(savedSubtab);
  verificarVisibilidadPestanaAcceso();

  // Escuchar estado de autenticación
  if (window.firebaseAPI?.onAuthReady) {
    window.firebaseAPI.onAuthReady((user) => {
      verificarVisibilidadPestanaAcceso(user);
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
    renderCuentaPanel();
    renderMiembrosList();
    renderGruposList();
    renderSelectoresGrupos();
    const subtab = localStorage.getItem("lh_actrl_subtab") || "members";
    if (subtab === "permissions") renderPermissionsPanel();
  });

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
      if (!selectG || !emailIn || !emailIn.value.trim()) {
        alert("Ingresa un correo electrónico de un hermano.");
        return;
      }
      setUserPrimaryGroup(emailIn.value.trim(), selectG.value);
      alert(`Hermano agregado al grupo ${selectG.value}.`);
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

      resultBox.innerHTML = `
        <div style="margin-bottom: 8px;"><b>Hermano:</b> ${email}</div>
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
    selectGroupPerm.addEventListener("change", renderPermissionsPanel);
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
});

/**
 * Renderiza el panel de Cuenta
 */
function renderCuentaPanel(user) {
  const currentUser = user || (window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null);
  const unauthBox = document.getElementById("auth-unauthenticated");
  const authBox = document.getElementById("auth-authenticated");

  if (!unauthBox || !authBox) return;

  if (!currentUser) {
    unauthBox.style.display = "block";
    authBox.style.display = "none";
    const loginBtn = document.getElementById("auth-login-btn");
    if (loginBtn) {
      loginBtn.onclick = () => window.firebaseAPI?.login?.();
    }
  } else {
    unauthBox.style.display = "none";
    authBox.style.display = "block";

    const email = currentUser.email || "";
    const name = currentUser.displayName || email.split("@")[0];
    const photo = currentUser.photoURL;

    const emailEl = document.getElementById("auth-user-email");
    const nameEl = document.getElementById("auth-user-welcome");
    const photoEl = document.getElementById("auth-user-photo");
    const iconEl = document.getElementById("auth-user-icon");
    const badgeAdmin = document.getElementById("auth-admin-badge");
    const badgeHermano = document.getElementById("auth-regular-badge");
    const adminActions = document.getElementById("auth-admin-actions");

    if (emailEl) emailEl.textContent = email;
    if (nameEl) nameEl.textContent = `¡Hola, ${name}!`;

    if (photo && photoEl) {
      photoEl.src = photo;
      photoEl.style.display = "block";
      if (iconEl) iconEl.style.display = "none";
    } else if (iconEl) {
      if (photoEl) photoEl.style.display = "none";
      iconEl.style.display = "flex";
    }

    const isAdmin = (email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    if (badgeAdmin) badgeAdmin.style.display = isAdmin ? "inline-flex" : "none";
    if (badgeHermano) badgeHermano.style.display = !isAdmin ? "inline-flex" : "none";
    if (adminActions) adminActions.style.display = isAdmin ? "flex" : "none";

    const logoutBtn = document.getElementById("auth-logout-btn");
    if (logoutBtn) {
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

  const searchInput = document.getElementById("ac-search-members-input");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  let users = Array.from(accessControlState.registeredUsers);
  if (!users.includes(ADMIN_EMAIL)) users.unshift(ADMIN_EMAIL);

  if (query) {
    users = users.filter(u => {
      const name = accessControlState.registeredUserNames[u] || "";
      return u.toLowerCase().includes(query) || name.toLowerCase().includes(query);
    });
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
    const isAdmin = (userEmail === ADMIN_EMAIL);
    const name = accessControlState.registeredUserNames[userEmail] || "";

    const optionsHtml = groupKeys.map(gid => {
      const g = accessControlState.groups[gid];
      return `<option value="${g.id}" ${gid === currentGid ? "selected" : ""}>${g.name}</option>`;
    }).join("");

    return `
      <div class="ac-member-card ${isBanned ? 'banned' : ''}">
        <div class="ac-member-card-header">
          <div class="ac-member-info">
            <h4>${name || userEmail}</h4>
            <p>${userEmail} ${isBanned ? '<span style="color:red; font-weight:bold;">(Baneado)</span>' : ''}</p>
            <span style="font-size:0.75rem; color:var(--text-muted);">Grupo actual: <b>${accessControlState.groups[currentGid]?.name || currentGid}</b></span>
          </div>
          <div>
            ${isAdmin 
              ? '<span class="badge-rol admin"><span class="material-symbols-outlined" style="font-size:1rem;">lock</span> Administradores</span>'
              : `<select class="form-control ac-change-group-select" data-email="${userEmail}" style="padding: 6px 10px; width: auto;">
                  ${optionsHtml}
                 </select>`
            }
          </div>
        </div>
        <div class="ac-member-actions">
          ${!isAdmin ? `
            <button class="btn-cuenta-accion secundario ac-toggle-ban-btn" data-email="${userEmail}" style="padding: 4px 10px; font-size: 0.78rem; color: ${isBanned ? 'green' : '#dc2626'};">
              ${isBanned ? 'Desbanear' : 'Banear'}
            </button>
            <button class="btn-cuenta-accion secundario ac-delete-user-btn" data-email="${userEmail}" style="padding: 4px 10px; font-size: 0.78rem; color: var(--text-muted);">
              Eliminar Registro
            </button>
          ` : '<span style="font-size:0.75rem; color:var(--accent-color); font-weight:700;">Administrador Principal</span>'}
        </div>
      </div>
    `;
  }).join("");

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

/**
 * Renderiza la lista de grupos
 */
function renderGruposList() {
  const container = document.getElementById("ac-groups-list");
  if (!container) return;

  const gKeys = Object.keys(accessControlState.groups);

  container.innerHTML = gKeys.map(gid => {
    const g = accessControlState.groups[gid];
    const isBase = (gid === "administradores" || gid === "hermanos" || gid === "invitados");
    const countMembers = g.userIds ? g.userIds.size : 0;
    const countSub = g.subgroupIds ? g.subgroupIds.size : 0;

    return `
      <div class="ac-member-card">
        <div class="ac-member-card-header">
          <div class="ac-member-info">
            <h4>${g.name} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">(${g.id})</span></h4>
            <p>${g.description || 'Sin descripción'}</p>
            <span style="font-size:0.75rem; color:var(--text-muted);">
              <b>Miembros:</b> ${countMembers} | <b>Subgrupos anidados:</b> ${countSub}
            </span>
          </div>
          <div>
            ${!isBase ? `
              <button class="btn-cuenta-accion secundario ac-delete-group-btn" data-gid="${g.id}" style="padding: 4px 10px; font-size: 0.78rem; color: #dc2626;">
                Eliminar
              </button>
            ` : '<span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Grupo Base</span>'}
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".ac-delete-group-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const gid = btn.dataset.gid;
      if (confirm(`¿Eliminar el grupo "${gid}"? Sus miembros volverán al grupo Hermanos.`)) {
        deleteGroup(gid);
        renderGruposList();
        renderMiembrosList();
        renderSelectoresGrupos();
      }
    });
  });
}

/**
 * Renderiza los desplegables de selección de grupos
 */
function renderSelectoresGrupos() {
  const gKeys = Object.keys(accessControlState.groups);
  const optionsHtml = gKeys.map(gid => {
    const g = accessControlState.groups[gid];
    return `<option value="${g.id}">${g.name} (${g.id})</option>`;
  }).join("");

  const selUser = document.getElementById("ac-select-group-user");
  if (selUser) selUser.innerHTML = optionsHtml;

  const selSub = document.getElementById("ac-select-subgroup");
  if (selSub) selSub.innerHTML = optionsHtml;

  const selParent = document.getElementById("ac-select-parentgroup");
  if (selParent) selParent.innerHTML = optionsHtml;

  const selPerm = document.getElementById("ac-select-group-perm");
  if (selPerm) {
    const curVal = selPerm.value;
    selPerm.innerHTML = optionsHtml;
    if (curVal && gKeys.includes(curVal)) selPerm.value = curVal;
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
 * Construye recursivamente el HTML del árbol anidado de permisos
 */
function buildTreeHtml(nodes, depth, group) {
  return nodes.map(node => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.key);

    let isChecked = false;
    let isIndeterminate = false;

    if (hasChildren) {
      const leafKeys = getLeafPermKeys(node);
      if (leafKeys.length > 0) {
        const checkedCount = leafKeys.filter(k => group.permissions.has(k)).length;
        isChecked = (checkedCount === leafKeys.length);
        isIndeterminate = (checkedCount > 0 && checkedCount < leafKeys.length);
      }
    } else {
      isChecked = group.permissions.has(node.key);
    }

    const toggleSign = hasChildren 
      ? `<span class="ac-tree-toggle material-symbols-outlined" data-key="${node.key}" style="font-size: 1.15rem; cursor: pointer; user-select: none; color: var(--accent-color); margin-right: 6px; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 4px; background: rgba(0,0,0,0.04);">${isExpanded ? 'remove' : 'add'}</span>`
      : `<span style="width: 28px; display: inline-block;"></span>`;

    const paddingLeft = depth * 22;

    const childrenHtml = (hasChildren && isExpanded)
      ? `<div style="display: flex; flex-direction: column;">${buildTreeHtml(node.children, depth + 1, group)}</div>`
      : '';

    return `
      <div class="ac-tree-row-container" style="display: flex; flex-direction: column;">
        <div class="perm-item-row" style="padding-left: ${paddingLeft + 12}px; background: ${depth === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'};">
          <div style="display: flex; align-items: center; flex: 1;">
            ${toggleSign}
            <label for="perm-${node.key}" style="cursor: pointer; margin: 0; font-weight: ${depth === 0 ? '700' : (hasChildren ? '600' : '400')}; color: var(--text-color);">
              ${node.label}
            </label>
          </div>
          <input type="checkbox" id="perm-${node.key}" class="perm-checkbox ac-perm-checkbox" data-key="${node.key}" data-indeterminate="${isIndeterminate ? 'true' : 'false'}" ${isChecked ? 'checked' : ''}>
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

  container.innerHTML = buildTreeHtml(PERMISSION_TREE, 0, group);

  // Aplicar estado indeterminado visualmente
  container.querySelectorAll(".ac-perm-checkbox[data-indeterminate='true']").forEach(chk => {
    chk.indeterminate = true;
  });

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
        leafKeys.forEach(k => {
          if (checked) group.permissions.add(k);
          else group.permissions.delete(k);
        });
        if (checked && !key.startsWith("group_")) group.permissions.add(key);
        else group.permissions.delete(key);
      } else {
        // Es una hoja individual (ej: "Ver página", "Guardar cambios"): SOLO afecta a este permiso
        if (checked) group.permissions.add(key);
        else group.permissions.delete(key);
      }

      saveAccessControl();
      saveGroupConfigToCloud();
      renderPermissionsPanel();
    });
  });
}
