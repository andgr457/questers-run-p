import { useEffect, useState } from 'react'

import { characterRuntimeService } from '../engine/entity/CharacterRuntimeService'
import { playerRuntimeService } from '../engine/entity/PlayerRuntimeService'
import { eventBus } from '../engine/event/EventBus'

import ContextMenuShell from './context-menu/components/ContextMenuShell'
import OverlayLayer from './context-menu/components/OverlayLayer'

import type { OverlayMode } from './context-menu/types/OverlayMode.types'
import SettingsPanel from './settings/SettingsPanel'
import DebugEventLogs from './settings/debug-event/components/event-logs/DebugEventLogs'
import { eventDebugRuntimeService } from '../engine/event/EventDebugRuntimeService'

type GameMode =
  | 'boot'
  | 'player_create'
  | 'character_create'
  | 'world'

export default function World() {
  const [mode, setMode] = useState<GameMode>('boot')

  const [overlayMode, setOverlayMode] =
    useState<OverlayMode>('none')

  useEffect(() => {
    const player = playerRuntimeService.getPlayer()
    const characters = characterRuntimeService.getCharacters()

    if (!player) {
      setMode('player_create')
      return
    }

    if (characters.length === 0) {
      setMode('character_create')
      return
    }

    setMode('world')
  }, [])

  useEffect(() => {
    return eventBus.subscribe(event => {
      switch (event.type) {
        case 'player:saved': {
          const characters =
            characterRuntimeService.getCharacters()

          setMode(
            characters.length === 0
              ? 'character_create'
              : 'world'
          )

          break
        }

        case 'character:saved':
          setMode('world')
          break
      }
    })
  }, [])

  return (
    <>
      <ContextMenuShell
        gameMode={mode}
        overlayMode={overlayMode}
        setOverlayMode={setOverlayMode}
      />


      {overlayMode !== 'none' && (
        <OverlayLayer>
          {overlayMode === 'settings_debug_logs' && (
            <DebugEventLogs 
              eventLogs={eventDebugRuntimeService.getRecordingDetail().history}
              onBack={() => setOverlayMode('none')}
              title='Debug Event Logs'
            />
          )}
          {overlayMode === 'settings' && (
            <SettingsPanel  />
          )}

          {overlayMode === 'player' && (
            <div>
              PLAYER PANEL
            </div>
          )}

          {overlayMode === 'characters' && (
            <div>
              CHARACTER PANEL
            </div>
          )}
        </OverlayLayer>
      )}
    </>
  )
}