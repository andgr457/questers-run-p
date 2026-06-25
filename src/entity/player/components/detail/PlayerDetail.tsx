import { useEffect, useState } from 'react'
import { eventBus } from '../../../../engine/event/EventBus'
import { getPlayerGold } from '../../../../engine/player/utils/Player.utils'
import { GAME_EVENT_BUS_PLAYER_TYPES } from '../../../../engine/event/utils/EventBus.utils'
import { playerRuntimeService } from '../../../../engine/player/PlayerRuntimeService'
import styles from './PlayerDetail.module.css'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import GamePanel from '../../../../ui/panel/GamePanel'

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
        <div className={styles.title}>
          <div className={styles.name}>
            {player.name}
          </div>
          <div className={styles.label}>
            Lv. {player.level}
          </div>
          <div className={styles.label}>
            {player.characterTokens.toLocaleString()} Token(s)
          </div>
          <div className={styles.label} style={{color: 'gold'}}>
            {gold.toLocaleString()}g
          </div>
        </div>

        <div className={styles.bars}>
          <div className={styles.bar}>
            <ProgressBar
              value={getProgress(player.xp, player.xpNextLevel)}
              max={player.xpNextLevel}
              color='#a855f7'
              label='XP'
            />
          </div>

        </div>
      </div>
    </GamePanel>    
  )
}