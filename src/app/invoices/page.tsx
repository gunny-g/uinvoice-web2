// 견적서 목록 페이지 (Server Component)
import { isFullPage } from '@notionhq/client'
import { FileText } from 'lucide-react'
import Link from 'next/link'

import { InvoiceCard } from '@/components/invoice/InvoiceCard'
import { Container } from '@/components/layout/container'
import { env } from '@/lib/env'
import { mapPageToInvoice } from '@/lib/notion/invoice'
import { queryDatabase } from '@/lib/notion/queries'

export const revalidate = 60

export default async function InvoicesPage() {
  const response = await queryDatabase(env.NOTION_DATABASE_ID, {
    sorts: [{ property: '발행일', direction: 'descending' }],
  })

  const invoices = response.results.filter(isFullPage).map(mapPageToInvoice)

  return (
    <Container size="md" className="py-10">
      {/* 페이지 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">견적서 목록</h1>
        <Link
          href="/"
          className="text-muted-foreground text-sm hover:underline"
        >
          ← 홈으로
        </Link>
      </div>

      {/* 목록이 비었을 때 빈 상태 UI */}
      {invoices.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-lg border py-16 text-center"
          role="status"
          aria-label="견적서 없음"
        >
          <FileText
            className="text-muted-foreground/50 mb-3 h-12 w-12"
            aria-hidden="true"
          />
          <p className="font-medium">아직 견적서가 없습니다.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Notion에서 견적서를 추가하면 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <div>
          {/* 데스크톱 컬럼 헤더 — sm 이상에서만 표시 */}
          <div
            className="mb-2 hidden items-center gap-3 px-4 sm:flex"
            aria-hidden="true"
          >
            <span className="text-muted-foreground w-32 shrink-0 text-xs font-medium">
              견적번호
            </span>
            <span className="text-muted-foreground flex-1 text-xs font-medium">
              클라이언트
            </span>
            <span className="text-muted-foreground w-24 shrink-0 text-xs font-medium">
              발행일
            </span>
            <span className="text-muted-foreground text-xs font-medium">
              상태
            </span>
            <span className="text-muted-foreground w-28 shrink-0 text-right text-xs font-medium">
              금액
            </span>
          </div>

          {/* 견적서 카드 목록 */}
          <ul className="space-y-2" aria-label="견적서 목록">
            {invoices.map(invoice => (
              <li key={invoice.id}>
                <InvoiceCard invoice={invoice} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  )
}
