import type { ItemType } from '../interfaces/items/Item.types'

export function itemServiceGetItemTypeIcon(type?: ItemType) {
  switch(type) {
    case 'weapon':
      return '⚔️'

    case 'armor':
      return '🛡️'

    case 'consumable':
      return '🧪'

    case 'resource':
      return '⛏️'

    case 'currency':
      return '🪙'

    case 'arrows':
      return '🏹'

    case 'bolts':
      return '🔩'

    case 'mob':
      return '👹'

    case 'general':
      return '🎒'

    default:
    }
    return '❔'
}