import {
  isFullDatabase,
  type GetPageResponse,
  type QueryDataSourceParameters,
  type QueryDataSourceResponse,
} from '@notionhq/client'

import { notion } from '@/lib/notion/client'

/**
 * queryDatabase에 전달할 수 있는 쿼리 옵션.
 * Notion SDK v5의 QueryDataSourceParameters에서 자주 쓰이는 필드만 노출합니다.
 * (data_source_id는 내부에서 자동 해석하므로 제외합니다.)
 */
export type QueryDatabaseOptions = Pick<
  QueryDataSourceParameters,
  'filter' | 'sorts' | 'page_size' | 'start_cursor'
>

/**
 * database_id -> data_source_id 해석 결과 캐시.
 *
 * Notion API v5 / SDK v5부터 쿼리는 데이터베이스가 아닌 "data source"를 대상으로 합니다.
 * 하나의 데이터베이스는 1개 이상의 data source를 가질 수 있으며,
 * database_id로 직접 쿼리할 수 없으므로 databases.retrieve로 data_source_id를 얻어야 합니다.
 *
 * 동일한 database_id에 대한 반복 호출 시 매번 retrieve API를 호출하면
 * 불필요한 네트워크 비용과 rate limit 소모가 발생하므로 모듈 메모리에 캐싱합니다.
 */
const dataSourceIdCache = new Map<string, string>()

/**
 * database_id에 연결된 첫 번째 data source ID를 해석합니다.
 * @param databaseId Notion 데이터베이스 ID
 * @returns data source ID
 * @throws 데이터베이스를 조회할 수 없거나 data source가 없을 때
 */
async function resolveDataSourceId(databaseId: string): Promise<string> {
  const cached = dataSourceIdCache.get(databaseId)
  if (cached) return cached

  const database = await notion.databases.retrieve({
    database_id: databaseId,
  })

  // 권한 부족 등으로 partial 응답이 오면 data_sources에 접근할 수 없습니다.
  if (!isFullDatabase(database)) {
    throw new Error(
      `데이터베이스(${databaseId})의 전체 정보를 가져올 수 없습니다. 통합(integration)에 데이터베이스 접근 권한이 있는지 확인하세요.`
    )
  }

  const dataSourceId = database.data_sources[0]?.id
  if (!dataSourceId) {
    throw new Error(
      `데이터베이스(${databaseId})에 연결된 data source가 없습니다.`
    )
  }

  dataSourceIdCache.set(databaseId, dataSourceId)
  return dataSourceId
}

/**
 * Notion 데이터베이스를 쿼리합니다.
 *
 * 필터/정렬/페이지네이션 옵션을 지원하며, 내부적으로 database_id를
 * data_source_id로 해석하여 SDK v5의 dataSources.query를 호출합니다.
 *
 * @param databaseId 조회할 Notion 데이터베이스 ID
 * @param options 필터, 정렬, page_size, start_cursor 등 쿼리 옵션
 * @returns Notion 쿼리 응답(results, has_more, next_cursor 포함)
 */
export async function queryDatabase(
  databaseId: string,
  options?: QueryDatabaseOptions
): Promise<QueryDataSourceResponse> {
  const dataSourceId = await resolveDataSourceId(databaseId)

  return notion.dataSources.query({
    data_source_id: dataSourceId,
    ...options,
  })
}

/**
 * Notion 페이지를 ID로 단건 조회합니다.
 * @param pageId 조회할 페이지 ID
 * @returns 페이지 객체(GetPageResponse)
 */
export async function getPageById(pageId: string): Promise<GetPageResponse> {
  return notion.pages.retrieve({
    page_id: pageId,
  })
}
