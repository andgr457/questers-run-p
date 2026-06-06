import './styles/adventurersGuildRankPanel.css'

const RANK = {
  tier: 'D',
  title: 'Novice Adventurer',
  reputation: 12,
  nextTierAt: 100,
}

export function AdventurersGuildRankPanel() {
  return (
    <div className='guild-rank-panel'>
      <div className='guild-rank-header'>
        Guild Status
      </div>

      <div className='guild-rank-body'>
        <div className='guild-rank-tier'>
          {RANK.tier}
        </div>

        <div className='guild-rank-info'>
          <div className='guild-rank-title'>
            {RANK.title}
          </div>

          <div className='guild-rank-rep'>
            Reputation: {RANK.reputation} / {RANK.nextTierAt}
          </div>
        </div>
      </div>
    </div>
  )
}