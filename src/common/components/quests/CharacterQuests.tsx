import { DateTime } from 'luxon'
import type { Character, Stat } from '../../../interfaces/characters/Character.types'
import type { Quest, QuestGroup, QuestProgress } from '../../../interfaces/quests/Quests.types'
import './CharacterQuests.css'
import CharacterQuest from './CharacterQuest'
import { useEffect, useRef, useState } from 'react'
import { QuestService } from '../../../services/quests/QuestService'

interface CharacterQuestsProps {
  character: Character
  characterQuestProgressItems: QuestProgress[]
  quests: Quest[]
  questGroups: QuestGroup[]
}

export interface QuestWithQuestProgress {
  quest: Quest
  questGroup: QuestGroup | undefined
  questProgress: QuestProgress | undefined
  canTakeQuest: boolean
  cannotTakeReasons: string
}

export default function CharacterQuests(props: CharacterQuestsProps){
  const {
    character,
    characterQuestProgressItems,
    questGroups,
    quests
  } = props

  const [questsWithProgress, setQuestsWithProgress] = useState<QuestWithQuestProgress[]>([])


  // let anyQuestInProgress = false
  // let cannotTakeReasons = ''
  // const questsWithProgress: QuestWithQuestProgress[] = []
  // quests.forEach(q => {
    
  //   const progress = characterQuestProgressItems?.find(qp => qp.questId === q.id)
  //   if(progress && progress.status === 'in-progress'){
  //     anyQuestInProgress = true
  //     cannotTakeReasons = 'Another quest is already in progress.'
  //   }
  //   const group = questGroups.find(qg => qg.id === q.groupId)
    
  //   let canTake = !anyQuestInProgress && character.level >= q.requiredLevel
  //   if(canTake === true){
  //     if(character.level < q.requiredLevel){
  //       canTake = false
  //       cannotTakeReasons = `"${character.name}" must be level "${q.requiredLevel}" or above.`
  //     }
  //   }
  //   if(canTake === true){
  //     for(const propertyName of Object.getOwnPropertyNames(q.requiredStats)){
  //       //@ts-ignore
  //       const characterStat: Stat = character.stats[propertyName]
  //       //@ts-ignore
  //       const questStat: Stat = q.requiredStats[propertyName]
  //       if(characterStat.value < questStat.value){
  //         canTake = false
  //         cannotTakeReasons += ` "${characterStat.name}" must be "${questStat.value}" or above. `
  //       }
  //     }
  //   }
  //   if(canTake === true && q.requiredQuestId){
  //     const requiredQuestProgress = characterQuestProgressItems.find(qp => qp.questId === q.requiredQuestId && qp.status === 'complete')
  //     if(!requiredQuestProgress){
  //       canTake = false
  //       const requiredQuest = quests.find(quest => quest.id === q.requiredQuestId)
  //       cannotTakeReasons = `"${requiredQuest?.title}" quest must be completed before starting this.`
  //     }
  //   }

  //   const mergeItem: QuestWithQuestProgress = {
  //     quest: q,
  //     questGroup: group,
  //     questProgress: progress,
  //     canTakeQuest: canTake,
  //     cannotTakeReasons
  //   }
  //   questsWithProgress.push(mergeItem)
  // })
    
  if(!character || !questGroups || !quests){
    return null
  }

  const dataRef = useRef({
    character,
    questGroups,
    quests,
    characterQuestProgressItems
  });

  useEffect(() => {
    dataRef.current = {
      character,
      questGroups,
      quests,
      characterQuestProgressItems
    };
  }, [character, questGroups, quests, characterQuestProgressItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      const {
        character,
        questGroups,
        quests,
        characterQuestProgressItems
      } = dataRef.current;

      if (!character || !questGroups || !quests) return;

      const questService = new QuestService();

      setQuestsWithProgress(
        questService.getQuestWithQuestProgress(
          character,
          quests,
          questGroups,
          characterQuestProgressItems
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  return <div className='quests-main'>
      <div className='header-2'>
        Quests
      </div>
      <div className='page-sections'>
        {questGroups.map(qg => {
          const relatedQuests = questsWithProgress.filter(qwp => qwp?.questGroup?.id === qg.id)
          console.log(relatedQuests)
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
        
      </div>
    </div>
}