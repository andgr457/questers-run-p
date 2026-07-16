import { useState, useEffect, type RefObject } from 'react'
import { getCharacterGold } from '../../utils/Character.utils'
import { eventBus } from '../../../../engine/event/EventBus'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import { GAME_CHARACTER_CLASSES } from '../../../character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../../character-class/types/CharacterClassEntity.types'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import GoldDetail from '../../../../ui/gold/GoldDetail'

import styles from './CharacterListItemSmall.module.css'

interface Props {
  entity: CharacterEntity
  xpRef?: RefObject<HTMLDivElement | null>
  goldRef?: RefObject<HTMLDivElement | null>
}

export default function CharacterListItemSmall(props: Props) {
  const {
    entity,
    goldRef,
    xpRef,
  } = props

  const [gold, setGold] = useState(getCharacterGold(entity.id))
  
  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if (event.type === 'character:gold:added') {
        if(event.meta?.characterId === entity.id){
          setGold(getCharacterGold(entity.id))
        }
      }
    })

    return unsub
  }, [entity.id])

  const className =
    GAME_CHARACTER_CLASSES[
      entity.classId as CharacterClassId
    ]?.name

  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>
        {entity.name}
      </div>
      <div className={styles.level}>
        Lv. {entity.level}
      </div>

      <div className={styles.className}>
        {className}
      </div>

      <div ref={goldRef} className={styles.gold}>
        <GoldDetail gold={gold} />
      </div>
      
      <div ref={xpRef} className={styles.bars}>
        <ProgressBar
          value={getProgress(
            entity.xp,
            entity.xpNextLevel
          )}
          max={entity.xpNextLevel}
          color="#a855f7"
          label="XP"
          showValues={false}
        />
      </div>
    </div>
  )
}