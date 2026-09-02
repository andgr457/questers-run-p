import { GAME_ICONS } from '../../data/Icons.data'
import Actions from '../form/Actions'
import styles from './DialogConfirm.module.css'

interface Props {
  title: string
  descriptions: string[]
  confirmText: string
  onConfirm: () => void
  cancelText: string
  onCancel: () => void
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export default function DialogConfirm(props: Props){
  const {
    descriptions,
    title = 'Confirmation Required',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    visible,
  } = props

  if(!visible){
    return null
  }
  return (
    <div
      className={`${styles.wrapper} ${visible ? styles.show : styles.hide}`}
      onClick={(e) => {
        onCancel()
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>
            {title}
          </div>
          <div 
            className={styles.close}
            onClick={(e) => {
              e.preventDefault()

              onCancel()
            }}
          >
            {GAME_ICONS.X}
          </div>
        </div>
        <div
          className={styles.body}
        >
          {descriptions.map(d => {
            return (
              <div
                key={crypto.randomUUID()}
                className={styles.description}
              >
                {d}
              </div>
            )
          })}
        </div>
        <Actions 
          actions={[
            {
              icon: '',
              inactive: false,
              inactiveText: '',
              onClick: () => {
                onConfirm()
              },
              text: confirmText,
              value: 'confirm_dialog_button'
            },
            {
              icon: '',
              inactive: false,
              inactiveText: '',
              onClick: () => {
                onCancel()
              },
              text: cancelText,
              value: 'cancel_dialog_button'
            },
          ]}
        />
      </div>
    </div>
  )
}
