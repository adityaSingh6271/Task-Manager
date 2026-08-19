"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { RegisterData } from "@/types";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Mail,
  Lock,
  CheckCircle,
  Target,
  Calendar,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ─── Password strength ────────────────────────────────────── */

function calcStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-rose-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-sky-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = calcStrength(password);
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= Math.ceil((score / 5) * 4) ? color : "bg-foreground/10"
              }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${score <= 1 ? "text-rose-400" : score <= 2 ? "text-amber-400" : score <= 3 ? "text-sky-400" : "text-emerald-400"}`}>
        Password strength: {label}
      </p>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
      <span className="inline-block h-1 w-1 rounded-full bg-rose-400" />
      {message}
    </p>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>();

  const password = watch("password") ?? "";

  const onSubmit = async (data: RegisterData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");
      toast({ title: "Account created!", description: "Welcome to Jarvis. You can now sign in." });
      router.push("/login");
    } catch (error: unknown) {
      toast({
        title: "Registration failed",
        description: getErrorMessage(error, "Please try again later."),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* ── Orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb orb-2 top-[-80px] right-[-40px] opacity-60" />
        <div className="orb orb-3 bottom-[-60px] left-[-40px] opacity-50" />
      </div>

      {/* ─── Left brand panel ──────────────────────────────── */}
      <div className="relative hidden w-[46%] flex-col items-center justify-center overflow-hidden border-r border-foreground/10 bg-slate-50/70 dark:bg-white/[0.02]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent" />
        <div className="relative z-10 px-12 text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl pulse-ring">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-5xl font-black tracking-tight">Make space for great work.</h1>
          <p className="mb-12 text-lg leading-8 text-muted-foreground">
            Start organizing your work with purpose and clarity.
          </p>

          {/* What you get */}
          <div className="space-y-4 text-left">
            {[
              { icon: Target, text: "Daily priority planning with 3-task focus system" },
              { icon: Calendar, text: "Calendar events + task due dates in one view" },
              { icon: FileText, text: "Project-linked notes for richer context" },
              { icon: CheckCircle, text: "Progress tracking so nothing gets lost" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 text-base text-muted-foreground">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/20">
                  <Icon className="h-4 w-4 text-violet-400" />
                </div>
                <span className="mt-1">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right form panel ──────────────────────────────── */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-5 py-12 sm:px-8">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Jarvis</span>
        </div>

        <div className="w-full max-w-xl rounded-[2rem] border border-foreground/10 bg-card p-7 shadow-2xl shadow-indigo-950/10 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">Create your account</h2>
            <p className="mt-2 text-base text-muted-foreground">
              Free to start. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-12 border-foreground/10 bg-foreground/5 pl-10 text-base focus:border-indigo-500/50 focus:ring-indigo-500/20"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                  })}
                />
              </div>
              <FieldError message={errors.email?.message} />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min. 8 characters)"
                  className="h-12 border-foreground/10 bg-foreground/5 pl-10 pr-10 text-base focus:border-indigo-500/50 focus:ring-indigo-500/20"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
              <FieldError message={errors.password?.message} />
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-confirm" className="text-sm font-medium">
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reg-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  className="h-12 border-foreground/10 bg-foreground/5 pl-10 pr-10 text-base focus:border-indigo-500/50 focus:ring-indigo-500/20"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-white" />
                  Creating account…
                </>
              ) : (
                <>
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Terms note */}
            <p className="text-center text-xs text-muted-foreground">
              By signing up you agree to our{" "}
              <span className="text-indigo-400 cursor-pointer hover:underline">Terms of Service</span>{" "}
              and{" "}
              <span className="text-indigo-400 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
