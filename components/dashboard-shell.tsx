"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, LayoutDashboard, ScanLine, Package } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"

const mobileNav = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/pos", label: "Venta", icon: ScanLine },
  { href: "/inventory", label: "Inventario", icon: Package },
]

export function DashboardShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {description ? (
              <p className="truncate text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Buscar"
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Search className="size-4.5" />
            </button>
            <button
              type="button"
              aria-label="Notificaciones"
              className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="size-4.5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-border bg-background md:hidden">
        {mobileNav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
