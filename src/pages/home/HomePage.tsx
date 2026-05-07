import { useCallback, useEffect, useState } from 'react'
import HomeNewMainCharacterModal from './HomeNewMainCharacterModal'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { LOCAL_STORAGE_KEYS } from '../../common/constants/LocalStorageKeys'
import type { CharacterClass, Character } from '../../interfaces/characters/Character.types'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import { useConfirm } from '../../providers/ConfirmProvider'
import { CharacterClassRepository } from '../../repository/characters/CharacterClassRepository'
import type { CharacterHistory } from '../../interfaces/history/History.types'
import CharacterHistoryComponent from '../../common/components/history/CharacterHistory'
import CharacterQuests from '../../common/components/quests/CharacterQuests'
import type { Quest, QuestGroup, QuestProgress } from '../../interfaces/quests/Quests.types'
import { QuestRepository } from '../../repository/quests/QuestRepository'
import { QuestGroupRepository } from '../../repository/quests/QuestGroupRepository'
import { DateTime } from 'luxon'
import { ITEM_CURRENCY_IDS } from '../../data/items/currency/Item.Currency.data'
import { ItemRepository } from '../../repository/items/ItemRepository'
import type { Item } from '../../interfaces/items/Item.types'
import CharacterInventory from '../../common/components/inventory/CharacterInventory'
import { TutorialOverlay, type TutorialStep } from '../../common/components/tutorial/TutorialOverlay'
import CharacterInfo from '../../common/components/characters/CharacterInfo'

