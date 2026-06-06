import type { RadialItem } from './RadialMenu.types'
import { getRadialPosition, getRadialPositionVertical } from './utils/radialGeometry'

type Props = {
  items: RadialItem[]
  radius: number
  level: number
  setShowChildItems?: (id: string) => void
  showChildItems: boolean
}

export function RadialLayer({
  items,
  radius,
  level,
  showChildItems,
  setShowChildItems,
}: Props) {
  if(showChildItems){
    return null
  }
  return (
    <>
      {items.map((item, i) => {
        // const { x, y } = getRadialPosition(i, items.length, radius)
        const { x, y } = getRadialPositionVertical(i, 80, 80, 15)
        return (
          <div
            key={item.id}
            className='radial-node'
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            onClick={() => {setShowChildItems?.(item?.id)}}
          >
            <div className={`radial-card level-${level}`}>
              <div className='radial-label'>
                {item.label} 
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}