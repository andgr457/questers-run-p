import type { Mob } from '../../interfaces/mobs/Mob.types'
import { ITEM_CURRENCY_IDS } from '../items/currency/Item.Currency.data'
import { ITEM_MOBS_SLIME_ITEM_IDS } from '../items/mobs/Item.Mobs.Slime.data'

export const MOB_SLIME_IDS = {
  GREEN_SMALL: 'm_slime_green_small',
  GREEN: 'm_slime_green',
  BLUE: 'm_slime_blue',
  RED: 'm_slime_red',
  ARCANE: 'm_slime_arcane'
}

const GOLD_1_90_LOOT = {
  itemId: ITEM_CURRENCY_IDS.GOLD,
  itemAmount: 1,
  chance: 0.9
}
const GOLD_5_50_LOOT = {
  itemId: ITEM_CURRENCY_IDS.GOLD,
  itemAmount: 5,
  chance: 0.5
}
const GOLD_3_80_LOOT = {
  itemId: ITEM_CURRENCY_IDS.GOLD,
  itemAmount: 5,
  chance: 0.8
}



export const MOB_SLIME_GREEN_SMALL: Mob = {
  id: MOB_SLIME_IDS.GREEN_SMALL,
  name: 'Small Green Slime',
  description: 'A tiny, unstable blob of green slime that oozes weakly across the ground.',
  level: 1,
  guildRankLevel: 1,
  xp: 5,
  location: 'forest',
  stats: {
    hp: {
      name: 'HP',
      value: 10,
      max: 10,
    },
    mp: {
      name: 'MP',
      value: 0,
      max: 0,
    },
    stamina: {
      name: 'STAM',
      value: 0,
      max: 0,
    },
    strength: {
      name: 'STR',
      value: 1,
      max: 0,
    },
    agility: {
      name: 'AGI',
      value: 1,
      max: 0,
    },
    intelligence: {
      name: 'INT',
      value: 1,
      max: 0,
    },
  },
  loot: [
    {
      itemId: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_GREEN,
      itemAmount: 1,
      chance: 0.25
    },
    GOLD_1_90_LOOT,
    GOLD_5_50_LOOT
  ]
}

export const MOB_SLIME_GREEN: Mob = {
  id: MOB_SLIME_IDS.GREEN,
  name: 'Green Slime',
  description: 'A common green slime that slowly bounces around damp caves and forests.',
  level: 1,
  guildRankLevel: 1,
  xp: 10,
  location: 'forest',
  stats: {
    hp: {
      name: 'HP',
      value: 15,
      max: 15
    },
    mp: {
      name: 'MP',
      value: 0,
      max: 0,
    },
    stamina: {
      name: 'STAM',
      value: 0,
      max: 0,
    },
    strength: {
      name: 'STR',
      value: 1,
      max: 0,
    },
    agility: {
      name: 'AGI',
      value: 2,
      max: 0,
    },
    intelligence: {
      name: 'INT',
      value: 1,
      max: 0,
    },
  },
  loot: [
    {
      itemId: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_GREEN,
      itemAmount: 1,
      chance: 0.25
    },
    {
      itemId: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_GREEN,
      itemAmount: 2,
      chance: 0.15
    },
    GOLD_1_90_LOOT,
    GOLD_5_50_LOOT,
    GOLD_3_80_LOOT
  ]
}

export const MOB_SLIME_BLUE: Mob = {
  id: MOB_SLIME_IDS.BLUE,
  name: 'Blue Slime',
  description: 'A denser, watery slime that moves with more force and erratic bursts of speed.',
  level: 2,
  guildRankLevel: 2,
  xp: 15,
  location: 'forest',
  stats: {
    hp: {
      name: 'HP',
      value: 25,
      max: 0
    },
    mp: {
      name: 'MP',
      value: 0,
      max: 0,
    },
    stamina: {
      name: 'STAM',
      value: 0,
      max: 0,
    },
    strength: {
      name: 'STR',
      value: 2,
      max: 0,
    },
    agility: {
      name: 'AGI',
      value: 3,
      max: 0,
    },
    intelligence: {
      name: 'INT',
      value: 1,
      max: 0,
    },
  },
  loot: [
    {
      itemId: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_BLUE,
      itemAmount: 1,
      chance: 0.25
    },
    {
      itemId: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_BLUE,
      itemAmount: 2,
      chance: 0.15
    },
    GOLD_1_90_LOOT,
    GOLD_5_50_LOOT,
    GOLD_3_80_LOOT
  ]
}

export const MOB_SLIME_RED: Mob = {
  id: MOB_SLIME_IDS.RED,
  name: 'Red Slime',
  description: 'A heated, aggressive slime that pulses with unstable energy and strikes harder than its size suggests.',
  level: 2,
  guildRankLevel: 3,
  xp: 20,
  location: 'forest',
  stats: {
    hp: {
      name: 'HP',
      value: 35,
      max: 35
    },
    mp: {
      name: 'MP',
      value: 0,
      max: 0,
    },
    stamina: {
      name: 'STAM',
      value: 0,
      max: 0,
    },
    strength: {
      name: 'STR',
      value: 3,
      max: 0,
    },
    agility: {
      name: 'AGI',
      value: 3,
      max: 0,
    },
    intelligence: {
      name: 'INT',
      value: 1,
      max: 0,
    },
  },
  loot: [
    {
      itemId: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_RED,
      itemAmount: 1,
      chance: 0.25
    },
    {
      itemId: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_RED,
      itemAmount: 2,
      chance: 0.15
    },
    GOLD_1_90_LOOT,
    GOLD_5_50_LOOT,
    GOLD_3_80_LOOT
  ]
}

export const MOB_SLIME_ARCANE: Mob = {
  id: MOB_SLIME_IDS.ARCANE,
  name: 'Arcane Slime',
  description: 'A rare magical slime infused with raw mana, shimmering as it shifts between forms.',
  level: 3,
  guildRankLevel: 5,
  xp: 25,
  location: 'forest',
  stats: {
    hp: {
      name: 'HP',
      value: 40,
      max: 40
    },
    mp: {
      name: 'MP',
      value: 0,
      max: 0,
    },
    stamina: {
      name: 'STAM',
      value: 0,
      max: 0,
    },
    intelligence: {
      name: 'INT',
      value: 3,
      max: 0,
    },
    strength: {
      name: 'STR',
      value: 1,
      max: 0,
    },
    agility: {
      name: 'AGI',
      value: 2,
      max: 0,
    }
  },
  loot: [
    {
      itemId: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_ARCANE,
      itemAmount: 1,
      chance: 0.05
    },
    GOLD_1_90_LOOT,
    GOLD_5_50_LOOT,
    GOLD_3_80_LOOT
  ]
}

export const MOBS_SLIMES_ALL: Mob[] = [
  MOB_SLIME_GREEN_SMALL,
  MOB_SLIME_GREEN,
  MOB_SLIME_BLUE,
  MOB_SLIME_RED,
  MOB_SLIME_ARCANE
]