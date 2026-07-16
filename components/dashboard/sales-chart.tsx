"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function SalesChart() {
  const [datosGrafico, setDatosGrafico] = useState<any[]>([])

  useEffect(() => {
    // 🔴 Asegúrate de pegar tu Token más reciente aquí
      const token = localStorage.getItem("token")

    fetch('http://localhost:8080/api/v1/ventas', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(datos => {
        const ventas = datos.content || (Array.isArray(datos) ? datos : [])
        
        // Tomamos los últimos 7 tickets para el gráfico
        const ultimasVentas = ventas.slice(-7).map((v: any, index: number) => ({
          nombre: v.comprobante || `Ticket ${index + 1}`,
          total: v.total || 0
        }))
        
        setDatosGrafico(ultimasVentas)
      })
      .catch(err => console.error("Error cargando ventas para el gráfico:", err))
  }, [])

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Resumen de Ventas</CardTitle>
        <CardDescription>
          Actividad de ingresos de los últimos tickets emitidos.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {datosGrafico.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            Cargando gráfico...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={datosGrafico}>
              <XAxis 
                dataKey="nombre" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `S/${value}`} 
              />
              {/* Tooltip interactivo al pasar el mouse */}
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} 
                contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                formatter={(value: any) => [`S/ ${value.toFixed(2)}`, 'Total']}
              />
              {/* Barras color azul SIVBO con bordes redondeados arriba */}
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}