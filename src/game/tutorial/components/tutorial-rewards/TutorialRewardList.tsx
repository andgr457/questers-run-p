import type { TutorialReward } from '../../types/Tutorial.types'
import styles from './TutorialRewardList.module.css'
import TutorialRewardListItem from './TutorialRewardListItem'

interface Props {
  rewards: TutorialReward[]
}

export default function TutorialRewardList(props: Props){
  const {
    rewards
  } = props
  return <div className={styles.wrapper}>
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
          <div>{`${r.type === 'characters' ? 'All ' : ''}${r.type}`}</div>

          {entries.map((e, idx) => (
            <TutorialRewardListItem
              key={idx}
              title={e!.title}
              value={e!.value}
            />
          ))}
        </div>
      )
    })}
  </div>
}
