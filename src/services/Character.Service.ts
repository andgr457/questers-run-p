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
  if(newStat.value < 0){
    newStat.value = 0
  }

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

interface HandleXpGainProps {
  character: Character
  xp: number
}
export function characterServiceHandleXpGain(props: HandleXpGainProps){
  const {
    character,
    xp
  } = props
  if(xp === 0) return character

  let totalXp = character.xp + xp
  let level = character.level
  let levelNextXP = character.levelNextXP

  let hpMax = character.stats.hp.max
  let mpMax = character.stats.mp.max
  let staminaMax = character.stats.stamina.max

  // Handle multiple level ups
  while (totalXp >= levelNextXP) {
    totalXp -= levelNextXP

    level += 1
    levelNextXP += 10

    hpMax += 10
    mpMax += 10
    staminaMax += 10
  }

  return {
    ...character,

    level,
    xp: totalXp,
    levelNextXP,

    stats: {
      ...character.stats,

      hp: {
        ...character.stats.hp,
        max: hpMax,
        value: level > character.level
          ? hpMax
          : character.stats.hp.value
      },

      mp: {
        ...character.stats.mp,
        max: mpMax,
        value: level > character.level
          ? mpMax
          : character.stats.mp.value
      },

      stamina: {
        ...character.stats.stamina,
        max: staminaMax,
        value: level > character.level
          ? staminaMax
          : character.stats.stamina.value
      }
    }
  }
}

export function characterServiceModifyStats(
  character: Character,
  xp: number,
  stamina: number,
  currentCharHp: number
): Character {

  let totalXp = character.xp + xp
  let level = character.level
  let levelNextXP = character.levelNextXP

  let hpMax = character.stats.hp.max
  let mpMax = character.stats.mp.max
  let staminaMax = character.stats.stamina.max

  // Handle multiple level ups
  while (totalXp >= levelNextXP) {
    totalXp -= levelNextXP

    level += 1
    levelNextXP += 10

    hpMax += 10
    mpMax += 10
    staminaMax += 10
  }

  const staminaValue = Math.min(
    staminaMax,
    Math.max(
      0,
      character.stats.stamina.value + stamina
    )
  )

  const hpValue = Math.min(
    hpMax,
    Math.max(
      0,
      currentCharHp
    )
  )

  return {
    ...character,

    level,
    xp: totalXp,
    levelNextXP,

    stats: {
      ...character.stats,

      hp: {
        ...character.stats.hp,
        max: hpMax,
        value: level > character.level
          ? hpMax
          : hpValue
      },

      mp: {
        ...character.stats.mp,
        max: mpMax,
        value: level > character.level
          ? mpMax
          : character.stats.mp.value
      },

      stamina: {
        ...character.stats.stamina,
        max: staminaMax,
        value: level > character.level
          ? staminaMax
          : staminaValue
      }
    }
  }
}

export function characterServiceModifyHp(
  character: Character,
  value: number
): Character {
  const updatedCharacter: Character = {
    ...character,
    stats: {
      ...character.stats,
      hp: { ...character.stats.hp }
    }
  }

  const hp = updatedCharacter.stats.hp

  hp.value = Math.max(
    0,
    Math.min(hp.max, hp.value + value)
  )

  return updatedCharacter
}