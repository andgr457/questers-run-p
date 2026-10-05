import './styles/globals.css'

import { createRoot } from 'react-dom/client'
import App from './features/App'
import { playerEventService } from './engine/events/player/PlayerEventService'

async function bootstrapApp(){
  
  await playerEventService.init()
  
  createRoot(document.getElementById('root')!).render(
    <App />
  )
}

bootstrapApp()
