import type { ReactNode } from 'react'

import type { HuntingEvent } from '../interfaces/HuntingEvent'

export function renderHuntingEvent(
  event: HuntingEvent
): ReactNode {
  switch (event.type) {
    case 'combat-start':
      return (
        <span>
          <span style={{ color: 'gold' }}>
            {event.characterName}
          </span>{' '}
          engaged a Lv. {event.mobLevel}{' '}
          <span style={{ color: 'gold' }}>
            {event.mobName}
          </span>.
        </span>
      )

    case 'character-hit':
      return (
        <span>
          <span style={{ color: 'gold' }}>
            {event.attackerName}
          </span>{' '}
          hit{' '}
          <span style={{ color: 'gold' }}>
            {event.defenderName}
          </span>{' '}
          for{' '}
          <span style={{ color: 'gold' }}>
            {event.damage}
          </span>
          .
        </span>
      )

    case 'mob-hit':
      return (
        <span>
          <span style={{ color: 'gold' }}>
            {event.attackerName}
          </span>{' '}
          hit{' '}
          <span style={{ color: 'gold' }}>
            {event.defenderName}
          </span>{' '}
          for{' '}
          <span style={{ color: 'gold' }}>
            {event.damage}
          </span>
          .
        </span>
      )

    case 'mob-defeated':
      return (
        <span>
          <span style={{ color: 'gold' }}>
            {event.defenderName}
          </span>{' '}
          defeated{' '}
          <span style={{ color: 'gold' }}>
            {event.mobName}
          </span>
          !
        </span>
      )

    case 'character-collapsed':
      return (
        <span>
          <span style={{ color: 'gold' }}>
            {event.characterName}
          </span>{' '}
          collapsed.
        </span>
      )

    case 'loot-drop':
      return (
        <span>
          Looted{' '}
          <span style={{ color: 'gold' }}>
            {event.amount} {event.itemName}
          </span>
          !
          <span>
            {' '}
            Rolled{' '}
            <span style={{ color: 'gold' }}>
              {(event.roll * 100).toFixed(1)}
            </span>{' '}
            /{' '}
            <span style={{ color: 'gold' }}>
              {event.chance * 100}%
            </span>
          </span>
        </span>
      )

    case 'loot-failed':
      return (
        <span style={{ color: 'gray' }}>
          {event.amount} {event.itemName}{' '}
          didn't drop.{' '}
          {(event.roll * 100).toFixed(1)} /{' '}
          {event.chance * 100}%
        </span>
      )

    case 'xp-gained':
      return (
        <span>
          Gained{' '}
          <span style={{ color: 'gold' }}>
            {event.xp} XP
          </span>
          !
        </span>
      )

    default:
      return null
  }
}