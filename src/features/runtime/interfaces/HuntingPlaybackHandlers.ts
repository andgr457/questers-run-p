import type { ReactNode } from 'react'

export interface HuntingPlaybackHandlers {
  setMobName(name: string): void

  setMobHp(value: number): void

  setMobHpMax(value: number): void

  setCharHp(value: number): void

  addEvent(node: ReactNode): void
}