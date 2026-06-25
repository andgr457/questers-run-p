import { useEffect, useMemo, useState } from 'react'

import ContextMenuRail from './ContextMenuRail'

import type { ContextMenuAction } from '../types/ContextMenuAction.types'
import type { OverlayMode } from '../types/OverlayMode.types'
import { eventDebugRuntimeService } from '../../../engine/event/EventDebugRuntimeService'
import { eventBus } from '../../../engine/event/EventBus'
import { GAME_EVENT_BUS_DEBUG_RECORDING_TYPES } from '../../../engine/event/utils/EventBus.utils'
import type { PlayerEntity } from '../../../entity/player/types/PlayerEntity.types'
import { playerRuntimeService } from '../../../engine/player/PlayerRuntimeService'
import { characterRuntimeService } from '../../../engine/character/CharacterRuntimeService'
import type { CharacterEntity } from '../../../entity/character/types/CharacterEntity.types'
import { eventHistoryRuntimeService } from '../../../engine/event/EventHistoryRuntimeService'
import type { EventHistoryItem } from '../../../engine/event/types/EventHistory.types'
import { tutorialRuntimeService } from '../../../engine/tutorial/TutorialRuntimeService'

interface Props {
  overlayMode: OverlayMode
  setOverlayMode: (mode: OverlayMode) => void
}

export default function ContextMenuShell(props: Props) {
  const {
    overlayMode,
    setOverlayMode,
  } = props

  const [recordingDetail, setRecordingDetail] = useState(eventDebugRuntimeService.getRecordingDetail())
  const [player, setPlayer] = useState<PlayerEntity | undefined>(playerRuntimeService.getPlayer())
  const [characters, setCharacters] = useState<CharacterEntity[]>(characterRuntimeService.getCharacters())
  const [eventHistory, setEventHistory] = useState<EventHistoryItem[]>(eventHistoryRuntimeService.getHistory())
  const [tutorial, setTutorial] = useState(tutorialRuntimeService.getCurrentTutorial())

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(GAME_EVENT_BUS_DEBUG_RECORDING_TYPES.includes(event.type)){
        setRecordingDetail(eventDebugRuntimeService.getRecordingDetail())
      }
      if(event.type === 'player:save'){
        setPlayer(playerRuntimeService.getPlayer())
      }
      if(event.type === 'character:save'){
        setCharacters(characterRuntimeService.getCharacters())
      }
      if(event.type === 'event:history:updated'){
        setEventHistory(eventHistoryRuntimeService.getHistory())
      }
      if(event.type === 'tutorial:updated'){
        setTutorial(tutorialRuntimeService.getCurrentTutorial())
      }
    })
    return unsub
  }, [])

  const leftActions = useMemo<ContextMenuAction[]>(() => {
    if(!player) return []
    if(!characters || characters.length === 0) return []

    const actions: ContextMenuAction[] = []
    actions.push({
      id: 'world',
      label: 'World',
      iconName: 'world',
      iconRotate: false,
      borderColor: overlayMode === 'world' ? 'var(--gold)' : 'var(--text)',
      onClick: () => setOverlayMode('world'),
    })
    actions.push({
      id: 'notifications',
      label: 'Notifications',
      iconName: 'notifications',
      iconRotate: false,
      borderColor: overlayMode === 'event_history' ? 'var(--gold)' : 'var(--text)',
      color: eventHistory.filter(h => h.viewed === false).length > 0 ? 'var(--success)' : 'var(--text)',
      onClick: () => overlayMode === 'event_history' ? setOverlayMode('world') : setOverlayMode('event_history'),
    })
    actions.push({
      id: 'player',
      label: 'Player',
      iconName: 'player',
      iconRotate: false,
      borderColor: overlayMode === 'player' ? 'var(--gold)' : 'var(--text)',
      onClick: () => overlayMode === 'player' ? setOverlayMode('world') : setOverlayMode('player'),
    })
    if(characters && characters.length > 0){
      actions.push({
        id: 'characters',
        label: 'Characters',
        iconName: 'characters',
        iconRotate: false,
        borderColor: overlayMode === 'characters' ? 'var(--gold)' : 'var(--text)',
        onClick: () => overlayMode === 'characters' ? setOverlayMode('world') : setOverlayMode('characters'),
      })
    }
    
    return actions
  }, [overlayMode, setOverlayMode, player, characters])

  const rightActions = useMemo<ContextMenuAction[]>(() => {
    const actions: ContextMenuAction[] = [{
      id: 'settings',
      label: 'Settings',
      iconName: overlayMode === 'settings' ? 'close' : 'settings',
      iconRotate: overlayMode === 'settings' ? false : true,
      borderColor: overlayMode === 'settings' ? 'var(--gold)' : 'var(--text)',
      onClick: () => {
        setOverlayMode(
          overlayMode === 'settings'
            ? 'world'
            : 'settings'
        )
      },
    }]
    if(player && characters.length > 0){
      actions.push({
        id: 'dashboard',
        label: 'Dashboard',
        iconName: 'dashboard',
        iconRotate: false,
        borderColor: overlayMode === 'dashboard' ? 'var(--gold)' : 'var(--text)',
        onClick: () => overlayMode === 'dashboard' ? setOverlayMode('world') : setOverlayMode('dashboard'),
      })
      actions.push({
        id: 'tutorial',
        label: 'Tutorial',
        iconName: 'tutorial',
        iconRotate: false,
        color: !tutorial ? 'var(--text)' : 'var(--success)',
        borderColor: overlayMode === 'tutorial' ? 'var(--gold)' : 'var(--text)',
        onClick: () => overlayMode === 'tutorial' ? setOverlayMode('world') : setOverlayMode('tutorial'),
      })
    }
    
    if(recordingDetail.isDebugMode){
      actions.push({
        id: 'debug-event-recording',
        label: 'Debug Event Recording',
        iconName: recordingDetail.isRecording ? 'recordStop' : 'recordStart',
        iconRotate: false,
        borderColor: recordingDetail.isRecording ? 'var(--danger)' : 'var(--text)',
        color: recordingDetail.isRecording ? 'var(--danger)' : 'var(--success)',
        onClick: () => {
          if(recordingDetail.isRecording){
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'event:debug:recording:stop'
            })
          } else {
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'event:debug:recording:start'
            })
          }
        },
      },
      {
        id: 'debug-event-recording-logs',
        label: 'Debug Event Recording Logs',
        iconName: 'recordLogs',
        iconRotate: false,
        onClick: () => {
          setOverlayMode(
            overlayMode === 'settings_debug_logs' ?
              'world' : 'settings_debug_logs'
          )
        },
      })
    }

    return actions
  }, [
    overlayMode,
    setOverlayMode,
    recordingDetail
  ])

  return (
    <>
      <ContextMenuRail
        side='left'
        actions={leftActions}
      />

      <ContextMenuRail
        side='right'
        actions={rightActions}
      />
    </>
  )
}