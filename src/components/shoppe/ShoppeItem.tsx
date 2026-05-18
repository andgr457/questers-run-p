import type { AppProperties } from '../../interfaces/AppProperties.types';
import type { Stat } from '../../interfaces/characters/Character.types';
import type { Item } from '../../interfaces/items/Item.types';
import { getCharacterItemAmount } from '../../services/characters/Character.Service';

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
}

export default function ShoppeItem(props: ShoppeItemProps){
  const {
    shoppeItem,
    amount,
    characterInventories,
    handleAddItemToCart
  } = props

  const item = shoppeItem.item

  const characterItemAmount = getCharacterItemAmount(characterInventories ?? [], item.id)
    
  const content = <div className={`shoppe-item open`}>
    <div className='shoppe-item-name'>
      {item.name}
    </div>
    <div className='shoppe-item-description'>
      {item.description}
    </div>
    {item.stats && Object.getOwnPropertyNames(item.stats).map(propertyName => {
      //@ts-ignore
      const stat: Stat = item.stats[propertyName]
      if(stat.value === 0) return
      return <div className='shoppe-item-info'>
        {stat.name}: <span style={{color: 'gold'}}>{stat.value}</span>
      </div>
    })}
    <div className='shoppe-item-info'>
      Buy: <span style={{color: 'gold'}}>{shoppeItem.totalBuy.toLocaleString()}g</span>
    </div>
    <div className='shoppe-item-info' >
      Sell: <span style={{color: 'gold'}}>{shoppeItem.totalSell.toLocaleString()}g</span>
    </div>
    <div className="shoppe-item-bottom">
      <div className='shoppe-item-info'>
        You have: <span style={{color: 'gold'}}>{characterItemAmount}</span>
      </div>
      {!shoppeItem.canBuy && (
        <div className='shoppe-item-info' >
          Buy Need: <span style={{color: 'gold'}}>{shoppeItem.neededGold.toLocaleString()}g</span>
        </div>
      )}

      {shoppeItem.canBuy && (
        <div className='shoppe-item-info add' onClick={() => {handleAddItemToCart(shoppeItem.item.id, 'buy', amount)}}>
          BUY {amount}
        </div>
      )}
      {characterItemAmount >= amount && (
        <div className='shoppe-item-info add' onClick={() => {handleAddItemToCart(shoppeItem.item.id, 'sell', amount)}}>
          SELL {amount}
        </div>
      )}
    </div>
  </div>

  return content
}