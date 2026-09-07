import styles from './HeaderFancy.module.css'

interface Props {
  text: string
}

export default function HeaderFancy(props: Props) {
  return (
    <div className={styles.header}>
      <span className={styles.eyebrow}>{props.text}</span>
      <div className={styles.ornament} aria-hidden="true">
        <span />
        <span className={styles.diamond}>◆</span>
        <span />
      </div>
    </div>
  )
}