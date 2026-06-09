import { useMemo, useState } from 'react'

import styles from './CharacterEntityCreate.module.css'

import { GAME_CLASSES } from '../../character-class/data/CharacterClassEntity.data'

import type { CharacterEntity } from '../types/Character.types'

type Props = {
  onCreated: (
    character: CharacterEntity
  ) => void
}

export default function CharacterEntityCreateComp({
  onCreated,
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

    const character: CharacterEntity = {
      id: crypto.randomUUID(),

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

      strength: characterClass.strength,
      intellect: characterClass.intellect,
      agility: characterClass.agility,
    }

    onCreated(character)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          New Character
        </h1>

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

        <div style={{ textAlign: 'center' }}>
          <select
            className="select"
            style={{
              width: '90%',
              margin: '5px',
            }}
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
            className="button"
            onClick={
              handleCreateCharacter
            }
          >
            Create Character
          </button>
        </div>
      </div>
    </div>
  )
}