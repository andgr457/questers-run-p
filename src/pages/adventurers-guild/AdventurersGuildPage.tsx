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
import { ACHIEVEMENT_INTRO_ADVENTURERS_GUILD } from '../../data/achievements/Achievements.Intro.data'
import { DateTime } from 'luxon'
import CharacterInfo from '../../common/components/characters/CharacterInfo'
import CharacterQuests from '../../common/components/quests/CharacterQuests'
import CharacterInventory from '../../common/components/inventory/CharacterInventory'

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
      action: () => {setShowClerk(true)}
    },
  ]

  const steps: TutorialStep[] = [
    {
      selector: '#tutorial-history',
      content: 'You can view recent history here.',
    },
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


  const handleJoinClicked = useCallback(async () => {
    

    //Set character guild rank F
    const newCharacter: Character = {...mainCharacter as Character}
    newCharacter.guildRank = GuildRanks.F

    if(!newCharacter.achievements){
      newCharacter.achievements = []
    }

    newCharacter.achievements.push({
      achievementId: ACHIEVEMENT_INTRO_ADVENTURERS_GUILD.id,
      achievementDate: DateTime.utc().toISO()
    })

    showConfirm({
      isYesNo: false,
      title: 'Achievement Earned!',
      message: `${ACHIEVEMENT_INTRO_ADVENTURERS_GUILD.title} achieved! "${ACHIEVEMENT_INTRO_ADVENTURERS_GUILD.description}"` 
    })

    showConfirm({
      isYesNo: false,
      title: 'Processing Adventurer Application',
      message: `Your application has been accepted and you are now an official F Rank adventurer! Check the quest board for available quests to start your journey.` 
    })

    setMainCharacter(newCharacter)

    handleAddHistory([{
      characterId: newCharacter.id,
      date: DateTime.utc().toISO(),
      description: `Achievement "${ACHIEVEMENT_INTRO_ADVENTURERS_GUILD.title}" earned!`,
      id: `h_${newCharacter?.id}_${DateTime.utc().toMillis()+200}`
    }])

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
      {characterJoined === true && <div className='page-modules'>
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
          Appraisal
        </div>
      </div>}
    </div>
  </div>
}