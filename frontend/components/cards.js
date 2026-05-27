import { API_URL } from '../js/api-config.js';

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function crearCard(rep, onOpen) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="card-img">
      <img src="${rep.imagenUrl || 'https://picsum.photos/400/200?1'}" alt="${rep.titulo}">
      <span class="estado ${rep.estado || 'activo'}"></span>
    </div>

    <div class="card-body">
      <span class="categoria">${rep.categoria?.nombre || 'Sin categoría'}</span>
      <h3>${rep.titulo}</h3>
      <p>${rep.descripcion}</p>

      <div class="ubicacion"> <i class="bi bi-geo-alt"></i> ${rep.direccion || 'Sin dirección'}</div>

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

    try {
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
    }
  });

  card.addEventListener("click", () => {
    if (onOpen) onOpen(rep);
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

  data.forEach(rep => {
    const card = crearCard(rep, onOpen);
    container.appendChild(card);
  });
}