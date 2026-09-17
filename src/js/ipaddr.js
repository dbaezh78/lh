/**
 * src/js/ipaddr.js - Control y Monitoreo de Direcciones IP y Baneos
 */

import { ADMIN_EMAIL } from "./accesscontrol.js";

const STORAGE_KEY = "lh_user_ips";
let localIpRecords = [];
let unsubscribeFirestore = null;

// Elementos del DOM
const tbody = document.getElementById("tbody-ips");
const searchInput = document.getElementById("ip-search-input");
const filterStatusSelect = document.getElementById("ip-filter-status");

const metricTotal = document.getElementById("metric-total-ips");
const metricNormal = document.getElementById("metric-normal-ips");
const metricSuspicious = document.getElementById("metric-suspicious-ips");
const metricBanned = document.getElementById("metric-banned-ips");

const btnRecargar = document.getElementById("btn-recargar-ips");
const btnAgregarManual = document.getElementById("btn-agregar-ip-manual");

const modal = document.getElementById("modal-ip");
const modalTitle = document.getElementById("modal-ip-title");
const formModal = document.getElementById("form-ip-modal");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const btnCancelarModal = document.getElementById("btn-cancelar-modal");

const inputRecordId = document.getElementById("modal-record-id");
const inputIp = document.getElementById("modal-input-ip");
const inputEmail = document.getElementById("modal-input-email");
const inputName = document.getElementById("modal-input-name");
const selectStatus = document.getElementById("modal-select-status");
const textareaReason = document.getElementById("modal-textarea-reason");

/**
 * Muestra notificación Toast flotante
 */
function mostrarToast(mensaje, tipo = "exito") {
  const toast = document.getElementById("toast-notificacion");
  if (!toast) return;
  toast.textContent = mensaje;
  toast.style.display = "block";
  toast.style.borderLeftColor = (tipo === "error") ? "#ef4444" : "#00c853";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3200);
}

/**
 * Carga registros locales
 */
function cargarRegistrosLocales() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    localIpRecords = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Error leyendo IPs locales:", e);
    localIpRecords = [];
  }
}

/**
 * Guarda registros en localStorage
 */
function guardarRegistrosLocales() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localIpRecords));
  } catch (e) {
    console.warn("Error guardando IPs locales:", e);
  }
}

/**
 * Actualiza contadores métricos
 */
function actualizarMetricas() {
  const total = localIpRecords.length;
  const normal = localIpRecords.filter(r => (r.status || "Normal") === "Normal").length;
  const sospechosas = localIpRecords.filter(r => r.status === "Sospechosa").length;
  const baneadas = localIpRecords.filter(r => r.status === "Baneada").length;

  if (metricTotal) metricTotal.textContent = total;
  if (metricNormal) metricNormal.textContent = normal;
  if (metricSuspicious) metricSuspicious.textContent = sospechosas;
  if (metricBanned) metricBanned.textContent = baneadas;
}

/**
 * Formatea fecha ISO a formato local legible
 */
function formatearFecha(isoString) {
  if (!isoString) return "Fecha no registrada";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return isoString;
  }
}

function getCurrentEmail() {
  const currentUser = window.firebaseAPI?.getCurrentUser ? window.firebaseAPI.getCurrentUser() : null;
  return (currentUser?.email || "").toLowerCase().trim();
}

function checkIpPermission(permKey) {
  const email = getCurrentEmail();
  if (email === ADMIN_EMAIL.toLowerCase()) return true;
  if (typeof window.hasPermission === "function") {
    return window.hasPermission(permKey, email);
  }
  return true;
}

/**
 * Renderiza la tabla de IPs
 */
