import type { RefObject } from 'react'
import type { ContextMenuIconName } from './ContextMenuIcon.types'

export interface ContextMenuAction {
  id: string
  label: string
  iconName: ContextMenuIconName
  iconRotate: boolean
  onClick: () => void
  color?: string
  borderColor?: string
  pulse?: boolean
  ref?: RefObject<HTMLDivElement | null>
}