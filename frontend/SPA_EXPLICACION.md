# 📖 Sistema SPA (Single Page Application) - Explicación

## ¿Qué cambió?

Antes: Cada clic en un enlace **recargaba toda la página** ⚠️  
Ahora: Solo cambia el contenido sin recargar ✨

---

## Conceptos Clave

### 1. **History API** (`pushState`)

```javascript
window.history.pushState({ page }, "", page);
```

- Cambia la URL en la barra **sin recargar** la página
- El navegador lo ve como si fueras a otra página
- Funciona con el botón "atrás" del navegador

### 2. **Fetch API** (cargar contenido)

```javascript
const response = await fetch("./pages/explorar.html");
const html = await response.text();
```

- Obtiene el HTML de la página sin recargar el navegador
- Es asincrónico (`async/await`)

### 3. **DOM Manipulation** (actualizar contenido)

```javascript
const mainElement = document.querySelector("main");
mainElement.innerHTML = mainContent.innerHTML;
```

- Reemplaza el contenido del `<main>` dinámicamente

---

## Flujo Cuando Haces Clic

```
Usuario hace clic en "Explorar"
    ↓
Se ejecuta addEventListener("click")
    ↓
e.preventDefault() ← (BLOQUEA el recarga)
    ↓
window.history.pushState() ← (Cambia URL a "explorar")
    ↓
loadPage("explorar") ← (Carga contenido)
    ↓
fetch("./pages/explorar.html") ← (Obtiene HTML)
    ↓
document.querySelector("main").innerHTML = ... ← (Actualiza contenido)
    ↓
setActiveLink("explorar") ← (Resalta el botón)
```

---

## Estructura de Archivos

```
frontend/
├── index.html          ← Página principal (SIEMPRE se carga)
│                         Contiene: navbar + main (vacío)
├── navbar.html         ← Se inyecta dinámicamente
├── pages/
│   ├── inicio.html     ← Solo <main>
│   ├── explorar.html   ← Solo <main>
│   └── perfil.html     ← Solo <main>
├── js/
│   └── app.js          ← LÓGICA SPA (lo más importante)
└── css/
    └── styles.css
```

### ¿Por qué las páginas en `pages/` no tienen `<head>`?

- Solo necesitan el contenido `<main>`
- El `<head>` ya está en `index.html` y se carga una sola vez
- Así la página es más ligera y carga más rápido

---

## Funciones Principales de app.js

### `injectNavbar()`

- Carga `navbar.html` en el `#navbar-placeholder`
- Llama a `addNavbarListeners()` para interceptar clics

### `addNavbarListeners()`

- Agrega `addEventListener("click")` a todos los enlaces
- Intercepta el evento y lo maneja con nuestra lógica
- **IMPORTANTE**: `e.preventDefault()` es lo que evita la recarga

### `loadPage(page)`

- Obtiene el HTML de la página con `fetch()`
- Extrae el contenido del `<main>`
- Lo reemplaza en el DOM
- Actualiza el estado activo de la navbar

### `setActiveLink(page)`

- Agrega la clase `active` al enlace actual
- Quitala de los demás

### `popstate` Event

```javascript
window.addEventListener("popstate", (e) => {
  loadPage(e.state?.page || "index");
});
```

- Se ejecuta cuando haces clic en "atrás" del navegador
- Carga la página correcta

---

## Ventajas vs Desventajas

### ✅ Ventajas

- Sin recargas → más rápido
- Transiciones más suaves
- Simulación de aplicación de escritorio
- Menos datos descargados

### ❌ Desventajas

- JavaScript deshabilitado = no funciona
- SEO más complicado (para Google)
- Historial del navegador más complejo
- Debug más difícil

---

## Ejercicios para Practicar

1. **Agregar una transición cuando carga**

   ```javascript
   // Antes de loadPage()
   mainElement.style.opacity = "0";
   setTimeout(() => {
     mainElement.style.opacity = "1";
   }, 100);
   ```

2. **Agregar una nueva página (Dashboard)**
   - Crea `pages/dashboard.html`
   - Agrega la ruta en el objeto `routes`
   - Agrega un enlace en `navbar.html`

3. **Cargar datos desde un API**
   ```javascript
   const data = await fetch("http://localhost:8080/api/reportes");
   // En SpringBoot...
   ```

---

## Debugging

Abre la consola (F12) y verifica:

- ¿Se carga el navbar? → Busca en Network
- ¿Se carga la página? → Busca el fetch
- ¿Hay errores? → Mira la consola (Console tab)
- ¿Qué URL estoy en? → Mira la barra de direcciones

---

## Próximos Pasos

Con SpringBoot + RestAPI:

```javascript
// Cargar reportes del backend
async function loadReportes() {
  const data = await fetch("http://localhost:8080/api/reportes");
  const reportes = await data.json();

  // Mostrar en la página
  const html = reportes
    .map(
      (r) => `
    <div class="reporte">
      <h3>${r.titulo}</h3>
      <p>${r.descripcion}</p>
    </div>
  `,
    )
    .join("");

  document.querySelector("main").innerHTML = html;
}
```

---

## Referencias

- [History API - MDN](https://developer.mozilla.org/es/docs/Web/API/History_API)
- [Fetch API - MDN](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [DOM - MDN](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model)
