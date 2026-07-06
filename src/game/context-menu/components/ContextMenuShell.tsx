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
import { checkForPulse } from '../utils/ContextMenu.utils'
import { useTutorial } from '../../../engine/tutorial/hooks/useTutorial'
import { useNotifications } from '../../../engine/notification/hooks/useNotifications'

interface Props {
  overlayMode: OverlayMode
  setOverlayMode: (mode: OverlayMode) => void
}

export default function ContextMenuShell(props: Props) {
  const {
    overlayMode,
    setOverlayMode,
  } = props

  const {tutorial} = useTutorial()
  const {notifications} = useNotifications()
  const [recordingDetail, setRecordingDetail] = useState(eventDebugRuntimeService.getRecordingDetail())
  const [player, setPlayer] = useState<PlayerEntity | undefined>(playerRuntimeService.getPlayer())
  const [characters, setCharacters] = useState<CharacterEntity[]>(characterRuntimeService.getCharacters())
  
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
    })
    return unsub
  }, [])
  const selectedBorderColor = 'var(--blue-sd-lighter-2)'
  const requiresAttentionColor = 'var(--green-success-2)'
  const anyUnviewedNotifications = notifications.some(h => h.viewed === false)
  const anyCharactersIdle = characterRuntimeService.getCharacters().some(c => c.isIdle === true)
  const leftActions = useMemo<ContextMenuAction[]>(() => {
    if(!player) return []
    if(!characters || characters.length === 0) return []
    if(overlayMode === 'transition') return []

    const actions: ContextMenuAction[] = []
    actions.push({
      id: 'world',
      label: 'World',
      iconName: 'world',
      iconRotate: false,
      borderColor: overlayMode === 'world' ? selectedBorderColor : '',
      onClick: () => setOverlayMode('world'),
    })
    const notificationsCanPulse = checkForPulse(() => {
      return anyUnviewedNotifications
    }, overlayMode, 'notifications')
    actions.push({
      id: 'notifications',
      label: 'Notifications',
      iconName: 'notifications',
      iconRotate: false,
      pulse: notificationsCanPulse,
      color: notificationsCanPulse ? requiresAttentionColor : '',
      borderColor: notificationsCanPulse ? requiresAttentionColor : overlayMode === 'notifications' ? selectedBorderColor : '',
      onClick: () => overlayMode === 'notifications' ? setOverlayMode('world') : setOverlayMode('notifications'),
    })
    actions.push({
      id: 'player',
      label: 'Player',
      iconName: 'player',
      iconRotate: false,
      borderColor: overlayMode === 'player' ? selectedBorderColor : '',
      onClick: () => overlayMode === 'player' ? setOverlayMode('world') : setOverlayMode('player'),
    })
    const canCharactersListPulse = checkForPulse(() => {
      return anyCharactersIdle
    }, overlayMode, 'characters')
    actions.push({
      id: 'characters',
      label: 'Characters',
      iconName: 'characters',
      iconRotate: false,
      pulse: canCharactersListPulse,
      color: canCharactersListPulse ? requiresAttentionColor : '',
      borderColor: canCharactersListPulse ? requiresAttentionColor  : overlayMode === 'characters' ? selectedBorderColor : '',
      onClick: () => overlayMode === 'characters' ? setOverlayMode('world') : setOverlayMode('characters'),
    })
    actions.push({
      id: 'parties',
      label: 'Parties',
      iconName: 'parties',
      iconRotate: false,
      pulse: false,
      color: '',
      borderColor: overlayMode === 'party_list' ? selectedBorderColor : '',
      onClick: () => overlayMode === 'party_list' ? setOverlayMode('world') : setOverlayMode('party_list'),
    })
    
    return actions
  }, [overlayMode, setOverlayMode, player, characters])

  const rightActions = useMemo<ContextMenuAction[]>(() => {
    if(overlayMode === 'transition') return []

    const actions: ContextMenuAction[] = []
    if(player && characters.length > 0){
      actions.push({
      id: 'settings',
      label: 'Settings',
      iconName: overlayMode === 'settings' ? 'close' : 'settings',
      iconRotate: overlayMode === 'settings' ? false : true,
      borderColor: overlayMode === 'settings' ? selectedBorderColor : '',
      onClick: () => {
        setOverlayMode(
          overlayMode === 'settings'
            ? 'world'
            : 'settings'
        )
      },
    })
      actions.push({
        id: 'dashboard',
        label: 'Dashboard',
        iconName: 'dashboard',
        iconRotate: false,
        borderColor: overlayMode === 'dashboard' ? selectedBorderColor : '',
        onClick: () => overlayMode === 'dashboard' ? setOverlayMode('world') : setOverlayMode('dashboard'),
      })

      const tutorialCanPulse = checkForPulse(() => {
        return typeof tutorial !== 'undefined'
      }, overlayMode, 'tutorial')
      actions.push({
        id: 'tutorial',
        label: 'Tutorial',
        iconName: 'tutorial',
        iconRotate: false,
        pulse: tutorialCanPulse,
        color: tutorialCanPulse ? requiresAttentionColor : '',
        borderColor: tutorialCanPulse ? requiresAttentionColor : overlayMode === 'tutorial' ? selectedBorderColor : '',
        onClick: () => overlayMode === 'tutorial' ? setOverlayMode('world') : setOverlayMode('tutorial'),
      })
    }
    
    if(recordingDetail.isDebugMode){
      actions.push({
        id: 'debug-event-recording',
        label: 'Debug Event Recording',
        iconName: recordingDetail.isRecording ? 'stop' : 'start',
        iconRotate: false,
        borderColor: recordingDetail.isRecording ? 'var(--danger)' : '',
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