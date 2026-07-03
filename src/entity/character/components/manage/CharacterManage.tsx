import { useState, useEffect } from 'react';
import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService';
import { eventBus } from '../../../../engine/event/EventBus';
import { GAME_EVENT_BUS_CHARACTER_TYPES } from '../../../../engine/event/utils/EventBus.utils';
import GamePanel from '../../../../ui/panel/GamePanel';
import type { CharacterEntity } from '../../types/CharacterEntity.types';
import { GAME_LOCATIONS } from '../../../location/data/Location.data';
import GamePanelSection from '../../../../ui/panel/GamePanelSection';
import GameListWrapper from '../../../../ui/list/GameListWrapper';
import type { Location } from '../../../location/types/Location.types';

export default function CharacterManage() {
  const [character, setCharacter] = useState<CharacterEntity | undefined>(characterRuntimeService.getManagingCharacter())

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(GAME_EVENT_BUS_CHARACTER_TYPES.includes(event.type)){
        setCharacter(characterRuntimeService.getManagingCharacter())
      }
    })
    return unsub
  }, [])

  const currentLocation = GAME_LOCATIONS.find(l => l.id === character?.locationId)

  const travelToLocations = GAME_LOCATIONS.filter(l => 
    currentLocation?.linkedLocationIds?.includes(l.id)
  )

  if(!character || !currentLocation) return null
  return <GamePanel
    title={`Manage ${character.name}`}
    currentScreenName=''
  >
    <GamePanelSection
      actions={[]}
      actionsLocation='bottom'
      title={`${currentLocation.name} Actions`}
    >

    </GamePanelSection>
    <GamePanelSection
      actions={[]}
      actionsLocation='bottom'
      title={`Travel from ${currentLocation.name ?? 'No'}`}
    >
      <GameListWrapper<Location>
        actions={[
          {
            name: 'Travel',
            fn: (entity) => {
              eventBus.emit({
                id: crypto.randomUUID(),
                type: 'transition:start',
                meta: {
                  characterId: character.id,
                  destinationId: entity?.id as string,
                  transition: {
                    title: `${character.name} is travelling to the ${entity?.name}...`,
                    delay: 5000
                  }
                }
              })
            }
          }
        ]}
        entities={travelToLocations}
        getEntityContent={(entity) => {
          const linkedLocations = GAME_LOCATIONS.filter(l => 
            entity?.linkedLocationIds?.includes(l.id)
          )
          return <>
            <div className='game-list-item-title'>
              {entity.name}
            </div>
            <div style={{width: '100%', textAlign: 'center'}}>
              <div className='game-code'>
                {entity.type}
              </div>
            </div>
            <div className='game-list-item-label'>
              {entity.description}
            </div>
            <div>
              <div className='game-list-item-title'>
                Linked To
              </div>
              {linkedLocations.map(l => {
                return <div className='game-list-item-label' style={{padding: '2px', marginBottom: '2px', marginTop: '2px', textTransform: 'uppercase'}}>
                  {l.name}
                </div>
              })}
            </div>
          </>
        }}
      />
    </GamePanelSection>
  </GamePanel>
}