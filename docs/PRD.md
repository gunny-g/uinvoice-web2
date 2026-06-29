# Invoice Web PRD

## 프로젝트 핵심

**목적**: 사업자가 Notion에 입력한 견적서 데이터를 클라이언트가 로그인 없이 웹 URL로 확인하고 PDF로 저장할 수 있게 한다. 사업자는 어드민 대시보드에서 견적서 목록을 관리하고 클라이언트 공유 링크를 복사할 수 있다.
**사용자**: 소규모 프리랜서/사업자(어드민)와 그 고객(클라이언트).
**개발 이력**: MVP 완료 (`docs/roadmaps/ROADMAP_v1.md`) → 고도화 진행 중 (`docs/ROADMAP.md`)

---

## 사용자 여정

### 사업자 (어드민) 흐름

```
1. Notion 데이터베이스에 견적서 행(row) 추가
   ↓
2. /invoices 어드민 대시보드 접속 → 견적서 목록 확인
   ↓ "링크 복사" 버튼 클릭
3. 클립보드에 공개 URL 복사 → 고객에게 전달: /invoices/[notionPageId]
```

### 클라이언트 (고객) 흐름

```
1. 받은 URL 접속 → 견적서 상세 페이지 진입 (로그인 불필요)
   ↓
2. 견적 항목, 금액, 유효기간 등 확인
   ↓
3. "PDF 다운로드" 버튼 클릭 → 브라우저 인쇄 대화상자 → PDF 저장
```

### 견적서 목록 흐름 (내부 확인용)

```
1. /invoices 접속 → Notion DB 전체 견적서 목록 표시
   ↓ 행 클릭
2. 견적서 상세 페이지로 이동
```

---

## 기능 명세

### MVP 핵심 기능 ✅ 완료

| ID       | 기능명           | 설명                                                       | 관련 페이지        |
| -------- | ---------------- | ---------------------------------------------------------- | ------------------ |
| **F001** | 견적서 목록 조회 | Notion DB를 쿼리하여 전체 견적서를 카드/테이블로 표시      | 견적서 목록 페이지 |
| **F002** | 견적서 상세 조회 | Notion 페이지 ID로 단건 조회 후 견적서 UI 렌더링           | 견적서 상세 페이지 |
| **F003** | PDF 다운로드     | `window.print()` + `@media print` CSS로 인쇄 레이아웃 제공 | 견적서 상세 페이지 |
| **F004** | 공개 URL 접근    | 인증 없이 `/invoices/[id]` 에 접근 가능 (공개 라우트)      | 견적서 상세 페이지 |

### MVP 지원 기능 ✅ 완료

| ID       | 기능명           | 설명                                              | 관련 페이지                            |
| -------- | ---------------- | ------------------------------------------------- | -------------------------------------- |
| **F010** | Notion API 연동  | `queryDatabase()`, `getPageById()` 로 데이터 조회 | 전체                                   |
| **F011** | 견적서 상태 표시 | 상태(대기/승인/거절) 뱃지 렌더링                  | 견적서 목록 페이지, 견적서 상세 페이지 |
| **F012** | ISR 캐싱         | `revalidate` 설정으로 Notion API 호출 최소화      | 전체                                   |

### 고도화 기능

| ID       | 기능명               | 설명                                                                                       | 관련 페이지        |
| -------- | -------------------- | ------------------------------------------------------------------------------------------ | ------------------ |
| **F005** | 어드민 레이아웃      | 사이드바·헤더를 갖춘 어드민 대시보드 레이아웃으로 견적서 목록 제공 (`(admin)` 라우트 그룹) | 어드민 목록 페이지 |
| **F006** | 클라이언트 링크 복사 | 견적서 목록에서 각 견적서의 공개 URL을 클립보드에 복사 + 토스트 피드백                     | 어드민 목록 페이지 |
| **F007** | 다크모드             | 시스템 감지 + 수동 토글 (`next-themes`), 헤더에 토글 버튼 배치, 테마 설정 로컬 저장        | 전체               |

### 제외 항목 (전체)

- 어드민 로그인 / 인증 시스템
- 견적서 웹 에디터 (Notion이 입력 도구)
- 이메일 발송 기능
- 전자서명 / 승인 워크플로우
- 다국어(i18n)
- 알림 시스템

---

## Notion 데이터베이스 스키마

