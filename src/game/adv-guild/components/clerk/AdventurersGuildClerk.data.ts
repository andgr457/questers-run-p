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
      '"I have served the Oron Adventurers Guild for twenty-three years. I was once the one accepting contracts and walking into the dark. Now I am the one making sure someone knows where you went."',
      '"My duties are simple: record assignments, verify claims, and update the casualty reports when someone forgets that monsters do not care how brave you are."',
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