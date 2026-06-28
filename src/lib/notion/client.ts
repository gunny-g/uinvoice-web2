import { Client } from '@notionhq/client'

import { env } from '@/lib/env'

/**
 * Next.js 개발 환경의 Hot Reload(HMR)는 모듈을 반복적으로 재평가하므로
 * 매번 새로운 Notion Client 인스턴스가 생성될 수 있습니다.
 * globalThis에 인스턴스를 캐싱하여 단일 인스턴스만 유지합니다.
 */
const globalForNotion = globalThis as unknown as {
  notion: Client | undefined
}

/**
 * Notion API 클라이언트 싱글톤.
 * env.NOTION_API_KEY(통합 토큰)로 초기화됩니다.
 */
export const notion: Client =
  globalForNotion.notion ??
  new Client({
    auth: env.NOTION_API_KEY,
  })

// 운영 환경에서는 모듈 캐시가 유지되므로 전역 캐싱이 불필요합니다.
if (env.NODE_ENV !== 'production') {
  globalForNotion.notion = notion
}
