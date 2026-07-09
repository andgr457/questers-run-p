import { eventBus } from '../../../../engine/event/EventBus'
import { ContextMenuIcon } from '../../../../game/context-menu/data/ContextMenuIcon.data'
import { useConfirm } from '../../../../ui/modal/providers/ConfirmProvider'
import LocationList from '../../../location/components/list/LocationList'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import type { CharacterManageMode } from './CharacterManage'
import styles from './CharacterManage.module.css'
import type { Location } from '../../../location/types/Location.types';
import { useTutorial } from '../../../../engine/tutorial/hooks/useTutorial'

interface Props {
  travelToLocations: Location[]
  character: CharacterEntity
  setViewLocation: (location: Location) => void
  setMode: (mode: CharacterManageMode) => void
}

export default function CharacterManageTravel(props: Props){
  const {
    travelToLocations,
    character,
    setMode,
    setViewLocation
  } = props
  const {showConfirm} = useConfirm()
  const {tutorial} = useTutorial()
  return <div className={styles.section}>
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
        const characterCanTravelTo = character.level >= l.level
        
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
                    message: `${character.name} (Level ${character.level}) does not meet the required level to travel to ${l.name} (Level ${l.level}).`
                  })
                  return
                }
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'transition:start',
                  meta: {
                    transition: {
                      title: `${character.name} is on the move to the ${entity?.name}...`,
                      delay: l.travelMs,
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
  </div>
}
