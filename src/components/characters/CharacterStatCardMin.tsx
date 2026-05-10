import './CharacterStatCard.css'
import type { Stat } from '../../interfaces/characters/Character.types'

interface CharacterStatCardMinProps {
  statItem: Stat
  statType?: 'attribute' | 'profession'
  className?: string
}

export default function CharacterStatCardMin(
  props: CharacterStatCardMinProps
) {
  const {
    statItem,
    statType = 'attribute',
    className = ''
  } = props

  if (!statItem) {
    return null
  }
  
  return (
    <div
      className={`
        character-stat-card 
        ${className}
      `}
    >
      {/* HEADER */}

      <div className='' style={{textAlign: 'center'}}>
        <span
          className={`character-stat-card-name`}
        >
          {statItem.name} <span className='adv-g-highlight'>+{statItem.value}</span>
        </span>
      </div>
    </div>
  )
}