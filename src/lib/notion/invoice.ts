import type { PageObjectResponse } from '@notionhq/client'

import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/invoice'
import {
  extractDate,
  extractFormula,
  extractNumber,
  extractRelation,
  extractRichText,
  extractStatus,
  extractTitle,
} from './transformers'

const VALID_STATUSES: InvoiceStatus[] = ['대기', '승인', '거절']

export function mapPageToInvoice(page: PageObjectResponse): Invoice {
  const props = page.properties
  const rawStatus = extractStatus(props['상태'])

  return {
    id: page.id,
    invoiceNumber: extractTitle(props['견적서 번호']),
    clientName: extractRichText(props['클라이언트명']),
    issueDate: extractDate(props['발행일']),
    dueDate: extractDate(props['유효기간']),
    status: VALID_STATUSES.includes(rawStatus as InvoiceStatus)
      ? (rawStatus as InvoiceStatus)
      : null,
    total: extractFormula(props['총금액']),
    itemIds: extractRelation(props['항목']),
  }
}

export function mapPageToInvoiceItem(page: PageObjectResponse): InvoiceItem {
  const props = page.properties

  return {
    id: page.id,
    name: extractTitle(props['항목명']),
    quantity: extractNumber(props['수량']),
    unitPrice: extractNumber(props['단가']),
    amount: extractFormula(props['금액']),
  }
}
