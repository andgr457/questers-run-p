export type WorldLocationType = 'void'
  | 'camp'
  | 'plains'
  | 'town'
  | 'city'
  | 'guild'
  | 'woods'
  | 'cave'
  | 'dungeon'
  | 'bridge'
  | 'river'
  | 'mountains'

export interface WorldLocation {
  id: string
  regionId: string
  name: string
  description: React.ReactNode
  type: WorldLocationType
  connections: WorldConnection[]
}

export interface WorldConnection {
  toId: string
  travelMs: number
}
