"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TaskList } from "@/components/dashboard/task-list"
import { TaskForm } from "@/components/dashboard/task-form"
import type { Task } from "@/types"

export default function DashboardPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleTaskSave = (task: Task) => {
    console.log("Task saved:", task)
    setEditingTask(null)
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-64 w-full border-r dark:border-gray-800">
          <Sidebar selectedFolder={selectedFolder} onFolderSelect={setSelectedFolder} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <TaskList selectedFolder={selectedFolder} onEditTask={handleEditTask} />
        </div>
      </div>

      {/* Floating Add Button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg lg:hidden"
        onClick={handleAddTask}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <TaskForm
        open={showTaskForm}
        onOpenChange={setShowTaskForm}
        task={editingTask}
        onTaskSave={handleTaskSave}
      />
    </div>
  )
}
