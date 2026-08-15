import { createRoot } from 'react-dom/client'
import App from './features/App'
import { playerEventService } from './engine/events/services/PlayerEventService'
import { clockRuntimeService } from './engine/clock/ClockRuntimeService'
import { worldModeEventService } from './engine/events/services/WorldModeEventService'

worldModeEventService.init()
clockRuntimeService.start()
playerEventService.init()

createRoot(document.getElementById('root')!).render(
  <App />
)
