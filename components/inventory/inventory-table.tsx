"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, X } from "lucide-react"

export function InventoryTable() {
  const [productos, setProductos] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [esAdmin, setEsAdmin] = useState(false)

  // Estados para el Modal
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  
  // Estado del Formulario
  const [formData, setFormData] = useState({
    idProducto: null,
    codigoBarras: "",
    nombre: "",
    descripcion: "",
    precioUnitario: 0,
    stock: 0,
    stockMinimo: 10, // 🔥 Iniciamos por defecto en 10
    estado: true
  })

  // Función para cargar los datos
  const cargarInventario = () => {
    const token = localStorage.getItem("token")
    fetch('http://localhost:8080/api/v1/productos', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error("Acceso denegado");
        return res.json();
      })
      .then(datos => {
        if (datos.content) setProductos(datos.content)
        else if (Array.isArray(datos)) setProductos(datos)
        else setProductos([])
        setCargando(false)
      })
      .catch(err => {
        console.error(err)
        setCargando(false)
      })
  }

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("username") || ""
    if (usuarioGuardado.toLowerCase().includes("admin")) {
      setEsAdmin(true)
    }
    cargarInventario()
  }, [])

  // --- CONTROLADORES DEL MODAL ---
  const abrirModalCrear = () => {
    // 🔥 Al crear uno nuevo, le clavamos el 10 directamente
    setFormData({ idProducto: null, codigoBarras: "", nombre: "", descripcion: "", precioUnitario: 0, stock: 0, stockMinimo: 10, estado: true })
    setModoEdicion(false)
    setModalAbierto(true)
  }

  const abrirModalEditar = (prod: any) => {
    // 🔥 Usamos ?? 10 para que, si el backend manda null, le ponga 10 automáticamente
    setFormData({ 
      ...prod,
      precioUnitario: prod.precioUnitario || 0,
      stock: prod.stock || 0,
      stockMinimo: prod.stockMinimo ?? 10 
    })
    setModoEdicion(true)
    setModalAbierto(true)
  }

  const cerrarModal = () => setModalAbierto(false)

  // --- LÓGICA CRUD ---
  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    const id = formData.idProducto;
    
    const url = modoEdicion 
      ? `http://localhost:8080/api/v1/productos/${id}` 
      : 'http://localhost:8080/api/v1/productos'
      
    const metodo = modoEdicion ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        cerrarModal()
        cargarInventario()
      } else {
        const errorReal = await res.text()
        alert(`Fallo en Spring Boot (Código ${res.status}): \n\n${errorReal}`)
      }
    } catch (error) {
      alert("Error de conexión con el servidor.")
    }
  }

  const eliminarProducto = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:8080/api/v1/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (res.ok) cargarInventario()
      else alert("Error al eliminar el producto")
    } catch (error) {
      console.error(error)
    }
  }

  if (cargando) return <div className="p-4 text-center text-muted-foreground">Cargando inventario...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold tracking-tight">Catálogo de Artículos</h2>
        {esAdmin && (
          <Button onClick={abrirModalCrear} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Producto
          </Button>
        )}
      </div>

      <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800">
              <TableHead>Cód. Barras</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              {esAdmin && <TableHead className="text-center">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos?.map((prod) => (
              <TableRow key={prod.idProducto} className="border-zinc-800">
                <TableCell className="font-medium">{prod.codigoBarras}</TableCell>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell className="text-zinc-400">{prod.descripcion}</TableCell>
                <TableCell className="text-right">S/ {(prod.precioUnitario || 0).toFixed(2)}</TableCell>
                <TableCell className={`text-right font-bold ${prod.stock <= prod.stockMinimo ? 'text-red-500' : 'text-green-500'}`}>
                  {prod.stock}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={prod.estado ? "default" : "destructive"}>
                    {prod.estado ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                
                {esAdmin && (
                  <TableCell className="text-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => abrirModalEditar(prod)} className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => eliminarProducto(prod.idProducto)} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{modoEdicion ? "Editar Producto" : "Nuevo Producto"}</h3>
              <Button variant="ghost" size="icon" onClick={cerrarModal} className="h-8 w-8 text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={guardarProducto} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-300">Código de Barras</label>
                <Input value={formData.codigoBarras} onChange={e => setFormData({...formData, codigoBarras: e.target.value})} className="bg-zinc-900 border-zinc-800 mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Nombre</label>
                <Input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="bg-zinc-900 border-zinc-800 mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Descripción</label>
                <Input value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="bg-zinc-900 border-zinc-800 mt-1" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300">Precio (S/)</label>
                  <Input type="number" step="0.01" value={formData.precioUnitario} onChange={e => setFormData({...formData, precioUnitario: parseFloat(e.target.value) || 0})} className="bg-zinc-900 border-zinc-800 mt-1" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300">Stock</label>
                  <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} className="bg-zinc-900 border-zinc-800 mt-1" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300">Stock Mín.</label>
                  {/* El campo se inicializa en 10, pero se puede borrar y cambiar a otro número si desean */}
                  <Input type="number" value={formData.stockMinimo} onChange={e => setFormData({...formData, stockMinimo: parseInt(e.target.value) || 0})} className="bg-zinc-900 border-zinc-800 mt-1" required />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6">
                {modoEdicion ? "Guardar Cambios" : "Crear Producto"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}