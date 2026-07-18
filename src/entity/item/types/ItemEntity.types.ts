
export type ItemType = 'resource'

export interface ItemEntity {
  id: string
  name: string
  namePlural: string,
  description: string
  type: ItemType
}