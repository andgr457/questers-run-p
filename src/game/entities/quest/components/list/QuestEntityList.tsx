import { useState } from 'react'
import { GAME_QUEST_GROUPS } from '../../data/quest-groups/QuestGroups.data'
import type { QuestEntity } from '../../types/QuestEntity.types'
import { getQuestsByGroupId } from '../../utils/QuestEntity.utils'
import styles from './QuestEntityList.module.css'
import QuestEntityListRecord from './QuestEntityListRecord'
import GameModalFull from '../../../../components/modals/GameModalFull'
import type { QuestGroupEntity } from '../../types/QuestGroupEntity.types'
import QuestEntityCard from '../QuestEntityCard'

interface Props {
  onQuestClick: (quest: QuestEntity) => void
}

export default function QuestEntityList(props: Props){
  const {
    onQuestClick
  } = props
  const [showQuestModal, setShowQuestModal] = useState(false)
  const [selectedQuest, setSelectedQuest] = useState<QuestEntity | undefined>(undefined)
  const [selectedQuestGroup, setSelectedQuestGroup] = useState<QuestGroupEntity | undefined>(undefined)

  const handleShowModal = (quest: QuestEntity, questGroup: QuestGroupEntity) => {
    setSelectedQuest(quest)
    setSelectedQuestGroup(questGroup)
    setShowQuestModal(true)
  }

  return <div>
    <GameModalFull
      backdropHides={false}
      closeButton={true}
      isOpen={showQuestModal}
      onClose={() => setShowQuestModal(false)}
      title={`QUEST: ${selectedQuest?.titleString}`}
    >
      <QuestEntityCard quest={selectedQuest as QuestEntity} questGroup={selectedQuestGroup as QuestGroupEntity} />
    </GameModalFull>
    {GAME_QUEST_GROUPS.map(group => {
      const quests = getQuestsByGroupId(group.id)
      return <div className={styles.groupList}>
        <div className={styles.groupListHeader}>
          {group.title}
        </div>
        <div className={styles.sectionLabel}>
          {group.description}
        </div>
        
        <div className={styles.questList}>
          {quests.map(quest => {
            
            return <QuestEntityListRecord 
              quest={quest}
              questGroup={group}
              onSelect={onQuestClick}
              onView={handleShowModal}
            />
          })}       
             
        </div>
      </div>
    })}
  </div>
}