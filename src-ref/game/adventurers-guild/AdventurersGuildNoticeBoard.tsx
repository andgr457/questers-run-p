import './styles/adventurersGuildNoticeBoard.css'

const NOTICES = [
  'Bridge repairs underway near Oakmere.',
  'Missing caravan reported on the western road.',
  'Guild curfew now active after midnight.',
  'Local inn seeking rat exterminators.',
]

export function AdventurersGuildNoticeBoard() {
  return (
    <div className='guild-notice-board'>
      <div className='guild-notice-header'>
        Notice Board
      </div>

      <div className='guild-notice-list'>
        {NOTICES.map(notice => (
          <div
            key={notice}
            className='guild-notice'
          >
            • {notice}
          </div>
        ))}
      </div>
    </div>
  )
}