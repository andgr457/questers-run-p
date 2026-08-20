import { clockRuntimeService } from '../../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../../engine/events/EventBus'
import { useWorldModeEvents } from '../../../engine/events/hooks/useWorldModeEvents'
import type { WorldModeMain } from '../../../engine/events/types/WorldModeEvents.types'
import styles from './WorldNav.module.css'

export default function WorldNav() {
  const {
    worldModeMain
  } = useWorldModeEvents()

  const triggerTransitionMode = (
    transitionText: string,
    transitionOnCompleteMode: WorldModeMain
  ) => {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:mode:main:change',
      created: clockRuntimeService.getNow(),
      meta: {
        mode: 'none'
      }
    })
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:mode:overlay:change',
      created: clockRuntimeService.getNow(),
      meta: {
        mode: 'mode-change',
        transitionText,
        transitionOnCompleteMode
      }
    })
  }

  const generateNavItem = (
    transitionText: string,
    transitionOnCompleteMode: WorldModeMain,
  ) => {
    const isCurrentMode = worldModeMain === transitionOnCompleteMode
    return <button
      className={`${styles.nav} ${isCurrentMode ? styles.active : ''}`}
      onClick={() => {
        if(isCurrentMode) return

        triggerTransitionMode(
          transitionText,
          transitionOnCompleteMode
        )
      }}
    >
      {transitionText}
    </button>
  }

  return (
    <div 
      className={styles.wrapper}
    >
      {generateNavItem(`Wiki`, 'wiki')}
      {generateNavItem(`Town Map`,'town:map')}
      {generateNavItem(`Town Hall`,'town:hall')}
      {generateNavItem(`Tavern`,'tavern:hall')}
      {generateNavItem(`Guild`,'guild:hall')}

    </div>
  )
}