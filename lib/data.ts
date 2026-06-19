export type Product = {
  id: string
  barcode: string
  name: string
  description: string
  price: number
  stock: number
  minStock: number
  active: boolean
}

export const products: Product[] = [
  {
    id: "p1",
    barcode: "7501031311309",
    name: "Café Molido Premium 500g",
    description: "Tueste medio, origen Chiapas",
    price: 8.5,
    stock: 4,
    minStock: 12,
    active: true,
  },
  {
    id: "p2",
    barcode: "7501055300013",
    name: "Leche Entera 1L",
    description: "Ultrapasteurizada, caja 12u",
    price: 1.25,
    stock: 6,
    minStock: 20,
    active: true,
  },
  {
    id: "p3",
    barcode: "7501008042021",
    name: "Galletas de Chocolate",
    description: "Paquete familiar 300g",
    price: 2.4,
    stock: 48,
    minStock: 15,
    active: true,
  },
  {
    id: "p4",
    barcode: "7501000910013",
    name: "Agua Mineral 600ml",
    description: "Sin gas, botella PET",
    price: 0.95,
    stock: 3,
    minStock: 24,
    active: true,
  },
  {
    id: "p5",
    barcode: "7501030400019",
    name: "Aceite Vegetal 900ml",
    description: "100% puro de canola",
    price: 3.75,
    stock: 32,
    minStock: 10,
    active: true,
  },
  {
    id: "p6",
    barcode: "7501045405013",
    name: "Arroz Blanco 1kg",
    description: "Grano largo, calidad extra",
    price: 1.8,
    stock: 9,
    minStock: 18,
    active: true,
  },
  {
    id: "p7",
    barcode: "7501020512309",
    name: "Detergente Líquido 2L",
    description: "Concentrado, 40 lavados",
    price: 6.2,
    stock: 21,
    minStock: 8,
    active: true,
  },
  {
    id: "p8",
    barcode: "7501077210011",
    name: "Atún en Agua 140g",
    description: "Lomo en trozos, lata",
    price: 1.5,
    stock: 60,
    minStock: 20,
    active: true,
  },
  {
    id: "p9",
    barcode: "7501099111027",
    name: "Pan de Caja Integral",
    description: "680g, 30 rebanadas",
    price: 2.1,
    stock: 5,
    minStock: 14,
    active: true,
  },
  {
    id: "p10",
    barcode: "7501066600015",
    name: "Refresco Cola 2L",
    description: "Botella retornable",
    price: 1.65,
    stock: 40,
    minStock: 16,
    active: true,
  },
  {
    id: "p11",
    barcode: "7501033301228",
    name: "Jabón de Tocador 3pz",
    description: "Aroma lavanda, 110g c/u",
    price: 2.95,
    stock: 18,
    minStock: 10,
    active: false,
  },
  {
    id: "p12",
    barcode: "7501088504019",
    name: "Huevo Blanco 18pz",
    description: "Caja de cartón refrigerada",
    price: 3.4,
    stock: 7,
    minStock: 12,
    active: true,
  },
]

export const lowStockProducts = products.filter((p) => p.stock < p.minStock)

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
  }).format(value)
}
