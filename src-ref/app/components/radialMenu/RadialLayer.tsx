import { useState } from 'react'
import type { RadialItem } from './RadialMenu.types'

type Props = {
  items: RadialItem[]
  radius: number
  level: number
}

export function RadialLayer({
  items,
  radius,
  level,
}: Props) {
  const [hovered, setHovered] =
    useState<string | null>(null)

  return (
    <>
      {items.map((item, i) => {
        const angle =
          (i / items.length) * Math.PI * 2

        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        const isHovered =
          hovered === item.id

        return (
          <div
            key={item.id}
            className='radial-node'
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            onMouseEnter={() =>
              setHovered(item.id)
            }
            onMouseLeave={() =>
              setHovered(null)
            }
          >
            <button
              className={`radial-item level-${level}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>

            {isHovered &&
              item.children &&
              item.children.length > 0 && (
                <RadialLayer
                  items={item.children}
                  radius={60}
                  level={level + 1}
                />
              )}
          </div>
        )
      })}
    </>
  )
}