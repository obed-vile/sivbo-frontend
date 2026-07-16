"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ScanLine,
  Package,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Store,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

function decodificarJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pos", label: "Punto de Venta", icon: ScanLine },
  { href: "/inventory", label: "Inventario", icon: Package },
]

const secondaryItems = [
  { href: "/reportes", label: "Reportes", icon: BarChart3 }, // <-- Cambiamos esto
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [nombreUsuario, setNombreUsuario] = useState("Cargando...")
  const [rol, setRol] = useState("Usuario")
  const [iniciales, setIniciales] = useState("U")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const usuarioGuardado = localStorage.getItem("username") || "usuario"
    const usuarioLower = usuarioGuardado.toLowerCase()

    const nombreFormateado = usuarioGuardado
      .split('.')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ')
    setNombreUsuario(nombreFormateado)

    const letras = nombreFormateado.split(' ')
    const init = letras.map(l => l.charAt(0)).join('').substring(0, 2).toUpperCase()
    setIniciales(init)

    if (token) {
      const datosToken = decodificarJWT(token)

      // Intentamos leer el rol desde Java
      const rolDesdeToken = datosToken?.roles || datosToken?.role || datosToken?.rol || datosToken?.authorities
      
      if (rolDesdeToken) {
        const rolTexto = JSON.stringify(rolDesdeToken).toUpperCase()
        if (rolTexto.includes("ADMIN")) {
          setRol("Administrador")
        } else {
          setRol("Cajero")
        }
      } else {
        // 🔴 BYPASS: Si Java falla en enviar el rol, forzamos Administrador para ti
        if (usuarioLower.includes("admin") || usuarioLower === "cajero.prueba") {
          setRol("Administrador")
        } else {
          setRol("Cajero")
        }
      }
    } else {
      if (usuarioLower.includes("admin") || usuarioLower === "cajero.prueba") {
        setRol("Administrador")
      } else {
        setRol("Cajero")
      }
    }
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("rol")
    router.push("/login")
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Store className="size-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-tight text-sidebar-accent-foreground">
            SIVBO
          </span>
          <span className="text-xs text-sidebar-foreground/60">
            POS &amp; Inventario
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
          Operación
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          )
        })}

        <p className="px-3 pb-2 pt-5 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
          Gestión
        </p>
        {secondaryItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="size-4.5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <Avatar className="size-9">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground font-bold">
              {iniciales}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-sidebar-accent-foreground">
              {nombreUsuario}
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              {rol}
            </span>
          </div>
          <button
            onClick={cerrarSesion}
            type="button"
            aria-label="Cerrar sesión"
            className="rounded-md p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}