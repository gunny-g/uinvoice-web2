import { ThemeToggle } from '@/components/ui/theme-toggle'

import { AdminMobileNav } from './AdminMobileNav'

export function AdminHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center border-b px-4">
      {/* 모바일: 햄버거 버튼 */}
      <AdminMobileNav />

      {/* 타이틀 */}
      <h1 className="ml-2 flex-1 text-base font-semibold md:ml-0">
        어드민 대시보드
      </h1>

      {/* 우측 액션 영역: 다크모드 토글 */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
