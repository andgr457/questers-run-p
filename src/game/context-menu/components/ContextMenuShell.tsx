import { useEffect, useMemo, useState } from 'react'

import ContextMenuRail from './ContextMenuRail'

import type { ContextMenuAction } from '../types/ContextMenuAction.types'
import type { OverlayMode } from '../types/OverlayMode.types'
import { eventDebugRuntimeService } from '../../../engine/event/EventDebugRuntimeService'
import { eventBus } from '../../../engine/event/EventBus'
import { GAME_EVENT_BUS_DEBUG_RECORDING_TYPES } from '../../../engine/event/utils/EventBus.utils'
import { characterRuntimeService } from '../../../engine/character/CharacterRuntimeService'
import { checkForPulse } from '../utils/ContextMenu.utils'
import { useTutorial } from '../../../engine/tutorial/hooks/useTutorial'
import { useNotifications } from '../../../engine/notification/hooks/useNotifications'
import { useManagedCharacter } from '../../../engine/character/hooks/useManagedCharacters'
import { usePlayer } from '../../../engine/player/hooks/usePlayer'
import { useCharacters } from '../../../engine/character/hooks/useCharacters'
import { GAME_LOCATIONS } from '../../../entity/location/data/Location.data'

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
  const {managedCharacter} = useManagedCharacter()
  const {player} = usePlayer()
  const {characters} = useCharacters()
  const currentLocation = GAME_LOCATIONS.find(l => l.id === managedCharacter?.locationId)

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(GAME_EVENT_BUS_DEBUG_RECORDING_TYPES.includes(event.type)){
        setRecordingDetail(eventDebugRuntimeService.getRecordingDetail())
      }
    })
    return unsub
  }, [])

  const selectedBorderColor = 'var(--blue-sd-lighter-2)'
  const requiresAttentionColor = 'var(--success)'
  
  const anyUnviewedNotifications = notifications.some(h => h.viewed === false)
  const anyCharactersIdle = characterRuntimeService.getCharacters().some(c => c.isIdle === true)
  const leftActions = useMemo<ContextMenuAction[]>(() => {
    if(!player) return []
    if(!characters || characters.length === 0) return []
    if(overlayMode === 'transition' || overlayMode === 'intro') return []

    const actions: ContextMenuAction[] = []
    actions.push({
      id: 'world',
      label: 'World',
      iconName: 'world',
      iconRotate: false,
      borderColor: overlayMode === 'world' ? selectedBorderColor : '',
      onClick: () => {
        if(overlayMode === 'world') return
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:change',
          meta: {
            worldMode: 'world'
          }
        })
      },
    })
    const notificationsCanPulse = checkForPulse(() => {
      return anyUnviewedNotifications
    }, overlayMode, 'notifications')
    actions.push({
      id: 'notifications',
      label: 'Notifications',
      iconName: 'notifications',
      iconRotate: notificationsCanPulse ?? false,
      pulse: notificationsCanPulse,
      color: notificationsCanPulse ? requiresAttentionColor : '',
      borderColor: notificationsCanPulse ? requiresAttentionColor : overlayMode === 'notifications' ? selectedBorderColor : '',
      onClick: () => {
        if(overlayMode === 'notifications') return
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:change',
          meta: {
            worldMode: 'notifications'
          }
        })
      },
    })
    actions.push({
      id: 'player',
      label: 'Player',
      iconName: 'player',
      iconRotate: false,
      borderColor: overlayMode === 'player' ? selectedBorderColor : '',
      onClick: () => {
        if(overlayMode === 'player') return
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:change',
          meta: {
            worldMode: 'player'
          }
        })
      },
    })

    const canCharactersListPulse = checkForPulse(() => {
      return anyCharactersIdle
    }, overlayMode, 'characters')
    let charactersTutorialHint = false
    if(tutorial){
      if(overlayMode !== 'characters'){
        if(tutorial.hints.some(h => h.uiPath === 'characters')){
          charactersTutorialHint = true
        }
      }
    }
    actions.push({
      id: 'characters',
      label: 'Characters',
      iconName: 'characters',
      iconRotate: canCharactersListPulse ?? false,
      pulse: charactersTutorialHint || canCharactersListPulse,
      color: charactersTutorialHint ? 'gold' : canCharactersListPulse ? requiresAttentionColor : '',
      borderColor: charactersTutorialHint ? 'gold' : canCharactersListPulse ? requiresAttentionColor  : overlayMode === 'characters' ? selectedBorderColor : '',
      onClick: () => {
        if(overlayMode === 'characters') return
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:change',
          meta: {
            worldMode: 'characters'
          }
        })
      },
    })
    if(managedCharacter){
      actions.push({
        id: 'manage-characters',
        label: 'Manage Character',
        iconName: 'character_manage',
        iconRotate: false,
        pulse: false,
        borderColor: overlayMode === 'character_manage' ? selectedBorderColor : '',
        onClick: () => {
          if(overlayMode === 'character_manage') return
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'world:mode:change',
            meta: {
              worldMode: 'character_manage'
            }
          })
        },
      })
    }
    actions.push({
      id: 'parties',
      label: 'Parties',
      iconName: 'parties',
      iconRotate: false,
      pulse: false,
      color: '',
      borderColor: overlayMode === 'party_list' ? selectedBorderColor : '',
      onClick: () => {
        if(overlayMode === 'party_list') return
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:change',
          meta: {
            worldMode: 'party_list'
          }
        })
      },
    })
    
    return actions
  }, [overlayMode, setOverlayMode, player, characters])

  const rightActions = useMemo<ContextMenuAction[]>(() => {
    if(overlayMode === 'transition' || overlayMode === 'intro') return []

    const actions: ContextMenuAction[] = []
    if(player && characters.length > 0){
      actions.push({
      id: 'settings',
      label: 'Settings',
      iconName: overlayMode === 'settings' ? 'close' : 'settings',
      iconRotate: overlayMode === 'settings' ? false : true,
      borderColor: overlayMode === 'settings' ? selectedBorderColor : '',
      onClick: () => {
        if(overlayMode === 'settings') return
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:change',
          meta: {
            worldMode: 'settings'
          }
        })
      },
    })
      // actions.push({
      //   id: 'dashboard',
      //   label: 'Dashboard',
      //   iconName: 'dashboard',
      //   iconRotate: false,
      //   borderColor: overlayMode === 'dashboard' ? selectedBorderColor : '',
      //   onClick: () => overlayMode === 'dashboard' ? setOverlayMode('world') : setOverlayMode('dashboard'),
      // })

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
        onClick: () => {
          if(overlayMode === 'tutorial') return
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'world:mode:change',
            meta: {
              worldMode: 'tutorial'
            }
          })
        },
      })
      if(managedCharacter && currentLocation && currentLocation.type === 'adv_guild'){
        let advGuildTutorialHint = false
        if(tutorial){
          if(overlayMode !== 'adv_guild'){
            if(tutorial.hints.some(h => h.uiPath?.endsWith('adv_guild'))){
              advGuildTutorialHint = true
            }
          }
        }
        const advGuildCanPulse = checkForPulse(() => {
          return advGuildTutorialHint === true
        }, overlayMode, 'adv_guild')
        actions.push({
          id: 'advguild',
          label: `${currentLocation.name}`,
          iconName: 'adv_guild',
          iconRotate: true,
          pulse: advGuildCanPulse,
          color: advGuildTutorialHint ? 'gold' : '',
          borderColor: advGuildTutorialHint ? 'gold' : overlayMode === 'adv_guild' ? selectedBorderColor : '',
          onClick: () => {
            if(overlayMode === 'adv_guild') return
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'world:mode:change',
              meta: {
                worldMode: 'adv_guild'
              }
            })
          },
        })
      }
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
          if(overlayMode === 'settings_debug_logs') return
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'world:mode:change',
            meta: {
              worldMode: 'settings_debug_logs'
            }
          })
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