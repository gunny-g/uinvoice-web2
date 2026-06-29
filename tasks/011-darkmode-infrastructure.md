# Task 011: 다크모드 인프라 구축 (ThemeProvider · Tailwind 설정)

## 개요

`next-themes` 기반 다크모드 인프라를 구축합니다. MVP 개발 단계에서 이미 전체 구현이 완료된 상태입니다.

## 관련 파일

- `src/components/providers/theme-provider.tsx` — NextThemesProvider 래퍼 컴포넌트
- `src/app/layout.tsx` — ThemeProvider 래핑 + `<html suppressHydrationWarning>`
- `src/app/globals.css` — TailwindCSS v4 다크모드 설정 + CSS 변수

## 의존성

없음 (독립 태스크)

## 수락 기준

- [x] `next-themes ^0.4.6` 설치됨
- [x] `src/components/providers/theme-provider.tsx` 생성 (`NextThemesProvider` 래퍼, `'use client'`)
- [x] 루트 `src/app/layout.tsx`에 `ThemeProvider` 래핑 (`attribute="class"`, `defaultTheme="system"`, `enableSystem`)
- [x] `<html suppressHydrationWarning>` 적용 (하이드레이션 불일치 억제)
- [x] `globals.css`에 `@custom-variant dark (&:is(.dark *))` 설정 (TailwindCSS v4 다크모드)
- [x] `:root` / `.dark` CSS 변수 정의 (shadcn/ui 토큰 포함 — `--background`, `--foreground`, `--sidebar-*` 등)
- [x] `@media print` 스타일에서 `background: white !important; color: black !important;` 적용 (다크모드 영향 없이 라이트로 출력)
- [x] `sonner ^2.0.7` 설치 + `<Toaster />` 루트 레이아웃에 배치

## 구현 상태

**MVP 단계에서 모두 완료됨.** 추가 코드 변경 없음.

### 구현 세부 사항

**`src/components/providers/theme-provider.tsx`**

```
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**`src/app/layout.tsx`**

- `<html lang="ko" suppressHydrationWarning>`
- `ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange`
- `<Toaster />` (sonner) 배치

**`src/app/globals.css`**

- `@custom-variant dark (&:is(.dark *))` — TailwindCSS v4 class 기반 다크모드
- `:root` — 라이트 테마 CSS 변수 (oklch 색상 토큰)
- `.dark` — 다크 테마 CSS 변수 오버라이드
- `@media print` — 인쇄 시 라이트 강제 (다크모드 무관)

## @media print 검증

다크모드 활성화 상태에서도 PDF 인쇄 시 라이트 배경/텍스트로 출력되는지 점검 포인트:

- `body { background: white !important; color: black !important; }` → 확인 완료
- `.no-print { display: none !important; }` → 확인 완료
