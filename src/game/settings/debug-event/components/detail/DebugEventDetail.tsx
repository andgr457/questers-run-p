import { formatDateFromMillis } from '../../../../../engine/clock/utils/formatTimeRemaining'
import type { EventBusLog } from '../../../../../engine/event/types/EventBus.types'
import GamePanelSection from '../../../../../ui/panel/GamePanelSection'
import DetailRow from '../../../../detail/DetailRow'
import { flattenMeta } from '../../utils/GameEvents.utils'

interface Props {
  entity: EventBusLog
}
export default function DebugEventDetail(props: Props){
  const {
    entity
  } = props
  
  const formattedDate = formatDateFromMillis(entity.date)
  const metaRows = flattenMeta(entity.event.meta)

  return <GamePanelSection
    actions={[]}
    description={<>
    
    </>}
    title={`Debug Event Detail`}
  >
    <div className='detail-rows'>
      <DetailRow field={'Type'} value={entity.event.type} />
      <DetailRow field={'Date'} value={formattedDate} />
      <DetailRow field={'ID'} value={entity.event.id} />
      <DetailRow field={'Parent Event ID'} value={entity.event.parentEventId as string} />
      <DetailRow field={'Continuous'} value={entity.event.continuous as any} />
      <DetailRow field={'Duration'} value={entity.event.duration as any} />
    </div>
    {metaRows && metaRows.length > 0 && <div className='detail-rows'>
      <div className='game-list-item-header'>
        Meta
      </div>
      {metaRows.map(row => (
        <DetailRow
          key={row.field}
          field={row.field}
          value={row.value as string}
        />
      ))}
    </div>}
  </GamePanelSection>
}