import { useMemo } from 'react'

export type GuildTimeOfDay =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'

export function useGuildTimeOfDay(hour: number): GuildTimeOfDay {
  return useMemo(() => {
    if (hour >= 6 && hour < 12) {
      return 'morning'
    }

    if (hour >= 12 && hour < 18) {
      return 'afternoon'
    }

    if (hour >= 18 && hour < 22) {
      return 'evening'
    }

    return 'night'
  }, [hour])
}