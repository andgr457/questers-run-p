import { useMemo } from 'react'

import { getRandomGuildGreeting }
  from '../data/guildDialogue.data'

import type { GuildTimeOfDay }
  from './useGuildTimeOfDay'

export function useGuildGreeting(
  timeOfDay: GuildTimeOfDay
) {
  return useMemo(() => {
    return getRandomGuildGreeting(timeOfDay)
  }, [timeOfDay])
}