'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/lib/task-store-context'
import type { Task, Status } from '@/hooks/use-task-store'
import { TaskCard } from '@/components/task-card'
import { TaskDialog } from '@/components/task-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  PlusIcon,
  KanbanIcon as LayoutKanbanIcon,
  ListIcon,
  CheckCircle2Icon,
  CircleIcon,
  CircleDotIcon,
  GripVerticalIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const COLUMNS: { status: Status; label: string; icon: React.ReactNode; accent: string }[] = [
  {
    status: 'todo',
    label: 'To Do',
    icon: <CircleIcon className="size-4" />,
    accent: 'text-slate-500 dark:text-slate-400',
  },
  {
    status: 'in-progress',
    label: 'In Progress',
    icon: <CircleDotIcon className="size-4" />,
    accent: 'text-blue-500 dark:text-blue-400',
  },
  {
    status: 'done',
    label: 'Done',
    icon: <CheckCircle2Icon className="size-4" />,
    accent: 'text-emerald-500 dark:text-emerald-400',
  },
]

type View = 'kanban' | 'list'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

// ─── Draggable card ──────────────────────────────────────────────────────────
function DraggableTaskCard({
  task,
  onEdit,
}: {
  task: Task
  onEdit: (t: Task) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      className={cn('relative group/drag touch-none', isDragging && 'opacity-40')}
    >
      {/* Drag handle — only visible on hover */}
      <button
        type="button"
        className="absolute left-2 top-3.5 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/drag:opacity-100 transition-opacity text-muted-foreground/40 hover:text-muted-foreground focus:outline-none"
        {...attributes}
        {...listeners}
        tabIndex={-1}
        aria-label="Drag to reorder"
      >
        <GripVerticalIcon className="size-3.5" />
      </button>
      <TaskCard task={task} onEdit={onEdit} />
    </div>
  )
}

// ─── Droppable column ────────────────────────────────────────────────────────
function DroppableColumn({
  status,
  children,
}: {
  status: Status
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col gap-2 rounded-lg p-1 min-h-20 transition-colors duration-150',
        isOver && 'bg-accent/50 ring-1 ring-border',
      )}
    >
      {children}
    </div>
  )
}

// ─── Main board ──────────────────────────────────────────────────────────────
export function TaskBoard() {
  const { tasks, projects, activeProjectId, setActiveProjectId, updateTask } = useStore()
  const [view, setView] = useState<View>('kanban')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [defaultStatus, setDefaultStatus] = useState<Status>('todo')
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const filtered = useMemo(() => {
    let result = [...tasks]
    if (activeProjectId) result = result.filter(t => t.projectId === activeProjectId)
    result.sort(
      (a, b) =>
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return result
  }, [tasks, activeProjectId])

  const activeTask = useMemo(() => tasks.find(t => t.id === activeTaskId), [tasks, activeTaskId])

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(String(active.id))
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTaskId(null)
    if (!over) return
    const newStatus = String(over.id) as Status
    const taskId = String(active.id)
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status !== newStatus) {
      updateTask(taskId, { status: newStatus })
    }
  }

  const openAdd = (status: Status = 'todo') => {
    setEditingTask(undefined)
    setDefaultStatus(status)
    setDialogOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const activeProject = projects.find(p => p.id === activeProjectId)

  return (
    <>
      {/* ── Board header ── */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">
            {activeProject ? (
              <span className="flex items-center gap-2">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: activeProject.color }}
                />
                {activeProject.name}
              </span>
            ) : (
              'All Tasks'
            )}
          </h2>
          <Badge variant="secondary" className="text-xs">
            {filtered.length}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={activeProjectId ?? 'all'}
            onValueChange={val => setActiveProjectId(val === 'all' ? null : val)}
          >
            <SelectTrigger className="h-8 text-xs w-35">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center rounded-md border border-border p-0.5 gap-0.5">
            <Button
              variant={view === 'kanban' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-7"
              onClick={() => setView('kanban')}
            >
              <LayoutKanbanIcon className="size-3.5" />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-7"
              onClick={() => setView('list')}
            >
              <ListIcon className="size-3.5" />
            </Button>
          </div>

          <Button size="sm" onClick={() => openAdd()}>
            <PlusIcon className="size-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* ── Kanban view ── */}
      {view === 'kanban' && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 items-start">
            {COLUMNS.map(col => {
              const colTasks = filtered.filter(t => t.status === col.status)
              return (
                <div key={col.status} className="flex flex-col gap-2">
                  {/* Column header */}
                  <div className="flex items-center gap-2 px-1 mb-1">
                    <span
                      className={cn('flex items-center gap-1.5 font-medium text-sm', col.accent)}
                    >
                      {col.icon}
                      {col.label}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-auto">
                      {colTasks.length}
                    </Badge>
                  </div>

                  {/* Droppable area with cards */}
                  <DroppableColumn status={col.status}>
                    {colTasks.map(task => (
                      <DraggableTaskCard key={task.id} task={task} onEdit={openEdit} />
                    ))}
                  </DroppableColumn>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2 text-muted-foreground hover:text-foreground text-xs mt-1"
                    onClick={() => openAdd(col.status)}
                  >
                    <PlusIcon className="size-3.5" />
                    Add task
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Drag overlay — shown while dragging */}
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <div className="rotate-1 scale-105 shadow-2xl opacity-95 cursor-grabbing">
                <TaskCard task={activeTask} onEdit={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* ── List view ── */}
      {view === 'list' && (
        <div className="flex flex-col gap-2 flex-1">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p className="text-sm">No tasks yet.</p>
              <Button variant="link" size="sm" onClick={() => openAdd()}>
                Create your first task
              </Button>
            </div>
          )}
          {COLUMNS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.status)
            if (colTasks.length === 0) return null
            return (
              <div key={col.status} className="mb-4">
                <div className={cn('flex items-center gap-2 mb-2 text-sm font-medium', col.accent)}>
                  {col.icon}
                  {col.label}
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {colTasks.length}
                  </Badge>
                </div>
                <div className="flex flex-col gap-2">
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={openEdit} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </>
  )
}
