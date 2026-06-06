import type { GuildTimeOfDay }
  from '../hooks/useAdventurersGuildTimeOfDay'

export function getGuildBrightness(
  timeOfDay: GuildTimeOfDay
): number {
  switch (timeOfDay) {
    case 'morning':
      return 1

    case 'afternoon':
      return 1.05

    case 'evening':
      return 0.9

    case 'night':
      return 0.72

    default:
      return 1
  }
}