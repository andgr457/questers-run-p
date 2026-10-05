import { eventBus } from '../engine/events/EventBus'
import { getPlayerNew } from '../entities/player/Player.utils'
import { usePlayer } from '../entities/player/usePlayer'
import PlayerDetail from './player/detail/PlayerDetail'

export default function App() {
  const {
    player
  } = usePlayer()
  
  return (
    <div>
      {player && (
        <PlayerDetail 
          player={player}
        />
      )}
      {!player && (
        <button
          onClick={() => {
            eventBus.emit({
              type: 'player:create',
              meta: {
                player: getPlayerNew()
              }
            })
          }}
        >
          Create Player
        </button>
      )}
    </div>
  )
}