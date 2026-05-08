# 🔧 Cómo Agregar una Nueva Página (Ejemplo: Transparencia)

## **Paso 1️⃣: Crear el archivo HTML**

Crear: `frontend/pages/transparencia.html`

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Transparencia - ReportApp</title>
  </head>
  <body>
    <main>
      <h1>Transparencia</h1>
      <p>Información sobre reportes y estadísticas del sistema.</p>
    </main>
  </body>
</html>
```

✅ **Por qué:** Necesito un archivo con el contenido que va a mostrar

---

## **Paso 2️⃣: Agregar la ruta en app.js**

Editar: `frontend/js/app.js`

**ANTES:**

```javascript
const routes = {
  index: "./pages/inicio.html",
  explorar: "./pages/explorar.html",
  perfil: "./pages/perfil.html",
};
```

**DESPUÉS:**

```javascript
const routes = {
  index: "./pages/inicio.html",
  explorar: "./pages/explorar.html",
  perfil: "./pages/perfil.html",
  transparencia: "./pages/transparencia.html", // ← AGREGUÉ ESTA LÍNEA
};
```

✅ **Por qué:** Para que `app.js` sepa dónde encontrar el archivo cuando el usuario navega

---

## **Paso 3️⃣: Agregar el botón en navbar.html**

Editar: `frontend/navbar.html`

**En la sección MÓVIL** (dentro de `<nav class="nav-menu" id="nav-menu">`):

```html
<a href="explorar" class="nav-item"> <i class="bi bi-compass"></i> Explorar </a>
<!-- Agregué aquí: -->
<a href="transparencia" class="nav-item">
  <i class="bi bi-bar-chart"></i> Transparencia
</a>
```

**En la sección DESKTOP** (dentro de `<nav class="nav-right">`):

```html
<a href="explorar" class="nav-item">Explorar</a>
<a href="perfil" class="nav-item">Perfil</a>
<!-- Agregué aquí: -->
<a href="transparencia" class="nav-item">Transparencia</a>
```

✅ **Por qué:** Para que el usuario pueda hacer click y navegar

---

## **Paso 4️⃣: Agregar estilos en CSS (opcional)**

Editar: `frontend/css/styles.css`

```css
/* Si necesitas estilos específicos, agrega aquí */
.transparencia {
  padding: 20px;
  background-color: var(--bg);
}
```

✅ **Por qué:** Para que se vea bonito y consistente

---

## **¿Cómo Funciona Todo Junto?**

```
1. Usuario abre http://localhost:3000
   └─ Ve navbar con botones: [Inicio] [Explorar] [Perfil] [Transparencia]

2. Usuario hace click en "Transparencia"
   └─ El href="transparencia" en el HTML cambia la URL a #transparencia

3. app.js detecta el cambio (hashchange event)
   └─ Busca "transparencia" en el objeto routes

4. Encuentra: routes.transparencia = "./pages/transparencia.html"
   └─ Hace fetch a ese archivo

5. Obtiene el HTML:
   └─ <h1>Transparencia</h1>
   └─ <p>Información sobre reportes...</p>

6. Lo inyecta en <main>
   └─ document.querySelector("main").innerHTML = html

7. Usuario ve la página sin recargar ✅
```

---

## **Resumen Rápido**

| Paso | Archivo                    | Qué Agregué                                                |
| ---- | -------------------------- | ---------------------------------------------------------- |
| 1    | `pages/transparencia.html` | Nuevo archivo HTML con contenido                           |
| 2    | `app.js`                   | Nueva línea: `transparencia: "./pages/transparencia.html"` |
| 3    | `navbar.html`              | Nuevo botón en 2 lugares (móvil + desktop)                 |
| 4    | `styles.css`               | Estilos (opcional)                                         |

---

## **Para Agregar Otra Página (ej: Reportes)**

Solo repite estos 4 pasos pero reemplaza "transparencia" por "reportes":

1. Crear: `frontend/pages/reportes.html`
2. En `app.js`: `reportes: "./pages/reportes.html"`
3. En `navbar.html`: `<a href="reportes" class="nav-item">Reportes</a>` (×2)
4. En `styles.css`: Agregar estilos si es necesario

---

**¡Listo!** Ya sabes cómo agregar nuevas páginas 🚀
