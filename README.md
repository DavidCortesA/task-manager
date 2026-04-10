# TaskFlow

> Un task manager moderno y minimalista construido con Next.js 16, shadcn/ui y dnd-kit.

Diseñado para gestionar tareas y proyectos de forma visual, con tablero Kanban drag-and-drop, vistas flexibles y persistencia local sin necesidad de backend.

---

## Características

- **Tablero Kanban** con drag-and-drop entre columnas (`Por hacer`, `En progreso`, `Hecho`)
- **Vista lista** agrupada por estado para escaneo rápido
- **Gestión de tareas**: crear, editar y eliminar con título, descripción, prioridad, fecha límite y proyecto asignado
- **Gestión de proyectos**: crear, editar y eliminar con etiquetas de color personalizadas
- **Filtrado** por proyecto desde la barra lateral o el selector del tablero
- **Dark / Light mode** con detección automática del sistema
- **Persistencia local** en `localStorage` — los datos sobreviven recargas sin backend

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.3 (App Router) |
| UI | shadcn/ui · Radix UI · Tailwind CSS v4 |
| Drag & Drop | dnd-kit/core |
| Iconos | lucide-react |
| Fuente | Montserrat (Google Fonts) |
| Lenguaje | TypeScript 5 |

---

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige automáticamente a `/dashboard`.

---

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo (Turbopack)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # ESLint
```

---

## Estructura del proyecto

```
app/
  layout.tsx              # Shell principal, metadata, ThemeProvider
  page.tsx                # Redirige a /dashboard
  dashboard/
    page.tsx              # Layout del dashboard con sidebar y tablero
    globals.css           # Variables CSS, paleta oklch, tema dark/light

components/
  task-board.tsx          # Tablero Kanban/Lista + drag-and-drop (DndContext)
  task-card.tsx           # UI de cada tarea + acciones rápidas
  task-dialog.tsx         # Diálogo crear/editar tarea
  project-dialog.tsx      # Diálogo crear/editar proyecto
  nav-projects.tsx        # Lista de proyectos en sidebar con CRUD
  app-sidebar.tsx         # Sidebar principal con navegación
  site-header.tsx         # Header con trigger del sidebar
  mode-toggle.tsx         # Switch dark/light mode

hooks/
  use-task-store.ts       # Estado central de tareas y proyectos + localStorage

lib/
  task-store-context.tsx  # Context provider + filtro de proyecto activo
  utils.ts                # Utilidad cn() (clsx + tailwind-merge)
```

---

## Persistencia de datos

Los datos se guardan en `localStorage` bajo la clave `task-manager-v1`.

Al primer uso, se cargan proyectos y tareas de ejemplo (mock data). A partir de ahí, todos los cambios persisten localmente en el navegador.

> Limpiar el almacenamiento del navegador o usar un perfil diferente resetea los datos al estado inicial.

---

## Autor

**David Cortez** — [@DavidCortezMetimur](https://github.com/DavidCortezMetimur)
