# Task 003: 견적서 공통 컴포넌트 라이브러리 구현

## 개요

shadcn/ui 컴포넌트 추가 및 견적서 UI에 필요한 공통 컴포넌트와 더미 데이터 유틸을 구현합니다.

## 관련 파일

- `src/components/ui/table.tsx` (신규 — shadcn add)
- `src/lib/mock/invoices.ts` (신규)
- `src/lib/utils.ts` (수정 — 포매터 추가)
- `src/components/invoice/StatusBadge.tsx` (신규)
- `src/components/invoice/InvoiceCard.tsx` (신규)

## 수락 기준

- [ ] shadcn `table` 컴포넌트가 설치됨
- [ ] `src/lib/mock/invoices.ts`에 3개 이상의 더미 Invoice와 항목 데이터가 있음
- [ ] `StatusBadge`가 대기(노란색)/승인(초록색)/거절(빨간색) 색상으로 렌더링됨
- [ ] `InvoiceCard`가 Link로 감싸져 `/invoices/[id]`로 이동함
- [ ] `formatCurrency`, `formatDate` 유틸이 `src/lib/utils.ts`에 추가됨
- [ ] `npm run check-all` 통과

## 구현 단계

- [ ] **Step 1**: `npx shadcn@latest add table` 실행
- [ ] **Step 2**: `src/lib/mock/invoices.ts` 작성
  - `MOCK_INVOICE_ITEMS`: 5개 항목 (서로 다른 견적서 소속)
  - `MOCK_INVOICES`: 3개 견적서 (승인/대기/거절 각 1개)
  - `getMockInvoiceById(id)`, `getMockItemsByIds(ids)` 헬퍼
- [ ] **Step 3**: `src/lib/utils.ts`에 `formatCurrency`, `formatDate` 추가
  - `formatCurrency`: `Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })`
  - `formatDate`: `Intl.DateTimeFormat('ko-KR')` — `YYYY.MM.DD` 형식
- [ ] **Step 4**: `src/components/invoice/StatusBadge.tsx` 작성
  - `status: InvoiceStatus | null` props
  - null → "미설정" outline badge
  - 대기 → 노란 계열 (`bg-yellow-100 text-yellow-800`)
  - 승인 → 초록 계열 (`bg-green-100 text-green-800`)
  - 거절 → `variant="destructive"`
- [ ] **Step 5**: `src/components/invoice/InvoiceCard.tsx` 작성
  - Server Component (use client 없음)
  - `invoice: Invoice` props
  - `Link href={'/invoices/${invoice.id}'}` 래퍼
  - 견적번호 / 클라이언트명 / 발행일 / 상태 / 총금액 표시
  - 모바일: 견적번호 + 상태 + 금액만 노출
