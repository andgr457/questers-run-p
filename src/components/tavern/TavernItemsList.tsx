import { useCallback, useEffect, useState } from 'react'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import { sleep } from '../../services/CommonServices'
import type { Stats } from '../../interfaces/characters/Character.types'
import type { TavernListItem } from '../../interfaces/tavern/Tavern.types'
import TavernItem from './TavernItem'

interface TavernItemsListProps extends AppProperties {
  tavernItems: TavernListItem[]
}

export default function TavernItemsList(props: TavernItemsListProps){
  const {
    tavernItems,
    handleTavernItemStart,
    handleTavernItemComplete
  } = props
  const [canDo, setCanDo] = useState(true)
  const [timeProgress, setTimeProgress] = useState(0)
  const [itemName, setItemName] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)

  const handleTavernItemClicked = useCallback(async (title: string, goldCost: number, percentChange: number, timeSeconds: number) => {
    setCanDo(false)
    await handleTavernItemStart?.(goldCost)
    setItemName(title ?? '')
    setTimeLeft(timeSeconds)
    for(let i = 0; i <= timeSeconds; i++){
      const progress = (i / timeSeconds) * 100
      setTimeProgress(progress)
      setTimeLeft(timeSeconds - i)
      await sleep(1000)
    }
    await handleTavernItemComplete?.(percentChange)
    reset()
    setCanDo(true)
  }, [])

  const reset = () => {
    setTimeProgress(0)
    setItemName('')
    setTimeLeft(0)
  }

  return <div >
    
    <div style={{background: 'var(--bg-dark-2)', color: 'var(--text)', letterSpacing: '1px', padding: '2px', display: 'flex', gap: '7px', justifyContent: 'center'}}>
      
      <span className="chip-name" style={{fontSize: '0.75em'}}>
        {!canDo && <div>
          {itemName} {timeLeft} second(s) left.  
        </div>}
        {canDo && <div>
        Waiting
      </div>}
      </span>
      <div
        className={`
          character-stat-card-bar
          ${'attribute-bar'}
        `}
        style={{width: '125px'}}
      >
        <div
          className={`
            character-stat-card-fill
            ${'attribute-fill'}
          `}
          style={{
            width: `${timeProgress}%`
          }}
        />
      </div>
    </div>
    <div className='tavern-item-list'>
      {tavernItems.map(i => {
        return <TavernItem {...props} tavernItem={i} canDo={canDo} handleTavernItemClicked={handleTavernItemClicked}  />
      })}
    </div>
  </div>
}