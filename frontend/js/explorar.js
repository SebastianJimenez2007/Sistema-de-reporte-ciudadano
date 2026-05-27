import { crearCard } from "../components/cards.js";
import { API_URL } from "./api-config.js";

let reportesGlobal = [];
let categoriasGlobal = [];

async function cargarReportes() {
  try {
    const response = await fetch(`${API_URL}/reportes`);
    reportesGlobal = await response.json();
    return reportesGlobal;
  } catch (error) {
    console.error("Error cargando reportes:", error);
    return [];
  }
}

async function cargarCategorias() {
    try {
        const response = await fetch(`${API_URL}/categorias`);
        categoriasGlobal = await response.json();
        return categoriasGlobal;
    } catch (error) {
        console.error("Error cargando categorías:", error);
        return [];
    }
}

function renderExplorarCards(data) {
  const container = document.querySelector(".explorar-cards");
  const sinResultados = document.getElementById("sin-resultados");
  const totalEl = document.getElementById("total-encontrados");

  if (!container) return;
  container.innerHTML = "";

  if (data.length === 0) {
    sinResultados.style.display = "flex";
    if (totalEl) totalEl.textContent = "0";
    return;
  }

  sinResultados.style.display = "none";
  if (totalEl) totalEl.textContent = data.length;

  data.forEach((rep) => {
    const card = crearCard(rep, null);
    container.appendChild(card);
  });
}

function aplicarFiltros() {
  const categoriaSeleccionada = document.getElementById("filtroCategoria")?.value || "todas";
  const estadoSeleccionado = document.getElementById("filtroEstado")?.value || "todos";
  const orden = document.getElementById("ordenar")?.value || "recientes";

  let resultado = [...reportesGlobal];

  // Filtro por categoría
  if (categoriaSeleccionada !== "todas") {
    resultado = resultado.filter((r) => r.categoria?.nombre === categoriaSeleccionada);
  }

  // Filtro por estado
  if (estadoSeleccionado !== "todos") {
    resultado = resultado.filter((r) => r.estado === estadoSeleccionado);
  }

  // Ordenar
  if (orden === "recientes") {
    resultado.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
  }
  if (orden === "antiguos") {
    resultado.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));
  }
  if (orden === "populares") resultado.sort((a, b) => (b.apoyo || 0) - (a.apoyo || 0));
  if (orden === "vistas") resultado.sort((a, b) => (b.vistas || 0) - (a.vistas || 0));

  renderExplorarCards(resultado);
}

function limpiarFiltros() {
  document.getElementById("filtroCategoria").value = "todas";
  document.getElementById("filtroEstado").value = "todos";
  document.getElementById("ordenar").value = "recientes";
  aplicarFiltros();
}

function configurarEventos() {
  document
    .getElementById("filtroCategoria")
    ?.addEventListener("change", aplicarFiltros);
  document
    .getElementById("filtroEstado")
    ?.addEventListener("change", aplicarFiltros);
  document
    .getElementById("ordenar")
    ?.addEventListener("change", aplicarFiltros);
  document
    .getElementById("btn-limpiar-filtros")
    ?.addEventListener("click", limpiarFiltros);
}

export async function initExplorar() {
  await cargarCategorias();
  await cargarReportes();
  configurarEventos();
  aplicarFiltros();
}