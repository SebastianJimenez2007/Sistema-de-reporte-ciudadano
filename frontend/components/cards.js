import { API_URL } from "../js/api-config.js";
import { abrirModalDetalle } from "./modal-details.js";

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function crearCard(rep, onOpen) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="card-img">
<<<<<<< HEAD
      <img src="${rep.imagenUrl ? `http://localhost:8085${rep.imagenUrl}` : 'https://picsum.photos/400/200?1'}" alt="${rep.titulo}">
      <span class="estado ${rep.estado || 'activo'}"></span>
=======
      <img src="${rep.imagenUrl || "https://picsum.photos/400/200?1"}" alt="${rep.titulo}">
      <span class="estado ${rep.estado || "activo"}"></span>
>>>>>>> 570314d439576c984de0170a802ba20d1f17b0b5
    </div>

    <div class="card-body">
      <span class="categoria">${rep.categoria?.nombre || "Sin categoría"}</span>
      <h3>${rep.titulo}</h3>
      <p>${rep.descripcion}</p>

      <div class="ubicacion"> <i class="bi bi-geo-alt"></i> ${rep.direccion || "Sin dirección"}</div>

      <div class="card-footer">
        <span>👁 ${rep.vistas || 0}</span>
        <span><i class="bi bi-hand-thumbs-up"></i> <span class="apoyos-count">${rep.apoyo || 0}</span></span>
        <button class="btn-apoyar">Apoyar</button>
      </div>

      <div class="fecha">
        ${formatearFecha(rep.fechaCreacion || new Date())}
      </div>
    </div>
  `;

  const btn = card.querySelector(".btn-apoyar");
  const apoyosText = card.querySelector(".apoyos-count");

  btn.addEventListener("click", async (e) => {
    e.stopPropagation();

    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "...";

    try {
<<<<<<< HEAD
        const response = await fetch(`${API_URL}/reportes/${rep.idReporte}/apoyar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            rep.apoyo = (rep.apoyo || 0) + 1;
            apoyosText.textContent = rep.apoyo;
        }
    } catch (error) {
        console.error('Error al apoyar:', error);
=======
      const response = await fetch(
        `${API_URL}/reportes/${rep.idReporte}/apoyar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        rep.apoyo = (rep.apoyo || 0) + 1;
        apoyosText.textContent = rep.apoyo;
        btn.textContent = "✓ Apoyado";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
      } else {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    } catch (error) {
      console.error("Error al apoyar:", error);
      btn.textContent = originalText;
      btn.disabled = false;
>>>>>>> 570314d439576c984de0170a802ba20d1f17b0b5
    }
  });

  // Click en la card - abre modal de detalle con animación
  card.addEventListener("click", () => {
    // Función para actualizar los apoyos desde el modal
    const handleApoyoActualizado = (id, nuevosApoyos) => {
      if ((rep.idReporte || rep.id) === id) {
        rep.apoyo = nuevosApoyos;
        apoyosText.textContent = nuevosApoyos;
      }
    };
    
    abrirModalDetalle(rep, handleApoyoActualizado);
  });

  return card;
}

export function renderCards(data, containerSelector, onOpen) {
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error("No se encontró el contenedor de cards");
    return;
  }

  container.innerHTML = "";

  data.forEach((rep) => {
    const card = crearCard(rep, onOpen);
    container.appendChild(card);
  });
}