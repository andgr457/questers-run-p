import GameModalFull from '../modals/GameModalFull';
import GameList from '../ui/list/GameList';
import type { GameEvents } from '../../engine/event-bus/types/GameEvent.types';
import { QUEST_GQ_01_TIMER_01 } from '../../entities/quest/data/quest/QuestGroup01Quests.data';
import { gameEventBus } from '../../engine/event-bus/GameEventBus';

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface DebugItem {
  title: string
  description: string
  event: GameEvents
}

export default function ViewDebug(props: Props) {
  const {
    isOpen,
    onClose
  } = props

  const resetEverything = () => {
    localStorage.clear()
    window.location.reload()
  }

  const emitEvent = (event: GameEvents) => {
    gameEventBus.emit(event)
  }

  const entities: DebugItem[] = [
    {
      title: 'Player Created',
      description: 'Emit a player:created event. Will overwrite existing data.',
      event: {
        type: 'player:save',
        duration: 5000,
        meta: {
          player: {
            id: crypto.randomUUID(),
            name: 'debug-profile',
            characterTokens: 1,
            gold: 0,
            level: 1,
            xp: 0,
            xpNextLevel: 100
          }
        }
      }
    },
    {
      title: 'Timer Activity 5s',
      description: 'Start and monitor an activity:start game event.',
      event: {
        type: 'activity:start',
        duration: 5000,
        activityId: crypto.randomUUID(),
        activityType: 'questing',
        meta: {
          quest: QUEST_GQ_01_TIMER_01
        }
      }
    }
  ]

  return <GameModalFull
    backdropHides={false}
    isOpen={isOpen}
    onClose={onClose}
    title={`Quester's Run Debug`}
    closeButton={true}
  >
    <div>
      <button className='button-basic gold-outline' onClick={resetEverything}>
        CLEAR ALL DATA
      </button>
    </div>
    <GameList<DebugItem> 
      actions={[
        {
          name: 'Emit',
          fn: (item: DebugItem) => {emitEvent(item.event)}
        }
      ]}
      entities={entities}
      getEntityContent={(entity) => {
        return <div>
          <div>{entity.title}</div>
          <div>{entity.description}</div>

        </div>
      }}
    />
  </GameModalFull>
}