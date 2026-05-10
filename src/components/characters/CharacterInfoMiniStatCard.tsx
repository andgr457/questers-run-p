import './CharacterStatCard.css'
import type { Stat } from '../../interfaces/characters/Character.types'

interface CharacterInfoMiniStatCardProps {
  statItem: Stat
  statType?: 'attribute' | 'profession'
  className?: string
}

export default function CharacterInfoMiniStatCard(props: CharacterInfoMiniStatCardProps) {
  const {
    statItem,
    statType = 'attribute',
  } = props

  if (!statItem) return null

  const isResourceStat = ['HP', 'MP', 'STAM'].includes(statItem.name)

  const currentValue = isResourceStat
    ? statItem.value ?? 0
    : statItem.xp ?? 0

  const maxValue = isResourceStat
    ? statItem.max ?? 0
    : statItem.nextLevelXP ?? 0

  const progress =
    maxValue > 0 ? Math.min(100, (currentValue / maxValue) * 100) : 0

  return (
    <div className="character-stat-chip" title={`${statItem.name}`}>
      <span className="chip-name">{statItem.name}</span>

      <span className="chip-values">
        {currentValue.toLocaleString()}/{maxValue.toLocaleString()}
      </span>
      <div
        className={`
          character-stat-card-bar
          ${'attribute-bar'}
        `}
      >
        <div
          className={`
            character-stat-card-fill
            ${'attribute-fill'}
          `}
          style={{
            width: `${progress}%`
          }}
        />
      </div>
    </div>
  )
}