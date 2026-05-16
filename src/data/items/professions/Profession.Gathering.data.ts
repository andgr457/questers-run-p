import { ProfessionIds, ProfessionTypes, type Profession } from '../../../interfaces/professsions/Profession.types';



export const PROFESSION_GATHERING: Profession = {
  id: ProfessionIds.Gathering,
  title: 'Gathering',
  description: 'Collect natural resources for crafting and quests.',
  type: ProfessionTypes.Gathering
}
