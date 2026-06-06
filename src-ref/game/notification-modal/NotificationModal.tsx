import type { ReactNode } from 'react'
import styles from './NotificationModal.module.css'

type Props = {
  title: ReactNode
  content: ReactNode
  actions: ReactNode
}

export default function NotificationModal({ 
  title,
  content,
  actions
}: Props) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>{title}</h2>

        {content}

        <div className={styles.actions}>
          {actions}
        </div>
      </div>
    </div>
  )
}