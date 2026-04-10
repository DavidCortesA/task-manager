'use client'

import { useState, useEffect, useCallback } from 'react'

export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in-progress' | 'done'

export interface Project {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  projectId: string | null
  dueDate: string | null
  createdAt: string
}

export const PROJECT_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
]

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Website Redesign', color: '#6366f1', createdAt: '2026-04-01T00:00:00.000Z' },
  { id: 'p2', name: 'Mobile App', color: '#8b5cf6', createdAt: '2026-04-01T00:00:00.000Z' },
  { id: 'p3', name: 'API Integration', color: '#10b981', createdAt: '2026-04-01T00:00:00.000Z' },
]

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design new landing page',
    description: 'Create wireframes and high-fidelity mockups for the new marketing landing page',
    status: 'in-progress',
    priority: 'high',
    projectId: 'p1',
    dueDate: '2026-04-15',
    createdAt: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 't2',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment workflows',
    status: 'todo',
    priority: 'medium',
    projectId: 'p2',
    dueDate: '2026-04-20',
    createdAt: '2026-04-02T00:00:00.000Z',
  },
  {
    id: 't3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints using OpenAPI 3.0 specification',
    status: 'todo',
    priority: 'low',
    projectId: 'p3',
    dueDate: '2026-04-25',
    createdAt: '2026-04-02T00:00:00.000Z',
  },
  {
    id: 't4',
    title: 'Fix login session bug',
    description: 'Users are getting logged out after 5 minutes due to a token refresh issue',
    status: 'done',
    priority: 'high',
    projectId: 'p2',
    dueDate: '2026-04-10',
    createdAt: '2026-04-03T00:00:00.000Z',
  },
  {
    id: 't5',
    title: 'Update color system',
    description: 'Migrate from hex colors to CSS custom properties using the oklch color space',
    status: 'done',
    priority: 'medium',
    projectId: 'p1',
    dueDate: '2026-04-08',
    createdAt: '2026-04-03T00:00:00.000Z',
  },
  {
    id: 't6',
    title: 'Add user authentication',
    description: 'Implement JWT-based auth flow with access and refresh tokens',
    status: 'in-progress',
    priority: 'high',
    projectId: 'p3',
    dueDate: '2026-04-18',
    createdAt: '2026-04-04T00:00:00.000Z',
  },
  {
    id: 't7',
    title: 'Performance audit',
    description: 'Run Lighthouse audit and address the top performance bottlenecks across pages',
    status: 'todo',
    priority: 'medium',
    projectId: 'p1',
    dueDate: null,
    createdAt: '2026-04-05T00:00:00.000Z',
  },
]

const STORAGE_KEY = 'task-manager-v1'

function loadFromStorage(): { tasks: Task[]; projects: Project[] } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(data: { tasks: Task[]; projects: Project[] }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function useTaskStore() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = loadFromStorage()
    if (stored) {
      setProjects(stored.projects)
      setTasks(stored.tasks)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveToStorage({ tasks, projects })
  }, [tasks, projects, hydrated])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
    return newTask
  }, [])

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
    },
    [],
  )

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setProjects(prev => [...prev, newProject])
    return newProject
  }, [])

  const updateProject = useCallback(
    (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
      setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)))
    },
    [],
  )

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    setTasks(prev => prev.map(t => (t.projectId === id ? { ...t, projectId: null } : t)))
  }, [])

  return {
    tasks,
    projects,
    hydrated,
    addTask,
    updateTask,
    deleteTask,
    addProject,
    updateProject,
    deleteProject,
  }
}
