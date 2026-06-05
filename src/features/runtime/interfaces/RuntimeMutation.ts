export type RuntimeMutation =
  | {
      type: 'character-hp'
      characterId: string
      value: number
    }
  | {
      type: 'inventory-add'
      characterId: string
      itemId: string
      amount: number
    }
  | {
      type: 'xp-add'
      characterId: string
      amount: number
    }