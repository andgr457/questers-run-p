export interface PlayerEntity {
  id: string
  name: string
  xp: number
  xpNextLevel: number
  level: number
  characterTokens: number
}

export interface PlayerGoldTransaction {
  id: string
  date: number
  amount: number
}