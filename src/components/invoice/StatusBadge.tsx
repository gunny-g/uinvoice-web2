// 견적서 상태를 나타내는 배지 컴포넌트
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { InvoiceStatus } from '@/types/invoice'

interface StatusBadgeProps {
  status: InvoiceStatus | null
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // 상태 없음 — outline 배지
  if (status === null) {
    return (
      <Badge variant="outline" className={className}>
        미설정
      </Badge>
    )
  }

  // 거절 — destructive variant
  if (status === '거절') {
    return (
      <Badge variant="destructive" className={className}>
        거절
      </Badge>
    )
  }

  // 승인 — 초록색 커스텀 클래스
  if (status === '승인') {
    return (
      <Badge
        className={cn(
          'border-green-200 bg-green-100 text-green-800',
          'dark:border-green-800 dark:bg-green-900/30 dark:text-green-300',
          className
        )}
      >
        승인
      </Badge>
    )
  }

  // 대기 — 노란색 커스텀 클래스
  return (
    <Badge
      className={cn(
        'border-yellow-200 bg-yellow-100 text-yellow-800',
        'dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        className
      )}
    >
      대기
    </Badge>
  )
}
