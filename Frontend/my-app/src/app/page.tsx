"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  LayoutDashboard,
  ListTodo,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  ["Plan with intention", "Start each day with the priorities that will actually move work forward.", ListTodo],
  ["See your whole week", "Tasks, deadlines, and events live together in one calm, clear view.", CalendarDays],
  ["Keep context close", "Attach project notes to the work they support, so details stay useful.", FileText],
] as const;

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
        <Zap className="h-5 w-5" />
      </span>
      <span className="text-2xl">Jarvis</span>
    </Link>
  );
}

function ProductPreview() {
  const tasks = ["Finalize product brief", "Review design feedback", "Plan Thursday's focus"];

  return (
    <div className="relative w-full rounded-2xl border border-white/70 bg-white p-1.5 shadow-2xl shadow-indigo-950/20 sm:rounded-[1.75rem] sm:p-2 dark:border-white/10 dark:bg-slate-950">
      <div className="overflow-hidden rounded-[1.35rem] border border-slate-100 bg-slate-50 text-left dark:border-white/5 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950">
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" /></div>
          <span className="rounded-md bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-500 dark:bg-white/5">jarvis.app</span>
          <div className="w-8" />
        </div>
        <div className="grid min-h-[285px] grid-cols-[auto_1fr] sm:min-h-[380px]">
          <aside className="hidden w-36 border-r border-slate-200 bg-white p-4 sm:block dark:border-white/10 dark:bg-slate-950">
            <p className="mb-5 text-xs font-bold">Workspace</p>
            {["Today", "My tasks", "Calendar", "Notes"].map((item, index) => <div key={item} className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${index === 0 ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" : "text-slate-500"}`}><LayoutDashboard className="h-3.5 w-3.5" />{item}</div>)}
          </aside>
          <div className="p-3 sm:p-6">
            <div className="mb-4 flex items-start justify-between sm:mb-5"><div><p className="text-[10px] font-semibold text-indigo-600 sm:text-xs dark:text-indigo-400">TUESDAY, AUGUST 16</p><h2 className="mt-1 text-lg font-bold sm:text-2xl">Make today count.</h2></div><div className="rounded-lg bg-indigo-600 px-2 py-1.5 text-[9px] font-bold text-white sm:px-2.5 sm:py-2 sm:text-[10px]">+ Add task</div></div>
            <div className="grid gap-3 sm:grid-cols-[1.35fr_0.75fr] xl:grid-cols-[1.35fr_0.75fr]">
              <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3 dark:border-white/10 dark:bg-slate-950"><div className="mb-2 flex items-center justify-between sm:mb-3"><h3 className="text-xs font-bold sm:text-sm">Today&apos;s priorities</h3><span className="text-[9px] font-medium text-slate-500 sm:text-[10px]">2 of 3 done</span></div>{tasks.map((task, index) => <div key={task} className="mb-1.5 flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-[10px] font-medium last:mb-0 sm:mb-2 sm:gap-2.5 sm:p-2.5 sm:text-xs dark:bg-white/5"><span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border sm:h-4 sm:w-4 ${index < 2 ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300"}`}>{index < 2 && <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}</span><span className={`truncate ${index < 2 ? "text-slate-400 line-through" : ""}`}>{task}</span></div>)}</div>
              <div className="hidden rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white sm:block"><p className="text-xs font-medium text-indigo-100">This week</p><p className="mt-2 text-3xl font-bold">82%</p><p className="mt-1 text-xs leading-5 text-indigo-100">of planned work complete</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full w-[82%] rounded-full bg-white" /></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="h-[100svh] snap-y snap-mandatory overflow-y-auto overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-[#080c12] dark:text-slate-50">
      <div className="relative flex min-h-[100svh] snap-start flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(129,140,248,0.25),transparent_58%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-6 sm:py-5 lg:px-8">
        <Brand />
        <nav className="flex items-center gap-2 sm:gap-4"><Link href="/login" className="hidden px-3 py-2 text-base font-semibold text-slate-600 transition hover:text-slate-950 sm:block dark:text-slate-300 dark:hover:text-white">Log in</Link><Link href="/register"><Button className="h-11 rounded-xl bg-indigo-600 px-4 text-base font-semibold hover:bg-indigo-700 sm:px-5">Start free <ArrowRight className="ml-2 h-4 w-4" /></Button></Link></nav>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-9 px-5 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:px-8 lg:py-10">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm dark:border-indigo-400/25 dark:bg-indigo-500/10 dark:text-indigo-300"><Sparkles className="h-4 w-4" /> A calmer way to get work done</div>
          <h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:mt-6 sm:text-6xl xl:text-7xl">Make time for<br /><span className="text-indigo-600 dark:text-indigo-400">meaningful work.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-xl sm:leading-8 dark:text-slate-300">Jarvis brings your tasks, calendar, and notes into one focused workspace—so you always know what deserves your attention next.</p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row lg:justify-start"><Link href="/register" className="w-full sm:w-auto"><Button size="lg" className="h-13 w-full rounded-xl bg-indigo-600 px-5 text-sm font-bold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 sm:h-14 sm:px-7 sm:text-base">Create your free workspace <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /></Button></Link><Link href="/login" className="w-full sm:w-auto"><Button size="lg" variant="outline" className="h-13 w-full rounded-xl border-slate-300 bg-white px-5 text-sm font-bold sm:h-14 sm:px-7 sm:text-base dark:border-white/15 dark:bg-white/5">Sign in</Button></Link></div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 sm:mt-9 sm:text-sm lg:justify-start"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free to start</span><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none"><div className="absolute -inset-5 -z-10 rounded-full bg-indigo-400/20 blur-3xl sm:-inset-8" /><ProductPreview /><div className="absolute -bottom-4 -left-2 hidden rounded-2xl border border-white/70 bg-white px-4 py-3 shadow-xl dark:border-white/10 dark:bg-slate-900 sm:-left-6 sm:block"><p className="text-xs font-medium text-slate-500">Your focus score</p><p className="mt-0.5 text-xl font-black text-slate-900 dark:text-white">+24% <span className="text-sm font-semibold text-emerald-500">this week</span></p></div></div>
      </section>
      </div>

      <section className="relative z-10 flex min-h-[100svh] snap-start flex-col border-y border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 sm:text-sm dark:text-indigo-400">One focused workspace</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Everything you need to keep momentum.</h2></div>
          <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">{features.map(([title, description, Icon]) => <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7 dark:border-white/10 dark:bg-white/[0.03]"><div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"><Icon className="h-5 w-5 sm:h-6 sm:w-6" /></div><h3 className="mt-5 text-lg font-bold sm:mt-6 sm:text-xl">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7 dark:text-slate-300">{description}</p><span className="mt-5 inline-flex items-center text-sm font-bold text-indigo-600 sm:mt-6 dark:text-indigo-400">Explore feature <ChevronRight className="ml-1 h-4 w-4" /></span></article>)}</div>
        </div>
        <footer className="border-t border-slate-200 px-6 py-6 text-center text-sm font-medium text-slate-500 dark:border-white/10">© {new Date().getFullYear()} Jarvis. Work with clarity.</footer>
      </section>
    </main>
  );
}
