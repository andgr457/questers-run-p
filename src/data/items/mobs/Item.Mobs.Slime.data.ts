import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'
import { EMPTY_STATS } from '../../Stats.data'

export const ITEM_MOBS_SLIME_ITEM_IDS = {
  SLIME_GREEN: 'i_mob_slime_green',
  SLIME_BLUE: 'i_mob_slime_blue',
  SLIME_RED: 'i_mob_slime_red',
  SLIME_ARCANE: 'i_mob_slime_arcane',
}

export const ITEM_MOBS_SLIME_GREEN: Item = {
  id: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_GREEN,
  name: 'Green Slime',
  description: 'Liquid from a small green slime.',
  type: ITEM_TYPES.MOB,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  gold: {
    buy: 100,
    sell: 1
  },
}

export const ITEM_MOBS_SLIME_BLUE: Item = {
  id: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_BLUE,
  name: 'Blue Slime',
  description: 'Cool blue slime with a watery texture.',
  type: ITEM_TYPES.MOB,
  rarity: ITEM_RARITY.UNCOMMON,
  stats: EMPTY_STATS,
  gold: {
    buy: 110,
    sell: 3
  },
}

export const ITEM_MOBS_SLIME_RED: Item = {
  id: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_RED,
  name: 'Red Slime',
  description: 'Warm slime residue pulsing with heat.',
  type: ITEM_TYPES.MOB,
  rarity: ITEM_RARITY.UNCOMMON,
  stats: EMPTY_STATS,
  gold: {
    buy: 150,
    sell: 6
  },
}

export const ITEM_MOBS_SLIME_ARCANE: Item = {
  id: ITEM_MOBS_SLIME_ITEM_IDS.SLIME_ARCANE,
  name: 'Arcane Slime',
  description: 'A magical slime shimmering with mana energy.',
  type: ITEM_TYPES.MOB,
  rarity: ITEM_RARITY.RARE,
  stats: EMPTY_STATS,
  gold: {
    buy: 200,
    sell: 15
  },
}

export const ITEM_MOBS_SLIME_ALL: Item[] = [
  ITEM_MOBS_SLIME_GREEN,
  ITEM_MOBS_SLIME_BLUE,
  ITEM_MOBS_SLIME_RED,
  ITEM_MOBS_SLIME_ARCANE,
]