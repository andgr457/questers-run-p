import { useState } from 'react'
import styles from './NewCharacter.module.css'

type Props = {
  onCreated: (
    characterId: string, 
    characterName: string,
  ) => void
}

export default function NewCharacter({
  onCreated,
}: Props) {
  const [characterName, setCharacterName] = useState('')
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
          <p className={styles.label}>New Character</p>
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