export interface ItemProfessionEntity {
  itemId: string

  professionId: string

  requiredProfessionLevel: number

  chance: number

  amountMin: number
  amountMax: number

  professionXp: number
}