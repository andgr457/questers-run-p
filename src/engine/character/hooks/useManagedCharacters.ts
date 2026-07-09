import { useEffect, useState } from 'react';
import { eventBus } from '../../event/EventBus';
import type { CharacterEntity } from '../../../entity/character/types/CharacterEntity.types';
import { characterRuntimeService } from '../CharacterRuntimeService';

export function useManagedCharacter(){
  const [managedCharacter, setManagedCharacter] = useState<CharacterEntity | undefined>(
    characterRuntimeService.getManagingCharacter()
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
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