# Task 005: PDF 인쇄 레이아웃 및 PrintButton 구현

## 개요

`window.print()` 기반 PDF 저장 기능과 A4 인쇄 최적화 CSS를 구현합니다.
별도 라이브러리 없이 브라우저 인쇄 대화상자를 통해 PDF로 저장하는 플로우를 완성합니다.

## 관련 파일

- `src/app/globals.css` (수정 — @media print 추가)
- `src/components/invoice/PrintButton.tsx` (신규)
- `src/app/invoices/[id]/page.tsx` (수정 — PrintButton 삽입)

## 의존성

Task 004 완료 후 진행

## 수락 기준

- [ ] "PDF 저장" 버튼 클릭 시 브라우저 인쇄 대화상자가 열림
- [ ] 인쇄 미리보기에서 네비게이션 링크와 PDF 버튼이 보이지 않음
- [ ] 인쇄 미리보기에서 견적서 본문(헤더/테이블/총금액)이 A4 용지에 정상 렌더링됨
- [ ] 페이지 여백이 20mm로 설정됨
- [ ] `npm run check-all` 통과

## 구현 단계

- [ ] **Step 1**: `src/app/globals.css` 끝에 print 스타일 추가

  ```css
  @page {
    margin: 20mm;
    size: A4;
  }

  @media print {
    .no-print {
      display: none !important;
    }

    body {
      font-size: 12pt;
      background: white !important;
      color: black !important;
    }
  }
  ```

  - `@page`는 Tailwind `@layer` 밖에 배치 (layer 안에 넣으면 브라우저에서 무시됨)

- [ ] **Step 2**: `src/components/invoice/PrintButton.tsx` 작성
  - `'use client'` 디렉티브 필수 (`window.print()` 사용)
  - `className="no-print"` — 버튼 자체도 인쇄에서 숨겨짐
  - Lucide `Printer` 아이콘 + "PDF 저장" 텍스트

- [ ] **Step 3**: `src/app/invoices/[id]/page.tsx`에 통합
  - nav 영역을 `<div className="no-print">` 로 감쌈
  - `PrintButton` import 및 nav 우측에 배치
  - `Container`에 `print:py-0` 추가 (인쇄 시 상단 여백 제거)
