import CharacterQuestRequirement from '../../../components/quests/CharacterQuestRequirement';
import type { QuestWithQuestProgress } from '../../../components/quests/CharacterQuests';
import type { Character } from '../../../interfaces/characters/Character.types';
import type { Discussion, DiscussionAction } from '../../../interfaces/discussions/Discussions';
import type { Item } from '../../../interfaces/items/Item.types';


export const AdventurersGuildDiscussionIndexes = {
  Welcome: 0,
  WelcomeJoin: 15,
  
  GuildStore: 1,
  TakingQuests: 2,
  CreatingQuests: 3,
  Parties: 4,
  GuildRanks: 5,
  Appraisal: 6,
  
  ActionJoin: 7,
  ActionAppraise: 8,
  ActionQuestTake: 9,
  ActionQuestAbandon: 10,
  ActionQuestComplete: 11,
  ActionRankCheck: 12,
  ActionQuestCheck_1: 13,
  ActionQuestCheck_2: 14,
}

interface DiscussionWithActions {
  discussion: Discussion,
  actions: DiscussionAction[]
  fnBefore?: () => Promise<void>
  fnAfter?: () => Promise<void>
}

interface ActionStepBuilderProps {
  character: Character
  step: number, 
  questWithProgress: QuestWithQuestProgress
  actions: DiscussionAction[]
  items: Item[]
  fnBefore?: () => Promise<void>
  fnAfter?: () => Promise<void>
}

export const getAdventurersGuildDiscussionQuestCheckActionByStep = (
  props: ActionStepBuilderProps
): DiscussionWithActions => {
  const {
    actions,
    character,
    questWithProgress,
    step,
    items,
    fnAfter,
    fnBefore,
  } = props

  const propertyName = `ActionQuestCheck_${step}`
  //@ts-ignore
  const discussionIndex = AdventurersGuildDiscussionIndexes[propertyName]
  if(!discussionIndex){
    throw new Error(`Discussion index not found for ${propertyName}.`)
  }

  if(!questWithProgress || questWithProgress?.questProgress?.status === 'complete'){
    return {
      discussion: {
        index: discussionIndex,
        content: <div>
          <div className='discussion-text'>
            You are not currently on a quest...
          </div>
        </div>
      },
      actions: [],
      fnBefore: async () => {},
      fnAfter: async () => {}
    } 
  }

  const discussionActions: DiscussionWithActions = {
    discussion: {
      index: discussionIndex,
      content: <></> //set later
    },
    actions: actions,
    fnBefore,
    fnAfter
  } 

  if(discussionActions){
    if(step === 1){
      discussionActions.discussion.content = <div>
        <div className='discussion-text'>
          Welcome back, <span className='adv-g-highlight'>{character.name}</span>! Please give me a moment to check on your quest...
        </div>
        <div className='adv-g-clerk-section-title'>
            Quest Title
        </div>
        <div className='foot-note' style={{textAlign: 'center'}}>
          {questWithProgress?.quest?.title}
        </div>
      </div>
    } else if(step === 2){
      if(!questWithProgress){
        throw new Error(`Missing quest with progress to check quest completion eligibility.`)
      }
      const requirements = []
      for(const req of questWithProgress.quest.completionRequirements){
        requirements.push(<CharacterQuestRequirement questWithProgress={questWithProgress} requirement={req} />)
      }

      const rewards = []
      if(questWithProgress.canCompleteQuest === true){
        for(const r of questWithProgress.quest.rewards){
          const item = items.find(i => i.id === r.itemId)
          let name
          let amount
          if(r.xp){
            name = 'XP'
            amount = r.xp
          } else if (r.itemId){
            name = item?.name
            amount = r.itemAmount
          }

          rewards.push(<div style={{display: 'flex', flex: 'wrap', gap: '5px'}}>
            <div>
              {name}
            </div>
            <div>
              {amount}
            </div>
          </div>)
        }
        
      }
      
      discussionActions.discussion.content = <div>
          Welcome back, {character?.name}! Here's the results of my analysis...
          <div>
            <div className='adv-g-clerk-section-title'>Requirements</div>  
            <div>
              {requirements}
            </div>
          </div>
          {rewards.length > 0 && <div>
            <div className='adv-g-clerk-section-title'>Rewards</div>  
            <div>
              {rewards}
            </div>
          </div>}
      </div>
    }
  }
  return discussionActions
}

