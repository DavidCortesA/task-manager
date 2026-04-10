'use client'

import { createContext, useContext, useState } from 'react'
import { useTaskStore } from '@/hooks/use-task-store'

type StoreType = ReturnType<typeof useTaskStore>

interface TaskStoreContextType extends StoreType {
  activeProjectId: string | null
  setActiveProjectId: (id: string | null) => void
}

const TaskStoreContext = createContext<TaskStoreContextType | null>(null)

export function TaskStoreProvider({ children }: { children: React.ReactNode }) {
  const store = useTaskStore()
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  return (
    <TaskStoreContext.Provider value={{ ...store, activeProjectId, setActiveProjectId }}>
      {children}
    </TaskStoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(TaskStoreContext)
  if (!ctx) throw new Error('useStore must be used within TaskStoreProvider')
  return ctx
}
