// ===== SISTEMA SPA: Single Page Application =====
import { initInicio } from "./inicio.js";
import { initExplorar } from "./explorar.js";
import { initTransparencia } from "./transparencia.js";
import { initPerfil, initLogin, initRegistro, getSesion, rolesInfo } from "./auth.js";

// Importar inicializadores de los nuevos paneles
import { initAdmin } from "./admin.js";
import { initVeedor } from "./veedor.js";
import { initEntidad } from "./entidad.js";

const routes = {
  index:        "./pages/inicio.html",
  explorar:     "./pages/explorar.html",
  perfil:       "./pages/perfil.html",
  transparencia:"./pages/transparencia.html",
  login:        "./pages/login.html",
  registro:     "./pages/registro.html",
  admin:        "./pages/admin.html",
  veedor:       "./pages/veedor.html",
  entidad:      "./pages/entidad.html",
};

// 1. Inyectar navbar
async function injectNavbar() {
  try {
    const response = await fetch("./components/navbar.html");
    if (!response.ok) throw new Error("No se encontró navbar.html");

    const html = await response.text();
    const navbar = document.getElementById("navbar-placeholder");
    if (navbar) navbar.innerHTML = html;

    // Personalizar navbar según el rol
    personalizarNavbarPorRol();
    addNavbarListeners();
    setActiveLink(getCurrentPage());
  } catch (err) {
    console.error("Error cargando navbar:", err);
  }
}

// 1.5 Personalizar navbar según el rol del usuario
function personalizarNavbarPorRol() {
  const sesion = getSesion();
  const navRight = document.querySelector(".nav-right");
  const navLeft = document.querySelector(".nav-left");
  
  if (!navRight) return;
  
  if (!sesion) {
    // Usuario no logueado
    navRight.innerHTML = `
      <a href="index" class="nav-item"><i class="bi bi-house-door"></i> Inicio</a>
      <a href="explorar" class="nav-item"><i class="bi bi-search"></i> Explorar</a>
      <a href="transparencia" class="nav-item"><i class="bi bi-bar-chart"></i> Transparencia</a>
      <a href="login" class="nav-item"><i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión</a>
    `;
  } else {
    // Usuario logueado - mostrar según su rol
    const info = rolesInfo[sesion.rol];
    
    if (sesion.rol === "ciudadano") {
      navRight.innerHTML = `
        <a href="index" class="nav-item"><i class="bi bi-house-door"></i> Inicio</a>
        <a href="explorar" class="nav-item"><i class="bi bi-search"></i> Explorar</a>
        <a href="transparencia" class="nav-item"><i class="bi bi-bar-chart"></i> Transparencia</a>
        <a href="perfil" class="nav-item"><i class="bi bi-person"></i> ${info.icon} Perfil</a>
      `;
    } else if (sesion.rol === "veedor") {
      navRight.innerHTML = `
        <a href="veedor" class="nav-item"><i class="bi bi-shield-check"></i> ${info.icon} Moderar</a>
        <a href="explorar" class="nav-item"><i class="bi bi-search"></i> Explorar</a>
        <a href="transparencia" class="nav-item"><i class="bi bi-bar-chart"></i> Transparencia</a>
        <a href="perfil" class="nav-item"><i class="bi bi-person"></i> Perfil</a>
      `;
    } else if (sesion.rol === "entidad") {
      navRight.innerHTML = `
        <a href="entidad" class="nav-item"><i class="bi bi-building"></i> ${info.icon} Panel</a>
        <a href="explorar" class="nav-item"><i class="bi bi-search"></i> Explorar</a>
        <a href="transparencia" class="nav-item"><i class="bi bi-bar-chart"></i> Transparencia</a>
        <a href="perfil" class="nav-item"><i class="bi bi-person"></i> Perfil</a>
      `;
    } else if (sesion.rol === "admin") {
      navRight.innerHTML = `
        <a href="admin" class="nav-item"><i class="bi bi-shield-lock"></i> ${info.icon} Admin</a>
        <a href="explorar" class="nav-item"><i class="bi bi-search"></i> Explorar</a>
        <a href="transparencia" class="nav-item"><i class="bi bi-bar-chart"></i> Transparencia</a>
        <a href="perfil" class="nav-item"><i class="bi bi-person"></i> Perfil</a>
      `;
    }
  }
}

