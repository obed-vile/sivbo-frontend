import { DashboardShell } from "@/components/dashboard-shell"
import { PosRegister } from "@/components/pos/pos-register"

export default function PosPage() {
  return (
    <DashboardShell
      title="Punto de Venta"
      description="Registra ventas y cobra a tus clientes"
    >
      <PosRegister />
    </DashboardShell>
  )
}
