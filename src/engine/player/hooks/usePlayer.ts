import { useEffect, useState } from 'react';
import { eventBus } from '../../event/EventBus';
import type { PlayerEntity } from '../../../entity/player/types/PlayerEntity.types';
import { playerRuntimeService } from '../PlayerRuntimeService';
import { getPlayerGold } from '../../../entity/player/utils/Player.utils';
import { GAME_EVENT_BUS_PLAYER_TYPES } from '../data/PlayerEvents.data';

export function usePlayer(){
  const [player, setPlayer] = useState<PlayerEntity | undefined>(
    playerRuntimeService.getPlayer()
  )
  const [playerGoldTxns, setPlayerGoldTxns] = useState(
    playerRuntimeService.getPlayerGoldTransactions()
  )
  const [playerGold, setPlayerGold] = useState(
    getPlayerGold()
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!GAME_EVENT_BUS_PLAYER_TYPES.includes(event.type)){
        return
      }
      
      if(event.type === 'player:saved'){
        setPlayer(playerRuntimeService.getPlayer())
        setPlayerGoldTxns(playerRuntimeService.getPlayerGoldTransactions())
        setPlayerGold(getPlayerGold())
      }
    })
    return unsub
  }, [])

  return {
    player,
    playerGoldTxns,
    playerGold
  }
}