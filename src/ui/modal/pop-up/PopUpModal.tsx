import styles from './PopUpModal.module.css'

interface Props {
  show: boolean
  onClose: () => void
  title: React.ReactNode
  subTitle?: React.ReactNode
  children: React.ReactNode
}

export default function PopUpModal(props: Props){
  const {
    onClose,
    show,
    title,
    subTitle,
    children
  } = props
  return (
    <div 
      className={`${styles.backdrop} ${show ? styles.show : ''}`}
      onClick={() => {
        onClose()
      }}  
    >
      <div className={styles.layout} onClick={(e) => {
        e.stopPropagation() // does not close on click
      }}>
        <div className={styles.header}>
          <div>
            <div  className={styles.title}>
              {title}
            </div>
            {subTitle && (
              <div className={styles.subTitle}>
                {subTitle}
              </div>
            )}
          </div>
          <div className={styles.closeButton}>
            X
          </div>
        </div>

        <div className={styles.children}>
          {children}
        </div>
      </div>
    </div>
  )
}