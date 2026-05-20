import { useCallback, useEffect, useState } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import '../../components/shoppe/Shoppe.css'
import ShoppeLists from '../../components/shoppe/ShoppeLists';
import ShoppeCart, { type ShoppeCartItem } from '../../components/shoppe/ShoppeCart';
import { useConfirm } from '../../providers/ConfirmProvider';
import { ITEM_CURRENCY_IDS } from '../../data/items/currency/Item.Currency.data';
import { characterServiceGetItemAmount } from '../../services/Character.Service';

interface ShoppePageProps extends AppProperties {

}

export default function ShoppePage(props: ShoppePageProps){
  const {
    setLocation,
    characterInventories,
    items,
    handleShoppeConfirmation,
    character
  } = props
  const {showConfirm} = useConfirm()
  const [cartItems, setCartItems] = useState<ShoppeCartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    setLocation?.('Shoppe')
  },[])


  const handleRemoveCartItem = useCallback(async (itemId: string, transactionType: 'buy' | 'sell') => {
    const newCartItems = []
    for(const cartItem of cartItems){
      if(cartItem.item.id === itemId && cartItem.transactionType === transactionType){
        continue
      } else {
        newCartItems.push(cartItem)
      }
    }
    setCartItems(newCartItems)
  }, [cartItems])

  const handleClearCart = useCallback(async () => {
    if(cartItems.length === 0) return
    if(!await showConfirm({
      isYesNo: true,
      title: 'Confirm Clear',
      message: 'This will remove everything in your shoppe cart. Are you sure?',
      content: <div>
        {cartItems.map(ci => {
          return <div>
            {ci.transactionType.toUpperCase()} x{ci.amount} {ci.item.name}
          </div>
        })}
      </div>
    })){
      return
    }
    
    setShowCart(false)
    setCartItems([])
  }, [cartItems])

  const handleAddItemToCart = useCallback(async (itemId: string, transactionType: 'buy' | 'sell', amount: number) => {
    const currentCharacterGold = characterServiceGetItemAmount(characterInventories ?? [], ITEM_CURRENCY_IDS.GOLD)

    const item = items?.find(i => i.id === itemId)
    if (!item) return

    const characterItemAmount = characterServiceGetItemAmount(
      characterInventories ?? [],
      itemId
    )
    // Current cart gold total
    const cartTotal = cartItems.reduce((total, ci) => {
      if (ci.transactionType === 'buy') {
        return total + (ci.item.gold.buy * ci.amount)
      }

      return total - (ci.item.gold.sell * ci.amount)
    }, 0)


    const existingCartItem = cartItems.find(
      ci =>
        ci.item.id === itemId &&
        ci.transactionType === transactionType
    )

    // Validation
    if (transactionType === 'buy') {
      const additionalCost = item.gold.buy * amount

      if ((cartTotal + additionalCost) > currentCharacterGold) {
        return
      }
    }

    if (transactionType === 'sell') {
      const existingAmount = existingCartItem?.amount ?? 0
      const nextAmount = existingAmount + amount

      if (nextAmount > characterItemAmount) {

        return
      }
    }

    // Update cart
    let newCartItems: ShoppeCartItem[]

    if (existingCartItem) {
      newCartItems = cartItems.map(ci => {
        if (
          ci.item.id === itemId &&
          ci.transactionType === transactionType
        ) {
          return {
            ...ci,
            amount: ci.amount + amount
          }
        }

        return ci
      })
    } else {
      newCartItems = [
        ...cartItems,
        {
          item,
          amount,
          transactionType
        }
      ]
    }

    setCartItems(newCartItems)
  }, [
    cartItems,
    items,
    characterInventories
  ])

  let characterGold = characterServiceGetItemAmount(characterInventories ?? [], ITEM_CURRENCY_IDS.GOLD)
  const cartTotal = cartItems.reduce((total, ci) => {
    if (ci.transactionType === 'buy') {
      return total + (ci.item.gold.buy * ci.amount)
    }

    return total - (ci.item.gold.sell * ci.amount)
  }, 0)
  const characterGoldSubTotal = characterGold - cartTotal
  const buying = cartItems.filter(ci => ci.transactionType === 'buy')
  const selling = cartItems.filter(ci => ci.transactionType === 'sell')
  const buyingTotal = buying.reduce((total, ci) => {
    return total - (ci.item.gold.buy * ci.amount)
  }, 0)
  const sellingTotal = selling.reduce((total, ci) => {
    return total + (ci.item.gold.sell * ci.amount)
  }, 0)

  
  const handleCheckout = useCallback(async () => {
    if(cartItems.length === 0) return
    if(!await showConfirm({
      title: 'Cart Checkout',
      message: 'Complete your shoppe order?',
      isYesNo: true,
    })){
      return
    }
    await handleShoppeConfirmation?.(cartItems)
    setShowCart(false)
    setCartItems([])
  }, [cartItems])

  return <div>
    <div className='page-header-main'>
      SHOPPE
    </div>
    
    <div className='shoppe-cart-sticky'>
      <div className='shoppe-item-info-list'>
        <div className='shoppe-item-info small'>
          <div>
            {character?.name}
          </div>
          <div>
            <span style={{color: 'gold'}}>{characterGold.toLocaleString()}g</span>
          </div>
        </div>
        <div className='shoppe-item-info small'>
          <div>
            Remaining
          </div>
          <div>
            <span style={{color: 'gold'}}>{characterGoldSubTotal.toLocaleString()}g</span>
          </div>
        </div>
        <div className='shoppe-item-info small'>
          <div>
            Cart
          </div>
          <div>
            x<span style={{color: 'gold'}}>{cartItems.length}</span>
          </div>
          <div>
            <span style={{color: 'gold'}}>{(buyingTotal + sellingTotal).toLocaleString()}g</span>
          </div>
        </div>
        <div className='shoppe-item-info small'>
          <div>
            Buying
          </div>
          <div>
            x<span style={{color: 'gold'}}>{buying.length}</span>
          </div>
          <div>
            <span style={{color: 'gold'}}>{buyingTotal.toLocaleString()}g</span>
          </div>
        </div>
        <div className='shoppe-item-info small'>
          <div>
            Selling
          </div>
          <div>
            x<span style={{color: 'gold'}}>{selling.length}</span>
          </div>
          <div>
            <span style={{color: 'gold'}}>{sellingTotal.toLocaleString()}g</span>
          </div>
        </div>
      </div>

      <div className='shoppe-cart-sticky-actions'>
        <button className='basic' onClick={handleClearCart}>CLEAR</button>
        <button className={`${showCart === true ? 'yellow' : 'basic'}`} onClick={() => {setShowCart(!showCart)}}>CART</button>
      </div>
    </div>
    {showCart === true && <ShoppeCart 
      {...props} 
      cartItems={cartItems} 
      cartTotal={cartTotal}
      handleClearCart={handleClearCart} 
      handleRemoveCartItem={handleRemoveCartItem}
      handleCheckout={handleCheckout}
    />}
    {showCart === false && <ShoppeLists 
      {...props} 
      characterGold={characterGoldSubTotal} 
      handleAddItemToCart={handleAddItemToCart}
      cartItems={cartItems}
      showCheckout={() => {setShowCart(true)}}
    />}
  </div>
}