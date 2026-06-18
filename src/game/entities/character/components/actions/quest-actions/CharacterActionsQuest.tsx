import { useCallback } from 'react'
import type { QuestEntity } from '../../../../quest/types/QuestEntity.types'
import type { QuestGroupEntity } from '../../../../quest/types/QuestGroupEntity.types'
import { gameEventBus } from '../../../../../engine/event-bus/GameEventBus'
import styles from '../CharacterEntityActionsModal.module.css'

interface Props {
  selectedQuest?: QuestEntity
  selectedQuestGroup?: QuestGroupEntity
  setShowQuestsModal: (value: boolean) => void
  continuous: boolean
  characterId: string
}

export default function CharacterActionsQuest(props: Props){
  const {
    selectedQuest,
    selectedQuestGroup,
    setShowQuestsModal,
    continuous,
    characterId,
  } = props

  const handleQuestStartClicked = useCallback(() => {
    if (!selectedQuest) return

    gameEventBus.emit({
      type: 'quest:start',
      characterId: characterId,
      questId: selectedQuest.id,
      continuous
    })

  }, [selectedQuest, characterId, continuous])

  return <div>
    <div className={styles.sectionLabel}>
      {!selectedQuest && (
        <div>
          QUEST: Select a quest.
        </div>
      )}
      {selectedQuest && (
        <div>
          QUEST: {selectedQuestGroup?.title} - {selectedQuest.title}
        </div>
      )}

    </div>
    <button className="button-basic dark" onClick={() => setShowQuestsModal(true)}>
      CHOOSE QUEST
    </button>
    {selectedQuest && (
      <button className="button-basic dark" onClick={handleQuestStartClicked}>
        START QUEST
      </button>
    )}
  </div>
}