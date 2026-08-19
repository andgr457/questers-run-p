import type { EntityProperty } from '../types/Entity.types'

export const GAME_ATTRIBUTE_BASE: EntityProperty = {
  title: '',
  description: '',
  level: 1,
  progressDirection: 'fill',
  type: 'attribute',
  value: 1,
  valueMax: 1,
  xp: 0,
  xpNextLevel: 100,
}

export const GAME_ATTRIBUTE_AGILITY: EntityProperty = {
  ...GAME_ATTRIBUTE_BASE,
  title: 'Agility',
  description: 'Determines evade, block, melee critical chance and damage, and stamina.',
}

export const GAME_ATTRIBUTE_STRENGTH: EntityProperty = {
  ...GAME_ATTRIBUTE_BASE,
  title: 'Strength',
  description: 'Determines attack power, block, hp, and stamina.',
}

export const GAME_ATTRIBUTE_INTELLECT: EntityProperty = {
  ...GAME_ATTRIBUTE_BASE,
  title: 'Intellect',
  description: 'Determines spell power, spell critical chance and damage, and mana.',
}

export const GAME_ATTRIBUTE_HP: EntityProperty = {
  ...GAME_ATTRIBUTE_BASE,
  title: 'HP',
  description: 'Amount of available health points.',
  progressDirection: 'empty',
  value: 10,
  valueMax: 10
}

export const GAME_ATTRIBUTE_STAMINA: EntityProperty = {
  ...GAME_ATTRIBUTE_BASE,
  title: 'Stamina',
  description: 'Amount of available stamina for completing tasks.',
  progressDirection: 'empty',
  value: 10,
  valueMax: 10
}

export const GAME_ATTRIBUTE_MANA: EntityProperty = {
  ...GAME_ATTRIBUTE_BASE,
  title: 'Mana',
  description: 'Amount of available stamina for completing tasks.',
  progressDirection: 'empty',
  value: 10,
  valueMax: 10
}