export const ADVENTURERS_GUILD_DISCUSSIONS_JOIN: Discussion[] = [
  {
    index: AdventurersGuildDiscussionIndexes.Welcome,
    content: (
      <div>
        Welcome to the <span className='adv-g-highlight'>Adventurer&apos;s Guild</span>, traveler.
        How can I be of assistance to you today?
      </div>
    )
  },
  {
    index: AdventurersGuildDiscussionIndexes.WelcomeJoin,
    content: (
      <div>
        Welcome to the <span className='adv-g-highlight'>Adventurer&apos;s Guild</span>, traveler.
        It looks like you are not a member. Would you like to <span className='adv-g-highlight'>join</span>?
      </div>
    )
  },
  {
    index: AdventurersGuildDiscussionIndexes.ActionJoin,
    content: (
      <div>
        Now then… would you like to <span className='adv-g-highlight'>conduct business</span> with us?
        You&apos;ll need to <span className='adv-g-highlight'>sign-up first</span>. Here&apos;s the paperwork.
        Let me know when you&apos;re <span className='adv-g-highlight'>ready to join</span>.
      </div>
    )
  },
  {
    index: AdventurersGuildDiscussionIndexes.GuildStore,
    content: (
      <div>
        In the Adventurer&apos;s Guild Store, you may sell, or buy,
        <span className='adv-g-highlight'> monster parts</span>, rare <span className='adv-g-highlight'>gems</span>,
        recovered <span className='adv-g-highlight'>relics</span>, and many other Guild restricted items.
      </div>
    )
  },
  {
    index: AdventurersGuildDiscussionIndexes.TakingQuests,
    content: (
      <div>
        You may also browse and accept <span className='adv-g-highlight'>available quests</span> posted 
        by nearby townsfolk, merchants, and regional authorities.
        Some requests are simple errands. Others… are <span className='adv-g-highlight'>far more dangerous</span>.
        <span className='adv-g-highlight'>Come back</span> to me when you&apos;ve completed a quest to get the
        <span className='adv-g-highlight'> rewards</span>!
      </div>
    )
  },
  {
    index: AdventurersGuildDiscussionIndexes.CreatingQuests,
    content: (
      <div>
        You may also post a <span className='adv-g-highlight'>Quest Request</span> should 
        you require assistance gathering resources.
        Other adventurers may accept your commission — for the right price, of course.
      </div>
    )
  },
  {
    index: AdventurersGuildDiscussionIndexes.Parties,
    content: (
      <div>
        Adventurers seeking allies may <span className='adv-g-highlight'>form or join parties</span> before 
        departing as many contracts are too difficult for a lone blade to survive.
        There&apos;s a <span className='adv-g-highlight'>party sign-up sheet</span> for starting,
        or joining, parties.
      </div>
    )
  },
  {
    index: AdventurersGuildDiscussionIndexes.GuildRanks,
    content: (
      <div>
        As your reputation grows, your <span className='adv-g-highlight'>Guild Rank</span> will increase.
        Higher ranks grant access to privileged <span className='adv-g-highlight'>equipment</span>,
        rare <span className='adv-g-highlight'>supplies</span>, and
        <span className='adv-g-highlight'> restricted items</span> within the Guild Store.
        <hr />
        If you believe your <span className='adv-g-highlight'>accomplishments</span> are worthy of promotion,
        I can <span className='adv-g-highlight'>review your eligibility</span> for a rank advancement.
      </div>
    )
  },
  {
    index: AdventurersGuildDiscussionIndexes.Appraisal,
    content: (
      <div>
        Need your <span className='adv-g-highlight'>loot evaluated</span>?
        Guild appraisers can <span className='adv-g-highlight'>appraise</span> materials, gems,
        and unusual items currently in your inventory.
        For a <span className='adv-g-highlight'>fee</span>, of course.
      </div>
    )
  }
]