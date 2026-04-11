import { Route, Routes } from 'react-router-dom';
import './App.css'
import GuildPage from './pages/guild/GuildPage';
import HomePage from './pages/home/HomePage'
import { ConfirmProvider } from './providers/ConfirmProvider';
import QuestsPage from './pages/quests/QuestsPage';
import AdventurersGuildPage from './pages/guild/AdventurersGuildPage';

function App() {
  
return (
    <ConfirmProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/guild' element={<GuildPage />} />
        <Route path='/quests' element={<QuestsPage />} />
        <Route path='/adventurers-guild' element={<AdventurersGuildPage />} />
        <Route path='/adventurers-guild' element={<AdventurersGuildPage />} />
        
        <Route path="*" element={<HomePage />} />
      </Routes>
    </ConfirmProvider>
  );
}

export default App
