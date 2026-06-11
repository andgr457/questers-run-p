import type { CharacterEntity } from '../types/Character.types'
import { gameEventBus } from '../../../engine/GameEventBus'
import styles from './CharacterEntityListRecord.module.css'
import ProgressBar from '../../../components/ui/ProgressBar'
import { GAME_CHARACTER_CLASSES } from '../../character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../character-class/types/CharacterClassEntity.types'

type Props = {
  character: CharacterEntity
}

export default function CharacterEntityListRecord({ character }: Props) {

  const activity =
    gameEventBus.getActivity(character.id, 'quest')
    ?? gameEventBus.getActivity(character.id, 'hunt')

  const isBusy = activity?.status === 'active'
  const activityType = activity?.activityType

  const progress = activity?.progress ?? 0
  const progressPercent = Math.floor(progress * 100)

  const handleStartQuest = () => {
    if (isBusy) return

    gameEventBus.emit({
      type: 'activity:start',
      characterId: character.id,
      activityId: crypto.randomUUID(),
      activityType: 'quest',
    })
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

      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.name}>{character.name}</div>
        <div className={styles.meta}>
          Lv {character.level} {GAME_CHARACTER_CLASSES[character.classId as CharacterClassId].name}
        </div>
      </div>

      {/* MIDDLE */}
      <div className={styles.stats}>
        <ProgressBar
          label="XP"
          value={character.xp}
          max={character.xpNextLevel}
          color="#a855f7"
        />

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
      <div>
        <div className={styles.meta}>
          Status: <span style={{color: 'gold', textTransform: 'uppercase'}}>{isBusy ? activity?.activityType : 'Idle'}</span>
        </div>
        <div className={styles.progress}>
          <progress value={isBusy ? progress : 0} max={1} />
          <span>{isBusy ? progressPercent : 0}%</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>

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
    </div>
  )
}