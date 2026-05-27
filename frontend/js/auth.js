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
const API_URL = 'http://localhost:8080/api';

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

// ===== USUARIOS DEL SISTEMA =====
export let usuariosDB = [
  // CIUDADANOS
  { 
    id: 1, 
    nombre: "Carlos Ramírez", 
    email: "carlos@ciudadano.com", 
    password: "123456", 
    rol: "ciudadano",
    avatar: "👤",
    reportes: [1, 3, 5],
    apoyosDados: [2, 4, 7],
    barrio: "El Poblado",
    telefono: "3001234567",
    fechaRegistro: "2024-01-15"
  },
  { 
    id: 5, 
    nombre: "Laura Gómez", 
    email: "laura@ciudadano.com", 
    password: "123456", 
    rol: "ciudadano",
    avatar: "👩",
    reportes: [2, 6],
    apoyosDados: [1, 3, 5],
    barrio: "Laureles",
    telefono: "3007654321",
    fechaRegistro: "2024-02-20"
  },
  
  // VEEDORES
  { 
    id: 2, 
    nombre: "Ana María Sánchez", 
    email: "ana@veedor.com", 
    password: "123456", 
    rol: "veedor",
    avatar: "🛡️",
    reportesModerados: [1, 2, 4, 7],
    reportesValidados: [1, 4],
    reportesRechazados: [7],
    entidad: "Personería Municipal",
    fechaRegistro: "2024-02-10"
  },
  { 
    id: 6, 
    nombre: "Pedro Martínez", 
    email: "pedro@veedor.com", 
    password: "123456", 
    rol: "veedor",
    avatar: "🔍",
    reportesModerados: [3, 5, 6],
    reportesValidados: [3, 6],
    reportesRechazados: [5],
    entidad: "Contraloría",
    fechaRegistro: "2024-03-01"
  },
  
  // ENTIDADES
  { 
    id: 3, 
    nombre: "Juan Torres", 
    email: "juan@entidad.gov.co", 
    password: "123456", 
    rol: "entidad",
    avatar: "🏛️",
    institucion: "Empresa de Energía",
    nit: "901234567-8",
    reportesAsignados: [2, 5, 8],
    reportesProceso: [2],
    reportesResueltos: [5],
    fechaRegistro: "2024-01-20"
  },
  { 
    id: 7, 
    nombre: "María López", 
    email: "maria@alcaldia.gov.co", 
    password: "123456", 
    rol: "entidad",
    avatar: "🏢",
    institucion: "Alcaldía Municipal",
    nit: "901234569-0",
    reportesAsignados: [1, 3, 4, 6],
    reportesProceso: [1, 3],
    reportesResueltos: [4, 6],
    fechaRegistro: "2024-01-10"
  },
  
  // ADMINISTRADORES
  { 
    id: 4, 
    nombre: "Admin Sistema", 
    email: "admin@reportapp.com", 
    password: "admin123", 
    rol: "admin",
    avatar: "👑",
    permisos: ["usuarios", "reportes", "instituciones", "metricas"],
    fechaRegistro: "2024-01-01"
  },
];

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
    const response = await fetch("http://localhost:8080/api/reportes");
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
  let rolSeleccionado = null;

  const pasRol = document.getElementById("paso-rol");
  const pasoForm = document.getElementById("paso-form");

  if (!pasRol || !pasoForm) {
    console.error("Elementos del login no encontrados");
    return;
  }

  document.querySelectorAll(".rol-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      rolSeleccionado = btn.dataset.rol;
      const info = rolesInfo[rolSeleccionado];

      const rolIconBadge = document.getElementById("rol-icon-badge");
      const rolNombreBadge = document.getElementById("rol-nombre-badge");
      const rolDescBadge = document.getElementById("rol-desc-badge");
      
      if (rolIconBadge) rolIconBadge.textContent = info.icon;
      if (rolNombreBadge) rolNombreBadge.textContent = info.nombre;
      if (rolDescBadge) rolDescBadge.textContent = info.descripcion;

      document.querySelectorAll(".rol-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      pasRol.style.display = "none";
      pasoForm.style.display = "block";
    });
  });

  const btnVolver = document.getElementById("btn-volver");
  if (btnVolver) {
    btnVolver.addEventListener("click", () => {
      pasoForm.style.display = "none";
      pasRol.style.display = "block";
      rolSeleccionado = null;
    });
  }

  const togglePass = document.getElementById("toggle-pass");
  if (togglePass) {
    togglePass.addEventListener("click", () => {
      const input = document.getElementById("login-password");
      if (input) {
        input.type = input.type === "password" ? "text" : "password";
      }
    });
  }

  const btnIrRegistro = document.getElementById("btn-ir-registro-desde-login");
  if (btnIrRegistro) {
    btnIrRegistro.addEventListener("click", () => {
      window.location.hash = "#registro";
    });
  }

  const btnLogin = document.getElementById("btn-login");
  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      const email = document.getElementById("login-email")?.value.trim() || "";
      const password = document.getElementById("login-password")?.value || "";
      const errorEl = document.getElementById("auth-error");
      const errorMsg = document.getElementById("auth-error-msg");
      const btnText = document.getElementById("btn-login-text");
      const btnLoad = document.getElementById("btn-login-loading");

      if (!email || !password) {
        if (errorMsg) errorMsg.textContent = "Completa todos los campos";
        if (errorEl) errorEl.style.display = "flex";
        return;
      }

      if (!rolSeleccionado) {
        if (errorMsg) errorMsg.textContent = "Selecciona un rol primero";
        if (errorEl) errorEl.style.display = "flex";
        return;
      }

      if (btnText) btnText.style.display = "none";
      if (btnLoad) btnLoad.style.display = "inline";
      if (errorEl) errorEl.style.display = "none";

      // ===== LLAMADA AL BACKEND =====
      try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (btnText) btnText.style.display = "inline";
        if (btnLoad) btnLoad.style.display = "none";
        
        if (!data.success) {
          if (errorMsg) errorMsg.textContent = data.mensaje || "Credenciales incorrectas";
          if (errorEl) errorEl.style.display = "flex";
          return;
        }
        
        // Mapear rol de la BD al formato del frontend
        let rolFrontend = data.rol.toLowerCase();
        if (rolFrontend === "validador") rolFrontend = "veedor";
        if (rolFrontend === "admin") rolFrontend = "admin";
        if (rolFrontend === "ciudadano") rolFrontend = "ciudadano";
        if (rolFrontend === "entidad") rolFrontend = "entidad";
        
        // Verificar que el rol coincida con el seleccionado
        if (rolFrontend !== rolSeleccionado) {
          if (errorMsg) errorMsg.textContent = `El rol seleccionado (${rolSeleccionado}) no coincide con tu cuenta (${rolFrontend})`;
          if (errorEl) errorEl.style.display = "flex";
          return;
        }
        
        // Guardar sesión
        setSesion({ 
          id: data.id, 
          nombre: data.nombreCompleto,
          email: data.email, 
          rol: rolFrontend,
          avatar: rolesInfo[rolFrontend]?.icon || "👤",
          fechaRegistro: new Date().toISOString().split('T')[0]
        });
        
        const destino = rolesInfo[rolFrontend].ventana;
        window.location.hash = `#${destino}`;
        location.reload();
        
      } catch (error) {
        if (btnText) btnText.style.display = "inline";
        if (btnLoad) btnLoad.style.display = "none";
        if (errorMsg) errorMsg.textContent = "Error de conexión con el servidor. ¿El backend está corriendo?";
        if (errorEl) errorEl.style.display = "flex";
        console.error("Error en login:", error);
      }
    });
  }
}

