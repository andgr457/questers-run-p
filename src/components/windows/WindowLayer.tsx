import GameWindow from './GameWindow'

import './Windows.css'
import { useWindows } from './WindowProvider'
import type { AppProperties } from '../../interfaces/AppProperties.types'

interface WindowLayerProps extends AppProperties {

}

export default function WindowLayer(props: WindowLayerProps) {
  const { windows } = useWindows()

  return (
    <div className='window-layer'>
      {windows.map(win => (
        <GameWindow
          key={win.id}
          win={win}
          {...props}
          {...win.props}
        />
      ))}
    </div>
  )
}