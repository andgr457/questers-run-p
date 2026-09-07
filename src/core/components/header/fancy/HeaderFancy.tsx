import styles from './HeaderFancy.module.css'

interface Props {
  text: string
  type: 'main' | 'sub'
}

export default function HeaderFancy(props: Props) {
  return (
    <div className={`${styles.header} ${props.type === 'main' ? styles.main : styles.sub}`}>
      <span className={styles.eyebrow}>{props.text}</span>
      <div className={styles.ornament} aria-hidden="true">
        <span />
        <span className={styles.diamond}>◆</span>
        <span />
      </div>
    </div>
  )
}