import { useEffect } from 'react'
import styles from './SideDrawer.module.css'

type Position = 'left' | 'right' | 'top' | 'bottom'

type Props = {
  open: boolean
  position?: Position
  onClose?: () => void
  children: React.ReactNode
}

export default function SideDrawer({
  open,
  position = 'right',
  onClose,
  children,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }

    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <div
      className={[
        styles.overlay,
        open ? styles.open : '',
      ].join(' ')}
      onClick={onClose}
    >
      <div
        className={[
          styles.drawer,
          styles[position],
          open ? styles.enter : styles.exit,
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}