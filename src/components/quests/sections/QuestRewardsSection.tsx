import type { QuestRewardUI } from '../../../interfaces/quests/Quests.types'

interface Props {
  rewards: QuestRewardUI[]
}

export default function QuestRewardsSection({
  rewards,
}: Props) {
  return (
    <div>
      <div className="quest-item-requirements-header success">
        Rewards
      </div>

      <div className="quest-item-requirements-list">
        {rewards.map((r, index) => (
          <div
            key={index}
            className="quest-item-requirements-item"
          >
            {typeof r.xp === 'number' && (
              <>
                XP:{' '}
                <strong>
                  {r.xp.toLocaleString()}
                </strong>
              </>
            )}

            {r.itemId &&
              typeof r.itemAmount === 'number' && (
                <>
                  {r.itemName}:{' '}
                  <strong>{r.itemAmount}</strong>
                </>
              )}

            {r.achievementId && (
              <>
                Achievement:{' '}
                <strong>
                  {r.achievementTitle}
                </strong>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}