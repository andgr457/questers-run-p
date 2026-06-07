
type FeeDiscountType = 'adventurers_guild'
  | 'level' 
  | 'reknown'

interface FeeDiscount {
  type: FeeDiscountType
  percent: number
}

type FeeType = 'entry'
  | 'exit'
  | 'sales_tax'

export interface Fee {
  cost: number
  type: FeeType
  discounts: FeeDiscount[]
}