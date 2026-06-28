# Invoice Web MVP 개발 규칙

## 프로젝트 개요

- **목적**: Notion DB의 견적서 데이터를 공개 URL로 조회하고 PDF로 저장하는 서비스
- **데이터 저장소**: Notion이 유일한 데이터 저장소 — 앱 자체 DB 없음
- **인증 없음**: `/invoices`, `/invoices/[id]` 모두 공개 라우트 (인증 시스템 구현 금지)
- **MVP 제외**: 로그인, 견적서 에디터, 이메일 발송, 전자서명, 다국어, 알림 — 구현 금지

---

## 디렉토리 구조 및 파일 소유권

```
src/
├── app/
│   ├── layout.tsx                     # 루트 레이아웃 — ThemeProvider, Toaster 포함
│   ├── page.tsx                       # 홈 페이지 → /invoices 링크
│   ├── globals.css                    # TailwindCSS v4 + @media print 글로벌 스타일
│   └── invoices/
│       ├── page.tsx                   # F001: 견적서 목록 (Server Component, revalidate=60)
│       ├── loading.tsx                # 목록 스켈레톤 UI
│       ├── error.tsx                  # 목록 에러 폴백 ('use client' 필수)
│       └── [id]/
│           ├── page.tsx               # F002-F004: 견적서 상세 (Server Component, revalidate=300)
│           ├── not-found.tsx          # 잘못된 Notion 페이지 ID → 404
│           ├── loading.tsx            # 상세 스켈레톤 UI
│           └── error.tsx              # 상세 에러 폴백 ('use client' 필수)
├── components/
│   ├── ui/                            # shadcn/ui 자동 생성 파일 — 직접 수정 금지
│   ├── layout/
│   │   └── container.tsx              # 레이아웃 컨테이너
│   ├── providers/
│   │   └── theme-provider.tsx         # next-themes 래퍼
│   └── invoice/                       # 견적서 전용 컴포넌트 (신규 생성 위치)
│       ├── InvoiceCard.tsx            # 목록 행 컴포넌트
│       ├── InvoiceDetail.tsx          # 상세 레이아웃
│       ├── InvoiceItemTable.tsx       # 견적 항목 테이블
│       ├── InvoiceSummary.tsx         # 소계/부가세/총액
│       ├── StatusBadge.tsx            # 상태 뱃지
│       └── PrintButton.tsx            # PDF 저장 버튼 (Client Component)
├── lib/
│   ├── env.ts                         # Zod 환경변수 검증 — 이미 구현됨, 수정 시 스키마만 변경
│   ├── utils.ts                       # cn() 유틸 — 수정 금지
│   ├── mock/                          # ⚠️ 임시 더미 데이터 — Phase 3(Task 006) 완료 시 전체 삭제
│   │   └── invoices.ts               # 더미 Invoice/InvoiceItem 배열
│   └── notion/
│       ├── client.ts                  # Notion 싱글톤 — 수정 금지
│       ├── queries.ts                 # queryDatabase(), getPageById() — 수정 금지
│       ├── transformers.ts            # 프로퍼티 추출 함수들 — 수정 금지
│       └── invoice.ts                 # Notion 페이지 → Invoice 매핑 (신규 생성)
└── types/
    └── invoice.ts                     # Invoice, InvoiceItem 인터페이스 (신규 생성)
```

### 파일 생성 위치 규칙

- 견적서 UI 컴포넌트 → `src/components/invoice/` (PascalCase 파일명)
- shadcn/ui 컴포넌트 → `npx shadcn@latest add <component>` 명령으로만 추가, 직접 생성 금지
- 새 훅 → `src/hooks/` 디렉토리 생성 후 배치
- 금액/날짜 포매팅 유틸 → `src/lib/utils.ts` 확장 또는 `src/lib/format.ts` 신규 생성

---

## Notion API 사용 규칙

### ⚠️ SDK v5 핵심 규칙

- **`notion.databases.query()` 직접 호출 금지** — SDK v5에서 제거됨
- **반드시 `queryDatabase(databaseId, options)`** (`src/lib/notion/queries.ts`) 사용
  - 내부적으로 `database_id → data_source_id` 변환 후 `notion.dataSources.query()` 호출
- **`getPageById(pageId)`** (`src/lib/notion/queries.ts`)로 단건 조회
- 견적 항목 블록 조회: `notion.blocks.children.list({ block_id: pageId })`로 직접 호출 가능

### Notion 호출 위치 제한

- Notion API는 **Server Component 또는 Server Action에서만** 호출
- Client Component에서 Notion API 직접 호출 절대 금지
- API Route Handler(`app/api/`)를 통한 Notion 호출도 허용

### 프로퍼티 추출

- `src/lib/notion/transformers.ts`의 함수만 사용:
  - `extractTitle(prop)` → string
  - `extractRichText(prop)` → string
  - `extractNumber(prop)` → number | null
  - `extractSelect(prop)` → string | null
  - `extractDate(prop)` → string | null (ISO 8601)
  - `extractCheckbox(prop)` → boolean
  - `extractUrl(prop)` → string | null
