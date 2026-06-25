import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import React from 'react'
import { clockRuntimeService } from './engine/clock/ClockRuntimeService.ts'
import { activityRuntimeService } from './engine/activity/ActivityRuntimeService.ts'
import { characterRuntimeService } from './engine/character/CharacterRuntimeService.ts'
import { playerRuntimeService } from './engine/player/PlayerRuntimeService.ts'
import { eventDebugRuntimeService } from './engine/event/EventDebugRuntimeService.ts'
import { eventHistoryRuntimeService } from './engine/event/EventHistoryRuntimeService.ts'
clockRuntimeService.start()
eventDebugRuntimeService.init()
activityRuntimeService.init()
playerRuntimeService.init()
characterRuntimeService.init()
characterRuntimeService.start()
eventHistoryRuntimeService.init()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

