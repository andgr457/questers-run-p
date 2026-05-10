import type { Stat } from '../../interfaces/characters/Character.types'

interface ProfessionStatProps {
  key: string
  className: string
  statItem: Stat
  statType: 'attribute' | 'profession'
}

export default function Stat(props: ProfessionStatProps){
  const {
    key,
    className,
    statItem,
  } = props
  const isHpMpOrStam = ['HP', 'MP', 'STAM'].includes(statItem.name)
  //@ts-ignore
  let progressValue = statItem?.xp ?? 0
  let progressMax = statItem?.nextLevelXP ?? 0
  let progressLeft = (progressMax - progressValue).toLocaleString()
  if(isHpMpOrStam){
    progressValue = statItem.value
    progressMax = statItem.max as number
    statItem.hint = `${progressLeft} left.`
  }

  //@ts-ignore
  progressValue = progressValue > 0 ? (progressValue / progressMax) * 100 : 0

  if (!statItem) {
    return null
  }
  return <div>

    return (
      <div
        key={key}
        className={`character-progress-card ${className}`}
        title={`${progressLeft} left`}
      >
        <div className='character-progress-header'>
          <span className='profession-name'>
            {statItem.name}
          </span>

          <span className='profession-level'>
            Lv. {statItem.level}
          </span>
        </div>

        <div className='character-progress-bar profession-bar'>
          <div
            className='character-progress-fill profession-fill'
            style={{ width: `${progressValue}%` }}
          />
        </div>

        <div className='character-progress-footer'>
          <span>
            {statItem?.xp?.toLocaleString()}
          </span>

          <span>/</span>

          <span>
            {statItem?.nextLevelXP?.toLocaleString()}
          </span>
        </div>
      </div>
    )
  </div>
}