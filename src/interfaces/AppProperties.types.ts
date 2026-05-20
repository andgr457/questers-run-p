import type { QuestWithQuestProgress } from '../components/quests/CharacterQuests';
import type { ShoppeCartItem } from '../components/shoppe/ShoppeCart';
import type { Achievement } from './achievements/Achievement.types';
import type { Character, CharacterClass } from './characters/Character.types';
import type { Inventory } from './inventories/Inventory.types';
import type { Item } from './items/Item.types';
import type { ProfessionType } from './professsions/Profession.types';
import type { Quest, QuestGroup, QuestProgress } from './quests/Quests.types';

export interface AppProperties extends AppFunctions {
  achievements?: Achievement[]
  location?: string
  character?: Character
  characterGold?: number
  characterClass?: CharacterClass
  characterInventories?: Inventory[]
  characterQuestProgress?: QuestWithQuestProgress
  allQuestProgress?: QuestProgress[]
  allQuestsWithProgress?: QuestWithQuestProgress[]
  quests?: Quest[]
  questGroups?: QuestGroup[]
  items?: Item[]
}

export interface AppFunctions {
  setLocation?: (location: string) => void
  handleSetCharacter?: (character: Character) => void
  handleResetEverything?: () => void
  handleResetProfession?: (professionType: ProfessionType) => void
  handleDoProfessionItemComplete?: (professionItemId: string, amount: number) => void
  handleTavernItemStart?: (goldCost: number) => void
  handleTavernItemComplete?: (percentChange: number) => void
  handleAddInventory?: (inventory: Inventory[]) => void
  handleAddQuest?: (quest: Quest, characterId: string) => void
  handleAbandonQuest?: (questProgressId: string) => void
  handleCompleteQuest?: (questProgress: QuestWithQuestProgress) => Promise<void>
  handleSetRequestedWindowId?: (id: string) => void
  handleShoppeConfirmation?: (cartItems: ShoppeCartItem[]) => Promise<void>
}