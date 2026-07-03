import { useState, useEffect } from 'react'
import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import { eventBus } from '../../../../engine/event/EventBus'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import GamePanel from '../../../../ui/panel/GamePanel'
import CharacterListItem from './CharacterListItem'
import { GAME_EVENT_BUS_CHARACTER_TYPES, GAME_EVENT_BUS_PLAYER_TYPES } from '../../../../engine/event/utils/EventBus.utils'
import type { PlayerEntity } from '../../../player/types/PlayerEntity.types'
import { playerRuntimeService } from '../../../../engine/player/PlayerRuntimeService'
import { useConfirm } from '../../../../ui/modal/providers/ConfirmProvider'

export default function CharacterList() {
  const {showConfirm} = useConfirm()
  const [characters, setCharacters] = useState<CharacterEntity[]>(characterRuntimeService.getCharacters())
  const [player, setPlayer] = useState<PlayerEntity | undefined>(playerRuntimeService.getPlayer())
  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(GAME_EVENT_BUS_CHARACTER_TYPES.includes(event.type)){
        setCharacters(characterRuntimeService.getCharacters())
      }
      if(GAME_EVENT_BUS_PLAYER_TYPES.includes(event.type)){
        setPlayer(playerRuntimeService.getPlayer())
      }
    })
    return unsub
  }, [])

  const newCharacterBtnFn = !player?.characterTokens ? async () => {
    await showConfirm({
      isYesNo: false,
      message: `Complete tutorials, gain achievements, and level your player to earn more character tokens.`,
      title: 'Not Enough Character Tokens'
    })
  } : () => {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:mode:change',
      meta: {
        worldMode: 'character_create'
      }
    })
  }

  return <GamePanel
    currentScreenName=''
    title='Characters'
  >
    <div className='game-panel-section-actions'>
      <div className='game-panel-section-action'>
        <button className='button dark' onClick={newCharacterBtnFn}>
          New Character - {player?.characterTokens} Token(s)
        </button>
      </div>
    </div>
    {characters.map(c => {
      return <CharacterListItem entity={c} onClick={(entity) => {
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'character:manage',
          meta: {
            characterId: entity.id
          }
        })
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:change',
          meta: {
            worldMode: 'character_manage'
          }
        })
      }} />
    })}
  </GamePanel>
}