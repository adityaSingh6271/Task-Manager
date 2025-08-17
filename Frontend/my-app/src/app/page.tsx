"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react";

export default function LandingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Jarvis</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button className="cursor-pointer" variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="cursor-pointer">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-blue-600 dark:text-blue-400">Jarvis</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your intelligent task management companion. Organize, prioritize, and accomplish your goals with the power
            of advanced productivity tools.
          </p>
          <div className="space-x-4">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3 cursor-pointer">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent cursor-pointer">
                Log In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Smart Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Organize your tasks with intelligent folders, tags, and priority levels. Never lose track of what
                matters most.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Time Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set due dates, get reminders, and track your progress. Stay on top of deadlines with intelligent
                scheduling.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Collaborative</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share projects, assign tasks, and collaborate seamlessly with your team. Productivity multiplied.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to boost your productivity?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who have transformed their workflow with Jarvis.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-8 py-3 cursor-pointer">
              Get Started Free
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
