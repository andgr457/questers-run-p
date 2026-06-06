import { useState } from 'react'
import type { RadialItem } from './RadialMenu.types'
import { getRadialPosition } from './utils/radialGeometry'

type Props = {
  items: RadialItem[]
  radius: number
  level: number
  onFirstInteract?: () => void
}

export function RadialLayer({
  items,
  radius,
  level,
  onFirstInteract,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <>
      {items.map((item, i) => {
        const { x, y } = getRadialPosition(i, items.length, radius)

        const isExpanded = expanded === item.id

        return (
          <div
            key={item.id}
            className='radial-node'
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <div className={`radial-card level-${level}`}>
              <div className='radial-label'>
                {item.label} 
              </div>

              <div className='radial-actions'>
                
                {item.children?.length ? (
                  <button
                    className='expand-btn'
                    onClick={() =>
                      setExpanded(prev =>
                        prev === item.id ? null : item.id
                      )
                    }
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                ) : null}

                <button
                  className='travel-btn'
                  onClick={item.onTravel}
                >
                  GO
                </button>
              </div>
            </div>

            {isExpanded && item.children?.length ? (
              <RadialLayer
                items={item.children}
                radius={radius * 0.75}
                level={level + 1}
                onFirstInteract={onFirstInteract}
              />
            ) : null}
          </div>
        )
      })}
    </>
  )
}