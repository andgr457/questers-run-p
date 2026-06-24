import { useCallback, useEffect, useState } from 'react'
import { characterRuntimeService } from '../../../../../engine/entity/CharacterRuntimeService'
import { playerRuntimeService } from '../../../../../engine/entity/PlayerRuntimeService'
import { eventBus } from '../../../../../engine/event/EventBus'
import { clockRuntimeService } from '../../../../../engine/clock/ClockRuntimeService'
import type { CharacterEntity } from '../../../../../entity/character/types/CharacterEntity.types'
import type { PlayerEntity } from '../../../../../entity/player/types/PlayerEntity.types'
import type { EventBusLog, GameEvent, GameEvents, GameEventType } from '../../../../../engine/event/types/EventBus.types'
import { GAME_EVENT_BUS_DEBUG_RECORDING_TYPES, GAME_EVENT_BUS_TYPES } from '../../../../../engine/event/utils/EventBus.utils'
import { getDebugGameEventEmit } from '../../utils/GameEvents.utils'
import { eventDebugRuntimeService } from '../../../../../engine/event/EventDebugRuntimeService'
import type { DebugEventsListItemUI, DebugEventsListUI, DebugEventsMode, GroupEventItem } from '../../types/DebugEvents.types'
import GamePanel from '../../../../../ui/panel/GamePanel'
import GameListWrapper from '../../../../../ui/list/GameListWrapper'
import DebugEventListActionItem from './DebugEventListActionItem'
import DebugEventRecording from '../event-recording/DebugEventRecording'
import DebugPlayerEvents from '../entity-events/DebugEntityEvents'
import DebugEventLogs from '../event-logs/DebugEventLogs'

