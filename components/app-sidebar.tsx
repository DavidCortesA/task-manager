'use client'

import * as React from 'react'
import { useStore } from '@/lib/task-store-context'
import { NavProjects } from '@/components/nav-projects'
import { NavSecondary } from '@/components/nav-secondary'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquareIcon,
  Settings2Icon,
  CircleHelpIcon,
  LayoutListIcon,
  Divide,
} from 'lucide-react'
import { ModeToggle } from './mode-toggle'

const navSecondaryItems = [
  { title: 'Settings', url: '#', icon: <Settings2Icon /> },
  { title: 'Help', url: '#', icon: <CircleHelpIcon /> },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { tasks, activeProjectId, setActiveProjectId } = useStore()
  const totalTasks = tasks.length

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CheckSquareIcon className="size-5!" />
                <span className="text-base font-semibold">TaskFlow</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeProjectId === null}
                  onClick={() => setActiveProjectId(null)}
                  className="gap-2"
                >
                  <LayoutListIcon className="size-4" />
                  <span className="flex-1">All Tasks</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {totalTasks}
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects */}
        <NavProjects />
      </SidebarContent>

      <SidebarFooter className='border-t-2'>
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
