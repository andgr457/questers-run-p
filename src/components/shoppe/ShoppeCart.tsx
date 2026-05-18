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
  handleConfirmCartTransactions: () => void

}

export default function ShoppeCart(props: ShoppeCartProps){
  const {
    cartItems,
    handleClearCart,
    handleConfirmCartTransactions,
    handleRemoveCartItem,
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

  return <div >
    <div className='page-header-main'>
      CART
    </div>
    <div className={`shoppe-cart-empty ${neitherInCart === true ? 'open' : ''}`} style={{backgroundColor: 'var(--bg-dark-2)', textAlign: 'center', color: 'gold', padding: '5px', fontSize: '0.7em', opacity: '80%'}}>
      Empty Cart
    </div>
    {eitherInCart === true && <div className='flex-wrap' style={{gap: '15px', justifyContent: 'center', padding: '5px'}}>
      <button className='basic' onClick={handleClearCart}>CLEAR CART</button>
      <button className='success' onClick={handleConfirmCartTransactions}>CONFIRM</button>
    </div>}

    <div className={`shoppe-item-list ${eitherInCart === true ? 'open' : ''}`}>
      <div className={`shoppe-item ${eitherInCart === true ? 'open' : ''}`} style={{width: '15%'}}>
        <div className='list-item-title'>
          TOTAL
        </div>
        <div className='list-item-info' style={{textAlign: 'center'}}>
          Buying - {buying.length} Item(s)<br/><span style={{color:'gold'}}>{buyingTotal}g</span>
        </div>
        <div className='list-item-info' style={{textAlign: 'center'}}>
          Selling - {selling.length} Item(s)<br/><span style={{color:'gold'}}>{sellingTotal}g</span>
        </div>
        <div className='list-item-info' style={{textAlign: 'center'}}>
          Total - {cartItems.length} Item(s)<br/><span style={{color:'gold'}}>{sellingTotal + buyingTotal}g</span>
        </div>
      </div>

      <div className={`shoppe-item ${buyingInCart === true ? 'open' : ''}`} style={{width: 'fit-content'}}>
        <div className='list-item-title'>
          BUYING
        </div>
        {buying.map(ci => {
          let total = 0
          if(ci.transactionType === 'buy'){
            total = ci.item.gold.buy * ci.amount
          } else {
            total = ci.item.gold.sell * ci.amount
          }
          return <div className='list-item-info' style={{textAlign: 'center'}}>
            <div style={{float: 'left'}}>
              <span>x{ci.amount}</span> - <span>{ci.item.name}</span> - <span style={{color: 'gold'}}>{total}g</span>
            </div>
            <div style={{float: 'right'}} onClick={() => {handleRemoveCartItem(ci.item.id, ci.transactionType)}}>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: 'gold'}}>X</span>
            </div>
          </div>
        })}
      </div>
      <div className={`shoppe-item ${sellingInCart === true ? 'open' : ''}`} style={{width: 'fit-content'}}>
        <div className='list-item-title'>
          SELLING
        </div>
        {selling.map(ci => {
          let total = 0
          if(ci.transactionType === 'buy'){
            total = ci.item.gold.buy * ci.amount
          } else {
            total = ci.item.gold.sell * ci.amount
          }
          return <div className='list-item-info' style={{textAlign: 'center'}}>
            <div style={{float: 'left'}}>
              <span>x{ci.amount}</span> - <span>{ci.item.name}</span> - <span style={{color: 'gold'}}>{total}g</span>
            </div>
            <div style={{float: 'right'}} onClick={() => {handleRemoveCartItem(ci.item.id, ci.transactionType)}}>
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: 'gold'}}>X</span>
            </div>
          </div>
        })}
      </div>
    </div>
  </div>
}