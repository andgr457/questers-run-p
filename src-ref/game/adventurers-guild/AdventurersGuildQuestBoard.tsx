import './styles/adventurersGuildQuestBoard.css'

const QUESTS = [
  {
    title: 'Goblin Hunt',
    difficulty: 'D',
    reward: '120g',
  },

  {
    title: 'Escort Merchant Caravan',
    difficulty: 'C',
    reward: '340g',
  },

  {
    title: 'Clear Wolf Den',
    difficulty: 'C',
    reward: '260g',
  },

  {
    title: 'Retrieve Lost Shipment',
    difficulty: 'B',
    reward: '520g',
  },
]

export function AdventurersGuildQuestBoard() {
  return (
    <div className='guild-quest-board'>
      <div className='guild-quest-board-header'>
        Active Contracts
      </div>

      <div className='guild-quest-list'>
        {QUESTS.map(quest => (
          <button
            key={quest.title}
            className='guild-quest-entry'
          >
            <div className='guild-quest-main'>
              <div className='guild-quest-title'>
                {quest.title}
              </div>

              <div className='guild-quest-reward'>
                Reward: {quest.reward}
              </div>
            </div>

            <div className='guild-quest-rank'>
              {quest.difficulty}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}