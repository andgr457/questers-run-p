import GameList from '../../../../../ui/list/GameList'
import GamePanelSection from '../../../../../ui/panel/GamePanelSection'
import type { DebugEventsMode, GroupEventItem } from '../../types/DebugEvents.types'
import DebugEventListItem from '../list/DebugEventListItem'

interface Props {
  title: string
  groupEventItems: GroupEventItem[] | undefined
  setMode: (mode: DebugEventsMode) => void
}

export default function DebugEntityEvents(props: Props){
  const {
    title,
    groupEventItems,
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