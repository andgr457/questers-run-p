/**
 * mining: UpgradeMeta
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
     masonry: UpgradeMeta+
 */
export type ProfessionType = 
  'mining'
  | 'arbor'

export interface Profession {
  id: string
  title: string
  description: string
}