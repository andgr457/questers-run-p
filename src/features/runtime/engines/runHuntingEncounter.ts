
import type { HuntingEncounterResult } from '../interfaces/HuntingEncounterResult'

import { calculateCombatDamage } from '../formulas/calculateCombatDamage'
import type { Character } from '../../../interfaces/characters/Character.types'
import type { Item } from '../../../interfaces/items/Item.types'
import type { Mob, Loot } from '../../../interfaces/mobs/Mob.types'
import type { HuntingEvent } from '../interfaces/HuntingEvent'

interface RunHuntingEncounterParams {
  mob: Mob
  character: Character
  items: Item[]
}

export function runHuntingEncounter({
  mob,
  character,
  items,
}: RunHuntingEncounterParams): HuntingEncounterResult {
  let currentMobHp = mob.stats.hp.value
  let currentCharacterHp =
    character.stats.hp.value

  const loot: Loot[] = []

  const events: HuntingEvent[] = []

  let characterPassedOut = false

  events.push({
    type: 'combat-start',
    characterName: character.name,
    mobName: mob.name,
    mobLevel: mob.level,
  })

  while (
    currentMobHp > 0 &&
    currentCharacterHp > 0
  ) {
    // CHARACTER TURN
    const characterDamage =
      calculateCombatDamage(character)

    currentMobHp = Math.max(
      0,
      currentMobHp - characterDamage
    )

    events.push({
      type: 'character-hit',
      attackerName: character.name,
      defenderName: mob.name,
      damage: characterDamage,
      currentMobHp,
    })

    if (currentMobHp <= 0) {
      break
    }

    // MOB TURN
    const mobDamage =
      calculateCombatDamage(mob)

    currentCharacterHp = Math.max(
      0,
      currentCharacterHp - mobDamage
    )

    events.push({
      type: 'mob-hit',
      attackerName: mob.name,
      defenderName: character.name,
      damage: mobDamage,
      currentCharacterHp,
    })

    if (currentCharacterHp <= 0) {
      characterPassedOut = true

      events.push({
        type: 'character-collapsed',
        characterName: character.name,
      })

      break
    }
  }

  // LOOT
  if (currentMobHp <= 0) {
    events.push({
      type: 'mob-defeated',
      mobName: mob.name,
      defenderName: character.name,
    })

    for (const lootItem of mob.loot ?? []) {
      if (
        !lootItem.itemId ||
        typeof lootItem.itemAmount !==
          'number'
      ) {
        continue
      }

      const item = items.find(
        i => i.id === lootItem.itemId
      )

      if (!item) continue

      const chance =
        typeof lootItem.chance === 'number'
          ? lootItem.chance
          : 1

      const roll = Math.random()

      const didDrop = roll <= chance

      if (!didDrop) {
        events.push({
          type: 'loot-failed',
          itemName: item.name,
          amount: lootItem.itemAmount,
          roll,
          chance,
        })

        continue
      }

      lootItem.characterRoll = roll
      lootItem.item = item

      loot.push(lootItem)

      events.push({
        type: 'loot-drop',
        itemName: item.name,
        amount: lootItem.itemAmount,
        roll,
        chance,
      })
    }

    events.push({
      type: 'xp-gained',
      xp: mob.xp,
    })
  }

  return {
    characterPassedOut,

    finalCharacterHp:
      currentCharacterHp,

    finalMobHp: currentMobHp,

    loot,

    events,
  }
}