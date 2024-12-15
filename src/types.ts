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
  paymentMethod: 'cash' | 'payconiq' | 'promo'
  paymentAmount: number
  payment?: PayconiqPayment
  member?: string
  transactionItems: ReceiptItem[]
}

export type Tabs = Tab[]

export interface Tab {
  key?: string
  name: string
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
  date: string
  cashDifferenceCheckout?: number
  cashStartCheckout: number
  cashTransferCheckout?: number
  cashKantine?: number
  cashWinkel?: number
  cashLidgeld?: number
  payconiqKantine?: number
  payconiqWinkel?: number
  payconiqLidgeld?: number
  cashVaultCheckout: number
  cashBank?: number
  transferDescription?: string
  transferDirection?: string
  transferAmount?: number
  user?: string
  transactions?: Transaction[]
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

export type User = {
  member?: string
  email: string
  key: string
  roles?: string[]
}

export type Member = {
  key?: string
  userphotoURL: string
  userphotobgURL: string
  name: string
  lastname: string
  group: string
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
  paydate?: string
  status?: string
  extra?: string
}
export type Members = Member[]

export type PayconiqPaymentLink = {
  href: string
}

export type PayConiqPaymentStatus =
  | 'PENDING'
  | 'IDENTIFIED'
  | 'CANCELLED'
  | 'AUTHORIZED'
  | 'AUTHORIZATION_FAILED'
  | 'EXPIRED'
  | 'FAILED'
  | 'SUCCEEDED'

export type PayconiqPayment = {
  amount: number
  createdAt: string
  creditor: { profileId: string; merchantId: string; name: string; iban: string }
  currency: string
  description: string
  expiresAt: string
  paymentId: string
  status: PayConiqPaymentStatus
  _links: {
    cancel: PayconiqPaymentLink
    deeplink: PayconiqPaymentLink
    qrcode: PayconiqPaymentLink
    self: PayconiqPaymentLink
  }
}

export type Notification = {
  title: string
  description: string
  image?: string
  actions?: any[]
}

export type PropertyProviderEvents = {
  onChildChanged: (val) => void
  onChildRemoved: (val) => void
  onChildAdded: (val) => void
}
export interface File {
  title: string
  group: string
  fileURL: string
}
