"use client";

import { useMemo, useRef, useState } from "react";
import { format, isToday, parseISO } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Inbox,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTask } from "@/hooks/use-create-task";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { useEvents } from "@/hooks/use-events";
import type { Folder, Task } from "@/types";

type TaskWithProject = Task & { folderName: string; folderColor: string };

/* ─── Sub-components ─────────────────────────────────────── */

function SectionHeader({
  icon: Icon,
  title,
  count,
  accentColor,
  children,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  accentColor: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentColor}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {count !== undefined && (
          <span className="rounded-full bg-foreground/8 px-2.5 py-1 text-sm font-medium text-muted-foreground">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  actionLabel,
  onAction,
  onEdit,
  secondaryLabel,
  onSecondary,
}: {
  task: TaskWithProject;
  onToggle: () => void;
  actionLabel: string;
  onAction: () => void;
  onEdit: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  const done = task.status === "COMPLETED";
  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-150 ${done
          ? "border-foreground/5 bg-foreground/2 opacity-60"
          : "border-foreground/8 bg-foreground/3 hover:border-foreground/12 hover:bg-foreground/5"
        }`}
    >
      <Checkbox
        checked={done}
        onCheckedChange={onToggle}
        className="shrink-0 border-foreground/20"
      />
      <button onClick={onEdit} className="min-w-0 flex-1 text-left">
        <p
          className={`truncate text-base ${done
              ? "line-through text-muted-foreground"
              : "font-medium text-foreground"
            }`}
        >
          {task.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: task.folderColor }}
          />
          <span className="truncate text-sm text-muted-foreground">
            {task.folderName}
          </span>
          {task.dueDate && (
            <>
              <span className="text-sm text-foreground/20">·</span>
              <span className="flex items-center gap-1 text-sm text-violet-400">
                <Clock className="h-3.5 w-3.5" />
                {format(
                  typeof task.dueDate === "string"
                    ? parseISO(task.dueDate)
                    : task.dueDate,
                  "MMM d"
                )}
              </span>
            </>
          )}
        </div>
      </button>
      <div className="flex shrink-0 items-center gap-1.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        {secondaryLabel && (
          <button
            onClick={onSecondary}
            className="rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all"
          >
            {secondaryLabel}
          </button>
        )}
        <button
          onClick={onAction}
          className="rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

function EmptyState({ text, cta, onCta }: { text: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-foreground/10 py-8 text-center">
      <CheckCircle2 className="mb-2 h-7 w-7 text-foreground/15" />
      <p className="text-base text-muted-foreground">{text}</p>
      {cta && onCta && (
        <button
          onClick={onCta}
          className="mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {cta}
        </button>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */

export function TodayWorkspace({
  folders,
  onOpenTask,
  onManageProjects,
}: {
  folders: Folder[];
  onOpenTask: (task?: Task) => void;
  onManageProjects: () => void;
}) {
  const [title, setTitle] = useState("");
  const [folderId, setFolderId] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const inboxRef = useRef<HTMLElement | null>(null);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: events = [] } = useEvents();

  /* ── Derived task lists ── */
  const tasks = useMemo<TaskWithProject[]>(
    () =>
      folders.flatMap((folder) =>
        (folder.tasks ?? []).map((task) => ({
          ...task,
          folderId: folder.id,
          folderName: folder.name,
          folderColor: folder.color,
        }))
      ),
    [folders]
  );

  const priorities = tasks
    .filter((t) => t.isPriority)
    .sort((a, b) => (a.priorityOrder ?? 99) - (b.priorityOrder ?? 99));

  const openPrioritySlots = Math.max(3 - priorities.length, 0);

  const scheduledToday = tasks.filter(
    (t) =>
      t.dueDate &&
      isToday(typeof t.dueDate === "string" ? parseISO(t.dueDate) : t.dueDate)
  );

  const inbox = tasks.filter(
    (t) => t.status !== "COMPLETED" && !t.dueDate && !t.isPriority
  );

  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  /* Progress bar stats */
  const todayFocusTasks = Array.from(
    new Map([...priorities, ...scheduledToday].map((task) => [task.id, task])).values()
  );
  const doneToday = todayFocusTasks.filter((t) => t.status === "COMPLETED").length;
  const progress = todayFocusTasks.length > 0 ? Math.round((doneToday / todayFocusTasks.length) * 100) : 0;

  /* Today's events */
  const todayEvents = events.filter((e) => isToday(new Date(e.startAt)));

  /* ── Handlers ── */
  const addTask = async () => {
    const selected = folderId || folders[0]?.id;
    if (!title.trim() || !selected) return;
    await createTask.mutateAsync({ title: title.trim(), folderId: selected, tags: [] });
    setTitle("");
  };

  const toggleComplete = (task: Task) =>
    updateTask.mutate({
      id: task.id,
      data: { status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED" },
    });

  const makePriority = (task: Task) => {
    const isAdding = !task.isPriority;
    if (isAdding && priorities.length >= 3) return;

    updateTask.mutate({
      id: task.id,
      data: {
        isPriority: isAdding,
        priorityOrder: isAdding ? priorities.length + 1 : null,
      },
    });
  };

  const scheduleToday = (task: Task) =>
    updateTask.mutate({ id: task.id, data: { dueDate: new Date() } });

  const pickFromInbox = () => {
    inboxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    inboxRef.current?.focus({ preventScroll: true });
  };

  /* ── Empty / no-projects state ── */
  if (!folders.length) {
    return (
      <main className="mx-auto w-full max-w-2xl p-8 sm:p-10">
        <div className="mb-2 text-sm font-semibold text-indigo-400">
          {format(new Date(), "EEEE, MMMM d")}
        </div>
        <h2 className="mb-1 text-3xl font-bold tracking-tight">
          Let&apos;s get started
        </h2>
        <p className="mb-10 text-muted-foreground">
          Create your first project to start capturing tasks, notes, and events.
        </p>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-500/30 bg-indigo-500/5 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/20">
            <Plus className="h-7 w-7 text-indigo-400" />
          </div>
          <p className="mb-2 font-semibold">No projects yet</p>
          <p className="mb-6 max-w-xs text-sm text-muted-foreground">
            Projects hold your tasks, notes, and events. Create one to unlock your workspace.
          </p>
          <Button
            onClick={onManageProjects}
            className="btn-gradient rounded-xl gap-2 px-6"
          >
            <Plus className="h-4 w-4" />
            Create first project
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-5 sm:p-7 lg:p-9">
      {/* ─── Top strip: date + actions ─ */}
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-semibold text-indigo-400">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
          <h2 className="mt-1 text-4xl font-bold tracking-tight">
            Today&apos;s Workspace
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Focus on priorities first — then handle scheduled work.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            className="h-11 border-foreground/10 bg-foreground/5 text-base hover:bg-foreground/10"
            onClick={onManageProjects}
          >
            Manage projects
          </Button>
          <Button
            className="btn-gradient h-11 gap-2 rounded-xl text-base"
            onClick={() => onOpenTask()}
          >
            <Plus className="h-5 w-5" />
            New task
          </Button>
        </div>
      </section>

      {/* ─── Progress + Events strip ─ */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Progress card */}
        <div className="rounded-2xl border border-foreground/8 bg-foreground/3 p-6">
          <div className="mb-3 flex items-center justify-between text-base">
            <span className="font-medium">Today&apos;s progress</span>
            <span className="font-semibold text-indigo-400">
              {doneToday}/{todayFocusTasks.length} tasks
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {progress === 100
              ? "🎉 Amazing! All done for today."
              : progress > 50
                ? "Great momentum — keep going!"
                : progress > 0
                  ? "Good start — stay focused."
                  : "Set your top 3 priorities below to begin."}
          </p>
        </div>

        {/* Events today */}
        <div className="rounded-2xl border border-foreground/8 bg-foreground/3 p-6">
          <div className="mb-3 flex items-center gap-2 text-base font-medium">
            <CalendarDays className="h-5 w-5 text-violet-400" />
            Events today
            <Badge variant="secondary" className="rounded-full text-sm">
              {todayEvents.length}
            </Badge>
          </div>
          {todayEvents.length ? (
            <div className="space-y-2">
              {todayEvents.slice(0, 3).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-2.5 rounded-lg border border-violet-500/20 bg-violet-500/8 px-3 py-2.5 text-sm"
                >
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  <span className="flex-1 truncate font-medium">{e.title}</span>
                  <span className="shrink-0 text-violet-300/70">
                    {format(new Date(e.startAt), "h:mm a")}
                  </span>
                </div>
              ))}
              {todayEvents.length > 3 && (
                <p className="text-sm text-muted-foreground">
                  +{todayEvents.length - 3} more events
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No events scheduled today.{" "}
              <a href="/calendar" className="text-violet-400 hover:underline">
                Open calendar →
              </a>
            </p>
          )}
        </div>
      </div>

      {/* ─── Quick capture ─ */}
      <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-5 sm:flex-row">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Quick capture — what needs your attention?"
          className="h-12 border-foreground/10 bg-foreground/5 text-base focus:border-indigo-500/50"
        />
        <Select value={folderId} onValueChange={setFolderId}>
          <SelectTrigger className="h-12 w-full border-foreground/10 bg-foreground/5 text-base sm:w-48">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            {folders.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={addTask}
          disabled={!title.trim() || createTask.isPending}
          className="btn-gradient h-12 shrink-0 gap-1.5 rounded-xl text-base"
        >
          <Plus className="h-5 w-5" />
          Add
        </Button>
      </div>

      {/* ─── Main two-column layout ─ */}
      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">

        {/* LEFT column */}
        <div className="space-y-5">

          {/* Priorities */}
          <section className="rounded-2xl border border-foreground/8 bg-foreground/2 p-6">
            <SectionHeader
              icon={Star}
              title="Today's Priorities"
              accentColor="bg-indigo-500/15 border border-indigo-500/20 text-indigo-400"
            >
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-foreground/8">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{
                      width: `${Math.min((priorities.filter(t => t.status === "COMPLETED").length / Math.max(priorities.length, 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {priorities.length}/3
                </span>
              </div>
            </SectionHeader>
            <p className="mb-4 text-sm text-muted-foreground">
              Choose up to 3 meaningful outcomes for today. {openPrioritySlots > 0 ? `${openPrioritySlots} slot${openPrioritySlots === 1 ? "" : "s"} open.` : "Your focus list is full."}
            </p>
            <div className="space-y-2">
              {priorities.length ? (
                priorities.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleComplete(task)}
                    actionLabel="Remove"
                    onAction={() => makePriority(task)}
                    onEdit={() => onOpenTask(task)}
                  />
                ))
              ) : (
                <EmptyState
                  text={inbox.length ? "No priorities set yet. Pick a task from Inbox to focus your day." : "No priorities set yet. Capture a task above to begin."}
                  cta={inbox.length ? "Pick from Inbox" : undefined}
                  onCta={inbox.length ? pickFromInbox : undefined}
                />
              )}
            </div>
          </section>

          {/* Scheduled today */}
          <section className="rounded-2xl border border-foreground/8 bg-foreground/2 p-6">
            <SectionHeader
              icon={CalendarDays}
              title="Scheduled Today"
              count={scheduledToday.length}
              accentColor="bg-violet-500/15 border border-violet-500/20 text-violet-400"
            />
            <p className="mb-4 text-sm text-muted-foreground">
              Tasks with today as their due date.
            </p>
            <div className="space-y-2">
              {scheduledToday.length ? (
                scheduledToday.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleComplete(task)}
                    actionLabel="Edit"
                    onAction={() => onOpenTask(task)}
                    onEdit={() => onOpenTask(task)}
                  />
                ))
              ) : (
                <EmptyState text="No tasks scheduled for today." />
              )}
            </div>
          </section>

          {/* Completed (collapsible) */}
          <section className="rounded-2xl border border-foreground/8 bg-foreground/2 p-6">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full"
            >
              <SectionHeader
                icon={CheckCircle2}
                title="Completed"
                count={completedTasks.length}
                accentColor="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400"
              >
                {showCompleted ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </SectionHeader>
            </button>
            {showCompleted && (
              <div className="mt-1 space-y-2">
                {completedTasks.length ? (
                  completedTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggleComplete(task)}
                      actionLabel="Reopen"
                      onAction={() => toggleComplete(task)}
                      onEdit={() => onOpenTask(task)}
                    />
                  ))
                ) : (
                  <EmptyState text="Completed tasks will appear here." />
                )}
              </div>
            )}
            {!showCompleted && completedTasks.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {completedTasks.length} task{completedTasks.length !== 1 ? "s" : ""} done — click to expand
              </p>
            )}
          </section>
        </div>

        {/* RIGHT column */}
        <div className="space-y-5">

          {/* Inbox */}
          <section ref={inboxRef} tabIndex={-1} className="scroll-mt-24 rounded-2xl border border-foreground/8 bg-foreground/2 p-6 outline-none">
            <SectionHeader
              icon={Inbox}
              title="Inbox"
              count={inbox.length}
              accentColor="bg-amber-500/15 border border-amber-500/20 text-amber-400"
            />
            <p className="mb-4 text-sm text-muted-foreground">
              Unplanned work — decide, schedule, or let it wait.
            </p>
            <div className="space-y-2">
              {inbox.length ? (
                inbox.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleComplete(task)}
                    actionLabel="Schedule"
                    onAction={() => scheduleToday(task)}
                    onEdit={() => onOpenTask(task)}
                    secondaryLabel={openPrioritySlots > 0 ? "Prioritize" : undefined}
                    onSecondary={() => makePriority(task)}
                  />
                ))
              ) : (
                <EmptyState text="Inbox zero! Add new tasks above as they come in." />
              )}
            </div>
          </section>

          {/* Planning tip */}
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/8 to-indigo-500/5 p-6">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/20">
                <Sparkles className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h4 className="mb-1 text-base font-semibold">Daily planning tip</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Estimate less than your whole day. Leave room for messages, meetings, and the unexpected. A short focused list beats a long aspirational one.
                </p>
              </div>
            </div>
          </div>

          {/* Today summary */}
          <div className="rounded-2xl border border-foreground/8 bg-foreground/2 p-6">
            <h4 className="mb-4 text-base font-semibold">Today at a glance</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: priorities.length,
                  label: "Priorities",
                  color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/25",
                },
                {
                  value: inbox.length,
                  label: "Inbox",
                  color: "bg-amber-500/20 text-amber-400 border-amber-500/25",
                },
                {
                  value: scheduledToday.length,
                  label: "Scheduled",
                  color: "bg-violet-500/20 text-violet-400 border-violet-500/25",
                },
              ].map(({ value, label, color }) => (
                <div key={label} className="rounded-xl border border-foreground/8 bg-foreground/3 p-3 text-center">
                  <div
                    className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${color}`}
                  >
                    {value}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
