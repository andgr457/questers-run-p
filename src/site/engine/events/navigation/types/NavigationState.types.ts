import type { NavigationMode, NavigationFilterType } from '../../../../ui/navigation-menu/types/NavigationNode.types'

export interface NavigationState {
  navigationMode?: NavigationMode
  navigationFilter?: NavigationFilterType
}