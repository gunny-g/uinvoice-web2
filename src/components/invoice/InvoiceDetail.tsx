// 견적서 상세 헤더 및 메타 정보 컴포넌트 (Server Component)
import { formatDate } from '@/lib/utils'
import type { Invoice } from '@/types/invoice'

import { StatusBadge } from './StatusBadge'

interface InvoiceDetailProps {
  invoice: Invoice
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const { invoiceNumber, clientName, issueDate, dueDate, status } = invoice

  return (
    <section aria-label="견적서 기본 정보">
      {/* 견적번호 및 상태 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{invoiceNumber}</h1>
        <StatusBadge status={status} />
      </div>

      {/* 메타 정보 그리드 (dl/dt/dd) */}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* 클라이언트명 */}
        <div>
          <dt className="text-muted-foreground text-sm">클라이언트</dt>
          <dd className="mt-1 font-medium">{clientName}</dd>
        </div>

        {/* 발행일 */}
        <div>
          <dt className="text-muted-foreground text-sm">발행일</dt>
          <dd className="mt-1 font-medium">
            {issueDate ? formatDate(issueDate) : '—'}
          </dd>
        </div>

        {/* 유효기간 */}
        <div>
          <dt className="text-muted-foreground text-sm">유효기간</dt>
          <dd className="mt-1 font-medium">
            {dueDate ? formatDate(dueDate) : '—'}
          </dd>
        </div>
      </dl>

      {/* 구분선 */}
      <div className="mt-6 border-t" />
    </section>
  )
}
