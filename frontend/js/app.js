// ===== SISTEMA SPA: Single Page Application =====
import { initInicio } from "./inicio.js";
import { initExplorar } from "./explorar.js";
import { initTransparencia } from "./transparencia.js";

const routes = {
  index: "./pages/inicio.html",
  explorar: "./pages/explorar.html",
  perfil: "./pages/perfil.html",
  transparencia: "./pages/transparencia.html",
};

// 1. Inyectar navbar
async function injectNavbar() {
  try {
    const response = await fetch("./components/navbar.html");
    if (!response.ok) throw new Error("No se encontró navbar.html");

    const html = await response.text();
    const navbar = document.getElementById("navbar-placeholder");
    if (navbar) navbar.innerHTML = html;

    addNavbarListeners();
    setActiveLink("index");
  } catch (err) {
    console.error("Error cargando navbar:", err);
  }
}

// 2. Inyectar footer
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

// 3. Listeners del navbar
function addNavbarListeners() {
  const navItems = document.querySelectorAll(".nav-item");
  const navMenu = document.getElementById("navMenu");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const page = item.getAttribute("href");
      window.location.hash = `#${page}`;

      loadPage(page);
      setActiveLink(page);

      if (navMenu) navMenu.classList.remove("active");
    });
  });
}

// 4. Cargar página
async function loadPage(page) {
  try {
    if (!routes[page]) {
      console.error(`Página no encontrada: ${page}`);
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
      if (page === "explorar") initExplorar(window.reportesMock || []);
      if (page === "transparencia") initTransparencia();
    }, 100);
  } catch (err) {
    console.error("Error cargando página:", err);
  }
}

// 5. Marcar botón activo
function setActiveLink(page) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    const isActive = item.getAttribute("href") === page;
    item.classList.toggle("active", isActive);
  });
}

// 6. Navegación atrás/adelante
window.addEventListener("hashchange", () => {
  const page = window.location.hash.slice(1) || "index";
  loadPage(page);
  setActiveLink(page);
});

// 7. Iniciar aplicación
document.addEventListener("DOMContentLoaded", () => {
  injectNavbar().then(() => {
    const initialPage = window.location.hash.slice(1) || "index";
    loadPage(initialPage);
    setActiveLink(initialPage);
  });
  injectFooter();
});
