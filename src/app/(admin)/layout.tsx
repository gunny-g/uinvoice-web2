import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex h-screen">
      {/* 데스크탑 사이드바 (md 이상에서만 표시) */}
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 헤더 (모바일 햄버거 + 타이틀 + 다크모드 토글) */}
        <AdminHeader />

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
