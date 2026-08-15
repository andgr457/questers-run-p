import { createRoot } from 'react-dom/client'
import App from './core/components/App'
import { playerEventService } from './engine/events/services/PlayerEventService'
import { clockRuntimeService } from './engine/clock/ClockRuntimeService'

clockRuntimeService.start()
playerEventService.init()

createRoot(document.getElementById('root')!).render(
  <App />
)