// 2. Obtener página actual según rol
function getCurrentPage() {
  let page = window.location.hash.slice(1) || "index";
  const sesion = getSesion();
  
  // Si no hay sesión y trata de acceder a páginas protegidas
  if (!sesion) {
    const paginasProtegidas = ["admin", "veedor", "entidad"];
    if (paginasProtegidas.includes(page)) {
      page = "index";
      window.location.hash = "#index";
    }
    return page;
  }
  
  // Validar que el usuario tenga permiso para la página actual
  if (page === "admin" && sesion.rol !== "admin") {
    page = sesion.rol === "veedor" ? "veedor" : sesion.rol === "entidad" ? "entidad" : "index";
    window.location.hash = `#${page}`;
  }
  if (page === "veedor" && sesion.rol !== "veedor") {
    page = sesion.rol === "admin" ? "admin" : sesion.rol === "entidad" ? "entidad" : "index";
    window.location.hash = `#${page}`;
  }
  if (page === "entidad" && sesion.rol !== "entidad") {
    page = sesion.rol === "admin" ? "admin" : sesion.rol === "veedor" ? "veedor" : "index";
    window.location.hash = `#${page}`;
  }
  
  return page;
}

// 3. Inyectar footer
async function injectFooter() {
  try {
    const response = await fetch("./components/footer.html");
    if (!response.ok) throw new Error("No se encontró footer.html");

    const html = await response.text();
    const footer = document.getElementById("footer-placeholder");
    if (footer) footer.innerHTML = html;
  } catch (err) {
    console.error("Error cargando footer:", err);
  }
}

// 4. Listeners del navbar
function addNavbarListeners() {
  const navItems = document.querySelectorAll(".nav-item");
  const navMenu = document.getElementById("navMenu");

  navItems.forEach((item) => {
    // Remover listener anterior para evitar duplicados
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
    
    newItem.addEventListener("click", (e) => {
      e.preventDefault();
      const page = newItem.getAttribute("href");
      window.location.hash = `#${page}`;
      loadPage(page);
      setActiveLink(page);
      if (navMenu) navMenu.classList.remove("active");
    });
  });
}

// 5. Cargar página
async function loadPage(page) {
  try {
    // Validar acceso a páginas según rol
    const sesion = getSesion();
    
    // Protección de rutas
    if (page === "admin" && (!sesion || sesion.rol !== "admin")) {
      window.location.hash = "#index";
      return;
    }
    if (page === "veedor" && (!sesion || sesion.rol !== "veedor")) {
      window.location.hash = "#index";
      return;
    }
    if (page === "entidad" && (!sesion || sesion.rol !== "entidad")) {
      window.location.hash = "#index";
      return;
    }
    
    if (!routes[page]) {
      console.error(`Página no encontrada: ${page}`);
      window.location.hash = "#index";
      return;
    }

    const response = await fetch(routes[page]);
    if (!response.ok) throw new Error(`Error al cargar: ${routes[page]}`);

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const mainContent = doc.querySelector("main");

    if (mainContent) {
      document.querySelector("main").innerHTML = mainContent.innerHTML;
    }

    // Inicializar lógica según la página
    setTimeout(() => {
      if (page === "index") initInicio();
      if (page === "explorar") initExplorar();
      if (page === "transparencia") initTransparencia();
      if (page === "perfil") initPerfil();
      if (page === "login") initLogin();
      if (page === "registro") initRegistro();
      if (page === "admin") initAdmin();
      if (page === "veedor") initVeedor();
      if (page === "entidad") initEntidad();
    }, 100);

  } catch (err) {
    console.error("Error cargando página:", err);
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `<div style="text-align:center;padding:50px;"><h2>Error al cargar la página</h2><p>${err.message}</p></div>`;
    }
  }
}

// 6. Marcar botón activo
function setActiveLink(page) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    const href = item.getAttribute("href");
    const isActive = href === page;
    item.classList.toggle("active", isActive);
  });
}

// 7. Navegación atrás/adelante
window.addEventListener("hashchange", () => {
  const page = getCurrentPage();
  loadPage(page);
  setActiveLink(page);
});

// 8. Iniciar aplicación
document.addEventListener("DOMContentLoaded", () => {
  injectNavbar().then(() => {
    const initialPage = getCurrentPage();
    loadPage(initialPage);
    setActiveLink(initialPage);
  });
  injectFooter();
});