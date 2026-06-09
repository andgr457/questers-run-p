import { useMemo, useState } from 'react'

import styles from './CharacterEntityCreate.module.css'

import { GAME_CLASSES } from '../../character-class/data/CharacterClassEntity.data'

import type { CharacterEntity } from '../types/Character.types'
import GameModal from '../../../components/modals/GameModal'
import type { PlayerEntity } from '../../player/types/PlayerEntity.types'

type Props = {
  playerId: string
  onCreated: (
    character: CharacterEntity,
    player?: PlayerEntity
  ) => void
  onCancelled: () => void
}

export default function CharacterEntityCreate({
  onCreated,
  onCancelled,
  playerId
}: Props) {
  const [characterName, setCharacterName] =
    useState('')

  const [characterClassId, setCharacterClassId] =
    useState('')

  const characterClass = useMemo(() => {
    if (!characterClassId) return null

    return GAME_CLASSES.find(
      gc => gc.id === characterClassId
    )
  }, [characterClassId])

  const handleCreateCharacter = () => {
    if (!characterName.trim()) return

    if (!characterClass) return

    let player: PlayerEntity | undefined = undefined
    if(!playerId){
      player = {
        id: crypto.randomUUID(),
        characterTokens: 0,
        gold: 0,
        level: 1,
        xp: 0,
        xpNextLevel: 100
      }
    }

    const character: CharacterEntity = {
      id: crypto.randomUUID(),
      playerId: playerId ?? player?.id,

      name: characterName.trim(),

      classId: characterClass.id,

      xp: 0,
      xpNextLevel: 100,
      level: 1,

      hp: 100,
      hpMax: 100,

      mana: 100,
      manaMax: 100,

      stamina: 100,
      staminaMax: 100,

      strength: 1 + characterClass.strength,
      intellect: 1 + characterClass.intellect,
      agility: 1 + characterClass.agility,
    }

    onCreated(character, player)
  }
  const canClose = typeof playerId !== 'undefined'
  return (
    <GameModal
      backdropHides={canClose}
      isOpen={true}
      onClose={onCancelled}
      title='New Character'
      closeButton={canClose}
    >
      <div className={styles.card}>
        {/* <h1 className={styles.title}>
          New Character
        </h1> */}
        <span>{playerId}</span>
        <p className={styles.subtitle}>
          It is time that a new adventurer
          joins the fray... Who will it be?
        </p>

        <div>
          <input
            className="input"
            placeholder="Enter character name"
            value={characterName}
            maxLength={64}
            onChange={e =>
              setCharacterName(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <select
            className="select"
            value={characterClassId}
            onChange={e =>
              setCharacterClassId(
                e.target.value
              )
            }
          >
            <option value="">
              Select Class
            </option>

            {GAME_CLASSES.map(cc => (
              <option
                key={cc.id}
                value={cc.id}
              >
                {cc.name}
              </option>
            ))}
          </select>
        </div>

        {characterClass && (
          <div className={styles.subtitle}>
            <div>
              {characterClass.description}
            </div>

            <div>
              STR +{characterClass.strength}
              {' '}
              AGI +{characterClass.agility}
              {' '}
              INT +{characterClass.intellect}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            className="button-basic"
            onClick={
              handleCreateCharacter
            }
          >
            Create Character
          </button>
        </div>
      </div>
    </GameModal>
  )
}