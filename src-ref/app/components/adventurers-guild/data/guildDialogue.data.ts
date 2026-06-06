import type { GuildTimeOfDay }
  from '../hooks/useGuildTimeOfDay'

export interface GuildGreeting {
  text: string
  mood: 'neutral' | 'happy' | 'tired'
}

const GREETINGS:
  Record<GuildTimeOfDay, GuildGreeting[]> = {
    morning: [
      {
        text: 'Early start today, adventurer?',
        mood: 'happy',
      },
      {
        text: 'Fresh contracts just came in this morning.',
        mood: 'neutral',
      },
    ],

    afternoon: [
      {
        text: 'Welcome back to the guild.',
        mood: 'neutral',
      },
      {
        text: 'The roads are busy today.',
        mood: 'happy',
      },
    ],

    evening: [
      {
        text: 'Evening adventurer. Looking for work?',
        mood: 'neutral',
      },
      {
        text: 'Most parties have already gone out tonight.',
        mood: 'tired',
      },
    ],

    night: [
      {
        text: 'Burning the midnight oil?',
        mood: 'tired',
      },
      {
        text: 'Not many requests come in this late.',
        mood: 'neutral',
      },
    ],
  }

export function getRandomGuildGreeting(
  timeOfDay: GuildTimeOfDay
): GuildGreeting {
  const greetings = GREETINGS[timeOfDay]

  return greetings[
    Math.floor(Math.random() * greetings.length)
  ]
}