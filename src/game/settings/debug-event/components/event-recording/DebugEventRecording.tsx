import { useEffect, useState } from 'react'
import { formatDateFromMillis } from '../../../../../engine/clock/utils/formatTimeRemaining'
import { eventBus } from '../../../../../engine/event/EventBus'
import { eventDebugRuntimeService } from '../../../../../engine/event/EventDebugRuntimeService'
import type { GameEventType } from '../../../../../engine/event/types/EventBus.types'
import GamePanelSection from '../../../../../ui/panel/GamePanelSection'
import DetailRow from '../../../../detail/DetailRow'
import type { DebugEventsMode } from '../../types/DebugEvents.types'
import { GAME_EVENT_BUS_DEBUG_RECORDING_TYPES } from '../../../../../engine/event/utils/EventBus.utils'
import DebugEventLogs from '../event-logs/DebugEventLogs'

interface Props {
  title?: string
  setMode?: (mode: DebugEventsMode) => void
}

export default function DebugEventRecording(props: Props){
  const {
    title,
    setMode,
  } = props

  const [recordingDetail, setRecordingDetail] = useState(eventDebugRuntimeService.getRecordingDetail())

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!GAME_EVENT_BUS_DEBUG_RECORDING_TYPES.includes(event.type)) return
      setRecordingDetail(eventDebugRuntimeService.getRecordingDetail())
    })
    return unsub
  }, [])

  let lastRecordingStartDateFormatted = ''
  let lastRecordingEndDateFormatted = ''
  if(recordingDetail.lastStartDate){
    lastRecordingStartDateFormatted = formatDateFromMillis(recordingDetail.lastStartDate)
  }
  if(recordingDetail.lastEndDate){
    lastRecordingEndDateFormatted = formatDateFromMillis(recordingDetail.lastEndDate)
  }
  const onBackFn = setMode ? () => {setMode('main')} : undefined
  const onBackLabel = setMode ? 'Event Categories' : ''
  return <GamePanelSection
    onBack={onBackFn}
    onBackLabel={onBackLabel}
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
        className: 'button',
        fn: () => {
          eventDebugRuntimeService.clearHistory()
        }
      }
    ]}
    title={title}
    expandable={false}
    description={<>
        While recording, this keeps track of all game events as well as 
        any manually triggered below. You can come back to this screen to view new event logs 
        so long as recording has been started.
    </>}
  >  
    <div className='detail-rows'>
      <DetailRow field='State' value={recordingDetail.isRecording ? 'Recording' : 'Stopped'} />
      <DetailRow onRowClick={() => {
        if(!recordingDetail.history.length) return

        if(setMode){
          setMode('debug_event_logs')
        }
      }} field='Recorded Event(s)' value={recordingDetail.history.length.toFixed(0)} />
      <DetailRow field='Last Started' value={lastRecordingStartDateFormatted} />
      <DetailRow field='Last Stopped' value={lastRecordingEndDateFormatted} />
    </div>
    <DebugEventLogs 
      eventLogs={eventDebugRuntimeService.getRecordingDetail().history}
      setModeToLabel='World'
    />
  </GamePanelSection>
}