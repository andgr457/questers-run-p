import { useState } from 'react'
import styles from './IntroNewAccount.module.css'

interface Props {
  onCreated: (accountId: string, accountName: string) => void
}

export default function NewAccount(props: Props) {
  const {
    onCreated
  } = props

  const [accountName, setAccountName] = useState('')
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Quester's Run
        </h1>

        <p className={styles.subtitle}>
          A new adventurer enters the wilds. Create a new account to begin...
        </p>

        <div>
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

        <div className={styles.actions}>
          <button
            className="button"
            onClick={() => {
              if (!accountName?.trim()) return

              onCreated(
                crypto.randomUUID(),
                accountName
              )
            }}
          >
            Create Account
          </button>
        </div>
      </div>

    </div>
  )
}