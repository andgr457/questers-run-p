export type LocationTypes = 'woods'
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

export interface Location {
  id: string
  type: LocationTypes
  name: string
  description: string
  linkedLocationIds: string[]
}