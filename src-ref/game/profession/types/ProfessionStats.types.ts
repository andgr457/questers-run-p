export type ProfessionStatLabel = 'Gathering' 
  | 'Mining'
  | 'Fishing'
  | 'Cooking'
  | 'Smithing'
  | 'Woodworking'
  | 'Crafting' 
  | 'Alchemy'
  | 'Engineering'
  | 'Construction'

export type ProfessionStatName = 'gathering'
  | 'mining'
  | 'fishing'
  | 'cooking'
  | 'smithing'
  | 'woodworking'
  | 'crafting' 
  | 'alchemy'
  | 'engineering'
  | 'construction'

export interface ProfessionStats {
  gathering: ProfessionStat
  mining: ProfessionStat
  fishing: ProfessionStat
  cooking: ProfessionStat
  smithing: ProfessionStat
  woodworking: ProfessionStat
  crafting: ProfessionStat
  alchemy: ProfessionStat
}

export interface ProfessionStat {
  label: ProfessionStatLabel
  value: number
  valueMax: number
  level: number
  xp: number
  xpNextLevel: number
  sort: number
}