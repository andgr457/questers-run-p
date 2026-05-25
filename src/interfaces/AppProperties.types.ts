import type { QuestWithQuestProgressItem } from '../components/quests/CharacterQuests';
import type { ShoppeCartItem } from '../components/shoppe/ShoppeCart';
import type { Notification } from '../hooks/useFloatingNotify';
import type { ShowConfirmProps } from '../providers/ConfirmProvider';
import type { Achievement } from './achievements/Achievement.types';
import type { Character, CharacterClass } from './characters/Character.types';
import type { Inventory } from './inventories/Inventory.types';
import type { Item } from './items/Item.types';
import type { Loot, Mob, MobProgress } from './mobs/Mob.types';
import type { ProfessionType } from './professsions/Profession.types';
import type { Quest, QuestGroup, QuestProgress } from './quests/Quests.types';

export interface AppProperties extends AppFunctions {
  achievements?: Achievement[]
  location?: string
  character: Character
  characterGold: number
  characterClass?: CharacterClass
  characterInventories?: Inventory[]
  characterMobProgress?: MobProgress[]
  allQuestProgress?: QuestProgress[]
  allInventories?: Inventory[]
  allMobProgress?: MobProgress[]
  quests?: Quest[]
  questGroups?: QuestGroup[]
  items?: Item[]
  mobs?: Mob[]
  notifications?: Notification[]
}

export interface AppFunctions {
  toggleWindow?: (id: string,
    title: string,
    Component: React.ComponentType<any>,
    props?: any) => void
  closeWindow?: (id: string) => void
  showConfirm: (props: ShowConfirmProps) => Promise<boolean>
  addNotification?: (text: string, icon?: string, lifetime?: number) => void
  setLocation?: (location: string) => void
  useConsumable?: (item: Item, characterId: string) => void
  handleSetCharacter?: (character: Character) => void
  handleResetEverything?: () => void
  handleResetProfession?: (professionType: ProfessionType) => void
  handleHuntingMobComplete?: (mob: Mob, characterId: string, loot: Loot[], mobDamage: number, passedOut: boolean) => Promise<void>
  handleProfessionItemComplete?: (professionItem: Item, amount: number) => Promise<void>
  handleTavernItemComplete?: (percentChange: number, goldCost: number) => Promise<void>
  handleAddInventory?: (inventory: Inventory[]) => void
  handleAddQuest?: (quest: Quest, characterId: string) => void
  handleAbandonQuest?: (questProgressId: string) => void
  handleCompleteQuest?: (questProgress: QuestWithQuestProgressItem) => Promise<void>
  handleSetRequestedWindowId?: (id: string) => void
  handleShoppeConfirmation?: (cartItems: ShoppeCartItem[]) => Promise<void>
}