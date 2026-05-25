import { useCallback, useState } from 'react'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Item } from '../../interfaces/items/Item.types'
import ProfessionItem from './ProfessionItem'
import { sleep } from '../../services/CommonServices'
import SpinnerOverlay from '../spinner/SpinnerOverlay'
import ScrollableShoppeList from '../shoppe/ShoppeListScrollable'

interface ProfessionItemsListProps extends AppProperties {
  professionItems: Item[]
}

export default function ProfessionItemsList(props: ProfessionItemsListProps){
  const {
    professionItems,
    handleProfessionItemComplete
  } = props
  const collectAmountSelections = [1, 5, 10, 15, 20, 50, 100]
  
  const [canDo, setCanDo] = useState(true)
  const [timeProgress, setTimeProgress] = useState(0)
  const [itemName, setItemName] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [itemNumber, setItemNumber] = useState(1)
  const [collectAmount, setCollectAmount] = useState(1)

  const handleProfessionItemClicked = useCallback(async (item: Item, amount: number) => {
    setCanDo(false)
    setItemName(item.name ?? '')
    const timeSeconds = item.profession?.timeInSeconds ?? 2
    const secondsWithAmount = timeSeconds * amount
    setTimeLeft(secondsWithAmount)
    let totalSecondsLeft = secondsWithAmount
    let currentSecond = 0
    let currentItemNumber = 1
    setItemNumber(currentItemNumber)
    setTimeProgress(0)
    for(let a = 0; a < amount; a++){
      for(let i = 0; i < timeSeconds; i++){
        totalSecondsLeft -= 1
        currentSecond += 1
        const progress = (currentSecond / secondsWithAmount ) * 100
        setTimeProgress(progress)
        setTimeLeft(totalSecondsLeft)
        await sleep(1000)
      }
      currentItemNumber += 1
      setItemNumber(currentItemNumber)
    }
    reset()
    setCanDo(true)
    handleProfessionItemComplete?.(item, amount)
  }, [professionItems])

  const reset = () => {
    setTimeProgress(0)
    setItemName('')
    setTimeLeft(0)
    setItemNumber(0)
  }

  return <div >
    <SpinnerOverlay loading={!canDo} blur={true}>
      <div className='dark-centered-section'>
        {collectAmountSelections.map(amt => {
          return <button className={`${amt === collectAmount ? 'yellow' : 'basic'}`} onClick={() => {setCollectAmount(amt)}}>
            <span style={{textTransform: 'lowercase'}}>x</span>{amt}
          </button>
        })}
      </div>
    </SpinnerOverlay>
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

    <ScrollableShoppeList>
      {professionItems.map(i => {
        return <ProfessionItem 
        {...props} 
          amount={collectAmount} 
          professionItem={i} 
          handleProfessionItemClicked={handleProfessionItemClicked} 
          canDo={canDo} 
        />
      })}
    </ScrollableShoppeList>
  </div>
}