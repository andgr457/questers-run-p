import styles from './CharacterActionsSection.module.css'

interface Props {
  title: React.ReactNode
  locked: boolean
  children: React.ReactNode
}

export default function CharacterActionsSection(props: Props){
  const {
    title,
    children,
    locked
  } = props
  return <div className={!locked ? styles.wrapper : styles.wrapperLocked}>
    <div className={styles.title}>
      {title}
    </div>
    <div className={styles.children}>
      {children}
    </div>
  </div>
}