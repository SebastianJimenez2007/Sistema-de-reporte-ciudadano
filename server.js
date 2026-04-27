const express = require("express");
const path = require("path");
const app = express();

// Servir archivos estáticos de la carpeta frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Redirigir todas las rutas a index.html (necesario para SPA)
// Esto permite que cuando recargas en "explorar" etc., se sirva index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${PORT}`);
  console.log(`Abre http://localhost:${PORT} en tu navegador`);
});
