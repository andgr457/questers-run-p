export type UpgradeMetaProgressDirection = 'empty' | 'fill'

export interface UpgradeMeta {
  title: string
  description: string
  value: number
  max: number
  progressDirection: UpgradeMetaProgressDirection
}

export interface Upgrade {
  quest: UpgradeMeta
  profession: {
    mining: UpgradeMeta
    smithing: UpgradeMeta
    leatherworking: UpgradeMeta
    tailoring: UpgradeMeta
    
    
    farming: UpgradeMeta
    ranching: UpgradeMeta
    
    fishing: UpgradeMeta
    cooking: UpgradeMeta
    hunting: UpgradeMeta
    
    arboriculture: UpgradeMeta
    botany: UpgradeMeta
    alchemy: UpgradeMeta
    
    artifice: UpgradeMeta
    carpentry: UpgradeMeta
    masonry: UpgradeMeta
  }
}

export interface Upgrades {
  xp: Upgrade
  gold: Upgrade
  speed: Upgrade
  stats: {
    hp: UpgradeMeta
    stamina: UpgradeMeta
    mana: UpgradeMeta
  }
  talents: {
    strength: UpgradeMeta
    intellect: UpgradeMeta
    agility: UpgradeMeta
  }
}
