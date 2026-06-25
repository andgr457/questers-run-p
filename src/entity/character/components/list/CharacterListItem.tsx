import { useState, useEffect } from 'react'
import { getCharacterGold } from '../../../../engine/character/utils/Character.utils'
import { eventBus } from '../../../../engine/event/EventBus'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import { GAME_CHARACTER_CLASSES } from '../../../character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../../character-class/types/CharacterClassEntity.types'

interface Props {
  entity: CharacterEntity
}

export default function CharacterListItem(props: Props){
  const {
    entity
  } = props
  const [gold, setGold] = useState(getCharacterGold(entity?.id))

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'character:gold:added'){
        setGold(getCharacterGold(entity.id))
      }
    })
    return unsub
  }, [])

  const className = GAME_CHARACTER_CLASSES[entity?.classId as CharacterClassId]?.name

  return <>
    <div className='game-list-item-title'>
      {entity.name}
    </div>
    <div className='game-list-item-label'>
      Lv. {entity.level} {className}
    </div>
    
    
  </>
}