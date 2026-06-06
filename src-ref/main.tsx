import './styles/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { gameClockService } from './game/engine/clock/GameClockService'
import { activityRuntimeService } from './game/engine/activity/activityRuntimeService'
import { activityRewardSystem } from './game/engine/systems/ActivityRewardSystem'
// import { transitionService } from './game/engine/transitions/TransitionService'

gameClockService.start()
activityRuntimeService.init?.() 
activityRewardSystem.init()
// transitionService.boot()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)