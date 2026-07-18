import type { ItemEntity } from '../types/ItemEntity.types'

export const GAME_ITEMS_BERRY_IDS = {
  BERRY_BLUE: 'i_berry_blue',
}

const I_BERRY_BLUE: ItemEntity = {
  id: GAME_ITEMS_BERRY_IDS.BERRY_BLUE,
  name: 'Blueberry',
  namePlural: 'Blueberries',
  description: 'A small, sweet, bright blue fruit found commonly in the woods and the plains.',
  type: 'resource',
}

export const GAME_ITEMS_BERRIES = [
  I_BERRY_BLUE,
]