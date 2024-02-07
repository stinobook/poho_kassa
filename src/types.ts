export type Product = {
  name: string
  vat: number
  price: number
  category: string
  id: string
  key?: string
}

export type Products = Product[]

export interface ReceiptItem extends Product {
  amount: number
}
