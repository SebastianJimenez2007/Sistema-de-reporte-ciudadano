// ===== TRANSPARENCIA.JS =====

const reportes = [
  {
    id: 1,
    categoria: "Infraestructura",
    estado: "activo",
    barrio: "Manga",
    fecha: "2026-04-29",
    diasRespuesta: null,
  },
  {
    id: 2,
    categoria: "Alumbrado",
    estado: "pendiente",
    barrio: "Bocagrande",
    fecha: "2026-04-28",
    diasRespuesta: null,
  },
  {
    id: 3,
    categoria: "Aseo",
    estado: "activo",
    barrio: "Manga",
    fecha: "2026-04-27",
    diasRespuesta: null,
  },
  {
    id: 4,
    categoria: "Vías",
    estado: "resuelto",
    barrio: "Getsemaní",
    fecha: "2026-04-25",
    diasRespuesta: 5,
  },
  {
    id: 5,
    categoria: "Seguridad",
    estado: "pendiente",
    barrio: "El Centro",
    fecha: "2026-04-20",
    diasRespuesta: null,
  },
  {
    id: 6,
    categoria: "Infraestructura",
    estado: "resuelto",
    barrio: "Bocagrande",
    fecha: "2026-04-15",
    diasRespuesta: 8,
  },
  {
    id: 7,
    categoria: "Alumbrado",
    estado: "resuelto",
    barrio: "El Centro",
    fecha: "2026-04-10",
    diasRespuesta: 4,
  },
  {
    id: 8,
    categoria: "Espacios Públicos",
    estado: "pendiente",
    barrio: "Getsemaní",
    fecha: "2026-04-08",
    diasRespuesta: null,
  },
  {
    id: 9,
    categoria: "Vías",
    estado: "activo",
    barrio: "Manga",
    fecha: "2026-04-05",
    diasRespuesta: null,
  },
  {
    id: 10,
    categoria: "Aseo",
    estado: "resuelto",
    barrio: "El Campestre",
    fecha: "2026-03-28",
    diasRespuesta: 6,
  },
  {
    id: 11,
    categoria: "Seguridad",
    estado: "activo",
    barrio: "El Centro",
    fecha: "2026-03-20",
    diasRespuesta: null,
  },
  {
    id: 12,
    categoria: "Infraestructura",
    estado: "pendiente",
    barrio: "El Campestre",
    fecha: "2026-03-15",
    diasRespuesta: null,
  },
];

let periodoActual = "all";
let chartCategorias = null;
let chartEstados = null;

function filtrarPorPeriodo(datos, periodo) {
  if (periodo === "all") return datos;
  const dias = periodo === "7d" ? 7 : 30;
  const corte = new Date();
  corte.setDate(corte.getDate() - dias);
  return datos.filter((r) => new Date(r.fecha) >= corte);
}

function calcularStats(datos) {
  const total = datos.length;
  const resueltos = datos.filter((r) => r.estado === "resuelto").length;
  const pendientes = datos.filter((r) => r.estado === "pendiente").length;
  const activos = datos.filter((r) => r.estado === "activo").length;

  const tiempos = datos
    .filter((r) => r.diasRespuesta)
    .map((r) => r.diasRespuesta);
  const tiempoPromedio = tiempos.length
    ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length)
    : 0;

  const tasaResolucion = total ? Math.round((resueltos / total) * 100) : 0;

  const porCategoria = {};
  datos.forEach((r) => {
    porCategoria[r.categoria] = (porCategoria[r.categoria] || 0) + 1;
  });

  const porBarrio = {};
  datos.forEach((r) => {
    if (!porBarrio[r.barrio])
      porBarrio[r.barrio] = { total: 0, sinResolver: 0 };
    porBarrio[r.barrio].total++;
    if (r.estado !== "resuelto") porBarrio[r.barrio].sinResolver++;
  });

  return {
    total,
    resueltos,
    pendientes,
    activos,
    tiempoPromedio,
    tasaResolucion,
    porCategoria,
    porBarrio,
  };
}

