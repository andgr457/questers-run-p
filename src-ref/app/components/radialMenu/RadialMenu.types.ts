export type RadialItem = {
  id: string
  label: string
  onTravel?: () => void
  children?: RadialItem[]
}