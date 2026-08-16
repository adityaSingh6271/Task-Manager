"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, LogOut, User, Settings, Zap, Menu } from "lucide-react"
import { useTheme } from "next-themes"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useDispatch } from "react-redux"
import { clearAuth } from "@/store/authSlice"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useState } from "react"

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  isLoading?: boolean;
  selectedFolder?: string | null;
  onFolderSelect?: (folderId: string | null) => void;
}

export function Header({ user, isLoading, selectedFolder = null, onFolderSelect = () => undefined }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "User";
  const initials = user?.name?.trim()
    ? user.name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(clearAuth())
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    })
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-sidebar px-5 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={() => setMobileSidebarOpen(true)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl lg:hidden" aria-label="Open navigation menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Jarvis</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.avatar || undefined}
                    alt={displayName}
                  />
                  <AvatarFallback>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{displayName}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="lg:hidden">
        <Sidebar selectedFolder={selectedFolder} onFolderSelect={onFolderSelect} mobileOpen={mobileSidebarOpen} onMobileOpenChange={setMobileSidebarOpen} showMobileToggle={false} />
      </div>
    </header>
  )
}
