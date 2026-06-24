import type { ContextMenuAction } from './ContextMenuAction.types'

export interface ContextMenuState {
  left: ContextMenuAction[]
  right: ContextMenuAction[]
}