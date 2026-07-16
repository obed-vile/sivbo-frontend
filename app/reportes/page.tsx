"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, Printer, Eye, X, Receipt } from "lucide-react"

// 🔥 EL TRADUCTOR DE FECHAS JAVA -> JAVASCRIPT
const parsearFechaJava = (fechaRaw: any) => {
  if (!fechaRaw) return null
  try {
    if (Array.isArray(fechaRaw)) {
      const [year, month, day, hour = 0, minute = 0] = fechaRaw
      return new Date(year, month - 1, day, hour, minute)
    }
    return new Date(fechaRaw)
  } catch (e) {
    return null
  }
}

export default function ReportesPage() {
  const [ventas, setVentas] = useState<any[]>([])
  const [ventasFiltradas, setVentasFiltradas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  
  const [ventaSeleccionada, setVentaSeleccionada] = useState<any | null>(null)
  
  const hoy = new Date()
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0]
  const hoyStr = hoy.toISOString().split('T')[0]
  
  const [fechaInicio, setFechaInicio] = useState(primerDiaMes)
  const [fechaFin, setFechaFin] = useState(hoyStr)

  useEffect(() => {
    cargarVentas()
  }, [])

  const cargarVentas = () => {
    const token = localStorage.getItem("token")
    
    fetch('http://localhost:8080/api/v1/ventas', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudieron cargar las ventas")
        return res.json()
      })
      .then(datos => {
        const listaVentas = datos.content || (Array.isArray(datos) ? datos : [])
        setVentas(listaVentas)
        setVentasFiltradas(listaVentas) 
        setCargando(false)
      })
      .catch(err => {
        console.error("SIVBO Error:", err)
        setCargando(false)
      })
  }

  const handleFiltrar = () => {
    if (!fechaInicio || !fechaFin) {
      setVentasFiltradas(ventas)
      return
    }

    const inicioTime = new Date(fechaInicio).setHours(0, 0, 0, 0)
    const finTime = new Date(fechaFin).setHours(23, 59, 59, 999)

    const filtradas = ventas.filter(venta => {
      // 🔴 AQUÍ agregamos fechaVenta como prioridad
      const fechaRaw = venta.fechaVenta || venta.fecha || venta.createdAt
      const fechaTraducida = parsearFechaJava(fechaRaw)
      
      if (!fechaTraducida) return true 
      
      const tiempoVenta = fechaTraducida.getTime()
      return tiempoVenta >= inicioTime && tiempoVenta <= finTime
    })

    setVentasFiltradas(filtradas)
  }

  const handleImprimir = () => {
    window.print() 
  }

  const totalIngresos = ventasFiltradas.reduce((acc, v) => acc + (v.total || v.montoTotal || v.precioTotal || 0), 0)
  const totalTickets = ventasFiltradas.length

  if (cargando) return <div className="p-8 text-center text-zinc-400">Cargando datos financieros...</div>

  return (
    <DashboardShell
      title="Reportes"
      description="Análisis de ingresos y tickets emitidos"
    >
      <div className="flex flex-col gap-6 p-6 flex-1 bg-zinc-950 text-zinc-50 print:bg-white print:text-black">
        
        {/* CABECERA */}
        <div className="flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reporte de Ventas</h1>
            <p className="text-zinc-400 mt-1">Análisis de ingresos y tickets emitidos.</p>
          </div>
          <Button onClick={handleImprimir} variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-white">
            <Printer className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
        </div>

        <div className="hidden print:block mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-center">SIVBO - Reporte de Ventas</h1>
          <p className="text-center text-gray-500">Periodo: {fechaInicio} al {fechaFin}</p>
        </div>

        {/* TARJETAS RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl print:border-gray-300 print:bg-white">
            <h3 className="text-sm font-medium text-zinc-400 print:text-gray-500">Ingresos Totales (Periodo)</h3>
            <p className="text-3xl font-bold mt-2 text-green-500">S/ {totalIngresos.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl print:border-gray-300 print:bg-white">
            <h3 className="text-sm font-medium text-zinc-400 print:text-gray-500">Tickets Cerrados</h3>
            <p className="text-3xl font-bold mt-2 text-blue-400">{totalTickets}</p>
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap items-end gap-4 bg-zinc-900/50 p-4 border border-zinc-800 rounded-xl print:hidden">
          <div>
            <label className="text-xs font-medium text-zinc-400 ml-1">Fecha Desde</label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input 
                type="date" 
                value={fechaInicio} 
                onChange={(e) => setFechaInicio(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400 ml-1">Fecha Hasta</label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input 
                type="date" 
                value={fechaFin} 
                onChange={(e) => setFechaFin(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <Button onClick={handleFiltrar} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Search className="mr-2 h-4 w-4" /> Filtrar
          </Button>
        </div>

        {/* TABLA DE RESULTADOS */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden print:border-gray-300 print:bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 print:border-gray-300">
                <TableHead className="print:text-black">N° Ticket / ID</TableHead>
                <TableHead className="print:text-black">Fecha</TableHead>
                <TableHead className="print:text-black">Cliente</TableHead>
                <TableHead className="text-right print:text-black">Total (S/)</TableHead>
                <TableHead className="text-center print:text-black">Estado</TableHead>
                <TableHead className="text-center print:hidden">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventasFiltradas.length > 0 ? (
                ventasFiltradas.map((venta) => {
                  // 🔴 AQUÍ agregamos fechaVenta a la tabla
                  const fechaRaw = venta.fechaVenta || venta.fecha || venta.createdAt;
                  const fechaLimpia = parsearFechaJava(fechaRaw);
                  
                  return (
                    <TableRow key={venta.idVenta || venta.id} className="border-zinc-800 print:border-gray-200">
                      <TableCell className="font-medium text-zinc-300 print:text-black">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-blue-500" />
                          {venta.numeroTicket || venta.comprobante || `TCK-000${venta.idVenta || venta.id}`}
                        </div>
                      </TableCell>
                      <TableCell className="print:text-black">
                        {fechaLimpia ? fechaLimpia.toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Fecha no registrada'}
                      </TableCell>
                      <TableCell className="text-zinc-400 print:text-black">
                        {venta.cliente?.nombre || venta.nombreCliente || 'Cliente Varios'}
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-400 print:text-green-700">
                        S/ {(venta.total || venta.montoTotal || venta.precioTotal || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={venta.estado === false ? "destructive" : "default"} className="print:text-black print:border-black">
                          {venta.estado === false ? 'Anulado' : 'Completado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center print:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setVentaSeleccionada(venta)} className="text-zinc-400 hover:text-white">
                          <Eye className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-zinc-500">
                    No se encontraron ventas. Dale a "Filtrar" sin modificar fechas para ver todo.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* MODAL PARA VER BOLETA */}
        {ventaSeleccionada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm print:hidden">
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-blue-500" /> Boleta de Venta
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setVentaSeleccionada(null)} className="h-8 w-8 text-zinc-400 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-3 text-sm text-zinc-300">
                <p><span className="font-semibold text-zinc-500">Ticket:</span> {ventaSeleccionada.numeroTicket || ventaSeleccionada.comprobante || `TCK-000${ventaSeleccionada.idVenta || ventaSeleccionada.id}`}</p>
                <p><span className="font-semibold text-zinc-500">Cliente:</span> {ventaSeleccionada.cliente?.nombre || ventaSeleccionada.nombreCliente || 'Cliente Varios'}</p>
                
                {/* 🔴 AQUÍ agregamos fechaVenta al Modal */}
                <p>
                  <span className="font-semibold text-zinc-500">Fecha:</span> {
                    parsearFechaJava(ventaSeleccionada.fechaVenta || ventaSeleccionada.fecha || ventaSeleccionada.createdAt)?.toLocaleString('es-PE') || 'No registrada'
                  }
                </p>

                <p><span className="font-semibold text-zinc-500">Estado:</span> {ventaSeleccionada.estado === false ? 'Anulada' : 'Completada'}</p>
                
                <div className="border-t border-zinc-800 pt-3 mt-3">
                  <p className="font-semibold text-zinc-500 mb-2">Detalle de productos:</p>
                  {(ventaSeleccionada.detalles || ventaSeleccionada.items || ventaSeleccionada.productos) && (ventaSeleccionada.detalles || ventaSeleccionada.items || ventaSeleccionada.productos).length > 0 ? (
                    <ul className="space-y-1">
                      {(ventaSeleccionada.detalles || ventaSeleccionada.items || ventaSeleccionada.productos).map((det: any, i: number) => (
                        <li key={i} className="flex justify-between">
                          <span>{det.cantidad}x {det.producto?.nombre || det.nombreProducto || 'Artículo'}</span>
                          <span>S/ {(det.subtotal || det.importe || (det.cantidad * (det.precioUnitario || det.precio || 0)) || 0).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-600 italic">No hay detalle de productos registrado.</p>
                  )}
                </div>
                
                <div className="border-t border-zinc-800 pt-3 mt-3 flex justify-between text-lg font-bold text-green-400">
                  <span>Total:</span>
                  <span>S/ {(ventaSeleccionada.total || ventaSeleccionada.montoTotal || ventaSeleccionada.precioTotal || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}