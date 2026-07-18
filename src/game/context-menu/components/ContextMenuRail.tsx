import ContextMenuButton from './ContextMenuButton'

import type { ContextMenuAction } from '../types/ContextMenuAction.types'

import styles from './ContextMenuRail.module.css'
import { useEffect, useState } from 'react'
import { eventBus } from '../../../engine/event/EventBus'

interface Props {
  side: 'left' | 'right'
  actions: ContextMenuAction[]
}

export default function ContextMenuRail(props: Props) {
  const { side, actions } = props

  const [show, setShow] = useState(false)


  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'transition:start'){
        setShow(false)
      } else if(event.type === 'transition:stop'){
        setShow(true)
      }
    })
    return unsub
  })

  return (
    <div
      className={`
        ${styles.rail}
        ${side === 'left' ? styles.left : styles.right}
        ${show ? styles.show : ''}
      `}
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