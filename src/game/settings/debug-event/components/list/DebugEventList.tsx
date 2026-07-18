import { useState } from 'react'
import type { DebugEventsListItemUI, DebugEventsListUI, DebugEventsMode } from '../../types/DebugEvents.types'
import GameListWrapper from '../../../../../ui/list/GameListWrapper'
import DebugEventListActionItem from './DebugEventListActionItem'
import DebugEventRecording from '../event-recording/DebugEventRecording'
import GamePanelSection from '../../../../../ui/panel/GamePanelSection'
import type { SettingsMode } from '../../../types/SettingsPanel.types'

interface Props {
  setSettingsMode: (mode: SettingsMode) => void
}

export default function DebugEventList(props: Props) {
  const {
    setSettingsMode
  } = props
  const [mode, setMode] = useState<DebugEventsMode>('main')

  const lists: DebugEventsListUI[] = [
    {
      title: 'event categories',
      description: <>Troubleshoot and record various events by emitting test data and viewing the output.</>,
      items: [
        {
          title: 'global event recording',
          description: <>While recording has started, all game events will be tracked here until you leave, or refresh the site.</>,
          mode: 'global_event_recording'
        },
      ]
    }
  ]

  return (
    <>
      <GamePanelSection
        title=''
        onBack={() => {setSettingsMode('main')}}
        actions={[]}
        onBackLabel='Settings'
      >
        {mode === 'main' && (
          lists.map(l => {
            return <GameListWrapper<DebugEventsListItemUI>
              actions={[]}
              entities={l.items}
              getEntityContent={(entity) => {
                return <DebugEventListActionItem 
                  entity={entity}
                />
              }}
              onCardClick={(entity) => {
                setMode(entity.mode)
              }}
              title={l.title?.toLowerCase()}
            />
          })
        )}
        {mode === 'global_event_recording' && (
          <>
            <DebugEventRecording 
              setMode={setMode}
            />
          </>
        )}
      </GamePanelSection>
    </>
  )
}