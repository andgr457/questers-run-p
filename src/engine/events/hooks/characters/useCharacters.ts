import { useEffect, useState } from 'react';
import type { Character } from '../../../../interfaces/Character.types';
import { characterEventService } from '../../services/CharacterEventService';
import { eventBus } from '../../EventBus';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(
    characterEventService.getCharacters() ?? []
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!event.type.startsWith('character:')) return
      if(
        event.type.includes(':added')
        || event.type.includes(':saved')
        || event.type.includes(':created')
      ){
        setCharacters(
          characterEventService.getCharacters()
        )
      }
      
    })
    return unsub
  })

  return {
    characters
  }
}