// ===== TRANSPARENCIA.JS =====
import { API_URL } from './api-config.js';

let chartCategorias = null;
let chartEstados = null;

async function cargarDatos() {
    try {
        const [stats, categorias, barrios] = await Promise.all([
            fetch(`${API_URL}/reportes/estadisticas`).then(r => r.json()),
            fetch(`${API_URL}/reportes/estadisticas/categorias`).then(r => r.json()),
            fetch(`${API_URL}/reportes/estadisticas/barrios`).then(r => r.json())
        ]);
        
        actualizarMetricas(stats);
        renderSemaforoYRanking(barrios);
        renderChartCategorias(categorias);
        renderChartEstados(stats);
        
    } catch (error) {
        console.error("Error cargando datos de transparencia:", error);
    }
}

function actualizarMetricas(stats) {
    document.getElementById("m-total").textContent = stats.total || 0;
    document.getElementById("m-tiempo").textContent = `${stats.tiempoPromedio || 0}d`;
    document.getElementById("m-resueltos").textContent = stats.resueltos || 0;
    document.getElementById("m-pendientes").textContent = stats.pendientes || 0;
    
    const badgeVelocidad = document.getElementById("m-velocidad-badge");
    if (badgeVelocidad) {
        const tiempo = stats.tiempoPromedio || 0;
        badgeVelocidad.textContent = tiempo > 10 ? "Lento" : "Rápido";
        badgeVelocidad.className = `metrica-badge ${tiempo > 10 ? "rojo-badge" : "verde-badge"}`;
    }
    
    const badgeTasa = document.getElementById("m-tasa-badge");
    if (badgeTasa) {
        const tasa = stats.tasaResolucion || 0;
        badgeTasa.textContent = `${tasa}%`;
        badgeTasa.className = `metrica-badge ${tasa > 60 ? "verde-badge" : "amarillo-badge"}`;
    }
}

function renderSemaforoYRanking(barrios) {
    const barriosConPct = (barrios || []).map(b => ({
        ...b,
        pct: b.total > 0 ? Math.round((b.sinResolver / b.total) * 100) : 0,
        nivel: b.total > 0 ? (b.sinResolver / b.total) > 0.66 ? "rojo" : (b.sinResolver / b.total) > 0.33 ? "amarillo" : "verde" : "verde"
    })).sort((a, b) => b.sinResolver - a.sinResolver);
    
    const semaforoGrid = document.getElementById("semaforo-grid");
    if (semaforoGrid) {
        semaforoGrid.innerHTML = barriosConPct.map(b => `
            <div class="semaforo-item">
                <div class="semaforo-dot ${b.nivel}"></div>
                <div class="semaforo-info">
                    <span class="semaforo-nombre">${b.barrio}</span>
                    <span class="semaforo-datos">${b.sinResolver} sin resolver / ${b.total} total</span>
                </div>
                <div class="semaforo-barra-wrapper">
                    <div class="semaforo-barra ${b.nivel}" style="width:${b.pct}%"></div>
                </div>
                <span class="semaforo-pct ${b.nivel}">${b.pct}%</span>
            </div>
        `).join("");
    }
    
    const rankingZonas = document.getElementById("ranking-zonas");
    if (rankingZonas) {
        rankingZonas.innerHTML = barriosConPct.map((b, i) => `
            <div class="ranking-item">
                <span class="ranking-pos">${i + 1}</span>
                <div class="ranking-info">
                    <span class="ranking-nombre">${b.barrio}</span>
                    <span class="ranking-sub">${b.total} reportes totales</span>
                </div>
                <span class="ranking-valor">${b.sinResolver} sin resolver</span>
            </div>
        `).join("");
    }
}

function renderChartCategorias(categorias) {
    const ctx = document.getElementById("chart-categorias")?.getContext("2d");
    if (!ctx) return;
    
    if (chartCategorias) chartCategorias.destroy();
    
    chartCategorias = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categorias.map(c => c.nombre),
            datasets: [{
                data: categorias.map(c => c.total),
                backgroundColor: ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4"],
                borderWidth: 2,
                borderColor: "#fff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } }
        }
    });
}

function renderChartEstados(stats) {
    const ctx = document.getElementById("chart-estados")?.getContext("2d");
    if (!ctx) return;
    
    if (chartEstados) chartEstados.destroy();
    
    chartEstados = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Activos", "Pendientes", "Resueltos"],
            datasets: [{
                label: "Cantidad",
                data: [stats.activos || 0, stats.pendientes || 0, stats.resueltos || 0],
                backgroundColor: ["#f59e0b", "#ef4444", "#22c55e"],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

export function initTransparencia() {
    cargarDatos();
}