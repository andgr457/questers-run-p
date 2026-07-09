import { useEffect, useState } from 'react'
import { eventBus } from '../../../../engine/event/EventBus'
import { getPlayerGold } from '../../utils/Player.utils'
import { GAME_EVENT_BUS_PLAYER_TYPES } from '../../../../engine/event/utils/EventBus.utils'
import { playerRuntimeService } from '../../../../engine/player/PlayerRuntimeService'
import styles from './PlayerDetail.module.css'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import GamePanel from '../../../../ui/panel/GamePanel'
import PlayerCharacterTokens from './PlayerCharacterTokens'
import GoldDetail from '../../../../ui/gold/GoldDetail'

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

  if(!player){
    return null
  }

  return (
    <GamePanel
      currentScreenName=''
      title='Player'
    >
      <div className={styles.wrapper}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.name}>
              {player.name}
            </div>
          </div>

          <div className={styles.level}>
            Lv. {player.level}
          </div>
        </div>

        <div className={styles.infoRow}>
          <ProgressBar
            value={getProgress(player.xp, player.xpNextLevel)}
            max={player.xpNextLevel}
            color='#a855f7'
            label='XP'
          />
          <div className={styles.gold}>
            <PlayerCharacterTokens tokens={player.characterTokens} />
          </div>
          <div className={styles.gold}>
            <GoldDetail gold={gold} />
          </div>
        </div>
      </div>
    </GamePanel>    
  )
}