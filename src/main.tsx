import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import './index.css'
import { ConfirmProvider } from './providers/ConfirmProvider.tsx'
import { WindowProvider } from './components/windows/WindowProvider.tsx'
import { gameClockService } from './core/time/GameClockService'
gameClockService.start()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfirmProvider>
      <WindowProvider>
        <App />
      </WindowProvider>
    </ConfirmProvider>
  </React.StrictMode>
)
