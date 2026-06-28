// 견적서 총금액 요약 박스 컴포넌트 (Server Component)
import { formatCurrency } from '@/lib/utils'

interface InvoiceSummaryProps {
  total: number | null
}

export function InvoiceSummary({ total }: InvoiceSummaryProps) {
  return (
    <div className="flex justify-end">
      <div className="bg-muted/30 w-full max-w-xs rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm">합계</span>
          <span className="text-lg font-bold tabular-nums">
            {total !== null ? formatCurrency(total) : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
