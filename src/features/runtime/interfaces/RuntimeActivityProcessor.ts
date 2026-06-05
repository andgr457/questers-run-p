import type { RuntimeActivity } from './RuntimeActivity'
import type { RuntimeTickResult } from './RuntimeTickResult'

export interface RuntimeActivityProcessor {
  processTick(
    activity: RuntimeActivity,
    now: number
  ): RuntimeTickResult
}