import { useContext } from 'react'

import { ContextMenuContext } from '../providers/ContextMenuProvider'

export function useContextMenu() {
  const context = useContext(ContextMenuContext)

  if (!context) {
    throw new Error(
      'useContextMenu must be used within ContextMenuProvider'
    )
  }

  return context
}