
export interface Attribute {
  name: AttributeLabel
  level: number
  xp: number
  xpNextLevel: number
}

export type AttributeName = 'strength'
  | 'agility'
  | 'intellect'

export type AttributeLabel = 'Strength'
  | 'Agility'
  | 'Intellect'

export interface Attributes {
  strength: Attribute
  agility: Attribute
  intellect: Attribute
}