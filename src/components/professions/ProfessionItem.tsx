import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Stat } from '../../interfaces/characters/Character.types'
import type { Item } from '../../interfaces/items/Item.types'
import SpinnerOverlay from '../spinner/SpinnerOverlay'
import StateOverlay from '../state-overlay/StateOverlay'

interface ProfessionItemProps extends AppProperties {
  professionItem: Item
  canDo: boolean
  handleDoProfessionItem: (itemId: string, amount: number, timeSeconds: number) => Promise<void>
  amount: number
}

export default function ProfessionItem(props: ProfessionItemProps){
  const {
    professionItem,
    character,
    characterInventories,
    canDo,
    handleDoProfessionItem,
    amount
  } = props

  let characterAmount = 0
  for(const inv of characterInventories ?? []){
    const invTxns = inv.transactions.filter(t => t.itemId === professionItem.id)
    for(const txn of invTxns){
      characterAmount += txn.quantity
    }
  }
  
  //@ts-ignore
  const professionStat: Stat = character?.professions[professionItem.profession?.type]
  let seconds = 0
  let xp = 0
  let stamina = 0
  if(professionItem?.profession){
    seconds = amount * professionItem?.profession?.timeInSeconds
    xp = amount *  professionItem.profession.xp
    stamina = amount * professionItem.profession.stamina
  }
  const clickFn = canDo === true ? async () => {
    
    await handleDoProfessionItem(professionItem.id, amount, seconds as number ?? 5)
  } : () => {}

  let stateOverlayActive = false
  let stateOverlayText = ''
  let stateOverlaySubText = []
  if(typeof professionItem.profession?.levelRequired === 'number' && typeof professionStat?.level === 'number'){
    if(professionStat?.level < professionItem.profession?.levelRequired){
      stateOverlaySubText.push(`Level ${professionItem.profession?.levelRequired} Required`)
    }
  }
  if(typeof character?.stats?.stamina?.value === 'number' && typeof professionItem.profession?.stamina === 'number'){
    if(character?.stats?.stamina?.value < stamina){
      stateOverlaySubText.push(`${stamina} Stamina Required`)
    }
  }
  let subTexts
  if(stateOverlaySubText.length > 0){
    stateOverlayActive = true
    stateOverlayText = `LOCKED`
    subTexts = <div>
      {stateOverlaySubText.map(t => <div>{t}</div>)}
    </div>
  }
  
  const content = <div className='profession-item' onClick={clickFn}>
    <div className='profession-item-title'>
      x{amount} {professionItem.name}
    </div>
    <div className='profession-item-description'>
      {professionItem.description}
    </div>
    <div className='profession-item-info'>
      {professionItem.profession && professionItem.profession.levelRequired > 0 && <>
        <span className='adv-g-highlight'>Level {professionItem.profession.levelRequired}</span> required.
      </>}
      {professionItem.profession && !professionItem.profession.levelRequired && <>
        <span className='adv-g-highlight'>No level</span> required.
      </>}
    </div>
    <div className='profession-item-info'>
      <span className='adv-g-highlight'>{xp} <span style={{fontSize: 'smaller', color: 'gold'}}>{professionItem.profession && professionItem.profession.type.toUpperCase()}</span> XP</span> gained.
    </div>
    <div className='profession-item-info'>
      <span className='adv-g-highlight'>{stamina} Stamina</span> required.
    </div>
    <div className='profession-item-info'>
      <span className='adv-g-highlight'>{seconds?.toLocaleString() ?? 5} second(s)</span> required.
    </div>
    <div className='profession-item-info'>
      <span className='adv-g-highlight'>{characterAmount} total</span> in inventory.
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