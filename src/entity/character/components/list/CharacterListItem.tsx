import { useState, useEffect } from 'react'
import { getCharacterGold } from '../../utils/Character.utils'
import { eventBus } from '../../../../engine/event/EventBus'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import { GAME_CHARACTER_CLASSES } from '../../../character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../../character-class/types/CharacterClassEntity.types'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import { GAME_LOCATIONS } from '../../../location/data/Location.data'
import GoldDetail from '../../../../ui/gold/GoldDetail'

import styles from './CharacterListItem.module.css'

interface Props {
  entity: CharacterEntity
  showTutorial?: boolean
  onClick?: (entity: CharacterEntity) => void
}

export default function CharacterListItem(props: Props) {
  const {
    entity,
    onClick,
    showTutorial = false,
  } = props

  const [gold, setGold] = useState(getCharacterGold(entity.id))

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if (event.type === 'character:gold:added') {
        setGold(getCharacterGold(entity.id))
      }
    })

    return unsub
  }, [entity.id])

  const currentLocation = GAME_LOCATIONS.find(
    l => l.id === entity.locationId
  )

  const className =
    GAME_CHARACTER_CLASSES[
      entity.classId as CharacterClassId
    ]?.name

  const onClickFn = !onClick
    ? undefined
    : () => onClick(entity)

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.name}>
            {entity.name}
          </div>

          <div className={styles.className}>
            {className}
          </div>
        </div>

        <div className={styles.level}>
          Lv. {entity.level}
        </div>

        {onClickFn && (
          <div
            title={`Manage ${entity.name}`}
            className={`${styles.action} ${styles.rotate} ${
              showTutorial
                ? 'tutorial-hint pulse-tutorial'
                : ''
            }`}
            onClick={onClickFn}
          >
            ⚙
          </div>
        )}
      </div>

      <div className={styles.infoRow}>
        <div>{currentLocation?.name}</div>

        <div>
          {entity.isIdle ? 'Idle' : 'Busy'}
        </div>

        <div className={styles.gold}>
          <GoldDetail gold={gold} />
        </div>
      </div>

      <div className={styles.bars}>
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

        <ProgressBar
          value={getProgress(
            entity.hp,
            entity.hpMax
          )}
          max={entity.hpMax}
          color="#ef4444"
          label="HP"
          showValues={false}
        />

        <ProgressBar
          value={getProgress(
            entity.mana,
            entity.manaMax
          )}
          max={entity.manaMax}
          color="#3b82f6"
          label="MP"
          showValues={false}
        />

        <ProgressBar
          value={getProgress(
            entity.stamina,
            entity.staminaMax
          )}
          max={entity.staminaMax}
          color="#22c55e"
          label="STAM"
          showValues={false}
        />
      </div>
    </div>
  )
}