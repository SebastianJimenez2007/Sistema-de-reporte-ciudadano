// ===== COMPONENTE MODAL NUEVO REPORTE =====
 
const categorias = [
  { nombre: "Infraestructura",   icono: "🔧" },
  { nombre: "Espacios Públicos", icono: "🌳" },
  { nombre: "Seguridad",         icono: "🛡️" },
  { nombre: "Alumbrado Público", icono: "💡" },
  { nombre: "Aseo",              icono: "🗑️" },
  { nombre: "Vías",              icono: "🚧" },
  { nombre: "Otros",             icono: "📋" },
];
 
// Estado del formulario
let estado = {
  paso: 1,
  categoria: null,
  descripcion: "",
  lat: null,
  lng: null,
  direccion: "",
  imagen: null,
};
 
let modalMap = null;
let marker = null;
 
// ===== ABRIR MODAL =====
export function abrirModal() {
  // Reset estado
  estado = { paso: 1, categoria: null, descripcion: "", lat: null, lng: null, direccion: "", imagen: null };
 
  // Crear overlay
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-overlay";
 
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>Nuevo Reporte</h2>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
 
      <!-- Stepper -->
      <div class="stepper">
        <div class="step active" id="step-1">
          <div class="step-circle">1</div>
          <div class="step-line"></div>
        </div>
        <div class="step" id="step-2">
          <div class="step-circle">2</div>
          <div class="step-line"></div>
        </div>
        <div class="step" id="step-3">
          <div class="step-circle">3</div>
        </div>
      </div>
      <p class="step-label" id="step-label">Paso 1: Selecciona la categoría</p>
 
      <!-- Contenido del paso -->
      <div class="modal-body" id="modal-body"></div>
 
      <!-- Botones -->
      <div class="modal-footer">
        <button class="btn-anterior" id="btn-anterior" style="display:none">Anterior</button>
        <button class="btn-siguiente" id="btn-siguiente">Siguiente</button>
      </div>
    </div>
  `;
 
  document.body.appendChild(overlay);
 
  // Listeners
  document.getElementById("modal-close").addEventListener("click", cerrarModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) cerrarModal(); });
  document.getElementById("btn-siguiente").addEventListener("click", siguientePaso);
  document.getElementById("btn-anterior").addEventListener("click", anteriorPaso);
 
  renderPaso();
}
 

function cerrarModal() {
  if (modalMap) { modalMap.remove(); modalMap = null; }
  const overlay = document.getElementById("modal-overlay");
  if (overlay) overlay.remove();
}
 
 /// renderiza el paso actual 
function renderPaso() {
  const body = document.getElementById("modal-body");
  const label = document.getElementById("step-label");
  const btnAnterior = document.getElementById("btn-anterior");
  const btnSiguiente = document.getElementById("btn-siguiente");
 
  // Actualizar stepper
  [1, 2, 3].forEach(n => {
    const step = document.getElementById(`step-${n}`);
    step.classList.toggle("active",    n === estado.paso);
    step.classList.toggle("completado", n < estado.paso);
  });
 
  btnAnterior.style.display = estado.paso > 1 ? "block" : "none";
  btnSiguiente.textContent  = estado.paso === 3 ? "Enviar Reporte" : "Siguiente";
 
  // Renderizar contenido
  if (estado.paso === 1) {
    label.textContent = "Paso 1: Selecciona la categoría";
    btnSiguiente.disabled = !estado.categoria;
    body.innerHTML = `
      <label class="campo-label">Categoría del Problema *</label>
      <div class="categorias-grid">
        ${categorias.map(cat => `
          <button class="cat-btn ${estado.categoria === cat.nombre ? "selected" : ""}"
                  data-cat="${cat.nombre}">
            <span>${cat.icono}</span> ${cat.nombre}
          </button>
        `).join("")}
      </div>
    `;
    body.querySelectorAll(".cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        estado.categoria = btn.dataset.cat;
        body.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        document.getElementById("btn-siguiente").disabled = false;
      });
    });
  }
 
  if (estado.paso === 2) {
    label.textContent = "Paso 2: Describe el problema";
    btnSiguiente.disabled = estado.descripcion.trim().length < 10;
    body.innerHTML = `
      <label class="campo-label">Descripción del Problema *</label>
      <textarea class="campo-textarea" id="descripcion" maxlength="280"
        placeholder="Describe detalladamente el problema que observaste...">${estado.descripcion}</textarea>
      <div class="textarea-footer">
        <span>Sé específico y claro en tu descripción</span>
        <span id="char-count">${estado.descripcion.length}/280</span>
      </div>
    `;
    const textarea = document.getElementById("descripcion");
    textarea.addEventListener("input", () => {
      estado.descripcion = textarea.value;
      document.getElementById("char-count").textContent = `${textarea.value.length}/280`;
      document.getElementById("btn-siguiente").disabled = textarea.value.trim().length < 10;
    });
    textarea.focus();
  }
 
  if (estado.paso === 3) {
    label.textContent = "Paso 3: Ubicación y evidencia";
    btnSiguiente.disabled = !estado.lat;
    body.innerHTML = `
      <label class="campo-label">Marca la ubicación en el mapa *</label>
      <div id="modal-map"></div>
      <p class="map-hint"><i class="bi bi-geo-alt-fill"></i> Toca el mapa para marcar el punto exacto del problema</p>
 
      <div id="direccion-box" class="direccion-box" style="display:${estado.lat ? "flex" : "none"}">
        <i class="bi bi-geo-alt-fill"></i> <span id="direccion-texto">${estado.direccion || "Ubicación seleccionada"}</span>
      </div>
 
      <label class="campo-label" style="margin-top:16px">Evidencia fotográfica</label>
      <div class="evidencia-btns">
        <label class="btn-evidencia" for="input-camara">
          <i class="bi bi-camera-fill"></i>
          <input type="file" id="input-camara" accept="image/*" capture="environment" style="display:none">
        </label>
        <label class="btn-evidencia" for="input-galeria">
          <i class="bi bi-card-image"></i> Galería
          <input type="file" id="input-galeria" accept="image/*" style="display:none">
        </label>
      </div>
      <div id="preview-img"></div>
    `;
 
    // Inicializa mapa del modal
    setTimeout(() => {
      if (modalMap) { modalMap.remove(); modalMap = null; }
 
      const centro = estado.lat
        ? [estado.lat, estado.lng]
        : [4.65, -74.1];
 
      modalMap = L.map("modal-map").setView(centro, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(modalMap);
 
      if (estado.lat) {
        marker = L.marker([estado.lat, estado.lng]).addTo(modalMap);
      }
 
      modalMap.on("click", async (e) => {
        estado.lat = e.latlng.lat;
        estado.lng = e.latlng.lng;
 
        if (marker) marker.remove();
        marker = L.marker([estado.lat, estado.lng]).addTo(modalMap);
 
        document.getElementById("btn-siguiente").disabled = false;
        document.getElementById("direccion-box").style.display = "flex";
 
        // Reverse geocoding con Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${estado.lat}&lon=${estado.lng}&format=json`
          );
          const data = await res.json();
          estado.direccion = data.display_name || "Ubicación seleccionada";
          document.getElementById("direccion-texto").textContent = estado.direccion;
        } catch {
          estado.direccion = `${estado.lat.toFixed(5)}, ${estado.lng.toFixed(5)}`;
          document.getElementById("direccion-texto").textContent = estado.direccion;
        }
      });
    }, 100);
 
    // escoger entre foto o galeria
    ["input-camara", "input-galeria"].forEach(id => {
      document.getElementById(id)?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        estado.imagen = file;
        const url = URL.createObjectURL(file);
        document.getElementById("preview-img").innerHTML = `
          <img src="${url}" class="preview-imagen" alt="Evidencia">
          <button class="btn-quitar-img" id="btn-quitar">✕ Quitar foto</button>
        `;
        document.getElementById("btn-quitar").addEventListener("click", () => {
          estado.imagen = null;
          document.getElementById("preview-img").innerHTML = "";
        });
      });
    });
  }
}
 
// La navegacion 
function siguientePaso() {
  if (estado.paso < 3) {
    estado.paso++;
    renderPaso();
  } else {
    enviarReporte();
  }
}
 
function anteriorPaso() {
  if (estado.paso > 1) {
    estado.paso--;
    renderPaso();
  }
}
 
// enviar el reporte
function enviarReporte() {
  //  Aquí conectamos el backend backend PHP
  console.log("Reporte a enviar:", estado);
 
  // Por ahora va a mostrar la confirmación jiji
  const body = document.getElementById("modal-body");
  const footer = document.getElementById("modal-footer");
  body.innerHTML = `
    <div class="exito">
      <div class="exito-icono"><i class="bi bi-check-square"></i></div>
      <h3>¡Reporte enviado!</h3>
      <p>Tu reporte ha sido registrado. La comunidad y las autoridades podrán verlo.</p>
    </div>
  `;
  document.querySelector(".modal-footer").innerHTML = `
    <button class="btn-siguiente" onclick="document.getElementById('modal-overlay').remove()">
      Cerrar
    </button>
  `;
}