견적서 DB (`NOTION_DATABASE_ID`)에 아래 컬럼을 생성합니다.

| 컬럼명         | Notion 프로퍼티 타입 | 설명                                  | 필수 |
| -------------- | -------------------- | ------------------------------------- | ---- |
| `견적서 번호`  | Title                | 견적서 식별 번호 (예: "INV-2025-001") | Y    |
| `클라이언트명` | Rich Text            | 클라이언트 회사명 또는 개인명         | Y    |
| `발행일`       | Date                 | 견적서 발행 날짜                      | Y    |
| `유효기간`     | Date                 | 견적 유효 마감일                      | Y    |
| `상태`         | Select               | `대기` / `승인` / `거절`              | Y    |
| `총금액`       | Number               | 최종 청구 금액                        | Y    |
| `항목`         | Relation             | 견적 항목 DB와 연결                   | Y    |

### 견적 항목 DB (`item2`)

`항목` 컬럼은 `item2` Notion 데이터베이스와 Relation으로 연결됩니다. 견적 항목 DB의 구조:

| 컬럼명      | Notion 프로퍼티 타입 | 설명                       |
| ----------- | -------------------- | -------------------------- |
| `항목명`    | Title                | 작업/상품 이름             |
| `수량`      | Number               | 단위 수량                  |
| `단가`      | Number               | 항목당 단가 (원)           |
| `금액`      | Formula              | `수량 * 단가` 자동 계산    |
| `invoices2` | Relation             | 메인 DB 역방향 연결 (무시) |

> 견적 항목은 `항목` Relation 필드의 페이지 ID 목록을 꺼낸 뒤, 각 ID마다 `notion.pages.retrieve(itemId)`로 조회합니다.

---

## 메뉴 구조

```
/invoices            → 어드민 견적서 목록 페이지 (F001, F005, F006, F011) — 어드민 레이아웃 적용
/invoices/[id]       → 견적서 상세 페이지 (F002, F003, F004, F011)        — 공개 라우트, 어드민 레이아웃 없음
```

> **라우트 그룹 설계**: `/invoices`는 `(admin)` 라우트 그룹 내에 배치하여 사이드바/헤더 레이아웃을 적용한다.
> `/invoices/[id]`는 그룹 외부에 유지하여 클라이언트가 어드민 UI 없이 접근하는 공개 라우트로 분리한다.

---

## 페이지별 상세 기능

### 어드민 견적서 목록 페이지 (`/invoices`)

> **구현 기능:** `F001`, `F005`, `F006`, `F011`, `F012`

| 항목            | 내용                                                                                                                                                                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **역할**        | Notion DB의 전체 견적서를 어드민 대시보드 레이아웃으로 나열하는 내부 관리 페이지                                                                                                                                                                                              |
| **진입 경로**   | 직접 URL 입력 또는 기타 링크                                                                                                                                                                                                                                                  |
| **사용자 행동** | 견적서 목록을 훑어보고 특정 건을 클릭하여 상세로 이동하거나, 링크 복사 버튼으로 공개 URL을 클립보드에 복사                                                                                                                                                                    |
| **주요 기능**   | 어드민 사이드바 + 헤더 레이아웃 (`F005`)<br>견적서 행 목록 (견적서 번호, 클라이언트명, 발행일, 상태, 총금액)<br>상태별 뱃지 색상 구분<br>각 행에 링크 복사 버튼 — 복사 성공 시 토스트 표시 (`F006`)<br>행 클릭 시 `/invoices/[id]`로 이동<br>헤더 다크모드 토글 버튼 (`F007`) |
| **다음 이동**   | 행 클릭 → 견적서 상세 페이지                                                                                                                                                                                                                                                  |

**데이터 조회 방식**

```ts
// src/app/invoices/page.tsx (Server Component)
import { queryDatabase } from '@/lib/notion/queries'

const response = await queryDatabase(process.env.NOTION_DATABASE_ID!, {
  sorts: [{ property: '발행일', direction: 'descending' }],
})
```

**Next.js 캐싱**

```ts
export const revalidate = 60 // 60초 ISR
```

---

### 견적서 상세 페이지 (`/invoices/[id]`)

> **구현 기능:** `F002`, `F003`, `F004`, `F011`

