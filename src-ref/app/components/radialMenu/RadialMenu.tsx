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
  onClick: () => void
}

export function RadialMenu({
  open,
  centerLabel = 'Menu',
  items,
  onClose,
  onClick,
  appMode,
}: Props) {
  if (appMode !== 'world') {
    return null
  }

  if (!open) {
    return (
      <div className='radial-container'>
        <button
          className='radial-center'
          onClick={onClick}
        >
          {centerLabel}
        </button>
      </div>
    )
  }

  return (
    <div className='radial-container'>
      <button
        className='radial-center'
        onClick={onClose}
      >
        ✕
      </button>

      <RadialLayer
        items={items}
        radius={100}
        level={1}
      />
    </div>
  )
}