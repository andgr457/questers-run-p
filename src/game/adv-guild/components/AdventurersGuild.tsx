import { useState } from 'react';
import { useManagedCharacter } from '../../../engine/character/hooks/useManagedCharacters';
import { useCharacterQuests } from '../../../engine/quest/hooks/useCharacterQuests';
import { GAME_LOCATIONS } from '../../../entity/location/data/Location.data';
import { GAME_QUESTS } from '../../../entity/quest/data/Quest.data';
import GamePanel from '../../../ui/panel/GamePanel';
import GamePanelSection from '../../../ui/panel/GamePanelSection';
import type { QuestEntity } from '../../../entity/quest/types/QuestEntity.types';
import AdventurersGuildClerk from './clerk/AdventurersGuildClerk';
import AdventurersGuildQuestBoard from './quest-board/AdventurersGuildQuestBoard';
import styles from './AdventurersGuild.module.css'
import { characterRuntimeService } from '../../../engine/character/CharacterRuntimeService';
import { eventBus } from '../../../engine/event/EventBus';

export type AdventurersGuildMode = 'main'
  | 'quest_board'
  | 'quest_detail'

export default function AdventurersGuild(){
  const [mode, setMode] = useState<AdventurersGuildMode>('main')
  const [viewQuest, setViewQuest] = useState<QuestEntity | undefined>(undefined)

  const {managedCharacter} = useManagedCharacter()
  const {characterQuests} = useCharacterQuests()
  const currentLocation = GAME_LOCATIONS.find(l => l.id === managedCharacter?.locationId)
  const guildQuests = GAME_QUESTS.filter(q => currentLocation?.questIds?.includes(q.id))
  
  if(currentLocation?.type !== 'adv_guild' || !managedCharacter){
    return <GamePanel
      title={currentLocation?.name ?? ''}
      currentScreenName=''
    >
      <GamePanelSection
        actions={[
          {
            name: 'Character Manager',
            fn: () => {
              eventBus.emit({
                id: crypto.randomUUID(),
                type: 'world:mode:change',
                meta: {
                  worldMode: 'character_manage',
                  worldModePrevious: 'adv_guild'
                }
              })
            }
          }
        ]}
        actionsLocation='top'
      >
        <div className={styles.wrapper}>
          <div className={styles.title}>
            {characterRuntimeService.getManagingCharacter()?.name} is not currently at an Adventurer's Guild...
          </div>
        </div>
      </GamePanelSection>
    </GamePanel>
  }

  return <>
  {mode === 'main' && <AdventurersGuildClerk
    currentLocation={currentLocation}
    setMode={setMode}
    activeQuest={characterQuests[managedCharacter.id]}
  />}
  {mode === 'quest_detail' && viewQuest && <GamePanel
    title={`${viewQuest.title}`}
    currentScreenName=''
  >
    <GamePanelSection
      actions={[]}
      actionsLocation='top'
      onBack={() => {
        setViewQuest(undefined)
        setMode('quest_board')
      }}
      onBackLabel={'Quest Board'}
    >
      <div>TODO</div>
    </GamePanelSection>
  </GamePanel>}
  {mode === 'quest_board' && <AdventurersGuildQuestBoard 
    currentLocation={currentLocation}
    guildQuests={guildQuests}
    setMode={setMode}
    setViewQuest={setViewQuest}
  />}
  </>
}