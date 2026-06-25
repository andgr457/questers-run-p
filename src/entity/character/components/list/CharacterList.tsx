import { useState, useEffect } from 'react'
import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import { eventBus } from '../../../../engine/event/EventBus'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import GamePanel from '../../../../ui/panel/GamePanel'
import CharacterListItem from './CharacterListItem'
import { GAME_EVENT_BUS_CHARACTER_TYPES } from '../../../../engine/event/utils/EventBus.utils'

export default function CharacterList() {
  const [characters, setCharacters] = useState<CharacterEntity[]>(characterRuntimeService.getCharacters())

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(GAME_EVENT_BUS_CHARACTER_TYPES.includes(event.type)){
        setCharacters(characterRuntimeService.getCharacters())
      }
    })
    return unsub
  }, [])

  return <GamePanel
    currentScreenName=''
    title='Characters'
  >
    {characters.map(c => {
      return <CharacterListItem entity={c} />
    })}
  </GamePanel>
}