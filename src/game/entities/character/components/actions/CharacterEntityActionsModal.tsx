import styles from './CharacterEntityActionsModal.module.css'

import type { CharacterEntity } from '../../types/Character.types'
import GameModalFull from '../../../../components/modals/GameModalFull'
import { useCallback, useState } from 'react'
import { activityRuntimeService } from '../../../../engine/ActivityRuntimeService'
import { gameClockService } from '../../../../engine/GameClockService'
import QuestEntityList from '../../../quest/components/list/QuestEntityList'
import type { QuestEntity } from '../../../quest/types/QuestEntity.types'

interface Props {
  open: boolean
  onClose: () => void
  character: CharacterEntity
}

export default function CharacterEntityActionsModal(props: Props){
  const {
    character,
    onClose,
    open
  } = props

  const [selectedQuest, setSelectedQuest] = useState<QuestEntity | undefined>(undefined)
  const [showQuestsModal, setShowQuestsModal] = useState(false)

  const handleQuestSelected = useCallback((quest: QuestEntity) => {
    setSelectedQuest(quest)
    setShowQuestsModal(false)
  }, [])

  const handleQuestStartClicked = useCallback(() => {
    const duractionReq = selectedQuest?.requirements.complete.find(r => r.timeMillis)

    activityRuntimeService.start({
      characterId: character.id,
      duration: duractionReq?.timeMillis ?? 2000,
      id: crypto.randomUUID(),
      startedAt: gameClockService.getNow(),
      status: 'active',
      type: 'questing',
      blocking: true,
      blockingAll: false,

    })
    onClose()
  }, [selectedQuest, character.id])

  if(showQuestsModal){
    return <GameModalFull
      isOpen={showQuestsModal}
      backdropHides={false}
      onClose={() => {
        setShowQuestsModal(false)
      }}
      closeButton={true}
      title={`Available Quests`}
    >
      <div>
        <QuestEntityList 
          onQuestClick={handleQuestSelected}
        />
        
      </div>
    </GameModalFull>
  }

  return <>
    <GameModalFull
      isOpen={open}
      backdropHides={true}
      onClose={onClose}
      closeButton={true}
      title={`${character.name} Actions`}
    >
      {/* quest section */}
      <div>
        {selectedQuest && <button 
          className='button-basic dark'
          onClick={handleQuestStartClicked}
        >
          START QUEST
        </button>}
        <button 
          className='button-basic dark'
          onClick={() => {setShowQuestsModal(true)}}
        >
          SELECT QUEST
        </button>
      </div>
    </GameModalFull>
  </>
}