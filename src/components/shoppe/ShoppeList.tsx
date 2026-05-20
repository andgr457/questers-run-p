import { useState } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import ShoppeItem, { type ShoppeBuyItemSettings } from './ShoppeItem';
import type { ShoppeCartItem } from './ShoppeCart';

interface ShoppeListProps extends AppProperties {
  characterGold: number
  cartItems: ShoppeCartItem[]
  handleAddItemToCart: (itemId: string, transactionType: 'buy' | 'sell', amount: number) => void
}

export default function ShoppeList(props: ShoppeListProps){
  const {
    items,
    characterGold,
  } = props
  const amountSelections = [1, 5, 10, 15, 20, 50, 100]
  const [amount, setAmount] = useState(1)

  const itemsByType: {[propertyName: string]: ShoppeBuyItemSettings[]} = {}

  items?.forEach(i => {
    if(i.type === 'currency') return null
    if(!itemsByType[i.type]){
      itemsByType[i.type] = []
    }
    const totalBuy = amount * i.gold.buy
    const totalSell = amount * i.gold.sell
    let needed = 0
    if(characterGold < totalBuy){
      needed = totalBuy - characterGold
    }
    itemsByType[i.type].push({
      item: i,
      canBuy: needed === 0,
      totalBuy: totalBuy,
      neededGold: needed,
      totalSell: totalSell
    })
  })

  Object.keys(itemsByType).forEach(type => {
    itemsByType[type].sort((a, b) => {
      // canBuy first
      if (a.canBuy === b.canBuy) return 0
      return a.canBuy ? -1 : 1
    })
  })

  return <div className='shoppe-module'>
    <div className='dark-centered-section'>
      {amountSelections.map(amt => {
        return <button className={`${amt === amount ? 'yellow' : 'basic'}`} onClick={() => {setAmount(amt)}}>
          <span style={{textTransform: 'lowercase'}}>x</span>{amt}
        </button>
      })}
    </div>
    {Object.getOwnPropertyNames(itemsByType)?.map(propertyName => {
      const typeItems = itemsByType[propertyName]
      return <div className='shoppe-item-type-group '>
        <div className='shoppe-item-type-group-title'>
          {propertyName?.toUpperCase()} [{typeItems.length}]
        </div>
        <div className='shoppe-item-list open'>
          {typeItems.map(i => {
            return <ShoppeItem {...props} shoppeItem={i} amount={amount} characterGold={characterGold} />
          })}
        </div>
      </div>
    })}
  </div>
}