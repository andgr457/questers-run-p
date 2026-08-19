import styles from './GuildMasterDetail.module.css'
import { useRef } from 'react';
import { useGuildMasterEvents } from '../../../../engine/events/hooks/useGuildMasterEvents'
import { eventBus } from '../../../../engine/events/EventBus';
import { clockRuntimeService } from '../../../../engine/clock/ClockRuntimeService';
import FloatingText from '../../../../core/components/floating-text/FloatingText';
import ProgressBar from '../../../../core/components/progress-bar/ProgressBar';
import { getProgress } from '../../../../core/components/progress-bar/utils/ProgressBar.utils';
import Gold from '../../../../core/components/gold/Gold';
import Tokens from '../tokens/Tokens';

interface Props {
  guildMasterId: string
}

export default function GuildMasterDetail(props: Props) {
  const gmGoldRef = useRef<HTMLDivElement>(null);
  const gmLevelRef = useRef<HTMLDivElement>(null);
  const gmTokensRef = useRef<HTMLDivElement>(null);
  const gmXpRef = useRef<HTMLDivElement>(null);

  const {
    guildMaster, 
    guildMasterFloatingTexts: gmFloatingTexts, 
    guildMasterRemoveFloatingText: gmRemoveFloatingText
  } = useGuildMasterEvents({
    guilldMasterId: props.guildMasterId,
    goldReference: gmGoldRef,
    levelReference: gmLevelRef,
    tokenReference: gmTokensRef,
    xpReference: gmXpRef
  })

  // useEffect(() => {
  //   if(!guildMaster){
  //     eventBus.emit({
  //       id: crypto.randomUUID(),
  //       type: 'player:create',
  //       created: clockRuntimeService.getNow(),
  //       meta: {
  //         player: getNewPlayer()
  //       }
  //     })
  //   }
  // }, [])

  if(!guildMaster){
    return <div>Become Guild Master of GUILD_NAME?</div>
  }

  return <div className={styles.wrapper}>
    <div className={styles.top}>
      <div className={styles.name}>
        {guildMaster.title}
      </div>
      <div ref={gmLevelRef} className={styles.level}>
        Lv. {guildMaster.level}
      </div>
      <div ref={gmGoldRef} className={styles.gold}>
        <Gold value={guildMaster.gold} />
      </div>
      <div ref={gmTokensRef} className={styles.tokens}>
        <Tokens value={guildMaster.tokens} />
      </div>
    </div>

    <div ref={gmXpRef}>
      <ProgressBar 
        color='purple'
        max={guildMaster.xpNextLevel}
        value={getProgress(guildMaster.xp, guildMaster.xpNextLevel)}
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
            type: 'gm:gold:add',
            created: clockRuntimeService.getNow(),
            meta: {
              guildMasterId: props.guildMasterId,
              amount: 1
            }
          })
        }}
      >Add Gold</button>
      
      <button
        onClick={() => {
          if(guildMaster.gold <= 0) return

          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'gm:gold:add',
            created: clockRuntimeService.getNow(),
            meta: {
              guildMasterId: props.guildMasterId,
              amount: -1
            }
          })
        }}
      >Remove Gold</button>
    </div>
    {gmFloatingTexts.map(item => (
        <FloatingText
          key={item.id}
          floatingText={item}
          {...item}
          onComplete={() => {
            gmRemoveFloatingText(item.id)
          }}
        />
      ))}
  </div>
}