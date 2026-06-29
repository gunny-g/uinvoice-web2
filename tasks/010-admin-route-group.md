# Task 010: 어드민 라우트 그룹 구조 및 레이아웃 골격 생성

## 개요

Next.js App Router `(admin)` 라우트 그룹을 생성하고 어드민 공통 레이아웃 골격을 구현합니다.
기존 `/invoices` 목록 페이지를 `(admin)` 그룹으로 이전하여 라우팅 충돌을 해소하고,
공개 상세 라우트 `/invoices/[id]`는 변경하지 않습니다.

## 관련 파일

**생성**

- `src/app/(admin)/layout.tsx` — 사이드바+헤더+콘텐츠 placeholder 골격
- `src/app/(admin)/invoices/page.tsx` — 기존 목록 로직 이전 (Notion 연동 유지)
- `src/app/(admin)/invoices/error.tsx` — 에러 바운더리 (`use client`)
- `src/app/(admin)/loading.tsx` — 어드민 로딩 UI 골격
- `src/app/(admin)/error.tsx` — 어드민 최상위 에러 바운더리

**삭제 (라우팅 충돌 해소)**

- `src/app/invoices/page.tsx` → `(admin)/invoices/page.tsx`로 이전
- `src/app/invoices/loading.tsx` → `(admin)/loading.tsx`로 이전
- `src/app/invoices/error.tsx` → `(admin)/invoices/error.tsx`로 이전

**유지 (변경 없음)**

- `src/app/invoices/[id]/` — 공개 상세 라우트 전체

## 의존성

Task 011 완료 후 진행

## 수락 기준

- [x] `src/app/(admin)/layout.tsx` 생성 (사이드바 placeholder + 헤더 placeholder + 콘텐츠 슬롯)
- [x] `src/app/(admin)/invoices/page.tsx` 생성 (Notion 실데이터 연동 유지, `revalidate=60`)
- [x] `src/app/(admin)/invoices/error.tsx` 생성 (`use client` 에러 바운더리)
- [x] `src/app/(admin)/loading.tsx` 생성 (Skeleton 기반 로딩 UI)
- [x] `src/app/(admin)/error.tsx` 생성 (어드민 최상위 에러 바운더리)
- [x] 기존 `src/app/invoices/page.tsx` 삭제 (라우팅 충돌 해소)
- [x] 기존 `src/app/invoices/loading.tsx` 삭제
- [x] 기존 `src/app/invoices/error.tsx` 삭제
- [x] `src/app/invoices/[id]/` 하위 파일 변경 없음
- [x] `npm run build` 성공 (라우팅 충돌 없음)

## 구현 단계

- [x] 1. `tasks/010-admin-route-group.md` 작업 파일 작성
- [x] 2. `src/app/(admin)/layout.tsx` 생성 (placeholder 골격)
- [x] 3. `src/app/(admin)/invoices/page.tsx` 생성 (목록 로직 이전)
- [x] 4. `src/app/(admin)/invoices/error.tsx` 생성
- [x] 5. `src/app/(admin)/loading.tsx` 생성
- [x] 6. `src/app/(admin)/error.tsx` 생성
- [x] 7. 기존 `invoices/page.tsx`, `loading.tsx`, `error.tsx` 삭제
- [x] 8. `npm run build` 성공 확인

## 주의사항

- `(admin)/layout.tsx`의 사이드바·헤더는 Phase 6(Task 012)에서 실제 컴포넌트로 교체
- Phase 5에서는 `div` placeholder만 배치
- `(admin)/invoices/page.tsx`는 실 Notion 데이터 연동 유지 (더미 데이터 아님)
- URL `/invoices`는 `(admin)` 그룹 적용 후에도 그대로 유지
