"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, UserCircle, Mail, Phone, MoreHorizontal } from "lucide-react"
import { useState } from "react"

// 🔥 DATOS ESTÁTICOS DE DEMOSTRACIÓN
const CLIENTES_MOCK = [
  { id: 1, documento: "74582103", tipoDoc: "DNI", nombre: "Carlos Mendoza Silva", correo: "cmendoza@gmail.com", telefono: "987654321", estado: "Activo", tipo: "Frecuente" },
  { id: 2, documento: "20548796321", tipoDoc: "RUC", nombre: "Inversiones El Sol S.A.C.", correo: "compras@elsol.pe", telefono: "01 4587896", estado: "Activo", tipo: "Mayorista" },
  { id: 3, documento: "45879632", tipoDoc: "DNI", nombre: "María Fernanda López", correo: "mafer.lopez@hotmail.com", telefono: "956874123", estado: "Activo", tipo: "Regular" },
  { id: 4, documento: "12345678", tipoDoc: "DNI", nombre: "Cliente Mostrador (Varios)", correo: "-", telefono: "-", estado: "Activo", tipo: "General" },
  { id: 5, documento: "47851236", tipoDoc: "DNI", nombre: "Jorge Luis Paredes", correo: "jparedes99@gmail.com", telefono: "921458753", estado: "Inactivo", tipo: "Regular" },
]

export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState("")

  // Un pequeño filtro visual para que parezca que funciona
  const clientesFiltrados = CLIENTES_MOCK.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.documento.includes(busqueda)
  )

  return (
    <DashboardShell title="Clientes" description="Directorio de clientes y empresas">
      <div className="flex flex-col gap-6 p-6 flex-1 bg-zinc-950 text-zinc-50">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Directorio de Clientes</h1>
            <p className="text-zinc-400 mt-1">Gestiona la información de tus compradores.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
          </Button>
        </div>

        {/* Buscador */}
        <div className="flex items-center gap-4 bg-zinc-900/50 p-4 border border-zinc-800 rounded-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Buscar por nombre, DNI o RUC..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800"
            />
          </div>
          <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
            Filtros Avanzados
          </Button>
        </div>

        {/* Tabla */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead>Cliente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id} className="border-zinc-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-800 p-2 rounded-full">
                        <UserCircle className="h-5 w-5 text-zinc-400" />
                      </div>
                      <span className="font-medium">{cliente.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-zinc-500">{cliente.tipoDoc}: </span>
                    <span className="font-mono">{cliente.documento}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-zinc-400">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {cliente.correo}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {cliente.telefono}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="border-zinc-700">{cliente.tipo}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={cliente.estado === "Activo" ? "default" : "destructive"}>
                      {cliente.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>
  )
}