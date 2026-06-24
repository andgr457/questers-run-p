import type { GameEventType } from '../../../../../engine/event/types/EventBus.types'
import GameList from '../../../../../ui/list/GameList'
import GamePanelSection from '../../../../../ui/panel/GamePanelSection'
import type { DebugEventsMode, GroupEventItem } from '../../types/DebugEvents.types'
import DebugEventListItem from '../list/DebugEventListItem'

interface Props {
  title: string
  groupEventItems: GroupEventItem[] | undefined
  eventIds: Record<GameEventType, string[]>
  handleShowLogs: (eventType: GameEventType) => void
  setMode: (mode: DebugEventsMode) => void
}

export default function DebugPlayerEvents(props: Props){
  const {
    title,
    groupEventItems,
    handleShowLogs,
    eventIds,
    setMode,
  } = props

  return <GamePanelSection
    onBack={() => setMode('main')}
    onBackLabel='Event Categories'
    actions={[]}
    title={title}
    expandable={false}
    description={<>
      Player event debugging.
    </>}
  >  
    <GameList<GroupEventItem>
      actions={[
        {
          name: 'Emit',
          fn: (entity) => {
            entity?.emit?.()
          }
        },
        {
          name: 'Session Logs',
          getName: (entity) => {
            return `Session Logs [${eventIds[entity.type]?.length ?? 0}]`
          },
          fn: (entity) => {
            handleShowLogs(entity?.type as GameEventType)
          }
        }
      ]}
      entities={groupEventItems as GroupEventItem[]}
      getEntityContent={(entity) => {
        return <DebugEventListItem entity={entity} />
      }}
      onCardClick={(entity) => {
        entity?.emit?.()
      }}
    />
  </GamePanelSection>
}