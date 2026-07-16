"use client"

import { useEffect, useState } from "react"
import { DollarSign, ShoppingCart, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricCards() {
  const [metricas, setMetricas] = useState({
    ventasTotales: 0,
    transacciones: 0,
    productosActivos: 0,
    productosBajoStock: 0
  })

  useEffect(() => {
    // 🔴 Tu Token de seguridad
    const token = localStorage.getItem("token")
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }

    // 1. Traer Productos
    fetch('http://localhost:8080/api/v1/productos', { headers })
      .then(res => res.json())
      .then(datos => {
        const prods = datos.content || (Array.isArray(datos) ? datos : [])
        const activos = prods.length
        const bajoStock = prods.filter((p:any) => p.stock <= (p.stockMinimo || p.stock_minimo || 10)).length

        // Actualizamos las métricas de productos
        setMetricas(prev => ({ ...prev, productosActivos: activos, productosBajoStock: bajoStock }))
      })
      .catch(err => console.error("Error cargando productos:", err))

    // 2. Traer Ventas (Para sumar el dinero y los tickets)
    fetch('http://localhost:8080/api/v1/ventas', { headers })
      .then(res => res.json())
      .then(datos => {
        const ventas = datos.content || (Array.isArray(datos) ? datos : [])
        const transacciones = ventas.length
        const totalDinero = ventas.reduce((suma: number, v: any) => suma + (v.total || 0), 0)

        // Actualizamos las métricas de ventas
        setMetricas(prev => ({ ...prev, ventasTotales: totalDinero, transacciones: transacciones }))
      })
      .catch(err => console.error("Error cargando ventas:", err))
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* TARJETA 1: Ingresos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Ventas de Hoy</CardTitle>
          <DollarSign className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            S/ {metricas.ventasTotales.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ingresos brutos acumulados
          </p>
        </CardContent>
      </Card>

      {/* TARJETA 2: Transacciones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
          <ShoppingCart className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.transacciones}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Tickets cerrados exitosamente
          </p>
        </CardContent>
      </Card>

      {/* TARJETA 3: Catálogo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
          <Package className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.productosActivos}</div>
          <p className={`text-xs mt-1 font-semibold ${metricas.productosBajoStock > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {metricas.productosBajoStock > 0 
              ? `⚠ ${metricas.productosBajoStock} bajo stock crítico` 
              : "Inventario saludable"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}