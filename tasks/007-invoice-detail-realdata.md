# Task 007: 견적서 상세 페이지 실데이터 연동 및 항목 Relation 파싱

## 개요

`mapPageToInvoiceItem` 함수를 구현하고, 상세 페이지(`/invoices/[id]`)를
Notion 실데이터로 교체합니다. 항목은 `항목` Relation 필드에서 ID를 꺼낸 뒤
각각 `notion.pages.retrieve()`로 개별 조회하여 변환합니다.
모든 페이지가 실데이터로 전환되면 `src/lib/mock/` 디렉토리를 삭제합니다.

## 관련 파일

- `src/lib/notion/invoice.ts` (수정 — `mapPageToInvoiceItem` 구현)
- `src/app/invoices/[id]/page.tsx` (수정 — mock → Notion 실데이터)
- `src/lib/mock/` (삭제 — 더미 데이터 디렉토리)

## 의존성

Task 006 완료 후 진행

## Notion 견적 항목 DB 스키마 (`item2`, PRD 기준)

| Notion 컬럼 | 프로퍼티 타입 | InvoiceItem 필드 | 추출 함수        |
| ----------- | ------------- | ---------------- | ---------------- |
| `항목명`    | Title         | `name`           | `extractTitle`   |
| `수량`      | Number        | `quantity`       | `extractNumber`  |
| `단가`      | Number        | `unitPrice`      | `extractNumber`  |
| `금액`      | Formula       | `amount`         | `extractFormula` |
| `invoices2` | Relation      | (무시)           | -                |

## 수락 기준

- [ ] `mapPageToInvoiceItem` 이 `PageObjectResponse` → `InvoiceItem` 타입을 올바르게 변환
- [ ] 유효한 Notion 페이지 ID로 접속 시 견적서 상세 정상 렌더링
- [ ] 존재하지 않는 ID(`/invoices/invalid-id`)로 접속 시 404(not-found) 페이지 렌더링
- [ ] `항목` Relation이 비어 있는 견적서도 에러 없이 렌더링 (빈 테이블)
- [ ] `src/lib/mock/` 디렉토리 삭제 후 `npm run check-all` 통과

## 구현 단계

- [ ] **Step 1**: `src/lib/notion/invoice.ts` — `mapPageToInvoiceItem` 구현

  ```ts
  export function mapPageToInvoiceItem(page: PageObjectResponse): InvoiceItem {
    const props = page.properties
    return {
      id: page.id,
      name: extractTitle(props['항목명']),
      quantity: extractNumber(props['수량']),
      unitPrice: extractNumber(props['단가']),
      amount: extractFormula(props['금액']),
    }
  }
  ```

- [ ] **Step 2**: `src/app/invoices/[id]/page.tsx` — Notion 실데이터 연동

  ```ts
  import { isFullPage } from '@notionhq/client'
  import { notFound } from 'next/navigation'
  import { getPageById } from '@/lib/notion/queries'
  import { notion } from '@/lib/notion/client'
  import { mapPageToInvoice, mapPageToInvoiceItem } from '@/lib/notion/invoice'

  export const revalidate = 300

  export default async function InvoiceDetailPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params

    // 견적서 페이지 조회 — 없거나 partial이면 404
    let page
    try {
      page = await getPageById(id)
    } catch {
      notFound()
    }
    if (!isFullPage(page)) notFound()

    const invoice = mapPageToInvoice(page)

    // 항목 Relation ID → 각 페이지 개별 조회
    const itemPages = await Promise.all(
      invoice.itemIds.map(itemId => notion.pages.retrieve({ page_id: itemId }))
    )
    const items = itemPages.filter(isFullPage).map(mapPageToInvoiceItem)

    // 이하 기존 JSX 유지 (invoice, items 변수만 교체)
  }
  ```

  - `getMockInvoiceById`, `getMockItemsByIds` import 제거
  - Notion API 에러(404, 권한 없음 등)는 `try/catch → notFound()` 처리

- [ ] **Step 3**: `src/lib/mock/` 디렉토리 삭제

  ```bash
  rm -rf src/lib/mock
  ```

  - 목록·상세 양쪽 페이지 모두 실데이터 전환 후 삭제

## 테스트 체크리스트

Playwright MCP로 개발 서버(`npm run dev`) 실행 후 검증:

- [ ] `/invoices`에서 실제 견적서 행 클릭 → `/invoices/[notionPageId]` 이동 확인
- [ ] 상세 페이지에 견적서 번호·클라이언트명·발행일·유효기간·상태 렌더링 확인
- [ ] 견적 항목 테이블에 항목명·수량·단가·금액 표시 확인
- [ ] 총금액 합계 표시 확인
- [ ] `/invoices/invalid-id` 접속 시 not-found 페이지 렌더링 확인
- [ ] `항목` Relation이 비어 있는 견적서 — 빈 테이블 또는 "항목 없음" UI 에러 없이 표시
- [ ] "PDF 저장" 버튼 클릭 시 브라우저 인쇄 대화상자 열림 확인
