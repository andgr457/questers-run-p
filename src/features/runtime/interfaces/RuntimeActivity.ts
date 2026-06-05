export type RuntimeActivityType =
  | 'hunting'
  | 'gathering'
  | 'scouting'
  | 'quest'

export interface RuntimeActivity<TState = unknown> {
  id: string

  type: RuntimeActivityType

  characterIds: string[]

  startedAt: number

  nextTickAt: number

  completedAt?: number

  status:
    | 'running'
    | 'completed'
    | 'cancelled'

  state: TState
}