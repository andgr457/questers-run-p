import { useMemo, useState } from 'react'
import styles from './CharacterEntityCreate.module.css'

import { GAME_CLASSES, GAME_CHARACTER_CLASSES } from '../../../character-class/data/CharacterClassEntity.data'
import type { CharacterEntity } from '../../types/Character.types'
import type { PlayerEntity } from '../../../player/types/PlayerEntity.types'
import type { CharacterClassId } from '../../../character-class/types/CharacterClassEntity.types'

import CharacterClassEntityMiniList from '../../../character-class/components/CharacterClassEntityMiniList'
import AlertMessage from '../../../../components/ui/AlertMessage'
import GameModalFull from '../../../../components/modals/GameModalFull'

import { getCharacterClassCharactersAmountByPlayerLevel } from '../../../character-class/utils/CharacterClassEntity.utils'
import { notificationService } from '../../../../engine/notifications/NotificationService'

type Props = {
  player: PlayerEntity
  playerCharacters: CharacterEntity[]
  onCreated: (character: CharacterEntity, player?: PlayerEntity) => void
  onCancelled: () => void
}

export default function CharacterEntityCreate({
  onCreated,
  onCancelled,
  player,
  playerCharacters,
}: Props) {
  // =========================
  // FORM STATE
  // =========================
  const [characterName, setCharacterName] = useState('')
  const [characterClassId, setCharacterClassId] = useState('')

  const characterClass = useMemo(() => {
    if (!characterClassId) return null
    return GAME_CLASSES.find(gc => gc.id === characterClassId)
  }, [characterClassId])

  // =========================
  // PLAYER LIMITS / RULES
  // =========================
  const numberOfClassesByPlayerLevel =
    getCharacterClassCharactersAmountByPlayerLevel(player?.level)

  let allMaxedOut = true
  const playerCharacterClassAmounts: Record<string, number> = {}

  Object.getOwnPropertyNames(GAME_CHARACTER_CLASSES).forEach(cId => {
    const amount =
      playerCharacters?.filter(c => c.classId === cId as CharacterClassId).length ?? 0

    playerCharacterClassAmounts[cId] = amount

    if (amount < numberOfClassesByPlayerLevel) {
      allMaxedOut = false
    }
  })

  // =========================
  // CREATE CHARACTER
  // =========================
  const handleCreateCharacter = () => {
    const trimmedName = characterName.trim()

    if (!trimmedName) {
      notificationService.notify({
        text: <><strong>Name</strong> is required.</>,
        lifetime: 5000,
        type: 'error'
      })
      return
    }

    if (!characterClass) {
      notificationService.notify({
        text: <><strong>Class</strong> not selected.</>,
        lifetime: 5000,
        type: 'error'
      })
      return
    }

    const existing = playerCharacters?.find(
      c => c.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (existing) {
      const existingClass = GAME_CHARACTER_CLASSES[existing.classId as CharacterClassId]

      notificationService.notify({
        text: <>Name already exists. <strong>Lvl {existing.level} {existingClass.name}</strong></>,
        lifetime: 5000,
        type: 'error'
      })
      return
    }

    // =========================
    // NEW PLAYER (if needed)
    // =========================
    const newPlayer: PlayerEntity | undefined = !player
      ? {
          id: crypto.randomUUID(),
          characterTokens: 2,
          gold: 0,
          level: 1,
          xp: 0,
          xpNextLevel: 100
        }
      : undefined

    const playerId = newPlayer?.id ?? player.id

    // =========================
    // CREATE CHARACTER ENTITY
    // =========================
    const character: CharacterEntity = {
      id: crypto.randomUUID(),
      playerId,

      name: trimmedName,
      classId: characterClass.id,

      level: 1,
      xp: 0,
      xpNextLevel: 100,

      hp: 100,
      hpMax: 100,

      mana: 100,
      manaMax: 100,

      stamina: 100,
      staminaMax: 100,

      gold: 0,

      strength: 1 + characterClass.strength,
      intellect: 1 + characterClass.intellect,
      agility: 1 + characterClass.agility
    }

    onCreated(character, newPlayer)
  }

  // =========================
  // RENDER
  // =========================
  const playerTokens = player?.characterTokens ?? 2

  const text = !player ? (
    <>Welcome to <strong>Quester's Run</strong>, create your first character.</>
  ) : (
    <>A new adventurer awaits.</>
  )

  const canClose = !!player

  return (
    <GameModalFull
      backdropHides={canClose}
      isOpen
      onClose={onCancelled}
      title="New Character"
      closeButton={canClose}
    >
      <div className={styles.card}>
        
        {/* ERRORS */}
        {playerTokens <= 0 && (
          <AlertMessage
            title="No Tokens"
            message="Earn more tokens to create characters."
            onClose={() => {}}
            closeButton={false}
            type="error"
          />
        )}

        {playerTokens > 0 && allMaxedOut && (
          <AlertMessage
            title="Maxed Out"
            message="Level up to unlock more characters."
            onClose={() => {}}
            closeButton={false}
            type="error"
          />
        )}

        <div className={styles.subtitle}>
          {playerTokens} token(s) available
        </div>

        <div className={styles.subtitle}>
          {text}
        </div>

        {/* NAME INPUT */}
        <div className={styles.inputSection}>
          <div className={styles.inputSectionLabel}>Name</div>
          <input
            className="input"
            value={characterName}
            maxLength={64}
            onChange={e => setCharacterName(e.target.value)}
          />
        </div>

        {/* CLASS SELECTOR */}
        <div className={styles.inputSectionLabel}>CLASS</div>
        <CharacterClassEntityMiniList
          playerCharacterClassAmounts={playerCharacterClassAmounts}
          numberOfCharacterTokens={playerTokens}
          numberOfCharactersCreatable={numberOfClassesByPlayerLevel}
          currentCharacterClassId={characterClassId}
          setCharacterClassId={setCharacterClassId}
        />

        {/* ACTION */}
        {playerTokens > 0 && !allMaxedOut && (
          <button className="button-basic dark" onClick={handleCreateCharacter}>
            Create Character
          </button>
        )}
      </div>
    </GameModalFull>
  )
}