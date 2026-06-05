export type HuntingEvent =
  | {
      type: 'combat-start'
      characterName: string
      mobName: string
      mobLevel: number
    }
  | {
      type: 'character-hit'
      attackerName: string
      defenderName: string
      damage: number
      currentMobHp: number
    }
  | {
      type: 'mob-hit'
      attackerName: string
      defenderName: string
      damage: number
      currentCharacterHp: number
    }
  | {
      type: 'mob-defeated'
      mobName: string
      defenderName: string
    }
  | {
      type: 'character-collapsed'
      characterName: string
    }
  | {
      type: 'loot-drop'
      itemName: string
      amount: number
      roll: number
      chance: number
    }
  | {
      type: 'loot-failed'
      itemName: string
      amount: number
      roll: number
      chance: number
    }
  | {
      type: 'xp-gained'
      xp: number
    }