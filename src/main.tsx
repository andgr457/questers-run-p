import { createRoot } from 'react-dom/client'
import App from './features/App'
import { guildMasterEventService } from './engine/events/services/GuildMasterEventService'
import { clockRuntimeService } from './engine/clock/ClockRuntimeService'
import { worldModeEventService } from './engine/events/services/WorldModeEventService'

worldModeEventService.init()
clockRuntimeService.start()
guildMasterEventService.init()

createRoot(document.getElementById('root')!).render(
  <App />
)
