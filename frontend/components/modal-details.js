// components/modal-details.js
import { API_URL } from "../js/api-config.js";

let activeModal = null;
let detailMap = null;

function formatearFechaDetalle(fecha) {
  if (!fecha) return "Fecha no disponible";
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obtenerClaseEstado(estado) {
  const estados = {
    activo: "activo",
    pendiente: "pendiente",
    resuelto: "resuelto",
    "en-proceso": "pendiente",
  };
  return estados[estado] || "pendiente";
}

function obtenerTextoEstado(estado) {
  const textos = {
    activo: "Activo",
    pendiente: "Pendiente",
    resuelto: "Resuelto",
    "en-proceso": "En proceso",
  };
  return textos[estado] || estado;
}

function initDetailMap(lat, lng, titulo, direccion) {
  if (detailMap) {
    detailMap.remove();
    detailMap = null;
  }

  const mapContainer = document.getElementById("modal-detail-map");
  if (!mapContainer) return;

  detailMap = L.map("modal-detail-map").setView([lat, lng], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
  }).addTo(detailMap);

  // Marcador personalizado
  const marker = L.marker([lat, lng]).addTo(detailMap);
  marker.bindPopup(`<b>${titulo}</b><br>${direccion}`).openPopup();

  setTimeout(() => {
    if (detailMap) detailMap.invalidateSize();
  }, 100);
}

export async function abrirModalDetalle(reporte, onApoyoActualizado) {
  // Cerrar modal existente si hay uno
  if (activeModal) {
    cerrarModalDetalle();
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const apoyosActuales = reporte.apoyo || 0;
  const imagenUrl =
    reporte.imagenUrl ||
    reporte.imagen ||
    "https://picsum.photos/800/400?random";
  
  const lat = reporte.latitud || reporte.lat;
  const lng = reporte.longitud || reporte.lng;

  // Crear overlay
  const overlay = document.createElement("div");
  overlay.className = "modal-detalle-overlay";
  overlay.id = "modal-detalle-overlay";

  overlay.innerHTML = `
    <div class="modal-detalle-container">
      <div class="modal-detalle-content">
        <button class="modal-detalle-close" id="modal-detalle-close">
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="modal-detalle-img">
          <img src="${imagenUrl}" alt="${reporte.titulo}">
          <span class="modal-estado ${obtenerClaseEstado(reporte.estado)}">
            ${obtenerTextoEstado(reporte.estado)}
          </span>
        </div>

        <div class="modal-detalle-body">
          <div class="modal-categoria">
            <span class="categoria-badge">
              <i class="bi bi-tag"></i> ${reporte.categoria?.nombre || reporte.categoria || "Sin categoría"}
            </span>
          </div>

          <h2 class="modal-titulo">${reporte.titulo}</h2>

          <div class="modal-meta">
            <div class="meta-item">
              <i class="bi bi-calendar3"></i>
              <span>${formatearFechaDetalle(reporte.fechaCreacion || reporte.fecha)}</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-geo-alt-fill"></i>
              <span>${reporte.direccion || "Sin dirección"}</span>
            </div>
          </div>

          <div class="modal-descripcion">
            <h3><i class="bi bi-file-text"></i> Descripción del problema</h3>
            <p>${reporte.descripcion}</p>
          </div>

          ${lat && lng ? `
          <div class="modal-ubicacion-mapa">
            <h3><i class="bi bi-map"></i> Ubicación del reporte</h3>
            <div id="modal-detail-map" class="modal-map"></div>
            <p class="modal-map-coords">
              <i class="bi bi-geo"></i> Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}
            </p>
          </div>
          ` : '<p class="sin-ubicacion"><i class="bi bi-exclamation-triangle"></i> No hay información de ubicación disponible</p>'}

          ${reporte.solucion ? `
          <div class="modal-solucion">
            <h3><i class="bi bi-check-circle"></i> Solución reportada</h3>
            <p>${reporte.solucion}</p>
          </div>
          ` : ""}

          <div class="modal-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-eye-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">${reporte.vistas || 0}</span>
                <span class="stat-label">Vistas totales</span>
              </div>
            </div>
            <div class="stat-card apoyos-stat" id="modal-apoyos-stat">
              <div class="stat-icon">
                <i class="bi bi-hand-thumbs-up-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number" id="modal-apoyos-count">${apoyosActuales}</span>
                <span class="stat-label">Personas apoyan</span>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-apoyar-modal" id="btn-apoyar-modal">
              <i class="bi bi-hand-thumbs-up"></i>
              Apoyar este reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Forzar reflow para activar animación
  overlay.offsetHeight;

  // Añadir clase para animación
  overlay.classList.add("active");

  const modalContainer = overlay.querySelector(".modal-detalle-container");
  if (modalContainer) {
    modalContainer.classList.add("animate-in");
  }

  activeModal = overlay;

  // Inicializar el mapa si hay coordenadas
  if (lat && lng) {
    setTimeout(() => {
      initDetailMap(lat, lng, reporte.titulo, reporte.direccion);
    }, 200);
  }

  // Configurar eventos
  const closeBtn = document.getElementById("modal-detalle-close");
  const apoyarBtn = document.getElementById("btn-apoyar-modal");
  const apoyosCountSpan = document.getElementById("modal-apoyos-count");

  // Cerrar al hacer click en overlay
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      cerrarModalDetalle();
    }
  });

  // Cerrar con botón X
  closeBtn?.addEventListener("click", cerrarModalDetalle);

  // Cerrar con tecla ESC
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      cerrarModalDetalle();
      document.removeEventListener("keydown", handleEsc);
    }
  };
  document.addEventListener("keydown", handleEsc);

  // Manejar apoyo
  apoyarBtn?.addEventListener("click", async (e) => {
    e.stopPropagation();

    apoyarBtn.disabled = true;
    apoyarBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Procesando...';

    try {
      const reporteId = reporte.idReporte || reporte.id;
      const response = await fetch(`${API_URL}/reportes/${reporteId}/apoyar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const nuevosApoyos = apoyosActuales + 1;
        apoyosCountSpan.textContent = nuevosApoyos;

        if (onApoyoActualizado) {
          onApoyoActualizado(reporteId, nuevosApoyos);
        }

        apoyarBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> ¡Gracias por apoyar!';
        apoyarBtn.classList.add("apoyado");

        setTimeout(() => {
          if (activeModal) {
            apoyarBtn.innerHTML = '<i class="bi bi-hand-thumbs-up"></i> Apoyar este reporte';
            apoyarBtn.disabled = false;
            apoyarBtn.classList.remove("apoyado");
          }
        }, 2000);
      } else {
        throw new Error("Error al apoyar");
      }
    } catch (error) {
      console.error("Error al apoyar:", error);
      apoyarBtn.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Error, intenta de nuevo';

      setTimeout(() => {
        if (activeModal) {
          apoyarBtn.innerHTML = '<i class="bi bi-hand-thumbs-up"></i> Apoyar este reporte';
          apoyarBtn.disabled = false;
        }
      }, 2000);
    }
  });
}

function cerrarModalDetalle() {
  if (!activeModal) return;

  // Limpiar mapa
  if (detailMap) {
    detailMap.remove();
    detailMap = null;
  }

  const modalContainer = activeModal.querySelector(".modal-detalle-container");
  if (modalContainer) {
    modalContainer.classList.remove("animate-in");
    modalContainer.classList.add("animate-out");
  }

  setTimeout(() => {
    if (activeModal && activeModal.parentNode) {
      activeModal.remove();
      activeModal = null;
    }
  }, 300);
}