// 견적서 상세 페이지 (Server Component)
import { isFullPage } from '@notionhq/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { InvoiceDetail } from '@/components/invoice/InvoiceDetail'
import { InvoiceItemTable } from '@/components/invoice/InvoiceItemTable'
import { InvoiceSummary } from '@/components/invoice/InvoiceSummary'
import { PrintButton } from '@/components/invoice/PrintButton'
import { Container } from '@/components/layout/container'
import { notion } from '@/lib/notion/client'
import { mapPageToInvoice, mapPageToInvoiceItem } from '@/lib/notion/invoice'
import { getPageById } from '@/lib/notion/queries'

export const revalidate = 300

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // 견적서 페이지 조회 — 없거나 권한 없으면 404
  let page
  try {
    page = await getPageById(id)
  } catch {
    notFound()
  }
  if (!isFullPage(page)) notFound()

  const invoice = mapPageToInvoice(page)

  // 항목 Relation ID → 병렬 개별 조회
  const itemPages = await Promise.all(
    invoice.itemIds.map(itemId => notion.pages.retrieve({ page_id: itemId }))
  )
  const items = itemPages.filter(isFullPage).map(mapPageToInvoiceItem)

  return (
    <Container size="md" className="py-10 print:py-0">
      {/* 내비게이션 및 인쇄 버튼 — 인쇄 시 숨김 */}
      <div className="no-print mb-6 flex items-center justify-between">
        <Link
          href="/invoices"
          className="text-muted-foreground text-sm hover:underline"
        >
          ← 목록으로
        </Link>
        <PrintButton />
      </div>

      {/* 페이지 제목 */}
      <h1 className="no-print mb-6 text-2xl font-bold">견적서 조회</h1>

      {/* 견적서 본문 */}
      <div className="space-y-6">
        {/* 견적서 기본 정보 */}
        <InvoiceDetail invoice={invoice} />

        {/* 견적 항목 테이블 */}
        <InvoiceItemTable items={items} />

        {/* 총금액 요약 */}
        <InvoiceSummary total={invoice.total} />
      </div>
    </Container>
  )
}