function actualizarMetricas(stats) {
  document.getElementById("m-total").textContent = stats.total;
  document.getElementById("m-tiempo").textContent = `${stats.tiempoPromedio}d`;
  document.getElementById("m-resueltos").textContent = stats.resueltos;
  document.getElementById("m-pendientes").textContent = stats.pendientes;

  const badgeVelocidad = document.getElementById("m-velocidad-badge");
  badgeVelocidad.textContent = stats.tiempoPromedio > 10 ? "Lento" : "Rápido";
  badgeVelocidad.className = `metrica-badge ${stats.tiempoPromedio > 10 ? "rojo-badge" : "verde-badge"}`;

  const badgeTasa = document.getElementById("m-tasa-badge");
  badgeTasa.textContent = `${stats.tasaResolucion}%`;
  badgeTasa.className = `metrica-badge ${stats.tasaResolucion > 60 ? "verde-badge" : "amarillo-badge"}`;
}

function renderSemaforo(porBarrio) {
  const grid = document.getElementById("semaforo-grid");

  const barrios = Object.entries(porBarrio)
    .map(([nombre, data]) => {
      const pct = data.total
        ? Math.round((data.sinResolver / data.total) * 100)
        : 0;
      const nivel = pct > 66 ? "rojo" : pct > 33 ? "amarillo" : "verde";
      return { nombre, ...data, pct, nivel };
    })
    .sort((a, b) => b.sinResolver - a.sinResolver);

  grid.innerHTML = barrios
    .map(
      (b) => `
    <div class="semaforo-item">
      <div class="semaforo-dot ${b.nivel}"></div>
      <div class="semaforo-info">
        <span class="semaforo-nombre">${b.nombre}</span>
        <span class="semaforo-datos">${b.sinResolver} sin resolver / ${b.total} total</span>
      </div>
      <div class="semaforo-barra-wrapper">
        <div class="semaforo-barra ${b.nivel}" style="width:${b.pct}%"></div>
      </div>
      <span class="semaforo-pct ${b.nivel}">${b.pct}%</span>
    </div>
  `,
    )
    .join("");
}

function renderRanking(porBarrio) {
  const container = document.getElementById("ranking-zonas");

  const zonas = Object.entries(porBarrio)
    .map(([nombre, data]) => ({ nombre, ...data }))
    .sort((a, b) => b.sinResolver - a.sinResolver);

  container.innerHTML = zonas
    .map(
      (z, i) => `
    <div class="ranking-item">
      <span class="ranking-pos">${i + 1}</span>
      <div class="ranking-info">
        <span class="ranking-nombre">${z.nombre}</span>
        <span class="ranking-sub">${z.total} reportes totales</span>
      </div>
      <span class="ranking-valor">${z.sinResolver} sin resolver</span>
    </div>
  `,
    )
    .join("");
}

function renderChartCategorias(porCategoria) {
  const ctx = document.getElementById("chart-categorias").getContext("2d");
  if (chartCategorias) chartCategorias.destroy();

  chartCategorias = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(porCategoria),
      datasets: [
        {
          data: Object.values(porCategoria),
          backgroundColor: [
            "#3b82f6",
            "#22c55e",
            "#ef4444",
            "#f59e0b",
            "#8b5cf6",
            "#06b6d4",
            "#64748b",
          ],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { font: { size: 12 }, padding: 16 },
        },
      },
    },
  });
}

function renderChartEstados(stats) {
  const ctx = document.getElementById("chart-estados").getContext("2d");
  if (chartEstados) chartEstados.destroy();

  chartEstados = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Activos", "Pendientes", "Resueltos"],
      datasets: [
        {
          label: "Cantidad",
          data: [stats.activos, stats.pendientes, stats.resueltos],
          backgroundColor: ["#f59e0b", "#ef4444", "#22c55e"],
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
        x: { grid: { display: false } },
      },
    },
  });
}

function render() {
  const datos = filtrarPorPeriodo(reportes, periodoActual);
  const stats = calcularStats(datos);
  actualizarMetricas(stats);
  renderSemaforo(stats.porBarrio);
  renderRanking(stats.porBarrio);
  renderChartCategorias(stats.porCategoria);
  renderChartEstados(stats);
}

function initPeriodo() {
  document.querySelectorAll(".periodo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".periodo-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      periodoActual = btn.dataset.periodo;
      render();
    });
  });
}

export function initTransparencia() {
  initPeriodo();
  render();
}
