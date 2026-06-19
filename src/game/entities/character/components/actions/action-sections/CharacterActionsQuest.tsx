import { useCallback } from 'react'
import type { QuestEntity } from '../../../../quest/types/QuestEntity.types'
import type { QuestGroupEntity } from '../../../../quest/types/QuestGroupEntity.types'
import { gameEventBus } from '../../../../../engine/event-bus/GameEventBus'
import styles from './CharacterActionsSection.module.css'
import CharacterActionsSection from './CharacterActionsSection'
import QuestEntityListRecord from '../../../../quest/components/list/QuestEntityListRecord'

interface Props {
  locked: boolean
  selectedQuest?: QuestEntity
  selectedQuestGroup?: QuestGroupEntity
  continuous: boolean
  characterId: string
  setShowQuestsModal: (value: boolean) => void
  setShowQuestModal: (quest: QuestEntity, questGroup: QuestGroupEntity) => void
}

export default function CharacterActionsQuest(props: Props){
  const {
    selectedQuest,
    selectedQuestGroup,
    setShowQuestsModal,
    setShowQuestModal,
    continuous,
    characterId,
    locked,
  } = props

  const handleQuestStartClicked = useCallback(() => {
    if (!selectedQuest) return

    gameEventBus.emit({
      type: 'quest:start',
      characterId: characterId,
      continuous,
      meta: {
        questId: selectedQuest.id
      }
    })

  }, [selectedQuest, characterId, continuous])

  return <CharacterActionsSection 
    title='quests'
    locked={locked}
  >
    <div>
      <div className={styles.label}>
        Quest to gain XP, gold, and loot.
      </div>
      <div className={styles.actions}>
        

        <div className={styles.action}>
          <button className="button-basic dark" onClick={() => setShowQuestsModal(true)}>
            CHOOSE QUEST
          </button>
        </div>
        {selectedQuest && (
          <div className={styles.action}>

            <button className="button-basic gold-outline" onClick={handleQuestStartClicked}>
              START QUEST
            </button>
          </div>
        )}
        {selectedQuest && (
          <>
          <div>
            <QuestEntityListRecord 
              onView={() => {
                setShowQuestModal(selectedQuest, selectedQuestGroup as QuestGroupEntity)
              }}
              quest={selectedQuest}
              questGroup={selectedQuestGroup as QuestGroupEntity}
            />            
          </div>
          </>
        )}
      </div>
    </div>
  </CharacterActionsSection>
}