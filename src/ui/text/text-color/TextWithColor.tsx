import styles from './TextWithColor.module.css'

interface Props {
  text: string
  color?: string
  pulse?: boolean
  className?: string
}

export default function TextWithColor({
  text,
  color = 'var(--gold)',
  pulse = false,
  className = '',
}: Props) {
  return (
    <span
      className={`${styles.text} ${pulse ? styles.pulse : styles.transition} ${className}`}
      style={{ '--target-color': color } as React.CSSProperties}
    >
      {text}
    </span>
  )
}