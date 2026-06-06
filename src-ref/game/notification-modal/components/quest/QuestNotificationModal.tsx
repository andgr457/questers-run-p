import styles from './QuestNotificationModal.module.css'
import type { Quest, QuestAction } from '../../../quest/types/Quest.types'
import NotificationModal from '../../NotificationModal'
import type { QuestRewardUI } from '../../../quest/types/QuestReward.types'

type Props = {
  open: boolean
  quest: Quest
  questAction: QuestAction
  questRewards: QuestRewardUI[]
  onClose: () => void
}

export default function QuestNotificationModal({ 
  onClose,
  open,
  quest,
  questAction,
  questRewards
}: Props) {
  const questActionContent = questAction === 'take' ? 'Received' :
    questAction === 'complete' ? 'Completed' : 'Abandoned'

  if(!open || !quest){
    return null
  }

  return <NotificationModal 
    title={(
      <>
        <h2>{quest?.title}</h2>
      </>
    )}
    content={(
      <>
        <h2>📜 Quest {questActionContent}</h2>

        <div className={styles.questBox}>
          <strong>Quest:</strong> {quest?.title}
          <br />
          <span>
            {quest.description}
          </span>
          {questActionContent === 'Completed' && <div className={styles.questRewards}>
            {questRewards.map(qr => {
              return <div>
                {typeof qr.xp === 'number' && <span><strong>XP:</strong> {qr.xp.toLocaleString()}</span> }
                {qr.itemId && <span><strong>{qr.itemName}</strong> {qr.itemAmount?.toLocaleString()}</span> }
                {qr.achivementId && <span><strong>Achivement:</strong> {qr.achievementName?.toLocaleString()}</span> }
              </div>
            })}
          </div>}
        </div>
      </>
    )}
    actions={(
      <>
        <button className='button' onClick={onClose}>
          Dismiss
        </button>
      </>
    )}
  />
}