- 위 함수 외 프로퍼티 추출 로직을 컴포넌트 내에 직접 작성 금지

### Notion 프로퍼티명 규칙

Notion DB 프로퍼티에 접근할 때 반드시 **한국어 컬럼명** 사용. camelCase/영어 변환 금지.

| TypeScript 필드 | Notion 프로퍼티명 (한국어) | 타입      |
| --------------- | -------------------------- | --------- |
| `title`         | `'제목'`                   | title     |
| `client`        | `'고객사'`                 | rich_text |
| `issueDate`     | `'발행일'`                 | date      |
| `dueDate`       | `'유효기간'`               | date      |
| `supplier`      | `'공급자'`                 | rich_text |
| `status`        | `'상태'`                   | select    |
| `subtotal`      | `'소계'`                   | number    |
| `taxRate`       | `'부가세율'`               | number    |
| `total`         | `'총액'`                   | number    |
| `memo`          | `'메모'`                   | rich_text |

- 정렬 예시: `sorts: [{ property: '발행일', direction: 'descending' }]`
- 프로퍼티 접근: `page.properties['제목']`, `page.properties['고객사']`

### 견적서 매핑 레이어 (`src/lib/notion/invoice.ts`)

- `PageObjectResponse` → `Invoice` 변환 함수 구현 위치
- `isFullPage`, `isFullBlock` — 반드시 `import { isFullPage } from '@notionhq/client'`로 가져옴
- `isFullPage(page)` 가드 실패 시 `notFound()` 호출

### 견적 항목 블록 파싱 (2단계 호출 패턴)

```ts
// 1단계: 페이지 최상위 블록 조회
const { results: blocks } = await notion.blocks.children.list({
  block_id: pageId,
})

// 2단계: table 블록 필터 후 행 조회
const tableBlock = blocks.find(b => b.type === 'table')
if (tableBlock) {
  const { results: rows } = await notion.blocks.children.list({
    block_id: tableBlock.id,
  })
  // rows[0] = 헤더 행 (스킵), rows[1..] = 데이터 행
  // 각 행: row.table_row.cells (RichText[][] 구조)
  // plain_text 추출: row.table_row.cells[i][0]?.plain_text ?? ''
}
```

- `blocks.children.list`를 두 번 호출해야 함 (페이지 블록 → 테이블 행)
- 첫 번째 행(index 0)은 헤더이므로 `InvoiceItem` 변환에서 제외

---

## 타입 정의 규칙

### `src/types/invoice.ts` 필수 구조

```ts
export type InvoiceStatus = '작성중' | '전송됨' | '승인' | '거절'

export interface Invoice {
  id: string
  title: string
  client: string
  issueDate: string | null
  dueDate: string | null
  supplier: string
  status: InvoiceStatus | null
  subtotal: number | null
  taxRate: number | null
  total: number | null
  memo: string
}

export interface InvoiceItem {
  name: string
  quantity: number
  unitPrice: number
  amount: number
}
```

- `InvoiceStatus` 값은 **한국어 그대로** 사용 (`'draft'` 등 영어 변환 금지)
- 타입 파일을 `src/lib/` 하위에 두지 말고 반드시 `src/types/` 에 배치

---

## Next.js App Router 규칙

### Server Component vs Client Component

- 기본은 Server Component — `'use client'` 지시어 없이 생성
- Client Component가 필요한 경우만 `'use client'` 추가:
  - `PrintButton.tsx` (window.print() 호출)
  - 사용자 인터랙션이 있는 컴포넌트
- Server Component에서 Notion 데이터 페칭 후 Client Component에 props로 전달

### ISR 캐싱 (필수 적용)

- `src/app/invoices/page.tsx`: `export const revalidate = 60`
- `src/app/invoices/[id]/page.tsx`: `export const revalidate = 300`
- 두 파일 모두 상단에 revalidate 선언 필수 — 누락 시 캐싱 없음

### 라우트 세그먼트 파일

- `not-found.tsx`: `notFound()` 호출 시 렌더링 (잘못된 Notion 페이지 ID 처리)
- `loading.tsx`: Suspense 경계 스켈레톤 UI
- `error.tsx`: Notion API 오류 등 런타임 에러 폴백 (`'use client'` 필수)
- 위 파일들은 `src/app/invoices/` 및 `src/app/invoices/[id]/` 양쪽에 각각 생성

### 페이지 네비게이션

- 헤더 내비게이션 없음 — 각 페이지에 뒤로가기 링크만 제공
- `<Link href="/invoices">← 목록으로</Link>` 패턴 사용

---

## PDF 출력 규칙

- **`window.print()` + `@media print` CSS만 사용** — puppeteer, jsPDF 등 외부 라이브러리 도입 금지
- `PrintButton.tsx`는 반드시 `'use client'`
- 인쇄 전용 CSS 클래스:
  - `.no-print { display: none }` — PDF 저장 버튼, 네비게이션 등 숨김
  - `.print-only { display: block }` — 인쇄 전용 요소
- `@page { margin: 20mm; size: A4 }` 적용
- `globals.css` 또는 인라인 Tailwind `print:hidden` 클래스로 처리

