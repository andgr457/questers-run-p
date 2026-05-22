import './Hunting.css'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import { sleep } from '../../services/CommonServices'
import ScrollableShoppeList from '../shoppe/ShoppeListScrollable'
import type { Loot, Mob } from '../../interfaces/mobs/Mob.types'
import HuntingMob from './HuntingMob'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from '../../providers/ConfirmProvider'
import { ITEM_TYPES, type Item } from '../../interfaces/items/Item.types'
import SpinnerOverlay from '../spinner/SpinnerOverlay'

interface HuntingMobsListProps extends AppProperties {
  huntingMobs: Mob[]
}

type ConsumableUI = {
  itemId: string
  itemName: string
  amount: number
  item: Item
}

export default function HuntingMobsList(props: HuntingMobsListProps) {
  const {
    huntingMobs,
    character,
    characterInventories,
    handleHuntingMobTick,
    handleHuntingMobComplete,
    items,
    useConsumable,
  } = props
  const SLEEP = 850
  const navigate = useNavigate()
  const {showConfirm} = useConfirm()
  const [canDo, setCanDo] = useState(true)
  const [selectedConsumableId, setSelectedConsumableId] = useState<string | null>(null)

  const [mobName, setMobName] = useState('Hunting...')
  const [mobHp, setMobHp] = useState(0)
  const [mobHpMax, setMobHpMax] = useState(0)

  const [charHp, setCharHp] = useState(character?.stats.hp?.value ?? 0)

  const [huntingEvents, setHuntingEvents] = useState<React.ReactNode[]>([])
  
  const huntingLocation = window.location.href
    .replace(window.location.origin, '')
    .split('/')
    .pop()

  const addEvent = (msg: React.ReactNode) => {
    setHuntingEvents(prev => [msg, ...prev])
  }

  const handleHuntMobClicked = useCallback(async (mobId: string) => {
    const mob = huntingMobs.find(i => i.id === mobId)
    if (!mob?.stats?.hp?.value) return

    const char = character
    if (!char?.stats?.hp?.value) return

    setCanDo(false)

    // ======================
    // INIT STATE
    // ======================
    let currentMobHp = mob.stats.hp.value
    let currentCharHp = char.stats.hp.value
    setHuntingEvents([])
    await sleep(350)

    addEvent(<span><span style={{color: 'gold'}}>{char.name}</span> engages <span style={{color: 'gold'}}>{mob.name}</span> [Lv. {mob.level}].</span>)
    await sleep(SLEEP)

    setMobName(mob.name)

    setMobHp(currentMobHp)
    setMobHpMax(mob.stats.hp.value)
    await sleep(SLEEP)

    let characterPassedOut = false

    // ======================
    // COMBAT LOOP
    // ======================
    while (currentMobHp > 0 && currentCharHp > 0) {
      // PLAYER TURN
      const characterDamage =
        char.level +
        (char.stats.strength?.value ?? 0) +
        (char.stats.agility?.value ?? 0) +
        (char.stats.intelligence?.value ?? 0)

      currentMobHp = Math.max(0, currentMobHp - characterDamage)

      addEvent(<span><span style={{color: 'gold'}}>{char.name}</span> hit <span style={{color: 'gold'}}>{mob.name}</span> for <span style={{color: 'gold'}}>{characterDamage}</span>.</span>)
      setMobHp(currentMobHp)

      await sleep(SLEEP)

      if (currentMobHp <= 0) break

      // MOB TURN
      const mobDamage =
        mob.level +
        (mob.stats.strength?.value ?? 0) +
        (mob.stats.agility?.value ?? 0) +
        (mob.stats.intelligence?.value ?? 0)

      currentCharHp = Math.max(0, currentCharHp - mobDamage)

      addEvent(<span><span style={{color: 'gold'}}>{mob.name}</span> hit <span style={{color: 'gold'}}>{char.name}</span> for <span style={{color: 'gold'}}>{mobDamage}</span>.</span>)

      setCharHp(currentCharHp)

      await handleHuntingMobTick?.(mobDamage)

      await sleep(SLEEP)

      if (currentCharHp <= 0) {
        characterPassedOut = true
        break
      }
    }

    // ======================
    // END RESULT
    // ======================
    if (characterPassedOut) {
      addEvent(<span><span style={{color: 'gold'}}>{char.name}</span> collapsed.</span>)

      if(await showConfirm({
        isYesNo: true,
        title: `${char.name} Collapsed`,
        message: `Hunters find you collapsed in the ${huntingLocation} and are asking if you need assistance back to town. Will you join them?`
      })){
        reset()
        navigate('/tavern')
        return
      } 
        return
    }

    if (currentMobHp <= 0) {
      addEvent(<span><span style={{color: 'gold'}}>{char.name}</span> defeated the <span style={{color: 'gold'}}>{mob.name}</span>!</span>)
      const lootDrops: Loot[] = []
      for(const lootItem of mob.loot ?? []){
        if (!lootItem.itemId || typeof lootItem.itemAmount !== 'number') continue

        const item = items?.find(i => i.id === lootItem.itemId)
        if (!item) continue

        const chance = typeof lootItem.chance === 'number' ? lootItem.chance : 1
        const roll = Math.random()

        const didDrop = roll <= chance

        if (!didDrop) continue

        addEvent(
          <span>
            <span style={{ color: 'gold' }}>{char.name}</span> looted{" "}
            <span style={{ color: 'gold' }}>
              {lootItem.itemAmount} {item.name}
            </span>!
          </span>
        )

        lootDrops.push(lootItem)
      }
      await handleHuntingMobComplete?.(mob.id, mob.xp, char.id, lootDrops)
    }

    reset()
  }, [character, huntingMobs, items])

  const reset = () => {
    setCanDo(true)

    setMobName('Hunting...')
    setMobHp(0)
    setMobHpMax(0)
  }

  const consumablesList: ConsumableUI[] = useMemo(() => {
    const usableMap: Record<string, ConsumableUI> = {}

    characterInventories?.forEach(ci => {
      if (ci.title === 'Currency') return

      ci.transactions.forEach(txn => {
        const item = items?.find(i => i.id === txn.itemId)
        if (!item || item.type !== ITEM_TYPES.CONSUMABLE) return

        if (!usableMap[item.id]) {
          usableMap[item.id] = {
            itemId: item.id,
            itemName: item.name,
            amount: 0,
            item
          }
        }

        usableMap[item.id].amount += txn.quantity
      })
    })

    return Object.values(usableMap)
  }, [characterInventories, items])

  useEffect(() => {
    if (!consumablesList.length) {
      setSelectedConsumableId(null)
      return
    }

    // only set if nothing is selected OR selection no longer exists
    const exists = consumablesList.some(c => c.itemId === selectedConsumableId)

    if (!selectedConsumableId || !exists) {
      setSelectedConsumableId(consumablesList[0].itemId)
    }
  }, [consumablesList])

  const selectedConsumable = useMemo(
    () => consumablesList.find(c => c.itemId === selectedConsumableId) ?? null,
    [consumablesList, selectedConsumableId]
  )

  const consumablesUI = (
    <div className="consumablesPanel">
      <select
        className="consumableSelect"
        value={selectedConsumableId ?? ''}
        onChange={e => setSelectedConsumableId(e.target.value || null)}
      >
        <option value="">Select consumable...</option>

        {consumablesList.map(c => (
          <option key={c.itemId} value={c.itemId}>
            {c.itemName} x{c.amount} {Object.getOwnPropertyNames(c.item.stats).map(propertyName => {
              //@ts-ignore
              const stat = c.item.stats[propertyName]
              return <span>+{stat.value} {stat.name}</span>
            })}
          </option>
        ))}
      </select>

      <div className="consumableActions">
        <button
          className="consumableBtn"
          disabled={!selectedConsumable}
          onClick={async () => {
            if (!selectedConsumable) return
            await useConsumable?.(selectedConsumable.item, character.id)
          }}
        >
          Use
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="character-section-title">
        <div className="page-header-banner">
          <div className="page-header-title">
            {huntingLocation?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* ======================
          VS COMBAT UI
      ====================== */}
      <div className="combat-vs">
        <div className="combat-side">
          <div className="combat-name">{character?.name}</div>

          <div className="combat-bar">
            <div
              className="combat-fill player"
              style={{
                width: `${character?.stats.hp?.max ? (charHp / character?.stats.hp?.max) * 100 : 0}%`
              }}
            />
          </div>

          <div className="combat-hp">
            {charHp} / {character?.stats.hp?.max}
          </div>
        </div>

        <div className="combat-vs-center">VS</div>

        <div className="combat-side">
          <div className="combat-name">{mobName}</div>

          <div className="combat-bar">
            <div
              className="combat-fill mob"
              style={{
                width: `${mobHpMax ? (mobHp / mobHpMax) * 100 : 0}%`
              }}
            />
          </div>

          <div className="combat-hp">
            {mobHp} / {mobHpMax}
          </div>
        </div>
      </div>

      {/* ======================
          COMBAT LOG
      ====================== */}
      <div className="combat-log">
        {huntingEvents.map((e, i) => {
          return <div key={i} className="combat-log-line">
            {e}
          </div>
        })}
      </div>

      <SpinnerOverlay loading={!canDo}>
        {consumablesUI}
      </SpinnerOverlay>

      {/* ======================
          MOB LIST
      ====================== */}
      <ScrollableShoppeList>
        {huntingMobs.map(m => (
          <HuntingMob
            key={m.id}
            {...props}
            huntingMob={m}
            handleHuntMobClicked={handleHuntMobClicked}
            canDo={canDo}
          />
        ))}
      </ScrollableShoppeList>
    </div>
  )
}