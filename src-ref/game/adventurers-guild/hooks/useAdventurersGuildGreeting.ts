import { useMemo } from 'react'

import { getRandomGuildGreeting }
  from '../data/adventurersGuildDialogue.data'

import type { GuildTimeOfDay }
  from './useAdventurersGuildTimeOfDay'

export function useGuildGreeting(
  timeOfDay: GuildTimeOfDay
) {
  return useMemo(() => {
    return getRandomGuildGreeting(timeOfDay)
  }, [timeOfDay])
}