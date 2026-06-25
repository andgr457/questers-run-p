import World from './game/World'
import './styles/globals.css'
import { ConfirmProvider } from './ui/modal/providers/ConfirmProvider'
import NotificationList from './ui/notifications/NotificationList'

export default function App() {
  return <ConfirmProvider>
    <World />
    <NotificationList />
  </ConfirmProvider>
}