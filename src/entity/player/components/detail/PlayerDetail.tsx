import DetailRow from '../../../../game/detail/DetailRow'
import GamePanelSection from '../../../../ui/panel/GamePanelSection'
import { useEffect, useState } from 'react'
import { eventBus } from '../../../../engine/event/EventBus'
import { getPlayerGold } from '../../../../engine/player/utils/Player.utils'
import { GAME_EVENT_BUS_PLAYER_TYPES } from '../../../../engine/event/utils/EventBus.utils'
import { playerRuntimeService } from '../../../../engine/player/PlayerRuntimeService'

export default function PlayerDetail(){

  const [gold, setGold] = useState(getPlayerGold())
  const [player, setPlayer] = useState(playerRuntimeService.getPlayer())
  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'player:gold:added'){
        setGold(getPlayerGold())
      }
      if(GAME_EVENT_BUS_PLAYER_TYPES.includes(event.type)){
        setPlayer(playerRuntimeService.getPlayer())
      }
    })
    return unsub
  }, [])

  return <GamePanelSection
    actions={[]}
    title=''
  >
    <div className='detail-wrapper'>
      <div className='detail-header'>
        Player Detail
      </div>
      <div className='detail-rows'>
        <DetailRow field='Name' value={player?.name ?? ''} />
        <DetailRow field='ID' value={player?.id ?? ''} />
        <DetailRow field='Level' value={`${player?.level ?? -1}`} />
        <DetailRow field='XP' value={player?.xp?.toFixed(0) ?? ''} />
        <DetailRow field='XP Next Level' value={player?.xpNextLevel.toFixed(0) ?? ''} />
        <DetailRow field='Gold' value={gold.toFixed(0)} />
      </div>
    </div>
  </GamePanelSection>
}