import { useEffect, useRef, useState } from 'react'

import styles from './GameScreen.module.css'

import { useLocalStorage } from '../../hooks/useLocalStorage'
import { GAME_STORAGE_KEYS } from '../data/GameStorageKeys.data'

import type { PlayerEntity } from '../entities/player/types/PlayerEntity.types'
import type { CharacterEntity } from '../entities/character/types/Character.types'

import CharacterEntityCreate from '../entities/character/components/new/CharacterEntityCreate'
import CharacterEntityList from '../entities/character/components/list/CharacterEntityList'

import { gameEventBus } from '../engine/event-bus/GameEventBus'
import { activityRuntimeService } from '../engine/activity/ActivityRuntimeService'
import { characterRuntimeService } from '../engine/character/CharacterRuntimeService'

import { notificationService } from '../engine/notifications/NotificationService'
import type { CharacterInventoryEntity } from '../entities/character-inventory/types/CharacterInventoryEntity.types'
import type { InventoryItemEntity } from '../entities/inventory-item/types/InventoryItemEntity.types'
import { createStarterInventory } from '../entities/character-inventory/utils/createStarterInventory'
import CharacterEntityActionsModal from '../entities/character/components/actions/CharacterEntityActionsModal'
import type { CharacterUpgradeEntity } from '../entities/character-upgrade/types/CharacterUpgradeEntity.types'

export type GameMode = 'boot' 
  | 'character_create' 
  | 'world'
  | 'character_actions'

