"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { LoginData, OTPData } from "@/types"
import Link from "next/link"
import { Eye, EyeOff, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginData>()

  const {
    register: registerOTP,
    handleSubmit: handleOTPSubmit,
    formState: { errors: otpErrors, isSubmitting: isOTPSubmitting },
  } = useForm<OTPData>()

const onLoginSubmit = async (data: LoginData) => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Login failed");
    }

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
      // Send OTP
      await fetch("http://localhost:3000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: data.mobile }),
      });

      setOtpSent(true);
      toast({
        title: "OTP sent!",
        description: "Please check your mobile for the verification code.",
      });
    } else {
      // Verify OTP
      const res = await fetch("http://localhost:3000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: data.mobile, otp: data.otp }),
      });

      if (!res.ok) throw new Error("Invalid OTP");

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      router.push("/dashboard");
    }
  } catch (error) {
    toast({
      title: "Authentication failed",
      description: "Please try again.",
      variant: "destructive",
    });
  }
};


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
              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
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
                  {loginErrors.email && <p className="text-sm text-red-600">{loginErrors.email.message}</p>}
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
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {loginErrors.password && <p className="text-sm text-red-600">{loginErrors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={isLoginSubmitting}>
                  {isLoginSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="otp" className="space-y-4">
              <form onSubmit={handleOTPSubmit(onOTPSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    disabled={otpSent}
                    {...registerOTP("mobile", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit mobile number",
                      },
                    })}
                  />
                  {otpErrors.mobile && <p className="text-sm text-red-600">{otpErrors.mobile.message}</p>}
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
                    {otpErrors.otp && <p className="text-sm text-red-600">{otpErrors.otp.message}</p>}
                  </div>
                )}

                <Button type="submit" className="w-full cursor-pointer" disabled={isOTPSubmitting}>
                  {isOTPSubmitting
                    ? otpSent
                      ? "Verifying..."
                      : "Sending OTP..."
                    : otpSent
                      ? "Verify OTP"
                      : "Send OTP"}
                </Button>

                {otpSent && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setOtpSent(false)}
                  >
                    Change Mobile Number
                  </Button>
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
  )
}
