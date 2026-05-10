import type { QuestWithQuestProgress } from '../components/quests/CharacterQuests';
import type { Character, CharacterClass } from './characters/Character.types';
import type { CharacterHistory } from './history/History.types';
import type { Inventory } from './inventories/Inventory.types';
import type { Item } from './items/Item.types';
import type { Quest, QuestGroup } from './quests/Quests.types';

export interface AppProperties extends AppFunctions {
  location?: string
  character?: Character
  characterClass?: CharacterClass
  characterInventories?: Inventory[]
  characterQuestProgress?: QuestWithQuestProgress
  allQuestsWithProgress?: QuestWithQuestProgress[]
  quests?: Quest[]
  questGroups?: QuestGroup[]
  items?: Item[]
  history?: CharacterHistory[]
}

export interface AppFunctions {
  setLocation?: (location: string) => void
  handleSetCharacter?: (character: Character) => void
  handleResetEverything?: () => void
  handleAddHistory?: (newHistory: CharacterHistory[]) => void
  handleAddInventory?: (inventory: Inventory[]) => void
  handleAddQuest?: (quest: Quest, characterId: string) => void
  handleCompleteQuest?: (questProgress: QuestWithQuestProgress) => Promise<void>
  handleSetRequestedWindowId?: (id: string) => void
}