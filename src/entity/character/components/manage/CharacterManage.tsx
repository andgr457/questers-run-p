import { useState } from 'react';
import GamePanel from '../../../../ui/panel/GamePanel';
import { GAME_LOCATIONS } from '../../../location/data/Location.data';
import GamePanelSection from '../../../../ui/panel/GamePanelSection';
import type { LocationEntity } from '../../../location/types/LocationEntity.types';
import LocationDetail from '../../../location/components/detail/LocationDetail';
import { useManagedCharacter } from '../../../../engine/character/hooks/useManagedCharacters';
import styles from './CharacterManage.module.css'
import CharacterManageTravel from './CharacterManageTravel';
import { ContextMenuIcon } from '../../../../game/context-menu/data/ContextMenuIcon.data';
import { eventBus } from '../../../../engine/event/EventBus';
import { useTutorial } from '../../../../engine/tutorial/hooks/useTutorial';

export type CharacterManageMode = 'main'
  | 'detail'

export default function CharacterManage() {
  const {managedCharacter} = useManagedCharacter()
  const [mode, setMode] = useState<CharacterManageMode>('main')
  const [viewLocation, setViewLocation] = useState<LocationEntity | undefined>(undefined)
  const {tutorial} = useTutorial()
  const currentLocation = GAME_LOCATIONS.find(l => l.id === managedCharacter?.locationId)

  const travelToLocations = GAME_LOCATIONS.filter(l => 
    currentLocation?.linkedLocationIds?.includes(l.id)
  )

  if(!managedCharacter || !currentLocation) return null
  return (
    <>
    {mode === 'detail' && viewLocation && <GamePanel
      title={`${viewLocation.name}`}
      currentScreenName=''
    >
      <GamePanelSection
        actions={[]}
        actionsLocation='top'
        onBack={() => {
          setViewLocation(undefined)
          setMode('main')
        }}
        onBackLabel={`Manage ${managedCharacter.name}`}
      >
        <LocationDetail entity={viewLocation} />
      </GamePanelSection>
    </GamePanel>}
    {mode === 'main' && <GamePanel
      title={`Manage ${managedCharacter.name}`}
      currentScreenName=''
    >
      <div className={styles.wrapper}>
        <div className={styles.title}>{`${currentLocation.name}`}</div>

        <div className={styles.description}>
          {currentLocation.description}
        </div>

        <CharacterManageTravel 
          character={managedCharacter}
          setMode={setMode}
          setViewLocation={setViewLocation}
          travelToLocations={travelToLocations}
        />

        <div className={styles.section}>
          <div className={styles.subtitle}>Actions</div>
          <div className={styles.actions}>
            {currentLocation.type === 'adv_guild' && <div 
              title={`Enter the ${currentLocation.name}`}
              className={`${styles.action} ${tutorial?.hints.some(h => h.uiPath === 'characters:manage:action:adv_guild') ? 'tutorial-hint' : ''}`}
              onClick={() => {
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'world:mode:change',
                  meta: {
                    worldMode: 'adv_guild'
                  }
                })
              }}
            >
              {ContextMenuIcon.adv_guild} Enter the {currentLocation.name}
            </div>}
          </div>
        </div>
      </div>
    </GamePanel>}
    </>
  )
  
}