export default function HomePage(){
  const [mainCharacter, setMainCharacter] = useLocalStorage<Character | undefined>(LOCAL_STORAGE_KEYS.CHARACTERS_MAIN, undefined)
  const [mainCharacterClass, setMainCharacterClass] = useState<CharacterClass | undefined>(undefined)
  const [newMainCharacterModalOpen, setNewMainCharacterModalOpen] = useState(false)
  const [inventories, setInventories] = useLocalStorage<Inventory[]>(LOCAL_STORAGE_KEYS.INVENTORIES, [])
  const [history, setHistory] = useLocalStorage<CharacterHistory[]>(LOCAL_STORAGE_KEYS.HISTORY, [])
  const [characterQuestProgress, setCharacterQuestProgress] = useLocalStorage<QuestProgress[]>(LOCAL_STORAGE_KEYS.QUEST_PROGRESS, [])
  const [quests, setQuests] = useState<Quest[]>([])
  const [questGroups, setQuestGroups] = useState<QuestGroup[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [showTutorial, setShowTutorial] = useState(mainCharacter ? false : true)

  const {showConfirm} = useConfirm()
  const newCharacterSteps = [
    {
      selector: '#tutorial-new-character',
      content: 'Click here to begin your journey.',
    },
  ]

  const steps: TutorialStep[] = [
    {
      selector: '#tutorial-current-quest',
      content: 'This will display the current quest you are on. You can only be on one quest at a time.',
    },
    {
      selector: '#tutorial-inventory',
      content: 'You can interact with inventory items here.',
    },
    {
      selector: '#tutorial-history',
      content: 'You can view recent history here.',
    }
  ]

  const handleResetEverything = useCallback(async () => {
    if(!await showConfirm({
      title: 'Are you sure?',
      message: 'This will reset everything in this browser\'s storage for this site. Are you sure you wish to continue?',
      isYesNo: true
    })) return

    setMainCharacter(undefined)
    setInventories([])
    setHistory([])
    setCharacterQuestProgress([])
  }, [])

  useEffect(() => {
    const load = async function () {
      if(mainCharacter){
        const classRepo = new CharacterClassRepository()
        const allClasses = await classRepo.list()
        
        setMainCharacterClass(allClasses.find(ac => ac.id === mainCharacter.classId))
        
        const itemRepo = new ItemRepository()
        setItems(await itemRepo.list())
        const questRepo = new QuestRepository()
        setQuests(await questRepo.list())
        const questGroupRepo = new QuestGroupRepository()
        setQuestGroups(await questGroupRepo.list())
      }
    }
    load()
  }, [mainCharacter])

  const handleAddHistory = useCallback(async (newHistory: CharacterHistory[]) => {
    const histories = []
    for(const h of newHistory){
      histories.push(h)
    }
    for(const h of history){
      histories.push(h)
    }
    setHistory(histories)
  }, [history])

  const handleAddInventory = useCallback((inventory: Inventory[]) => {
    const newInventories = []
    for(const i of inventory){
      newInventories.push(i)
    }
    for(const i of inventories){
      newInventories.push(i)
    }
    setInventories(newInventories)
  }, [inventories])

  const handleAddQuest = useCallback(async (quest: Quest, characterId: string) => {
    const progress = characterQuestProgress?.find(qp => qp.questId === quest.id && qp.characterId === characterId)
    if(progress && progress.status === 'in-progress'){
      return
    }

    const questProgress: QuestProgress = {
      characterId: characterId as string,
      questId: quest.id,
      startDate: DateTime.utc().toISO(),
      status: 'in-progress'
    }
    const newProgress = []
    newProgress.push(questProgress)
    for(const p of characterQuestProgress){
      newProgress.push(p)
    }
    setCharacterQuestProgress(newProgress)
  }, [quests, characterQuestProgress, mainCharacter])

  const mainCharacterExists = typeof mainCharacter?.name === 'string'
  const currencyPouch = inventories?.find(i => i.title === 'Currency')
  let totalGold = 0
  currencyPouch?.transactions?.map(txn => {
    if(txn.itemId === ITEM_CURRENCY_IDS.GOLD){
      totalGold += txn.quantity
    }
  })
  
  return <>
    {!mainCharacter && showTutorial === true  && <TutorialOverlay 
      steps={newCharacterSteps} 
      onCancel={() => {setShowTutorial(false)}} 
      onComplete={() => {
        //todo
        setShowTutorial(false)
      }}
    />}
    {showTutorial === true && <TutorialOverlay 
      steps={steps} 
      onCancel={() => {setShowTutorial(false)}} 
      onComplete={() => {
        //todo
        setShowTutorial(false)
      }}
    />}
    <HomeNewMainCharacterModal 
      mainCharacter={mainCharacter}
      rightTitle={'Create Main Character'}
      backdropHides={false}
      isOpen={newMainCharacterModalOpen}
      onClose={() => {setNewMainCharacterModalOpen(false)}}
      setMainCharacter={async (character: Character) => {
        setMainCharacter(character)
      }}
      addInventory={async (inventory: Inventory[]) => {
        handleAddInventory(inventory)
      }}
      addHistory={async (history: CharacterHistory[]) => {
        handleAddHistory(history)
      }}
      addQuest={async (quest: Quest, characterId: string) => {
        handleAddQuest(quest, characterId)
      }}
    >
      <></>
    </HomeNewMainCharacterModal>
    {newMainCharacterModalOpen === false && <div>
      <div className='page-main'>
        
        <div className='header-1'>
          <div className='page-actions'>
            {mainCharacter && <button className='basic'
              onClick={() => {setShowTutorial(true)}}
            >
              Home Tutorial
            </button>}
            <button id='tutorial-new-character' className='basic'
              onClick={() => {setNewMainCharacterModalOpen(true)}}
            >
              {mainCharacterExists ? `Rename ${mainCharacter.name}`: 'Create Main Character'}
            </button>
            <button className='danger'
              onClick={() => {handleResetEverything()}}
            >
              Reset Everything
            </button>
          </div>
        </div>

        {mainCharacter && <div className='page-modules'>
          <div id='tutorial-character'>
            <CharacterInfo character={mainCharacter as Character} characterClass={mainCharacterClass as CharacterClass} characterInventories={inventories.filter(i => i.characterId === mainCharacter?.id)} />
          </div>
          <div id='tutorial-current-quest'>
            <CharacterQuests 
              character={mainCharacter as Character} 
              characterQuestProgressItems={characterQuestProgress} 
              questGroups={questGroups} 
              quests={quests}
              showAllQuests={true}
              showCurrentQuest={true}
              characterInventories={inventories.filter(i => i.characterId === mainCharacter.id)}
              />
          </div>
          <div>
            <CharacterInventory 
                character={mainCharacter}
                inventories={inventories.filter(i => i.characterId === mainCharacter.id)}
                items={items}
              />
          </div>
          <div>
            <CharacterHistoryComponent character={mainCharacter as Character} history={history.filter(h => h.characterId === mainCharacter?.id)} />
          </div>
        </div>}
      </div>
    </div>}
  </>
}