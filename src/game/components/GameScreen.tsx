import {
  useEffect,
  useRef,
  useState,
} from 'react'


import { useLocalStorage } from '../../hooks/useLocalStorage'

import { GAME_STORAGE_KEYS } from '../data/GameStorageKeys.data'

import type { CharacterEntity } from '../entities/character/types/Character.types'

import CharacterEntityCreate from '../entities/character/components/CharacterEntityCreate'

import CharacterEntityList from '../entities/character/components/CharacterEntityList'

import {
  gameEventBus,
} from '../engine/GameEventBus'

import {
  gameClockService,
} from '../engine/GameClockService'

import type { PlayerEntity } from '../entities/player/types/PlayerEntity.types'

import styles from './GameScreen.module.css';
import { activityRuntimeService } from '../engine/ActivityRuntimeService'

export type GameMode =
  | 'boot'
  | 'character_create'
  | 'world'

export default function GameScreen() {
  const [saving, setSaving] = useState('')

  const [mode, setMode] =
    useState<GameMode>('boot')

  const [player, setPlayer] =
    useLocalStorage<
      PlayerEntity | undefined
    >(
      GAME_STORAGE_KEYS.PLAYER_GAME,
      undefined
    )
  // =====================================
  // RUNTIME PLAYER
  // =====================================

  const runtimePlayerRef = useRef<
    PlayerEntity | undefined
  >(undefined)

  // =====================================
  // DIRTY PLAYER
  // =====================================

  const dirtyPlayerRef = useRef<PlayerEntity | undefined>(
    undefined
  )

  const [characters, setCharacters] =
    useLocalStorage<
      CharacterEntity[] | undefined
    >(
      GAME_STORAGE_KEYS.CHARACTERS_GAME,
      []
    )

  // =====================================
  // RUNTIME CHARACTERS
  // =====================================

  const runtimeCharactersRef = useRef<
    Record<string, CharacterEntity>
  >({})

  // =====================================
  // DIRTY CHARACTERS
  // =====================================

  const dirtyCharactersRef = useRef(
    new Set<string>()
  )

  // =====================================
  // INITIALIZE
  // =====================================

  useEffect(() => {
    const characterMap: Record<
      string,
      CharacterEntity
    > = {}

    for (const character of characters ?? []) {
      characterMap[character.id] = character
    }

    runtimeCharactersRef.current = characterMap

    runtimePlayerRef.current = player

    if (
      !characters
      || characters.length === 0
    ) {
      setMode('character_create')
      return
    }

    setMode('world')

  }, [])

  // =====================================
  // FORCE RENDER LOOP
  // =====================================

  const [, forceRender] = useState(0)

  useEffect(() => {

    const unsub =
      gameClockService.subscribe(() => {
        forceRender(prev => prev + 1)
      })

    return unsub

  }, [])

  // =====================================
  // SAVE SYSTEM
  // =====================================

  const flushPlayerSave = () => {
    const runtimePlayer =
      runtimePlayerRef.current

    if (!runtimePlayer) return

    setPlayer({
      ...runtimePlayer
    })

    dirtyPlayerRef.current = undefined
  }

  const flushCharacterSave = (
    characterId: string
  ) => {
    const runtimeCharacter =
      runtimeCharactersRef.current[
      characterId
      ]

    if (!runtimeCharacter) return

    setCharacters(prev => {

      const all = prev ?? []

      const existingIndex =
        all.findIndex(
          c => c.id === characterId
        )

      // add
      if (existingIndex === -1) {
        return [
          ...all,
          runtimeCharacter,
        ]
      }

      // update
      return all.map(c =>
        c.id === characterId
          ? runtimeCharacter
          : c
      )
    })

    dirtyCharactersRef.current.delete(
      characterId
    )
  }

  // =====================================
  // EVENT BUS
  // =====================================

  useEffect(() => {

    const unsub =
      gameEventBus.subscribe(event => {
        if (
          event.type
          === 'player:dirty'
        ) {

          dirtyPlayerRef.current = event.player

          return
        }
        if (
          event.type
          === 'player:save'
        ) {

          dirtyPlayerRef.current = event.player

          flushPlayerSave()

          return
        }
        // =============================
        // CHARACTER SAVE
        // =============================

        if (
          event.type
          === 'character:dirty'
        ) {

          dirtyCharactersRef.current.add(
            event.characterId
          )

          return
        }

        if (
          event.type
          === 'character:save'
        ) {

          dirtyCharactersRef.current.add(
            event.characterId
          )

          flushCharacterSave(
            event.characterId
          )

          return
        }
      })

    return unsub

  }, [])

  // =====================================
  // AUTOSAVE
  // =====================================

  useEffect(() => {

    const interval =
      setInterval(() => {
        setSaving('Player')
        flushPlayerSave()

        setSaving('Character')
        for (
          const characterId
          of dirtyCharactersRef.current
        ) {

          flushCharacterSave(
            characterId
          )
        }

        setSaving('')
      }, 5000)

    return () =>
      clearInterval(interval)

  }, [])

  // =====================================
  // CREATE CHARACTER
  // =====================================

  const handleCreatedCharacter = (
    character: CharacterEntity,
    player?: PlayerEntity
  ) => {

    if (player) {
      console.log('player create', player)
      runtimePlayerRef.current = player

      gameEventBus.emit({
        type: 'player:save',
        player: player
      })
    }

    runtimeCharactersRef.current[
      character.id
    ] = character

    gameEventBus.emit({
      type: 'character:save',
      characterId: character.id,
    })

    setMode('world')
  }

  const handleResetEverything = () => {
    setCharacters([])
    setPlayer(undefined)
    window.location.reload()
  }

  // =====================================
  // RENDER
  // =====================================

  const runtimeCharacters =
    Object.values(
      runtimeCharactersRef.current
    )

  const runtimePlayer =
    runtimePlayerRef.current


  return (
    <div className={styles.screen}>
      {mode === 'world' && <div className={styles.menu}>
        <button className='button-basic dark'
          onClick={handleResetEverything}
        >
          RESET
        </button>
        <button className='button-basic' onClick={() => setMode('character_create')}>
          Create Character
        </button>
      </div>}
      {saving && <span>Saving {saving} data...</span>}

      {/* MODALS */}
      {mode ===
        'character_create'
        && (
          <CharacterEntityCreate
            player={runtimePlayer as PlayerEntity}
            playerCharacters={runtimeCharacters}
            onCancelled={() => setMode('world')}
            onCreated={
              handleCreatedCharacter
            }
          />
        )}

      {/* MODE VIEWS */}
      <div className={styles.screenView}>
        {mode === 'world' && (
          <CharacterEntityList
            characters={
              runtimeCharacters
            }
          />
        )}
      </div>

      {characters?.map(c => {
        const active = activityRuntimeService.getActive(c.id)
        return active.map(a => {
          const progress = activityRuntimeService.getProgress(c.id, a.id)
          return <div>
            <div>{c.name}</div>
            <div>{a.id}</div>
            <div>{a.type}</div>
            <div>{a.status}</div>
            <div>{progress}</div>
            </div>
          })
      })}

    </div>
  )
}