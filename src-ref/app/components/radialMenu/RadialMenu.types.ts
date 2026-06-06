export type RadialItem = {
  id: string
  label: string
  onClick?: () => void
  children?: RadialItem[]
}