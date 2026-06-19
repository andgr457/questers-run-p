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
import UpgradeEntityList from '../../../upgrade/components/list/UpgradeEntityList'
import UpgradeEntityDetail from '../../../upgrade/components/detail/UpgradeEntityDetail'
import type { UpgradeEntity } from '../../../upgrade/types/UpdateEntity.types'
import type { CharacterUpgradeEntity } from '../../../character-upgrade/types/CharacterUpgradeEntity.types'
import { GAME_QUEST_GROUPS } from '../../../quest/data/quest-groups/QuestGroups.data'

interface Props {
  open: boolean
  onClose: () => void
  character: CharacterEntity

  characterInventories: CharacterInventoryEntity[]
  inventoryItems: InventoryItemEntity[]
  characterUpgrades: CharacterUpgradeEntity[]
}

export default function CharacterEntityActionsModal(props: Props) {
  const { 
    character, 
    onClose, 
    open,
    characterInventories,
    inventoryItems,
    characterUpgrades,
  } = props

  const [selectedQuest, setSelectedQuest] = useState<QuestEntity | undefined>(undefined)
  const [selectedQuestGroup, setSelectedQuestGroup] = useState<QuestGroupEntity | undefined>(undefined)
  const [selectedViewQuest, setSelectedViewQuest] = useState<QuestEntity | undefined>(undefined)
  const [selectedViewQuestGroup, setSelectedViewQuestGroup] = useState<QuestGroupEntity | undefined>(undefined)
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null)
  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeEntity | undefined>(undefined)
  
  const [showQuestsModal, setShowQuestsModal] = useState(false)
  const [showQuestModal, setShowQuestModal] = useState(false)
  const [showInventoriesModal, setShowInventoriesModal] = useState(false)
  const [showUpgrades, setShowUpgrades] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const activity = activityRuntimeService.getActive(character.id)?.[0]
  
  const [continuous, setContinuous] = useState(activity?.continuous ?? false)

  const handleQuestChosen = useCallback((quest: QuestEntity) => {
    setSelectedQuest(quest)
    setSelectedQuestGroup(GAME_QUEST_GROUPS.find(g => g.id === quest.questGroupId))
    setShowQuestsModal(false)
  }, [])

  const handleShowQuestModal = useCallback((quest: QuestEntity) => {
    setSelectedViewQuest(quest)
    setSelectedViewQuestGroup(GAME_QUEST_GROUPS.find(g => g.id === quest.questGroupId))
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
      </div>
      <div className={`${isActive ? styles.sectionsLocked : styles.sections}`}>
        <button className='button-basic dark'
          onClick={() => {setContinuous(!continuous)}}
        >
          CONTINUOUS {continuous ? 'ON' : 'OFF'}
        </button>
        <button className='button-basic dark' onClick={() => setShowInventoriesModal(true)}>
          Inventory
        </button>
        <button className='button-basic dark' onClick={() => setShowUpgrades(true)}>
          Upgrades
        </button>
      </div>
      <div className={`${isActive ? styles.sectionsLocked : styles.sections}`}>
        
        <CharacterActionsTavern 
          character={character}
        />
        
        <CharacterActionsQuest 
          characterId={character.id}
          continuous={continuous}
          selectedQuest={selectedQuest}
          selectedQuestGroup={selectedQuestGroup}
          setShowQuestsModal={setShowQuestsModal}
          setShowQuestModal={handleShowQuestModal}
        />

      </div>
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
        <QuestEntityList 
          onQuestChosen={handleQuestChosen} 
          onQuestView={handleShowQuestModal} 
        />
      </div>
    </GameModalFull>

    <GameModalFull
      backdropHides={false}
      closeButton={true}
      isOpen={showQuestModal}
      onClose={() => {
        setShowQuestModal(false)
      }}
      title={`Quest Detail`}
    >
      <QuestEntityCard 
        quest={selectedViewQuest as QuestEntity} 
        questGroup={selectedViewQuestGroup as QuestGroupEntity} 
      />
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

    <GameModalFull
      isOpen={showUpgrades}
      backdropHides={false}
      onClose={() => {
        setShowUpgrades(false)
      }}
      closeButton={true}
      title={`UPGRADES`}
    >
      <div className={styles.section}>
        <CharacterEntityListRecord 
          character={character}
          onClick={() => {}}
        />
        <UpgradeEntityList 
          onView={(upgrade: UpgradeEntity) => {
            setSelectedUpgrade(upgrade)
            setShowUpgrade(true)
          }}
          onUpgrade={(upgrade: UpgradeEntity) => {
            
          }}
        />
      </div>
    </GameModalFull>

    <GameModalFull
      isOpen={showUpgrade}
      backdropHides={false}
      onClose={() => {
        setShowUpgrade(false)
      }}
      closeButton={true}
      title={`UPGRADE: ${selectedUpgrade?.titleString}`}
    >
      <div className={styles.section}>
        <CharacterEntityListRecord 
          character={character}
          onClick={() => {}}
        />
        <UpgradeEntityDetail 
          upgrade={selectedUpgrade as UpgradeEntity}
          
        />
      </div>
    </GameModalFull>
  </>
  )
}