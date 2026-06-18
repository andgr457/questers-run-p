export interface ItemMobDropEntity {
  itemId: string

  chance: number

  amountMin: number
  amountMax: number
}

export interface ItemMobEntity {
  mobId: string

  drops: ItemMobDropEntity[]
}