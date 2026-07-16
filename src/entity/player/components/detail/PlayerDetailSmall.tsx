import styles from './PlayerDetailSmall.module.css'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import PlayerCharacterTokens from './PlayerCharacterTokens'
import GoldDetail from '../../../../ui/gold/GoldDetail'
import { usePlayer } from '../../../../engine/player/hooks/usePlayer'
import type { RefObject } from 'react'

interface Props {
  xpRef?: RefObject<HTMLDivElement | null>
  goldRef?: RefObject<HTMLDivElement | null>
  characterTokensRef?: RefObject<HTMLDivElement | null>
}

export default function PlayerDetailSmall(props: Props){
  const {player, playerGold} = usePlayer()
  const {
    characterTokensRef,
    goldRef,
    xpRef
  } = props

  if(!player){
    return null
  }

  return <div className={styles.wrapper}>
    <div className={styles.name}>
      {player.name}
    </div>
    <div className={styles.level}>
      Lv. {player.level}
    </div>
    <div ref={characterTokensRef} className={styles.gold}>
      <PlayerCharacterTokens tokens={player.characterTokens} />
    </div>
    <div ref={goldRef} className={styles.gold}>
      <GoldDetail gold={playerGold} />
    </div>
    
    <div ref={xpRef}>
      <ProgressBar
        value={getProgress(player.xp, player.xpNextLevel)}
        max={player.xpNextLevel}
        color='#a855f7'
        label='XP'
        showValues={false}
      />
      
    </div>
  </div>
}