export default function DebugEventList() {

  const [mode, setMode] = useState<DebugEventsMode>('main')

  const [eventLogs, setEventLogs] = useState<EventBusLog[]>([])
  const [player, setPlayer] = useState<PlayerEntity | undefined>(playerRuntimeService.getPlayer())
  const [characters, setCharacters] = useState<CharacterEntity[]>(characterRuntimeService.getCharacters())
  const [eventIds, setEventIds] = useState<Record<GameEventType, string[]>>({} as Record<GameEventType, string[]>)
  const [relatedEvents, setRelatedEvents] = useState<EventBusLog[]>([])
  const [recordingDetail, setRecordingDetail] = useState(eventDebugRuntimeService.getRecordingDetail())

  const addEvent = (event: GameEvent) => {
    setEventLogs(prev => {
      if(!prev) return prev

      return [
        ...prev,
        {
          date: clockRuntimeService.getNow(),
          event: {
            ...event,
            meta: {
              ...event.meta
            }
          }
        }
      ]
    })
  }

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'player:save' || event.type === 'player:saved'){
        setPlayer(playerRuntimeService.getPlayer())
        addEvent(event)
        if(event.type === 'player:saved'){
          setEventIds(prev => ({
            ...prev,
            [event.type]: [
              ...(prev[event.type] ?? []),
              event.id
            ]
          }))
        }
      }
      if(event.type === 'character:save' || event.type === 'character:saved'){
        setCharacters(characterRuntimeService.getCharacters())
        addEvent(event)
        if(event.type === 'character:saved'){
          setEventIds(prev => ({
            ...prev,
            [event.type]: [
              ...(prev[event.type] ?? []),
              event.id
            ]
          }))
        }
      }
      if(GAME_EVENT_BUS_DEBUG_RECORDING_TYPES.includes(event.type)){
        setRecordingDetail(eventDebugRuntimeService.getRecordingDetail())
      }
    })

    return unsub
  }, [])

  const handleEmitDebugEvent = (event: GameEvent) => {
    const id = crypto.randomUUID()
    setEventIds(prev => ({
      ...prev,
      [event.type]: [
        ...(prev[event.type] ?? []),
        id
      ]
    }))
    const newEvent: GameEvents = {
      ...event as any,
      meta: {
        ...event.meta
      },
      id: id
    }
    console.log('debug emitting', newEvent)
    eventBus.emit(newEvent)
  }

  const handleShowLogs = useCallback(async (eventType: GameEventType) => {
    const relatedIdsList = eventIds[eventType]
    
    if(!relatedIdsList || relatedIdsList.length === 0) return

    const logs = eventLogs.filter(l => 
      l.event.type === eventType
      && relatedIdsList.includes(l.event.id)
    )

    if(logs.length === 0) return

    setRelatedEvents(logs)
    
    setMode('debug_event_logs')
  }, [eventLogs, eventIds])
  
  const eventGroupsMap: Map<string, 
    GroupEventItem[]
  > = new Map()

  GAME_EVENT_BUS_TYPES.map(t => {
    const group = t.split(':')[0].toLowerCase()
    const friendlyName = t.replaceAll(':', ' ')
    if(!eventGroupsMap.has(group)){
      eventGroupsMap.set(group, [])
    }
    eventGroupsMap.get(group)?.push({
      type: t,
      title: friendlyName,
      description: `Emit game event ${t} with test data.`,
      emit: () => {
        console.log('emitting', t)
        const defaultEvent = getDebugGameEventEmit(t)
        if(defaultEvent?.meta?.player && !defaultEvent?.meta?.player?.id){
          defaultEvent.meta.player.id = crypto.randomUUID()
        }

        if(defaultEvent){
          handleEmitDebugEvent(defaultEvent as GameEvent)
        }
      }
    })
  })

  const lists: DebugEventsListUI[] = [
    {
      title: 'event categories',
      description: <>Troubleshoot and record various events by emitting test data and viewing the output.</>,
      items: [
        {
          title: 'global event recording',
          description: <>While recording has started, all game events will be tracked here until you leave, or refresh the site.</>,
          mode: 'global_event_recording'
        },
        {
          title: 'player events',
          description: <>View various player related events and trigger them for debugging.</>,
          mode: 'player_events'
        },
        {
          title: 'character events',
          description: <>View various character related events and trigger them for debugging.</>,
          mode: 'character_events'
        }
      ]
    }
  ]

  const relatedEventGroup = relatedEvents?.[0]?.event?.type?.split(':')?.[0]
  const backToMode: DebugEventsMode = relatedEventGroup === 'player' ? 'player_events' :
    relatedEventGroup === 'character' ? 'character_events' : 'main'

  return (
    <>
      <GamePanel
        title=''
        currentScreenName=''
        onBackTo={() => setMode('main')}
      >
        {mode === 'main' && (
          lists.map(l => {
            return <GameListWrapper<DebugEventsListItemUI>
              actions={[]}
              entities={l.items}
              getEntityContent={(entity) => {
                return <DebugEventListActionItem 
                  entity={entity}
                />
              }}
              onCardClick={(entity) => {
                setMode(entity.mode)
              }}
              title={l.title?.toLowerCase()}
            />
          })
        )}
        {mode === 'global_event_recording' && (
          <>
            <DebugEventRecording 
              characters={characters}
              player={player as PlayerEntity}
              recordingDetail={recordingDetail}
              setMode={setMode}
              setRelatedEvents={setRelatedEvents}
            />
          </>
        )}
        {mode === 'player_events' && (
          <>
            <DebugPlayerEvents 
              groupEventItems={eventGroupsMap.get('player') ?? []}
              handleShowLogs={handleShowLogs}
              eventIds={eventIds}
              title='Player Events'
              setMode={setMode}
            />
          </>
        )}
      </GamePanel>
      {mode === 'debug_event_logs' && relatedEvents && relatedEventGroup && (
        <DebugEventLogs 
          eventLogs={relatedEvents}
          setMode={setMode}
          setModeTo={backToMode}
          setModeToLabel={`${relatedEventGroup.toUpperCase()} Events`}
        />
      )} 
    </>
  )
}