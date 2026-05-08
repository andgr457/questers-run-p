import { useCallback, useEffect, useMemo, useState } from 'react'
import NewCharacterModal from '../../common/components/characters/NewCharacterModal'
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
import { useNavigate } from 'react-router-dom'
import CharacterQuestCurrent from '../../common/components/quests/CharacterQuestCurrent'
import PageHeader from '../../common/components/PageHeader'
import PageLayout from '../PageLayout'

export default function OverviewPage(){
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
  const [expandInventory, setExpandInventory] = useState(true)
  const [expandHistory, setExpandHistory] = useState(false)
  const [expandCharacter, setExpandCharacter] = useState(true)

  const {showConfirm} = useConfirm()
  const navigate = useNavigate()

  const handleResetEverything = useCallback(async () => {
    if(!await showConfirm({
      title: 'Are you sure?',
      message: 'This will reset everything in this browser\'s storage for this site. Are you sure you wish to continue?',
      isYesNo: true
    })) return

    setMainCharacter(null as any)
    setInventories([])
    setHistory([])
    setCharacterQuestProgress([])
    window.location.reload()
  }, [])

  useEffect(() => {
    const load = async function () {
      if(mainCharacter?.name){
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

  const tutorialSteps = useMemo<TutorialStep[]>(() => {
    if(!mainCharacter?.name){
      return [
        {
          selector: '#tutorial-new-character',
          content: 'Click here to begin your journey.',
          action: () => {
            setNewMainCharacterModalOpen(true)
          }
        }
      ]
    }

    const wouldBeCurrencyId = `${mainCharacter?.id}__${inventories?.find(inv => inv.characterId === mainCharacter?.id && inv.title === 'Currency')?.id}`
    const wouldBeNapsackId = `${mainCharacter?.id}__${inventories?.find(inv => inv.characterId === mainCharacter?.id && inv.title === 'Napsack')?.id}`

    return [
      {
        selector: '#tutorial-character',
        content: 'This will display your stats and other information like counts of various things while you journey.',
        action: () => {navigate({ hash: '#tutorial-current-quest' })},
        waitMillis: 500
      },
      {
        selector: '#tutorial-current-quest',
        content: 'This will display current quest if you are on one. You will need to head to the adventurer\'s guild to manage your current quest through the guild clerk.',
        action: () => {navigate({ hash: '#tutorial-inventory' })},
        waitMillis: 500
      },
      {
        selector: '#tutorial-inventory',
        content: 'You can interact with inventory items here.',
        action: () => {navigate({ hash: `#${wouldBeCurrencyId}` })},
        waitMillis: 200
      },
      {
        selector: `#${wouldBeCurrencyId}`,
        content: 'You start with 20 gold. The currency pouch can contain any type of currency without limit.',
        action: () => {navigate({ hash: `#${wouldBeNapsackId}` })},
        waitMillis: 200
      },
      {
        selector: `#${wouldBeNapsackId}`,
        content: 'You start with an 8 slot napsack pouch that contains 5 health potions. Items stack unless they are not the same stats. So be sure to bank or trade items regularly to avoid full inventory issues.',
        action: () => {navigate({ hash: '#tutorial-history' })},
        waitMillis: 500
      },
      {
        selector: '#tutorial-history',
        content: 'You can view recent history here. Click "show" to expand.',
        action: () => {setExpandHistory(true); navigate({hash: '#hi__0__0'})},
        waitMillis: 200
      },
      {
        selector: '#hi__0__0',
        content: 'These history items show item gains, achievements earned, quest received and complete, and groups them into days.',
        action: () => {setExpandHistory(false); navigate({hash: '#overview-top'})},
        waitMillis: 200
      }
    ]
  }, [mainCharacter, inventories])
  const characterInventories = inventories.filter(i => i.characterId === mainCharacter?.id)

  return <>
    {!mainCharacter?.name && showTutorial === true  && <TutorialOverlay 
      steps={tutorialSteps} 
      onCancel={() => {setShowTutorial(false)}} 
      onComplete={() => {
        //todo
        setShowTutorial(false)
      }}
      posTop={30}

    />}
    {mainCharacter?.name && showTutorial === true && <TutorialOverlay 
      steps={tutorialSteps} 
      onCancel={() => {setShowTutorial(false)}} 
      onComplete={() => {
        //todo
        setShowTutorial(false)
      }}
    />}
    <NewCharacterModal 
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
    </NewCharacterModal>
    {newMainCharacterModalOpen === false && <div id='overview-top'>
      <div className='page-main'>
        <PageHeader title={`Character Overview`} showActions={!mainCharacter?.name ? true : false}>
          {mainCharacter && <button className='basic'
            onClick={() => {setShowTutorial(true)}}
          >
            Overview Tutorial
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
        </PageHeader>

        {mainCharacter && <div>
          <PageLayout 
            leftChildren={
              <>
                <CharacterInfo
                  character={mainCharacter as Character}
                  characterClass={mainCharacterClass as CharacterClass}
                  characterInventories={characterInventories}
                  expanded={true}
                />
              </>
            }
            rightChildren={
              <>
                <CharacterQuestCurrent
                  id='tutorial-current-quest'
                  character={mainCharacter}
                  characterInventories={characterInventories}
                  characterQuestProgressItems={characterQuestProgress}
                  questGroups={questGroups}
                  quests={quests}
                />
                <CharacterInventory
                  id='tutorial-inventory'
                  character={mainCharacter as Character}
                  inventories={inventories.filter(i => i.characterId === mainCharacter?.id)}
                  items={items}
                  expanded={expandInventory}
                />
                <CharacterHistoryComponent
                  id='tutorial-history'
                  character={mainCharacter as Character}
                  history={history.filter(h => h.characterId === mainCharacter?.id)}
                  expanded={expandHistory}
                />
              </>
            }
          />

        </div>}
      </div>
    </div>}
  </>
}