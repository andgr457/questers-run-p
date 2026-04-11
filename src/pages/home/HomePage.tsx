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

export default function HomePage(){
  const [mainCharacter, setMainCharacter] = useLocalStorage<Character | undefined>(LOCAL_STORAGE_KEYS.CHARACTERS_MAIN, undefined)
  const [mainCharacterClass, setMainCharacterClass] = useState<CharacterClass | undefined>(undefined)
  const [newMainCharacterModalOpen, setNewMainCharacterModalOpen] = useState(false)
  const [inventories, setInventories] = useLocalStorage<Inventory[]>(LOCAL_STORAGE_KEYS.INVENTORIES, [])
  const [history, setHistory] = useLocalStorage<CharacterHistory[]>(LOCAL_STORAGE_KEYS.HISTORY, [])
  const [characterQuestProgress, setCharacterQuestProgress] = useLocalStorage<QuestProgress[]>(LOCAL_STORAGE_KEYS.QUEST_PROGRESS, [])
  const [quests, setQuests] = useState<Quest[]>([])
  const [questGroups, setQuestGroups] = useState<QuestGroup[]>([])
  
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
        <div className='header-2'>
          Welcome Home {mainCharacter?.name}
        </div>
        <CharacterBar character={mainCharacter as Character} characterClass={mainCharacterClass as CharacterClass} characterInventories={inventories.filter(i => i.characterId === mainCharacter?.id)} />
        
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

        {mainCharacter && <div className='page-sections'>
          <div className='page-section'>
            <CharacterQuests 
              character={mainCharacter as Character} 
              characterQuestProgressItems={characterQuestProgress} 
              questGroups={questGroups} 
              quests={quests}
              />
          </div>
          <div className='page-section'>
            
          </div>
          <div className='page-section'>
            {mainCharacter && <CharacterHistoryComponent character={mainCharacter as Character} history={history.filter(h => h.characterId === mainCharacter?.id)} />}
          </div>
        </div>}
      </div>
      

    </div>}
  </>
}