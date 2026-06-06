import type { AppMode } from '../../App'
import { RadialLayer } from './RadialLayer'

import './styles/radialMenu.css'
import type { RadialItem } from './RadialMenu.types'
import SideDrawer from '../sideDrawer/SideDrawer'
import { useState } from 'react'
import type { WorldLocation } from '../world/worldState'
import { RadialItemsList } from './RadialItemsList'

type Props = {
  topItems: RadialItem[]
  appMode: AppMode
  currentLocation: WorldLocation
}

export function RadialMenu({
  topItems,
  appMode,
  currentLocation
}: Props) {
  const [topItemsOpen, setTopItemsOpen] = useState(false)
  const [showChildItems, setShowChildItems] = useState(false)
  const [childItems, setChildItems] = useState<RadialItem[]>([])
  const [selectedTopItem, setSelectedTopItem] = useState<RadialItem | null>(null)
  
  if (appMode !== 'world') {
    return null
  }

  if (!topItemsOpen && !showChildItems) {
    return (
      <div className='radial-container'>
        <button className='radial-center' onClick={() => {
          setTopItemsOpen(true)
        }}>
          ☰
        </button>
      </div>
    )
  }

  if(topItemsOpen && !showChildItems && topItems?.length){
    return (
      <div className='radial-container'>
        <button className='radial-center' onClick={() => {setTopItemsOpen(false)}}>
          ✕
        </button>
        <RadialLayer 
          items={topItems}
          level={1}
          radius={60}
          setShowChildItems={(id: string) => {
            const topItem = topItems?.find(i => i.id === id)
            if(!topItem || !topItem?.childItems?.length){
              setTopItemsOpen(false)
            }

            setTopItemsOpen(false)
            setSelectedTopItem(topItem as RadialItem)
            setChildItems(topItem?.childItems ?? [])
            setShowChildItems(true)
          }}
          showChildItems={showChildItems}
        />
      </div>
    )
  }

  return (
    <SideDrawer 
      open={showChildItems} 
      position='bottom'
      onClose={() => {
        setShowChildItems(false)
        setSelectedTopItem(null)
      }}

    >
      <div className='radial-container-list'>
        <div radial-container-list-header>
          {selectedTopItem?.label}
          <button className='button' onClick={() => {setShowChildItems(false)}}>
            ✕
          </button>
        </div>

        {selectedTopItem?.component && selectedTopItem.component}
        {selectedTopItem?.childItems?.length && <RadialItemsList
            items={childItems}
            currentLocation={currentLocation}
          />
        }
      </div>
    </SideDrawer>
  )
}