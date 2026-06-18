import styles from './AlertMessage.module.css'

export type AlertMessageType = 'info' | 'error' | 'warn'
interface Props {
  closeButton: boolean
  onClose: () => void
  type: AlertMessageType
  title: string
  message: React.ReactNode
}
export default function AlertMessage(props: Props){
  const {
    type,
    title,
    message,
    onClose,
    closeButton = true
  } = props
  if(!message){
    return null
  }

  return <div className={`${styles.container} ${styles[type]}`}>
    <div className={styles.title}>
      {title}

      {closeButton && <button className={styles.closeButton} 
        onClick={onClose}>
        ✕
      </button>}
    </div>
    <div className={styles.message}>
      {message}
    </div>
  </div>
}