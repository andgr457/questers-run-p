import { formatDateFromMillis } from '../../../../../engine/clock/utils/formatTimeRemaining'
import { eventBus } from '../../../../../engine/event/EventBus'
import { eventDebugRuntimeService } from '../../../../../engine/event/EventDebugRuntimeService'
import type { EventBusLog, GameEventType } from '../../../../../engine/event/types/EventBus.types'
import type { CharacterEntity } from '../../../../../entity/character/types/CharacterEntity.types'
import type { PlayerEntity } from '../../../../../entity/player/types/PlayerEntity.types'
import GamePanelSection from '../../../../../ui/panel/GamePanelSection'
import DetailRow from '../../../../detail/DetailRow'
import type { DebugEventsMode } from '../../types/DebugEvents.types'

interface Props {
  recordingDetail: any
  player: PlayerEntity
  characters: CharacterEntity[]
  setRelatedEvents: (eventLogs: EventBusLog[]) => void
  setMode: (mode: DebugEventsMode) => void
}

export default function DebugEventRecording(props: Props){
  const {
    recordingDetail,
    setMode,
    setRelatedEvents,
    characters,
    player,
  } = props

  let lastRecordingStartDateFormatted = ''
  let lastRecordingEndDateFormatted = ''
  if(recordingDetail.lastStartDate){
    lastRecordingStartDateFormatted = formatDateFromMillis(recordingDetail.lastStartDate)
  }
  if(recordingDetail.lastEndDate){
    lastRecordingEndDateFormatted = formatDateFromMillis(recordingDetail.lastEndDate)
  }
  return <GamePanelSection
    onBack={(() => setMode('main'))}
    onBackLabel='Event Categories'
    actions={[
      {
        name: recordingDetail.isRecording ? 'STOP' : 'START',
        className: `button ${recordingDetail.isRecording ? 'danger' : 'success'}`,
        fn: () => {
          let type: GameEventType = 'event:debug:recording:start'
          if(recordingDetail.isRecording){
            type = 'event:debug:recording:stop'
          }
          eventBus.emit({
            id: crypto.randomUUID(),
            type
          })
        }
      },
      {
        name: 'Clear Recorded Events',
        className: 'button gold',
        fn: () => {
          eventDebugRuntimeService.clearHistory()
        }
      }
    ]}
    title='Global Event Recording'
    expandable={false}
    description={<>
        While recording, this keeps track of all game events as well as 
        any manually triggered below. You can come back to this screen to view new event logs 
        so long as recording has been started.
        <br/><br/>
        Manually triggered events below will only keep track of events while this window is open.
    </>}
  >  
    <div className='deta'>
      <DetailRow field='State' value={recordingDetail.isRecording ? 'Recording' : 'Stopped'} />
      <DetailRow onRowClick={() => {
        if(!recordingDetail.history.length) return

        setRelatedEvents(recordingDetail.history)
        setMode('debug_event_logs')
      }} field='Recorded Event(s)' value={recordingDetail.history.length.toFixed(0)} />
      <DetailRow field='Last Started' value={lastRecordingStartDateFormatted} />
      <DetailRow field='Last Stopped' value={lastRecordingEndDateFormatted} />
      <DetailRow field='Player' value={player ? 'Created' : ''} />
      <DetailRow field='Character(s)' value={characters?.length ? `${characters.length}` : '0'} />
    </div>
  </GamePanelSection>
}