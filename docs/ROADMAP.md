# Invoice Web 고도화 로드맵

MVP로 완성된 Notion 기반 견적서 공유 서비스를 어드민 친화적 UI, 공유 편의 기능, 다크모드를 갖춘 운영 가능한 서비스로 확장한다.

## 개요

Invoice Web MVP는 이미 모든 핵심 기능이 구현 완료되었습니다 (상세: `docs/roadmaps/ROADMAP_v1.md`):

- **견적서 공개 조회**: 인증 없이 `/invoices/[id]` URL로 견적서 상세 확인
- **PDF 다운로드**: `window.print()` + `@media print` CSS 기반 저장
- **Notion 연동 + ISR**: 목록 60s / 상세 300s 캐싱, 자체 DB 없음
- **배포 완료**: https://uinvoice-web2-b362.vercel.app (Vercel)

본 고도화 로드맵은 MVP의 기본 목록 화면을 운영자가 실제로 사용할 수 있는 **관리자 경험**으로 끌어올리는 것을 목표로 하며, 다음 3가지를 추가합니다:

- **관리자 레이아웃(Admin Layout)**: 사이드바/헤더를 갖춘 어드민 대시보드 레이아웃으로 견적서 목록 제공 (`(admin)` 라우트 그룹)
- **클라이언트 링크 복사**: 목록에서 각 견적서의 공개 URL을 클립보드에 복사 + 토스트 피드백
- **다크모드**: 시스템 감지 + 수동 토글 (`next-themes`), 헤더에 토글 버튼 배치

> **유지 원칙**: 공개 견적서 상세 라우트(`/invoices/[id]`)는 클라이언트 노출용이므로 어드민 레이아웃과 분리하여 변경하지 않습니다. Notion이 유일한 데이터 소스이며 앱 자체 DB는 도입하지 않습니다.

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-admin-layout.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `006`이라면 `005`와 `004`를 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **Notion API 연동 및 비즈니스 로직(링크 복사/테마) 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 5: 애플리케이션 골격 구축 ✅

- **Task 010: 어드민 라우트 그룹 구조 및 레이아웃 골격 생성** ✅ - 완료
  - ✅ `src/app/(admin)/layout.tsx` 어드민 공통 레이아웃 골격 생성 (사이드바 영역 + 헤더 영역 + 콘텐츠 슬롯 구조만)
  - ✅ `src/app/(admin)/invoices/page.tsx` 어드민 견적서 목록 빈 껍데기 생성
  - ✅ 기존 `/invoices/page.tsx` → `(admin)` 그룹으로 이전 경로 결정 (URL 유지: `/invoices`)
  - ✅ 공개 상세 라우트 `src/app/invoices/[id]/page.tsx`는 어드민 레이아웃에 포함되지 않도록 라우트 그룹 경계 검증
  - ✅ `src/app/(admin)/loading.tsx`, `error.tsx` 세그먼트 파일 골격 추가

- **Task 011: 다크모드 인프라 구축 (ThemeProvider · Tailwind 설정)** ✅ - 완료
  - ✅ `next-themes` 설치 및 `src/components/providers/theme-provider.tsx` 작성 (`attribute="class"`, `defaultTheme="system"`, `enableSystem`)
  - ✅ 루트 `src/app/layout.tsx`에 `ThemeProvider` 래핑 + `<html suppressHydrationWarning>` 적용
  - ✅ TailwindCSS v4 다크모드 설정 (`@custom-variant dark`)을 `globals.css`에 반영
  - ✅ 다크모드용 CSS 변수(라이트/다크 토큰) 정의 및 shadcn 토큰 매핑 확인
  - ✅ `@media print` 스타일이 다크모드 영향 없이 항상 라이트로 출력되는지 골격 단계에서 점검 포인트 기록

### Phase 6: UI/UX 완성 (더미 데이터 활용)

- **Task 012: 어드민 UI 컴포넌트 구현 (사이드바 · 헤더 · 다크모드 토글)**
  - shadcn/ui 컴포넌트 추가: `npx shadcn@latest add dropdown-menu`, `sonner` 등 필요 항목
  - `src/components/admin/AdminSidebar.tsx` 네비게이션 사이드바 (메뉴 항목 더미)
  - `src/components/admin/AdminHeader.tsx` 어드민 헤더 (타이틀 + 우측 액션 영역, 다크모드 토글 슬롯)
  - `src/components/ui/theme-toggle.tsx` 라이트/다크/시스템 전환 토글 버튼 (Lucide `Sun`/`Moon` 아이콘)
  - 반응형: 모바일에서 사이드바 접힘/드로어 처리, 데스크탑 고정 사이드바
  - `(admin)/layout.tsx`에 사이드바·헤더 실제 배치 (더미 상태)

