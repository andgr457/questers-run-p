import { useCallback, useEffect, useState } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import '../../components/shoppe/Shoppe.css'
import ShoppeList from '../../components/shoppe/ShoppeList';
import ShoppeCart, { type ShoppeCartItem } from '../../components/shoppe/ShoppeCart';
import { useConfirm } from '../../providers/ConfirmProvider';
import { getCharacterItemAmount } from '../../services/characters/Character.Service';
import { ITEM_CURRENCY_IDS } from '../../data/items/currency/Item.Currency.data';

interface ShoppePageProps extends AppProperties {

}

export default function ShoppePage(props: ShoppePageProps){
  const {
    setLocation,
    characterInventories,
    items,
    handleShoppeConfirmation
  } = props
  const {showConfirm} = useConfirm()
  const [cartItems, setCartItems] = useState<ShoppeCartItem[]>([])

  useEffect(() => {
    setLocation?.('Shoppe')
  },[])

  const handleConfirmCartTransactions = useCallback(async () => {
    if(cartItems.length === 0) return
    if(!await showConfirm({
      isYesNo: true,
      title: 'Confirm Purchase',
      message: 'Your cart will be checked out. Are you sure?'
    })){
      return
    }
    await handleShoppeConfirmation?.(cartItems)
    setCartItems([])
  }, [cartItems])

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
      message: 'This will remove everything in your shoppe cart. Are you sure?'
    })){
      return
    }

    setCartItems([])
  }, [cartItems])

  const handleAddItemToCart = useCallback(async (itemId: string, transactionType: 'buy' | 'sell', amount: number) => {
    const currentCharacterGold = getCharacterItemAmount(characterInventories ?? [], ITEM_CURRENCY_IDS.GOLD)

    const item = items?.find(i => i.id === itemId)
    if (!item) return

    const characterItemAmount = getCharacterItemAmount(
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

  let characterGold = getCharacterItemAmount(characterInventories ?? [], ITEM_CURRENCY_IDS.GOLD)
  const cartTotal = cartItems.reduce((total, ci) => {
    if (ci.transactionType === 'buy') {
      return total + (ci.item.gold.buy * ci.amount)
    }

    return total - (ci.item.gold.sell * ci.amount)
  }, 0)
  characterGold = characterGold - cartTotal
  return <div>
    <ShoppeCart 
      {...props} 
      cartItems={cartItems} 
      cartTotal={cartTotal}
      handleClearCart={handleClearCart} 
      handleRemoveCartItem={handleRemoveCartItem}
      handleConfirmCartTransactions={handleConfirmCartTransactions}
    />
    <ShoppeList 
      {...props} 
      characterGold={characterGold} 
      handleAddItemToCart={handleAddItemToCart}
    />
  </div>
}