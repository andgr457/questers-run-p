import type { ContextMenuIconName } from './ContextMenuIcon.types'

export interface ContextMenuAction {
  id: string
  label: string
  iconName: ContextMenuIconName
  iconRotate: boolean
  onClick: () => void
}