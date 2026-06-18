export interface RecipeRequirementEntity {
  itemId: string

  amount: number
}

export interface RecipeEntity {
  id: string

  title: string

  description?: string

  requirements: RecipeRequirementEntity[]

  outputItemId: string

  outputAmount: number
}