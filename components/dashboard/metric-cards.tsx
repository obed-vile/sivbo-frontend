import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const metrics = [
  {
    label: "Ventas de Hoy",
    value: "$4,820.50",
    delta: "+12.4%",
    trend: "up" as const,
    sub: "vs. ayer",
    icon: DollarSign,
  },
  {
    label: "Transacciones",
    value: "186",
    delta: "+8.1%",
    trend: "up" as const,
    sub: "tickets cerrados",
    icon: ShoppingCart,
  },
  {
    label: "Productos Activos",
    value: "1,243",
    delta: "-3 bajo stock",
    trend: "down" as const,
    sub: "en catálogo",
    icon: Package,
  },
]

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => (
        <Card key={m.label} className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                {m.label}
              </span>
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {m.value}
              </span>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <m.icon className="size-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                m.trend === "up" ? "text-primary" : "text-destructive",
              )}
            >
              {m.trend === "up" ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
              {m.delta}
            </span>
            <span className="text-muted-foreground">{m.sub}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
