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
import EventHistoryList from './event-history/components/list/EventHistoryList'
import Dashboard from './dashboard/components/Dashboard'
import CharacterList from '../entity/character/components/list/CharacterList'
import Tutorial from './tutorial/components/Tutorial'
import { tutorialRuntimeService } from '../engine/tutorial/TutorialRuntimeService'

export default function World() {
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('world')
  const [tutorial, setTutorial] = useState(tutorialRuntimeService.getCurrentTutorial())

  const {showConfirm} = useConfirm()

  useEffect(() => {
    const player = playerRuntimeService.getPlayer()
    if(!player){
      console.log('player not found')
      setOverlayMode('player_create')
      return
    }
    const characters = characterRuntimeService.getCharacters()
    if(!characters || characters.length === 0){
      console.log('characters not found')
      setOverlayMode('character_create')
      return
    }

  }, [])

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'player:save'){
        const characters = characterRuntimeService.getCharacters()
        if(!characters || characters.length === 0){
          console.log('characters not found')
          setOverlayMode('character_create')
          return
        }
      }
      if(event.type === 'world:mode:change'){
        setOverlayMode(event.meta.worldMode)
        return
      }
      if(event.type === 'player:level'){
        console.log('world level up sub?')
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
      if(event.type === 'tutorial:updated'){
        setTutorial(tutorialRuntimeService.getCurrentTutorial())
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
        {overlayMode === 'tutorial' && tutorial && (
          <Tutorial 
            title={tutorial?.title}
            description={tutorial?.description}
          />
        )}
        {overlayMode === 'dashboard' && (
          <Dashboard />
        )}
        {overlayMode === 'event_history' && (
          <EventHistoryList />
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