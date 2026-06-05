import './Hunting.css'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import ScrollableShoppeList from '../shoppe/ShoppeListScrollable'
import type { Mob } from '../../interfaces/mobs/Mob.types'
import HuntingMob from './HuntingMob'
import { ITEM_TYPES, type Item } from '../../interfaces/items/Item.types'
import SpinnerOverlay from '../spinner/SpinnerOverlay'
import type { Character } from '../../interfaces/characters/Character.types'
import { runHuntingEncounter } from '../../features/runtime/engines/runHuntingEncounter'
import { playHuntingEncounter } from '../../features/runtime/playback/playHuntingEncounter'
import { encounterRuntimeStore } from '../../features/runtime/store/encounterRuntimeStore'
import { activityRuntimeService } from '../../features/runtime/activity/activityRunetimeService'

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
    handleHuntingMobComplete,
    items,
    useConsumable,
  } = props
  const SLEEP = 850
  const [canDo, setCanDo] = useState(true)
  const [selectedConsumableId, setSelectedConsumableId] = useState<string | null>(null)

  const [mobName, setMobName] = useState('Hunting...')
  const [mobHp, setMobHp] = useState(0)
  const [mobHpMax, setMobHpMax] = useState(0)

  const [charHp, setCharHp] = useState(character?.stats.hp?.value ?? 0)

  useEffect(() => {
    if(canDo){
      setCharHp(character?.stats.hp?.value)
    }
  }, [character?.stats.hp?.value, canDo])

  const [huntingEvents, setHuntingEvents] = useState<React.ReactNode[]>([])
  
  const addEvent = (msg: React.ReactNode) => {
    setHuntingEvents(prev => [msg, ...prev])
  }

  const handleHuntMobClicked = useCallback(
    async (mob: Mob, char: Character) => {
      if (!mob?.stats?.hp?.value) return
      if (!char?.stats?.hp?.value) return

      // 🚨 THIS is the missing piece
      if (!encounterRuntimeStore.canStartEncounter(char.id)) {
        return
      }

      const activityId = crypto.randomUUID()

      activityRuntimeService.start({
        id: activityId,
        type: 'hunting',
        characterId: char.id,
        startedAt: Date.now(),
        status: 'active',
        blocking: true,
        meta: {
          mobId: mob.id,
        },
      })

      setCanDo(false)
      setHuntingEvents([])

      const result = runHuntingEncounter({
        mob,
        character: char,
        items: items ?? [],
      })

      await playHuntingEncounter({
        mob,
        character: char,
        result,
        sleepMs: SLEEP,
        handlers: {
          setMobName,
          setMobHp,
          setMobHpMax,
          setCharHp,
          addEvent,
        },
      })

      await handleHuntingMobComplete?.(
        mob,
        char.id,
        result.loot,
        result.finalCharacterHp,
        result.characterPassedOut
      )

      activityRuntimeService.complete(activityId)

      reset()
    },
    [items]
  )

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
              return <>+{stat.value} {stat.name}</>
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

      {/* ======================
          VS COMBAT UI
      ====================== */}
      <div className="combat-vs shoppe-cart-sticky">
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