import styles from './CharacterActionsSection.module.css'

interface Props {
  title: React.ReactNode
  children: React.ReactNode
}

export default function CharacterActionsSection(props: Props){
  const {
    title,
    children
  } = props
  return <div className={styles.wrapper}>
    <div className={styles.title}>
      {title}
    </div>
    <div className={styles.children}>
      {children}
    </div>
  </div>
}