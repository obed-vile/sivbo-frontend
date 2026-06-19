import { DashboardShell } from "@/components/dashboard-shell"
import { InventoryTable } from "@/components/inventory/inventory-table"

export default function InventoryPage() {
  return (
    <DashboardShell
      title="Inventario"
      description="Administra el catálogo de productos"
    >
      <InventoryTable />
    </DashboardShell>
  )
}
