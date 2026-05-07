import { AnimatedText } from '../AnimatedText'

interface AdventurersGuildClerkJoinProps {
  onJoin: () => void
}

export default function AdventurersGuildClerkJoin(props: AdventurersGuildClerkJoinProps){

  return <div>
    <div className='adv-g-clerk-content-buttons'>
      <button className='success-blink' onClick={props.onJoin}>Join</button>
      
    </div>
    <hr/>
    <div className='adv-g-clerk-content-text'>
      <AnimatedText speed={30}>
        <div style={{ textAlign: 'center'}}>

          <div>Welcome to the Adventurer's Guild, traveler. This hall serves as the heart of every questing career.</div>

          <div>
            Here, you may sell monster parts, rare gems, and recovered relics
            gathered during your journeys. The Guild rewards those who return
            from danger with proof of their victories.
          </div>

          <div>
            You may also browse and accept available quests posted by nearby
            townsfolk, merchants, and regional authorities. Some requests are
            simple errands. Others… are far more dangerous.
          </div>

          <div>
            Adventurers seeking allies may form or join parties before departing.
            Many contracts are too difficult for a lone blade to survive.
          </div>

          <div>
            As your reputation grows, your Guild Rank will increase. Higher ranks
            grant access to privileged equipment, rare supplies, and restricted
            items within the Guild Store. Prove your worth, and greater
            opportunities shall be opened to you.
          </div>

          <div>
            Now then… would you like to conduct business with us?
          </div>
        </div>
      </AnimatedText>
    </div>
  </div>
}