// ===== INICIALIZAR REGISTRO =====
export function initRegistro() {
  let rolSeleccionado = "ciudadano";

  const rolesRegistro = document.querySelectorAll(".rol-reg-btn");
  const camposEntidad = document.getElementById("campos-entidad");
  const campoBarrio = document.getElementById("campo-barrio");

  rolesRegistro.forEach(btn => {
    btn.addEventListener("click", () => {
      rolSeleccionado = btn.dataset.rol;
      rolesRegistro.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      
      if (camposEntidad) {
        camposEntidad.style.display = rolSeleccionado === "entidad" ? "block" : "none";
      }
      if (campoBarrio) {
        campoBarrio.style.display = rolSeleccionado === "ciudadano" ? "block" : "none";
      }
    });
  });

  const toggleRegPass = document.getElementById("toggle-reg-pass");
  if (toggleRegPass) {
    toggleRegPass.addEventListener("click", () => {
      const input = document.getElementById("reg-password");
      const confirmInput = document.getElementById("reg-confirm-password");
      if (input) {
        const type = input.type === "password" ? "text" : "password";
        input.type = type;
        if (confirmInput) confirmInput.type = type;
      }
    });
  }

  const btnIrLogin = document.getElementById("btn-ir-login-desde-reg");
  if (btnIrLogin) {
    btnIrLogin.addEventListener("click", () => {
      window.location.hash = "#login";
    });
  }

  const btnRegistro = document.getElementById("btn-registro");
  if (btnRegistro) {
    btnRegistro.addEventListener("click", async () => {
      const nombre = document.getElementById("reg-nombre")?.value.trim() || "";
      const email = document.getElementById("reg-email")?.value.trim() || "";
      const password = document.getElementById("reg-password")?.value || "";
      const confirmPassword = document.getElementById("reg-confirm-password")?.value || "";
      const barrio = document.getElementById("reg-barrio")?.value.trim() || "";
      const institucion = document.getElementById("reg-institucion")?.value.trim() || "";
      const nit = document.getElementById("reg-nit")?.value.trim() || "";
      const terminos = document.getElementById("reg-terminos")?.checked || false;
      
      const errorEl = document.getElementById("reg-error");
      const errorMsg = document.getElementById("reg-error-msg");
      const btnText = document.getElementById("btn-reg-text");
      const btnLoad = document.getElementById("btn-reg-loading");

      if (!nombre || !email || !password) {
        if (errorMsg) errorMsg.textContent = "Completa todos los campos obligatorios";
        if (errorEl) errorEl.style.display = "flex";
        return;
      }

      if (password.length < 6) {
        if (errorMsg) errorMsg.textContent = "La contraseña debe tener mínimo 6 caracteres";
        if (errorEl) errorEl.style.display = "flex";
        return;
      }

      if (password !== confirmPassword) {
        if (errorMsg) errorMsg.textContent = "Las contraseñas no coinciden";
        if (errorEl) errorEl.style.display = "flex";
        return;
      }

      if (!terminos) {
        if (errorMsg) errorMsg.textContent = "Debes aceptar los términos y condiciones";
        if (errorEl) errorEl.style.display = "flex";
        return;
      }

      if (rolSeleccionado === "entidad" && !institucion) {
        if (errorMsg) errorMsg.textContent = "Ingresa el nombre de la institución";
        if (errorEl) errorEl.style.display = "flex";
        return;
      }

      if (btnText) btnText.style.display = "none";
      if (btnLoad) btnLoad.style.display = "inline";
      if (errorEl) errorEl.style.display = "none";

      // ===== LLAMADA AL BACKEND =====
      try {
        // Convertir rol al formato del backend
        let rolBackend = "";
        switch (rolSeleccionado) {
          case "ciudadano": rolBackend = "CIUDADANO"; break;
          case "veedor": rolBackend = "VEEDOR"; break;
          case "entidad": rolBackend = "ENTIDAD"; break;
          case "admin": rolBackend = "ADMINISTRADOR"; break;
        }
        
        const response = await fetch(`${API_URL}/usuarios/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: password,
            nombreCompleto: nombre,
            rol: rolBackend,
            aceptaTerminos: terminos,
            barrio: barrio || ""
          })
        });
        
        const data = await response.json();
        
        if (btnText) btnText.style.display = "inline";
        if (btnLoad) btnLoad.style.display = "none";
        
        if (!data.success) {
          if (errorMsg) errorMsg.textContent = data.error || "Error en el registro";
          if (errorEl) errorEl.style.display = "flex";
          return;
        }
        
        // Guardar sesión
        let rolFrontend = data.usuario.rol.toLowerCase();
        if (rolFrontend === "validador") rolFrontend = "veedor";
        
        setSesion({ 
          id: data.usuario.id, 
          nombre: data.usuario.nombreCompleto,
          email: data.usuario.email, 
          rol: rolFrontend,
          avatar: rolesInfo[rolFrontend]?.icon || "👤",
          fechaRegistro: new Date().toISOString().split('T')[0]
        });
        
        if (errorEl && errorMsg) {
          errorEl.style.background = "#dcfce7";
          errorEl.style.border = "1px solid #22c55e";
          errorMsg.style.color = "#16a34a";
          errorMsg.textContent = "✅ ¡Registro exitoso! Redirigiendo...";
          errorEl.style.display = "flex";
        }
        
        setTimeout(() => {
          const destino = rolesInfo[rolSeleccionado].ventana;
          window.location.hash = `#${destino}`;
          location.reload();
        }, 1500);
        
      } catch (error) {
        if (btnText) btnText.style.display = "inline";
        if (btnLoad) btnLoad.style.display = "none";
        if (errorMsg) errorMsg.textContent = "Error de conexión con el servidor. ¿El backend está corriendo?";
        if (errorEl) errorEl.style.display = "flex";
        console.error("Error en registro:", error);
      }
    });
  }
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