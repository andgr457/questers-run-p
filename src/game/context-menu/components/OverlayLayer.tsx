import type { ReactNode } from 'react'

import styles from './OverlayLayer.module.css'

interface Props {
  children: ReactNode
}

export default function OverlayLayer(props: Props) {
  const { children } = props

  return (
    <div className={styles.layer}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}