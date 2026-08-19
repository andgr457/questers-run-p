import type { UpgradeMetaProgressDirection } from '../../upgrade/types/Upgrade.types'

export type EntityPropertyType = 
  'statistic'
  | 'attribute'
  | 'talent'

export interface EntityProperty {
  title: string
  description: string
  type: EntityPropertyType
  level: number
  xp: number
  xpNextLevel: number
  value: number
  valueMax: number
  progressDirection: UpgradeMetaProgressDirection
}

export interface NormalCursed {
  normal: number
  cursed: number
}

export interface EntityMobStats {
  normal: number
  cursed: number
  bosses: {
    world: NormalCursed
    dungeons: NormalCursed
    raids: NormalCursed
  }
}

export interface EntityBaseStats {
  achievements: number
  quests: {
    solo: number
    party: number
    dungeon: number
    raids: number
  }
  members: {
    total: number
    highRank: number
  }
  dungeons: NormalCursed
  raids: NormalCursed
  mobs: {
    hunted: EntityMobStats
    quests: EntityMobStats
    party: EntityMobStats
  }
}

export interface EntityBaseAttributes {
  hp: EntityProperty
  mana: EntityProperty
  stamina: EntityProperty
  strength: EntityProperty
  intellect: EntityProperty
  agility: EntityProperty
}

export type EntityTalentCriticalType = 
  'melee'
  | 'spell'
  | 'evade'
  | 'block'

export interface EntityTalentCritical {
  title: string
  type: EntityTalentCriticalType
  chance: number
  value: number
}

export interface EntityBaseTalents {
  criticals: {
    melee: EntityTalentCritical
    spell: EntityTalentCritical
    block: EntityTalentCritical
    evade: EntityTalentCritical
  }
}

export interface EntityProfessions {
  
}

export interface EntityBase {
  id: string
  title: string
  description: string
  gold: number
  xp: number
  xpNextLevel: number
  level: number
  guildId: string
  tokens: number
  createdDate: number
  professions: EntityProfessions
  stats: EntityBaseStats
  attributes: EntityBaseAttributes
  talents: EntityBaseTalents
}

