import { useEffect, useMemo, useState } from 'react'

import TravelPanel from './game/travel/TravelPanel'
import { gameEventBus } from './game/engine/events/GameEventBus'
import { RadialMenu } from './game/radialMenu/RadialMenu'
import SideDrawer from './game/sideDrawer/SideDrawer'
import { useWorldTravelMap } from './game/worldMap/hooks/useWorldTravelMap'
import WorldTravelMap from './game/worldMap/WorldTravelMap'
import { buildWorldRadialItems } from './game/radialMenu/utils/radialMenu.utils'
import NewCharacter from './game/character/components/NewCharacter'
import GameScreen from './game/game-screen/GameScreen'
import WorldWrapper from './game/world/components/WorldWrapper'
import NewAccount from './game/account/components/NewAccount'
import type { WorldLocation } from './game/world/types/WorldLocation.types'

export type AppMode =
  | 'boot'
  | 'account_create'
  | 'character_create'
  | 'travel'
  | 'world'

export type Drawer = 
  | null
  | 'world_map'

type AppState = {
  accountId: string | null
  characterId: string | null
  mode: AppMode
  location: WorldLocation
}

export default function App() {
  const [state, setState] = useState<AppState>({
    characterId: null,
    accountId: null,
    mode: 'boot',
    location: ,
  })
  
  const [drawerType, setDrawerType] = useState<Drawer>(
    null
  )

  const radialItems = useMemo(() => {
    return [
      ...buildWorldRadialItems(
        state?.location,
        state?.characterId as string
      )
    ]
  }, [state?.location, state?.characterId])
  
  // ======================
  // BOOT → ACCOUNT CREATE
  // NO CHARACTER → CHARACTER CREATE
  // ======================
  useEffect(() => {
    setState(s => ({
      ...s,
      mode: 'account_create',
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
            location: event.worldLocation as WorldLocation,
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

  const handleAccountCreated = (accountId: string, accountName) => {
    setState(prev => {
      return {
        ...prev,
        mode: 'character_create',
        accountId,
      }
    })
  }

  // ======================
  // CHARACTER CREATE → NO TRAVEL
  // ======================
  const handleCharacterCreated = (characterId: string, characterName: string) => {
    setState(prev => {
      return {
        ...prev,
        mode: 'world',
        characterId,
      }
    })
  }

  const map = useWorldTravelMap(state?.characterId)
  
  return (
    <WorldWrapper location={state.location}>


      {/* CHARACTER CREATE */}
      {state.mode === 'account_create' && (
        <NewAccount onCreated={handleAccountCreated} />
      )}
      {state.mode === 'character_create' && (
        <NewCharacter onCreated={handleCharacterCreated} />
      )}
      {/* GAME WORLD */}
      {state.mode === 'world' && state.characterId && (
        <GameScreen 
          characterId={state.characterId} 
          currentLocation={state.location}
        />
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

      {state?.location && <RadialMenu
        currentLocation={state?.location}
        appMode={state?.mode}
        topItems={[
          {
            id: 'map_radial',
            label: 'MAP',
            component: <WorldTravelMap
              route={map?.route}
              progress={map?.progress}
              currentLocation={map?.currentLocation as WorldLocation}
              isTraveling={false}
            />
          },
          {
            id: 'travel_radial',
            label: 'TRAVEL',
            childItems: radialItems
          },
          {
            id: 'settings_radial',
            label: 'SETTINGS',
            component: <div>Settings Placeholder</div>
          }
        ]}
      />}
    </WorldWrapper>
  )
}