| 항목            | 내용                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **역할**        | 단일 견적서를 인쇄 가능한 레이아웃으로 보여주는 공개 페이지                                                                                                                                |
| **진입 경로**   | 사업자가 전달한 URL 직접 접속, 또는 목록 페이지에서 클릭                                                                                                                                   |
| **사용자 행동** | 견적 내용 확인 후 "PDF로 저장" 버튼 클릭                                                                                                                                                   |
| **주요 기능**   | 견적서 헤더 (공급자, 고객사, 발행일, 유효기간, 상태)<br>견적 항목 테이블 (항목명, 수량, 단가, 금액)<br>소계 / 부가세 / 총액 합계 영역<br>메모 섹션<br>"PDF로 저장" 버튼 (`window.print()`) |
| **다음 이동**   | PDF 저장 완료 후 동일 페이지 유지                                                                                                                                                          |

**데이터 조회 방식**

```ts
// src/app/invoices/[id]/page.tsx (Server Component)
import { getPageById } from '@/lib/notion/queries'
import { isFullPage } from '@notionhq/client'

const page = await getPageById(params.id)
if (!isFullPage(page)) notFound()
```

**견적 항목 블록 조회**

```ts
const blocks = await notion.blocks.children.list({ block_id: params.id })
// type === 'table' 블록에서 행 데이터 추출
```

**Next.js 캐싱**

```ts
export const revalidate = 300 // 5분 ISR
```

---

## PDF 출력 구현

`window.print()` + CSS `@media print` 방식을 사용합니다. 별도 라이브러리 불필요.

```css
/* src/app/invoices/[id]/print.css (또는 Tailwind 인라인) */
@media print {
  .no-print {
    display: none;
  } /* PDF 저장 버튼 등 숨김 */
  .print-only {
    display: block;
  } /* 인쇄 전용 요소 표시 */
  body {
    font-size: 12pt;
  }
  @page {
    margin: 20mm;
    size: A4;
  }
}
```

버튼 구현 (Client Component):

```tsx
// src/components/invoice/PrintButton.tsx
'use client'
export function PrintButton() {
  return (
    <button className="no-print ..." onClick={() => window.print()}>
      PDF로 저장
    </button>
  )
}
```

---

## 데이터 모델

Notion이 유일한 데이터 저장소이며, 앱 자체 DB는 없습니다.

### Invoice (Notion 페이지 매핑)

| 필드            | Notion 컬럼    | 설명                | 추출 함수         |
| --------------- | -------------- | ------------------- | ----------------- |
| `id`            | -              | Notion 페이지 ID    | -                 |
| `invoiceNumber` | `견적서 번호`  | 견적서 번호         | `extractTitle`    |
| `clientName`    | `클라이언트명` | 클라이언트명        | `extractRichText` |
| `issueDate`     | `발행일`       | 발행일              | `extractDate`     |
| `dueDate`       | `유효기간`     | 유효기간            | `extractDate`     |
| `status`        | `상태`         | 상태                | `extractSelect`   |
| `total`         | `총금액`       | 총금액              | `extractNumber`   |
| `itemIds`       | `항목`         | 연결된 항목 ID 목록 | `extractRelation` |

### InvoiceItem (item2 DB 페이지 매핑)

| 필드        | Notion 컬럼 | 타입    | 설명           | 추출 함수        |
| ----------- | ----------- | ------- | -------------- | ---------------- |
| `id`        | -           | -       | 항목 페이지 ID | -                |
| `name`      | `항목명`    | Title   | 항목명         | `extractTitle`   |
| `quantity`  | `수량`      | Number  | 수량           | `extractNumber`  |
| `unitPrice` | `단가`      | Number  | 단가           | `extractNumber`  |
| `amount`    | `금액`      | Formula | 수량 × 단가    | `extractFormula` |

> `금액`은 Formula(`수량 * 단가`) 타입입니다. `invoices2`는 메인 DB로의 역방향 Relation으로 매핑하지 않습니다.

---

## 기술 스택

### 프론트엔드 프레임워크

- **Next.js 15.5.3** (App Router + Turbopack) - Server Component 기반 데이터 페칭
- **React 19.1.0** - UI 라이브러리
- **TypeScript 5** - 타입 안전성

### 스타일링 & UI

- **TailwindCSS v4** - 유틸리티 CSS (인쇄 레이아웃 + 다크모드 포함)
- **shadcn/ui** - Badge, Table, Button, DropdownMenu, Sonner(toast) 컴포넌트
- **Lucide React** - 아이콘 (Sun, Moon, Copy 등)
- **next-themes** - 다크모드 ThemeProvider (시스템 감지 + 수동 토글 + 로컬스토리지 저장)

