import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TaskStoreProvider } from '@/lib/task-store-context'
import { TaskBoard } from '@/components/task-board'

export default function Page() {
  return (
    <TaskStoreProvider>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 68)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
            <TaskBoard />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TaskStoreProvider>
  )
}
