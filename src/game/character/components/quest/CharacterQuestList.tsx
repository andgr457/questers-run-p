import { useEffect, useState } from 'react';
import PopUpModal from '../../../../ui/modal/pop-up/PopUpModal';
import { useManagedCharacter } from '../../../../engine/character/hooks/useManagedCharacters';
import { eventBus } from '../../../../engine/event/EventBus';
import { getLocationById } from '../../../../entity/location/utils/Location.utils';
import { GAME_QUESTS } from '../../../../entity/quest/data/Quest.data';

export default function CharacterQuestList(){
  const [show, setShow] = useState(false)
  const {managedCharacter} = useManagedCharacter()

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 50)
  }, [])

  const currentLocation = getLocationById(
    managedCharacter?.locationId as string
  )
  const locationQuests = GAME_QUESTS.filter(q => 
    currentLocation.questIds.includes(q.id)
  )


  return <PopUpModal
    show={show}
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
      }, 500)
    }}
  >
    <div>
      {currentLocation.name} Quests
    </div>
    <hr/>
    <div>
      Selected Quest
    </div>
    <div>
      Quest Info
    </div>
    <hr/>
    <div>
      {locationQuests.length} Available Quest(s)
    </div>

  </PopUpModal>
}