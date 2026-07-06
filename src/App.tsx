import World from './game/World'
import './styles/globals.css'
import { ConfirmProvider } from './ui/modal/providers/ConfirmProvider'

export default function App() {
  return <ConfirmProvider>
    <World />
  </ConfirmProvider>
}