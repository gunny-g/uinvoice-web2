'use client'

// PDF 저장(인쇄) 버튼 컴포넌트 (Client Component)
// 브라우저 인쇄 다이얼로그를 열어 PDF로 저장할 수 있게 함
import { Printer } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface PrintButtonProps {
  className?: string
}

export function PrintButton({ className }: PrintButtonProps) {
  return (
    // no-print 클래스로 인쇄 시 버튼 자체도 숨김 처리
    <Button
      variant="outline"
      size="sm"
      className={`no-print ${className ?? ''}`}
      onClick={() => window.print()}
      aria-label="PDF로 저장"
    >
      <Printer className="mr-1.5 h-4 w-4" aria-hidden="true" />
      PDF 저장
    </Button>
  )
}
