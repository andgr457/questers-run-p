import { GAME_LOCATION_IDS } from '../../../../entity/location/data/Location.data'

export interface AdventurersGuildClerkData {
  name: string
  title: string
  lore: string[]
  dialog: string[]
  questReturnDialog: string[]
}

export const ADVENTURERS_GUILD_CLERKS: Record<string, AdventurersGuildClerkData> = {
  [GAME_LOCATION_IDS.ORON_ADV_GUILD]: {
    name: 'Cassian Voss',
    title: 'Senior Expedition Registrar',

    lore: [
      '"I have served the Oron Adventurers Guild for over two decades. I spent years in the field before trading my weapon for a ledger. Turns out paperwork is far less likely to bite, stab, or attempt to eat me."',
      '"I maintain adventurer records, process contracts, and keep track of every soul who leaves through these doors. The list of those who do not return is not for remembrance... it is for accurate accounting."',
      '"When I am not buried beneath reports and contracts, I tend to my small garden behind the Guild hall. Strange, I know. After years fighting beasts and bandits, I find peace in convincing stubborn plants to survive."',
      '"I still maintain my old field equipment in my quarters. Not because I intend to return to adventuring... but because a person should never forget what kept them alive."',
    ],

    dialog: [
      '"Contracts are available, supplies are limited, and survival is considered a personal responsibility."',
      '"Every adventurer believes they are prepared. The ones who were not usually prove themselves wrong very quickly."',
      '"The frontier does not care about your ambitions. Fortunately, the Guild does... enough to issue you equipment and a contract number."',
      '"Remember: monsters are predictable. Adventurers are the ones who require additional paperwork."',
      '"The Guild exists because someone has to document the disasters. Preferably before they become larger disasters."',
    ],

    questReturnDialog: [
      '"You have returned. Good. I was beginning to prepare the missing adventurer report."',
      '"Your contract is still active. Submit your findings and we can process completion."',
      '"Another expedition survived. Excellent. Let us review your results before assigning the next unfortunate task."',
      '"You look intact enough to have completed your assignment. That is usually a positive indicator."',
    ],
  },

  // Future towns go here
  /*
  [GAME_LOCATION_IDS.NORTHWATCH_ADV_GUILD]: {
    name: '...',
    title: '...',
    lore: [],
    dialog: [],
    questReturnDialog: []
  }
  */
}