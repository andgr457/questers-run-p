import type { Character } from '../../../interfaces/characters/Character.types'
import type { Quest, QuestGroup, QuestProgress } from '../../../interfaces/quests/Quests.types'
import './CharacterQuests.css'
import CharacterQuest from './CharacterQuest'
import { useEffect, useRef, useState } from 'react'
import { QuestService } from '../../../services/quests/QuestService'
import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import type { Item } from '../../../interfaces/items/Item.types'
import type { Inventory } from '../../../interfaces/inventories/Inventory.types'

interface CharacterQuestsProps {
  character: Character
  characterQuestProgressItems: QuestProgress[]
  quests: Quest[]
  questGroups: QuestGroup[]
  characterInventories: Inventory[]
}

export interface QuestWithQuestProgress {
  quest: Quest
  questGroup: QuestGroup | undefined
  questProgress: QuestProgress | undefined
  canTakeQuest: boolean
  canCompleteQuest: boolean
  questRequirementsAchievements: Achievement[]
  questRequirementsItems: Item[]
  questRequirementsQuests: Quest[]
}

export default function CharacterQuests(props: CharacterQuestsProps){
  const {
    character,
    characterQuestProgressItems,
    questGroups,
    quests,
    characterInventories
  } = props

  const [questsWithProgress, setQuestsWithProgress] = useState<QuestWithQuestProgress[]>([])

    
  if(!character || !questGroups || !quests){
    return null
  }

  const dataRef = useRef({
    character,
    questGroups,
    quests,
    characterQuestProgressItems,
    characterInventories
  });

  useEffect(() => {
    dataRef.current = {
      character,
      questGroups,
      quests,
      characterQuestProgressItems,
      characterInventories
    };
  }, [character, questGroups, quests, characterQuestProgressItems, characterInventories]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const {
        character,
        questGroups,
        quests,
        characterQuestProgressItems,
        characterInventories
      } = dataRef.current;

      if (!character || !questGroups || !quests) return;

      const questService = new QuestService();
      const progress = await questService.getQuestsWithQuestProgress(
        character,
        quests,
        questGroups,
        characterQuestProgressItems,
        characterInventories
      )
      setQuestsWithProgress(progress)
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  return <div className='quests-main'>
      <div className='header-2'>
        Quests
      </div>
      {!questsWithProgress || questsWithProgress.length === 0 && <div>
        Loading...
        </div>}
      {questsWithProgress && questsWithProgress.length > 0 && <div className='quests-groups'>
        {questGroups.map(qg => {
          const relatedQuests = questsWithProgress.filter(qwp => qwp?.questGroup?.id === qg.id)
          const completedAmount = relatedQuests.filter(rq => rq.questProgress?.status === 'complete')
          return <div className='quest-group'>
            <div className='quest-group-header'>
              <div className='header-1'>
                {qg?.title}
              </div>
              <div className='quest-group-header-count'>
                {completedAmount.length} / {relatedQuests.length} Complete
              </div>
              <div className='quest-group-header-description'>
                {qg?.description}
              </div>
            </div>
            <div className='quest-items'>
              {relatedQuests?.map(q => {
                return <CharacterQuest questWithProgress={q} character={character} />
              })}
            </div>
          </div>
        })}
        
      </div>}
    </div>
}