import { API_URL } from '../js/api-config.js';

export async function renderSidebar(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error("No se encontró el contenedor del sidebar");
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/reportes/estadisticas`);
        const stats = await response.json();
        
        // Cargar categorías
        const catResponse = await fetch(`${API_URL}/reportes/estadisticas/categorias`);
        const categorias = await catResponse.json();
        
        container.innerHTML = `
            <div class="sidebar-card">
                <div class="total-reportes">
                    <div class="total-icon"><i class="bi bi-exclamation-triangle"></i></div>
                    <div class="total-info">
                        <div class="numero">${stats.total || 0}</div>
                        <div class="label">Reportes Totales</div>
                    </div>
                </div>

                <h4>Por Categoría:</h4>
                ${categorias.map(cat => `
                    <div class="categoria-item">
                        <div class="cat-icon infraestructura">🔧</div>
                        <span class="cat-nombre">${cat.nombre}</span>
                        <span class="cat-count">${cat.total || 0}</span>
                    </div>
                `).join("")}
            </div>

            <div class="sidebar-card">
                <h4>📈 Métricas de Gestión</h4>
                <p class="sidebar-subtitle">Eficiencia institucional</p>
                <div class="metrica-item">
                    <span class="metrica-label">⊘ Tasa de Resolución</span>
                    <span class="metrica-valor ${stats.tasaResolucion > 60 ? 'verde' : 'rojo'}">${stats.tasaResolucion || 0}%</span>
                </div>
                <div class="metrica-item">
                    <span class="metrica-label">⏱ Respuesta Promedio</span>
                    <span class="metrica-valor azul">${stats.tiempoPromedio || 0} días</span>
                </div>
                <div class="metrica-item">
                    <span class="metrica-label">✅ Resueltos este mes</span>
                    <span class="metrica-valor verde">${stats.resueltos || 0}</span>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error cargando sidebar:", error);
        container.innerHTML = `<div class="sidebar-card">Error cargando estadísticas</div>`;
    }
}