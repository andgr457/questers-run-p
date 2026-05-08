import type { Stat } from '../characters/Character.types'

export interface ProfessionStats {
  gathering?: Stat
  mining?: Stat
  //...
}

export const ProfessionSort = {
  'Gathering': 0,
  'Mining': 1,
}