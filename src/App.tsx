// import World from './game/World'
import Site from './site/pages/Site/Site'
import './styles/globals.css'
import { ConfirmProvider } from './ui/modal/providers/ConfirmProvider'

export default function App() {
  return <ConfirmProvider>
    {/* <World /> */}
    <Site />
  </ConfirmProvider>
}