import { useEffect, useState, type RefObject } from 'react';
import type { Player } from '../../../entities/player/types/Player.types';
import { playerEventService } from '../services/PlayerEventService';
import { eventBus } from '../EventBus';
import { useFloatingTextEvents } from './useFloatingTextEvents';

const EVENT_TYPE_INCLUDES = 'player:'

//References used by UI to show popup text over their div elements.
interface UsePlayerEventsProps {
  xpReference: RefObject<HTMLDivElement | null>
  goldReference: RefObject<HTMLDivElement | null>
  tokenReference: RefObject<HTMLDivElement | null>
  levelReference: RefObject<HTMLDivElement | null>
}

export function usePlayerEvents(props: UsePlayerEventsProps){
  const [player, setPlayer] = useState<Player | undefined>(
    playerEventService.getPlayer()
  )
  const {
    floatingTexts: playerFloatingTexts,
    addFloatingText: playerAddFloatingText,
    removeFloatingText: playerRemoveFloatingText
  } = useFloatingTextEvents()

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!event.type.includes(EVENT_TYPE_INCLUDES)) return

      if(event.type === 'player:created' || event.type === 'player:saved'){
        setPlayer(playerEventService.getPlayer())
      }

      if(event.type === 'player:gold:added'){
        const positiveOrNegative = event.meta.amount < 0 ? '' : event.meta.amount > 0 ? '+' : ''

        playerAddFloatingText({
          id: crypto.randomUUID(),
          color: 'gold',
          ref: props.goldReference,
          text: `${positiveOrNegative}${event.meta.amount.toLocaleString()}g`
        })
        setPlayer(playerEventService.getPlayer())
      }
      
    })
    return unsub
  }, [])

  return {
    player,
    playerFloatingTexts,
    playerRemoveFloatingText
  }
}