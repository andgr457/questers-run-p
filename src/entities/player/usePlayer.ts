import { useEffect, useState } from 'react';
import { playerEventService } from '../../engine/events/player/PlayerEventService';
import type { Player } from './Player.types';
import { eventBus } from '../../engine/events/EventBus';

export function usePlayer(){
  const [player, setPlayer] = useState<Player | undefined>(
    playerEventService.getPlayer()
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'player:created'){
        setPlayer(playerEventService.getPlayer())
      }
    })

    return unsub
  })

  return {
    player
  }
}
