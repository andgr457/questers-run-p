export type ClassIds = 
  'class_warrior'
  | 'class_paladin'
  | 'class_mage'
  | 'class_druid'
  | 'class_rogue'
  | 'class_hunter'
  | 'class_priest'

export type ClassPartyRole = 
  'tank'
  | 'damage'
  | 'healer'

export type ClassDamageType = 
  'melee'
  | 'spell'
  | 'ranged'

export type ClassArmorRestrictionType =
  'cloth'
  | 'leather'
  | 'mail'
  | 'plate'

export type ClassWeaponRestrictionType =
  'staff'
  | 'wand'
  | 'focus'
  | 'sword_1h'
  | 'sword_2h'
  | 'mace_1h'
  | 'mace_2h'
  | 'glaive'
  | 'quarterstaff'
  | 'bow'
  | 'crossbow'
  | 'shield'
  | 'dual_weild'
  | 'dagger'

export interface CharacterClass {
  id: string
  title: string
  description: string
  partyRoles: ClassPartyRole[]
  damageTypes: ClassDamageType[]
  armorRestrictions: ClassArmorRestrictionType[]
  weaponRestrictions: ClassWeaponRestrictionType[]
  skillIds: string[]
  attributesPerLevel: {
    hp: number
    mana: number
    stamina: number
  }
}