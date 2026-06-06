import './styles/radialMenu.css'

export type RadialItem = {
  id: string
  label: string
  onClick: () => void
}

type Props = {
  open: boolean
  centerLabel?: string
  items: RadialItem[]
  onClose: () => void
  onExpand: () => void
}

export function RadialMenu({
  open,
  centerLabel = 'Menu',
  items,
  onClose,
  onExpand,
}: Props) {
  if (!open) {
    return (
      <button
        className='radial-center'
        onClick={onExpand}
      >
        {centerLabel}
      </button>
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

      {items.map((item, i) => {
        const angle =
          (i / items.length) * Math.PI * 2

        const radius = 90

        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        return (
          <button
            key={item.id}
            className='radial-item'
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}