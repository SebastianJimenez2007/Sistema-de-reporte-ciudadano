import { renderCards } from "../components/cards.js";
import { renderSidebar } from "../components/sidebar.js";
import { abrirModal } from "../components/modal.js";

// ===== DATOS MOCK (se usan si el backend no está disponible) =====
const reportesMock = [
  {
    id: 1,
    titulo: "Alcantarilla destapada en vía",
    descripcion:
      "Alcantarilla sin tapa en plena vía vehicular. Riesgo de accidente grave.",
    categoria: "Infraestructura",
    direccion: "Carrera 30 con Calle 50",
    imagen: "https://picsum.photos/400/200?1",
    latitud: 4.65,
    longitud: -74.1,
    vistas: 392,
    apoyo: 87,
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
    latitud: 4.66,
    longitud: -74.09,
    vistas: 234,
    apoyo: 78,
    estado: "activo",
    fecha: "2026-04-28T06:15:00",
  },
  {
    id: 3,
    titulo: "Basura acumulada en esquina",
    descripcion:
      "Malos olores y presencia de insectos. Más de una semana sin recolección.",
    categoria: "Aseo",
    direccion: "Av. Caracas con Calle 40",
    imagen: "https://picsum.photos/400/200?3",
    latitud: 4.64,
    longitud: -74.08,
    vistas: 150,
    apoyo: 32,
    estado: "activo",
    fecha: "2026-04-27T10:10:00",
  },
  {
    id: 4,
    titulo: "Hueco peligroso en la carretera",
    descripcion:
      "Hueco de grandes dimensiones que puede causar daños a vehículos.",
    categoria: "Vías",
    direccion: "Carrera 7 con Calle 100",
    imagen: "https://picsum.photos/400/200?4",
    latitud: 4.68,
    longitud: -74.05,
    vistas: 500,
    apoyo: 120,
    estado: "resuelto",
    fecha: "2026-04-25T09:00:00",
  },
  {
    id: 5,
    titulo: "Zona insegura sin iluminación",
    descripcion:
      "Sector completamente oscuro reportado como punto crítico de inseguridad.",
    categoria: "Seguridad",
    direccion: "Calle 80 con Carrera 15",
    imagen: "https://picsum.photos/400/200?6",
    latitud: 4.67,
    longitud: -74.06,
    vistas: 320,
    apoyo: 95,
    estado: "pendiente",
    fecha: "2026-04-24T22:00:00",
  },
  {
    id: 6,
    titulo: "Parque en abandono",
    descripcion:
      "Juegos dañados, pasto sin cortar y acumulación de basura en parque del barrio.",
    categoria: "Espacios Públicos",
    direccion: "Calle 52 con Carrera 20",
    imagen: "https://picsum.photos/400/200?7",
    latitud: 4.62,
    longitud: -74.11,
    vistas: 180,
    apoyo: 55,
    estado: "pendiente",
    fecha: "2026-04-23T14:30:00",
  },
];

// ===== DATOS SIDEBAR =====
const datosSidebar = {
  totalReportes: 26,
  categorias: [
    {
      nombre: "Infraestructura",
      icono: "🔧",
      clase: "infraestructura",
      count: 9,
    },
    { nombre: "Espacios Públicos", icono: "🌳", clase: "espacios", count: 7 },
    { nombre: "Seguridad", icono: "🛡️", clase: "seguridad", count: 4 },
    { nombre: "Alumbrado", icono: "💡", clase: "alumbrado", count: 6 },
    { nombre: "Otros", icono: "···", clase: "otros", count: 0 },
  ],
  metricas: [
    { label: "⊘ Tasa de Resolución", valor: "35%", color: "rojo" },
    { label: "⏱ Respuesta Promedio", valor: "4 días", color: "azul" },
    { label: "✅ Resueltos este mes", valor: "12", color: "verde" },
  ],
};

let map = null;
let reportesGlobal = [];

// ===== CARGAR REPORTES (con fallback a mock) =====
async function cargarReportes() {
  try {
    const response = await fetch("http://localhost:8080/api/reportes");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    reportesGlobal = await response.json();
    console.log("✅ Reportes cargados desde backend:", reportesGlobal.length);
  } catch (error) {
    console.warn("⚠️ Backend no disponible, usando datos mock");
    reportesGlobal = reportesMock;
  }

  // Ya no se necesita el callback openReporte, el modal maneja el detalle
  renderCards(reportesGlobal, ".cards");
}

// ===== MAPA =====
function initMapa() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  if (map !== null) {
    map.remove();
    map = null;
  }

  map = L.map("map").setView([4.65, -74.1], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  reportesGlobal.forEach((rep) => {
    const lat = rep.latitud || rep.lat;
    const lng = rep.longitud || rep.lng;
    if (lat && lng) {
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${rep.titulo}</b><br>${rep.direccion}`);
    }
  });

  window.map = map;
}

// ===== INIT =====
export async function initInicio() {
  await cargarReportes();

  // Actualizar sidebar con datos reales si vienen del backend
  const sidebar = {
    ...datosSidebar,
    totalReportes: reportesGlobal.length,
  };
  renderSidebar(sidebar, ".sidebar");

  document
    .querySelector(".btn-nuevo-reporte")
    ?.addEventListener("click", abrirModal);

  setTimeout(() => {
    initMapa();
    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 200);
  }, 100);
}