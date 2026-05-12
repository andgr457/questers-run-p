import './AdventurersGuild.css'
import { useEffect, useState } from 'react';
import { ADVENTURERS_GUILD_DISCUSSIONS_JOIN, AdventurersGuildDiscussionIndexes, type DiscussionWithActions } from '../../data/discussions/adventurers-guild/Discussions.AdventurersGuild.data';
import { useConfirm } from '../../providers/ConfirmProvider';
import type { Discussion, DiscussionAction } from '../../interfaces/discussions/Discussions';
import { sleep } from '../../services/CommonServices';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import { JumpyText } from '../JumpyText';
import { GuildRanks, type Character } from '../../interfaces/characters/Character.types';

interface AdventurersGuildClerkModalProps extends AppProperties {
  onJoin: () => void
}

interface ButtonConfig {
  button: React.ReactNode
  visible?: boolean
}

export default function AdventurersGuildClerk(props: AdventurersGuildClerkModalProps){
  const clerkThinking = {index: -1, content: <div style={{fontSize: '2em', textAlign: 'center'}}><JumpyText>...</JumpyText></div>}
  const welcomeJoinDiscussion = ADVENTURERS_GUILD_DISCUSSIONS_JOIN.find(d => d.index === AdventurersGuildDiscussionIndexes.WelcomeJoin)
  const welcomeDiscussion = ADVENTURERS_GUILD_DISCUSSIONS_JOIN.find(d => d.index === AdventurersGuildDiscussionIndexes.Welcome)

  const [discussionActions, setDiscussionActions] = useState<DiscussionAction[]>([])
  const [discussionIndex, setDiscussionIndex] = useState<number | undefined>(-1)
  const [discussion, setDiscussion] = useState<Discussion | undefined>(clerkThinking)

  const [showDiscussion, setShowDiscussion] = useState(true)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)

  const {
    character,
    characterClass,
    onJoin,
  } = props

  const {showConfirm} = useConfirm()

  const showClerkThinking = async () => {
    setShowDiscussion(false)
    await sleep(250)
    setDiscussion({index: -1, content: <div style={{fontSize: '2em', textAlign: 'center'}}><JumpyText>...</JumpyText></div>})
    setShowDiscussion(true)
    await sleep(1000)
    setShowDiscussion(false)
    await sleep(250)
  }

  useEffect(() => {
    const load = async () => {
      const characterAlreadyJoined = character?.guildRank !== GuildRanks.None && typeof character?.guildRank !== 'undefined'
      setJoined(characterAlreadyJoined)
      if(characterAlreadyJoined){
        setDiscussionIndex(welcomeDiscussion?.index)
      } else {
        setDiscussionIndex(welcomeJoinDiscussion?.index)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const load = async () => {
      setDiscussionActions([])
      await showClerkThinking()
      let newDiscussion: DiscussionWithActions | undefined = undefined
      if(discussionIndex !== -1){
        if(discussionIndex === AdventurersGuildDiscussionIndexes.ActionJoin){
          const buttonFn = async () => {
            await showClerkThinking()
            setDiscussion({index: -1, content: <div>
              <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '5px', marginBottom: '10px', fontSize: '0.8em', width: '100%'}}>
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
            </div>
            })
            setShowDiscussion(true)
            await sleep(250)
            await onJoin?.()
          }
          newDiscussion = {
            discussion: ADVENTURERS_GUILD_DISCUSSIONS_JOIN.find(d => d.index === discussionIndex) as Discussion,
            actions: [{
              element: <button className={`success`} onClick={buttonFn}>
                Join
              </button>
            }]
          }
        } else {
          newDiscussion = {
            discussion: ADVENTURERS_GUILD_DISCUSSIONS_JOIN.find(d => d.index === discussionIndex) as Discussion,
            actions: []
          }
        }
        setDiscussionActions(newDiscussion?.actions ?? [])
        setDiscussion(newDiscussion?.discussion)
      }
      setShowDiscussion(true)
    }
    load()
  }, [discussionIndex])

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

          <div>
            {joined === false && <button className={`success ${joining === true ? 'disabled' : ''}`} onClick={() => {
              setJoining(true)
              setDiscussionIndex(AdventurersGuildDiscussionIndexes.ActionJoin)
            }}>
              Join
            </button>}
            {joined === true && <>
              <button className='success' onClick={() => {
                setDiscussionIndex(AdventurersGuildDiscussionIndexes.ActionRankCheck)
              }}>
                Rank Check
              </button>
            </>}
          </div>
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
        <div className='adv-g-clerk-section-title'>
           Clerk
        </div>
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
