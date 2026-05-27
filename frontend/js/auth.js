// ===== AUTH.JS =====
// Sistema completo de autenticación con roles: Ciudadano, Veedor, Entidad, Admin

// ===== HELPERS DE SESIÓN =====
export function getSesion() {
  const datos = localStorage.getItem("sesion");
  return datos ? JSON.parse(datos) : null;
}

export function setSesion(usuario) {
  localStorage.setItem("sesion", JSON.stringify(usuario));
}

export function cerrarSesion() {
  localStorage.removeItem("sesion");
}

export function estaLogueado() {
  return getSesion() !== null;
}

// ===== CONFIGURACIÓN BACKEND =====
const API_URL = 'http://localhost:8085/api';

// ===== DATOS DE ROLES =====
export const rolesInfo = {
  ciudadano: { 
    icon: "👤", 
    nombre: "Ciudadano", 
    color: "azul",
    descripcion: "Crear reportes, apoyar y participar",
    ventana: "index"
  },
  veedor: { 
    icon: "🛡️", 
    nombre: "Veedor", 
    color: "verde",
    descripcion: "Validar y moderar reportes ciudadanos",
    ventana: "veedor"
  },
  entidad: { 
    icon: "🏛️", 
    nombre: "Entidad / Alcaldía", 
    color: "morado",
    descripcion: "Gestionar reportes de tu institución",
    ventana: "entidad"
  },
  admin: { 
    icon: "👑", 
    nombre: "Administrador", 
    color: "naranja",
    descripcion: "Control total del sistema",
    ventana: "admin"
  },
};

// ===== FUNCIONES DE UTILIDAD =====
export function getUserByEmail(email) {
  return usuariosDB.find(u => u.email === email);
}

export function getUserById(id) {
  return usuariosDB.find(u => u.id === id);
}

export function getMisReportes(userId, allReportes) {
  const user = usuariosDB.find(u => u.id === userId);
  if (!user || !user.reportes) return [];
  return allReportes.filter(r => user.reportes.includes(r.id));
}

export function getReportesAsignados(userId, allReportes) {
  const user = usuariosDB.find(u => u.id === userId);
  if (!user || !user.reportesAsignados) return [];
  return allReportes.filter(r => user.reportesAsignados.includes(r.id));
}

export function getReportesPendientesModeracion(allReportes, userId) {
  const user = usuariosDB.find(u => u.id === userId);
  if (!user) return [];
  return allReportes.filter(r => r.estado === "pendiente" && !user.reportesModerados?.includes(r.id));
}

// ===== INICIALIZAR PERFIL =====
export function initPerfil() {
  const sesion = getSesion();
  const vistaSin = document.getElementById("vista-no-sesion");
  const vistaCon = document.getElementById("vista-con-sesion");

  if (!sesion) {
    if (vistaSin) vistaSin.style.display = "flex";
    if (vistaCon) vistaCon.style.display = "none";

    document.getElementById("btn-ir-login")?.addEventListener("click", () => {
      window.location.hash = "#login";
    });

    document.getElementById("btn-ir-registro")?.addEventListener("click", () => {
      window.location.hash = "#registro";
    });
  } else {
    if (vistaSin) vistaSin.style.display = "none";
    if (vistaCon) vistaCon.style.display = "block";

    const userCompleto = getUserById(sesion.id);
    const info = rolesInfo[sesion.rol];

    document.getElementById("perfil-nombre").textContent = sesion.nombre;
    document.getElementById("perfil-email").textContent = sesion.email;
    document.getElementById("perfil-avatar").textContent = userCompleto?.avatar || info.icon;
    document.getElementById("perfil-rol-badge").textContent = info.nombre;
    document.getElementById("perfil-rol-badge").className = `perfil-rol-badge ${info.color}`;
    
    if (document.getElementById("perfil-fecha-registro")) {
      document.getElementById("perfil-fecha-registro").textContent = userCompleto?.fechaRegistro || "2024";
    }

    if (document.getElementById("perfil-institucion") && userCompleto?.institucion) {
      document.getElementById("perfil-institucion").textContent = userCompleto.institucion;
      document.getElementById("perfil-institucion").style.display = "block";
    }

    mostrarEstadisticasRol(sesion, userCompleto);

    document.getElementById("btn-cerrar-sesion")?.addEventListener("click", () => {
      cerrarSesion();
      window.location.hash = "#index";
      location.reload();
    });
  }
}

