import { useEffect, useState } from 'react'

import CharacterCreationScreen from '../features/character/components/CharacterCreationScreen'
import GameScreen from '../features/game/components/GameScreen'
import WorldWrapper from './components/world/WorldWrapper'

import { worldStateStore, type WorldLocation } from '../game/world/worldState'
import TravelPanel from './components/travel/TravelPanel'
import { gameEventBus } from '../game/engine/events/GameEventBus'
import { travelTo } from '../game/actions/travelAction'
import { RadialMenu } from './components/radialMenu/RadialMenu'
import SideDrawer from './components/sideDrawer/SideDrawer'
import { useWorldTravelMap } from './components/worldMap/hooks/useWorldTravelMap'
import WorldTravelMap from './components/worldMap/WorldTravelMap'
import { buildWorldRadialItems } from './components/radialMenu/utils/radialMenu.utils'
import type { RadialItem } from './components/radialMenu/RadialMenu.types'

export type AppMode =
  | 'boot'
  | 'character_create'
  | 'travel'
  | 'world'

export type Drawer = 
  | null
  | 'world_map'

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
  const [drawerType, setDrawerType] = useState<Drawer>(
    null
  )
  const [radialOpen, setRadialOpen] = useState(false)  

  const DRAWER_RADIAL_ITEMS: RadialItem[] = [
    {
      id: 'map',
      label: 'map',
      onClick: () => {setDrawerType('world_map')},
    },  
  ]

  const navItems = buildWorldRadialItems(
    state?.location,
    state?.characterId as string
  )
  navItems.push(...DRAWER_RADIAL_ITEMS)

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
  // WORLD EVENT LISTENER 
  // ======================
  useEffect(() => {
    const unsub = gameEventBus.subscribe(event => {
      if (event.type !== 'world:location_changed'
          && event.type !== 'activity:start'
          && event.type !== 'activity:complete') return

      setState(prev => {
        if (event.type === 'world:location_changed') {
          if (event.characterId !== prev.characterId) return prev

          return {
            ...prev,
            location: event.location as WorldLocation,
          }
        }

        if (event.type === 'activity:start') {
          if (event.characterId !== prev.characterId) return prev

          return {
            ...prev,
            mode: event.activityType === 'travel'
              ? 'travel'
              : prev.mode,
          }
        }

        if (event.type === 'activity:complete') {
          if (event.characterId !== prev.characterId) return prev

          return {
            ...prev,
            mode: 'world',
            location: state?.location
          }
        }

        return prev
      })
    })

    return unsub
  }, [])

  // ======================
  // CHARACTER CREATE → START TRAVEL
  // ======================
  const handleCharacterCreated = (id: string) => {
    worldStateStore.initCharacter(id)
    setState(prev => {
      return {
        ...prev,
        mode: 'travel',
        characterId: id
      }
    })
    travelTo({
      from: state?.location ?? 'cave',
      to: 'guild',
      characterId: id,
    })
  }

  const map = useWorldTravelMap(state?.characterId)
  
  return (
    <WorldWrapper location={state.location}>
      <RadialMenu
        open={radialOpen}
        centerLabel="Travel"
        items={navItems}
        appMode={state?.mode}
        onClose={() => {setRadialOpen(false)}}
        onClick={() => {setRadialOpen(true)}}
      />

      {/* CHARACTER CREATE */}
      {state.mode === 'character_create' && (
        <CharacterCreationScreen onCreated={handleCharacterCreated} />
      )}
      {/* GAME WORLD */}
      {state.mode === 'world' && state.characterId && (
        <>
          <GameScreen characterId={state.characterId} />
        
        </>
      )}

      {/* TRAVEL OVERLAY */}
      <TravelPanel 
        characterId={state.characterId} 
      />

      <SideDrawer position='left' open={drawerType === 'world_map'} onClose={() => {
          setDrawerType(null)
      }}>
        {map && (
          <WorldTravelMap
            route={map.route}
            progress={map.progress}
            currentLocation={map.currentLocation as WorldLocation}
          />
        )}
      </SideDrawer>
    </WorldWrapper>
  )
}