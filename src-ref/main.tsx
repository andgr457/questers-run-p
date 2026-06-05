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

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './app/styles/global.css'
import { gameClockService } from './game/engine/clock/GameClockService'
import { activityRuntimeService } from './features/activity/activityRuntimeService'
import { activityRewardSystem } from './game/engine/systems/ActivityRewardSystem'
import { worldStateStore } from './game/world/worldState'
import { transitionService } from './game/engine/transitions/TransitionService'
// start engine systems
gameClockService.start()
activityRuntimeService.init?.() 
activityRewardSystem.init()
activityRuntimeService.setWorldStateStore(worldStateStore)
transitionService.boot()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)