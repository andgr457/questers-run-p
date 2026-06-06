import type { AppMode } from '../../App'
import { RadialLayer } from './RadialLayer'

import './styles/radialMenu.css'
import type { RadialItem } from './RadialMenu.types'

type Props = {
  open: boolean
  centerLabel?: string
  items: RadialItem[]
  appMode: AppMode
  onClose: () => void
  onOpen: () => void
  expanded: boolean
}

export function RadialMenu({
  open,
  centerLabel = 'WORLD',
  items,
  appMode,
  onClose,
  onOpen,
  expanded,
}: Props) {
  if (appMode !== 'world') {
    return null
  }

  if (!open) {
    return (
      <div className='radial-container'>
        <button className='radial-center' onClick={onOpen}>
          {centerLabel}
        </button>
      </div>
    )
  }

  return (
    <div
      className={`radial-container ${
        expanded ? 'is-expanded' : ''
      }`}
    >
      <button className='radial-center' onClick={onClose}>
        ✕
      </button>

      <RadialLayer
        items={items}
        radius={expanded ? 140 : 100}
        level={1}
      />
    </div>
  )
}