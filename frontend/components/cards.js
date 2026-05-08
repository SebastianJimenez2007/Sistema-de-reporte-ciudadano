
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// ===== CREAR UNA CARD =====
export function crearCard(rep, onOpen) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="card-img">
      <img src="${rep.imagen}" alt="${rep.titulo}">
      <span class="estado ${rep.estado}"></span>
    </div>

    <div class="card-body">
      <span class="categoria">${rep.categoria}</span>
      <h3>${rep.titulo}</h3>
      <p>${rep.descripcion}</p>

      <div class="ubicacion"> <i class="bi bi-geo-alt"></i> ${rep.direccion}</div>

      <div class="card-footer">
        <span>👁 ${rep.vistas}</span>
        <span><i class="bi bi-hand-thumbs-up"></i> <span class="apoyos-count">${rep.apoyos}</span></span>
        <button class="btn-apoyar">Apoyar</button>
      </div>

      <div class="fecha">
        ${formatearFecha(rep.fecha)}
      </div>
    </div>
  `;

  // ===== BOTÓN APOYAR =====
  const btn = card.querySelector(".btn-apoyar");
  const apoyosText = card.querySelector(".apoyos-count");

  btn.addEventListener("click", (e) => {
    e.stopPropagation(); //  evita abrir la card

    rep.apoyos++;
    apoyosText.textContent = rep.apoyos;

    //  aquí luego conectamos con backend
    // fetch(`/api/reportes/${rep.id}/apoyar`, { method: "POST" });
  });

  // ===== CLICK EN LA CARD =====
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

  container.innerHTML = ""; // limpiar antes

  data.forEach(rep => {
    const card = crearCard(rep, onOpen);
    container.appendChild(card);
  });
}
