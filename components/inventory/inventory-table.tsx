"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function InventoryTable() {
  const [productos, setProductos] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // 🔴 REEMPLAZA ESTO CON EL TOKEN QUE GENERAS EN INSOMNIA AL HACER LOGIN
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzaXZib19hcGkiLCJzdWIiOiJvYmVkLmFkbWluIiwiaWQiOjEsImV4cCI6MTc4MTgzOTY1NH0.L5wEI_kZ9xvZ5RCmuDEsusAdeDju5LNdcc4c_YqjyTk"

    fetch('http://localhost:8080/api/v1/productos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(datos => {
        setProductos(datos.content) // SIVBO devuelve los datos dentro de 'content' por la paginación
        setCargando(false)
      })
      .catch(err => {
        console.error("Error conectando con SIVBO:", err)
        setCargando(false)
      })
  }, [])

  if (cargando) return <div className="p-4 text-center text-muted-foreground">Cargando inventario desde la base de datos...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código de Barras</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Stock Actual</TableHead>
            <TableHead className="text-center">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((prod) => (
            <TableRow key={prod.idProducto}>
              <TableCell className="font-medium">{prod.codigoBarras}</TableCell>
              <TableCell>{prod.nombre}</TableCell>
              <TableCell className="text-muted-foreground">{prod.descripcion}</TableCell>
              <TableCell className="text-right">S/ {(prod.precioUnitario || 0).toFixed(2)}</TableCell>
              <TableCell className={`text-right font-bold ${prod.stock <= prod.stockMinimo ? 'text-red-500' : 'text-green-600'}`}>
                {prod.stock}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={prod.estado ? "default" : "destructive"}>
                  {prod.estado ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}