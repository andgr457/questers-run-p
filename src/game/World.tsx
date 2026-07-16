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
import PlayerDetail from '../entity/player/components/detail/PlayerDetail'
import NotificationList from './notification/components/list/NotificationList'
import Dashboard from './dashboard/components/Dashboard'
import CharacterList from '../entity/character/components/list/CharacterList'
import Tutorial from './tutorial/components/Tutorial'
import CharacterManage from '../entity/character/components/manage/CharacterManage'
import TravelTransition from './travel/TravelTransition'
import Background from '../ui/background/Background'
import AdventurersGuild from './adv-guild/components/AdventurersGuild'
import Introduction from './introduction/Introduction'

export default function World() {
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('intro')
  
  const {showConfirm} = useConfirm()

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'world:mode:change'){
        setOverlayMode(event.meta?.worldMode ?? 'world')
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
        {overlayMode === 'intro' && (
          <Introduction setOverlayMode={setOverlayMode} />
        )}
        {overlayMode === 'adv_guild' && (
          <AdventurersGuild />
        )}
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
        {overlayMode === 'notifications' && (
          <NotificationList />
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