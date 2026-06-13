import type { CharacterEntity } from '../types/Character.types'
import { gameEventBus } from '../../../engine/GameEventBus'
import styles from './CharacterEntityListRecord.module.css'
import ProgressBar from '../../../components/ui/ProgressBar'
import { GAME_CHARACTER_CLASSES } from '../../character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../character-class/types/CharacterClassEntity.types'
import { activityRuntimeService } from '../../../engine/ActivityRuntimeService'
import { DateTime } from 'luxon'
import { useActivityProgress } from '../../../engine/hooks/useActivityProgress'
import { useActiveActivities } from '../../../engine/hooks/useActiveActivities'
import { gameClockService } from '../../../engine/GameClockService'

type Props = {
  character: CharacterEntity
}

export default function CharacterEntityListRecord({ character }: Props) {
  const activities = useActiveActivities(character.id)
  const activityProgress = useActivityProgress(character.id, activities?.[0]?.id)
  const isBusy = activities?.length > 0

  const handleStartQuest = () => {
    if (isBusy) return

    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId: character.id,
      duration: 5000,
      startedAt: gameClockService.getNow(),
      blocking: true,
      blockingAll: false,
      status: 'active',
      type: 'quest',
    })

    // gameEventBus.emit({
    //   type: 'activity:start',
    //   characterId: character.id,
    //   activityId: crypto.randomUUID(),
    //   activityType: 'quest',
    //   duration: 10000
    // })
  }

  const handleStartHunt = () => {
    if (isBusy) return

    gameEventBus.emit({
      type: 'activity:start',
      characterId: character.id,
      activityId: crypto.randomUUID(),
      activityType: 'hunt',
    })
  }


  return (
    <div className={styles.record}>

      <div>
        <div className={styles.name}>{character.name}</div>
        <div className={styles.meta}>
          Lv {character.level} {GAME_CHARACTER_CLASSES[character.classId as CharacterClassId].name}
        </div>
      </div>

      <div className={styles.stats}>
        <ProgressBar
          label="HP"
          value={character.hp}
          max={character.hpMax}
          color="#ef4444"
        />

        <ProgressBar
          label="MP"
          value={character.mana}
          max={character.manaMax}
          color="#3b82f6"
        />

        <ProgressBar
          label="STA"
          value={character.stamina}
          max={character.staminaMax}
          color="#22c55e"
        />

      </div>
      <div className={styles.stats}>
        <ProgressBar
          label="XP"
          value={character.xp}
          max={character.xpNextLevel}
          color="#a855f7"
        />
        <ProgressBar
          label={isBusy ? activities?.[0]?.type?.toUpperCase() : 'IDLE'}
          value={isBusy ? activityProgress?.progress : 0}
          max={100}
          color="gold"
        />
      </div>
      <div className={styles.buttons}>
        <button
          className="button-basic dark"
          onClick={handleStartQuest}
          disabled={isBusy}
        >
          Quest
        </button>

        <button
          className="button-basic dark"
          onClick={handleStartHunt}
          disabled={isBusy}
        >
          Hunt
        </button>
      </div>
    </div>
  )
}