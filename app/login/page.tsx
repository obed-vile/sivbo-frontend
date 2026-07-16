"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package2 } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        throw new Error("Credenciales incorrectas")
      }

      // LA SOLUCIÓN: Leemos la respuesta como TEXTO, no como JSON
      // ... anterior código de login ...
      const tokenRecibido = await res.text() 
      
      // 1. Guardamos el token en la memoria del navegador
      localStorage.setItem("token", tokenRecibido.replace(/"/g, ''))
      
      // 2. NUEVO: Guardamos el nombre de usuario que escribieron en el formulario
      localStorage.setItem("username", username)
      
      // 3. Redirigimos al sistema
      router.push("/")
      
    } catch (err) {
      console.error(err)
      setError("Usuario o contraseña incorrectos. Inténtalo de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="space-y-2 flex flex-col items-center text-center pb-6">
          <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
            <Package2 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">SIVBO</CardTitle>
          <CardDescription className="text-zinc-400">
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Usuario</label>
              <Input 
                type="text" 
                placeholder="ej. obed.admin" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Contraseña</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-sm text-red-500 text-center font-medium">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
              disabled={cargando}
            >
              {cargando ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}