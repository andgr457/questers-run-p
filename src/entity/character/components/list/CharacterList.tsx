import { useState, useEffect } from 'react'
import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import { eventBus } from '../../../../engine/event/EventBus'
import { GAME_EVENT_BUS_PLAYER_TYPES, GAME_EVENT_BUS_CHARACTER_TYPES } from '../../../../engine/event/utils/EventBus.utils'
import { playerRuntimeService } from '../../../../engine/player/PlayerRuntimeService'
import type { PlayerEntity } from '../../../player/types/PlayerEntity.types'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import GamePanel from '../../../../ui/panel/GamePanel'
import GameListWrapper from '../../../../ui/list/GameListWrapper'
import CharacterDetail from '../detail/CharacterDetail'
import CharacterListItem from './CharacterListItem'

export default function CharacterList() {
  const [player, setPlayer] = useState<PlayerEntity | undefined>(playerRuntimeService.getPlayer())
  const [characters, setCharacters] = useState<CharacterEntity[]>(characterRuntimeService.getCharacters())

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(GAME_EVENT_BUS_PLAYER_TYPES.includes(event.type)){
        setPlayer(playerRuntimeService.getPlayer())
      }
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
    <GameListWrapper<CharacterEntity>
      actions={[]}
      entities={characters}
      getEntityContent={(entity) => {
        return <CharacterListItem entity={entity} />
      }}      
    />
  </GamePanel>
}