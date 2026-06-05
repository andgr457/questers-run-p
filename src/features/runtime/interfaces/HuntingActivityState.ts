export interface HuntingActivityState {
  characterId: string

  mobId: string

  currentCharacterHp: number

  currentMobHp: number

  turn:
    | 'character'
    | 'mob'
}