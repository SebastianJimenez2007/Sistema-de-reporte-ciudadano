import { renderCards } from "../components/cards.js";
import { renderSidebar } from "../components/sidebar.js";
import { abrirModal } from "../components/modal.js";
import { API_URL } from './api-config.js';

let map = null;
let reportesGlobal = [];

async function cargarReportes() {
    try {
        const response = await fetch(`${API_URL}/reportes`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        reportesGlobal = await response.json();
        console.log("Reportes cargados:", reportesGlobal); // Ver en consola
        renderCards(reportesGlobal, ".cards", openReporte);
        return reportesGlobal;
    } catch (error) {
        console.error("Error cargando reportes:", error);
        return [];
    }
}

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
        if (rep.latitud && rep.longitud) {
            L.marker([rep.latitud, rep.longitud])
                .addTo(map)
                .bindPopup(`<b>${rep.titulo}</b><br>${rep.direccion}`);
        }
    });
}

function openReporte(rep) {
    if (!map) return;
    if (rep.latitud && rep.longitud) {
        map.setView([rep.latitud, rep.longitud], 16);
        L.popup()
            .setLatLng([rep.latitud, rep.longitud])
            .setContent(`<b>${rep.titulo}</b><br>${rep.descripcion}`)
            .openOn(map);
    }
}

export async function initInicio() {
    await cargarReportes();
    renderSidebar({
        totalReportes: reportesGlobal.length,
        categorias: [],
        metricas: []
    }, ".sidebar");
    
    document.querySelector(".btn-nuevo-reporte")?.addEventListener("click", abrirModal);
    
    setTimeout(() => {
        initMapa();
        if (map) map.invalidateSize();
    }, 100);
}