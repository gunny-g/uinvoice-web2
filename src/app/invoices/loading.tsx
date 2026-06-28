import { Skeleton } from '@/components/ui/skeleton'

import { Container } from '@/components/layout/container'

export default function InvoicesLoading() {
  return (
    <Container size="md" className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </Container>
  )
}
