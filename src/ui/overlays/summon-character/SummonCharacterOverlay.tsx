import { useEffect, useState } from 'react'
import styles from './SummonCharacterOverlay.module.css'

interface Props {
  active: boolean
  setActive: (value: boolean) => void
  waitMs: number
}

export default function SummonCharacterOverlay(props: Props) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if(props.active === false) return

    setShow(true)
    setTimeout(() => {
      setShow(false)
      setTimeout(() => {
        props.setActive(false)
      }, 500)
    }, props.waitMs ?? 1000)
  }, [props.active])

  if(!props.active){
    return null
  }
  return (
    <div className={`${styles.wrapper} ${show ? styles.show : ''}`}>
      <div className={styles.tunnel}>
        {Array.from({ length: 150 }).map((_, i) => (
          <span
            key={i}
            className={styles.star}
            style={
              {
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 2}s`,
                '--duration': `${0.6 + Math.random() * 0.9}s`
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}