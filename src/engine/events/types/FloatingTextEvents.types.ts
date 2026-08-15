import type { FloatingText } from '../hooks/useFloatingTextEvents';

export interface FloatingTextAddEventMeta {
  floatingText: FloatingText
}

export interface FloatingTextAddedEventMeta {
  floatingText: FloatingText
}

export interface FloatingTextCompleteEventMeta {
  floatingText: FloatingText
}

export interface FloatingTextCompletedEventMeta {
  floatingText: FloatingText
}

export interface FloatingTextEventMap {
  'floating_text:add': FloatingTextAddEventMeta,
  'floating_text:added': FloatingTextAddedEventMeta,
  'floating_text:complete': FloatingTextCompleteEventMeta,
  'floating_text:completed': FloatingTextCompletedEventMeta,
}