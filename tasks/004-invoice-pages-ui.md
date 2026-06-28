# Task 004: 견적서 목록 / 상세 페이지 UI 완성 (더미 데이터)

## 개요

Task 003의 공통 컴포넌트를 활용해 목록 페이지와 상세 페이지 UI를 완성합니다.
모든 데이터는 더미 데이터(`src/lib/mock/invoices.ts`)로 렌더링합니다.

## 관련 파일

- `src/components/invoice/InvoiceDetail.tsx` (신규)
- `src/components/invoice/InvoiceItemTable.tsx` (신규)
- `src/components/invoice/InvoiceSummary.tsx` (신규)
- `src/app/invoices/page.tsx` (수정)
- `src/app/invoices/[id]/page.tsx` (수정)

## 의존성

Task 003 완료 후 진행

## 수락 기준

- [ ] `/invoices` 목록 페이지에서 3개 더미 견적서 카드 행이 렌더링됨
- [ ] 각 카드 클릭 시 `/invoices/[id]`로 이동함
- [ ] `/invoices/[id]` 상세 페이지에서 헤더 정보, 항목 테이블, 총금액 렌더링됨
- [ ] 존재하지 않는 ID 접근 시 404 페이지로 이동함
- [ ] 모바일(375px)과 데스크톱(1280px) 양쪽에서 레이아웃 깨짐 없음
- [ ] `npm run check-all` 통과

## 구현 단계

- [ ] **Step 1**: `src/components/invoice/InvoiceDetail.tsx` 작성
  - `invoice: Invoice` props
  - 견적서 번호 + StatusBadge 헤더
  - dl/dt/dd 그리드: 클라이언트명 / 발행일 / 유효기간
- [ ] **Step 2**: `src/components/invoice/InvoiceItemTable.tsx` 작성
  - `items: InvoiceItem[]` props
  - 빈 배열 시 "견적 항목이 없습니다" 빈 상태 UI
  - shadcn Table 사용: 품명 / 수량 / 단가 / 금액 컬럼
  - 금액 컬럼은 `text-right tabular-nums`
- [ ] **Step 3**: `src/components/invoice/InvoiceSummary.tsx` 작성
  - `total: number | null` props
  - 오른쪽 정렬 총금액 표시 (소계/부가세 없음)
- [ ] **Step 4**: `src/app/invoices/page.tsx` 교체
  - `MOCK_INVOICES` import
  - 빈 목록 시 "등록된 견적서가 없습니다" 빈 상태 UI
  - 데스크톱용 컬럼 헤더 행 (sm 이상만 표시)
  - `InvoiceCard` 목록 렌더링
- [ ] **Step 5**: `src/app/invoices/[id]/page.tsx` 교체
  - `getMockInvoiceById(id)` → 없으면 `notFound()` 호출
  - `getMockItemsByIds(invoice.itemIds)` 항목 조회
  - `InvoiceDetail` + `InvoiceItemTable` + `InvoiceSummary` 렌더링
