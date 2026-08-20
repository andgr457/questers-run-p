import styles from './CharacterDetail.module.css'
import { useRef } from 'react';
import { useCharacterEvents } from '../../../../engine/events/hooks/useCharacterEvents'
import { eventBus } from '../../../../engine/events/EventBus';
import { clockRuntimeService } from '../../../../engine/clock/ClockRuntimeService';
import FloatingText from '../../../../core/components/floating-text/FloatingText';
import ProgressBar from '../../../../core/components/progress-bar/ProgressBar';
import { getProgress } from '../../../../core/components/progress-bar/utils/ProgressBar.utils';
import Gold from '../../../../core/components/gold/Gold';

interface Props {
  characterId: string
}

export default function CharacterDetail(props: Props) {
  const goldRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const xpRef = useRef<HTMLDivElement>(null);
  const hpRef = useRef<HTMLDivElement>(null);
  const staminaRef = useRef<HTMLDivElement>(null);
  const manaRef = useRef<HTMLDivElement>(null);

  const {
    characterId
  } = props

  const {
    character, 
    characterFloatingTexts, 
    characterRemoveFloatingText
  } = useCharacterEvents({
    characterId: characterId,
    goldReference: goldRef,
    levelReference: levelRef,
    xpReference: xpRef,
    hpReference: hpRef,
    manaReference: manaRef,
    staminaReference: staminaRef
  })

  if(!character){
    return (
      <div className={styles.wrapper}>
        NO CHARACTER WITH ID: {characterId}
      </div>
    )
  }

  return <div className={styles.wrapper}>
    <div className={styles.top}>
      <div className={styles.name}>
        {character.title}
      </div>
      <div ref={levelRef} className={styles.level}>
        Lv. {character.level}
      </div>
      <div ref={goldRef} className={styles.gold}>
        <Gold value={character.gold} />
      </div>
    </div>

    <div ref={hpRef}>
      <ProgressBar 
        color='red'
        max={character.attributes.hp.valueMax}
        value={getProgress(character.attributes.hp.value, character.attributes.hp.valueMax)}
        showLabel={true}
        showValues={true}
        label='HP'
      />
    </div>

    <div ref={staminaRef}>
      <ProgressBar 
        color='green'
        max={character.attributes.stamina.valueMax}
        value={getProgress(character.attributes.stamina.value, character.attributes.stamina.valueMax)}
        showLabel={true}
        showValues={true}
        label='STA'
      />
    </div>

    <div ref={manaRef}>
      <ProgressBar 
        color='blue'
        max={character.attributes.mana.valueMax}
        value={getProgress(character.attributes.mana.value, character.attributes.mana.valueMax)}
        showLabel={true}
        showValues={true}
        label='HP'
      />
    </div>

    <div ref={xpRef}>
      <ProgressBar 
        color='purple'
        max={character.attributes.xp.valueMax}
        value={getProgress(character.attributes.xp.value, character.attributes.xp.valueMax)}
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
            type: 'character:gold:add',
            created: clockRuntimeService.getNow(),
            meta: {
              characterId,
              value: 1
            }
          })
        }}
      >+1g</button>
      
      <button
        onClick={() => {
          if(character.gold <= 0) return

          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'character:gold:add',
            created: clockRuntimeService.getNow(),
            meta: {
              characterId,
              value: -1
            }
          })
        }}
      >-1g</button>
    </div>
    {characterFloatingTexts.map(item => (
        <FloatingText
          key={item.id}
          floatingText={item}
          {...item}
          onComplete={() => {
            characterRemoveFloatingText(item.id)
          }}
        />
      ))}
  </div>
}