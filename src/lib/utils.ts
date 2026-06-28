import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 금액을 한국 원화 형식으로 포맷 (예: 1,500,000원)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

// 날짜 문자열을 한국 형식으로 포맷 (예: 2024.01.15)
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date(dateString))
    .replace(/\. /g, '.')
    .replace(/\.$/, '')
}
