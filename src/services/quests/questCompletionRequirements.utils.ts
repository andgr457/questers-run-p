import { DateTime } from 'luxon'
import { getCharacterItemAmount } from '../characters/characterInventory.utils'
import type { QuestCompletionRequirement } from '../../interfaces/quests/Quests.types'
import type { Item } from '../../interfaces/items/Item.types'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import { getQuestTimeLeft } from './questTimers.utils'
import type { Mob, MobProgress } from '../../interfaces/mobs/Mob.types'

// #region TIME
export function getQuestTimeRequirement(
  requirement: QuestCompletionRequirement,
  startDate?: string
): QuestCompletionRequirement {

  if (
    typeof requirement.timeMinutes !==
    'number'
  ) {
    return requirement
  }

  if (!startDate) {
    return {
      ...requirement,
      completed: false,
    }
  }

  const start =
    DateTime.fromISO(startDate)

  if (!start.isValid) {
    return {
      ...requirement,
      completed: false,
    }
  }

  const timer =
    getQuestTimeLeft(
      requirement.timeMinutes,
      start
    )

  return {
    ...requirement,

    completed:
      timer.timeLeftSeconds <= 0,

    timeHours:
      timer.totalTimeHours,

    timeSeconds:
      timer.totalTimeSeconds,
  }
}

//#region ITEMS
export function getQuestItemRequirement(
  requirement: QuestCompletionRequirement,
  items: Item[],
  inventories: Inventory[]
): QuestCompletionRequirement {

  if (
    !requirement.itemId ||
    typeof requirement.itemAmount !==
      'number'
  ) {
    return requirement
  }

  const item = items.find(
    i => i.id === requirement.itemId
  )

  if (!item) {
    return requirement
  }

  const amount =
    getCharacterItemAmount(
      inventories,
      item.id
    ) ?? 0

  return {
    ...requirement,

    itemName: item.name,

    itemDescription:
      item.description,

    itemProfessionType:
      item.profession?.type,

    itemCharacterAmount: amount,

    completed:
      amount >=
      requirement.itemAmount,
  }
}

//#region MOB
export function getQuestMobRequirement(
  requirement: QuestCompletionRequirement,
  mobs: Mob[],
  mobProgress: MobProgress[],
  questProgressId?: string
): QuestCompletionRequirement {

  if (
    !requirement.mobId ||
    typeof requirement.mobAmount !==
      'number'
  ) {
    return requirement
  }

  const mob = mobs.find(
    m => m.id === requirement.mobId
  )

  const characterMobKills =
    mobProgress.filter(
      mp =>
        mp.mobId ===
          requirement.mobId &&
        mp.questProgressId ===
          questProgressId
    )

  return {
    ...requirement,

    mobId: mob?.id,

    mobName: mob?.name,

    mobDescription:
      mob?.description,

    mobLevel: mob?.level,

    mobCharacterAmount:
      characterMobKills.length,

    mobLocationType:
      mob?.location,

    completed:
      characterMobKills.length >=
      requirement.mobAmount,
  }
}