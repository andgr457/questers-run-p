import { DateTime } from 'luxon'
import { ITEM_CURRENCY_IDS } from '../data/items/currency/Item.Currency.data'
import type { Inventory } from '../interfaces/inventories/Inventory.types'
import type { Character, Stat } from '../interfaces/characters/Character.types'
import { characterServiceModifyBaseStatDivisor } from './Character.Service'

export function tavernServiceItemStart(
  goldCost: number,
  characterInventories: Inventory[],
  character: Character
): {currency: Inventory | null} {
  const currency = characterInventories?.find(i => i.title === 'Currency')
  if(!currency){
    return {currency: null}
  }

  currency.transactions.push({
    id: `invtxn__${ITEM_CURRENCY_IDS.GOLD}__${character?.id}__${DateTime.utc().toMillis()}`,
    date: DateTime.utc().toISO(),
    itemId: ITEM_CURRENCY_IDS.GOLD,
    note: `Tavern Purchase`,
    quantity: goldCost * -1
  })

  return {currency}
}

export function tavernServiceItemComplete(
  character: Character,
  percentChange: number
): {newCharacter: Character | null}{
  if(!character || typeof percentChange !== 'number'){
    return {newCharacter: null}
  }
  const newCharacter = {...character}

  const divisor = percentChange / 100

  const hpStat = characterServiceModifyBaseStatDivisor(
    character,
    divisor,
    'hp'
  )
  if(!hpStat){
    return {newCharacter: null}
  }

  const mpStat = characterServiceModifyBaseStatDivisor(
    character,
    divisor,
    'mp'
  )
  if(!mpStat){
    return {newCharacter: null}
  }

  const staminaStat = characterServiceModifyBaseStatDivisor(
    character,
    divisor,
    'stamina'
  )
  if(!staminaStat){
    return {newCharacter: null}
  }

  newCharacter.stats.hp = hpStat.stat as Stat
  newCharacter.stats.mp = mpStat.stat as Stat
  newCharacter.stats.stamina = staminaStat.stat as Stat

  return {newCharacter}
}