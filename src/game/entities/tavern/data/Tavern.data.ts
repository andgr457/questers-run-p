import type { TavernAction } from '../types/Tavern.types';

export const TAVERN_ACTION_SNACK: TavernAction = {
  id: 'tavern_action_snack',
  title: 'Eat a Snack',
  cost: 5,
  duration: 10000,
  percent: .25
}

export const TAVERN_ACTION_MEAL: TavernAction = {
  id: 'tavern_action_meal',
  title: 'Eat a Meal',
  cost: 10,
  duration: 30000,
  percent: .5
}

export const TAVERN_ACTION_RENT_ROOM: TavernAction = {
  id: 'tavern_action_rent_room',
  title: 'Rent a Room',
  cost: 20,
  duration: 60000,
  percent: 1
}

export const TAVERN_ACTION_SLEEP_ALLEY: TavernAction = {
  id: 'tavern_action_sleep_alley',
  title: 'Sleep in the Alley',
  cost: 0,
  duration: 20000,
  percent: .25
}


export const GAME_TAVERN_ACTIONS: TavernAction[] = [
  TAVERN_ACTION_SNACK,
  TAVERN_ACTION_MEAL,
  TAVERN_ACTION_RENT_ROOM,
  TAVERN_ACTION_SLEEP_ALLEY
]
