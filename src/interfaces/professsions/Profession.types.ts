import type { Stat } from '../characters/Character.types'

export interface ProfessionStats {
  gathering?: Stat
  mining?: Stat
  fishing?: Stat
  //...
}

export const ProfessionSort = {
  'Gathering': 0,
  'Mining': 1,
}


export type ProfessionType = 'gathering' | 'mining' | 'fishing'
export const ProfessionTypes = {
  Gathering: 'gathering' as ProfessionType,
  Mining: 'mining' as ProfessionType,
  Fishing: 'fishing' as ProfessionType,
}
export const ProfessionIds = {
  Gathering: 'prof_gathering',
  Mining: 'prof_mining',
  Fishing: 'prof_fishing'
}

export interface Profession {
  id: string
  title: string
  description: string
  type: ProfessionType
}