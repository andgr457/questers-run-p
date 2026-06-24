import type { EventBusLog } from '../../../../../engine/event/types/EventBus.types'
import GamePanelSection from '../../../../../ui/panel/GamePanelSection'
import type { DebugEventsMode } from '../../types/DebugEvents.types'
import DebugEventDetail from '../detail/DebugEventDetail'

interface Props {
  title?: string
  eventLogs: EventBusLog[]
  onBack?: () => void
  setMode?: (mode: DebugEventsMode) => void
  setModeTo?: DebugEventsMode
  setModeToLabel?: string
}

export default function DebugEventLogs(props: Props){
  const {
    eventLogs,
    setMode,
    title,
    setModeTo,
    setModeToLabel,
    onBack
  } = props


  const onBackFn = onBack ? onBack : setMode ? () => {setMode(setModeTo as DebugEventsMode)} : undefined

  return <GamePanelSection
    actions={[]}
    description={<>
    
    </>}
    title={title}
    expandable={false}
    onBack={onBackFn as any}
    onBackLabel={setModeToLabel}
  >
    {eventLogs.map((log) => {
      return <DebugEventDetail entity={log} />
    })}
  </GamePanelSection>
}