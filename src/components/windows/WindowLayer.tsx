import GameWindow from './GameWindow'

import './Windows.css'
import { useWindows } from './WindowProvider'

export default function WindowLayer() {
  const { windows } = useWindows()

  return (
    <div className='window-layer'>
      {windows.map(win => (
        <GameWindow
          key={win.id}
          win={win}
        />
      ))}
    </div>
  )
}