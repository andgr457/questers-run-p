import { useEffect, useMemo, useState } from 'react'

import ContextMenuRail from './ContextMenuRail'

import type { ContextMenuAction } from '../types/ContextMenuAction.types'
import type { OverlayMode } from '../types/OverlayMode.types'
import { eventDebugRuntimeService } from '../../../engine/event/EventDebugRuntimeService'
import { eventBus } from '../../../engine/event/EventBus'
import { GAME_EVENT_BUS_DEBUG_RECORDING_TYPES } from '../../../engine/event/utils/EventBus.utils'

interface Props {
  gameMode: string
  overlayMode: OverlayMode
  setOverlayMode: (mode: OverlayMode) => void
}

export default function ContextMenuShell(props: Props) {
  const {
    gameMode,
    overlayMode,
    setOverlayMode,
  } = props

  const [recordingDetail, setRecordingDetail] = useState(eventDebugRuntimeService.getRecordingDetail())

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(GAME_EVENT_BUS_DEBUG_RECORDING_TYPES.includes(event.type)){
        setRecordingDetail(eventDebugRuntimeService.getRecordingDetail())
      }
    })
    return unsub
  }, [])

  const leftActions = useMemo<ContextMenuAction[]>(() => {
    if (overlayMode !== 'none') {
      return [
        {
          id: 'back',
          label: 'Back',
          iconName: 'back',
          iconRotate: false,
          onClick: () => setOverlayMode('none'),
        },
      ]
    }

    if (gameMode !== 'world') {
      return []
    }

    return [
      {
        id: 'player',
        label: 'Player',
        iconName: 'player',
        iconRotate: false,
        onClick: () => setOverlayMode('player'),
      },
      {
        id: 'characters',
        label: 'Characters',
        iconName: 'characters',
        iconRotate: false,
        onClick: () => setOverlayMode('characters'),
      },
    ]
  }, [gameMode, overlayMode, setOverlayMode])

  const rightActions = useMemo<ContextMenuAction[]>(() => {
    return [
      {
        id: 'settings',
        label: 'Settings',
        iconName: overlayMode === 'settings' ? 'close' : 'settings',
        iconRotate: overlayMode === 'settings' ? false : true,
        onClick: () => {
          setOverlayMode(
            overlayMode === 'settings'
              ? 'none'
              : 'settings'
          )
        },
      },
      {
        id: 'debug-event-recording',
        label: 'Debug Event Recording',
        iconName: recordingDetail.isRecording ? 'recordStop' : 'recordStart',
        iconRotate: false,
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
              'none' : 'settings_debug_logs'
          )
        },
      },
    ]
  }, [
    gameMode,
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