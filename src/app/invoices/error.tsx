'use client'

import { Button } from '@/components/ui/button'

export default function InvoicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-semibold">
        견적서 목록을 불러올 수 없습니다
      </h2>
      <p className="text-muted-foreground text-sm">{error.message}</p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )
}
