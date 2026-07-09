import { useState } from 'react';
import { eventBus } from '../../../../engine/event/EventBus';
import GamePanel from '../../../../ui/panel/GamePanel';
import { GAME_LOCATIONS } from '../../../location/data/Location.data';
import GamePanelSection from '../../../../ui/panel/GamePanelSection';
import type { Location } from '../../../location/types/Location.types';
import LocationDetail from '../../../location/components/detail/LocationDetail';
import LocationList from '../../../location/components/list/LocationList';
import { ContextMenuIcon } from '../../../../game/context-menu/data/ContextMenuIcon.data';
import { useTutorial } from '../../../../engine/tutorial/hooks/useTutorial';
import { useManagedCharacter } from '../../../../engine/character/hooks/useManagedCharacters';

type CharacterManageMode = 'main'
  | 'location_detail'

export default function CharacterManage() {
  const {managedCharacter: character} = useManagedCharacter()
  const [mode, setMode] = useState<CharacterManageMode>('main')
  const [viewLocation, setViewLocation] = useState<Location | undefined>(undefined)
  const {tutorial} = useTutorial()

  const currentLocation = GAME_LOCATIONS.find(l => l.id === character?.locationId)

  const travelToLocations = GAME_LOCATIONS.filter(l => 
    currentLocation?.linkedLocationIds?.includes(l.id)
  )

  if(!character || !currentLocation) return null
  return (
    <>
    {mode === 'location_detail' && viewLocation && <GamePanel
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
        onBackLabel={`Manage ${character.name}`}
      >
        <LocationDetail entity={viewLocation} />
      </GamePanelSection>
    </GamePanel>}

    {mode === 'main' && <GamePanel
      title={`Manage ${character.name}`}
      currentScreenName=''
    >
      <div className='game-list-item-header'>
        {currentLocation.name}
      </div>

      <GamePanelSection
        actions={[]}
        actionsLocation='bottom'
        title={`Travel (${travelToLocations.length})`}
      >
        <LocationList 
          locationsWithActions={travelToLocations.map(l => {
            let isTutorial = false
            if(tutorial){
              const foundHint = tutorial.hints.find(h => h.uiPath?.includes(l.type))
              console.log(tutorial, foundHint, l)
              if(foundHint){
                isTutorial = true
              }
            }
            
            return {
              location: l,
              actions: [
                {
                  title: 'Travel',
                  icon: ContextMenuIcon.start,
                  isTutorial,
                  fn: (entity) => {
                    eventBus.emit({
                      id: crypto.randomUUID(),
                      type: 'transition:start',
                      meta: {
                        transition: {
                          title: `${character.name} is travelling to the ${entity?.name}...`,
                          delay: 5000,
                          characterId: character.id,
                          destinationLocationId: entity?.id as string,
                          sourceLocationId: character.locationId,
                        },
                      }
                    })
                  }
                },
                {
                  title: 'View',
                  icon: ContextMenuIcon.eye,
                  fn: (entity) => {
                    setViewLocation(entity)
                    setMode('location_detail')
                  }
                }
              ]
            }
          })}
        />

        
      </GamePanelSection>
    </GamePanel>}
    </>
  )
  
}