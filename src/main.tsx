import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import NavMenu from './common/components/NavMenu.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <div >
          <NavMenu/>
        </div>
        <div className='app-main'>
          <App />
        </div>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
