export type WorldLocationType = 'void'
  | 'camp'
  | 'plains'
  | 'town'
  | 'guild'
  | 'woods'
  | 'cave'
  | 'dungeon'
  | 'bridge'
  | 'river'

export interface WorldLocation {
  id: string
  name: string
  description: React.ReactNode
  type: WorldLocationType
  connections: WorldConnection[]
}

export interface WorldConnection {
  toId: string
  travelMs: number
}
