import { useCallback, useState } from 'react'
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
    handleProfessionItemStart,
    handleDoProfessionItemComplete
  } = props
  const collectAmountSelections = [1, 5, 10, 15, 20, 50, 100]
  
  const [canDo, setCanDo] = useState(true)
  const [timeProgress, setTimeProgress] = useState(0)
  const [itemName, setItemName] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [collectAmount, setCollectAmount] = useState(1)

  const handleProfessionItemClicked = useCallback(async (itemId: string, amount: number, timeSeconds: number) => {
    setCanDo(false)
    await handleProfessionItemStart?.(itemId, amount)
    const item = professionItems.find(i => i.id === itemId)
    setItemName(item?.name ?? '')
    setTimeLeft(timeSeconds)
    for(let i = 0; i <= timeSeconds; i++){
      const progress = (i / timeSeconds) * 100
      setTimeProgress(progress)
      setTimeLeft(timeSeconds - i)
      await sleep(1000)
    }
    reset()
    setCanDo(true)
    await handleDoProfessionItemComplete?.(itemId, amount)
  }, [handleDoProfessionItemComplete])

  const reset = () => {
    setTimeProgress(0)
    setItemName('')
    setTimeLeft(0)
  }

  return <div >
    <div style={{background: 'var(--bg-dark)', color: 'var(--text)', letterSpacing: '1px'}}>
      {professionStatCard}
    </div>
    <div className='profession-amount-buttons' style={{background: 'var(--bg-dark-2)', color: 'var(--text)', letterSpacing: '1px', padding: '2px', display: 'flex', gap: '7px', justifyContent: 'center'}}>
      {collectAmountSelections.map(amt => {
        return <button className={`yellow${amt === collectAmount ? '-blink' : ''}`} onClick={() => {setCollectAmount(amt)}}>
          x{amt}
        </button>
      })}
    </div>
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
    <div className='profession-item-list'>
      {professionItems.map(i => {
        return <ProfessionItem amount={collectAmount} {...props} professionItem={i} handleDoProfessionItem={handleProfessionItemClicked} canDo={canDo} />
      })}
    </div>
  </div>
}