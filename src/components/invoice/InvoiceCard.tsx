// 견적서 목록의 단일 항목 카드 컴포넌트 (Server Component)
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice } from '@/types/invoice'

import { StatusBadge } from './StatusBadge'

interface InvoiceCardProps {
  invoice: Invoice
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const { id, invoiceNumber, clientName, issueDate, status, total } = invoice

  return (
    <Link
      href={`/invoices/${id}`}
      aria-label={`견적서 ${invoiceNumber} 상세보기`}
    >
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border px-4 py-3',
          'hover:bg-accent transition-colors',
          'cursor-pointer'
        )}
      >
        {/* 견적번호 — 고정 너비 */}
        <span className="w-32 shrink-0 font-mono text-sm font-medium">
          {invoiceNumber}
        </span>

        {/* 클라이언트명 — sm 이상에서만 표시, 남은 공간 차지 */}
        <span className="hidden flex-1 truncate font-medium sm:block">
          {clientName}
        </span>

        {/* 발행일 — sm 이상에서만 표시 */}
        <span className="text-muted-foreground hidden w-24 shrink-0 text-sm sm:block">
          {issueDate ? formatDate(issueDate) : '—'}
        </span>

        {/* 상태 배지 */}
        <StatusBadge status={status} />

        {/* 총금액 — 고정 너비 + 오른쪽 정렬 (null일 때 레이아웃 밀림 방지) */}
        <span className="w-28 shrink-0 text-right font-semibold tabular-nums">
          {total !== null ? formatCurrency(total) : '—'}
        </span>
      </div>
    </Link>
  )
}
