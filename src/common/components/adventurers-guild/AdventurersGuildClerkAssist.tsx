import { AnimatedText } from '../AnimatedText';

interface AdventurersGuildClerkAssistProps {

}

export default function AdventurersGuildClerkAssist(props: AdventurersGuildClerkAssistProps){
  const welcomeContent = <AnimatedText speed={50}>
    <div>
      Welcome back, adventurer. The Guild has kept your records up to date
      while you were away.
    </div>

    <div>
      If you believe your accomplishments are worthy of promotion, I can
      review your eligibility for a rank advancement. Higher standing within
      the Guild grants access to privileged goods and exclusive contracts.
    </div>

    <div>
      Need your findings evaluated? I can appraise materials, gems, and
      unusual items currently in your inventory.
    </div>

    <div>
      You may also post a Quest Request should you require assistance
      gathering resources. Other adventurers may accept your commission—for
      the right price, of course.
    </div>

    <div>
      If you are returning from the field, I can verify your current quest
      completion status and process any eligible rewards.
    </div>

    <div>
      And should you wish to reflect on your past achievements, the Guild
      Archives contain records of your completed quests, contracts, and
      expedition results.
    </div>

    <div>
      So then… how may the Guild assist you today?
    </div>
  </AnimatedText>

  return <div>
    <div className='adv-g-clerk-content-buttons'>
      <button className='yellow' onClick={() => {}}>Rank Check</button>
      <button className='yellow' onClick={() => {}}>Appraise Items</button>
      <button className='yellow' onClick={() => {}}>Quest Request</button>
      <button className='yellow' onClick={() => {}}>Quest Check</button>
      <button className='yellow' onClick={() => {}}>Archives</button>
    </div>
    <hr/>
    <div className='adv-g-clerk-content-text'>
      {welcomeContent}
    </div>
  </div>
}