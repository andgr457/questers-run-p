import { useState } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import ShoppeItem, { type ShoppeBuyItemSettings } from './ShoppeItem';
import type { ShoppeCartItem } from './ShoppeCart';
import ScrollableShoppeList from './ShoppeListScrollable';

interface ShoppeListsProps extends AppProperties {
  characterGold: number
  cartItems: ShoppeCartItem[]
  handleAddItemToCart: (itemId: string, transactionType: 'buy' | 'sell', amount: number) => void
  showCheckout: () => void
}

export default function ShoppeLists(props: ShoppeListsProps){
  const {
    items,
    characterGold,
    cartItems,
    showCheckout
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
    itemsByType[i.type].push({
      item: i,
      totalBuy: totalBuy,
      totalSell: totalSell
    })
  })
  const resourceTypeLists: {[propertyName: string]: ShoppeBuyItemSettings[]} = {}
  for(const propertyName of Object.getOwnPropertyNames(itemsByType)){
    if(propertyName === 'resource'){
      //@ts-ignore
      const resources = itemsByType[propertyName]
      for(const resource of resources ?? []){
        //@ts-ignore
        if(!resourceTypeLists['professionless']){
          //@ts-ignore
          resourceTypeLists['professionless'] = []
        }
        if(resource.item.profession){
          //@ts-ignore
          if(!resourceTypeLists[resource.item.profession.type]){
            //@ts-ignore
            resourceTypeLists[resource.item.profession.type] = []
          }
          //@ts-ignore
          resourceTypeLists[resource.item.profession.type].push(resource)
        } else {
          //@ts-ignore
          resourceTypeLists['professionless'].push(resource)
        }
      }
      break
    }
  }
  
  const toCartButton = (
    <button
      className='basic'
      onClick={showCheckout}
    >
      CART
    </button>
  )

  return <div className='shoppe-module'>
    <div className='dark-centered-section'>
      {amountSelections.map(amt => {
        return <button className={`${amt === amount ? 'yellow' : 'basic'}`} onClick={() => {setAmount(amt)}}>
          <span style={{textTransform: 'lowercase'}}>x</span>{amt}
        </button>
      })}
    </div>
    
    {Object.getOwnPropertyNames(itemsByType)?.map(propertyName => {
      if(propertyName === 'resource'){
        return null
      }
      const typeItems = itemsByType[propertyName]
      return <div className='shoppe-item-type-group '>
        <div className='character-section-title'>
          <div className='page-header-banner'>
            <div className='page-header-title'>
              {propertyName?.toUpperCase()} [{typeItems.length}]
            </div>
            <div>
                {cartItems.length > 0 && toCartButton}
            </div>
          </div>
        </div>

        <ScrollableShoppeList>
          {typeItems.map(i => {
            return (
              <ShoppeItem
                key={i.item.id}
                {...props}
                shoppeItem={i}
                amount={amount}
                characterGold={characterGold}
              />
            )
          })}
        </ScrollableShoppeList>
      </div>
    })}
    <div className='shoppe-item-type-group'>
      <div className='character-section-title'>
        <div className='page-header-banner'>
          <div className='page-header-title'>
            RESOURCES [{itemsByType?.['resource']?.length ?? 0}] 
          </div>
          <div>
              {cartItems.length > 0 && toCartButton}
          </div>
        </div>
      </div>

      {Object.getOwnPropertyNames(resourceTypeLists).map(propertyName => {
        const typeItems = resourceTypeLists[propertyName]

        if (typeItems.length === 0) return null

        return (
          <div
            key={propertyName}
            className='shoppe-item-type-group'
          >
            <div className='character-section-title'>
              <div className='page-header-banner'>
                <div className='page-header-title'>
                  {propertyName?.toUpperCase()} [{typeItems.length}]
                </div>
                <div>
                    {cartItems.length > 0 && toCartButton}
                </div>
              </div>
            </div>

            <ScrollableShoppeList>
              {typeItems.map(i => {
                return (
                  <ShoppeItem
                    key={i.item.id}
                    {...props}
                    shoppeItem={i}
                    amount={amount}
                    characterGold={characterGold}
                  />
                )
              })}
            </ScrollableShoppeList>
          </div>
        )
      })}
    </div>
  </div>
}