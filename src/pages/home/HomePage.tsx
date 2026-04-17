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
import CharacterBar from '../../common/components/characters/CharacterBar'
import CustomContainer from '../../common/components/CustomContainer'
import CustomContainerItem from '../../common/components/CustomContainerItem'
import { ITEM_CURRENCY_IDS } from '../../data/items/currency/Item.Currency.data'
import { ItemRepository } from '../../repository/items/ItemRepository'
import type { Item } from '../../interfaces/items/Item.types'

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
  const {showConfirm} = useConfirm()

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
        <CharacterBar title='Home' character={mainCharacter as Character} characterClass={mainCharacterClass as CharacterClass} characterInventories={inventories.filter(i => i.characterId === mainCharacter?.id)} />
        
        <div className='header-1'>
          <div className='page-actions'>
            <button
              onClick={() => {setNewMainCharacterModalOpen(true)}}
            >
              {mainCharacterExists ? `Rename ${mainCharacter.name}`: 'Create Main Character'}
            </button>
            <button
              onClick={() => {handleResetEverything()}}
            >
              Reset Everything
            </button>
          </div>
        </div>

        {mainCharacter && <div >
          <div style={{display: 'flex', gap: '5px'}}>
            <div style={{width: '33%', minWidth: '350px'}}>
              <CustomContainer 
                title='Inventory'
                expandable={true}
                isChildCustomContainer={false}
              >
                {inventories?.filter(inv => inv.characterId === mainCharacter.id).map(inv => {
                  const mappedItems: {itemId: string, itemName: string, amount: number}[] = []
                  for(const txn of inv.transactions){
                    const found = mappedItems.find(iui => iui.itemId === txn.itemId)
                    if(!found){
                      const item = items.find(i => i.id === txn.itemId)
                      mappedItems.push({itemId: txn.itemId, itemName: item?.name as string, amount: txn.quantity})
                    } else {
                      found.amount += txn.quantity
                    }
                  }
                  return <CustomContainer
                    title={inv.title}
                    description={inv.description}
                    expandable={true}
                    isChildCustomContainer={true}
                    headerLeft={inv.title === 'Currency' && `Gold ${totalGold.toLocaleString()}`}
                  >
                    <div className='flex-wrap'>
                      {mappedItems.map(mi => {
                        return <CustomContainerItem>
                          {mi.itemName}: {mi.amount}
                        </CustomContainerItem>
                      })}
                    </div>
                  </CustomContainer>
                })}
              </CustomContainer>
            </div>
            <div style={{width: '66%'}}>
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
          </div>
          <div>
            <CharacterHistoryComponent character={mainCharacter as Character} history={history.filter(h => h.characterId === mainCharacter?.id)} />
          </div>
        </div>}
      </div>
    </div>}
  </>
}