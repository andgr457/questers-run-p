import './styles/adventurersGuildScreen.css'

import { useGuildTimeOfDay } from './hooks/useAdventurersGuildTimeOfDay'
import { useGuildGreeting } from './hooks/useAdventurersGuildGreeting'

import { AdventurersGuildActions } from './AdventurersGuildActions'
import { AdventurersGuildAmbient } from './AdventurersGuildAmbient'
import { AdventurersGuildBackground } from './AdventurersGuildBackground'
import { AdventurersGuildClerk } from './AdventurersGuildClerk'
import { AdventurersGuildCounter } from './AdventurersGuildCounter'
import { AdventurersGuildDialogue } from './AdventurersGuildDialogue'
import { AdventurersGuildNoticeBoard } from './AdventurersGuildNoticeBoard'
import { AdventurersGuildQuestBoard } from './AdventurersGuildQuestBoard'
import { AdventurersGuildRankPanel } from './AdventurersGuildRankPanel'

interface Props {
  hour: number
}

export function AdventurersGuildScreen({
  hour,
}: Props) {
  const timeOfDay = useGuildTimeOfDay(hour)

  const greeting = useGuildGreeting(timeOfDay)

  return (
    <AdventurersGuildBackground timeOfDay={timeOfDay}>
      <AdventurersGuildAmbient timeOfDay={timeOfDay} />

      <div className={`adventurers-guild-screen ${timeOfDay}`}>
        <div className='guild-room-lighting' />

        <div className='guild-room'>
          <div className='guild-title'>
            Adventurer&apos;s Guild
          </div>

          <AdventurersGuildCounter>
            <AdventurersGuildClerk mood={greeting.mood} />
          </AdventurersGuildCounter>

          <AdventurersGuildDialogue
            text={greeting.text}
          />
          <AdventurersGuildNoticeBoard />
          <AdventurersGuildQuestBoard />
          <AdventurersGuildRankPanel />
          <AdventurersGuildActions />
        </div>
      </div>
    </AdventurersGuildBackground>
  )
}