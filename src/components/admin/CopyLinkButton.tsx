'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

interface CopyLinkButtonProps {
  invoiceId: string
}

export function CopyLinkButton({ invoiceId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
    const url = `${siteUrl}/invoices/${invoiceId}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('링크가 복사되었습니다')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('링크 복사에 실패했습니다')
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      title="링크 복사"
      aria-label="견적서 링크 복사"
    >
      {copied ? (
        <Check className="size-4 text-green-500" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  )
}
