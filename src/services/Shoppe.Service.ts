import { DateTime } from 'luxon';
import type { ShoppeCartItem } from '../components/shoppe/ShoppeCart';
import type { Character } from '../interfaces/characters/Character.types';
import type { Inventory } from '../interfaces/inventories/Inventory.types';
import { ITEM_CURRENCY_IDS } from '../data/items/currency/Item.Currency.data';

export function shoppeServiceConfirmCart(
    cartItems: ShoppeCartItem[], 
    characterInventories: Inventory[],
    character: Character
): {currency: Inventory | null, backpack: Inventory | null, txnMessages: string[]} {
  if(!cartItems || cartItems.length === 0) {
    return {currency: null, backpack: null, txnMessages: []}
  }

  const backpack = characterInventories?.find(ci => ci.title === 'Backpack')
  const currency = characterInventories?.find(ci => ci.title === 'Currency')
  if(!backpack || !currency) {
    return {currency: null, backpack: null, txnMessages: []}
  }

  const txnMessages = []
  for(const si of cartItems){
    let quantity = 0
    let gold = 0
    if(si.transactionType === 'buy'){
      quantity = si.amount
      gold =  (si.amount * si.item.gold.buy) * -1
      txnMessages.push(`${quantity} ${si.item.name} purchased for ${gold} gold.`)
    } else {
      quantity = si.amount * -1
      gold = si.amount * si.item.gold.sell
      txnMessages.push(`${si.amount} ${si.item.name} sold for ${gold} gold.`)
    }
    backpack.transactions.push({
      id: `invtxn_shoppe_item_${si.item.id}__${character?.id}__${DateTime.utc().toMillis()}`,
      date: DateTime.utc().toISO(),
      itemId: si.item.id,
      note: `Shoppe ${si.transactionType.toUpperCase()} Item Transaction`,
      quantity: quantity
    })
    currency.transactions.push({
      id: `invtxn_shoppe_gold__${si.item.id}__${character?.id}__${DateTime.utc().toMillis()}`,
      date: DateTime.utc().toISO(),
      itemId: ITEM_CURRENCY_IDS.GOLD,
      note: `Shoppe ${si.transactionType.toUpperCase()} Gold Transaction`,
      quantity: gold
    })
  }
  return {currency, backpack, txnMessages}
}
