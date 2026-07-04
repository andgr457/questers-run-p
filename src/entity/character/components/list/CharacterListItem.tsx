import { useState, useEffect } from 'react'
import { getCharacterGold } from '../../../../engine/character/utils/Character.utils'
import { eventBus } from '../../../../engine/event/EventBus'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import { GAME_CHARACTER_CLASSES } from '../../../character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../../character-class/types/CharacterClassEntity.types'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'

import styles from './CharacterListItem.module.css'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import { GAME_LOCATIONS } from '../../../location/data/Location.data'
import GoldDetail from '../../../../ui/gold/GoldDetail'

interface Props {
  entity: CharacterEntity
  onClick?: (entity: CharacterEntity) => void
}

export default function CharacterListItem(props: Props) {
  const { 
    entity,
    onClick
  } = props

  const [gold, setGold] = useState(getCharacterGold(entity?.id))

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if (event.type === 'character:gold:added') {
        setGold(getCharacterGold(entity.id))
      }
    })

    return unsub
  }, [])
  const currentLocation = GAME_LOCATIONS.find(l => l.id === entity.locationId)
  const className = GAME_CHARACTER_CLASSES[entity?.classId as CharacterClassId]?.name
  const onClickFn = !onClick ? undefined : () => {onClick?.(entity)}
  return (
    <div className={styles.wrapper} >
      <div className={styles.title}>
        <div className={styles.name}>
          {entity.name}
        </div>
        <div className={styles.label}>
          Lv. {entity.level}
        </div>
        <div className={styles.label}>
          {className}
        </div>
        <div className={styles.label}>
          {currentLocation?.name}
        </div>
        <div className={styles.label}>
          <GoldDetail gold={gold} />
        </div>
        {onClickFn && <button className='button dark' onClick={onClickFn}>
          ...
        </button>}
      </div>

      <div className={styles.bars}>
        <div className={styles.bar}>
          <ProgressBar
            value={getProgress(entity.xp, entity.xpNextLevel)}
            max={entity.xpNextLevel}
            color='#a855f7'
            label='XP'
          />
        </div>

        <div className={styles.bar}>
          <ProgressBar
            value={getProgress(entity.hp, entity.hpMax)}
            max={entity.hpMax}
            color='#ef4444'
            label='HP'
          />
        </div>

        <div className={styles.bar}>
          <ProgressBar
            value={getProgress(entity.mana, entity.manaMax)}
            max={entity.manaMax}
            color='#3b82f6'
            label='MP'
          />
        </div>

        <div className={styles.bar}>
          <ProgressBar
            value={getProgress(entity.stamina, entity.staminaMax)}
            max={entity.staminaMax}
            color='#22c55e'
            label='STAM'
          />
        </div>
      </div>
    </div>
  )
}