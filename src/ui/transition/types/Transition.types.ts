import type { LeftRightTextProps } from '../../text/left-right-text/LeftRightText'

export type TransitionTextType = 'animated'
  | 'left-right'

export interface Transition {
  title: string
  sourceLocationId?: string
  destinationLocationId?: string
  delay?: number
  characterId?: string
  partyId?: string
  textType?: TransitionTextType
  leftRightMeta?: LeftRightTextProps
  animatedMeta?: {
    text: string
    delay: number
  }
}