function renderTabla() {
  if (!tbody) return;

  const canVerUsuario = checkIpPermission("ipaddr_ver_usuario");
  const canVerIp = checkIpPermission("ipaddr_ver_ip");
  const canUltimoAcceso = checkIpPermission("ipaddr_ultimo_acceso");
  const canEstado = checkIpPermission("ipaddr_estado");
  const canMotivo = checkIpPermission("ipaddr_motivo");
  const canBanear = checkIpPermission("ipaddr_banear");
  const canEditar = checkIpPermission("ipaddr_editar");
  const canEliminar = checkIpPermission("ipaddr_eliminar");
  const canAcciones = canBanear || canEditar || canEliminar;

  // Actualizar visibilidad de encabezados de columna
  const thUsuario = document.getElementById("th-ip-usuario");
  const thDireccion = document.getElementById("th-ip-direccion");
  const thUltimoAcceso = document.getElementById("th-ip-ultimo-acceso");
  const thEstado = document.getElementById("th-ip-estado");
  const thMotivo = document.getElementById("th-ip-motivo");
  const thAcciones = document.getElementById("th-ip-acciones");

  if (thUsuario) thUsuario.style.display = canVerUsuario ? "" : "none";
  if (thDireccion) thDireccion.style.display = canVerIp ? "" : "none";
  if (thUltimoAcceso) thUltimoAcceso.style.display = canUltimoAcceso ? "" : "none";
  if (thEstado) thEstado.style.display = canEstado ? "" : "none";
  if (thMotivo) thMotivo.style.display = canMotivo ? "" : "none";
  if (thAcciones) thAcciones.style.display = canAcciones ? "" : "none";

  if (btnAgregarManual) {
    btnAgregarManual.style.display = canEditar ? "inline-flex" : "none";
  }

  const visibleCols = [canVerUsuario, canVerIp, canUltimoAcceso, canEstado, canMotivo, canAcciones].filter(Boolean).length || 1;

  const query = (searchInput ? searchInput.value.trim().toLowerCase() : "");
  const statusFilter = (filterStatusSelect ? filterStatusSelect.value : "todos");

  let filtrados = [...localIpRecords];

  if (statusFilter !== "todos") {
    filtrados = filtrados.filter(r => (r.status || "Normal") === statusFilter);
  }

  if (query) {
    filtrados = filtrados.filter(r => {
      const email = (r.email || "").toLowerCase();
      const ip = (r.ip || "").toLowerCase();
      const name = (r.displayName || "").toLowerCase();
      const reason = (r.reason || "").toLowerCase();
      return email.includes(query) || ip.includes(query) || name.includes(query) || reason.includes(query);
    });
  }

  actualizarMetricas();

  if (filtrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="${visibleCols}" class="tabla-vacia">
          <span class="material-symbols-outlined">search_off</span>
          No se encontraron registros de IP con los filtros aplicados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtrados.map(record => {
    const estado = record.status || "Normal";
    const esBaneada = (estado === "Baneada");
    let badgeClase = "normal";
    let badgeIcono = "check_circle";

    if (estado === "Sospechosa") {
      badgeClase = "sospechosa";
      badgeIcono = "warning";
    } else if (estado === "Baneada") {
      badgeClase = "baneada";
      badgeIcono = "gavel";
    }

    const avatarHtml = record.photoURL
      ? `<img src="${record.photoURL}" alt="${record.displayName || 'Usuario'}" class="avatar-usuario">`
      : `<span class="avatar-placeholder-usuario material-symbols-outlined">person</span>`;

    return `
      <tr data-id="${record.id}">
        ${canVerUsuario ? `
        <td>
          <div class="celda-usuario">
            ${avatarHtml}
            <div class="usuario-detalles">
              <span class="usuario-nombre">${record.displayName || 'Hermano'}</span>
              <span class="usuario-email">${record.email}</span>
            </div>
          </div>
        </td>` : ""}
        ${canVerIp ? `
        <td>
          <span class="badge-ip">
            <span class="material-symbols-outlined" style="font-size: 1rem; color: var(--accent-color);">lan</span>
            ${record.ip}
          </span>
        </td>` : ""}
        ${canUltimoAcceso ? `
        <td>
          <span style="font-size: 0.84rem; color: var(--text-color);">
            ${formatearFecha(record.lastLogin)}
          </span>
        </td>` : ""}
        ${canEstado ? `
        <td>
          <span class="badge-estado ${badgeClase}">
            <span class="material-symbols-outlined" style="font-size: 0.95rem;">${badgeIcono}</span>
            ${estado}
          </span>
        </td>` : ""}
        ${canMotivo ? `
        <td>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-style: ${record.reason ? 'normal' : 'italic'};">
            ${record.reason || 'Sin observaciones'}
          </span>
        </td>` : ""}
        ${canAcciones ? `
        <td>
          <div class="acciones-fila">
            ${canBanear ? `
            <button class="btn-accion-fila ban ${esBaneada ? 'baneado' : ''}" data-action="ban" data-id="${record.id}" title="${esBaneada ? 'Desbanear IP y Usuario' : 'Banear IP y Usuario'}">
              <span class="material-symbols-outlined">${esBaneada ? 'lock_open' : 'gavel'}</span>
            </button>` : ""}
            ${canEditar ? `
            <button class="btn-accion-fila edit" data-action="edit" data-id="${record.id}" title="Editar datos y estado">
              <span class="material-symbols-outlined">edit</span>
            </button>` : ""}
            ${canEliminar ? `
            <button class="btn-accion-fila delete" data-action="delete" data-id="${record.id}" title="Eliminar registro">
              <span class="material-symbols-outlined">delete</span>
            </button>` : ""}
          </div>
        </td>` : ""}
      </tr>
    `;
  }).join("");

  // Event listeners en botones de acción
  tbody.querySelectorAll(".btn-accion-fila").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetBtn = e.currentTarget;
      const action = targetBtn.dataset.action;
      const id = targetBtn.dataset.id;
      const record = localIpRecords.find(r => r.id === id);
      if (!record) return;

      if (action === "ban") {
        toggleBan(record);
      } else if (action === "edit") {
        abrirModalEditar(record);
      } else if (action === "delete") {
        eliminarRegistro(record);
      }
    });
  });
}

