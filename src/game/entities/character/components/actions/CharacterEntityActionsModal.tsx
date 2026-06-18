import styles from './CharacterEntityActionsModal.module.css'

import type { CharacterEntity } from '../../types/Character.types'
import GameModalFull from '../../../../components/modals/GameModalFull'
import { useCallback, useState } from 'react'
import { activityRuntimeService } from '../../../../engine/activity/ActivityRuntimeService'
import QuestEntityList from '../../../quest/components/list/QuestEntityList'
import type { QuestEntity } from '../../../quest/types/QuestEntity.types'
import { gameEventBus } from '../../../../engine/event-bus/GameEventBus'
import CharacterActionsQuest from './action-sections/CharacterActionsQuest'
import CharacterEntityListRecord from '../list/CharacterEntityListRecord'
import QuestEntityCard from '../../../quest/components/QuestEntityCard'
import type { QuestGroupEntity } from '../../../quest/types/QuestGroupEntity.types'
import CharacterActionsTavern from './action-sections/CharacterActionsTavern'

interface Props {
  open: boolean
  onClose: () => void
  character: CharacterEntity
}

export default function CharacterEntityActionsModal(props: Props) {
  const { character, onClose, open } = props

  const [selectedQuest, setSelectedQuest] = useState<QuestEntity | undefined>(undefined)
  const [selectedQuestGroup, setSelectedQuestGroup] = useState<QuestGroupEntity | undefined>(undefined)
  const [selectedViewQuest, setSelectedViewQuest] = useState<QuestEntity | undefined>(undefined)
  const [selectedViewQuestGroup, setSelectedViewQuestGroup] = useState<QuestGroupEntity | undefined>(undefined)

  const [showQuestsModal, setShowQuestsModal] = useState(false)
  const [showQuestModal, setShowQuestModal] = useState(false)

  const activity = activityRuntimeService.getActive(character.id)?.[0]
  
  const [continuous, setContinuous] = useState(activity?.continuous ?? false)

  const handleQuestChosen = useCallback((quest: QuestEntity, questGroup: QuestGroupEntity) => {
    setSelectedQuest(quest)
    setSelectedQuestGroup(questGroup)
    setShowQuestsModal(false)
  }, [])

  const handleShowQuestModal = useCallback((quest: QuestEntity, questGroup: QuestGroupEntity) => {
    setSelectedViewQuest(quest)
    setSelectedViewQuestGroup(questGroup)
    setShowQuestsModal(false)
    setShowQuestModal(true)
  }, [showQuestsModal])

  const handleCancelActivity = useCallback(() => {
    if (!activity) return

    activityRuntimeService.cancel(character.id, activity.id)

    gameEventBus.emit({
      type: 'quest:cancel',
      characterId: character.id,
      meta: {
        questId: activity.meta?.questId
      }
    })
  }, [activity, character.id])

  const isActive = activity?.status === 'active'
  return (
  <>
    <GameModalFull
      isOpen={open}
      backdropHides={true}
      onClose={onClose}
      closeButton={true}
      title={`${character.name} Actions`}
    >
      <CharacterEntityListRecord 
        canShowActions={false}
        character={character}
      />
      
      <div className={styles.section}>
        {activity?.status  && <button className="button-basic dark" onClick={handleCancelActivity}>
          STOP ACTIVITY
        </button>}
        {!activity?.status && <button className='button-basic dark'>
          NO ACTIVITY
        </button>}
      </div>
      <div className={`${isActive ? styles.sectionsLocked : styles.sections}`}>
        <button className='button-basic dark'
          onClick={() => {setContinuous(!continuous)}}
        >
          CONTINUOUS {continuous ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className={`${isActive ? styles.sectionsLocked : styles.sections}`}>
        
        <div className={styles.section}>
          <div className={styles.sectionContent}>
            <CharacterActionsTavern 
              character={character}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionContent}>
            <CharacterActionsQuest 
              characterId={character.id}
              continuous={continuous}
              selectedQuest={selectedQuest}
              selectedQuestGroup={selectedQuestGroup}
              setShowQuestsModal={setShowQuestsModal}
              setShowQuestModal={setShowQuestModal}
            />
          </div>
        </div>



      </div>
    </GameModalFull>

    <GameModalFull
      backdropHides={false}
      closeButton={true}
      isOpen={showQuestModal && !showQuestsModal}
      onClose={() => {
        setShowQuestModal(false)
      }}
      title={`QUEST: ${selectedViewQuest?.titleString}`}
    >
      <QuestEntityCard quest={selectedViewQuest as QuestEntity} questGroup={selectedViewQuestGroup as QuestGroupEntity} />
    </GameModalFull>

    <GameModalFull
      isOpen={showQuestsModal}
      backdropHides={false}
      onClose={() => {
        setShowQuestsModal(false)
      }}
      closeButton={true}
      title="Available Quests"
    >
      <div className={styles.section}>
        <CharacterEntityListRecord 
          canShowActions={false}
          character={character}
        />
        <QuestEntityList onQuestChosen={handleQuestChosen} onQuestView={handleShowQuestModal} />
      </div>
    </GameModalFull>

    

  </>
  )
}