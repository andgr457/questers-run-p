import { useEffect, useState } from 'react'
import { navigationRuntimeService } from '../NavigationRuntimeService'
import { eventBus } from '../../bus/EventBus'
import type { NavigationState } from '../types/NavigationState.types'
import type { NavigationEvents } from '../types/NavigationEvents.types'

export function useSiteNavigation() {
  const [navigationState, setNavigationState] = useState<NavigationState>(
    navigationRuntimeService.getNavigationState()
  )

  useEffect(() => {
    const unsubscribe = eventBus.subscribe<NavigationEvents>(event => {
      if(
        event.type !== 'site:navigation:end'
      ){
        return
      }

      setNavigationState(
        navigationRuntimeService.getNavigationState()
      )
    })

    return unsubscribe
  }, [])

  return navigationState
}