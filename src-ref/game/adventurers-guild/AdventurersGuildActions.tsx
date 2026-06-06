import './styles/adventurersGuildActions.css'

const ACTIONS = [
  'View Quest Board',
  'Look For Party Members',
  'Check Guild Rank',
  'Abandon Active Quest',
  'Buy / Sell Mob Parts',
  'Create A Quest',
  'Socialize',
]

export function AdventurersGuildActions() {
  return (
    <div className='guild-actions'>
      {ACTIONS.map(action => (
        <button
          key={action}
          className='guild-action-button'
        >
          {action}
        </button>
      ))}
    </div>
  )
}