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
import AdventurersGuildClerkModal from '../../common/components/adventurers-guild/AdventurersGuildClerkModal'
import { useConfirm } from '../../providers/ConfirmProvider'
import { ACHIEVEMENT_INTRO_ADVENTURERS_GUILD } from '../../data/achievements/Achievements.Intro.data'
import { DateTime } from 'luxon'
import CharacterInfo from '../../common/components/characters/CharacterInfo'
import CharacterQuests, { type QuestWithQuestProgress } from '../../common/components/quests/CharacterQuests'
import CharacterQuestCurrent from '../../common/components/quests/CharacterQuestCurrent'
import PageHeader from '../../common/components/PageHeader'
import PageLayout from '../PageLayout'
import { AdventurersGuildDiscussionIndexes, getAdventurersGuildDiscussionQuestCheckActionByStep } from '../../data/discussions/adventurers-guild/Discussions.AdventurersGuild.data'
import { sleep } from '../../services/CommonServices'

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
  const [requestedDiscussionId, setRequestedDiscussionId] = useState<number | undefined>(undefined)
  
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

    await showConfirm({
      isYesNo: false,
      title: 'Achievement Earned!',
      message: `${ACHIEVEMENT_INTRO_ADVENTURERS_GUILD.title} achieved! "${ACHIEVEMENT_INTRO_ADVENTURERS_GUILD.description}"` 
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

  const handleCompleteQuest = useCallback(async () => {

  }, [mainCharacter, characterQuestProgress])

  const handleQuestCheckClicked = useCallback(async () => {
    setRequestedDiscussionId(AdventurersGuildDiscussionIndexes.ActionQuestCheck_1)
    setShowClerk(true)
  }, [])
  
  const characterJoined = mainCharacter?.guildRank !== GuildRanks.None
  const characterInventories = inventories.filter(i => i.characterId === mainCharacter?.id)
  const questWithQuestProgress = characterQuestProgress?.filter(cqp => cqp.characterId === mainCharacter?.id)
  if(!mainCharacter){
    return null
  }
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
      discussionId={requestedDiscussionId}
      backdropHides={true}
      isOpen={showClerk}
      onClose={() => {setShowClerk(false)}}
      closeButton={true}
      rightTitle={`Adventurer's Guild Clerk`}
      onJoin={handleJoinClicked}
      character={mainCharacter}
      characterQuestProgressItems={questWithQuestProgress}
      onQuestComplete={handleCompleteQuest}
      characterInventories={characterInventories}
      questGroups={questGroups}
      quests={quests}
    >
      <div>On-Duty Clerk: Lithos</div>
    </AdventurersGuildClerkModal>
    <div className='page-main'>
      <PageHeader title={`Adventurer's Guild`} showActions={true}>
        {characterJoined && <button className='basic'
          onClick={() => {setShowTutorial(true)}}
        >
          Adventurer's Guild Tutorial
        </button>}
        <button id='tutorial-join-guild' className='basic'
          onClick={() => {setShowClerk(true)}}
        >
          Guild Clerk
        </button>

        {characterJoined && <>
          <button className='yellow' onClick={() => {}}>Guild Store</button>
          <button className='yellow' onClick={() => {handleQuestCheckClicked()}}>Quest Check</button>
          <button className='yellow' onClick={() => {}}>Rank Check</button>
          <button className='yellow' onClick={() => {}}>Appraise Items</button>
          <button className='yellow' onClick={() => {}}>Create Quest</button>
        </>}
      </PageHeader>

      {characterJoined === true && (
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
              <CharacterQuests
                id='tutorial-all-quests'
                character={mainCharacter as Character}
                characterQuestProgressItems={characterQuestProgress}
                questGroups={questGroups}
                quests={quests}
                showAllQuests={true}
                showCurrentQuest={true}
                expanded={false}
                characterInventories={characterInventories}
              />
            </>
          }
        />
      )}
    </div>
  </div>
}