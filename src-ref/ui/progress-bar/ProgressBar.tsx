import styles from './ProgressBar.module.css'

type Props = {
  value: number // 0 - 1
}

export default function ProgressBar({ value }: Props) {
  const pct = Math.min(Math.max(value, 0), 1) * 100

  return (
    <div className={styles.track}>
      <div
        className={styles.fill}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}