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
    handleAddHistory,
    handleCompleteQuest,
    handleAbandonQuest,
  } = props
  const [showTutorial, setShowTutorial] = useState(!character?.guildRank ? true : false)
  const [showModule, setShowModule] = useState<'' | 'quest-board'>('')
  
  const {showConfirm} = useConfirm()

  useEffect(() => {
    setLocation?.('Adventurer\'s Guild')
    setShowModule(!character?.guildRank ? '' : 'quest-board')
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

  const joinGuildSteps: TutorialStep[] = [
    {
      selector: '#tutorial-join-guild',
      content: 'Click here to speak with the clerk to join the Adventurer\'s Guild and for information about different guild actions.',
      action: () => {showClerk()}
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