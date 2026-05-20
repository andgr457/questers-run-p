import './CharacterStatCard.css'
import { type Stat } from '../../interfaces/characters/Character.types'

interface CharacterInfoMiniStatCardProps {
  statItem: Stat
  statType?: 'attribute' | 'profession'
  className?: string
  barWidth?: string
}

export default function CharacterInfoMiniStatCard(props: CharacterInfoMiniStatCardProps) {
  const {
    statItem,
    barWidth = '125px',
    className = 'attribute-fill'
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
      <div className="chip-name">
        <span style={{textTransform: 'uppercase', color: 'gold'}}>{statItem.name}</span>{isResourceStat === false ? <> Lv. {statItem.level}</> : null}
        {/* {isResourceStat === true ? '' : <>Lvl {statItem.level}</>}<br/>{statItem.name} */}
      </div>
      <div className='character-stat-chip-bottom'>
        <div className='chip-left'>
          <div className="chip-values">
            {currentValue.toFixed()}/{maxValue.toFixed()} 
          </div>
          <div className="chip-values">
            {progress.toFixed()}%&nbsp;
          </div>
        </div>
        <div className='chip-right'>
          <div
            className={`
              character-stat-card-bar
              ${'attribute-bar'}
            `}
            style={{width: barWidth}}
          >
            <div
              className={`
                character-stat-card-fill
                ${className}
              `}
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}