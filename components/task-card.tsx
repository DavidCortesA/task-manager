'use client'

import type { Task, Status } from '@/hooks/use-task-store'
import { useStore } from '@/lib/task-store-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  CalendarIcon,
  ArrowRightIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PRIORITY_CLASS = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900',
  medium:
    'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900',
  high: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900',
}

const STATUS_NEXT: Record<Status, { label: string; value: Status } | null> = {
  todo: { label: 'Move to In Progress', value: 'in-progress' },
  'in-progress': { label: 'Mark as Done', value: 'done' },
  done: null,
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(dateStr: string, status: Status) {
  if (status === 'done') return false
  return new Date(dateStr + 'T23:59:59') < new Date()
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { projects, updateTask, deleteTask } = useStore()
  const project = projects.find(p => p.id === task.projectId)
  const nextStatus = STATUS_NEXT[task.status]

  return (
    <Card className="group relative gap-3 py-3 shadow-none border-border/60 hover:border-border hover:shadow-sm transition-all duration-150">
      <CardContent className="px-3 pb-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug flex-1 ml-3 truncate">{task.title}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5"
              >
                <MoreHorizontalIcon className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <PencilIcon className="size-3.5" />
                Edit task
              </DropdownMenuItem>
              {nextStatus && (
                <DropdownMenuItem
                  onClick={() => updateTask(task.id, { status: nextStatus.value })}
                >
                  <ArrowRightIcon className="size-3.5" />
                  {nextStatus.label}
                </DropdownMenuItem>
              )}
              {task.status !== 'todo' && (
                <DropdownMenuItem onClick={() => updateTask(task.id, { status: 'todo' })}>
                  <ArrowRightIcon className="size-3.5 rotate-180" />
                  Move to To Do
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteTask(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2Icon className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge
            variant="outline"
            className={cn('text-[10px] px-1.5 py-0 font-medium capitalize', PRIORITY_CLASS[task.priority])}
          >
            {task.priority}
          </Badge>

          {project && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <span className="truncate max-w-[90px]">{project.name}</span>
            </div>
          )}

          {task.dueDate && (
            <div
              className={cn(
                'flex items-center gap-1 text-[10px] font-medium ml-auto',
                isOverdue(task.dueDate, task.status)
                  ? 'text-destructive'
                  : 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="size-3" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
