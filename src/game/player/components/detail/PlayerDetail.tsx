import styles from './PlayerDetail.module.css'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import GoldDetail from '../../../../ui/gold/GoldDetail'
import { usePlayer } from '../../../../engine/player/hooks/usePlayer'
import { useEffect, useRef, useState } from 'react'
import { formatPrimitiveValueToString, wait } from '../../../utils/Game.utils'
import { eventBus } from '../../../../engine/event/EventBus'
import FloatingText from '../../../../ui/text/floating-text/FloatingText'

const XP_COLOR = '#d534f2'
const GOLD_COLOR = 'var(--gold)'
const TOKEN_COLOR = '#7CC8FF'
const LEVEL_COLOR = 'var(--success)'
export default function PlayerDetail(){
  const {player, playerGold} = usePlayer()

  const [floatingTexts, setFloatingTexts] = useState<
    {
      id: string
      text: string
      left: number
      top: number
      color?: string
    }[]
  >([]);

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!event.type.includes('player:')) return
      if(event.type === 'player:gold:added'){
        showFloatingTextSequence([{
          ref: goldRef,
          text: `+${formatPrimitiveValueToString(event.meta?.gold ?? 0)}`,
          color: GOLD_COLOR,
        }])
      }
      if(event.type === 'player:xp:added'){
        showFloatingTextSequence([{
          ref: xpRef,
          text: `+${formatPrimitiveValueToString(event.meta?.xp ?? 0)}`,
          color: XP_COLOR,
        }])
      }
      if(event.type === 'player:token:added'){
        const token = event.meta?.characterTokens ?? 0
        const isNegative = token < 0

        showFloatingTextSequence([{
          ref: characterTokensRef,
          text: `${isNegative ? '' : '+'}${formatPrimitiveValueToString(event.meta?.characterTokens ?? 0)}`,
          color: TOKEN_COLOR,
        }])
      }
      if(event.type === 'player:level'){
        showFloatingTextSequence([{
          ref: levelRef,
          text: `+${event.meta?.level}`,
          color: LEVEL_COLOR,
        }])
      }
    })
    return unsub
  }, [])


  const goldRef = useRef<HTMLDivElement>(null);
  const xpRef = useRef<HTMLDivElement>(null);
  const characterTokensRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  const showFloatingText = (
    ref: React.RefObject<HTMLElement | null>,
    text: string,
    color = 'white'
  ) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    setFloatingTexts(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        color,
        left: rect.left - 15,
        top: rect.top,
      },
    ]);
  };

  const showFloatingTextSequence = (
    refDetails: {
      ref: React.RefObject<HTMLElement | null>
      text: string
      color?: string
    }[],
  ) => {
    const run = async () => {
      for (const refDetail of refDetails) {
        showFloatingText(refDetail.ref, refDetail.text, refDetail.color);
        await wait(1000);
      }
    }
    run()
  };

  if(!player){
    return null
  }

  return <div className={styles.wrapper}>
    <div className={styles.topRow}>
      <div>
        <div className={styles.name}>
          {player.name}
        </div>
      </div>

      <div ref={levelRef} >
        Lv. {player.level}
      </div>
      <div ref={characterTokensRef}>
        <div title='Character Create Tokens'>
          <span style={{color: 'var(--blue-sd-lighter-2)'}}>⌬</span> {player.characterTokens}
        </div>
      </div>
      <div ref={goldRef}>
        <span style={{color: 'gold'}}>◉</span> {playerGold}g
      </div>
    </div>

    <div ref={xpRef}>
      <ProgressBar
        value={getProgress(player.xp, player.xpNextLevel)}
        max={player.xpNextLevel}
        color='#a855f7'
        label='XP'
      />
      
    </div>

    {floatingTexts.map(item => (
      <FloatingText
        key={item.id}
        {...item}
        onComplete={() =>
          setFloatingTexts(prev =>
            prev.filter(x => x.id !== item.id)
          )
        }
      />
    ))}
  </div>
}