---

## 스타일링 규칙

### TailwindCSS v4

- `globals.css`에 `@import "tailwindcss"` — config 파일 별도 없음
- CSS 변수는 `globals.css` 내 `:root` 블록에서 관리
- `tw-animate-css` 애니메이션 유틸 사용 가능

### shadcn/ui

- **스타일: new-york, 아이콘: lucide, 기본 색상: neutral**
- 컴포넌트 추가: `npx shadcn@latest add <component-name>`
- `src/components/ui/` 파일 직접 편집 금지 (자동 생성 파일)
- 이미 추가된 컴포넌트: alert, avatar, badge, button, card, checkbox, dialog, dropdown-menu, form, input, label, navigation-menu, progress, select, separator, sheet, skeleton, sonner
- **⚠️ 미설치 (Task 003에서 설치 필요)**: `table` — `npx shadcn@latest add table` 실행 후 사용

### 아이콘

- `lucide-react`만 사용 — 다른 아이콘 라이브러리 도입 금지

---

## 환경변수 규칙

- 서버 전용 변수: `NOTION_API_KEY`, `NOTION_DATABASE_ID`
- **`NEXT_PUBLIC_` 접두사 절대 금지** — 클라이언트 번들에 노출됨
- 접근 방법: `import { env } from '@/lib/env'` — `process.env`에 직접 접근 금지
- 새 환경변수 추가 시 `src/lib/env.ts`의 Zod 스키마에 반드시 추가

---

## 다중 파일 조정 규칙

| 작업                                   | 반드시 함께 수정할 파일                                           |
| -------------------------------------- | ----------------------------------------------------------------- |
| 새 환경변수 추가                       | `src/lib/env.ts` + `.env.example`                                 |
| `Invoice` 인터페이스 필드 변경         | `src/types/invoice.ts` + `src/lib/notion/invoice.ts` (매핑 함수)  |
| 새 shadcn/ui 컴포넌트 추가             | `npx shadcn@latest add` 실행 (package.json 자동 갱신)             |
| 견적서 상태값(`InvoiceStatus`) 변경    | `src/types/invoice.ts` + `src/components/invoice/StatusBadge.tsx` |
| 로드맵 태스크 완료                     | `docs/ROADMAP.md`의 해당 항목 ✅ 표시                             |
| 새 라우트 추가                         | `src/app/` 경로 생성 + PRD와 ROADMAP 확인                         |
| Notion 프로퍼티 추출 함수 추가         | `src/lib/notion/transformers.ts` + 해당 타입 정의                 |
| 더미 데이터 → 실데이터 전환 (Task 006) | `src/lib/mock/` 삭제 + 모든 페이지/컴포넌트에서 mock import 제거  |

---

## 더미 데이터 규칙

- `src/lib/mock/invoices.ts`는 Phase 2(Task 003~005) 에서만 사용하는 **임시 파일**
- Phase 3 Task 006 실데이터 전환 완료 즉시 `src/lib/mock/` 디렉토리 전체 삭제
- 삭제 전 해당 mock import를 참조하는 모든 컴포넌트/페이지에서 import 제거 확인
- mock 데이터를 production 코드와 함께 유지하거나 조건부 분기하는 방식 금지

---

## 테스트 규칙

- **Notion API 연동 및 비즈니스 로직 구현 시 Playwright MCP 테스트 필수**
- 각 Task 파일의 `## 테스트 체크리스트` 섹션 시나리오 실행
- 반드시 검증할 시나리오:
  - `/invoices` 목록 렌더링, 발행일 내림차순 정렬, 상태 뱃지 색상
  - `/invoices/[id]` 유효 ID 조회, 존재하지 않는 ID → 404 페이지
  - 견적 항목 테이블 파싱 정확성 (수량 × 단가 = 금액)
  - PDF 저장 버튼 클릭 → 브라우저 인쇄 다이얼로그 호출
  - 인쇄 시 `.no-print` 요소 숨김 확인
- 구현 완료 후 `npm run check-all` 통과 필수

---

## 금지 사항

- `src/components/ui/` 파일 직접 편집 금지
- `src/lib/notion/client.ts`, `src/lib/notion/queries.ts`, `src/lib/notion/transformers.ts` 수정 금지 (기존 구현 완료)
- `notion.databases.query()` 직접 호출 금지 — `queryDatabase()` 사용
- Notion API를 Client Component에서 직접 호출 금지
- 환경변수에 `NEXT_PUBLIC_` 접두사 사용 금지 (Notion 키)
- `process.env` 직접 접근 금지 — `env` 객체 사용
- PDF 출력에 외부 라이브러리(puppeteer, jsPDF 등) 도입 금지
- 인증/로그인 시스템 구현 금지 (MVP 범위 외)
- 앱 자체 DB(PostgreSQL, SQLite 등) 도입 금지 (Notion이 유일한 저장소)
- `InvoiceStatus` 값을 영어로 변환 금지 — 한국어 그대로 사용
- `src/lib/utils.ts`의 `cn()` 함수 삭제 또는 변경 금지
