import type { ReactNode } from 'react'
import type { WorldLocation } from '../../../game/world/worldState'
import './WorldWrapper.module.css'

type Props = {
  location: WorldLocation
  children: ReactNode
}

export default function WorldWrapper({
  location,
  children,
}: Props) {
  location = 'cave'
  return (
    <div className={`world-bg bg-${location}`}>
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