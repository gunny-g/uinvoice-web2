import { isFullPage } from '@notionhq/client'
import { FileText } from 'lucide-react'
import Link from 'next/link'

import { CopyLinkButton } from '@/components/admin/CopyLinkButton'
import { StatusBadge } from '@/components/invoice/StatusBadge'
import { Container } from '@/components/layout/container'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { env } from '@/lib/env'
import { mapPageToInvoice } from '@/lib/notion/invoice'
import { queryDatabase } from '@/lib/notion/queries'
import { formatCurrency, formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function AdminInvoicesPage() {
  const response = await queryDatabase(env.NOTION_DATABASE_ID, {
    sorts: [{ property: '발행일', direction: 'descending' }],
  })

  const invoices = response.results.filter(isFullPage).map(mapPageToInvoice)

  return (
    <Container size="lg" className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">견적서 목록</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          총 {invoices.length}건
        </p>
      </div>

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
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">견적서번호</TableHead>
                <TableHead>클라이언트</TableHead>
                <TableHead className="w-28">발행일</TableHead>
                <TableHead className="w-20">상태</TableHead>
                <TableHead className="w-32 text-right">금액</TableHead>
                <TableHead className="w-12 text-center">복사</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-medium">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {invoice.clientName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {invoice.issueDate ? formatDate(invoice.issueDate) : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {invoice.total !== null
                      ? formatCurrency(invoice.total)
                      : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    <CopyLinkButton invoiceId={invoice.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Container>
  )
}
