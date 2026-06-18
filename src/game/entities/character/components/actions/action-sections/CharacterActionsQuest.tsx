import { useCallback } from 'react'
import type { QuestEntity } from '../../../../quest/types/QuestEntity.types'
import type { QuestGroupEntity } from '../../../../quest/types/QuestGroupEntity.types'
import { gameEventBus } from '../../../../../engine/event-bus/GameEventBus'
import styles from './CharacterActionsSection.module.css'
import CharacterActionsSection from './CharacterActionsSection'

interface Props {
  selectedQuest?: QuestEntity
  selectedQuestGroup?: QuestGroupEntity
  continuous: boolean
  characterId: string
  setShowQuestsModal: (value: boolean) => void
  setShowQuestModal: (value: boolean) => void
}

export default function CharacterActionsQuest(props: Props){
  const {
    selectedQuest,
    selectedQuestGroup,
    setShowQuestsModal,
    setShowQuestModal,
    continuous,
    characterId,
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
  >
    <div>
      <div className={styles.label}>
        {!selectedQuest && (
          <div>
            Select a quest.
          </div>
        )}
        {selectedQuest && (
          <button className='button-basic dark' onClick={() => {setShowQuestModal(true)}}>
            {selectedQuestGroup?.title} - {selectedQuest.title}
          </button>
        )}
      </div>
      <div className={styles.actions}>
        <button className="button-basic dark" onClick={() => setShowQuestsModal(true)}>
          CHOOSE QUEST
        </button>
        {selectedQuest && (
          <button className="button-basic dark" onClick={handleQuestStartClicked}>
            START QUEST
          </button>
        )}
      </div>
    </div>
  </CharacterActionsSection>
}