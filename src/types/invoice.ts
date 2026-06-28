export type InvoiceStatus = '대기' | '승인' | '거절'

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  issueDate: string | null
  dueDate: string | null
  status: InvoiceStatus | null
  total: number | null
  itemIds: string[]
}

export interface InvoiceItem {
  id: string
  name: string
  quantity: number | null
  unitPrice: number | null
  amount: number | null
}
