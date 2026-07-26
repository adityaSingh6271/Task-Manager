"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, FileText, ArrowRight, Zap, Star, BarChart2, Shield } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: CheckCircle,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    title: "Smart Task Organization",
    description:
      "Capture, prioritize, and organize your work with intelligent folders, tags, and priority queues. Never lose track of what matters.",
  },
  {
    icon: Calendar,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    title: "Integrated Calendar",
    description:
      "Set due dates, schedule events, and see task deadlines alongside your calendar — all in one unified weekly view.",
  },
  {
    icon: FileText,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Project Notes",
    description:
      "Keep meeting notes, plans, and project knowledge beside your tasks. Context travels with your work.",
  },
  {
    icon: BarChart2,
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
    title: "Daily Progress",
    description:
      "Track your priorities each day. Visual progress indicators keep you motivated and in control of your output.",
  },
  {
    icon: Shield,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    title: "Secure & Private",
    description:
      "Your data is yours. JWT-based authentication with OTP support ensures only you access your workspace.",
  },
  {
    icon: Star,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "Intelligent Priorities",
    description:
      "The intentional 3-priority system keeps your focus sharp. Choose what matters most — then execute.",
  },
];

const stats = [
  { value: "3×", label: "Productivity boost" },
  { value: "99.9%", label: "Uptime guarantee" },
  { value: "< 1s", label: "Load time" },
  { value: "Free", label: "To get started" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* ── Ambient orbs ─────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb orb-1 top-[-100px] left-[-60px]" />
        <div className="orb orb-2 top-[30%] right-[-80px]" />
        <div className="orb orb-3 bottom-[10%] left-[30%]" />
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <header className="relative z-10 border-b border-foreground/5 glass sticky top-0">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="pulse-ring flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Jarvis</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              >
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="btn-gradient gap-2 rounded-xl px-5 shadow-lg">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <main className="relative z-10">
        <section className="container mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            Your AI-powered productivity workspace
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1 mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            Plan a day that{" "}
            <span className="gradient-text">actually fits.</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Jarvis combines intelligent task management, calendar scheduling, and
            project notes into one seamless workspace — so you always know what
            to do next.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="btn-gradient h-13 gap-2 rounded-2xl px-8 text-base shadow-xl"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="h-13 rounded-2xl border-foreground/10 bg-foreground/5 px-8 text-base hover:bg-foreground/10"
              >
                Log in to your workspace
              </Button>
            </Link>
          </div>

          {/* Stats strip */}
          <div className="animate-fade-up-delay-4 mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-foreground/5 bg-foreground/5 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 bg-card px-6 py-5"
              >
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────── */}
        <section className="container mx-auto px-6 pb-24">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Everything you need
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for deep work
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Six focused modules that cover every angle of personal productivity
              — from daily planning to long-term projects.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`animate-fade-up-delay-${Math.min(i + 1, 5)} group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 ${f.bg}`}
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${f.bg}`}
                >
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Section ────────────────────────────────────── */}
        <section className="container mx-auto px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent p-12 text-center">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to transform your workflow?
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
                Join a focused workspace that keeps you present, productive, and
                in control every single day.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="btn-gradient h-13 gap-2 rounded-2xl px-10 text-base shadow-xl"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer className="border-t border-foreground/5 py-8 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span>Jarvis © {new Date().getFullYear()}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
