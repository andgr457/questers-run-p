
export type SortDirection = 'asc' | 'desc'

export interface RefDetail {
  ref: React.RefObject<HTMLElement | null>
  text: string
  color?: string
}