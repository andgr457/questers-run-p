import { useCallback, useState } from 'react'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Item } from '../../interfaces/items/Item.types'
import ProfessionItem from './ProfessionItem'
import { sleep } from '../../services/CommonServices'

interface ProfessionItemsListProps extends AppProperties {
  professionItems: Item[]
}

export default function ProfessionItemsList(props: ProfessionItemsListProps){
  const {
    professionItems,
    handleDoProfessionItemComplete
  } = props
  const collectAmountSelections = [1, 5, 10, 15, 20, 50, 100]
  
  const [canDo, setCanDo] = useState(true)
  const [timeProgress, setTimeProgress] = useState(0)
  const [itemName, setItemName] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [itemNumber, setItemNumber] = useState(1)
  const [collectAmount, setCollectAmount] = useState(1)

  const handleProfessionItemClicked = useCallback(async (itemId: string, amount: number, timeSeconds: number) => {
    setCanDo(false)
    const item = professionItems.find(i => i.id === itemId)
    setItemName(item?.name ?? '')
    const secondsAmount = timeSeconds * amount
    setTimeLeft(secondsAmount)
    let totalSecondsLeft = secondsAmount
    let currentSecond = 0
    let currentItemNumber = 1
    setItemNumber(currentItemNumber)
    setTimeProgress(0)
    for(let a = 0; a < amount; a++){
      for(let i = 0; i < timeSeconds; i++){
        totalSecondsLeft -= 1
        currentSecond += 1
        const progress = (currentSecond / secondsAmount ) * 100
        console.log(progress)
        setTimeProgress(progress)
        setTimeLeft(totalSecondsLeft)
        await sleep(1000)
      }
      currentItemNumber += 1
      setItemNumber(currentItemNumber)
      await handleDoProfessionItemComplete?.(itemId, 1)
    }
    reset()
    setCanDo(true)
  }, [handleDoProfessionItemComplete, professionItems])

  const reset = () => {
    setTimeProgress(0)
    setItemName('')
    setTimeLeft(0)
    setItemNumber(0)
  }

  const profession = window.location.href.replace(window.location.origin, '').split('/').pop()

  return <div >
    <div className='dark-centered-section'>
      <div>
        {profession?.toUpperCase()}
      </div>
    </div>
    <div className='dark-centered-section'>
      {collectAmountSelections.map(amt => {
        return <button className={`${amt === collectAmount ? 'yellow' : 'basic'}`} onClick={() => {setCollectAmount(amt)}}>
          <span style={{textTransform: 'lowercase'}}>x</span>{amt}
        </button>
      })}
    </div>
    <div className='dark-centered-section'>
      <div style={{width: '90%', textAlign: 'center'}}>
        <span className="" style={{fontSize: '0.75em'}}>
          {!canDo && <div>
            <div>
              {itemNumber}/{collectAmount} <span style={{color: 'gold'}}>{itemName}</span>
            </div> 
            <div>
              <span style={{color: 'gold'}}>{timeLeft}</span> second(s) left.
            </div>
          </div>}
          {canDo && <div>
            <div>
              Select an item to start <span style={{color: 'gold'}}>{professionItems?.[0]?.profession?.type}</span>...
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
    <div className='item-list'>
      {professionItems.map(i => {
        return <ProfessionItem amount={collectAmount} {...props} professionItem={i} handleDoProfessionItem={handleProfessionItemClicked} canDo={canDo} />
      })}
    </div>
  </div>
}