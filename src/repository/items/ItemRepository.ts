import { ITEM_CURRENCIES } from '../../data/items/currency/Item.Currency.data';
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
    ...ITEM_CURRENCIES,
    ...this.POTIONS,
  
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
}