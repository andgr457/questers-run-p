import styles from './PlayerDetail.module.css'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import GamePanel from '../../../../ui/panel/GamePanel'
import PlayerCharacterTokens from './PlayerCharacterTokens'
import GoldDetail from '../../../../ui/gold/GoldDetail'
import { usePlayer } from '../../../../engine/player/hooks/usePlayer'

export default function PlayerDetail(){
  const {player, playerGold} = usePlayer()

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
          <div className={styles.gold}>
            <PlayerCharacterTokens tokens={player.characterTokens} />
          </div>
          <div className={styles.gold}>
            <GoldDetail gold={playerGold} />
          </div>
        </div>

        <div>
          <ProgressBar
            value={getProgress(player.xp, player.xpNextLevel)}
            max={player.xpNextLevel}
            color='#a855f7'
            label='XP'
          />
          
        </div>
      </div>
    </GamePanel>    
  )
}