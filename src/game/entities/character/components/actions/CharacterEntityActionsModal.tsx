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
import CharacterInventoryList from '../../../character-inventory/components/list/CharacterInventoryList'
import type { CharacterInventoryEntity } from '../../../character-inventory/types/CharacterInventoryEntity.types'
import type { InventoryItemEntity } from '../../../inventory-item/types/InventoryItemEntity.types'
import CharacterInventoryDetail from '../../../character-inventory/components/detail/CharacterInventoryDetail'

interface Props {
  open: boolean
  onClose: () => void
  character: CharacterEntity

  characterInventories: CharacterInventoryEntity[]
  inventoryItems: InventoryItemEntity[]
}

export default function CharacterEntityActionsModal(props: Props) {
  const { 
    character, 
    onClose, 
    open,
    characterInventories,
    inventoryItems,
  } = props

  const [selectedQuest, setSelectedQuest] = useState<QuestEntity | undefined>(undefined)
  const [selectedQuestGroup, setSelectedQuestGroup] = useState<QuestGroupEntity | undefined>(undefined)
  const [selectedViewQuest, setSelectedViewQuest] = useState<QuestEntity | undefined>(undefined)
  const [selectedViewQuestGroup, setSelectedViewQuestGroup] = useState<QuestGroupEntity | undefined>(undefined)
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null)

  const [showQuestsModal, setShowQuestsModal] = useState(false)
  const [showQuestModal, setShowQuestModal] = useState(false)
  const [showInventoriesModal, setShowInventoriesModal] = useState(false)
  
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
  }, [])

  const handleCancelActivity = useCallback(() => {
    if (!activity) return

    setContinuous(false)
    
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
        character={character}
        onClick={() => {}}
      />
      
      <div className={styles.section}>
        {activity?.status  && <button className="button-basic dark" onClick={handleCancelActivity}>
          STOP ACTIVITY
        </button>}
        {!activity?.status && <button className='button-basic dark'>
          NO ACTIVITY
        </button>}
        <button className='button-basic dark' onClick={() => setShowInventoriesModal(true)}>
          Inventory
        </button>
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
          character={character}
          onClick={() => {}}
        />
        <QuestEntityList onQuestChosen={handleQuestChosen} onQuestView={handleShowQuestModal} />
      </div>
    </GameModalFull>

    <GameModalFull
      isOpen={showInventoriesModal}
      backdropHides={false}
      onClose={() => {
        setShowInventoriesModal(false)
      }}
      closeButton={true}
      title="Inventory"
    >
      <div className={styles.section}>
        <CharacterEntityListRecord 
          character={character}
          onClick={() => {}}
        />
        <CharacterInventoryList 
          characterInventories={characterInventories}
          inventoryItems={inventoryItems}
          onSelectInventory={(characterInventoryId: string) => {
            setSelectedInventoryId(characterInventoryId)
          }}
        />
      </div>
    </GameModalFull>

    <GameModalFull
      isOpen={selectedInventoryId ? true : false}
      backdropHides={false}
      onClose={() => {
        setSelectedInventoryId('')
      }}
      closeButton={true}
      title="Inventory"
    >
      <div className={styles.section}>
        <CharacterEntityListRecord 
          character={character}
          onClick={() => {}}
        />
        <CharacterInventoryDetail 
          characterInventory={characterInventories.find(i => i.id === selectedInventoryId) as CharacterInventoryEntity}
          inventoryItems={inventoryItems}
          onSelectItem={() => {
            console.log('todo: item detail')
          }}
        />
      </div>
    </GameModalFull>

  </>
  )
}