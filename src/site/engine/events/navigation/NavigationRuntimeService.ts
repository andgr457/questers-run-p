import { eventBus } from '../bus/EventBus'
import type { NavigationEvents } from './types/NavigationEvents.types'
import type { NavigationState } from './types/NavigationState.types'

class NavigationRuntimeService {
  private initialized = false
  private navigationState: NavigationState = {}

  init() {
    if(this.initialized){
      return
    }

    this.initialized = true

    eventBus.subscribe<NavigationEvents>(event => {
      if(
        event.type !== 'site:navigation:start'
      ){
        return
      }
      console.log(event)
      this.navigationState = {
        navigationMode: event.meta.navigationMode,
        navigationFilter: event.meta.navigationFilter
      }

      eventBus.emit({
        id: crypto.randomUUID(),
        parentEventId: event.id,
        type: 'site:navigation:end',
        created: Date.now(),
        meta: this.navigationState
      })
    })
  }

  getNavigationState() {
    return this.navigationState
  }
}

export const navigationRuntimeService =
  new NavigationRuntimeService()