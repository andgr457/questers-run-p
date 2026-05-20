import type { AppProperties } from '../../interfaces/AppProperties.types';
import type { Stat } from '../../interfaces/characters/Character.types';
import type { Item } from '../../interfaces/items/Item.types';
import { characterServiceGetItemAmount } from '../../services/Character.Service';
import type { ShoppeCartItem } from './ShoppeCart';

export interface ShoppeBuyItemSettings {
  item: Item
  totalBuy: number
  totalSell: number
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
    characterGold,
    handleAddItemToCart,
  } = props
  const relatedCartItem = cartItems.find(ci => ci.item.id === shoppeItem.item.id && ci.transactionType === 'sell')
  let sellCartAmount = relatedCartItem?.amount ?? 0

  const item = shoppeItem.item
  const characterItemAmount = characterServiceGetItemAmount(characterInventories ?? [], item.id)

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
  let buyAmount = amount
  let buyCost = item.gold.buy * amount
  if(buyCost > characterGold){
    buyAmount = Math.floor(characterGold / buyCost)
    buyCost = item.gold.buy * buyAmount
  }
  let sellAmount = amount
  let sellCost = item.gold.sell * amount
  if(amount > characterItemAmount){
    sellAmount = characterItemAmount
    sellCost = item.gold.sell * sellAmount
  }
  
  const content = <div className={`shoppe-item open`}>
    <div className='shoppe-item-name'>
      {item.name}
    </div>
    <div className='shoppe-item-description'>
      {item.description}
    </div>
    <div className='shoppe-item-info-list'>
      <div className='shoppe-item-info'>
        Buy 1: <span style={{color: 'gold'}}>{item.gold.buy.toLocaleString()}g</span>
      </div>
      <div className='shoppe-item-info' >
        Sell 1: <span style={{color: 'gold'}}>{item.gold.sell.toLocaleString()}g</span>
      </div>
      {buyCost > characterGold && <div className='shoppe-item-info'>
        Buy{buyAmount > 1 ? ` ${buyAmount}` : ` ${amount}`}: <span style={{color: 'gold'}}>{buyCost > 0 ? buyCost.toLocaleString() : shoppeItem.totalBuy.toLocaleString()}g</span>
      </div>}
      {sellAmount > characterItemAmount && <div className='shoppe-item-info' >
        Sell{sellAmount > 1 ? ` ${sellAmount}` : ` ${amount}`}: <span style={{color: 'gold'}}>{sellCost > 0 ? sellCost.toLocaleString() : shoppeItem.totalSell.toLocaleString()}g</span>
      </div>}
      
    </div>
    <div className='shoppe-item-info-list'>
      <div className='shoppe-item-info'>
        Inv: <span style={{color: 'gold'}}>{characterItemAmount - sellCartAmount}</span>
      </div>
      <div className='shoppe-item-info'>
        Cart: <span style={{color: 'gold'}}>{sellCartAmount}</span>
      </div>
      {item.profession?.type && <div className='shoppe-item-info profession'>
        {item.profession?.type}
      </div>}
    </div>

    {hasEffects === true && <div className='shoppe-item-sub-title'>
      Effects
    </div>}
    {hasEffects === true && <div className='shoppe-item-info-list'>
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
      <div className={`shoppe-item-info ${buyAmount > 0 ? 'add' : 'zero'}`} onClick={() => {buyAmount > 0 && handleAddItemToCart(shoppeItem.item.id, 'buy', buyAmount)}}>
        BUY {buyAmount}
      </div>
      <div className={`shoppe-item-info ${sellAmount > 0 ? 'add' : 'zero'}`} onClick={() => {sellAmount > 0 && handleAddItemToCart(shoppeItem.item.id, 'sell', sellAmount)}}>
        SELL {sellAmount}
      </div>
    </div>
  </div>

  return content
}