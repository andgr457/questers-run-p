import styles from './GuildIntroModal.module.css'

type Props = {
  onClose: () => void
}

export default function GuildIntroModal({ onClose }: Props) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>📜 New Quest Received</h2>

        <p>
          Welcome, adventurer.
        </p>

        <p>
          Your first objective has been assigned:
        </p>

        <div className={styles.questBox}>
          <strong>Quest:</strong> Join the Adventurers Guild
          <br />
          <span>
            Speak with the Guild Registrar to unlock quests and activities.
          </span>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose}>
            Continue
          </button>

          <button
            onClick={() => {
              alert('Navigate to Guild (next step will wire routing)')
              onClose()
            }}
          >
            Go to Guild
          </button>
        </div>
      </div>
    </div>
  )
}