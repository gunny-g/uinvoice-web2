'use client'

import { FileText, LayoutDashboard, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [{ href: '/invoices', label: '견적서 목록', icon: FileText }]

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="메뉴 열기"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="flex h-14 flex-row items-center border-b px-4">
            <SheetTitle asChild>
              <Link
                href="/invoices"
                className="flex items-center gap-2 font-semibold"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="size-5" />
                Invoice Web
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav className="px-3 py-4" aria-label="어드민 메뉴 (모바일)">
            <ul className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      'bg-accent text-accent-foreground'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
