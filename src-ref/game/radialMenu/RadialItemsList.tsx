import { findRoute } from '../world/worldRouting'
import type { WorldLocation } from '../world/worldState'
import type { RadialItem } from './RadialMenu.types'

type Props = {
  items: RadialItem[]
  currentLocation: WorldLocation
}

export function RadialItemsList({
  items,
  currentLocation
}: Props) {
  return (
    <>
      {items.map((item, i) => {
        return (
          <div
            key={item.id}
            className=''
          >
            <div className='radial-list-item-header'>
              <div className='radial-list-item-label'>
                {item.label} 
              </div>

              <div className='radial-actions'>
                <button
                  className='travel-btn'
                  onClick={item.onTravel}
                >
                  GO
                </button>
              </div>
            </div>

            {item.childItems?.length && <div className='radial-list-item-children'>
              
              {item.childItems.map(i => {
                return <div className='radial-list-item-child'>
                  <div className='radial-list-item-header'>
                    <div className='radial-list-item-label'>
                      {i.label} from {currentLocation?.toUpperCase()} to {i.label} 
                    </div>
                    <div className='radial-actions'>
                      <button
                        className='travel-btn'
                        onClick={i.onTravel}
                      >
                        GO
                      </button>
                    </div>
                  </div>
                </div>
              })}
            </div>}
          </div>
        )
      })}
    </>
  )
}