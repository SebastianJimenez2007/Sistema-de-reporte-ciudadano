# 📚 Explicación de JavaScript en tu Proyecto

## ¿Qué es JavaScript?

JavaScript es un **lenguaje de programación** que hace que tu página web sea **interactiva**. Sin JavaScript, solo verías HTML estático.

**Ejemplo:**

- HTML = la estructura (como los huesos)
- CSS = el diseño (como la ropa)
- **JavaScript = el movimiento** (como el cerebro que controla todo)

---

## 🔑 Conceptos Básicos

### 1. **Variables (const, let, var)**

Son contenedores que **guardan información**.

```javascript
const routes = {
  index: "./pages/inicio.html",
  explorar: "./pages/explorar.html",
  perfil: "./pages/perfil.html",
};
```

**¿Qué hace?**

- Crea una variable llamada `routes`
- Guarda 3 rutas (direcciones) en forma de diccionario
- `const` = no se puede cambiar después (es constante)

---

### 2. **Funciones**

Son bloques de código que **hacen una tarea específica**. Se escriben una vez y se reutilizan.

```javascript
async function injectNavbar() {
  // código aquí
}
```

**¿Qué significa?**

- `function` = es una función
- `async` = puede esperar cosas que tardan tiempo
- `injectNavbar()` = nombre de la función
- Se ejecuta así: `injectNavbar()`

---

### 3. **Fetch API**

Es para **descargar archivos** desde el servidor.

```javascript
const response = await fetch("./navbar.html");
```

**¿Qué hace paso a paso?**

1. `fetch()` = descarga un archivo
2. `"./navbar.html"` = el archivo que quieres descargar
3. `await` = espera a que termine de descargar
4. `response` = guarda el resultado

**Es como:**

- Pedir un libro en una librería
- Esperar a que te lo traigan
- Guardar el libro

---

### 4. **Event Listeners (Escuchadores de eventos)**

Escuchan cuando el usuario **hace algo** (hace clic, escribe, etc.)

```javascript
item.addEventListener("click", (e) => {
  e.preventDefault();
  const page = item.getAttribute("href");
});
```

**¿Qué hace?**

- `addEventListener` = "escucha un evento"
- `"click"` = cuando el usuario hace clic
- `(e) => { }` = función que se ejecuta cuando hace clic
- `e.preventDefault()` = evita que recargue la página
- `getAttribute("href")` = obtiene el valor del atributo `href`

**Es como:**

- Tener un botón que espera a que lo presiones
- Cuando lo presionas, ejecuta el código

---

### 5. **Async/Await**

Para tareas que **tardan tiempo** (como descargar archivos).

```javascript
async function loadPage(page) {
  const filePath = routes[page];
  const response = await fetch(filePath);
  const html = await response.text();
}
```

**¿Por qué?**

- Sin `await`, el código continuaría sin esperar a que termine la descarga
- Con `await`, espera a que termine antes de continuar

**Es como:**

- Pedir comida en un restaurante
- `await` = esperar a que te la traigan (no irte sin ella)
- Sin `await` = irte sin esperar la comida

---

## 🎯 Cómo Funciona tu App

### Flujo paso a paso:

```
1. PÁGINA CARGA
   ↓
2. Se ejecuta: injectNavbar()
   ↓
3. Descarga: navbar.html
   ↓
4. Lo coloca en: <div id="navbar-placeholder"></div>
   ↓
5. Agrega escuchadores de clics: addNavbarListeners()
   ↓
6. Espera a que hagas clic en un botón
   ↓
7. Cuando haces clic → loadPage(página)
   ↓
8. Descarga el HTML de esa página
   ↓
9. Cambia el contenido en <main></main>
```

---

## 📖 Explicación Línea por Línea de `app.js`

### **Línea 1-7: Definir las rutas**

```javascript
const routes = {
  index: "./pages/inicio.html",
  explorar: "./pages/explorar.html",
  perfil: "./pages/perfil.html",
};
```

Crea un diccionario con las 3 rutas de tu app.

---

### **Línea 9-23: Inyectar el navbar**

```javascript
async function injectNavbar() {
  try {
    const response = await fetch("./navbar.html");
    if (!response.ok) throw new Error("No se encontró navbar");

    const html = await response.text();
    document.getElementById("navbar-placeholder").innerHTML = html;

    addNavbarListeners();
    setActiveLink("index");
  } catch (err) {
    console.error("Error:", err);
  }
}
```

**¿Qué hace cada línea?**

| Línea                          | ¿Qué hace?                                    |
| ------------------------------ | --------------------------------------------- |
| `async function`               | Define una función que puede esperar          |
| `try { }`                      | Intenta hacer esto                            |
| `fetch("./navbar.html")`       | Descarga el navbar                            |
| `await`                        | Espera a que termine                          |
| `if (!response.ok)`            | Si hay error, lanza un mensaje                |
| `response.text()`              | Convierte a texto el archivo                  |
| `document.getElementById(...)` | Busca el elemento con id `navbar-placeholder` |
| `.innerHTML = html`            | Coloca el HTML descargado dentro              |
| `addNavbarListeners()`         | Agrega escuchadores de clics                  |
| `catch (err)`                  | Si hay error, lo muestra                      |

---

### **Línea 25-46: Agregar escuchadores de clics**

