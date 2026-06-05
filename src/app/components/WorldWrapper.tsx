import type { ReactNode } from 'react'
import '../styles/worldBackground.css'

export type WorldLocation =
  | 'plains'
  | 'town'
  | 'guild'
  | 'woods'
  | 'cave'
  | 'dungeon'

type Props = {
  location: WorldLocation
  children: ReactNode
}

export default function WorldWrapper({ location, children }: Props) {
  return (
    <div className={`world-bg bg-${location}`}>
      <div className="world-content">
        {children}
      </div>
    </div>
  )
}