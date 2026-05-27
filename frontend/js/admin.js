// ===== ADMIN.JS - Panel de Administrador =====
import { getSesion, verificarAcceso } from "./auth.js";

export function initAdmin() {
  // Verificar que sea admin
  const sesion = getSesion();
  if (!sesion || sesion.rol !== "admin") {
    window.location.hash = "#index";
    return;
  }

  console.log("✅ Panel de Administrador cargado");

  // Configurar botones del panel
  const btnUsuarios = document.getElementById("btn-gestionar-usuarios");
  const btnInstituciones = document.getElementById("btn-gestionar-instituciones");
  const btnMetricas = document.getElementById("btn-metricas");
  const btnConfiguracion = document.getElementById("btn-configuracion");

  if (btnUsuarios) {
    btnUsuarios.addEventListener("click", () => {
      alert("Módulo de gestión de usuarios - Próximamente");
    });
  }

  if (btnInstituciones) {
    btnInstituciones.addEventListener("click", () => {
      alert("Módulo de instituciones - Próximamente");
    });
  }

  if (btnMetricas) {
    btnMetricas.addEventListener("click", () => {
      alert("Módulo de métricas - Próximamente");
    });
  }

  if (btnConfiguracion) {
    btnConfiguracion.addEventListener("click", () => {
      alert("Configuración del sistema - Próximamente");
    });
  }

  // Cargar tabla de reportes recientes
  cargarReportesRecientes();
}

async function cargarReportesRecientes() {
  const tbody = document.getElementById("admin-reportes-table");
  if (!tbody) return;

  try {
    const response = await fetch("http://localhost:8080/api/reportes");
    const reportes = response.ok ? await response.json() : [];

    if (reportes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No hay reportes</td></tr>';
      return;
    }

    tbody.innerHTML = reportes.slice(0, 5).map(reporte => `
      <tr>
        <td>${reporte.id || reporte.idReporte}</td>
        <td>${reporte.titulo}</td>
        <td><span class="estado-badge ${reporte.estado}">${reporte.estado || "Pendiente"}</span></td>
        <td><button class="btn-ver" data-id="${reporte.id || reporte.idReporte}">Ver</button></td>
      </tr>
    `).join("");

    // Agregar eventos a botones ver
    document.querySelectorAll(".btn-ver").forEach(btn => {
      btn.addEventListener("click", () => {
        alert(`Ver reporte ${btn.dataset.id} - Próximamente`);
      });
    });
  } catch (error) {
    console.error("Error cargando reportes:", error);
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Error al cargar</td></tr>';
  }
}