---
name: notion-base-layer-location
description: invoice-web의 Notion 기반 레이어 파일 위치 및 구조 (client 싱글톤, transformers, queries, env).
metadata:
  type: project
---

invoice-web 프로젝트의 Notion 기반 레이어 위치:

- `src/lib/env.ts` — Zod로 env 검증. `NOTION_API_KEY`, `NOTION_DATABASE_ID`가 필수 문자열로 추가됨(둘 다 서버 전용, NEXT*PUBLIC* 접두사 없음).
- `src/lib/notion/client.ts` — `notion` 싱글톤. globalThis 캐싱으로 HMR 중복 인스턴스 방지. production에서는 globalThis 캐싱 안 함.
- `src/lib/notion/transformers.ts` — 순수 함수 추출기: `extractTitle/extractRichText/extractNumber/extractSelect/extractDate/extractCheckbox/extractUrl`. 내부 `narrow()` 헬퍼가 prop.type을 검사해 `Extract<NotionPropertyValue, {type:T}>`로 좁힘. `NotionPropertyValue = PageObjectResponse['properties'][string]` 타입도 export.
- `src/lib/notion/queries.ts` — `queryDatabase(databaseId, options?)`, `getPageById(pageId)`. database_id→data_source_id 해석을 모듈 레벨 `Map` 캐시(`dataSourceIdCache`)로 메모이즈. `QueryDatabaseOptions` 타입은 `QueryDataSourceParameters`에서 filter/sorts/page_size/start_cursor만 Pick.

**의도적으로 미구현(요청 범위 밖):** 견적서/Invoice 도메인 로직, PDF, 페이지/컴포넌트/Server Actions. 도메인 로직은 이 기반 레이어 위에 별도로 쌓을 것.

**How to apply:** Notion 데이터 접근 코드를 새로 짤 때 이 파일들을 재사용/확장. v5 API 주의사항은 [[notion-sdk-v5-breaking-changes]] 참조.
