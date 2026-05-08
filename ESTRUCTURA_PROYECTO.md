# 📋 Estructura del Proyecto - ReportApp

## 📁 Carpetas y Archivos

```
Sistema-de-reporte-ciudadano/
├── server.js                    # Servidor Express
├── frontend/
│   ├── index.html              # Página principal (SPA)
│   ├── navbar.html             # Navbar (componente)
│   ├── pages/
│   │   ├── inicio.html         # Página de inicio
│   │   ├── explorar.html       # Página explorar
│   │   └── perfil.html         # Página perfil
│   ├── css/
│   │   └── styles.css          # Estilos únicos
│   ├── js/
│   │   └── app.js              # Lógica SPA
│   └── assets/                 # Imágenes, etc.
└── backend/                     # (Próximamente)
```

---

## 🚀 Cómo Ejecutar

### Instalación

```bash
npm install
```

### Desarrollo

```bash
node server.js
```

Luego abre: `http://localhost:3000`

---

## 🎯 Estructura del Código

### `app.js` - 6 Funciones Principales

| Función                  | Qué hace                    |
| ------------------------ | --------------------------- |
| `injectNavbar()`         | Carga navbar.html en el DOM |
| `addNavbarListeners()`   | Agrega listeners a botones  |
| `loadPage(page)`         | Carga página sin recargar   |
| `setActiveLink(page)`    | Marca botón activo          |
| `hashchange event`       | Maneja atrás/adelante       |
| `DOMContentLoaded event` | Inicia la app               |

### `styles.css` - 3 Secciones

1. **Variables CSS** - Colores y estilos globales
2. **Desktop (768px+)** - Estilos base
3. **Mobile (<768px)** - Responsive

---

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Diseño**: Responsive (Desktop, Tablet, Mobile)
- **Iconos**: Bootstrap Icons

---

## 📝 Convenciones de Código

### JavaScript

```javascript
// Nombres descriptivos
const navItems = document.querySelectorAll(".nav-item");

// Funciones en minúsculas
function loadPage(page) {}

// Constantes en mayúsculas
const MAX_ITEMS = 100;
```

### CSS

```css
/* Comentarios en bloques */
/* ===== SECCIÓN ===== */

/* Clases en kebab-case */
.nav-item {
}
.logo-text {
}
```

### HTML

```html
<!-- IDs para JavaScript, clases para CSS -->
<div id="navbar-placeholder"></div>
<nav class="nav-menu"></nav>
```

---

## ✅ Checklist de Limpieza

- ✅ Código sin comentarios redundantes
- ✅ Funciones con responsabilidad única
- ✅ Variables bien nombradas
- ✅ Estilos organizados
- ✅ Responsive optimizado
- ✅ Sin duplicados
- ✅ Sin código muerto
