import { useState, useEffect } from 'react'
import { eventBus } from '../../../../engine/event/EventBus'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import GoldDetail from '../../../../ui/gold/GoldDetail'

import styles from './CharacterListItem.module.css'
import type { CharacterEntity } from '../../../../entity/character/types/CharacterEntity.types'
import { getCharacterGold } from '../../../../entity/character/utils/Character.utils'
import { GAME_CHARACTER_CLASSES } from '../../../../entity/character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../../../entity/character-class/types/CharacterClassEntity.types'
import { getLocationById } from '../../../../entity/location/utils/Location.utils'

interface Props {
  character: CharacterEntity
  showActions?: boolean
}

export default function CharacterListItem(props: Props) {
  const {
    character,
    showActions = true
  } = props

  const [gold, setGold] = useState(getCharacterGold(character.id))

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if (event.type === 'character:gold:added') {
        setGold(getCharacterGold(character.id))
      }
    })

    return unsub
  }, [character.id])

  const currentLocation = getLocationById(
    character.locationId
  )

  const className =
    GAME_CHARACTER_CLASSES[
      character.classId as CharacterClassId
    ]?.name

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.name}>
            {character.name}
          </div>

          <div className={styles.className}>
            Lv. {character.level} {className}
          </div>
        </div>
        {showActions && (
          <div>
            <button className='action button'
              onClick={() => {
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'character:manage',
                  meta: {
                    characterId: character.id
                  }
                })
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'world:mode:change',
                  meta: {
                    worldMode: 'character_quest'
                  }
                })
              }}
            >
              Quest
            </button>
            <button className='action button'>
              Hunt
            </button>
            <button className='action button'>
              Profession
            </button>
          </div>          
        )}
      </div>
      
      <div className={styles.infoRow}>

        <div>
          {character.isIdle ? 'Idle' : 'Busy'}
        </div>

        <div>
          {currentLocation?.name}
        </div>

        <div className={styles.gold}>
          <GoldDetail gold={gold} />
        </div>
      </div>

      <div className={styles.bars}>
        <ProgressBar
          value={getProgress(
            character.xp,
            character.xpNextLevel
          )}
          max={character.xpNextLevel}
          color="#a855f7"
          label="XP"
          showValues={false}
        />

        <ProgressBar
          value={getProgress(
            character.hp,
            character.hpMax
          )}
          max={character.hpMax}
          color="#ef4444"
          label="HP"
          showValues={false}
        />

        <ProgressBar
          value={getProgress(
            character.mana,
            character.manaMax
          )}
          max={character.manaMax}
          color="#3b82f6"
          label="MP"
          showValues={false}
        />

        <ProgressBar
          value={getProgress(
            character.stamina,
            character.staminaMax
          )}
          max={character.staminaMax}
          color="#22c55e"
          label="STAM"
          showValues={false}
        />
      </div>
    </div>
  )
}