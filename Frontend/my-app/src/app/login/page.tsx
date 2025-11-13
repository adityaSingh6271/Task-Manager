"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { LoginData, OTPData } from "@/types";
import Link from "next/link";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";

export default function LoginPage() {
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

  const onLoginSubmit = async (data: LoginData) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Login failed");
      }

      dispatch(setAuth({ token: result.token, user: result.user }));

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onOTPSubmit = async (data: OTPData) => {
    try {
      if (!otpSent) {
        // ---- REQUEST OTP ----
        const res = await fetch("http://localhost:5000/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.error || "Failed to send OTP");

        setOtpSent(true);

        toast({
          title: "OTP sent!",
          description: "Please check your email for the verification code.",
        });

        return;
      }

      // ---- VERIFY OTP ----
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, otp: data.otp }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Invalid OTP");

      dispatch(setAuth({ token: result.token, user: result.user }));

      toast({
        title: "Welcome back!",
        description: "OTP verified successfully.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const resendOtp = async (email?: string) => {
    if (!email) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email before resending OTP.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to resend OTP");

      toast({ title: "OTP resent!", description: "Check your inbox again." });
    } catch (error: any) {
      toast({
        title: "Failed to resend OTP",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const watch = (fieldName: keyof OTPData) => watchOTP(fieldName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">Jarvis</span>
          </div>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="otp">OTP Login</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <form
                onSubmit={handleLoginSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...registerLogin("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {loginErrors.email && (
                    <p className="text-sm text-red-600">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...registerLogin("password", {
                        required: "Password is required",
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-sm text-red-600">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoginSubmitting}
                >
                  {isLoginSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="otp" className="space-y-4">
              <form
                onSubmit={handleOTPSubmit(onOTPSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    disabled={otpSent}
                    {...registerOTP("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {otpErrors.email && (
                    <p className="text-sm text-red-600">
                      {otpErrors.email.message}
                    </p>
                  )}
                </div>

                {otpSent && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      {...registerOTP("otp", {
                        required: "OTP is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "Please enter a valid 6-digit OTP",
                        },
                      })}
                    />
                    {otpErrors.otp && (
                      <p className="text-sm text-red-600">
                        {otpErrors.otp.message}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isOTPSubmitting}
                >
                  {isOTPSubmitting
                    ? otpSent
                      ? "Verifying..."
                      : "Sending OTP..."
                    : otpSent
                    ? "Verify OTP"
                    : "Send OTP"}
                </Button>

                {otpSent && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => resendOtp(watch("email"))}
                    >
                      Resend OTP
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setOtpSent(false)}
                    >
                      Change Email
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {"Don't have an account? "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