```javascript
function addNavbarListeners() {
  const navItems = document.querySelectorAll(".nav-item");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const page = item.getAttribute("href");
      window.location.hash = `#${page}`;

      loadPage(page);
      setActiveLink(page);

      if (navMenu) {
        navMenu.classList.remove("active");
      }
    });
  });
}
```

**¿Qué hace?**

| Qué                                         | Explicación                                           |
| ------------------------------------------- | ----------------------------------------------------- |
| `querySelectorAll(".nav-item")`             | Obtiene TODOS los elementos con clase `nav-item`      |
| `forEach((item) => { })`                    | Repite el código para cada elemento                   |
| `addEventListener("click", ...)`            | Espera a que hagas clic                               |
| `e.preventDefault()`                        | Evita que recargue la página                          |
| `getAttribute("href")`                      | Obtiene a dónde va el botón (index, explorar, perfil) |
| `window.location.hash = #${page}`           | Cambia la URL a `#explorar`, `#perfil`, etc.          |
| `loadPage(page)`                            | Carga la página                                       |
| `menuToggle.addEventListener("click", ...)` | El botón ☰ abre/cierra el menú                       |
| `classList.toggle("active")`                | Agrega o quita la clase `active`                      |

---

### **Línea 48-67: Cargar página sin recargar**

```javascript
async function loadPage(page) {
  try {
    const filePath = routes[page];
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Error: ${filePath}`);

    const html = await response.text();

    // Extrae el <main> y lo reemplaza
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const mainContent = doc.querySelector("main");

    if (mainContent) {
      document.querySelector("main").innerHTML = mainContent.innerHTML;
    }
  } catch (err) {
    console.error("Error cargando:", err);
  }
}
```

**¿Qué hace paso a paso?**

1. Obtiene la ruta de `routes` (ej: `"./pages/explorar.html"`)
2. Descarga el archivo HTML
3. Lo convierte a texto
4. Busca el `<main>` dentro del HTML descargado
5. Cambia el `<main>` de la página actual por el nuevo contenido
6. **Result**: La página cambia sin recargar ✨

---

### **Línea 69-76: Marcar botón activo**

```javascript
function setActiveLink(page) {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === page) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}
```

**¿Qué hace?**

- Obtiene todos los botones de navegación
- Para cada botón:
  - Si coincide con la página actual → agrega clase `active` (se pone azul)
  - Si no coincide → quita la clase `active` (vuelve a gris)

---

### **Línea 78-84: Manejo del botón atrás/adelante**

```javascript
window.addEventListener("hashchange", () => {
  const page = window.location.hash.slice(1) || "index";
  loadPage(page);
  setActiveLink(page);
});
```

**¿Qué hace?**

- Escucha cambios en el `#hash` de la URL
- Cuando el usuario presiona atrás/adelante:
  - Extrae la página del hash (ej: `#explorar` → `explorar`)
  - Carga esa página
  - Marca el botón como activo

---

### **Línea 86-92: Iniciar la app**

```javascript
injectNavbar().then(() => {
  const initialPage = window.location.hash.slice(1) || "index";
  loadPage(initialPage);
  setActiveLink(initialPage);
});
```

**¿Qué hace?**

1. `injectNavbar()` descarga y coloca el navbar
2. `.then()` espera a que termine
3. Extrae la página del hash (o usa "index" por defecto)
4. Carga esa página
5. Marca el botón activo

---

## 📊 Diagrama del Flujo Completo

```
┌─────────────────┐
│  Página Carga   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ injectNavbar()          │ ← Descarga navbar.html
│ (inyecta el navbar)     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ addNavbarListeners()    │ ← Espera clics
└────────┬────────────────┘
         │
         ▼
    ¿Hace clic?
    /        \
   SÍ        NO
   │         │
   ▼         │
loadPage()   │
   │         │
   ▼         │
Descarga     │
HTML         │
   │         │
   ▼         │
Cambia el    │
<main>       │
   │         │
   ▼         │
setActiveLink│
   │         │
   ▼         ▼
┌─────────────────────┐
│  Página Lista! ✨   │
└─────────────────────┘
```

---

## 🤔 Preguntas Comunes

### **¿Por qué `await`?**

Porque descargar archivos tarda. Sin `await`, el código continuaría mientras se descarga, causando errores.

### **¿Qué es `DOMParser`?**

Convierte texto HTML en objetos que JavaScript puede entender y manipular.

### **¿Por qué `addEventListener`?**

Es la forma de decirle a JavaScript "cuando el usuario haga esto, ejecuta este código".

### **¿Qué es `.classList.toggle("active")`?**

- Si tiene la clase `active` → la quita
- Si no tiene → la agrega
- Perfecto para abrir/cerrar menús

---

## ✅ Resumen

Tu app es un **SPA (Single Page Application)**:

1. **Descarga** una página (navbar)
2. **Escucha** clics del usuario
3. **Carga** contenido sin recargar
4. **Cambia** la URL con el hash (#)
5. **Marca** el botón activo
6. **Maneja** atrás/adelante del navegador

Todo sin recargar la página. ¡Eso es JavaScript! 🚀

---

## 📚 Próximos Pasos

Si quieres aprender más:

- **Variables**: const, let, var
- **Funciones**: cómo crearlas y usarlas
- **Fetch API**: descargar datos del servidor
- **DOM**: manipular HTML desde JavaScript
- **Event Listeners**: responder a acciones del usuario

¿Necesitas que profundice en algo específico?
