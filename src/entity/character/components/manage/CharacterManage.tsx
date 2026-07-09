import { useState } from 'react';
import GamePanel from '../../../../ui/panel/GamePanel';
import { GAME_LOCATIONS } from '../../../location/data/Location.data';
import GamePanelSection from '../../../../ui/panel/GamePanelSection';
import type { Location } from '../../../location/types/Location.types';
import LocationDetail from '../../../location/components/detail/LocationDetail';
import { useManagedCharacter } from '../../../../engine/character/hooks/useManagedCharacters';
import styles from './CharacterManage.module.css'
import CharacterManageTravel from './CharacterManageTravel';

export type CharacterManageMode = 'main'
  | 'location_detail'

export default function CharacterManage() {
  const {managedCharacter} = useManagedCharacter()
  const [mode, setMode] = useState<CharacterManageMode>('main')
  const [viewLocation, setViewLocation] = useState<Location | undefined>(undefined)

  const currentLocation = GAME_LOCATIONS.find(l => l.id === managedCharacter?.locationId)

  const travelToLocations = GAME_LOCATIONS.filter(l => 
    currentLocation?.linkedLocationIds?.includes(l.id)
  )

  if(!managedCharacter || !currentLocation) return null
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
        {/* <div className={styles.section}>
          <div className={styles.subtitle}>Travel</div>
          <LocationList 
            locationsWithActions={travelToLocations.map(l => {
              let isTutorial = false
              if(tutorial){
                const foundHint = tutorial.hints.find(h => h.uiPath?.includes(l.type))
                if(foundHint){
                  isTutorial = true
                }
              }
              const characterCanTravelTo = managedCharacter.level >= l.level
              
              return {
                location: l,
                actions: [
                  {
                    title: characterCanTravelTo ? 'Travel' : `Character Level ${l.level} Required`,
                    icon: characterCanTravelTo ? ContextMenuIcon.start : ContextMenuIcon.prohibited,
                    isTutorial: characterCanTravelTo && isTutorial,
                    fn: async (entity) => {
                      if(!characterCanTravelTo){
                        await showConfirm({
                          isYesNo: false,
                          title: 'Location Locked',
                          message: `${managedCharacter.name} (Level ${managedCharacter.level}) does not meet the required level to travel to ${l.name} (Level ${l.level}).`
                        })
                        return
                      }
                      eventBus.emit({
                        id: crypto.randomUUID(),
                        type: 'transition:start',
                        meta: {
                          transition: {
                            title: `${managedCharacter.name} is on the move to the ${entity?.name}...`,
                            delay: l.travelMs,
                            characterId: managedCharacter.id,
                            destinationLocationId: entity?.id as string,
                            sourceLocationId: managedCharacter.locationId,
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
        </div> */}

        <div className={styles.section}>
          <div className={styles.subtitle}>Actions</div>
          
        </div>
      </div>
    </GamePanel>}
    {/* {mode === 'main' && <GamePanel
      title={`Manage ${managedCharacter.name}`}
      currentScreenName=''
    >
      <div className=''>

      </div>
      <div className='game-list-item-header'>
        {currentLocation.name}
      </div>
      <div className={styles.sections}>

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
              if(foundHint){
                isTutorial = true
              }
            }
            const characterCanTravelTo = managedCharacter.level >= l.level
            
            return {
              location: l,
              actions: [
                {
                  title: characterCanTravelTo ? 'Travel' : `Character Level ${l.level} Required`,
                  icon: characterCanTravelTo ? ContextMenuIcon.start : ContextMenuIcon.prohibited,
                  isTutorial: characterCanTravelTo && isTutorial,
                  fn: async (entity) => {
                    if(!characterCanTravelTo){
                      await showConfirm({
                        isYesNo: false,
                        title: 'Location Locked',
                        message: `${managedCharacter.name} (Level ${managedCharacter.level}) does not meet the required level to travel to ${l.name} (Level ${l.level}).`
                      })
                      return
                    }
                    eventBus.emit({
                      id: crypto.randomUUID(),
                      type: 'transition:start',
                      meta: {
                        transition: {
                          title: `${managedCharacter.name} is on the move to the ${entity?.name}...`,
                          delay: l.travelMs,
                          characterId: managedCharacter.id,
                          destinationLocationId: entity?.id as string,
                          sourceLocationId: managedCharacter.locationId,
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
    </GamePanel>} */}
    </>
  )
  
}