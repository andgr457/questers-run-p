import styles from './CharacterEntityActionsModal.module.css'

import type { CharacterEntity } from '../types/Character.types'
import GameModalFull from '../../../components/modals/GameModalFull'
import { useCallback, useState } from 'react'
import { activityRuntimeService } from '../../../engine/ActivityRuntimeService'
import { gameClockService } from '../../../engine/GameClockService'

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

  const [selectedQuest, setSelectedQuest] = useState('')
  const [showQuestsModal, setShowQuestsModal] = useState(false)

  const handleQuestClicked = useCallback(() => {
    if(!selectedQuest){
      setShowQuestsModal(true)
      return
    }

    activityRuntimeService.start({
      characterId: character.id,
      duration: 15000,
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
        <button 
          className='button-basic dark'
          onClick={() => {
            setSelectedQuest('1')
            setShowQuestsModal(false)
          }}
        >
          SELECT QUEST 1
        </button>
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
      <div>
        <button 
          className='button-basic dark'
          onClick={handleQuestClicked}
        >
          QUEST
        </button>
      </div>
    </GameModalFull>
  </>
}