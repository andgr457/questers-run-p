import type { WorldLocation } from '../../../game/world/worldState'

export type RadialItem = {
  id: string | WorldLocation
  label: string
  onTravel?: () => void
  childItems?: RadialItem[]
  component?: React.ReactNode
}