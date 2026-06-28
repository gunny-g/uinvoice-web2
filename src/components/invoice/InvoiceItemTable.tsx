// 견적 항목 테이블 컴포넌트 (Server Component)
import { FileText } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import type { InvoiceItem } from '@/types/invoice'

interface InvoiceItemTableProps {
  items: InvoiceItem[]
}

export function InvoiceItemTable({ items }: InvoiceItemTableProps) {
  // 견적 항목이 없을 때 빈 상태 UI
  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-lg border py-12 text-center"
        role="status"
        aria-label="견적 항목 없음"
      >
        <FileText
          className="text-muted-foreground/50 mb-3 h-10 w-10"
          aria-hidden="true"
        />
        <p className="text-muted-foreground text-sm">견적 항목이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>품명</TableHead>
            <TableHead className="w-24 text-right">수량</TableHead>
            <TableHead className="w-36 text-right">단가</TableHead>
            <TableHead className="w-36 text-right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              {/* 품명 */}
              <TableCell className="font-medium">{item.name}</TableCell>

              {/* 수량 — 오른쪽 정렬, 고정폭 숫자 */}
              <TableCell className="text-right tabular-nums">
                {item.quantity !== null ? item.quantity : '—'}
              </TableCell>

              {/* 단가 — 오른쪽 정렬 */}
              <TableCell className="text-right tabular-nums">
                {item.unitPrice !== null ? formatCurrency(item.unitPrice) : '—'}
              </TableCell>

              {/* 금액 — 오른쪽 정렬 */}
              <TableCell className="text-right font-medium tabular-nums">
                {item.amount !== null ? formatCurrency(item.amount) : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
