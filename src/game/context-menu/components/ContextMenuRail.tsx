import ContextMenuButton from './ContextMenuButton'

import type { ContextMenuAction } from '../types/ContextMenuAction.types'

import styles from './ContextMenuRail.module.css'

interface Props {
  side: 'left' | 'right'
  actions: ContextMenuAction[]
}

export default function ContextMenuRail(props: Props) {
  const { side, actions } = props

  if (actions.length === 0) {
    return null
  }

  return (
    <div
      className={`${styles.rail} ${
        side === 'left'
          ? styles.left
          : styles.right
      }`}
    >
      {actions.map(action => (
        <ContextMenuButton
          key={action.id}
          action={action}
        />
      ))}
    </div>
  )
}