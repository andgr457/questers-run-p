import { GAME_QUEST_GROUPS } from '../../data/quest-groups/QuestGroups.data'
import type { QuestEntity } from '../../types/QuestEntity.types'
import { getQuestsByGroupId } from '../../utils/QuestEntity.utils'
import styles from './QuestEntityList.module.css'
import QuestEntityListRecord from './QuestEntityListRecord'
import type { QuestGroupEntity } from '../../types/QuestGroupEntity.types'

interface Props {
  onQuestChosen: (quest: QuestEntity, questGroup: QuestGroupEntity) => void
  onQuestView: (quest: QuestEntity, questGroup: QuestGroupEntity) => void
}

export default function QuestEntityList(props: Props){
  const {
    onQuestChosen,
    onQuestView,
  } = props

  return <div>

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
              onSelect={onQuestChosen}
              onView={onQuestView}
            />
          })}       
             
        </div>
      </div>
    })}
  </div>
}