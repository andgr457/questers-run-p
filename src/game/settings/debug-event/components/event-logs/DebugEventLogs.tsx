import { useState } from 'react'
import type { EventBusLog, GameEventType } from '../../../../../engine/event/types/EventBus.types'
import GamePanelSection from '../../../../../ui/panel/GamePanelSection'
import type { DebugEventsMode } from '../../types/DebugEvents.types'
import DebugEventDetail from '../detail/DebugEventDetail'
import type { SortDirection } from '../../../../types/Game.types'

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
  const [filterType, setFilterType] = useState<GameEventType | undefined>(undefined)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  
  const onBackFn = onBack ? onBack : setMode ? () => {setMode(setModeTo as DebugEventsMode)} : undefined
  const uniqueTypes: GameEventType[] = []
  for(const log of eventLogs){
    if(!uniqueTypes.includes(log.event.type)){
      uniqueTypes.push(log.event.type)
    }
  }

  const logsFiltered = !filterType ? eventLogs : eventLogs.filter(l => l.event.type === filterType)
  const logsSorted = logsFiltered.sort((a, b) => {
    if(sortDirection === 'desc'){
      return b.date - a.date
    } else {
      return a.date - b.date
    }
  })
  return <GamePanelSection
    actions={[]}
    title={title}
    description={<>
      View and filter emitted events.
    </>}
    expandable={true}
    onBack={onBackFn as any}
    onBackLabel={setModeToLabel}
  >
    <div>
      <div className='filter-list'>
        <div>
          <button
            className='button gold'
            onClick={() => {
              if(sortDirection === 'desc'){
                setSortDirection('asc')
              } else {
                setSortDirection('desc')
              }
            }}
          >
            Sort {sortDirection}
          </button>
        </div>

      </div>

      <div className='filter-list'>
        {uniqueTypes.map(t => {
          return <div>
            <button
              className={`button ${filterType === t ? 'gold' : 'dark'}`}
              onClick={() => {
                if(filterType === t){
                  setFilterType(undefined)
                } else {
                  setFilterType(t)
                }
              }}
            >
              {t}
            </button>
          </div>
        })}
      </div>
    </div>
    {logsSorted.map((log) => {
      return <DebugEventDetail entity={log} />
    })}
  </GamePanelSection>
}