import { useEffect, useMemo, useState } from 'react'
import { ITEM_CURRENCY_IDS } from '../../data/items/currency/Item.Currency.data'
import PageHeader from '../../components/PageHeader'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import CharacterNewRename from '../../components/characters/CharacterNewRename'

interface OverviewPageProps extends AppProperties {}

export default function OverviewPage(props: OverviewPageProps) {
  const {
    character,
    characterInventories,
    setLocation,
    characterMobProgress,
    // allMobProgress,
    allQuestProgress,
    // allInventories,
    mobs,
    quests,
  } = props
  // -----------------------------
  // MODULE STATE (STANDARDIZED)
  // -----------------------------
  const [showModule, setShowModule] = useState<'' | 'character'>(!character?.name ? 'character' : '')

  // -----------------------------
  // TUTORIAL
  // -----------------------------

  useEffect(() => {
    setLocation?.('Overview')
  }, [])

  const mainCharacterExists = typeof character?.name === 'string'

  // -----------------------------
  // GOLD CALCULATION
  // -----------------------------
  const currencyPouch = characterInventories?.find(i => i.title === 'Currency')

  let totalGold = 0
  currencyPouch?.transactions?.forEach(txn => {
    if (txn.itemId === ITEM_CURRENCY_IDS.GOLD) {
      totalGold += txn.quantity
    }
  })

  // -----------------------------
  // QUEST STATS
  // -----------------------------
  const completedQuestProgress = allQuestProgress?.filter(aqp =>
    aqp.characterId === character.id &&
    aqp.status === 'complete'
  )

  const questCompletionCounts = useMemo(() => {
    const map = new Map<string, { questId: string; title: string; count: number }>()

    for (const qp of completedQuestProgress ?? []) {
      const quest = quests?.find(q => q.id === qp.questId)
      const existing = map.get(qp.questId)

      if (existing) {
        existing.count += 1
      } else {
        map.set(qp.questId, {
          questId: qp.questId,
          title: quest?.title ?? 'Unknown Quest',
          count: 1
        })
      }
    }

    return Array.from(map.values())
  }, [completedQuestProgress, quests])

  // -----------------------------
  // MOB STATS
  // -----------------------------
  const mobKillCounts = useMemo(() => {
    const map = new Map<string, { mobId: string; name: string; count: number }>()

    for (const mp of characterMobProgress ?? []) {
      const mobId = mp.mobId
      const existing = map.get(mobId)

      const increment = 1

      if (existing) {
        existing.count += increment
      } else {
        map.set(mobId, {
          mobId,
          name: mobs?.find(m => m.id === mobId)?.name ?? 'Unknown Mob',
          count: increment
        })
      }
    }

    return Array.from(map.values())
  }, [characterMobProgress, mobs])

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <>


      <div id="overview-top">
        <div className="page-main">
          <PageHeader showActions={false}>
              <button
                className="basic"
                onClick={() =>
                  setShowModule(prev =>
                    prev === 'character' ? '' : 'character'
                  )
                }
              >
                {mainCharacterExists
                  ? `Rename ${character.name}`
                  : 'Create Main Character'}
              </button>
          </PageHeader>

          {/* -----------------------------
              CHARACTER MODULE
          ----------------------------- */}
          {showModule === 'character' && (
            <CharacterNewRename
              {...props}
            />
          )}

          {/* -----------------------------
              DASHBOARD
          ----------------------------- */}
          {character?.name && showModule === '' && (
            <div className="item-list">
              <div className="list-item">
                <div className="list-item-title">Dashboard</div>

                <div className="list-item-info">
                  Quests Completed:{' '}
                  <span style={{ color: 'gold' }}>
                    {completedQuestProgress?.length ?? 0}
                  </span>
                </div>

                <div className="list-item-info">
                  Mobs Hunted:{' '}
                  <span style={{ color: 'gold' }}>
                    {mobKillCounts?.length ?? 0}
                  </span>
                </div>

                <div className="list-item-info">
                  Achievements Earned:{' '}
                  <span style={{ color: 'gold' }}>
                    {character?.achievements?.length ?? 0}
                  </span>
                </div>
              </div>

              <div className="list-item">
                <div className="list-item-title">Quests Complete</div>
                <div className="list-item-info">
                  {questCompletionCounts.length === 0 && (
                    <div>No quests completed yet.</div>
                  )}

                  {questCompletionCounts.map(q => (
                    <div key={q.questId}>
                      <span style={{ color: 'gold' }}>x{q.count}</span>{' '}
                      {q.title}
                    </div>
                  ))}
                </div>
              </div>

              <div className="list-item">
                <div className="list-item-title">MOBS HUNTED</div>
                <div className="list-item-info">
                  {mobKillCounts.length === 0 && (
                    <div>No mobs hunted yet.</div>
                  )}

                  {mobKillCounts.map(m => (
                    <div key={m.mobId}>
                      <span style={{ color: 'gold' }}>x{m.count}</span>{' '}
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}