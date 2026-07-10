import { useState } from 'react';
import { useManagedCharacter } from '../../../engine/character/hooks/useManagedCharacters';
import { useQuests } from '../../../engine/quest/hooks/useQuests';
import { useTutorial } from '../../../engine/tutorial/hooks/useTutorial';
import { GAME_LOCATIONS } from '../../../entity/location/data/Location.data';
import QuestList from '../../../entity/quest/components/list/QuestList';
import { GAME_QUESTS } from '../../../entity/quest/data/Quest.data';
import { useConfirm } from '../../../ui/modal/providers/ConfirmProvider';
import GamePanel from '../../../ui/panel/GamePanel';
import GamePanelSection from '../../../ui/panel/GamePanelSection';
import { ContextMenuIcon } from '../../context-menu/data/ContextMenuIcon.data';
import type { QuestEntity } from '../../../entity/quest/types/QuestEntity.types';
import AnimatedText from '../../../ui/text/animated-text/AnimatedText';
import styles from './AdventurersGuild.module.css'
import AdventurersGuildClerk from './clerk/AdventurersGuildClerk';

export type AdventurersGuildMode = 'main'
  | 'quest_board'
  | 'quest_detail'

export default function AdventurersGuild(){
  const [mode, setMode] = useState<AdventurersGuildMode>('main')
  const [viewQuest, setViewQuest] = useState<QuestEntity | undefined>(undefined)

  const {showConfirm} = useConfirm()
  const {tutorial} = useTutorial()
  const {managedCharacter} = useManagedCharacter()
  const {characterQuests} = useQuests()
  const currentLocation = GAME_LOCATIONS.find(l => l.id === managedCharacter?.locationId)
  const guildQuests = GAME_QUESTS.filter(q => currentLocation?.questIds.includes(q.id))
  
  if(!currentLocation || !managedCharacter){
    return null
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
  {mode === 'quest_board' && <GamePanel
      title='Quest Board'
      currentScreenName=''
    >
      <GamePanelSection
        title=''
        actions={[]}
        onBack={() => {
          setViewQuest(undefined)
          setMode('main')
        }}
        onBackLabel={'Front Desk'}
      >
        <QuestList questsWithActions={guildQuests.map(q => {
          let isTutorial = false
          if(tutorial){
            const foundHint = tutorial.hints.find(h => h.uiPath?.includes(currentLocation.type))
            if(foundHint){
              isTutorial = true
            }
          }
          
          const characterQuest = characterQuests[managedCharacter.id]
          let characterCanTakeQuest = true
          if(typeof characterQuest !== 'undefined'){
            characterCanTakeQuest = false
          }
          if(q.requirements.start.some(r => r.level)){
            const levelReq = q.requirements.start.find(r => r.level)
            if(levelReq?.level){
              if(managedCharacter.level < levelReq?.level){
                characterCanTakeQuest = false
              }
            }
          }
          if(q.requirements.start.some(r => r.stamina)){
            const staminaReq = q.requirements.start.find(r => r.stamina)
            if(staminaReq?.stamina){
              if(managedCharacter.stamina < staminaReq.stamina){
                characterCanTakeQuest = false
              }
            }
          }

          return {
            quest: q,
            actions: [
              {
                title: characterCanTakeQuest ? 'Take Quest' : 'Quest Requirements Not Met',
                icon: characterCanTakeQuest ? ContextMenuIcon.start : ContextMenuIcon.prohibited,
                isTutorial: characterCanTakeQuest && isTutorial,
                fn: async (entity) => {
                  if(!characterCanTakeQuest){
                    await showConfirm({
                      isYesNo: false,
                      title: 'Quest Locked',
                      message: `${managedCharacter.name} does not meet the requirements to take the quest "${entity.title}".`,
                    })
                    return
                  }
                }
              },
              {
                title: 'View',
                icon: ContextMenuIcon.eye,
                fn: (entity) => {
                  setViewQuest(entity)
                  setMode('quest_detail')
                }
              }
            ]
          }
        })} />
      </GamePanelSection>
    </GamePanel>}
  </>
}