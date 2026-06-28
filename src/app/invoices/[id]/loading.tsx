import { Skeleton } from '@/components/ui/skeleton'

import { Container } from '@/components/layout/container'

export default function InvoiceDetailLoading() {
  return (
    <Container size="md" className="py-10">
      <Skeleton className="mb-6 h-4 w-20" />
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <Skeleton className="ml-auto h-24 w-64" />
      </div>
    </Container>
  )
}
