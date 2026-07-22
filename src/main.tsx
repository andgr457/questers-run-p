// import { clockRuntimeService } from './engine/clock/ClockRuntimeService.ts'
// import { characterRuntimeService } from './engine/character/CharacterRuntimeService.ts'
// import { playerRuntimeService } from './engine/player/PlayerRuntimeService.ts'
// import { eventDebugRuntimeService } from './engine/event/EventDebugRuntimeService.ts'
// import { notificationRuntimeService } from './engine/notification/NotificationRuntimeService.ts'
// import { tutorialRuntimeService } from './engine/tutorial/TutorialRuntimeService.ts'
// import { transitionRuntimeService } from './engine/transition/TransitionRuntimeService.ts'
// import { partyRuntimeService } from './engine/party/PartyRuntimeService.ts'
// import { rewardsRuntimeService } from './engine/rewards/RewardsRuntimeService.ts'
// import { questRuntimeService } from './engine/quest/QuestRuntimeService.ts'
// clockRuntimeService.start()
// eventDebugRuntimeService.init()
// transitionRuntimeService.init()
// rewardsRuntimeService.init()
// playerRuntimeService.init()
// characterRuntimeService.init()
// characterRuntimeService.start()
// partyRuntimeService.init()
// notificationRuntimeService.init()
// tutorialRuntimeService.init()
// questRuntimeService.init()
// questRuntimeService.start()


import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import React from 'react'
import { navigationRuntimeService } from './site/engine/events/navigation/NavigationRuntimeService.ts'

navigationRuntimeService.init()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

