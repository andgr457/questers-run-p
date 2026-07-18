import { useEffect, useState } from 'react'

import { eventBus } from '../engine/event/EventBus'

import ContextMenuShell from './context-menu/components/ContextMenuShell'
import OverlayLayer from './context-menu/components/OverlayLayer'

import type { OverlayMode } from './context-menu/types/OverlayMode.types'
import SettingsPanel from './settings/SettingsPanel'
import GamePanel from '../ui/panel/GamePanel'
import DebugEventRecording from './settings/debug-event/components/event-recording/DebugEventRecording'
import { characterRuntimeService } from '../engine/character/CharacterRuntimeService'
import NotificationList from './notification/components/list/NotificationList'
import Dashboard from './dashboard/components/Dashboard'
import CharacterList from '../entity/character/components/list/CharacterList'
import Tutorial from './tutorial/components/Tutorial'
import CharacterManage from '../entity/character/components/manage/CharacterManage'
import TravelTransition from './travel/TravelTransition'
import Background from '../ui/background/Background'
import AdventurersGuild from './adv-guild/components/AdventurersGuild'
import Introduction from './introduction/Introduction'
import PlayerManage from '../entity/player/components/manage/PlayerManage'

export default function World() {
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('intro')

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'world:mode:change'){
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:changing',
          meta: {
            worldMode: event.meta?.worldMode,
            worldModePrevious: overlayMode
          }
        })
        setTimeout(() => {
          setOverlayMode(event.meta?.worldMode ?? 'world')
        }, 250)
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
          <PlayerManage />
        )}

        {overlayMode === 'characters' && (
          <CharacterList />
        )}
      </OverlayLayer>
    
    </>
  )
}