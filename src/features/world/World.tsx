import { useEffect, useState } from 'react'
import FeatureBase from '../../core/components/feature-base/FeatureBase'
import { useWorldModeEvents } from '../../engine/events/hooks/useWorldModeEvents'
import GuildHall from '../guild-hall/GuildHall'
import styles from './World.module.css'
import TransitionModeMainScreen from '../transition/TransitionModeMainScreen'
import type { WorldModeMain } from '../../engine/events/types/WorldModeEvents.types'
import Tavern from '../tavern/Tavern'
import { eventBus } from '../../engine/events/EventBus'
import { clockRuntimeService } from '../../engine/clock/ClockRuntimeService'

export default function World() {
  const {
    worldModeMain,
    worldModeOverlay
  } = useWorldModeEvents()

  const [displayedMode, setDisplayedMode] = useState(worldModeMain)
  const [modeChangeText, setModeChangeText] = useState(`Quester's Run`)
  const [modeChangeTo, setModeChangeTo] = useState<WorldModeMain>('guild')

  useEffect(() => {
    if(worldModeMain === displayedMode){
      return
    }
  }, [worldModeMain, displayedMode])

  const triggerTransitionMode = () => {
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
        mode: 'mode-change'
      }
    })
  }

  return (
    <div className={styles.world}>
      <FeatureBase
        show={worldModeMain === displayedMode}
        onHidden={() => {
          setDisplayedMode(worldModeMain)
        }}
      >
        {displayedMode !== 'none' && (
          <div>
            <button
              onClick={() => {
                if(worldModeMain === 'guild') return
                setModeChangeText('Guild Hall')
                setModeChangeTo('guild')
                triggerTransitionMode()
              }}
            >
              GUILD HALL
            </button>
            <button
              onClick={() => {
                if(worldModeMain === 'tavern') return
                setModeChangeText('Tavern')
                setModeChangeTo('tavern')
                triggerTransitionMode()
              }}
            >
              TAVERN
            </button>
          </div>
        )}
        {displayedMode === 'guild' && (
          <GuildHall />
        )}
        {displayedMode === 'tavern' && (
          <Tavern />
        )}
      </FeatureBase>

      {worldModeOverlay === 'intro' && (
        <TransitionModeMainScreen 
          onCompleteModeMainChangeTo='guild'
          text={`Quester's Run`}
        />
      )}
      {worldModeOverlay === 'mode-change' && (
        <TransitionModeMainScreen
          text={modeChangeText}
          onCompleteModeMainChangeTo={modeChangeTo}
        />
      )}
    </div>
  )
}