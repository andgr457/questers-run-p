import './CharacterStatCard.css'
import type { Stat } from '../../interfaces/characters/Character.types'

interface CharacterStatCardProps {
  statItem: Stat
  statType?: 'attribute' | 'profession'
  className?: string
}

export default function CharacterStatCard(
  props: CharacterStatCardProps
) {
  const {
    statItem,
    statType = 'attribute',
    className = ''
  } = props

  if (!statItem) {
    return null
  }

  const isResourceStat = ['HP', 'MP', 'STAM'].includes(statItem.name)

  let currentValue = statItem?.xp ?? 0
  let maxValue = statItem?.nextLevelXP ?? 0

  if (isResourceStat) {
    currentValue = statItem.value ?? 0
    maxValue = statItem.max ?? 0
  }

  const progress =
    maxValue > 0
      ? Math.min(100, (currentValue / maxValue) * 100)
      : 0

  const leftValue = Math.max(0, maxValue - currentValue)

  const isProfession = statType === 'profession'

  return (
    <div
      className={`
        character-stat-card
        ${isProfession ? 'profession-card' : 'attribute-card'}
        ${className}
      `}
      title={`${leftValue.toLocaleString()} left`}
    >
      {/* HEADER */}

      <div className='character-stat-card-header'>
        <span
          className={`
            character-stat-card-name
            ${isProfession ? 'profession-name' : 'attribute-name'}
          `}
        >
          {statItem.name}
        </span>

        {!isResourceStat && (
          <span
            className={`
              character-stat-card-level
              ${isProfession ? 'profession-level' : 'attribute-level'}
            `}
          >
            Lv. {statItem.level}
          </span>
        )}
      </div>

      {/* BAR */}

      <div
        className={`
          character-stat-card-bar
          ${isProfession ? 'profession-bar' : 'attribute-bar'}
        `}
      >
        <div
          className={`
            character-stat-card-fill
            ${isProfession ? 'profession-fill' : 'attribute-fill'}
          `}
          style={{
            width: `${progress}%`
          }}
        />
      </div>

      {/* FOOTER */}

      <div className='character-stat-card-footer'>
        <span>
          {currentValue.toLocaleString()}
        </span>

        <span>/</span>

        <span>
          {maxValue.toLocaleString()}
        </span>
      </div>
    </div>
  )
}