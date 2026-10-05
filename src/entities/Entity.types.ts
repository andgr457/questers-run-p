
export interface EntityValueWithMax {
  value: number
  max: number
}

export interface EntityBase {
  id?: number
  name: string
}

export interface EntityLevel {
  level: number
  xp: EntityValueWithMax
}

export interface EntityStats {
  health: EntityValueWithMax
  mana: EntityValueWithMax
  stamina: EntityValueWithMax
}

export interface EntityAttributes {
  strength: number
  intelligence: number
  agility: number
}

export type EntityWithLevelStatsAndAttributes = EntityBase & EntityLevel & EntityStats & EntityAttributes