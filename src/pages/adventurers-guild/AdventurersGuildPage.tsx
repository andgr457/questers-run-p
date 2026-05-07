import { useCallback, useEffect, useState } from 'react'
import { LOCAL_STORAGE_KEYS } from '../../common/constants/LocalStorageKeys'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { GuildRanks, type Character, type CharacterClass } from '../../interfaces/characters/Character.types'
import type { CharacterHistory } from '../../interfaces/history/History.types'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import type { Item } from '../../interfaces/items/Item.types'
import type { QuestProgress, Quest, QuestGroup } from '../../interfaces/quests/Quests.types'
import { useNavigate } from 'react-router-dom'
import { CharacterClassRepository } from '../../repository/characters/CharacterClassRepository'
import { ItemRepository } from '../../repository/items/ItemRepository'
import { QuestGroupRepository } from '../../repository/quests/QuestGroupRepository'
import { QuestRepository } from '../../repository/quests/QuestRepository'
import { TutorialOverlay, type TutorialStep } from '../../common/components/tutorial/TutorialOverlay'
import AdventurersGuildClerkModal from './AdventurersGuildClerkModal'
import { useConfirm } from '../../providers/ConfirmProvider'

export default function AdventurersGuildPage() {
  const [mainCharacter, setMainCharacter] = useLocalStorage<Character | undefined>(LOCAL_STORAGE_KEYS.CHARACTERS_MAIN, undefined)
  const [mainCharacterClass, setMainCharacterClass] = useState<CharacterClass | undefined>(undefined)
  const [inventories, setInventories] = useLocalStorage<Inventory[]>(LOCAL_STORAGE_KEYS.INVENTORIES, [])
  const [history, setHistory] = useLocalStorage<CharacterHistory[]>(LOCAL_STORAGE_KEYS.HISTORY, [])
  const [characterQuestProgress, setCharacterQuestProgress] = useLocalStorage<QuestProgress[]>(LOCAL_STORAGE_KEYS.QUEST_PROGRESS, [])
  const [quests, setQuests] = useState<Quest[]>([])
  const [questGroups, setQuestGroups] = useState<QuestGroup[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [showTutorial, setShowTutorial] = useState(!mainCharacter?.guildRank ? true : false)
  const {showConfirm} = useConfirm()
  const [showClerk, setShowClerk] = useState(false)
  
  const navigate = useNavigate()

  const joinGuildSteps: TutorialStep[] = [
    {
      selector: '#tutorial-join-guild',
      content: 'Click here to speak with the clerk to join the Adventurer\'s Guild and for information about different guild actions.',
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

  useEffect(() => {
    const load = async function () {
      if(!mainCharacter){
        navigate('/')
      }
      
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

  const handleJoinClicked = useCallback(async () => {
    showConfirm({
      isYesNo: false,
      title: 'Processing Adventurer Application',
      message: `Your application has been accepted and you are now an official F Rank adventurer! Check the quest board for available quests to start your journey.` 
    })

    //Set character guild rank F
    const newCharacter = {...mainCharacter}
    newCharacter.guildRank = GuildRanks.F
    
    setShowClerk(false)
  }, [mainCharacter])

  if(!mainCharacter){
    return null
  }

  const characterJoined = mainCharacter?.guildRank !== GuildRanks.None
  return <div>
    {!characterJoined && showTutorial === true  && <TutorialOverlay 
      steps={joinGuildSteps} 
      onCancel={() => {setShowTutorial(false)}} 
      onComplete={() => {
        //todo
        setShowTutorial(false)
      }}
      posTop={150}
    />}
    {showTutorial === true && <TutorialOverlay 
      steps={steps} 
      onCancel={() => {setShowTutorial(false)}} 
      onComplete={() => {
        //todo
        setShowTutorial(false)
      }}
    />}
    <AdventurersGuildClerkModal
      backdropHides={true}
      isOpen={showClerk}
      onClose={() => {setShowClerk(false)}}
      closeButton={true}
      rightTitle={`Adventurer's Guild Clerk`}
      onJoin={handleJoinClicked}
      character={mainCharacter}
    >
      <div>On-Duty Clerk: Lithos</div>
    </AdventurersGuildClerkModal>
    <div className='page-main'>
      <div className='header-1'>
        <div className='page-actions'>
          {characterJoined && <button className='basic'
            onClick={() => {setShowTutorial(true)}}
          >
            Adventurer's Guild Tutorial
          </button>}
          <button id='tutorial-join-guild' className='yellow'
            onClick={() => {setShowClerk(true)}}
          >
            Guild Clerk
          </button>
          {characterJoined && <>
            <button className='basic' onClick={() => {}}>Rank Check</button>
            <button className='basic' onClick={() => {}}>Appraise Items</button>
            <button className='basic' onClick={() => {}}>Quest Request</button>
            <button className='basic' onClick={() => {}}>Quest Check</button>
            <button className='basic' onClick={() => {}}>Archives</button>
          </>}
        </div>
      </div>
    </div>


  </div>
}