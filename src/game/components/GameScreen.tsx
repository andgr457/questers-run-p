import { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { GAME_STORAGE_KEYS } from '../data/GameStorageKeys.data'
import type { CharacterEntity } from '../entities/character/types/Character.types'
import CharacterEntityCreate from '../entities/character/components/new/CharacterEntityCreate'
import CharacterEntityList from '../entities/character/components/list/CharacterEntityList'
import { gameEventBus } from '../engine/event-bus/GameEventBus'
import { activityRuntimeService } from '../engine/activity/ActivityRuntimeService'
import type { PlayerEntity } from '../entities/player/types/PlayerEntity.types'
import styles from './GameScreen.module.css'
import { characterRuntimeService } from '../engine/character/CharacterRuntimeService'
import { useFloatingNotifications } from './ui/notifications/hooks/useFloatingNotify'
import NotificationList from './ui/notifications/NotificationList'
import { GAME_QUESTS } from '../entities/quest/data/quest/Quests.data'
import type { ActivityType } from '../engine/activity/types/Activity.types'

export type GameMode = 'boot' | 'character_create' | 'world'

export default function GameScreen() {
  const {
    notifications,
    addNotification
  } = useFloatingNotifications()

  const [saving, setSaving] = useState('')
  const [mode, setMode] = useState<GameMode>('boot')

  const [, refreshActivity] = useState(0)
  const [, refreshCharacters] = useState(0)

  const [player, setPlayer] = useLocalStorage<PlayerEntity | undefined>(
    GAME_STORAGE_KEYS.PLAYER_GAME,
    undefined
  )

  const runtimePlayerRef = useRef<PlayerEntity | undefined>(undefined)
  const dirtyPlayerRef = useRef<PlayerEntity | undefined>(undefined)

  const [characters, setCharacters] = useLocalStorage<CharacterEntity[] | undefined>(
    GAME_STORAGE_KEYS.CHARACTERS_GAME,
    []
  )

  const runtimeCharactersRef = useRef<Record<string, CharacterEntity>>({})
  const dirtyCharactersRef = useRef(new Set<string>())

  useEffect(() => {
    const map: Record<string, CharacterEntity> = {}
    for (const c of characters ?? []) map[c.id] = c
    runtimeCharactersRef.current = map
    runtimePlayerRef.current = player

    characterRuntimeService.init(
      characters ?? []
    )

    characterRuntimeService.start()

    setMode(!characters || characters.length === 0 ? 'character_create' : 'world')
  }, [])

  useEffect(() => {
    const unsub =
      characterRuntimeService.subscribe(() => {
        refreshCharacters(v => v + 1)

        const runtimeMap: Record<
          string,
          CharacterEntity
        > = {}

        for (
          const character
          of characterRuntimeService.getAll()
        ) {
          runtimeMap[character.id] = character
        }

        runtimeCharactersRef.current = runtimeMap
      })

    return unsub
  }, [])

  useEffect(() => {
    const unsub = activityRuntimeService.subscribe(() => {
      refreshActivity(v => v + 1)
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = gameEventBus.subscribe(event => {
      if (event.type === 'player:dirty') {
        dirtyPlayerRef.current = event.player
        return
      }

      if (event.type === 'player:save') {
        dirtyPlayerRef.current = event.player
        flushPlayerSave()
        addNotification(
          'Player Saved',
          undefined,
          5000
        )
        return
      }

      if (event.type === 'character:dirty') {
        dirtyCharactersRef.current.add(event.characterId)
        return
      }

      if (event.type === 'character:save') {
        dirtyCharactersRef.current.add(event.characterId)
        flushCharacterSave(event.characterId)
        addNotification(
          'Character Saved',
          undefined,
          5000
        )
        return
      }
    })

    return unsub
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSaving('Player')
      flushPlayerSave()

      setSaving('Character')
      for (const id of dirtyCharactersRef.current) flushCharacterSave(id)

      setSaving('')
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const unsub = gameEventBus.subscribe(event => {
      if(!['quest:start', 'quest:cancel', 'quest:complete'].includes(event.type)){
        return
      }

      const character = characterRuntimeService.getCharacter(event.characterId as string)
      const characterName = character?.name ? `${character.name} ` : 'Someone '
      if (event.type === 'quest:start') {
        const quest = GAME_QUESTS.find(q => q.id === event?.questId as string)
        console.log(quest)
        addNotification(
          <>{characterName}started the quest "{quest?.title}".</>,
          undefined,
          5000
        )
      }

      if (event.type === 'quest:complete') {
        const quest = GAME_QUESTS.find(q => q.id === event?.questId as string)
        addNotification(
          <>{characterName}completed the quest "{quest?.title}"!</>,
          undefined,
          5000
        )
      }

      if (event.type === 'quest:cancel') {
        const quest = GAME_QUESTS.find(q => q.id === event?.questId as string)
        addNotification(
          <>{characterName}cancelled the quest "{quest?.title}".</>,
          undefined,
          5000
        )
      }
    })

    return unsub
  }, [])

  const flushPlayerSave = () => {
    const runtime = runtimePlayerRef.current
    if (!runtime) return
    setPlayer({ ...runtime })
    dirtyPlayerRef.current = undefined
  }

  const flushCharacterSave = (characterId: string) => {
    const runtime = runtimeCharactersRef.current[characterId]
    if (!runtime) return

    setCharacters(prev => {
      const all = prev ?? []
      const exists = all.findIndex(c => c.id === characterId)
      if (exists === -1) return [...all, runtime]
      return all.map(c => (c.id === characterId ? runtime : c))
    })

    dirtyCharactersRef.current.delete(characterId)
  }

  const handleCreatedCharacter = (character: CharacterEntity, player?: PlayerEntity) => {
    if (player) {
      runtimePlayerRef.current = player
      gameEventBus.emit({ type: 'player:save', player })
    }

    characterRuntimeService.setCharacter(
      character
    )
    gameEventBus.emit({ type: 'character:save', characterId: character.id })
    setMode('world')
    addNotification(
      `${character.name} Created!`,
      undefined,
      5000
    )
  }

  const handleResetEverything = () => {
    setCharacters([])
    setPlayer(undefined)

    window.location.reload()
  }

  const runtimeCharacters = characterRuntimeService.getAll()
  const runtimePlayer = runtimePlayerRef.current

  return (
    <div className={styles.screen}>
      {mode === 'world' && (
        <div className={styles.menu}>
          <button className="button-basic dark" onClick={handleResetEverything}>RESET</button>
          <button className="button-basic" onClick={() => setMode('character_create')}>Create Character</button>
        </div>
      )}

      {saving && <span>Saving {saving} data...</span>}

      {mode === 'character_create' && (
        <CharacterEntityCreate
          player={runtimePlayer as PlayerEntity}
          playerCharacters={runtimeCharacters}
          onCancelled={() => setMode('world')}
          onCreated={handleCreatedCharacter}
        />
      )}

      <div className={styles.screenView}>
        {mode === 'world' && <CharacterEntityList 
          characters={runtimeCharacters} 
        />}
      </div>
      <NotificationList notifications={notifications} />

    </div>
  )
}