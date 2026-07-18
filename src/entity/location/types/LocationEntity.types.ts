export type LocationEntityTypes = 'woods'
  | 'plains'
  | 'mine'
  | 'city'
  | 'mountains'
  | 'town'
  | 'adv_guild'
  | 'mages_guild'
  | 'blacksmith'
  | 'alchemist'
  | 'shop'

export interface LocationEntity {
  id: string
  settlementId?: string
  type: LocationEntityTypes
  name: string
  travelMs: number
  description: string
  level: number
  linkedLocationIds: string[]
  mobIds: string[]
  itemIds: string[]
  questIds: string[]
}