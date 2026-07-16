"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Store, User, Shield, Bell } from "lucide-react"

export default function AjustesPage() {
  return (
    <DashboardShell title="Ajustes" description="Configuración general del sistema">
      <div className="flex flex-col lg:flex-row gap-6 p-6 flex-1 bg-zinc-950 text-zinc-50">
        
        {/* Menú Lateral Interno de Ajustes */}
        <aside className="w-full lg:w-64 flex flex-col gap-2">
          <Button variant="secondary" className="justify-start bg-zinc-900 text-white hover:bg-zinc-800">
            <Store className="mr-2 h-4 w-4" /> Datos de la Empresa
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-400 hover:text-white hover:bg-zinc-900">
            <User className="mr-2 h-4 w-4" /> Mi Perfil
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-400 hover:text-white hover:bg-zinc-900">
            <Shield className="mr-2 h-4 w-4" /> Seguridad y Roles
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-400 hover:text-white hover:bg-zinc-900">
            <Bell className="mr-2 h-4 w-4" /> Notificaciones
          </Button>
        </aside>

        {/* Panel Principal de Configuración */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Datos de la Empresa</h2>
            <p className="text-zinc-400 text-sm mt-1">Configura la información que aparecerá en los tickets de venta.</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Nombre del Negocio</label>
                <Input defaultValue="SIVBO Bodega" className="bg-zinc-950 border-zinc-800 text-zinc-200" readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">RUC</label>
                <Input defaultValue="20123456789" className="bg-zinc-950 border-zinc-800 text-zinc-200 font-mono" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Dirección Principal</label>
              <Input defaultValue="Av. Panamericana Norte Km 30, Puente Piedra, Lima" className="bg-zinc-950 border-zinc-800 text-zinc-200" readOnly />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Teléfono de Contacto</label>
                <Input defaultValue="(01) 548-9632" className="bg-zinc-950 border-zinc-800 text-zinc-200" readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Correo Electrónico</label>
                <Input defaultValue="contacto@sivbo.pe" className="bg-zinc-950 border-zinc-800 text-zinc-200" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Mensaje al pie del ticket</label>
              <Input defaultValue="¡Gracias por su compra! Vuelva pronto." className="bg-zinc-950 border-zinc-800 text-zinc-200" readOnly />
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}