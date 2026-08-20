import { createRoot } from 'react-dom/client'
import App from './features/App'
import { characterEventService } from './engine/events/services/CharacterEventService'
import { clockRuntimeService } from './engine/clock/ClockRuntimeService'
import { worldModeEventService } from './engine/events/services/WorldModeEventService'

worldModeEventService.init()
clockRuntimeService.start()
characterEventService.init()

createRoot(document.getElementById('root')!).render(
  <App />
)
