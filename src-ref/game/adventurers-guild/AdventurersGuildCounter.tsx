import './styles/adventurersGuildCounter.css'

import type { PropsWithChildren } from 'react'

export function AdventurersGuildCounter({
  children,
}: PropsWithChildren) {
  return (
    <div className='guild-counter-wrapper'>
      <div className='guild-counter-back-wall' />

      <div className='guild-counter-area'>
        {children}
      </div>

      <div className='guild-counter'>
        <div className='guild-counter-top' />
      </div>
    </div>
  )
}