export type Product = {
  name: string
  vat: number
  price: number
  category: string
  key: string
  description?: string
}

export type Products = Product[]

export interface ReceiptItem extends Product {
  amount: number
}

export type Transactions = Transactions[]

export interface Transaction {
  key?: string;
  paymentMethod: 'cash' | 'payconiq';
  paymentAmount: number;
  transactionItems: ReceiptItem[] 
}