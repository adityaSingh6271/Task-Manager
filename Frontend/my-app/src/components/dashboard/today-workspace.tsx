"use client";

import { useMemo, useState } from "react";
import { format, isToday, parseISO } from "date-fns";
import { CalendarDays, CheckCircle2, Inbox, Plus, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTask } from "@/hooks/use-create-task";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import type { Folder, Task } from "@/types";

type TaskWithProject = Task & { folderName: string; folderColor: string };

export function TodayWorkspace({ folders, onOpenTask, onManageProjects }: { folders: Folder[]; onOpenTask: (task?: Task) => void; onManageProjects: () => void }) {
  const [title, setTitle] = useState("");
  const [folderId, setFolderId] = useState("");
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const tasks = useMemo<TaskWithProject[]>(() => folders.flatMap((folder) => (folder.tasks ?? []).map((task) => ({ ...task, folderId: folder.id, folderName: folder.name, folderColor: folder.color }))), [folders]);
  const active = tasks.filter((task) => task.status !== "COMPLETED");
  const priorities = tasks.filter((task) => task.isPriority).sort((a, b) => (a.priorityOrder ?? 99) - (b.priorityOrder ?? 99));
  const inbox = active.filter((task) => !task.dueDate && !task.isPriority);
  const scheduledToday = tasks.filter((task) => task.dueDate && isToday(typeof task.dueDate === "string" ? parseISO(task.dueDate) : task.dueDate));
  const completed = priorities.filter((task) => task.status === "COMPLETED").length;
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

  const addTask = async () => {
    const selectedProject = folderId || folders[0]?.id;
    if (!title.trim() || !selectedProject) return;
    await createTask.mutateAsync({ title: title.trim(), folderId: selectedProject, tags: [] });
    setTitle("");
  };
  const toggleComplete = (task: Task) => updateTask.mutate({ id: task.id, data: { status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED" } });
  const makePriority = (task: Task) => updateTask.mutate({ id: task.id, data: { isPriority: !task.isPriority, priorityOrder: !task.isPriority ? priorities.length + 1 : null } });
  const scheduleToday = (task: Task) => updateTask.mutate({ id: task.id, data: { dueDate: new Date() } });

  return <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-medium text-blue-600">{format(new Date(), "EEEE, MMMM d")}</p><h2 className="text-3xl font-semibold tracking-tight">Plan a day that fits.</h2><p className="mt-1 text-muted-foreground">Choose what matters, then give it a realistic place in your day.</p></div>
      <div className="flex gap-2">{folders.length > 0 && <Button variant="outline" onClick={onManageProjects}>Manage projects</Button>}<Button onClick={() => folders.length ? onOpenTask() : onManageProjects()}><Plus className="mr-2 h-4 w-4" />{folders.length ? "Create task" : "Create your first project"}</Button></div>
    </section>

    {folders.length > 0 && <Card className="mb-6"><CardContent className="p-4"><p className="font-medium">Start here</p><div className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-3"><p><span className="mr-2 rounded-full bg-blue-100 px-2 py-1 font-semibold text-blue-700">1</span>Capture new work in the box below.</p><p><span className="mr-2 rounded-full bg-blue-100 px-2 py-1 font-semibold text-blue-700">2</span>Choose up to three Inbox tasks as priorities.</p><p><span className="mr-2 rounded-full bg-blue-100 px-2 py-1 font-semibold text-blue-700">3</span>Schedule work for today, then check it off.</p></div></CardContent></Card>}
    {!folders.length ? <Card className="mb-6 border-blue-500/30 bg-blue-500/10"><CardContent className="p-6"><h3 className="font-semibold">Start with one project</h3><p className="mt-1 text-sm text-muted-foreground">Use the “Create your first project” button above. Then you can capture tasks, add notes, and schedule events inside that project.</p></CardContent></Card> : <Card className="mb-6 border-blue-500/30 bg-blue-500/10"><CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
      <Input value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addTask()} placeholder="Quick capture: what needs your attention?" className="bg-background" />
      <Select value={folderId} onValueChange={setFolderId}><SelectTrigger className="w-full bg-background sm:w-48"><SelectValue placeholder="Project" /></SelectTrigger><SelectContent>{folders.map((folder) => <SelectItem value={folder.id} key={folder.id}>{folder.name}</SelectItem>)}</SelectContent></Select>
      <Button onClick={addTask} disabled={!title.trim() || !folders.length || createTask.isPending}><Plus className="mr-1 h-4 w-4" />Add</Button>
    </CardContent></Card>}

    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <div className="space-y-6">
        <Card><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-blue-600" />Today’s priorities</CardTitle><p className="mt-1 text-sm text-muted-foreground">Keep this to three meaningful outcomes.</p></div><div className="rounded-full bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{completed}/{Math.max(priorities.length, 3)} done</div></CardHeader><CardContent className="space-y-2">
          {priorities.length ? priorities.map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleComplete(task)} actionLabel="Remove" onAction={() => makePriority(task)} onEdit={() => onOpenTask(task)} />) : <Empty text="Choose up to three tasks from Inbox to make today intentional." />}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-violet-600" />Scheduled today <Badge variant="secondary">{scheduledToday.length}</Badge></CardTitle></CardHeader><CardContent className="space-y-2">{scheduledToday.length ? scheduledToday.map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleComplete(task)} actionLabel="Edit" onAction={() => onOpenTask(task)} onEdit={() => onOpenTask(task)} />) : <Empty text="No scheduled tasks yet. Schedule an Inbox task when you are ready." />}</CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" />Completed <Badge variant="secondary">{completedTasks.length}</Badge></CardTitle></CardHeader><CardContent className="space-y-2">{completedTasks.length ? completedTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleComplete(task)} actionLabel="Reopen" onAction={() => toggleComplete(task)} onEdit={() => onOpenTask(task)} />) : <Empty text="Completed work stays here so progress never disappears." />}</CardContent></Card>
      </div>
      <div className="space-y-6">
        <Card><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="flex items-center gap-2"><Inbox className="h-5 w-5 text-orange-600" />Inbox <Badge variant="secondary">{inbox.length}</Badge></CardTitle><p className="mt-1 text-sm text-muted-foreground">Unplanned work. Decide, schedule, or let it wait.</p></div></CardHeader><CardContent className="space-y-2">{inbox.length ? inbox.map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleComplete(task)} actionLabel="Today" onAction={() => scheduleToday(task)} onEdit={() => onOpenTask(task)} secondaryLabel={priorities.length < 3 ? "Prioritize" : undefined} onSecondary={() => makePriority(task)} />) : <Empty text="Inbox zero. Capture new work above as it comes in." />}</CardContent></Card>
        <Card className="border-violet-200 bg-violet-50/50 dark:border-violet-950 dark:bg-violet-950/20"><CardContent className="p-5"><div className="flex gap-3"><Sparkles className="mt-0.5 h-5 w-5 text-violet-600" /><div><h3 className="font-semibold">Daily planning tip</h3><p className="mt-1 text-sm text-muted-foreground">Estimate less than your whole day. Leave room for messages, meetings, and the unexpected.</p></div></div></CardContent></Card>
      </div>
    </div>
  </main>;
}

function TaskRow({ task, onToggle, actionLabel, onAction, onEdit, secondaryLabel, onSecondary }: { task: TaskWithProject; onToggle: () => void; actionLabel: string; onAction: () => void; onEdit: () => void; secondaryLabel?: string; onSecondary?: () => void }) {
  return <div className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40"><Checkbox checked={task.status === "COMPLETED"} onCheckedChange={onToggle} /><button onClick={onEdit} className="min-w-0 flex-1 text-left"><p className={task.status === "COMPLETED" ? "truncate text-sm line-through text-muted-foreground" : "truncate text-sm font-medium"}>{task.title}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: task.folderColor }} />{task.folderName}</p></button>{secondaryLabel && <Button size="sm" variant="ghost" onClick={onSecondary}>{secondaryLabel}</Button>}<Button size="sm" variant="outline" onClick={onAction}>{actionLabel}</Button></div>;
}

function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground"><CheckCircle2 className="mx-auto mb-2 h-5 w-5 opacity-50" />{text}</div>; }
