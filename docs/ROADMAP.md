# Invoice Web MVP 개발 로드맵

Notion에 입력한 견적서 데이터를 클라이언트가 로그인 없이 웹 URL로 확인하고 PDF로 저장할 수 있게 하는 서비스.

## 개요

Invoice Web MVP는 소규모 프리랜서/사업자(어드민)와 그 고객(클라이언트)를 위한 "Notion 기반 견적서 공유 서비스"로 다음 기능을 제공합니다:

- **견적서 공개 조회**: 인증 없이 `/invoices/[id]` URL로 견적서 상세를 확인 (F002, F004)
- **PDF 다운로드**: `window.print()` + `@media print` CSS로 별도 라이브러리 없이 PDF 저장 (F003)
- **Notion 연동 데이터 소싱**: Notion DB와 페이지 블록을 단일 데이터 소스로 사용, ISR로 API 호출 최소화 (F001, F010, F012)

> **데이터 저장소**: Notion이 유일한 데이터 저장소이며 앱 자체 DB는 없습니다.
> **인증 없음**: 모든 견적서 라우트는 공개 라우트입니다 (MVP 제외 항목: 로그인/인증/에디터/이메일/전자서명/i18n/알림).

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `006`이라면 `005`와 `004`를 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **Notion API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 프로젝트 라우트 구조 및 페이지 골격 생성** ✅ - 완료
  - `src/app/invoices/page.tsx` (목록) 빈 껍데기 생성
  - `src/app/invoices/[id]/page.tsx` (상세) 빈 껍데기 생성
  - 각 페이지에 뒤로가기 링크 골격 배치 (별도 헤더 내비게이션 없음)
  - 라우트 세그먼트 파일 골격 추가:
    - `src/app/invoices/loading.tsx`, `src/app/invoices/error.tsx`
    - `src/app/invoices/[id]/not-found.tsx` (잘못된 페이지 ID → 404), `src/app/invoices/[id]/loading.tsx`, `src/app/invoices/[id]/error.tsx`
  - 루트 레이아웃에서 불필요한 스타터 마크업 정리

- **Task 002: 타입 정의 및 Notion 매핑 인터페이스 설계** ✅ - 완료
  - ✅ `src/types/invoice.ts`에 `Invoice`, `InvoiceItem` 인터페이스 정의
  - ✅ `Invoice` 필드: `id`, `invoiceNumber`, `clientName`, `issueDate`, `dueDate`, `status`, `total`, `itemIds`
  - ✅ `InvoiceItem` 필드: `id`, `name`, `quantity`, `unitPrice`, `amount`
  - ✅ `status` 유니온 타입 정의 (`대기` | `승인` | `거절`)
  - ✅ `src/lib/notion/invoice.ts`에 매핑 함수 시그니처 골격 작성 (`mapPageToInvoice`, `mapPageToInvoiceItem`)
  - ✅ `src/lib/notion/transformers.ts`에 `extractRelation`, `extractFormula` 추가

- **Task 002-1: Notion 클라이언트 및 환경변수 검증 기반** ✅ - 완료 (기존 구현)
  - ✅ `src/lib/notion/client.ts` Notion SDK v5 싱글톤 클라이언트
  - ✅ `src/lib/notion/queries.ts` `queryDatabase()`, `getPageById()` (data_source_id 해석 포함)
  - ✅ `src/lib/notion/transformers.ts` 프로퍼티 추출기 (`extractTitle/RichText/Number/Select/Date/Checkbox/Url`)
  - ✅ `src/lib/env.ts` Zod 기반 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 검증

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

- **Task 003: 견적서 공통 컴포넌트 라이브러리 구현** ✅ - 완료
  - ✅ shadcn/ui 컴포넌트 추가: `npx shadcn@latest add table`
  - ✅ `src/components/invoice/StatusBadge.tsx` 상태별 색상 뱃지 (F011)
  - ✅ `src/components/invoice/InvoiceCard.tsx` 목록 행 컴포넌트
  - ✅ `src/lib/mock/invoices.ts` 더미 견적서/항목 데이터 유틸 작성
  - ✅ `src/lib/utils.ts` formatCurrency, formatDate 포매터 추가

