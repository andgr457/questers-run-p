import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import React from 'react'
import { clockRuntimeService } from './engine/clock/ClockRuntimeService.ts'
import { activityRuntimeService } from './engine/activity/ActivityRuntimeService.ts'
import { characterRuntimeService } from './engine/entity/CharacterRuntimeService.ts'
import { playerRuntimeService } from './engine/entity/PlayerRuntimeService.ts'
import { eventDebugRuntimeService } from './engine/event/EventDebugRuntimeService.ts'
clockRuntimeService.start()
eventDebugRuntimeService.init()
activityRuntimeService.init()
playerRuntimeService.init()
characterRuntimeService.init()
characterRuntimeService.start()


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

