import { useEffect, useState } from 'react'
import type { EventBusLog, GameEvent, GameEvents } from '../../../../../engine/event/types/EventBus.types'
import { type DebugEventsMode, type GroupEventItem } from '../../types/DebugEvents.types'
import { getDebugGamePlayerGoldEmit, getDebugGamePlayerSaveEmit, getDebugGamePlayerXPEmit } from '../../utils/GameEvents.utils'
import DebugEntityEvents from './DebugEntityEvents'
import { playerRuntimeService } from '../../../../../engine/player/PlayerRuntimeService'
import { eventBus } from '../../../../../engine/event/EventBus'
import { GAME_EVENT_BUS_PLAYER_TYPES } from '../../../../../engine/event/utils/EventBus.utils'
import type { PlayerEntity } from '../../../../../entity/player/types/PlayerEntity.types'
import GamePanelSection from '../../../../../ui/panel/GamePanelSection'
import PlayerDetail from '../../../../../entity/player/components/detail/PlayerDetail'
import { clockRuntimeService } from '../../../../../engine/clock/ClockRuntimeService'
import DebugEventLogs from '../event-logs/DebugEventLogs'

interface Props {
  setMode: (mode: DebugEventsMode) => void
}

export default function DebugPlayerEntityEvents(props: Props){
  const {
    setMode,
  } = props
  const [player, setPlayer] = useState<PlayerEntity | undefined>(playerRuntimeService.getPlayer())
  const [playerEvents, setPlayerEvents] = useState<EventBusLog[]>([])
  const addEvent = (event: GameEvent) => {
    setPlayerEvents(prev => {
      if(!prev) return prev

      return [
        {
          date: clockRuntimeService.getNow(),
          event: {
            ...event,
            meta: {
              ...event.meta
            }
          }
        },
        ...prev,
      ]
    })
  }
  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!GAME_EVENT_BUS_PLAYER_TYPES.includes(event.type)){
        return
      }
      setPlayer(playerRuntimeService.getPlayer())
      addEvent(event as GameEvent)
    })
    return unsub
  }, [])

  const groupEventItems: GroupEventItem[] = []
  if(!player){
    groupEventItems.push({
      title: 'New Player Save',
      description: 'Emit player:save, overwritting existing player data.',
      emit: () => {
        const event = getDebugGamePlayerSaveEmit()
        eventBus.emit(event as GameEvents)
      },
      type: 'player:save'
    })
  }
  if(player){
    groupEventItems.push(
      {
        title: 'Player XP +1',
        description: 'Emit player:xp to add 1 XP.',
        emit: () => {
          const event = getDebugGamePlayerXPEmit(1)
          eventBus.emit(event as GameEvents)
        },
        type: 'player:xp'
      },
      {
        title: 'Player Level Up',
        description: 'Emit player:xp to level up.',
        emit: () => {
          const event = getDebugGamePlayerXPEmit(player.xpNextLevel)
          eventBus.emit(event as GameEvents)
        },
        type: 'player:xp'
      },
      {
        title: 'Player Gold +1',
        description: 'Emit player:gold, adding 1 gold.',
        emit: () => {
          const event = getDebugGamePlayerGoldEmit(1)
          eventBus.emit(event as GameEvents)
        },
        type: 'player:gold'
      },
      {
        title: 'Player Gold -1',
        description: 'Emit player:gold, removing 1 gold.',
        emit: () => {
          const event = getDebugGamePlayerGoldEmit(-1)
          eventBus.emit(event as GameEvents)
        },
        type: 'player:gold'
      }
    )
  }

  return <>
    <GamePanelSection
      actions={[]}
      title=''
      description={<>
      </>}
    >

      <DebugEntityEvents 
        groupEventItems={groupEventItems}
        setMode={setMode}
        title='Debug Player Events'
      />
      {player && <PlayerDetail />}

      {playerEvents && playerEvents.length > 0 && (
        <DebugEventLogs 
          eventLogs={playerEvents}
          title='Emitted Events'
        />
      )}
    </GamePanelSection>
  </>
}