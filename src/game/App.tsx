import GameScreen from './components/GameScreen';
import NotificationList from './components/ui/notifications/NotificationList';
import ViewMain from './components/views/ViewMain';
import './styles/globals.css'

export default function App() {

  return <>
  <ViewMain />
    {/* <GameScreen /> */}
    <NotificationList />
  </>
}