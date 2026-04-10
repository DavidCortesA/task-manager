# AGENTS.md

Reglas para agentes de IA trabajando en este repositorio.

---

## Next.js 16 — No es el que conoces

Este proyecto usa **Next.js 16.2.3**, que tiene breaking changes respecto a versiones anteriores. Antes de escribir cualquier código específico de Next.js, leer la guía relevante en `node_modules/next/dist/docs/`. Respetar los avisos de deprecación.

Diferencias importantes a tener en cuenta:

- **App Router** obligatorio — no existe Pages Router en este proyecto
- `next build` ya **no ejecuta ESLint** automáticamente
- **Turbopack** es el bundler por defecto en desarrollo
- El script de lint es `eslint`, no `next lint`
- Las rutas de servidor y cliente se definen con `'use client'` / sin directiva (server por defecto)

---

## Reglas de este proyecto

### Estado y contexto

- Todo el estado de la app vive en `hooks/use-task-store.ts` — no duplicar lógica de estado
- Los componentes acceden al estado únicamente via `useStore()` de `lib/task-store-context.tsx`
- La persistencia es `localStorage` — no introducir fetch, APIs externas ni bases de datos sin pedido explícito del usuario

### Componentes UI

- Usar los componentes existentes en `components/ui/` antes de crear nuevos
- Los componentes de Radix UI se importan desde el paquete unificado `radix-ui`, NO desde `@radix-ui/react-*`
- El helper de clases es `cn()` de `lib/utils.ts` — siempre usarlo para condicionales de className

### Estilos

- Tailwind CSS v4 — la configuración está en `postcss.config.mjs` (no existe `tailwind.config.js/ts`)
- El tema usa variables CSS en `app/globals.css` con `oklch()` — no hardcodear colores hex en clases de Tailwind
- Dark mode via clase `.dark` en `<html>` — no usar `dark:` basado en `prefers-color-scheme` directamente

### Drag-and-drop

- Usar `@dnd-kit/core` (estable, v6) — **no** usar `@dnd-kit/react` (experimental, v0.x)
- El `DndContext` aplica únicamente a la vista Kanban en `task-board.tsx`

### Calidad de código

- No agregar lógica de validación, error handling ni features que no fueron pedidas
- No crear archivos nuevos si se puede editar uno existente
- No agregar comentarios a código que ya es autoexplicativo
- Mantener el estilo del código existente (sin punto y coma, comillas simples, arrow functions)
