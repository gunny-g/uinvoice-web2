# Invoice Web

Notion에 입력한 견적서 데이터를 클라이언트가 로그인 없이 웹 URL로 확인하고 PDF로 저장할 수 있는 서비스입니다.

## 프로젝트 개요

**목적**: 소규모 프리랜서/사업자가 Notion을 CMS로 사용하여 견적서를 관리하고, 고객이 별도 로그인 없이 공유 URL로 견적 내용을 확인 및 PDF 저장할 수 있도록 합니다.

**사용자**:

- 어드민 (사업자): Notion에 견적서 데이터 입력 후 고객에게 URL 전달
- 클라이언트 (고객): 받은 URL로 견적서 확인 및 PDF 다운로드

## 주요 페이지

| 경로             | 설명                                                      |
| ---------------- | --------------------------------------------------------- |
| `/invoices`      | 견적서 목록 - Notion DB 전체 견적서 테이블                |
| `/invoices/[id]` | 견적서 상세 - Notion 페이지 ID 기반 공개 접근 및 PDF 출력 |

## 핵심 기능

- **견적서 목록 조회**: Notion DB 쿼리로 전체 견적서를 테이블로 표시
- **견적서 상세 조회**: Notion 페이지 ID로 단건 조회 후 인쇄 가능한 레이아웃 렌더링
- **PDF 다운로드**: `window.print()` + `@media print` CSS 방식 (별도 라이브러리 불필요)
- **공개 URL 접근**: 인증 없이 `/invoices/[id]` 접근 가능

## 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui (new-york style)
- **외부 연동**: @notionhq/client v5

## 시작하기

### 환경변수 설정

`.env.example`을 복사하여 `.env.local`을 생성하고 값을 입력합니다.

```bash
cp .env.example .env.local
```

```env
NOTION_API_KEY=secret_xxx       # Notion Internal Integration Token
NOTION_DATABASE_ID=xxx          # 견적서 데이터베이스 ID
```

### 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Turbopack)
npm run dev

# 프로덕션 빌드
npm run build
```

## Notion 데이터베이스 스키마

견적서 DB에 다음 컬럼을 생성합니다.

| 컬럼명   | 프로퍼티 타입                            | 필수 |
| -------- | ---------------------------------------- | ---- |
| 제목     | Title                                    | Y    |
| 고객사   | Rich Text                                | Y    |
| 발행일   | Date                                     | Y    |
| 유효기간 | Date                                     | Y    |
| 공급자   | Rich Text                                | Y    |
| 상태     | Select (`작성중`/`전송됨`/`승인`/`거절`) | Y    |
| 소계     | Number                                   | Y    |
| 부가세율 | Number                                   | N    |
| 총액     | Number                                   | Y    |
| 메모     | Rich Text                                | N    |

견적 항목은 Notion 페이지 본문(테이블 블록)으로 관리합니다.

## 개발 상태

- 기본 프로젝트 구조 설정 완료
- Notion API 클라이언트 구현 완료 (`src/lib/notion/`)
- 견적서 목록/상세 페이지 구현 예정

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항
- [개발 가이드](./CLAUDE.md) - 개발 지침
