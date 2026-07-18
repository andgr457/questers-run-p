import styles from './PlayerDetailSmall.module.css'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import PlayerCharacterTokens from './PlayerCharacterTokens'
import GoldDetail from '../../../../ui/gold/GoldDetail'
import { usePlayer } from '../../../../engine/player/hooks/usePlayer'
import type { RefObject } from 'react'
import { formatPrimitiveValueToString } from '../../../../game/utils/Game.utils'

interface Props {
  xpRef?: RefObject<HTMLDivElement | null>
  goldRef?: RefObject<HTMLDivElement | null>
  characterTokensRef?: RefObject<HTMLDivElement | null>
  levelRef?: RefObject<HTMLDivElement | null>
  rewardXp?: number
  rewardGold?: number
  rewardCharacterTokens?: number
}

export default function PlayerDetailSmall(props: Props){
  const {player, playerGold} = usePlayer()
  const {
    characterTokensRef,
    goldRef,
    xpRef,
    levelRef,
    rewardCharacterTokens = 0,
    rewardGold = 0,
    rewardXp = 0,
  } = props

  if(!player){
    return null
  }

  return <div className={styles.wrapper}>
    <div className={styles.name}>
      {player.name}
    </div>
    <div ref={levelRef} className={styles.level}>
      Lv. {player.level}
    </div>
    <div ref={characterTokensRef} className={styles.gold}>
      <div>
        <PlayerCharacterTokens tokens={player.characterTokens} />
      </div>
      <div className={`${styles.rewardAmount} ${rewardCharacterTokens > 0 ? styles.success : ''}`}>
        +{formatPrimitiveValueToString(rewardCharacterTokens)}
      </div>
    </div>
  
    <div ref={goldRef} className={styles.gold}>
      <div>
        <GoldDetail gold={playerGold} />
      </div>
      <div className={`${styles.rewardAmount} ${rewardGold > 0 ? styles.success : ''}`}>
        +{formatPrimitiveValueToString(rewardGold)}g
      </div>
    </div>
    
    <div ref={xpRef}>
      <ProgressBar
        value={getProgress(player.xp, player.xpNextLevel)}
        max={player.xpNextLevel}
        color='#a855f7'
        label='XP'
        showValues={false}
      />
      
      <div className={`${styles.rewardAmount} ${rewardXp > 0 ? styles.success : ''}`}>
        +{formatPrimitiveValueToString(rewardXp)}
      </div>
    </div>
  </div>
}