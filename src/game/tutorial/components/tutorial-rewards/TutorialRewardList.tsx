import { formatPrimitiveValueToString } from '../../../utils/Game.utils'
import type { TutorialReward } from '../../types/Tutorial.types'
import styles from './TutorialRewardList.module.css'
import TutorialRewardListItem from './TutorialRewardListItem'

interface Props {
  rewards: TutorialReward[]
  showTotals?: boolean
}

export default function TutorialRewardList(props: Props){
  const {
    rewards,
    showTotals = true
  } = props

  const totals: Record<string, number> = {}
  for(const r of rewards){
    const entries = [
      r.gold !== undefined ? {name: 'gold', title: 'Gold', value: r.gold } : null,
      r.xp !== undefined ? {name: 'xp', title: 'XP', value: r.xp } : null,
      r.characterTokens !== undefined
        ? {name: 'characterTokens', title: 'Character Tokens', value: r.characterTokens }
        : null,
    ].filter(Boolean)
    for(const entry of entries){
      if(!totals[entry?.title as string]){
        totals[entry!.title as string] = 0
      }
      totals[entry!.title] += entry!.value ?? 0
    }
  }

  return <div className={styles.wrapper}>
    <div className={styles.title}>
      REWARDS
    </div>
    {rewards.length === 0 && <div className={styles.group}>
      <div>No rewards found</div>
    </div>}
    <div className={styles.groups}>
      {rewards.map((r, i) => {
        const entries = [
          r.gold !== undefined ? { title: 'Gold', value: r.gold } : null,
          r.xp !== undefined ? { title: 'XP', value: r.xp } : null,
          r.characterTokens !== undefined
            ? { title: 'Character Tokens', value: r.characterTokens }
            : null,
        ].filter(Boolean)

        return (
          <div key={i} className={styles.group}>
            <div>{r.type}</div>

            {entries.map((e, idx) => {
              if(!e?.title || !e?.value) return
              return (
                <TutorialRewardListItem
                  key={idx}
                  title={e!.title}
                  value={e!.value}
                />
            )})}
          </div>
        )
      })}
      {showTotals && <div className={styles.group}>
        <div>Total</div>
        {Object.getOwnPropertyNames(totals).map((t, idx) => {
          const value = totals[t]
          return <TutorialRewardListItem 
            key={idx}
            title={t}
            value={formatPrimitiveValueToString(value) as string}
          />
        })}
      </div>}
    </div>
  </div>
}
