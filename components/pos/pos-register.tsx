"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  ScanLine,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { products, formatCurrency, type Product } from "@/lib/data"

type CartItem = { product: Product; qty: number }

const TAX_RATE = 0.16

export function PosRegister() {
  const [query, setQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])

  const available = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter((p) => p.active)
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.barcode.includes(q),
      )
  }, [query])

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  function changeQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === id ? { ...i, qty: i.qty + delta } : i,
        )
        .filter((i) => i.qty > 0),
    )
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== id))
  }

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Left: product catalog */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 lg:w-[70%]">
        <div className="relative">
          <ScanLine className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escanear código de barras o buscar producto..."
            className="h-12 pl-11 text-base"
            aria-label="Buscar producto"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {available.map((p) => (
            <Card
              key={p.id}
              className="flex flex-col justify-between gap-3 p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-col gap-1">
                <span className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
                  {p.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {p.barcode}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-semibold text-foreground">
                  {formatCurrency(p.price)}
                </span>
                <Button
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={() => addToCart(p)}
                  aria-label={`Agregar ${p.name}`}
                >
                  <Plus className="size-4.5" />
                </Button>
              </div>
            </Card>
          ))}
          {available.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
              No se encontraron productos para &ldquo;{query}&rdquo;.
            </div>
          ) : null}
        </div>
      </div>

      {/* Right: current order */}
      <div className="lg:w-[30%]">
        <Card className="flex h-full flex-col overflow-hidden p-0 lg:sticky lg:top-22">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="size-5 text-foreground" />
              <h2 className="text-base font-semibold text-foreground">
                Orden Actual
              </h2>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {itemCount} art.
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ShoppingCart className="size-6" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Carrito vacío
                </p>
                <p className="text-xs text-muted-foreground">
                  Agrega productos para iniciar la venta
                </p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {cart.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex items-start gap-3 border-b border-border px-5 py-3"
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(item.product.price)} c/u
                      </span>
                      <div className="mt-2 flex items-center gap-1.5">
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-7"
                          onClick={() => changeQty(item.product.id, -1)}
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="w-7 text-center text-sm font-medium tabular-nums text-foreground">
                          {item.qty}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-7"
                          onClick={() => changeQty(item.product.id, 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="size-3.5" />
                        </Button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="ml-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Quitar ${item.product.name}`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(item.product.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-border p-5">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Impuestos (16%)</span>
                <span className="tabular-nums">{formatCurrency(tax)}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex items-end justify-between">
                <span className="text-sm font-medium text-foreground">
                  Total
                </span>
                <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
            <Button
              size="lg"
              className="mt-4 h-12 w-full gap-2 text-base"
              disabled={cart.length === 0}
            >
              <CreditCard className="size-5" />
              Cobrar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
