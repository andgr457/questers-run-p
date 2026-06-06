import { useState } from 'react'
import styles from './CharacterCreationScreen.module.css'

type Props = {
  accountId?: string
  onCreated: (
    characterId: string, 
    characterName: string,
    accountId: string,
    accountName: string,
  ) => void
}

export default function CharacterCreationScreen({
  onCreated,
  accountId
}: Props) {
  const [characterName, setCharacterName] = useState('')
  const [accountName, setAccountName] = useState('')
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Quester's Run
        </h1>

        <p className={styles.subtitle}>
          A new adventurer enters the wilds...
        </p>

        {!accountId && <div>
            <p className={styles.label}>New Account</p>
            <input
              className='input'
              placeholder="Enter account name"
              value={accountName}
              maxLength={64}
              onChange={(e) =>
                setAccountName(e.target.value)
              }
            />
          </div>
        }
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
              if (!accountId && !accountName?.trim()) return

              onCreated(
                crypto.randomUUID(), 
                characterName,
                accountId ?? crypto.randomUUID(),
                accountName
              )
            }}
          >
            {!accountId ? 'Begin Adventure' : 'Create Character'}
          </button>
        </div>
      </div>

    </div>
  )
}