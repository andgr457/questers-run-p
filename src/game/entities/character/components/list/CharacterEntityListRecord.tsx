import type { CharacterEntity } from '../../types/Character.types'
import styles from './CharacterEntityListRecord.module.css'
import ProgressBar from '../../../../components/ui/ProgressBar'
import { GAME_CHARACTER_CLASSES } from '../../../character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../../character-class/types/CharacterClassEntity.types'
import { activityRuntimeService } from '../../../../engine/activity/ActivityRuntimeService'
import { useEffect, useState } from 'react'
import CharacterEntityActionsModal from '../actions/CharacterEntityActionsModal'

type Props = {
  character: CharacterEntity
  canShowActions: boolean
}

export default function CharacterEntityListRecord({
  character,
  canShowActions,
}: Props) {
  if (!character) return null

  const characterId = character.id
  const [showCharacterActions, setShowCharacterActions] = useState(false)
  const [, setTick] = useState(0)

  useEffect(() => {
    return activityRuntimeService.subscribe(() => {
      setTick(v => v + 1)
    })
  }, [])

  const activity = activityRuntimeService.getActive(characterId)?.[0]

  const progress = activity
    ? activityRuntimeService.getProgress(characterId, activity.id)
    : 0

  const className =
    GAME_CHARACTER_CLASSES[character.classId as CharacterClassId]?.name ?? 'Unknown'

  const characterStatus = activity ? activity.type.toUpperCase() : 'IDLE'

  return (
    <>
      <CharacterEntityActionsModal
        character={character}
        onClose={() => setShowCharacterActions(false)}
        open={showCharacterActions}
      />

      <div
        className={styles.record}
        onClick={() => setShowCharacterActions(!!canShowActions)}
      >
        <div className={styles.header}>
          <div>
            <div className={styles.name}>{character.name}</div>
            <div className={styles.meta}>
              Lv {character.level} {className}
            </div>
          </div>

          <div style={{ width: '35%' }}>
            <ProgressBar
              value={progress * 100}
              max={100}
              color="gold"
              showValues={false}
              showLabel={false}
            />
          </div>
          <div className={styles.meta} style={{color: 'gold'}}>
            {character.gold}g
          </div>
        </div>

        <div className={styles.stats}>
          <ProgressBar label="HP" value={character.hp} max={character.hpMax} color="#ef4444" />
          <ProgressBar label="MP" value={character.mana} max={character.manaMax} color="#3b82f6" />
          <ProgressBar label="STA" value={character.stamina} max={character.staminaMax} color="#22c55e" />
          <ProgressBar label="XP" value={character.xp} max={character.xpNextLevel} color="#a855f7" />
        </div>

        <div className={styles.meta} style={{ textAlign: 'center' }}>
          {characterStatus}
        </div>
      </div>
    </>
  )
}