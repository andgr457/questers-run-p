import { useEffect, useState } from 'react'

import { playerRuntimeService } from '../engine/player/PlayerRuntimeService'
import { eventBus } from '../engine/event/EventBus'

import ContextMenuShell from './context-menu/components/ContextMenuShell'
import OverlayLayer from './context-menu/components/OverlayLayer'

import type { OverlayMode } from './context-menu/types/OverlayMode.types'
import SettingsPanel from './settings/SettingsPanel'
import GamePanel from '../ui/panel/GamePanel'
import DebugEventRecording from './settings/debug-event/components/event-recording/DebugEventRecording'
import { useConfirm } from '../ui/modal/providers/ConfirmProvider'
import { characterRuntimeService } from '../engine/character/CharacterRuntimeService'
import NewPlayer from '../entity/player/components/new/NewPlayer'
import PlayerDetail from '../entity/player/components/detail/PlayerDetail'
import NewCharacter from '../entity/character/components/new/NewCharacter'
import NotificationList from './notification/components/list/NotificationList'
import Dashboard from './dashboard/components/Dashboard'
import CharacterList from '../entity/character/components/list/CharacterList'
import Tutorial from './tutorial/components/Tutorial'
import CharacterManage from '../entity/character/components/manage/CharacterManage'
import TravelTransition from './travel/TravelTransition'
import Background from '../ui/background/Background'

export default function World() {
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('world')
  
  const {showConfirm} = useConfirm()

  useEffect(() => {
    const player = playerRuntimeService.getPlayer()
    if(!player){
      setOverlayMode('player_create')
      return
    }
    const characters = characterRuntimeService.getCharacters()
    if(!characters || characters.length === 0){
      setOverlayMode('character_create')
      return
    }

  }, [])

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'player:save'){
        const characters = characterRuntimeService.getCharacters()
        if(!characters || characters.length === 0){
          setOverlayMode('character_create')
        }
      }
      if(event.type === 'world:mode:change'){
        setOverlayMode(event.meta.worldMode)
      }
      if(event.type === 'player:level'){
        const player = playerRuntimeService.getPlayer()
        const fn = async () => {
          await showConfirm({
            title: 'Player Level Up!',
            message: `Congratulations! You are now level ${player?.level}!`,
            isYesNo: false,
          })
        }
        fn()
      }      
    })
    return unsub
  }, [])

  useEffect(() => {
    return eventBus.subscribe(event => {
      switch (event.type) {
        case 'player:saved': {
          // const characters =
          //   characterRuntimeService.getCharacters()

          // setOverlayMode(
          //   characters.length === 0
          //     ? 'character_create'
          //     : 'world'
          // )

          break
        }

        case 'character:saved':
          setOverlayMode('world')
          break
      }
    })
  }, [])

  return (
    <>
      <ContextMenuShell
        overlayMode={overlayMode}
        setOverlayMode={setOverlayMode}
      />
      

      <OverlayLayer>
        {characterRuntimeService?.getCharacters()?.length > 0 &&
          <Background 
            topText={`Quester's`}
            bottomText={`Run`}
          />
        }
        {overlayMode === 'transition' && (
          <TravelTransition />
        )}
        {overlayMode === 'character_manage' && (
          <CharacterManage />
        )}
        {overlayMode === 'tutorial' && (
          <Tutorial />
        )}
        {overlayMode === 'dashboard' && (
          <Dashboard />
        )}
        {overlayMode === 'event_history' && (
          <NotificationList />
        )}
        {overlayMode === 'player_create' && (
          <NewPlayer />
        )}
        {overlayMode === 'character_create' && (
          <NewCharacter />
        )}
        {overlayMode === 'settings_debug_logs' && (
          <GamePanel
            title='Recorded Debug Events'
            currentScreenName=''
            
          >
            <DebugEventRecording />
            
          </GamePanel>
        )}
        {overlayMode === 'settings' && (
          <SettingsPanel  />
        )}

        {overlayMode === 'player' && (
          <PlayerDetail />
        )}

        {overlayMode === 'characters' && (
          <CharacterList />
        )}
      </OverlayLayer>
    
    </>
  )
}