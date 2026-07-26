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
import { Moon, Sun, LogOut, User, Settings, Zap } from "lucide-react"
import { useTheme } from "next-themes"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useDispatch } from "react-redux"
import { clearAuth } from "@/store/authSlice"

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  isLoading?: boolean;
}

export function Header({ user, isLoading }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()
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
    <header className="border-b border-border bg-sidebar px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Jarvis</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
             <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full cursor-pointer"
              >
                <Avatar className="h-8 w-8">
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
    </header>
  )
}
