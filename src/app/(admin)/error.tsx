'use client'

import { Button } from '@/components/ui/button'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-semibold">오류가 발생했습니다</h2>
      <p className="text-muted-foreground text-sm">{error.message}</p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )
}
