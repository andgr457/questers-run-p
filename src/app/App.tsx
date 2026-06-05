import { useEffect, useState } from 'react'

import CharacterCreationScreen from '../features/character/components/CharacterCreationScreen'
import GameScreen from '../features/game/components/GameScreen'

import WorldWrapper from './components/WorldWrapper'

import { worldStateStore, type WorldLocation } from '../game/world/worldState'
import { gameClockService } from '../game/engine/clock/GameClockService'
import TravelPanel from './components/TravelPanel'

type AppMode = 'boot' 
  | 'character_create' 
  | 'world' 
  | 'travel'
  | 'town'

type AppState = {
  mode: AppMode
  characterId: string | null
  location: WorldLocation

  travel?: {
    to: WorldLocation
    duration: number
    startedAt: number
  }
}

export default function App() {
  const [state, setState] = useState<AppState>({
    mode: 'boot',
    characterId: null,
    location: 'cave',
  })

  // ======================
  // INIT BOOT
  // ======================
  useEffect(() => {
    setState(s => ({
      ...s,
      mode: 'character_create',
    }))
  }, [])

  // ======================
  // START GAME
  // ======================
  const handleCharacterCreated = (id: string) => {
    worldStateStore.initCharacter(id)

    travelTo('town')
    // setState({
    //   mode: 'world',
    //   characterId: id,
    //   location: 'plains',
    // })
  }

  // ======================
  // TRAVEL REQUEST
  // ======================
  const travelTo = (to: WorldLocation, duration = 0) => {
    setState(s => {
      if (!s.characterId) return s

      return {
        ...s,
        mode: 'travel',
        travel: {
          to,
          duration,
          startedAt: gameClockService.getNow(),
        },
      }
    })
  }

  // ======================
  // TRAVEL COMPLETE
  // ======================
  const handleArrive = () => {
    setState(s => {
      if (!s.characterId || !s.travel) return s

      const newLocation = s.travel.to

      worldStateStore.setLocation(s.characterId, newLocation)

      return {
        ...s,
        mode: 'town',
        location: newLocation,
        travel: undefined,
      }
    })
  }

  return (
    <WorldWrapper location={state.location}>
      <div className={
        `screen-character-create ${state.mode === 'character_create' ? 'show' : ''}`
      }>
        <CharacterCreationScreen onCreated={handleCharacterCreated} />
      </div>

      <div className={
        `screen-travel-panel ${state.mode === 'travel' ? 'show' : ''}`
      }>
        <TravelPanel
          characterId={state.characterId}
          onArrive={handleArrive}
        />
      </div>

      <div className={
        `screen-game ${state.mode !== 'travel' ? 'show' : ''}`
      }>

        <GameScreen characterId={state?.characterId} />
      </div>
    </WorldWrapper>
  )
}