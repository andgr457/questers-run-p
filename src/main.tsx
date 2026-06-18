// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// import React from 'react'
// import './index.css'
// import { ConfirmProvider } from './providers/ConfirmProvider.tsx'
// import { WindowProvider } from './components/windows/WindowProvider.tsx'
// import { gameClockService } from './core/time/GameClockService'
// gameClockService.start()

// createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ConfirmProvider>
//       <WindowProvider>
//         <App />
//       </WindowProvider>
//     </ConfirmProvider>
//   </React.StrictMode>
// )


import { createRoot } from 'react-dom/client'
import App from './game/App.tsx'

import React from 'react'
import { activityRuntimeService } from './game/engine/activity/ActivityRuntimeService.ts'
import { gameClockService } from './game/engine/clock/GameClockService.ts'
import { questRuntimeService } from './game/engine/quest/QuestRuntimeService.ts'
gameClockService.start()
activityRuntimeService.init()
questRuntimeService.init()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

