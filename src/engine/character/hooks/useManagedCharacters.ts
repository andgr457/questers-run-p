import { useEffect, useState } from 'react';
import { eventBus } from '../../event/EventBus';
import type { CharacterEntity } from '../../../entity/character/types/CharacterEntity.types';
import { characterRuntimeService } from '../CharacterRuntimeService';
import { GAME_EVENT_BUS_CHARACTER_TYPES } from '../data/CharacterEvents.data';

export function useManagedCharacter(){
  const [managedCharacter, setManagedCharacter] = useState<CharacterEntity | undefined>(
    characterRuntimeService.getManagingCharacter()
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!GAME_EVENT_BUS_CHARACTER_TYPES.includes(event.type)){
        return
      }
      
      if(event.type === 'character:manage:added'
        || event.type === 'character:saved'
      ){
        setManagedCharacter(characterRuntimeService.getManagingCharacter())
      }
    })
    return unsub
  }, [])

  return {
    managedCharacter
  }
}