- **Task 013: 어드민 견적서 목록 UI + 링크 복사 버튼 UI 구현 (더미 데이터)**
  - 어드민 견적서 목록 테이블/카드 UI 완성 (상태 뱃지, 발행일 정렬 표시 — 기존 `InvoiceCard`/`StatusBadge` 재사용)
  - `src/components/admin/CopyLinkButton.tsx` 링크 복사 버튼/아이콘 UI 구현 (아직 클립보드 동작 미연결, UI 상태만)
  - 각 목록 행에 CopyLinkButton 배치 및 hover/포커스 인터랙션 스타일
  - 라이트/다크모드 양쪽에서 목록·사이드바·헤더 시각 검증
  - 더미 데이터로 전체 어드민 화면 플로우 렌더링 확인

### Phase 7: 핵심 기능 구현

- **Task 014: 어드민 견적서 목록 실데이터 연동 (Notion API)** - 우선순위
  - `(admin)/invoices/page.tsx`에서 `queryDatabase(NOTION_DATABASE_ID, { sorts: [{ property: '발행일', direction: 'descending' }] })` 호출 (기존 매핑 레이어 재사용)
  - 더미 데이터를 실제 `Invoice[]`로 교체
  - `export const revalidate = 60` ISR 유지/검증
  - Playwright MCP로 어드민 목록 렌더링/정렬/상태 뱃지/빈 목록 통합 테스트
  - **테스트 체크리스트** 작업 파일에 포함

- **Task 015: 링크 복사 기능 구현 + 토스트 피드백**
  - 공개 URL 조립 유틸 작성: `${NEXT_PUBLIC_SITE_URL}/invoices/[notionPageId]` (환경변수 `NEXT_PUBLIC_SITE_URL` 추가, `src/lib/env.ts` Zod 스키마 확장)
  - `CopyLinkButton`에 `navigator.clipboard.writeText()` 연결, 클립보드 미지원 환경 폴백 처리
  - `sonner`(또는 shadcn toast) 토스트로 복사 성공/실패 피드백 표시, `(admin)/layout.tsx`에 `<Toaster />` 배치
  - 복사된 URL이 공개 상세 페이지로 정상 접근되는지 왕복 검증
  - Playwright MCP로 복사 클릭 → 토스트 노출 → 클립보드 값 검증 E2E 테스트
  - **테스트 체크리스트** 작업 파일에 포함

- **Task 015-1: 고도화 기능 통합 테스트 (Playwright MCP)**
  - 전체 어드민 플로우 테스트: 어드민 목록 진입 → 링크 복사 → 다크모드 토글 → 공개 상세로 이동
  - 다크모드 토글 동작 검증: 시스템 감지, 수동 전환, 새로고침 후 로컬스토리지 테마 유지(FOUC 없음)
  - 링크 복사 정확성 검증: 생성 URL 형식, 클립보드 값, 토스트 메시지
  - 에러/엣지 케이스: 클립보드 권한 거부, 빈 견적서 목록, 모바일 사이드바 토글, 공개 상세 라우트가 어드민 레이아웃에 노출되지 않음 확인

### Phase 8: 최적화 및 배포

- **Task 016: 성능 최적화 및 배포 검증**
  - 다크모드 하이드레이션 점검 (`suppressHydrationWarning`, FOUC 제거), 테마 전환 리렌더 비용 확인
  - 어드민 레이아웃 컴포넌트 Server/Client 경계 최적화 (사이드바/헤더 정적화, 토글·복사 버튼만 Client)
  - `NEXT_PUBLIC_SITE_URL` 등 신규 환경변수 Vercel 등록 및 프로덕션 URL 반영
  - `npm run check-all` / `npm run build` 통과 확인 후 배포
  - 배포 후 Playwright MCP로 프로덕션 스모크 테스트 (어드민 목록 · 링크 복사 · 다크모드)

---

**📅 최종 업데이트**: 2026-06-30
**📊 진행 상황**: Phase 5 완료 (2/8 Tasks 완료, 25%)
**🔗 이전 단계**: MVP 완료 — `docs/roadmaps/ROADMAP_v1.md`
