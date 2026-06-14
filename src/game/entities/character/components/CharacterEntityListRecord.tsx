import type { CharacterEntity } from '../types/Character.types'
import { gameEventBus } from '../../../engine/GameEventBus'
import styles from './CharacterEntityListRecord.module.css'
import ProgressBar from '../../../components/ui/ProgressBar'
import { GAME_CHARACTER_CLASSES } from '../../character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../character-class/types/CharacterClassEntity.types'
import { activityRuntimeService } from '../../../engine/ActivityRuntimeService'
import { gameClockService } from '../../../engine/GameClockService'
import { useEffect } from 'react'
import { useActivityProgress } from '../../../engine/hooks/useActivityProgress'

type Props = {
  character: CharacterEntity
}

export default function CharacterEntityListRecord({ character }: Props) {
  const characterId = character?.id
  useEffect(() => {
    if(!character) return

    const unsub = activityRuntimeService.subscribe(
      () => activityRuntimeService.getActive(characterId),
      () => {}
    )

    return unsub
  }, [character])

  const activities = activityRuntimeService.getAll(characterId) ?? []
  const active = activityRuntimeService.getActive(characterId) ?? []

  const isBusy = active?.length > 0

  const handleStartQuest = () => {
    if (isBusy) return

    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId: characterId,
      duration: 5000,
      startedAt: gameClockService.getNow(),
      blocking: true,
      blockingAll: false,
      status: 'active',
      type: 'quest',
    })
  }

  const handleStartHunt = () => {
    if (isBusy) return

    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId: characterId,
      duration: 10000,
      startedAt: gameClockService.getNow(),
      blocking: true,
      blockingAll: false,
      status: 'active',
      type: 'quest',
    })
  }

  const progress =
  isBusy
    ? activityRuntimeService.getProgress(
        characterId,
        active[0].id
      )
    : 0

  if(!character) return null

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
          label={isBusy ? active?.[0]?.type?.toUpperCase() : 'IDLE'}
          value={isBusy ? progress * 100 : 0}
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