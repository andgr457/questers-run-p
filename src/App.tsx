import Site from './site/Site'
import './site/styles/globals.css'
import { ConfirmProvider } from './ui/modal/providers/ConfirmProvider'

export default function App() {
  return <ConfirmProvider>
    <Site />
  </ConfirmProvider>
}