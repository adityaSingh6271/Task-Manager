"use client";

import { FolderKanban, Plus } from "lucide-react";
import { WorkspaceShell } from "@/components/dashboard/workspace-shell";
import { FolderManager } from "@/components/dashboard/folder-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";

export default function ProjectsPage() {
  const { data } = useProfile(); const [manage, setManage] = useState(false);
  return <WorkspaceShell><main className="mx-auto max-w-7xl p-5 sm:p-8"><div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-semibold text-blue-400">Projects</p><h1 className="text-3xl font-bold">Organize work around outcomes</h1><p className="mt-1 text-muted-foreground">Every task belongs to a project, so your daily plan always has context.</p></div><Button onClick={() => setManage(true)}><Plus className="mr-2 h-4 w-4" />Manage projects</Button></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data?.folders.map((project) => <Card key={project.id} className="border-border bg-card"><CardContent className="p-5"><div className="mb-5 flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} /><h2 className="font-semibold">{project.name}</h2></div><p className="text-3xl font-bold">{project.taskCount}</p><p className="text-sm text-muted-foreground">tasks in this project</p><div className="mt-5 space-y-2">{project.tasks?.slice(0, 3).map((task) => <p key={task.id} className="truncate text-sm text-muted-foreground">• {task.title}</p>)}</div></CardContent></Card>)}{!data?.folders.length && <Card className="border-dashed"><CardContent className="p-10 text-center text-muted-foreground"><FolderKanban className="mx-auto mb-3 h-7 w-7" />Create your first project before adding tasks.</CardContent></Card>}</div><FolderManager open={manage} onOpenChange={setManage} folders={data?.folders ?? []} onFoldersUpdate={() => undefined} /></main></WorkspaceShell>;
}
