export interface EntityBase {
  id: string
  title: string
  description: string
}

export interface EntityAttributeProperty {
  title: string
  value: number
  valueMax: number
  progressBarType: 'fill' | 'drain'
}

export interface EntityAttributes {
  hp: EntityAttributeProperty
  stamina: EntityAttributeProperty
  mana: EntityAttributeProperty
  xp: EntityAttributeProperty
}