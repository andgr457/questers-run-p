import styles from './ProgressBar.module.css'

type Props = {
  value: number
  max: number
  color: string
  label?: string
  showLabel?: boolean
  invert?: boolean   // ONLY meaning-based flag now
}

export default function ProgressBar({
  value,
  max,
  color,
  label,
  showLabel = true,
  invert = false,
}: Props) {

  const safeValue = Number(value) || 0
  const safeMax = Number(max) || 1

  const raw = safeMax > 0 ? safeValue / safeMax : 0

  const percent = invert ? (1 - raw) : raw

  const percentText = Math.round(percent * 100)

  return (
    <div className={styles.wrapper}>

      {showLabel && (
        <span className={styles.label}>
          {label}
        </span>
      )}

      <div className={styles.bar}>

        <div
          className={styles.fill}
          style={{
            width: `${percent * 100}%`,
            backgroundColor: color,
          }}
        />

        <div className={styles.centerText}>
          {percentText}%
        </div>

      </div>

      <span className={styles.value}>
        {safeValue.toFixed(0)}/{safeMax}
      </span>

    </div>
  )
}