import './styles/adventurersGuildBackground.css'

import type { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  timeOfDay:
    | 'morning'
    | 'afternoon'
    | 'evening'
    | 'night'
}

export function AdventurersGuildBackground({
  children,
  timeOfDay,
}: Props) {
  return (
    <div
      className={`
        guild-background
        ${timeOfDay}
      `}
    >
      <div className='guild-background-wall' />
      <div className='guild-background-floor' />

      <div className='guild-background-lighting' />

      {children}
    </div>
  )
}