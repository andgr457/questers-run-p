import { Route, Routes } from 'react-router-dom';
import './App.css'
import GuildPage from './pages/guild/GuildPage';
import OverviewPage from './pages/overview/OverviewPage'
import { ConfirmProvider } from './providers/ConfirmProvider';
import QuestsPage from './pages/quests/QuestsPage';
import AdventurersGuildPage from './pages/adventurers-guild/AdventurersGuildPage';
import TownPage from './pages/TownPage';

function App() {
  
return (
    <ConfirmProvider>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path='/town' element={<TownPage />} />
        <Route path='/guild' element={<GuildPage />} />
        <Route path='/quests' element={<QuestsPage />} />
        <Route path='/adventurers-guild' element={<AdventurersGuildPage />} />
        <Route path='/adventurers-guild' element={<AdventurersGuildPage />} />
        
        <Route path="*" element={<OverviewPage />} />
      </Routes>
    </ConfirmProvider>
  );
}

export default App
