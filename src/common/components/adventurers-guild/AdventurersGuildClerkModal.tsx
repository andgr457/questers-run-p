import type { ModalProps } from '../modals/Modal';
import Modal from '../modals/Modal';
import { type Character } from '../../../interfaces/characters/Character.types';
import type { Quest, QuestGroup, QuestProgress } from '../../../interfaces/quests/Quests.types';
import './AdventurersGuild.css'
import { useEffect, useRef, useState } from 'react';
import { ADVENTURERS_GUILD_DISCUSSIONS_JOIN, AdventurersGuildDiscussionIndexes, getAdventurersGuildDiscussionQuestCheckActionByStep } from '../../../data/discussions/adventurers-guild/Discussions.AdventurersGuild.data';
import { useConfirm } from '../../../providers/ConfirmProvider';
import type { Discussion, DiscussionAction } from '../../../interfaces/discussions/Discussions';
import { sleep } from '../../../services/CommonServices';
import type { Inventory } from '../../../interfaces/inventories/Inventory.types';
import { QuestService } from '../../../services/quests/QuestService';
import type { QuestWithQuestProgress } from '../quests/CharacterQuests';

interface AdventurersGuildClerkModalProps extends ModalProps {
  onJoin: () => void
  character: Character
  characterQuestProgressItems: QuestProgress[]
  characterInventories: Inventory[]
  quests: Quest[]
  questGroups: QuestGroup[]
  onQuestComplete: () => void
  discussionId?: number
}

export default function AdventurersGuildClerkModal(props: AdventurersGuildClerkModalProps){
  const welcomeDiscussion = ADVENTURERS_GUILD_DISCUSSIONS_JOIN.find(d => d.index === AdventurersGuildDiscussionIndexes.Welcome)
  
  const [discussionIndex, setDiscussionIndex] = useState(props.discussionId ?? AdventurersGuildDiscussionIndexes.Welcome)
  const [discussion, setDiscussion] = useState(welcomeDiscussion)
  const [discussionActions, setDiscussionActions] = useState<DiscussionAction[]>([])

  const [showDiscussion, setShowDiscussion] = useState(true)
  const [questsWithProgress, setQuestsWithProgress] = useState<QuestWithQuestProgress[]>([])

  const {
    characterQuestProgressItems,
    character,
    quests,
    characterInventories,
    questGroups,
    onJoin
  } = props

  const dataRef = useRef({
    character,
    questGroups,
    quests,
    characterQuestProgressItems,
    characterInventories
  });

  useEffect(() => {
    dataRef.current = {
      character,
      questGroups,
      quests,
      characterQuestProgressItems,
      characterInventories
    };
  }, [character, questGroups, quests, characterQuestProgressItems, characterInventories]);


  useEffect(() => {
    const interval = setInterval(async () => {
      const {
        character,
        questGroups,
        quests,
        characterQuestProgressItems,
        characterInventories
      } = dataRef.current;

      if (!character || !questGroups || !quests) return;

      const questService = new QuestService();
      const progress = await questService.getQuestsWithQuestProgress(
        character,
        quests,
        questGroups,
        characterQuestProgressItems,
        characterInventories
      )
      setQuestsWithProgress(progress)
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const {showConfirm} = useConfirm()

  const handleQuestCheckAction = async () => {
    const currentQuestProgress = questsWithProgress.find(qwp => qwp.questProgress)
    if(!currentQuestProgress){
      return
    }

    const discussionWithActions = getAdventurersGuildDiscussionQuestCheckActionByStep(
      character,
      1,
      currentQuestProgress,
      [{
        title: 'ayy',
        element: null,
        onChange: ()=> {},
        onClick: () => {},
        placeholder: '...'
      }]
    )
    setDiscussion(discussionWithActions.discussion)
    setDiscussionActions(discussionWithActions.actions)
  }

  const handleJoinAction = async () => {
    await sleep()
    if(await showConfirm({
      isYesNo: true,
      title: `Join the Adventurer's Guild?`,
      message: `Submit the paperwork to the clerk?`
    })){
      setDiscussion(welcomeDiscussion)
      setDiscussionIndex(AdventurersGuildDiscussionIndexes.Welcome)
      await showConfirm({
        isYesNo: false,
        title: 'New Recruit!',
        message: `You filled out the paperwork and submitted it to the clerk. After a short while, the clerk hands over your Adventurer's Guild card. This is your identification in this world. Don't lose it!`
      })
      onJoin()
    } else {
      setDiscussion(welcomeDiscussion)
      setDiscussionIndex(AdventurersGuildDiscussionIndexes.Welcome)
      await showConfirm({
        isYesNo: false,
        title: `Cold Feet`,
        message: `You decided not to join the Adventurer's Guild just now.`
      })
    }
  }

  useEffect(() => {
    const conversate = async () => {
      setShowDiscussion(false)
      await sleep(1000)
      setDiscussion(ADVENTURERS_GUILD_DISCUSSIONS_JOIN.find(d => d.index === discussionIndex) as Discussion)
      setShowDiscussion(true)
      if(discussionIndex === AdventurersGuildDiscussionIndexes.ActionJoin){
        await handleJoinAction()
      }
      if(discussionIndex === AdventurersGuildDiscussionIndexes.ActionQuestComplete){
        await handleQuestCheckAction()
      }
    }
    conversate()
  }, [discussionIndex])

  const notJoined = !character?.guildRank 
  const joined = !notJoined

  return <Modal
    backdropHides={props.backdropHides}
    isOpen={props.isOpen}
    onClose={() => {setDiscussion(welcomeDiscussion); setDiscussionIndex(AdventurersGuildDiscussionIndexes.Welcome); props.onClose()}}
    closeButton={props.closeButton}
    rightTitle={`${props.rightTitle}: Lithos`}
  >
    <div>
      <div className='adv-g-clerk-content-buttons'>
        {notJoined === true && <button className='success' onClick={() => {
          setDiscussionIndex(AdventurersGuildDiscussionIndexes.ActionJoin)
        }}>
          Join
        </button>}
        {joined === true && <button className='success' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.ActionRankCheck)}}>
          Rank Check
        </button>}
        
      </div>
      <hr/>
      <div className={`discussion-section ${showDiscussion === true ? 'open' : ''} adv-g`}>
        {discussion?.content}
        {discussionActions?.map(da => {
          return <div>
            {da.title}
          </div>
        })}
      </div>
      <hr/>
      <div className='header-1'>
        Guild Information
      </div>
      <div className='adv-g-clerk-content-buttons'>
        <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.GuildStore)}}>
          Guild Store
        </button>
        <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.GuildRanks)}}>
          Guild Rank
        </button>
        <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.TakingQuests)}}>
          Taking Quests
        </button>
        <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.CreatingQuests)}}>
          Creating Quests
        </button>
        <button className='yellow' onClick={() => {setDiscussionIndex(AdventurersGuildDiscussionIndexes.Appraisal)}}>
          Loot Appraisal
        </button>
      </div>
    </div>
  </Modal>
}
