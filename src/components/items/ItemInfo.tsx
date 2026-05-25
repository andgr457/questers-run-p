//@ts-ignore

import type { Item } from '../../interfaces/items/Item.types'
import './ItemInfo.css'

interface ItemInfoProps {
  item: Item
  amount: number

  // optional actions (you can wire these to services later)
  onUse?: (item: Item) => void
  onEquip?: (item: Item) => void
  onSell?: (item: Item) => void
}

export default function ItemInfo(props: ItemInfoProps) {
  const {
    item: itemInfo,
    amount,
    onUse,
    onEquip,
    onSell
  } = props ?? {}

  const stats = Object.entries(itemInfo?.stats ?? {})
    .filter(([_, v]) => v?.value)

  const isConsumable = itemInfo.type === 'consumable'
  const isWeapon = itemInfo.type === 'weapon'
  const isArmor = itemInfo.type === 'armor'

  return (
    <div className={`item-info rarity-${itemInfo.rarity}`}>
      
      {/* HEADER */}
      <div className="item-info-header">
        <div className="item-info-name">
          {itemInfo.name}
          {amount > 1 && (
            <span className="item-info-amount">
              x{amount}
            </span>
          )}
        </div>

        <div className="item-info-meta">
          <span className="item-info-rarity">
            {itemInfo.rarity.toUpperCase()}
          </span>
          <span className="item-info-type">
            {itemInfo.type.toUpperCase()}
          </span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="item-info-description">
        {itemInfo.description}
      </div>

      {/* STATS */}
      {stats.length > 0 && (
        <div className="item-info-section">
          <div className="item-info-section-title">⚔ STATS</div>

          {stats.map(([key, value]) => (
            <div key={key} className="item-info-stat">
              <span className="stat-key">{key.toUpperCase()}</span>
              <span className="stat-value">+{value.value}</span>
              {value.max && (
                <span className="stat-max">/ {value.max}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* VALUE */}
      {itemInfo.gold && (
        <div className="item-info-section">
          <div className="item-info-section-title">🪙 VALUE</div>

          <div className="item-info-row">
            <span>BUY</span>
            <span>{itemInfo.gold.buy}</span>
          </div>

          <div className="item-info-row">
            <span>SELL</span>
            <span>{itemInfo.gold.sell}</span>
          </div>
        </div>
      )}

      {/* PROFESSION */}
      {itemInfo.profession && (
        <div className="item-info-section">
          <div className="item-info-section-title">🛠 PROFESSION</div>

          <div className="item-info-row">
            <span>TYPE</span>
            <span>{itemInfo.profession.type}</span>
          </div>

          <div className="item-info-row">
            <span>LEVEL</span>
            <span>{itemInfo.profession.levelRequired}</span>
          </div>

          <div className="item-info-row">
            <span>XP</span>
            <span>{itemInfo.profession.xp}</span>
          </div>

          <div className="item-info-row">
            <span>STAMINA</span>
            <span>{itemInfo.profession.stamina}</span>
          </div>

          <div className="item-info-row">
            <span>TIME</span>
            <span>{itemInfo.profession.timeInSeconds}s</span>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="item-info-actions">

        {isConsumable && onUse && (
          <button onClick={() => onUse(itemInfo)}>
            Use
          </button>
        )}

        {isWeapon && onEquip && (
          <button onClick={() => onEquip(itemInfo)}>
            Equip Weapon
          </button>
        )}

        {isArmor && onEquip && (
          <button onClick={() => onEquip(itemInfo)}>
            Equip Armor
          </button>
        )}

        {onSell && (
          <button className="danger" onClick={() => onSell(itemInfo)}>
            Sell
          </button>
        )}
      </div>
    </div>
  )
}