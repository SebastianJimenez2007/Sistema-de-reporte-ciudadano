// ===== COMPONENTE SIDEBAR =====

export function renderSidebar(datos, containerSelector) {
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error("No se encontró el contenedor del sidebar");
    return;
  }

  const { totalReportes, categorias, metricas } = datos;

  container.innerHTML = `
    <!-- CARD: Total + Categorías -->
    <div class="sidebar-card">
      <div class="total-reportes">
        <div class="total-icon"><i class="bi bi-exclamation-triangle"></i></div>
        <div class="total-info">
          <div class="numero">${totalReportes}</div>
          <div class="label">Reportes Totales</div>
        </div>
      </div>

      <h4>Por Categoría:</h4>

      ${categorias.map(cat => `
        <div class="categoria-item">
          <div class="cat-icon ${cat.clase}">${cat.icono}</div>
          <span class="cat-nombre">${cat.nombre}</span>
          <span class="cat-count">${cat.count}</span>
        </div>
      `).join("")}
    </div>

    <!-- CARD: Métricas -->
    <div class="sidebar-card">
      <h4>📈 Métricas de Gestión</h4>
      <p class="sidebar-subtitle">Eficiencia institucional</p>

      ${metricas.map(m => `
        <div class="metrica-item">
          <span class="metrica-label">${m.label}</span>
          <span class="metrica-valor ${m.color}">${m.valor}</span>
        </div>
      `).join("")}
    </div>
  `;
}