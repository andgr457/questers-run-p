import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { ContextMenuAction } from '../types/ContextMenuAction.types'
import type { ContextMenuState } from '../types/ContextMenuState.types'

interface ContextMenuContextValue {
  state: ContextMenuState
  setLeftActions: (actions: ContextMenuAction[]) => void
  setRightActions: (actions: ContextMenuAction[]) => void
  clearActions: () => void
}

export const ContextMenuContext =
  createContext<ContextMenuContextValue | null>(null)

interface Props {
  children: ReactNode
}

export default function ContextMenuProvider(props: Props) {
  const { children } = props

  const [state, setState] = useState<ContextMenuState>({
    left: [],
    right: [],
  })

  const setLeftActions = useCallback((actions: ContextMenuAction[]) => {
    setState(prev => ({
      ...prev,
      left: actions,
    }))
  }, [])

  const setRightActions = useCallback((actions: ContextMenuAction[]) => {
    setState(prev => ({
      ...prev,
      right: actions,
    }))
  }, [])

  const clearActions = useCallback(() => {
    setState({
      left: [],
      right: [],
    })
  }, [])

  const value = useMemo(
    () => ({
      state,
      setLeftActions,
      setRightActions,
      clearActions,
    }),
    [state, setLeftActions, setRightActions, clearActions]
  )

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
    </ContextMenuContext.Provider>
  )
}