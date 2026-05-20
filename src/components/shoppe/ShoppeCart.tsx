import type { AppProperties } from '../../interfaces/AppProperties.types';
import type { Item } from '../../interfaces/items/Item.types';

export interface ShoppeCartItem {
  item: Item
  transactionType: 'buy' | 'sell'
  amount: number
}

interface ShoppeCartProps extends AppProperties {
  cartItems: ShoppeCartItem[]
  cartTotal: number
  handleClearCart: () => void
  handleRemoveCartItem: (itemId: string, transactionType: 'buy' | 'sell') => void
  handleCheckout: () => void
}

export default function ShoppeCart(props: ShoppeCartProps){
  const {
    cartItems,
    handleRemoveCartItem,
    handleCheckout,
    characterGold
  } = props

  const buying = cartItems.filter(ci => ci.transactionType === 'buy')
  const selling = cartItems.filter(ci => ci.transactionType === 'sell')
  const buyingTotal = buying.reduce((total, ci) => {
    return total - (ci.item.gold.buy * ci.amount)
  }, 0)
  const sellingTotal = selling.reduce((total, ci) => {
    return total + (ci.item.gold.sell * ci.amount)
  }, 0)
  const eitherInCart = buying.length > 0 || selling.length > 0
  const neitherInCart = buying.length === 0 && selling.length === 0
  const buyingInCart = buying.length > 0
  const sellingInCart = selling.length > 0

  return <div id='cart' className='shoppe-cart'>
    <div className={`shoppe-cart-empty ${neitherInCart === true ? 'open' : ''}`} style={{backgroundColor: 'var(--bg-dark-2)', textAlign: 'center', color: 'gold', padding: '5px', fontSize: '0.7em', opacity: '80%'}}>
      Empty Cart
    </div>
    {cartItems.length > 0 && <div className='shoppe-cart-sticky-actions'>
      <button className='success' onClick={handleCheckout} style={{width: '100%'}}>CHECKOUT</button>
    </div>}
    <div className='flex-wrap' style={{gap: '5px'}}>
      <div className={`shoppe-item ${eitherInCart === true ? 'open' : ''} cart`}>
        <div className='shoppe-item-name'>
          TOTAL
        </div>
        <div className='shoppe-item-info'>
          Buying x<span style={{color: 'gold'}}>{buying.length}</span>: <span style={{color: 'gold'}}>{buyingTotal}g</span>
        </div>
        <div className='shoppe-item-info'>
          Selling x<span style={{color: 'gold'}}>{selling.length}</span>: <span style={{color: 'gold'}}>{sellingTotal}g</span>
        </div>
        <div className='shoppe-item-info' style={{textAlign: 'center'}}>
          Total x<span style={{color: 'gold'}}>{cartItems.length}</span>: <span style={{color: 'gold'}}>{sellingTotal + buyingTotal}g</span>
        </div>
        {characterGold && <div className='shoppe-item-info' style={{textAlign: 'center'}}>
          Hayz: <span style={{color: 'gold'}}>{characterGold}g</span> {'>'} <span style={{color: 'gold'}}>{characterGold - (sellingTotal + buyingTotal)}g</span>
        </div>}
      </div>

      <div className={`shoppe-item ${buyingInCart === true ? 'open' : ''} cart`}>
        <div className='shoppe-item-name'>
          BUYING
        </div>
        {buying.map(ci => {
          let total = 0
          if(ci.transactionType === 'buy'){
            total = ci.item.gold.buy * ci.amount
          } else {
            total = ci.item.gold.sell * ci.amount
          }
          return <div className='shoppe-item-info cart'>
            <div>
              x<span style={{color: 'gold'}}>{ci.amount}</span>
            </div>
            <div>
               <span>{ci.item.name}</span>
            </div>
            <div>
              <span style={{color: 'gold'}}>{total}g</span>
            </div>
            <div onClick={() => {handleRemoveCartItem(ci.item.id, ci.transactionType)}}>
              <span style={{color: 'gold', fontSize: '0.6em'}}>REMOVE</span>
            </div>
          </div>
        })}
      </div>

      <div className={`shoppe-item ${sellingInCart === true ? 'open' : ''} cart`}>
        <div className='shoppe-item-name'>
          SELLING
        </div>
        {selling.map(ci => {
          let total = 0
          if(ci.transactionType === 'buy'){
            total = ci.item.gold.buy * ci.amount
          } else {
            total = ci.item.gold.sell * ci.amount
          }
          return <div className='shoppe-item-info cart'>
            <div>
              x<span style={{color: 'gold'}}>{ci.amount}</span>
            </div>
            <div>
               <span>{ci.item.name}</span>
            </div>
            <div>
              <span style={{color: 'gold'}}>{total}g</span>
            </div>
            <div onClick={() => {handleRemoveCartItem(ci.item.id, ci.transactionType)}}>
              <span style={{color: 'gold', fontSize: '0.6em'}}>REMOVE</span>
            </div>
        
          </div>
        })}
      </div>
    </div>
  </div>
}