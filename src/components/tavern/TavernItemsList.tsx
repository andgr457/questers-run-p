import { useCallback, useState } from 'react'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import { sleep } from '../../services/CommonServices'
import type { TavernListItem } from '../../interfaces/tavern/Tavern.types'
import TavernItem from './TavernItem'
import ScrollableShoppeList from '../shoppe/ShoppeListScrollable'

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
    <div className='dark-centered-section'>
      <div style={{width: '90%', textAlign: 'center'}}>
        <span className="" style={{fontSize: '0.75em'}}>
          {!canDo && <div>
            <div>
            <span style={{color: 'gold'}}>{itemName}</span>
            </div> 
            <div>
              <span style={{color: 'gold'}}>{timeLeft}</span> second(s) left.
            </div>
          </div>}
          {canDo && <div>
            <div>
              Welcome adventurer!
            </div> 
            <div>
              ...
            </div>
          </div>}
        </span>
        <div
          className={`
            character-stat-card-bar
            ${'attribute-bar'}
          `}
          style={{width: ''}}
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
    </div>
    <ScrollableShoppeList>
      {tavernItems.map(i => {
        return <TavernItem {...props} tavernItem={i} canDo={canDo} handleTavernItemClicked={handleTavernItemClicked}  />
      })}
    </ScrollableShoppeList>
  </div>
}