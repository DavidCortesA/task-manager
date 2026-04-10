'use client'

import { useState } from 'react'
import { useStore } from '@/lib/task-store-context'
import type { Project } from '@/hooks/use-task-store'
import { ProjectDialog } from '@/components/project-dialog'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { PlusIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react'

export function NavProjects() {
  const { projects, tasks, activeProjectId, setActiveProjectId, deleteProject } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()

  const getCount = (id: string) => tasks.filter(t => t.projectId === id).length

  const openCreate = () => {
    setEditingProject(undefined)
    setDialogOpen(true)
  }

  const openEdit = (project: Project) => {
    setEditingProject(project)
    setDialogOpen(true)
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center justify-between pr-1">
          <span>Projects</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-5 ml-auto"
            onClick={openCreate}
          >
            <PlusIcon className="size-3.5" />
          </Button>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {projects.length === 0 && (
              <p className="px-2 py-1 text-xs text-muted-foreground">No projects yet</p>
            )}
            {projects.map(project => (
              <SidebarMenuItem key={project.id} className="group/project-item flex items-center">
                <SidebarMenuButton
                  isActive={activeProjectId === project.id}
                  onClick={() =>
                    setActiveProjectId(activeProjectId === project.id ? null : project.id)
                  }
                  className="flex-1 gap-2"
                >
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="flex-1 truncate">{project.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {getCount(project.id)}
                  </span>
                </SidebarMenuButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0 opacity-0 group-hover/project-item:opacity-100 transition-opacity"
                    >
                      <MoreHorizontalIcon className="size-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => openEdit(project)}>
                      <PencilIcon className="size-3.5" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        if (activeProjectId === project.id) setActiveProjectId(null)
                        deleteProject(project.id)
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2Icon className="size-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={editingProject} />
    </>
  )
}