### 외부 연동

- **@notionhq/client v5** - Notion API SDK (이미 설치됨)
  - `notion.dataSources.query()` - 목록 조회
  - `notion.pages.retrieve()` - 단건 조회 (견적서 + 개별 항목 페이지)

### 환경변수 (Zod 검증)

```
NOTION_API_KEY=secret_xxx            # Notion Internal Integration Token (서버 전용)
NOTION_DATABASE_ID=xxx               # 견적서 데이터베이스 ID (서버 전용)
NEXT_PUBLIC_SITE_URL=https://...     # 클라이언트 링크 복사 시 공개 URL 베이스 (클라이언트 노출 가능)
```

> `NEXT_PUBLIC_SITE_URL`은 `src/lib/env.ts` Zod 스키마에 추가하며, 링크 복사 시 `${NEXT_PUBLIC_SITE_URL}/invoices/[id]` 형식으로 조립한다. Vercel 환경변수에도 등록 필요.

### 배포

- **Vercel** - Next.js 최적화 배포 (ISR 지원)

---

## 비기능 요구사항

### 캐싱 전략

| 페이지           | revalidate | 이유                       |
| ---------------- | ---------- | -------------------------- |
| `/invoices`      | 60초       | 목록은 자주 변경될 수 있음 |
| `/invoices/[id]` | 300초      | 개별 견적은 변경 빈도 낮음 |

Notion API 호출은 서버에서만 발생하며, `queryDatabase` / `getPageById`는 Server Component 또는 Server Action에서만 호출합니다.

### 보안

- `NOTION_API_KEY`는 서버 환경변수 전용 — `NEXT_PUBLIC_` 접두사 사용 금지
- `/invoices/[id]` 는 의도적으로 공개 라우트 (별도 인증 없음)
- Notion 데이터베이스는 Internal Integration 전용으로 외부 공개하지 않음
- 클라이언트 사이드에서 Notion API를 직접 호출하지 않음
- `NEXT_PUBLIC_SITE_URL`은 공개 URL이므로 클라이언트 노출 허용 — 단, Notion 키와 혼동하지 않도록 Zod 스키마에서 명시적으로 구분

---

## 파일 구조 (목표)

```
src/
├── app/
│   ├── (admin)/                        # 어드민 라우트 그룹 (F005)
│   │   ├── layout.tsx                  # 어드민 공통 레이아웃 (사이드바 + 헤더)
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── invoices/
│   │       └── page.tsx                # F001, F005, F006: 어드민 견적서 목록
│   ├── invoices/
│   │   └── [id]/
│   │       └── page.tsx                # F002, F003, F004: 견적서 상세 (공개, 어드민 레이아웃 없음)
│   └── layout.tsx                      # 루트 레이아웃 (ThemeProvider 래핑, F007)
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx            # 어드민 사이드바 (F005)
│   │   ├── AdminHeader.tsx             # 어드민 헤더 — 다크모드 토글 포함 (F005, F007)
│   │   └── CopyLinkButton.tsx          # 링크 복사 버튼 (F006, Client Component)
│   ├── invoice/
│   │   ├── InvoiceCard.tsx             # 목록 행 컴포넌트
│   │   ├── InvoiceDetail.tsx           # 상세 레이아웃 컴포넌트
│   │   ├── InvoiceItemTable.tsx        # 견적 항목 테이블
│   │   ├── InvoiceSummary.tsx          # 소계/부가세/총액
│   │   ├── StatusBadge.tsx             # 상태 뱃지 (F011)
│   │   └── PrintButton.tsx             # PDF 저장 버튼 (F003, Client Component)
│   └── ui/
│       └── theme-toggle.tsx            # 라이트/다크/시스템 토글 버튼 (F007, Client Component)
├── providers/
│   └── ThemeProvider.tsx               # next-themes Provider 래퍼 (F007)
├── lib/
│   └── notion/
│       ├── client.ts
│       ├── queries.ts
│       ├── transformers.ts
│       └── invoice.ts                  # Invoice 타입 정의 + 매핑 함수
└── types/
    └── invoice.ts                      # Invoice, InvoiceItem 인터페이스
```
