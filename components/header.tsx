"use client"

import { usePathname } from "next/navigation"
import { Bell, Globe, LogOut, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return t("common.dashboard")
    if (pathname === "/tasks/active") return t("common.activeTasks")
    if (pathname === "/tasks/history") return t("common.tasksHistory")
    if (pathname === "/virtual-machines") return t("common.virtualMachines")
    if (pathname === "/signatures") return t("common.signatures")
    if (pathname === "/signatures/new") return `${t("common.newTask")} ${t("common.signatures")}`
    if (pathname === "/settings/profile") return `${t("common.profile")} ${t("common.settings")}`
    if (pathname === "/settings/users") return `${t("common.users")} ${t("common.settings")}`
    if (pathname === "/settings/licenses") return `${t("common.licenses")} ${t("common.settings")}`
    return "Sector Sandbox"
  }

  const handleLogout = () => {
    // In a real app, you would clear the session/token
    router.push("/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Globe className="h-5 w-5" />
              <span className="sr-only">{t("language.title")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("language.title")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
              {t("language.english")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("ru")} className={language === "ru" ? "bg-accent" : ""}>
              {t("language.russian")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("uz")} className={language === "uz" ? "bg-accent" : ""}>
              {t("language.uzbek")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="default" size="sm" asChild>
          <Link href="/tasks/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            {t("common.newTask")}
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">{t("common.notifications")}</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
              <User className="mr-2 h-4 w-4" />
              {t("common.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>{t("common.settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("common.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
