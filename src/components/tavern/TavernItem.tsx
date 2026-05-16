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

  
  const content = <div className='tavern-item' onClick={clickFn}>
    <div className='tavern-item-title'>
      {tavernItem.title}
    </div>
    <div className='tavern-item-description'>
      {tavernItem.description}
    </div>
    <div className='tavern-item-info'>
      <span className='adv-g-highlight' style={{color: 'gold'}}>{reqGold} gold</span> required.
    </div>
    <div className='profession-item-info'>
      <span className='adv-g-highlight'>{seconds} second(s)</span> required.
    </div>
    <div className='tavern-item-info'>
      <span className='adv-g-highlight'>{percent}% HP MP STAM</span> gained.
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