import Link from 'next/link'

export default function InvoiceNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-semibold">견적서를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground text-sm">
        요청하신 견적서가 존재하지 않거나 접근할 수 없습니다.
      </p>
      <Link href="/invoices" className="text-primary text-sm hover:underline">
        목록으로 돌아가기
      </Link>
    </div>
  )
}
