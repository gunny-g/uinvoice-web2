import { FileText, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: '/invoices', label: '견적서 목록', icon: FileText },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        'hidden w-64 shrink-0 flex-col border-r md:flex',
        'bg-sidebar text-sidebar-foreground',
        className
      )}
    >
      {/* 로고 영역 */}
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/invoices"
          className="flex items-center gap-2 font-semibold"
        >
          <LayoutDashboard className="text-sidebar-primary size-5" />
          <span>Invoice Web</span>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-auto px-3 py-4" aria-label="어드민 메뉴">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
