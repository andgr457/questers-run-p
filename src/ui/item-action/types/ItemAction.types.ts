export type ItemActions<T> = Array<ItemAction<T>>

export interface ItemAction<T> {
  name: string
  getName?: (entity: T) => string
  fn: (entity?: T) => void
  className?: any
}