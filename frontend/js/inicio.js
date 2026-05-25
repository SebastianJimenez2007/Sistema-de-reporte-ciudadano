import { renderCards } from "../components/cards.js";
import { renderSidebar } from "../components/sidebar.js";
import { abrirModal } from "../components/modal.js";

// ===== DATOS (TEMPORALES) =====
export const reportes = [
  
  {
    id: 1,
    titulo: "Alcantarilla destapada en vía",
    descripcion: "Riesgo de accidente para motociclistas y peatones.",
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
    titulo: "Poste de luz dañado",
    descripcion: "Zona completamente oscura en la noche.",
    categoria: "Alumbrado",
    direccion: "Calle 72 #15-30",
    imagen: "https://picsum.photos/400/200?2",
    lat: 4.66,
    lng: -74.09,
    vistas: 210,
    apoyos: 45,
    estado: "pendiente",
    fecha: "2026-04-28T18:20:00",
  },
  {
    id: 3,
    titulo: "Basura acumulada en esquina",
    descripcion: "Malos olores y presencia de insectos.",
    categoria: "Aseo",
    direccion: "Av. Caracas con Calle 40",
    imagen: "https://picsum.photos/400/200?3",
    lat: 4.64,
    lng: -74.08,
    vistas: 150,
    apoyos: 32,
    estado: "activo",
    fecha: "2026-04-27T10:10:00",
  },
  {
    id: 4,
    titulo: "Hueco en la carretera",
    descripcion: "Puede causar daños a vehículos.",
    categoria: "Vías",
    direccion: "Carrera 7 con Calle 100",
    imagen: "https://picsum.photos/400/200?4",
    lat: 4.68,
    lng: -74.05,
    vistas: 500,
    apoyos: 120,
    estado: "resuelto",
    fecha: "2026-04-25T09:00:00",
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

// ===== MAPA GLOBAL =====
let map = null;

// ===== INICIALIZAR MAPA =====
function initMapa() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  if (map !== null) {
    map.remove();
    map = null;
  }

  map = L.map("map").setView([4.65, -74.1], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  reportes.forEach((rep) => {
    L.marker([rep.lat, rep.lng])
      .addTo(map)
      .bindPopup(`<b>${rep.titulo}</b><br>${rep.direccion}`);
  });

  window.map = map;
}

// ===== CLICK EN CARD =====
function openReporte(rep) {
  if (!window.map) return;

  map.setView([rep.lat, rep.lng], 16);

  L.popup()
    .setLatLng([rep.lat, rep.lng])
    .setContent(`<b>${rep.titulo}</b><br>${rep.descripcion}`)
    .openOn(map);
}

// ===== INICIALIZAR TODO =====
export function initInicio() {
  renderCards(reportes, ".cards", openReporte);
  renderSidebar(datosSidebar, ".sidebar");

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
