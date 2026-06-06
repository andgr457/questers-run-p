import { useState } from 'react'
import styles from './CharacterCreationScreen.module.css'

type Props = {
  onCreated: (id: string) => void
}

export default function CharacterCreationScreen({
  onCreated,
}: Props) {
  const [name, setName] = useState('')
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Quester's Run
        </h1>

        <p className={styles.subtitle}>
          A new adventurer enters the wilds...
        </p>

        <input
          className='input'
          placeholder="Enter character name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <div className={styles.actions}>
          <button
            className="button"
            onClick={() => {
              if (!name.trim()) return
              onCreated(crypto.randomUUID())

            }}
          >
            Begin Adventure
          </button>
        </div>
      </div>

    </div>
  )
}