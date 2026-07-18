import { useEffect } from 'react'


import type { ContextMenuAction } from '../types/ContextMenuAction.types'
import { useContextMenu } from './useContextMenu'

export function useRegisterContextMenu(
  left: ContextMenuAction[] = [],
  right: ContextMenuAction[] = []
) {
  const {
    setLeftActions,
    setRightActions,
    clearActions,
  } = useContextMenu()

  useEffect(() => {
    setLeftActions(left)
    setRightActions(right)

    return () => {
      clearActions()
    }
  }, [])
}