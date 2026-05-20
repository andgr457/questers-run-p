import type { AppProperties } from '../../interfaces/AppProperties.types';
import type { Stat } from '../../interfaces/characters/Character.types';
import type { Item } from '../../interfaces/items/Item.types';
import { characterServiceGetItemAmount } from '../../services/Character.Service';
import type { ShoppeCartItem } from './ShoppeCart';

export interface ShoppeBuyItemSettings {
  item: Item
  canBuy: boolean
  totalBuy: number
  totalSell: number
  neededGold: number
}

interface ShoppeItemProps extends AppProperties {
  shoppeItem: ShoppeBuyItemSettings
  amount: number
  characterGold: number
  handleAddItemToCart: (itemId: string, transactionType: 'buy' | 'sell', amount: number) => void
  cartItems: ShoppeCartItem[]
}

export default function ShoppeItem(props: ShoppeItemProps){
  const {
    shoppeItem,
    amount,
    characterInventories,
    cartItems,
    handleAddItemToCart,
  } = props
  const relatedCartItem = cartItems.find(ci => ci.item.id === shoppeItem.item.id && ci.transactionType === 'sell')
  let sellCartAmount = relatedCartItem?.amount ?? 0

  const item = shoppeItem.item
  const characterItemAmount = characterServiceGetItemAmount(characterInventories ?? [], item.id)
  
  let youHaveTitle = `Inventory ${characterItemAmount}`
  if(sellCartAmount > 0){
    youHaveTitle += ` Cart ${sellCartAmount}`
  }

  let hasEffects = false
  if(item.stats){
    for(const propertyName of Object.getOwnPropertyNames(item.stats)){
      //@ts-ignore
      const stat: Stat = item.stats[propertyName]
      if(stat && stat.value > 0){
        hasEffects = true
        break
      }
    }
  }
  const content = <div className={`shoppe-item open`}>
    <div className='shoppe-item-name'>
      {item.name}
    </div>
    <div className='shoppe-item-description'>
      {item.description}
    </div>
    <div className='shopp-item-info-list'>
      <div className='shoppe-item-info'>
        Buy: <span style={{color: 'gold'}}>{shoppeItem.totalBuy.toLocaleString()}g</span>
      </div>
      <div className='shoppe-item-info' >
        Sell: <span style={{color: 'gold'}}>{shoppeItem.totalSell.toLocaleString()}g</span>
      </div>
      <div className='shoppe-item-info' >
        Need: <span style={{color: 'gold'}}>{shoppeItem.neededGold.toLocaleString()}g</span>
      </div>
      <div className='shoppe-item-info'>
        Inv: <span style={{color: 'gold'}}>{characterItemAmount - sellCartAmount}</span>
      </div>
      <div className='shoppe-item-info'>
        Cart: <span style={{color: 'gold'}}>{sellCartAmount}</span>
      </div>
    </div>
    {hasEffects === true && <div className='shoppe-item-sub-title'>
      Effects
    </div>}
    {hasEffects === true && <div className='shopp-item-info-list'>
      {item.stats && Object.getOwnPropertyNames(item.stats).map(propertyName => {
        //@ts-ignore
        const stat: Stat = item.stats[propertyName]
        if(stat.value === 0) return
        return <div className='shoppe-item-info'>
          {stat.name}: <span style={{color: 'gold'}}>{stat.value}</span>
        </div>
      })}
    </div>}

    <div className="shoppe-item-bottom">
      <div className='shoppe-item-info add' onClick={() => {shoppeItem.canBuy && handleAddItemToCart(shoppeItem.item.id, 'buy', amount)}}>
        BUY {shoppeItem.canBuy ? amount : 0}
      </div>
      <div className='shoppe-item-info add' onClick={() => {characterItemAmount >= amount && handleAddItemToCart(shoppeItem.item.id, 'sell', amount)}}>
        SELL {characterItemAmount >= amount ? amount : 0}
      </div>
    </div>
  </div>

  return content
}