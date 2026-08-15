import { useEffect, useState } from 'react'
import styles from './FeatureBase.module.css'

interface Props {
  show: boolean
  onHidden?: () => void
  children: React.ReactNode
  durationMs?: number
}

export default function FeatureBase(props: Props){
  const {
    show,
    onHidden,
    children,
    durationMs = 250
  } = props

  const [mounted, setMounted] = useState(show)
  const [visible, setVisible] = useState(show)

  useEffect(() => {
    if(show){
      setMounted(true)

      requestAnimationFrame(() => {
        setVisible(true)
      })

      return
    }

    setVisible(false)
  }, [show])

  const handleTransitionEnd = () => {
    if(!visible){
      setMounted(false)
      onHidden?.()
    }
  }

  if(!mounted){
    return null
  }

  return (
    <div
      className={`${styles.wrapper} ${visible ? styles.show : styles.hide}`}
      style={{ '--duration': `${durationMs}ms` } as React.CSSProperties}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  )
}