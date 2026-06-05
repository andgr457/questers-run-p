import type { RuntimeMutation } from './RuntimeMutation'

export interface RuntimeTickResult {
  completed?: boolean

  nextTickAt?: number

  mutations?: RuntimeMutation[]

  events?: string[]
}