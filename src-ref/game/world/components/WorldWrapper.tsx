import type { ReactNode } from 'react'
import './worldWrapper.css'
import type { WorldLocation } from '../types/WorldLocation.types'

type Props = {
  location: WorldLocation
  children: ReactNode
}

export default function WorldWrapper({
  location,
  children,
}: Props) {
  return (
    <div className={`world-bg bg-${location.type}`}>
      {/* atmospheric overlays */}
      <div className="world-fx">
        <div className="fog fog-1" />
        <div className="fog fog-2" />
        <div className="particles" />
        <div className="vignette" />
      </div>

      <div className="world-content">
        {children}
      </div>
    </div>
  )
}