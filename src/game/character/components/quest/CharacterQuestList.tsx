import { useEffect, useState } from 'react';
import PopUpModal from '../../../../ui/modal/pop-up/PopUpModal';
import { useManagedCharacter } from '../../../../engine/character/hooks/useManagedCharacters';
import { eventBus } from '../../../../engine/event/EventBus';
import { getLocationById } from '../../../../entity/location/utils/Location.utils';
import { GAME_QUESTS } from '../../../../entity/quest/data/Quest.data';
import CharacterListItem from '../list/CharacterListItem';
import type { CharacterEntity } from '../../../../entity/character/types/CharacterEntity.types';

export default function CharacterQuestList(){
  const [show, setShow] = useState(false)
  const {managedCharacter} = useManagedCharacter()

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 5)
  }, [])

  const currentLocation = getLocationById(
    managedCharacter?.locationId as string
  )
  const locationQuests = GAME_QUESTS.filter(q => 
    currentLocation.questIds.includes(q.id)
  )


  return <PopUpModal
    show={show}
    title={<div>Quests</div>}
    subTitle={<div>
      {currentLocation.name}
    </div>}
    onClose={() => {
      setShow(false)
      setTimeout(() => {
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:change',
          meta: {
            worldMode: 'world'
          }
        })
      }, 5)
    }}
  >
    <div>
      <CharacterListItem 
        character={managedCharacter as CharacterEntity} 
        showActions={false}
      />
    </div>
    <div>
      Selected Quest
    </div>
    <div>
      Quest Info
    </div>
    <div>
      {locationQuests.length} Available Quest(s)
    </div>

  </PopUpModal>
}