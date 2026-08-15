
export interface Upgrade {
  title: string
  description: string
  level: number
  maxLevel: number
  value: number
  cost: {
    base: number
    levelMultiplier: number
  }
}