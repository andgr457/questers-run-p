
export type WorldModeMain = 'none' | 'guild'
export type WorldModeOverlay = 'none' | 'intro' 

export interface WorldModeMainChangeEventMeta {
  mode: WorldModeMain
}

export interface WorldModeMainChangedEventMeta {
  mode: WorldModeMain
}

export interface WorldModeOverlayChangeEventMeta {
  mode: WorldModeOverlay
}

export interface WorldModeOverlayChangedEventMeta {
  mode: WorldModeOverlay
}

export interface WorldModeEventMap {
  'world:mode:main:change': WorldModeMainChangeEventMeta
  'world:mode:main:changed': WorldModeMainChangedEventMeta
  'world:mode:overlay:change': WorldModeOverlayChangeEventMeta
  'world:mode:overlay:changed': WorldModeOverlayChangedEventMeta
}