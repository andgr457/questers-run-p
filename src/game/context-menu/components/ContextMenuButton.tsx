
import { ContextMenuIcon } from '../data/ContextMenuIcon.data'
import type { ContextMenuAction } from '../types/ContextMenuAction.types'

import styles from './ContextMenuRail.module.css'

interface Props {
  action: ContextMenuAction
}

export default function ContextMenuButton(props: Props) {
  const { action } = props

  let border = 'solid 1px '
  if(action.borderColor){
    border += action.borderColor
  } else {
    border += 'var(--text)'
  }
  return (
    <button
      className={styles.contextButton}
      onClick={action.onClick}
      title={action.label}
      style={{color: action.color ?? 'var(--text)', border: border}}
    >
      <span className={action.iconRotate ? styles.icon : styles.iconNoRotate}>
        {ContextMenuIcon[action.iconName]}
      </span>
    </button>
  )
}