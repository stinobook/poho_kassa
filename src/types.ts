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

export type Transactions = Transaction[]

export interface Transaction {
  key?: string
  paymentMethod: 'cash' | 'payconiq'
  paymentAmount: number
  transactionItems: ReceiptItem[]
}

export interface Cashtotal {
  '100'?: number
  '50'?: number
  '20'?: number
  '10'?: number
  '5'?: number
  '2'?: number
  '1'?: number
  '0.50'?: number
  '0.20'?: number
  '0.10'?: number
  '0.05'?: number
}
export interface Sales extends Transaction {
  key?: string
  date: EpochTimeStamp
  cashDifferenceCheckout: number
  cashStartCheckout: number
  cashTransferCheckout: number
  cashKantine: number
  cashWinkel: number
  cashLidgeld: number
  payconiqKantine: number
  payconiqWinkel: number
  payconiqLidgeld: number
  transactions: Transactions[]
}

export type Evenement = {
  name: string
  description?: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  adjustments: { [category: string]: number }
  key: string
}

export enum Group {
  Bestuur, Instructeurs, Leden
}

export type Member = {
  key?: string
  userphotoURL: string
  userphotobgURL: string
  name: string
  lastname: string
  group: Group
  title: string
  birthday?: string
  street?: string
  community?: string
  postalcode?: number
  phone?: number
  email?: string
  dogname?: string
  dograce?: string
  pedigree?: string
  chipnumber?: string
}
export type Members = Member[]