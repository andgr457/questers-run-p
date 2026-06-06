import { useEffect, useRef, useState } from 'react'
import styles from './SmoothProgressBar.module.css'

type Props = {
  value: number // 0 - 1 (target)
}

export default function ProgressBar({ value }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const smoothRef = useRef(value)
  const [, force] = useState(0)

  useEffect(() => {
    let raf = 0

    const animate = () => {
      const current = smoothRef.current
      const diff = value - current

      // smoothing factor (lower = smoother but slower)
      smoothRef.current = current + diff * 0.12

      const el = ref.current
      if (el) {
        el.style.width = `${smoothRef.current * 100}%`
      }

      force(v => v + 1) // forces render loop cadence
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(raf)
  }, [value])

  return (
    <div className={styles.track}>
      <div
        ref={ref}
        className={styles.fill}
        style={{ width: `${value * 100}%` }} // fallback instant
      />
    </div>
  )
}