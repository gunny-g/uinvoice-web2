import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">견적서 조회 시스템</h1>
      <p className="text-muted-foreground max-w-md text-center">
        Notion에 등록된 견적서를 웹에서 확인하고 PDF로 저장할 수 있습니다.
      </p>
      <Link
        href="/invoices"
        className="bg-primary text-primary-foreground rounded-md px-6 py-2 transition-opacity hover:opacity-90"
      >
        견적서 목록 보기
      </Link>
    </main>
  )
}
