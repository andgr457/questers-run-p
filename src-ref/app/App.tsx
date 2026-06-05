import { useEffect, useState } from 'react'

import CharacterCreationScreen from '../features/character/components/CharacterCreationScreen'
import GameScreen from '../features/game/components/GameScreen'
import WorldWrapper from './components/WorldWrapper'

import { worldStateStore, type WorldLocation } from '../game/world/worldState'
import TravelPanel from './components/TravelPanel'
import { gameEventBus } from '../game/engine/events/GameEventBus'
import { travelTo } from '../game/actions/travelAction'

export type AppMode =
  | 'boot'
  | 'character_create'
  | 'travel'
  | 'world'

type AppState = {
  mode: AppMode
  characterId: string | null
  location: WorldLocation
}

export default function App() {
  const [state, setState] = useState<AppState>({
    mode: 'boot',
    characterId: null,
    location: 'cave',
  })

  // ======================
  // BOOT → CHARACTER CREATE
  // ======================
  useEffect(() => {
    setState(s => ({
      ...s,
      mode: 'character_create',
    }))
  }, [])

  // ======================
  // WORLD EVENT LISTENER (FIXED)
  // ======================
  useEffect(() => {
    const unsub = gameEventBus.subscribe(event => {
      if (event.type !== 'world:location_changed') return

      setState(prev => {
        if (event.characterId !== prev.characterId) return prev

        return {
          ...prev,
          mode: 'world',
          location: event.location as WorldLocation,
        }
      })
    })

    return unsub
  }, [])

  // ======================
  // CHARACTER CREATE → START TRAVEL
  // ======================
  const handleCharacterCreated = (id: string) => {
    worldStateStore.initCharacter(id)

    travelTo({
      from: state?.location ?? 'cave',
      to: 'guild',
      characterId: id,
      setState,
    })
  }

  // ======================
  // RENDER
  // ======================

  return (
    <WorldWrapper location={state.location}>
      <div className='particles' />
      {/* CHARACTER CREATE */}
      {state.mode === 'character_create' && (
        <CharacterCreationScreen onCreated={handleCharacterCreated} />
      )}

      {/* GAME WORLD */}
      {state.mode === 'world' && state.characterId && (
        <GameScreen characterId={state.characterId} />
      )}

      {/* TRAVEL OVERLAY */}
      <TravelPanel characterId={state.characterId} />
    </WorldWrapper>
  )
}