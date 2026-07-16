// ¡Ruta corregida! Ya no dice /ui/
import { DashboardShell } from "@/components/dashboard-shell"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { TopProductsChart } from "@/components/dashboard/top-products-chart"
import { LowStockTable } from "@/components/dashboard/low-stock-table"

export default function DashboardPage() {
  return (
    <DashboardShell 
      title="Dashboard" 
      description="Resumen de actividad de ventas y alertas de inventario del sistema SIVBO."
    >
      <div className="flex-1 space-y-6">
        
        {/* Las 3 tarjetas de ingresos y estadísticas */}
        <MetricCards />
        
        {/* Gráficos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Gráfico de dinero (4 columnas) */}
          <SalesChart />
          {/* Gráfico de productos más vendidos (3 columnas) */}
          <TopProductsChart />
        </div>
        
        {/* Tabla de Alertas (Ancho completo) */}
        <div className="grid gap-4">
          <LowStockTable />
        </div>

      </div>
    </DashboardShell>
  )
}