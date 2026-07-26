"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { FolderManager } from "@/components/dashboard/folder-manager";
import { TaskForm } from "@/components/dashboard/task-form";
import { TodayWorkspace } from "@/components/dashboard/today-workspace";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import type { Task } from "@/types";

export default function DashboardPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const { data, isLoading } = useProfile();
  const folders = data?.folders ?? [];
  const openTask = (task?: Task) => { setEditingTask(task ?? null); setShowTaskForm(true); };

  return <div className="min-h-screen bg-muted/30">
    <Header user={data?.user} isLoading={isLoading} />
    <div className="flex min-h-[calc(100vh-73px)]">
      <aside className="hidden w-64 shrink-0 border-r bg-background lg:block"><Sidebar selectedFolder={selectedFolder} onFolderSelect={setSelectedFolder} /></aside>
      <div className="min-w-0 flex-1"><TodayWorkspace folders={folders} onOpenTask={openTask} onManageProjects={() => setShowProjectManager(true)} /></div>
    </div>
    <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg lg:hidden" onClick={() => openTask()}><Plus className="h-6 w-6" /></Button>
    <TaskForm open={showTaskForm} onOpenChange={setShowTaskForm} task={editingTask} taskFolderId={editingTask?.folderId ?? ""} onTaskSave={() => setEditingTask(null)} folders={folders} />
    <FolderManager open={showProjectManager} onOpenChange={setShowProjectManager} folders={folders} onFoldersUpdate={() => undefined} />
  </div>;
}
