# Task 006: Notion 매핑 레이어 및 목록 페이지 실데이터 연동

## 개요

`mapPageToInvoice` 함수를 구현하고, 목록 페이지(`/invoices`)를 더미 데이터에서
Notion 실데이터로 교체합니다. ISR 60초가 이미 설정되어 있으며 이를 유지합니다.

## 관련 파일

- `src/lib/notion/invoice.ts` (수정 — `mapPageToInvoice` 구현)
- `src/app/invoices/page.tsx` (수정 — MOCK_INVOICES → queryDatabase)

> `src/lib/mock/invoices.ts`는 Task 007에서 상세 페이지 연동 후 한꺼번에 삭제합니다.

## 의존성

Task 005 완료 후 진행 (완료됨)

## Notion DB 스키마 (PRD 기준)

| Notion 컬럼    | 프로퍼티 타입 | Invoice 필드    | 추출 함수         |
| -------------- | ------------- | --------------- | ----------------- |
| `견적서 번호`  | Title         | `invoiceNumber` | `extractTitle`    |
| `클라이언트명` | Rich Text     | `clientName`    | `extractRichText` |
| `발행일`       | Date          | `issueDate`     | `extractDate`     |
| `유효기간`     | Date          | `dueDate`       | `extractDate`     |
| `상태`         | Select        | `status`        | `extractSelect`   |
| `총금액`       | Number        | `total`         | `extractNumber`   |
| `항목`         | Relation      | `itemIds`       | `extractRelation` |

## 수락 기준

- [ ] `mapPageToInvoice` 가 `PageObjectResponse` → `Invoice` 타입을 올바르게 변환
- [ ] `status` 필드가 `InvoiceStatus` 유니온(`'대기' | '승인' | '거절'`) 또는 `null`로만 들어옴
- [ ] 목록 페이지가 Notion DB를 발행일 내림차순으로 조회하여 렌더링
- [ ] 빈 목록일 때 "아직 견적서가 없습니다." 빈 상태 UI 정상 표시
- [ ] `npm run check-all` 통과

## 구현 단계

- [ ] **Step 1**: `src/lib/notion/invoice.ts` — `mapPageToInvoice` 구현

  ```ts
  import { isFullPage } from '@notionhq/client'
  import type { PageObjectResponse } from '@notionhq/client'
  import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/invoice'
  import {
    extractTitle,
    extractRichText,
    extractDate,
    extractSelect,
    extractNumber,
    extractRelation,
    extractFormula,
  } from './transformers'

  const VALID_STATUSES: InvoiceStatus[] = ['대기', '승인', '거절']

  export function mapPageToInvoice(page: PageObjectResponse): Invoice {
    const props = page.properties
    const rawStatus = extractSelect(props['상태'])

    return {
      id: page.id,
      invoiceNumber: extractTitle(props['견적서 번호']),
      clientName: extractRichText(props['클라이언트명']),
      issueDate: extractDate(props['발행일']),
      dueDate: extractDate(props['유효기간']),
      status: VALID_STATUSES.includes(rawStatus as InvoiceStatus)
        ? (rawStatus as InvoiceStatus)
        : null,
      total: extractNumber(props['총금액']),
      itemIds: extractRelation(props['항목']),
    }
  }
  ```

  - `mapPageToInvoiceItem` 스텁은 Task 007 표시를 유지하며 그대로 둠

- [ ] **Step 2**: `src/app/invoices/page.tsx` — Notion 실데이터 연동

  ```ts
  import { isFullPage } from '@notionhq/client'
  import { queryDatabase } from '@/lib/notion/queries'
  import { mapPageToInvoice } from '@/lib/notion/invoice'
  import { env } from '@/lib/env'

  export const revalidate = 60

  export default async function InvoicesPage() {
    const response = await queryDatabase(env.NOTION_DATABASE_ID, {
      sorts: [{ property: '발행일', direction: 'descending' }],
    })

    const invoices = response.results.filter(isFullPage).map(mapPageToInvoice)

    // 이하 기존 JSX 유지 (invoices 변수만 교체)
  }
  ```

  - `MOCK_INVOICES` import 제거
  - `isFullPage` guard로 partial 응답 필터링

## 테스트 체크리스트

Playwright MCP로 개발 서버(`npm run dev`) 실행 후 검증:

- [ ] `/invoices` 접속 → Notion 실데이터 목록 렌더링 확인
- [ ] 견적서 카드에 견적번호·클라이언트명·발행일·상태 뱃지·금액 표시 확인
- [ ] 발행일 내림차순 정렬 확인 (Notion DB 데이터 기준)
- [ ] 상태 뱃지 색상 (`대기`/`승인`/`거절`) 정상 표시
- [ ] `total`이 null인 항목도 에러 없이 렌더링
- [ ] 빈 목록 시나리오: Notion DB를 비웠을 때 빈 상태 UI 표시 (선택)
