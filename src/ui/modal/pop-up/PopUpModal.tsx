import styles from './PopUpModal.module.css'

interface Props {
  show: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function PopUpModal(props: Props){
  const {
    onClose,
    show,
    children
  } = props
  return (
    <div 
      className={`${styles.backdrop} ${show ? styles.show : ''}`}
      onClick={() => {
        onClose()
      }}  
    >
      <div className={styles.layout}>
        {children}
      </div>
    </div>
  )
}