export default function GameScreen() {
  // =========================
  // UI STATE
  // =========================
  const [mode, setMode] = useState<GameMode>('boot')
  const [saving, setSaving] = useState('')

  // =========================
  // PERSISTED STATE
  // =========================
  const [characterActions, setCharacterActions] = useState<CharacterEntity | undefined>(undefined)

  const [player, setPlayer] =
    useLocalStorage<PlayerEntity | undefined>(GAME_STORAGE_KEYS.PLAYER_GAME, undefined)

  const [characters, setCharacters] =
    useLocalStorage<CharacterEntity[] | undefined>(GAME_STORAGE_KEYS.CHARACTERS_GAME, [])

  const [characterInventories, setCharacterInventories] =
    useLocalStorage<CharacterInventoryEntity[] | undefined>(
      GAME_STORAGE_KEYS.CHARACTER_INVENTORIES_GAME,
      []
  )

  const [inventoryItems, setInventoryItems] =
    useLocalStorage<InventoryItemEntity[] | undefined>(
      GAME_STORAGE_KEYS.INVENTORY_ITEMS_GAME,
      []
  )

  const [characterUpgrades, setCharacterUpgrades] = 
    useLocalStorage<CharacterUpgradeEntity[] | undefined>(
      GAME_STORAGE_KEYS.CHARACTER_UPGRADES_GAME,
      []
    )

  // =========================
  // RUNTIME REFS (SOURCE OF TRUTH)
  // =========================
  const runtimePlayerRef = useRef<PlayerEntity | undefined>(undefined)
  const runtimeCharactersRef = useRef<Record<string, CharacterEntity>>({})

  const dirtyCharactersRef = useRef(new Set<string>())

  // =========================
  // INIT GAME STATE
  // =========================
  useEffect(() => {
    const map: Record<string, CharacterEntity> = {}

    for (const c of characters ?? []) {
      map[c.id] = c
    }

    runtimeCharactersRef.current = map
    runtimePlayerRef.current = player

    characterRuntimeService.init(characters ?? [])
    characterRuntimeService.start()

    setMode(!characters || characters.length === 0 ? 'character_create' : 'world')
  }, [])

  // =========================
  // CHARACTER SYNC
  // =========================
  useEffect(() => {
    return characterRuntimeService.subscribe(() => {
      const map: Record<string, CharacterEntity> = {}

      for (const c of characterRuntimeService.getAll()) {
        map[c.id] = c
      }

      runtimeCharactersRef.current = map
    })
  }, [])

  // =========================
  // ACTIVITY TICK
  // =========================
  useEffect(() => {
    return activityRuntimeService.subscribe(() => {
      // reserved for future UI updates
    })
  }, [])

  // =========================
  // SAVE SYSTEM
  // =========================
  useEffect(() => {
    const unsub = gameEventBus.subscribe(event => {

      // ---------- PLAYER ----------
      if (event.type === 'player:dirty') {
        runtimePlayerRef.current = event.meta?.player
        return
      }

      if (event.type === 'player:save') {
        runtimePlayerRef.current = event.meta?.player
        flushPlayerSave()
        return
      }

      // ---------- CHARACTER ----------
      if (event.type === 'character:dirty') {
        dirtyCharactersRef.current.add(event.characterId as string)
        return
      }

      if (event.type === 'character:save') {
        dirtyCharactersRef.current.add(event.characterId as string)
        flushCharacterSave(event.characterId as string)
      }
    })

    return unsub
  }, [])

  // =========================
  // AUTO SAVE LOOP
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {

      setSaving('Player')
      flushPlayerSave()

      setSaving('Characters')
      for (const id of dirtyCharactersRef.current) {
        flushCharacterSave(id)
      }

      setSaving('')
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // =========================
  // FLUSH SAVE: PLAYER
  // =========================
  const flushPlayerSave = () => {
    const runtime = runtimePlayerRef.current
    if (!runtime) return

    setPlayer({ ...runtime })
  }

  // =========================
  // FLUSH SAVE: CHARACTER
  // =========================
  const flushCharacterSave = (id: string) => {
    const runtime = runtimeCharactersRef.current[id]
    if (!runtime) return

    setCharacters(prev => {
      const list = prev ?? []
      const index = list.findIndex(c => c.id === id)

      if (index === -1) return [...list, runtime]

      return list.map(c => (c.id === id ? runtime : c))
    })

    dirtyCharactersRef.current.delete(id)
  }

  // =========================
  // CHARACTER CREATED FLOW
  // =========================
  const handleCreatedCharacter = (
    character: CharacterEntity, 
    newPlayer?: PlayerEntity
  ) => {

    const activePlayer = newPlayer ?? runtimePlayerRef.current

    // IMPORTANT FIX: ensure runtime + persistence sync
    if (activePlayer) {
      activePlayer.characterTokens -= 1
      runtimePlayerRef.current = activePlayer
      setPlayer({ ...activePlayer })
    }

    // register runtime character
    characterRuntimeService.setCharacter(character)

    // generate starting inventory
    const {
      characterInventory,
      inventoryItems: starterItems
    } = createStarterInventory(character.id)

    setCharacterInventories(prev => [
      ...(prev ?? []),
      characterInventory
    ])

    setInventoryItems(prev => [
      ...(prev ?? []),
      ...starterItems
    ])

    // persist character + player once
    gameEventBus.emit({ 
      type: 'character:save', 
      characterId: character.id 
    })
    gameEventBus.emit({ 
      type: 'player:save', 
      characterId: character.id,
      continuous: false,
      meta: {player: activePlayer!} 
    })

    notificationService.notify({
      text: <><strong>{character.name}</strong> created.</>,
      type: "info",
      lifetime: 2000
    });
    setMode('world')
  }

  // =========================
  // RESET
  // =========================
  const handleResetEverything = () => {
    setCharacters([])
    setPlayer(undefined)
    setInventoryItems([])
    setCharacterInventories([])
    window.location.reload()
  }

  // =========================
  // DERIVED STATE
  // =========================
  const runtimeCharacters = characterRuntimeService.getAll()
  const runtimePlayer = runtimePlayerRef.current

  return (
    <div className={styles.screen}>

      {/* MENU */}
      {mode === 'world' && (
        <div className={styles.menu}>
          <button className="button-basic dark" onClick={handleResetEverything}>
            RESET
          </button>

          <button className="button-basic" onClick={() => setMode('character_create')}>
            Create Character
          </button>
        </div>
      )}

      {/* SAVE STATUS */}
      {saving && <span>Saving {saving}...</span>}

      {/* CHARACTER CREATION */}
      {mode === 'character_create' && (
        <CharacterEntityCreate
          player={runtimePlayer as PlayerEntity}
          playerCharacters={runtimeCharacters}
          onCancelled={() => setMode('world')}
          onCreated={handleCreatedCharacter}
        />
      )}

      {/* WORLD */}
      <div className={styles.screenView}>
        {mode === 'world' && (
          <CharacterEntityList 
            characters={runtimeCharacters} 
            onCharacterClicked={(character: CharacterEntity) => {
              setCharacterActions(character)
              setMode('character_actions')
            }}
          />
        )}
        {mode === 'character_actions' && characterActions && (
          <CharacterEntityActionsModal 
            characterInventories={characterInventories?.filter(
              ci => ci.characterId === characterActions.id
            ) as CharacterInventoryEntity[]}
            inventoryItems={inventoryItems as InventoryItemEntity[]}
            character={characterActions}
            onClose={() => {
              setCharacterActions(undefined)
              setMode('world')
            }}
            open={true}
            characterUpgrades={characterUpgrades as CharacterUpgradeEntity[]}
          />
        )}
      </div>
    
    </div>
  )
}