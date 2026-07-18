import { useEffect, useState } from 'react';
import GameListWrapper from '../../ui/list/GameListWrapper';
import GamePanel from '../../ui/panel/GamePanel';
import DebugEventList from './debug-event/components/list/DebugEventList';
import type { SettingsListUI, SettingsListItemUI, SettingsMode } from './types/SettingsPanel.types';
import { GAME_SETTINGS_MODE_NAMES } from './utils/SettingsPanel.utils';
import SettingsPanelListItem from './SettingsPanelListItem';
import ResetEverything from './reset/ResetEverything';
import { eventBus } from '../../engine/event/EventBus';
import { eventDebugRuntimeService } from '../../engine/event/EventDebugRuntimeService';
import { GAME_EVENT_BUS_DEBUG_RECORDING_TYPES } from '../../engine/event/utils/EventBus.utils';

export default function SettingsPanel(){
  const [mode, setMode] = useState<SettingsMode>('main')
  const [recordingDetail, setRecordingDetail] = useState(eventDebugRuntimeService.getRecordingDetail())

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(GAME_EVENT_BUS_DEBUG_RECORDING_TYPES.includes(event.type)){
        setRecordingDetail(eventDebugRuntimeService.getRecordingDetail())
      }
    })
    return unsub
  }, [])

  const lists: SettingsListUI[] = [
    
    
  ]
  if(recordingDetail.isDebugMode){
    lists.push({
      title: 'debug',
      description: <></>,
      items: [
        {
          title: 'events',
          description: <>Execute game events to troubleshoot.</>,
          mode: 'debug_events'
        },
        {
          title: 'ui',
          description: <>View various ui elements to troubleshoot.</>,
          mode: 'debug_ui'
        }
      ]
    })
  }

  lists.push({
      title: 'reset',
      description: <></>,
      items: [
        {
          title: 'everything',
          description: <>Clear entire game data for this site.</>,
          mode: 'reset_everything'
        }
      ]
    })

  return (
    <>
      <GamePanel
        title='settings'
        currentScreenName={GAME_SETTINGS_MODE_NAMES[mode]}
      >
        <div className='game-panel-section-actions'>
          <div className='game-panel-section-action'>
            <button 
              className={`button ${recordingDetail.isDebugMode ? 'button selected' : 'button dark'}`}
              onClick={() => {
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'event:debug:mode',
                  meta: {
                    isDebugMode: !recordingDetail.isDebugMode
                  }
                })
              }}
            >
              DEBUG MODE {recordingDetail.isDebugMode ? 'ON' : 'OFF'}
            </button>
          </div>

        </div>
        {mode === 'debug_events' && (
          <DebugEventList setSettingsMode={setMode} />
        )}
        {mode === 'reset_everything' && (
          <ResetEverything setSettingsMode={setMode} />
        )}
        {mode === 'main' && (
          lists.map(l => {

            return <GameListWrapper<SettingsListItemUI>
              actions={[]}
              entities={l.items}
              getEntityContent={(entity) => {
                return <SettingsPanelListItem 
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

      </GamePanel>
    </>
  )
}