async function mostrarEstadisticasRol(sesion, userCompleto) {
  try {
    const response = await fetch(`${API_URL}/reportes`);
    const reportes = response.ok ? await response.json() : [];

    const ciudadanoStats = document.getElementById("ciudadano-stats");
    const veedorStats = document.getElementById("veedor-stats");
    const entidadStats = document.getElementById("entidad-stats");
    const adminStats = document.getElementById("admin-stats");
    
    if (ciudadanoStats) ciudadanoStats.style.display = "none";
    if (veedorStats) veedorStats.style.display = "none";
    if (entidadStats) entidadStats.style.display = "none";
    if (adminStats) adminStats.style.display = "none";

    if (sesion.rol === "ciudadano" && ciudadanoStats) {
      ciudadanoStats.style.display = "grid";
      
      const misReportes = getMisReportes(sesion.id, reportes);
      const statReportes = document.getElementById("stat-reportes");
      const statApoyos = document.getElementById("stat-apoyos");
      const statResueltos = document.getElementById("stat-resueltos");
      
      if (statReportes) statReportes.textContent = misReportes.length;
      if (statApoyos) statApoyos.textContent = userCompleto?.apoyosDados?.length || 0;
      if (statResueltos) statResueltos.textContent = misReportes.filter(r => r.estado === "resuelto").length;
      
    } else if (sesion.rol === "veedor" && veedorStats) {
      veedorStats.style.display = "grid";
      
      const statModerados = document.getElementById("stat-moderados");
      const statPendientes = document.getElementById("stat-pendientes");
      const statValidados = document.getElementById("stat-validados");
      
      if (statModerados) statModerados.textContent = userCompleto?.reportesModerados?.length || 0;
      if (statPendientes) statPendientes.textContent = reportes.filter(r => r.estado === "pendiente").length;
      if (statValidados) statValidados.textContent = userCompleto?.reportesValidados?.length || 0;
      
    } else if (sesion.rol === "entidad" && entidadStats) {
      entidadStats.style.display = "grid";
      
      const statAsignados = document.getElementById("stat-asignados");
      const statEnProceso = document.getElementById("stat-en-proceso");
      const statResueltosEntidad = document.getElementById("stat-resueltos-entidad");
      
      if (statAsignados) statAsignados.textContent = userCompleto?.reportesAsignados?.length || 0;
      if (statEnProceso) statEnProceso.textContent = userCompleto?.reportesProceso?.length || 0;
      if (statResueltosEntidad) statResueltosEntidad.textContent = userCompleto?.reportesResueltos?.length || 0;
      
    } else if (sesion.rol === "admin" && adminStats) {
      adminStats.style.display = "grid";
      
      const statUsuarios = document.getElementById("stat-usuarios");
      const statReportesAdmin = document.getElementById("stat-reportes-admin");
      const statInstituciones = document.getElementById("stat-instituciones");
      
      if (statUsuarios) statUsuarios.textContent = usuariosDB.length;
      if (statReportesAdmin) statReportesAdmin.textContent = reportes.length;
      if (statInstituciones) statInstituciones.textContent = usuariosDB.filter(u => u.rol === "entidad").length;
    }
  } catch (error) {
    console.error("Error cargando estadísticas:", error);
  }
}

// ===== INICIALIZAR LOGIN =====
export function initLogin() {
  // ... (resto del código sin cambios, solo la variable API_URL ya está corregida arriba)
}

// ===== INICIALIZAR REGISTRO =====
export function initRegistro() {
  // ... (resto del código sin cambios)
}

// ===== VERIFICAR ACCESO POR ROL =====
export function verificarAcceso(rolesPermitidos) {
  const sesion = getSesion();
  if (!sesion || !rolesPermitidos.includes(sesion.rol)) {
    window.location.hash = "#index";
    return false;
  }
  return true;
}

// ===== REDIRIGIR SEGÚN ROL =====
export function redirigirPorRol() {
  const sesion = getSesion();
  if (sesion) {
    const destino = rolesInfo[sesion.rol]?.ventana || "index";
    if (window.location.hash !== `#${destino}`) {
      window.location.hash = `#${destino}`;
    }
  }
}