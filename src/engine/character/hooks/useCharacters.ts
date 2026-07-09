import { useEffect, useState } from 'react';
import { eventBus } from '../../event/EventBus';
import type { CharacterEntity } from '../../../entity/character/types/CharacterEntity.types';
import { characterRuntimeService } from '../CharacterRuntimeService';
import { GAME_EVENT_BUS_CHARACTER_TYPES } from '../../event/utils/EventBus.utils';

export function useCharacters(){
  const [characters, setCharacters] = useState<CharacterEntity[]>(
    characterRuntimeService.getCharacters()
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!GAME_EVENT_BUS_CHARACTER_TYPES.includes(event.type)){
        return
      }
      
      setCharacters(characterRuntimeService.getCharacters())
    })
    return unsub
  }, [])

  return {
    characters
  }
}