/**
 * Toggle Baneo / Desbaneo
 */
async function toggleBan(record) {
  if (!checkIpPermission("ipaddr_banear")) {
    alert("No tienes permiso para banear o desbanear direcciones IP.");
    return;
  }

  const yaBaneado = (record.status === "Baneada");
  const nuevoEstado = yaBaneado ? "Normal" : "Baneada";
  const confirmMsg = yaBaneado
    ? `¿Deseas levantar el baneo a la IP ${record.ip} (${record.email})?`
    : `¿Deseas BANEAR la IP ${record.ip} y bloquear el acceso al usuario ${record.email}?`;

  if (!confirm(confirmMsg)) return;

  record.status = nuevoEstado;
  record.reason = yaBaneado ? "Baneo levantado por administrador" : (record.reason || "Baneo directo de seguridad");
  record.lastLogin = new Date().toISOString();

  guardarRegistrosLocales();
  renderTabla();

  // Sincronizar con accesscontrol
  if (yaBaneado) {
    if (window.accessControlAPI?.unbanIp) await window.accessControlAPI.unbanIp(record.ip);
    if (window.accessControlAPI?.unbanUser) await window.accessControlAPI.unbanUser(record.email);
    mostrarToast(`IP ${record.ip} desbaneada.`);
  } else {
    if (window.accessControlAPI?.banIp) await window.accessControlAPI.banIp(record.ip, record.reason);
    if (window.accessControlAPI?.banUser) await window.accessControlAPI.banUser(record.email);
    mostrarToast(`IP ${record.ip} BANEADA exitosamente.`, "error");
  }

  // Sincronizar en Firestore collection user_ips
  if (window.firebaseAPI?.db) {
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
      await setDoc(doc(window.firebaseAPI.db, "user_ips", record.id), {
        status: nuevoEstado,
        banned: !yaBaneado,
        reason: record.reason,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("Aviso actualizando Firestore:", e);
    }
  }
}

/**
 * Elimina un registro de IP
 */
async function eliminarRegistro(record) {
  if (!checkIpPermission("ipaddr_eliminar")) {
    alert("No tienes permiso para eliminar registros de IP.");
    return;
  }

  if (!confirm(`¿Estás seguro de eliminar el registro de la IP ${record.ip} para ${record.email}?`)) return;

  localIpRecords = localIpRecords.filter(r => r.id !== record.id);
  guardarRegistrosLocales();
  renderTabla();
  mostrarToast(`Registro de IP ${record.ip} eliminado.`);

  if (window.firebaseAPI?.db) {
    try {
      const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
      await deleteDoc(doc(window.firebaseAPI.db, "user_ips", record.id));
    } catch (e) {
      console.warn("Aviso eliminando de Firestore:", e);
    }
  }
}

/**
 * Abre el modal para editar
 */
function abrirModalEditar(record) {
  if (!checkIpPermission("ipaddr_editar")) {
    alert("No tienes permiso para editar registros de IP.");
    return;
  }
  if (!modal) return;
  modalTitle.textContent = "Editar Registro de IP";
  inputRecordId.value = record.id;
  inputIp.value = record.ip || "";
  inputEmail.value = record.email || "";
  inputName.value = record.displayName || "";
  selectStatus.value = record.status || "Normal";
  textareaReason.value = record.reason || "";
  modal.style.display = "flex";
}

/**
 * Abre el modal para nuevo registro manual
 */
function abrirModalNuevo() {
  if (!checkIpPermission("ipaddr_editar")) {
    alert("No tienes permiso para registrar nuevas direcciones IP.");
    return;
  }
  if (!modal) return;
  modalTitle.textContent = "Registrar IP Manualmente";
  inputRecordId.value = "";
  inputIp.value = "";
  inputEmail.value = "";
  inputName.value = "";
  selectStatus.value = "Sospechosa";
  textareaReason.value = "";
  modal.style.display = "flex";
}

function cerrarModal() {
  if (modal) modal.style.display = "none";
}

/**
 * Guardar formulario del modal
 */
if (formModal) {
  formModal.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!checkIpPermission("ipaddr_editar")) {
      alert("No tienes permiso para guardar o modificar registros de IP.");
      return;
    }
    const id = inputRecordId.value;
    const ip = inputIp.value.trim();
    const email = inputEmail.value.trim().toLowerCase();
    const name = inputName.value.trim();
    const status = selectStatus.value;
    const reason = textareaReason.value.trim();

    if (!ip || !email) {
      alert("La IP y el correo electrónico son obligatorios.");
      return;
    }

    const cleanId = id || `${email.replace(/[^a-zA-Z0-9_-]/g, "_")}_${ip.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

    const existingIdx = localIpRecords.findIndex(r => r.id === cleanId);
    const updatedRecord = {
      id: cleanId,
      ip,
      email,
      displayName: name || email.split("@")[0],
      status,
      reason,
      lastLogin: (existingIdx >= 0 && localIpRecords[existingIdx].lastLogin) ? localIpRecords[existingIdx].lastLogin : new Date().toISOString()
    };

    if (existingIdx >= 0) {
      localIpRecords[existingIdx] = { ...localIpRecords[existingIdx], ...updatedRecord };
    } else {
      localIpRecords.unshift(updatedRecord);
    }

    guardarRegistrosLocales();
    renderTabla();
    cerrarModal();
    mostrarToast("Registro guardado exitosamente.");

    // Aplicar lógica de baneo si se seleccionó Baneada
    if (status === "Baneada") {
      if (window.accessControlAPI?.banIp) await window.accessControlAPI.banIp(ip, reason);
      if (window.accessControlAPI?.banUser) await window.accessControlAPI.banUser(email);
    } else if (status === "Normal") {
      if (window.accessControlAPI?.unbanIp) await window.accessControlAPI.unbanIp(ip);
      if (window.accessControlAPI?.unbanUser) await window.accessControlAPI.unbanUser(email);
    }

    // Sincronizar en Firestore
    if (window.firebaseAPI?.db) {
      try {
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        await setDoc(doc(window.firebaseAPI.db, "user_ips", cleanId), updatedRecord, { merge: true });
      } catch (err) {
        console.warn("Aviso guardando en Firestore:", err);
      }
    }
  });
}

// Iniciar listener en tiempo real con Firestore
async function iniciarListenerFirestore() {
  if (!window.firebaseAPI?.db) return;
  try {
    const { collection, onSnapshot } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
    const colRef = collection(window.firebaseAPI.db, "user_ips");
    if (unsubscribeFirestore) unsubscribeFirestore();

    unsubscribeFirestore = onSnapshot(colRef, (snapshot) => {
      const cloudList = [];
      snapshot.forEach(docSnap => {
        cloudList.push({ id: docSnap.id, ...docSnap.data() });
      });

      if (cloudList.length > 0) {
        // Unir registros priorizando la nube
        const map = new Map();
        localIpRecords.forEach(r => map.set(r.id, r));
        cloudList.forEach(r => map.set(r.id, { ...(map.get(r.id) || {}), ...r }));
        localIpRecords = Array.from(map.values()).sort((a, b) => new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0));
        guardarRegistrosLocales();
        renderTabla();
      }
    }, err => {
      console.warn("Aviso listener Firestore user_ips:", err);
    });
  } catch (err) {
    console.warn("Error iniciando listener Firestore:", err);
  }
}

// Event Listeners de UI
if (searchInput) searchInput.addEventListener("input", renderTabla);
if (filterStatusSelect) filterStatusSelect.addEventListener("change", renderTabla);

if (btnRecargar) {
  btnRecargar.addEventListener("click", () => {
    cargarRegistrosLocales();
    renderTabla();
    iniciarListenerFirestore();
    mostrarToast("Lista de IPs recargada.");
  });
}

if (btnAgregarManual) {
  btnAgregarManual.addEventListener("click", abrirModalNuevo);
}

if (btnCerrarModal) btnCerrarModal.addEventListener("click", cerrarModal);
if (btnCancelarModal) btnCancelarModal.addEventListener("click", cerrarModal);

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });
}

// Inicialización
cargarRegistrosLocales();
renderTabla();

window.addEventListener("lh-access-control-updated", () => {
  renderTabla();
});

if (window.firebaseAPI?.onAuthReady) {
  window.firebaseAPI.onAuthReady(() => {
    renderTabla();
    iniciarListenerFirestore();
  });
} else {
  setTimeout(iniciarListenerFirestore, 1200);
}
