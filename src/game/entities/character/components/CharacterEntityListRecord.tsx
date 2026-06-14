import type { CharacterEntity } from '../types/Character.types'
import styles from './CharacterEntityListRecord.module.css'
import ProgressBar from '../../../components/ui/ProgressBar'
import { GAME_CHARACTER_CLASSES } from '../../character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../character-class/types/CharacterClassEntity.types'
import { activityRuntimeService } from '../../../engine/ActivityRuntimeService'
import { gameClockService } from '../../../engine/GameClockService'
import { useState } from 'react'
import CharacterEntityActionsModal from './CharacterEntityActionsModal'

type Props = {
  character: CharacterEntity
}

export default function CharacterEntityListRecord({ character }: Props) {
  if (!character) return null
  const characterId = character.id
  
  const [showCharacterActions, setShowCharacterActions] = useState(false)

  const active = activityRuntimeService.getActive(characterId)
  const activity = active[0]
  const isBusy = !!activity

  const progress = activity
    ? activityRuntimeService.getProgress(characterId, activity.id)
    : 0

  const handleStartQuest = () => {
    if (isBusy) return

    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId,
      duration: 5000,
      startedAt: gameClockService.getNow(),
      blocking: true,
      blockingAll: false,
      status: 'active',
      type: 'questing',
    })
  }

  const handleStartHunt = () => {
    if (isBusy) return

    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId,
      duration: 10000,
      startedAt: gameClockService.getNow(),
      blocking: true,
      blockingAll: false,
      status: 'active',
      type: 'hunting',
    })
  }

  const className =
    GAME_CHARACTER_CLASSES[character.classId as CharacterClassId]?.name ?? 'Unknown'
  const characterStatus = activity ? activity.type.toUpperCase() : 'IDLE'

  return <>
    <CharacterEntityActionsModal 
      character={character}
      onClose={() => setShowCharacterActions(false)}
      open={showCharacterActions}
    />
    <div className={styles.record}
      onClick={() => {setShowCharacterActions(true)}}
    >
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <div className={styles.name}>{character.name}</div>
          <div className={styles.meta}>
            Lv {character.level} {className}
          </div>
        </div>
        <div style={{paddingLeft: '15px'}}>
          <ProgressBar
            value={progress * 100}
            max={100}
            color="gold"
            showValues={false}
            showLabel={false}
          />
        </div>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <ProgressBar label="HP" value={character.hp} max={character.hpMax} color="#ef4444" />
        <ProgressBar label="MP" value={character.mana} max={character.manaMax} color="#3b82f6" />
        <ProgressBar label="STA" value={character.stamina} max={character.staminaMax} color="#22c55e" />
        <ProgressBar label="XP" value={character.xp} max={character.xpNextLevel} color="#a855f7" />
      </div>

      <div className={styles.meta} style={{textAlign: 'center'}}>
        {characterStatus}
      </div>

      {/* ACTIONS */}
      <div className={styles.buttons}>
        {/* <button
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
        </button> */}
      </div>
    </div>
  </>
}