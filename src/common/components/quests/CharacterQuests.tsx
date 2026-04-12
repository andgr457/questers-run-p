import type { Character } from '../../../interfaces/characters/Character.types'
import type { Quest, QuestGroup, QuestProgress } from '../../../interfaces/quests/Quests.types'
import './CharacterQuests.css'
import CharacterQuest from './CharacterQuest'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  showAllQuests: boolean
  showCurrentQuest: boolean
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

interface GroupSetting {
  groupId: string
  show: boolean
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
  const [showAllQuests, setShowAllQuests] = useState(false)
  const [groupSettings, setGroupSettings] = useState<GroupSetting[]>([])
    
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

  const handleToggleGroupQuests = useCallback((groupId: string, value: boolean) => {
    const newGroupSettings: GroupSetting[] = []
    const exists = groupSettings.find(gs => gs.groupId === groupId)
    if(!exists){
      newGroupSettings.push({
        groupId,
        show: value
      })
    } else {
      exists.show = value
      newGroupSettings.push(exists)
    }

    for(const groupSetting of groupSettings){
      newGroupSettings.push(groupSetting)
    }
    setGroupSettings(newGroupSettings)
  }, [groupSettings])

  const currentQuestProgress = questsWithProgress.find(qwp => qwp.questProgress)
  const currentQuest = quests.find(q => q.id === currentQuestProgress?.questProgress?.questId)

  if(props.showAllQuests === false && props.showCurrentQuest === false) return null
  return <div>

      {!questsWithProgress || questsWithProgress.length === 0 && <div style={{textAlign: 'center', fontSize: 'larger'}}>
        Loading...
        </div>}
      {props.showCurrentQuest === true && <div>
        <div className='quest-group-title second'>
          Current Quest
        </div>
        {!questsWithProgress || questsWithProgress.length === 0 && <div className='quest-group'>
          <div className='quest-group-header' >
            <div className='quest-group-header-description'>
              <div className='quest-item'>
                <div className='quest-item-description'>
                  {character.name} is not currently on a quest.
                </div>
              </div>
            </div>
          </div>
        </div>}
        {questsWithProgress && questsWithProgress.length > 0 && <div className='quests-groups'>
          {currentQuestProgress && currentQuest && <div className='quest-group'>
            <div className='quest-items'>
              <CharacterQuest questWithProgress={currentQuestProgress} />
            </div>
          </div>}
      </div>}

        {props.showAllQuests === true && <div>
          <div className='quest-group-title second' onClick={() => {setShowAllQuests(!showAllQuests)}}>
            <span className='quest-group-title-expander'>{showAllQuests === true ? 'HIDE' : 'SHOW'}</span> Quests
          </div>
          <div className={showAllQuests === true ? 'quest-groups open' : 'quest-groups'}>
            {showAllQuests === true && questGroups.map(qg => {
              const relatedQuests = questsWithProgress.filter(qwp => qwp?.questGroup?.id === qg.id)
              const completedAmount = relatedQuests.filter(rq => rq.questProgress?.status === 'complete')
              const groupSetting = groupSettings.find(gs => gs.groupId === qg.id)
              const showQuests = !groupSetting ? false : groupSetting.show === true

              return <div className={showQuests === true ? 'quest-group open' : 'quest-group'}>
                <div className='quest-group-header'>
                  <div className='quest-group-title' onClick={() => {handleToggleGroupQuests(qg.id, !showQuests)}}>
                    <span className='quest-group-title-expander'>{showQuests === true ? 'HIDE' : 'SHOW'}</span> {qg?.title}
                  </div>
                  <div className='quest-group-header-count'>
                    {completedAmount.length} / {relatedQuests.length} Complete
                  </div>
                  <div className='quest-group-header-description'>
                    {qg?.description}
                  </div>
                </div>
                {showQuests === true && <div className='quest-items'>
                  {relatedQuests?.map(q => {
                    return <CharacterQuest questWithProgress={q} />
                  })}
                </div>}
              </div>
            })}
          </div>
        </div>}
        
      </div>}
    </div>
}