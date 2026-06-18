import { GAME_TAVERN_ACTIONS } from '../data/Tavern.data'
import type { TavernAction } from '../types/Tavern.types'

export function getTavernActionById(id: string): TavernAction | undefined {
  return GAME_TAVERN_ACTIONS.find(t => t.id === id)
}