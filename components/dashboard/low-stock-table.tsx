import { AlertTriangle, RotateCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { lowStockProducts } from "@/lib/data"

export function LowStockTable() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-foreground">
              Alertas de Stock Bajo
            </h2>
            <p className="text-sm text-muted-foreground">
              Productos que requieren reabastecimiento
            </p>
          </div>
        </div>
        <Badge variant="destructive" className="rounded-full">
          {lowStockProducts.length} productos
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Producto</TableHead>
              <TableHead className="text-center">Stock Actual</TableHead>
              <TableHead className="text-center">Stock Mínimo</TableHead>
              <TableHead className="pr-5 text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockProducts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="pl-5">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {p.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {p.barcode}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-base font-semibold text-destructive">
                    {p.stock}
                  </span>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {p.minStock}
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <Button size="sm" className="gap-1.5">
                    <RotateCw className="size-3.5" />
                    Reabastecer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
