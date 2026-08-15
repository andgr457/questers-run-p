import styles from './PlayerDetail.module.css'
import { useEffect, useRef } from 'react';
import { usePlayerEvents } from '../../../../engine/events/hooks/usePlayerEvents'
import { eventBus } from '../../../../engine/events/EventBus';
import { clockRuntimeService } from '../../../../engine/clock/ClockRuntimeService';
import { getNewPlayer } from '../../utils/Player.utils';
import FloatingText from '../../../../core/components/floating-text/FloatingText';
import ProgressBar from '../../../../core/components/progress-bar/ProgressBar';
import { getProgress } from '../../../../core/components/progress-bar/utils/ProgressBar.utils';
import Gold from '../../../../core/components/gold/Gold';
import Tokens from '../tokens/Tokens';

export default function PlayerDetail() {
  const playerGoldRef = useRef<HTMLDivElement>(null);
  const playerLevelRef = useRef<HTMLDivElement>(null);
  const playerTokensRef = useRef<HTMLDivElement>(null);
  const playerXpRef = useRef<HTMLDivElement>(null);

  const {
    player, 
    playerFloatingTexts, 
    playerRemoveFloatingText
  } = usePlayerEvents({
    goldReference: playerGoldRef,
    levelReference: playerLevelRef,
    tokenReference: playerTokensRef,
    xpReference: playerXpRef
  })

  useEffect(() => {
    if(!player){
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'player:create',
        created: clockRuntimeService.getNow(),
        meta: {
          player: getNewPlayer()
        }
      })
    }
  }, [])

  if(!player){
    return <div>Creating new player...</div>
  }

  return <div className={styles.wrapper}>
    <div className={styles.top}>
      <div className={styles.name}>
        {player.name}
      </div>
      <div ref={playerLevelRef} className={styles.level}>
        Lv. {player.level}
      </div>
      <div ref={playerGoldRef} className={styles.gold}>
        <Gold value={player.gold} />
      </div>
      <div ref={playerTokensRef} className={styles.tokens}>
        <Tokens value={player.tokens} />
      </div>
    </div>

    <div ref={playerXpRef}>
      <ProgressBar 
        color='purple'
        max={player.xpNextLevel}
        value={getProgress(player.xp, player.xpNextLevel)}
        showLabel={true}
        showValues={true}
        label='XP'
      />
    </div>

    <div>
      <button
        onClick={() => {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'player:gold:add',
            created: clockRuntimeService.getNow(),
            meta: {
              amount: 1
            }
          })
        }}
      >Add Gold</button>
      
      <button
        onClick={() => {
          if(player.gold <= 0) return

          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'player:gold:add',
            created: clockRuntimeService.getNow(),
            meta: {
              amount: -1
            }
          })
        }}
      >Remove Gold</button>
    </div>
    {playerFloatingTexts.map(item => (
        <FloatingText
          key={item.id}
          floatingText={item}
          {...item}
          onComplete={() => {
            playerRemoveFloatingText(item.id)
          }}
        />
      ))}
  </div>
}