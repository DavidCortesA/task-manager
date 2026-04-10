'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/task-store-context'
import type { Project } from '@/hooks/use-task-store'
import { PROJECT_COLORS } from '@/hooks/use-task-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const { addProject, updateProject } = useStore()
  const [name, setName] = useState('')
  const [color, setColor] = useState(PROJECT_COLORS[0])
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName(project?.name ?? '')
      setColor(project?.color ?? PROJECT_COLORS[0])
      setError('')
    }
  }, [open, project])

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Project name is required')
      return
    }

    if (project) {
      updateProject(project.id, { name: name.trim(), color })
    } else {
      addProject({ name: name.trim(), color })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              placeholder="Project name..."
              value={name}
              onChange={e => {
                setName(e.target.value)
                setError('')
              }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'size-7 rounded-full transition-all ring-offset-2 ring-offset-background',
                    color === c ? 'ring-2 ring-ring scale-110' : 'hover:scale-105',
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{project ? 'Save changes' : 'Create project'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
