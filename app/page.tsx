import { DashboardShell } from "@/components/dashboard-shell"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { LowStockTable } from "@/components/dashboard/low-stock-table"

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      description="Resumen de actividad y alertas"
    >
      <div className="flex flex-col gap-6">
        <MetricCards />
        <LowStockTable />
      </div>
    </DashboardShell>
  )
}
