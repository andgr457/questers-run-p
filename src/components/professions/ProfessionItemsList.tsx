import { useCallback, useEffect, useState } from 'react'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Item } from '../../interfaces/items/Item.types'
import ProfessionItem from './ProfessionItem'
import { sleep } from '../../services/CommonServices'

interface ProfessionItemsListProps extends AppProperties {
  professionItems: Item[]
  professionStatCard: React.ReactNode
}

export default function ProfessionItemsList(props: ProfessionItemsListProps){
  const {
    professionItems,
    professionStatCard,
    handleDoProfessionItemComplete
  } = props
  const [canDo, setCanDo] = useState(true)
  const [timeProgress, setTimeProgress] = useState(0)

  const handleProfessionItemClicked = useCallback(async (itemId: string, amount: number, timeSeconds: number) => {
    setCanDo(false)
    for(let i = 0; i <= timeSeconds; i++){
      const progress = (i / timeSeconds) * 100
      setTimeProgress(progress)
      await sleep(1000)
    }
    reset()
    setCanDo(true)
    await handleDoProfessionItemComplete?.(itemId, amount)
  }, [handleDoProfessionItemComplete])

  const reset = () => {
    setTimeProgress(0)
  }

  return <div >
    <div>
      {professionStatCard}
    </div>
    <div>
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
            width: `${timeProgress}%`
          }}
        />
      </div>
    </div>
    <div className='profession-item-list'>
      {professionItems.map(i => {
        return <ProfessionItem {...props} professionItem={i} handleDoProfessionItem={handleProfessionItemClicked} canDo={canDo} />
      })}
    </div>
  </div>
}