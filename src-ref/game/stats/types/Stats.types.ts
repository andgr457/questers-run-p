
export interface Stats {
  health: Stat
  mana: Stat
  stamina: Stat
}

export type StatLabel = 'HP'
  | 'MP'
  | 'STAM'

export type StatName = 'health' 
  | 'mana' 
  | 'stamina'

export interface Stat {
  label: StatLabel
  value: number
  valueMax: number
  sort: number
}
