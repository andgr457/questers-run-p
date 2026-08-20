import type { EntityAttributeProperty } from './EntityBase.types'

export type SkillApplicationType =
  'melee:target'
  | 'melee:aoe'
  | 'ranged:target'
  | 'ranged:aoe'
  | 'spell:target'
  | 'spell:aoe'
  | 'spell:self'

export type SkillApplicationElementType = 
  'holy'
  | 'cursed'
  | 'fire'
  | 'earth'
  | 'wind'
  | 'water'
  | 'ice'
  | 'smoke'
  | 'physical'
  | 'projectile'
  | 'shield'

export interface SkillApplicationAttributes {
  hp: number
  mana: number
  stamina: number
}

export interface SkillApplicationAttributesSelf {
  barrier: number
  heal: {
    overTime: number
    instant: number
  }
}

export interface SkillApplicationAttributesTarget extends SkillApplicationAttributes {
  stun: number
  bleed: number 
  poison: number
  interrupt: boolean
}

export interface Skill {
  id: string
  title: string
  description: string
  level: number
  levelRequired: number
  xp: EntityAttributeProperty
  applications: {
    base: SkillApplicationType
    elements: SkillApplicationElementType[]
    target: SkillApplicationAttributesTarget
    self: SkillApplicationAttributes
  }
  cast: number
  cooldown: number
}
