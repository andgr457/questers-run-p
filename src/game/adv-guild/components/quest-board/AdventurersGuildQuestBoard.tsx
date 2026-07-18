import { useManagedCharacter } from '../../../../engine/character/hooks/useManagedCharacters';
import { useCharacterQuests } from '../../../../engine/quest/hooks/useCharacterQuests';
import { useTutorial } from '../../../../engine/tutorial/hooks/useTutorial';
import type { LocationEntity } from '../../../../entity/location/types/LocationEntity.types';
import QuestList, { type QuestWithActions } from '../../../../entity/quest/components/list/QuestList';
import type { QuestEntity } from '../../../../entity/quest/types/QuestEntity.types';
import { useConfirm } from '../../../../ui/modal/providers/ConfirmProvider';
import GamePanel from '../../../../ui/panel/GamePanel';
import GamePanelSection from '../../../../ui/panel/GamePanelSection';
import { ContextMenuIcon } from '../../../context-menu/data/ContextMenuIcon.data';
import type { AdventurersGuildMode } from '../AdventurersGuild';

interface Props {
  currentLocation: LocationEntity
  guildQuests: QuestEntity[]
  setViewQuest: (quest: QuestEntity | undefined) => void
  setMode: (mode: AdventurersGuildMode) => void
}

export default function AdventurersGuildQuestBoard(props: Props) {
  const {
    guildQuests,
    setMode,
    setViewQuest,
    currentLocation
  } = props
  const {tutorial} = useTutorial()
  const {characterQuests} = useCharacterQuests()
  const {managedCharacter} = useManagedCharacter()
  const {showConfirm} = useConfirm()

  const questsWithActions: QuestWithActions[] = []
  
  for(const quest of guildQuests){
    if(!managedCharacter) break

    let isTutorial = false
    if(tutorial){
      const foundHint = tutorial.hints.find(h => h.uiPath?.includes(currentLocation.type))
      if(foundHint){
        isTutorial = true
      }
    }

    const characterQuest = characterQuests[managedCharacter?.id ?? '']
    let characterCanTakeQuest = true
    if(typeof characterQuest !== 'undefined'){
      characterCanTakeQuest = false
    }
    if(quest.requirements.start.some(r => r.level)){
      const levelReq = quest.requirements.start.find(r => r.level)
      if(levelReq?.level){
        if(managedCharacter.level < levelReq?.level){
          characterCanTakeQuest = false
        }
      }
    }
    if(quest.requirements.start.some(r => r.stamina)){
      const staminaReq = quest.requirements.start.find(r => r.stamina)
      if(staminaReq?.stamina && managedCharacter?.stamina){
        if(managedCharacter.stamina < staminaReq.stamina){
          characterCanTakeQuest = false
        }
      }
    }

    questsWithActions.push({
      quest,
      actions: [
        {
          title: characterCanTakeQuest ? 'Take Quest' : 'Quest Requirements Not Met',
          icon: characterCanTakeQuest ? ContextMenuIcon.start : ContextMenuIcon.prohibited,
          isTutorial: characterCanTakeQuest && isTutorial,
          fn: async (entity: QuestEntity) => {
            if(!characterCanTakeQuest){
              await showConfirm({
                isYesNo: false,
                title: 'Quest Locked',
                message: `${managedCharacter?.name} does not meet the requirements to take the quest "${entity.title}".`,
              })
              return
            }
          }
        },
        {
          title: 'View',
          icon: ContextMenuIcon.eye,
          fn: (entity: QuestEntity) => {
            setViewQuest(entity)
            setMode('quest_detail')
          }
        }
      ]
    })
  }
  
  if(!managedCharacter) return null

  return <GamePanel
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
      <QuestList questsWithActions={questsWithActions ? questsWithActions : []} />
    </GamePanelSection>
  </GamePanel>
}