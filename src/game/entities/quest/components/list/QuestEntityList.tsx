import { GAME_QUEST_GROUPS } from '../../data/quest-groups/QuestGroups.data'
import type { QuestEntity } from '../../types/QuestEntity.types'
import { getQuestsByGroupId } from '../../utils/QuestEntity.utils'
import styles from './QuestEntityList.module.css'
import QuestEntityListRecord from './QuestEntityListRecord'

interface Props {
  onQuestClick: (quest: QuestEntity) => void
}

export default function QuestEntityList(props: Props){
  const {
    onQuestClick
  } = props
  return <div>
    {GAME_QUEST_GROUPS.map(group => {
      const quests = getQuestsByGroupId(group.id)
      return <div className={styles.groupList}>
        <div className={styles.groupListHeader}>
          {group.title}
        </div>
        <div className={styles.groupListMeta}>
          {group.description}
        </div>
        <div className={styles.questList}>
          {quests.map(quest => {
            
            return <QuestEntityListRecord 
              quest={quest}
              onClick={onQuestClick}
            />
          })}
        </div>
      </div>
    })}
  </div>
}