import styles from './CharacterEntityActionsModal.module.css'

import type { CharacterEntity } from '../../types/Character.types'
import GameModalFull from '../../../../components/modals/GameModalFull'
import { useCallback, useState } from 'react'
import { activityRuntimeService } from '../../../../engine/activity/ActivityRuntimeService'
import QuestEntityList from '../../../quest/components/list/QuestEntityList'
import type { QuestEntity } from '../../../quest/types/QuestEntity.types'
import { getQuestGroupById } from '../../../quest/utils/QuestEntity.utils'
import CharacterEntityActionsCharacter from './CharacterEntityActionsCharacter'
import { gameEventBus } from '../../../../engine/event-bus/GameEventBus'

interface Props {
  open: boolean
  onClose: () => void
  character: CharacterEntity
}

export default function CharacterEntityActionsModal(props: Props) {
  const { character, onClose, open } = props

  const [selectedQuest, setSelectedQuest] = useState<QuestEntity | undefined>(undefined)
  const [showQuestsModal, setShowQuestsModal] = useState(false)
  
  const activity = activityRuntimeService.getActive(character.id)?.[0]
  
  const [continuous, setContinuous] = useState(activity?.continuous ?? false)

  const handleQuestSelected = useCallback((quest: QuestEntity) => {
    setSelectedQuest(quest)
    setShowQuestsModal(false)
  }, [])

  const handleQuestStartClicked = useCallback(() => {
    if (!selectedQuest) return

    gameEventBus.emit({
      type: 'quest:start',
      characterId: character.id,
      questId: selectedQuest.id,
      continuous
    })

  }, [selectedQuest, character.id, onClose, continuous])

  const handleCancelActivity = useCallback(() => {
    if (!activity) return

    activityRuntimeService.cancel(character.id, activity.id)

    gameEventBus.emit({
      type: 'quest:cancel',
      characterId: character.id,
      questId: activity.meta?.questId ?? ''
    })
  }, [activity, character.id])

  if (showQuestsModal) {
    return (
      <GameModalFull
        isOpen={true}
        backdropHides={false}
        onClose={() => setShowQuestsModal(false)}
        closeButton={true}
        title="Available Quests"
      >
        <div className={styles.section}>
          <CharacterEntityActionsCharacter canShowActions={false} character={character} />
          <QuestEntityList onQuestClick={handleQuestSelected} />
        </div>
      </GameModalFull>
    )
  }

  const selectedQuestGroup = getQuestGroupById(selectedQuest?.questGroupId as string)

  return (
    <GameModalFull
      isOpen={open}
      backdropHides={true}
      onClose={onClose}
      closeButton={true}
      title={`${character.name} Actions`}
    >
      <CharacterEntityActionsCharacter canShowActions={false} character={character} />
      <div className={styles.section}>
        <button className='button-basic dark'
          onClick={() => {setContinuous(!continuous)}}
        >
          CONTINUOUS {continuous ? 'ON' : 'OFF'}
        </button>
        {activity && <button className="button-basic dark" onClick={handleCancelActivity}>
          STOP ACTIVITY
        </button>}
      </div>
      <div className={styles.section}>


        <button className="button-basic dark" onClick={() => setShowQuestsModal(true)}>
          CHOOSE
        </button>

        {selectedQuest && (
          <button className="button-basic dark" onClick={handleQuestStartClicked}>
            START
          </button>
        )}

        {selectedQuest && activity?.status === 'active' && <button className="button-basic dark" onClick={handleCancelActivity}>
          STOP
        </button>}

        {activity && (
          <div>
            ACTIVE: {activity.type} - {activity.meta?.questName}
          </div>
        )}

        {selectedQuest && (
          <div>
            QUEST: {selectedQuestGroup?.title} - {selectedQuest.title}
          </div>
        )}
      </div>
    </GameModalFull>
  )
}