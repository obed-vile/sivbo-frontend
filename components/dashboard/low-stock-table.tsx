"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export function LowStockTable() {
  const [productos, setProductos] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Tu token está intacto aquí
    const token = localStorage.getItem("token")

    fetch('http://localhost:8080/api/v1/productos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar la información")
        return res.json()
      })
      .then(datos => {
        const todosLosProductos = datos.content || (Array.isArray(datos) ? datos : [])
        
        // LA MAGIA CON PLAN B: Si no llega la variable, el mínimo por defecto será 5
        const alertas = todosLosProductos.filter((p: any) => {
          const minimo = p.stockMinimo || p.stock_minimo || 10; 
          return p.stock <= minimo;
        })
        
        setProductos(alertas)
        setCargando(false)
      })
      .catch(err => {
        console.error("Error conectando con SIVBO:", err)
        setCargando(false)
      })
  }, [])

  if (cargando) return <div className="p-8 text-center text-muted-foreground border rounded-lg">Cargando alertas del sistema...</div>

  // Si no hay productos en riesgo, mostramos un mensaje de tranquilidad
  if (productos.length === 0) return (
    <div className="p-8 text-center text-muted-foreground border rounded-lg bg-green-50/10">
      <p className="font-semibold text-green-600">¡Todo en orden!</p>
      <p className="text-sm mt-1">Ningún producto tiene stock crítico en este momento.</p>
    </div>
  )

  return (
    <div className="rounded-md border border-red-100 shadow-sm">
      <Table>
        <TableHeader className="bg-red-50/50">
          <TableRow>
            <TableHead>Producto en Riesgo</TableHead>
            <TableHead className="text-center">Stock Mínimo</TableHead>
            <TableHead className="text-right">Stock Actual</TableHead>
            <TableHead className="text-center">Acción Recomendada</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((prod) => (
            <TableRow key={prod.idProducto || prod.codigo_barras} className="hover:bg-red-50/30 transition-colors">
              <TableCell className="font-medium flex items-center gap-2">
                <AlertTriangle className="size-4 text-red-500" />
                {prod.nombre}
              </TableCell>
              {/* Aquí también le enseñamos a leer ambas formas */}
              <TableCell className="text-center text-muted-foreground">
                {prod.stockMinimo !== undefined ? prod.stockMinimo : prod.stock_minimo}
              </TableCell>
              <TableCell className="text-right font-extrabold text-red-600">{prod.stock}</TableCell>
              <TableCell className="text-center">
                <Badge variant="destructive" className="animate-pulse shadow-sm">
                  Reabastecer urgente
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}