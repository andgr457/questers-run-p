export const TUTORIAL_IDS = {
  TRAVEL_TO_TOWN: 'travel_to_town',
  VISIT_ADV_GUILD: 'visit_adv_guild',
  ACCEPT_FIRST_QUEST: 'accept_first_quest',
} as const

export const TUTORIALS = [
  {
    id: TUTORIAL_IDS.TRAVEL_TO_TOWN,
    title: 'Where To?',
    description:
      'The road ahead leads toward a nearby town. Tap the "c" to the left to see all your characters, then tap on a character, select Travel, and then choose Town.',
  },
  {
    id: TUTORIAL_IDS.VISIT_ADV_GUILD,
    title: 'The Inn',
    description:
      'Visit the local Adventurer\'s Guild in town to learn more.',
  },
]