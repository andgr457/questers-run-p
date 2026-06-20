import { useEffect, useState } from 'react'
import ViewPlayerCreate from './player/create/ViewPlayerCreate'
import { gameEventBus } from '../../engine/event-bus/GameEventBus'
import { playerRuntimeService } from '../../engine/entity/PlayerRuntimeService'
import { characterRuntimeService } from '../../engine/entity/CharacterRuntimeService'
import ViewDebug from './ViewDebug'

export type GameMode =
  | 'boot'
  | 'player_create'
  | 'character_create'
  | 'world'

export default function ViewMain() {
  const [mode, setMode] = useState<GameMode>('boot')
  const [debugOpen, setDebugOpen] = useState(false)

  useEffect(() => {
    playerRuntimeService.init()
    characterRuntimeService.init()
    characterRuntimeService.start()

    const player = playerRuntimeService.getPlayer()
    const characters = characterRuntimeService.getCharacters()

    if (!player) {
      setMode('player_create')
      return
    }

    if (characters.length === 0) {
      setMode('character_create')
      return
    }

    setMode('world')
  }, [])

  useEffect(() => {
    return gameEventBus.subscribe(event => {
      switch (event.type) {
        case 'player:saved': {
          const characters =
            characterRuntimeService.getCharacters()

          setMode(
            characters.length === 0
              ? 'character_create'
              : 'world'
          )
          break
        }

        case 'character:saved':
          setMode('world')
          break
      }
    })
  }, [])

  return (
    <>
      <button className='button-basic dark' onClick={() => {setDebugOpen(true)}}>
        DEBUG
      </button>
      <div>
        PROFILE: {playerRuntimeService.getPlayer()?.name}
      </div>
      <ViewDebug isOpen={debugOpen} onClose={() => {setDebugOpen(false)}} />
      {mode === 'boot' && <div />}

      {mode === 'player_create' && (
        <ViewPlayerCreate />
      )}

      {mode === 'character_create' && (
        <div>Character Create</div>
      )}

      {mode === 'world' && (
        <div>World</div>
      )}

    </>
  )
}