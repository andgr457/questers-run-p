import { useEffect, useState } from 'react';
import GameListWrapper from '../../ui/list/GameListWrapper';
import GamePanel from '../../ui/panel/GamePanel';
import DebugEventList from './debug-event/components/list/DebugEventList';
import type { SettingsListUI, SettingsListItemUI, SettingsMode } from './types/SettingsPanel.types';
import { GAME_SETTINGS_MODE_NAMES } from './utils/SettingsPanel.utils';
import SettingsPanelListItem from './SettingsPanelListItem';
import ResetEverything from './reset/ResetEverything';
import { eventBus } from '../../engine/event/EventBus';

export default function SettingsPanel(){
  const [mode, setMode] = useState<SettingsMode>('main')
  

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type !== 'mode:settings') return
      setMode(event.meta.mode as SettingsMode)
    })
    return unsub
  }, [])

  const lists: SettingsListUI[] = [
    {
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
    },
    {
      title: 'reset',
      description: <></>,
      items: [
        {
          title: 'everything',
          description: <>Clear entire game data for this site.</>,
          mode: 'reset_everything'
        }
      ]
    }
  ]

  return (
    <>
      <GamePanel
        title='settings'
        currentScreenName={GAME_SETTINGS_MODE_NAMES[mode]}
        onBackTo={() => {
          setMode('main')
        }}
      >
        {mode === 'debug_events' && (
          <DebugEventList  />
        )}
        {mode === 'reset_everything' && (
          <ResetEverything />
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