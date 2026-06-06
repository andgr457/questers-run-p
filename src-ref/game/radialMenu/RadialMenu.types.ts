import type { WorldLocation } from '../world/worldState'

export type RadialItem = {
  id: string | WorldLocation
  label: string
  onTravel?: () => void
  childItems?: RadialItem[]
  component?: React.ReactNode
}