- **Task 004: 견적서 목록 / 상세 페이지 UI 완성 (더미 데이터)** ✅ - 완료
  - ✅ 목록 페이지: 카드/테이블 레이아웃 + 상태 뱃지 + 발행일 정렬 표시
  - ✅ 상세 페이지: `InvoiceDetail`, `InvoiceItemTable`, `InvoiceSummary` 컴포넌트로 견적서 본문 구성
  - ✅ `InvoiceSummary`에 총금액 표시 (소계/부가세율 컬럼 없음 — Notion DB 기준)
  - ✅ 반응형 디자인 및 모바일 최적화, 네비게이션(뒤로가기) 검증
  - ✅ 더미 데이터로 렌더링 (API 연동 전)

- **Task 005: PDF 인쇄 레이아웃 및 PrintButton 구현** ✅ - 완료
  - ✅ `src/components/invoice/PrintButton.tsx` Client Component (`window.print()`) (F003)
  - ✅ `@media print` CSS: `.no-print` 숨김, `@page { margin: 20mm; size: A4 }`, 본문 12pt
  - ✅ 인쇄 시 버튼/네비게이션 숨김
  - ✅ `globals.css`에 print 스타일 추가 (`@layer` 밖 배치)

### Phase 3: 핵심 기능 구현 (Notion 실데이터 연동) ✅

- **Task 006: Notion 매핑 레이어 및 목록 페이지 실데이터 연동** ✅ - 완료
  - ✅ `src/lib/notion/invoice.ts` Notion 페이지 → `Invoice` 매핑 함수 구현 (transformers 활용)
  - ✅ 목록 페이지에서 `queryDatabase(NOTION_DATABASE_ID, { sorts: [{ property: '발행일', direction: 'descending' }] })` 호출 (F001, F010)
  - ✅ 더미 데이터를 실제 Notion 응답으로 교체, `src/lib/mock/` 디렉토리 삭제
  - ✅ `export const revalidate = 60` ISR 적용 (F012)
  - ✅ Playwright MCP로 목록 페이지 렌더링/정렬/상태 뱃지 통합 테스트

- **Task 007: 견적서 상세 페이지 실데이터 연동 및 항목 Relation 파싱** ✅ - 완료
  - ✅ `getPageById(params.id)` + `isFullPage` 가드, 실패 시 `notFound()` (F002, F004)
  - ✅ `extractRelation`으로 `itemIds` 추출 → 각 ID마다 `notion.pages.retrieve(itemId)` 호출 → `mapPageToInvoiceItem()` 변환 (F002)
  - ✅ 견적 항목 테이블 / 요약(총금액) 실데이터 렌더링
  - ✅ `export const revalidate = 300` ISR 적용 (F012)
  - ✅ Playwright MCP로 유효 ID/존재하지 않는 ID(404)/항목 Relation 파싱 E2E 테스트

- **Task 007-1: 핵심 기능 통합 테스트** ✅ - 완료
  - ✅ Playwright MCP로 전체 사용자 플로우 테스트: 목록 → 행 클릭 → 상세 → PDF 저장
  - ✅ Notion API 응답 매핑 정확성 검증 (금액/날짜/상태 포맷)
  - ✅ 에러 핸들링 및 엣지 케이스: 잘못된 페이지 ID, 권한 없는 통합, 빈 항목 테이블, 누락 프로퍼티(N 필수 아님 컬럼)
  - ✅ 공개 라우트(인증 없이 접근 가능) 동작 확인

### Phase 4: 최적화 및 배포

- **Task 008: 캐싱/성능 최적화 및 로딩·에러 UX 정교화**
  - ISR `revalidate` 값 검증 및 Notion API rate limit 대응 점검
  - `loading.tsx` 스켈레톤 / `error.tsx` 폴백 UX 마감
  - 금액/날짜 포매팅 유틸 공통화, 접근성(시맨틱 마크업) 점검
  - Lighthouse 기반 성능/접근성 측정

- **Task 009: Vercel 배포 및 운영 설정**
  - Vercel 프로젝트 연결 및 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 환경변수 등록
  - ISR 동작(프로덕션) 확인 및 프로덕션 URL로 PDF 저장 플로우 재검증
  - `npm run check-all` / `npm run build` 통과 확인 후 배포
  - 배포 후 Playwright MCP로 프로덕션 스모크 테스트

---

**📅 최종 업데이트**: 2026-06-28
**📊 진행 상황**: Phase 3 완료 (9/11 Tasks 완료, 82%)
