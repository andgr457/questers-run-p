import type { NavigationMode, NavigationFilterType } from '../../../../ui/navigation-menu/types/NavigationNode.types'
import type { SiteEvent } from '../../bus/types/EventBus.types'

export type NavigationEventTypes = 'site:navigation:start'
  | 'site:navigation:end'

interface NavigationEventMeta {
  navigationMode?: NavigationMode
  navigationFilter?: NavigationFilterType
}

interface SiteEvent_NavigationStart extends SiteEvent<NavigationEventMeta> {
  type: 'site:navigation:start'
  meta: NavigationEventMeta
}

interface SiteEvent_NavigationEnd extends SiteEvent<NavigationEventMeta> {
  type: 'site:navigation:end'
  meta: NavigationEventMeta
}

export type NavigationEvents = SiteEvent_NavigationStart
  | SiteEvent_NavigationEnd