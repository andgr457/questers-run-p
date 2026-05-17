import { useCallback, useEffect, useState } from 'react'
import { GuildRanks, type Character } from '../../interfaces/characters/Character.types'
import { TutorialOverlay, type TutorialStep } from '../../components/tutorial/TutorialOverlay'
import { useConfirm } from '../../providers/ConfirmProvider'
import { ACHIEVEMENT_INTRO_ADVENTURERS_GUILD } from '../../data/achievements/Achievements.Intro.data'
import { DateTime } from 'luxon'
import PageHeader from '../../components/PageHeader'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import { useWindows } from '../../components/windows/WindowProvider'
import CharacterQuests from '../../components/quests/CharacterQuests'
import { sleep } from '../../services/CommonServices'
import AdventurersGuildClerk from '../../components/adventurers-guild/AdventurersGuildClerk'

interface AdventurersGuildPageProps extends AppProperties {

}

export default function AdventurersGuildPage(props: AdventurersGuildPageProps) {
    const {
    character,
    setLocation,
    handleSetCharacter,
  } = props
  
  const tutorialJoin: TutorialStep[] = [
    {
      selector: '#tutorial-join-guild',
      content: 'Click here to speak with the clerk to join the Adventurer\'s Guild and for information about different guild activities.',
      action: () => {showClerk()}
    },
  ]

  const tutorialQuestComplete: TutorialStep[] = [
    {
      selector: '#tutorial-quest-complete',
      content: 'At the quest board, you can take, abandon, and complete quests. Complete your first quest to continue the tutorial.',
    },
  ]
  
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[] | undefined>(undefined)
  const [showModule, setShowModule] = useState<'' | 'quest-board'>('')
  
  const {showConfirm} = useConfirm()

  useEffect(() => {
    setLocation?.('Adventurer\'s Guild')
    setShowModule(!character?.guildRank ? '' : 'quest-board')
    setTutorialSteps(!character?.guildRank ? tutorialJoin : tutorialQuestComplete)
    if(!character?.guildRank){
      setShowTutorial(true)
    }
  },[character?.guildRank])

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

  const showClerk = useCallback(() => {
    if (isWindowOpen('clerk')) {
      closeWindow('clerk')
    }

    openWindow(
      'clerk',
      `Adventurer's Guild Clerk`,
      <AdventurersGuildClerk       
        {...props}
        onJoin={handleJoinClicked} 
      />
    )
  }, [openWindow])

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

    await sleep(100)
    closeWindow('clerk')
    await sleep(500)
    setTutorialSteps(tutorialQuestComplete)
    setShowTutorial(true)
  }, [character])

  const characterJoined = character?.guildRank !== GuildRanks.None
  if(!character){
    return null
  }
  return <div>
    {showTutorial === true && tutorialSteps && <TutorialOverlay 
      steps={tutorialSteps as TutorialStep[]} 
      onCancel={() => {setShowTutorial(false)}} 
      onComplete={() => {
        //todo
        setShowTutorial(false)
      }}
    />}
    <div className='page-main'>
      <PageHeader showActions={!character?.guildRank ? true : false}>
        
        <button id='tutorial-join-guild' className='basic'
          onClick={() => {
            showClerk()
          }}
        >
          Guild Clerk
        </button>
        {characterJoined && <button className='basic'
          onClick={async () => {
            setShowModule('quest-board')
          }}
        >
          Quests
        </button>}
      </PageHeader>
      <div>
        {showModule === 'quest-board' && <div className='app-module'>
          <div className='app-module-title'>
            Quest Board
          </div>
          <CharacterQuests {...props} />
        </div>}
      </div>
    </div>
  </div>
}