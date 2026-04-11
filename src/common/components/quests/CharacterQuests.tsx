import type { Character } from '../../../interfaces/characters/Character.types'
import type { Quest, QuestGroup, QuestProgress } from '../../../interfaces/quests/Quests.types'
import './CharacterQuests.css'
import CharacterQuest from './CharacterQuest'
import { useEffect, useRef, useState } from 'react'
import { QuestService } from '../../../services/quests/QuestService'
import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import type { Item } from '../../../interfaces/items/Item.types'
import type { Inventory, InventoryTransaction } from '../../../interfaces/inventories/Inventory.types'

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
  questRequirementsInventoryTxns: InventoryTransaction[]
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

  const currentQuestProgress = questsWithProgress.find(qwp => qwp.questProgress)
  const currentQuest = quests.find(q => q.id === currentQuestProgress?.questProgress?.questId)
  return <div className=''>

      {!questsWithProgress || questsWithProgress.length === 0 && <div style={{textAlign: 'center', fontSize: 'larger'}}>
        Loading...
        </div>}
      
      <div className='header-2'>
        Current Quest
      </div>
      {!questsWithProgress || questsWithProgress.length === 0 && <div className='quest-group'>
        <div className='quest-group-header'>
          <div className='quest-group-header-description'>
            Not currently on a quest.
          </div>
        </div>
        
      </div>}
      {questsWithProgress && questsWithProgress.length > 0 && <div className='quests-groups'>
        {currentQuestProgress && currentQuest && <div className='quest-group'>
            <div className='quest-group-header'>              
              <div className='quest-group-header-description'>
                {currentQuest?.description}
              </div>
            </div>
            <div className='quest-items'>
              <CharacterQuest questWithProgress={currentQuestProgress} />
            </div>
          </div>}
        <div className='header-2'>
          Quests
        </div>
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
                return <CharacterQuest questWithProgress={q} />
              })}
            </div>
          </div>
        })}
        
      </div>}
    </div>
}