import { useSyncExternalStore } from 'react'
import { gameClockService } from './GameClockService'

function subscribe(callback: () => void) {
  return gameClockService.subscribe(callback)
}

function getSnapshot() {
  return gameClockService.getNow()
}

function getServerSnapshot() {
  return Date.now()
}

export function useGameClock() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}