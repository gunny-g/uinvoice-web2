---
name: notion-sdk-v5-breaking-changes
description: 이 프로젝트는 @notionhq/client v5를 사용 — databases.query가 제거되고 dataSources.query로 대체됨. v5로 코드 작성 시 필수 참고.
metadata:
  type: project
---

이 프로젝트(invoice-web)는 `@notionhq/client` v5.x(현재 ^5.22.0)를 사용한다. v4와 API가 다르므로 주의.

**핵심 변경(Why: Notion이 "data source" 개념을 도입, 하나의 DB가 여러 data source를 가질 수 있게 됨):**

- `notion.databases`는 `retrieve` / `create` / `update`만 제공. **`databases.query`는 제거됨.**
- 쿼리는 반드시 `notion.dataSources.query({ data_source_id, filter, sorts, page_size, start_cursor })` 사용.
- `database_id`로는 바로 쿼리 불가 → `notion.databases.retrieve({ database_id })`로 받은 객체의 `data_sources[0].id`가 data_source_id.
- `databases.retrieve` 응답은 `GetDatabaseResponse = PartialDatabaseObjectResponse | DatabaseObjectResponse` 유니온. `data_sources` 필드는 full 객체에만 존재 → `isFullDatabase(db)` 헬퍼(`@notionhq/client`에서 export)로 좁힌 뒤 접근해야 타입 통과.
- 페이지 단건 조회는 `notion.pages.retrieve({ page_id })`, 반환 타입 `GetPageResponse`. full 여부는 `isFullPage`로 좁힘.

**유용한 export(모두 `@notionhq/client` 루트):** `isFullDatabase`, `isFullPage`, `isFullPageOrDataSource`, `extractDatabaseId`, `extractPageId`, `extractBlockId`, 타입 `QueryDataSourceParameters` / `QueryDataSourceResponse` / `GetPageResponse` / `PageObjectResponse`.

**How to apply:** v5에서 DB 쿼리 코드를 쓸 때 `databases.query`를 절대 쓰지 말 것. database_id → data_source_id 해석이 필요하며, 이 해석은 retrieve 1회 호출이 들므로 캐싱 권장. 관련 구현은 [[notion-base-layer-location]] 참조.
