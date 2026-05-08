// ===== EXPLORAR.JS =====
import { crearCard } from "../components/cards.js";

// ===== DATOS (temporales — reemplazar con fetch al backend) =====
const reportes = [
  {
    id: 1,
    titulo: "Alcantarilla destapada en vía",
    descripcion:
      "Alcantarilla sin tapa en plena vía vehicular. Riesgo de accidente grave para motociclistas y ciclistas.",
    categoria: "Infraestructura",
    direccion: "Carrera 30 con Calle 50",
    imagen: "https://picsum.photos/400/200?1",
    lat: 4.65,
    lng: -74.1,
    vistas: 392,
    apoyos: 87,
    estado: "activo",
    fecha: "2026-04-29T07:45:00",
  },
  {
    id: 2,
    titulo: "Cable eléctrico caído por tormenta",
    descripcion:
      "Cable de alta tensión caído en vía pública tras tormenta. Riesgo eléctrico.",
    categoria: "Alumbrado",
    direccion: "Carrera 30 con Calle 60",
    imagen: "https://picsum.photos/400/200?2",
    lat: 4.66,
    lng: -74.09,
    vistas: 234,
    apoyos: 78,
    estado: "activo",
    fecha: "2026-04-28T06:15:00",
  },
  {
    id: 3,
    titulo: "Luminarias apagadas en avenida",
    descripcion:
      "10 luminarias consecutivas sin funcionar en avenida de alto tráfico nocturno.",
    categoria: "Alumbrado",
    direccion: "Avenida El Dorado",
    imagen: "https://picsum.photos/400/200?3",
    lat: 4.64,
    lng: -74.08,
    vistas: 567,
    apoyos: 145,
    estado: "activo",
    fecha: "2026-04-26T20:00:00",
  },
  {
    id: 4,
    titulo: "Basura acumulada en esquina",
    descripcion:
      "Malos olores y presencia de insectos. Más de una semana sin recolección.",
    categoria: "Aseo",
    direccion: "Av. Caracas con Calle 40",
    imagen: "https://picsum.photos/400/200?4",
    lat: 4.63,
    lng: -74.07,
    vistas: 150,
    apoyos: 32,
    estado: "activo",
    fecha: "2026-04-27T10:10:00",
  },
  {
    id: 5,
    titulo: "Hueco peligroso en la carretera",
    descripcion:
      "Hueco de grandes dimensiones que puede causar daños a vehículos y accidentes.",
    categoria: "Vías",
    direccion: "Carrera 7 con Calle 100",
    imagen: "https://picsum.photos/400/200?5",
    lat: 4.68,
    lng: -74.05,
    vistas: 500,
    apoyos: 120,
    estado: "resuelto",
    fecha: "2026-04-25T09:00:00",
  },
  {
    id: 6,
    titulo: "Zona insegura sin iluminación",
    descripcion:
      "Sector completamente oscuro reportado como punto crítico de inseguridad por vecinos.",
    categoria: "Seguridad",
    direccion: "Calle 80 con Carrera 15",
    imagen: "https://picsum.photos/400/200?6",
    lat: 4.67,
    lng: -74.06,
    vistas: 320,
    apoyos: 95,
    estado: "pendiente",
    fecha: "2026-04-24T22:00:00",
  },
  {
    id: 7,
    titulo: "Parque en abandono",
    descripcion:
      "Juegos dañados, pasto sin cortar y acumulación de basura en parque del barrio.",
    categoria: "Espacios Públicos",
    direccion: "Calle 52 con Carrera 20",
    imagen: "https://picsum.photos/400/200?7",
    lat: 4.62,
    lng: -74.11,
    vistas: 180,
    apoyos: 55,
    estado: "pendiente",
    fecha: "2026-04-23T14:30:00",
  },
  {
    id: 8,
    titulo: "Poste inclinado en vía pública",
    descripcion:
      "Poste de alumbrado inclinado peligrosamente sobre la acera, riesgo de caída.",
    categoria: "Infraestructura",
    direccion: "Carrera 11 con Calle 63",
    imagen: "https://picsum.photos/400/200?8",
    lat: 4.69,
    lng: -74.04,
    vistas: 210,
    apoyos: 48,
    estado: "activo",
    fecha: "2026-04-22T11:00:00",
  },
  {
    id: 9,
    titulo: "Semáforo dañado en intersección",
    descripcion:
      "Semáforo principal apagado causando caos vehicular en hora pico.",
    categoria: "Vías",
    direccion: "Av. 68 con Calle 57",
    imagen: "https://picsum.photos/400/200?9",
    lat: 4.61,
    lng: -74.12,
    vistas: 890,
    apoyos: 230,
    estado: "resuelto",
    fecha: "2026-04-20T08:00:00",
  },
  {
    id: 10,
    titulo: "Escombros bloqueando andén",
    descripcion:
      "Materiales de construcción abandonados bloqueando totalmente el andén peatonal.",
    categoria: "Infraestructura",
    direccion: "Calle 45 con Carrera 25",
    imagen: "https://picsum.photos/400/200?10",
    lat: 4.7,
    lng: -74.03,
    vistas: 145,
    apoyos: 38,
    estado: "pendiente",
    fecha: "2026-04-19T16:00:00",
  },
  {
    id: 11,
    titulo: "Contaminación visual en parque",
    descripcion:
      "Grafitis y publicidad ilegal en muros del parque principal del barrio.",
    categoria: "Espacios Públicos",
    direccion: "Parque Central Zona Rosa",
    imagen: "https://picsum.photos/400/200?11",
    lat: 4.66,
    lng: -74.08,
    vistas: 98,
    apoyos: 22,
    estado: "activo",
    fecha: "2026-04-18T09:30:00",
  },
  {
    id: 12,
    titulo: "Drenaje taponado genera inundación",
    descripcion:
      "Canal de drenaje obstruido provoca inundación en cada lluvia afectando 3 cuadras.",
    categoria: "Infraestructura",
    direccion: "Calle 13 con Carrera 40",
    imagen: "https://picsum.photos/400/200?12",
    lat: 4.64,
    lng: -74.1,
    vistas: 670,
    apoyos: 185,
    estado: "activo",
    fecha: "2026-04-15T07:00:00",
  },
];

// ===== RENDER DE CARDS EN EXPLORAR (sin callback de mapa) =====
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

// ===== APLICAR FILTROS =====
function aplicarFiltros() {
  const categoria =
    document.getElementById("filtroCategoria")?.value || "todas";
  const estado = document.getElementById("filtroEstado")?.value || "todos";
  const orden = document.getElementById("ordenar")?.value || "recientes";

  let resultado = [...reportes];

  if (categoria !== "todas") {
    resultado = resultado.filter((r) => r.categoria === categoria);
  }

  if (estado !== "todos") {
    resultado = resultado.filter((r) => r.estado === estado);
  }

  if (orden === "recientes")
    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  if (orden === "antiguos")
    resultado.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  if (orden === "populares") resultado.sort((a, b) => b.apoyos - a.apoyos);
  if (orden === "vistas") resultado.sort((a, b) => b.vistas - a.vistas);

  renderExplorarCards(resultado);
}

// ===== LIMPIAR filtros =====
function limpiarFiltros() {
  document.getElementById("filtroCategoria").value = "todas";
  document.getElementById("filtroEstado").value = "todos";
  document.getElementById("ordenar").value = "recientes";
  aplicarFiltros();
}

// ===== CONECTAR eventos =====
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

//  init 
export function initExplorar() {
  configurarEventos(); //  conectar eventos PRIMERO
  aplicarFiltros(); //  render inicial con todos los reportes
}
