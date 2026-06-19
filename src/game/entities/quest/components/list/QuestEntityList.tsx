import { GAME_QUEST_GROUPS } from '../../data/quest-groups/QuestGroups.data'
import type { QuestEntity } from '../../types/QuestEntity.types'
import { getQuestsByGroupId } from '../../utils/QuestEntity.utils'
import GameList from '../../../../components/ui/list/GameList'
import QuestEntityCard from '../QuestEntityCard'

interface Props {
  onQuestChosen: (quest: QuestEntity) => void
  onQuestView: (quest: QuestEntity) => void
}

export default function QuestEntityList(props: Props){
  const {
    onQuestChosen,
    onQuestView,
  } = props

  return <div>
    
    {GAME_QUEST_GROUPS.map(group => {
      const quests = getQuestsByGroupId(group.id)
      return <div>
        <div className='game-list-item-header' style={{textAlign: 'left', padding: '5px', marginTop: '5px', marginLeft: '5px'}}>
          {group.title}
        </div>
        <GameList<QuestEntity> 
          actions={[
            {
              name: 'CHOOSE',
              fn: onQuestChosen
            },
            {
              name: 'VIEW',
              fn: onQuestView
            }
          ]}
          entities={quests}
          getEntityContent={(entity) => {
            return <QuestEntityCard 
              quest={entity}
              questGroup={group}
            />
          }}
        />
      </div>
      
      // <div className={styles.groupList}>
      //   <div className={styles.groupListHeader}>
      //     {group.title}
      //   </div>
      //   <div className={styles.sectionLabel}>
      //     {group.description}
      //   </div>
        
      //   <div className={styles.questList}>
      //     {quests.map(quest => {
            
      //       return <QuestEntityListRecord 
      //         quest={quest}
      //         questGroup={group}
      //         onSelect={onQuestChosen}
      //         onView={onQuestView}
      //       />
      //     })}       
             
      //   </div>
      // </div>
    })}
  </div>
}