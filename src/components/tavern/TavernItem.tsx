import { ITEM_CURRENCY_GOLD } from '../../data/items/currency/Item.Currency.data'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { TavernListItem } from '../../interfaces/tavern/Tavern.types'
import SpinnerOverlay from '../spinner/SpinnerOverlay'
import StateOverlay from '../state-overlay/StateOverlay'

interface TavernItemProps extends AppProperties {
  tavernItem: TavernListItem
  canDo: boolean
  handleTavernItemClicked: (title: string, goldCost: number, percentChange: number, timeSeconds: number) => void
}

export default function TavernItem(props: TavernItemProps){
  const {
    canDo,
    character,
    characterInventories,
    tavernItem,
    handleTavernItemClicked
  } = props

  let stateOverlayActive = false
  let stateOverlayText = ''
  let stateOverlaySubText = []
  const hpFull = character?.stats?.hp?.value === character?.stats.hp?.max
  const mpFull = character?.stats?.mp?.value === character?.stats.mp?.max
  const staminaFull = character?.stats?.stamina?.value === character?.stats.stamina?.max
  const currency = characterInventories?.find(i => i.title === 'Currency')
  
  let gold = 0
  let seconds = 0
  let reqGold = 0
  let percent = 0
  
  currency?.transactions?.forEach(txn => {
    if(txn.itemId === ITEM_CURRENCY_GOLD.id){
      gold += txn.quantity
    }
  })
  if(tavernItem.requirements && tavernItem?.rewards){
    if(typeof tavernItem.requirements?.gold === 'number'){
      reqGold = tavernItem.requirements.gold
      if(gold < reqGold){
        stateOverlaySubText.push(`${reqGold} Gold Required`)
      }
    }
    
    if(tavernItem.rewards?.statsModifyPercent){
      percent = tavernItem.rewards.statsModifyPercent
    }

    if(typeof tavernItem.requirements?.timeInSeconds === 'number'){
      seconds = tavernItem.requirements?.timeInSeconds
    }
  }
  if(hpFull && mpFull && staminaFull){
    stateOverlaySubText.push(`HP Full`)
    stateOverlaySubText.push(`MP Full`)
    stateOverlaySubText.push(`Stamina Full`)
  }


  let subTexts
  if(stateOverlaySubText.length > 0){
    stateOverlayActive = true
    stateOverlayText = `LOCKED`
    subTexts = <div>
      {stateOverlaySubText.map(t => <div>{t}</div>)}
    </div>
  }

    
  const clickFn = canDo === true ? async () => {
    
    await handleTavernItemClicked?.(tavernItem.title, reqGold, percent, seconds)
  } : () => {}

  
  const content = <div className='shoppe-item open'>
    <div className='shoppe-item-name'>
      {tavernItem.title}
    </div>
    <div className='shoppe-item-description'>
      {tavernItem.description}
    </div>
    <div className='shoppe-item-info-list' style={{justifyContent: 'center'}}>
      <div className='shoppe-item-info small'>
        <div>
          <span style={{color: 'gold'}}>{reqGold}</span>
        </div>
        <div style={{color: 'gold'}}>
          Gold
        </div>
        <div>
           Required
        </div>
      </div>

      <div className='shoppe-item-info small'>
        <div>
          <span style={{color: 'gold'}}>{seconds}</span>
        </div>
        <div>
          Second(s)
        </div>
      </div>

      <div className='shoppe-item-info small'>
        <div>
          <span style={{color: 'gold'}}>{percent}%</span>
        </div>
        <div>
          HP
        </div>
        <div>
          MP
        </div>
        <div>
          STAM
        </div>
      </div>
    </div>

    <div className="shoppe-item-bottom">
      <div className={`shoppe-item-info ${canDo === true ? 'add' : 'zero'}`} onClick={clickFn}>
        CONFIRM
      </div>
    </div>
  </div> 

  if(stateOverlayActive){
    return <StateOverlay active={stateOverlayActive} text={stateOverlayText} subText={subTexts}>
        {content} 
    </StateOverlay>
  } else {
    return <SpinnerOverlay loading={!canDo}>
        {content} 
      </SpinnerOverlay>  
  }
}