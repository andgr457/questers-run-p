export type ProfessionEntityType =
  | 'gathering'
  | 'mining'
  | 'woodcutting'
  | 'fishing'
  | 'hunting'
  | 'crafting'

export interface ProfessionEntity {
  id: string

  title: string
  description: string

  type: ProfessionEntityType

  icon?: string
}