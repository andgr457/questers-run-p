import { useEffect, useState } from 'react'
import FeatureBase from '../../core/components/feature/components/base/FeatureBase'
import { useWorldModeEvents } from '../../engine/events/hooks/useWorldModeEvents'
import GuildHall from '../guild/hall/GuildHall'
import styles from './World.module.css'
import TransitionModeMainScreen from '../transition/TransitionModeMainScreen'
import TavernHall from '../tavern/hall/TavernHall'
import Version from '../version/Version'
import TownHall from '../town/hall/TownHall'
import WorldNav from './nav/WorldNav'
import Wiki from '../wiki/Wiki'
import TownMap from '../town/map/TownMap'
import { characterEventService } from '../../engine/events/services/CharacterEventService'
import CharacterCreate from '../character-create/CharacterCreate'

export default function World() {
  const {
    worldModeMain,
    worldModeOverlay,
    transitionOnCompleteMode,
    transitionText
  } = useWorldModeEvents()

  const [displayedMode, setDisplayedMode] = useState(worldModeMain)

  useEffect(() => {
    if(worldModeMain === displayedMode){
      return
    }
  }, [worldModeMain, displayedMode])

  return (
    <div className={styles.world}>
      <FeatureBase
        show={worldModeMain === displayedMode}
        onHidden={() => {
          setDisplayedMode(worldModeMain)
        }}
      >
        {displayedMode !== 'none' && !displayedMode.includes(':create') && (
          <WorldNav />
        )}
        
        {displayedMode === 'character:create' && (
          <CharacterCreate />
        )}
        {displayedMode === 'wiki' && (
          <Wiki />
        )}
        {displayedMode === 'town:map' && (
          <TownMap />
        )}
        {displayedMode === 'town:hall' && (
          <TownHall />
        )}
        {displayedMode === 'tavern:hall' && (
          <TavernHall />
        )}
        {displayedMode === 'guild:hall' && (
          <GuildHall />
        )}
        
      </FeatureBase>

      {worldModeOverlay === 'intro' && (
        <TransitionModeMainScreen 
          onCompleteModeMainChangeTo={`${characterEventService.getCharacters().length === 0 ? 'character:create' : 'town:map'}`}
          text={`Quester's Run`}
        />
      )}
      {worldModeOverlay === 'mode-change' && (
        <TransitionModeMainScreen
          text={transitionText}
          onCompleteModeMainChangeTo={transitionOnCompleteMode}
        />
      )}
      <Version />
    </div>

  )
}