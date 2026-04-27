// ===== SISTEMA SIMPLE: Cambiar de páginas sin recargar =====

const routes = {
  index: "./pages/inicio.html",
  explorar: "./pages/explorar.html",
  perfil: "./pages/perfil.html",
};

// 1. INYECTAR NAVBAR
async function injectNavbar() {
  try {
    const response = await fetch("./navbar.html");
    if (!response.ok) throw new Error("No se encontró navbar");

    const html = await response.text();
    document.getElementById("navbar-placeholder").innerHTML = html;

    addNavbarListeners();
    setActiveLink("index");
  } catch (err) {
    console.error("Error:", err);
  }
}

// 2. INTERCEPTAR CLICS EN LINKS
function addNavbarListeners() {
  const navItems = document.querySelectorAll(".nav-item");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  // Toggle del menú hamburguesa
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault(); // Evitar recarga

      const page = item.getAttribute("href");

      // Cambiar URL PRIMERO con hash
      window.location.hash = `#${page}`;

      // Luego cargar la página
      loadPage(page);
      setActiveLink(page);

      // Cerrar menú en móvil
      if (navMenu) {
        navMenu.classList.remove("active");
      }
    });
  });
}

// 3. CARGAR PÁGINA SIN RECARGAR
async function loadPage(page) {
  try {
    const filePath = routes[page];
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Error: ${filePath}`);

    const html = await response.text();

    // Extrae el <main> y lo reemplaza
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const mainContent = doc.querySelector("main");

    if (mainContent) {
      document.querySelector("main").innerHTML = mainContent.innerHTML;
    }
  } catch (err) {
    console.error("Error cargando:", err);
  }
}

// 4. MARCAR BOTÓN ACTIVO
function setActiveLink(page) {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === page) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// 4.5. ESCUCHAR CAMBIOS EN EL HASH (BOTÓN ATRÁS/ADELANTE)
window.addEventListener("hashchange", () => {
  const page = window.location.hash.slice(1) || "index";
  loadPage(page);
  setActiveLink(page);
});

// 5. INICIAR
injectNavbar().then(() => {
  // Si hay hash en la URL, cargar esa página, sino cargar "index"
  const initialPage = window.location.hash.slice(1) || "index";
  loadPage(initialPage);
  setActiveLink(initialPage);
});
