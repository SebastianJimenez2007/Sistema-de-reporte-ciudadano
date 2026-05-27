// ===== ENTIDAD.JS - Panel de Entidad =====
import { getSesion } from "./auth.js";
import { API_URL } from "./api-config.js";

export function initEntidad() {
  // Verificar que sea entidad
  const sesion = getSesion();
  if (!sesion || sesion.rol !== "entidad") {
    window.location.hash = "#index";
    return;
  }

  console.log("✅ Panel de Entidad cargado", sesion.institucion);

  // Mostrar nombre de la institución
  const institucionNombre = document.getElementById("entidad-nombre");
  if (institucionNombre && sesion.institucion) {
    institucionNombre.textContent = sesion.institucion;
  }

  // Cargar reportes asignados
  cargarReportesEntidad();
  cargarEstadisticasEntidad();
}

async function cargarReportesEntidad() {
  const container = document.getElementById("reportes-entidad");
  if (!container) return;

  const sesion = getSesion();

  try {
    const response = await fetch(`${API_URL}/reportes`);
    let reportes = response.ok ? await response.json() : [];

    // Filtrar reportes asignados a esta entidad
    const reportesAsignados = reportes.filter(r => 
      sesion.reportesAsignados?.includes(r.id || r.idReporte)
    );

    if (reportesAsignados.length === 0) {
      container.innerHTML = '<div class="no-reportes">No hay reportes asignados</div>';
      return;
    }

    container.innerHTML = reportesAsignados.map(reporte => `
      <div class="reporte-entidad" data-id="${reporte.id || reporte.idReporte}">
        <div class="reporte-header">
          <h4>${reporte.titulo}</h4>
          <span class="estado-badge ${reporte.estado || 'pendiente'}">${reporte.estado || 'Pendiente'}</span>
        </div>
        <p class="reporte-descripcion">${reporte.descripcion}</p>
        <div class="reporte-meta">
          <span><i class="bi bi-geo-alt"></i> ${reporte.direccion || "Sin dirección"}</span>
          <span><i class="bi bi-calendar"></i> ${new Date(reporte.fechaCreacion || Date.now()).toLocaleDateString()}</span>
        </div>
        <div class="acciones-entidad">
          ${reporte.estado === 'pendiente' ? '<button class="btn-proceso" data-id="' + (reporte.id || reporte.idReporte) + '">⏳ Marcar En Proceso</button>' : ''}
          ${reporte.estado === 'en-proceso' ? '<button class="btn-resolver" data-id="' + (reporte.id || reporte.idReporte) + '">✅ Marcar Resuelto</button>' : ''}
          <button class="btn-ver-detalle" data-id="${reporte.id || reporte.idReporte}">Ver detalle</button>
        </div>
      </div>
    `).join("");

    // Agregar eventos
    document.querySelectorAll(".btn-proceso").forEach(btn => {
      btn.addEventListener("click", () => cambiarEstado(btn.dataset.id, "en-proceso"));
    });

    document.querySelectorAll(".btn-resolver").forEach(btn => {
      btn.addEventListener("click", () => cambiarEstado(btn.dataset.id, "resuelto"));
    });

    document.querySelectorAll(".btn-ver-detalle").forEach(btn => {
      btn.addEventListener("click", () => verDetalleReporte(btn.dataset.id));
    });

  } catch (error) {
    console.error("Error cargando reportes:", error);
    container.innerHTML = '<div class="error">Error al cargar los reportes</div>';
  }
}

async function cargarEstadisticasEntidad() {
  const sesion = getSesion();
  
  const asignados = document.getElementById("entidad-asignados");
  const enProceso = document.getElementById("entidad-proceso");
  const resueltos = document.getElementById("entidad-resueltos");

  if (asignados) asignados.textContent = sesion.reportesAsignados?.length || 0;
  if (enProceso) enProceso.textContent = sesion.reportesProceso?.length || 0;
  if (resueltos) resueltos.textContent = sesion.reportesResueltos?.length || 0;
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    const response = await fetch(`${API_URL}/reportes/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (response.ok) {
      alert(`✅ Reporte marcado como ${nuevoEstado === "en-proceso" ? "En Proceso" : "Resuelto"}`);
      cargarReportesEntidad();
    } else {
      alert("❌ Error al cambiar el estado");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión");
  }
}

function verDetalleReporte(id) {
  alert(`Ver detalle del reporte ${id} - Próximamente`);
}