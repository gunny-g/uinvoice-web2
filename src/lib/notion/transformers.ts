import type { PageObjectResponse } from '@notionhq/client'

/**
 * Notion 페이지 프로퍼티 값의 유니온 타입.
 * PageObjectResponse.properties 의 각 값이 가질 수 있는 모든 프로퍼티 형태를 포함합니다.
 */
export type NotionPropertyValue = PageObjectResponse['properties'][string]

/**
 * 특정 프로퍼티 타입만 좁혀주는 내부 헬퍼.
 * prop이 존재하고 type이 일치할 때만 해당 타입으로 단언합니다.
 */
function narrow<T extends NotionPropertyValue['type']>(
  prop: NotionPropertyValue | undefined | null,
  type: T
): Extract<NotionPropertyValue, { type: T }> | null {
  if (!prop || prop.type !== type) return null
  return prop as Extract<NotionPropertyValue, { type: T }>
}

/**
 * title 프로퍼티에서 일반 텍스트를 추출합니다.
 * 여러 rich_text 조각이 있으면 모두 이어붙입니다.
 * @returns 추출된 텍스트. 값이 없으면 빈 문자열.
 */
export function extractTitle(
  prop: NotionPropertyValue | undefined | null
): string {
  const title = narrow(prop, 'title')
  if (!title) return ''
  return title.title.map(t => t.plain_text).join('')
}

/**
 * rich_text 프로퍼티에서 일반 텍스트를 추출합니다.
 * @returns 추출된 텍스트. 값이 없으면 빈 문자열.
 */
export function extractRichText(
  prop: NotionPropertyValue | undefined | null
): string {
  const richText = narrow(prop, 'rich_text')
  if (!richText) return ''
  return richText.rich_text.map(t => t.plain_text).join('')
}

/**
 * number 프로퍼티에서 숫자를 추출합니다.
 * @returns 추출된 숫자. 값이 없으면 null.
 */
export function extractNumber(
  prop: NotionPropertyValue | undefined | null
): number | null {
  const number = narrow(prop, 'number')
  return number ? number.number : null
}

/**
 * select 프로퍼티에서 선택된 옵션 이름을 추출합니다.
 * @returns 선택된 옵션 이름. 선택값이 없으면 null.
 */
export function extractSelect(
  prop: NotionPropertyValue | undefined | null
): string | null {
  const select = narrow(prop, 'select')
  return select?.select ? select.select.name : null
}

/**
 * date 프로퍼티에서 시작일 문자열(ISO 8601)을 추출합니다.
 * @returns date.start 값. 값이 없으면 null.
 */
export function extractDate(
  prop: NotionPropertyValue | undefined | null
): string | null {
  const date = narrow(prop, 'date')
  return date?.date ? date.date.start : null
}

/**
 * checkbox 프로퍼티에서 불리언 값을 추출합니다.
 * @returns 체크 여부. 값이 없으면 false.
 */
export function extractCheckbox(
  prop: NotionPropertyValue | undefined | null
): boolean {
  const checkbox = narrow(prop, 'checkbox')
  return checkbox ? checkbox.checkbox : false
}

/**
 * status 프로퍼티에서 상태 이름을 추출합니다.
 * Select 타입과 달리 Notion 전용 Status 타입(●)을 처리합니다.
 * @returns 상태 이름. 값이 없으면 null.
 */
export function extractStatus(
  prop: NotionPropertyValue | undefined | null
): string | null {
  const status = narrow(prop, 'status')
  return status?.status ? status.status.name : null
}

/**
 * url 프로퍼티에서 URL 문자열을 추출합니다.
 * @returns URL 문자열. 값이 없으면 null.
 */
export function extractUrl(
  prop: NotionPropertyValue | undefined | null
): string | null {
  const url = narrow(prop, 'url')
  return url ? url.url : null
}

/**
 * relation 프로퍼티에서 연결된 페이지 ID 목록을 추출합니다.
 * @returns 페이지 ID 배열. 값이 없으면 빈 배열.
 */
export function extractRelation(
  prop: NotionPropertyValue | undefined | null
): string[] {
  const relation = narrow(prop, 'relation')
  if (!relation) return []
  return relation.relation.map(r => r.id)
}

/**
 * formula 프로퍼티에서 숫자 결과값을 추출합니다.
 * @returns 계산된 숫자. 값이 없거나 숫자형이 아니면 null.
 */
export function extractFormula(
  prop: NotionPropertyValue | undefined | null
): number | null {
  const formula = narrow(prop, 'formula')
  if (!formula || formula.formula.type !== 'number') return null
  return formula.formula.number
}
