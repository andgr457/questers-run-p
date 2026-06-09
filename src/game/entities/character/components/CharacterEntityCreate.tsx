import { useMemo, useState } from 'react'
import styles from './CharacterEntityCreate.module.css'
import { GAME_CLASSES } from '../../character-class/data/CharacterClassEntity.data'

type Props = {
  onCreated: (
    characterId: string, 
    classId: string,
  ) => void
}

export default function CharacterEntityCreate({
  onCreated,
}: Props) {
  const [characterName, setCharacterName] = useState('')
  const [characterClassId, setCharacterClassId] = useState('')

  const characterClass = useMemo(() => {
    if(!characterClassId) return ''
    return GAME_CLASSES.find(gc => gc.id === characterClassId)
  }, [characterClassId])

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          New Character
        </h1>

        <p className={styles.subtitle}>
          It is time that a new adventurer joins the fray... Who will it be?
        </p>

        <div>
          <input
            className='input'
            placeholder="Enter character name"
            value={characterName}
            maxLength={64}
            onChange={(e) =>
              setCharacterName(e.target.value)
            }
          />
        </div>
        <div style={{textAlign: 'center'}}>
          <select
            className='select'
            style={{ width: '90%', margin: '5px' }}
            onChange={e =>
              setCharacterClassId(e.target.id)
            }
          >
            <option value='' disabled>
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

        {characterClassId && characterClass && <div className={styles.subtitle}>
          <div>
            {characterClass.description}
          </div>
          <div>
            STR +{characterClass.strength}
            AGI +{characterClass.agility}
            INT +{characterClass.intellect}
          </div>
        </div>}

        <div className={styles.actions}>
          <button
            className="button"
            onClick={() => {
              if (!characterName?.trim()) return

              onCreated(
                crypto.randomUUID(), 
                characterName,
              )
            }}
          >
            Create Character
          </button>
        </div>
      </div>

    </div>
  )
}