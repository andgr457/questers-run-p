import { ITEM_CURRENCY_ALL } from '../../data/items/currency/Item.Currency.data';
import { ITEM_FISHING_ALL } from '../../data/items/gathering/Item.Fishing.data';
import { ITEM_GATHERING_ALL } from '../../data/items/gathering/Item.Gathering.data';
import { ITEM_MINING_ALL } from '../../data/items/gathering/Item.Mining.data';
import { ITEM_HEALTH_POTIONS } from '../../data/items/potions/Item.Potions.Health.data';
import { ITEM_MANA_POTIONS } from '../../data/items/potions/Item.Potions.Mana.data';
import { ITEM_STAMINA_POTIONS } from '../../data/items/potions/Item.Potions.Stamina.data';
import type { Item } from '../../interfaces/items/Item.types';

export class ItemRepository {
  
  private POTIONS = [
    ...ITEM_HEALTH_POTIONS,
    ...ITEM_MANA_POTIONS,
    ...ITEM_STAMINA_POTIONS,
  ]

  private ALL_ITEMS = [
    ...ITEM_CURRENCY_ALL,
    ...this.POTIONS,
    ...ITEM_GATHERING_ALL,
    ...ITEM_MINING_ALL,
    ...ITEM_FISHING_ALL,
  ]
  async list(): Promise<Item[]> {
    return [
      ...this.ALL_ITEMS
    ]
  }

  async listPotions(): Promise<Item[]> {
    return [
      ...this.POTIONS
    ]
  }

  async byId(id: string): Promise<Item | undefined> {
    return this.ALL_ITEMS.find(i => i.id === id)
  }
}