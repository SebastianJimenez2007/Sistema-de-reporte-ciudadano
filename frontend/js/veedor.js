// ===== VEEDOR.JS - Panel de Veedor =====
import { getSesion } from "./auth.js";
import { API_URL } from "./api-config.js";

export function initVeedor() {
  // Verificar que sea veedor
  const sesion = getSesion();
  if (!sesion || sesion.rol !== "veedor") {
    window.location.hash = "#index";
    return;
  }

  console.log("✅ Panel de Veedor cargado");

  // Configurar filtros
  const filtroEstado = document.getElementById("filtro-estado-moderacion");
  const btnActualizar = document.getElementById("btn-actualizar");

  if (filtroEstado) {
    filtroEstado.addEventListener("change", cargarReportesModeracion);
  }

  if (btnActualizar) {
    btnActualizar.addEventListener("click", cargarReportesModeracion);
  }

  // Cargar reportes
  cargarReportesModeracion();
}

async function cargarReportesModeracion() {
  const container = document.getElementById("reportes-moderacion");
  if (!container) return;

  const filtro = document.getElementById("filtro-estado-moderacion")?.value || "todos";

  try {
    const response = await fetch(`${API_URL}/reportes`);
    let reportes = response.ok ? await response.json() : [];

    // Filtrar según estado seleccionado
    if (filtro !== "todos") {
      reportes = reportes.filter(r => r.estado === filtro);
    }

    if (reportes.length === 0) {
      container.innerHTML = '<div class="no-reportes">No hay reportes para mostrar</div>';
      return;
    }

    container.innerHTML = reportes.map(reporte => `
      <div class="reporte-moderacion" data-id="${reporte.id || reporte.idReporte}">
        <div class="reporte-header">
          <h4>${reporte.titulo}</h4>
          <span class="estado-badge ${reporte.estado || 'pendiente'}">${reporte.estado || 'Pendiente'}</span>
        </div>
        <p class="reporte-descripcion">${reporte.descripcion}</p>
        <div class="reporte-meta">
          <span><i class="bi bi-geo-alt"></i> ${reporte.direccion || "Sin dirección"}</span>
          <span><i class="bi bi-calendar"></i> ${new Date(reporte.fechaCreacion || Date.now()).toLocaleDateString()}</span>
        </div>
        <div class="acciones-moderacion">
          <button class="btn-validar" data-id="${reporte.id || reporte.idReporte}">✓ Validar</button>
          <button class="btn-rechazar" data-id="${reporte.id || reporte.idReporte}">✗ Rechazar</button>
          <button class="btn-ver-detalle" data-id="${reporte.id || reporte.idReporte}">Ver detalle</button>
        </div>
      </div>
    `).join("");

    // Agregar eventos a los botones
    document.querySelectorAll(".btn-validar").forEach(btn => {
      btn.addEventListener("click", () => validarReporte(btn.dataset.id));
    });

    document.querySelectorAll(".btn-rechazar").forEach(btn => {
      btn.addEventListener("click", () => rechazarReporte(btn.dataset.id));
    });

    document.querySelectorAll(".btn-ver-detalle").forEach(btn => {
      btn.addEventListener("click", () => verDetalleReporte(btn.dataset.id));
    });

  } catch (error) {
    console.error("Error cargando reportes:", error);
    container.innerHTML = '<div class="error">Error al cargar los reportes</div>';
  }
}

async function validarReporte(id) {
  try {
    const response = await fetch(`${API_URL}/reportes/${id}/validar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });

    if (response.ok) {
      alert("✅ Reporte validado correctamente");
      cargarReportesModeracion();
    } else {
      alert("❌ Error al validar el reporte");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión");
  }
}

async function rechazarReporte(id) {
  try {
    const response = await fetch(`${API_URL}/reportes/${id}/rechazar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });

    if (response.ok) {
      alert("❌ Reporte rechazado");
      cargarReportesModeracion();
    } else {
      alert("Error al rechazar el reporte");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión");
  }
}

function verDetalleReporte(id) {
  alert(`Ver detalle del reporte ${id} - Próximamente`);
}