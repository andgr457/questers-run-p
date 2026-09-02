import { createRoot } from 'react-dom/client'
import App from './features/App'
import { characterEventService } from './engine/events/services/CharacterEventService'
import { clockRuntimeService } from './engine/clock/ClockRuntimeService'
import { worldModeEventService } from './engine/events/services/WorldModeEventService'
import { GAME_EVENT_SERVICE_IDS } from './engine/events/services/data/EventService.data'

clockRuntimeService.start()
worldModeEventService.init(GAME_EVENT_SERVICE_IDS.world_mode_event_service)
characterEventService.init(GAME_EVENT_SERVICE_IDS.character_event_service)

createRoot(document.getElementById('root')!).render(
  <App />
)
