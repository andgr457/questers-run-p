

export type ProfessionType = 'gathering' | 'mining'
export const ProfessionTypes = {
  Gathering: 'gathering' as ProfessionType,
  Mining: 'mining' as ProfessionType,
}
export const ProfessionIds = {
  Gathering: 'prof_gathering',
  Mining: 'prof_mining'
}

export interface Profession {
  id: string
  title: string
  description: string
  type: ProfessionType
}

export const PROFESSION_GATHERING: Profession = {
  id: ProfessionIds.Gathering,
  title: 'Gathering',
  description: 'Collect natural resources for crafting and quests.',
  type: ProfessionTypes.Gathering
}

export const Professions: Profession[] = [
  PROFESSION_GATHERING,
] 