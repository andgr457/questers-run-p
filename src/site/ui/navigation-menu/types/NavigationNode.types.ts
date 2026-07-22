export type NavigationNodeId = string

export type NavigationMode =
  | 'about-game'
  | 'about-development'
  | 'lore'
  | 'development'
  | 'encyclopedia'
  | 'locations'
  | 'contact-support'
  | 'contact-marketing'


export type NavigationFilterType =
  | 'beastiary'
  | 'classes'
  | 'skills'
  | 'professions'
  | 'quests'
  | 'items'
  | 'recipes'
  | 'armor'
  | 'jewelry'
  | 'weapons'
  | 'locations'
  | 'worlds'
  | 'regions'
  | 'kingdoms'
  | 'all'

export interface NavigationNode {
  id: NavigationNodeId
  parentId?: NavigationNodeId
  title: string
  description?: string
  navMode?: NavigationMode
  filterType?: NavigationFilterType
  order?: number
  iconId?: string
}