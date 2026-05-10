import { useCallback, useEffect, useState } from 'react'
import { GuildRanks, type Character } from '../../interfaces/characters/Character.types'
import { useNavigate } from 'react-router-dom'
import { TutorialOverlay, type TutorialStep } from '../../components/tutorial/TutorialOverlay'
import AdventurersGuildClerk from '../../components/adventurers-guild/AdventurersGuildClerk'
import { useConfirm } from '../../providers/ConfirmProvider'
import { ACHIEVEMENT_INTRO_ADVENTURERS_GUILD } from '../../data/achievements/Achievements.Intro.data'
import { DateTime } from 'luxon'
import PageHeader from '../../components/PageHeader'
import { AdventurersGuildDiscussionIndexes } from '../../data/discussions/adventurers-guild/Discussions.AdventurersGuild.data'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import { useWindows } from '../../components/windows/WindowProvider'
import CharacterQuests, { type QuestWithQuestProgress } from '../../components/quests/CharacterQuests'
import { sleep } from '../../services/CommonServices'

interface AdventurersGuildPageProps extends AppProperties {

}

export default function AdventurersGuildPage(props: AdventurersGuildPageProps) {
    const {
    character,
    characterQuestProgress,
    setLocation,
    handleSetCharacter,
    handleAddHistory,
    handleCompleteQuest,
  } = props
  const [showTutorial, setShowTutorial] = useState(!character?.guildRank ? true : false)
  const [requestedDiscussionId, setRequestedDiscussionId] = useState<number | undefined>(undefined)
  const [showModule, setShowModule] = useState<'' | 'quest-board'>('')
  
  const {showConfirm} = useConfirm()
  const navigate = useNavigate()

  useEffect(() => {
    setLocation?.('Adventurer\'s Guild')
  },[])

  const {
    windows,
    openWindow,
    closeWindow
  } = useWindows()

  const isWindowOpen = (
    id: string
  ) => {
    return windows.some(w => w.id === id)
  }

  function toggleWindow(id: string, title: string, content: React.ReactNode) {
    if (isWindowOpen(id)) {
      closeWindow(id)
      return
    }

    openWindow(
      id,
      title,
      <div>
        {content}
      </div>
    )
  }

  const handleQuestCompleteAction = useCallback(async (questWithProgress: QuestWithQuestProgress) => {
    await handleCompleteQuest?.(questWithProgress)
    closeWindow('clerk')
    navigate('/adventurers-guild')
  }, [handleCompleteQuest])

  function toggleClerk() {
    toggleWindow('clerk', `Adventurer's Guild Clerk`, <AdventurersGuildClerk       
      {...props}
      onJoin={handleJoinClicked} 
      handleCompleteQuest={handleQuestCompleteAction} 
      discussionId={requestedDiscussionId}
    />)
  }

  const joinGuildSteps: TutorialStep[] = [
    {
      selector: '#tutorial-join-guild',
      content: 'Click here to speak with the clerk to join the Adventurer\'s Guild and for information about different guild actions.',
      action: () => {toggleClerk()}
    },
  ]

  const steps: TutorialStep[] = [
    {
      selector: '#tutorial-history',
      content: 'You can view recent history here.',
    },
  ]


  const handleJoinClicked = useCallback(async () => {
    //Set character guild rank F
    const newCharacter: Character = {...character as Character}
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

    await handleSetCharacter?.({...newCharacter} as Character)

    handleAddHistory?.([{
      characterId: newCharacter.id,
      date: DateTime.utc().toISO(),
      description: `Achievement "${ACHIEVEMENT_INTRO_ADVENTURERS_GUILD.title}" earned!`,
      id: `h_${newCharacter?.id}_${DateTime.utc().toMillis()+200}`
    }])
    await sleep(100)
    closeWindow('clerk')
  }, [character])

  const handleQuestCheckClicked = useCallback(async () => {
    setRequestedDiscussionId(AdventurersGuildDiscussionIndexes.ActionQuestCheck_1)
    toggleClerk()
  }, [])
  
  const characterJoined = character?.guildRank !== GuildRanks.None
  if(!character){
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
    <div className='page-main'>
      <PageHeader showActions={true}>
        {characterJoined && <button className='basic'
          onClick={() => {
            // setShowTutorial(true)
          }}
        >
          Adventurer's Guild Tutorial
        </button>}
        <button id='tutorial-join-guild' className='basic'
          onClick={() => {toggleClerk()}}
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
      {showModule === 'quest-board' && <div>
        <CharacterQuests {...props} />
      </div>}
    </div>
  </div>
}