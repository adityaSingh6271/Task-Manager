"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { LoginData, OTPData } from "@/types";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";

/* ─── Tiny sub-components ─────────────────────────────────── */

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
      <span className="inline-block h-1 w-1 rounded-full bg-rose-400" />
      {message}
    </p>
  );
}

function StepIndicator({ current }: { current: 1 | 2 }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${step < current
                ? "bg-indigo-500 text-white"
                : step === current
                  ? "bg-indigo-500/20 border border-indigo-500 text-indigo-400"
                  : "bg-foreground/5 border border-foreground/10 text-muted-foreground"
              }`}
          >
            {step < current ? <CheckCircle className="h-4 w-4" /> : step}
          </div>
          <span
            className={`text-xs ${step === current ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
          >
            {step === 1 ? "Enter email" : "Verify code"}
          </span>
          {step < 2 && (
            <div
              className={`h-px w-8 transition-all duration-500 ${current > 1 ? "bg-indigo-500" : "bg-foreground/10"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */

type Mode = "email" | "otp";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginData>();

  const {
    register: registerOTP,
    handleSubmit: handleOTPSubmit,
    watch: watchOTP,
    formState: { errors: otpErrors, isSubmitting: isOTPSubmitting },
  } = useForm<OTPData>();

  /* ── Handlers ──────────────────────────────────────────── */

  const onLoginSubmit = async (data: LoginData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Login failed");
      dispatch(setAuth({ token: result.token, user: result.user }));
      toast({ title: "Welcome back!", description: "You have successfully signed in." });
      router.push("/dashboard");
    } catch (error: unknown) {
      toast({
        title: "Login failed",
        description: getErrorMessage(error, "Invalid credentials. Please try again."),
        variant: "destructive",
      });
    }
  };

  const onOTPSubmit = async (data: OTPData) => {
    try {
      if (!otpSent) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to send OTP");
        setOtpSent(true);
        toast({ title: "Code sent!", description: "Check your email for the 6-digit code." });
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, otp: data.otp }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Invalid OTP");
      dispatch(setAuth({ token: result.token, user: result.user }));
      toast({ title: "Welcome back!", description: "OTP verified successfully." });
      router.push("/dashboard");
    } catch (error: unknown) {
      toast({
        title: "Authentication failed",
        description: getErrorMessage(error, "Please try again."),
        variant: "destructive",
      });
    }
  };

  const resendOtp = async (email?: string) => {
    if (!email) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to resend OTP");
      toast({ title: "Code resent!", description: "Check your inbox again." });
    } catch (error: unknown) {
      toast({
        title: "Failed to resend code",
        description: getErrorMessage(error, "Please try again later."),
        variant: "destructive",
      });
    }
  };

  /* ── Render ─────────────────────────────────────────────── */

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* ── Orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb orb-1 top-[-80px] left-[-40px] opacity-60" />
        <div className="orb orb-2 bottom-[-60px] right-[-40px] opacity-50" />
      </div>

      {/* ─── Left brand panel ──────────────────────────────── */}
      <div className="relative hidden w-[46%] flex-col items-center justify-center overflow-hidden border-r border-foreground/10 bg-slate-50/70 dark:bg-white/[0.02]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-violet-600/5 to-transparent" />
        <div className="relative z-10 px-12 text-center">
          {/* Logo */}
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl pulse-ring">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-5xl font-black tracking-tight">Focus on what matters.</h1>
          <p className="mb-12 text-lg leading-8 text-muted-foreground">
            Your intelligent workspace for tasks, events, and notes.
          </p>

          {/* Feature bullets */}
          <div className="space-y-4 text-left">
            {[
              { icon: ShieldCheck, text: "Secure JWT + OTP authentication" },
              { icon: CheckCircle, text: "Priority-first daily planning" },
              { icon: Mail, text: "Integrated calendar & notes" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-base text-muted-foreground">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/20">
                  <Icon className="h-4 w-4 text-indigo-400" />
                </div>
                {text}
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
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">Welcome back</h2>
            <p className="mt-2 text-base text-muted-foreground">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Mode switcher */}
          <div className="mb-8 flex rounded-xl border border-foreground/10 bg-foreground/5 p-1">
            {(["email", "otp"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setOtpSent(false); }}
                className={`flex-1 rounded-lg py-3 text-base font-semibold transition-all duration-200 ${mode === m
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {m === "email" ? "Password" : "Email OTP"}
              </button>
            ))}
          </div>

          {/* ── Email/Password form ── */}
          {mode === "email" && (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-5 animate-fade-up">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                  className="h-12 border-foreground/10 bg-foreground/5 pl-10 text-base focus:border-indigo-500/50 focus:ring-indigo-500/20"
                    {...registerLogin("email", {
                      required: "Email is required",
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                    })}
                  />
                </div>
                <FieldError message={loginErrors.email?.message} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  className="h-12 border-foreground/10 bg-foreground/5 pl-10 pr-10 text-base focus:border-indigo-500/50 focus:ring-indigo-500/20"
                    {...registerLogin("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError message={loginErrors.password?.message} />
              </div>

              <button
                type="submit"
                disabled={isLoginSubmitting}
                className="btn-gradient w-full flex h-12 items-center justify-center gap-2 rounded-xl text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoginSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-white" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── OTP form ── */}
          {mode === "otp" && (
            <form onSubmit={handleOTPSubmit(onOTPSubmit)} className="space-y-5 animate-fade-up">
              <StepIndicator current={otpSent ? 2 : 1} />

              <div className="space-y-1.5">
                <Label htmlFor="otp-email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="otp-email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={otpSent}
                    className="h-12 border-foreground/10 bg-foreground/5 pl-10 text-base focus:border-indigo-500/50 focus:ring-indigo-500/20 disabled:opacity-50"
                    {...registerOTP("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                    })}
                  />
                </div>
                <FieldError message={otpErrors.email?.message} />
              </div>

              {otpSent && (
                <div className="space-y-1.5 animate-fade-up">
                  <Label htmlFor="otp-code" className="text-sm font-medium">
                    Verification code
                  </Label>
                  <Input
                    id="otp-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    inputMode="numeric"
                    className="h-14 border-foreground/10 bg-foreground/5 text-center text-xl tracking-[0.5em] focus:border-indigo-500/50 focus:ring-indigo-500/20"
                    {...registerOTP("otp", {
                      required: "Code is required",
                      pattern: { value: /^[0-9]{6}$/, message: "Enter the 6-digit code" },
                    })}
                  />
                  <FieldError message={otpErrors.otp?.message} />
                </div>
              )}

              <button
                type="submit"
                disabled={isOTPSubmitting}
                className="btn-gradient w-full flex h-12 items-center justify-center gap-2 rounded-xl text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isOTPSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-white" />
                    {otpSent ? "Verifying…" : "Sending code…"}
                  </>
                ) : otpSent ? (
                  <>
                    Verify code
                    <ShieldCheck className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Send verification code
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {otpSent && (
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => resendOtp(watchOTP("email"))}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-indigo-400 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Resend code
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Change email
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Footer link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
