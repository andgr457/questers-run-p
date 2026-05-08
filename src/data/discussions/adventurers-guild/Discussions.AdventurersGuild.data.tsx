import { JumpyText } from '../../../common/components/JumpyText';
import CharacterQuestRequirement from '../../../common/components/quests/CharacterQuestRequirement';
import type { QuestWithQuestProgress } from '../../../common/components/quests/CharacterQuests';
import type { Character } from '../../../interfaces/characters/Character.types';
import type { Discussion, DiscussionAction } from '../../../interfaces/discussions/Discussions';

export const AdventurersGuildDiscussionIndexes = {
  Welcome: 0,
  
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
}

export const getAdventurersGuildDiscussionQuestCheckActionByStep = (character: Character, step: number, questWithProgress: QuestWithQuestProgress, actions: DiscussionAction[]): DiscussionWithActions => {
  const propertyName = `ActionQuestCheck_${step}`
  //@ts-ignore
  const discussionIndex = AdventurersGuildDiscussionIndexes[propertyName]
  if(!discussionIndex){
    throw new Error(`Discussion index not found for ${propertyName}.`)
  }

  const discussionActions: DiscussionWithActions = {
    discussion: {
      index: discussionIndex,
      content: <></> //set later
    },
    actions: actions
  } 

  if(discussionActions){
    if(step === 1){
      discussionActions.discussion.content = <div>
          Welcome back, {character?.name}! Please give me a moment to check on your quest...
      </div>
    } else if(step === 2){
      if(!questWithProgress){
        throw new Error(`Missing quest with progress to check quest completion eligibility.`)
      }
      const missingRequirements = []
      for(const req of questWithProgress.quest.completionRequirements){
        if(!req.completed){
          missingRequirements.push(<CharacterQuestRequirement questWithProgress={questWithProgress} requirement={req} />)
        }
      }
      
      discussionActions.discussion.content = <div>
          Welcome back, {character?.name}! Please give me a moment to check on your quest...
      </div>
    }
  }
  return discussionActions
}

export const ADVENTURERS_GUILD_DISCUSSIONS_JOIN: Discussion[] = [
  {
    index: AdventurersGuildDiscussionIndexes.Welcome,
    content: <div>
      Welcome to the <JumpyText>Adventurer's Guild</JumpyText>, traveler. 
      How can I be of assistance to you today?
    </div>
  },
  {
    index: AdventurersGuildDiscussionIndexes.ActionJoin,
    content: <div>
      Now then… would you like to <JumpyText>conduct business</JumpyText> with us? You'll need to <JumpyText>sign-up first</JumpyText>. Here's the paperwork. 
      Let me know when you're <JumpyText>ready to join</JumpyText>.
    </div>
  },
  {
    index: AdventurersGuildDiscussionIndexes.GuildStore,
    content: <div>
      In the Adventurer's Guild Store, you may sell, or buy, <JumpyText>monster parts</JumpyText>, rare <JumpyText>gems</JumpyText>, 
      recovered <JumpyText>relics</JumpyText>, and many other Guild restricted items.
    </div>
  },
  {
    index: AdventurersGuildDiscussionIndexes.TakingQuests,
    content: <div>
      You may also browse and accept <JumpyText>available quests</JumpyText> posted by nearby townsfolk, merchants, and regional authorities. 
      Some requests are simple errands. Others… are <JumpyText>far more dangerous</JumpyText>. 
      <JumpyText>Come back</JumpyText> to me when you've completed a quest to get the <JumpyText>rewards</JumpyText>!
    </div>
  },
  {
    index: AdventurersGuildDiscussionIndexes.CreatingQuests,
    content: <div>
      You may also post a <JumpyText>Quest Request</JumpyText> should you require assistance gathering resources. 
      Other adventurers may accept your commission - for the right price, of course. 
    </div>
  },
  {
    index: AdventurersGuildDiscussionIndexes.Parties,
    content: <div>
      Adventurers seeking allies may <JumpyText>form or join parties</JumpyText> before departing as many contracts 
      are too difficult for a lone blade to survive. There's a <JumpyText>party sign-up sheet</JumpyText> for starting, 
      or joining, parties.
    </div>
  },
  {
    index: AdventurersGuildDiscussionIndexes.GuildRanks,
    content: <div>
      As your reputation grows, your <JumpyText>Guild Rank</JumpyText> will increase. Higher ranks grant access to 
      privileged <JumpyText>equipment</JumpyText>, rare <JumpyText>supplies</JumpyText>, and <JumpyText>restricted items</JumpyText> within the Guild Store. 
      <hr/>
      If you believe your <JumpyText>accomplishments</JumpyText> are worthy of promotion, I can <JumpyText>review your eligibility</JumpyText> for a rank advancement. 
    </div>
  },
  {
    index: AdventurersGuildDiscussionIndexes.Appraisal,
    content: <div>
      Need your <JumpyText>loot evaluated</JumpyText>? Guild appraisers can <JumpyText>appraise</JumpyText> materials, gems, and unusual items currently in your inventory. For a <JumpyText>fee</JumpyText>, of course.
    </div>
  }
]