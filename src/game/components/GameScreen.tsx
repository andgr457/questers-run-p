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

import type {
  ActivityEntry,
} from '../engine/types/Activity.types'
import type { PlayerEntity } from '../entities/player/types/PlayerEntity.types'

export type GameMode =
  | 'boot'
  | 'character_create'
  | 'world'

export default function GameScreen() {
  const [saving, setSaving] = useState('')

  const [mode, setMode] =
    useState<GameMode>('boot')

  const [players, setPlayers] = 
    useLocalStorage<
    PlayerEntity[] | undefined
  >(
    GAME_STORAGE_KEYS.PLAYER_GAME,
    []
  )
  // =====================================
  // RUNTIME PLAYER
  // =====================================

  const runtimePlayersRef = useRef<
    Record<string, PlayerEntity>
  >({})

  // =====================================
  // DIRTY PLAYER
  // =====================================

  const dirtyPlayersRef = useRef(
    new Set<string>()
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
  // RUNTIME ACTIVITIES
  // =====================================

  const runtimeActivitiesRef = useRef<
    Record<string, ActivityEntry>
  >({})

  // =====================================
  // INITIALIZE
  // =====================================

  useEffect(() => {

    gameClockService.start()

    const characterMap: Record<
      string,
      CharacterEntity
    > = {}

    for (const character of characters ?? []) {
      characterMap[character.id] = character
    }

    runtimeCharactersRef.current = characterMap

    const playerMap: Record<
      string,
      PlayerEntity
    > = {}

    for(const player of players ?? []){
      playerMap[player.id] = player
    }

    runtimePlayersRef.current = playerMap

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

  const flushPlayerSave = (
    playerId: string
  ) => {
    const runtimePlayer =
      runtimePlayersRef.current[
        playerId
      ]

    if (!runtimePlayer) return

    setPlayers(prev => {

      const all = prev ?? []

      const existingIndex =
        all.findIndex(
          c => c.id === playerId
        )

      // add
      if (existingIndex === -1) {
        return [
          ...all,
          runtimePlayer,
        ]
      }

      // update
      return all.map(c =>
        c.id === playerId
          ? runtimePlayer
          : c
      )
    })

    dirtyPlayersRef.current.delete(
      playerId
    )
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

          dirtyPlayersRef.current.add(
            event.playerId
          )

          return
        }
        if (
          event.type
          === 'player:save'
        ) {

          dirtyPlayersRef.current.add(
            event.playerId
          )

          flushPlayerSave(
            event.playerId
          )

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

        // =============================
        // ACTIVITY START
        // =============================

        if (
          event.type
          === 'activity:start'
        ) {

          const activity: ActivityEntry = {
            id: event.activityId,

            characterId:
              event.characterId,

            type:
              event.activityType,

            startedAt:
              gameClockService.getNow(),

            status: 'active',

            duration:
              event.duration
              ?? 10000,

            blocking: true,

            meta: event.meta,
          }

          runtimeActivitiesRef.current[
            activity.id
          ] = activity
        }

        // =============================
        // ACTIVITY COMPLETE
        // =============================

        if (
          event.type
          === 'activity:complete'
        ) {

          const existing =
            runtimeActivitiesRef.current[
              event.activityId
            ]

          if (!existing) return

          existing.status =
            'completed'

          existing.completedAt =
            gameClockService.getNow()
        }

        // =============================
        // ACTIVITY CANCEL
        // =============================

        if (
          event.type
          === 'activity:cancel'
        ) {

          const existing =
            runtimeActivitiesRef.current[
              event.activityId
            ]

          if (!existing) return

          existing.status =
            'cancelled'
        }

      })

    return unsub

  }, [])

  // =====================================
  // ACTIVITY RUNTIME LOOP
  // =====================================

  useEffect(() => {

    const unsub =
      gameClockService.subscribe(now => {

        for (
          const activity
          of Object.values(
            runtimeActivitiesRef.current
          )
        ) {

          if (
            activity.status
            !== 'active'
          ) {
            continue
          }

          const elapsed =
            now - activity.startedAt

          const progress =
            Math.min(
              elapsed / activity.duration,
              1
            )

          gameEventBus.emit({
            type: 'activity:progress',

            characterId:
              activity.characterId,

            activityId:
              activity.id,

            activityType:
              activity.type,

            progress,
          })

          if (progress >= 1) {

            gameEventBus.emit({
              type: 'activity:complete',

              characterId:
                activity.characterId,

              activityId:
                activity.id,

              activityType:
                activity.type,

              meta: activity.meta,
            })
          }
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
        for(const playerId of dirtyPlayersRef.current){
          flushPlayerSave(
            playerId
          )
        }
        
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

    if(player){
      runtimePlayersRef.current[
        player.id
      ] = player

      gameEventBus.emit({
        type: 'player:save',
        playerId: player.id
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
    setPlayers([])
    window.location.reload()
  }

  // =====================================
  // RENDER
  // =====================================

  const runtimeCharacters =
    Object.values(
      runtimeCharactersRef.current
    )

  const runtimePlayers =
    runtimePlayersRef.current
    
  return (
    <div>
      <button className='button-basic dark'
        onClick={handleResetEverything}
      >
        RESET
      </button>
      {saving && <span>Saving {saving} data...</span>}
      {mode ===
        'character_create'
        && (
        <CharacterEntityCreate
          playerId={runtimePlayers?.[0]?.id}
          onCancelled={() => setMode('world')}
          onCreated={
            handleCreatedCharacter
          }
        />
      )}

      {mode === 'world' && (
        <CharacterEntityList
          characters={
            runtimeCharacters
          }
          onCreateCharacter={() => {
            setMode('character_create')
          }}
        />
      )}

    </div>
  )
}