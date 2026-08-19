"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  isSameMonth,
  isPast,
  startOfWeek,
  subWeeks,
} from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { WorkspaceShell } from "@/components/dashboard/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEvent, useDeleteEvent, useEvents } from "@/hooks/use-events";
import { useProfile } from "@/hooks/useProfile";

export default function CalendarPage() {
  const { data } = useProfile();
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  /* ── Form state ─────────────────────────────── */
  const [title, setTitle] = useState("");
  const [folderId, setFolderId] = useState("");
  const [startAt, setStartAt] = useState(
    () => format(new Date(), "yyyy-MM-dd'T'09:00")
  );
  const [endAt, setEndAt] = useState(
    () => format(new Date(), "yyyy-MM-dd'T'10:00")
  );

  /* ── Week navigation ────────────────────────── */
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 });
    if (weekOffset > 0) return addWeeks(base, weekOffset);
    if (weekOffset < 0) return subWeeks(base, Math.abs(weekOffset));
    return base;
  }, [weekOffset]);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const weekLabel = useMemo(() => {
    const s = days[0];
    const e = days[6];
    return isSameMonth(s, e)
      ? `${format(s, "MMM d")} – ${format(e, "d, yyyy")}`
      : `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`;
  }, [days]);

  /* ── Derived ────────────────────────────────── */
  const dueTasks =
    data?.folders.flatMap((p) =>
      (p.tasks ?? []).map((t) => ({ ...t, project: p }))
    ) ?? [];

  const weekEvents = useMemo(
    () => events.filter((e) => days.some((d) => isSameDay(new Date(e.startAt), d))),
    [events, days]
  );

  /* Events sorted by date for the "All Events" panel */
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
    [events]
  );

  /* Upcoming events not visible in current week */
  const hiddenEventCount = events.length - weekEvents.length;

  /* ── Handlers ───────────────────────────────── */
  const addEvent = async () => {
    if (!title.trim()) return;
    await createEvent.mutateAsync({
      title: title.trim(),
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
      allDay: false,
      folderId: folderId || null,
    });
    setTitle("");
  };

  /* Jump the week grid to the week containing a given date */
  const jumpToDate = (dateStr: string) => {
    const target = startOfWeek(new Date(dateStr), { weekStartsOn: 1 });
    const base = startOfWeek(new Date(), { weekStartsOn: 1 });
    const diff = Math.round(
      (target.getTime() - base.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    setWeekOffset(diff);
  };

  return (
    <WorkspaceShell>
      <main className="mx-auto max-w-7xl p-5 sm:p-8">

        {/* ── Page header ─────────────────────────── */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-indigo-400">Calendar</p>
          <h1 className="text-3xl font-bold tracking-tight">Plan your week</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Events reserve time; task deadlines stay visible alongside them.
          </p>
        </div>

        {/* ── Add event form ───────────────────────── */}
        <div className="mb-6 grid gap-3 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEvent()}
            placeholder="Event title…"
            className="border-foreground/10 bg-foreground/5 focus:border-indigo-500/50"
          />
          <Input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="border-foreground/10 bg-foreground/5 focus:border-indigo-500/50"
          />
          <Input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="border-foreground/10 bg-foreground/5 focus:border-indigo-500/50"
          />
          <Select value={folderId} onValueChange={setFolderId}>
            <SelectTrigger className="border-foreground/10 bg-foreground/5">
              <SelectValue placeholder="Project (optional)" />
            </SelectTrigger>
            <SelectContent>
              {data?.folders.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={addEvent}
            disabled={!title.trim() || createEvent.isPending}
            className="btn-gradient gap-1.5 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add event
          </Button>
        </div>

        {/* ── Two-column layout: week grid + all-events panel ── */}
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">

          {/* LEFT — week grid ───────────────────────── */}
          <div>
            {/* Week nav bar */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setWeekOffset((o) => o - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="mx-2 text-sm font-medium">{weekLabel}</div>
                <button
                  onClick={() => setWeekOffset((o) => o + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {weekOffset !== 0 && (
                  <button
                    onClick={() => setWeekOffset(0)}
                    className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                  >
                    Today
                  </button>
                )}
                {weekEvents.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {weekEvents.length} event{weekEvents.length !== 1 ? "s" : ""} this week
                  </span>
                )}
              </div>
            </div>

            {/* Banner: events exist but not in this week */}
            {hiddenEventCount > 0 && weekEvents.length === 0 && (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-2.5 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                <span className="text-amber-200">
                  {hiddenEventCount} event{hiddenEventCount !== 1 ? "s" : ""} exist
                  but not in this week. Use the panel →{" "}
                  <button
                    onClick={() => sortedEvents[0] && jumpToDate(sortedEvents[0].startAt)}
                    className="font-semibold underline hover:text-amber-100"
                  >
                    Jump to nearest event
                  </button>
                </span>
              </div>
            )}

            {/* Loading */}
            {eventsLoading && (
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-indigo-400" />
                Loading events…
              </div>
            )}

            {/* Grid */}
            <section
              className="grid overflow-x-auto rounded-2xl border border-foreground/8 bg-card"
              style={{ gridTemplateColumns: "repeat(7, minmax(120px, 1fr))" }}
            >
              {days.map((day) => {
                const isToday = isSameDay(day, new Date());
                const dayEvents = events.filter((e) =>
                  isSameDay(new Date(e.startAt), day)
                );
                const dayTasks = dueTasks.filter(
                  (t) => t.dueDate && isSameDay(new Date(t.dueDate), day)
                );
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[360px] border-r border-foreground/8 p-2.5 last:border-0 ${isToday ? "bg-indigo-500/5" : ""
                      }`}
                  >
                    {/* Day header */}
                    <div className="mb-2.5">
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {format(day, "EEE")}
                      </p>
                      <div
                        className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${isToday
                            ? "bg-indigo-500 text-white shadow-sm"
                            : "text-foreground"
                          }`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-2 py-1.5 text-xs"
                        >
                          <div className="flex items-start gap-1">
                            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                            <p className="min-w-0 flex-1 font-semibold leading-snug text-indigo-100">
                              {event.title}
                            </p>
                            {/* Always-visible delete */}
                            <button
                              onClick={() => deleteEvent.mutate(event.id)}
                              disabled={deleteEvent.isPending}
                              aria-label={`Delete ${event.title}`}
                              className="ml-0.5 shrink-0 rounded p-0.5 text-indigo-300/60 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="mt-1 flex items-center gap-1 pl-2.5 text-indigo-300/60">
                            <Clock className="h-2.5 w-2.5" />
                            {format(new Date(event.startAt), "h:mm a")}
                          </div>
                        </div>
                      ))}

                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="rounded-lg border border-violet-500/25 bg-violet-500/10 px-2 py-1.5 text-xs"
                        >
                          <div className="flex items-start gap-1">
                            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                            <p className="font-semibold leading-snug text-violet-100">
                              {task.title}
                            </p>
                          </div>
                          <p className="mt-0.5 pl-2.5 text-violet-300/60">
                            Task · {task.project.name}
                          </p>
                        </div>
                      ))}

                      {dayEvents.length === 0 && dayTasks.length === 0 && (
                        <div className="py-3 text-center text-[9px] text-muted-foreground/30">
                          —
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Legend */}
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                Events
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                Task due dates
              </div>
            </div>
          </div>

          {/* RIGHT — All Events panel ───────────────── */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-foreground/8 bg-card">
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-foreground/8 px-4 py-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-semibold">All Events</span>
                </div>
                <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-semibold text-indigo-400">
                  {events.length}
                </span>
              </div>

              {/* Events list */}
              <div className="divide-y divide-foreground/5">
                {eventsLoading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-indigo-400" />
                    Loading…
                  </div>
                ) : sortedEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <CalendarDays className="h-7 w-7 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No events yet.</p>
                    <p className="text-xs text-muted-foreground/60">
                      Use the form above to add your first event.
                    </p>
                  </div>
                ) : (
                  sortedEvents.map((event) => {
                    const start = new Date(event.startAt);
                    const inPast = isPast(start);
                    const isThisWeek = days.some((d) => isSameDay(start, d));
                    return (
                      <div
                        key={event.id}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-foreground/3 ${inPast ? "opacity-50" : ""
                          }`}
                      >
                        {/* Date badge */}
                        <div className="flex w-10 shrink-0 flex-col items-center rounded-lg border border-foreground/10 bg-foreground/5 py-1 text-center">
                          <p className="text-[9px] font-bold uppercase text-muted-foreground">
                            {format(start, "MMM")}
                          </p>
                          <p className="text-base font-bold leading-tight text-foreground">
                            {format(start, "d")}
                          </p>
                        </div>

                        {/* Event info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{event.title}</p>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {format(start, "h:mm a")} – {format(new Date(event.endAt), "h:mm a")}
                          </div>
                          {isThisWeek ? (
                            <span className="mt-1 inline-block rounded-full bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-400">
                              This week
                            </span>
                          ) : (
                            <button
                              onClick={() => jumpToDate(event.startAt)}
                              className="mt-1 flex items-center gap-0.5 text-[9px] font-medium text-indigo-400/70 hover:text-indigo-400 transition-colors"
                            >
                              View in calendar
                              <ArrowRight className="h-2.5 w-2.5" />
                            </button>
                          )}
                        </div>

                        {/* Delete — always visible */}
                        <button
                          onClick={() => deleteEvent.mutate(event.id)}
                          disabled={deleteEvent.isPending}
                          aria-label={`Delete ${event.title}`}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted-foreground/40 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}
