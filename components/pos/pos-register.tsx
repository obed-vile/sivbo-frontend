"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import jsPDF from "jspdf"


export function PosRegister() {
  // Estados para manejar los datos
  const [productos, setProductos] = useState<any[]>([])
  const [carrito, setCarrito] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)
  
  // NUEVO: Estado para controlar el ticket flotante
  const [ticketGenerado, setTicketGenerado] = useState<any>(null)



  // 1. Cargar productos al abrir la caja
  useEffect(() => {
  // 🔴 TU TOKEN (Recuerda actualizarlo si caduca)
  const token = localStorage.getItem("token")
    fetch('http://localhost:8080/api/v1/productos', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(datos => {
        // Seguro anti-errores
        setProductos(datos.content || [])
        setCargando(false)
      })
      .catch(err => console.error("Error cargando productos:", err))
  }, [])

  // Filtrar productos por la barra de búsqueda
  const productosFiltrados = useMemo(() => {
    if (!productos) return [] // Seguro anti-errores
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      p.codigoBarras.includes(busqueda)
    )
  }, [productos, busqueda])

  // Lógica del Carrito
  const agregarAlCarrito = (producto: any) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.idProducto === producto.idProducto)
      if (existe) {
        return prev.map(item => 
          item.idProducto === producto.idProducto 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const cambiarCantidad = (id: number, delta: number) => {
    setCarrito(prev => prev.map(item => {
      if (item.idProducto === id) {
        const nuevaCantidad = Math.max(1, item.cantidad + delta)
        return { ...item, cantidad: nuevaCantidad }
      }
      return item
    }))
  }

  const eliminarDelCarrito = (id: number) => {
    setCarrito(prev => prev.filter(item => item.idProducto !== id))
  }

  const totalCarrito = carrito.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0)

  // 2. Procesar la venta enviando el POST al backend
  const finalizarVenta = () => {
    if (carrito.length === 0) return
    setProcesando(true)
    
    // 🔥 SOLUCIÓN: Leemos el token justo aquí, antes de usarlo
    const token = localStorage.getItem("token")

    // Armamos el JSON tal como lo espera tu backend
    const ventaRequest = {
      idUsuario: 1, // ID de obed.admin
      comprobante: `TCK-${Math.floor(Math.random() * 1000000)}`,
      items: carrito.map(item => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad
      }))
    }

    fetch('http://localhost:8080/api/v1/ventas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // <-- Ahora sí existe esta variable
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ventaRequest)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al registrar la venta")
        
        // Armamos los datos para el ticket visual
        const datosTicket = {
          comprobante: ventaRequest.comprobante,
          fecha: new Date().toLocaleString('es-PE'),
          items: [...carrito],
          total: totalCarrito
        }
        
        setTicketGenerado(datosTicket) // Muestra el modal del ticket
        setCarrito([]) // Vaciamos el carrito
        setProcesando(false)
      })
      .catch(err => {
        alert("Hubo un problema al procesar la venta.")
        console.error(err)
        setProcesando(false)
      })
  }

  // 3. Función para descargar el PDF (Dibujado directamente, sin html2canvas)
  const descargarPDF = () => {
    // Creamos un PDF del tamaño de una ticketera térmica (80mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150] 
    })
    
    // Configuramos la fuente clásica de los tickets (Courier monoespaciada)
    let y = 10; // Variable para controlar la altura (empieza a 10mm del borde)
    
    // ENCABEZADO
    pdf.setFont("courier", "bold")
    pdf.setFontSize(12)
    pdf.text("SIVBO BODEGA", 40, y, { align: "center" }); y += 5;
    
    pdf.setFont("courier", "normal")
    pdf.setFontSize(9)
    pdf.text("RUC: 20123456789", 40, y, { align: "center" }); y += 4;
    pdf.text(`Ticket: ${ticketGenerado.comprobante}`, 40, y, { align: "center" }); y += 4;
    pdf.text(ticketGenerado.fecha, 40, y, { align: "center" }); y += 6;
    
    pdf.text("--------------------------------", 40, y, { align: "center" }); y += 6;
    
    // LISTA DE PRODUCTOS
    ticketGenerado.items.forEach((item: any) => {
      const nombre = item.nombre.substring(0, 15);
      const cant = item.cantidad.toString();
      const subtotal = (item.cantidad * item.precioUnitario).toFixed(2);
      
      pdf.text(`${cant}x ${nombre}`, 5, y);
      pdf.text(`S/ ${subtotal}`, 75, y, { align: "right" });
      y += 5;
    })
    
    pdf.text("--------------------------------", 40, y, { align: "center" }); y += 6;
    
    // TOTAL A PAGAR
    pdf.setFont("courier", "bold")
    pdf.setFontSize(10)
    pdf.text("TOTAL PAGADO:", 5, y);
    pdf.text(`S/ ${ticketGenerado.total.toFixed(2)}`, 75, y, { align: "right" });
    y += 6;
    
    // PIE DE PÁGINA
    pdf.setFont("courier", "normal")
    pdf.setFontSize(9)
    pdf.text("--------------------------------", 40, y, { align: "center" }); y += 6;
    pdf.text("¡Gracias por su compra!", 40, y, { align: "center" });
    
    // Guardar el PDF automáticamente
    pdf.save(`Boleta_SIVBO_${ticketGenerado.comprobante}.pdf`)
  }

  // 4. Función para cerrar el modal y recargar productos
  const cerrarTicket = () => {
    setTicketGenerado(null)
    window.location.reload() // Recarga la página para ver el nuevo stock
  }

  if (cargando) return <div className="p-8 text-center">Cargando terminal POS...</div>

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        
        {/* PANEL IZQUIERDO: Lista de Productos */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input 
              placeholder="Buscar por nombre o código de barras..." 
              className="pl-9"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {productosFiltrados.map(prod => (
              <Card 
                key={prod.idProducto} 
                className="p-4 cursor-pointer hover:border-primary transition-colors flex flex-col justify-between h-32"
                onClick={() => agregarAlCarrito(prod)}
              >
                <div>
                  <p className="font-semibold text-sm line-clamp-2">{prod.nombre}</p>
                  <p className="text-xs text-muted-foreground mt-1">Stock: {prod.stock}</p>
                </div>
                <p className="font-bold text-primary text-lg">S/ {prod.precioUnitario?.toFixed(2)}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO: El Carrito de Compras */}
        <Card className="flex flex-col h-[600px]">
          <div className="p-4 border-b bg-muted/50 flex items-center gap-2">
            <ShoppingCart className="size-5" />
            <h2 className="font-bold text-lg">Carrito Actual</h2>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {carrito.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No hay productos en el carrito
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {carrito.map(item => (
                  <div key={item.idProducto} className="flex items-center justify-between gap-2 border-b pb-4 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.nombre}</p>
                      <p className="text-primary font-semibold">S/ {(item.precioUnitario * item.cantidad).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="size-7" onClick={() => cambiarCantidad(item.idProducto, -1)}>
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-4 text-center text-sm">{item.cantidad}</span>
                      <Button variant="outline" size="icon" className="size-7" onClick={() => cambiarCantidad(item.idProducto, 1)}>
                        <Plus className="size-3" />
                      </Button>
                      <Button variant="destructive" size="icon" className="size-7 ml-2" onClick={() => eliminarDelCarrito(item.idProducto)}>
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-muted/20">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-2xl text-primary">S/ {totalCarrito.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full text-lg h-12" 
              size="lg" 
              disabled={carrito.length === 0 || procesando}
              onClick={finalizarVenta}
            >
              {procesando ? "Procesando..." : "Cobrar y Emitir Ticket"}
            </Button>
          </div>
        </Card>
      </div>

      {/* MODAL DEL TICKET GENERADO */}
      {ticketGenerado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-80 font-mono text-sm text-black relative">
            
            {/* Este div interno es el que se convierte a PDF */}
            <div id="ticket-imprimir" className="bg-white px-4 py-2">
              <div className="text-center mb-4">
                <h3 className="font-bold text-xl uppercase">SIVBO Bodega</h3>
                <p className="text-xs mt-1">RUC: 20123456789</p>
                <p className="text-xs">Ticket: {ticketGenerado.comprobante}</p>
                <p className="text-xs">{ticketGenerado.fecha}</p>
                <p className="mt-2 text-gray-400">--------------------------------</p>
              </div>
              
              <div className="mb-4 min-h-[100px]">
                {ticketGenerado.items.map((item: any) => (
                  <div key={item.idProducto} className="flex justify-between text-xs mb-1">
                    <span>{item.cantidad}x {item.nombre.substring(0, 15)}</span>
                    <span>S/ {(item.cantidad * item.precioUnitario).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center mb-2">
                <p className="text-gray-400">--------------------------------</p>
                <div className="flex justify-between font-bold text-base my-1">
                  <span>TOTAL PAGADO:</span>
                  <span>S/ {ticketGenerado.total.toFixed(2)}</span>
                </div>
                <p className="text-gray-400">--------------------------------</p>
                <p className="text-xs mt-3 font-semibold">¡Gracias por su compra!</p>
              </div>
            </div>
            
            {/* Botones de acción (No salen en el PDF) */}
            <div className="flex flex-col gap-2 mt-6">
              <Button 
                onClick={descargarPDF} 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-sans"
              >
                Descargar PDF
              </Button>
              <Button 
                onClick={cerrarTicket} 
                variant="outline" 
                className="w-full font-sans border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Nueva Venta
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}