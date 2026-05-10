import './AdventurersGuild.css'
import { useEffect, useState } from 'react';
import { ADVENTURERS_GUILD_DISCUSSIONS_JOIN, AdventurersGuildDiscussionIndexes, getAdventurersGuildDiscussionQuestCheckActionByStep } from '../../data/discussions/adventurers-guild/Discussions.AdventurersGuild.data';
import { useConfirm } from '../../providers/ConfirmProvider';
import type { Discussion, DiscussionAction } from '../../interfaces/discussions/Discussions';
import { sleep } from '../../services/CommonServices';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import { JumpyText } from '../JumpyText';
import { GuildRanks } from '../../interfaces/characters/Character.types';
import type { QuestWithQuestProgress } from '../quests/CharacterQuests';

interface AdventurersGuildClerkModalProps extends AppProperties {
  onJoin: () => void
  discussionId?: number
}

interface ButtonConfig {
  button: React.ReactNode
  visible?: boolean
}

export default function AdventurersGuildClerk(props: AdventurersGuildClerkModalProps){
  const welcomeJoinDiscussion = ADVENTURERS_GUILD_DISCUSSIONS_JOIN.find(d => d.index === AdventurersGuildDiscussionIndexes.WelcomeJoin)
  const welcomeDiscussion = ADVENTURERS_GUILD_DISCUSSIONS_JOIN.find(d => d.index === AdventurersGuildDiscussionIndexes.Welcome)

  const [discussionActions, setDiscussionActions] = useState<DiscussionAction[]>([])
  const [discussionActionStep, setDiscussionActionStep] = useState(1)

  const [showDiscussion, setShowDiscussion] = useState(true)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  

  const [discussionIndex, setDiscussionIndex] = useState<number | undefined>(-1)
  const [discussion, setDiscussion] = useState<Discussion | undefined>({index: -1, content: <></>})

  const {
    character,
    characterQuestProgress,
    characterClass,
    items,
    onJoin,
    handleCompleteQuest,
  } = props

  useEffect(() => {
    const load = async () => {
      await showClerkThinking()
      const startIndex = joined === false ? welcomeJoinDiscussion?.index : welcomeDiscussion?.index
      const startDiscussion = joined === false ? welcomeJoinDiscussion : welcomeDiscussion
      setDiscussionIndex(startIndex)
      setDiscussion(startDiscussion)
    }
    load()
  }, [joined])

  useEffect(() => {
    console.log('setting joined')
    setJoined(!character?.guildRank ? false : character.guildRank !== GuildRanks.None)
  }, [character?.guildRank])

  const {showConfirm} = useConfirm()

  const handleQuestCheckAction = async () => {
    if(!character || !items) return
    if(discussionActionStep === 1){
      const discussionWithAction = getAdventurersGuildDiscussionQuestCheckActionByStep({
        items,
        actions: [{
          element: <button className='yellow' onClick={() => {setDiscussionActionStep(2); setDiscussionActions([])}}>
            Turn In
          </button>
        }],
        character,
        questWithProgress: characterQuestProgress as QuestWithQuestProgress,
        step: discussionActionStep,
        fnBefore: async () => {
          // await showClerkThinking()
        },
      })

      await discussionWithAction.fnBefore?.()
      setDiscussion(discussionWithAction.discussion)
      setDiscussionActions(discussionWithAction?.actions ?? [])
    } else if(discussionActionStep === 2){
      const buttonClass = characterQuestProgress?.canCompleteQuest === true ? 'success' : 'yellow'
      const buttonText = characterQuestProgress?.canCompleteQuest === true ? 'Complete Quest' : 'Back'
      const buttonFn = characterQuestProgress?.canCompleteQuest === true ? async () => {
        handleCompleteQuest?.(characterQuestProgress)
        setDiscussion(welcomeDiscussion)
        setDiscussionIndex(welcomeDiscussion?.index)
        setDiscussionActions([])
        setDiscussionActionStep(1)
      } : () => {
        setDiscussion(welcomeDiscussion)
        setDiscussionIndex(welcomeDiscussion?.index)
        setDiscussionActions([])
        setDiscussionActionStep(1)
      }

      const discussionWithAction = getAdventurersGuildDiscussionQuestCheckActionByStep({
        items,
        actions: [{
          element: <button className={buttonClass} onClick={() => {buttonFn?.()}}>
            {buttonText}
          </button>
        }],
        character,
        questWithProgress: characterQuestProgress as QuestWithQuestProgress,
        step: discussionActionStep,
        fnBefore: async () => {
          await showClerkThinking()
        },
      })

      await discussionWithAction.fnBefore?.()
      setDiscussion(discussionWithAction.discussion)
      setDiscussionActions(discussionWithAction?.actions ?? [])
    }
  }

  const showClerkThinking = async () => {
    setShowDiscussion(false)
    await sleep(100)
    setShowDiscussion(true)
    setDiscussion({index: -1, content: <div style={{fontSize: '2em', textAlign: 'center'}}><JumpyText>...</JumpyText></div>})
    await sleep(1000)
    setShowDiscussion(false)
  }

  const handleJoinAction = async () => {
    await showClerkThinking()
    if(await showConfirm({
      isYesNo: true,
      title: `Join the Adventurer's Guild?`,
      message: `Submit the paperwork to the clerk?`,
      
    })){
      await showClerkThinking()

      await showConfirm({
        isYesNo: false,
        title: 'New Recruit!',
        message: `You filled out the paperwork and submitted it to the clerk. After a short while, the clerk hands over your Adventurer's Guild card. This is your identification in this world. Don't lose it!`,
        content: <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '5px', marginBottom: '10px', fontSize: '0.8em', width: '100%'}}>
          <div>
            Name: {character?.name}
          </div>
          <div>
            Class: {characterClass?.name}
          </div>
          <div>
            Level: {character?.level}
          </div>
          <div>
            Rank: {GuildRanks.F}
          </div>
          
        </div>
      })
      setDiscussion(welcomeDiscussion)
      setDiscussionIndex(welcomeDiscussion?.index)
      setDiscussionActions([])
      setDiscussionActionStep(1)
      await sleep(2000)
      onJoin()
      setJoined(true)
    } else {
      await showClerkThinking()
      setDiscussion(welcomeJoinDiscussion)
      setDiscussionIndex(welcomeJoinDiscussion?.index)
    }
    setJoining(false)
  }

  useEffect(() => {
    const conversate = async () => {
      setDiscussionActions([])
      await showClerkThinking()
      const id = props.discussionId ?? discussionIndex
      if(id === AdventurersGuildDiscussionIndexes.ActionJoin){
        await handleJoinAction()
        setShowDiscussion(true)
        return
      }
      if(id === AdventurersGuildDiscussionIndexes.ActionQuestCheck_1 || 
        id === AdventurersGuildDiscussionIndexes.ActionQuestCheck_2
      ){
        await handleQuestCheckAction()
        setShowDiscussion(true)
        return
      }
      setDiscussion(ADVENTURERS_GUILD_DISCUSSIONS_JOIN.find(d => d.index === discussionIndex) as Discussion)
      setShowDiscussion(true)
    }
    conversate()
  }, [discussionIndex, props.discussionId, discussionActionStep, character])


  const actionButtons: ButtonConfig[] = [
    {
      button: <button className={`success ${joining === true ? 'disabled' : ''}`} onClick={() => {
        setJoining(true)
        setDiscussionIndex(AdventurersGuildDiscussionIndexes.ActionJoin)
      }}>
        Join
      </button>,
      visible: joined === false,
    },
    {
      button: <button className='success' onClick={() => {
        setDiscussionActionStep(1)
        setDiscussionIndex(AdventurersGuildDiscussionIndexes.ActionQuestCheck_1)
      }}>
        Quest Check
      </button>,
      visible: joined === true,
    },
    {
      button: <button className='success' onClick={() => {
        setDiscussionIndex(AdventurersGuildDiscussionIndexes.ActionRankCheck)
      }}>
        Rank Check
      </button>,
      visible: joined === true,
    }
  ]

    const infoButtons: ButtonConfig[] = [
      {
        button: <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.GuildStore)}}>
          Guild Store
        </button>,
      },
      {
        button: <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.GuildRanks)}}>
          Guild Rank
        </button>,
      },
      {
        button: <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.TakingQuests)}}>
          Taking Quests
        </button>,
      },
      {
        button: <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.CreatingQuests)}}>
          Creating Quests
        </button>,
      },
      {
        button: <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.Appraisal)}}>
          Loot Appraisal
        </button>,
      },
  ]

  return <div>
    <div className='adv-g-clerk-layout'>
      <div className='adv-g-clerk-sidebar'>
        <div className='adv-g-clerk-section'>
          <div className='adv-g-clerk-section-title'>
            Actions
          </div>

          {actionButtons.map((b, i) => {
            const show = b.visible === true
            if (!show) return null

            return (
              <div key={`action-${i}`}>
                {b.button}
              </div>
            )
          })}
        </div>

        {joined === true && <div className='adv-g-clerk-section'>
          <div className='adv-g-clerk-section-title'>
            Info
          </div>

          {infoButtons.map((b, i) => {
            return (
              <div key={`info-${i}`}>
                {b.button}
              </div>
            )
          })}
        </div>}
      </div>
      
      <div className='adv-g-clerk-discussion'>
        <div className={`adv-g-clerk-discussion-content ${showDiscussion === true ? 'show' : ''}`}>
          {discussion?.content}
        </div>

        {discussionActions.length > 0 && (
          <div className='adv-g-clerk-discussion-actions'>
            {discussionActions.map((da, i) => {
              return (
                <div key={`discussion-action-${i}`}>
                  {da.element}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  </div>
}
