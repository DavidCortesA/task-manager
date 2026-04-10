# CLAUDE.md

Guía para Claude Code al trabajar en este repositorio.

@AGENTS.md

---

## Comandos

```bash
npm run dev        # Servidor de desarrollo (Turbopack, bundler por defecto en Next.js 16)
npm run build      # Build de producción (NO ejecuta lint — correr por separado)
npm run lint       # ESLint
npm run start      # Servidor de producción
```

No hay suite de tests configurada.

---

## Contexto del proyecto

**TaskFlow** es un task manager client-side construido por David Cortez. Usa Next.js 16 App Router, shadcn/ui (estilo Radix Nova), Tailwind CSS v4 y dnd-kit. No tiene backend ni base de datos — toda la persistencia es `localStorage`.

---

## Arquitectura

### Estado

Todo el estado de tareas y proyectos vive en `hooks/use-task-store.ts` (`useTaskStore`). Gestiona los arrays `Task[]` y `Project[]`, los persiste en `localStorage` bajo la clave `task-manager-v1`, y expone CRUD: `addTask`, `updateTask`, `deleteTask`, `addProject`, `updateProject`, `deleteProject`.

`lib/task-store-context.tsx` envuelve `useTaskStore` en un React context y agrega `activeProjectId` / `setActiveProjectId` para el filtro del sidebar. Los componentes consumen el estado via `useStore()` — nunca llamar `useTaskStore` directamente en componentes.

### Flujo de datos

```
app/dashboard/page.tsx
  └─ <TaskStoreProvider>             ← monta el context + store
       ├─ <AppSidebar>               ← lee proyectos, setea activeProjectId
       │    └─ <NavProjects>         ← CRUD de proyectos + filtro
       └─ <SidebarInset>
            ├─ <SiteHeader>          ← título + sidebar trigger
            └─ <TaskBoard>           ← vistas kanban/lista
                 ├─ DndContext       ← @dnd-kit/core
                 ├─ <DroppableColumn>  ← columna droppable por status
                 ├─ <DraggableTaskCard> ← card con drag handle
                 ├─ <TaskCard>       ← UI de tarea + acciones
                 └─ <TaskDialog>     ← form crear/editar tarea
```

### Tipos clave (`hooks/use-task-store.ts`)

```typescript
type Status   = 'todo' | 'in-progress' | 'done'
type Priority = 'low' | 'medium' | 'high'

interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  projectId: string | null
  dueDate: string | null      // formato 'YYYY-MM-DD'
  createdAt: string           // ISO string
}

interface Project {
  id: string
  name: string
  color: string               // hex, de PROJECT_COLORS[]
  createdAt: string
}
```

---

## Convenciones

### Componentes UI

Los componentes en `components/ui/` son wrappers de `radix-ui` (paquete unificado, NO los `@radix-ui/react-*` individuales). El styling usa Tailwind CSS v4 con `tw-animate-css`. La utilidad `cn()` está en `lib/utils.ts` (clsx + tailwind-merge).

### Colores del tema

El sistema de colores usa `oklch()` en las variables CSS (`globals.css`). Las variables de tema siguen el patrón de shadcn: `--background`, `--foreground`, `--primary`, `--muted`, etc. No usar colores hardcodeados — siempre usar las clases de Tailwind que mapean a estas variables.

### Dark mode

El dark mode se aplica con la clase `.dark` en el elemento `<html>` (gestionado por `next-themes` via `ThemeProvider`). El switch está en `ModeToggle` — usa `resolvedTheme` para evitar mismatch de hidratación.

### Drag-and-drop

`task-board.tsx` usa `@dnd-kit/core` (v6, estable). El `DndContext` envuelve solo la vista Kanban. Cada `DraggableTaskCard` usa `useDraggable` con un handle de grip visible en hover. Cada columna usa `useDroppable` con el `status` como ID. Al soltar, `handleDragEnd` llama `updateTask(id, { status: newStatus })`.

- Sensor: `PointerSensor` con distancia de activación de 8px (previene drags accidentales al hacer click)
- No usar `@dnd-kit/react` (paquete experimental en 0.x) — usar solo `@dnd-kit/core`

### Fuente

La fuente es **Montserrat** (Google Fonts), cargada en `app/layout.tsx` con la variable CSS `--font-montserrat`.

---

## Notas de Next.js 16

- `next build` ya NO ejecuta ESLint automáticamente — correr lint por separado
- Turbopack es el bundler por defecto en dev; usar `next dev --webpack` para optar por webpack
- El script `lint` es `eslint` (no `next lint`)
- Consultar `node_modules/next/dist/docs/` para documentación API autoritativa antes de escribir código específico de Next.js
