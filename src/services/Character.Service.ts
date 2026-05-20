import type { Character, Stat } from '../interfaces/characters/Character.types'
import type { Inventory } from '../interfaces/inventories/Inventory.types'
import type { Item } from '../interfaces/items/Item.types'

export function characterServiceGetItemAmount(characterInventories: Inventory[], itemId: string){
  if(!characterInventories || characterInventories.length === 0) return 0
  
  let amount = 0
  characterInventories.forEach(i => {
    const itemTransactions = i.transactions.filter(t => t.itemId === itemId)
    itemTransactions.forEach(t => {
      amount += t.quantity
    })
  })
  return amount
}

export function characterServiceModifyBaseStatValue(
  character: Character,
  amount: number,
  statName: string
): {stat: Stat | null} {
  if(!character || !character.stats || !statName){
    return {stat: null}
  }
  //@ts-ignore
  const newStat = {...character.stats[statName]}
  if(!newStat || typeof newStat?.max !== 'number' || typeof newStat?.value !== 'number'){
    return {stat: null}
  }

  newStat.value += amount

  return newStat
}

export function characterServiceModifyBaseStatDivisor(
  character: Character,
  divisor: number,
  statName: string
): {stat: Stat | null} {
  if(!character || !character.stats || !statName){
    return {stat: null}
  }
  //@ts-ignore
  const newStat = {...character.stats[statName]}
  if(!newStat || typeof newStat?.max !== 'number' || typeof newStat?.value !== 'number'){
    return {stat: null}
  }

  const amountToAdd = newStat.max * divisor
  newStat.value += amountToAdd
  if(newStat.value > newStat.max){
    newStat.value = newStat.max
  }

  return {stat: {...newStat}}
}

export function characterServiceModifyProfessionStat(
  character: Character,
  statName: string,
  amount: number,
  professionItem: Item
): {professionStat: Stat | null, staminaStat: Stat | null} {
  if(!character || !character.professions ||
    !statName || !professionItem || !professionItem.profession){
    return {professionStat: null, staminaStat: null}
  }

  //@ts-ignore
  const newStat: Stat = {...character.professions[statName]}
  if(!newStat || typeof newStat?.xp !== 'number' || typeof newStat?.nextLevelXP !== 'number'){
    return {professionStat: null, staminaStat: null}
  }

  if(!character.stats.stamina){
    return {professionStat: null, staminaStat: null}
  }

  const xpToAdd = amount * professionItem.profession.xp
  const firstXpValue = xpToAdd + newStat.xp
  const overNextLevelValue = newStat.nextLevelXP - firstXpValue
  let canLevel = overNextLevelValue <= 0
  if(canLevel && typeof newStat.level === 'number'){
    const leftOverXp = Math.abs(overNextLevelValue)
    newStat.level += 1
    newStat.xp = 0 + leftOverXp
    newStat.nextLevelXP += 10
  } else {
    newStat.xp += xpToAdd
  }

  const staminaDrain = professionItem.profession.stamina * amount
  const staminaStat = characterServiceModifyBaseStatValue(
    character,
    staminaDrain * -1,
    'stamina'
  )
  if(!staminaStat){
    return {professionStat: null, staminaStat: null}
  }

  //@ts-ignore
  return {professionStat: newStat, staminaStat: staminaStat}
}